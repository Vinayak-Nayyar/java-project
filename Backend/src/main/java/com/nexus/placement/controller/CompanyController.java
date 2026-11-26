package com.nexus.placement.controller;

import com.nexus.placement.dao.CompanyDAO;
import com.nexus.placement.dao.CompanyDAOImpl;
import com.nexus.placement.model.Company;
import com.nexus.placement.util.AppLogger;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

/**
 * REST controller for Company management operations.
 * Maps to /api/companies.
 */
@RestController
@RequestMapping("/api/companies")
@CrossOrigin(origins = "*")
public class CompanyController {
    private final CompanyDAO companyDAO = new CompanyDAOImpl();

    /**
     * GET /api/companies - Retrieve all companies.
     */
    @GetMapping
    public ResponseEntity<List<Company>> getAllCompanies() {
        List<Company> companies = companyDAO.findAll();
        return ResponseEntity.ok(companies);
    }

    /**
     * GET /api/companies/{id} - Retrieve a single company by ID.
     */
    @GetMapping("/{id}")
    public ResponseEntity<?> getCompanyById(@PathVariable int id) {
        if (id <= 0) {
            Map<String, Object> error = new LinkedHashMap<>();
            error.put("status", "BAD_REQUEST");
            error.put("message", "Invalid company ID provided: " + id);
            return ResponseEntity.badRequest().body(error);
        }

        Company company = companyDAO.findById(id);
        if (company == null) {
            Map<String, Object> error = new LinkedHashMap<>();
            error.put("status", "NOT_FOUND");
            error.put("message", "Company not found with ID: " + id);
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(error);
        }

        return ResponseEntity.ok(company);
    }

    /**
     * POST /api/companies - Create a new company.
     */
    @PostMapping
    public ResponseEntity<?> createCompany(@RequestBody Company company) {
        Map<String, Object> resp = new LinkedHashMap<>();

        // Validation
        if (company.getName() == null || company.getName().trim().isEmpty()) {
            resp.put("status", "VALIDATION_ERROR");
            resp.put("message", "Company name is required.");
            return ResponseEntity.badRequest().body(resp);
        }
        if (company.getIndustry() == null || company.getIndustry().trim().isEmpty()) {
            resp.put("status", "VALIDATION_ERROR");
            resp.put("message", "Industry is required.");
            return ResponseEntity.badRequest().body(resp);
        }
        if (company.getLocation() == null || company.getLocation().trim().isEmpty()) {
            resp.put("status", "VALIDATION_ERROR");
            resp.put("message", "Location is required.");
            return ResponseEntity.badRequest().body(resp);
        }
        if (company.getContactEmail() == null || !company.getContactEmail().contains("@")) {
            resp.put("status", "VALIDATION_ERROR");
            resp.put("message", "A valid contact email is required.");
            return ResponseEntity.badRequest().body(resp);
        }

        int generatedId = companyDAO.save(company);
        if (generatedId > 0) {
            company.setId(generatedId);
            AppLogger.info("[CompanyController] Created company: " + company.getName() + " with ID " + generatedId);
            return ResponseEntity.status(HttpStatus.CREATED).body(company);
        } else {
            resp.put("status", "DATABASE_ERROR");
            resp.put("message", "Failed to insert company into database. Please verify uniqueness of name or database connection.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(resp);
        }
    }

    /**
     * PUT /api/companies/{id} - Update company details.
     */
    @PutMapping("/{id}")
    public ResponseEntity<?> updateCompany(@PathVariable int id, @RequestBody Company company) {
        Map<String, Object> resp = new LinkedHashMap<>();

        if (id <= 0) {
            resp.put("status", "BAD_REQUEST");
            resp.put("message", "Invalid company ID: " + id);
            return ResponseEntity.badRequest().body(resp);
        }

        // Validation
        if (company.getName() == null || company.getName().trim().isEmpty()) {
            resp.put("status", "VALIDATION_ERROR");
            resp.put("message", "Company name is required.");
            return ResponseEntity.badRequest().body(resp);
        }
        if (company.getIndustry() == null || company.getIndustry().trim().isEmpty()) {
            resp.put("status", "VALIDATION_ERROR");
            resp.put("message", "Industry is required.");
            return ResponseEntity.badRequest().body(resp);
        }
        if (company.getLocation() == null || company.getLocation().trim().isEmpty()) {
            resp.put("status", "VALIDATION_ERROR");
            resp.put("message", "Location is required.");
            return ResponseEntity.badRequest().body(resp);
        }
        if (company.getContactEmail() == null || !company.getContactEmail().contains("@")) {
            resp.put("status", "VALIDATION_ERROR");
            resp.put("message", "Valid contact email is required.");
            return ResponseEntity.badRequest().body(resp);
        }

        company.setId(id);
        boolean updated = companyDAO.update(company);
        if (updated) {
            AppLogger.info("[CompanyController] Updated company with ID " + id);
            return ResponseEntity.ok(company);
        } else {
            resp.put("status", "NOT_FOUND");
            resp.put("message", "Company with ID " + id + " not found or could not be updated.");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(resp);
        }
    }

    /**
     * DELETE /api/companies/{id} - Delete a company.
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteCompany(@PathVariable int id) {
        Map<String, Object> resp = new LinkedHashMap<>();

        if (id <= 0) {
            resp.put("status", "BAD_REQUEST");
            resp.put("message", "Invalid company ID: " + id);
            return ResponseEntity.badRequest().body(resp);
        }

        boolean deleted = companyDAO.delete(id);
        if (deleted) {
            resp.put("status", "SUCCESS");
            resp.put("message", "Company deleted successfully.");
            resp.put("id", id);
            AppLogger.info("[CompanyController] Deleted company with ID " + id);
            return ResponseEntity.ok(resp);
        } else {
            resp.put("status", "NOT_FOUND");
            resp.put("message", "Company with ID " + id + " not found or could not be deleted.");
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(resp);
        }
    }
}
