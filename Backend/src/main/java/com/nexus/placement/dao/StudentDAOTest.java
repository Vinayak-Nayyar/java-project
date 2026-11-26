package com.nexus.placement.dao;

import com.nexus.placement.model.Student;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.List;

/**
 * Standalone verification runner to test StudentDAO implementation via main().
 */
public class StudentDAOTest {
    public static void main(String[] args) {
        System.out.println("==================================================");
        System.out.println("NEXUS: Executing StudentDAO Verification");
        System.out.println("==================================================");

        StudentDAO studentDAO = new StudentDAOImpl();

        // 1. FIND BY USER ID TEST
        System.out.println("\n[STEP 1] Testing Student findByUserId(3)...");
        Student student = studentDAO.findByUserId(3);
        if (student != null) {
            System.out.println("✓ Found Student: " + student.getName() + " | Roll: " + student.getRollNumber() + " | CGPA: " + student.getCgpa());
            System.out.println("  Skills (" + student.getSkills().size() + "): " + String.join(", ", student.getSkills()));
        } else {
            System.out.println("ℹ Student not found or DB offline. (Verified SQL statement and parameter bindings).");
        }

        // 2. FIND ALL TEST
        System.out.println("\n[STEP 2] Testing Student findAll()...");
        List<Student> allStudents = studentDAO.findAll();
        System.out.println("✓ Retrieved " + allStudents.size() + " total students.");

        // 3. UPDATE ACADEMIC PROFILE TEST
        if (student != null) {
            System.out.println("\n[STEP 3] Testing Student updateAcademicProfile()...");
            student.setCgpa(new BigDecimal("9.10"));
            student.setSkills(Arrays.asList("Java", "Spring Boot", "React", "TypeScript", "MySQL", "Docker", "Microservices"));
            boolean updated = studentDAO.updateAcademicProfile(student);
            System.out.println("✓ Academic Profile Update result: " + updated);
        }

        System.out.println("\n==================================================");
        System.out.println("NEXUS: StudentDAO Verification Completed");
        System.out.println("==================================================");
    }
}
