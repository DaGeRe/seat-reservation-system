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
@ExtendWith(SpringExtension.class)
@DataJpaTest
public class MyRepositoryTest {
    @Container 
    private static MariaDBContainer<?> mariadb = new MariaDBContainer<>("mariadb:10.6")
            .withDatabaseName("test")
            .withUsername("user")
            .withPassword("password");

    @Autowired
    private DataSource dataSource;

    /*@Test
    public void testDatabaseConnection() throws Exception {
         try (Connection connection = dataSource.getConnection()) {
            assert(connection.isValid(1));
        }
    } 
*/
/*       @Test
     public void testFindByEmail_NotFound() {
        System.setProperty("DOCKER_HOST", "unix:///var/run/docker.sock");
        int i = 0;  
        // Verify the result 
       assertNull(null);  
    } */
}