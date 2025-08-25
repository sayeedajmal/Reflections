package com.strong.reflections.Security;
import java.io.IOException;
import java.util.List;

import org.springframework.context.annotation.Lazy;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import com.strong.reflections.Model.Users;
import com.strong.reflections.Service.UserService;
import com.strong.reflections.Utils.JwtUtil;
import com.strong.reflections.Utils.ReflectException;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;

/**
 * JwtRequestFilter is a Spring Security filter that intercepts HTTP requests
 * to handle JWT-based authentication.
 */
@Component
public class JwtRequestFilter extends OncePerRequestFilter {

    private final UserService userService;
    private final JwtUtil jwtUtil;

    /**
     * Constructor for JwtRequestFilter.
     *
     * @param userService the service used to load user details.
     * @param jwtUtil     the utility class for handling JWT operations.
     */
    public JwtRequestFilter(@Lazy UserService userService, JwtUtil jwtUtil) {
        this.userService = userService;
        this.jwtUtil = jwtUtil;
    }

    /**
     * Filters requests to handle JWT-based authentication.
     * 
     * @param request  the HTTP request containing the JWT in the "Authorization"
     *                 header.
     * @param response the HTTP response.
     * @param chain    the filter chain to continue the request processing.
     * @throws ServletException if an error occurs during request processing.
     * @throws IOException      if an I/O error occurs during request processing.
     */
    @SuppressWarnings("null")
    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain chain)
            throws ServletException, IOException {

        System.out.println("START: JwtRequestFilter");

        final String authHeader = request.getHeader("Authorization");

        System.out.println("Auth header: " + authHeader);

        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            String jwt = authHeader.substring(7);

            System.out.println("JWT: " + jwt);

            try {
                String email = jwtUtil.extractUserEmail(jwt);
                System.out.println("Email: " + email);

                if (email != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                    Users userDetails = (Users) userService.loadUserByUsername(email);

                    System.out.println("User details: " + userDetails);

                    if (userDetails != null && jwtUtil.isTokenValid(jwt, userDetails)) {
                        UsernamePasswordAuthenticationToken authenticationToken = new UsernamePasswordAuthenticationToken(
                                userDetails, null,
                                List.of(new SimpleGrantedAuthority("ROLE_" + userDetails.getRole())));
                        authenticationToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                        SecurityContextHolder.getContext().setAuthentication(authenticationToken);

                        System.out.println("Authentication token: " + authenticationToken);
                    }
                }
            } catch (ReflectException e) {
                response.setStatus(HttpServletResponse.SC_NOT_ACCEPTABLE);
                response.getWriter().write(e.getMessage());
                System.out.println("Error: " + e.getMessage());
                return;
            }
        }

        System.out.println("END: JwtRequestFilter");

        chain.doFilter(request, response);
    }
}
