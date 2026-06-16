terraform {
  backend "s3" {
    bucket         = "acme-terraform-state-staging"
    key            = "applications/react-fastapi/terraform.tfstate"
    region         = "us-east-1"
    dynamodb_table = "terraform-lock-table-staging"
    encrypt        = true
  }
}
