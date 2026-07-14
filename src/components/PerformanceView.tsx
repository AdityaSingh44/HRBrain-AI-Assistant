/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  TrendingUp,
  Award,
  ChevronRight,
  Sliders,
  CheckCircle,
  Clock,
  Sparkles,
  Search,
  Check,
  Plus,
  HelpCircle
} from 'lucide-react';
import { Employee, UserRole } from '../types';

interface PerformanceViewProps {
  employees: Employee[];
  onUpdateEmployee: (id: string, empData: Partial<Employee>) => void;
  currentUserRole: UserRole;
}

export default function PerformanceView({
  employees,
  onUpdateEmployee,
  currentUserRole
}: PerformanceViewProps) {
  const [selectedEmpId, setSelectedEmpId] = useState(employees[0]?.id || '');
  const activeEmp = employees.find(e => e.id === selectedEmpId);

  // Appraisal form
  const [appraisalForm, setAppraisalForm] = useState({
    kpiTitle: 'Enterprise System Architecture Delivery',
    weight: 40,
    achievementPercent: 85,
    managerFeedback: 'Consistently demonstrates technical excellence, leading React SPA development with standard practices.'
  });

  const handleAppraisalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeEmp) return;

    // Calculate rating based on target achievement
    const newRating = Math.round((appraisalForm.achievementPercent / 20) * 10) / 10; // map 100% to 5.0 rating

    onUpdateEmployee(activeEmp.id, {
      performanceScore: newRating,
      notes: [...(activeEmp.notes || []), `Appraisal Goal [${appraisalForm.kpiTitle}] scored with achievement ${appraisalForm.achievementPercent}%: "${appraisalForm.managerFeedback}"`]
    });

    setAppraisalForm({
      kpiTitle: 'Enterprise System Architecture Delivery',
      weight: 40,
      achievementPercent: 85,
      managerFeedback: 'Consistently demonstrates technical excellence, leading React SPA development with standard practices.'
    });
  };

  const handlePromotionTrigger = () => {
    if (!activeEmp) return;
    const proposedSalary = activeEmp.salary + 15000;
    const newDesignation = 'Principal ' + activeEmp.designation.replace('Senior ', '');
    const newHist = [
      ...activeEmp.promotionHistory,
      {
        date: new Date().toISOString().split('T')[0],
        oldDesignation: activeEmp.designation,
        newDesignation,
        oldSalary: activeEmp.salary,
        newSalary: proposedSalary
      }
    ];

    onUpdateEmployee(activeEmp.id, {
      designation: newDesignation,
      salary: proposedSalary,
      promotionHistory: newHist,
      notes: [...(activeEmp.notes || []), `PROMOTED to ${newDesignation} with base pay incremented to $${proposedSalary.toLocaleString()}/yr`]
    });
  };

  return (
    <div className="space-y-6">
      
      {/* Banner */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between p-5 bg-white border border-gray-100 rounded-2xl shadow-sm gap-4">
        <div>
          <h3 className="text-sm font-semibold text-gray-900">Enterprise Appraisal workspace</h3>
          <p className="text-xs text-gray-400 mt-0.5">Continuous feedback loops, KPI alignment, and promotions loggers</p>
        </div>
        
        <div className="flex items-center gap-2">
          <select
            value={selectedEmpId}
            onChange={(e) => setSelectedEmpId(e.target.value)}
            className="text-xs bg-slate-50 border-none rounded-xl px-3.5 py-2.5 font-semibold text-gray-700 cursor-pointer focus:ring-1 focus:ring-sky-500"
            id="perf-emp-picker"
          >
            {employees.map(emp => (
              <option key={emp.id} value={emp.id}>{emp.name} ({emp.department})</option>
            ))}
          </select>
        </div>
      </div>

      {activeEmp && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Left panel: Employee appraisal performance card summary */}
          <div className="p-6 bg-white border border-gray-100 rounded-2xl shadow-sm flex flex-col justify-between">
            <div>
              {/* Profile details */}
              <div className="flex items-center gap-4 mb-5 border-b border-gray-50 pb-4">
                <img
                  src={activeEmp.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=64'}
                  alt={activeEmp.name}
                  className="w-12 h-12 rounded-xl object-cover ring-2 ring-indigo-500/25"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <h4 className="text-sm font-bold text-gray-800">{activeEmp.name}</h4>
                  <p className="text-[10px] text-gray-400 mt-0.5">{activeEmp.designation}</p>
                  <p className="text-[9px] text-gray-400 font-mono mt-0.5">{activeEmp.employeeId}</p>
                </div>
              </div>

              {/* Score indicators */}
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between text-xs font-semibold mb-1">
                    <span className="text-gray-500">Appraisal Score Index</span>
                    <b className="text-indigo-600 font-mono">{activeEmp.performanceScore} / 5.0</b>
                  </div>
                  {/* Score bar */}
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-indigo-500 to-sky-500 rounded-full"
                      style={{ width: `${(activeEmp.performanceScore / 5) * 100}%` }}
                    />
                  </div>
                </div>

                <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl space-y-1.5 text-xs text-slate-600">
                  <div className="flex justify-between">
                    <span>Base Salary:</span>
                    <b className="text-slate-800">${activeEmp.salary.toLocaleString()}/yr</b>
                  </div>
                  <div className="flex justify-between">
                    <span>Team Lead:</span>
                    <b className="text-slate-800">{activeEmp.manager}</b>
                  </div>
                  <div className="flex justify-between">
                    <span>Hiring tenure:</span>
                    <b className="text-slate-800 font-mono">{activeEmp.joiningDate}</b>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick action: Promotion evaluator trigger */}
            {['Super Admin', 'HR Manager', 'Team Lead'].includes(currentUserRole) && (
              <div className="mt-5 border-t border-gray-50 pt-4">
                <button
                  onClick={handlePromotionTrigger}
                  className="w-full flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white transition-all shadow-md shadow-indigo-600/10"
                >
                  <Award size={15} />
                  <span>Promote with +$15k Pay Raise</span>
                </button>
              </div>
            )}
          </div>

          {/* Center panel: Goals & Achievements log */}
          <div className="p-6 bg-white border border-gray-100 rounded-2xl shadow-sm space-y-4">
            <h3 className="text-sm font-semibold text-gray-900">Current Corporate OKRs & Alignment</h3>
            
            {/* Mock OKRs lists */}
            <div className="space-y-3.5">
              <div className="p-3.5 border border-emerald-100 bg-emerald-50/15 rounded-xl text-xs space-y-2">
                <div className="flex justify-between font-bold text-emerald-800">
                  <span>Deliver High Fidelity Features</span>
                  <span>Completed</span>
                </div>
                <p className="text-[10px] text-gray-500">Ensure modular files build, eliminating bloated structures.</p>
                <div className="w-full h-1.5 bg-emerald-100 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 w-full rounded-full" />
                </div>
              </div>

              <div className="p-3.5 border border-indigo-100 bg-indigo-50/15 rounded-xl text-xs space-y-2">
                <div className="flex justify-between font-bold text-indigo-800">
                  <span>Client-Side PDF Rendering</span>
                  <span>90% Done</span>
                </div>
                <p className="text-[10px] text-gray-500">Deploy high fidelity, print-styled Payslip views.</p>
                <div className="w-full h-1.5 bg-indigo-100 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-500 w-[90%] rounded-full" />
                </div>
              </div>

              <div className="p-3.5 border border-gray-100 bg-slate-50/30 rounded-xl text-xs space-y-2">
                <div className="flex justify-between font-bold text-gray-800">
                  <span>Optimize RAG System Query context</span>
                  <span>45% In-Progress</span>
                </div>
                <p className="text-[10px] text-gray-400">Implement advanced prompt builders to ingest mock databases.</p>
                <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-indigo-400 w-[45%] rounded-full" />
                </div>
              </div>
            </div>
          </div>

          {/* Right panel: Submit continuous feedback logs (Managers only) */}
          <div className="p-6 bg-white border border-gray-100 rounded-2xl shadow-sm">
            <div className="flex items-center gap-1.5 mb-3 border-b border-gray-50 pb-2">
              <Sliders size={16} className="text-sky-500" />
              <h3 className="text-sm font-semibold text-gray-900">Appraise Employee KPI</h3>
            </div>

            {['Super Admin', 'HR Manager', 'Team Lead'].includes(currentUserRole) ? (
              <form onSubmit={handleAppraisalSubmit} className="space-y-4 text-xs">
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-gray-500 uppercase font-mono">Objective Title</label>
                  <input
                    type="text"
                    required
                    value={appraisalForm.kpiTitle}
                    onChange={(e) => setAppraisalForm({ ...appraisalForm, kpiTitle: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-2.5 py-1.5 focus:outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-gray-500 uppercase font-mono">Weight (%)</label>
                    <input
                      type="number"
                      required
                      min={10}
                      max={100}
                      value={appraisalForm.weight}
                      onChange={(e) => setAppraisalForm({ ...appraisalForm, weight: Number(e.target.value) })}
                      className="w-full border border-gray-200 rounded-lg px-2.5 py-1"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-gray-500 uppercase font-mono">Achievement (%)</label>
                    <input
                      type="number"
                      required
                      min={0}
                      max={100}
                      value={appraisalForm.achievementPercent}
                      onChange={(e) => setAppraisalForm({ ...appraisalForm, achievementPercent: Number(e.target.value) })}
                      className="w-full border border-gray-200 rounded-lg px-2.5 py-1"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-gray-500 uppercase font-mono">Managerial Feedback</label>
                  <textarea
                    required
                    rows={3}
                    value={appraisalForm.managerFeedback}
                    onChange={(e) => setAppraisalForm({ ...appraisalForm, managerFeedback: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg p-2 focus:outline-none"
                    placeholder="Provide professional appraisal context..."
                  />
                </div>

                <button
                  type="submit"
                  className="w-full text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white py-2 rounded-xl transition-all shadow-sm"
                >
                  Submit Performance Audit
                </button>
              </form>
            ) : (
              <div className="p-8 text-center text-gray-400 italic py-12 border border-dashed border-gray-100 rounded-xl">
                Appraisal inputs are strictly restricted to Super Admin, HR, or Manager roles.
              </div>
            )}
          </div>

        </div>
      )}

    </div>
  );
}
