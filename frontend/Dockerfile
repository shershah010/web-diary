 # syntax=docker/dockerfile:1
 FROM node:18-alpine
 WORKDIR /app
 COPY . .
 RUN npm install
 RUN npm install -g angular-http-server --save
 RUN npm install -g @angular/cli
 RUN npm run build
 # Runs Angular's special production server that can handle Angular's weird 
 # routing rules.
 CMD ["angular-http-server", "--path", "./dist/web-diary", "-p", "80"]

