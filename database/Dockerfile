FROM mariadb:latest

ARG PROJECT_PATH
ENV PROJECT_PATH=$PROJECT_PATH

ENV PATH="$PATH:/"

RUN  http_proxy=http://proxy.justiz.sachsen.de:3128 apt-get update
RUN  http_proxy=http://proxy.justiz.sachsen.de:3128 apt-get install -y iputils-ping netcat
RUN DEBIAN_FRONTEND=noninteractive TZ=Europe/PARIS apt-get -y install tzdata
ENV TZ=Europe/Paris
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone
COPY $PROJECT_PATH/database/scripts .

RUN chmod +x *.sh