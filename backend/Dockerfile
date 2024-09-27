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
#ENV MAVEN_OPTS="-Dorg.slf4j.simpleLogger.defaultLogLevel=debug"

#RUN mvn test -Dsurefire.reportFormat=plain
#RUN mkdir -p /foo && mvn test > /foo/t.txt
#ARG CACHEBUST=1 
#RUN mvn test

# Build the Maven project
RUN mvn clean package

# Use a lightweight Java runtime image
#FROM openjdk:11-jre-slim
FROM openjdk:24-slim-bullseye
#ENV DOCKER_HOST=unix:///var/run/docker.sock
#RUN export DOCKER_HOST=unix:///var/run/docker.sock
#RUN apt-get update && \
#    apt-get install -y --no-install-recommends \
#    curl \
#    iputils-ping \
#    ca-certificates \
#    gnupg \
#    lsb-release \
#    && mkdir -p /etc/apt/keyrings \
#    && curl -fsSL https://download.docker.com/linux/debian/gpg | gpg --dearmor -o /etc/apt/keyrings/docker.gpg \
#    && echo "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] https://download.docker.com/linux/debian $(lsb_release -cs) stable" | tee /etc/apt/sources.list.d/docker.list > /dev/null \
#    && apt-get update \
#    && apt-get install -y --no-install-recommends docker-ce-cli \
#    && apt-get purge -y --auto-remove \
#    && rm -rf /var/lib/apt/lists/*

# Install necessary packages
RUN apt-get update && apt-get install -y \
    apt-transport-https \
    ca-certificates \
    curl \
    gnupg \
    lsb-release \
    && rm -rf /var/lib/apt/lists/*

# Add Docker's official GPG key
RUN curl -fsSL https://download.docker.com/linux/debian/gpg | apt-key add -

# Set up the stable repository
RUN echo "deb [arch=$(dpkg --print-architecture)] https://download.docker.com/linux/debian $(lsb_release -cs) stable" > /etc/apt/sources.list.d/docker.list

# Install Docker
#RUN apt-get update && apt-get install -y docker-ce docker-ce-cli containerd.io
#RUN apt-get update && apt-get install -y docker.io

# Cleanup
RUN apt-get clean && rm -rf /var/lib/apt/lists/*

# Verify Docker installation
#RUN docker --version

#RUN groupadd docker && usermod -aG docker root

# Set the working directory for the runtime stage
WORKDIR /usr/src/app

# Copy the compiled JAR file from the build stage
COPY --from=build /usr/src/app/target/backend-0.0.1-SNAPSHOT.jar backend-0.0.1-SNAPSHOT.jar


# Specify the default command to run your application
#CMD ["java", "-Dhttp.proxyHost=proxy.justiz.sachsen.de", "-Dhttp.proxyPort=3128", "-Dhttps.proxyHost=proxy.justiz.sachsen.de", "-Dhttps.proxyPort=3128", "-jar", "backend-0.0.1-SNAPSHOT.jar"]
CMD ["java", "-Dhttp.proxyHost=proxy.justiz.sachsen.de", "-Dhttp.proxyPort=3128", "-Dhttps.proxyHost=proxy.justiz.sachsen.de", "-Dhttps.proxyPort=3128", "-jar", "backend-0.0.1-SNAPSHOT.jar"]
