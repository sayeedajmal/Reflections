package com.strong.reflections.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import org.springframework.context.annotation.Lazy;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.strong.reflections.Model.Users;
import com.strong.reflections.Repository.UserRepository;
import com.strong.reflections.Utils.JwtUtil;
import com.strong.reflections.Utils.ReflectException;

@Service
public class UserService implements UserDetailsService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private JwtUtil jwtUtil;

    public List<Users> getAllUsers() {
        return userRepository.findAll();
    }

    @Transactional(readOnly = true)
    public Users getUserById(UUID userId) throws ReflectException {
        return userRepository.findById(userId)
                .orElseThrow(() -> new ReflectException("User not found with ID: " + userId));
    }

    @Transactional(readOnly = true)
    public Users getUserByEmail(String email) throws ReflectException {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new ReflectException("User not found with email: " + email));
    }

    @Transactional
    public void deleteUser(UUID id) throws ReflectException {
        if (!userRepository.existsById(id)) {
            throw new ReflectException("User not found with ID: " + id);
        }
        userRepository.deleteById(id);
    }

    public boolean isEmailAvailable(String email) {
        return userRepository.findByEmail(email).isEmpty();
    }

    @Transactional
    public Map<String, Object> signUp(Users user) throws ReflectException {
        if (!isEmailAvailable(user.getEmail()) || !isEmailAvailable(user.getUsername().replaceAll("\\s+",""))) {
            throw new ReflectException("Email or username already taken");
        }
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        user.setAccountNonExpired(true);
        user.setAccountNonLocked(true);
        user.setEnabled(true);
        user.setRole("AUTHOR");
        user.setCredentialsNonExpired(true);

        Users savedUser = userRepository.save(user);

        String accessToken = jwtUtil.generateAccessToken(savedUser);
        String refreshToken = jwtUtil.generateRefreshToken(savedUser);

        Map<String, Object> response = new HashMap<>();
        response.put("accessToken", accessToken);
        response.put("refreshToken", refreshToken);
        response.put("myProfile", savedUser);

        return response;
    }

    public Map<String, Object> authenticate(String email, String password) throws ReflectException {
        Users user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ReflectException("User not found"));

        if (!user.isAccountNonExpired()) {
            throw new ReflectException("Your account has expired.", HttpStatus.UNAUTHORIZED);
        }
        if (!user.isAccountNonLocked()) {
            throw new ReflectException("Your account is locked.", HttpStatus.UNAUTHORIZED);
        }
        if (!user.isEnabled()) {
            throw new ReflectException("Your account is disabled.", HttpStatus.UNAUTHORIZED);
        }
        
        try {
            authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(email, password));
        } catch (AuthenticationException e) {
            throw new ReflectException(e.getLocalizedMessage(), HttpStatus.UNAUTHORIZED);
        }

        String accessToken = jwtUtil.generateAccessToken(user);
        String refreshToken = jwtUtil.generateRefreshToken(user);

        Map<String, Object> tokens = new HashMap<>();
        tokens.put("accessToken", accessToken);
        tokens.put("refreshToken", refreshToken);
        tokens.put("myProfile", user);

        return tokens;
    }

    public Map<String, String> refreshToken(String refreshToken, String email) throws ReflectException {
        if (refreshToken == null || refreshToken.isEmpty() || email == null || email.isEmpty()) {
            throw new ReflectException("Refresh token or email is missing");
        }

        String extractedEmail = jwtUtil.extractUserEmail(refreshToken);
        if (!extractedEmail.equals(email)) {
            throw new ReflectException("Token does not match the email provided");
        }

        Users user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ReflectException("User not found"));

        if (!jwtUtil.isRefreshValid(refreshToken, user)) {
            throw new ReflectException("Invalid refresh token");
        }

        String newAccessToken = jwtUtil.generateAccessToken(user);
        String newRefreshToken = jwtUtil.generateRefreshToken(user);

        Map<String, String> tokens = new HashMap<>();
        tokens.put("accessToken", newAccessToken);
        tokens.put("refreshToken", newRefreshToken);

        return tokens;
    }

    @Transactional
    public void updateRole(String email, String role) throws ReflectException {
        Users user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ReflectException("User not found"));

        List<String> validRoles = List.of("AUTHOR", "USER", "ADMIN");
        if (!validRoles.contains(role.toUpperCase())) {
            throw new ReflectException("Invalid role. Must be AUTHOR, USER, or ADMIN.");
        }

        user.setRole(role.toUpperCase());
        userRepository.save(user);
    }

    @Transactional
    public Users updateUserSelf(Users user) throws ReflectException {
        Users existingUser = userRepository.findById(user.getId())
                .orElseThrow(() -> new ReflectException("User not found"));

        if (user.getUsername() != null && !user.getUsername().isBlank()) {
            existingUser.setUsername(user.getUsername());
        }

        if (user.getPassword() != null && !user.getPassword().isBlank()) {
            existingUser.setPassword(passwordEncoder.encode(user.getPassword()));
        }

        return userRepository.save(existingUser);
    }

    @Transactional
    public void toggleUserActivation(String email, boolean enabled) throws ReflectException {
        Users user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ReflectException("User not found"));
        user.setEnabled(enabled);
        userRepository.save(user);
    }

    @Transactional
    public void lockOrUnlockUser(String email, boolean isLocked) throws ReflectException {
        Users user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ReflectException("User not found"));
        user.setAccountNonLocked(!isLocked);
        userRepository.save(user);
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found"));
    }

}
