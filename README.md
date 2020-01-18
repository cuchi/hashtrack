# Hashtrack

Hashtrack is a web application that tracks Twitter hashtags.

<hr/>

The purpose of this project is to build a maintainable easy-to-deploy fullstack
web application from the ground up.

This is still a **work in progress**.

## Roadmap

### Phase 1 - Scaffold
- [x] Server
  - [x] Setup language/environemnt - Typescript + Node.js
  - [x] Setup persistence - PostgreSQL
  - [x] Setup ORM - TypeORM
  - [x] Setup API framework - Type-Graphql
  - [x] Setup tests - Mocha + Chai
- [x] Client
  - [x] Setup framework - Svelte
  - [x] Setup state controller - Svelte has one!
  - [x] Setup style
  - [x] Setup GraphQL client

### Phase 2 - MVP
- [ ] Setup linting & code style - ESLint and/or Prettier
- [ ] Setup infrastructure - Terraform
- [ ] Setup CI - Travis
- [ ] Setup deploy - Github Actions
- [ ] Core business rules
  - [x] User creation
    - [x] Server
    - [x] Client
  - [x] Authentication
    - [x] Server
    - [x] Client
  - [ ] Hashtag creation
    - [x] Server
    - [ ] Client
  - [ ] Hashtag removal
    - [x] Server
    - [ ] Client
  - [ ] Tweet retrieval & store (server only)
  - [ ] Tweet listing & search
    - [ ] Server
    - [ ] Client

### Phase 3 - Improvements
- [ ] User self deletion
  - [ ] Server
  - [ ] Client
- [ ] User self update
  - [ ] Server
  - [ ] Client
- [ ] Setup E2E tests - Jest + Webdriverio (?)
- [ ] Pagination
- [ ] Make the client beautiful, responsive & animated
- [ ] Use GraphQL subscriptions (websockets) to push new tweets to the browser
- [ ] Enharden the API using a rate limit method
- [ ] Cache searches to improve response time
- [ ] Go mobile with Flutter
