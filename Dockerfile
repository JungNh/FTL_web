FROM node:14-alpine as build-stage
WORKDIR /usr/app

COPY package*.json ./
COPY yarn.lock ./
# RUN yarn cache clean

RUN yarn install
COPY . .
RUN yarn build

FROM nginx:1.15.2-alpine
COPY --from=build-stage /usr/app/build /var/www

COPY nginx/nginx.conf /etc/nginx/nginx.conf
EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
