# Stage 1: Base stage using a lightweight Docker CLI image
FROM docker:24.0-cli as docker-cli

# Use an official Maven image to build the application
FROM maven:3.8.4-openjdk-17 AS build

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

# Build the Maven project
RUN mvn clean package

# Use a lightweight Java runtime image
FROM openjdk:24-slim-bullseye
WORKDIR /usr/src/app

# Copy the compiled JAR file from the build stage
COPY --from=build /usr/src/app/target/backend-0.0.1-SNAPSHOT.jar backend-0.0.1-SNAPSHOT.jar
COPY --from=docker-cli /usr/local/bin/docker /usr/local/bin/docker
# Copy Maven from the build stage into the final image
COPY --from=build /usr/share/maven /usr/share/maven
COPY --from=build /root/.m2 /root/.m2

# Set Maven-related environment variables
ENV M2_HOME=/usr/share/maven
ENV PATH=$M2_HOME/bin:$PATH

# Specify the default command to run your application
CMD ["java", "-Dhttp.proxyHost=proxy.justiz.sachsen.de", "-Dhttp.proxyPort=3128", "-Dhttps.proxyHost=proxy.justiz.sachsen.de", "-Dhttps.proxyPort=3128", "-jar", "backend-0.0.1-SNAPSHOT.jar"]
