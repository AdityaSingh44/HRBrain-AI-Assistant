/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { Employee, Attendance, LeaveRequest, LeaveBalance, Payroll, JobOpening, Candidate, OnboardingChecklist, PerformanceGoal, Project, ProjectTask, ChatMessage, Notification, AuditLog } from '../types';

export const COMPANY_PROFILE = {
  name: 'HRBrain AI Technologies Inc.',
  website: 'https://hrbrain.ai',
  email: 'admin@hrbrain.ai',
  phone: '+1 (555) 019-2831',
  address: '100 Pine Street, San Francisco, CA 94111',
  departments: ['Engineering', 'Human Resources', 'Sales & Marketing', 'Finance', 'Design'],
  designations: [
    'Senior Frontend Engineer',
    'Senior Backend Engineer',
    'HR Generalist',
    'Chief Marketing Officer',
    'Payroll Specialist',
    'Product Designer',
    'QA Engineer',
    'Recruiter'
  ],
  shifts: [
    { name: 'Day Shift', timing: '09:00 AM - 06:00 PM', flexible: true },
    { name: 'Night Shift', timing: '09:00 PM - 06:00 AM', flexible: false },
    { name: 'Euro Shift', timing: '01:00 PM - 10:00 PM', flexible: true }
  ]
};

export const HOLIDAYS = [
  { date: '2026-01-01', name: "New Year's Day" },
  { date: '2026-05-25', name: 'Memorial Day' },
  { date: '2026-07-04', name: 'Independence Day' },
  { date: '2026-09-07', name: 'Labor Day' },
  { date: '2026-11-26', name: 'Thanksgiving' },
  { date: '2026-12-25', name: 'Christmas Day' }
];

