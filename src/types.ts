/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type UserRole = 'Super Admin' | 'HR Manager' | 'Recruiter' | 'Payroll Manager' | 'Team Lead' | 'Employee';

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  department?: string;
  employeeId?: string;
  status: 'Active' | 'Inactive';
}

export interface Employee {
  id: string;
  employeeId: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  department: string;
  designation: string;
  manager: string;
  status: 'Active' | 'Inactive';
  avatar?: string;
  joiningDate: string;
  salary: number;
  performanceScore: number; // 1 to 5
  skills: string[];
  education: {
    degree: string;
    institution: string;
    year: string;
  }[];
  experience: {
    company: string;
    role: string;
    duration: string;
  }[];
  promotionHistory: {
    date: string;
    oldDesignation: string;
    newDesignation: string;
    oldSalary: number;
    newSalary: number;
  }[];
  transferHistory: {
    date: string;
    oldDepartment: string;
    newDepartment: string;
    manager: string;
  }[];
  bankDetails: {
    accountHolder: string;
    accountNumber: string;
    bankName: string;
    ifscCode: string;
  };
  emergencyContact: {
    name: string;
    relation: string;
    phone: string;
  };
  documents: {
    id: string;
    name: string;
    type: 'Offer Letter' | 'Joining Letter' | 'Experience Letter' | 'Resume' | 'PAN' | 'Aadhar' | 'Passport' | 'Certificate';
    url: string;
    uploadedAt: string;
    version: number;
  }[];
  notes: string[];
}

export interface Attendance {
  id: string;
  employeeId: string;
  employeeName: string;
  date: string; // YYYY-MM-DD
  checkIn?: string; // HH:MM:SS
  checkOut?: string; // HH:MM:SS
  status: 'Present' | 'Absent' | 'Leave' | 'Late' | 'Half Day';
  workHours: number; // Hours decimal
  overtime: number; // Hours decimal
  breakTime: number; // Minutes
  latitude?: number;
  longitude?: number;
  isLate: boolean;
  isEarlyExit: boolean;
}

export interface LeaveRequest {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  type: 'Casual Leave' | 'Sick Leave' | 'Earned Leave' | 'Maternity Leave' | 'WFH' | 'Comp Off';
  startDate: string;
  endDate: string;
  days: number;
  reason: string;
  status: 'Pending' | 'Approved' | 'Rejected';
  approvedBy?: string;
  createdAt: string;
}

export interface LeaveBalance {
  employeeId: string;
  casual: number;
  sick: number;
  earned: number;
  wfhLimit: number;
  usedCasual: number;
  usedSick: number;
  usedEarned: number;
  usedWfh: number;
}

export interface Payroll {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  designation: string;
  month: string; // YYYY-MM
  baseSalary: number;
  bonuses: number;
  incentives: number;
  deductions: {
    providentFund: number; // PF
    esi: number; // Employee State Insurance
    tds: number; // Tax Deducted at Source
    other: number;
  };
  netSalary: number;
  status: 'Paid' | 'Unpaid' | 'Processing';
  generatedAt?: string;
  paymentMethod?: string;
  payslipUrl?: string;
}

export interface JobOpening {
  id: string;
  title: string;
  department: string;
  location: string;
  type: 'Full-time' | 'Part-time' | 'Contract' | 'Remote';
  experienceRequired: string;
  status: 'Active' | 'Closed' | 'Draft';
  applicantsCount: number;
  description: string;
  requirements: string[];
  salaryRange: string;
  createdAt: string;
}

export interface Candidate {
  id: string;
  jobId: string;
  jobTitle: string;
  name: string;
  email: string;
  phone: string;
  resumeUrl: string;
  status: 'Applied' | 'Screening' | 'Interview Scheduled' | 'Interview Feedback Given' | 'Offer Generated' | 'Accepted' | 'Rejected';
  rating?: number;
  interviewSchedule?: {
    date: string;
    time: string;
    interviewer: string;
    mode: 'Online' | 'Offline';
  };
  feedback?: {
    technicalScore: number;
    cultureScore: number;
    notes: string;
    interviewer: string;
  };
  offerDetails?: {
    salary: number;
    joiningDate: string;
    generatedAt: string;
  };
}

export interface OnboardingChecklist {
  id: string;
  employeeId: string;
  employeeName: string;
  department: string;
  status: 'In Progress' | 'Completed';
  tasks: {
    id: string;
    task: string;
    completed: boolean;
    completedAt?: string;
  }[];
  assetAllocation: {
    device?: string;
    serialNo?: string;
    allocatedAt?: string;
  };
  welcomeEmailSent: boolean;
}

export interface PerformanceGoal {
  id: string;
  employeeId: string;
  title: string;
  kpi: string;
  target: string;
  progress: number; // Percentage
  status: 'Pending' | 'In Progress' | 'Achieved' | 'Missed';
  reviewRating?: number; // 1-5
  feedback?: string;
  createdAt: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  department: string;
  status: 'Planning' | 'In Progress' | 'On Hold' | 'Completed';
  deadline: string;
  priority: 'Low' | 'Medium' | 'High';
  members: {
    id: string;
    name: string;
    avatar?: string;
  }[];
}

export interface ProjectTask {
  id: string;
  projectId: string;
  projectName: string;
  title: string;
  description: string;
  status: 'Todo' | 'In Progress' | 'In Review' | 'Done';
  priority: 'Low' | 'Medium' | 'High';
  deadline: string;
  assignees: {
    id: string;
    name: string;
    avatar?: string;
  }[];
  comments: {
    id: string;
    userName: string;
    text: string;
    createdAt: string;
  }[];
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar?: string;
  receiverId?: string; // Private chat
  groupId?: string; // Department group chat (e.g. "Engineering", "HR")
  text: string;
  createdAt: string;
  seen: boolean;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
  read: boolean;
  createdAt: string;
}

export interface AuditLog {
  id: string;
  userName: string;
  userRole: string;
  action: string;
  module: string;
  details: string;
  ipAddress?: string;
  createdAt: string;
}
