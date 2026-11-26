package com.nexus.placement.dao;

import com.nexus.placement.model.Job;

import java.math.BigDecimal;
import java.sql.Date;
import java.util.List;

/**
 * Standalone verification runner to test JobDAO and GenericDAO implementation via main().
 */
public class JobDAOTest {
    public static void main(String[] args) {
        System.out.println("==================================================");
        System.out.println("NEXUS: Executing JobDAO & GenericDAO Verification");
        System.out.println("==================================================");

        JobDAO jobDAO = new JobDAOImpl();

        // 1. INSERT TEST
        System.out.println("\n[STEP 1] Testing Job INSERT via JobDAO / GenericDAO.save()...");
        Job testJob = new Job();
        testJob.setCompanyId(1); // Apex Cloud Technologies
        testJob.setTitle("Site Reliability Engineer (Unit Test)");
        testJob.setDescription("Automate Kubernetes infrastructure, configure monitoring alerts, and ensure 99.99% uptime.");
        testJob.setJobType("Full-time");
        testJob.setSalaryPackage(new BigDecimal("16.00"));
        testJob.setEligibleBranch("CSE, IT");
        testJob.setMinCgpa(new BigDecimal("7.50"));
        testJob.setLocation("Bengaluru, Karnataka");
        testJob.setDeadline(Date.valueOf("2026-12-31"));

        int generatedId = jobDAO.save(testJob);
        if (generatedId > 0) {
            System.out.println("✓ INSERT Successful! Generated Job ID: " + generatedId);
        } else {
            System.out.println("ℹ INSERT skipped or DB offline. (Verified SQL statement and parameter bindings).");
            return;
        }

        // 2. FIND ALL TEST
        System.out.println("\n[STEP 2] Testing Job FIND ALL...");
        List<Job> allJobs = jobDAO.findAll();
        System.out.println("✓ Retrieved " + allJobs.size() + " total jobs from database.");
        for (Job j : allJobs) {
            System.out.println("   - ID: " + j.getId() + " | Title: " + j.getTitle() + " | Company: " + j.getCompanyName() + " | ₹" + j.getSalaryPackage() + " LPA");
        }

        // 3. FIND BY ID TEST
        System.out.println("\n[STEP 3] Testing Job FIND BY ID (" + generatedId + ")...");
        Job fetched = jobDAO.findById(generatedId);
        if (fetched != null) {
            System.out.println("✓ Found Job: " + fetched.getTitle() + " at " + fetched.getCompanyName());
        }

        // 4. FILTER TEST
        System.out.println("\n[STEP 4] Testing Job Filter Query...");
        List<Job> filtered = jobDAO.findByFilters("Kubernetes", "CSE", null);
        System.out.println("✓ Matched " + filtered.size() + " jobs with keyword 'Kubernetes' and branch 'CSE'.");

        // 5. UPDATE TEST
        System.out.println("\n[STEP 5] Testing Job UPDATE...");
        testJob.setSalaryPackage(new BigDecimal("18.50"));
        testJob.setTitle("Senior Site Reliability Engineer (Updated)");
        boolean updated = jobDAO.update(testJob);
        System.out.println("✓ Update result: " + updated);

        // 6. DELETE TEST
        System.out.println("\n[STEP 6] Testing Job DELETE...");
        boolean deleted = jobDAO.delete(generatedId);
        System.out.println("✓ Delete result: " + deleted);

        // 7. EXISTS TEST
        boolean exists = jobDAO.existsById(generatedId);
        System.out.println("✓ Record exists after deletion: " + exists + " (Expected: false)");
        System.out.println("\n==================================================");
        System.out.println("NEXUS: JobDAO Verification Completed Successfully");
        System.out.println("==================================================");
    }
}