export const INITIAL_EMPLOYEES: Employee[] = [
  {
    id: 'emp-001',
    employeeId: 'HB-001',
    name: 'Sarah Jenkins',
    email: 'sarah.jenkins@hrbrain.ai',
    phone: '+1 (555) 101-2001',
    role: 'HR Manager',
    department: 'Human Resources',
    designation: 'HR Generalist',
    manager: 'CEO',
    status: 'Active',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=120',
    joiningDate: '2024-03-15',
    salary: 85000,
    performanceScore: 4.8,
    skills: ['Talent Acquisition', 'Employee Relations', 'Conflict Resolution', 'Compensation & Benefits'],
    education: [
      { degree: 'Master of Human Resource Management', institution: 'UC Berkeley', year: '2022' },
      { degree: 'BS in Psychology', institution: 'Stanford University', year: '2020' }
    ],
    experience: [
      { company: 'Rippling', role: 'Associate HR Partner', duration: '2022 - 2024' }
    ],
    promotionHistory: [
      { date: '2025-04-01', oldDesignation: 'Junior HR Analyst', newDesignation: 'HR Generalist', oldSalary: 72000, newSalary: 85000 }
    ],
    transferHistory: [],
    bankDetails: {
      accountHolder: 'Sarah Jenkins',
      accountNumber: '123456789012',
      bankName: 'Chase Bank',
      ifscCode: 'CHASUS33'
    },
    emergencyContact: {
      name: 'Robert Jenkins',
      relation: 'Spouse',
      phone: '+1 (555) 101-9002'
    },
    documents: [
      { id: 'doc-001-resume', name: 'sarah_resume.pdf', type: 'Resume', url: '#', uploadedAt: '2024-03-01', version: 1 },
      { id: 'doc-001-offer', name: 'sarah_offer_letter.pdf', type: 'Offer Letter', url: '#', uploadedAt: '2024-03-05', version: 1 }
    ],
    notes: ['Excellent performance during the Q2 review cycle. Highly adaptive.']
  },
  {
    id: 'emp-002',
    employeeId: 'HB-002',
    name: 'Alex Rivera',
    email: 'alex.rivera@hrbrain.ai',
    phone: '+1 (555) 202-3004',
    role: 'Employee',
    department: 'Engineering',
    designation: 'Senior Frontend Engineer',
    manager: 'David Miller',
    status: 'Active',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=120',
    joiningDate: '2023-01-10',
    salary: 135000,
    performanceScore: 4.5,
    skills: ['React', 'TypeScript', 'Tailwind CSS', 'Vite', 'Three.js'],
    education: [
      { degree: 'B.Tech in Computer Science', institution: 'Georgia Tech', year: '2020' }
    ],
    experience: [
      { company: 'BambooHR', role: 'Frontend Developer', duration: '2020 - 2022' }
    ],
    promotionHistory: [
      { date: '2024-06-01', oldDesignation: 'Frontend Engineer', newDesignation: 'Senior Frontend Engineer', oldSalary: 115000, newSalary: 135000 }
    ],
    transferHistory: [],
    bankDetails: {
      accountHolder: 'Alex Rivera',
      accountNumber: '987654321098',
      bankName: 'Wells Fargo',
      ifscCode: 'WELSUS44'
    },
    emergencyContact: {
      name: 'Elena Rivera',
      relation: 'Mother',
      phone: '+1 (555) 202-8800'
    },
    documents: [
      { id: 'doc-002-resume', name: 'alex_rivera_cv.pdf', type: 'Resume', url: '#', uploadedAt: '2023-01-02', version: 1 }
    ],
    notes: ['Tech-lead for the design-system overhaul project. Deliverables are pristine.']
  },
  {
    id: 'emp-003',
    employeeId: 'HB-003',
    name: 'Emily Chen',
    email: 'emily.chen@hrbrain.ai',
    phone: '+1 (555) 303-4005',
    role: 'Employee',
    department: 'Design',
    designation: 'Product Designer',
    manager: 'Sophia Wong',
    status: 'Active',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=120',
    joiningDate: '2025-05-12',
    salary: 95000,
    performanceScore: 4.2,
    skills: ['Figma', 'UI/UX Design', 'Design Systems', 'Prototyping'],
    education: [
      { degree: 'Bachelor of Fine Arts in Interaction Design', institution: 'Rhode Island School of Design', year: '2023' }
    ],
    experience: [
      { company: 'Deel', role: 'Product Design Intern', duration: '2023 - 2024' }
    ],
    promotionHistory: [],
    transferHistory: [],
    bankDetails: {
      accountHolder: 'Emily Chen',
      accountNumber: '445566778899',
      bankName: 'Bank of America',
      ifscCode: 'BOFAUS33'
    },
    emergencyContact: {
      name: 'William Chen',
      relation: 'Father',
      phone: '+1 (555) 303-9090'
    },
    documents: [],
    notes: ['Strong creative instinct. Contributed highly to onboarding UX.']
  },
  {
    id: 'emp-004',
    employeeId: 'HB-004',
    name: 'Michael Chang',
    email: 'michael.chang@hrbrain.ai',
    phone: '+1 (555) 404-5006',
    role: 'Recruiter',
    department: 'Human Resources',
    designation: 'Recruiter',
    manager: 'Sarah Jenkins',
    status: 'Active',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=120',
    joiningDate: '2025-02-01',
    salary: 75000,
    performanceScore: 3.9,
    skills: ['Sourcing', 'ATS Systems', 'Executive Search', 'Negotiation'],
    education: [
      { degree: 'BS in Communications', institution: 'Northwestern University', year: '2021' }
    ],
    experience: [
      { company: 'Workday', role: 'Associate Recruiter', duration: '2022 - 2025' }
    ],
    promotionHistory: [],
    transferHistory: [],
    bankDetails: {
      accountHolder: 'Michael Chang',
      accountNumber: '112233445566',
      bankName: 'Citi Bank',
      ifscCode: 'CITIUS55'
    },
    emergencyContact: {
      name: 'Lisa Chang',
      relation: 'Sister',
      phone: '+1 (555) 404-0909'
    },
    documents: [],
    notes: ['Managing candidates funnel with high velocity. Exceptionally good rapport with tech team.']
  },
  {
    id: 'emp-005',
    employeeId: 'HB-005',
    name: 'David Miller',
    email: 'david.miller@hrbrain.ai',
    phone: '+1 (555) 505-6007',
    role: 'Team Lead',
    department: 'Engineering',
    designation: 'Senior Backend Engineer',
    manager: 'CTO',
    status: 'Active',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=120',
    joiningDate: '2022-08-15',
    salary: 155000,
    performanceScore: 4.9,
    skills: ['Node.js', 'Go', 'Kubernetes', 'MongoDB', 'System Architecture'],
    education: [
      { degree: 'MS in Computer Science', institution: 'MIT', year: '2019' }
    ],
    experience: [
      { company: 'Stripe', role: 'Backend Dev III', duration: '2019 - 2022' }
    ],
    promotionHistory: [],
    transferHistory: [],
    bankDetails: {
      accountHolder: 'David Miller',
      accountNumber: '556677889900',
      bankName: 'Chase Bank',
      ifscCode: 'CHASUS33'
    },
    emergencyContact: {
      name: 'Alice Miller',
      relation: 'Mother',
      phone: '+1 (555) 505-1122'
    },
    documents: [],
    notes: ['Exceptional engineering leader. Mastermind behind server performance optimizations.']
  },
  {
    id: 'emp-006',
    employeeId: 'HB-006',
    name: 'Sophia Wong',
    email: 'sophia.wong@hrbrain.ai',
    phone: '+1 (555) 606-7008',
    role: 'Team Lead',
    department: 'Design',
    designation: 'Product Designer',
    manager: 'CEO',
    status: 'Active',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=120',
    joiningDate: '2023-11-01',
    salary: 110000,
    performanceScore: 4.4,
    skills: ['Design Ops', 'Branding', 'SaaS Wireframes', 'Tailwind Systems'],
    education: [
      { degree: 'Bachelor of Design', institution: 'CMU', year: '2018' }
    ],
    experience: [
      { company: 'Zoho', role: 'Visual Lead', duration: '2018 - 2023' }
    ],
    promotionHistory: [],
    transferHistory: [],
    bankDetails: {
      accountHolder: 'Sophia Wong',
      accountNumber: '223344556677',
      bankName: 'HSBC Bank',
      ifscCode: 'HSBCUS22'
    },
    emergencyContact: {
      name: 'Herman Wong',
      relation: 'Father',
      phone: '+1 (555) 606-9900'
    },
    documents: [],
    notes: ['Sets incredibly high standards of visual excellence. Strong mentor.']
  },
  {
    id: 'emp-007',
    employeeId: 'HB-007',
    name: 'Jessica Taylor',
    email: 'jessica.taylor@hrbrain.ai',
    phone: '+1 (555) 707-8009',
    role: 'Payroll Manager',
    department: 'Finance',
    designation: 'Payroll Specialist',
    manager: 'CFO',
    status: 'Active',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=120',
    joiningDate: '2024-01-20',
    salary: 82000,
    performanceScore: 4.1,
    skills: ['Corporate Payroll', 'Tax Compliance', 'Audit Audits', 'Excel Automation'],
    education: [
      { degree: 'BS in Finance', institution: 'University of Texas', year: '2021' }
    ],
    experience: [
      { company: 'Zenefits', role: 'Payroll Associate', duration: '2021 - 2023' }
    ],
    promotionHistory: [],
    transferHistory: [],
    bankDetails: {
      accountHolder: 'Jessica Taylor',
      accountNumber: '889900112233',
      bankName: 'Wells Fargo',
      ifscCode: 'WELSUS44'
    },
    emergencyContact: {
      name: 'John Taylor',
      relation: 'Father',
      phone: '+1 (555) 707-1234'
    },
    documents: [],
    notes: ['Manages payroll processing errors flawlessly. Zero compliance issues reported.']
  },
  {
    id: 'emp-008',
    employeeId: 'HB-008',
    name: 'Marcus Brody',
    email: 'marcus.brody@hrbrain.ai',
    phone: '+1 (555) 808-9010',
    role: 'Employee',
    department: 'Sales & Marketing',
    designation: 'Chief Marketing Officer',
    manager: 'CEO',
    status: 'Active',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&q=80&w=120',
    joiningDate: '2024-10-10',
    salary: 145000,
    performanceScore: 4.6,
    skills: ['B2B Sales', 'SEO Campaigns', 'Growth Marketing', 'Product Led Growth'],
    education: [
      { degree: 'MBA in Marketing', institution: 'Northwestern Kellogg', year: '2016' }
    ],
    experience: [
      { company: 'Hubspot', role: 'Director of Growth', duration: '2016 - 2024' }
    ],
    promotionHistory: [],
    transferHistory: [],
    bankDetails: {
      accountHolder: 'Marcus Brody',
      accountNumber: '113355779900',
      bankName: 'Citi Bank',
      ifscCode: 'CITIUS55'
    },
    emergencyContact: {
      name: 'Diane Brody',
      relation: 'Spouse',
      phone: '+1 (555) 808-1111'
    },
    documents: [],
    notes: ['Brought extreme clarity to core PLG initiatives. Multiplied trials by 3x.']
  }
];

