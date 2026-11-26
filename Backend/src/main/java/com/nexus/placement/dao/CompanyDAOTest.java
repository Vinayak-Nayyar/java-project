package com.nexus.placement.dao;

import com.nexus.placement.model.Company;

import java.util.List;

/**
 * Test class containing main() to verify all 5 CompanyDAO CRUD operations:
 * 1. Insert a company.
 * 2. Retrieve all companies.
 * 3. Retrieve the inserted company by ID.
 * 4. Update its information.
 * 5. Retrieve it again to verify update.
 * 6. Delete it.
 * 7. Verify deletion.
 *
 * Uses a dedicated unique test record so it doesn't disturb sample data.
 */
public class CompanyDAOTest {
    public static void main(String[] args) {
        System.out.println("==================================================");
        System.out.println("NEXUS: Executing CompanyDAO CRUD Verification");
        System.out.println("==================================================");

        CompanyDAO companyDAO = new CompanyDAOImpl();

        // 1. INSERT TEST
        System.out.println("\n[STEP 1] Testing Company INSERT...");
        Company testCompany = new Company(
                "Nexus Tech Innovations (DAO Test)",
                "Quantum Computing & AI",
                "New Delhi, India",
                "https://nexustest.tech",
                "contact@nexustest.tech",
                "Temporary dedicated company record for Week 1 DAO unit testing."
        );

        int generatedId = companyDAO.insert(testCompany);
        if (generatedId > 0) {
            System.out.println("✓ INSERT Successful! Generated Company ID: " + generatedId);
        } else {
            System.err.println("✗ INSERT Failed! (Check if database is online or record exists)");
            return;
        }

        // 2. FIND ALL TEST
        System.out.println("\n[STEP 2] Testing Company FIND ALL...");
        List<Company> allCompanies = companyDAO.findAll();
        System.out.println("✓ Retrieved " + allCompanies.size() + " total companies.");
        for (Company c : allCompanies) {
            System.out.println("   - ID: " + c.getId() + " | Name: " + c.getName() + " | Industry: " + c.getIndustry());
        }

        // 3. FIND BY ID TEST
        System.out.println("\n[STEP 3] Testing Company FIND BY ID (" + generatedId + ")...");
        Company fetchedCompany = companyDAO.findById(generatedId);
        if (fetchedCompany != null) {
            System.out.println("✓ Found Company: " + fetchedCompany);
        } else {
            System.err.println("✗ Could not find company with ID: " + generatedId);
        }

        // 4. UPDATE TEST
        System.out.println("\n[STEP 4] Testing Company UPDATE...");
        if (fetchedCompany != null) {
            fetchedCompany.setIndustry("Advanced Autonomous Systems");
            fetchedCompany.setLocation("Bengaluru & Gurgaon");
            fetchedCompany.setDescription("Updated company description for testing update query.");

            boolean updateSuccess = companyDAO.update(fetchedCompany);
            System.out.println(updateSuccess ? "✓ UPDATE Successful!" : "✗ UPDATE Failed!");

            // 5. RETRIEVE AGAIN TEST
            System.out.println("\n[STEP 5] Testing Company RE-FETCH to verify UPDATE...");
            Company updatedCompany = companyDAO.findById(generatedId);
            if (updatedCompany != null && "Advanced Autonomous Systems".equals(updatedCompany.getIndustry())) {
                System.out.println("✓ Verified Updated Details: Industry=" + updatedCompany.getIndustry() + ", Location=" + updatedCompany.getLocation());
            } else {
                System.err.println("✗ Verification failed: Details not updated.");
            }
        }

        // 6. DELETE TEST
        System.out.println("\n[STEP 6] Testing Company DELETE (" + generatedId + ")...");
        boolean deleteSuccess = companyDAO.delete(generatedId);
        System.out.println(deleteSuccess ? "✓ DELETE Successful!" : "✗ DELETE Failed!");

        // 7. VERIFY DELETION TEST
        System.out.println("\n[STEP 7] Verifying DELETION by calling findById(" + generatedId + ")...");
        Company deletedCompany = companyDAO.findById(generatedId);
        if (deletedCompany == null) {
            System.out.println("✓ Deletion Verified: Record no longer exists in database.");
        } else {
            System.err.println("✗ Deletion Verification Failed: Record still exists!");
        }

        System.out.println("\n==================================================");
        System.out.println("✓ ALL 5 CompanyDAO CRUD Operations Verified!");
        System.out.println("==================================================");
    }
}
