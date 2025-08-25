package com.desk_sharing.controllers;

import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import com.desk_sharing.entities.UserEntity;
import com.desk_sharing.services.UserService;

import lombok.AllArgsConstructor;

import com.desk_sharing.model.AuthResponseDTO;
import com.desk_sharing.model.LoginDto;
import com.desk_sharing.security.JWTGenerator;
import com.desk_sharing.repositories.UserRepository;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;


@RestController
@RequestMapping("/users")
@AllArgsConstructor
public class UserController {
    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final JWTGenerator jwtGenerator;
    private final UserService userService;

    // private Logger logger = LoggerFactory.getLogger(UserController.class);

    @PostMapping("/login")
    public ResponseEntity<AuthResponseDTO> login(@RequestBody LoginDto loginDto) {
        userService.logging("login( " + loginDto.getEmail() + " )");
        // Check if mail exists and password is correct.
        Authentication authentication = authenticationManager.authenticate(
            new UsernamePasswordAuthenticationToken(
                loginDto.getEmail(),
                loginDto.getPassword()
            )
        );

        // If login was successful search for the dataset in the database.
        UserEntity user = userRepository.findByEmail(loginDto.getEmail());   
        if (user == null) {
            throw new UsernameNotFoundException("Username not found after login.");
        }

        SecurityContextHolder.getContext().setAuthentication(authentication);
        final String token = jwtGenerator.generateToken(authentication);
        
        return new ResponseEntity<>(
            new AuthResponseDTO(
                token, 
                user.getEmail(),
                user.getId(),
                user.getName(),
                user.getSurname(),
                user.isAdmin(),
                user.isVisibility()
            ), 
            HttpStatus.OK
        );     
    }

    @PutMapping("/visibility/{id}")
    public int changeVisibility(@PathVariable("id") int id) {
        userService.logging("changeVisibility( " + id + " )");
        return userService.changeVisibility(id);
    }

    @PutMapping("/password/{id}")
    public ResponseEntity<Boolean> changePassword(@PathVariable("id") int id, @RequestBody Map<String, String> request) {
        userService.logging("changePassword( " + id + ", " + "***" + " )");
        String oldPassword = request.get("oldPassword");
        String newPassword = request.get("newPassword");
        boolean answer = userService.changePassword(id, oldPassword, newPassword);
        HttpStatus status = (answer) ? HttpStatus.OK : HttpStatus.BAD_REQUEST;
        return ResponseEntity.status(status).body(answer);
    }
 
    @GetMapping("/get/{id}")
    public UserEntity getUser(@PathVariable("id") int id) {
        userService.logging("deleteUser( " + id + " )");
        return userService.getUser(id);
    }

    @GetMapping("/admin/{id}")
    public boolean isAdmin(@PathVariable("id") int id) {
        userService.logging("isAdmin( " + id + " )");
        return userService.isAdmin(id);
    }
}
