FROM mariadb:latest

ARG PROJECT_PATH
ENV PROJECT_PATH=$PROJECT_PATH

ENV PATH="$PATH:/"
RUN  apt-get update
RUN apt-get install -y iputils-ping
RUN DEBIAN_FRONTEND=noninteractive TZ=Europe/PARIS apt-get -y install tzdata


ENV TZ=Europe/Paris
RUN ln -snf /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone
#COPY my.cnf /etc/mysql/my.cnf
#COPY scripts .

COPY env.sh /app/env.sh
RUN chmod +x /app/env.sh
RUN /app/env.sh