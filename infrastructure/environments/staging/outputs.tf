output "vpc_id" {
  value = module.vpc.vpc_id
}

output "ecr_repository_urls" {
  description = "Target URLs for pushing Docker builds via CI/CD"
  value       = module.ecr.repository_urls
}

output "ecs_cluster_name" {
  value = aws_ecs_cluster.staging_cluster.name
}

output "application_url" {
  value = module.alb.alb_dns_name
}
