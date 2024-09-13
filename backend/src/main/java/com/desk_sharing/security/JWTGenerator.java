package com.desk_sharing.security;

import java.util.Date;

import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import java.security.Key;
//import java.security.KeyPair;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.SignatureAlgorithm;
import java.security.Key;
import org.springframework.security.authentication.AuthenticationCredentialsNotFoundException;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Component;

@Component
public class JWTGenerator {
	private static final Key key = Keys.secretKeyFor(SignatureAlgorithm.HS512);
	
	public String generateToken(Authentication authentication) {
		String username = authentication.getName();
		Date currentDate = new Date();
		Date expireDate = new Date(currentDate.getTime() + SecurityConstants.JWT_EXPIRATION);
		try {
			String token = Jwts.builder()
				.setSubject(username)
				.setIssuedAt( new Date())
				.setExpiration(expireDate)
				.signWith(key,SignatureAlgorithm.HS512)
				.claim("foo", "bar")
				.compact();
			return token;
		}
		catch (Exception e) {
			e.printStackTrace();
		}
		return null;
	}
	public String getUsernameFromJWT(String token){
		Claims claims = Jwts.parserBuilder()
				.setSigningKey(key)
				.build()
				.parseClaimsJws(token)
				.getBody();
		return claims.getSubject();
	}
	
	public boolean validateToken(String token) {
		try {
			 Jwts.parserBuilder()
			 .setSigningKey(key)
			 .build()
			 .parseClaimsJws(token);
            return true;
		} catch (Exception ex) {
			throw new AuthenticationCredentialsNotFoundException(
                "JWT was exprired or incorrect",
                ex.fillInStackTrace()
            );
		}
	}

}