output "service_name" {
  description = "The name of the generated ECS service"
  value       = aws_ecs_service.main.name
}

output "security_group_id" {
  description = "The security group ID assigned to the ECS tasks"
  value       = aws_security_group.ecs.id
}
