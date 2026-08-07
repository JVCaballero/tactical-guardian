import React, { useState } from 'react';
import { Send, Sparkles, Shield, User, Loader2, Radio } from 'lucide-react';
import { TeamMember } from '../types';

interface Message {
  id: string;
  sender: string;
  role: string;
  text: string;
  time: string;
  isAi?: boolean;
}

interface TeamCommsProps {
  teamMembers: TeamMember[];
  isOffline: boolean;
}

export default function TeamComms({ teamMembers, isOffline }: TeamCommsProps) {
  const [messages, setMessages] = useState<Message[]>([
    { id: 'com-1', sender: 'Capt. Reyes, J.', role: 'Lead Paramedic', text: 'Arrived at Brgy. Guadalupe. Commencing initial cargo count.', time: '14:22' },
    { id: 'com-2', sender: 'Sgt. Santos, M.', role: 'Rescue Specialist', text: 'Checking flood height near river basin. Water levels rising slowly.', time: '14:26' },
    { id: 'com-3', sender: 'Lt. Cruz, L.', role: 'Communications Base', text: 'VHF connection verified. Deploy tracking and report landslide thresholds.', time: '14:28' },
  ]);

  const [inputMsg, setInputMsg] = useState('');
  const [isQueryingAi, setIsQueryingAi] = useState(false);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMsg.trim()) return;

    const newMsg: Message = {
      id: `com-user-${Date.now()}`,
      sender: 'PH-772 (You)',
      role: 'Sector Commander',
      text: inputMsg,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, newMsg]);
    setInputMsg('');
  };

  const handleAskHQAI = async () => {
    if (!inputMsg.trim()) return;

    // Log the user message first
    const userMsgText = inputMsg;
    const userMsg: Message = {
      id: `com-user-${Date.now()}`,
      sender: 'PH-772 (You)',
      role: 'Sector Commander',
      text: userMsgText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputMsg('');
    setIsQueryingAi(true);

    try {
      const response = await fetch('/api/advisor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: userMsgText,
          context: 'Active weather warning overlay, landslide risk PH'
        })
      });

      const data = await response.json();
      
      const aiResponse: Message = {
        id: `com-ai-${Date.now()}`,
        sender: 'Operations AI Advisor',
        role: data.engine || 'Gemini 3.5 AI',
        text: data.advice || 'Command path clear. Maintain coordinates.',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isAi: true,
      };

      setMessages((prev) => [...prev, aiResponse]);
    } catch (err) {
      console.error('Failed to query HQ Advisor AI:', err);
      
      // Local fallback
      const errorResponse: Message = {
        id: `com-ai-err-${Date.now()}`,
        sender: 'Intel Advisor (Cached fallback)',
        role: 'Offline Controller',
        text: '• Acknowledge communication delay.\n• Immediate action: Elevate units immediately to avoid water channels.\n• Maintain pre-allocated supply logs.',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isAi: true,
      };
      setMessages((prev) => [...prev, errorResponse]);
    } finally {
      setIsQueryingAi(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-full min-h-[calc(100vh-180px)]">
      {/* Active Chat console */}
      <section className="flex-1 flex flex-col bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs">
        {/* Comms Network Header */}
        <header className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Radio className="w-5 h-5 text-red-600 animate-pulse" />
            <span className="font-black text-xs tracking-widest uppercase text-slate-800 dark:text-slate-200">
              SECURE CH-9 SATELLITE LOOP
            </span>
          </div>
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">
            DURX SATELLITE LINKED
          </span>
        </header>

        {/* Message logs */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 max-h-[380px] min-h-[280px]">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col max-w-[85%] ${
                msg.sender.includes('You')
                  ? 'ml-auto items-end'
                  : 'items-start'
              }`}
            >
              {/* Message Header details */}
              <div className="flex items-center gap-1.5 mb-1">
                {msg.isAi && <Sparkles className="w-3.5 h-3.5 text-blue-500 animate-pulse" />}
                <span className={`text-[10px] font-black uppercase ${msg.isAi ? 'text-blue-600' : 'text-slate-500'}`}>
                  {msg.sender}
                </span>
                <span className="text-[9px] font-mono text-slate-400">({msg.role})</span>
              </div>

              {/* Bubble Body styled */}
              <div
                className={`p-4 rounded-2xl text-xs font-semibold leading-relaxed shadow-xs ${
                  msg.sender.includes('You')
                    ? 'bg-blue-600 text-white rounded-tr-none'
                    : msg.isAi
                    ? 'bg-blue-50 dark:bg-blue-950/20 text-blue-900 dark:text-blue-300 rounded-tl-none border border-blue-100 dark:border-blue-900/50'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-tl-none'
                }`}
              >
                {/* Format bullet-point blocks nicely */}
                {msg.text.split('\n').map((line, i) => (
                  <p key={i} className={i > 0 ? 'mt-1' : ''}>
                    {line}
                  </p>
                ))}
              </div>

              <span className="text-[9px] font-mono text-slate-400 mt-1">{msg.time}</span>
            </div>
          ))}

          {isQueryingAi && (
            <div className="flex items-center gap-2 text-xs font-bold text-blue-600 dark:text-blue-400 animate-pulse bg-blue-50/50 dark:bg-blue-950/10 p-3 rounded-lg max-w-[180px]">
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>AI COGNITIVE SEARCH...</span>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <form onSubmit={handleSend} className="p-4 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex gap-2">
          <input
            type="text"
            value={inputMsg}
            onChange={(e) => setInputMsg(e.target.value)}
            placeholder="Type tactical report or draft advice query, then click ASK HQ AI..."
            className="flex-grow bg-white dark:bg-slate-950 text-slate-950 dark:text-slate-100 border-none rounded-xl px-4 py-3 text-xs font-semibold focus:ring-2 focus:ring-blue-600 placeholder:text-slate-400"
          />

          <div className="flex gap-1">
            <button
              type="button"
              id="ask-hq-ai-btn"
              onClick={handleAskHQAI}
              disabled={isOffline || !inputMsg.trim() || isQueryingAi}
              className="px-4 py-3 bg-blue-500 hover:bg-blue-600 disabled:bg-slate-200 dark:disabled:bg-slate-800 text-white text-[10px] font-black uppercase tracking-wider rounded-xl transition-all shadow-sm flex items-center gap-1.5"
              title="Query Gemini HQ Operations advisor based on inputs"
            >
              <Sparkles className="w-3.5 h-3.5 text-yellow-300" />
              <span>ASK HQ AI</span>
            </button>

            <button
              type="submit"
              id="send-chat-message-btn"
              disabled={!inputMsg.trim() || isQueryingAi}
              className="p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all shadow-sm active:scale-95"
            >
              <Send className="w-4 h-4" />
            </button>
          </div>
        </form>
      </section>

      {/* Personnel Roster */}
      <section className="w-full lg:w-80 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs flex flex-col">
        <h3 className="text-xs font-black tracking-widest text-slate-500 mb-4 uppercase">
          RESPONDER ROSTER IN FIELD
        </h3>

        <div className="space-y-4 flex-1">
          {teamMembers.map((member) => (
            <div key={member.id} className="flex items-center gap-3">
              <img
                src={member.avatar}
                alt={member.name}
                className="w-11 h-11 object-cover rounded-lg border border-slate-200 dark:border-slate-700 font-bold text-xs"
              />
              <div className="flex-grow min-w-0">
                <h4 className="text-xs font-black text-slate-800 dark:text-slate-100 truncate">{member.name}</h4>
                <p className="text-[10px] font-bold text-slate-400">{member.role}</p>
                
                <span
                  className={`inline-block mt-1 px-1.5 py-0.5 rounded text-[8px] font-black ${
                    member.status === 'IN FIELD'
                      ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/20 dark:text-blue-400'
                      : 'bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400'
                  }`}
                >
                  {member.status}
                </span>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-blue-50/50 dark:bg-blue-950/10 p-3.5 rounded-xl text-[10px] leading-relaxed text-slate-500 font-semibold border border-blue-50 dark:border-blue-900/20 mt-6">
          🛡️ Node security level: <strong>Level 4 Classified</strong>. Voice channels encrypted symmetrically.
        </div>
      </section>
    </div>
  );
}
