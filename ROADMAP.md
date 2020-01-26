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
- [x] Setup linting & code style - ESLint and/or Prettier
- [x] Setup infrastructure - Terraform
  - [x] Application
  - [x] Database
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
- [x] Clean the tweets periodically, so we don't exceed the 10k row limit on
Heroku
- [x] Add development & setup guide

### Phase 3 - Improvements
- [x] Fix the top menu from moving on when changing screens
- [x] Use GraphQL subscriptions (websockets) to push new tweets to the browser
- [x] Make enter key work when including a track
- [x] Setup CI
- [x] Setup deploy
- [x] Keep the database usage under 10k rows, because that is the Heroku's free
PostgreSQL plan limit
- [x] Filter the webSocket tweets via search too
- [ ] Improve API error messages & handling (duplicated entities, etc)
- [ ] When user adds a new hashtag, improve the feedback by fetching some tweets
- [ ] Password recovery
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
