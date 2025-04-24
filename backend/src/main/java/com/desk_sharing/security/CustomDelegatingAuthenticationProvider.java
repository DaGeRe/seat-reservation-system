package com.desk_sharing.security;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;

import java.util.List;

/**
 * This class bundles the two authentication mechanism.
 * Each mechanism is an entry in the providers list.
 * Starting from the first to the last, each mechanism is tried. If one succed the loop is stopped
 * and the user is authenticated. If none succed the user is prohibited to go further.
 */
public class CustomDelegatingAuthenticationProvider implements AuthenticationProvider {

    private final List<AuthenticationProvider> providers;

    /**
     * Constructor.
     * @param providers The list of all authentication providers. First element in list is used first, followed by the second etc.
     */
    public CustomDelegatingAuthenticationProvider(List<AuthenticationProvider> providers) {
        this.providers = providers;
    }

    @Override
    public Authentication authenticate(Authentication authentication) throws AuthenticationException {
        for (AuthenticationProvider provider : providers) {
            try {
                Authentication result = provider.authenticate(authentication);
                if (result != null && result.isAuthenticated()) {
                    return result;
                }
            } catch (AuthenticationException ex) {
                // Provider konnte nicht authentifizieren – weiter zum nächsten
                // Optional: Log oder spezifisches Handling
            }
        }
        throw new AuthenticationException("Keine Authentifizierung möglich") {};
    }

    @Override
    public boolean supports(Class<?> authentication) {
        // Gilt für alle unterstützten Authentifizierungs-Typen
        return true;
    }
}
