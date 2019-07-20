# Web Diary

## Prerequisites
* NodeJS
* MongoDB Atlas with cluster with the following keys: `title`, `date`, `startTime`, `endTime`, `content`
* Auth0 account

## Set Up
* Navigate to the `/backend/index.js` file and place your mongoDB username and password to connect to your mongoDB Atlas account.
* Navigate to the `/src/app/service/auth.service` and place your Auth0 domain and client-id in the appropriate fields.
* Configure your auth0 projectso that there is a user you can sign on with.
* Replace the database name and cluster name with your own.
* Make sure the ports 4001 and 4004 are not being used.

## Run
Run the following commands in bash and then navigate to `localhost:4001`
```bash
cd web-diary
npm start & cd backend; npm start
```
