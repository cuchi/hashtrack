# Hashtrack

Hashtrack is a web application that tracks Twitter hashtags.
<div align="center">
  <img src="./screenshot.png">
</div>

<hr/>

The purpose of this project is to build a maintainable easy-to-deploy fullstack
web application from the ground up.

## Run locally

### Prerequisites
- Node.js ([nvm](https://github.com/nvm-sh/nvm) is recommended)
- Docker (`curl https://get.docker.com | sh`)
- [docker-compose](https://docs.docker.com/compose/install/)

### Steps
1. `yarn`
2. `yarn start`

The `start` will create all the local services needed to run it in development 
mode. The application will be available in http://localhost:8080 by default.

You should create a `.env` file with your API tokens if you want to see real
tweets.

The automated tests can be run with `yarn test`, this will also wind up some
needed local services first.

<hr/>

There are still improvements to be made. Check out the [roadmap](./ROADMAP.md)!
