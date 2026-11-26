import { Company } from '../types/Company';
import { Job } from '../types/Job';
import { Student } from '../types/Student';
import { Application } from '../types/Application';

export const MOCK_COMPANIES: Company[] = [
  {
    id: 1,
    name: 'Apex Cloud Technologies',
    industry: 'Cloud & SaaS Solutions',
    location: 'Bengaluru, Karnataka',
    website: 'https://apexcloud.io',
    contactEmail: 'campus@apexcloud.io',
    description: 'Global leader in enterprise distributed cloud computing and scalable microservices.'
  },
  {
    id: 2,
    name: 'Nexus Cybernetics',
    industry: 'Artificial Intelligence & Robotics',
    location: 'Hyderabad, Telangana',
    website: 'https://nexuscyber.ai',
    contactEmail: 'careers@nexuscyber.ai',
    description: 'Pioneering foundational vision models, autonomous agents, and high-performance computing.'
  },
  {
    id: 3,
    name: 'FinPulse Digital Bank',
    industry: 'Financial Technology',
    location: 'Mumbai, Maharashtra',
    website: 'https://finpulse.com',
    contactEmail: 'hiring@finpulse.com',
    description: 'Next-generation core banking, micro-lending API rails, and automated payment gateways.'
  },
  {
    id: 4,
    name: 'Veritas Health Solutions',
    industry: 'HealthTech & Bioinformatics',
    location: 'Pune, Maharashtra',
    website: 'https://veritashealth.org',
    contactEmail: 'recruit@veritashealth.org',
    description: 'Digital healthcare platform bridging medical diagnostics, tele-consultation, and AI genomics.'
  },
  {
    id: 5,
    name: 'Aether Mobility Labs',
    industry: 'Electric Vehicles & CleanTech',
    location: 'Chennai, Tamil Nadu',
    website: 'https://aethermobility.in',
    contactEmail: 'campus.relations@aethermobility.in',
    description: 'Smart connected electric transport, battery telemetry, and connected mobility OS.'
  }
];

export const MOCK_JOBS: Job[] = [
  {
    id: 1,
    companyId: 1,
    companyName: 'Apex Cloud Technologies',
    title: 'Associate Cloud Engineer',
    description: 'Architect, configure and deploy highly resilient containerized workloads across AWS and GCP infrastructure.',
    jobType: 'Full-time',
    salaryPackage: 14.50,
    eligibleBranch: 'CSE, IT, ECE',
    minCgpa: 7.50,
    location: 'Bengaluru, Karnataka',
    deadline: '2026-12-15'
  },
  {
    id: 2,
    companyId: 1,
    companyName: 'Apex Cloud Technologies',
    title: 'DevOps Platform Trainee',
    description: 'Automate deployment pipelines with GitLab CI/CD, maintain Terraform scripts, and monitor system telemetry.',
    jobType: 'Full-time',
    salaryPackage: 12.00,
    eligibleBranch: 'CSE, IT',
    minCgpa: 7.00,
    location: 'Remote',
    deadline: '2026-12-20'
  },
  {
    id: 3,
    companyId: 2,
    companyName: 'Nexus Cybernetics',
    title: 'AI/ML Research Engineer',
    description: 'Research foundational machine learning architectures, optimize inference latency, and deploy computer vision pipelines.',
    jobType: 'Full-time',
    salaryPackage: 22.00,
    eligibleBranch: 'CSE, IT, ECE',
    minCgpa: 8.50,
    location: 'Hyderabad, Telangana',
    deadline: '2026-12-10'
  },
  {
    id: 4,
    companyId: 2,
    companyName: 'Nexus Cybernetics',
    title: 'Computer Vision Intern',
    description: 'Hands-on prototyping for edge robotic perception, camera-LiDAR sensor fusion, and multi-object tracking.',
    jobType: 'Internship',
    salaryPackage: 6.00,
    eligibleBranch: 'All Branches',
    minCgpa: 7.00,
    location: 'Hyderabad, Telangana',
    deadline: '2026-12-05'
  },
  {
    id: 5,
    companyId: 3,
    companyName: 'FinPulse Digital Bank',
    title: 'Backend Java Developer',
    description: 'Engineer high-throughput transactional APIs, Kafka message streamers, and scalable Spring microservices.',
    jobType: 'Full-time',
    salaryPackage: 16.00,
    eligibleBranch: 'CSE, IT',
    minCgpa: 8.00,
    location: 'Mumbai, Maharashtra',
    deadline: '2026-12-18'
  },
  {
    id: 6,
    companyId: 3,
    companyName: 'FinPulse Digital Bank',
    title: 'Security Analyst Trainee',
    description: 'Perform web application vulnerability scanning, static code security audits, and compliance threat assessments.',
    jobType: 'Full-time',
    salaryPackage: 11.50,
    eligibleBranch: 'CSE, IT, ECE',
    minCgpa: 7.50,
    location: 'Mumbai, Maharashtra',
    deadline: '2026-12-22'
  },
  {
    id: 7,
    companyId: 4,
    companyName: 'Veritas Health Solutions',
    title: 'Full Stack Web Developer',
    description: 'Develop intuitive doctor-patient interactive dashboards using React, TypeScript, Node.js, and RESTful APIs.',
    jobType: 'Full-time',
    salaryPackage: 13.00,
    eligibleBranch: 'CSE, IT',
    minCgpa: 7.00,
    location: 'Pune, Maharashtra',
    deadline: '2026-12-25'
  },
  {
    id: 8,
    companyId: 4,
    companyName: 'Veritas Health Solutions',
    title: 'Data Analyst - Healthcare',
    description: 'Transform hospital diagnostic metrics into actionable executive dashboards and predictive health insights.',
    jobType: 'Full-time',
    salaryPackage: 9.50,
    eligibleBranch: 'All Branches',
    minCgpa: 6.50,
    location: 'Remote',
    deadline: '2026-12-30'
  },
  {
    id: 9,
    companyId: 5,
    companyName: 'Aether Mobility Labs',
    title: 'Embedded Firmware Engineer',
    description: 'Develop RTOS and bare-metal C++ firmware for motor controllers, telemetry gateways, and battery BMS systems.',
    jobType: 'Full-time',
    salaryPackage: 15.00,
    eligibleBranch: 'ECE, EEE, MECH',
    minCgpa: 7.20,
    location: 'Chennai, Tamil Nadu',
    deadline: '2026-12-12'
  },
  {
    id: 10,
    companyId: 5,
    companyName: 'Aether Mobility Labs',
    title: 'IoT Systems Specialist',
    description: 'Stream vehicle telemetry across cellular IoT modules and architect real-time MQTT message brokers.',
    jobType: 'Full-time',
    salaryPackage: 10.50,
    eligibleBranch: 'ECE, EEE, CSE, IT',
    minCgpa: 6.80,
    location: 'Chennai, Tamil Nadu',
    deadline: '2026-12-28'
  }
];