export const INITIAL_ATTENDANCE: Attendance[] = [
  // Today's Checkins
  {
    id: 'att-001',
    employeeId: 'HB-001',
    employeeName: 'Sarah Jenkins',
    date: '2026-07-14',
    checkIn: '08:45 AM',
    checkOut: '06:15 PM',
    status: 'Present',
    workHours: 9.5,
    overtime: 0.5,
    breakTime: 45,
    latitude: 37.7749,
    longitude: -122.4194,
    isLate: false,
    isEarlyExit: false
  },
  {
    id: 'att-002',
    employeeId: 'HB-002',
    employeeName: 'Alex Rivera',
    date: '2026-07-14',
    checkIn: '09:12 AM',
    status: 'Late',
    workHours: 7.2,
    overtime: 0,
    breakTime: 30,
    latitude: 37.7749,
    longitude: -122.4194,
    isLate: true,
    isEarlyExit: false
  },
  {
    id: 'att-003',
    employeeId: 'HB-003',
    employeeName: 'Emily Chen',
    date: '2026-07-14',
    checkIn: '08:58 AM',
    status: 'Present',
    workHours: 8.0,
    overtime: 0,
    breakTime: 45,
    latitude: 37.7801,
    longitude: -122.4210,
    isLate: false,
    isEarlyExit: false
  },
  {
    id: 'att-004',
    employeeId: 'HB-004',
    employeeName: 'Michael Chang',
    date: '2026-07-14',
    status: 'Absent',
    workHours: 0,
    overtime: 0,
    breakTime: 0,
    isLate: false,
    isEarlyExit: false
  },
  {
    id: 'att-005',
    employeeId: 'HB-005',
    employeeName: 'David Miller',
    date: '2026-07-14',
    checkIn: '08:50 AM',
    status: 'Present',
    workHours: 8.5,
    overtime: 0,
    breakTime: 40,
    latitude: 37.7749,
    longitude: -122.4194,
    isLate: false,
    isEarlyExit: false
  },
  {
    id: 'att-006',
    employeeId: 'HB-006',
    employeeName: 'Sophia Wong',
    date: '2026-07-14',
    status: 'Leave',
    workHours: 0,
    overtime: 0,
    breakTime: 0,
    isLate: false,
    isEarlyExit: false
  }
];

