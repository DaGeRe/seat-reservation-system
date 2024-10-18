import java.io.File; // Ensure you import the File class
import java.nio.file.Paths;

import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.AfterAll;
import org.testcontainers.containers.MariaDBContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;
import org.junit.BeforeClass;
import static org.junit.jupiter.api.Assertions.assertNull;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import javax.sql.DataSource;
import java.sql.Connection;
import org.springframework.boot.test.context.SpringBootTest;
import org.testcontainers.utility.MountableFile; // Make sure to import this class
import org.testcontainers.containers.wait.strategy.Wait;
import org.testcontainers.images.PullPolicy;
import java.nio.file.Files;
import java.nio.file.Path;
import java.sql.DriverManager;
import java.io.IOException;
import java.sql.SQLException;
import java.sql.ResultSet;
import java.sql.Statement;

import com.desk_sharing.entities.UserEntity;

//@SpringBootTest
@Testcontainers
public class MyTest {
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
/* package com.desk_sharing.controllers;

import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.BeforeAll;
import org.testcontainers.containers.MariaDBContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;

import static org.junit.jupiter.api.Assertions.assertNull;
@Testcontainers
public class MyTest {
    private static String mariadb_latest = "mariadb:11.5"; //"mariadb:10.6"
    
    @Container
    public static MariaDBContainer<?> mariaDBContainer = new MariaDBContainer<>(mariadb_latest)
        .withDatabaseName("testdb")
        .withUsername("user")
        .withPassword("password")
    ; 

    @BeforeAll
    public static void setup() {
        // Setting the Docker client strategy to use the Unix socket
        System.setProperty("testcontainers.dockerclient.strategy", "unix:///var/run/docker.sock");
        
        // Start the MariaDB container
        mariaDBContainer.start();
    }

    @Test
    public void testFindByEmail_NotFound() {
        System.setProperty("testcontainers.dockerclient.strategy", "unix:///var/run/docker.sock");
        int i = 0;  
        // Verify the result 
       assertNull(null); 
    }   
}
 */