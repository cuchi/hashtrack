
provider "heroku" {}

variable "heroku_app_name" {
  description = "Name of the Heroku app that will be the instance of Hashtrack"
}

resource "heroku_app" "hashtrack" {
  name   = var.heroku_app_name
  region = "us"
}

resource "heroku_addon" "database" {
  app = heroku_app.hashtrack.name
  plan = "heroku-postgresql:hobby-dev"
}

resource "heroku_addon" "cache" {
  app = heroku_app.hashtrack.name
  plan = "heroku-redis:hobby-dev"
}

output "app" {
  value = heroku_app.hashtrack
}