export const INITIAL_LEAVES: LeaveRequest[] = [
  {
    id: 'leave-001',
    employeeId: 'HB-006',
    employeeName: 'Sophia Wong',
    department: 'Design',
    type: 'Sick Leave',
    startDate: '2026-07-14',
    endDate: '2026-07-15',
    days: 2,
    reason: 'Dental surgery and root canal checkup.',
    status: 'Approved',
    approvedBy: 'Sarah Jenkins',
    createdAt: '2026-07-13'
  },
  {
    id: 'leave-002',
    employeeId: 'HB-003',
    employeeName: 'Emily Chen',
    department: 'Design',
    type: 'WFH',
    startDate: '2026-07-16',
    endDate: '2026-07-17',
    days: 2,
    reason: 'Home AC unit repair and maintenance scheduled.',
    status: 'Pending',
    createdAt: '2026-07-13'
  },
  {
    id: 'leave-003',
    employeeId: 'HB-002',
    employeeName: 'Alex Rivera',
    department: 'Engineering',
    type: 'Casual Leave',
    startDate: '2026-07-20',
    endDate: '2026-07-22',
    days: 3,
    reason: 'Family trip over long weekend.',
    status: 'Pending',
    createdAt: '2026-07-12'
  },
  {
    id: 'leave-004',
    employeeId: 'HB-004',
    employeeName: 'Michael Chang',
    department: 'Human Resources',
    type: 'Earned Leave',
    startDate: '2026-06-10',
    endDate: '2026-06-15',
    days: 5,
    reason: 'Annual summer vacation trip.',
    status: 'Approved',
    approvedBy: 'Sarah Jenkins',
    createdAt: '2026-06-01'
  }
];

