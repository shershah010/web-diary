![digital journal](digital-journal.png)
 
# Web Diary

A personal diary web application with sentiment analysis.

## Structure

`backend/` - Handles getting and sending data to the MongoDB database. Also sends data to the models to preform sentiment analysis.

`frontend/` - Provides AAA using Auth0. Allows user to view, add, and update diary entries.

`models/`  - Does sentiment analysis.

`proxy/`   - Does a reverse proxy and provides `tls` using NGINX.

## Start Up Guide

1. Setup MongoDB:
    1. Create a MongoDB account here: https://www.mongodb.com/.
    2. Create a collection called `diary_entries` and a database called: `diary_entries_db`.
2. Setup Auth0:
    1. Create an Auth0 account here: https://auth0.com/.
    2. Create a new Single Page Web Application. 
3. Set config files:
    1. Create `backend/config.json`:

    ```json
    {
        "mongodb": {
            "username": "USERNAME",
            "password": "PASSWORD",
            "collection": "diary_entries",
            "url": "MONGO_ENDPOINT.mongodb.net"
        }
    }
    ```

    2. Create `frontend/src/assets/config.json`:


    ```json
    {
        "auth0": {
            "domain": "AUTH0_ENDPOINT.auth0.com",
            "client_id": "CLIENT_ID" 
        }
    }
    ```

    3. Create `models/config.json`

    ```json
    {
        "mongodb": {
            "username": "USERNAME",
            "password": "PASSWORD",
            "collection": "diary_entries",
            "url": "MONGO_ENDPOINT.mongodb.net"
        }
    }
    ```

4. Create a certificate authority:
    1. CA with OpenSSL, add this to your browser or OS.
    2. `openssl req -now -nodes -out DOMAIN_NAME.csr -newkey rsa:4096 -keyout DOMAIN_NAME.key -subj 'CN=COMMON_NAME/C=COUNTRY/ST=STATE/L=LOCATION/O=ORGANIZATION'`
    3. `openssl x509 -req -in DOMAIN_NAME.csr  -CA /PATH/TO/CA/ca.pem -CAkey /PATH/TO/CA/ca.key -CAcreateserial -out DOMAIN_NAME.crt -days 1095 -sha256 -extfile DOMAIN_NAME.ext`

5. Add the frontend, backend, and models path into your `/etc/hosts`. Format should follow: `127.0.0.1\tyour_subject_alt.your_fake_domain.com` 
6. Create a wildcard certificate that will be used for the frontend, backend, and models. Save this in `proxy/tls`.
7. Build with `docker-compose build`
8. Launch with `docker-compose up`
