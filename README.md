# Desk-Sharing-Tool

Web application that allows to book workspaces in an office.

## Original project

`https://github.com/Gazzo-gif/Desk-Sharing-Tool`

## How to run the project locally using docker compose

The following commands only work for running the project locally. For further configuration, e.g. of ports, please edit `.env`. 

To run the project use: `docker compose up`.

If you need to build it use: `docker compose up --build`.

Afterwards, you can access the website in the browser accessing `localhost` directly. To login, please connect to your local mariadb server  using `mysql --protocol=tcp -P 3306 -u root -p12345 mydatabase` (or a different password that you might have configured in your `.env` file)

and execute

```
INSERT INTO users 
  (email, name, password, surname, visibility, default_view_mode_id, default_floor_id) 
VALUES 
  ('test@test.de',  'TestUser', '$2a$10$IFlMzQQRjWmQoidgkBphoeqbMvJiUCTYwUpJLZWLD3IUqDEPu4lAe', 'TestUser', '', NULL, NULL);
```

to create a test user. Now, you can login using the user name test@test.de and the password 12345.

## Run locally (deprecated)

### Database

Create and run the container for the database: `docker run -d --name database -e MYSQL_ROOT_PASSWORD=mypass -p 3306:3306 mariadb:latest`

After that you can also do the following:

1. Get inside the container: `docker exec -it database bash`
2. Get inside the database: `mariadb -pmypass`

Also make sure you have a database called "mydatabase". You can accomplish then when you are in step 4 and execute `CREATE DATABASE IF NOT EXISTS mydatabase;`.

### Backend

Make sure you are in the backend directory. Then we can do a cleaning and install of all dependencies: `./mvnw clean install` or `./mvnw clean package`.

If you didnt have any error you can now run using this command: `java -jar target/backend-0.0.1-SNAPSHOT.jar `

### Frontend

Go to the frontend directory, make sure you have all the necessary packages: `npm i` or `npm install`.
Set the proxy with npm config set proxy http://proxy.justiz.sachsen.de:3128 and npm config set https-proxy http://proxy.justiz.sachsen.de:3128. Check with npm config get https-proxy. Maybe you have to set the registry with npm config set registry http://registry.npmjs.org/ to an non secured connection. Reset with npm config set registry https://registry.npmjs.org/. Due to poor internet connection quality installations often fail. Update the timeout with npm config set timeout 6000000 may help. Also after changes clean up the cache with #npm cache clear --force.

And now run the frontend: `npm start`

To run the tests, you can run: `npm run test`

## Developing

The three subprojects (frontend, backend and database) are separately developed as docker containers. They are deployed via docker compose. To do so run the script scripts/build_and_run.sh. 
Additionaly an fourth project, namely cypress, is used to perform end to end tests. (scripts/test/run_test.sh)

### SSL
To provide an secure communication between the softwarecomponents tls used.
The backend (=spring app) has an server certificate. Part of the server certificate is an
encrypted private key. This key is used to authenticate the backend to the frontend and to
exchange an session key which encrypt the direct communication.
The server certificate has the format .p12 and also includes the public key next to the private key and some meta informations like common name.
Since the server certificate is self signed by an in house authority, the frontend (=react app) needs the public key of the backend. With this the client knows that the communication
actually happens with the desired server. The client certificate has an .crt extension
and must be unencrypted.
For a new environment the cers and keys must be new issued.

### .env
The .env file is located in the project root. It contains some variables that need to be shared between different components of the project. Wherever some variable is needed the .env file is referenced. 
Some variables are sensitiv, so the .env is not controlled by version control. Since the .env is crucial for the app the developer needs to take care of creating and maintaining this file.
There is an .env_template file that hase some non-sensitive data included. The other entries must be entered by the developer.

## Test

It is aimed to achieve an good test coverage by implementing an e2e test with cypress.  Some test cases included are: 
- Perform a login and a logout.
- Create a new booking/room/desk/user.
- Create a series booking.
- Try to book an desk for an already occupied time range.
- Delete a booking/room/desk/user.
