package com.nexus.placement.model;

import java.sql.Timestamp;

/**
 * Model class representing an Application submitted by a Student for a Job.
 * Maps to the applications table.
 */
public class Application {
    private int id;
    private int studentId;
    private int jobId;
    private Timestamp appliedDate;
    private String status; // "APPLIED", "SHORTLISTED", "REJECTED", "ACCEPTED"
    private String remarks;

    public Application() {
    }

    // Constructor without ID (for submitting new applications)
    public Application(int studentId, int jobId, String status, String remarks) {
        this.studentId = studentId;
        this.jobId = jobId;
        this.status = status;
        this.remarks = remarks;
    }

    // Full constructor
    public Application(int id, int studentId, int jobId, Timestamp appliedDate, String status, String remarks) {
        this.id = id;
        this.studentId = studentId;
        this.jobId = jobId;
        this.appliedDate = appliedDate;
        this.status = status;
        this.remarks = remarks;
    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public int getStudentId() {
        return studentId;
    }

    public void setStudentId(int studentId) {
        this.studentId = studentId;
    }

    public int getJobId() {
        return jobId;
    }

    public void setJobId(int jobId) {
        this.jobId = jobId;
    }

    public Timestamp getAppliedDate() {
        return appliedDate;
    }

    public void setAppliedDate(Timestamp appliedDate) {
        this.appliedDate = appliedDate;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getRemarks() {
        return remarks;
    }

    public void setRemarks(String remarks) {
        this.remarks = remarks;
    }

    @Override
    public String toString() {
        return "Application{" +
                "id=" + id +
                ", studentId=" + studentId +
                ", jobId=" + jobId +
                ", appliedDate=" + appliedDate +
                ", status='" + status + '\'' +
                ", remarks='" + remarks + '\'' +
                '}';
    }
}
