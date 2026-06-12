import React, { useState, useRef, useEffect } from 'react';
import { FileText, Stethoscope, AlertTriangle, Calendar, Send, User, Bot, Loader2, CheckCircle } from 'lucide-react';
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

const CONCISE_SUMMARY = "Your overall blood test results look mostly normal, but there is one area that needs attention. Your Hemoglobin levels are lower than they should be, which might explain if you've been feeling unusually tired or weak lately. Everything else, including your kidney and liver functions, appears healthy. We recommend discussing this low hemoglobin with a doctor to see if you need an iron supplement or further testing.";

const DETAILED_SUMMARY = "Analysis of the Complete Blood Count (CBC) reveals a clinically significant decrease in Hemoglobin (HGB) at 9.2 g/dL (reference range: 12.0 - 15.5 g/dL for adult females). This presentation is indicative of anemia. \n\nAnalogy: Think of Hemoglobin as the delivery trucks carrying oxygen to your body's cells. Right now, you don't have enough trucks, which means your body isn't getting the oxygen it needs to create energy.\n\nOther key metrics (WBC, Platelets, CMP) remain unremarkable. The specific etiology of the anemia (e.g., iron deficiency, vitamin B12 deficiency) requires further diagnostic differentiation, likely beginning with an iron panel and ferritin level check.";

