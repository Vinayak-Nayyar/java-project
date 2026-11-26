package com.nexus.placement.dao;

import com.nexus.placement.model.Company;
import java.util.List;

/**
 * Data Access Object interface for Company entity operations.
 * Extends GenericDAO to provide standardized CRUD operations.
 */
public interface CompanyDAO extends GenericDAO<Company, Integer> {

    /**
     * Backward-compatible alias for save(Company).
     *
     * @param company Company object with properties
     * @return generated primary key ID of the inserted company, or -1 if failed
     */
    default int insert(Company company) {
        Integer id = save(company);
        return id != null ? id : -1;
    }
}