export const INITIAL_LEAVE_BALANCES: LeaveBalance[] = [
  { employeeId: 'HB-001', casual: 10, sick: 8, earned: 15, wfhLimit: 24, usedCasual: 1, usedSick: 0, usedEarned: 2, usedWfh: 3 },
  { employeeId: 'HB-002', casual: 10, sick: 8, earned: 15, wfhLimit: 24, usedCasual: 2, usedSick: 1, usedEarned: 0, usedWfh: 8 },
  { employeeId: 'HB-003', casual: 10, sick: 8, earned: 15, wfhLimit: 24, usedCasual: 0, usedSick: 2, usedEarned: 1, usedWfh: 4 },
  { employeeId: 'HB-004', casual: 10, sick: 8, earned: 15, wfhLimit: 24, usedCasual: 5, usedSick: 0, usedEarned: 5, usedWfh: 2 },
  { employeeId: 'HB-005', casual: 10, sick: 8, earned: 15, wfhLimit: 24, usedCasual: 0, usedSick: 0, usedEarned: 1, usedWfh: 12 },
  { employeeId: 'HB-006', casual: 10, sick: 8, earned: 15, wfhLimit: 24, usedCasual: 4, usedSick: 3, usedEarned: 0, usedWfh: 2 }
];

export const INITIAL_PAYROLLS: Payroll[] = [
  {
    id: 'pay-001',
    employeeId: 'HB-001',
    employeeName: 'Sarah Jenkins',
    department: 'Human Resources',
    designation: 'HR Generalist',
    month: '2026-06',
    baseSalary: 7083,
    bonuses: 500,
    incentives: 0,
    deductions: { providentFund: 850, esi: 120, tds: 650, other: 0 },
    netSalary: 5963,
    status: 'Paid',
    generatedAt: '2026-06-30',
    paymentMethod: 'Direct Deposit'
  },
  {
    id: 'pay-002',
    employeeId: 'HB-002',
    employeeName: 'Alex Rivera',
    department: 'Engineering',
    designation: 'Senior Frontend Engineer',
    month: '2026-06',
    baseSalary: 11250,
    bonuses: 1000,
    incentives: 500,
    deductions: { providentFund: 1350, esi: 250, tds: 1500, other: 100 },
    netSalary: 9550,
    status: 'Paid',
    generatedAt: '2026-06-30',
    paymentMethod: 'Direct Deposit'
  },
  {
    id: 'pay-003',
    employeeId: 'HB-005',
    employeeName: 'David Miller',
    department: 'Engineering',
    designation: 'Senior Backend Engineer',
    month: '2026-06',
    baseSalary: 12916,
    bonuses: 0,
    incentives: 1000,
    deductions: { providentFund: 1550, esi: 300, tds: 1800, other: 0 },
    netSalary: 10266,
    status: 'Paid',
    generatedAt: '2026-06-30',
    paymentMethod: 'Direct Deposit'
  },
  {
    id: 'pay-004',
    employeeId: 'HB-003',
    employeeName: 'Emily Chen',
    department: 'Design',
    designation: 'Product Designer',
    month: '2026-06',
    baseSalary: 7916,
    bonuses: 200,
    incentives: 0,
    deductions: { providentFund: 950, esi: 150, tds: 800, other: 50 },
    netSalary: 6166,
    status: 'Paid',
    generatedAt: '2026-06-30',
    paymentMethod: 'Direct Deposit'
  }
];

