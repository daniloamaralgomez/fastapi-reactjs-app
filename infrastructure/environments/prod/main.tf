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
}

module "vpc" {
  source             = "../../modules/vpc"
  environment        = "prod"
  vpc_cidr           = var.vpc_cidr
  public_subnets     = var.public_subnets
  private_subnets    = var.private_subnets
  availability_zones = var.availability_zones
}

module "ecr" {
  source     = "../../modules/ecr"
  repo_names = ["prod-frontend", "prod-backend"]
}

resource "aws_ecs_cluster" "prod_cluster" {
  name = "prod-core-cluster"
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
  environment           = "prod"
  service_name          = "frontend"
  cluster_id            = aws_ecs_cluster.prod_cluster.id
  vpc_id                = module.vpc.vpc_id
  subnets               = module.vpc.public_subnet_ids
  container_port        = 80 # It must match the Nginx port inside the container
  image_url             = module.ecr.repository_urls["prod-frontend"]
  target_group_arn      = module.alb.frontend_tg_arn
  alb_security_group_id = module.alb.alb_sg_id
}

# 3. Backend ECS Service (Port 8000)
module "backend_service" {
  source                = "../../modules/ecs_service"
  environment           = "prod"
  service_name          = "backend"
  cluster_id            = aws_ecs_cluster.prod_cluster.id
  vpc_id                = module.vpc.vpc_id
  subnets               = module.vpc.public_subnet_ids
  container_port        = 8000
  image_url             = module.ecr.repository_urls["prod-backend"]
  target_group_arn      = module.alb.backend_tg_arn
  alb_security_group_id = module.alb.alb_sg_id
}
