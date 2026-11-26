package com.nexus.placement.dao;

import java.util.List;

/**
 * Generic Data Access Object interface providing standard CRUD operations.
 *
 * @param <T>  the entity type
 * @param <ID> the primary key identifier type
 */
public interface GenericDAO<T, ID> {

    /**
     * Persists a new entity into the database.
     *
     * @param entity the entity to persist
     * @return generated ID or status code
     */
    ID save(T entity);

    /**
     * Retrieves an entity by its unique primary key identifier.
     *
     * @param id the primary key
     * @return the entity, or null if not found
     */
    T findById(ID id);

    /**
     * Retrieves all entities of type T from the database.
     *
     * @return list of entities
     */
    List<T> findAll();

    /**
     * Updates an existing entity in the database.
     *
     * @param entity the entity with updated values
     * @return true if updated successfully, false otherwise
     */
    boolean update(T entity);

    /**
     * Deletes an entity by its primary key identifier.
     *
     * @param id the primary key of the record to delete
     * @return true if deleted successfully, false otherwise
     */
    boolean delete(ID id);

    /**
     * Checks if a record exists with the given primary key identifier.
     *
     * @param id the primary key
     * @return true if record exists, false otherwise
     */
    boolean existsById(ID id);
}
