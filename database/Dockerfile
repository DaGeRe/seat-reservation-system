FROM mariadb:latest

ARG PROJECT_PATH
ENV PROJECT_PATH=$PROJECT_PATH

RUN  http_proxy=http://proxy.justiz.sachsen.de:3128 apt-get update
RUN  http_proxy=http://proxy.justiz.sachsen.de:3128 apt-get install -y iputils-ping netcat
COPY $PROJECT_PATH/database/scripts .
RUN chmod +x *.sh