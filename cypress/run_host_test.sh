docker run \
    -e no_proxy="backend,frontend,backend:8080,jus-srv-test30.justiz.sachsen.de, jus-srv-test30.justiz.sachsen.de:8082" \
    -e NODE_TLS_REJECT_UNAUTHORIZED=0 \
    --network host \
    -it -v /home/r/DeskSharingTool_Dev/cypress:/e2e -w /e2e \
    cypress/included:latest