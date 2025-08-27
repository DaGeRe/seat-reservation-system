docker save desksharingtool_dev-backend:latest -o desksharingtool_dev-backend.bin && \
docker save desksharingtool_dev-frontend:latest -o desksharingtool_dev-frontend.bin && \
docker save desksharingtool_dev-database -o desksharingtool_dev-database.bin && \
scp desksharingtool_dev-*.bin adm.rlehmann@jus-as-rz12:/home/adm.rlehmann/desksharing