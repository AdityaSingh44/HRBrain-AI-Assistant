/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Import initial dataset and policy contexts
import {
  COMPANY_PROFILE,
  HOLIDAYS,
  INITIAL_EMPLOYEES,
  INITIAL_ATTENDANCE,
  INITIAL_LEAVES,
  INITIAL_LEAVE_BALANCES,
  INITIAL_PAYROLLS,
  INITIAL_JOBS,
  INITIAL_CANDIDATES,
  INITIAL_ONBOARDING,
  INITIAL_GOALS,
  INITIAL_PROJECTS,
  INITIAL_PROJECT_TASKS,
  INITIAL_MESSAGES,
  INITIAL_NOTIFICATIONS,
  INITIAL_AUDIT_LOGS,
  CORPORATE_POLICY_TEXT
} from './src/db/mockData.ts';

import { Employee, Attendance, LeaveRequest, Payroll, JobOpening, Candidate, Project, ProjectTask, ChatMessage, Notification, AuditLog } from './src/types';

// Establish Server State (In-Memory database)
const state = {
  employees: [...INITIAL_EMPLOYEES],
  attendance: [...INITIAL_ATTENDANCE],
  leaves: [...INITIAL_LEAVES],
  leaveBalances: [...INITIAL_LEAVE_BALANCES],
  payrolls: [...INITIAL_PAYROLLS],
  jobs: [...INITIAL_JOBS],
  candidates: [...INITIAL_CANDIDATES],
  onboarding: [...INITIAL_ONBOARDING],
  goals: [...INITIAL_GOALS],
  projects: [...INITIAL_PROJECTS],
  tasks: [...INITIAL_PROJECT_TASKS],
  messages: [...INITIAL_MESSAGES],
  notifications: [...INITIAL_NOTIFICATIONS],
  auditLogs: [...INITIAL_AUDIT_LOGS],
  currentUser: {
    id: 'emp-001',
    employeeId: 'HB-001',
    name: 'Sarah Jenkins',
    email: 'sarah.jenkins@hrbrain.ai',
    role: 'HR Manager' as any,
    department: 'Human Resources',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=120',
    status: 'Active' as any
  }
};

// Initialize Google Gemini Client (Server-side only)
let aiClient: GoogleGenAI | null = null;
const API_KEY = process.env.GEMINI_API_KEY;

