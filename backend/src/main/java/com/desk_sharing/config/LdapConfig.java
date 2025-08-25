package com.desk_sharing.config;

import org.springframework.beans.factory.annotation.Qualifier;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;
import org.springframework.ldap.core.LdapTemplate;
import org.springframework.ldap.core.support.LdapContextSource;

@Configuration
public class LdapConfig {
    private final  Environment env;

    public LdapConfig(final Environment env) {
        this.env = env;
    }

    @Bean(name = "customLdapContextSource")
    public LdapContextSource contextSource() {
        LdapContextSource contextSource = new LdapContextSource();
        //           env.getProperty("spring.ldap.base"),
        contextSource.setUrl(env.getProperty("spring.ldap.urls"));
        /*contextSource.setBase("dc=yourdomain,dc=local");
        contextSource.setUserDn("CN=your-user,OU=Users,DC=yourdomain,DC=local");
        contextSource.setPassword("your-password");*/
        contextSource.setBase(env.getProperty("spring.ldap.base"));
        contextSource.setUserDn(env.getProperty("spring.ldap.username"));
        contextSource.setPassword(env.getProperty("spring.ldap.password"));
        
        return contextSource;
    }

    //webex app vdi
    @Bean
    public LdapTemplate ldapTemplate(@Qualifier("customLdapContextSource") LdapContextSource contextSource) {
        return new LdapTemplate(contextSource());
    }
}
