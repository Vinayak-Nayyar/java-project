package com.nexus.placement.dao;

import com.nexus.placement.util.AppLogger;
import com.nexus.placement.util.DBConnection;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.ArrayList;
import java.util.List;

/**
 * Reusable abstract base class implementing common GenericDAO database operations.
 * Uses PreparedStatements, handles SQLExceptions, and manages resources with try-with-resources.
 *
 * @param <T>  the entity type
 * @param <ID> the primary key identifier type (e.g. Integer)
 */
public abstract class AbstractGenericDAO<T, ID> implements GenericDAO<T, ID> {

    /**
     * Functional interface for mapping a database ResultSet row to an entity.
     *
     * @param <T> the entity type
     */
    @FunctionalInterface
    public interface RowMapper<T> {
        T mapRow(ResultSet rs) throws SQLException;
    }

    /**
     * Returns the name of the database table associated with this DAO.
     */
    protected abstract String getTableName();

    /**
     * Returns the primary key column name (e.g. "id").
     */
    protected abstract String getPrimaryKeyColumn();

    /**
     * Maps the current row of the ResultSet to an instance of T.
     */
    protected abstract T mapRow(ResultSet rs) throws SQLException;

    /**
     * Obtains a new database connection from the central DBConnection pool.
     */
    protected Connection getConnection() throws SQLException {
        return DBConnection.getConnection();
    }

    @Override
    public T findById(ID id) {
        String sql = "SELECT * FROM " + getTableName() + " WHERE " + getPrimaryKeyColumn() + " = ?";
        try (Connection conn = getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            setStatementParam(ps, 1, id);
            try (ResultSet rs = ps.executeQuery()) {
                if (rs.next()) {
                    T entity = mapRow(rs);
                    AppLogger.info("[" + getClass().getSimpleName() + "] Retrieved entity with ID " + id);
                    return entity;
                }
            }
        } catch (SQLException e) {
            AppLogger.severe("[" + getClass().getSimpleName() + "] Error in findById(" + id + ")", e);
        }
        return null;
    }

    @Override
    public List<T> findAll() {
        List<T> list = new ArrayList<>();
        String sql = "SELECT * FROM " + getTableName() + " ORDER BY " + getPrimaryKeyColumn() + " ASC";
        try (Connection conn = getConnection();
             PreparedStatement ps = conn.prepareStatement(sql);
             ResultSet rs = ps.executeQuery()) {

            while (rs.next()) {
                list.add(mapRow(rs));
            }
            AppLogger.info("[" + getClass().getSimpleName() + "] Retrieved " + list.size() + " records from " + getTableName());
        } catch (SQLException e) {
            AppLogger.severe("[" + getClass().getSimpleName() + "] Error in findAll() on " + getTableName(), e);
        }
        return list;
    }

    @Override
    public boolean delete(ID id) {
        String sql = "DELETE FROM " + getTableName() + " WHERE " + getPrimaryKeyColumn() + " = ?";
        try (Connection conn = getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            setStatementParam(ps, 1, id);
            int affected = ps.executeUpdate();
            boolean success = affected > 0;
            if (success) {
                AppLogger.info("[" + getClass().getSimpleName() + "] Deleted record with ID " + id + " from " + getTableName());
            } else {
                AppLogger.warning("[" + getClass().getSimpleName() + "] Record with ID " + id + " not found for deletion in " + getTableName());
            }
            return success;
        } catch (SQLException e) {
            AppLogger.severe("[" + getClass().getSimpleName() + "] Error in delete(" + id + ") on " + getTableName(), e);
            return false;
        }
    }

    @Override
    public boolean existsById(ID id) {
        String sql = "SELECT 1 FROM " + getTableName() + " WHERE " + getPrimaryKeyColumn() + " = ? LIMIT 1";
        try (Connection conn = getConnection();
             PreparedStatement ps = conn.prepareStatement(sql)) {

            setStatementParam(ps, 1, id);
            try (ResultSet rs = ps.executeQuery()) {
                return rs.next();
            }
        } catch (SQLException e) {
            AppLogger.severe("[" + getClass().getSimpleName() + "] Error in existsById(" + id + ") on " + getTableName(), e);
            return false;
        }
    }

    /**
     * Helper to set parameter values on a PreparedStatement dynamically based on type.
     */
    protected void setStatementParam(PreparedStatement ps, int paramIndex, Object value) throws SQLException {
        if (value == null) {
            ps.setNull(paramIndex, java.sql.Types.NULL);
        } else if (value instanceof Integer) {
            ps.setInt(paramIndex, (Integer) value);
        } else if (value instanceof Long) {
            ps.setLong(paramIndex, (Long) value);
        } else if (value instanceof String) {
            ps.setString(paramIndex, (String) value);
        } else if (value instanceof java.math.BigDecimal) {
            ps.setBigDecimal(paramIndex, (java.math.BigDecimal) value);
        } else if (value instanceof java.sql.Date) {
            ps.setDate(paramIndex, (java.sql.Date) value);
        } else if (value instanceof java.sql.Timestamp) {
            ps.setTimestamp(paramIndex, (java.sql.Timestamp) value);
        } else if (value instanceof Boolean) {
            ps.setBoolean(paramIndex, (Boolean) value);
        } else {
            ps.setObject(paramIndex, value);
        }
    }
}
