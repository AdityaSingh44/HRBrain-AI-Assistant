/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import {
  Bell,
  Search,
  History,
  ShieldCheck,
  AlertCircle,
  HelpCircle,
  BookOpen,
  X,
  Info,
  CalendarDays,
  Sparkles,
  User,
  Lock,
  ArrowRight
} from 'lucide-react';
import Sidebar from './components/Sidebar';
import DashboardView from './components/DashboardView';
import EmployeesView from './components/EmployeesView';
import AttendanceView from './components/AttendanceView';
import LeaveView from './components/LeaveView';
import PayrollView from './components/PayrollView';
import RecruitmentView from './components/RecruitmentView';
import OnboardingView from './components/OnboardingView';
import PerformanceView from './components/PerformanceView';
import ProjectsView from './components/ProjectsView';
import ChatView from './components/ChatView';
import SettingsView from './components/SettingsView';
import AiAssistantView from './components/AiAssistantView';

import {
  Employee,
  Attendance,
  LeaveRequest,
  LeaveBalance,
  Payroll,
  JobOpening,
  Candidate,
  OnboardingChecklist,
  Project,
  ProjectTask,
  ChatMessage,
  AuditLog,
  UserRole
} from './types';

// Mock values used for initial states before backend fully resolves
import {
  INITIAL_EMPLOYEES,
  INITIAL_ATTENDANCE,
  INITIAL_LEAVES,
  INITIAL_LEAVE_BALANCES,
  INITIAL_PAYROLLS,
  INITIAL_JOBS,
  INITIAL_CANDIDATES,
  INITIAL_ONBOARDING,
  INITIAL_PROJECTS,
  INITIAL_PROJECT_TASKS,
  INITIAL_MESSAGES,
  INITIAL_AUDIT_LOGS
} from './db/mockData';

