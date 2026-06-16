variable "repo_names" { type = list(string) }

resource "aws_ecr_repository" "repo" {
  count                = length(var.repo_names)
  name                 = var.repo_names[count.index]
  image_tag_mutability = "MUTABLE" # IMMUTABLE is preferred for strict production

  image_scanning_configuration {
    scan_on_push = true
  }
}

output "repository_urls" {
  value = { for repo in aws_ecr_repository.repo : repo.name => repo.repository_url }
}
