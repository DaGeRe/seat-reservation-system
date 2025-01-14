# Stage 1: Base stage using a lightweight Docker CLI image
FROM docker:24.0-cli AS docker-cli

# Stage 2: Use an official Maven image to build the application
FROM maven:3.8.4-openjdk-17 AS build



# Set environment variables for paths
ARG PROJECT_PATH
ENV PROJECT_PATH=$PROJECT_PATH
ARG PATH_TO_TLS
ENV PATH_TO_TLS=$PATH_TO_TLS

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy the Maven project files into the container
COPY src src
COPY run_test.sh .

# Copy TLS certificates
COPY tls src/main/resources/tls

# Copy Maven proxy and settings (offline pre-configured)
COPY pom.xml .
COPY settings.xml /usr/share/maven/
COPY settings.xml /root/.m2/

# Copy pre-downloaded Maven dependencies to avoid network access
COPY .m2 /root/.m2/

# Copy the test data dumps
COPY src/test/resources/dumps dumps

# Build the Maven project in offline mode (skip tests). Before: mvn clean install and copy ~/.m2 to backend/.m2
RUN mvn clean package -DskipTests -o 

# Stage 3: Use a lightweight Java runtime image
FROM openjdk:17-slim-bullseye
RUN apt-get update
RUN apt-get install curl -y
RUN apt-get install iputils-ping -y
RUN apt-get install telnet -y
#, iputils-ping -y 192.168.64.4:3001

RUN DEBIAN_FRONTEND=noninteractive TZ=Europe/PARIS apt-get -y install tzdata
ENV TZ=Europe/Paris
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

WORKDIR /usr/src/app

# Copy the compiled JAR file from the build stage
COPY --from=build /usr/src/app/target/backend-0.0.1-SNAPSHOT.jar backend-0.0.1-SNAPSHOT.jar

# Copy the Docker CLI utility for container-related operations
COPY --from=docker-cli /usr/local/bin/docker /usr/local/bin/docker

# Copy Maven and cached dependencies from the build stage
COPY --from=build /usr/share/maven /usr/share/maven
COPY --from=build /root/.m2 /root/.m2

# Copy the source code and necessary resources from the build stage
COPY --from=build /usr/src/app /usr/src/app

# Set Maven-related environment variables
ENV M2_HOME=/usr/share/maven
ENV PATH=$M2_HOME/bin:$PATH

# Set no-proxy environment to avoid external connections during runtime
ENV no_proxy=127.0.0.1,localhost,::1,*.local,172.17.0.0/16,192.168.0.0/16,10.0.0.0/8,172.18.0.0/16,172.21.0.0/16,172.27.0.0/16

# Add proxy environment variables for local/internal network proxies (if required)
ENV http_proxy=http://proxy.justiz.sachsen.de:3128
ENV https_proxy=https://proxy.justiz.sachsen.de:3128

# Copy the entrypoint script (run tests and other tasks)
COPY --from=build /usr/src/app/run_test.sh /usr/src/app/run_test.sh
RUN chmod +x /usr/src/app/run_test.sh

# Copy pre-loaded test data
#COPY --from=build /usr/src/app/dumps /usr/src/app/src/test/resources
#COPY --from=build /usr/src/app/dumps /usr/src/app/src/main/resources
COPY --from=build /usr/src/app/dumps dumps
# Disable external access in runtime with JVM options
CMD ["java", "-Dhttp.proxyHost=proxy.justiz.sachsen.de", "-Dhttp.proxyPort=3128", "-Dhttps.proxyHost=proxy.justiz.sachsen.de", "-Dhttps.proxyPort=3128", "-Djava.net.preferIPv4Stack=true", "-jar", "backend-0.0.1-SNAPSHOT.jar"]
