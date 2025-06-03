package com.desk_sharing.controllers;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

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
import com.desk_sharing.entities.UserEntity;
import com.desk_sharing.services.UserService;

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
public class UserController {
    @Autowired
    private AuthenticationManager authenticationManager;
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private JWTGenerator jwtGenerator;

    Logger logger = LoggerFactory.getLogger(UserController.class);
    @Autowired
    private UserService userService;

    /*@GetMapping("getDefaultFloorForUserId/{id}")
    public ResponseEntity<Floor> getDefaultFloorForUserId(@PathVariable("id") int id) {
        userService.logging("getDefaultFloorForUserId( " + id + " )");
        try {
            final Floor floor = userService.getDefaultFloorForUserId(id);
            return new ResponseEntity<>(floor, HttpStatus.OK);
        } catch (IndexOutOfBoundsException e) {
            userService.logging("\tgetDefaultFloorForUserId( " + id + " ) Was not able to find default floor for user. Send empty floor.");
            return new ResponseEntity<>(new Floor(), HttpStatus.OK);
        } catch (EntityNotFoundException e) {
            userService.logging("\tgetDefaultFloorForUserId( " + id + " ) " + e.getMessage());
            return new ResponseEntity<>(new Floor(), HttpStatus.NOT_FOUND);
        }
    }*/

    /*@GetMapping("setDefaulFloorForUserId/{id}/{floor_id}")
    public boolean setDefaulFloorForUserId(@PathVariable("id") int id, @PathVariable("floor_id") Long floor_id) {
        userService.logging("setDefaulFloorForUserId( " + id + ", " + floor_id + " )");
        try {
            return userService.setDefaulFloorForUserId(id, floor_id);
        }
        catch (EntityNotFoundException e) {
            userService.logging(e.getMessage());
            return false;
        }
    }*/

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
