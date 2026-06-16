output "repository_urls" {
  description = "Map of repository names to their respective ECR repository registry URLs"
  value       = { for repo in aws_ecr_repository.repo : repo.name => repo.repository_url }
}
