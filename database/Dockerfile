FROM mariadb:latest

ARG PROJECT_PATH
ENV PROJECT_PATH=$PROJECT_PATH

ENV PATH="$PATH:/"

RUN  http_proxy=http://proxy.justiz.sachsen.de:3128 apt-get update
RUN  http_proxy=http://proxy.justiz.sachsen.de:3128 apt-get install -y iputils-ping netcat
COPY $PROJECT_PATH/database/scripts .
COPY $PROJECT_PATH/dumps/mydatabase_dump.sql .
RUN chmod +x *.sh