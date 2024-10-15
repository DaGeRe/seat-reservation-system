#/bin/bash
pw=5h#N6\!m9-T
# Show some infos
openssl pkcs12 -info -in jus-srv-test30.justiz.sachsen.de.p12 -passin pass:$pw -nodes 

# Extract cert
openssl pkcs12 -in jus-srv-test30.justiz.sachsen.de.p12 -clcerts -nokeys -passin pass:$pw -out jus-srv-test30.justiz.sachsen.de.crt

# Extract pk 
openssl pkcs12 -in jus-srv-test30.justiz.sachsen.de.p12 -nocerts -passout pass:$pw -passin pass:$pw -out jus-srv-test30.justiz.sachsen.de.pk.pem

# Decrypt pk
openssl rsa -in jus-srv-test30.justiz.sachsen.de.pk.pem -out jus-srv-test30.justiz.sachsen.de.pk.un_encrypted.pem -passin pass:$pw