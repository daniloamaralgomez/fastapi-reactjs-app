# System Topology Deep-Dive

This file contains the complete physical, structural, and behavioral diagrams detailing how our React + FastAPI architecture operates within AWS.

---

## 1. Ingress Sequencing Diagram

The following sequence highlights how an end-user client interacts with the frontend application assets and queries the backend data API.

```mermaid
sequenceDiagram
    autonumber
    actor User as Client Browser
    participant ALB as Application Load Balancer
    participant FE as ECS Fargate (Frontend Container)
    participant BE as ECS Fargate (Backend Container)

    User->>ALB: HTTP GET Request ([domain.com/](https://domain.com/))
    Note over ALB: Route matched: Default (/)
    ALB->>FE: Forward to Target Group (Port 80)
    FE-->>ALB: Return Index.html + Bundle Assets
    ALB-->>User: Deliver React App to Browser

    Note over User: React App executes relative API call (/api/v1/users)
    User->>ALB: HTTP POST/GET Request ([domain.com/api/v1/users](https://domain.com/api/v1/users))
    Note over ALB: Route matched: Path /api/*
    ALB->>BE: Forward to Target Group (Port 8000)
    BE-->>ALB: Return FastAPI JSON payload
    ALB-->>User: Securely transmit data response
```



## 2. System Context Diagram

The system context diagram illustrates how an external end-user interacts with the edge boundary of our AWS environment, and how traffic cleanly bridges into our virtual private network.

```mermaid
graph LR
    User([Client Browser]) -->|HTTPS: Port 443| ALB[Application Load Balancer]
    
    subgraph AWS [AWS Cloud Infrastructure Layer]
        ALB -->|Path: / | FE[ReactJS Frontend Service]
        ALB -->|Path: /api/* | BE[Python FastAPI Backend Service]
        
        FE -.->|Pull Image| ECR_FE[(ECR: Frontend Repo)]
        BE -.->|Pull Image| ECR_BE[(ECR: Backend Repo)]
    end

```

## 3. Component Diagram (Internal Layering and Interfaces)

This component layout models the decoupling of computing containers, interface boundaries, networking routes, and data ingestion targets inside the AWS VPC.

```mermaid
graph TB
    subgraph PublicSubnets [Public Subnets - Ingress Tier]
        ALB[Application Load Balancer]
    end

    subgraph PrivateSubnets [Private Subnets - Compute Tier]
        subgraph FE_Task [ECS Frontend Task]
            Nginx[Nginx Proxy Web Server]
            React[React Static Assets]
            Nginx -->|Serves| React
        end

        subgraph BE_Task [ECS Backend Task]
            FastAPI[FastAPI ASGI Server]
            PythonApp[Python Core App Logic]
            FastAPI -->|Executes| PythonApp
        end
    end

    subgraph Registries [Managed Registries]
        ECR[ECR Registry]
    end

    %% Inbound Connections
    Internet((Public Internet)) -->|Port 80/443| ALB
    
    %% ALB Forwarding
    ALB -->|HTTP Proxy Port 80| Nginx
    ALB -->|HTTP Proxy Port 8000| FastAPI
    
    %% ECR Pulls
    FE_Task -.->|Pulls Images| ECR
    BE_Task -.->|Pulls Images| ECR

    %% Relative path resolution note
    React -.->|Browser Runtime API Call via User Browser| Internet
```


## 5. System Diagram (Multi-AZ)

This diagram details the architecture across two separate Availability Zones (AZs).

```mermaid
graph TB
    Internet((Public Internet)) -->|Port 80/443| IGW[Internet Gateway]

    subgraph VPC [AWS Virtual Private Cloud - 10.0.0.0/16]
        IGW --> PublicRoute[Public Route Table]

        subgraph AZ1 [Availability Zone: us-east-1a]
            subgraph PubSub1 [Public Subnet - 10.0.1.0/24]
                ALB_Node1[ALB Ingress Node A]
            end
            subgraph PrivSub1 [Private Subnet - 10.0.10.0/24]
                FE_Task1[ECS Fargate: Frontend Task A]
                BE_Task1[ECS Fargate: Backend Task A]
            end
        end

        subgraph AZ2 [Availability Zone: us-east-1b]
            subgraph PubSub2 [Public Subnet - 10.0.2.0/24]
                ALB_Node2[ALB Ingress Node B]
            end
            subgraph PrivSub2 [Private Subnet - 10.0.11.0/24]
                FE_Task2[ECS Fargate: Frontend Task B]
                BE_Task2[ECS Fargate: Backend Task B]
            end
        end
    end

    %% Routing Associations
    PublicRoute --> PubSub1
    PublicRoute --> PubSub2

    %% Load Balancer Logic
    ALB_Node1 -->|Forward Port 80| FE_Task1
    ALB_Node1 -->|Forward Port 8000| BE_Task1
    ALB_Node2 -->|Forward Port 80| FE_Task2
    ALB_Node2 -->|Forward Port 8000| BE_Task2
```

## 5. Operational Container Security Topology

Every ECS task layer operates with independent security group boundaries. 
Security groups attached to containers block all ingress ports by default 
unless explicitly sourced from the active Application Load Balancer's security group identifier.

```mermaid
graph TD
    Public[Internet Traffic] -->|Port 80/443 Only| ALBSG[ALB Security Group]
    ALBSG -->|Port 80 Only| FESG[Frontend Task SG]
    ALBSG -->|Port 8000 Only| BESG[Backend Task SG]
    FESG -.->|BLOCKED| BESG
    Public -.->|BLOCKED| FESG
    Public -.->|BLOCKED| BESG
```
