'use client';

import React from 'react';
import { WalmartZoneId, MappedGroceryItem } from '@/lib/types';
import { WALMART_ZONES } from '@/sampleData/walmartStores';
import { MapPin, ArrowRight } from 'lucide-react';

interface AisleMapVisualizerProps {
  activeZoneId?: WalmartZoneId;
  items: MappedGroceryItem[];
}

export const AisleMapVisualizer: React.FC<AisleMapVisualizerProps> = ({
  activeZoneId = 'ZONE_2_PANTRY_DRY',
  items,
}) => {
  const zones: { id: WalmartZoneId; label: string; gridArea: string }[] = [
    { id: 'ZONE_1_HOUSEHOLD', label: '1. Household & Detergents', gridArea: 'col-span-1 row-span-1' },
    { id: 'ZONE_2_PANTRY_DRY', label: '2. Center Aisles (A1–A25)', gridArea: 'col-span-2 row-span-1' },
    { id: 'ZONE_3_MEAT', label: '3. Fresh Meat & Fish', gridArea: 'col-span-1 row-span-1' },
    { id: 'ZONE_4_DAIRY', label: '4. Dairy & Refrigerated', gridArea: 'col-span-1 row-span-1' },
    { id: 'ZONE_5_PRODUCE_BAKERY', label: '5. Produce & Bakery (Door Zone)', gridArea: 'col-span-1 row-span-1' },
    { id: 'ZONE_6_FROZEN', label: '6. Frozen & Ice Cream (Last Stop)', gridArea: 'col-span-1 row-span-1' },
    { id: 'ZONE_7_FRONT', label: '7. Checkout & Exit', gridArea: 'col-span-2 row-span-1' },
  ];

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-xs uppercase tracking-wider text-slate-300 flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5 text-blue-400" />
          Walmart Store Floorplan Path
        </h3>
        <span className="text-[10px] font-semibold text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded-full border border-emerald-800">
          Heavy-First • Cold-Last Route
        </span>
      </div>

      {/* Visual Store Grid */}
      <div className="grid grid-cols-2 gap-2 p-2 bg-slate-950 rounded-xl border border-slate-800 text-[11px]">
        {zones.map((z) => {
          const zoneInfo = WALMART_ZONES[z.id];
          const isCurrent = activeZoneId === z.id;
          const zoneItems = items.filter((i) => i.zoneId === z.id);
          const hasItems = zoneItems.length > 0;
          const isAllCompleted = hasItems && zoneItems.every((i) => i.completed);

          return (
            <div
              key={z.id}
              className={`p-2.5 rounded-lg border transition-all flex flex-col justify-between ${z.gridArea} ${
                isCurrent
                  ? 'bg-blue-600/20 border-blue-500 text-white shadow-lg shadow-blue-500/10'
                  : isAllCompleted
                  ? 'bg-slate-900/60 border-slate-800/80 text-slate-500 opacity-70'
                  : hasItems
                  ? 'bg-slate-900 border-slate-700 text-slate-200'
                  : 'bg-slate-950 border-slate-900 text-slate-600'
              }`}
            >
              <div className="flex items-center justify-between gap-1 mb-1">
                <span className="font-bold text-[11px] truncate">{z.label}</span>
                {isCurrent && (
                  <span className="w-2 h-2 rounded-full bg-blue-400 animate-ping shrink-0" />
                )}
              </div>

              <div className="flex items-center justify-between text-[10px] text-slate-400">
                <span>{hasItems ? `${zoneItems.length} items` : 'Pass through'}</span>
                {isAllCompleted && <span className="text-emerald-400 font-bold">✓ Done</span>}
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex items-center justify-between text-[10px] text-slate-400 px-1">
        <span>Entrance: GM Side</span>
        <div className="flex items-center gap-1 text-blue-400 font-semibold">
          <span>Continuous Walking Direction</span>
          <ArrowRight className="w-3 h-3" />
        </div>
        <span>Exit: Grocery Side</span>
      </div>
    </div>
  );
};
