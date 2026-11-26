package com.nexus.placement.model;

import java.math.BigDecimal;
import java.sql.Timestamp;
import java.util.ArrayList;
import java.util.List;

/**
 * Represents a student, extending the abstract User entity.
 * Maps to the students table joined with the users table.
 */
public class Student extends User {
    private int studentId; // Primary key in students table
    private String rollNumber;
    private String branch;
    private BigDecimal cgpa;
    private int graduationYear;
    private String phone;
    private String resumeUrl;
    private String resumeFileName;
    private String college;
    private String degree;
    private String location;
    private List<String> skills = new ArrayList<>();

    public Student() {
        super();
        setRole("STUDENT");
    }

    // Full constructor including User parent fields
    public Student(int userId, String name, String email, String password, Timestamp createdAt,
                   int studentId, String rollNumber, String branch, BigDecimal cgpa,
                   int graduationYear, String phone, String resumeUrl) {
        super(userId, name, email, password, "STUDENT", createdAt);
        this.studentId = studentId;
        this.rollNumber = rollNumber;
        this.branch = branch;
        this.cgpa = cgpa;
        this.graduationYear = graduationYear;
        this.phone = phone;
        this.resumeUrl = resumeUrl;
    }

    public int getStudentId() {
        return studentId;
    }

    public void setStudentId(int studentId) {
        this.studentId = studentId;
    }

    public String getRollNumber() {
        return rollNumber;
    }

    public void setRollNumber(String rollNumber) {
        this.rollNumber = rollNumber;
    }

    public String getBranch() {
        return branch;
    }

    public void setBranch(String branch) {
        this.branch = branch;
    }

    public BigDecimal getCgpa() {
        return cgpa;
    }

    public void setCgpa(BigDecimal cgpa) {
        this.cgpa = cgpa;
    }

    public int getGraduationYear() {
        return graduationYear;
    }

    public void setGraduationYear(int graduationYear) {
        this.graduationYear = graduationYear;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getResumeUrl() {
        return resumeUrl;
    }

    public void setResumeUrl(String resumeUrl) {
        this.resumeUrl = resumeUrl;
    }

    public String getResumeFileName() {
        return resumeFileName;
    }

    public void setResumeFileName(String resumeFileName) {
        this.resumeFileName = resumeFileName;
    }

    public String getCollege() {
        return college;
    }

    public void setCollege(String college) {
        this.college = college;
    }

    public String getDegree() {
        return degree;
    }

    public void setDegree(String degree) {
        this.degree = degree;
    }

    public String getLocation() {
        return location;
    }

    public void setLocation(String location) {
        this.location = location;
    }

    public List<String> getSkills() {
        return skills;
    }

    public void setSkills(List<String> skills) {
        this.skills = skills;
    }

    @Override
    public String toString() {
        return "Student{" +
                "studentId=" + studentId +
                ", userId=" + getId() +
                ", name='" + getName() + '\'' +
                ", email='" + getEmail() + '\'' +
                ", rollNumber='" + rollNumber + '\'' +
                ", branch='" + branch + '\'' +
                ", cgpa=" + cgpa +
                ", graduationYear=" + graduationYear +
                ", phone='" + phone + '\'' +
                ", college='" + college + '\'' +
                ", degree='" + degree + '\'' +
                ", location='" + location + '\'' +
                ", skills=" + skills +
                '}';
    }
}
