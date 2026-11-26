package com.nexus.placement.dao;

import com.nexus.placement.model.Job;
import com.nexus.placement.util.AppLogger;

import java.sql.*;
import java.util.ArrayList;
import java.util.List;

/**
 * JDBC implementation of JobDAO extending AbstractGenericDAO.
 * Implements job queries, company joins, filtering, and CRUD operations.
 */
public class JobDAOImpl extends AbstractGenericDAO<Job, Integer> implements JobDAO {

    @Override
    protected String getTableName() {
        return "jobs";
    }

    @Override
    protected String getPrimaryKeyColumn() {
        return "id";
    }

    @Override
    protected Job mapRow(ResultSet rs) throws SQLException {
        Job job = new Job();
        job.setId(rs.getInt("id"));
        job.setCompanyId(rs.getInt("company_id"));
        job.setTitle(rs.getString("title"));
        job.setDescription(rs.getString("description"));
        job.setJobType(rs.getString("job_type"));
        job.setSalaryPackage(rs.getBigDecimal("salary_package"));
        job.setEligibleBranch(rs.getString("eligible_branch"));
        job.setMinCgpa(rs.getBigDecimal("min_cgpa"));
        job.setLocation(rs.getString("location"));
        job.setDeadline(rs.getDate("deadline"));
        job.setCreatedAt(rs.getTimestamp("created_at"));

        try {
            String cName = rs.getString("company_name");
            if (cName != null) {
                job.setCompanyName(cName);
            }
        } catch (SQLException ignored) {
            // column company_name might not be in generic SELECT *
        }

        return job;
    }

    private static final String BASE_JOIN_QUERY =
            "SELECT j.id, j.company_id, j.title, j.description, j.job_type, j.salary_package, " +
            "j.eligible_branch, j.min_cgpa, j.location, j.deadline, j.created_at, " +
            "c.name AS company_name " +
            "FROM jobs j " +
            "LEFT JOIN companies c ON j.company_id = c.id ";

    @Override
    public List<Job> findAll() {
        List<Job> list = new ArrayList<>();
        String sql = BASE_JOIN_QUERY + "ORDER BY j.id DESC";

        try (Connection conn = getConnection();
             PreparedStatement ps = conn.prepareStatement(sql);
             ResultSet rs = ps.executeQuery()) {

            while (rs.next()) {
                list.add(mapRow(rs));
            }
            AppLogger.info("[JobDAO] Retrieved " + list.size() + " total jobs from database.");
        } catch (SQLException e) {
            AppLogger.severe("[JobDAO] Error in findAll() with company JOIN", e);
        }
        return list;
    }