export const INITIAL_JOBS: JobOpening[] = [
  {
    id: 'job-001',
    title: 'Senior React Developer',
    department: 'Engineering',
    location: 'San Francisco, CA',
    type: 'Full-time',
    experienceRequired: '5+ years',
    status: 'Active',
    applicantsCount: 14,
    description: 'We are seeking a senior React developer with deep web-performance expertise to construct modern dashboards and responsive full-stack portals.',
    requirements: ['React 18', 'TypeScript', 'Tailwind CSS', 'Vite', 'State management (Redux/Zustand)'],
    salaryRange: '$120,000 - $160,000',
    createdAt: '2026-06-15'
  },
  {
    id: 'job-002',
    title: 'HR Generalist & Talent Partner',
    department: 'Human Resources',
    location: 'Remote',
    type: 'Full-time',
    experienceRequired: '3+ years',
    status: 'Active',
    applicantsCount: 8,
    description: 'Join our HR operations team. You will drive end-to-end recruitment pipelines, establish modern policies, and spearhead workplace collaboration initiatives.',
    requirements: ['HR Generalist expertise', 'Excellent communication', 'Sourcing strategies', 'ATS management'],
    salaryRange: '$75,000 - $95,000',
    createdAt: '2026-07-01'
  },
  {
    id: 'job-003',
    title: 'Senior Cloud DevOps Engineer',
    department: 'Engineering',
    location: 'Remote',
    type: 'Full-time',
    experienceRequired: '6+ years',
    status: 'Draft',
    applicantsCount: 0,
    description: 'Lead GCP deployment topologies, automate CI/CD pipelines, and manage container orchestrations.',
    requirements: ['Kubernetes', 'GCP', 'Terraform', 'CI/CD Pipelines'],
    salaryRange: '$140,000 - $180,000',
    createdAt: '2026-07-12'
  }
];

export const INITIAL_CANDIDATES: Candidate[] = [
  {
    id: 'cand-001',
    jobId: 'job-001',
    jobTitle: 'Senior React Developer',
    name: 'Brian O’Conner',
    email: 'brian@example.com',
    phone: '+1 (555) 999-8888',
    resumeUrl: '#',
    status: 'Interview Scheduled',
    rating: 4.5,
    interviewSchedule: {
      date: '2026-07-15',
      time: '10:00 AM',
      interviewer: 'David Miller',
      mode: 'Online'
    }
  },
  {
    id: 'cand-002',
    jobId: 'job-001',
    jobTitle: 'Senior React Developer',
    name: 'Sophia Loren',
    email: 'sophia.loren@example.com',
    phone: '+1 (555) 777-6666',
    resumeUrl: '#',
    status: 'Interview Feedback Given',
    rating: 4.8,
    feedback: {
      technicalScore: 5,
      cultureScore: 4.6,
      notes: 'Outstanding skills. Answered every systems engineering question flawlessly.',
      interviewer: 'Alex Rivera'
    }
  },
  {
    id: 'cand-003',
    jobId: 'job-002',
    jobTitle: 'HR Generalist & Talent Partner',
    name: 'Tanya Smith',
    email: 'tanya@example.com',
    phone: '+1 (555) 444-3322',
    resumeUrl: '#',
    status: 'Offer Generated',
    rating: 4.2,
    offerDetails: {
      salary: 88000,
      joiningDate: '2026-08-01',
      generatedAt: '2026-07-11'
    }
  }
];

export const INITIAL_ONBOARDING: OnboardingChecklist[] = [
  {
    id: 'onb-001',
    employeeId: 'HB-003',
    employeeName: 'Emily Chen',
    department: 'Design',
    status: 'In Progress',
    tasks: [
      { id: 't-1', task: 'Sign employment agreement', completed: true, completedAt: '2025-05-12' },
      { id: 't-2', task: 'Submit tax declarations (Form W4/I-9)', completed: true, completedAt: '2025-05-12' },
      { id: 't-3', task: 'Allocate office workstation and laptop', completed: true, completedAt: '2025-05-13' },
      { id: 't-4', task: 'Complete security compliance modules', completed: false }
    ],
    assetAllocation: {
      device: 'MacBook Pro 16" Apple Silicon',
      serialNo: 'C02HG892Q05D',
      allocatedAt: '2025-05-13'
    },
    welcomeEmailSent: true
  }
];

