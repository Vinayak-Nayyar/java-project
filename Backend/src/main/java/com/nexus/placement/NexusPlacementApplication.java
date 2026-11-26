package com.nexus.placement;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration;

/**
 * Main Spring Boot Application Entry Point for NEXUS Backend.
 * Notice: Excludes DataSourceAutoConfiguration since we explicitly utilize direct
 * JDBC Driver and DBConnection (as per Week 1 requirements, avoiding Spring Data JPA/Hibernate).
 */
@SpringBootApplication(exclude = {DataSourceAutoConfiguration.class})
public class NexusPlacementApplication {

    public static void main(String[] args) {
        SpringApplication.run(NexusPlacementApplication.class, args);
        System.out.println(">>> NEXUS Placement Backend Service successfully started on http://localhost:8080");
        System.out.println(">>> Test endpoint available at: http://localhost:8080/api/hello");
    }
}