    @Override
    public Job findById(Integer id) {
        String sql = BASE_JOIN_QUERY + "WHERE j.id = ?";
        try (Connection conn = getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setInt(1, id);
            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) {
                    return mapRow(rs);
                }
            }
        } catch (SQLException e) {
            AppLogger.severe("[JobDAO] Error in findById(" + id + ")", e);
        }
        return null;
    }

    @Override
    public Integer save(Job job) {
        String sql = "INSERT INTO jobs (company_id, title, description, job_type, salary_package, " +
                     "eligible_branch, min_cgpa, location, deadline) " +
                     "VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";

        try (Connection conn = getConnection();
             PreparedStatement ps = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {

            ps.setInt(1, job.getCompanyId());
            ps.setString(2, job.getTitle());
            ps.setString(3, job.getDescription());
            ps.setString(4, job.getJobType() != null ? job.getJobType() : "Full-time");
            ps.setBigDecimal(5, job.getSalaryPackage());
            ps.setString(6, job.getEligibleBranch() != null ? job.getEligibleBranch() : "All Branches");
            ps.setBigDecimal(7, job.getMinCgpa() != null ? job.getMinCgpa() : new java.math.BigDecimal("6.00"));
            ps.setString(8, job.getLocation());
            ps.setDate(9, job.getDeadline());

            int affected = ps.executeUpdate();
            if (affected > 0) {
                try (ResultSet keys = ps.getGeneratedKeys()) {
                    if (keys.next()) {
                        int id = keys.getInt(1);
                        job.setId(id);
                        AppLogger.info("[JobDAO] Created job successfully: " + job.getTitle() + " (ID: " + id + ")");
                        return id;
                    }
                }
            }
            return -1;
        } catch (SQLException e) {
            AppLogger.severe("[JobDAO] Error executing save() for job: " + job.getTitle(), e);
            return -1;
        }
    }

    @Override
    public boolean update(Job job) {
        String sql = "UPDATE jobs SET company_id = ?, title = ?, description = ?, job_type = ?, " +
                     "salary_package = ?, eligible_branch = ?, min_cgpa = ?, location = ?, deadline = ? " +
                     "WHERE id = ?";

        try (Connection conn = getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setInt(1, job.getCompanyId());
            ps.setString(2, job.getTitle());
            ps.setString(3, job.getDescription());
            ps.setString(4, job.getJobType());
            ps.setBigDecimal(5, job.getSalaryPackage());
            ps.setString(6, job.getEligibleBranch());
            ps.setBigDecimal(7, job.getMinCgpa());
            ps.setString(8, job.getLocation());
            ps.setDate(9, job.getDeadline());
            ps.setInt(10, job.getId());

            int affected = ps.executeUpdate();
            boolean success = affected > 0;
            if (success) {
                AppLogger.info("[JobDAO] Updated job successfully (ID: " + job.getId() + ")");
            } else {
                AppLogger.warning("[JobDAO] No job found to update with ID: " + job.getId());
            }
            return success;
        } catch (SQLException e) {
            AppLogger.severe("[JobDAO] Error updating job ID: " + job.getId(), e);
            return false;
        }
    }

    @Override
    public List<Job> findByCompanyId(int companyId) {
        List<Job> list = new ArrayList<>();
        String sql = BASE_JOIN_QUERY + "WHERE j.company_id = ? ORDER BY j.id DESC";

        try (Connection conn = getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            ps.setInt(1, companyId);
            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    list.add(mapRow(rs));
                }
            }
            AppLogger.info("[JobDAO] Found " + list.size() + " jobs for company ID: " + companyId);
        } catch (SQLException e) {
            AppLogger.severe("[JobDAO] Error in findByCompanyId(" + companyId + ")", e);
        }
        return list;
    }

    @Override
    public List<Job> findActiveJobs() {
        List<Job> list = new ArrayList<>();
        String sql = BASE_JOIN_QUERY + "WHERE j.deadline >= CURRENT_DATE() ORDER BY j.deadline ASC";

        try (Connection conn = getConnection();
             PreparedStatement ps = conn.prepareStatement(sql);
             ResultSet rs = ps.executeQuery()) {

            while (rs.next()) {
                list.add(mapRow(rs));
            }
            AppLogger.info("[JobDAO] Found " + list.size() + " active jobs.");
        } catch (SQLException e) {
            AppLogger.severe("[JobDAO] Error in findActiveJobs()", e);
        }
        return list;
    }

    @Override
    public List<Job> findByFilters(String search, String branch, String category) {
        List<Job> list = new ArrayList<>();
        StringBuilder sql = new StringBuilder(BASE_JOIN_QUERY + "WHERE 1=1 ");
        List<Object> params = new ArrayList<>();

        if (search != null && !search.trim().isEmpty()) {
            String pattern = "%" + search.trim() + "%";
            sql.append("AND (j.title LIKE ? OR j.description LIKE ? OR c.name LIKE ? OR j.location LIKE ?) ");
            params.add(pattern);
            params.add(pattern);
            params.add(pattern);
            params.add(pattern);
        }

        if (branch != null && !branch.trim().isEmpty() && !branch.equalsIgnoreCase("ALL")) {
            sql.append("AND (j.eligible_branch LIKE ? OR j.eligible_branch = 'All Branches') ");
            params.add("%" + branch.trim() + "%");
        }

        if (category != null && !category.trim().isEmpty()) {
            switch (category.toLowerCase()) {
                case "remote":
                    sql.append("AND LOWER(j.location) LIKE '%remote%' ");
                    break;
                case "internship":
                    sql.append("AND LOWER(j.job_type) = 'internship' ");
                    break;
                case "highpackage":
                    sql.append("AND j.salary_package >= 14.00 ");
                    break;
                default:
                    break;
            }
        }

        sql.append("ORDER BY j.id DESC");

        try (Connection conn = getConnection();
             PreparedStatement ps = conn.prepareStatement(sql.toString())) {

            for (int i = 0; i < params.size(); i++) {
                setStatementParam(ps, i + 1, params.get(i));
            }

            try (ResultSet rs = ps.executeQuery()) {
                while (rs.next()) {
                    list.add(mapRow(rs));
                }
            }
            AppLogger.info("[JobDAO] Filters matched " + list.size() + " jobs.");
        } catch (SQLException e) {
            AppLogger.severe("[JobDAO] Error in findByFilters()", e);
        }
        return list;
    }
}
