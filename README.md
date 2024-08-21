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

The databse will be in `http://jus-srv-test30:3306` and the backend with the REST API will be in `http://jus-srv-test30:8080`.


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

And now run the frontend: `npm start`

To run the tests, you can run: `npm run test`