if (API_KEY && API_KEY !== 'MY_GEMINI_API_KEY') {
  try {
    aiClient = new GoogleGenAI({
      apiKey: API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build'
        }
      }
    });
    console.log('Google Gemini AI SDK successfully loaded on Server.');
  } catch (err) {
    console.error('Error initializing Google GenAI Client:', err);
  }
} else {
  console.log('No active GEMINI_API_KEY detected. AI operations will use highly detailed offline fallback answers.');
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  // Middlewares
  app.use(express.json());

  // Helper to log audit actions
  const logAudit = (action: string, module: string, details: string) => {
    const newLog: AuditLog = {
      id: `log-${Date.now()}`,
      userName: state.currentUser.name,
      userRole: state.currentUser.role,
      action,
      module,
      details,
      ipAddress: '127.0.0.1',
      createdAt: new Date().toISOString()
    };
    state.auditLogs.unshift(newLog);
    
    // Also push a system notification
    const newNotif: Notification = {
      id: `not-${Date.now()}`,
      title: action,
      message: details,
      type: 'info',
      read: false,
      createdAt: new Date().toISOString().split('T')[0]
    };
    state.notifications.unshift(newNotif);
  };

  // ==========================================
  // AUTHENTICATION APIs
  // ==========================================
  app.post('/api/auth/login', (req, res) => {
    const { email, password, role } = req.body;
    // Simple role swap/auth simulation for presentation
    const targetEmp = state.employees.find(e => e.email === email) || state.employees.find(e => e.role === role);
    
    if (targetEmp) {
      state.currentUser = {
        id: targetEmp.id,
        employeeId: targetEmp.employeeId,
        name: targetEmp.name,
        email: targetEmp.email,
        role: targetEmp.role,
        department: targetEmp.department,
        avatar: targetEmp.avatar,
        status: targetEmp.status
      };
      logAudit('User Login', 'Authentication', `${state.currentUser.name} logged in successfully as ${state.currentUser.role}.`);
      return res.json({ success: true, user: state.currentUser });
    }
    
    // Default fallback to HR manager Sarah
    return res.json({ success: true, user: state.currentUser });
  });

  app.get('/api/auth/me', (req, res) => {
    res.json(state.currentUser);
  });

  app.post('/api/auth/logout', (req, res) => {
    logAudit('User Logout', 'Authentication', `${state.currentUser.name} logged out.`);
    res.json({ success: true });
  });

  // ==========================================
  // EMPLOYEE MANAGEMENT APIs
  // ==========================================
  app.get('/api/employees', (req, res) => {
    res.json(state.employees);
  });

  app.post('/api/employees', (req, res) => {
    const newEmp: Employee = {
      id: `emp-${Date.now()}`,
      employeeId: `HB-0${state.employees.length + 1}`,
      promotionHistory: [],
      transferHistory: [],
      documents: [],
      notes: [],
      joiningDate: new Date().toISOString().split('T')[0],
      performanceScore: 4.0,
      bankDetails: {
        accountHolder: req.body.name,
        accountNumber: 'N/A',
        bankName: 'N/A',
        ifscCode: 'N/A'
      },
      emergencyContact: {
        name: 'N/A',
        relation: 'N/A',
        phone: 'N/A'
      },
      ...req.body
    };
    state.employees.push(newEmp);
    logAudit('Created Employee Profile', 'Employee Management', `Added profile for ${newEmp.name} (${newEmp.designation}).`);
    res.json({ success: true, employee: newEmp });
  });

  app.put('/api/employees/:id', (req, res) => {
    const index = state.employees.findIndex(e => e.id === req.params.id);
    if (index !== -1) {
      state.employees[index] = { ...state.employees[index], ...req.body };
      logAudit('Updated Employee Profile', 'Employee Management', `Updated details for ${state.employees[index].name}.`);
      res.json({ success: true, employee: state.employees[index] });
    } else {
      res.status(404).json({ error: 'Employee not found' });
    }
  });

  app.delete('/api/employees/:id', (req, res) => {
    const index = state.employees.findIndex(e => e.id === req.params.id);
    if (index !== -1) {
      const name = state.employees[index].name;
      state.employees.splice(index, 1);
      logAudit('Deleted Employee Profile', 'Employee Management', `Removed employee profile for ${name}.`);
      res.json({ success: true });
    } else {
      res.status(404).json({ error: 'Employee not found' });
    }
  });

  // ==========================================
  // ATTENDANCE APIs
  // ==========================================
  app.get('/api/attendance', (req, res) => {
    res.json(state.attendance);
  });

  app.post('/api/attendance/check-in', (req, res) => {
    const today = new Date().toISOString().split('T')[0];
    const checkTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    
    // Check if check-in already exists
    const existing = state.attendance.find(a => a.employeeId === state.currentUser.employeeId && a.date === today);
    if (existing) {
      return res.status(400).json({ error: 'Already checked in today' });
    }

    const { latitude, longitude } = req.body;
    const isLate = new Date().getHours() >= 9 && new Date().getMinutes() > 30; // Late check-in logic (after 9:30 AM)

    const newCheckIn: Attendance = {
      id: `att-${Date.now()}`,
      employeeId: state.currentUser.employeeId || 'HB-001',
      employeeName: state.currentUser.name,
      date: today,
      checkIn: checkTime,
      status: isLate ? 'Late' : 'Present',
      workHours: 0,
      overtime: 0,
      breakTime: 0,
      latitude,
      longitude,
      isLate,
      isEarlyExit: false
    };

    state.attendance.push(newCheckIn);
    logAudit('Employee Check-In', 'Attendance', `${state.currentUser.name} checked in at ${checkTime} (Geo: ${latitude ? 'Active' : 'N/A'}).`);
    res.json({ success: true, attendance: newCheckIn });
  });

  app.post('/api/attendance/check-out', (req, res) => {
    const today = new Date().toISOString().split('T')[0];
    const checkTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    const record = state.attendance.find(a => a.employeeId === state.currentUser.employeeId && a.date === today);
    if (!record) {
      return res.status(400).json({ error: 'No check-in record found for today' });
    }

    record.checkOut = checkTime;
    record.workHours = 8.5; // Simulated shift duration
    record.isEarlyExit = new Date().getHours() < 17; // Early exit before 5:00 PM

    logAudit('Employee Check-Out', 'Attendance', `${state.currentUser.name} checked out at ${checkTime}.`);
    res.json({ success: true, attendance: record });
  });

  // ==========================================
  // LEAVE MANAGEMENT APIs
  // ==========================================
  app.get('/api/leaves', (req, res) => {
    res.json(state.leaves);
  });

  app.get('/api/leaves/balances', (req, res) => {
    res.json(state.leaveBalances);
  });

  app.post('/api/leaves', (req, res) => {
    const { type, startDate, endDate, reason, days } = req.body;
    const newRequest: LeaveRequest = {
      id: `leave-${Date.now()}`,
      employeeId: state.currentUser.employeeId || 'HB-001',
      employeeName: state.currentUser.name,
      department: state.currentUser.department || 'Management',
      type,
      startDate,
      endDate,
      days: Number(days),
      reason,
      status: 'Pending',
      createdAt: new Date().toISOString().split('T')[0]
    };
    state.leaves.push(newRequest);
    logAudit('Applied for Leave', 'Leave Management', `${state.currentUser.name} applied for ${type} (${days} days).`);
    res.json({ success: true, leave: newRequest });
  });

  app.put('/api/leaves/:id', (req, res) => {
    const { status } = req.body;
    const index = state.leaves.findIndex(l => l.id === req.params.id);
    if (index !== -1) {
      state.leaves[index].status = status;
      state.leaves[index].approvedBy = state.currentUser.name;
      
      // Update balance if approved
      if (status === 'Approved') {
        const empId = state.leaves[index].employeeId;
        const type = state.leaves[index].type;
        const days = state.leaves[index].days;
        const balance = state.leaveBalances.find(b => b.employeeId === empId);
        
        if (balance) {
          if (type === 'Casual Leave') balance.usedCasual += days;
          else if (type === 'Sick Leave') balance.usedSick += days;
          else if (type === 'Earned Leave') balance.usedEarned += days;
          else if (type === 'WFH') balance.usedWfh += days;
        }

        // Generate leave day in attendance logs
        const today = new Date().toISOString().split('T')[0];
        const hasAttendance = state.attendance.find(a => a.employeeId === empId && a.date === today);
        if (!hasAttendance) {
          state.attendance.push({
            id: `att-l-${Date.now()}`,
            employeeId: empId,
            employeeName: state.leaves[index].employeeName,
            date: today,
            status: type === 'WFH' ? 'Present' : 'Leave',
            workHours: type === 'WFH' ? 8 : 0,
            overtime: 0,
            breakTime: 0,
            isLate: false,
            isEarlyExit: false
          });
        }
      }

      logAudit(`Leave Request ${status}`, 'Leave Management', `${status} leave for ${state.leaves[index].employeeName}.`);
      res.json({ success: true, leave: state.leaves[index] });
    } else {
      res.status(404).json({ error: 'Leave request not found' });
    }
  });

  // ==========================================
  // PAYROLL APIs
  // ==========================================
  app.get('/api/payroll', (req, res) => {
    res.json(state.payrolls);
  });

  app.post('/api/payroll/generate', (req, res) => {
    const { month } = req.body;
    // Generate payroll logs for employees that don't have it for this month
    let generatedCount = 0;
    
    state.employees.forEach(emp => {
      const exists = state.payrolls.some(p => p.employeeId === emp.id && p.month === month);
      if (!exists) {
        const base = Math.round(emp.salary / 12);
        const bonus = Math.random() > 0.7 ? 500 : 0;
        const pf = Math.round(base * 0.12); // 12% PF
        const esi = Math.round(base * 0.0075); // 0.75% ESI
        const tds = Math.round(base * 0.10); // 10% TDS estimation
        const net = base + bonus - (pf + esi + tds);

        state.payrolls.push({
          id: `pay-${Date.now()}-${emp.id}`,
          employeeId: emp.id,
          employeeName: emp.name,
          department: emp.department,
          designation: emp.designation,
          month,
          baseSalary: base,
          bonuses: bonus,
          incentives: 0,
          deductions: {
            providentFund: pf,
            esi,
            tds,
            other: 0
          },
          netSalary: net,
          status: 'Paid',
          generatedAt: new Date().toISOString().split('T')[0],
          paymentMethod: 'Direct Deposit'
        });
        generatedCount++;
      }
    });

    logAudit('Generated Monthly Payroll', 'Payroll Management', `Calculated salaries for ${generatedCount} profiles for ${month}.`);
    res.json({ success: true, generatedCount });
  });

  // ==========================================
  // RECRUITMENT MODULE APIs
  // ==========================================
  app.get('/api/recruitment/jobs', (req, res) => {
    res.json(state.jobs);
  });

  app.post('/api/recruitment/jobs', (req, res) => {
    const newJob: JobOpening = {
      id: `job-${Date.now()}`,
      applicantsCount: 0,
      createdAt: new Date().toISOString().split('T')[0],
      ...req.body
    };
    state.jobs.push(newJob);
    logAudit('Created Job Opening', 'Recruitment', `Published job role: ${newJob.title}.`);
    res.json({ success: true, job: newJob });
  });

  app.get('/api/recruitment/candidates', (req, res) => {
    res.json(state.candidates);
  });

  app.post('/api/recruitment/candidates', (req, res) => {
    const newCand: Candidate = {
      id: `cand-${Date.now()}`,
      resumeUrl: '#',
      ...req.body
    };
    state.candidates.push(newCand);
    logAudit('Registered Candidate Application', 'Recruitment', `Received application from ${newCand.name} for ${newCand.jobTitle}.`);
    res.json({ success: true, candidate: newCand });
  });

  app.put('/api/recruitment/candidates/:id', (req, res) => {
    const index = state.candidates.findIndex(c => c.id === req.params.id);
    if (index !== -1) {
      state.candidates[index] = { ...state.candidates[index], ...req.body };
      logAudit('Updated Candidate Status', 'Recruitment', `Candidate ${state.candidates[index].name} marked as ${state.candidates[index].status}.`);
      res.json({ success: true, candidate: state.candidates[index] });
    } else {
      res.status(404).json({ error: 'Candidate not found' });
    }
  });

  // ==========================================
  // PROJECTS & KANBAN APIs
  // ==========================================
  app.get('/api/projects', (req, res) => {
    res.json(state.projects);
  });

  app.get('/api/projects/tasks', (req, res) => {
    res.json(state.tasks);
  });

  app.post('/api/projects/tasks', (req, res) => {
    const newTask: ProjectTask = {
      id: `tsk-${Date.now()}`,
      comments: [],
      ...req.body
    };
    state.tasks.push(newTask);
    logAudit('Created Project Task', 'Project Management', `Created task: ${newTask.title} on Kanban.`);
    res.json({ success: true, task: newTask });
  });

  app.put('/api/projects/tasks/:id', (req, res) => {
    const index = state.tasks.findIndex(t => t.id === req.params.id);
    if (index !== -1) {
      state.tasks[index] = { ...state.tasks[index], ...req.body };
      res.json({ success: true, task: state.tasks[index] });
    } else {
      res.status(404).json({ error: 'Task not found' });
    }
  });

  app.post('/api/projects/tasks/:id/comment', (req, res) => {
    const index = state.tasks.findIndex(t => t.id === req.params.id);
    if (index !== -1) {
      const comment = {
        id: `com-${Date.now()}`,
        userName: state.currentUser.name,
        text: req.body.text,
        createdAt: new Date().toISOString()
      };
      state.tasks[index].comments.push(comment);
      res.json({ success: true, comment });
    } else {
      res.status(404).json({ error: 'Task not found' });
    }
  });

  // ==========================================
  // REAL-TIME CHAT APIs
  // ==========================================
  app.get('/api/chat', (req, res) => {
    res.json(state.messages);
  });

  app.post('/api/chat', (req, res) => {
    const { receiverId, groupId, text } = req.body;
    const newMessage: ChatMessage = {
      id: `msg-${Date.now()}`,
      senderId: state.currentUser.employeeId || 'HB-001',
      senderName: state.currentUser.name,
      senderAvatar: state.currentUser.avatar,
      receiverId,
      groupId,
      text,
      createdAt: new Date().toISOString(),
      seen: false
    };
    state.messages.push(newMessage);
    res.json({ success: true, message: newMessage });
  });

  // ==========================================
  // NOTIFICATIONS & AUDIT APIs
  // ==========================================
  app.get('/api/notifications', (req, res) => {
    res.json(state.notifications);
  });

  app.post('/api/notifications/read-all', (req, res) => {
    state.notifications.forEach(n => n.read = true);
    res.json({ success: true });
  });

  app.get('/api/audit-logs', (req, res) => {
    res.json(state.auditLogs);
  });

  // ==========================================
  // GOOGLE GEMINI POWERED HR RAG ASSISTANT API
  // ==========================================
  app.post('/api/gemini/assistant', async (req, res) => {
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ error: 'Message payload required' });
    }

    // Step 1: Perform Local RAG Knowledge Search
    // We scan our in-memory corporate state + employee list + leaves + policies to form a highly specific context
    let retrievedContext = 'CURRENT CORPORATE STATE & RECORDS:\n';
    const queryLower = message.toLowerCase();

    // 1a. Search Employees Match
    if (queryLower.includes('employee') || queryLower.includes('staff') || queryLower.includes('who is') || queryLower.includes('joining') || queryLower.includes('salary') || queryLower.includes('eligible') || queryLower.includes('skills')) {
      retrievedContext += `- Active Employees Count: ${state.employees.filter(e => e.status === 'Active').length}\n`;
      retrievedContext += `- Employee List Summary:\n`;
      state.employees.forEach(e => {
        retrievedContext += `  * Name: ${e.name}, ID: ${e.employeeId}, Role: ${e.role}, Dept: ${e.department}, Desig: ${e.designation}, Salary: $${e.salary}, Perf Score: ${e.performanceScore}/5, Skills: ${e.skills.join(', ')}, Manager: ${e.manager}, Joining Date: ${e.joiningDate}\n`;
      });
    }

    // 1b. Search Leaves Match
    if (queryLower.includes('leave') || queryLower.includes('absent') || queryLower.includes('wfh') || queryLower.includes('sick') || queryLower.includes('vacation')) {
      const todayStr = new Date().toISOString().split('T')[0];
      const todayAbsents = state.attendance.filter(a => a.date === todayStr && a.status === 'Absent').map(a => a.employeeName);
      const todayLeaves = state.attendance.filter(a => a.date === todayStr && a.status === 'Leave').map(a => a.employeeName);
      retrievedContext += `- Absents Today (${todayStr}): ${todayAbsents.length > 0 ? todayAbsents.join(', ') : 'None'}\n`;
      retrievedContext += `- On Leave Today (${todayStr}): ${todayLeaves.length > 0 ? todayLeaves.join(', ') : 'None'}\n`;
      retrievedContext += `- Pending Leave Applications:\n`;
      state.leaves.filter(l => l.status === 'Pending').forEach(l => {
        retrievedContext += `  * ${l.employeeName} applied for ${l.type} from ${l.startDate} to ${l.endDate} (${l.days} days) due to: "${l.reason}"\n`;
      });
    }

    // 1c. Search Birthdays & Anniversaries
    if (queryLower.includes('birthday') || queryLower.includes('anniversary') || queryLower.includes('anniversaries')) {
      retrievedContext += `- Upcoming Birthdays:\n`;
      retrievedContext += `  * Sarah Jenkins: March 15\n  * Emily Chen: May 12\n  * Sophia Wong: November 1\n`;
      retrievedContext += `- Upcoming Work Anniversaries:\n`;
      retrievedContext += `  * Sarah Jenkins: March 15 (Joined 2024)\n  * Alex Rivera: January 10 (Joined 2023)\n  * David Miller: August 15 (Joined 2022)\n`;
    }

    // 1d. Search Recruitment / Candidates
    if (queryLower.includes('candidate') || queryLower.includes('interview') || queryLower.includes('job') || queryLower.includes('hiring') || queryLower.includes('applicant')) {
      retrievedContext += `- Active Job Postings:\n`;
      state.jobs.forEach(j => {
        retrievedContext += `  * Title: ${j.title}, Dept: ${j.department}, Status: ${j.status}, Range: ${j.salaryRange}, Requirements: ${j.requirements.join(', ')}\n`;
      });
      retrievedContext += `- Job Applicants & Interviews:\n`;
      state.candidates.forEach(c => {
        retrievedContext += `  * Name: ${c.name}, Applied For: ${c.jobTitle}, Status: ${c.status}, Rating: ${c.rating || 'Unrated'}, Int Schedule: ${c.interviewSchedule ? `${c.interviewSchedule.date} at ${c.interviewSchedule.time}` : 'N/A'}, Feedback notes: ${c.feedback ? c.feedback.notes : 'N/A'}\n`;
      });
    }

    // 1e. Search Corporate Policy Match
    if (queryLower.includes('policy') || queryLower.includes('pf') || queryLower.includes('tds') || queryLower.includes('hra') || queryLower.includes('rule') || queryLower.includes('hour') || queryLower.includes('tax')) {
      retrievedContext += `- Corporate Policy Manual Context:\n${CORPORATE_POLICY_TEXT}\n`;
    }

    // 1f. Match Projects / Performance Goal metrics
    if (queryLower.includes('project') || queryLower.includes('task') || queryLower.includes('kanban') || queryLower.includes('goal') || queryLower.includes('kpi') || queryLower.includes('attrition')) {
      retrievedContext += `- Active Projects:\n`;
      state.projects.forEach(p => {
        retrievedContext += `  * Project: ${p.name}, Status: ${p.status}, Deadline: ${p.deadline}, Dept: ${p.department}\n`;
      });
      retrievedContext += `- Performance Goals & KPIs:\n`;
      state.goals.forEach(g => {
        retrievedContext += `  * ${g.title} (KPI: ${g.kpi}, Target: ${g.target}, Progress: ${g.progress}%, Status: ${g.status})\n`;
      });
      retrievedContext += `- Attrition Stats: Engineering has 0% attrition. Creative Design has 0% attrition. HR has 0% attrition in 2026.\n`;
    }

    // Combine retrieved context with instructions for the Gemini Agent
    const prompt = `You are HRBrain AI Assistant, a highly polished, friendly, and analytical corporate virtual assistant.
You have access to the exact, real-time records of our company (pre-retrieved below via RAG):

${retrievedContext}

INSTRUCTIONS:
1. Always base your answers on the provided context. If the user asks about absents, birthday calendars, payroll stats, candidate evaluations, or corporate policies, look them up in the text above and give precise human responses.
2. If the user asks to "generate" or "write" templates (such as an offer letter, experience certificate, warning email, job description, or policy document), write a highly professional, ready-to-use template populated with the actual employee's/candidate's data (e.g. use Tanya Smith for offer letters, Sarah Jenkins for experience letters, etc.).
3. Maintain a helpful, analytical, and professional tone suitable for senior software engineers, HR directors, and executives.
4. Keep the outputs well-structured with bullet points, clean spacing, and markdown formatting.

USER QUESTION:
"${message}"`;

    if (aiClient) {
      try {
        const response = await aiClient.models.generateContent({
          model: 'gemini-3.5-flash',
          contents: prompt
        });

        const reply = response.text || 'I analyzed the records but was unable to formulate a response. Please try rephrasing.';
        return res.json({ response: reply, sourceContext: retrievedContext });
      } catch (err) {
        console.error('Error in Google Gemini API generation call:', err);
        // Fallback response with search results if API fails (e.g. rate limit, bad API key)
        const fallbackReply = generateHeuristicResponse(message, retrievedContext);
        return res.json({ response: fallbackReply, sourceContext: retrievedContext, isFallback: true });
      }
    } else {
      // Offline Simulation Fallback
      const fallbackReply = generateHeuristicResponse(message, retrievedContext);
      return res.json({ response: fallbackReply, sourceContext: retrievedContext, isFallback: true });
    }
  });

  // Serve static files in production
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`HRBrain AI Application Server is listening on http://localhost:${PORT}`);
  });
}

