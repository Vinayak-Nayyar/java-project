package com.nexus.placement.dao;

import com.nexus.placement.model.Student;
import com.nexus.placement.util.AppLogger;
// import com.nexus.placement.util.DBConnection;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

/**
 * JDBC implementation of StudentDAO extending AbstractGenericDAO.
 * Ensures consistent source of truth across users, students, and student_skills
 * tables.
 */
public class StudentDAOImpl extends AbstractGenericDAO<Student, Integer> implements StudentDAO {
    private final SkillDAO skillDAO = new SkillDAOImpl();

    @Override
    protected String getTableName() {
        return "students";
    }

    @Override
    protected String getPrimaryKeyColumn() {
        return "id";
    }

    @Override
    protected Student mapRow(ResultSet rs) throws SQLException {
        Student s = new Student();
        s.setStudentId(rs.getInt("student_id"));
        s.setId(rs.getInt("user_id"));
        s.setName(rs.getString("name"));
        s.setEmail(rs.getString("email"));
        s.setRollNumber(rs.getString("roll_number"));
        s.setBranch(rs.getString("branch"));
        s.setCgpa(rs.getBigDecimal("cgpa"));
        s.setGraduationYear(rs.getInt("graduation_year"));
        s.setPhone(rs.getString("phone"));
        s.setResumeUrl(rs.getString("resume_url"));
        s.setCollege(rs.getString("college"));
        s.setDegree(rs.getString("degree"));
        s.setLocation(rs.getString("location"));
        return s;
    }

    private static final String BASE_STUDENT_QUERY = "SELECT s.id AS student_id, s.user_id, u.name, u.email, s.roll_number, s.branch, "
            +
            "s.cgpa, s.graduation_year, s.phone, s.resume_url, " +
            "COALESCE(s.college, 'National Institute of Technology, Karnataka') AS college, " +
            "COALESCE(s.degree, 'Bachelor of Technology (B.Tech)') AS degree, " +
            "COALESCE(s.location, 'Bengaluru, Karnataka') AS location " +
            "FROM students s " +
            "JOIN users u ON s.user_id = u.id ";

    @Override
    public List<Student> findAll() {
        List<Student> list = new ArrayList<>();
        String sql = BASE_STUDENT_QUERY + "ORDER BY s.id ASC";

        try (Connection conn = getConnection();
                PreparedStatement ps = conn.prepareStatement(sql);
                ResultSet rs = ps.executeQuery()) {

            while (rs.next()) {
                Student s = mapRow(rs);
                List<String> skills = skillDAO.getSkillsByStudentId(s.getStudentId());
                s.setSkills(skills);
                list.add(s);
            }
            AppLogger.info("[StudentDAO] Retrieved " + list.size() + " total students.");
        } catch (SQLException e) {
            AppLogger.severe("[StudentDAO] Error in findAll()", e);
        }
        return list;
    }

