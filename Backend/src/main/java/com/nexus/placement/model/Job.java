package com.nexus.placement.model;

import java.math.BigDecimal;
import java.sql.Date;
import java.sql.Timestamp;

/**
 * Model class representing a Job posting published by a Company.
 * Maps to the jobs table.
 */
public class Job {
    private int id;
    private int companyId;
    private String companyName;
    private String title;
    private String description;
    private String jobType;
    private BigDecimal salaryPackage; // in LPA
    private String eligibleBranch;
    private BigDecimal minCgpa;
    private String location;
    private Date deadline;
    private Timestamp createdAt;

    public Job() {
    }

    // Full constructor
    public Job(int id, int companyId, String title, String description, String jobType,
               BigDecimal salaryPackage, String eligibleBranch, BigDecimal minCgpa,
               String location, Date deadline, Timestamp createdAt) {
        this.id = id;
        this.companyId = companyId;
        this.title = title;
        this.description = description;
        this.jobType = jobType;
        this.salaryPackage = salaryPackage;
        this.eligibleBranch = eligibleBranch;
        this.minCgpa = minCgpa;
        this.location = location;
        this.deadline = deadline;
        this.createdAt = createdAt;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public int getCompanyId() {
        return companyId;
    }

    public void setCompanyId(int companyId) {
        this.companyId = companyId;
    }

    public String getCompanyName() {
        return companyName;
    }

    public void setCompanyName(String companyName) {
        this.companyName = companyName;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public String getJobType() {
        return jobType;
    }

    public void setJobType(String jobType) {
        this.jobType = jobType;
    }

    public BigDecimal getSalaryPackage() {
        return salaryPackage;
    }

    public void setSalaryPackage(BigDecimal salaryPackage) {
        this.salaryPackage = salaryPackage;
    }

    public String getEligibleBranch() {
        return eligibleBranch;
    }

    public void setEligibleBranch(String eligibleBranch) {
        this.eligibleBranch = eligibleBranch;
    }

    public BigDecimal getMinCgpa() {
        return minCgpa;
    }

    public void setMinCgpa(BigDecimal minCgpa) {
        this.minCgpa = minCgpa;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public Date getDeadline() {
        return deadline;
    }

    public void setDeadline(Date deadline) {
        this.deadline = deadline;
    }

    public Timestamp getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Timestamp createdAt) {
        this.createdAt = createdAt;
    }

    @Override
    public String toString() {
        return "Job{" +
                "id=" + id +
                ", companyId=" + companyId +
                ", title='" + title + '\'' +
                ", jobType='" + jobType + '\'' +
                ", salaryPackage=" + salaryPackage +
                ", eligibleBranch='" + eligibleBranch + '\'' +
                ", minCgpa=" + minCgpa +
                ", location='" + location + '\'' +
                ", deadline=" + deadline +
                ", createdAt=" + createdAt +
                '}';
    }
}
