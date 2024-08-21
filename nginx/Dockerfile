FROM nginx:1.19.2-alpine
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY /files/desksharingtool.crt /etc/nginx/nginx/files/localhost.crt
COPY /files/desksharingtool.key /etc/nginx/nginx/files/localhost.key