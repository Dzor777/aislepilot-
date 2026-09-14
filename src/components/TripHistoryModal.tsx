'use client';

import React, { useState } from 'react';
import { CompletedTripRecord } from '@/lib/types';
import { CacheManager } from '@/lib/cacheManager';
import { History, X, Footprints, Clock, CheckCircle2, TrendingUp, Calendar, MapPin } from 'lucide-react';

interface TripHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const TripHistoryModal: React.FC<TripHistoryModalProps> = ({ isOpen, onClose }) => {
  const [history] = useState<CompletedTripRecord[]>(CacheManager.getCompletedTripHistory());

  if (!isOpen) return null;

  // Efficiency Dashboard Aggregates
  const totalTrips = history.length;
  const totalItemsCompleted = history.reduce((sum, t) => sum + t.completedItemCount, 0);
  const totalFeetSaved = history.reduce((sum, t) => sum + (t.savedFeet || t.itemCount * 120), 0);
  const totalMinutesSaved = Math.round(totalFeetSaved / 150); // ~150 feet per min saved

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md p-6 shadow-2xl space-y-6 relative overflow-hidden max-h-[85vh] flex flex-col">
        {/* Top Header */}
        <div className="flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <History className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-white">Trip History & Analytics</h2>
              <p className="text-xs text-slate-400">Store efficiency & past grocery runs</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl bg-slate-800/60 hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Store Efficiency Dashboard Cards */}
        <div className="grid grid-cols-3 gap-2 shrink-0">
          <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 text-center space-y-0.5">
            <div className="flex items-center justify-center gap-1 text-emerald-400">
              <Footprints className="w-4 h-4" />
              <span className="text-sm font-black">{totalFeetSaved.toLocaleString()}</span>
            </div>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Feet Saved</p>
          </div>

          <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 text-center space-y-0.5">
            <div className="flex items-center justify-center gap-1 text-blue-400">
              <Clock className="w-4 h-4" />
              <span className="text-sm font-black">{totalMinutesSaved} min</span>
            </div>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Time Saved</p>
          </div>

          <div className="bg-slate-950 p-3 rounded-2xl border border-slate-800 text-center space-y-0.5">
            <div className="flex items-center justify-center gap-1 text-indigo-400">
              <TrendingUp className="w-4 h-4" />
              <span className="text-sm font-black">{totalTrips}</span>
            </div>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">Trips Logged</p>
          </div>
        </div>

        {/* Timeline of Past Completed Trips */}
        <div className="space-y-3 overflow-y-auto pr-1 flex-1">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-400 px-1">
            Past Grocery Runs Timeline
          </label>

          {history.length === 0 ? (
            <div className="p-8 rounded-2xl bg-slate-950 border border-slate-800 text-center space-y-2">
              <CheckCircle2 className="w-8 h-8 text-slate-600 mx-auto" />
              <p className="text-xs font-bold text-slate-400">No completed trips yet</p>
              <p className="text-[11px] text-slate-500">Finish your first in-store grocery run to view detailed efficiency metrics here!</p>
            </div>
          ) : (
            history.map((trip) => {
              const formattedDate = new Date(trip.date).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              });

              return (
                <div
                  key={trip.id}
                  className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-2.5"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-blue-400 shrink-0" />
                      <span className="text-xs font-extrabold text-white">{trip.storeName}</span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-medium">{formattedDate}</span>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-1 border-t border-slate-800/80">
                    <span className="text-emerald-400 font-extrabold">
                      {trip.completedItemCount} of {trip.itemCount} Items Collected
                    </span>
                    <span className="text-slate-400 font-medium">
                      ~{(trip.savedFeet || 150).toLocaleString()} ft walking saved
                    </span>
                  </div>

                  {/* Sample items pill container */}
                  <div className="flex flex-wrap gap-1 pt-1">
                    {trip.items.slice(0, 5).map((item, idx) => (
                      <span
                        key={idx}
                        className="px-2 py-0.5 rounded-lg bg-slate-900 border border-slate-800 text-[10px] text-slate-300 font-semibold"
                      >
                        {item.cleanName}
                      </span>
                    ))}
                    {trip.items.length > 5 && (
                      <span className="px-2 py-0.5 rounded-lg bg-slate-900 text-slate-400 text-[10px] font-bold">
                        +{trip.items.length - 5} more
                      </span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};
