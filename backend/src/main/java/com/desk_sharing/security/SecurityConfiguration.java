package com.desk_sharing.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.env.Environment;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.ldap.authentication.BindAuthenticator;
import org.springframework.security.ldap.authentication.LdapAuthenticationProvider;
import org.springframework.security.ldap.search.FilterBasedLdapUserSearch;
import org.springframework.security.ldap.DefaultSpringSecurityContextSource;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.security.access.hierarchicalroles.RoleHierarchy;
import org.springframework.security.access.hierarchicalroles.RoleHierarchyImpl;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;
import java.util.List;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfiguration {

    private final JwtAuthEntryPoint authEntryPoint;

    private final Environment env;

    private final JWTGenerator tokenGenerator;

    private final CustomUserDetailsService customUserDetailService;

    public SecurityConfiguration(
            JwtAuthEntryPoint authEntryPoint, 
            final CustomUserDetailsService customUserDetailService, 
            final Environment env,
            final JWTGenerator tokenGenerator) {
        this.authEntryPoint = authEntryPoint;
        this.customUserDetailService = customUserDetailService;
        this.env = env;
        this.tokenGenerator = tokenGenerator;
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList(
            "https://jus-srv-test30.justiz.sachsen.de:3001",
            "https://jus-srv-test30.justiz.sachsen.de:3000"
        ));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "DELETE", "PUT"));
        configuration.addAllowedHeader("Content-Type");
        configuration.addAllowedHeader("Authorization");
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    /**
     * Specify the hierachy of roles.
     * Here we have two roles. 
     * ROLE_ADMIN also includes ROLE_USER while ROLE_ADMIN as more privileges.
     * @return  The desired role hierachy.
     */
    @Bean
    public RoleHierarchy roleHierarchy() {
        return RoleHierarchyImpl.fromHierarchy("ROLE_ADMIN > ROLE_USER");
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http, AuthenticationManager authManager) throws Exception {
        http
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .csrf(csrf -> csrf.disable())
            .exceptionHandling(exception -> exception.authenticationEntryPoint(authEntryPoint))
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                // Allow to send request to the user/login endpoint without any restrictions.
                .requestMatchers("/users/login").permitAll()
                // Only users with the admin role are allowed.
                .requestMatchers("/admin/**").hasRole("ADMIN")
                .anyRequest().authenticated()
            )
            .authenticationManager(authManager)
            .addFilterBefore(new JWTAuthenticationFilter(tokenGenerator, customUserDetailService), UsernamePasswordAuthenticationFilter.class);
        return http.build();
    }

    /**
     * Configure AuthenticationManager with LDAP AuthenticationProvider 
     * and database access object as fallback.
     */
    @Bean
    public AuthenticationManager authenticationManager(HttpSecurity http) throws Exception {
        // Authentication provider that tests the user credential against ad.
        final AuthenticationProvider ldapProvider = ldapAuthenticationProvider();
        // Authentication provider that tests the user credential against the 'build in' database.
        final AuthenticationProvider dbProvider = daoAuthenticationProvider();
        
        // Fix the order in which authentication provider shall be applied. First ldap/ad then build in db.
        final CustomDelegatingAuthenticationProvider delegatingProvider =
        new CustomDelegatingAuthenticationProvider(List.of(ldapProvider, dbProvider));

        final AuthenticationManagerBuilder authBuilder = http.getSharedObject(AuthenticationManagerBuilder.class);
        authBuilder.authenticationProvider(delegatingProvider);
        return authBuilder.build();
    }

    /**
     * Build up the data access object provider that checks user credentials against
     * the build in database.
     */
    @Bean
    public AuthenticationProvider daoAuthenticationProvider() {
        final DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
        provider.setUserDetailsService(customUserDetailService);
        provider.setPasswordEncoder(passwordEncoder());
        return provider;
    }

    /**
     * LDAP ContextSource with service account credentials for bind/search
     */
    @Bean
    public DefaultSpringSecurityContextSource contextSource() {
        DefaultSpringSecurityContextSource contextSource = 
            new DefaultSpringSecurityContextSource(env.getProperty("spring.ldap.urls"));
        contextSource.setUserDn(env.getProperty("spring.ldap.username"));
        contextSource.setPassword(env.getProperty("spring.ldap.password"));  
        contextSource.afterPropertiesSet();
        return contextSource;
    }
    /**
     * Searching user by provided pw as the service user.
     */
    @Bean
    public BindAuthenticator bindAuthenticator(DefaultSpringSecurityContextSource contextSource) {
        final BindAuthenticator authenticator = new BindAuthenticator(contextSource);
        authenticator.setUserSearch(new FilterBasedLdapUserSearch(
            /*
                The base for searching the user.
                E.g.: OU=Justiz,DC=justiz,DC=sachsen,DC=de
             */
            env.getProperty("spring.ldap.base"),
            /*
                Specify the filter criteria. E.g.:(mail={0}) 
                means we search all entries that have the mail property 
                equals the provided username.
            */
            env.getProperty("spring.ldap.patterns"),
            contextSource
        ));
        return authenticator;
    }

    /**
     * LDAP Authentication Provider nutzt BindAuthenticator
     */
    @Bean
    public AuthenticationProvider ldapAuthenticationProvider() {
        return new LdapAuthenticationProvider(bindAuthenticator(contextSource()));
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
