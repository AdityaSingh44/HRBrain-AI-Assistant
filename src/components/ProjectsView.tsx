/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  FolderKanban,
  Plus,
  X,
  MessageSquare,
  ArrowRight,
  ArrowLeft,
  Clock,
  CircleDot
} from 'lucide-react';
import { Project, ProjectTask, Employee } from '../types';

interface ProjectsViewProps {
  projects: Project[];
  tasks: ProjectTask[];
  employees: Employee[];
  onAddTask: (projId: string, taskData: Partial<ProjectTask>) => void;
  onUpdateTaskStatus: (projId: string, taskId: string, status: 'Todo' | 'In Progress' | 'In Review' | 'Done') => void;
}

export default function ProjectsView({
  projects,
  tasks,
  employees,
  onAddTask,
  onUpdateTaskStatus
}: ProjectsViewProps) {
  // Selected Project state
  const [activeProjId, setActiveProjId] = useState(projects[0]?.id || '');
  const activeProj = projects.find(p => p.id === activeProjId);

  // States
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [activeTaskDetail, setActiveTaskDetail] = useState<ProjectTask | null>(null);

  // Filter tasks belonging to the active project
  const projectTasks = tasks.filter(t => t.projectId === activeProjId);

  // New task form state
  const [taskForm, setTaskForm] = useState({
    title: '',
    description: '',
    assignedToId: employees[0]?.id || '',
    priority: 'Medium' as const,
    tags: 'Frontend, React'
  });

  const handleTaskSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeProj || !taskForm.title) return;

    const assignedEmp = employees.find(emp => emp.id === taskForm.assignedToId);

    onAddTask(activeProj.id, {
      title: taskForm.title,
      description: taskForm.description,
      priority: taskForm.priority,
      status: 'Todo',
      assignees: [
        {
          id: assignedEmp?.employeeId || 'HB-999',
          name: assignedEmp?.name || 'Unassigned',
          avatar: assignedEmp?.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=64'
        }
      ],
      comments: []
    });

    setShowAddTaskModal(false);
    setTaskForm({
      title: '',
      description: '',
      assignedToId: employees[0]?.id || '',
      priority: 'Medium',
      tags: 'Frontend, React'
    });
  };

  const handleTaskComment = (taskId: string, commentText: string) => {
    if (!commentText.trim() || !activeProj) return;
    
    // Find task
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      const commentObj = {
        id: `c-${Date.now()}`,
        userName: 'David Miller',
        text: commentText,
        createdAt: 'Just now'
      };
      const updatedComments = [...(task.comments || []), commentObj];
      task.comments = updatedComments; // update in local reference
      setActiveTaskDetail({ ...task, comments: updatedComments });
    }
  };

  // Kanban Columns
  const COLUMNS = [
    { id: 'Todo' as const, label: 'Todo Pile', bg: 'bg-slate-50 border-slate-100' },
    { id: 'In Progress' as const, label: 'In Progress', bg: 'bg-sky-50/10 border-sky-100/30' },
    { id: 'In Review' as const, label: 'In Review', bg: 'bg-purple-50/10 border-purple-100/30' },
    { id: 'Done' as const, label: 'Completed', bg: 'bg-emerald-50/10 border-emerald-100/30' }
  ];

  return (
    <div className="space-y-6">
      
      {/* Project selector top header */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 bg-white border border-gray-100 rounded-2xl shadow-sm">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <FolderKanban className="text-sky-500 shrink-0" size={20} />
          <div>
            <h3 className="text-sm font-semibold text-gray-900">Corporate Kanban Workspace</h3>
            <p className="text-xs text-gray-400 mt-0.5">Team tasks, backlog logs and completions trackers</p>
          </div>
        </div>

        {/* Picker & Sourcing add triggers */}
        <div className="flex gap-2.5 w-full sm:w-auto justify-end">
          <select
            value={activeProjId}
            onChange={(e) => setActiveProjId(e.target.value)}
            className="text-xs bg-slate-50 border-none rounded-xl px-3.5 py-2.5 font-semibold text-gray-700 cursor-pointer focus:outline-none"
            id="kanban-project-picker"
          >
            {projects.map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>

          <button
            onClick={() => setShowAddTaskModal(true)}
            id="add-task-trigger"
            className="flex items-center gap-1.5 px-4.5 py-2.5 rounded-xl text-xs font-semibold bg-sky-500 hover:bg-sky-600 text-slate-950 transition-colors shadow-sm shrink-0"
          >
            <Plus size={15} />
            <span>Create Task</span>
          </button>
        </div>
      </div>

      {activeProj && (
        <div className="space-y-4">
          
          {/* Project progress statistics panel */}
          <div className="p-4 bg-slate-900 border border-slate-800 text-white rounded-2xl shadow-md flex items-center justify-between text-xs">
            <div>
              <span className="text-[10px] text-sky-400 font-mono block">Project Client Workspace</span>
              <h4 className="font-bold text-sm text-slate-100 mt-0.5">{activeProj.name}</h4>
              <p className="text-[11px] text-slate-400 mt-1">{activeProj.description}</p>
            </div>
            
            <div className="text-right shrink-0">
              <span className="font-bold block">Progress Mapping</span>
              <span className="font-mono text-indigo-400 block mt-1">
                {projectTasks.filter(t => t.status === 'Done').length} of {projectTasks.length} completed
              </span>
            </div>
          </div>

          {/* Kanban Board columns wrapper */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4" id="kanban-columns-grid">
            {COLUMNS.map(col => {
              const colTasks = projectTasks.filter(t => t.status === col.id);
              
              return (
                <div
                  key={col.id}
                  className={`p-4 border rounded-2xl min-h-[460px] flex flex-col space-y-3 ${col.bg}`}
                  id={`kanban-col-${col.id.toLowerCase().replace(' ', '-')}`}
                >
                  {/* Column Header */}
                  <div className="flex items-center justify-between border-b border-gray-100/50 pb-2">
                    <span className="text-xs font-bold text-gray-700 tracking-wide font-mono uppercase">{col.label}</span>
                    <span className="text-[11px] font-mono font-bold text-gray-400 bg-gray-50 border border-gray-100 px-1.5 py-0.5 rounded-md">
                      {colTasks.length}
                    </span>
                  </div>

                  {/* Tasks Container */}
                  <div className="flex-1 space-y-3 overflow-y-auto max-h-[500px] scrollbar-none">
                    {colTasks.map(task => {
                      const primaryAssignee = task.assignees?.[0] || { name: 'Unassigned', avatar: '' };
                      return (
                        <div
                          key={task.id}
                          onClick={() => setActiveTaskDetail(task)}
                          className="p-4 bg-white border border-gray-100 rounded-xl shadow-sm hover:shadow-md hover:border-gray-200 transition-all cursor-pointer space-y-3.5 group relative"
                          id={`kanban-task-${task.id}`}
                        >
                          {/* Task Priority Tag */}
                          <div className="flex justify-between items-center">
                            <span className={`px-1.5 py-0.5 text-[8px] font-bold font-mono uppercase rounded ${
                              task.priority === 'High' ? 'bg-rose-50 text-rose-600 border border-rose-100' :
                              task.priority === 'Medium' ? 'bg-amber-50 text-amber-600 border border-amber-100' :
                              'bg-sky-50 text-sky-600 border border-sky-100'
                            }`}>
                              {task.priority} Priority
                            </span>
                          </div>

                          <div>
                            <h5 className="text-xs font-bold text-gray-900 group-hover:text-indigo-600 transition-colors leading-normal">
                              {task.title}
                            </h5>
                            <p className="text-[10px] text-gray-400 mt-1 line-clamp-2 leading-relaxed">{task.description}</p>
                          </div>

                          {/* Card footer: Assigned Avatar + Comments metric + Quick movers */}
                          <div className="border-t border-gray-50 pt-2.5 flex items-center justify-between">
                            <div className="flex items-center gap-1.5">
                              {primaryAssignee.avatar ? (
                                <img
                                  src={primaryAssignee.avatar}
                                  alt={primaryAssignee.name}
                                  className="w-5 h-5 rounded-full object-cover"
                                  referrerPolicy="no-referrer"
                                />
                              ) : (
                                <div className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center text-[8px] font-bold text-slate-500">
                                  UA
                                </div>
                              )}
                              <span className="text-[9px] text-gray-400 truncate max-w-[80px] font-medium">{primaryAssignee.name}</span>
                            </div>

                            {/* Quick stage transition triggers */}
                            <div className="flex gap-1" onClick={(e) => e.stopPropagation()}>
                              {col.id !== 'Todo' && (
                                <button
                                  onClick={() => {
                                    const prevMap: any = { 'In Progress': 'Todo', 'In Review': 'In Progress', 'Done': 'In Review' };
                                    onUpdateTaskStatus(activeProj.id, task.id, prevMap[col.id]);
                                  }}
                                  className="p-1 bg-gray-50 text-gray-400 hover:text-gray-600 rounded hover:bg-gray-100 transition-colors"
                                  title="Move state backward"
                                >
                                  <ArrowLeft size={10} />
                                </button>
                              )}
                              
                              {col.id !== 'Done' && (
                                <button
                                  onClick={() => {
                                    const nextMap: any = { 'Todo': 'In Progress', 'In Progress': 'In Review', 'In Review': 'Done' };
                                    onUpdateTaskStatus(activeProj.id, task.id, nextMap[col.id]);
                                  }}
                                  className="p-1 bg-indigo-50 text-indigo-500 hover:text-indigo-600 rounded hover:bg-indigo-100 transition-colors"
                                  title="Move state forward"
                                >
                                  <ArrowRight size={10} />
                                </button>
                              )}
                            </div>
                          </div>

                        </div>
                      );
                    })}
                  </div>

                </div>
              );
            })}
          </div>

        </div>
      )}

      {/* Task Details & Comments dialog Overlay */}
      {activeTaskDetail && activeProj && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/40 backdrop-blur-sm flex justify-end">
          <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between transform transition-transform duration-300 animate-slide-left">
            
            {/* Header details */}
            <div className="p-5 border-b border-gray-100 flex items-center justify-between bg-slate-50">
              <div>
                <span className="text-[9px] font-bold text-gray-400 font-mono uppercase block">Task Inspector</span>
                <h4 className="text-sm font-bold text-gray-900 mt-1 leading-normal">{activeTaskDetail.title}</h4>
              </div>
              <button
                onClick={() => setActiveTaskDetail(null)}
                className="p-1.5 hover:bg-gray-100 text-gray-400 hover:text-gray-600 rounded-lg"
              >
                <X size={18} />
              </button>
            </div>

            {/* Content body description */}
            <div className="flex-1 overflow-y-auto p-5 space-y-5 text-xs text-gray-600">
              <div className="space-y-1">
                <span className="text-[9px] font-bold text-gray-400 uppercase font-mono block">Description</span>
                <p className="bg-slate-50 p-3.5 border border-slate-100 text-slate-700 rounded-xl leading-relaxed">
                  {activeTaskDetail.description}
                </p>
              </div>

              {/* Task metadata properties details */}
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-slate-50/50 border border-slate-100 rounded-xl space-y-1">
                  <span className="text-[9px] font-bold text-gray-400 uppercase font-mono block">Assignee node</span>
                  <div className="flex items-center gap-2 mt-1">
                    {activeTaskDetail.assignees?.[0]?.avatar ? (
                      <img
                        src={activeTaskDetail.assignees?.[0]?.avatar}
                        alt={activeTaskDetail.assignees?.[0]?.name}
                        className="w-5 h-5 rounded-full object-cover"
                        referrerPolicy="no-referrer"
                      />
                    ) : (
                      <div className="w-5 h-5 rounded-full bg-slate-200 flex items-center justify-center text-[8px] font-bold text-slate-700">
                        UA
                      </div>
                    )}
                    <span className="font-semibold text-slate-800">{activeTaskDetail.assignees?.[0]?.name || 'Unassigned'}</span>
                  </div>
                </div>

                <div className="p-3 bg-slate-50/50 border border-slate-100 rounded-xl space-y-1">
                  <span className="text-[9px] font-bold text-gray-400 uppercase font-mono block">Task Priority</span>
                  <span className="font-semibold text-slate-800 block mt-1">{activeTaskDetail.priority} priority</span>
                </div>
              </div>

              {/* Comments logging section */}
              <div className="space-y-3 pt-3 border-t border-gray-100">
                <h4 className="text-xs font-bold text-gray-800 uppercase font-mono flex items-center gap-1.5">
                  <MessageSquare size={13} className="text-indigo-500" />
                  <span>Discussion Logs</span>
                </h4>
                
                <div className="space-y-2.5 max-h-[220px] overflow-y-auto">
                  {activeTaskDetail.comments && activeTaskDetail.comments.length > 0 ? activeTaskDetail.comments.map(c => (
                    <div key={c.id} className="p-3 bg-slate-50 border border-slate-100 rounded-xl text-xs space-y-1">
                      <div className="flex justify-between font-bold text-slate-800">
                        <span>{c.userName}</span>
                        <span className="text-[9px] text-gray-400 font-mono font-normal">{c.createdAt}</span>
                      </div>
                      <p className="text-gray-600 leading-normal">{c.text}</p>
                    </div>
                  )) : (
                    <p className="text-xs text-gray-400 italic text-center py-6">No discussion items logged yet.</p>
                  )}
                </div>

                {/* Add comment Form */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Type comments to discussion thread..."
                    id="task-comment-input"
                    className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:ring-1 focus:ring-indigo-500"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleTaskComment(activeTaskDetail.id, e.currentTarget.value);
                        e.currentTarget.value = '';
                      }
                    }}
                  />
                  <button
                    onClick={() => {
                      const input = document.getElementById('task-comment-input') as HTMLInputElement;
                      if (input) {
                        handleTaskComment(activeTaskDetail.id, input.value);
                        input.value = '';
                      }
                    }}
                    className="bg-slate-900 text-white hover:bg-slate-800 font-semibold px-4.5 py-2 rounded-xl text-xs transition-colors"
                  >
                    Send
                  </button>
                </div>
              </div>

            </div>

            {/* Footer triggers */}
            <div className="p-4 bg-slate-50 border-t border-gray-100 flex gap-2">
              <button
                onClick={() => setActiveTaskDetail(null)}
                className="w-full bg-slate-800 hover:bg-slate-700 text-white text-xs font-bold py-2.5 px-4 rounded-xl transition-all"
              >
                Close Inspector
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Create New Task Modal Dialog */}
      {showAddTaskModal && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-gray-200 rounded-2xl max-w-md w-full p-6 shadow-2xl animate-fade-in">
            <div className="flex items-center justify-between mb-4 border-b border-gray-100 pb-3">
              <h3 className="text-base font-bold text-gray-900">Create New Kanban Task</h3>
              <button
                onClick={() => setShowAddTaskModal(false)}
                className="p-1 hover:bg-gray-100 text-gray-400 hover:text-gray-600 rounded-lg"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleTaskSubmit} className="space-y-4 text-xs">
              <div className="space-y-1">
                <label className="text-[9px] font-bold text-gray-500 uppercase font-mono">Task Name Title</label>
                <input
                  type="text"
                  required
                  value={taskForm.title}
                  onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-2.5 py-1.5 focus:outline-none"
                  placeholder="Draft system design proposal docs"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-bold text-gray-500 uppercase font-mono">Detailed Instructions</label>
                <textarea
                  required
                  rows={3}
                  value={taskForm.description}
                  onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg p-2.5 focus:outline-none"
                  placeholder="Outline files models, APIs and client routes structure..."
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-gray-500 uppercase font-mono">Assigned To</label>
                  <select
                    value={taskForm.assignedToId}
                    onChange={(e) => setTaskForm({ ...taskForm, assignedToId: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-2.5 py-1.5 font-semibold text-gray-700 cursor-pointer focus:outline-none"
                  >
                    {employees.map(emp => (
                      <option key={emp.id} value={emp.id}>{emp.name}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-bold text-gray-500 uppercase font-mono">Priority</label>
                  <select
                    value={taskForm.priority}
                    onChange={(e) => setTaskForm({ ...taskForm, priority: e.target.value as any })}
                    className="w-full border border-gray-200 rounded-lg px-2.5 py-1.5 font-semibold text-gray-700 cursor-pointer focus:outline-none"
                  >
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                    <option value="Low">Low</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end gap-2.5 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setShowAddTaskModal(false)}
                  className="px-4.5 py-2 rounded-xl text-xs font-semibold hover:bg-gray-100 text-gray-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4.5 py-2 rounded-xl text-xs font-semibold bg-sky-500 hover:bg-sky-600 text-slate-950 transition-colors shadow-sm"
                >
                  Create Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}
