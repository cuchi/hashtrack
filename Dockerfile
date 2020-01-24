FROM node:12

COPY . ./

RUN yarn && yarn workspaces run build

CMD ["yarn", "workspace", "hashtrack-server", "start"]