FROM node:12

WORKDIR /usr/src/app
COPY package*.json ./

RUN npm install


COPY . .

RUN npm run-script build

EXPOSE 4001
CMD ["npm", "start"]
