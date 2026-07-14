/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Settings,
  ShieldCheck,
  Building,
  Key,
  Database,
  RefreshCw,
  Bell,
  Cpu,
  BookmarkCheck,
  AlertCircle
} from 'lucide-react';

interface SettingsViewProps {
  systemSettings: {
    companyName: string;
    domain: string;
    currency: string;
    shiftStart: string;
    shiftEnd: string;
  };
  onUpdateSettings: (settings: any) => void;
  geminiActive: boolean;
}

export default function SettingsView({
  systemSettings,
  onUpdateSettings,
  geminiActive
}: SettingsViewProps) {
  // Form state
  const [form, setForm] = useState(systemSettings);
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSettings(form);
    setSuccess(true);
    setTimeout(() => setSuccess(false), 3000);
  };

  return (
    <div className="space-y-6 max-w-3xl">
      
      {/* Settings Form header */}
      <div className="p-5 bg-white border border-gray-100 rounded-2xl shadow-sm">
        <h3 className="text-sm font-semibold text-gray-900">System Settings Console</h3>
        <p className="text-xs text-gray-400 mt-0.5">Configure company details, working hours, and API connections</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Left Side: forms settings */}
        <div className="md:col-span-2 p-6 bg-white border border-gray-100 rounded-2xl shadow-sm space-y-4">
          <div className="flex items-center gap-1.5 border-b border-gray-50 pb-2.5">
            <Building size={16} className="text-sky-500" />
            <h4 className="text-xs font-bold text-gray-800 uppercase font-mono">Business profile</h4>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-500 uppercase font-mono">Company Name</label>
                <input
                  type="text"
                  required
                  value={form.companyName}
                  onChange={(e) => setForm({ ...form, companyName: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-500 uppercase font-mono">Domain Address</label>
                <input
                  type="text"
                  required
                  value={form.domain}
                  onChange={(e) => setForm({ ...form, domain: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-3 py-2 focus:outline-none font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-500 uppercase font-mono">Preferred Currency</label>
                <select
                  value={form.currency}
                  onChange={(e) => setForm({ ...form, currency: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-2.5 py-2 font-semibold text-gray-700 focus:outline-none"
                >
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                  <option value="INR">INR (₹)</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-500 uppercase font-mono">Shift Starts</label>
                <input
                  type="time"
                  required
                  value={form.shiftStart}
                  onChange={(e) => setForm({ ...form, shiftStart: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-2.5 py-1.5 focus:outline-none"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-500 uppercase font-mono">Shift Ends</label>
                <input
                  type="time"
                  required
                  value={form.shiftEnd}
                  onChange={(e) => setForm({ ...form, shiftEnd: e.target.value })}
                  className="w-full border border-gray-200 rounded-xl px-2.5 py-1.5 focus:outline-none"
                />
              </div>
            </div>

            {success && (
              <p className="p-2.5 bg-emerald-50 border border-emerald-200 text-[11px] font-bold text-emerald-600 rounded-lg text-center">
                Settings updated successfully! Changes applied across all active employee nodes.
              </p>
            )}

            <button
              type="submit"
              className="w-full font-bold bg-slate-900 hover:bg-slate-800 text-white text-xs py-2.5 rounded-xl transition-all shadow-sm"
              id="save-settings-btn"
            >
              Save Configuration Settings
            </button>
          </form>
        </div>

        {/* Right Side: Environment Variables & Database verification checklist */}
        <div className="p-6 bg-white border border-gray-100 rounded-2xl shadow-sm space-y-4">
          <div className="flex items-center gap-1.5 border-b border-gray-50 pb-2.5">
            <ShieldCheck size={16} className="text-sky-500" />
            <h4 className="text-xs font-bold text-gray-800 uppercase font-mono">Credentials Status</h4>
          </div>

          <div className="space-y-3 text-xs">
            {/* Gemini API Key status */}
            <div className="p-3 border rounded-xl flex items-center justify-between bg-slate-50 border-slate-100">
              <div>
                <span className="font-bold text-gray-800 block">Gemini API Connection</span>
                <span className="text-[10px] text-gray-400 font-mono block mt-0.5">GEMINI_API_KEY variable</span>
              </div>
              
              <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase font-mono ${
                geminiActive
                  ? 'bg-emerald-50 text-emerald-600 border border-emerald-200/50'
                  : 'bg-amber-50 text-amber-600 border border-amber-200/50'
              }`}>
                {geminiActive ? 'Live Connect' : 'Heuristic Mode'}
              </span>
            </div>

            {/* In-Memory DB status */}
            <div className="p-3 border rounded-xl flex items-center justify-between bg-slate-50 border-slate-100">
              <div>
                <span className="font-bold text-gray-800 block">Express API Server</span>
                <span className="text-[10px] text-gray-400 font-mono block mt-0.5">Port 3000 Ingress</span>
              </div>
              <span className="px-2 py-0.5 bg-emerald-50 text-emerald-600 border border-emerald-200/50 rounded text-[9px] font-bold uppercase font-mono">
                Listening
              </span>
            </div>

            {/* Audit compliance check */}
            <div className="p-3 bg-indigo-50/20 border border-indigo-100/30 rounded-xl space-y-1">
              <span className="text-[9px] font-bold text-indigo-600 uppercase font-mono block">Enterprise RAG context</span>
              <p className="text-gray-500 leading-normal text-[10px]">
                Policy data and active employee directories are serialized dynamically to prompt payloads. No external vector DB required.
              </p>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
