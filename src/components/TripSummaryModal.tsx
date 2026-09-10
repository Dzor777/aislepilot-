'use client';

import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Trophy, CheckCircle2, Clock, Footprints, RotateCcw, Share2 } from 'lucide-react';
import { MappedGroceryItem, WalmartStoreProfile } from '@/lib/types';

interface TripSummaryModalProps {
  isOpen: boolean;
  onClose: () => void;
  items: MappedGroceryItem[];
  store: WalmartStoreProfile;
  onNewTrip: () => void;
}

export const TripSummaryModal: React.FC<TripSummaryModalProps> = ({
  isOpen,
  onClose,
  items,
  store,
  onNewTrip,
}) => {
  useEffect(() => {
    if (isOpen) {
      // Fire confetti cannons!
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch (e) {
        console.warn('Confetti error', e);
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const totalItems = items.length;
  // Estimate distance and time saved based on item count
  const distanceSavedMeters = Math.min(1200, Math.round(totalItems * 45));
  const minutesSaved = Math.min(30, Math.round(totalItems * 1.5));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-300">
      <div className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden shadow-2xl text-white text-center p-6 space-y-5">
        {/* Trophy Icon */}
        <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-300 flex items-center justify-center text-slate-950 shadow-xl shadow-amber-500/20 animate-bounce">
          <Trophy className="w-9 h-9 stroke-[2.5]" />
        </div>

        <div className="space-y-1">
          <h2 className="text-2xl font-black tracking-tight text-white">Trip Complete!</h2>
          <p className="text-xs text-slate-400">
            Zero backtracking at {store.name.replace('Walmart Supercenter', 'Walmart')}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 gap-2 p-3 bg-slate-950 rounded-2xl border border-slate-800">
          <div className="space-y-1">
            <div className="w-7 h-7 mx-auto rounded-lg bg-emerald-950 text-emerald-400 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div className="text-lg font-black text-white">{totalItems}</div>
            <div className="text-[10px] text-slate-400 font-medium">Items Got</div>
          </div>

          <div className="space-y-1">
            <div className="w-7 h-7 mx-auto rounded-lg bg-blue-950 text-blue-400 flex items-center justify-center">
              <Footprints className="w-4 h-4" />
            </div>
            <div className="text-lg font-black text-white">{distanceSavedMeters}m</div>
            <div className="text-[10px] text-slate-400 font-medium">Saved Walk</div>
          </div>

          <div className="space-y-1">
            <div className="w-7 h-7 mx-auto rounded-lg bg-purple-950 text-purple-400 flex items-center justify-center">
              <Clock className="w-4 h-4" />
            </div>
            <div className="text-lg font-black text-white">~{minutesSaved}m</div>
            <div className="text-[10px] text-slate-400 font-medium">Saved Time</div>
          </div>
        </div>

        <div className="p-3 rounded-xl bg-slate-950/60 border border-slate-800/80 text-xs text-slate-300 text-left space-y-1">
          <div className="font-semibold text-emerald-400 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Freshness & Food Safety Protected
          </div>
          <p className="text-[11px] text-slate-400">
            Cold dairy & frozen foods were grabbed at the very end of your trip right before checkout!
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2 pt-1">
          <button
            onClick={onNewTrip}
            className="w-full py-3.5 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-extrabold text-sm rounded-xl shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Start New Shopping Trip</span>
          </button>

          <button
            onClick={onClose}
            className="w-full py-2.5 text-xs text-slate-400 hover:text-slate-200 font-semibold"
          >
            Close & View List
          </button>
        </div>
      </div>
    </div>
  );
};
