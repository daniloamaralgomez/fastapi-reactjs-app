# AWS ECS Fargate Architecture Reference Manual

**Author:** Danilo Amaral
**Classification:** Technical Infrastructure Blueprint
**Target Environments:** Staging / Production

---

## 1. Executive Summary

This reference manual documents the AWS infrastructure architected to host our decoupled dual-stack web application (ReactJS frontend and Python FastAPI backend). 

To eradicate the classic "works on my machine" paradigm while maximizing security and reliability, the infrastructure layer transitions from a localized, non-isolated `docker-compose` setup to a secure, highly available, and serverless container topology leveraging **AWS ECS Fargate** and an **Application Load Balancer (ALB)**. 

### Key Architectural Standards Achieved:
* **Infrastructure as Code (IaC):** 100% declarative definitions using Terraform modules, preventing environment drift.
* **Zero-Maintenance Compute Tier:** Serverless Fargate tasks strip away the operational overhead of managing, scaling, or patching underlying EC2 virtual machines.
* **Blast-Radius Isolation:** Strict environment decoupling via isolated directory structures and independent remote state files.

---

## 2. Infrastructure Topology & Component Overview

The network topology distributes application compute resources globally across independent geographic availability zones to guarantee continuous up-time and automated failover capabilities.


### 2.1 Virtual Private Cloud (VPC) Subnet Segmentation
The infrastructure partitions the network space using a custom VPC into segregated routing layers:
* **Public Subnets (Ingress Tier):** Integrated with an **AWS Internet Gateway (IGW)**. These subnets are assigned public IP space and host the public endpoints of the Application Load Balancer.
* **Private Subnets (Compute Tier):** Isolated completely from inbound direct internet routing. This is where our ReactJS and FastAPI container instances execute. They are unreachable by malicious actors scanning the public web.

### 2.2 Core Component Responsibilities
* **AWS ALB:** Acts as the single point of entry for all client browsers. It handles SSL termination, client connection multiplexing, and dynamic application health inspections.
* **AWS ECR:** Houses our immutable, cryptographically secure Docker images. It runs automated vulnerability scanning profiles upon every image push.
* **AWS IAM:** Enforces the Principle of Least Privilege by binding precise execution roles to ECS containers so they can securely stream logs to CloudWatch or download private image manifests.

---

## 3. Dynamic Traffic Routing & Ingress Sequencing

Rather than presenting unorthodox app ports (e.g., `:3000` or `:8000`) to production traffic, the load balancer acts as a reverse proxy, interpreting path matching criteria on standard web ports (`80` / `443`). 

```text
       [Client Browser Traffic]
                  │
                  ▼ Inbound (Port 80/443)
 ┌─────────────────────────────────────────────────┐
 │        Application Load Balancer (ALB)          │
 └────────────────────────┬────────────────────────┘
                          │
            ┌─────────────┴─────────────┐
            │ Match Rule: /api/* │ Match Rule: / (Default)
            ▼                           ▼
 ┌─────────────────────┐     ┌─────────────────────┐
 │ FastAPI Target Group│     │ Frontend Target Group│
 │    (Port 8000)      │     │      (Port 80)      │
 └──────────┬──────────┘     └──────────┬──────────┘
            │                           │
            ▼ (Private VPC Network)     ▼ (Private VPC Network)
 ┌─────────────────────┐     ┌─────────────────────┐
 │  ECS Service Tasks  │     │  ECS Service Tasks  │
 │  (FastAPI Backend)  │     │ (ReactJS Frontend)  │
 └─────────────────────┘     └─────────────────────┘
```

---

# 4. Well-Architected Framework Compliance Mapping

This architecture is engineered to align with the core pillars of the **AWS Well-Architected Framework**, ensuring production readiness, security compliance, and architectural resilience.

---

## 4.1 Operational Excellence

The operational excellence pillar focuses on running and monitoring systems to deliver business value, and continually improving processes and procedures.

* **Infrastructure as Code (IaC):** The entirety of the VPC networking layout, ECR registries, container specifications, firewall policies, and load balancer rule logic is defined in declarative, modularized Terraform configuration files. This eliminates manual configuration errors and guarantees environment state parity between `staging` and `prod`.
* **Observability & Health Checks:** The ALB target groups execute standard HTTP-based health checks against explicit application routes (`/` for Nginx and `/docs` or `/jokes` for FastAPI).
* **Decoupled Deployment Pipeline:** Application deployments are completely isolated from foundational infrastructure updates. Code modifications can be continuously shipped to production by pushing container images to ECR and updating ECS task definitions via CI/CD, eliminating the risk of modifying critical infrastructure during standard code releases.

---

## 4.2 Security

The security pillar focuses on protecting information, systems, and assets while delivering business value through risk assessments and mitigation strategies.

* **Least-Privilege Container Isolation:** Containers operate within completely isolated private subnets.
* **Network Defense-in-Depth:** Stateful security groups act as strict firewalls. The frontend and backend container clusters discard all internet traffic natively; they selectively accept connections **only** if the inbound TCP packet natively originates from the Application Load Balancer security group hash on the declared app port.
* **Automated Image Scanning:** Amazon ECR repositories are configured with `scan_on_push = true`. Every time your build pipeline uploads a new image tag, AWS automatically triggers a vulnerability assessment to alert the engineering team of CVEs before the container is pushed to a live task environment.

---

## 4.3 Reliability

The reliability pillar focuses on ensuring a workload performs its intended function correctly and consistently when it’s expected to.

* **Multi-AZ Fault Tolerance:** The custom VPC module can spreads workloads across multiple separate Availability Zones (`us-east-1a`, `us-east-1b`).
* **Self-Healing Infrastructure:** Governed by ECS Fargate service task configurations, if a container crashes due to memory overflow, unhandled execution exceptions, or runtime panics, AWS instantly initializes a substitute container task to maintain the required target container availability.
* **Distributed State Tracking:** Utilizing an S3 backend with DynamoDB locking prevents remote state race conditions.

---

## 4.4 Performance Efficiency

The performance efficiency pillar focuses on using computing resources efficiently to meet system requirements and maintaining that efficiency as demand changes and technologies evolve.

* **Serverless Compute Provisioning:** By implementing AWS Fargate, CPU and memory capacities are dedicated exactly to the task footprint layer.
* **Independent Resource Scaling:** Because the frontend and backend are split into different ECS services, you can scale them independently.
---

## 4.5 Cost Optimization

The cost optimization pillar focuses on avoiding unnecessary costs and ensuring that your money is spent where it delivers the highest return on investment.

* **Serverless Elastic Pricing:** Fargate removes the financial liability of paying for idle, underutilized EC2 virtual machines.
* **Environment Sizing Control:** Through decoupled `terraform.tfvars` configurations, resource allocations, task counts, and environment-specific constraints can be lowered for `staging` environments while scaling up safely for `prod` workloads.

---

## 4.6 Sustainability

The sustainability pillar focuses on minimizing the environmental impacts of running cloud workloads, with a primary focus on energy efficiency and waste reduction.

* **Shared Infrastructure Efficiency:** By running on serverless AWS Fargate clusters, our compute jobs participate in highly multi-tenanted AWS hypervisor workloads.
* **Serverless Operational Model:** No bare-metal servers, no host OS, only managed AWS service.