export const INITIAL_GOALS: PerformanceGoal[] = [
  { id: 'g-001', employeeId: 'HB-002', title: 'Overhaul design token mapping', kpi: 'Core styles load time under 100ms', target: 'Load speed improvement 40%', progress: 85, status: 'In Progress', createdAt: '2026-06-01' },
  { id: 'g-002', employeeId: 'HB-002', title: 'Conduct code quality audits', kpi: 'Reduce test failures to 0%', target: 'Zero regressions', progress: 100, status: 'Achieved', reviewRating: 5, feedback: 'Flawless execution.', createdAt: '2026-05-15' },
  { id: 'g-003', employeeId: 'HB-005', title: 'Optimize API route queries', kpi: 'Average latency under 50ms', target: 'Latency reduction of 30%', progress: 95, status: 'In Progress', createdAt: '2026-06-10' }
];

export const INITIAL_PROJECTS: Project[] = [
  { id: 'proj-001', name: 'HRBrain Custom ATS Integration', description: 'Upgrading HR candidate sourcing platform for better AI interview screening capabilities.', department: 'Human Resources', status: 'In Progress', deadline: '2026-08-20', priority: 'High', members: [{ id: 'HB-001', name: 'Sarah Jenkins' }, { id: 'HB-004', name: 'Michael Chang' }] },
  { id: 'proj-002', name: 'Next-Gen Mobile Payroll Sync', description: 'Re-engineering backend architecture to enable real-time calculations on native devices.', department: 'Engineering', status: 'Planning', deadline: '2026-10-15', priority: 'Medium', members: [{ id: 'HB-002', name: 'Alex Rivera' }, { id: 'HB-005', name: 'David Miller' }] }
];

export const INITIAL_PROJECT_TASKS: ProjectTask[] = [
  { id: 'tsk-001', projectId: 'proj-001', projectName: 'HRBrain Custom ATS Integration', title: 'Database schema design for Candidate screening', description: 'Define tables, types, and indexes for CV search queries.', status: 'Done', priority: 'High', deadline: '2026-07-10', assignees: [{ id: 'HB-001', name: 'Sarah Jenkins' }], comments: [] },
  { id: 'tsk-002', projectId: 'proj-001', projectName: 'HRBrain Custom ATS Integration', title: 'Gemini CV Parser endpoint', description: 'Connect backend to Google Gemini to parse and rate uploaded resume files.', status: 'In Progress', priority: 'High', deadline: '2026-07-25', assignees: [{ id: 'HB-001', name: 'Sarah Jenkins' }, { id: 'HB-004', name: 'Michael Chang' }], comments: [{ id: 'c-1', userName: 'Michael Chang', text: 'Working on getting clean file buffer responses from Multer.', createdAt: '2026-07-13' }] },
  { id: 'tsk-003', projectId: 'proj-002', projectName: 'Next-Gen Mobile Payroll Sync', title: 'Write unit tests for tax algorithms', description: 'Complete test suites covering PF and ESI state regulations.', status: 'Todo', priority: 'Medium', deadline: '2026-08-01', assignees: [{ id: 'HB-005', name: 'David Miller' }], comments: [] }
];

export const INITIAL_MESSAGES: ChatMessage[] = [
  // Engineering Department group chat
  { id: 'msg-001', senderId: 'HB-005', senderName: 'David Miller', groupId: 'Engineering', text: 'Hey engineering team! Lets coordinate on the code push this evening.', createdAt: '2026-07-14T08:00:00Z', seen: true },
  { id: 'msg-002', senderId: 'HB-002', senderName: 'Alex Rivera', groupId: 'Engineering', text: 'Sounds good David, my pull requests are already reviewed and approved!', createdAt: '2026-07-14T08:05:00Z', seen: true },
  
  // Private DM Sarah <-> David
  { id: 'msg-003', senderId: 'HB-001', senderName: 'Sarah Jenkins', receiverId: 'HB-005', text: 'Hi David, has Emily completed the cybersecurity module onboarding?', createdAt: '2026-07-13T10:15:00Z', seen: true },
  { id: 'msg-004', senderId: 'HB-005', senderName: 'David Miller', receiverId: 'HB-001', text: 'Hey Sarah! Shes on the final section today. Ill ping her to finish it.', createdAt: '2026-07-13T10:20:00Z', seen: true }
];

