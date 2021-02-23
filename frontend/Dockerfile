FROM node:lts-alpine as build-stage
WORKDIR /app
COPY package*.json ./
RUN apk add --update npm
RUN npm install @vue/cli@3.7.0 -g
RUN npm install --silent
COPY . /app
RUN npm run build

FROM nginx:stable-alpine as production-stage

RUN mkdir /usr/share/nginx/html/app 
RUN mkdir /usr/share/nginx/html/app/dist 

COPY --from=build-stage ./app/dist /usr/share/nginx/html/app/dist
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d

ENV PORT = 80
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]