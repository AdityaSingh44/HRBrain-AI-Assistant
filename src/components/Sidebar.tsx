/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  LayoutDashboard,
  Users,
  CalendarCheck,
  PlaneTakeoff,
  BadgeDollarSign,
  Briefcase,
  UserCheck,
  TrendingUp,
  FolderKanban,
  MessageSquare,
  History,
  Settings,
  Bot,
  LogOut,
  Sparkles,
  Menu,
  X
} from 'lucide-react';
import { UserRole } from '../types';

interface SidebarProps {
  currentTab: string;
  setCurrentTab: (tab: string) => void;
  userRole: UserRole;
  userName: string;
  userAvatar?: string;
  onLogout: () => void;
  onRoleChange: (role: UserRole) => void;
  unreadCount: number;
}

export default function Sidebar({
  currentTab,
  setCurrentTab,
  userRole,
  userName,
  userAvatar,
  onLogout,
  onRoleChange,
  unreadCount
}: SidebarProps) {
  const [isOpen, setIsOpen] = React.useState(true);

  // Define menu items with roles that can access them
  const menuItems = [
    { id: 'dashboard', label: 'Overview', icon: LayoutDashboard, roles: ['Super Admin', 'HR Manager', 'Recruiter', 'Payroll Manager', 'Team Lead', 'Employee'] },
    { id: 'employees', label: 'Employees', icon: Users, roles: ['Super Admin', 'HR Manager', 'Team Lead', 'Recruiter'] },
    { id: 'attendance', label: 'Attendance', icon: CalendarCheck, roles: ['Super Admin', 'HR Manager', 'Payroll Manager', 'Team Lead', 'Employee'] },
    { id: 'leaves', label: 'Leaves', icon: PlaneTakeoff, roles: ['Super Admin', 'HR Manager', 'Payroll Manager', 'Team Lead', 'Employee'] },
    { id: 'payroll', label: 'Payroll Hub', icon: BadgeDollarSign, roles: ['Super Admin', 'HR Manager', 'Payroll Manager', 'Employee'] },
    { id: 'recruitment', label: 'Recruitment', icon: Briefcase, roles: ['Super Admin', 'HR Manager', 'Recruiter'] },
    { id: 'onboarding', label: 'Onboarding', icon: UserCheck, roles: ['Super Admin', 'HR Manager', 'Recruiter'] },
    { id: 'performance', label: 'Performance', icon: TrendingUp, roles: ['Super Admin', 'HR Manager', 'Team Lead', 'Employee'] },
    { id: 'projects', label: 'Projects & Tasks', icon: FolderKanban, roles: ['Super Admin', 'HR Manager', 'Team Lead', 'Employee'] },
    { id: 'chat', label: 'Corporate Chat', icon: MessageSquare, roles: ['Super Admin', 'HR Manager', 'Recruiter', 'Payroll Manager', 'Team Lead', 'Employee'], badge: true },
    { id: 'ai-assistant', label: 'HRBrain AI', icon: Bot, roles: ['Super Admin', 'HR Manager', 'Recruiter', 'Payroll Manager', 'Team Lead', 'Employee'], accent: true },
    { id: 'audit-logs', label: 'Audit Timeline', icon: History, roles: ['Super Admin', 'HR Manager'] },
    { id: 'settings', label: 'Settings', icon: Settings, roles: ['Super Admin', 'HR Manager'] }
  ];

  const filteredItems = menuItems.filter(item => item.roles.includes(userRole));

  const roleOptions: UserRole[] = [
    'Super Admin',
    'HR Manager',
    'Recruiter',
    'Payroll Manager',
    'Team Lead',
    'Employee'
  ];

  return (
    <>
      {/* Mobile Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-lg bg-gray-900 text-white shadow-lg border border-gray-800"
        id="mobile-sidebar-toggle"
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Sidebar Rail */}
      <aside
        id="app-sidebar"
        className={`fixed inset-y-0 left-0 z-40 flex flex-col justify-between w-64 bg-slate-900 text-slate-100 border-r border-slate-800 transition-transform duration-300 transform lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div>
          {/* Brand Header */}
          <div className="flex items-center gap-3 px-6 py-5 border-b border-slate-800">
            <div className="w-8 h-8 bg-indigo-500 rounded-lg flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <div className="w-4 h-4 bg-white rounded-sm"></div>
            </div>
            <div>
              <span className="text-white font-black text-xl tracking-tight font-display">
                HRBrain AI
              </span>
              <p className="text-[9px] text-slate-400 tracking-wider font-mono font-bold">ENTERPRISE OS</p>
            </div>
          </div>

          {/* Role Impersonation Select (Useful for Testing & Hiring Managers) */}
          <div className="px-4 py-3 bg-slate-950/40 border-b border-slate-800">
            <label className="block text-[9px] font-bold text-slate-400 uppercase tracking-wider mb-1.5 font-mono">
              View Simulator Role
            </label>
            <select
              value={userRole}
              onChange={(e) => {
                onRoleChange(e.target.value as UserRole);
              }}
              className="w-full text-xs bg-slate-900 text-slate-200 border border-slate-800 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-bold cursor-pointer"
              id="role-simulator-select"
            >
              {roleOptions.map(role => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>
          </div>

          {/* Navigation Links */}
          <nav className="px-3 py-4 space-y-1 overflow-y-auto max-h-[calc(100vh-290px)] scrollbar-thin">
            {filteredItems.map(item => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setCurrentTab(item.id);
                    // Close sidebar on mobile
                    if (window.innerWidth < 1024) setIsOpen(false);
                  }}
                  id={`sidebar-tab-${item.id}`}
                  className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-bold tracking-tight transition-all duration-150 group ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                      : 'text-slate-400 hover:bg-slate-800/60 hover:text-white'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon
                      size={18}
                      className={`transition-transform duration-150 group-hover:scale-105 ${
                        isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'
                      }`}
                    />
                    <span className="font-display">{item.label}</span>
                  </div>

                  {item.badge && unreadCount > 0 && (
                    <span className="flex items-center justify-center px-1.5 py-0.5 text-[10px] font-black bg-rose-500 text-white rounded-full leading-none font-mono">
                      {unreadCount}
                    </span>
                  )}
                  {item.accent && (
                    <span className={`flex items-center gap-0.5 text-[9px] font-mono font-black px-1.5 py-0.5 rounded-md border ${
                      isActive ? 'bg-indigo-700/50 text-indigo-100 border-indigo-400/30' : 'bg-indigo-500/10 text-indigo-300 border-indigo-500/20'
                    }`}>
                      AI RAG
                    </span>
                  )}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer Profile Profile */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/40">
          <div className="flex items-center gap-3 mb-3">
            <img
              src={userAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=64'}
              alt={userName}
              className="w-10 h-10 rounded-xl object-cover ring-2 ring-sky-500/25 shadow-md"
              referrerPolicy="no-referrer"
            />
            <div className="min-w-0 flex-1">
              <h4 className="text-xs font-semibold text-slate-100 truncate">{userName}</h4>
              <p className="text-[10px] text-slate-400 truncate font-mono">{userRole}</p>
            </div>
          </div>
          
          <button
            onClick={onLogout}
            id="sidebar-logout-button"
            className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-medium bg-slate-800 hover:bg-rose-950/40 hover:text-rose-400 text-slate-300 rounded-xl transition-colors border border-slate-700/50 hover:border-rose-900/40"
          >
            <LogOut size={13} />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>
    </>
  );
}
