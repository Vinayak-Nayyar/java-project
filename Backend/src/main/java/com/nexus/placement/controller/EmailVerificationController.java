
package com.nexus.placement.controller;

import com.nexus.placement.util.AppLogger;
import com.nexus.placement.util.DBConnection;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.SecureRandom;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.Timestamp;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.LinkedHashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth/email")
@CrossOrigin(origins = "http://localhost:5173")
public class EmailVerificationController {

    // Institutional email domain from application.properties
    @Value("${app.email.allowed-domain}")
    private String allowedDomain;

    // Development-only OTP display configuration
    @Value("${app.email.dev-return-otp:false}")
    private boolean devReturnOtp;

    private static final SecureRandom RANDOM = new SecureRandom();

    /**
     * Initiates an institutional email change request.
     */
    @PostMapping("/request-change")
    public ResponseEntity<Map<String, Object>> requestEmailChange(
            @RequestBody Map<String, Object> request) {

        Map<String, Object> resp = new LinkedHashMap<>();

        // Read request data safely
        int userId;

        try {
            userId = ((Number) request.get("userId")).intValue();
        } catch (Exception e) {
            resp.put("status", "ERROR");
            resp.put("message", "Invalid user ID.");
            return ResponseEntity.badRequest().body(resp);
        }

        String currentEmail = request.get("currentEmail") instanceof String
                ? ((String) request.get("currentEmail")).trim()
                : null;

        String newEmail = request.get("newEmail") instanceof String
                ? ((String) request.get("newEmail")).trim().toLowerCase()
                : null;

        if (currentEmail == null || currentEmail.isBlank()
                || userId <= 0) {

            resp.put("status", "ERROR");
            resp.put("message", "Missing or invalid account information.");
            return ResponseEntity.badRequest().body(resp);
        }

        // Validate institutional email
        if (!isValidInstitutionalEmail(newEmail)) {

            resp.put("status", "ERROR");
            resp.put("message",
                    "Please enter a valid institutional email address.");

            return ResponseEntity.badRequest().body(resp);
        }

        // New email must differ from current email
        if (newEmail.equalsIgnoreCase(currentEmail)) {

            resp.put("status", "ERROR");
            resp.put("message",
                    "New email must be different from your current registered email.");

            return ResponseEntity.badRequest().body(resp);
        }

        try (Connection conn = DBConnection.getConnection()) {

            // Verify that the supplied current email belongs to this user
            try (PreparedStatement ps = conn.prepareStatement(
                    "SELECT id FROM users WHERE id = ? AND email = ?")) {

                ps.setInt(1, userId);
                ps.setString(2, currentEmail);

                try (ResultSet rs = ps.executeQuery()) {

                    if (!rs.next()) {
                        resp.put("status", "ERROR");
                        resp.put("message",
                                "Account information could not be verified.");

                        return ResponseEntity.badRequest().body(resp);
                    }
                }
            }

            // Check whether the new email is already registered
            try (PreparedStatement ps = conn.prepareStatement(
                    "SELECT id FROM users WHERE email = ? AND id != ?")) {

                ps.setString(1, newEmail);
                ps.setInt(2, userId);

                try (ResultSet rs = ps.executeQuery()) {

                    if (rs.next()) {
                        resp.put("status", "DUPLICATE_EMAIL");
                        resp.put("message",
                                "This email address is already registered to another account.");

                        return ResponseEntity.badRequest().body(resp);
                    }
                }
            }

            // Generate cryptographically secure six-digit OTP
            int otp = 100000 + RANDOM.nextInt(900000);

            String otpString = String.valueOf(otp);
            String otpHash = hashString(otpString);

            Instant expiry = Instant.now().plus(10, ChronoUnit.MINUTES);

            conn.setAutoCommit(false);

            try {

                // Invalidate previous pending verification requests
                try (PreparedStatement ps = conn.prepareStatement(
                        "UPDATE email_verifications " +
                                "SET status = 'EXPIRED' " +
                                "WHERE user_id = ? AND status = 'PENDING'")) {

                    ps.setInt(1, userId);
                    ps.executeUpdate();
                }

                // Save new verification request
                try (PreparedStatement ps = conn.prepareStatement(
                        "INSERT INTO email_verifications " +
                                "(user_id, current_email, new_email, otp_hash, status, expires_at) " +
                                "VALUES (?, ?, ?, ?, 'PENDING', ?)")) {

                    ps.setInt(1, userId);
                    ps.setString(2, currentEmail);
                    ps.setString(3, newEmail);
                    ps.setString(4, otpHash);
                    ps.setTimestamp(5, Timestamp.from(expiry));

                    ps.executeUpdate();
                }

                conn.commit();

                AppLogger.info(
                        "[EmailVerification] Pending verification created for user "
                                + userId);

            } catch (Exception e) {

                conn.rollback();

                AppLogger.severe(
                        "[EmailVerification] Failed to save verification request", e);

                resp.put("status", "ERROR");
                resp.put("message",
                        "Unable to initiate email verification. Please try again.");

                return ResponseEntity.internalServerError().body(resp);

            } finally {
                conn.setAutoCommit(true);
            }

            // Successful request response
            resp.put("status", "SUCCESS");
            resp.put("message",
                    "Email verification request created successfully.");

            resp.put("newEmail", newEmail);
            resp.put("expiresAt", expiry.toString());

            // Never expose OTP in production
            if (devReturnOtp) {
                resp.put("verificationCode", otpString);
            }

            resp.put("smtpConfigured", false);

            return ResponseEntity.ok(resp);

        } catch (Exception e) {

            AppLogger.severe(
                    "[EmailVerification] Database error during email change request", e);

            resp.put("status", "ERROR");
            resp.put("message",
                    "Unable to process your request. Please try again.");

            return ResponseEntity.internalServerError().body(resp);
        }
    }

