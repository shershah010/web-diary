![digital journal](digital-journal.png)
 
# Web Diary

A personal diary web application that also does sentiment analysis.

## Structure

`backend/` - Handles getting and sending data to the MongoDB database. Also sends data to the models to preform sentiment analysis.

`frontend/` - Provides AAA using Auth0. Allows user to view, add, and update diary entries.

`models/`  - Does sentiment analysis.

`proxy/`   - Does a reverse proxy and provides `tls` using NGINX.

## To Use

1. Setup MongoDB:
    1. Create a MongoDB account here: https://www.mongodb.com/.
    2. Create a collection called `diary_entries` and a database called: `diary_entries_db`.
2. Setup Auth0:
    1. Create an Auth0 account here: https://auth0.com/.
    2. Create a new Single Page Web Application. 
3. Set config files:
    1. Create `backend/config.json`.
    2. Create `frontend/src/assets/config.json`.
    3. Create `models/config.json`.
4. Create a certificate authority:
    1. CA with OpenSSL, add this to your browser or OS.
5. Add the frontend, backend, and models path into your `/etc/hosts`. Format should follow: `127.0.0.1\tyour_subject_alt.your_fake_domain.com` 
6. Create a wildcard certificate that will be used for the frontend, backend, and models. Save this in `proxy/tls`.
7. Build with `docker-compose build`
8. Launch with `docker-compose up`
