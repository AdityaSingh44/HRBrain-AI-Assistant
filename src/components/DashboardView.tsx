/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  Users,
  Clock,
  Briefcase,
  TrendingUp,
  Cake,
  Award,
  ChevronRight,
  ArrowUpRight,
  BadgeAlert,
  Zap,
  CalendarDays,
  FileCheck2,
  MapPin,
  Map,
  SmilePlus
} from 'lucide-react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend
} from 'recharts';
import { Employee, Attendance, LeaveRequest, Payroll, JobOpening } from '../types';

interface DashboardViewProps {
  employees: Employee[];
  attendance: Attendance[];
  leaves: LeaveRequest[];
  payrolls: Payroll[];
  jobs: JobOpening[];
  setCurrentTab: (tab: string) => void;
  onQuickCheckIn: () => void;
  onQuickApplyLeave: () => void;
  checkedInToday: boolean;
}

export default function DashboardView({
  employees,
  attendance,
  leaves,
  payrolls,
  jobs,
  setCurrentTab,
  onQuickCheckIn,
  onQuickApplyLeave,
  checkedInToday
}: DashboardViewProps) {
  // 1. Calculations
  const totalEmployees = employees.length;
  const activeEmployees = employees.filter(e => e.status === 'Active').length;
  const inactiveEmployees = totalEmployees - activeEmployees;
  
  const todayStr = new Date().toISOString().split('T')[0];
  const todayAttendance = attendance.filter(a => a.date === todayStr);
  const presentCount = todayAttendance.filter(a => a.status === 'Present' || a.status === 'Late' || a.status === 'Half Day').length;
  const lateCount = todayAttendance.filter(a => a.status === 'Late').length;
  const leaveCountToday = todayAttendance.filter(a => a.status === 'Leave').length;
  
  // WFH calculation (WFH leaves or WFH status checkin)
  const wfhToday = leaves.filter(l => l.type === 'WFH' && l.status === 'Approved' && todayStr >= l.startDate && todayStr <= l.endDate).length;
  const pendingApprovals = leaves.filter(l => l.status === 'Pending').length;

  const totalPayrollCost = payrolls.reduce((sum, p) => sum + p.netSalary, 0);
  const averageSalary = totalPayrollCost / (payrolls.length || 1);

  // 2. Chart data pipelines
  // Department distribution
  const deptMap: { [key: string]: number } = {};
  employees.forEach(e => {
    deptMap[e.department] = (deptMap[e.department] || 0) + 1;
  });
  const departmentData = Object.keys(deptMap).map(name => ({
    name,
    value: deptMap[name]
  }));

  const COLORS = ['#38bdf8', '#4f46e5', '#f59e0b', '#10b981', '#ec4899'];

  // Monthly salary expense
  const payrollTrendMap: { [key: string]: number } = {};
  payrolls.forEach(p => {
    payrollTrendMap[p.month] = (payrollTrendMap[p.month] || 0) + p.netSalary;
  });
  // Ensure we sort months chronological
  const payrollTrendData = Object.keys(payrollTrendMap).sort().map(month => ({
    month,
    expense: payrollTrendMap[month]
  }));

  // If empty, supply mock trend
  const trendData = payrollTrendData.length > 0 ? payrollTrendData : [
    { month: '2026-02', expense: 28500 },
    { month: '2026-03', expense: 32000 },
    { month: '2026-04', expense: 31800 },
    { month: '2026-05', expense: 35000 },
    { month: '2026-06', expense: 38200 },
    { month: '2026-07', expense: 41500 }
  ];

  // Attrition / Employee growth over past years
  const growthData = [
    { year: '2021', Count: 4 },
    { year: '2022', Count: 6 },
    { year: '2023', Count: 10 },
    { year: '2024', Count: 15 },
    { year: '2025', Count: 19 },
    { year: '2026', Count: employees.length }
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between p-8 bg-slate-900 border border-slate-800 rounded-2xl text-white shadow-xl">
        <div>
          <span className="text-xs font-black tracking-wider text-indigo-400 font-mono uppercase bg-indigo-500/10 px-2.5 py-1 rounded-md border border-indigo-500/20">
            System Dashboard
          </span>
          <h1 className="text-3xl font-black mt-3.5 tracking-tight text-white font-display">Welcome back to HRBrain AI</h1>
          <p className="text-sm text-slate-300 mt-1 font-bold">Here is what is happening across your enterprise teams today.</p>
        </div>
        <div className="flex gap-3 mt-4 md:mt-0">
          <button
            onClick={onQuickCheckIn}
            id="quick-checkin-btn"
            className={`flex items-center gap-2 px-5 py-3 rounded-xl text-xs font-black shadow-md transition-all font-display tracking-tight ${
              checkedInToday
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                : 'bg-indigo-600 hover:bg-indigo-700 text-white'
            }`}
          >
            <Clock size={15} />
            <span>{checkedInToday ? 'Checked In Today' : 'Web Check-In'}</span>
          </button>
          <button
            onClick={onQuickApplyLeave}
            id="quick-leave-btn"
            className="flex items-center gap-2 px-5 py-3 rounded-xl text-xs font-black bg-white hover:bg-slate-100 text-slate-900 border border-slate-200 shadow-sm transition-all font-display tracking-tight"
          >
            <SmilePlus size={15} />
            <span>Apply Leave</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4" id="dashboard-kpi-grid">
        {/* Card 1 */}
        <div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-slate-500 uppercase tracking-wider font-mono">Total Headcount</span>
            <div className="p-2 bg-indigo-55 rounded-lg text-indigo-600 bg-indigo-50">
              <Users size={18} />
            </div>
          </div>
          <div className="mt-4.5 flex items-baseline gap-2">
            <span className="text-3xl font-black tracking-tight text-slate-900 font-display">{totalEmployees}</span>
            <span className="text-xs text-emerald-600 font-bold bg-emerald-50 px-1.5 py-0.5 rounded">+15% vs LY</span>
          </div>
          <div className="mt-3 text-[11px] text-slate-500 flex justify-between font-bold border-t border-slate-100 pt-2.5">
            <span>Active: {activeEmployees}</span>
            <span>Inactive: {inactiveEmployees}</span>
          </div>
        </div>

        {/* Card 2 */}
        <div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-slate-500 uppercase tracking-wider font-mono">Duty Ratios</span>
            <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
              <Clock size={18} />
            </div>
          </div>
          <div className="mt-4.5 flex items-baseline gap-2">
            <span className="text-3xl font-black tracking-tight text-slate-900 font-display">{presentCount}</span>
            <span className="text-xs text-amber-600 font-bold bg-amber-50 px-1.5 py-0.5 rounded">{lateCount} Late</span>
          </div>
          <div className="mt-3 text-[11px] text-slate-500 flex justify-between font-bold border-t border-slate-100 pt-2.5">
            <span>On Leave: {leaveCountToday}</span>
            <span>WFH: {wfhToday}</span>
          </div>
        </div>

        {/* Card 3 */}
        <div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-slate-500 uppercase tracking-wider font-mono">Task Approvals</span>
            <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
              <FileCheck2 size={18} />
            </div>
          </div>
          <div className="mt-4.5 flex items-baseline gap-2">
            <span className="text-3xl font-black tracking-tight text-slate-900 font-display">{pendingApprovals}</span>
            <span className="text-xs text-slate-500 font-bold">Pending items</span>
          </div>
          <div className="mt-3 text-[11px] text-slate-500 font-bold border-t border-slate-100 pt-2.5">
            <span>Review response average: 2.5h</span>
          </div>
        </div>

        {/* Card 4 */}
        <div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md transition-all">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-slate-500 uppercase tracking-wider font-mono">Avg Gross Pay</span>
            <div className="p-2 bg-indigo-50 rounded-lg text-indigo-600">
              <TrendingUp size={18} />
            </div>
          </div>
          <div className="mt-4.5 flex items-baseline gap-2">
            <span className="text-3xl font-black tracking-tight text-slate-900 font-display">
              ${Math.round(averageSalary).toLocaleString()}
            </span>
            <span className="text-xs text-emerald-600 font-bold bg-emerald-50 px-1.5 py-0.5 rounded">Auto TDS</span>
          </div>
          <div className="mt-3 text-[11px] text-slate-500 font-bold border-t border-slate-100 pt-2.5">
            <span>Total cost: ${totalPayrollCost.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Primary Analytics Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Salary Expense Area Chart */}
        <div className="lg:col-span-2 p-6 bg-white border border-slate-200 rounded-2xl shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-base font-black text-slate-900 font-display">Enterprise Payroll & Expenses</h3>
              <p className="text-xs font-bold text-slate-400">Monthly gross salary expenses in USD</p>
            </div>
            <span className="text-[10px] font-mono font-black text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md border border-indigo-100">
              Real-time calculations
            </span>
          </div>
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
                <defs>
                  <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#38bdf8" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#38bdf8" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="month" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', border: 'none', color: '#f8fafc' }}
                  labelStyle={{ fontWeight: 'bold' }}
                />
                <Area type="monotone" dataKey="expense" stroke="#38bdf8" strokeWidth={2.5} fillOpacity={1} fill="url(#colorExpense)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Department Distribution Pie Chart */}
        <div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-base font-black text-slate-900 font-display">Department Size Mapping</h3>
            <p className="text-xs font-bold text-slate-400">Active employee counts mapped by team</p>
          </div>
          <div className="h-[180px] my-4">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={departmentData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {departmentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', border: 'none', color: '#f8fafc' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
          {/* Custom Legends */}
          <div className="grid grid-cols-2 gap-2 text-[11px] font-medium text-gray-500">
            {departmentData.map((entry, idx) => (
              <div key={entry.name} className="flex items-center gap-1.5 truncate">
                <span className="w-2 h-2 rounded-full block shrink-0" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                <span className="truncate">{entry.name}: <b>{entry.value}</b></span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Secondary Dashboard Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Headcount Growth bar chart */}
        <div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-sm">
          <h3 className="text-base font-black text-slate-900 mb-4 font-display">Enterprise Scaling History</h3>
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={growthData} margin={{ top: 5, right: 5, left: -20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="year" stroke="#94a3b8" fontSize={11} tickLine={false} />
                <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', border: 'none', color: '#f8fafc' }} />
                <Bar dataKey="Count" fill="#4f46e5" radius={[4, 4, 0, 0]} barSize={28} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Calendars / Anniversaries Card */}
        <div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-base font-black text-slate-900 mb-1 font-display">Company Celebrations</h3>
            <p className="text-xs font-bold text-slate-400 mb-4">Birthdays and Work Anniversaries</p>
            
            <div className="space-y-3.5">
              <div className="flex items-start gap-3 p-3 bg-rose-50/50 rounded-xl border border-rose-100/50">
                <div className="p-2 bg-rose-100 text-rose-500 rounded-lg shrink-0">
                  <Cake size={16} />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-gray-900">Emily Chen</h4>
                  <p className="text-[10px] text-gray-400 mt-0.5">Birthday Anniversary (May 12)</p>
                </div>
              </div>

              <div className="flex items-start gap-3 p-3 bg-indigo-50/50 rounded-xl border border-indigo-100/50">
                <div className="p-2 bg-indigo-100 text-indigo-500 rounded-lg shrink-0">
                  <Award size={16} />
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-gray-900">Sarah Jenkins</h4>
                  <p className="text-[10px] text-gray-400 mt-0.5">Joined March 15, 2024 (2 Years)</p>
                </div>
              </div>
            </div>
          </div>
          
          <button
            onClick={() => setCurrentTab('ai-assistant')}
            className="w-full mt-4 flex items-center justify-between text-xs text-indigo-500 hover:text-indigo-600 font-semibold p-1"
          >
            <span>Ask AI HR regarding dates</span>
            <ChevronRight size={14} />
          </button>
        </div>

        {/* Quick Actions Panel */}
        <div className="p-6 bg-white border border-slate-200 rounded-2xl shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-base font-black text-slate-900 mb-1 font-display">Enterprise Quick Actions</h3>
            <p className="text-xs font-bold text-slate-400 mb-5">Frequently accessed services</p>
            
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => setCurrentTab('employees')}
                className="p-3 text-left hover:bg-slate-50 border border-slate-200 rounded-xl transition-colors group"
              >
                <div className="text-indigo-500 group-hover:scale-105 transition-transform">
                  <Users size={16} />
                </div>
                <h4 className="text-xs font-semibold text-gray-800 mt-2">Manage Staff</h4>
                <p className="text-[9px] text-gray-400 mt-0.5">Profiles, files & notes</p>
              </button>

              <button
                onClick={() => setCurrentTab('payroll')}
                className="p-3 text-left hover:bg-slate-50 border border-gray-100 rounded-xl transition-colors group"
              >
                <div className="text-sky-500 group-hover:scale-105 transition-transform">
                  <Award size={16} />
                </div>
                <h4 className="text-xs font-semibold text-gray-800 mt-2">Generate Payslip</h4>
                <p className="text-[9px] text-gray-400 mt-0.5">Generate PDF payslips</p>
              </button>

              <button
                onClick={() => setCurrentTab('recruitment')}
                className="p-3 text-left hover:bg-slate-50 border border-gray-100 rounded-xl transition-colors group"
              >
                <div className="text-amber-500 group-hover:scale-105 transition-transform">
                  <Briefcase size={16} />
                </div>
                <h4 className="text-xs font-semibold text-gray-800 mt-2">Job Openings</h4>
                <p className="text-[9px] text-gray-400 mt-0.5">Candidate pipelines</p>
              </button>

              <button
                onClick={() => setCurrentTab('ai-assistant')}
                className="p-3 text-left hover:bg-sky-50/20 border border-sky-100 rounded-xl transition-colors group bg-sky-50/10"
              >
                <div className="text-sky-400 group-hover:scale-105 transition-transform flex items-center gap-1">
                  <Zap size={16} />
                  <span className="text-[8px] bg-sky-500 text-white rounded px-1 scale-90">AI</span>
                </div>
                <h4 className="text-xs font-semibold text-gray-800 mt-2">HR Assistant</h4>
                <p className="text-[9px] text-gray-400 mt-0.5">RAG context helper</p>
              </button>
            </div>
          </div>
          
          <div className="mt-4 border-t border-gray-100 pt-3 text-[10px] text-gray-400 font-mono text-center">
            Shortcut: Press <kbd className="bg-gray-100 px-1 py-0.5 rounded font-bold">⌘ K</kbd> for Command Palette
          </div>
        </div>
      </div>
    </div>
  );
}
