package com.nexus.placement.util;

import java.sql.Connection;
import java.sql.DatabaseMetaData;
import java.sql.SQLException;

/**
 * Standalone test runner to verify MySQL JDBC database connectivity via main().
 */
public class DBConnectionTest {
    public static void main(String[] args) {
        System.out.println("==================================================");
        System.out.println("NEXUS: Testing MySQL Database Connectivity");
        System.out.println("==================================================");

        try (Connection connection = DBConnection.getConnection()) {
            if (connection != null && !connection.isClosed()) {
                DatabaseMetaData metaData = connection.getMetaData();
                System.out.println("[SUCCESS] Successfully connected to MySQL database!");
                System.out.println("Database Product Name   : " + metaData.getDatabaseProductName());
                System.out.println("Database Product Version: " + metaData.getDatabaseProductVersion());
                System.out.println("Driver Name             : " + metaData.getDriverName());
                System.out.println("Database URL            : " + metaData.getURL());
                System.out.println("Connected User          : " + metaData.getUserName());
            } else {
                System.err.println("[FAILED] Connection object was null or closed.");
            }
        } catch (SQLException e) {
            System.err.println("[FAILED] SQL Connection exception occurred: " + e.getMessage());
            System.err.println("Note: Ensure MySQL server is running and credentials in src/main/resources/db.properties match your MySQL installation.");
        }
    }
}