    /**
     * Verifies OTP and applies the email change.
     */
    @PostMapping("/verify-change")
    public ResponseEntity<Map<String, Object>> verifyEmailChange(
            @RequestBody Map<String, Object> request) {

        Map<String, Object> resp = new LinkedHashMap<>();

        int userId;

        try {
            userId = ((Number) request.get("userId")).intValue();
        } catch (Exception e) {
            resp.put("status", "ERROR");
            resp.put("message", "Invalid user ID.");
            return ResponseEntity.badRequest().body(resp);
        }

        String newEmail = request.get("newEmail") instanceof String
                ? ((String) request.get("newEmail")).trim().toLowerCase()
                : null;

        String enteredOtp = request.get("otpCode") instanceof String
                ? ((String) request.get("otpCode")).trim()
                : null;

        // Validate request
        if (userId <= 0
                || !isValidInstitutionalEmail(newEmail)
                || enteredOtp == null
                || !enteredOtp.matches("\\d{6}")) {

            resp.put("status", "ERROR");
            resp.put("message",
                    "Invalid institutional email or verification code.");

            return ResponseEntity.badRequest().body(resp);
        }

        String enteredHash = hashString(enteredOtp);

        boolean verified = false;

        try (Connection conn = DBConnection.getConnection()) {

            conn.setAutoCommit(false);

            try {

                int verificationId = -1;

                // Find matching unexpired OTP
                try (PreparedStatement ps = conn.prepareStatement(
                        "SELECT id FROM email_verifications " +
                                "WHERE user_id = ? " +
                                "AND new_email = ? " +
                                "AND otp_hash = ? " +
                                "AND status = 'PENDING' " +
                                "AND expires_at > NOW() " +
                                "ORDER BY id DESC LIMIT 1")) {

                    ps.setInt(1, userId);
                    ps.setString(2, newEmail);
                    ps.setString(3, enteredHash);

                    try (ResultSet rs = ps.executeQuery()) {

                        if (rs.next()) {
                            verificationId = rs.getInt("id");
                        }
                    }
                }

                if (verificationId > 0) {

                    // Update primary account email
                    int updatedRows;

                    try (PreparedStatement ps = conn.prepareStatement(
                            "UPDATE users SET email = ? WHERE id = ?")) {

                        ps.setString(1, newEmail);
                        ps.setInt(2, userId);

                        updatedRows = ps.executeUpdate();
                    }

                    if (updatedRows != 1) {
                        throw new IllegalStateException(
                                "Unable to update account email.");
                    }

                    // Mark verification as completed
                    try (PreparedStatement ps = conn.prepareStatement(
                            "UPDATE email_verifications " +
                                    "SET status = 'VERIFIED' WHERE id = ?")) {

                        ps.setInt(1, verificationId);

                        if (ps.executeUpdate() != 1) {
                            throw new IllegalStateException(
                                    "Unable to update verification status.");
                        }
                    }

                    conn.commit();
                    verified = true;

                    AppLogger.info(
                            "[EmailVerification] Email successfully updated for user "
                                    + userId);

                } else {

                    conn.rollback();
                }

            } catch (Exception e) {

                conn.rollback();

                AppLogger.severe(
                        "[EmailVerification] Verification transaction failed", e);

                resp.put("status", "ERROR");
                resp.put("message",
                        "Unable to verify email. Please try again.");

                return ResponseEntity.internalServerError().body(resp);

            } finally {

                conn.setAutoCommit(true);
            }

        } catch (Exception e) {

            AppLogger.severe(
                    "[EmailVerification] Database unavailable during verification", e);

            resp.put("status", "ERROR");
            resp.put("message",
                    "Verification service is temporarily unavailable.");

            return ResponseEntity.internalServerError().body(resp);
        }

        if (verified) {

            resp.put("status", "SUCCESS");
            resp.put("message",
                    "Your institutional email has been successfully verified and updated.");

            resp.put("updatedEmail", newEmail);

            return ResponseEntity.ok(resp);

        } else {

            resp.put("status", "INVALID_CODE");
            resp.put("message",
                    "The verification code is incorrect or has expired. Please try again.");

            return ResponseEntity.badRequest().body(resp);
        }
    }

    /**
     * Validates institutional email format and exact domain.
     */
    private boolean isValidInstitutionalEmail(String email) {

        if (email == null || email.isBlank() || allowedDomain == null) {
            return false;
        }

        String normalizedEmail = email.trim().toLowerCase();

        String domain = allowedDomain.trim()
                .toLowerCase()
                .replaceFirst("^@", "");

        // Validate email format
        if (!normalizedEmail.matches(
                "^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,}$")) {

            return false;
        }

        // Extract actual domain
        String actualDomain = normalizedEmail.substring(
                normalizedEmail.lastIndexOf("@") + 1);

        // Exact domain comparison
        return actualDomain.equals(domain);
    }

    /**
     * Generates SHA-256 hash of OTP.
     */
    private String hashString(String input) {

        try {

            MessageDigest md = MessageDigest.getInstance("SHA-256");

            byte[] bytes = md.digest(
                    input.getBytes(StandardCharsets.UTF_8));

            StringBuilder sb = new StringBuilder();

            for (byte b : bytes) {
                sb.append(String.format("%02x", b));
            }

            return sb.toString();

        } catch (Exception e) {

            throw new IllegalStateException(
                    "Unable to generate OTP hash.", e);
        }
    }
}
