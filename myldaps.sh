#. .env && ldapsearch -H ${LDAP_DIR_CONTEXT_URL} \
#    -D "${LDAP_DIR_CONTEXT_PRINCIPAL}" \
#    -w "${LDAP_DIR_CONTEXT_PASSWORD}" \
#    -b "OU=Justiz,DC=justiz,DC=sachsen,DC=de" \
#    "OU=Justiz,DC=justiz,DC=sachsen,DC=de"

. .env && ldapsearch -H ${LDAP_DIR_CONTEXT_URL} \
    -D "${LDAP_DIR_CONTEXT_PRINCIPAL}" \
    -w "${LDAP_DIR_CONTEXT_PASSWORD}" \
    -b "OU=Justiz,DC=justiz,DC=sachsen,DC=de" "(cn=Lehmann, Richard)"
