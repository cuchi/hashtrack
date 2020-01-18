
provider "heroku" {}

variable "heroku_app_name" {
  description = "Name of the Heroku app provisioned as an example"
}

resource "heroku_app" "hashtrack" {
  name   = var.heroku_app_name
  region = "us"
}