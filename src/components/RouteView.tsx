'use client';

import React, { useState } from 'react';
import { MappedGroceryItem, WalmartStoreProfile, WalmartZoneId } from '@/lib/types';
import { WALMART_ZONES } from '@/sampleData/walmartStores';
import { ItemCard } from './ItemCard';
import { AisleMapVisualizer } from './AisleMapVisualizer';
import { AddItemModal } from './AddItemModal';
import { TripSummaryModal } from './TripSummaryModal';
import { groupItemsByZone } from '@/lib/routeOptimizer';
import { CheckCircle2, Plus, Map, Snowflake, ChevronDown, ChevronUp, ArrowLeft } from 'lucide-react';

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
  const [filterMode, setFilterMode] = useState<'all' | 'active' | 'completed'>('all');
  const [showMap, setShowMap] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const completedCount = items.filter((i) => i.completed).length;
  const totalCount = items.length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
  const isTripFinished = totalCount > 0 && completedCount === totalCount;

  // Identify current active zone (first zone containing uncompleted items)
  const groupedZones = groupItemsByZone(items);
  const activeZoneEntry = Object.entries(groupedZones).find(([_, zoneItems]) =>
    zoneItems.some((item) => !item.completed)
  );
  const activeZoneId = (activeZoneEntry ? activeZoneEntry[0] : 'ZONE_7_FRONT') as WalmartZoneId;

  // Filter items according to tab selection
  const filteredItems = items.filter((item) => {
    if (filterMode === 'active') return !item.completed;
    if (filterMode === 'completed') return item.completed;
    return true;
  });

  return (
    <div className="w-full max-w-md mx-auto space-y-4 animate-in fade-in duration-300 pb-12">
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

        {/* Action Controls */}
        <div className="flex items-center justify-between gap-2 pt-1">
          <div className="grid grid-cols-3 gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 flex-1">
            <button
              onClick={() => setFilterMode('all')}
              className={`py-1 text-[11px] font-bold rounded-lg transition-all ${
                filterMode === 'all' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              All ({totalCount})
            </button>
            <button
              onClick={() => setFilterMode('active')}
              className={`py-1 text-[11px] font-bold rounded-lg transition-all ${
                filterMode === 'active' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Active ({totalCount - completedCount})
            </button>
            <button
              onClick={() => setFilterMode('completed')}
              className={`py-1 text-[11px] font-bold rounded-lg transition-all ${
                filterMode === 'completed' ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              Done ({completedCount})
            </button>
          </div>

          <button
            onClick={() => setShowMap(!showMap)}
            className={`p-2 rounded-xl border text-xs font-semibold flex items-center gap-1 transition-all ${
              showMap
                ? 'bg-blue-600/20 border-blue-500 text-blue-300'
                : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-slate-200'
            }`}
            title="Toggle store layout minimap"
          >
            <Map className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Optional Store Floorplan Map Visualizer */}
      {showMap && (
        <AisleMapVisualizer activeZoneId={activeZoneId} items={items} />
      )}

      {/* Cold Food Last Alert Banner */}
      <div className="p-3 rounded-2xl bg-indigo-950/40 border border-indigo-800/40 text-xs text-indigo-200 flex items-center gap-2.5">
        <Snowflake className="w-5 h-5 text-indigo-400 shrink-0" />
        <div className="leading-tight">
          <span className="font-bold text-indigo-300">Continuous Cold-Last Route:</span>
          <p className="text-[11px] text-indigo-200/80">
            Heavy dry goods & pantry items are routed first. Produce, dairy, and ice cream are queued last right before checkout!
          </p>
        </div>
      </div>

      {/* Item List Grouped by Zone */}
      <div className="space-y-4">
        {(Object.keys(groupedZones) as WalmartZoneId[]).map((zoneId) => {
          const zoneItems = groupedZones[zoneId].filter((item) => {
            if (filterMode === 'active') return !item.completed;
            if (filterMode === 'completed') return item.completed;
            return true;
          });

          if (zoneItems.length === 0) return null;

          const zoneInfo = WALMART_ZONES[zoneId];
          const isZoneActive = activeZoneId === zoneId;
          const isZoneComplete = zoneItems.every((i) => i.completed);

          return (
            <div
              key={zoneId}
              className={`rounded-2xl border transition-all ${
                isZoneActive
                  ? 'border-blue-500/80 bg-slate-900/90 shadow-xl'
                  : 'border-slate-800 bg-slate-900/60'
              }`}
            >
              {/* Zone Header */}
              <div className="p-3.5 border-b border-slate-800/80 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span
                    className={`px-2.5 py-1 rounded-lg text-xs font-extrabold border ${zoneInfo.badgeBg}`}
                  >
                    {zoneInfo.shortName}
                  </span>
                  <span className="text-xs text-slate-400 font-medium">
                    {zoneItems.filter((i) => i.completed).length}/{zoneItems.length} Got
                  </span>
                </div>

                {isZoneComplete ? (
                  <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4" />
                    Complete
                  </span>
                ) : isZoneActive ? (
                  <span className="px-2 py-0.5 rounded-full bg-blue-600 text-white text-[10px] font-black uppercase tracking-wider animate-pulse">
                    Active Zone
                  </span>
                ) : null}
              </div>

              {/* Items Cards */}
              <div className="p-3 space-y-2.5">
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
          className="py-3 px-5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-extrabold text-sm rounded-full shadow-2xl shadow-blue-600/50 border border-blue-400/40 flex items-center gap-2 active:scale-95 transition-all"
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
