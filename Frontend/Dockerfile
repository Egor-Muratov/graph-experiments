FROM node:16-alpine as build
WORKDIR /app

COPY package.json /app/package.json
RUN npm install --only=prod

COPY . /app
RUN npm run build

FROM nginx:1.22-alpine as prod
COPY --from=build /app/build /usr/share/nginx/html
COPY nginx/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 3000
CMD ["nginx", "-g", "daemon off;"]