package com.desk_sharing;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.AfterAll;
import org.testcontainers.containers.MariaDBContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;
import static org.junit.Assert.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;
import org.springframework.beans.factory.annotation.Autowired;
import javax.sql.DataSource;
import java.sql.Connection;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.RequestBody;
import org.testcontainers.utility.MountableFile; // Make sure to import this class
import org.testcontainers.images.PullPolicy;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.sql.ResultSet;
import java.sql.Statement;
import java.util.HashMap;
import java.util.Map;

import com.desk_sharing.controllers.UserController;
import com.desk_sharing.entities.UserEntity;
import com.desk_sharing.repositories.UserRepository;

@SpringBootTest(classes = DeskSharingToolApplication.class)
@Testcontainers
public class MyTest {

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private UserController userController;

    private static final String DUMP_FILE_PATH = "dumps/test.sql"; // Update this path
    static String user = "root"; // Wichtig, da nur root die datenbank ändern kann
    static String pw = "password";
    @Container 
    private static MariaDBContainer<?> mariadb = new MariaDBContainer<>("mariadb:10.6")
            .withDatabaseName("mydatabase")
            .withUsername(user)
            .withPassword(pw)
            .withImagePullPolicy(PullPolicy.defaultPolicy())
            .withCopyFileToContainer(MountableFile.forClasspathResource(DUMP_FILE_PATH), "/docker-entrypoint-initdb.d/test.sql")
            ;
            
    @BeforeAll
    public static void setup() {
        // Explicitly set Docker configuration
        System.setProperty("testcontainers.dockerclient.strategy", "unix:///var/run/docker.sock");
        System.setProperty("testcontainers.configuration.file", "");
        System.setProperty("DOCKER_HOST", "unix:///var/run/docker.sock");
        
        // Start the MariaDB container
        mariadb.start();
        /* try (Connection connection = DriverManager.getConnection(mariadb.getJdbcUrl(), user, pw)) {
            Statement statement = connection.createStatement();
            ResultSet resultSet = statement.executeQuery("select * from rooms;");
            while (resultSet.next()) {
                Integer room_id = resultSet.getInt("room_id");
                String remark = resultSet.getString("remark");
                System.out.println("room_id: " + room_id + " remark: " + remark);
            }
            System.out.println("ok4");
        } catch (SQLException e_sql ) {
            System.err.println("SQLException in setup");
        } */
    }
    @Test
    public void testDatabaseConnection() {
        // Your test logic
        String jdbcUrl = mariadb.getJdbcUrl();
        System.out.println("JDBC URL: " + jdbcUrl);
    }
    @Test 
    void test_user_repo() {
        UserEntity user = userRepository.findByEmail("");
        assertNull(user);  
        user = userRepository.findByEmail("jupp.engel@mail.com");
        assertNotNull(user);
    }

    @Test
    @Transactional
    /**
     * This test shall check if an freshly set password differs from a new one.
     */
    void password_change() {
        UserEntity user = userRepository.findByEmail("jupp.engel@mail.com");
        assertNotNull(user);
        String oldPassword = user.getPassword();
        Map<String, String> map = new HashMap<>();
        map.put("oldPassword", "test");
        map.put("newPassword", "test2");
        int user_id = user.getId();
        
        ResponseEntity<Boolean> response = userController.changePassword(user_id, map);
        assertEquals(response.getStatusCode().value(), 200);
        
        String newPassword = user.getPassword();
        assertNotNull(newPassword);
        assertFalse(newPassword.equals(oldPassword));
    }

    @AfterAll
    public static void teardown() {
        // Stop the MariaDB container
        mariadb.stop();
    } 
}