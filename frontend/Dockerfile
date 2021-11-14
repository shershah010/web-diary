 # syntax=docker/dockerfile:1
 FROM node:14-alpine
 RUN apk add --no-cache python g++ make
 WORKDIR /app
 COPY . .
 RUN npm install
 RUN npm install -g angular-http-server --save
 RUN npm install -g @angular/cli
 RUN npm run build
 CMD ["angular-http-server", "--path", "./dist/web-diary", "-p", "80"]