export const INITIAL_NOTIFICATIONS: Notification[] = [
  { id: 'not-001', title: 'New Leave Request', message: 'Emily Chen has applied for WFH on 16th and 17th July.', type: 'info', read: false, createdAt: '2026-07-13' },
  { id: 'not-002', title: 'Interview Confirmed', message: 'Brian O’Conner confirmed his interview scheduled on 15th July at 10:00 AM.', type: 'success', read: false, createdAt: '2026-07-14' },
  { id: 'not-003', title: 'System Security Alert', message: 'Please review updated corporate policies on password rotations.', type: 'warning', read: true, createdAt: '2026-07-10' }
];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [
  { id: 'log-001', userName: 'Sarah Jenkins', userRole: 'HR Manager', action: 'Approved Leave Request', module: 'Leave Management', details: 'Approved Sick Leave for Sophia Wong from 14-Jul to 15-Jul.', ipAddress: '192.168.1.45', createdAt: '2026-07-13T16:45:00Z' },
  { id: 'log-002', userName: 'Jessica Taylor', userRole: 'Payroll Manager', action: 'Processed Monthly Payroll', module: 'Payroll', details: 'Generated June salary history entries for active staff.', ipAddress: '192.168.1.12', createdAt: '2026-06-30T17:00:00Z' },
  { id: 'log-003', userName: 'Sarah Jenkins', userRole: 'HR Manager', action: 'Created Candidate Profile', module: 'Recruitment', details: 'Sourced candidate Tanya Smith for HR Talent Partner opening.', ipAddress: '192.168.1.45', createdAt: '2026-07-11T11:20:00Z' }
];

// Context for AI Agent RAG matching
export const CORPORATE_POLICY_TEXT = `
HRBrain AI Tech Policies and Guidelines Manual:

1. LEAVE MANAGEMENT POLICY
- Employees are granted 10 days of Casual Leave (CL), 8 days of Sick Leave (SL), and 15 days of Earned Leave (EL) annually.
- Work From Home (WFH) requests can be applied up to a maximum limit of 24 days in a year. WFH requires manager approval.
- Half Day leave can be requested for morning or afternoon slots. It deducts 0.5 days from the Casual Leave pool.
- Comp Off (Compensatory Off) can be claimed when working on official company holidays, with Lead approval.
- Approval workflows: Employee -> Department Manager / Lead -> HR Manager. Standard approval window is 48 hours.

2. TAX & PAYROLL STRUCTURE (PF, ESI, TDS, HRA)
- PF (Provident Fund): Standard employee contribution is 12% of basic salary. The company matches this 12% contribution.
- ESI (Employee State Insurance): Applied to eligible employees with gross salaries under statutory limits. Standard employee deduction is 0.75%, employer contribution is 3.25%.
- TDS (Tax Deducted at Source): Evaluated on standard tax brackets depending on declaring regime (New vs Old Tax Regime). Standard bracket ranges from 0% for incomes up to $50,000 to 30% for incomes above $150,000.
- HRA (House Rent Allowance): HRA is structured as 40% of the Basic Salary for non-metropolitan locations, and 50% of the Basic Salary for metro cities. HRA exemption can be claimed by submitting valid rent receipts and landlord PAN cards.

3. RECRUITMENT & OFFERS
- Offer generation requires approval from the Hiring Manager and HR Manager.
- Recommended probation period for all new joiners is 3 months.
- Joining letters are dispatched 10 business days before the joining date. Experience and Relieving letters require a clearance certificate from IT, Finance, and HR.

4. ATTENDANCE & GEOLOCATION
- Standard shift timing is 09:00 AM to 06:00 PM (flexible up to 30 minutes grace period, so late mark triggers after 09:30 AM).
- Check-in from outside office coordinates requires Geolocation tagging.
- Overtime triggers for work recorded beyond 9 hours on standard days.
`;
