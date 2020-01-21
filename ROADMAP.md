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
  - [x] Application
  - [ ] Database
- [x] Setup server-side logging
- [x] Core business rules
  - [x] User creation
    - [x] Server
    - [x] Client
  - [x] Authentication
    - [x] Server
    - [x] Client
  - [x] Hashtag tracking creation
    - [x] Server
    - [x] Client
  - [x] Hashtag tracking removal
    - [x] Server
    - [x] Client
  - [x] Tweet retrieval & store (server only)
  - [x] Tweet listing
    - [x] Server
    - [x] Client
  - [x] Tweet search
    - [x] Server
    - [x] Client
    

### Phase 3 - Improvements
- [x] Fix the top menu from moving on when changing screens
- [ ] When user adds a new hashtag, improve the feedback by fetching some tweets
- [ ] Make enter key work on inputs
- [ ] Use GraphQL subscriptions (websockets) to push new tweets to the browser
- [ ] Setup CI - Travis
- [ ] Setup deploy - Github Actions
- [ ] User self deletion
  - [ ] Server
  - [ ] Client
- [ ] User self update
  - [ ] Server
  - [ ] Client
- [ ] Setup E2E tests - Jest + Webdriverio (?)
- [ ] Pagination
- [ ] Make the client beautiful, responsive & animated
- [ ] Enharden the API using a rate limit method
- [ ] Cache searches to improve response time
- [ ] Go mobile with Flutter
