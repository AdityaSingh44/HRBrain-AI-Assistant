/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Clock,
  MapPin,
  CheckCircle,
  AlertTriangle,
  History,
  Calendar,
  UserCheck,
  Search,
  ThumbsUp,
  ThumbsDown,
  Info
} from 'lucide-react';
import { Attendance } from '../types';

interface AttendanceViewProps {
  attendance: Attendance[];
  onCheckIn: (coords?: { latitude: number; longitude: number }) => void;
  onCheckOut: () => void;
  currentUserEmpId: string;
}

export default function AttendanceView({
  attendance,
  onCheckIn,
  onCheckOut,
  currentUserEmpId
}: AttendanceViewProps) {
  // Local check state
  const todayStr = new Date().toISOString().split('T')[0];
  const userTodayRecord = attendance.find(a => a.employeeId === currentUserEmpId && a.date === todayStr);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');

  // Trigger check-in
  const handleCheckInTrigger = () => {
    // Attempt real geo coordinates
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          onCheckIn({
            latitude: pos.coords.latitude,
            longitude: pos.coords.longitude
          });
        },
        () => {
          // If denied, pass mock SF coordinates
          onCheckIn({ latitude: 37.7749, longitude: -122.4194 });
        }
      );
    } else {
      onCheckIn({ latitude: 37.7749, longitude: -122.4194 });
    }
  };

  // Filter attendance logs
  const filteredAttendance = attendance
    .filter(record => {
      const matchSearch =
        record.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        record.date.includes(searchTerm);
      
      const matchStatus = filterStatus === 'All' || record.status === filterStatus;
      
      return matchSearch && matchStatus;
    })
    .sort((a, b) => b.date.localeCompare(a.date));

  return (
    <div className="space-y-6">
      
      {/* Upper Grid - Punch Card & Today's Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Punch Card Widget */}
        <div className="p-6 bg-slate-900 border border-slate-800 rounded-2xl text-white shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3.5">
              <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping shrink-0" />
              <span className="text-xs font-bold text-slate-400 font-mono uppercase tracking-wider">
                Shift Timing: 09:00 AM - 06:00 PM
              </span>
            </div>
            <h3 className="text-base font-bold text-white">Punching Desk</h3>
            <p className="text-xs text-slate-400 mt-1">Geo-location tracking is enabled for all remote nodes.</p>
          </div>

          <div className="my-6">
            {userTodayRecord ? (
              <div className="p-4 bg-slate-950/50 border border-slate-800 rounded-xl space-y-3">
                <div className="flex items-center justify-between text-xs font-medium text-slate-400">
                  <span>Checked In At:</span>
                  <b className="text-slate-100 font-mono text-sm">{userTodayRecord.checkIn}</b>
                </div>
                {userTodayRecord.checkOut ? (
                  <div className="flex items-center justify-between text-xs font-medium text-slate-400 border-t border-slate-800/55 pt-2">
                    <span>Checked Out At:</span>
                    <b className="text-slate-100 font-mono text-sm">{userTodayRecord.checkOut}</b>
                  </div>
                ) : (
                  <div className="flex items-center justify-between text-xs font-medium text-slate-400 border-t border-slate-800/55 pt-2">
                    <span>Active Session:</span>
                    <b className="text-sky-400 animate-pulse font-mono">ON-DUTY</b>
                  </div>
                )}
                
                {userTodayRecord.isLate && (
                  <div className="flex items-center gap-1.5 p-2 bg-amber-500/10 border border-amber-500/20 rounded-lg text-amber-400 text-[10px]">
                    <AlertTriangle size={13} />
                    <span>Late mark applied. Shift grace period ends at 09:30 AM.</span>
                  </div>
                )}
              </div>
            ) : (
              <div className="p-4 bg-slate-950/30 border border-dashed border-slate-800 rounded-xl text-center text-slate-500 text-xs py-8">
                Not clocked-in today yet.
              </div>
            )}
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleCheckInTrigger}
              disabled={!!userTodayRecord}
              className="flex-1 bg-sky-500 hover:bg-sky-600 disabled:opacity-30 disabled:bg-slate-800 text-slate-950 font-bold text-xs py-3 px-4 rounded-xl transition-all shadow-md shadow-sky-500/5 flex items-center justify-center gap-1.5"
              id="attendance-checkin-btn"
            >
              <CheckCircle size={15} />
              <span>Clock In</span>
            </button>
            <button
              onClick={onCheckOut}
              disabled={!userTodayRecord || !!userTodayRecord.checkOut}
              className="flex-1 bg-slate-800 hover:bg-slate-700 disabled:opacity-35 text-white font-bold text-xs py-3 px-4 rounded-xl transition-all border border-slate-700 flex items-center justify-center gap-1.5"
              id="attendance-checkout-btn"
            >
              <Clock size={15} />
              <span>Clock Out</span>
            </button>
          </div>
        </div>

        {/* Today's Stats & Indicators */}
        <div className="lg:col-span-2 p-6 bg-white border border-gray-100 rounded-2xl shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-1">Attendance Trend & Indicators</h3>
            <p className="text-xs text-gray-400 mb-4">Daily workspace indicators for today ({todayStr})</p>

            <div className="grid grid-cols-3 gap-4">
              <div className="p-4.5 bg-sky-50/50 border border-sky-100/40 rounded-xl text-center">
                <span className="text-xs font-medium text-gray-500 font-mono uppercase block">Logged In</span>
                <b className="text-2xl font-bold tracking-tight text-sky-600 block mt-1.5">
                  {attendance.filter(a => a.date === todayStr && a.checkIn).length}
                </b>
              </div>

              <div className="p-4.5 bg-emerald-50/50 border border-emerald-100/40 rounded-xl text-center">
                <span className="text-xs font-medium text-gray-500 font-mono uppercase block">On Leave</span>
                <b className="text-2xl font-bold tracking-tight text-emerald-600 block mt-1.5">
                  {attendance.filter(a => a.date === todayStr && a.status === 'Leave').length}
                </b>
              </div>

              <div className="p-4.5 bg-amber-50/50 border border-amber-100/40 rounded-xl text-center">
                <span className="text-xs font-medium text-gray-500 font-mono uppercase block">Late Entry</span>
                <b className="text-2xl font-bold tracking-tight text-amber-600 block mt-1.5">
                  {attendance.filter(a => a.date === todayStr && a.isLate).length}
                </b>
              </div>
            </div>
          </div>

          <div className="mt-4 p-3 bg-slate-50 border border-slate-100 rounded-xl text-xs text-slate-500 flex items-start gap-2">
            <Info size={15} className="text-indigo-500 shrink-0 mt-0.5" />
            <span>
              <b>Note:</b> Checking in from outside the office requires GPS validation. Late checking incurs automated notifications, which can be excused via manual approvals on the right drawer.
            </span>
          </div>
        </div>

      </div>

      {/* Attendance Log Table */}
      <div className="p-5 bg-white border border-gray-100 rounded-2xl shadow-sm space-y-4">
        
        {/* Search header */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <h3 className="text-sm font-semibold text-gray-900">Workspace Daily Attendance Registry</h3>
          
          <div className="flex items-center gap-2">
            {/* Search */}
            <div className="relative">
              <Search size={15} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search staff or date..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 pr-3 py-1.5 bg-gray-50 border border-gray-200 rounded-xl text-xs focus:outline-none"
                id="attendance-log-search"
              />
            </div>

            {/* Filter */}
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="text-xs bg-gray-50 border border-gray-200 rounded-xl px-2.5 py-1.5 focus:outline-none"
              id="attendance-log-filter"
            >
              <option value="All">All Statuses</option>
              <option value="Present">Present</option>
              <option value="Absent">Absent</option>
              <option value="Leave">Leave</option>
              <option value="Late">Late</option>
            </select>
          </div>
        </div>

        {/* Table layout */}
        <div className="overflow-x-auto rounded-xl border border-gray-100">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 text-gray-400 font-bold border-b border-gray-100 font-mono uppercase text-[9px] tracking-wider">
                <th className="p-3.5">Staff details</th>
                <th className="p-3.5">Log Date</th>
                <th className="p-3.5">Clock In</th>
                <th className="p-3.5">Clock Out</th>
                <th className="p-3.5">Geo Tags</th>
                <th className="p-3.5 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-600 font-medium">
              {filteredAttendance.map(record => (
                <tr key={record.id} className="hover:bg-slate-50/50 transition-colors">
                  <td className="p-3.5">
                    <span className="font-bold text-gray-800 block">{record.employeeName}</span>
                    <span className="text-[10px] text-gray-400 font-mono mt-0.5">{record.employeeId}</span>
                  </td>
                  <td className="p-3.5 font-mono">{record.date}</td>
                  <td className="p-3.5 font-mono text-gray-900">{record.checkIn || '--'}</td>
                  <td className="p-3.5 font-mono text-gray-900">{record.checkOut || '--'}</td>
                  <td className="p-3.5 font-mono">
                    {record.latitude ? (
                      <span className="flex items-center gap-1 text-[10px] text-sky-500">
                        <MapPin size={11} />
                        <span>{record.latitude.toFixed(2)}, {record.longitude?.toFixed(2)}</span>
                      </span>
                    ) : (
                      <span className="text-[10px] text-gray-400">Office LAN</span>
                    )}
                  </td>
                  <td className="p-3.5 text-center">
                    <span
                      className={`inline-block px-2.5 py-0.5 rounded-full text-[9px] font-bold font-mono uppercase border ${
                        record.status === 'Present'
                          ? 'bg-emerald-50 text-emerald-600 border-emerald-200/50'
                          : record.status === 'Late'
                          ? 'bg-amber-50 text-amber-600 border-amber-200/50'
                          : record.status === 'Leave'
                          ? 'bg-indigo-50 text-indigo-600 border-indigo-200/50'
                          : 'bg-rose-50 text-rose-600 border-rose-200/50'
                      }`}
                    >
                      {record.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

    </div>
  );
}
