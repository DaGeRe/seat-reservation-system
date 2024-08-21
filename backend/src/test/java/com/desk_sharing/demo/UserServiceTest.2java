package com.desk_sharing.demo;

import org.junit.Before;
import org.junit.Test;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNull;
import static org.junit.jupiter.api.Assertions.assertNotNull;

import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.MockitoAnnotations;
import org.springframework.security.crypto.password.PasswordEncoder;

import static org.mockito.Mockito.when;

import com.desk_sharing.entities.User;
import com.desk_sharing.repositories.UserRepository;
import com.desk_sharing.services.UserService;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

public class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @InjectMocks
    private UserService userService;

    @Before
    public void setUp() {
        MockitoAnnotations.initMocks(this);
    }

    @Test
    public void testGetAllUsers() {
        // Mock data
        User user1 = new User("John", "Doe");
        User user2 = new User("Jane", "Smith");
        List<User> userList = Arrays.asList(user1, user2);

        // Mock the behavior of userRepository.findAll()
        when(userRepository.findAll()).thenReturn(userList);

        // Call the method to be tested
        List<User> result = userService.getAllUsers();

        // Verify the result
        assertEquals(2, result.size());
        assertEquals("John", result.get(0).getName());
        assertEquals("Doe", result.get(0).getSurname());
        assertEquals("Jane", result.get(1).getName());
        assertEquals("Smith", result.get(1).getSurname());
    }

    @Test
    public void testGetUser() {
        // Mock data
        User user = new User("John", "Doe");
        when(userRepository.findById(1L)).thenReturn(Optional.of(user));

        // Call the method to be tested
        User result = userService.getUser(1L);

        // Verify the result
        assertNotNull(result);
        assertEquals("John", result.getName());
        assertEquals("Doe", result.getSurname());
    }

    @Test
    public void testGetUser_NotFound() {
        // Mock behavior when user is not found
        when(userRepository.findById(1L)).thenReturn(Optional.empty());

        // Call the method to be tested
        User result = userService.getUser(1L);

        // Verify the result
        assertNull(result);
    }

    @Test
    public void testRegisterUser() {
        // Mock data
        User user = new User("john@example.com", "123", "John", "Doe");
        when(userRepository.existsByEmail("john@example.com")).thenReturn(false);
        when(passwordEncoder.encode("123")).thenReturn("encodedPassword");
        when(userRepository.save(user)).thenReturn(user);

        // Call the method to be tested
        User result = userService.registerUser(user);

        // Verify the result
        assertNotNull(result);
        assertEquals("John", result.getName());
        assertEquals("Doe", result.getSurname());
    }

    @Test
    public void testRegisterUser_DuplicateEmail() {
        // Mock behavior when email already exists
        User user = new User("john@example.com", "123", "John", "Doe");
        when(userRepository.existsByEmail("john@example.com")).thenReturn(true);

        // Call the method to be tested
        User result = userService.registerUser(user);

        // Verify the result
        assertNull(result);
    }

    @Test
    public void testLoginUser_ValidCredentials() {
        // Mock data
        User user = new User("john@example.com", "123", "John", "Doe");
        when(passwordEncoder.encode("123")).thenReturn("encodedPassword");
        when(userRepository.findByEmail("john@example.com")).thenReturn(user);
        when(passwordEncoder.matches("password", user.getPassword())).thenReturn(true);

        // Call the method to be tested
        User result = userService.loginUser("john@example.com", "password");

        // Verify the result
        assertNotNull(result);
        assertEquals("John", result.getName());
        assertEquals("Doe", result.getSurname());
    }

    @Test
    public void testLoginUser_InvalidCredentials() {
        // Mock behavior when email is not found or password doesn't match
        when(userRepository.findByEmail("john@example.com")).thenReturn(null);
        when(userRepository.findByEmail("jane@example.com")).thenReturn(new User());
        when(passwordEncoder.matches("password", null)).thenReturn(false);

        // Call the method to be tested
        User result1 = userService.loginUser("john@example.com", "password");
        User result2 = userService.loginUser("jane@example.com", "password");

        // Verify the result
        assertNull(result1);
        assertNull(result2);
    }

    @Test
    public void testFindByEmail() {
        // Mock data
        User user = new User("John", "Doe");
        when(userRepository.findByEmail("john@example.com")).thenReturn(user);

        // Call the method to be tested
        User result = userService.findByEmail("john@example.com");

        // Verify the result
        assertNotNull(result);
        assertEquals("John", result.getName());
        assertEquals("Doe", result.getSurname());
    }

    @Test
    public void testFindByEmail_NotFound() {
        // Mock behavior when email is not found
        when(userRepository.findByEmail("john@example.com")).thenReturn(null);

        // Call the method to be tested
        User result = userService.findByEmail("john@example.com");

        // Verify the result
        assertNull(result);
    }
}
