# Web Diary

A personal diary web application that also does sentiment analysis.

## Structure

`backend/` - Handles getting and sending data to the MongoDB database. Also sends data to the models to preform sentiment analysis.

`frontend/` - Provides AAA using Auth0. Allows user to add entries and view pass ones.

`models/`  - Does sentiment analysis.

`proxy/`   - Does a reverse proxy and provides tls.

## To Use

1. Create a MongoDB account.
2. Create an Auth0 account.
3. Create a CA with OpenSSL, add this to your browser or OS.
4. Add the frontend, backend, and models path into your `/etc/hosts`. Format should follow: `127.0.0.1\tyour_subject_alt.your_fake_domain.com` 
5. Create `backend/config.json`.
6. Create `frontend/src/assets/config.json`.
7. Create `models/config.json`.
8. Create a wildcard certificate that will be used for the frontend, backend, and models. Save this in `proxy/tls`.
9. Build with `docker-compose build`
10. Launch with `docker-compose up`
