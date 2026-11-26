package com.nexus.placement.model;

import java.sql.Timestamp;

/**
 * Model class representing a recruiting company.
 * Maps to the companies table.
 */
public class Company {
    private int id;
    private String name;
    private String industry;
    private String location;
    private String website;
    private String contactEmail;
    private String description;
    private Timestamp createdAt;

    public Company() {
    }

    // Constructor without ID (useful for INSERT operations)
    public Company(String name, String industry, String location, String website, String contactEmail, String description) {
        this.name = name;
        this.industry = industry;
        this.location = location;
        this.website = website;
        this.contactEmail = contactEmail;
        this.description = description;
    }

    // Full constructor
    public Company(int id, String name, String industry, String location, String website,
                   String contactEmail, String description, Timestamp createdAt) {
        this.id = id;
        this.name = name;
        this.industry = industry;
        this.location = location;
        this.website = website;
        this.contactEmail = contactEmail;
        this.description = description;
        this.createdAt = createdAt;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getIndustry() {
        return industry;
    }

    public void setIndustry(String industry) {
        this.industry = industry;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public String getWebsite() {
        return website;
    }

    public void setWebsite(String website) {
        this.website = website;
    }

    public String getContactEmail() {
        return contactEmail;
    }

    public void setContactEmail(String contactEmail) {
        this.contactEmail = contactEmail;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public Timestamp getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Timestamp createdAt) {
        this.createdAt = createdAt;
    }

    @Override
    public String toString() {
        return "Company{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", industry='" + industry + '\'' +
                ", location='" + location + '\'' +
                ", website='" + website + '\'' +
                ", contactEmail='" + contactEmail + '\'' +
                ", description='" + description + '\'' +
                ", createdAt=" + createdAt +
                '}';
    }
}
