package com.nexus.placement.dao;

import com.nexus.placement.model.Job;
import java.util.List;

/**
 * Data Access Object interface for Job entity operations.
 * Extends GenericDAO to provide standard CRUD and specialized placement queries.
 */
public interface JobDAO extends GenericDAO<Job, Integer> {

    /**
     * Backward-compatible alias for save(Job).
     */
    default int insert(Job job) {
        Integer id = save(job);
        return id != null ? id : -1;
    }

    /**
     * Retrieves all jobs published by a specific company.
     *
     * @param companyId ID of the company
     * @return List of Jobs
     */
    List<Job> findByCompanyId(int companyId);

    /**
     * Retrieves active/open jobs whose application deadline has not yet passed.
     *
     * @return List of active Jobs
     */
    List<Job> findActiveJobs();

    /**
     * Filters jobs by search query, eligible branch, and special category filter.
     *
     * @param search   keyword matching title, description, or location
     * @param branch   academic branch requirement (or "ALL")
     * @param category category tag (e.g. "Remote", "Internship", "HighPackage")
     * @return filtered List of Jobs
     */
    List<Job> findByFilters(String search, String branch, String category);
}
