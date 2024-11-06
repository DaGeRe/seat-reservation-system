#!/bin/bash

# If needed: unset http_proxy and unset https_proxy
# Also see SecurityConfiguration.java and uncomment the line .antMatchers("/users/register").permitAll() // Allow registration even if you not authorized.

. .env
while IFS= read -r line; do
    arrLine=(${line//|/ })
    email=${arrLine[0]}
    name=${arrLine[1]}
    surname=${arrLine[2]}
    echo "y" | ./scripts/post_register.sh $email test false $BACKEND_PORT $name $surname
    sleep 5
done < scripts/names.txt