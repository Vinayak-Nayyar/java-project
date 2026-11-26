package com.nexus.placement.dao;

import com.nexus.placement.model.Company;
import com.nexus.placement.util.AppLogger;

import java.sql.*;

/**
 * JDBC implementation of CompanyDAO extending AbstractGenericDAO.
 * Implements parameterized queries, try-with-resources, and centralized logging.
 */
public class CompanyDAOImpl extends AbstractGenericDAO<Company, Integer> implements CompanyDAO {

    @Override
    protected String getTableName() {
        return "companies";
    }

    @Override
    protected String getPrimaryKeyColumn() {
        return "id";
    }

    @Override
    protected Company mapRow(ResultSet rs) throws SQLException {
        Company company = new Company();
        company.setId(rs.getInt("id"));
        company.setName(rs.getString("name"));
        company.setIndustry(rs.getString("industry"));
        company.setLocation(rs.getString("location"));
        company.setWebsite(rs.getString("website"));
        company.setContactEmail(rs.getString("contact_email"));
        company.setDescription(rs.getString("description"));
        company.setCreatedAt(rs.getTimestamp("created_at"));
        return company;
    }

    @Override
    public Integer save(Company company) {
        String sql = "INSERT INTO companies (name, industry, location, website, contact_email, description) " +
                     "VALUES (?, ?, ?, ?, ?, ?)";
        try (Connection conn = getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql, Statement.RETURN_GENERATED_KEYS)) {

            pstmt.setString(1, company.getName());
            pstmt.setString(2, company.getIndustry());
            pstmt.setString(3, company.getLocation());
            pstmt.setString(4, company.getWebsite());
            pstmt.setString(5, company.getContactEmail());
            pstmt.setString(6, company.getDescription());

            int affectedRows = pstmt.executeUpdate();
            if (affectedRows > 0) {
                try (ResultSet generatedKeys = pstmt.getGeneratedKeys()) {
                    if (generatedKeys.next()) {
                        int generatedId = generatedKeys.getInt(1);
                        company.setId(generatedId);
                        AppLogger.info("[CompanyDAO] Inserted company successfully: " + company.getName() + " (ID: " + generatedId + ")");
                        return generatedId;
                    }
                }
            }
            return -1;
        } catch (SQLException e) {
            AppLogger.severe("[CompanyDAO] Error executing INSERT for company: " + company.getName(), e);
            return -1;
        }
    }

    @Override
    public boolean update(Company company) {
        String sql = "UPDATE companies SET name = ?, industry = ?, location = ?, website = ?, " +
                     "contact_email = ?, description = ? WHERE id = ?";

        try (Connection conn = getConnection();
             PreparedStatement pstmt = conn.prepareStatement(sql)) {

            pstmt.setString(1, company.getName());
            pstmt.setString(2, company.getIndustry());
            pstmt.setString(3, company.getLocation());
            pstmt.setString(4, company.getWebsite());
            pstmt.setString(5, company.getContactEmail());
            pstmt.setString(6, company.getDescription());
            pstmt.setInt(7, company.getId());

            int affectedRows = pstmt.executeUpdate();
            boolean success = affectedRows > 0;
            if (success) {
                AppLogger.info("[CompanyDAO] Updated company successfully (ID: " + company.getId() + ")");
            } else {
                AppLogger.warning("[CompanyDAO] No company updated for ID: " + company.getId());
            }
            return success;
        } catch (SQLException e) {
            AppLogger.severe("[CompanyDAO] Error executing UPDATE for company ID: " + company.getId(), e);
            return false;
        }
    }
}
