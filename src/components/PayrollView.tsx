/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  FileText,
  BadgeDollarSign,
  Download,
  CalendarDays,
  Coins,
  ShieldCheck,
  Calculator,
  Search,
  Filter,
  Check,
  Printer,
  ChevronLeft,
  ChevronRight,
  Plus,
  X
} from 'lucide-react';
import { Payroll } from '../types';

interface PayrollViewProps {
  payrolls: Payroll[];
  onGeneratePayroll: (month: string) => void;
  currentUserRole: string;
}

export default function PayrollView({
  payrolls,
  onGeneratePayroll,
  currentUserRole
}: PayrollViewProps) {
  // Local states
  const [selectedMonth, setSelectedMonth] = useState('2026-06');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDept, setFilterDept] = useState('All');
  
  // Interactive Payslip modal
  const [activePayslip, setActivePayslip] = useState<Payroll | null>(null);

  const canGenerate = ['Super Admin', 'HR Manager', 'Payroll Manager'].includes(currentUserRole);

  const handleGenerateClick = () => {
    onGeneratePayroll(selectedMonth);
  };

  const filteredPayrolls = payrolls
    .filter(p => {
      const matchMonth = p.month === selectedMonth;
      const matchSearch =
        p.employeeName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.employeeId.toLowerCase().includes(searchTerm.toLowerCase());
      const matchDept = filterDept === 'All' || p.department === filterDept;

      return matchMonth && matchSearch && matchDept;
    });

  // Calculate stats
  const totalDisbursed = filteredPayrolls.reduce((sum, p) => sum + p.netSalary, 0);
  const totalTdsPaid = filteredPayrolls.reduce((sum, p) => sum + p.deductions.tds, 0);
  const totalPfProvident = filteredPayrolls.reduce((sum, p) => sum + p.deductions.providentFund, 0);

  // Departments List
  const departments = ['Engineering', 'Human Resources', 'Sales & Marketing', 'Finance', 'Design'];

  // Export payroll list as CSV
  const handleExportCSV = () => {
    const headers = ['Employee ID,Employee Name,Department,Designation,Month,Base Salary,PF,ESI,TDS,Net Salary,Status'];
    const rows = filteredPayrolls.map(p => 
      `"${p.employeeId}","${p.employeeName}","${p.department}","${p.designation}","${p.month}",${p.baseSalary},${p.deductions.providentFund},${p.deductions.esi},${p.deductions.tds},${p.netSalary},"${p.status}"`
    );
    const blob = new Blob([[headers, ...rows].join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `payroll_summary_${selectedMonth}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      
      {/* Dynamic Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5" id="payroll-overview-grid">
        <div className="p-5 bg-white border border-gray-100 rounded-2xl shadow-sm flex items-center gap-4">
          <div className="p-3 bg-indigo-50 text-indigo-500 rounded-xl">
            <Coins size={22} />
          </div>
          <div>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider font-mono">Net Salaries Disbursed</span>
            <b className="text-xl block text-gray-900 mt-0.5">${totalDisbursed.toLocaleString()}</b>
            <p className="text-[10px] text-gray-400 mt-0.5">Calculated for {filteredPayrolls.length} active staff</p>
          </div>
        </div>

        <div className="p-5 bg-white border border-gray-100 rounded-2xl shadow-sm flex items-center gap-4">
          <div className="p-3 bg-amber-50 text-amber-500 rounded-xl">
            <Calculator size={22} />
          </div>
          <div>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider font-mono">Total TDS (Tax Withheld)</span>
            <b className="text-xl block text-gray-900 mt-0.5">${totalTdsPaid.toLocaleString()}</b>
            <p className="text-[10px] text-gray-400 mt-0.5">Estimated tax deductions</p>
          </div>
        </div>

        <div className="p-5 bg-white border border-gray-100 rounded-2xl shadow-sm flex items-center gap-4">
          <div className="p-3 bg-emerald-50 text-emerald-500 rounded-xl">
            <ShieldCheck size={22} />
          </div>
          <div>
            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider font-mono">Total PF Provident Fund</span>
            <b className="text-xl block text-gray-900 mt-0.5">${totalPfProvident.toLocaleString()}</b>
            <p className="text-[10px] text-gray-400 mt-0.5">Tax exempt retirement asset</p>
          </div>
        </div>
      </div>

      {/* Control Actions & Month Picker */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 bg-white border border-gray-100 rounded-2xl shadow-sm">
        
        {/* Left config */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200/60 rounded-xl px-3.5 py-1.5 text-xs text-slate-600 font-bold font-mono">
            <CalendarDays size={14} />
            <input
              type="month"
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="bg-transparent focus:outline-none cursor-pointer"
              id="payroll-month-picker"
            />
          </div>

          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1 text-xs text-indigo-600 hover:text-indigo-700 font-bold bg-indigo-50 hover:bg-indigo-100/50 px-3.5 py-2.5 rounded-xl transition-colors"
            id="payroll-csv-export"
          >
            <Download size={14} />
            <span>Export CSV</span>
          </button>
        </div>

        {/* Right actions */}
        {canGenerate && (
          <div className="flex gap-2 w-full sm:w-auto justify-end">
            <button
              onClick={handleGenerateClick}
              id="generate-payroll-btn"
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-semibold bg-sky-500 hover:bg-sky-600 text-slate-950 transition-colors shadow-sm"
            >
              <Plus size={15} />
              <span>Process Salary Cycle</span>
            </button>
          </div>
        )}

      </div>

      {/* Salary History logs table */}
      <div className="p-5 bg-white border border-gray-100 rounded-2xl shadow-sm space-y-4">
        
        {/* Table filters */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <h3 className="text-sm font-semibold text-gray-900">Calculated Employee Payroll logs</h3>
          
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:flex-initial">
              <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search staff..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-8 pr-3 py-1.5 bg-slate-50 text-xs rounded-lg border-none focus:outline-none w-full"
                id="payroll-search-input"
              />
            </div>
            
            <select
              value={filterDept}
              onChange={(e) => setFilterDept(e.target.value)}
              className="text-xs bg-slate-50 border-none rounded-lg px-2 py-1.5 text-gray-600 font-medium"
              id="payroll-dept-filter"
            >
              <option value="All">All Teams</option>
              {departments.map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Table layout */}
        <div className="overflow-x-auto border border-gray-100 rounded-xl">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-50 text-gray-400 font-bold border-b border-gray-100 font-mono uppercase text-[9px] tracking-wider">
                <th className="p-3.5">Employee Name</th>
                <th className="p-3.5">Department</th>
                <th className="p-3.5">Base Salary</th>
                <th className="p-3.5">Deductions</th>
                <th className="p-3.5">Net Payout</th>
                <th className="p-3.5 text-center">Payslip</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-gray-600 font-medium">
              {filteredPayrolls.length > 0 ? filteredPayrolls.map(pay => {
                const totalDeducts = pay.deductions.providentFund + pay.deductions.esi + pay.deductions.tds;
                return (
                  <tr key={pay.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-3.5">
                      <span className="font-bold text-gray-800 block">{pay.employeeName}</span>
                      <span className="text-[10px] text-gray-400 font-mono mt-0.5">{pay.employeeId}</span>
                    </td>
                    <td className="p-3.5">{pay.department}</td>
                    <td className="p-3.5 font-mono font-bold text-gray-900">${pay.baseSalary.toLocaleString()}</td>
                    <td className="p-3.5 font-mono text-rose-500">-${totalDeducts.toLocaleString()}</td>
                    <td className="p-3.5 font-mono font-bold text-emerald-600">${pay.netSalary.toLocaleString()}</td>
                    <td className="p-3.5 text-center">
                      <button
                        onClick={() => setActivePayslip(pay)}
                        className="flex items-center gap-1 text-[10px] text-indigo-500 hover:text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md font-bold mx-auto border border-indigo-100"
                        id={`open-payslip-${pay.id}`}
                      >
                        <FileText size={12} />
                        <span>Payslip</span>
                      </button>
                    </td>
                  </tr>
                );
              }) : (
                <tr>
                  <td colSpan={6} className="p-10 text-center text-gray-400">
                    No payroll calculations recorded for the month of <b>{selectedMonth}</b>.<br />
                    {canGenerate && (
                      <button
                        onClick={handleGenerateClick}
                        className="mt-3 text-xs bg-indigo-50 text-indigo-600 font-semibold px-4 py-2 rounded-xl border border-indigo-100"
                      >
                        Calculate Salaries Now
                      </button>
                    )}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Interactive Printable Payslip Modal */}
      {activePayslip && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-gray-200 rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-6 flex flex-col justify-between">
            
            {/* Action buttons */}
            <div className="flex justify-between items-center border-b border-gray-100 pb-3">
              <h3 className="text-base font-bold text-gray-900">Salary Payslip</h3>
              <div className="flex gap-2">
                <button
                  onClick={() => window.print()}
                  className="flex items-center gap-1 px-3 py-1.5 text-xs font-semibold bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-all"
                  id="print-payslip-btn"
                >
                  <Printer size={13} />
                  <span>Print Payslip</span>
                </button>
                <button
                  onClick={() => setActivePayslip(null)}
                  className="p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg"
                >
                  <X size={18} />
                </button>
              </div>
            </div>

            {/* Payslip content itself (Styled like a professional corporate receipt) */}
            <div className="border border-gray-200 p-5 rounded-xl space-y-4 print:border-none" id="payslip-invoice-sheet">
              {/* Receipt Header branding */}
              <div className="flex justify-between items-start border-b border-gray-100 pb-3">
                <div>
                  <h4 className="text-sm font-bold text-slate-900">HRBrain AI Technologies Inc.</h4>
                  <p className="text-[10px] text-gray-400 mt-0.5">100 Pine Street, San Francisco, CA 94111</p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-bold font-mono text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">PAY SLIP</span>
                  <p className="text-[10px] text-gray-400 mt-1 font-mono">{activePayslip.month}</p>
                </div>
              </div>

              {/* Employee brief details */}
              <div className="grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-[9px] font-bold text-gray-400 font-mono uppercase block">Employee Details</span>
                  <div className="font-bold text-slate-800 mt-1">{activePayslip.employeeName}</div>
                  <div className="text-gray-400">ID: {activePayslip.employeeId}</div>
                  <div className="text-gray-400">Dept: {activePayslip.department}</div>
                  <div className="text-gray-400">{activePayslip.designation}</div>
                </div>
                <div className="text-right">
                  <span className="text-[9px] font-bold text-gray-400 font-mono uppercase block">Payment Details</span>
                  <div className="text-slate-800 mt-1 font-semibold">Method: Direct Deposit</div>
                  <div className="text-gray-400">Processed: {activePayslip.generatedAt || activePayslip.month + '-30'}</div>
                  <div className="text-[10px] font-mono text-emerald-600 font-bold mt-1">STATUS: PAID</div>
                </div>
              </div>

              {/* Earnings vs Deductions Breakdown Grid */}
              <div className="grid grid-cols-2 gap-4 text-xs pt-2">
                
                {/* Left Side: Earnings allowances */}
                <div className="border-r border-gray-100 pr-3.5 space-y-1.5">
                  <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider font-mono mb-1 text-emerald-600">Earnings</span>
                  <div className="flex justify-between">
                    <span>Basic Salary:</span>
                    <b className="font-mono">${activePayslip.baseSalary.toLocaleString()}</b>
                  </div>
                  <div className="flex justify-between">
                    <span>Allowances:</span>
                    <b className="font-mono">$0</b>
                  </div>
                  <div className="flex justify-between">
                    <span>Bonuses:</span>
                    <b className="font-mono">${activePayslip.bonuses.toLocaleString()}</b>
                  </div>
                  <div className="flex justify-between border-t border-dashed border-gray-100 pt-1.5 font-bold text-emerald-600">
                    <span>Total Gross:</span>
                    <span className="font-mono">${(activePayslip.baseSalary + activePayslip.bonuses).toLocaleString()}</span>
                  </div>
                </div>

                {/* Right Side: Tax Deductions */}
                <div className="space-y-1.5">
                  <span className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider font-mono mb-1 text-rose-500">Deductions</span>
                  <div className="flex justify-between">
                    <span>Provident Fund (PF):</span>
                    <b className="font-mono">${activePayslip.deductions.providentFund.toLocaleString()}</b>
                  </div>
                  <div className="flex justify-between">
                    <span>State Insurance (ESI):</span>
                    <b className="font-mono">${activePayslip.deductions.esi.toLocaleString()}</b>
                  </div>
                  <div className="flex justify-between">
                    <span>TDS (Income Tax):</span>
                    <b className="font-mono">${activePayslip.deductions.tds.toLocaleString()}</b>
                  </div>
                  <div className="flex justify-between border-t border-dashed border-gray-100 pt-1.5 font-bold text-rose-500">
                    <span>Total Deduct:</span>
                    <span className="font-mono">
                      -${(activePayslip.deductions.providentFund + activePayslip.deductions.esi + activePayslip.deductions.tds).toLocaleString()}
                    </span>
                  </div>
                </div>

              </div>

              {/* Net Payout box footer */}
              <div className="p-3 bg-slate-900 text-slate-100 rounded-xl flex justify-between items-center font-bold">
                <div className="text-xs text-slate-400 font-semibold">Net Disbursed Take-home Pay:</div>
                <div className="text-lg font-mono text-sky-400">${activePayslip.netSalary.toLocaleString()}</div>
              </div>

              {/* Simple disclaimer */}
              <div className="text-[9px] text-gray-400 font-mono text-center pt-2">
                *This is an electronically generated statement. No physical signature is required.
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}