// Highly descriptive, robust RAG heuristic generator for offline mode
function generateHeuristicResponse(userQuery: string, context: string): string {
  const query = userQuery.toLowerCase();
  
  if (query.includes('absent')) {
    return `### Daily Attendance & Absence Summary (Offline Fallback)
Based on our real-time daily logs:
- **Michael Chang** (Recruiter, Human Resources) is currently logged as **Absent** today.
- **Sophia Wong** (Product Designer, Design) is logged as on **Leave** today (Sick Leave approved by Sarah Jenkins).
- **Sarah Jenkins**, **Alex Rivera**, and **David Miller** are checked in and **Present** in the workspace.`;
  }
  
  if (query.includes('birthday')) {
    return `### Corporate Birthday Calendar
According to our company records, there are no birthdays occurring *today*. However, here are the upcoming celebrations:
- **Sarah Jenkins** (HR Manager) – March 15
- **Emily Chen** (Product Designer) – May 12
- **Sophia Wong** (Product Designer) – November 1`;
  }

  if (query.includes('offer letter') || query.includes('generate offer')) {
    return `### Generated Employment Offer Letter
**Date:** July 14, 2026
**To:** Tanya Smith (Candidate ID: cand-003)

Dear **Tanya Smith**,

We are thrilled to offer you the position of **HR Generalist & Talent Partner** at **HRBrain AI Technologies Inc.**

- **Department:** Human Resources
- **Base Compensation:** $88,000 / annum (payable semi-monthly)
- **Proposed Joining Date:** August 1, 2026
- **Reporting Manager:** Sarah Jenkins (HR Manager)
- **Benefits:** Full premium healthcare coverage, 10 CL / 8 SL / 15 EL leaves, and flexible hybrid remote work options.

Please sign and return the document before July 20, 2026, to signify your acceptance.

Sincerely,
**HRBrain AI Recruiting Team**`;
  }

  if (query.includes('experience letter') || query.includes('write experience')) {
    return `### Professional Experience Certificate
**Date:** July 14, 2026
**To Whom It May Concern**

This is to certify that **Sarah Jenkins** has been employed with **HRBrain AI Technologies Inc.** as an **HR Generalist** under the Human Resources department from **March 15, 2024** to the present date.

During her tenure, Sarah has exhibited outstanding competence in:
- Talent Acquisition, Employee Relations, and Conflict Resolution.
- Compensation benefits compliance and SaaS onboarding metrics.

Sarah is a highly motivated, reliable professional. We wish her continued excellence in all future endeavors.

Sincerely,
**Sophia Wong**
Director of Operations`;
  }

  if (query.includes('pf') || query.includes('provident fund')) {
    return `### Corporate Provident Fund (PF) Policy
Under HRBrain AI Guidelines (Section 2.1):
- **Contribution Level:** The standard employee PF deduction is **12%** of the Basic Salary.
- **Company Match:** HRBrain AI matches this contribution with an additional **12%** deposited directly to your PF retirement corpus.
- **Impact:** This is fully integrated into the monthly payroll engine. For example, for Sarah Jenkins, $850 is deducted and matched monthly.`;
  }

  if (query.includes('tds') || query.includes('tax')) {
    return `### Tax Deducted at Source (TDS) & Tax Bracket Details
Based on Section 2.3 of our Finance guidelines:
- **TDS Computation:** Deductions are automatically evaluated based on your salary band and declared tax regime (Old vs New tax regimes).
- **Estimated Bracket Rates:**
  - Up to $50,000 per year: 0% Tax
  - $50,001 to $100,000: 10% TDS
  - $100,001 to $150,000: 20% TDS
  - Above $150,000: 30% TDS
- Net pay calculations are executed by the payroll manager on the 25th of every month.`;
  }

  if (query.includes('hra') || query.includes('rent')) {
    return `### House Rent Allowance (HRA) Policy
- **Metro Locations:** Employees working/living in metro zones are eligible for HRA exemptions of up to **50% of Basic Salary**.
- **Non-Metro Locations:** Eligible HRA is capped at **40% of Basic Salary**.
- **Submission Requirements:** To process exemptions, please upload your rent lease agreement and landlord PAN documentation into the Document Center before the Q3 finance audit.`;
  }

  if (query.includes('attrition')) {
    return `### Retention and Attrition Analytics
According to our organizational records for 2026:
- **Engineering Department:** 0% Attrition (8 core developers retained)
- **Creative & Design Department:** 0% Attrition (Sophia Wong and Emily Chen)
- **Human Resources:** 0% Attrition
- **Overall Retention Index:** **100%**. This is significantly above the SaaS industry average of 86%.`;
  }

  return `### HRBrain AI Corporate Response
I processed our active employee rosters, leave calendar, and the company policy manuals to evaluate your inquiry:

- **Active Headcount:** We currently have **${state.employees.length} active employees** across Engineering, HR, Design, and Sales & Marketing.
- **Today's Attendance:** attendance logs are fully generated. Currently **Sarah Jenkins**, **Alex Rivera**, and **David Miller** are on duty.
- **Leave Operations:** Sophia Wong is out on Sick Leave, and Emily Chen has a pending WFH application.

*To retrieve more precise reports, you can specify individual employee names (e.g., Sarah, Alex, Emily) or ask specific policy questions (e.g., WFH, PF, HRA).*`;
}

startServer();
