package com.nexus.placement.controller;

import com.nexus.placement.dao.JobDAO;
import com.nexus.placement.dao.JobDAOImpl;
import com.nexus.placement.model.Job;
import com.nexus.placement.util.AppLogger;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/**
 * REST controller for Job postings management operations.
 * Maps to /api/jobs and /api/companies/{companyId}/jobs.
 */
@RestController
@RequestMapping("/api")
@CrossOrigin(origins = "*")
public class JobController {
    private final JobDAO jobDAO = new JobDAOImpl();

    /**
     * GET /api/jobs - Retrieve all jobs, optionally filtered by search, branch, or category.
     */
    @GetMapping("/jobs")
    public ResponseEntity<List<Job>> getJobs(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String branch,
            @RequestParam(required = false) String category) {

        List<Job> jobs;
        if ((search != null && !search.trim().isEmpty()) ||
            (branch != null && !branch.trim().isEmpty() && !branch.equalsIgnoreCase("ALL")) ||
            (category != null && !category.trim().isEmpty())) {
            jobs = jobDAO.findByFilters(search, branch, category);
        } else {
            jobs = jobDAO.findAll();
        }
        return ResponseEntity.ok(jobs);
    }

    /**
     * GET /api/jobs/{id} - Retrieve job by ID.
     */
    @GetMapping("/jobs/{id}")
    public ResponseEntity<?> getJobById(@PathVariable int id) {
        if (id <= 0) {
            Map<String, Object> error = new LinkedHashMap<>();
            error.put("status", "BAD_REQUEST");
            error.put("message", "Invalid job ID provided: " + id);
            return ResponseEntity.badRequest().body(error);
        }

        Job job = jobDAO.findById(id);
        if (job == null) {
            Map<String, Object> error = new LinkedHashMap<>();
            error.put("status", "NOT_FOUND");
            error.put("message", "Job opportunity not found with ID: " + id);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
        }

        return ResponseEntity.ok(job);
    }

    /**
     * GET /api/companies/{companyId}/jobs - Retrieve jobs by company.
     */
    @GetMapping("/companies/{companyId}/jobs")
    public ResponseEntity<List<Job>> getJobsByCompany(@PathVariable int companyId) {
        List<Job> jobs = jobDAO.findByCompanyId(companyId);
        return ResponseEntity.ok(jobs);
    }

    /**
     * POST /api/jobs - Create a new job opportunity.
     */
    @PostMapping("/jobs")
    public ResponseEntity<?> createJob(@RequestBody Job job) {
        Map<String, Object> resp = new LinkedHashMap<>();

        // Validation
        if (job.getTitle() == null || job.getTitle().trim().isEmpty()) {
            resp.put("status", "VALIDATION_ERROR");
            resp.put("message", "Job title is required.");
            return ResponseEntity.badRequest().body(resp);
        }
        if (job.getCompanyId() <= 0) {
            resp.put("status", "VALIDATION_ERROR");
            resp.put("message", "Valid company ID is required.");
            return ResponseEntity.badRequest().body(resp);
        }
        if (job.getSalaryPackage() == null || job.getSalaryPackage().compareTo(BigDecimal.ZERO) <= 0) {
            resp.put("status", "VALIDATION_ERROR");
            resp.put("message", "Valid salary package (LPA) is required.");
            return ResponseEntity.badRequest().body(resp);
        }
        if (job.getLocation() == null || job.getLocation().trim().isEmpty()) {
            resp.put("status", "VALIDATION_ERROR");
            resp.put("message", "Location is required.");
            return ResponseEntity.badRequest().body(resp);
        }
        if (job.getDeadline() == null) {
            resp.put("status", "VALIDATION_ERROR");
            resp.put("message", "Application deadline is required.");
            return ResponseEntity.badRequest().body(resp);
        }

        int generatedId = jobDAO.save(job);
        if (generatedId > 0) {
            job.setId(generatedId);
            AppLogger.info("[JobController] Created job: " + job.getTitle() + " (ID: " + generatedId + ")");
            return ResponseEntity.status(HttpStatus.CREATED).body(job);
        } else {
            resp.put("status", "DATABASE_ERROR");
            resp.put("message", "Failed to create job posting. Ensure associated company exists.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(resp);
        }
    }

    /**
     * PUT /api/jobs/{id} - Update job details.
     */
    @PutMapping("/jobs/{id}")
    public ResponseEntity<?> updateJob(@PathVariable int id, @RequestBody Job job) {
        Map<String, Object> resp = new LinkedHashMap<>();

        if (id <= 0) {
            resp.put("status", "BAD_REQUEST");
            resp.put("message", "Invalid job ID: " + id);
            return ResponseEntity.badRequest().body(resp);
        }

        if (job.getTitle() == null || job.getTitle().trim().isEmpty()) {
            resp.put("status", "VALIDATION_ERROR");
            resp.put("message", "Job title is required.");
            return ResponseEntity.badRequest().body(resp);
        }

        job.setId(id);
        boolean updated = jobDAO.update(job);
        if (updated) {
            AppLogger.info("[JobController] Updated job ID " + id);
            return ResponseEntity.ok(job);
        } else {
            resp.put("status", "NOT_FOUND");
            resp.put("message", "Job with ID " + id + " not found or update failed.");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(resp);
        }
    }

    /**
     * DELETE /api/jobs/{id} - Delete a job posting.
     */
    @DeleteMapping("/jobs/{id}")
    public ResponseEntity<?> deleteJob(@PathVariable int id) {
        Map<String, Object> resp = new LinkedHashMap<>();

        if (id <= 0) {
            resp.put("status", "BAD_REQUEST");
            resp.put("message", "Invalid job ID: " + id);
            return ResponseEntity.badRequest().body(resp);
        }

        boolean deleted = jobDAO.delete(id);
        if (deleted) {
            resp.put("status", "SUCCESS");
            resp.put("message", "Job deleted successfully.");
            resp.put("id", id);
            AppLogger.info("[JobController] Deleted job ID: " + id);
            return ResponseEntity.ok(resp);
        } else {
            resp.put("status", "NOT_FOUND");
            resp.put("message", "Job with ID " + id + " not found or could not be deleted.");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(resp);
        }
    }
}
