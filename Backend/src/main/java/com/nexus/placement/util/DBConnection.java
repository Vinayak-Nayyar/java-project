package com.nexus.placement.util;

import com.nexus.placement.exception.DatabaseException;

import java.io.IOException;
import java.io.InputStream;
import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.SQLException;
import java.util.Properties;

/**
 * Utility class managing JDBC database connections.
 * Reads configuration from src/main/resources/db.properties.
 */
public class DBConnection {
    private static final String PROPERTIES_FILE = "db.properties";
    private static Properties properties = new Properties();

    static {
        loadProperties();
    }

    private static void loadProperties() {
        try (InputStream input = DBConnection.class.getClassLoader().getResourceAsStream(PROPERTIES_FILE)) {
            if (input == null) {
                String error = "Unable to find " + PROPERTIES_FILE + " in classpath";
                AppLogger.severe("[DBConnection] " + error, null);
                throw new DatabaseException(error);
            }
            properties.load(input);

            // Register driver class
            String driver = properties.getProperty("db.driver", "com.mysql.cj.jdbc.Driver");
            Class.forName(driver);
            AppLogger.info("[DBConnection] Loaded JDBC properties and registered driver: " + driver);
        } catch (IOException | ClassNotFoundException e) {
            AppLogger.severe("[DBConnection] Failed to initialize DB properties or driver", e);
            throw new DatabaseException("Database initialization failure", e);
        }
    }

    /**
     * Obtains a new JDBC database connection.
     *
     * @return active java.sql.Connection
     * @throws SQLException on connection failure
     */
    public static Connection getConnection() throws SQLException {
        String url = properties.getProperty("db.url");
        String user = properties.getProperty("db.user");
        String password = properties.getProperty("db.password");

        try {
            Connection connection = DriverManager.getConnection(url, user, password);
            AppLogger.logConnectionSuccess(url, user);
            return connection;
        } catch (SQLException e) {
            AppLogger.logConnectionFailure(url, user, e.getMessage());
            throw e;
        }
    }

    /**
     * Safely closes a database connection.
     */
    public static void closeConnection(Connection conn) {
        if (conn != null) {
            try {
                conn.close();
                AppLogger.info("[DBConnection] Database connection closed successfully.");
            } catch (SQLException e) {
                AppLogger.severe("[DBConnection] Error closing database connection", e);
            }
        }
    }
}
