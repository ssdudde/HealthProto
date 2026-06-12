import React, { useState, useEffect } from 'react';
import { FileText, Zap, Search, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { clsx, } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

const steps = [
  {
    id: 1,
    title: "[Vision AI/Agent 1]",
    description: "Tesseract OCR extracting structured clinical markers...",
    icon: FileText,
    duration: 1000,
  },
  {
    id: 2,
    title: "[LangChain Parallel Chain]",
    description: "Spawning Agent 2 (Layman Engine) & Agent 3 (Deep Translation)...",
    icon: Zap,
    duration: 1500,
  },
  {
    id: 3,
    title: "[Agent 4 - Clinical Evaluator]",
    description: "Screening for critical biomarkers and calculating system urgency...",
    icon: ShieldAlert,
    duration: 1000,
  }
];

export default function PipelineVisualizer({ onComplete }) {
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    let timeout;
    if (currentStep < steps.length) {
      timeout = setTimeout(() => {
        setCurrentStep(prev => prev + 1);
      }, steps[currentStep].duration);
    } else {
      timeout = setTimeout(() => {
        onComplete();
      }, 500); // Short delay before transitioning to dashboard
    }

    return () => clearTimeout(timeout);
  }, [currentStep, onComplete]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] max-w-2xl mx-auto p-8 animate-fade-in">
      <div className="w-full space-y-6">
        <div className="text-center mb-12">
          <h2 className="text-2xl font-semibold text-teal-400 mb-2">Multi-Agent Processing</h2>
          <p className="text-slate-400">Our specialized AI agents are analyzing your report.</p>
        </div>

        {steps.map((step, index) => {
          const isActive = index === currentStep;
          const isPast = index < currentStep;
          const Icon = step.icon;

          return (
            <div
              key={step.id}
              className={cn(
                "relative flex items-start p-6 rounded-xl border transition-all duration-500",
                isActive ? "bg-navy-800 border-teal-500 shadow-[0_0_15px_rgba(45,212,191,0.2)] transform scale-[1.02]" :
                isPast ? "bg-navy-800/50 border-navy-700 opacity-70" :
                "bg-navy-900 border-navy-800 opacity-40"
              )}
            >
              <div className="flex-shrink-0 mr-4">
                <div className={cn(
                  "p-3 rounded-full",
                  isActive ? "bg-teal-500/20 text-teal-400 animate-pulse-fast" :
                  isPast ? "bg-purple-500/20 text-purple-400" :
                  "bg-navy-800 text-slate-500"
                )}>
                  {isPast ? <CheckCircle2 className="w-6 h-6" /> : <Icon className="w-6 h-6" />}
                </div>
              </div>

              <div className="flex-1 pt-1">
                <h3 className={cn(
                  "text-lg font-medium mb-1 transition-colors duration-300",
                  isActive ? "text-teal-400" : isPast ? "text-slate-200" : "text-slate-500"
                )}>
                  {step.title}
                </h3>
                <p className={cn(
                  "text-sm whitespace-pre-line transition-colors duration-300",
                  isActive ? "text-slate-300" : isPast ? "text-slate-400" : "text-slate-600"
                )}>
                  {step.description}
                </p>
              </div>

              {isActive && (
                <div className="absolute top-1/2 -translate-y-1/2 right-6">
                  <div className="flex space-x-1">
                    <div className="w-2 h-2 rounded-full bg-teal-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 rounded-full bg-teal-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 rounded-full bg-teal-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
