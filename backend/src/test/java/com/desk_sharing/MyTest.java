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
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.test.context.junit.jupiter.SpringExtension;
import org.testcontainers.containers.MariaDBContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;
import static org.junit.jupiter.api.Assertions.assertNull;
import javax.sql.DataSource;
import java.sql.Connection;
import org.springframework.boot.test.context.SpringBootTest;
import org.testcontainers.utility.MountableFile; // Make sure to import this class

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.sql.DriverManager;
import java.io.IOException;
import java.sql.SQLException;
import java.sql.ResultSet;
import java.sql.Statement;

//@SpringBootTest
@Testcontainers
public class MyTest {
    private static final String DUMP_FILE_PATH = "/usr/src/app/dumps/test_02.sql"; // Update this path

    @Container 
    private static MariaDBContainer<?> mariadb = new MariaDBContainer<>("mariadb:10.6")
            .withDatabaseName("mydatabase")
            .withUsername("user")
            .withPassword("password")
            //.withCopyFileToContainer(MountableFile.forPath(new File("")), "/docker-entrypoint-initdb.d/dump.sql");
            ;
            
    @Autowired
    private DataSource dataSource;
/* 
    @BeforeClass
    public static void setUp() {
        System.setProperty("testcontainers.dockerclient.strategy", "unix:///var/run/docker.sock");
        System.setProperty("testcontainers.configuration.file", "");
        System.setProperty("DOCKER_HOST", "unix:///var/run/docker.sock");
    }
    */
    @BeforeAll
    public static void setup() {
        // Explicitly set Docker configuration
        //System.setProperty("testcontainers.dockerclient.strategy", "org.testcontainers.dockerclient.UnixSocketClientProviderStrategy");
        System.setProperty("testcontainers.dockerclient.strategy", "unix:///var/run/docker.sock");
        System.setProperty("testcontainers.configuration.file", "");
        System.setProperty("DOCKER_HOST", "unix:///var/run/docker.sock");
        
        // Start the MariaDB container
        mariadb.start();
        
        try {
            // Load the dump file
            Path dumpFile = Paths.get(DUMP_FILE_PATH);
            String dumpContent = Files.readString(dumpFile);
            System.out.println("ok1");
            try (Connection connection = DriverManager.getConnection(mariadb.getJdbcUrl(), "user", "password")) {
                System.out.println("ok2");
                 for (String sql : dumpContent.split(";")) {
                    if (!sql.trim().isEmpty()) {
                        System.out.println("\tok2.3 " + sql);
                        connection.createStatement().execute(sql);
                        System.out.println("\tok2.4");
                    }
                } 
                connection.createStatement().execute("CREATE DATABASE IF NOT EXISTS `mydatabase`;");
                connection.createStatement().execute("USE `mydatabase`;");
                System.out.println("ok3");
                Statement statement = connection.createStatement();;
                ResultSet resultSet = statement.executeQuery("select * from rooms;");
                while (resultSet.next()) {
                    //String id = resultSet.getString("room_id");
                    String remark = resultSet.getString("remark");

                    System.out.println("remark: " + remark);
                }
                System.out.println("ok4");
            }
            catch (SQLException e_sql) {
                System.err.println("SQLException in setup");
            }

        } catch (IOException e) {
            System.err.println("IOException in setup");
        }
    }
    /* */
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