package com.desk_sharing.controllers;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.DeleteMapping;
import com.desk_sharing.entities.UserEntity;
import com.desk_sharing.services.UserService;
import com.desk_sharing.model.RegisterDto;
import com.desk_sharing.model.AuthResponseDTO;
import com.desk_sharing.model.LoginDto;
import com.desk_sharing.entities.Role;
import com.desk_sharing.security.JWTGenerator;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import com.desk_sharing.repositories.UserRepository;
import com.desk_sharing.repositories.RoleRepository;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.core.Authentication;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import java.util.Collections;

@RestController
@RequestMapping("/users")
public class UserController {
    @Autowired
    private AuthenticationManager authenticationManager;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private RoleRepository roleRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;
    @Autowired
    private JWTGenerator jwtGenerator;

    Logger logger = LoggerFactory.getLogger(UserController.class);
    @Autowired
    private UserService userService;

    @GetMapping("/get")
    public List<UserEntity> getAllUsers() {
        userService.logging("getAllUsers()");
        return userService.getAllUsers();
    }

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
                user.getAdmin(),
                user.getVisibility()
            ), 
            HttpStatus.OK
        );     
    }

    @PostMapping("register")
    public ResponseEntity<String> register(@RequestBody RegisterDto registerDto) {
        userService.logging("register( " + registerDto + " )");
        if (userRepository.existsByEmail(registerDto.getEmail())) {
            return new ResponseEntity<>("Email ist bereits vergeben!", HttpStatus.BAD_REQUEST);
        }
        UserEntity user = new UserEntity();
        //user.setUsername(registerDto.getEmail());
        user.setPassword(passwordEncoder.encode((registerDto.getPassword())));
        user.setEmail(registerDto.getEmail());
        user.setName(registerDto.getName());
        user.setSurname(registerDto.getSurname());
        user.setVisibility(registerDto.isVisibility());
        user.setAdmin(registerDto.isAdmin());
        
        // If the user is an admin grant the matching privileges.
        final Role role = registerDto.isAdmin() ? 
            roleRepository.findByName("ROLE_ADMIN").get() : 
            roleRepository.findByName("ROLE_USER").get();
        
        user.setRoles(Collections.singletonList(role));
        userRepository.save(user);
        return new ResponseEntity<>("User registered success!", HttpStatus.OK);
    }

    @PutMapping("/visibility/{id}")
    public int changeVisibility(@PathVariable("id") int id) {
        userService.logging("changeVisibility( " + id + " )");
        return userService.changeVisibility(id);
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<UserEntity> updateUserById(@PathVariable("id") int id, @RequestBody UserEntity user) {
        userService.logging("updateUserById( " + id + ", " + user.toString() + " )");
        UserEntity updateUser = userService.updateUserById(id, user);
        HttpStatus status = (updateUser != null) ? HttpStatus.OK : HttpStatus.CONFLICT;
        return ResponseEntity.status(status).body(updateUser);
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

    @DeleteMapping("/ff/{id}")
    public boolean deleteUserFf(@PathVariable("id") int id) {
        userService.logging("deleteUserFf( " + id + " )");
        return userService.deleteUserFf(id);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Integer> deleteUser(@PathVariable("id") int id) {
        userService.logging("deleteUser( " + id + " )");
        int ret = userService.deleteUser(id);
        return ResponseEntity.status(HttpStatus.OK).body(ret);
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