const FOLLOW_UP_QUESTIONS = [
  "What could be causing this drop in my hemoglobin?",
  "Do I need to start taking iron supplements or change my diet?",
  "Are there any other tests I need to find the exact cause?",
  "Is there anything I should look out for, like dizziness or extreme fatigue?"
];

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('concise');
  const [bookingState, setBookingState] = useState('idle'); // idle, loading, success
  const [chatMessages, setChatMessages] = useState([
    { role: 'assistant', content: 'Hello! I am MediAgent. Do you have any questions about your report or what "Hemoglobin" means?' }
  ]);
  const [chatInput, setChatInput] = useState('');
  const chatEndRef = useRef(null);

  const handleBookAppointment = () => {
    setBookingState('loading');
    setTimeout(() => {
      setBookingState('success');
    }, 1000);
  };

  const handleSendChat = (e) => {
    e.preventDefault();
    if (!chatInput.trim()) return;

    const userMessage = chatInput.trim();
    setChatMessages(prev => [...prev, { role: 'user', content: userMessage }]);
    setChatInput('');

    // Simulate bot response
    setTimeout(() => {
      let botResponse = "I understand you have questions. Based on your report, your main focus should be on the low Hemoglobin. It's nothing to panic about, but it's important to have a doctor review it so they can prescribe the right treatment, like an iron supplement if needed.";

      if (userMessage.toLowerCase().includes('hemoglobin')) {
         botResponse = "Hemoglobin is the protein in your red blood cells that carries oxygen. When it's low (like your 9.2 g/dL), it means your body isn't getting as much oxygen as it needs, which can make you feel very tired or weak. It's often easily treated!";
      }

      setChatMessages(prev => [...prev, { role: 'assistant', content: botResponse }]);
    }, 1000);
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [chatMessages]);

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6 animate-fade-in pb-32">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-slate-100">Your Health Dashboard</h1>
        <p className="text-slate-400 mt-2">Analysis complete. Here is a breakdown of your results.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Summaries & Questions */}
        <div className="lg:col-span-2 space-y-6">
          {/* Summary Panels (Agent 2 & 3) */}
          <section className="bg-navy-800 rounded-2xl border border-navy-700 overflow-hidden">
            <div className="flex border-b border-navy-700">
              <button
                className={cn(
                  "flex-1 py-4 px-6 text-sm font-medium transition-colors",
                  activeTab === 'concise' ? "bg-navy-700 text-teal-400 border-b-2 border-teal-400" : "text-slate-400 hover:text-slate-300 hover:bg-navy-800/80"
                )}
                onClick={() => setActiveTab('concise')}
              >
                Concise Summary (Layman)
              </button>
              <button
                className={cn(
                  "flex-1 py-4 px-6 text-sm font-medium transition-colors",
                  activeTab === 'detailed' ? "bg-navy-700 text-purple-400 border-b-2 border-purple-400" : "text-slate-400 hover:text-slate-300 hover:bg-navy-800/80"
                )}
                onClick={() => setActiveTab('detailed')}
              >
                Detailed Summary (Clinical)
              </button>
            </div>
            <div className="p-6">
              <div className="flex items-start gap-4">
                <div className={cn(
                  "p-3 rounded-full flex-shrink-0",
                  activeTab === 'concise' ? "bg-teal-500/20 text-teal-400" : "bg-purple-500/20 text-purple-400"
                )}>
                  {activeTab === 'concise' ? <User className="w-6 h-6" /> : <Stethoscope className="w-6 h-6" />}
                </div>
                <div>
                  <h3 className="text-lg font-medium text-slate-200 mb-3">
                    {activeTab === 'concise' ? "High-Level Takeaway" : "Clinical Breakdown"}
                  </h3>
                  <p className="text-slate-300 leading-relaxed whitespace-pre-line">
                    {activeTab === 'concise' ? CONCISE_SUMMARY : DETAILED_SUMMARY}
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* Doctor Preparation Layer */}
          <section className="bg-navy-800 rounded-2xl border border-navy-700 p-6">
            <h3 className="text-lg font-medium text-slate-200 mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-teal-400" />
              Your Doctor Consultation Toolkit
            </h3>
            <p className="text-sm text-slate-400 mb-4">
              Bring these AI-generated questions to your next appointment to ensure you cover all bases:
            </p>
            <ul className="space-y-3">
              {FOLLOW_UP_QUESTIONS.map((q, i) => (
                <li key={i} className="flex items-start gap-3 bg-navy-900/50 p-4 rounded-xl border border-navy-700/50">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-teal-500/20 text-teal-400 flex items-center justify-center text-sm font-medium">
                    {i + 1}
                  </span>
                  <span className="text-slate-300 text-sm mt-0.5">{q}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>

        {/* Right Column: Key Findings & Alerts (Agent 4) */}
        <div className="space-y-6">
          <section className="bg-navy-800 rounded-2xl border border-orange-500/30 overflow-hidden relative shadow-[0_0_20px_rgba(249,115,22,0.1)]">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-500 to-red-500" />
            <div className="p-6">
              <h3 className="text-lg font-medium text-slate-200 mb-4 flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-orange-400" />
                Key Findings & Alerts
              </h3>

              <div className="bg-orange-500/10 border border-orange-500/20 rounded-xl p-4 mb-6">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-slate-300 font-medium">Hemoglobin</span>
                  <span className="bg-red-500/20 text-red-400 text-xs font-bold px-2 py-1 rounded">CRITICALLY LOW</span>
                </div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-orange-400">9.2</span>
                  <span className="text-sm text-slate-400">g/dL</span>
                </div>
                <div className="text-xs text-slate-500 mt-1">Reference: 12.0 - 15.5 g/dL</div>
              </div>

              <div className="bg-navy-900 rounded-xl p-4 mb-6">
                <h4 className="text-sm font-medium text-slate-300 mb-2">Agent 4 Recommendation:</h4>
                <p className="text-sm text-slate-400">Consultation with a Specialist (Hematologist or Primary Care) is highly advised to investigate the cause of anemia.</p>
              </div>

              <button
                onClick={handleBookAppointment}
                disabled={bookingState !== 'idle'}
                className={cn(
                  "w-full py-3 px-4 rounded-xl font-medium flex items-center justify-center gap-2 transition-all duration-300",
                  bookingState === 'idle' ? "bg-teal-500 hover:bg-teal-400 text-navy-900" :
                  bookingState === 'loading' ? "bg-teal-500/50 text-navy-900 cursor-not-allowed" :
                  "bg-green-500 text-white"
                )}
              >
                {bookingState === 'idle' && (
                  <>
                    <Calendar className="w-5 h-5" />
                    Book Appointment with Specialist
                  </>
                )}
                {bookingState === 'loading' && (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Booking...
                  </>
                )}
                {bookingState === 'success' && (
                  <>
                    <CheckCircle className="w-5 h-5" />
                    Appointment Booked! Mon 10:00 AM
                  </>
                )}
              </button>
            </div>
          </section>
        </div>
      </div>

      {/* Interactive Chatbot Window (Fixed to bottom) */}
      <div className="fixed bottom-0 left-0 w-full bg-navy-800 border-t border-navy-700 shadow-[0_-10px_40px_rgba(0,0,0,0.3)] z-50">
        <div className="max-w-6xl mx-auto p-4 flex flex-col">
          <div className="h-48 overflow-y-auto mb-4 space-y-4 pr-2">
            {chatMessages.map((msg, i) => (
              <div key={i} className={cn("flex gap-3", msg.role === 'user' ? "flex-row-reverse" : "")}>
                <div className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0",
                  msg.role === 'user' ? "bg-purple-500/20 text-purple-400" : "bg-teal-500/20 text-teal-400"
                )}>
                  {msg.role === 'user' ? <User className="w-5 h-5" /> : <Bot className="w-5 h-5" />}
                </div>
                <div className={cn(
                  "p-3 rounded-2xl max-w-[80%] text-sm",
                  msg.role === 'user' ? "bg-purple-600 text-white rounded-tr-none" : "bg-navy-700 text-slate-200 rounded-tl-none"
                )}>
                  {msg.content}
                </div>
              </div>
            ))}
            <div ref={chatEndRef} />
          </div>
          <form onSubmit={handleSendChat} className="relative">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              placeholder="Ask MediAgent anything about your report..."
              className="w-full bg-navy-900 border border-navy-600 rounded-full py-3 pl-6 pr-14 text-sm text-slate-200 focus:outline-none focus:border-teal-500 focus:ring-1 focus:ring-teal-500 placeholder-slate-500"
            />
            <button
              type="submit"
              disabled={!chatInput.trim()}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-teal-500 hover:bg-teal-400 disabled:bg-navy-700 disabled:text-slate-500 text-navy-900 rounded-full flex items-center justify-center transition-colors"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
