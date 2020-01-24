FROM node:12

USER node
RUN mkdir /home/node/app
WORKDIR /home/node/app
COPY . ./

RUN yarn && yarn workspaces run build && ln -s ../client/public server/public

CMD ["yarn", "workspace", "hashtrack-server", "start"]