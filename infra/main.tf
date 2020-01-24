
provider "heroku" {}

variable "heroku_app_name" {
  description = "Name of the Heroku app that will be the instance of Hashtrack"
}

variable "twitter_consumer_key" {}
variable "twitter_consumer_secret" {}
variable "twitter_access_token" {}
variable "twitter_access_token_secret" {}

resource "heroku_app" "hashtrack" {
  name   = var.heroku_app_name
  region = "us"
  sensitive_config_vars = {
    TWITTER_CONSUMER_KEY        = var.twitter_consumer_key
    TWITTER_CONSUMER_SECRET     = var.twitter_consumer_secret
    TWITTER_ACCESS_TOKEN        = var.twitter_access_token
    TWITTER_ACCESS_TOKEN_SECRET = var.twitter_access_token_secret
  }

  config_vars = {
    # Migrations are not on the roadmap yet.
    FORCE_SYNC = true
  }
}

resource "heroku_addon" "database" {
  app  = heroku_app.hashtrack.name
  plan = "heroku-postgresql:hobby-dev"
}

resource "heroku_addon" "cache" {
  app  = heroku_app.hashtrack.name
  plan = "heroku-redis:hobby-dev"
}

output "app" {
  value = heroku_app.hashtrack
}
