/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  UserCheck,
  Laptop,
  CheckCircle,
  Clock,
  Briefcase,
  Send,
  Sliders,
  Search
} from 'lucide-react';
import { OnboardingChecklist, Employee } from '../types';

interface OnboardingViewProps {
  checklists: OnboardingChecklist[];
  employees: Employee[];
  onToggleChecklistItem: (empId: string, itemKey: string) => void;
  onAllocateAsset: (empId: string, assetName: string, assetType: string, serial: string) => void;
}

export default function OnboardingView({
  checklists,
  employees,
  onToggleChecklistItem,
  onAllocateAsset
}: OnboardingViewProps) {
  // Local active employee check
  const [selectedEmpId, setSelectedEmpId] = useState(checklists[0]?.employeeId || '');
  const activeCheck = checklists.find(c => c.employeeId === selectedEmpId);
  const activeEmp = employees.find(e => e.employeeId === selectedEmpId);

  // States for asset alloc form
  const [assetForm, setAssetForm] = useState({
    name: 'MacBook Pro 16" M3 Max',
    type: 'Laptop',
    serial: 'SN-M3X-9988231'
  });

  const handleAssetSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!assetForm.name || !assetForm.serial) return;
    onAllocateAsset(selectedEmpId, assetForm.name, assetForm.type, assetForm.serial);
    setAssetForm({
      name: 'MacBook Pro 16" M3 Max',
      type: 'Laptop',
      serial: `SN-M3X-${Math.floor(100000 + Math.random() * 900000)}`
    });
  };

  // Onboarding list summary mapping
  const currentAssigned = checklists.map(chk => {
    const emp = employees.find(e => e.employeeId === chk.employeeId);
    const progressCount = chk.tasks.filter(t => t.completed).length;
    const totalCount = chk.tasks.length;
    return {
      id: chk.employeeId,
      name: emp?.name || chk.employeeName,
      dept: emp?.department || chk.department,
      desig: emp?.designation || 'Trainee',
      avatar: emp?.avatar,
      progress: progressCount,
      total: totalCount
    };
  });

  return (
    <div className="space-y-6">
      
      {/* Upper overview header */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4" id="onboarding-kpis">
        <div className="p-4 bg-white border border-gray-100 rounded-2xl shadow-sm text-center">
          <span className="text-[10px] font-bold text-gray-400 font-mono uppercase">Pending Joiners</span>
          <b className="text-xl block text-gray-900 mt-1">{checklists.length} Profiles</b>
        </div>
        <div className="p-4 bg-white border border-gray-100 rounded-2xl shadow-sm text-center">
          <span className="text-[10px] font-bold text-gray-400 font-mono uppercase">Completed Onboardings</span>
          <b className="text-xl block text-emerald-600 mt-1">
            {checklists.filter(c => c.status === 'Completed').length} Users
          </b>
        </div>
        <div className="p-4 bg-white border border-gray-100 rounded-2xl shadow-sm text-center">
          <span className="text-[10px] font-bold text-gray-400 font-mono uppercase">Workstations Assigned</span>
          <b className="text-xl block text-indigo-600 mt-1">
            {checklists.filter(c => c.assetAllocation?.device).length} Assigned
          </b>
        </div>
        <div className="p-4 bg-white border border-gray-100 rounded-2xl shadow-sm text-center">
          <span className="text-[10px] font-bold text-gray-400 font-mono uppercase">System Active Invites</span>
          <b className="text-xl block text-sky-600 mt-1">
            {checklists.filter(c => c.welcomeEmailSent).length} Shared
          </b>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left list panel */}
        <div className="p-5 bg-white border border-gray-100 rounded-2xl shadow-sm space-y-4">
          <h3 className="text-sm font-semibold text-gray-900">Active Onboarding Pipelines</h3>
          
          <div className="space-y-2 max-h-[420px] overflow-y-auto scrollbar-thin">
            {currentAssigned.map(item => (
              <div
                key={item.id}
                onClick={() => setSelectedEmpId(item.id)}
                className={`p-3 border rounded-xl hover:bg-slate-50/50 transition-all cursor-pointer flex items-center justify-between gap-3 ${
                  selectedEmpId === item.id ? 'bg-indigo-50/20 border-indigo-200' : 'border-gray-100'
                }`}
              >
                <div className="flex items-center gap-3">
                  <img
                    src={item.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=64'}
                    alt={item.name}
                    className="w-9 h-9 rounded-xl object-cover"
                    referrerPolicy="no-referrer"
                  />
                  <div>
                    <h4 className="text-xs font-bold text-gray-800">{item.name}</h4>
                    <p className="text-[10px] text-gray-400 mt-0.5">{item.desig} • {item.dept}</p>
                  </div>
                </div>

                <div className="text-right shrink-0">
                  <span className="text-[10px] font-mono font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
                    {item.progress}/{item.total} Done
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right checklist control workspace */}
        {activeCheck && (
          <div className="lg:col-span-2 space-y-6">
            
            {/* Checklist items status */}
            <div className="p-5 bg-white border border-gray-100 rounded-2xl shadow-sm space-y-4" id="onboarding-items-checklist">
              <div className="flex items-center justify-between border-b border-gray-50 pb-2">
                <h3 className="text-sm font-semibold text-gray-900">Onboarding Checklist: {activeEmp?.name || activeCheck.employeeName}</h3>
                <span className="text-[10px] font-mono text-gray-400">ID: {activeCheck.employeeId}</span>
              </div>

              {/* Items checklist table */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {activeCheck.tasks.map(t => (
                  <div
                    key={t.id}
                    onClick={() => onToggleChecklistItem(activeCheck.employeeId, t.id)}
                    className={`p-3 border rounded-xl hover:bg-slate-50/50 cursor-pointer transition-all flex items-start gap-3 ${
                      t.completed ? 'bg-emerald-50/15 border-emerald-100' : 'bg-slate-50/20 border-gray-100'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={t.completed}
                      readOnly
                      className="mt-1 accent-emerald-500 rounded cursor-pointer shrink-0"
                    />
                    <div>
                      <span className={`text-xs font-semibold block ${t.completed ? 'text-emerald-700 line-through' : 'text-gray-800'}`}>
                        {t.task}
                      </span>
                      {t.completedAt && (
                        <p className="text-[9px] text-gray-400 mt-0.5">Completed: {t.completedAt}</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Asset allocations segment */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              
              {/* List Allocated Assets */}
              <div className="p-5 bg-white border border-gray-100 rounded-2xl shadow-sm flex flex-col justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-3">Allocated Workspace Hardware</h3>
                  
                  {activeCheck.assetAllocation?.device ? (
                    <div className="p-3 bg-slate-50 border border-slate-100 rounded-xl text-xs space-y-2">
                      <div>
                        <span className="font-bold text-gray-400 text-[10px] uppercase font-mono block">Device Node</span>
                        <span className="font-bold text-slate-800 text-xs mt-0.5 block">{activeCheck.assetAllocation.device}</span>
                      </div>
                      <div className="grid grid-cols-2 gap-2 border-t border-gray-100 pt-2 text-[10px]">
                        <div>
                          <span className="font-semibold text-gray-400 block font-mono">Serial Code</span>
                          <span className="font-semibold text-gray-700 block font-mono">{activeCheck.assetAllocation.serialNo || 'N/A'}</span>
                        </div>
                        <div>
                          <span className="font-semibold text-gray-400 block font-mono">Allocated Date</span>
                          <span className="font-semibold text-gray-700 block font-mono">{activeCheck.assetAllocation.allocatedAt || 'N/A'}</span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs text-gray-400 italic py-6 text-center">No physical hardware allocated yet.</p>
                  )}
                </div>

                <div className="mt-4 text-[10px] text-gray-400 font-mono text-center border-t border-gray-50 pt-3">
                  Checkboxes automatically updates in database.
                </div>
              </div>

              {/* Asset Form allocation */}
              <div className="p-5 bg-white border border-gray-100 rounded-2xl shadow-sm">
                <div className="flex items-center gap-1.5 mb-3 border-b border-gray-50 pb-2">
                  <Laptop size={16} className="text-indigo-500" />
                  <h3 className="text-sm font-semibold text-gray-900">Allocate Hardware</h3>
                </div>

                <form onSubmit={handleAssetSubmit} className="space-y-3 text-xs">
                  <div className="space-y-1">
                    <label className="text-[9px] font-bold text-gray-500 uppercase font-mono">Asset Model Description</label>
                    <input
                      type="text"
                      required
                      value={assetForm.name}
                      onChange={(e) => setFormState(assetForm.name, e.target.value, 'name')}
                      className="w-full border border-gray-200 rounded-lg px-2.5 py-1.5 focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-gray-500 uppercase font-mono">Hardware Type</label>
                      <select
                        value={assetForm.type}
                        onChange={(e) => setFormState(assetForm.type, e.target.value, 'type')}
                        className="w-full border border-gray-200 rounded-lg px-2 py-1.5 font-semibold text-gray-700 focus:outline-none cursor-pointer"
                      >
                        <option value="Laptop">Laptop</option>
                        <option value="Monitor">Monitor</option>
                        <option value="Mobile">Mobile Phone</option>
                        <option value="Security Key">Yubikey USB</option>
                      </select>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[9px] font-bold text-gray-500 uppercase font-mono">Serial Tag</label>
                      <input
                        type="text"
                        required
                        value={assetForm.serial}
                        onChange={(e) => setFormState(assetForm.serial, e.target.value, 'serial')}
                        className="w-full border border-gray-200 rounded-lg px-2 py-1.5 focus:outline-none font-mono"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full font-bold bg-slate-900 hover:bg-slate-800 text-white text-[11px] py-2 rounded-xl transition-all"
                  >
                    Allocate Device Node
                  </button>
                </form>
              </div>

            </div>
          </div>
        )}

      </div>

    </div>
  );

  // Quick form helper
  function setFormState(current: string, next: string, key: 'name' | 'type' | 'serial') {
    setAssetForm(prev => ({
      ...prev,
      [key]: next
    }));
  }
}
