docker save desksharingtool_dev-backend:latest -o desksharingtool_dev-backend.bin && \
docker save desksharingtool_dev-frontend:latest -o desksharingtool_dev-frontend.bin && \
docker save desksharingtool_dev-database -o desksharingtool_dev-database.bin && \

docker tag desksharingtool_dev-frontend:latest localhost:5000/desksharingtool-dev-frontend:latest 
docker push localhost:5000/desksharingtool-dev-frontend:latest

#docker tag desksharingtool_dev-frontend:latest lcr.justiz.sachsen.de/desksharingtool-dev-frontend:latest
#ocker push lcr.justiz.sachsen.de/desksharingtool-dev-frontend:latest
#lcr.justiz.sachsen.de/lit-apps/sample-app:1.0.3
#curl http://localhost:5000/v2/_catalog
scp desksharingtool_dev-*.bin adm.rlehmann@jus-as-rz12:/home/adm.rlehmann/desksharing