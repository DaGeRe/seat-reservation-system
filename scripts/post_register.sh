#!/bin/bash

# If needed: unset http_proxy and unset https_proxy
# Also see SecurityConfiguration.java and uncomment the line .antMatchers("/users/register").permitAll() // Allow registration even if you not authorized.

# Assign command line parameters to variables
email="admin@mail.com"
password="admin"
is_admin="true"
port="8081" # stands for real application, while 8082 is for dev.
name="max"
surname="mustermann"

# Check if the required command line parameters are provided
if [ $# -eq 6 ]; then
    email="$1"
    password="$2"
    is_admin="$3"
    port="$4"
    name="$5"
    surname="$6"
fi

url="https://jus-srv-test30.justiz.sachsen.de:${port}/users/register"

echo "This script executes an register process at: $url"

echo "Email: " $email "Name: " $name "Surname: " $surname
echo "Correct? (y/n)"
read response

if [[ "$response" == [yY] ]]; then
    # Construct the wget statement
    data="{\"password\":\"$password\",\"email\":\"$email\",\"name\":\"$name\",\"surname\":\"$surname\",\"visibility\":\"true\",\"admin\":$is_admin}"
    headers="Content-Type:application/json"

    wget -O- --ca-directory=$PATH_TO_TLS --post-data="$data" --header="$headers" "$url"
    
else
  echo "Stop."
fi
