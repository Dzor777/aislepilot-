'use client';

import React from 'react';
import { Compass, MapPin, ChevronDown, CheckCircle2 } from 'lucide-react';
import { WalmartStoreProfile } from '@/lib/types';

interface HeaderProps {
  currentStore: WalmartStoreProfile;
  onOpenStoreModal: () => void;
  currentStep: 'input' | 'review' | 'route';
  onNavigateStep?: (step: 'input' | 'review' | 'route') => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentStore,
  onOpenStoreModal,
  currentStep,
  onNavigateStep,
}) => {
  const steps = [
    { id: 'input', label: '1. Scan / Input' },
    { id: 'review', label: '2. Review Items' },
    { id: 'route', label: '3. Store Route' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 text-white shadow-lg">
      <div className="max-w-md mx-auto px-4 py-3">
        {/* Top Branding & Store Selector */}
        <div className="flex items-center justify-between gap-2 mb-2.5">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center shadow-md shadow-blue-500/20">
              <Compass className="w-5 h-5 text-white animate-pulse" />
            </div>
            <div>
              <h1 className="font-extrabold text-lg tracking-tight leading-none bg-gradient-to-r from-blue-400 via-indigo-200 to-white bg-clip-text text-transparent">
                AislePilot
              </h1>
              <p className="text-[10px] font-medium text-slate-400 leading-tight">
                Walmart Route Optimizer
              </p>
            </div>
          </div>

          {/* Preferred Store Selector Button */}
          <button
            onClick={onOpenStoreModal}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-800/90 hover:bg-slate-700 border border-slate-700/80 transition-all text-xs text-slate-200 shadow-inner group"
          >
            <MapPin className="w-3.5 h-3.5 text-blue-400 group-hover:scale-110 transition-transform" />
            <span className="font-medium max-w-[130px] truncate">
              {currentStore.name.replace('Walmart Supercenter', 'Walmart')}
            </span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </button>
        </div>

        {/* Step Navigation Indicator */}
        <div className="grid grid-cols-3 gap-1.5 p-1 rounded-xl bg-slate-950/60 border border-slate-800/80">
          {steps.map((step) => {
            const isActive = currentStep === step.id;
            const isClickable = onNavigateStep && (step.id !== 'route' || currentStep === 'route');

            return (
              <button
                key={step.id}
                disabled={!isClickable}
                onClick={() => onNavigateStep && onNavigateStep(step.id as any)}
                className={`py-1.5 px-1 rounded-lg text-[11px] font-semibold transition-all flex items-center justify-center gap-1 ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                    : isClickable
                    ? 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                    : 'text-slate-600 cursor-not-allowed'
                }`}
              >
                {step.label}
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
