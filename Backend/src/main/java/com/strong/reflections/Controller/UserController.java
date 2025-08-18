package com.strong.reflections.Controller;

import java.util.List;
import java.util.UUID;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.strong.reflections.Model.ResponseWrapper;
import com.strong.reflections.Model.Users;
import com.strong.reflections.Service.UserService;
import com.strong.reflections.Utils.ReflectException;

@RestController
@RequestMapping("/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    /**
     * Gets all users in the system.
     * Requires ROLE_ADMIN.
     */
    @GetMapping
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<ResponseWrapper<List<Users>>> getAllUsers() {
        List<Users> users = userService.getAllUsers();
        return ResponseEntity.ok(new ResponseWrapper<>(200, "Success", users));
    }

    /**
     * Gets a user by ID.
     */
    @GetMapping("/id/{id}")
    public ResponseEntity<ResponseWrapper<Users>> getUserById(@PathVariable("id") UUID id) throws ReflectException {
        Users user = userService.getUserById(id);
        return ResponseEntity.ok(new ResponseWrapper<>(200, "Success", user));
    }

    /**
     * Gets a user by their email address.
     */
    @GetMapping("/email/{email:.+}")
    public ResponseEntity<ResponseWrapper<Users>> getUserByEmail(@PathVariable("email") String email)
            throws ReflectException {
        Users user = userService.getUserByEmail(email);
        return ResponseEntity.ok(new ResponseWrapper<>(200, "Success", user));
    }

    /**
     * Checks if the given email is available.
     */
    @GetMapping("/is-email-available/{email:.+}")
    public ResponseEntity<ResponseWrapper<Boolean>> isEmailAvailable(@PathVariable("email") String email)
            throws ReflectException {
        boolean available = userService.isEmailAvailable(email);
        return ResponseEntity.ok(new ResponseWrapper<>(200, "Success", available));
    }

    /**
     * Used by Admin to change a user's role.
     * Requires ROLE_ADMIN.
     */
    @PostMapping("/set-role/{email:.+}/{role}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<ResponseWrapper<Boolean>> updateRole(@PathVariable("email") String email,
            @PathVariable("role") String role)
            throws ReflectException {
        userService.updateRole(email, role);
        return ResponseEntity.ok(new ResponseWrapper<>(200, "Success", true));
    }

    /**
     * Toggles a user's activation status.
     * Requires ROLE_ADMIN.
     */
    @PostMapping("/activate/{email:.+}/{activated}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<ResponseWrapper<Boolean>> toggleUserActivation(@PathVariable("email") String email,
            @PathVariable("activated") boolean activated) throws ReflectException {
        userService.toggleUserActivation(email, activated);
        return ResponseEntity.ok(new ResponseWrapper<>(200, "Success", true));
    }

    /**
     * Locks or unlocks a user's account.
     * Requires ROLE_ADMIN.
     */
    @PostMapping("/lock/{email:.+}/{locked}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<ResponseWrapper<Boolean>> lockOrUnlockUser(@PathVariable("email") String email,
            @PathVariable("locked") boolean locked) throws ReflectException {
        userService.lockOrUnlockUser(email, locked);
        return ResponseEntity.ok(new ResponseWrapper<>(200, "Success", true));
    }

    /**
     * Updates the profile details of the currently logged-in user.
     */
    @PostMapping("/update")
    public ResponseEntity<ResponseWrapper<Users>> updateUserSelf(@RequestBody Users user) throws ReflectException {
        Users updatedUser = userService.updateUserSelf(user);
        return ResponseEntity.ok(new ResponseWrapper<>(200, "Success", updatedUser));
    }

    /**
     * Deletes a user by ID.
     * Requires ROLE_ADMIN.
     */
    @DeleteMapping("/id/{id}")
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<ResponseWrapper<Void>> deleteUser(@PathVariable("id") UUID id) throws ReflectException {
        userService.deleteUser(id);
        return ResponseEntity.ok(new ResponseWrapper<>(200, "User deleted successfully", null));
    }
}