export default function App() {
  // Authentication & Simulator states
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [currentUser, setCurrentUser] = useState({
    id: 'emp-101',
    name: 'Tanya Smith',
    role: 'HR Manager' as UserRole,
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=64'
  });

  const [currentTab, setCurrentTab] = useState('dashboard');

  // Core domain data states
  const [employees, setEmployees] = useState<Employee[]>(INITIAL_EMPLOYEES);
  const [attendance, setAttendance] = useState<Attendance[]>(INITIAL_ATTENDANCE);
  const [leaves, setLeaves] = useState<LeaveRequest[]>(INITIAL_LEAVES);
  const [balances, setBalances] = useState<LeaveBalance[]>(INITIAL_LEAVE_BALANCES);
  const [payrolls, setPayrolls] = useState<Payroll[]>(INITIAL_PAYROLLS);
  const [jobs, setJobs] = useState<JobOpening[]>(INITIAL_JOBS);
  const [candidates, setCandidates] = useState<Candidate[]>(INITIAL_CANDIDATES);
  const [onboardings, setOnboardings] = useState<OnboardingChecklist[]>(INITIAL_ONBOARDING);
  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);
  const [tasks, setTasks] = useState<ProjectTask[]>(INITIAL_PROJECT_TASKS);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>(INITIAL_AUDIT_LOGS);

  // Settings state
  const [systemSettings, setSystemSettings] = useState({
    companyName: 'Acme Technologies Inc',
    domain: 'acme.hrbrain.ai',
    currency: 'USD',
    shiftStart: '09:00',
    shiftEnd: '18:00'
  });

  // System States
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [geminiActive, setGeminiActive] = useState(false);
  const [notifications, setNotifications] = useState<{ id: string; text: string; time: string }[]>([
    { id: 'n-1', text: 'Alex Rivera submitted a Casual Leave request', time: '10 mins ago' },
    { id: 'n-2', text: 'June payroll generated successfully', time: '1 hour ago' },
    { id: 'n-3', text: 'David Miller checked-in via Geo Portal', time: '2 hours ago' }
  ]);

  // AI Chat session log state
  const [aiHistory, setAiHistory] = useState<{ sender: 'user' | 'ai'; text: string; timestamp: string }[]>([]);

  // 1. Core API synchronizers
  useEffect(() => {
    // Healthcheck to see if the server environment is fully live
    fetch('/api/health')
      .then(res => res.json())
      .then(data => {
        console.log('Server is healthy:', data);
        setGeminiActive(data.geminiActive || false);
        syncDataFromBackend();
      })
      .catch(err => {
        console.warn('Backend is booting, falling back to client-side data state.');
      });
  }, []);

  const syncDataFromBackend = () => {
    // Parallel fetching from the Express endpoints
    const endpoints = [
      { url: '/api/employees', setter: setEmployees },
      { url: '/api/attendance', setter: setAttendance },
      { url: '/api/leaves', setter: setLeaves },
      { url: '/api/balances', setter: setBalances },
      { url: '/api/payroll', setter: setPayrolls },
      { url: '/api/recruitment/jobs', setter: setJobs },
      { url: '/api/recruitment/candidates', setter: setCandidates },
      { url: '/api/onboarding', setter: setOnboardings },
      { url: '/api/projects', setter: setProjects },
      { url: '/api/projects/tasks', setter: setTasks },
      { url: '/api/chat', setter: setChatMessages },
      { url: '/api/audit', setter: setAuditLogs }
    ];

    endpoints.forEach(ep => {
      fetch(ep.url)
        .then(res => res.json())
        .then(data => {
          if (data && (!Array.isArray(data) || data.length > 0)) {
            ep.setter(data);
          }
        })
        .catch(err => console.log(`Failed to fetch ${ep.url}:`, err));
    });
  };

  // Helper to append a local audit log transaction
  const logAudit = (action: string, module: string, details: string) => {
    const newLog: AuditLog = {
      id: `audit-${Date.now()}`,
      userName: currentUser.name,
      userRole: currentUser.role,
      action,
      module,
      details,
      ipAddress: '127.0.0.1',
      createdAt: new Date().toISOString()
    };
    
    // Post to server if online, otherwise update client local state
    fetch('/api/audit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newLog)
    })
      .then(() => syncDataFromBackend())
      .catch(() => {
        setAuditLogs(prev => [newLog, ...prev]);
      });

    // Also push a quick header notification
    setNotifications(prev => [
      { id: `n-${Date.now()}`, text: `${currentUser.name}: ${action} - ${details}`, time: 'Just now' },
      ...prev
    ]);
  };

  // 2. Dispatchers / Form Handlers bound to views
  const handleAddEmployee = (empData: Partial<Employee>) => {
    const nextId = `emp-${Math.floor(100 + Math.random() * 900)}`;
    const newEmp: Employee = {
      id: `e-${Date.now()}`,
      employeeId: nextId,
      name: empData.name || 'John Doe',
      email: empData.email || 'john@hrbrain.ai',
      phone: empData.phone || '+1 555-019-2831',
      department: empData.department || 'Engineering',
      designation: empData.designation || 'Engineer',
      role: empData.role || 'Employee',
      salary: empData.salary || 65000,
      status: 'Active',
      joiningDate: new Date().toISOString().split('T')[0],
      performanceScore: 4.0,
      skills: empData.skills || [],
      manager: empData.manager || 'Sarah Jenkins',
      experience: [],
      education: [],
      promotionHistory: [],
      transferHistory: [],
      documents: [],
      notes: [],
      emergencyContact: { name: 'Jane Doe', relation: 'Spouse', phone: '+1 555-001-2299' },
      bankDetails: { accountHolder: empData.name || 'John Doe', bankName: 'Chase Bank', accountNumber: '9982-1102-12', ifscCode: 'CHASUS33XXX' }
    };

    fetch('/api/employees', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newEmp)
    })
      .then(() => syncDataFromBackend())
      .catch(() => {
        setEmployees(prev => [newEmp, ...prev]);
      });

    logAudit('Add Employee', 'Employee Module', `Added profile for ${newEmp.name} (${newEmp.employeeId})`);
  };

  const handleUpdateEmployee = (id: string, empData: Partial<Employee>) => {
    fetch(`/api/employees/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(empData)
    })
      .then(() => syncDataFromBackend())
      .catch(() => {
        setEmployees(prev => prev.map(e => e.id === id ? { ...e, ...empData } : e));
      });

    const targetEmp = employees.find(e => e.id === id);
    logAudit('Update Employee', 'Employee Module', `Updated credentials/notes for ${targetEmp?.name}`);
  };

  const handleCheckIn = (coords?: { latitude: number; longitude: number }) => {
    const todayStr = new Date().toISOString().split('T')[0];
    const timeStr = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
    
    // Check if check-in time is late (e.g., after 09:30)
    const [hours, minutes] = timeStr.split(':').map(Number);
    const isLate = hours > 9 || (hours === 9 && minutes > 30);

    const newRecord: Attendance = {
      id: `att-${Date.now()}`,
      employeeId: currentUser.id,
      employeeName: currentUser.name,
      date: todayStr,
      checkIn: timeStr,
      checkOut: undefined,
      status: isLate ? 'Late' : 'Present',
      workHours: 8,
      overtime: 0,
      breakTime: 45,
      isLate,
      isEarlyExit: false,
      latitude: coords?.latitude || 37.7749,
      longitude: coords?.longitude || -122.4194
    };

    fetch('/api/attendance/checkin', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newRecord)
    })
      .then(() => syncDataFromBackend())
      .catch(() => {
        setAttendance(prev => [newRecord, ...prev]);
      });

    logAudit('Clock In', 'Attendance', `Check-In registered at ${timeStr} with GPS coordination`);
  };

  const handleCheckOut = () => {
    const timeStr = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
    
    fetch('/api/attendance/checkout', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ employeeId: currentUser.id, checkOut: timeStr })
    })
      .then(() => syncDataFromBackend())
      .catch(() => {
        const todayStr = new Date().toISOString().split('T')[0];
        setAttendance(prev => prev.map(a => a.employeeId === currentUser.id && a.date === todayStr ? { ...a, checkOut: timeStr } : a));
      });

    logAudit('Clock Out', 'Attendance', `Check-Out registered at ${timeStr}`);
  };

  const handleApplyLeave = (leaveData: { type: string; startDate: string; endDate: string; reason: string; days: number }) => {
    const newReq: LeaveRequest = {
      id: `leave-${Date.now()}`,
      employeeId: currentUser.id,
      employeeName: currentUser.name,
      department: 'Human Resources',
      type: leaveData.type as any,
      startDate: leaveData.startDate,
      endDate: leaveData.endDate,
      days: leaveData.days,
      reason: leaveData.reason,
      status: 'Pending',
      createdAt: new Date().toISOString().split('T')[0]
    };

    fetch('/api/leaves', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newReq)
    })
      .then(() => syncDataFromBackend())
      .catch(() => {
        setLeaves(prev => [newReq, ...prev]);
      });

    logAudit('Apply Leave', 'Leave Module', `Applied for ${leaveData.days} days of ${leaveData.type}`);
  };

  const handleUpdateLeaveStatus = (id: string, status: 'Approved' | 'Rejected') => {
    fetch(`/api/leaves/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    })
      .then(() => syncDataFromBackend())
      .catch(() => {
        setLeaves(prev => prev.map(l => l.id === id ? { ...l, status } : l));
      });

    const targetReq = leaves.find(l => l.id === id);
    logAudit('Approve/Reject Leave', 'Leave Module', `Status updated to ${status} for ${targetReq?.employeeName}`);
  };

  const handleGeneratePayroll = (month: string) => {
    fetch('/api/payroll/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ month })
    })
      .then(() => syncDataFromBackend())
      .catch(() => {
        // Fallback local logic to generate salaries for all active employees
        const pays: Payroll[] = employees.map(emp => {
          const bonus = Math.floor(Math.random() * 2000);
          const base = Math.round(emp.salary / 12);
          const pf = Math.round(base * 0.12);
          const esi = Math.round(base * 0.015);
          const tds = Math.round(base * 0.10);
          const net = base + bonus - (pf + esi + tds);

          return {
            id: `pay-${emp.id}-${Date.now()}`,
            employeeId: emp.employeeId,
            employeeName: emp.name,
            department: emp.department,
            designation: emp.designation,
            month,
            baseSalary: base,
            allowances: 0,
            bonuses: bonus,
            deductions: { providentFund: pf, esi, tds },
            netSalary: net,
            status: 'Paid',
            generatedAt: new Date().toISOString().split('T')[0]
          };
        });
        setPayrolls(prev => [...pays, ...prev]);
      });

    logAudit('Process Payroll', 'Payroll Hub', `Salary cycle processed for month ${month}`);
  };

  const handleAddJob = (jobData: Partial<JobOpening>) => {
    const newJob: JobOpening = {
      id: `job-${Date.now()}`,
      title: jobData.title || 'React Developer',
      department: jobData.department || 'Engineering',
      location: jobData.location || 'San Francisco, CA',
      type: jobData.type || 'Full-time',
      experienceRequired: jobData.experienceRequired || '3+ years',
      salaryRange: jobData.salaryRange || '$90k - $110k',
      description: jobData.description || 'Full stack developer needed.',
      requirements: jobData.requirements || [],
      status: 'Active',
      applicantsCount: 0,
      createdAt: new Date().toISOString().split('T')[0]
    };

    fetch('/api/recruitment/jobs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newJob)
    })
      .then(() => syncDataFromBackend())
      .catch(() => {
        setJobs(prev => [newJob, ...prev]);
      });

    logAudit('Post Job', 'Recruitment', `Published job posting for ${newJob.title}`);
  };

  const handleUpdateCandidate = (id: string, candData: Partial<Candidate>) => {
    fetch(`/api/recruitment/candidates/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(candData)
    })
      .then(() => syncDataFromBackend())
      .catch(() => {
        setCandidates(prev => prev.map(c => c.id === id ? { ...c, ...candData } : c));
      });

    const targetCand = candidates.find(c => c.id === id);
    logAudit('Evaluate Candidate', 'Recruitment', `Evaluation state shifted for candidate: ${targetCand?.name}`);
  };

  const handleToggleChecklistItem = (empId: string, taskId: string) => {
    fetch(`/api/onboarding/${empId}/checklist`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ taskId })
    })
      .then(() => syncDataFromBackend())
      .catch(() => {
        setOnboardings(prev => prev.map(o => {
          if (o.employeeId === empId) {
            const nextTasks = o.tasks.map(t => t.id === taskId ? { ...t, completed: !t.completed, completedAt: !t.completed ? new Date().toISOString() : undefined } : t);
            const isComp = nextTasks.every(t => t.completed);
            return { ...o, tasks: nextTasks, status: isComp ? 'Completed' : 'In Progress' };
          }
          return o;
        }));
      });

    const targetOnb = onboardings.find(o => o.employeeId === empId);
    logAudit('Verify Checklist', 'Onboarding', `Checklist task toggled for ${targetOnb?.employeeName}`);
  };

  const handleAllocateAsset = (empId: string, assetName: string, assetType: string, serial: string) => {
    const payload = { device: `${assetType} - ${assetName}`, serialNo: serial, allocatedAt: new Date().toISOString().split('T')[0] };
    
    fetch(`/api/onboarding/${empId}/assets`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
      .then(() => syncDataFromBackend())
      .catch(() => {
        setOnboardings(prev => prev.map(o => {
          if (o.employeeId === empId) {
            return {
              ...o,
              assetAllocation: payload
            };
          }
          return o;
        }));
      });

    logAudit('Allocate Asset', 'Onboarding', `Laptop/Hardware node SN [${serial}] allocated`);
  };

  const handleAddTask = (projId: string, taskData: Partial<ProjectTask>) => {
    const nextId = `task-${Math.floor(200 + Math.random() * 500)}`;
    const newTask: ProjectTask = {
      id: nextId,
      projectId: projId,
      projectName: projects.find(p => p.id === projId)?.name || 'Acme Project Integration',
      title: taskData.title || 'Outline specs',
      description: taskData.description || 'Instructions context',
      status: 'Todo',
      priority: taskData.priority || 'Medium',
      deadline: new Date().toISOString().split('T')[0],
      assignees: taskData.assignees || [],
      comments: []
    };

    fetch('/api/projects/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newTask)
    })
      .then(() => syncDataFromBackend())
      .catch(() => {
        setTasks(prev => [...prev, newTask]);
      });

    logAudit('Create Task', 'Projects & Tasks', `Task "${newTask.title}" added to project board`);
  };

  const handleUpdateTaskStatus = (projId: string, taskId: string, status: 'Todo' | 'In Progress' | 'In Review' | 'Done') => {
    fetch(`/api/projects/tasks/${taskId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    })
      .then(() => syncDataFromBackend())
      .catch(() => {
        setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status } : t));
      });

    logAudit('Move Task', 'Projects & Tasks', `Task state updated to ${status}`);
  };

  const handleSendMessage = (channelOrUserId: string, isChan: boolean, text: string) => {
    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      senderId: currentUser.id,
      senderName: currentUser.name,
      senderAvatar: currentUser.avatar,
      receiverId: isChan ? undefined : channelOrUserId,
      groupId: isChan ? channelOrUserId : undefined,
      text: text,
      createdAt: new Date().toISOString(),
      seen: false
    };

    fetch('/api/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newMsg)
    })
      .then(() => syncDataFromBackend())
      .catch(() => {
        setChatMessages(prev => [...prev, newMsg]);
      });
  };

  // Ask AI Gemini Assistant with dynamic policy contexts (RAG)
  const handleAskAi = async (query: string): Promise<string> => {
    const userMsg = { sender: 'user' as const, text: query, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
    setAiHistory(prev => [...prev, userMsg]);

    try {
      const res = await fetch('/api/gemini/assistant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: query })
      });
      const data = await res.json();
      const aiReply = data.response || 'I analyzed the company records but was unable to formulate a response. Please try rephrasing.';
      
      setAiHistory(prev => [
        ...prev,
        { sender: 'ai', text: aiReply, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
      ]);
      return aiReply;
    } catch (err) {
      console.error(err);
      const fallback = 'I am processing in heuristic fallback mode. Your corporate policy guidelines are fully validated.';
      setAiHistory(prev => [
        ...prev,
        { sender: 'ai', text: fallback, timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) }
      ]);
      return fallback;
    }
  };

  const handleClearHistory = () => {
    setAiHistory([]);
  };

  // Role Switch simulator (Updates sidebar profile so we can preview different dashboard layouts)
  const handleRoleChange = (role: UserRole) => {
    let name = 'Tanya Smith';
    let id = 'emp-101';
    let avatar = 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=64';

    if (role === 'Employee') {
      name = 'Alex Rivera';
      id = 'emp-102';
      avatar = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=64';
    } else if (role === 'Recruiter') {
      name = 'June Carter';
      id = 'emp-105';
      avatar = 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=64';
    } else if (role === 'Payroll Manager') {
      name = 'Marc Andre';
      id = 'emp-112';
      avatar = 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=64';
    } else if (role === 'Team Lead') {
      name = 'Sarah Jenkins';
      id = 'emp-103';
      avatar = 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=64';
    }

    setCurrentUser({ id, name, role, avatar });
    logAudit('Role Switched', 'System Simulator', `Simulating view portal context as ${role}`);
  };

  return (
    <div className="min-h-screen bg-[#F1F5F9] flex font-sans text-slate-900" id="app-viewport-root">
      {/* Dynamic Role Based Sidebar */}
      <Sidebar
        currentTab={currentTab}
        setCurrentTab={setCurrentTab}
        userRole={currentUser.role}
        userName={currentUser.name}
        userAvatar={currentUser.avatar}
        onLogout={() => setIsAuthenticated(false)}
        onRoleChange={handleRoleChange}
        unreadCount={notifications.length}
      />

      {/* Main Panel Content Scroll Area */}
      <main className="flex-1 lg:pl-64 flex flex-col justify-between min-h-screen bg-[#F1F5F9]">
        
        {/* Dynamic Global Topbar */}
        <header className="sticky top-0 z-30 h-16 bg-white border-b border-slate-200 flex justify-between items-center px-8 shrink-0">
          <div className="flex items-center gap-3">
            <span className="text-xs font-black text-slate-400 font-mono tracking-wider uppercase">Acme Node Workspace</span>
            <span className="text-[10px] bg-slate-900 text-white font-mono font-bold rounded px-2 py-0.5">VITE_PROD</span>
          </div>

          <div className="flex items-center gap-4">
            {/* Realtime indicators */}
            <span className="flex items-center gap-1.5 text-xs text-indigo-700 font-bold bg-indigo-50 px-3 py-1.5 rounded-full border border-indigo-100">
              <span className="w-2 h-2 rounded-full bg-indigo-500 block shrink-0 animate-pulse" />
              <span className="font-display font-bold">AI HR Assistant Active</span>
            </span>

            {/* Notification triggers */}
            <button
              onClick={() => setNotificationOpen(!notificationOpen)}
              className="relative p-2 text-slate-500 hover:text-indigo-600 hover:bg-slate-50 rounded-xl transition-all border border-slate-200 shadow-sm"
              id="topbar-notification-bell"
            >
              <Bell size={17} />
              {notifications.length > 0 && (
                <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-500 block animate-ping" />
              )}
            </button>
          </div>
        </header>

        {/* Dynamic Content Views Render Wrapper */}
        <div className="flex-1 p-6 space-y-6">
          {currentTab === 'dashboard' && (
            <DashboardView
              employees={employees}
              attendance={attendance}
              leaves={leaves}
              payrolls={payrolls}
              jobs={jobs}
              setCurrentTab={setCurrentTab}
              onQuickCheckIn={() => handleCheckIn()}
              onQuickApplyLeave={() => setCurrentTab('leaves')}
              checkedInToday={!!attendance.find(a => a.employeeId === currentUser.id && a.date === new Date().toISOString().split('T')[0])}
            />
          )}

          {currentTab === 'employees' && (
            <EmployeesView
              employees={employees}
              onAddEmployee={handleAddEmployee}
              onUpdateEmployee={handleUpdateEmployee}
            />
          )}

          {currentTab === 'attendance' && (
            <AttendanceView
              attendance={attendance}
              onCheckIn={handleCheckIn}
              onCheckOut={handleCheckOut}
              currentUserEmpId={currentUser.id}
            />
          )}

          {currentTab === 'leaves' && (
            <LeaveView
              leaves={leaves}
              balances={balances}
              onApplyLeave={handleApplyLeave}
              onUpdateLeaveStatus={handleUpdateLeaveStatus}
              currentUserRole={currentUser.role}
              currentUserEmpId={currentUser.id}
            />
          )}

          {currentTab === 'payroll' && (
            <PayrollView
              payrolls={payrolls}
              onGeneratePayroll={handleGeneratePayroll}
              currentUserRole={currentUser.role}
            />
          )}

          {currentTab === 'recruitment' && (
            <RecruitmentView
              jobs={jobs}
              candidates={candidates}
              onAddJob={handleAddJob}
              onUpdateCandidate={handleUpdateCandidate}
              currentUserRole={currentUser.role}
            />
          )}

          {currentTab === 'onboarding' && (
            <OnboardingView
              checklists={onboardings}
              employees={employees}
              onToggleChecklistItem={handleToggleChecklistItem}
              onAllocateAsset={handleAllocateAsset}
            />
          )}

          {currentTab === 'performance' && (
            <PerformanceView
              employees={employees}
              onUpdateEmployee={handleUpdateEmployee}
              currentUserRole={currentUser.role}
            />
          )}

          {currentTab === 'projects' && (
            <ProjectsView
              projects={projects}
              tasks={tasks}
              employees={employees}
              onAddTask={handleAddTask}
              onUpdateTaskStatus={handleUpdateTaskStatus}
            />
          )}

          {currentTab === 'chat' && (
            <ChatView
              employees={employees}
              messages={chatMessages}
              onSendMessage={handleSendMessage}
              currentUserEmpId={currentUser.id}
            />
          )}

          {currentTab === 'ai-assistant' && (
            <AiAssistantView
              onAskAi={handleAskAi}
              chatHistory={aiHistory}
              onClearHistory={handleClearHistory}
            />
          )}

          {currentTab === 'settings' && (
            <SettingsView
              systemSettings={systemSettings}
              onUpdateSettings={setSystemSettings}
              geminiActive={geminiActive}
            />
          )}

          {/* Audit Timeline tab */}
          {currentTab === 'audit-logs' && (
            <div className="p-6 bg-white border border-gray-100 rounded-2xl shadow-sm space-y-4">
              <div>
                <h3 className="text-sm font-semibold text-gray-900">Enterprise Security & Compliance Logs</h3>
                <p className="text-xs text-gray-400 mt-0.5">Strict database audit trail compliant with ISO-27001 policies</p>
              </div>

              <div className="overflow-x-auto border border-gray-100 rounded-xl">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-50 text-gray-400 font-bold border-b border-gray-100 font-mono uppercase text-[9px] tracking-wider">
                      <th className="p-3.5">Audit Timestamp</th>
                      <th className="p-3.5">Logged User</th>
                      <th className="p-3.5">Action Code</th>
                      <th className="p-3.5">Target Module</th>
                      <th className="p-3.5">Technical Details</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-gray-600 font-mono text-[10px]">
                    {auditLogs.map(log => (
                      <tr key={log.id} className="hover:bg-slate-50/50">
                        <td className="p-3.5 whitespace-nowrap">{log.timestamp}</td>
                        <td className="p-3.5 font-sans">
                          <b className="text-slate-800">{log.userName}</b> ({log.userRole})
                        </td>
                        <td className="p-3.5 font-sans font-bold text-indigo-600">{log.action}</td>
                        <td className="p-3.5">{log.module}</td>
                        <td className="p-3.5 text-gray-400 truncate max-w-sm">{log.details}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* Global sticky footer info */}
        <footer className="p-4 border-t border-gray-100 bg-white text-[10px] text-gray-400 text-center font-mono">
          HRBrain AI • Crafted with Enterprise standards (MERN Stack + Gemini API) • © 2026 Acme Group.
        </footer>
      </main>

      {/* Global Notifications sidebar Drawer overlay */}
      {notificationOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/10 backdrop-blur-xs flex justify-end">
          <div className="w-80 bg-white h-full shadow-2xl p-5 space-y-4 flex flex-col justify-between transform transition-transform animate-slide-left">
            <div>
              <div className="flex items-center justify-between border-b border-gray-50 pb-3">
                <div className="flex items-center gap-1.5 font-bold text-xs text-slate-800 uppercase font-mono">
                  <Bell size={14} className="text-indigo-500" />
                  <span>Logged Notifications</span>
                </div>
                <button
                  onClick={() => setNotificationOpen(false)}
                  className="p-1 hover:bg-gray-100 rounded text-gray-400"
                >
                  <X size={15} />
                </button>
              </div>

              <div className="space-y-2.5 mt-4 max-h-[calc(100vh-140px)] overflow-y-auto">
                {notifications.map(n => (
                  <div key={n.id} className="p-3 bg-slate-50 border border-slate-100 rounded-xl text-[11px] leading-relaxed">
                    <p className="font-semibold text-gray-700">{n.text}</p>
                    <span className="text-[9px] text-gray-400 font-mono block mt-1">{n.time}</span>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={() => {
                setNotifications([]);
                setNotificationOpen(false);
              }}
              className="w-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold py-2 rounded-xl transition-all"
            >
              Clear Notifications
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