    @Override
    public Student findById(Integer studentId) {
        String sql = BASE_STUDENT_QUERY + "WHERE s.id = ?";

        try (Connection conn = getConnection();
                PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setInt(1, studentId);
            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) {
                    Student s = mapRow(rs);
                    List<String> skills = skillDAO.getSkillsByStudentId(s.getStudentId());
                    s.setSkills(skills);
                    AppLogger.info("[StudentDAO] Found student by studentId " + studentId + " (" + s.getName() + ")");
                    return s;
                }
            }
        } catch (SQLException e) {
            AppLogger.severe("[StudentDAO] Error in findById(" + studentId + ")", e);
        }
        return null;
    }

    @Override
    public Student findByUserId(int userId) {
        String sql = BASE_STUDENT_QUERY + "WHERE s.user_id = ?";

        try (Connection conn = getConnection();
                PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setInt(1, userId);
            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) {
                    Student s = mapRow(rs);
                    List<String> skills = skillDAO.getSkillsByStudentId(s.getStudentId());
                    s.setSkills(skills);
                    AppLogger.info("[StudentDAO] Found student by userId " + userId + " (" + s.getName() + ")");
                    return s;
                }
            }
        } catch (SQLException e) {
            AppLogger.severe("[StudentDAO] Error executing findByUserId(" + userId + ")", e);
        }
        return null;
    }

    @Override
    public Integer save(Student student) {
        String insertUserSql = "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, 'STUDENT')";
        String insertStudentSql = "INSERT INTO students (user_id, roll_number, branch, cgpa, graduation_year, " +
                "phone, resume_url, college, degree, location) " +
                "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

        try (Connection conn = getConnection()) {
            conn.setAutoCommit(false);
            try {
                int userId = student.getId();
                // If user doesn't already exist, create user record first
                if (userId <= 0) {
                    try (PreparedStatement psUser = conn.prepareStatement(insertUserSql,
                            Statement.RETURN_GENERATED_KEYS)) {
                        psUser.setString(1, student.getName());
                        psUser.setString(2, student.getEmail());
                        psUser.setString(3, student.getPassword() != null ? student.getPassword() : "Student@123");
                        psUser.executeUpdate();
                        try (ResultSet uKeys = psUser.getGeneratedKeys()) {
                            if (uKeys.next()) {
                                userId = uKeys.getInt(1);
                                student.setId(userId);
                            }
                        }
                    }
                }

                int studentId = -1;
                try (PreparedStatement psStudent = conn.prepareStatement(insertStudentSql,
                        Statement.RETURN_GENERATED_KEYS)) {
                    psStudent.setInt(1, userId);
                    psStudent.setString(2, student.getRollNumber());
                    psStudent.setString(3, student.getBranch());
                    psStudent.setBigDecimal(4, student.getCgpa());
                    psStudent.setInt(5, student.getGraduationYear());
                    psStudent.setString(6, student.getPhone());
                    psStudent.setString(7, student.getResumeUrl());
                    psStudent.setString(8, student.getCollege() != null ? student.getCollege()
                            : "National Institute of Technology, Karnataka");
                    psStudent.setString(9,
                            student.getDegree() != null ? student.getDegree() : "Bachelor of Technology (B.Tech)");
                    psStudent.setString(10,
                            student.getLocation() != null ? student.getLocation() : "Bengaluru, Karnataka");

                    psStudent.executeUpdate();
                    try (ResultSet sKeys = psStudent.getGeneratedKeys()) {
                        if (sKeys.next()) {
                            studentId = sKeys.getInt(1);
                            student.setStudentId(studentId);
                        }
                    }
                }

                conn.commit();

                // Sync initial skills if provided
                if (studentId > 0 && student.getSkills() != null && !student.getSkills().isEmpty()) {
                    skillDAO.syncStudentSkills(studentId, student.getSkills());
                }

                AppLogger.info("[StudentDAO] Created student successfully (StudentID: " + studentId + ", UserID: "
                        + userId + ")");
                return studentId;
            } catch (SQLException e) {
                conn.rollback();
                AppLogger.severe("[StudentDAO] Rollback during save(Student)", e);
                return -1;
            } finally {
                conn.setAutoCommit(true);
            }
        } catch (SQLException e) {
            AppLogger.severe("[StudentDAO] Database error during save(Student)", e);
            return -1;
        }
    }

    @Override
    public boolean update(Student student) {
        return updateAcademicProfile(student);
    }

    @Override
    public boolean updateAcademicProfile(Student student) {
        String updateStudentsSql = "UPDATE students SET branch = ?, cgpa = ?, graduation_year = ?, " +
                "phone = ?, college = ?, degree = ?, location = ?, resume_url = ? " +
                "WHERE user_id = ?";

        String updateUsersSql = "UPDATE users SET name = ? WHERE id = ?";

        try (Connection conn = getConnection()) {
            conn.setAutoCommit(false);
            try {
                // Update students table
                try (PreparedStatement ps = conn.prepareStatement(updateStudentsSql)) {
                    ps.setString(1, student.getBranch());
                    ps.setBigDecimal(2, student.getCgpa());
                    ps.setInt(3, student.getGraduationYear());
                    ps.setString(4, student.getPhone());
                    ps.setString(5, student.getCollege());
                    ps.setString(6, student.getDegree());
                    ps.setString(7, student.getLocation());
                    ps.setString(8, student.getResumeUrl());
                    ps.setInt(9, student.getId()); // user_id
                    ps.executeUpdate();
                }

                // Update users table name
                if (student.getName() != null && !student.getName().trim().isEmpty()) {
                    try (PreparedStatement psUser = conn.prepareStatement(updateUsersSql)) {
                        psUser.setString(1, student.getName().trim());
                        psUser.setInt(2, student.getId());
                        psUser.executeUpdate();
                    }
                }

                conn.commit();

                // Sync skills if provided
                if (student.getStudentId() > 0 && student.getSkills() != null) {
                    skillDAO.syncStudentSkills(student.getStudentId(), student.getSkills());
                }

                AppLogger.info("[StudentDAO] Updated academic profile for student user ID " + student.getId());
                return true;
            } catch (SQLException e) {
                conn.rollback();
                AppLogger.severe("[StudentDAO] Rollback during updateAcademicProfile", e);
                return false;
            } finally {
                conn.setAutoCommit(true);
            }
        } catch (SQLException e) {
            AppLogger.severe("[StudentDAO] Database error during updateAcademicProfile", e);
            return false;
        }
    }
}
