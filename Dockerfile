FROM node:12

USER node
RUN mkdir /home/node/app
WORKDIR /home/node/app
COPY --chown=node:node . ./

RUN yarn \
    && yarn workspaces run build \
    && rm -rf server/src \
    && mv server/build/src server

CMD ["node", "server/src/server.js"]