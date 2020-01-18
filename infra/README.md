# Hashtrack infrastructure

## Prerequisites
- [Heroku CLI](https://devcenter.heroku.com/articles/heroku-cli)
- [Terraform](https://www.terraform.io/downloads.html)

## Setup
1. Make sure you are authenticated in the Heroku CLI (run `heroku login`
otherwise)
2. Run `terraform init`
3. Run `terraform apply` to create the resources.
    - You will have to input an
    application name which is globally unique to Heroku (I already took
    `hashtrack` 🙃)
4. Your infrastructure is now provisioned!
