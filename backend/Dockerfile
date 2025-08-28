FROM maven:3.8.4-openjdk-17-slim AS build

# Set environment variables for paths
ARG PROJECT_PATH
ENV PROJECT_PATH=$PROJECT_PATH
ARG PATH_TO_TLS
ENV PATH_TO_TLS=$PATH_TO_TLS

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy TLS certificates
COPY tls src/main/resources/tls

# Copy Maven proxy and settings (offline pre-configured)
COPY pom.xml .
COPY settings.xml /usr/share/maven/
COPY settings.xml /root/.m2/

# Copy the Maven project files into the container
COPY src src

RUN mvn clean package -DskipTests

# Stage 3: Use a lightweight Java runtime image
# FROM eclipse-temurin:17-jre-alpine 
FROM openjdk:17-slim-bullseye
# RUN apt-get update
# RUN apt-get install curl -y
# RUN apt-get install iputils-ping -y
# RUN apt-get install telnet -y
# RUN apt-get install -y net-tools

# Change timezone.
RUN DEBIAN_FRONTEND=noninteractive TZ=Europe/PARIS apt-get -y install tzdata
ENV TZ=Europe/Paris
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

WORKDIR /usr/src/app

# RUN apt update && apt install ldap-utils

COPY ca_ad.cer /usr/local/share/ca-certificates/ldapserver.crt
#RUN update-ca-certificates
RUN keytool -import -trustcacerts -alias ldapserver -file /usr/local/share/ca-certificates/ldapserver.crt -keystore $JAVA_HOME/lib/security/cacerts -storepass changeit -noprompt

# Copy the compiled JAR file from the build stage
COPY --from=build /usr/src/app/target/backend-0.0.1-SNAPSHOT.jar backend-0.0.1-SNAPSHOT.jar
# Copy the source code and necessary resources from the build stage
#COPY --from=build /usr/src/app /usr/src/app
#COPY --from=build /usr/src/app/target/backend-0.0.1-SNAPSHOT.jar app.jar

# Mit tls debugging
#CMD ["java", "-Dhttp.proxyHost=proxy.justiz.sachsen.de", "-Djavax.net.debug=ssl,handshake", "-Dhttp.proxyPort=3128", "-Dhttps.proxyHost=proxy.justiz.sachsen.de", "-Dhttps.proxyPort=3128", "-Djava.net.preferIPv4Stack=true", "-jar", "backend-0.0.1-SNAPSHOT.jar"]
#CMD ["java", "-Dhttp.proxyHost=proxy.justiz.sachsen.de", "-Dhttp.proxyPort=3128", "-Dhttps.proxyHost=proxy.justiz.sachsen.de", "-Dhttps.proxyPort=3128", "-Djava.net.preferIPv4Stack=true", "-jar", "backend-0.0.1-SNAPSHOT.jar"]
CMD ["java", "-Djava.net.preferIPv4Stack=true", "-jar", "backend-0.0.1-SNAPSHOT.jar"]
