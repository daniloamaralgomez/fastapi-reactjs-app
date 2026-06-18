terraform {
  required_version = ">= 1.5.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {

  region = var.aws_region

  access_key = "local"
  secret_key = "local"

  skip_credentials_validation = true
  skip_metadata_api_check     = true
  skip_requesting_account_id  = true
}

module "vpc" {
  source             = "../../modules/vpc"
  environment        = var.environment
  vpc_cidr           = var.vpc_cidr
  public_subnets     = var.public_subnets
  private_subnets    = var.private_subnets
  availability_zones = var.availability_zones
}

module "ecr" {
  source     = "../../modules/ecr"
  repo_names = ["local-frontend", "local-backend"]
}

resource "aws_ecs_cluster" "local_cluster" {
  name = "${var.environment}-core-cluster"
}

# 1. Instantiate the ALB Module
module "alb" {
  source         = "../../modules/alb"
  environment    = var.environment
  vpc_id         = module.vpc.vpc_id
  public_subnets = module.vpc.public_subnet_ids
}

# 2. Frontend ECS Service (Port 80)
module "frontend_service" {
  source                = "../../modules/ecs_service"
  environment           = var.environment
  service_name          = "frontend"
  cluster_id            = aws_ecs_cluster.local_cluster.id
  vpc_id                = module.vpc.vpc_id
  subnets               = module.vpc.public_subnet_ids
  container_port        = 80 # It must match the Nginx port inside the container
  image_url             = module.ecr.repository_urls["local-frontend"]
  target_group_arn      = module.alb.frontend_tg_arn
  alb_security_group_id = module.alb.alb_sg_id
}

# 3. Backend ECS Service (Port 8000)
module "backend_service" {
  source                = "../../modules/ecs_service"
  environment           = var.environment
  service_name          = "backend"
  cluster_id            = aws_ecs_cluster.local_cluster.id
  vpc_id                = module.vpc.vpc_id
  subnets               = module.vpc.public_subnet_ids
  container_port        = 8000 # Matches your FastAPI port
  image_url             = module.ecr.repository_urls["local-backend"]
  target_group_arn      = module.alb.backend_tg_arn
  alb_security_group_id = module.alb.alb_sg_id
}
