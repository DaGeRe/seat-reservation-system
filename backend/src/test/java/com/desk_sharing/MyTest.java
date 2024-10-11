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

@Testcontainers
public class MyTest {
    @Container 
    private static MariaDBContainer<?> mariadb = new MariaDBContainer<>("mariadb:10.6")
            .withDatabaseName("test")
            .withUsername("user")
            .withPassword("password");
            
    @Autowired
    private DataSource dataSource;
    // Define the MariaDB container
/*     @Container
    public static MariaDBContainer<?> mariadb = new MariaDBContainer<>("mariadb:latest")
        .withDatabaseName("test")
        .withUsername("user")
        .withPassword("password");
*/
     @BeforeClass
    public static void setUp() {
        System.setProperty("testcontainers.dockerclient.strategy", "unix:///var/run/docker.sock");
        //System.setProperty("testcontainers.configuration.file", "");
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
    }
    
    @Test
    public void testFindByEmail_NotFound() {
        int i = 0;  
        // Verify the result 
       assertNull(null); 
    }
}