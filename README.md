# Desk-Sharing-Tool

Web application that allows to book workspaces in an office.

## Original project

`https://github.com/Gazzo-gif/Desk-Sharing-Tool`

## How to run the project

If the application is not running yet in the server:

The given commands are assuming you are running the project in the SSH server.

To run the project use: `docker-compose up`.

If you need to build it use: `docker-compose up --build`.

You will be able to access the website in `http://jus-srv-test30:3000`,

The databse will be in `http://jus-srv-test30:3306` and the backend with the REST API will be in `http://jus-srv-test30:8081`.


## Run locally

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

# Set the proxy with npm config set proxy http://proxy.justiz.sachsen.de:3128 and npm config set https-proxy http://proxy.justiz.sachsen.de:3128. Check with npm config get https-proxy. Maybe you have to set the registry with npm config set registry http://registry.npmjs.org/ to an non secured connection. Reset with npm config set registry https://registry.npmjs.org/. Due to poor internet connection quality installations often fail. Update the timeout with npm config set timeout 6000000 may help. Also after changes clean up the cache with #npm cache clear --force.

And now run the frontend: `npm start`

To run the tests, you can run: `npm run test`

## Developing

The three subprojects (frontend, backend and database) are separately developed as docker containers. They are deployed via docker compose. To do so run the script scripts/build_and_run.sh. 

### .env

The .env file is located in the project root. It contains som variables that need to be shared between different components of the project. Wherever some variable is needed the .env file is referenced. 
Some variables are sensitiv, so the .env is not controlled by version control. Since the .env is crucial for the app the developer needs to take care of creating and maintaining this file.
The most important variables are the following:
| Name  | Example | Explanation      |
|-------|------|-----------|
| FRONTEND_PORT  | 3001   | The port of the frontend container |
| BACKEND_PORT   | 8082   | The port of the backend container   |
| DATABASE_PORT  | 3307   | The port of the database container   |
| PROJECT_PATH  | /home/foo/DeskSharingTool   | The absolute path to the project |
| PATH_TO_TLS | /home/foo/tls |The absolute path to the tls certs |

## Test

It is aimed to achieve an good test coverage by implementing an e2e test with cypress.  Some test cases included are: 
- Perform a login and a logout.
- Create a new booking/room/desk/user.
- Create a series booking.
- Try to book an desk for an already occupied time range.
- Delete a booking/room/desk/user.