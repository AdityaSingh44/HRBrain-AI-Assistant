/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Search,
  Filter,
  Plus,
  ArrowUpDown,
  Building,
  Mail,
  Phone,
  Calendar,
  X,
  CreditCard,
  PhoneCall,
  Award,
  History,
  FileText,
  Upload,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  UserCheck
} from 'lucide-react';
import { Employee, UserRole } from '../types';

interface EmployeesViewProps {
  employees: Employee[];
  onAddEmployee: (empData: Partial<Employee>) => void;
  onUpdateEmployee: (id: string, empData: Partial<Employee>) => void;
}

export default function EmployeesView({ employees, onAddEmployee, onUpdateEmployee }: EmployeesViewProps) {
  // States
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDept, setSelectedDept] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [sortBy, setSortBy] = useState<'name' | 'joiningDate' | 'performanceScore'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;

  // Selected Employee Detail Drawer
  const [activeEmp, setActiveEmp] = useState<Employee | null>(null);

  // New Employee Modal Form
  const [showAddModal, setShowAddModal] = useState(false);
  const [newEmpForm, setNewEmpForm] = useState({
    name: '',
    email: '',
    phone: '',
    department: 'Engineering',
    designation: 'Senior Frontend Engineer',
    role: 'Employee' as UserRole,
    salary: 80000,
    skills: '',
    manager: 'Sarah Jenkins'
  });

  // Filter & Search & Sort pipeline
  const filteredEmployees = employees
    .filter(emp => {
      const matchSearch =
        emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.designation.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchDept = selectedDept === 'All' || emp.department === selectedDept;
      const matchStatus = selectedStatus === 'All' || emp.status === selectedStatus;

      return matchSearch && matchDept && matchStatus;
    })
    .sort((a, b) => {
      let comparison = 0;
      if (sortBy === 'name') {
        comparison = a.name.localeCompare(b.name);
      } else if (sortBy === 'joiningDate') {
        comparison = a.joiningDate.localeCompare(b.joiningDate);
      } else if (sortBy === 'performanceScore') {
        comparison = a.performanceScore - b.performanceScore;
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });

  // Paginated List
  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);
  const displayedEmployees = filteredEmployees.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleAddSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmpForm.name || !newEmpForm.email) return;

    onAddEmployee({
      name: newEmpForm.name,
      email: newEmpForm.email,
      phone: newEmpForm.phone,
      department: newEmpForm.department,
      designation: newEmpForm.designation,
      role: newEmpForm.role,
      salary: Number(newEmpForm.salary),
      skills: newEmpForm.skills.split(',').map(s => s.trim()).filter(Boolean),
      manager: newEmpForm.manager,
      status: 'Active'
    });

    setShowAddModal(false);
    setNewEmpForm({
      name: '',
      email: '',
      phone: '',
      department: 'Engineering',
      designation: 'Senior Frontend Engineer',
      role: 'Employee',
      salary: 80000,
      skills: '',
      manager: 'Sarah Jenkins'
    });
  };

  const handleAddNote = (empId: string, noteText: string) => {
    if (!noteText.trim()) return;
    const emp = employees.find(e => e.id === empId);
    if (emp) {
      const updatedNotes = [...(emp.notes || []), noteText];
      onUpdateEmployee(empId, { notes: updatedNotes });
      // Update local state drawer
      setActiveEmp({ ...emp, notes: updatedNotes });
    }
  };

  const handleUploadDocument = (empId: string, docType: string) => {
    // Simulated upload
    const emp = employees.find(e => e.id === empId);
    if (emp) {
      const docName = `uploaded_${docType.toLowerCase().replace(' ', '_')}.pdf`;
      const updatedDocs = [
        ...(emp.documents || []),
        {
          id: `doc-${Date.now()}`,
          name: docName,
          type: docType as any,
          url: '#',
          uploadedAt: new Date().toISOString().split('T')[0],
          version: 1
        }
      ];
      onUpdateEmployee(empId, { documents: updatedDocs });
      // Update local state drawer
      setActiveEmp({ ...emp, documents: updatedDocs });
    }
  };

  // Departments List for Filter Options
  const departments = ['Engineering', 'Human Resources', 'Sales & Marketing', 'Finance', 'Design'];

  return (
    <div className="space-y-6">
      {/* Search and Filters bar */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-5 bg-white border border-slate-200 rounded-2xl shadow-sm">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search name, ID, designation, email..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-indigo-500 text-slate-800"
            id="emp-search-input"
          />
        </div>

        {/* Filters and Sort */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Dept select */}
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-600">
            <Building size={14} />
            <select
              value={selectedDept}
              onChange={(e) => {
                setSelectedDept(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-transparent focus:outline-none font-bold cursor-pointer text-slate-700"
              id="emp-dept-filter"
            >
              <option value="All">All Departments</option>
              {departments.map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>

          {/* Status select */}
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-3 py-1.5 text-xs text-slate-600">
            <Filter size={14} />
            <select
              value={selectedStatus}
              onChange={(e) => {
                setSelectedStatus(e.target.value);
                setCurrentPage(1);
              }}
              className="bg-transparent focus:outline-none font-bold cursor-pointer text-slate-700"
              id="emp-status-filter"
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active Only</option>
              <option value="Inactive">Inactive Only</option>
            </select>
          </div>

          {/* Sorter triggers */}
          <button
            onClick={() => {
              const nextOrder = sortOrder === 'asc' ? 'desc' : 'asc';
              setSortOrder(nextOrder);
            }}
            className="p-2 border border-slate-200 rounded-xl hover:bg-slate-50 text-slate-500 hover:text-slate-700 transition-colors"
            title="Toggle sort order"
            id="emp-sort-order-btn"
          >
            <ArrowUpDown size={15} />
          </button>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 focus:outline-none text-slate-600 font-bold"
            id="emp-sort-by-select"
          >
            <option value="name">Sort by Name</option>
            <option value="joiningDate">Sort by Joining Date</option>
            <option value="performanceScore">Sort by Performance</option>
          </select>

          {/* Add Employee Button */}
          <button
            onClick={() => setShowAddModal(true)}
            id="add-employee-trigger"
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-black bg-indigo-600 hover:bg-indigo-700 text-white transition-colors shadow-md font-display tracking-tight cursor-pointer"
          >
            <Plus size={15} />
            <span>Add Profile</span>
          </button>
        </div>
      </div>

      {/* Grid List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5" id="employee-grid">
        {displayedEmployees.map(emp => (
          <div
            key={emp.id}
            onClick={() => setActiveEmp(emp)}
            className="p-6 bg-white border border-slate-200 rounded-2xl shadow-sm hover:shadow-md hover:border-indigo-300 transition-all cursor-pointer flex flex-col justify-between group relative"
            id={`emp-card-${emp.employeeId}`}
          >
            {/* Status absolute pill */}
            <span
              className={`absolute top-4 right-4 px-2 py-0.5 text-[9px] font-black font-mono uppercase rounded ${
                emp.status === 'Active'
                  ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                  : 'bg-rose-50 text-rose-700 border border-rose-200'
              }`}
            >
              {emp.status}
            </span>

            <div>
              {/* Profile Card Header */}
              <div className="flex items-center gap-3.5 mb-4">
                <img
                  src={emp.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=64'}
                  alt={emp.name}
                  className="w-12 h-12 rounded-xl object-cover ring-2 ring-slate-100 shadow-sm"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <h3 className="text-sm font-black text-slate-900 group-hover:text-indigo-600 transition-colors font-display tracking-tight">
                    {emp.name}
                  </h3>
                  <p className="text-[10px] text-slate-400 font-bold tracking-tight mt-0.5">
                    {emp.employeeId} • {emp.designation}
                  </p>
                </div>
              </div>

              {/* Quick details */}
              <div className="space-y-2 text-xs text-slate-600 border-t border-slate-100 pt-3 font-medium">
                <div className="flex items-center gap-2">
                  <Building size={13} className="text-gray-400" />
                  <span>{emp.department}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail size={13} className="text-gray-400" />
                  <span className="truncate">{emp.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar size={13} className="text-gray-400" />
                  <span>Joined: {emp.joiningDate}</span>
                </div>
              </div>
            </div>

            {/* Score and Skills Footer */}
            <div className="mt-4 border-t border-gray-100 pt-3 flex items-center justify-between">
              {/* Performance Indicator */}
              <div className="flex items-center gap-1.5 bg-gray-50 px-2 py-1 rounded-md border border-gray-100">
                <Award size={12} className="text-indigo-500" />
                <span className="text-[10px] font-mono font-bold text-indigo-600">
                  Rating: {emp.performanceScore}/5
                </span>
              </div>

              {/* Skills limit display */}
              <div className="flex items-center gap-1">
                {emp.skills.slice(0, 2).map(sk => (
                  <span key={sk} className="text-[8px] font-medium bg-slate-50 text-slate-500 border border-slate-100 px-1.5 py-0.5 rounded">
                    {sk}
                  </span>
                ))}
                {emp.skills.length > 2 && (
                  <span className="text-[8px] text-gray-400 font-mono">+{emp.skills.length - 2}</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination Bar */}
      {totalPages > 1 && (
        <div className="flex items-center justify-between p-4 bg-white border border-gray-100 rounded-2xl shadow-sm mt-4 text-xs font-semibold text-gray-500">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="flex items-center gap-1 p-1.5 hover:bg-gray-50 disabled:opacity-40 rounded-lg transition-all"
            id="emp-prev-page"
          >
            <ChevronLeft size={16} />
            <span>Prev</span>
          </button>
          <span>Page {currentPage} of {totalPages}</span>
          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="flex items-center gap-1 p-1.5 hover:bg-gray-50 disabled:opacity-40 rounded-lg transition-all"
            id="emp-next-page"
          >
            <span>Next</span>
            <ChevronRight size={16} />
          </button>
        </div>
      )}

      {/* Selected Employee Detail Drawer (Overlay modal) */}
      {activeEmp && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/40 backdrop-blur-sm flex justify-end">
          <div className="w-full max-w-2xl bg-white h-full shadow-2xl flex flex-col justify-between transform transition-transform duration-300 animate-slide-left">
            
            {/* Header */}
            <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-3">
                <img
                  src={activeEmp.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=64'}
                  alt={activeEmp.name}
                  className="w-10 h-10 rounded-xl object-cover ring-2 ring-indigo-500/25"
                  referrerPolicy="no-referrer"
                />
                <div>
                  <h2 className="text-base font-extrabold text-gray-900 leading-tight">{activeEmp.name}</h2>
                  <p className="text-[10px] text-gray-400 font-mono mt-0.5">{activeEmp.employeeId} • {activeEmp.designation}</p>
                </div>
              </div>
              <button
                onClick={() => setActiveEmp(null)}
                className="p-1.5 hover:bg-gray-200/60 text-gray-400 hover:text-gray-600 rounded-lg transition-colors"
                id="close-emp-drawer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Scrollable Body info */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              
              {/* Section 1: Overview and Contacts */}
              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl text-xs space-y-2">
                  <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider font-mono">Work Contacts</span>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Mail size={13} className="text-slate-400 shrink-0" />
                    <span className="truncate">{activeEmp.email}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Phone size={13} className="text-slate-400 shrink-0" />
                    <span>{activeEmp.phone}</span>
                  </div>
                  <div className="flex items-center gap-2 text-gray-600">
                    <Building size={13} className="text-slate-400 shrink-0" />
                    <span>Manager: {activeEmp.manager}</span>
                  </div>
                </div>

                <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl text-xs space-y-2">
                  <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider font-mono">Pay & Rating</span>
                  <div className="text-gray-600">
                    Gross Salary: <b className="text-slate-800">${activeEmp.salary.toLocaleString()}/yr</b>
                  </div>
                  <div className="text-gray-600 flex items-center gap-1.5">
                    Rating: <b className="text-indigo-600 font-mono text-xs">{activeEmp.performanceScore}/5.0</b>
                  </div>
                  <div className="text-gray-600">
                    Role Priority: <b className="text-slate-700">{activeEmp.role}</b>
                  </div>
                </div>
              </div>

              {/* Section 2: Skills & Badges */}
              <div>
                <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wider font-mono mb-2">Technical Competency</h4>
                <div className="flex flex-wrap gap-1.5">
                  {activeEmp.skills.map(sk => (
                    <span key={sk} className="text-xs bg-sky-50 text-sky-600 border border-sky-100 font-medium px-2.5 py-1 rounded-lg">
                      {sk}
                    </span>
                  ))}
                </div>
              </div>

              {/* Section 3: Document Verification Center */}
              <div>
                <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wider font-mono mb-2.5">Document Verification Center</h4>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  {['Offer Letter', 'Joining Letter', 'Experience Letter', 'Resume', 'PAN', 'Aadhar', 'Passport', 'Certificate'].map(type => {
                    const existing = activeEmp.documents?.find(d => d.type === type);
                    
                    return (
                      <div key={type} className="flex items-center justify-between p-3 border border-gray-100 rounded-xl hover:bg-slate-50 transition-colors">
                        <div className="flex items-center gap-2 truncate">
                          <FileText size={15} className={existing ? "text-indigo-500" : "text-gray-300"} />
                          <div>
                            <span className="font-semibold block text-gray-700">{type}</span>
                            <span className="text-[9px] text-gray-400 block mt-0.5">
                              {existing ? `${existing.name} (v${existing.version})` : "Missing verification"}
                            </span>
                          </div>
                        </div>
                        
                        {existing ? (
                          <span className="text-[9px] font-mono font-bold bg-emerald-50 text-emerald-600 px-1.5 py-0.5 rounded">Verified</span>
                        ) : (
                          <button
                            onClick={() => handleUploadDocument(activeEmp.id, type)}
                            className="p-1 hover:bg-gray-100 text-gray-400 hover:text-sky-500 rounded transition-colors"
                            title="Upload and verify"
                          >
                            <Upload size={14} />
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Section 4: Experience & Education Timeline */}
              <div className="grid grid-cols-2 gap-4 border-t border-gray-100 pt-5">
                <div>
                  <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wider font-mono mb-3">Work History</h4>
                  <div className="space-y-3.5 pl-2.5 border-l border-gray-100">
                    {activeEmp.experience.length > 0 ? activeEmp.experience.map((ex, i) => (
                      <div key={i} className="relative text-xs">
                        <span className="absolute -left-[14.5px] top-1 w-2.5 h-2.5 bg-slate-300 rounded-full border-2 border-white" />
                        <h5 className="font-semibold text-gray-800">{ex.role}</h5>
                        <p className="text-[10px] text-gray-400">{ex.company} • {ex.duration}</p>
                      </div>
                    )) : <p className="text-xs text-gray-400 italic">No historical records registered.</p>}
                  </div>
                </div>

                <div>
                  <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wider font-mono mb-3">Education Summary</h4>
                  <div className="space-y-3.5 pl-2.5 border-l border-gray-100">
                    {activeEmp.education.length > 0 ? activeEmp.education.map((ed, i) => (
                      <div key={i} className="relative text-xs">
                        <span className="absolute -left-[14.5px] top-1 w-2.5 h-2.5 bg-indigo-300 rounded-full border-2 border-white" />
                        <h5 className="font-semibold text-gray-800">{ed.degree}</h5>
                        <p className="text-[10px] text-gray-400">{ed.institution} • {ed.year}</p>
                      </div>
                    )) : <p className="text-xs text-gray-400 italic">No educational background logged.</p>}
                  </div>
                </div>
              </div>

              {/* Section 5: Promotion & Transfer logs */}
              {activeEmp.promotionHistory.length > 0 && (
                <div className="border-t border-gray-100 pt-5">
                  <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wider font-mono mb-3 flex items-center gap-1.5">
                    <TrendingUp size={14} className="text-indigo-500" />
                    <span>Promotion Records</span>
                  </h4>
                  <div className="space-y-3">
                    {activeEmp.promotionHistory.map((pr, idx) => (
                      <div key={idx} className="p-3 bg-indigo-50/20 border border-indigo-100/30 rounded-xl text-xs flex justify-between items-center">
                        <div>
                          <span className="font-bold text-slate-800 block">{pr.newDesignation}</span>
                          <span className="text-[9px] text-gray-400 block mt-0.5">Promoted from: {pr.oldDesignation}</span>
                        </div>
                        <div className="text-right">
                          <span className="font-bold text-emerald-600 block">+${(pr.newSalary - pr.oldSalary).toLocaleString()}/yr</span>
                          <span className="text-[9px] text-gray-400 block mt-0.5">Date: {pr.date}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Section 6: Emergency Contact & Bank Account Details */}
              <div className="grid grid-cols-2 gap-4 border-t border-gray-100 pt-5">
                <div className="p-4 bg-slate-50/50 border border-slate-100 rounded-xl text-xs space-y-1.5">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider font-mono block mb-1">
                    Emergency Contact
                  </span>
                  <div className="font-semibold text-slate-800">{activeEmp.emergencyContact.name} ({activeEmp.emergencyContact.relation})</div>
                  <div className="text-gray-500">{activeEmp.emergencyContact.phone}</div>
                </div>

                <div className="p-4 bg-slate-50/50 border border-slate-100 rounded-xl text-xs space-y-1.5">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider font-mono block mb-1">
                    Bank Accounts
                  </span>
                  <div className="font-semibold text-slate-800 truncate">{activeEmp.bankDetails.bankName}</div>
                  <div className="text-gray-500">AC: {activeEmp.bankDetails.accountNumber}</div>
                  <div className="text-[10px] text-gray-400 font-mono">IFSC: {activeEmp.bankDetails.ifscCode}</div>
                </div>
              </div>

              {/* Section 7: Notes */}
              <div className="border-t border-gray-100 pt-5">
                <h4 className="text-xs font-bold text-gray-800 uppercase tracking-wider font-mono mb-3">Internal HR Notes</h4>
                <div className="space-y-2 mb-3">
                  {activeEmp.notes?.map((nt, index) => (
                    <p key={index} className="p-3 bg-yellow-50/30 border border-yellow-100/50 text-xs text-yellow-800 rounded-xl">
                      {nt}
                    </p>
                  ))}
                </div>
                {/* Add Note form */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Type a new confidential note regarding this employee..."
                    id="new-note-input"
                    className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-sky-500"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleAddNote(activeEmp.id, e.currentTarget.value);
                        e.currentTarget.value = '';
                      }
                    }}
                  />
                  <button
                    onClick={(e) => {
                      const input = document.getElementById('new-note-input') as HTMLInputElement;
                      if (input) {
                        handleAddNote(activeEmp.id, input.value);
                        input.value = '';
                      }
                    }}
                    className="bg-slate-800 text-white hover:bg-slate-700 text-xs font-semibold px-4 py-2 rounded-xl transition-colors"
                  >
                    Save Note
                  </button>
                </div>
              </div>

            </div>

            {/* Footer actions */}
            <div className="p-4 bg-slate-50 border-t border-gray-100 flex gap-2">
              <button
                onClick={() => {
                  const nextStatus = activeEmp.status === 'Active' ? 'Inactive' : 'Active';
                  onUpdateEmployee(activeEmp.id, { status: nextStatus });
                  setActiveEmp({ ...activeEmp, status: nextStatus });
                }}
                className={`flex-1 text-xs font-bold py-2.5 px-4 rounded-xl transition-all border ${
                  activeEmp.status === 'Active'
                    ? 'border-rose-200 text-rose-600 hover:bg-rose-50'
                    : 'border-emerald-200 bg-emerald-500 text-white hover:bg-emerald-600'
                }`}
              >
                {activeEmp.status === 'Active' ? 'Deactivate Employee' : 'Activate Employee'}
              </button>
              <button
                onClick={() => {
                  // Simulate salary hike
                  const nextSal = activeEmp.salary + 10000;
                  const newHist = [
                    ...activeEmp.promotionHistory,
                    {
                      date: new Date().toISOString().split('T')[0],
                      oldDesignation: activeEmp.designation,
                      newDesignation: activeEmp.designation, // same design for salary increment
                      oldSalary: activeEmp.salary,
                      newSalary: nextSal
                    }
                  ];
                  onUpdateEmployee(activeEmp.id, { salary: nextSal, promotionHistory: newHist });
                  setActiveEmp({ ...activeEmp, salary: nextSal, promotionHistory: newHist });
                }}
                className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs py-2.5 px-4 rounded-xl transition-all shadow-sm"
              >
                Hike Salary (+$10,000)
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Add New Employee Modal Dialog */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-gray-200 rounded-2xl max-w-lg w-full p-6 shadow-2xl animate-fade-in">
            <div className="flex items-center justify-between mb-4 border-b border-gray-100 pb-3">
              <h3 className="text-base font-bold text-gray-900">Add New Employee Profile</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 hover:bg-gray-100 text-gray-400 hover:text-gray-600 rounded-lg"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-500 uppercase font-mono">Full Name</label>
                  <input
                    type="text"
                    required
                    value={newEmpForm.name}
                    onChange={(e) => setNewEmpForm({ ...newEmpForm, name: e.target.value })}
                    className="w-full text-xs border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-sky-500"
                    placeholder="Sarah Jenkins"
                  />
                </div>
                
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-500 uppercase font-mono">Email Address</label>
                  <input
                    type="email"
                    required
                    value={newEmpForm.email}
                    onChange={(e) => setNewEmpForm({ ...newEmpForm, email: e.target.value })}
                    className="w-full text-xs border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-sky-500"
                    placeholder="sarah@hrbrain.ai"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-500 uppercase font-mono">Phone Number</label>
                  <input
                    type="text"
                    value={newEmpForm.phone}
                    onChange={(e) => setNewEmpForm({ ...newEmpForm, phone: e.target.value })}
                    className="w-full text-xs border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-sky-500"
                    placeholder="+1 (555) 101-2001"
                  />
                </div>
                
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-500 uppercase font-mono">Department</label>
                  <select
                    value={newEmpForm.department}
                    onChange={(e) => setNewEmpForm({ ...newEmpForm, department: e.target.value })}
                    className="w-full text-xs border border-gray-200 rounded-xl px-3 py-2 focus:outline-none font-semibold text-gray-700"
                  >
                    {departments.map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-500 uppercase font-mono">Designation</label>
                  <input
                    type="text"
                    value={newEmpForm.designation}
                    onChange={(e) => setNewEmpForm({ ...newEmpForm, designation: e.target.value })}
                    className="w-full text-xs border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-sky-500"
                    placeholder="Senior Frontend Engineer"
                  />
                </div>
                
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-500 uppercase font-mono">Base Salary (USD/yr)</label>
                  <input
                    type="number"
                    value={newEmpForm.salary}
                    onChange={(e) => setNewEmpForm({ ...newEmpForm, salary: Number(e.target.value) })}
                    className="w-full text-xs border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-sky-500 font-mono"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-500 uppercase font-mono">Technical Skills (Comma Separated)</label>
                <input
                  type="text"
                  value={newEmpForm.skills}
                  onChange={(e) => setNewEmpForm({ ...newEmpForm, skills: e.target.value })}
                  className="w-full text-xs border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-1 focus:ring-sky-500"
                  placeholder="React, TypeScript, Redux, Node.js"
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4.5 py-2 rounded-xl text-xs font-semibold hover:bg-gray-100 text-gray-500 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4.5 py-2 rounded-xl text-xs font-semibold bg-sky-500 hover:bg-sky-600 text-slate-950 transition-colors shadow-sm"
                >
                  Create Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
