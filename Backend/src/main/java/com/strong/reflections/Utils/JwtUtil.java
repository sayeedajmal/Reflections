package com.strong.reflections.Utils;

import java.util.Date;
import java.util.function.Function;

import javax.crypto.SecretKey;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Component;

import com.strong.reflections.Model.Users;

import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;

/**
 * JwtUtil is a utility class for handling JWT (JSON Web Token) operations.
 * This class provides methods to generate, validate, and extract information
 * from JWTs.
 * It is used for authentication and authorization purposes within the
 * application.
 */
@Component
public class JwtUtil {

    @Value("${jwt.secret}")
    private String secretKey;

    @Value("${jwt.tokenValidityInMilliSeconds}")
    private long accessTokenExpire;

    @Value("${jwt.tokenRefreshInMilliSeconds}")
    private long refreshTokenExpire;

    /**
     * Extracts the user email (subject) from the given JWT.
     * 
     * @param token the JWT from which the user email is to be extracted.
     * @return the extracted user email.
     * @throws ReflectException if the token is invalid or has expired.
     */
    public String extractUserEmail(String token) throws ReflectException {
        return extractClaim(token, claims -> claims.get("email", String.class));
    }

    public String extractUserName(String token) throws ReflectException {
        return extractClaim(token, Claims::getSubject);
    }

    /**
     * Extracts the user id (id) from the given JWT.
     * 
     * @param token the JWT from which the user id is to be extracted.
     * @return the extracted user id.
     * @throws ReflectException if the token is invalid or has expired.
     */
    public String extractUserId(String token) throws ReflectException {
        Claims claims = extractAllClaims(token);
        return claims.get("id", String.class);
    }

    /**
     * Validates the given JWT against the provided user details.
     * 
     * @param token the JWT to validate.
     * @param user  the user details to validate against.
     * @return true if the JWT is valid, false otherwise.
     * @throws ReflectException
     */
    public boolean isTokenValid(String token, Users user) throws ReflectException {
        String email = extractUserEmail(token);
        return (email.equals(user.getEmail())) && !isTokenExpired(token);
    }

    /**
     * Validates the given refresh token against the provided user details.
     * 
     * @param token the refresh token to validate.
     * @param user  the user details to validate against.
     * @return true if the refresh token is valid, false otherwise.
     * @throws ReflectException
     */
    public boolean isRefreshValid(String token, Users user) throws ReflectException {
        String email = extractUserEmail(token);

        return (email.equals(user.getEmail())) && !isTokenExpired(token);
    }

    /**
     * Checks if the given JWT has expired.
     * 
     * @param token the JWT to check.
     * @return true if the token has expired, false otherwise.
     */
    private boolean isTokenExpired(String token) {
        try {
            return extractExpiration(token).before(new Date());
        } catch (JwtException e) {
            throw new JwtException("Error checking token expiration: " + e.getMessage());
        } catch (ReflectException e) {

        }
        return false;
    }

    /**
     * Extracts the expiration date from the given JWT.
     * 
     * @param token the JWT from which the expiration date is to be extracted.
     * @return the extracted expiration date.
     * @throws ReflectException if the token is invalid or has expired.
     */
    private Date extractExpiration(String token) throws ReflectException {
        return extractClaim(token, Claims::getExpiration);
    }

    /**
     * Extracts a specific claim from the given JWT.
     * 
     * @param token    the JWT from which the claim is to be extracted.
     * @param resolver the function to extract the specific claim.
     * @param <T>      the type of the claim.
     * @return the extracted claim.
     * @throws ReflectException if the token is invalid or has expired.
     */
    public <T> T extractClaim(String token, Function<Claims, T> resolver) throws ReflectException {
        Claims claims = extractAllClaims(token);
        return resolver.apply(claims);
    }

    /**
     * Extracts all claims from the given JWT.
     * 
     * @param token the JWT from which the claims are to be extracted.
     * @return the extracted claims.
     * @throws ReflectException if the token is invalid or has expired.
     */
    private Claims extractAllClaims(String token) throws ReflectException {
        try {
            return Jwts.parserBuilder().setSigningKey(getSigninKey())
                    .build()
                    .parseClaimsJws(token).getBody();
        } catch (ExpiredJwtException e) {
            throw new ReflectException(e.getLocalizedMessage(), HttpStatus.I_AM_A_TEAPOT);
        } catch (JwtException e) {
            throw new ReflectException("Invalid JWT: " + e.getMessage());
        }
    }

    /**
     * Generates an access token for the given user.
     * 
     * @param user the user for whom the access token is generated.
     * @return the generated access token.
     */
    public String generateAccessToken(Users user) {
        return generateToken(user, accessTokenExpire);
    }

    /**
     * Generates a refresh token for the given user.
     * 
     * @param user the user for whom the refresh token is generated.
     * @return the generated refresh token.
     */
    public String generateRefreshToken(Users user) {
        return generateToken(user, refreshTokenExpire);
    }

    /**
     * Generates a JWT token with the specified expiration time.
     * 
     * @param user       the user for whom the token is generated.
     * @param expireTime the expiration time of the token in milliseconds.
     * @return the generated JWT token.
     */
    private String generateToken(Users user, long expireTime) {
        return Jwts
                .builder()
                .setSubject(user.getUsername())
                .claim("id", user.getId())
                .claim("email", user.getEmail())
                .claim("firstName", user.getFirstName())
                .claim("lastName", user.getLastName())
                .claim("enabled", user.isEnabled())
                .claim("accountNonLocked", user.isAccountNonLocked())
                .claim("accountNonExpired", user.isAccountNonExpired())
                .claim("authorities", user.getAuthorities())
                .claim("credentialsNonExpired", user.isCredentialsNonExpired())
                .setIssuedAt(new Date(System.currentTimeMillis()))
                .setExpiration(new Date(System.currentTimeMillis() + expireTime))
                .signWith(getSigninKey())
                .compact();
    }

    /**
     * Provides the signing key used for JWT operations.
     * 
     * @return the signing key.
     */
    private SecretKey getSigninKey() {
        byte[] keyBytes = Decoders.BASE64URL.decode(secretKey);
        return Keys.hmacShaKeyFor(keyBytes);
    }
}