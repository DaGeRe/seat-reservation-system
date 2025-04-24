package com.desk_sharing.services;

import java.util.ArrayList;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.ldap.NamingException;
import org.springframework.ldap.core.LdapTemplate;
import org.springframework.stereotype.Service;
import static org.springframework.ldap.query.LdapQueryBuilder.query;
import javax.naming.directory.Attributes;
import javax.naming.directory.Attribute;
import javax.naming.NamingEnumeration;

@Service
public class LdapService {
    @Autowired
    private LdapTemplate ldapTemplate;

   
    /**
     * Pulls all groups from ad that the user, which is identified by email, is an memberOf.
     * @param email The email that identifies the user.
     * @return  An list of all groups the user with email is memberOf. 
     */
    public List<String> getUserGroupsByEmail(String email) {

        return ldapTemplate.search(
            query()
            .base("")//.base("OU=Users") 
                .filter("(mail={0})", email),
            (Attributes attrs) -> {
                Attribute memberOf = attrs.get("memberOf");
                List<String> groups = new ArrayList<>();
                if (memberOf != null) {
                    NamingEnumeration<?> all = memberOf.getAll();
                    while (all.hasMore()) {
                        groups.add(all.next().toString());
                    }
                }
                return groups;
            }
        ).stream().flatMap(List::stream).toList();
    }

    public List<String> getGroupMembersEmails(String groupDn) {
        List<String> emails = new ArrayList<>();

        // 1. Mitglieder-DNs aus der Gruppe auslesen
        List<String> memberDns = ldapTemplate.search(
            query().base("").filter("(distinguishedName={0})", groupDn),
            (Attributes attrs) -> {
                List<String> members = new ArrayList<>();
                Attribute memberAttr = attrs.get("member");
                if (memberAttr != null) {
                    try {
                        NamingEnumeration<?> all = memberAttr.getAll();
                        while (all.hasMore()) {
                            members.add(all.next().toString());
                        }
                    } catch (NamingException e) {
                        e.printStackTrace(); // Logging wäre besser
                    }
                }
                return members;
            }
        ).stream().flatMap(List::stream).toList();
    
        // 2. Für jeden Member-DN die Mail-Adresse holen
        for (String memberDn : memberDns) {
            List<String> results = ldapTemplate.search(
                query().base("").filter("(distinguishedName={0})", memberDn),
                (Attributes attrs) -> {
                    Attribute mailAttr = attrs.get("mail");
                    if (mailAttr != null) {
                        try {
                            return mailAttr.get().toString();
                        } catch (NamingException e) {
                            e.printStackTrace();
                        }
                    }
                    return null;
                }
            );
    
            for (String result : results) {
                if (result != null) {
                    emails.add(result);
                }
            }
        }
    
        return emails;
    }
}
