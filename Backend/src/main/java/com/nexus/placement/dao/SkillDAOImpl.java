package com.nexus.placement.dao;

import com.nexus.placement.model.Skill;
import com.nexus.placement.util.AppLogger;
import com.nexus.placement.util.DBConnection;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

public class SkillDAOImpl implements SkillDAO {

    @Override
    public List<Skill> findAll() {
        List<Skill> list = new ArrayList<>();
        String sql = "SELECT id, name, category FROM skills ORDER BY category, name";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql);
             ResultSet rs = ps.executeQuery()) {
            while (rs.next()) {
                list.add(new Skill(rs.getInt("id"), rs.getString("name"), rs.getString("category")));
            }
        } catch (SQLException e) {
            AppLogger.severe("[SkillDAO] Error executing findAll()", e);
        }
        return list;
    }

    @Override
    public List<String> getSkillsByStudentId(int studentId) {
        List<String> skills = new ArrayList<>();
        String sql = "SELECT s.name FROM skills s " +
                     "JOIN student_skills ss ON s.id = ss.skill_id " +
                     "WHERE ss.student_id = ? ORDER BY s.name";
        try (Connection conn = DBConnection.getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {
            ps.setInt(1, studentId);
            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    skills.add(rs.getString("name"));
                }
            }
        } catch (SQLException e) {
            AppLogger.severe("[SkillDAO] Error getSkillsByStudentId for student " + studentId, e);
        }
        return skills;
    }

    @Override
    public boolean syncStudentSkills(int studentId, List<String> skillNames) {
        String deleteSql = "DELETE FROM student_skills WHERE student_id = ?";
        String insertSql = "INSERT IGNORE INTO student_skills (student_id, skill_id) " +
                           "SELECT ?, id FROM skills WHERE name = ?";

        try (Connection conn = DBConnection.getConnection()) {
            conn.setAutoCommit(false);
            try {
                // Delete existing associations
                try (PreparedStatement psDel = conn.prepareStatement(deleteSql)) {
                    psDel.setInt(1, studentId);
                    psDel.executeUpdate();
                }

                // Insert updated skills
                if (skillNames != null && !skillNames.isEmpty()) {
                    try (PreparedStatement psIns = conn.prepareStatement(insertSql)) {
                        for (String skillName : skillNames) {
                            psIns.setInt(1, studentId);
                            psIns.setString(2, skillName.trim());
                            psIns.addBatch();
                        }
                        psIns.executeBatch();
                    }
                }

                conn.commit();
                AppLogger.info("[SkillDAO] Synced " + (skillNames != null ? skillNames.size() : 0) + " skills for student " + studentId);
                return true;
            } catch (SQLException e) {
                conn.rollback();
                AppLogger.severe("[SkillDAO] Rollback during syncStudentSkills for student " + studentId, e);
                return false;
            } finally {
                conn.setAutoCommit(true);
            }
        } catch (SQLException e) {
            AppLogger.severe("[SkillDAO] Database connection failure in syncStudentSkills", e);
            return false;
        }
    }
}
