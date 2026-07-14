/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Briefcase,
  Users,
  Calendar,
  Star,
  Plus,
  X,
  FileText,
  Mail,
  Phone,
  Clock,
  ExternalLink,
  ThumbsUp,
  ThumbsDown,
  ChevronLeft,
  ChevronRight,
  Sparkles
} from 'lucide-react';
import { JobOpening, Candidate, UserRole } from '../types';

interface RecruitmentViewProps {
  jobs: JobOpening[];
  candidates: Candidate[];
  onAddJob: (jobData: Partial<JobOpening>) => void;
  onUpdateCandidate: (id: string, candData: Partial<Candidate>) => void;
  currentUserRole: UserRole;
}

export default function RecruitmentView({
  jobs,
  candidates,
  onAddJob,
  onUpdateCandidate,
  currentUserRole
}: RecruitmentViewProps) {
  // Local sub-tabs
  const [activeSubTab, setActiveSubTab] = useState<'openings' | 'candidates'>('openings');
  
  // States
  const [showAddJobModal, setShowAddJobModal] = useState(false);
  const [activeCandidate, setActiveCandidate] = useState<Candidate | null>(null);

  // Form states for posting job
  const [jobForm, setJobForm] = useState({
    title: '',
    department: 'Engineering',
    location: 'San Francisco, CA',
    type: 'Full-time' as const,
    experienceRequired: '3+ years',
    salaryRange: '$90,000 - $120,000',
    description: '',
    requirements: ''
  });

  const handlePostJobSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!jobForm.title || !jobForm.description) return;

    onAddJob({
      title: jobForm.title,
      department: jobForm.department,
      location: jobForm.location,
      type: jobForm.type,
      experienceRequired: jobForm.experienceRequired,
      salaryRange: jobForm.salaryRange,
      description: jobForm.description,
      requirements: jobForm.requirements.split(',').map(r => r.trim()).filter(Boolean),
      status: 'Active'
    });

    setShowAddJobModal(false);
    setJobForm({
      title: '',
      department: 'Engineering',
      location: 'San Francisco, CA',
      type: 'Full-time',
      experienceRequired: '3+ years',
      salaryRange: '$90,000 - $120,000',
      description: '',
      requirements: ''
    });
  };

  const handleStatusChange = (candId: string, status: any) => {
    onUpdateCandidate(candId, { status });
    if (activeCandidate && activeCandidate.id === candId) {
      setActiveCandidate({ ...activeCandidate, status });
    }
  };

  const handleScheduleInterview = (candId: string, date: string, time: string, interviewer: string) => {
    const schedule = {
      date,
      time,
      interviewer,
      mode: 'Online' as const
    };
    onUpdateCandidate(candId, {
      status: 'Interview Scheduled',
      interviewSchedule: schedule
    });
    if (activeCandidate && activeCandidate.id === candId) {
      setActiveCandidate({ ...activeCandidate, status: 'Interview Scheduled', interviewSchedule: schedule });
    }
  };

  const handleSubmitFeedback = (candId: string, tech: number, cult: number, notes: string) => {
    const feedback = {
      technicalScore: tech,
      cultureScore: cult,
      notes,
      interviewer: 'David Miller'
    };
    onUpdateCandidate(candId, {
      status: 'Interview Feedback Given',
      feedback,
      rating: Math.round(((tech + cult) / 2) * 10) / 10
    });
    if (activeCandidate && activeCandidate.id === candId) {
      setActiveCandidate({
        ...activeCandidate,
        status: 'Interview Feedback Given',
        feedback,
        rating: Math.round(((tech + cult) / 2) * 10) / 10
      });
    }
  };

  const handleGenerateOffer = (candId: string, salary: number, joiningDate: string) => {
    const offer = {
      salary,
      joiningDate,
      generatedAt: new Date().toISOString().split('T')[0]
    };
    onUpdateCandidate(candId, {
      status: 'Offer Generated',
      offerDetails: offer
    });
    if (activeCandidate && activeCandidate.id === candId) {
      setActiveCandidate({ ...activeCandidate, status: 'Offer Generated', offerDetails: offer });
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Sub tabs selectors */}
      <div className="flex border-b border-gray-100 bg-white p-2 rounded-2xl border shadow-sm">
        <button
          onClick={() => setActiveSubTab('openings')}
          className={`flex-1 text-center py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
            activeSubTab === 'openings' ? 'bg-slate-900 text-white shadow-md' : 'text-gray-500 hover:text-gray-900'
          }`}
          id="recruitment-subtab-openings"
        >
          <Briefcase size={14} />
          <span>Active Jobs ({jobs.filter(j => j.status === 'Active').length})</span>
        </button>
        <button
          onClick={() => setActiveSubTab('candidates')}
          className={`flex-1 text-center py-2 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 ${
            activeSubTab === 'candidates' ? 'bg-slate-900 text-white shadow-md' : 'text-gray-500 hover:text-gray-900'
          }`}
          id="recruitment-subtab-candidates"
        >
          <Users size={14} />
          <span>Candidates Pipeline ({candidates.length})</span>
        </button>
      </div>

      {/* RENDER ACTIVE JOBS SUBTAB */}
      {activeSubTab === 'openings' && (
        <div className="space-y-6">
          {/* Post job panel header */}
          <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-gray-100 shadow-sm">
            <div>
              <h3 className="text-sm font-semibold text-gray-900">Enterprise Job Vacancies</h3>
              <p className="text-xs text-gray-400 mt-0.5">Publish job openings for sourcing candidate pipelines</p>
            </div>
            
            {['Super Admin', 'HR Manager', 'Recruiter'].includes(currentUserRole) && (
              <button
                onClick={() => setShowAddJobModal(true)}
                id="post-job-trigger"
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold bg-sky-500 hover:bg-sky-600 text-slate-950 transition-colors shadow-sm"
              >
                <Plus size={15} />
                <span>Post Job Opportunity</span>
              </button>
            )}
          </div>

          {/* Jobs Listing Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5" id="jobs-listing-grid">
            {jobs.map(job => (
              <div key={job.id} className="p-5 bg-white border border-gray-100 rounded-2xl shadow-sm flex flex-col justify-between hover:shadow-md hover:border-gray-200 transition-all">
                <div>
                  {/* Title and tags */}
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="text-sm font-bold text-gray-900">{job.title}</h4>
                      <span className="text-[10px] text-gray-400 font-medium font-mono">{job.department} • {job.location}</span>
                    </div>
                    <span className={`px-2 py-0.5 text-[9px] font-bold font-mono uppercase rounded ${
                      job.status === 'Active' ? 'bg-emerald-50 text-emerald-600 border border-emerald-200/50' : 'bg-gray-100 text-gray-500'
                    }`}>
                      {job.status}
                    </span>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-gray-500 line-clamp-3 mb-4 leading-relaxed">{job.description}</p>

                  {/* Requirements list */}
                  <div className="flex flex-wrap gap-1.5 mb-4">
                    {job.requirements.map(req => (
                      <span key={req} className="text-[9px] bg-slate-50 text-slate-500 border border-slate-100 px-2 py-0.5 rounded-md font-semibold">
                        {req}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Footer metrics */}
                <div className="border-t border-gray-50 pt-3 flex items-center justify-between text-xs text-gray-400 font-semibold">
                  <span>Salary: <b className="text-gray-700">{job.salaryRange}</b></span>
                  <span className="text-indigo-500 flex items-center gap-1">
                    <span>{job.applicantsCount} Applied</span>
                    <ExternalLink size={11} />
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* RENDER CANDIDATES LIST PIPELINE */}
      {activeSubTab === 'candidates' && (
        <div className="space-y-4">
          <div className="p-5 bg-white border border-gray-100 rounded-2xl shadow-sm">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Talent Sourcing Board</h3>
            
            <div className="overflow-x-auto border border-gray-100 rounded-xl">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-gray-400 font-bold border-b border-gray-100 font-mono uppercase text-[9px] tracking-wider">
                    <th className="p-3.5">Candidate Details</th>
                    <th className="p-3.5">Applied For</th>
                    <th className="p-3.5 text-center">ATS Rating</th>
                    <th className="p-3.5">Application Status</th>
                    <th className="p-3.5 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-gray-600 font-medium">
                  {candidates.map(cand => (
                    <tr key={cand.id} className="hover:bg-slate-50/50 transition-colors">
                      <td className="p-3.5">
                        <span className="font-bold text-gray-800 block">{cand.name}</span>
                        <span className="text-[10px] text-gray-400 block mt-0.5">{cand.email} • {cand.phone}</span>
                      </td>
                      <td className="p-3.5">{cand.jobTitle}</td>
                      <td className="p-3.5 text-center">
                        {cand.rating ? (
                          <span className="inline-flex items-center gap-0.5 font-bold font-mono text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-md text-[10px] border border-indigo-100">
                            <Star size={11} className="fill-indigo-500 text-indigo-500" />
                            <span>{cand.rating}</span>
                          </span>
                        ) : (
                          <span className="text-gray-300 font-mono">--</span>
                        )}
                      </td>
                      <td className="p-3.5">
                        <span className={`inline-block px-2.5 py-0.5 rounded-full text-[9px] font-bold uppercase font-mono border ${
                          cand.status === 'Applied' ? 'bg-blue-50 text-blue-600 border-blue-200/50' :
                          cand.status === 'Interview Scheduled' ? 'bg-amber-50 text-amber-600 border-amber-200/50' :
                          cand.status === 'Interview Feedback Given' ? 'bg-purple-50 text-purple-600 border-purple-200/50' :
                          cand.status === 'Offer Generated' ? 'bg-emerald-50 text-emerald-600 border-emerald-200/50' :
                          cand.status === 'Accepted' ? 'bg-teal-50 text-teal-600 border-teal-200/50' :
                          'bg-rose-50 text-rose-600 border-rose-200/50'
                        }`}>
                          {cand.status}
                        </span>
                      </td>
                      <td className="p-3.5 text-center">
                        <button
                          onClick={() => setActiveCandidate(cand)}
                          className="text-[10px] text-indigo-500 hover:text-indigo-600 bg-indigo-50 px-3 py-1 rounded-md font-bold border border-indigo-100 transition-colors"
                          id={`evaluate-cand-${cand.id}`}
                        >
                          Evaluate
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Candidate Evaluation Modal Drawer overlay */}
      {activeCandidate && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/40 backdrop-blur-sm flex justify-end">
          <div className="w-full max-w-lg bg-white h-full shadow-2xl flex flex-col justify-between transform transition-transform duration-300 animate-slide-left">
            {/* Drawer Header */}
            <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-slate-50">
              <div>
                <h3 className="text-sm font-bold text-gray-900">Review Application</h3>
                <p className="text-[10px] text-gray-400 font-mono">{activeCandidate.name} • {activeCandidate.jobTitle}</p>
              </div>
              <button
                onClick={() => setActiveCandidate(null)}
                className="p-1.5 hover:bg-gray-100 text-gray-400 hover:text-gray-600 rounded-lg"
              >
                <X size={18} />
              </button>
            </div>

            {/* Scrollable Information */}
            <div className="flex-1 overflow-y-auto p-5 space-y-5 text-xs text-gray-600">
              
              {/* Contact info card */}
              <div className="p-4 bg-slate-50 border border-slate-100 rounded-xl space-y-2">
                <span className="block text-[9px] font-bold text-gray-400 font-mono uppercase">Contacts Info</span>
                <div className="flex items-center gap-2"><Mail size={13} /> {activeCandidate.email}</div>
                <div className="flex items-center gap-2"><Phone size={13} /> {activeCandidate.phone}</div>
                <div className="flex items-center gap-2"><FileText size={13} /> resume_attachment_curriculum.pdf</div>
              </div>

              {/* Status transition controller */}
              <div className="space-y-2">
                <span className="block text-[9px] font-bold text-gray-400 font-mono uppercase">Update Pipeline Status</span>
                <div className="grid grid-cols-3 gap-2">
                  {['Applied', 'Screening', 'Accepted', 'Rejected'].map(st => (
                    <button
                      key={st}
                      onClick={() => handleStatusChange(activeCandidate.id, st)}
                      className={`py-1.5 text-[10px] font-bold border rounded-lg transition-colors ${
                        activeCandidate.status === st ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              </div>

              {/* Dynamic: Schedule Interview Block */}
              {['Applied', 'Screening'].includes(activeCandidate.status) && (
                <div className="p-4.5 border border-amber-100 bg-amber-50/10 rounded-xl space-y-3.5">
                  <div className="flex items-center gap-1.5 text-amber-600 font-bold">
                    <Calendar size={14} />
                    <span>Arrange Technical Interview</span>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="date"
                      id="int-date"
                      className="border border-gray-200 rounded-lg px-2 py-1 text-xs focus:outline-none"
                    />
                    <input
                      type="time"
                      id="int-time"
                      className="border border-gray-200 rounded-lg px-2 py-1 text-xs focus:outline-none"
                    />
                  </div>
                  <button
                    onClick={() => {
                      const dt = (document.getElementById('int-date') as HTMLInputElement)?.value;
                      const tm = (document.getElementById('int-time') as HTMLInputElement)?.value;
                      if (dt && tm) {
                        handleScheduleInterview(activeCandidate.id, dt, tm, 'David Miller');
                      }
                    }}
                    className="w-full text-xs font-bold bg-amber-500 hover:bg-amber-600 text-slate-950 py-1.5 rounded-lg"
                  >
                    Lock Interview Schedule
                  </button>
                </div>
              )}

              {/* Interview Feedback Evaluator */}
              {activeCandidate.status === 'Interview Scheduled' && (
                <div className="p-4.5 border border-purple-100 bg-purple-50/10 rounded-xl space-y-3">
                  <div className="flex items-center gap-1.5 text-purple-600 font-bold">
                    <Sparkles size={14} className="animate-pulse" />
                    <span>Submit Candidate Scoring</span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 text-[10px] font-bold text-gray-500 uppercase font-mono">
                    <div className="space-y-1">
                      <span>Technical (1-5)</span>
                      <input type="number" min={1} max={5} id="score-tech" className="w-full text-xs border border-gray-200 rounded-lg px-2.5 py-1" defaultValue={4} />
                    </div>
                    <div className="space-y-1">
                      <span>Culture (1-5)</span>
                      <input type="number" min={1} max={5} id="score-cult" className="w-full text-xs border border-gray-200 rounded-lg px-2.5 py-1" defaultValue={4} />
                    </div>
                  </div>

                  <div className="space-y-1">
                    <span className="text-[10px] font-bold text-gray-500 uppercase font-mono">Interviewer Evaluation Remarks</span>
                    <textarea id="feedback-notes" placeholder="Outstanding React expertise, fast problem solver..." rows={2} className="w-full text-xs border border-gray-200 rounded-lg p-2 focus:outline-none" />
                  </div>

                  <button
                    onClick={() => {
                      const tech = Number((document.getElementById('score-tech') as HTMLInputElement)?.value || 4);
                      const cult = Number((document.getElementById('score-cult') as HTMLInputElement)?.value || 4);
                      const notes = (document.getElementById('feedback-notes') as HTMLTextAreaElement)?.value || 'Perfect technical expertise.';
                      handleSubmitFeedback(activeCandidate.id, tech, cult, notes);
                    }}
                    className="w-full text-xs font-bold bg-purple-600 hover:bg-purple-700 text-white py-1.5 rounded-lg"
                  >
                    Submit Interview Scores
                  </button>
                </div>
              )}

              {/* Offer Generation and Dispatch block */}
              {activeCandidate.status === 'Interview Feedback Given' && (
                <div className="p-4.5 border border-emerald-100 bg-emerald-50/10 rounded-xl space-y-3">
                  <div className="flex items-center gap-1.5 text-emerald-600 font-bold">
                    <FileText size={14} />
                    <span>Offer Generation Engine</span>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2 text-[10px] font-bold text-gray-500 uppercase font-mono">
                    <div className="space-y-1">
                      <span>Base Salary (USD/yr)</span>
                      <input type="number" id="offer-salary" className="w-full text-xs border border-gray-200 rounded-lg px-2.5 py-1" defaultValue={95000} />
                    </div>
                    <div className="space-y-1">
                      <span>Target Join Date</span>
                      <input type="date" id="offer-join" className="w-full text-xs border border-gray-200 rounded-lg px-2.5 py-1" defaultValue="2026-08-01" />
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      const sal = Number((document.getElementById('offer-salary') as HTMLInputElement)?.value || 95000);
                      const dt = (document.getElementById('offer-join') as HTMLInputElement)?.value || '2026-08-01';
                      handleGenerateOffer(activeCandidate.id, sal, dt);
                    }}
                    className="w-full text-xs font-bold bg-emerald-500 hover:bg-emerald-600 text-slate-950 py-1.5 rounded-lg"
                  >
                    Generate Offer Certificate
                  </button>
                </div>
              )}

              {/* Summary outputs */}
              {activeCandidate.feedback && (
                <div className="p-4 bg-purple-50/25 border border-purple-100 rounded-xl space-y-1">
                  <span className="text-[9px] font-bold text-purple-600 uppercase font-mono block">Technical Ratings feedback</span>
                  <p className="font-semibold text-slate-800">Tech Score: {activeCandidate.feedback.technicalScore}/5 • Culture: {activeCandidate.feedback.cultureScore}/5</p>
                  <p className="text-gray-500 italic">" {activeCandidate.feedback.notes} "</p>
                </div>
              )}

              {activeCandidate.offerDetails && (
                <div className="p-4 bg-emerald-50/25 border border-emerald-100 rounded-xl space-y-1">
                  <span className="text-[9px] font-bold text-emerald-600 uppercase font-mono block">Active Employment Offer Details</span>
                  <p className="font-semibold text-slate-800">Salary: ${activeCandidate.offerDetails.salary.toLocaleString()}/yr</p>
                  <p className="text-gray-500">Proposed Joining Date: {activeCandidate.offerDetails.joiningDate}</p>
                </div>
              )}

            </div>

            {/* Bottom drawer close */}
            <div className="p-4 bg-slate-50 border-t border-gray-100 flex gap-2">
              <button
                onClick={() => setActiveCandidate(null)}
                className="w-full bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold py-2.5 px-4 rounded-xl transition-all"
              >
                Close Drawer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add New Job Posting Modal Dialog */}
      {showAddJobModal && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-gray-200 rounded-2xl max-w-lg w-full p-6 shadow-2xl animate-fade-in">
            <div className="flex items-center justify-between mb-4 border-b border-gray-100 pb-3">
              <h3 className="text-base font-bold text-gray-900">Post Job Opportunity</h3>
              <button
                onClick={() => setShowAddJobModal(false)}
                className="p-1 hover:bg-gray-100 text-gray-400 hover:text-gray-600 rounded-lg"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handlePostJobSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-500 uppercase font-mono">Job Role Title</label>
                  <input
                    type="text"
                    required
                    value={jobForm.title}
                    onChange={(e) => setJobForm({ ...jobForm, title: e.target.value })}
                    className="w-full text-xs border border-gray-200 rounded-xl px-3 py-2"
                    placeholder="Senior React Developer"
                  />
                </div>
                
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-500 uppercase font-mono">Department</label>
                  <select
                    value={jobForm.department}
                    onChange={(e) => setJobForm({ ...jobForm, department: e.target.value })}
                    className="w-full text-xs border border-gray-200 rounded-xl px-3 py-2 font-semibold text-gray-700"
                  >
                    <option value="Engineering">Engineering</option>
                    <option value="Human Resources">Human Resources</option>
                    <option value="Sales & Marketing">Sales & Marketing</option>
                    <option value="Finance">Finance</option>
                    <option value="Design">Design</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-500 uppercase font-mono">Location</label>
                  <input
                    type="text"
                    value={jobForm.location}
                    onChange={(e) => setJobForm({ ...jobForm, location: e.target.value })}
                    className="w-full text-xs border border-gray-200 rounded-xl px-2.5 py-2"
                  />
                </div>
                
                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-500 uppercase font-mono">Experience Req</label>
                  <input
                    type="text"
                    value={jobForm.experienceRequired}
                    onChange={(e) => setJobForm({ ...jobForm, experienceRequired: e.target.value })}
                    className="w-full text-xs border border-gray-200 rounded-xl px-2.5 py-2"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-bold text-gray-500 uppercase font-mono">Salary Range</label>
                  <input
                    type="text"
                    value={jobForm.salaryRange}
                    onChange={(e) => setJobForm({ ...jobForm, salaryRange: e.target.value })}
                    className="w-full text-xs border border-gray-200 rounded-xl px-2.5 py-2"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-500 uppercase font-mono">Job Description</label>
                <textarea
                  required
                  rows={3}
                  value={jobForm.description}
                  onChange={(e) => setJobForm({ ...jobForm, description: e.target.value })}
                  className="w-full text-xs border border-gray-200 rounded-xl p-2"
                  placeholder="Summarize the core duties, stack requirements and growth paths..."
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-gray-500 uppercase font-mono">Requirements List (Comma Separated)</label>
                <input
                  type="text"
                  value={jobForm.requirements}
                  onChange={(e) => setJobForm({ ...jobForm, requirements: e.target.value })}
                  className="w-full text-xs border border-gray-200 rounded-xl px-3 py-2"
                  placeholder="React 18, TypeScript, Tailwind, Node.js"
                />
              </div>

              <div className="flex justify-end gap-2.5 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowAddJobModal(false)}
                  className="px-4.5 py-2 rounded-xl text-xs font-semibold hover:bg-gray-100 text-gray-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4.5 py-2 rounded-xl text-xs font-semibold bg-sky-500 hover:bg-sky-600 text-slate-950 transition-colors shadow-sm"
                >
                  Publish Job Posting
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
