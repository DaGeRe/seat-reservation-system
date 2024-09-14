#!/bin/bash

# If needed: unset http_proxy and unset https_proxy

# Assign command line parameters to variables
email="admin@mail.com"
password="admin"
is_admin="true"
port="8081"

# Check if the required command line parameters are provided
if [ $# -eq 4 ]; then
    email="$1"
    password="$2"
    is_admin="$3"
    port="$4"
fi

url="https://jus-srv-test30.justiz.sachsen.de:${port}/users/register"

echo "This script executes an register process at: $url"

echo "email: $email, passowrd: $password, is_admin: $is_admin"
echo "Correct? (y/n)"
read response

if [[ "$response" == [yY] ]]; then
    # Construct the wget statement
    data="{\"username\":\"admin\",\"password\":\"$password\",\"email\":\"$email\",\"name\":\"mustermann\",\"surname\":\"max\",\"visibility\":\"true\",\"admin\":$is_admin}"
    headers="Content-Type:application/json"

    wget -O- --ca-directory=$PATH_TO_TLS --post-data="$data" --header="$headers" "$url"
else
  echo "Stop."
fi
