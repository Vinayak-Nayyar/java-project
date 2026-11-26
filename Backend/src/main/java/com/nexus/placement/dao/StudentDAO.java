package com.nexus.placement.dao;

import com.nexus.placement.model.Student;
// import java.util.List;

/**
 * Data Access Object interface for Student entity operations.
 * Extends GenericDAO to provide standard CRUD and specialized academic profile
 * lookups.
 */
public interface StudentDAO extends GenericDAO<Student, Integer> {

    /**
     * Backward-compatible alias for save(Student).
     */
    default int insert(Student student) {
        Integer id = save(student);
        return id != null ? id : -1;
    }

    /**
     * Finds a student profile by their associated user_id foreign key.
     *
     * @param userId primary key in the users table
     * @return Student object, or null
     */
    Student findByUserId(int userId);

    /**
     * Updates a student's academic profile (CGPA, branch, graduation year, skills)
     * with ACID transactional consistency across users and students tables.
     *
     * @param student updated student object
     * @return true if updated successfully, false otherwise
     */
    boolean updateAcademicProfile(Student student);
}
