docker run --network desksharingtool_dev_mynetwork_dev -e NODE_TLS_REJECT_UNAUTHORIZED=0 -it -v /home/r/DeskSharingTool_Dev/cypress:/e2e -w /e2e cypress/included:latest
