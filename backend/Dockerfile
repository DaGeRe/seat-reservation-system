# Use an official Maven image to build the application
FROM maven:3.8.4-openjdk-17 AS build
#FROM maven:3.8.4-openjdk-11-slim AS build

ARG PROJECT_PATH
ENV PROJECT_PATH=$PROJECT_PATH
ARG PATH_TO_TLS
ENV PATH_TO_TLS=$PATH_TO_TLS

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy the Maven project files into the container
COPY $PROJECT_PATH/backend .

# Proxy stuff
COPY $PROJECT_PATH/backend/settings.xml /usr/share/maven
COPY $PROJECT_PATH/backend/settings.xml /root/.m2/

# Copy cert stuff
COPY $PATH_TO_TLS src/main/resources/tls

RUN mvn test

# Build the Maven project
RUN mvn clean package
# Use a lightweight Java runtime image
#FROM openjdk:11-jre-slim
FROM openjdk:24-slim-bullseye

# Set the working directory for the runtime stage
WORKDIR /usr/src/app

# Copy the compiled JAR file from the build stage
COPY --from=build /usr/src/app/target/backend-0.0.1-SNAPSHOT.jar backend-0.0.1-SNAPSHOT.jar

#EXPOSE 8082

# Specify the default command to run your application
#CMD ["java", "-jar", "backend-0.0.1-SNAPSHOT.jar"]
CMD ["java", "-Dhttp.proxyHost=proxy.justiz.sachsen.de", "-Dhttp.proxyPort=3128", "-Dhttps.proxyHost=proxy.justiz.sachsen.de", "-Dhttps.proxyPort=3128", "-jar", "backend-0.0.1-SNAPSHOT.jar"]
