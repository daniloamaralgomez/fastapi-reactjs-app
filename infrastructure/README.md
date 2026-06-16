# AWS Deployment & Architecture Reference Manual

AWS infrastructure provisioning for the FastAPI + ReactJS application using Terraform.

## Architecture

The infrastructure deploys:

* VPC
* Application Load Balancer (ALB)
* ECS Fargate services
* ECR repositories

Environments:

* staging
* prod

Terraform is organized using reusable modules.

## Prerequisites

Install:

* Terraform >= 1.12.2
* AWS CLI v2
* Docker
* tfenv (optional)

Verify:

```bash
terraform version
aws --version
docker --version
```

Configure AWS credentials:

```bash
aws configure
```

or

```bash
export AWS_PROFILE=my-profile
```

---

## Repository structure

```text
infrastructure/
├── environments/
│   ├── prod/
│   └── staging/
│
├── modules/
│   ├── alb/
│   ├── ecr/
│   ├── ecs_service/
│   └── vpc/
│
├── .terraform-version
├── .gitignore
└── README.md
```

---

## Deploy staging

Initialize Terraform:

```bash
cd infrastructure/environments/staging

terraform init
```

Review changes:

```bash
terraform plan
```

Deploy:

```bash
terraform apply
```

Destroy resources:

```bash
terraform destroy
```

---

## Deploy production

Initialize Terraform:

```bash
cd infrastructure/environments/prod

terraform init
```

Review changes:

```bash
terraform plan
```

Deploy:

```bash
terraform apply
```

Destroy resources:

```bash
terraform destroy
```

---

## Recommended deployment workflow

### Step 1

Build Docker images.

Backend:

```bash
docker build -t backend ../../backend/app
```

Frontend:

```bash
docker build -t frontend ../../frontend/app
```

### Step 2

Push images to ECR.

Authenticate:

```bash
aws ecr get-login-password \
| docker login \
--username AWS \
--password-stdin <ACCOUNT_ID>.dkr.ecr.<REGION>.amazonaws.com
```

Tag images:

```bash
docker tag backend:latest \
<ACCOUNT_ID>.dkr.ecr.<REGION>.amazonaws.com/staging-backend:latest

docker tag frontend:latest \
<ACCOUNT_ID>.dkr.ecr.<REGION>.amazonaws.com/staging-frontend:latest
```

Push images:

```bash
docker push <ACCOUNT_ID>.dkr.ecr.<REGION>.amazonaws.com/staging-backend:latest

docker push <ACCOUNT_ID>.dkr.ecr.<REGION>.amazonaws.com/staging-frontend:latest
```

### Step 3

Deploy infrastructure:

```bash
terraform apply
```

---

## Future improvements

Planned enhancements:

* HTTPS (ACM)
* Route53
* CloudWatch monitoring
* Auto Scaling
* Secrets Manager
* NAT Gateway
* ECS tasks in private subnets
* GitHub Actions CI/CD

## Notes

Do not commit:

* AWS credentials
* Secrets
* Terraform state files
* Environment variables
