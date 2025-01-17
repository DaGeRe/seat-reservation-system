#!/bin/bash

# If needed: unset http_proxy and unset https_proxy

port="8081"
if [ $# -eq 1 ]; then
    port="$1"
fi

login_url="https://jus-srv-test30.justiz.sachsen.de:${port}/users/login"
echo "Try to connect to ${login_url}"

echo "start" && \
wget -d \
    --ca-directory=$PATH_TO_TLS \
    -O- \
    --post-data='{"email":"test@mail.com","password":"test"}' \
    --header='Content-Type:application/json' \
    $login_url
echo "end"