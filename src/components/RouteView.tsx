'use client';

import React, { useState } from 'react';
import { MappedGroceryItem, WalmartStoreProfile, WalmartZoneId } from '@/lib/types';
import { WALMART_ZONES } from '@/sampleData/walmartStores';
import { ItemCard } from './ItemCard';
import { InteractiveStoreMap } from './InteractiveStoreMap';
import { AddItemModal } from './AddItemModal';
import { TripSummaryModal } from './TripSummaryModal';
import { groupItemsByZone } from '@/lib/routeOptimizer';
import { CheckCircle2, Plus, Map, List, Snowflake, ArrowLeft } from 'lucide-react';

interface RouteViewProps {
  items: MappedGroceryItem[];
  store: WalmartStoreProfile;
  onToggleComplete: (id: string) => void;
  onEditAisleLocation: (id: string, newAisleTag: string, newAisleNumber: number) => void;
  onAddItemMidTrip: (itemText: string) => void;
  onBackToReview: () => void;
  onNewTrip: () => void;
}

export const RouteView: React.FC<RouteViewProps> = ({
  items,
  store,
  onToggleComplete,
  onEditAisleLocation,
  onAddItemMidTrip,
  onBackToReview,
  onNewTrip,
}) => {
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map');
  const [filterMode, setFilterMode] = useState<'all' | 'active' | 'completed'>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const completedCount = items.filter((i) => i.completed).length;
  const totalCount = items.length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
  const isTripFinished = totalCount > 0 && completedCount === totalCount;

  // Group items by zone for section listing
  const groupedZones = groupItemsByZone(items);

  return (
    <div className="w-full max-w-md mx-auto space-y-4 animate-in fade-in duration-300 pb-20">
      {/* Sticky Progress & Header Summary */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl space-y-3">
        <div className="flex items-center justify-between">
          <button
            onClick={onBackToReview}
            className="flex items-center gap-1 text-xs font-semibold text-slate-400 hover:text-slate-200 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Edit List</span>
          </button>

          <div className="flex items-center gap-2">
            <span className="text-xs font-extrabold text-blue-400">
              {completedCount} of {totalCount} Items Got
            </span>
            <span className="text-[10px] font-bold text-slate-400 bg-slate-800 px-2 py-0.5 rounded-full">
              {progressPercent}%
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-950 rounded-full h-3 overflow-hidden border border-slate-800 p-0.5">
          <div
            className="bg-gradient-to-r from-blue-500 via-indigo-500 to-emerald-500 h-full rounded-full transition-all duration-300 shadow-sm"
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* View Switcher: Interactive Map Path vs Item List */}
        <div className="flex items-center justify-between gap-2 pt-1">
          <div className="grid grid-cols-2 gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 flex-1">
            <button
              onClick={() => setViewMode('map')}
              className={`py-1.5 px-2 text-xs font-extrabold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                viewMode === 'map'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Map className="w-3.5 h-3.5" />
              <span>Interactive Map Route</span>
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`py-1.5 px-2 text-xs font-extrabold rounded-lg transition-all flex items-center justify-center gap-1.5 ${
                viewMode === 'list'
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span>Items List</span>
            </button>
          </div>
        </div>
      </div>

      {/* PRIMARY FOCAL VIEW 1: Interactive Floorplan Map with SVG Walking Line */}
      {viewMode === 'map' && (
        <div className="space-y-4">
          <InteractiveStoreMap
            items={items}
            store={store}
            onToggleComplete={onToggleComplete}
          />
        </div>
      )}

      {/* Cold Food Last Alert Banner */}
      <div className="p-3 rounded-2xl bg-indigo-950/40 border border-indigo-800/40 text-xs text-indigo-200 flex items-center gap-2.5">
        <Snowflake className="w-5 h-5 text-indigo-400 shrink-0" />
        <div className="leading-tight">
          <span className="font-bold text-indigo-300">Anna / Melissa Single-Pass Route:</span>
          <p className="text-[11px] text-indigo-200/80">
            Heavy goods & pantry aisles are routed first. Produce, dairy, and ice cream are queued last right before checkout!
          </p>
        </div>
      </div>

      {/* Item List Grouped by Zone */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <h3 className="font-bold text-xs uppercase tracking-wider text-slate-400">
            Sequential Store Checklist
          </h3>
          <div className="flex gap-1 text-[10px] font-bold">
            <button
              onClick={() => setFilterMode('all')}
              className={`px-2 py-0.5 rounded ${filterMode === 'all' ? 'bg-blue-600 text-white' : 'text-slate-500'}`}
            >
              All
            </button>
            <button
              onClick={() => setFilterMode('active')}
              className={`px-2 py-0.5 rounded ${filterMode === 'active' ? 'bg-blue-600 text-white' : 'text-slate-500'}`}
            >
              Active
            </button>
            <button
              onClick={() => setFilterMode('completed')}
              className={`px-2 py-0.5 rounded ${filterMode === 'completed' ? 'bg-blue-600 text-white' : 'text-slate-500'}`}
            >
              Done
            </button>
          </div>
        </div>

        {(Object.keys(groupedZones) as WalmartZoneId[]).map((zoneId) => {
          const zoneItems = groupedZones[zoneId].filter((item) => {
            if (filterMode === 'active') return !item.completed;
            if (filterMode === 'completed') return item.completed;
            return true;
          });

          if (zoneItems.length === 0) return null;

          const zoneInfo = WALMART_ZONES[zoneId];
          const isZoneComplete = zoneItems.every((i) => i.completed);

          return (
            <div
              key={zoneId}
              className="rounded-2xl border border-slate-800 bg-slate-900/80 p-3 space-y-2.5"
            >
              <div className="flex items-center justify-between pb-1">
                <span className={`px-2.5 py-1 rounded-lg text-xs font-extrabold border ${zoneInfo.badgeBg}`}>
                  {zoneInfo.shortName}
                </span>
                {isZoneComplete && (
                  <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" />
                    Done
                  </span>
                )}
              </div>

              <div className="space-y-2">
                {zoneItems.map((item) => (
                  <ItemCard
                    key={item.id}
                    item={item}
                    onToggleComplete={onToggleComplete}
                    onEditAisleLocation={onEditAisleLocation}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>

      {/* Floating Action Button: Add Item Mid-Trip */}
      <div className="fixed bottom-4 left-0 right-0 z-30 px-4 max-w-md mx-auto flex justify-center">
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="py-3.5 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-extrabold text-sm rounded-full shadow-2xl shadow-blue-600/50 border border-blue-400/40 flex items-center gap-2 active:scale-95 transition-all cursor-pointer"
        >
          <Plus className="w-5 h-5 stroke-[3]" />
          <span>Add Item Mid-Trip</span>
        </button>
      </div>

      {/* Mid-Trip Add Item Modal */}
      <AddItemModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddItem={onAddItemMidTrip}
      />

      {/* Trip Complete Summary Modal */}
      <TripSummaryModal
        isOpen={isTripFinished}
        onClose={() => {}}
        items={items}
        store={store}
        onNewTrip={onNewTrip}
      />
    </div>
  );
};
