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
# Copy cert stuff
COPY $PATH_TO_TLS src/main/resources/tls

# Proxy stuff
COPY $PROJECT_PATH/backend/pom.xml .
COPY $PROJECT_PATH/backend/settings.xml /usr/share/maven
COPY $PROJECT_PATH/backend/settings.xml /root/.m2/

# The dumps
COPY  $PROJECT_PATH/backend/src/test/resources/dumps dumps

# Install Maven dependencies
RUN mvn dependency:go-offline


#RUN mvn clean install
# Build the Maven project
RUN mvn clean package -Dmaven.test.skip

# Use a lightweight Java runtime image
FROM openjdk:24-slim-bullseye
WORKDIR /usr/src/app

# Copy the compiled JAR file from the build stage
COPY --from=build /usr/src/app/target/backend-0.0.1-SNAPSHOT.jar backend-0.0.1-SNAPSHOT.jar
# Copy the docker utility in the final stage, to use it in the running container.
COPY --from=docker-cli /usr/local/bin/docker /usr/local/bin/docker
# Copy Maven from the build stage into the final image, to use it in the running container.
COPY --from=build /usr/share/maven /usr/share/maven
COPY --from=build /root/.m2 /root/.m2

# Copy the entire source directory if you need access to the original source and resources
COPY --from=build /usr/src/app /usr/src/app

# Set Maven-related environment variables
ENV M2_HOME=/usr/share/maven
ENV PATH=$M2_HOME/bin:$PATH

# Copy entrypoint script to run Docker-related tests
#COPY --from=build /usr/src/app/entrypoint.sh /usr/src/app/entrypoint.sh
COPY --from=build /usr/src/app/run_test.sh /usr/src/app/run_test.sh
RUN chmod +x /usr/src/app/run_test.sh

# The cache.
#COPY  --from=build /root/.m2/repository /root/.m2/repository

COPY --from=build /usr/src/app/dumps /usr/src/app/src/test/resources

# Cancel proxy for every local connection.
#ENV no_proxy="127.0.0.1,localhost,::1,*.local,172.17.0.0/16,192.168.0.0/16,10.0.0.0/8,172.18.0.0/16,172.21.0.0/16,172.27.0.0/16"
ENV no_proxy=127.0.0.1,localhost,::1,*.local,172.17.0.0/16,192.168.0.0/16,10.0.0.0/8,172.18.0.0/16,172.21.0.0/16,172.27.0.0/16,172.17.*.*,*.justiz.sachsen.de,*.sta.justiz.sachsen.de,*.adv,*.sta,*.itgvb.fs.sachsen.de,*.evasax.fs.sachsen.de,10.244.1.*,10.243.138.*,10.243.139.*,10.243.171.*,10.243.14.*,10.243.117.*,10.244.21.*,10.244.72.*,*.voip.sachsen.de,vpngate.pzd-svn.de,localhost,172.17.47.94,jus-srv-test30,https://jus-srv-test30:3000/,http://jus-srv-test30:3000/,https://jus-srv-test30:3000,http://jus-srv-test30:3000,https://jus-srv-test30:8081,https://jus-srv-test30.justiz.sachsen.de
# Specify the default command to run your application
CMD ["java", "-Dhttp.proxyHost=proxy.justiz.sachsen.de", "-Dhttp.proxyPort=3128", "-Dhttps.proxyHost=proxy.justiz.sachsen.de", "-Dhttps.proxyPort=3128", "-jar", "backend-0.0.1-SNAPSHOT.jar"]
