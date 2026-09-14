'use client';

import React, { useState } from 'react';
import { Check, Edit2, Sparkles, MapPin, Tag } from 'lucide-react';
import { MappedGroceryItem } from '@/lib/types';
import { WALMART_ZONES } from '@/sampleData/walmartStores';

interface ItemCardProps {
  item: MappedGroceryItem;
  itemIndex?: number;
  onToggleComplete: (id: string) => void;
  onEditAisleLocation: (id: string, newAisleTag: string, newAisleNumber: number) => void;
}

export const ItemCard: React.FC<ItemCardProps> = ({
  item,
  itemIndex,
  onToggleComplete,
  onEditAisleLocation,
}) => {
  const [isEditingAisle, setIsEditingAisle] = useState(false);
  const [customAisleInput, setCustomAisleInput] = useState(item.aisleTag);

  const zone = WALMART_ZONES[item.zoneId] || WALMART_ZONES.ZONE_2_PANTRY_DRY;

  const handleSaveAisle = () => {
    if (customAisleInput.trim()) {
      // Extract numerical aisle number if present (e.g. A12 -> 12)
      const numMatch = customAisleInput.match(/\d+/);
      const parsedNum = numMatch ? parseInt(numMatch[0], 10) : item.aisleNumber;

      onEditAisleLocation(item.id, customAisleInput.trim(), parsedNum);
    }
    setIsEditingAisle(false);
  };

  return (
    <div
      className={`p-3.5 rounded-2xl border transition-all duration-200 shadow-md ${
        item.completed
          ? 'bg-slate-950/40 border-slate-850 opacity-60'
          : 'bg-slate-900 border-slate-800 hover:border-slate-700'
      }`}
    >
      <div className="flex items-start gap-3">
        {/* Large Tactile Checkbox */}
        <button
          onClick={() => onToggleComplete(item.id)}
          className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300 active:scale-95 ${
            item.completed
              ? 'bg-emerald-600 text-white shadow-md shadow-emerald-600/30'
              : 'bg-slate-800 border-2 border-slate-700 hover:border-blue-500 text-transparent'
          }`}
        >
          <Check className={`w-6 h-6 stroke-[3] transition-transform ${item.completed ? 'scale-100' : 'scale-50'}`} />
        </button>

        {/* Item Information & Aisle Badge */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1">
            <div className="flex items-start gap-1.5 min-w-0 flex-1">
              {itemIndex !== undefined && (
                <span className="px-1.5 py-0.5 rounded-md bg-blue-600 text-white text-[10px] font-black shrink-0 mt-0.5">
                  #{itemIndex}
                </span>
              )}
              <span
                className={`font-bold text-base tracking-tight leading-snug break-words ${
                  item.completed ? 'line-through text-slate-500' : 'text-white'
                }`}
              >
                {item.cleanName}
              </span>
            </div>

            {/* High Contrast Aisle Badge */}
            {isEditingAisle ? (
              <div className="flex items-center gap-1 shrink-0">
                <input
                  type="text"
                  value={customAisleInput}
                  onChange={(e) => setCustomAisleInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSaveAisle()}
                  className="w-20 px-2 py-0.5 bg-slate-950 border border-blue-500 rounded text-xs text-white"
                  autoFocus
                />
                <button
                  onClick={handleSaveAisle}
                  className="px-2 py-0.5 bg-blue-600 text-white rounded text-xs font-bold"
                >
                  Save
                </button>
              </div>
            ) : (
              <button
                onClick={() => setIsEditingAisle(true)}
                className={`px-2.5 py-1 rounded-lg text-xs font-extrabold border shrink-0 flex items-center gap-1 transition-transform hover:scale-105 ${zone.badgeBg}`}
                title="Tap to change aisle for your store"
              >
                <MapPin className="w-3 h-3" />
                <span>{item.aisleTag}</span>
                {item.isCustomLocation && (
                  <Sparkles className="w-3 h-3 text-amber-400" />
                )}
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
            <span className="flex items-center gap-1 text-[11px] font-medium">
              <Tag className="w-3 h-3 text-slate-500" />
              {item.category}
            </span>

            {item.originalText.toLowerCase() !== item.cleanName.toLowerCase() && (
              <span className="text-[10px] italic text-slate-500 break-words">
                (From &quot;{item.originalText}&quot;)
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
