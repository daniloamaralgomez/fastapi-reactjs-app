variable "environment" {
  description = "Environment name"
  type        = string
}

variable "service_name" {
  description = "Name of the ECS service (e.g., frontend, backend)"
  type        = string
}

variable "vpc_id" {
  description = "The target VPC ID"
  type        = string
}

variable "subnets" {
  description = "Subnets associated with the ECS service tasks"
  type        = list(string)
}

variable "container_port" {
  description = "The port exposed by the application container"
  type        = number
}

variable "cluster_id" {
  description = "The ID of the ECS cluster"
  type        = string
}

variable "image_url" {
  description = "The ECR repository URL for the service image"
  type        = string
}

variable "target_group_arn" {
  description = "The ARN of the ALB Target Group to attach this service to"
  type        = string
}

variable "alb_security_group_id" {
  description = "The security group ID of the ALB to allow ingress traffic"
  type        = string
}
