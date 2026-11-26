package com.nexus.placement.util;

import java.io.IOException;
import java.util.logging.*;

/**
 * Centralized application logger using java.util.logging.
 * Appends formatted log statements to 'app.log' and Console.
 * Guaranteed not to attach duplicate handlers.
 */
public class AppLogger {
    private static final Logger LOGGER = Logger.getLogger("com.nexus.placement");
    private static boolean isInitialized = false;

    static {
        initLogger();
    }

    private static synchronized void initLogger() {
        if (isInitialized) {
            return;
        }
        try {
            LOGGER.setUseParentHandlers(false);

            // Console Handler
            ConsoleHandler consoleHandler = new ConsoleHandler();
            consoleHandler.setLevel(Level.ALL);
            consoleHandler.setFormatter(new SimpleFormatter());

            // File Handler (app.log in project root / working dir, append mode true)
            FileHandler fileHandler = new FileHandler("app.log", true);
            fileHandler.setLevel(Level.ALL);
            fileHandler.setFormatter(new SimpleFormatter());

            // Remove existing handlers to avoid duplicates
            Handler[] handlers = LOGGER.getHandlers();
            for (Handler h : handlers) {
                LOGGER.removeHandler(h);
            }

            LOGGER.addHandler(consoleHandler);
            LOGGER.addHandler(fileHandler);
            LOGGER.setLevel(Level.ALL);

            isInitialized = true;
            LOGGER.info("[AppLogger] Logger successfully initialized. Writing events to app.log");
        } catch (IOException e) {
            System.err.println("[AppLogger] Failed to initialize FileHandler for app.log: " + e.getMessage());
        }
    }

    public static Logger getLogger() {
        return LOGGER;
    }

    public static void info(String message) {
        LOGGER.info(message);
    }

    public static void warning(String message) {
        LOGGER.warning(message);
    }

    public static void severe(String message, Throwable throwable) {
        LOGGER.log(Level.SEVERE, message, throwable);
    }

    public static void logConnectionSuccess(String url, String user) {
        // Explicitly does NOT log passwords
        LOGGER.info("[DBConnection] Successfully established database connection. URL=" + url + ", User=" + user);
    }

    public static void logConnectionFailure(String url, String user, String errorMessage) {
        LOGGER.severe("[DBConnection] Failed to establish database connection. URL=" + url + ", User=" + user + ", Error=" + errorMessage);
    }
}
