/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  CalendarDays,
  Check,
  X,
  FileCheck2,
  Calendar,
  AlertCircle,
  Clock,
  Send,
  PlaneTakeoff,
  TrendingDown
} from 'lucide-react';
import { LeaveRequest, LeaveBalance, UserRole } from '../types';
import { HOLIDAYS } from '../db/mockData';

interface LeaveViewProps {
  leaves: LeaveRequest[];
  balances: LeaveBalance[];
  onApplyLeave: (leaveData: { type: string; startDate: string; endDate: string; reason: string; days: number }) => void;
  onUpdateLeaveStatus: (id: string, status: 'Approved' | 'Rejected') => void;
  currentUserRole: UserRole;
  currentUserEmpId: string;
}

export default function LeaveView({
  leaves,
  balances,
  onApplyLeave,
  onUpdateLeaveStatus,
  currentUserRole,
  currentUserEmpId
}: LeaveViewProps) {
  // States
  const [activeSubTab, setActiveSubTab] = useState<'balances' | 'requests' | 'holidays'>('balances');
  
  // Apply leave form
  const [formData, setFormData] = useState({
    type: 'Casual Leave',
    startDate: '',
    endDate: '',
    reason: '',
    days: 1
  });

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.startDate || !formData.endDate || !formData.reason) return;
    
    onApplyLeave({
      type: formData.type,
      startDate: formData.startDate,
      endDate: formData.endDate,
      reason: formData.reason,
      days: Number(formData.days)
    });

    setFormData({
      type: 'Casual Leave',
      startDate: '',
      endDate: '',
      reason: '',
      days: 1
    });

    // Toggle back to balances
    setActiveSubTab('balances');
  };

  // Helper to retrieve current user balance card
  const myBalance = balances.find(b => b.employeeId === currentUserEmpId) || {
    casual: 10, usedCasual: 0,
    sick: 8, usedSick: 0,
    earned: 15, usedEarned: 0,
    wfhLimit: 24, usedWfh: 0
  };

  // Permissions to approve: Admin or HR or Lead
  const canApprove = ['Super Admin', 'HR Manager', 'Team Lead'].includes(currentUserRole);

  const pendingLeaves = leaves.filter(l => l.status === 'Pending');
  const myLeaves = leaves.filter(l => l.employeeId === currentUserEmpId);
  const historicLeaves = leaves.filter(l => l.status !== 'Pending');

  return (
    <div className="space-y-6">
      
      {/* Sub Tabs switcher */}
      <div className="flex border-slate-200 bg-white p-2 rounded-2xl border shadow-sm">
        <button
          onClick={() => setActiveSubTab('balances')}
          className={`flex-1 text-center py-2.5 text-xs font-black font-display tracking-tight rounded-xl transition-all ${
            activeSubTab === 'balances' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-500 hover:text-slate-950'
          }`}
          id="leave-subtab-balances"
        >
          My Quotas & History
        </button>
        {canApprove && (
          <button
            onClick={() => setActiveSubTab('requests')}
            className={`flex-1 text-center py-2.5 text-xs font-black font-display tracking-tight rounded-xl transition-all flex items-center justify-center gap-1.5 ${
              activeSubTab === 'requests' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-500 hover:text-slate-950'
            }`}
            id="leave-subtab-requests"
          >
            <span>Review Applications</span>
            {pendingLeaves.length > 0 && (
              <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
            )}
          </button>
        )}
        <button
          onClick={() => setActiveSubTab('holidays')}
          className={`flex-1 text-center py-2.5 text-xs font-black font-display tracking-tight rounded-xl transition-all ${
            activeSubTab === 'holidays' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-500 hover:text-slate-950'
          }`}
          id="leave-subtab-holidays"
        >
          Holiday Calendar
        </button>
      </div>

      {/* RENDER TAB CONTENTS */}
      {activeSubTab === 'balances' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Balance Cards & Apply Column */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Balance Card stats */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4" id="leave-quota-cards">
              {/* Casual */}
              <div className="p-4 bg-white border border-gray-100 rounded-2xl shadow-sm text-center">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider font-mono">Casual Leaves</span>
                <b className="text-xl block text-gray-900 mt-2">
                  {myBalance.casual - myBalance.usedCasual} <span className="text-xs font-medium text-gray-400">/ {myBalance.casual}</span>
                </b>
                <span className="text-[10px] text-gray-400 block mt-1">{myBalance.usedCasual} days used</span>
              </div>

              {/* Sick */}
              <div className="p-4 bg-white border border-gray-100 rounded-2xl shadow-sm text-center">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider font-mono">Sick Leaves</span>
                <b className="text-xl block text-gray-900 mt-2">
                  {myBalance.sick - myBalance.usedSick} <span className="text-xs font-medium text-gray-400">/ {myBalance.sick}</span>
                </b>
                <span className="text-[10px] text-gray-400 block mt-1">{myBalance.usedSick} days used</span>
              </div>

              {/* Earned */}
              <div className="p-4 bg-white border border-gray-100 rounded-2xl shadow-sm text-center">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider font-mono">Earned Leaves</span>
                <b className="text-xl block text-gray-900 mt-2">
                  {myBalance.earned - myBalance.usedEarned} <span className="text-xs font-medium text-gray-400">/ {myBalance.earned}</span>
                </b>
                <span className="text-[10px] text-gray-400 block mt-1">{myBalance.usedEarned} days used</span>
              </div>

              {/* WFH limit */}
              <div className="p-4 bg-white border border-gray-100 rounded-2xl shadow-sm text-center">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider font-mono">WFH Balance</span>
                <b className="text-xl block text-gray-900 mt-2">
                  {myBalance.wfhLimit - myBalance.usedWfh} <span className="text-xs font-medium text-gray-400">/ {myBalance.wfhLimit}</span>
                </b>
                <span className="text-[10px] text-gray-400 block mt-1">{myBalance.usedWfh} days used</span>
              </div>
            </div>

            {/* My Personal Leave Applications */}
            <div className="p-5 bg-white border border-gray-100 rounded-2xl shadow-sm space-y-4">
              <h3 className="text-sm font-semibold text-gray-900">My Leave Application History</h3>
              
              <div className="overflow-hidden border border-gray-100 rounded-xl">
                <table className="w-full text-xs text-left">
                  <thead>
                    <tr className="bg-slate-50 text-gray-400 font-bold font-mono text-[9px] uppercase tracking-wider border-b border-gray-100">
                      <th className="p-3">Type</th>
                      <th className="p-3">Duration</th>
                      <th className="p-3">Reason</th>
                      <th className="p-3 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 text-gray-600 font-medium">
                    {myLeaves.length > 0 ? myLeaves.map(l => (
                      <tr key={l.id} className="hover:bg-slate-50/50">
                        <td className="p-3 font-semibold text-gray-800">{l.type}</td>
                        <td className="p-3 text-slate-500">
                          <span className="block">{l.startDate} to {l.endDate}</span>
                          <span className="text-[10px] text-gray-400 font-mono">({l.days} days)</span>
                        </td>
                        <td className="p-3 truncate max-w-[150px]">{l.reason}</td>
                        <td className="p-3 text-center">
                          <span
                            className={`inline-block px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase border font-mono ${
                              l.status === 'Approved'
                                ? 'bg-emerald-50 text-emerald-600 border-emerald-200/50'
                                : l.status === 'Rejected'
                                ? 'bg-rose-50 text-rose-600 border-rose-200/50'
                                : 'bg-amber-50 text-amber-600 border-amber-200/50'
                            }`}
                          >
                            {l.status}
                          </span>
                        </td>
                      </tr>
                    )) : (
                      <tr>
                        <td colSpan={4} className="p-8 text-center text-gray-400">
                          No leave applications registered.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

          </div>

          {/* Right side Apply Form */}
          <div className="p-6 bg-white border border-gray-100 rounded-2xl shadow-sm h-fit">
            <div className="flex items-center gap-2 mb-4 border-b border-gray-50 pb-3">
              <PlaneTakeoff size={18} className="text-sky-500" />
              <h3 className="text-sm font-semibold text-gray-900">Apply for Leave / WFH</h3>
            </div>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-500 uppercase font-mono">Leave Category</label>
                <select
                  value={formData.type}
                  onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                  className="w-full text-xs border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-1 focus:ring-sky-500 font-semibold text-gray-700"
                >
                  <option value="Casual Leave">Casual Leave</option>
                  <option value="Sick Leave">Sick Leave</option>
                  <option value="Earned Leave">Earned Leave</option>
                  <option value="WFH">Work From Home (WFH)</option>
                  <option value="Comp Off">Comp Compensatory Off</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-500 uppercase font-mono">Start Date</label>
                  <input
                    type="date"
                    required
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="w-full text-xs border border-gray-200 rounded-xl px-3 py-2 focus:outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-500 uppercase font-mono">End Date</label>
                  <input
                    type="date"
                    required
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className="w-full text-xs border border-gray-200 rounded-xl px-3 py-2 focus:outline-none"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-500 uppercase font-mono">Total requested days</label>
                <input
                  type="number"
                  min={1}
                  required
                  value={formData.days}
                  onChange={(e) => setFormData({ ...formData, days: Number(e.target.value) })}
                  className="w-full text-xs border border-gray-200 rounded-xl px-3 py-2 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-500 uppercase font-mono">Detailed Reason</label>
                <textarea
                  placeholder="State your reason for application..."
                  rows={3}
                  required
                  value={formData.reason}
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                  className="w-full text-xs border border-gray-200 rounded-xl px-3 py-2 focus:outline-none"
                />
              </div>

              <button
                type="submit"
                id="submit-leave-application"
                className="w-full mt-2 flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold bg-sky-500 hover:bg-sky-600 text-slate-950 transition-colors shadow-sm"
              >
                <Send size={14} />
                <span>Submit Application</span>
              </button>
            </form>
          </div>

        </div>
      )}

      {/* Review Queue Tab */}
      {activeSubTab === 'requests' && canApprove && (
        <div className="grid grid-cols-1 gap-4" id="leave-approval-queue">
          <div className="p-5 bg-white border border-gray-100 rounded-2xl shadow-sm space-y-4">
            <div>
              <h3 className="text-sm font-semibold text-gray-900">Incoming Leave & WFH applications</h3>
              <p className="text-xs text-gray-400 mt-0.5">Please review the reason and grant approvals</p>
            </div>

            <div className="space-y-3">
              {pendingLeaves.length > 0 ? pendingLeaves.map(req => (
                <div
                  key={req.id}
                  className="p-4 border border-gray-100 rounded-xl hover:bg-slate-50/30 transition-colors flex flex-col md:flex-row md:items-center md:justify-between gap-4"
                  id={`leave-req-${req.id}`}
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-slate-50 text-slate-500 border border-slate-100 rounded-lg mt-0.5 shrink-0">
                      <PlaneTakeoff size={16} />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-gray-800">
                        {req.employeeName} applied for <b>{req.type}</b>
                      </div>
                      <p className="text-[11px] text-gray-400 mt-0.5">
                        Duration: <b>{req.startDate} to {req.endDate}</b> ({req.days} days) • Dept: {req.department}
                      </p>
                      <p className="text-xs text-gray-600 bg-slate-50/60 p-2 border border-slate-100/50 rounded-lg mt-2 italic">
                        Reason: "{req.reason}"
                      </p>
                    </div>
                  </div>

                  {/* Actions buttons */}
                  <div className="flex gap-2 shrink-0 md:self-end">
                    <button
                      onClick={() => onUpdateLeaveStatus(req.id, 'Approved')}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-emerald-500 hover:bg-emerald-600 text-white transition-colors"
                    >
                      <Check size={14} />
                      <span>Approve</span>
                    </button>
                    <button
                      onClick={() => onUpdateLeaveStatus(req.id, 'Rejected')}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold bg-rose-500 hover:bg-rose-600 text-white transition-colors"
                    >
                      <X size={14} />
                      <span>Reject</span>
                    </button>
                  </div>
                </div>
              )) : (
                <div className="p-8 text-center border border-dashed border-gray-200 rounded-xl text-gray-400 text-xs py-12">
                  No pending applications in your queue! All cleared.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Holiday calendar */}
      {activeSubTab === 'holidays' && (
        <div className="p-5 bg-white border border-gray-100 rounded-2xl shadow-sm space-y-4">
          <div>
            <h3 className="text-sm font-semibold text-gray-900">Corporate Holiday Calendar (2026)</h3>
            <p className="text-xs text-gray-400 mt-0.5">Approved annual leave days for Acme Corp nodes</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4" id="holiday-cards-grid">
            {HOLIDAYS.map(hol => (
              <div key={hol.date} className="p-4 bg-slate-50 border border-slate-100 rounded-xl text-xs flex items-center gap-3">
                <div className="p-2.5 bg-indigo-50 text-indigo-500 rounded-lg shrink-0">
                  <CalendarDays size={18} />
                </div>
                <div>
                  <h4 className="font-bold text-gray-800">{hol.name}</h4>
                  <span className="text-[10px] text-gray-400 font-mono block mt-0.5">{hol.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
