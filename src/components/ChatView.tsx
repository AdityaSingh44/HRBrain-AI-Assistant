/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import {
  MessageSquare,
  Hash,
  Send,
  Search,
  CheckCheck,
  Zap
} from 'lucide-react';
import { Employee, ChatMessage } from '../types';

interface ChatViewProps {
  employees: Employee[];
  messages: ChatMessage[];
  onSendMessage: (channelOrUserId: string, isChannel: boolean, text: string) => void;
  currentUserEmpId: string;
}

export default function ChatView({
  employees,
  messages,
  onSendMessage,
  currentUserEmpId
}: ChatViewProps) {
  // Chat context routing: Channel or Direct User
  const [activeChatId, setActiveChatId] = useState('#general');
  const [isChannel, setIsChannel] = useState(true);
  const [chatSearch, setChatSearch] = useState('');

  // Form input text
  const [inputText, setInputText] = useState('');

  // Scroll ref for chat feed
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Channels lists
  const CHANNELS = [
    { id: '#general', label: 'general-channel', desc: 'Acme broad notifications', count: 0 },
    { id: '#engineering', label: 'engineering-node', desc: 'Technical OKRs and updates', count: 0 },
    { id: '#hr-announcements', label: 'hr-bulletins', desc: 'Corporate guidelines & policy news', count: 2 },
    { id: '#payroll-queries', label: 'payroll-help', desc: 'Inquiries regarding allowances & TDS', count: 0 }
  ];

  // Filtering users list
  const filteredUsers = employees
    .filter(emp => emp.employeeId !== currentUserEmpId) // exclude self
    .filter(emp => emp.name.toLowerCase().includes(chatSearch.toLowerCase()));

  // Filter messages for currently selected chat channel or user
  const chatFeed = messages.filter(m => {
    if (isChannel) {
      // Map channel to groupId
      const targetGroup = activeChatId === '#engineering' ? 'Engineering' : activeChatId;
      return m.groupId === targetGroup || m.groupId === activeChatId;
    } else {
      // Direct Message: belongs to either (me -> target) or (target -> me)
      return (
        (m.senderId === currentUserEmpId && m.receiverId === activeChatId) ||
        (m.senderId === activeChatId && m.receiverId === currentUserEmpId)
      );
    }
  });

  // Auto scroll to bottom when feed changes
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatFeed.length]);

  const handleSendSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    onSendMessage(activeChatId, isChannel, inputText);
    setInputText('');
  };

  // Resolve active partner name
  const activeChatPartnerName = isChannel
    ? CHANNELS.find(c => c.id === activeChatId)?.id || activeChatId
    : employees.find(e => e.employeeId === activeChatId)?.name || 'Direct Chat';

  return (
    <div className="flex h-[calc(100vh-140px)] border border-gray-100 bg-white rounded-2xl shadow-sm overflow-hidden" id="corporate-chat-panel">
      
      {/* Sidebar: Channel & DM browsing list */}
      <div className="w-64 border-r border-gray-100 flex flex-col justify-between shrink-0 bg-slate-50/50">
        <div className="p-4 space-y-4">
          
          {/* Sourcing search */}
          <div className="relative">
            <Search size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search workspaces..."
              value={chatSearch}
              onChange={(e) => setChatSearch(e.target.value)}
              className="w-full text-xs pl-8 pr-3 py-1.5 bg-white border border-gray-200 rounded-xl focus:outline-none"
              id="chat-user-search"
            />
          </div>

          {/* Group Channels Section */}
          <div className="space-y-1.5">
            <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider font-mono px-1 block">Group Channels</span>
            
            <div className="space-y-0.5">
              {CHANNELS.map(ch => (
                <button
                  key={ch.id}
                  onClick={() => {
                    setActiveChatId(ch.id);
                    setIsChannel(true);
                  }}
                  className={`w-full text-left text-xs font-semibold px-2.5 py-2 rounded-lg flex items-center justify-between transition-colors ${
                    isChannel && activeChatId === ch.id
                      ? 'bg-slate-900 text-white shadow-sm'
                      : 'text-gray-600 hover:bg-slate-100'
                  }`}
                  id={`chat-channel-btn-${ch.id.replace('#', '')}`}
                >
                  <div className="flex items-center gap-1.5 truncate">
                    <Hash size={13} className={isChannel && activeChatId === ch.id ? 'text-white' : 'text-slate-400'} />
                    <span className="truncate">{ch.label}</span>
                  </div>

                  {ch.count > 0 && !(isChannel && activeChatId === ch.id) && (
                    <span className="px-1 py-0.5 text-[8px] bg-rose-500 text-white rounded-full font-bold">
                      {ch.count}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Direct Messages Section */}
          <div className="space-y-1.5 pt-2">
            <span className="text-[9px] font-bold text-gray-400 uppercase tracking-wider font-mono px-1 block">Staff Direct Messages</span>
            
            <div className="space-y-0.5 max-h-[220px] overflow-y-auto scrollbar-thin">
              {filteredUsers.map(emp => (
                <button
                  key={emp.employeeId}
                  onClick={() => {
                    setActiveChatId(emp.employeeId);
                    setIsChannel(false);
                  }}
                  className={`w-full text-left text-xs font-semibold px-2.5 py-1.5 rounded-lg flex items-center justify-between transition-colors ${
                    !isChannel && activeChatId === emp.employeeId
                      ? 'bg-slate-900 text-white shadow-sm'
                      : 'text-gray-600 hover:bg-slate-100'
                  }`}
                  id={`chat-dm-btn-${emp.employeeId}`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <img
                      src={emp.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=64'}
                      alt={emp.name}
                      className="w-5 h-5 rounded-md object-cover"
                      referrerPolicy="no-referrer"
                    />
                    <span className="truncate">{emp.name}</span>
                  </div>

                  {/* Online status indicator dot */}
                  <span className={`w-1.5 h-1.5 rounded-full block shrink-0 ${
                    emp.status === 'Active' ? 'bg-emerald-500' : 'bg-gray-300'
                  }`} />
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Brand Bottom notice */}
        <div className="p-3 bg-slate-100/50 border-t border-gray-100 text-[10px] text-gray-400 text-center font-mono flex items-center justify-center gap-1">
          <Zap size={11} className="text-indigo-500" />
          <span>Real-time Secure LAN Nodes</span>
        </div>
      </div>

      {/* Primary chat window */}
      <div className="flex-1 flex flex-col justify-between h-full bg-slate-50/20">
        
        {/* Chat partner header banner */}
        <div className="p-4 border-b border-gray-100 bg-white flex justify-between items-center shrink-0">
          <div className="flex items-center gap-2">
            <span className="font-bold text-xs text-slate-800 uppercase font-mono tracking-wide">
              Selected Session:
            </span>
            <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-md border border-indigo-100">
              {activeChatPartnerName}
            </span>
          </div>

          <span className="text-[10px] text-gray-400 font-mono">
            LAN Client Key: SECURE_MD5_AES
          </span>
        </div>

        {/* Messages feed area */}
        <div className="flex-1 p-4.5 overflow-y-auto space-y-4 max-h-[calc(100vh-270px)]">
          {chatFeed.length > 0 ? chatFeed.map(msg => {
            const isMe = msg.senderId === currentUserEmpId;
            return (
              <div
                key={msg.id}
                className={`flex gap-2.5 max-w-[80%] ${isMe ? 'ml-auto flex-row-reverse' : 'mr-auto'}`}
              >
                {/* Avatar */}
                <img
                  src={msg.senderAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=64'}
                  alt={msg.senderName}
                  className="w-8 h-8 rounded-xl object-cover shrink-0 ring-1 ring-gray-100"
                  referrerPolicy="no-referrer"
                />

                {/* Message speech bubble wrapper */}
                <div className="space-y-1">
                  <div className={`text-[10px] text-gray-400 flex items-center gap-1 font-mono ${isMe ? 'justify-end' : ''}`}>
                    <span className="font-bold text-gray-600 font-sans">{msg.senderName}</span>
                    <span>• {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>

                  <div className={`p-3 text-xs rounded-2xl shadow-sm leading-relaxed ${
                    isMe
                      ? 'bg-slate-900 text-white rounded-tr-none'
                      : 'bg-white text-gray-700 border border-gray-100 rounded-tl-none'
                  }`}>
                    {msg.text}
                  </div>

                  {/* Delivery ticks */}
                  {isMe && (
                    <div className="flex justify-end text-sky-500">
                      <CheckCheck size={13} className="text-emerald-500" />
                    </div>
                  )}
                </div>
              </div>
            );
          }) : (
            <div className="h-full flex flex-col items-center justify-center text-center text-gray-400 py-24 space-y-2">
              <MessageSquare size={32} className="text-slate-300 stroke-1" />
              <div>
                <h4 className="text-xs font-bold text-gray-800">Establish dialogue loop</h4>
                <p className="text-[10px] text-gray-400 max-w-[200px] mt-0.5 mx-auto">This session is safe. Type a message down below to start communicating.</p>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Message Input box */}
        <form onSubmit={handleSendSubmit} className="p-4 bg-white border-t border-gray-100 flex gap-2 shrink-0">
          <input
            type="text"
            placeholder={`Type a message to ${activeChatPartnerName}...`}
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            className="flex-1 border border-gray-200 rounded-xl px-4 py-3 text-xs focus:outline-none focus:ring-1 focus:ring-sky-500"
            id="chat-text-input"
          />
          <button
            type="submit"
            className="bg-slate-900 hover:bg-slate-800 text-white p-3 rounded-xl transition-all shadow-md shadow-slate-950/5 flex items-center justify-center shrink-0"
            id="chat-send-btn"
          >
            <Send size={15} />
          </button>
        </form>

      </div>

    </div>
  );
}
