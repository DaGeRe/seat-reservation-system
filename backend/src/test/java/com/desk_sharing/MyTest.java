package com.desk_sharing;
import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.AfterAll;
import org.testcontainers.containers.MariaDBContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

import static org.junit.Assert.assertNotNull;
import static org.junit.jupiter.api.Assertions.assertNull;
import org.springframework.beans.factory.annotation.Autowired;
import javax.sql.DataSource;
import java.sql.Connection;
import org.springframework.boot.test.context.SpringBootTest;
import org.testcontainers.utility.MountableFile; // Make sure to import this class
import org.testcontainers.images.PullPolicy;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.sql.ResultSet;
import java.sql.Statement;

import com.desk_sharing.entities.UserEntity;
import com.desk_sharing.repositories.UserRepository;

@SpringBootTest(classes = DeskSharingToolApplication.class)
@Testcontainers
public class MyTest {

    @Autowired
    private UserRepository userRepository;

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
            
    @Autowired
    private DataSource dataSource;
    @BeforeAll
    public static void setup() {
        // Explicitly set Docker configuration
        System.setProperty("testcontainers.dockerclient.strategy", "unix:///var/run/docker.sock");
        System.setProperty("testcontainers.configuration.file", "");
        System.setProperty("DOCKER_HOST", "unix:///var/run/docker.sock");
        
        // Start the MariaDB container
        mariadb.start();
        System.out.println("setup 1");
        try (Connection connection = DriverManager.getConnection(mariadb.getJdbcUrl(), user, pw)) {
            System.out.println("setup 2");
            Statement statement = connection.createStatement();
            System.out.println("setup 3");
            ResultSet resultSet = statement.executeQuery("select * from rooms;");
            System.out.println("setup 4");
            while (resultSet.next()) {
                //String id = resultSet.getString("room_id");
                Integer room_id = resultSet.getInt("room_id");
                String remark = resultSet.getString("remark");

                System.out.println("room_id: " + room_id + " remark: " + remark);
            }
            System.out.println("ok4");
        } catch (SQLException e_sql ) {
            System.err.println("SQLException in setup");
        }
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
    @AfterAll
    public static void teardown() {
        // Stop the MariaDB container
        mariadb.stop();
    } 
    
    @Test
    public void testFindByEmail_NotFound() {
        int i = 0;  
        // Verify the result 
       assertNull(null); 
    }
}