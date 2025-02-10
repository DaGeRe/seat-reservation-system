#!/bin/bash
. ./../.env

login_url="https://jus-srv-test30.justiz.sachsen.de:${BACKEND_PORT}/users/login"
echo "Try to connect to ${login_url}"

echo "start" && \
wget -d \
    --ca-directory=$PATH_TO_TLS \
    -O- \
    --post-data='{"email":"'"${TEST_MAIL}"'","password":"'"${TEST_PW}"'"}' \
    --header='Content-Type:application/json' \
    $login_url
echo "end"