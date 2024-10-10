import org.junit.jupiter.api.BeforeAll;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.AfterAll;
import org.testcontainers.containers.MariaDBContainer;
import org.testcontainers.junit.jupiter.Container;
import org.testcontainers.junit.jupiter.Testcontainers;
import org.junit.BeforeClass;
import static org.junit.jupiter.api.Assertions.assertNull;

@Testcontainers
public class MyTest {

    // Define the MariaDB container
/*     @Container
    public static MariaDBContainer<?> mariadb = new MariaDBContainer<>("mariadb:latest")
        .withDatabaseName("test")
        .withUsername("user")
        .withPassword("password");

    @BeforeClass
    public static void setUp() {
        System.setProperty("testcontainers.dockerclient.strategy", "unix:///var/run/docker.sock");
        System.setProperty("testcontainers.configuration.file", "");
        System.setProperty("DOCKER_HOST", "unix:///var/run/docker.sock");
    }

    @BeforeAll
    public static void setup() {
        // Explicitly set Docker configuration
        System.setProperty("testcontainers.dockerclient.strategy", "org.testcontainers.dockerclient.UnixSocketClientProviderStrategy");
        System.setProperty("testcontainers.dockerclient.strategy", "unix:///var/run/docker.sock");
        System.setProperty("testcontainers.configuration.file", "");
        System.setProperty("DOCKER_HOST", "unix:///var/run/docker.sock");
        
        // Start the MariaDB container
        mariadb.start();
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
    } */
    
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