export const MOCK_STUDENTS: Student[] = [
  {
    id: 1,
    userId: 3,
    name: 'Aarav Sharma',
    email: 'aarav.sharma@nexus.edu',
    rollNumber: 'CS202301',
    branch: 'Computer Science & Engineering',
    cgpa: 8.92,
    graduationYear: 2027,
    phone: '+91-9876543210'
  },
  {
    id: 2,
    userId: 4,
    name: 'Priya Patel',
    email: 'priya.patel@nexus.edu',
    rollNumber: 'IT202315',
    branch: 'Information Technology',
    cgpa: 9.15,
    graduationYear: 2027,
    phone: '+91-9876543211'
  },
  {
    id: 3,
    userId: 5,
    name: 'Rohan Verma',
    email: 'rohan.verma@nexus.edu',
    rollNumber: 'EC202308',
    branch: 'Electronics & Communication',
    cgpa: 7.85,
    graduationYear: 2027,
    phone: '+91-9876543212'
  },
  {
    id: 4,
    userId: 6,
    name: 'Ananya Iyer',
    email: 'ananya.iyer@nexus.edu',
    rollNumber: 'CS202342',
    branch: 'Computer Science & Engineering',
    cgpa: 9.40,
    graduationYear: 2027,
    phone: '+91-9876543213'
  }
];

export const MOCK_APPLICATIONS: Application[] = [
  {
    id: 1,
    studentId: 1,
    studentName: 'Aarav Sharma',
    jobId: 1,
    jobTitle: 'Associate Cloud Engineer',
    companyName: 'Apex Cloud Technologies',
    salaryPackage: 14.50,
    appliedDate: '2026-11-20',
    status: 'SHORTLISTED',
    remarks: 'Strong performance in online coding round and cloud portfolio.'
  },
  {
    id: 2,
    studentId: 1,
    studentName: 'Aarav Sharma',
    jobId: 3,
    jobTitle: 'AI/ML Research Engineer',
    companyName: 'Nexus Cybernetics',
    salaryPackage: 22.00,
    appliedDate: '2026-11-21',
    status: 'APPLIED',
    remarks: 'Application under preliminary resume screening.'
  },
  {
    id: 3,
    studentId: 2,
    studentName: 'Priya Patel',
    jobId: 5,
    jobTitle: 'Backend Java Developer',
    companyName: 'FinPulse Digital Bank',
    salaryPackage: 16.00,
    appliedDate: '2026-11-22',
    status: 'ACCEPTED',
    remarks: 'Offered role after final technical interview.'
  },
  {
    id: 4,
    studentId: 3,
    studentName: 'Rohan Verma',
    jobId: 9,
    jobTitle: 'Embedded Firmware Engineer',
    companyName: 'Aether Mobility Labs',
    salaryPackage: 15.00,
    appliedDate: '2026-11-21',
    status: 'SHORTLISTED',
    remarks: 'Embedded C practical assessment score 92%.'
  },
  {
    id: 5,
    studentId: 4,
    studentName: 'Ananya Iyer',
    jobId: 3,
    jobTitle: 'AI/ML Research Engineer',
    companyName: 'Nexus Cybernetics',
    salaryPackage: 22.00,
    appliedDate: '2026-11-20',
    status: 'ACCEPTED',
    remarks: 'Top percentile candidate; accepted offer for AI Research.'
  }
];

export const MOCK_ADMIN_STATS = {
  totalStudents: 10,
  totalCompanies: 5,
  totalJobs: 10,
  totalApplications: 15,
  shortlistedCount: 6,
  acceptedOffers: 2,
  averagePackage: 13.0
};
