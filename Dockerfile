FROM node:lts-alpine as builder

WORKDIR /home/node/app
COPY --chown=node:node . /home/node/app/
RUN chown -R node:node /home/node
USER node
RUN npm ci --omit=dev
RUN npm run build

FROM nginxinc/nginx-unprivileged:stable-alpine

WORKDIR /home/node/app
COPY --chown=nginx:nginx --from=builder /home/node/app/build /usr/share/nginx/html/
