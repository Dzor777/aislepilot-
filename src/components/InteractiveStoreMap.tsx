'use client';

import React, { useState } from 'react';
import { MappedGroceryItem, WalmartStoreProfile } from '@/lib/types';
import { getItemCoordinates, generateSvgPathD, STORE_ENTRANCE_POINT, STORE_CHECKOUT_POINT, Point2D } from '@/lib/mapCoordinates';
import { MapPin, Check, Footprints, Info, Sparkles } from 'lucide-react';

interface InteractiveStoreMapProps {
  items: MappedGroceryItem[];
  store: WalmartStoreProfile;
  onToggleComplete: (id: string) => void;
}

export const InteractiveStoreMap: React.FC<InteractiveStoreMapProps> = ({
  items,
  store,
  onToggleComplete,
}) => {
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

  // Compute waypoint sequence: Start -> Active items in sequence -> Checkout
  const itemPoints: { item: MappedGroceryItem; point: Point2D; index: number }[] = items.map((item, idx) => ({
    item,
    point: getItemCoordinates(item),
    index: idx + 1,
  }));

  const allPathPoints: Point2D[] = [
    STORE_ENTRANCE_POINT,
    ...itemPoints.map((ip) => ip.point),
    STORE_CHECKOUT_POINT,
  ];

  const svgPathData = generateSvgPathD(allPathPoints);

  const selectedItem = items.find((i) => i.id === selectedItemId);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-3xl p-4 shadow-2xl space-y-3">
      {/* Header Info Bar */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30 flex items-center justify-center">
            <Footprints className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-extrabold text-sm text-white">
              {store.name.replace('Walmart Supercenter', 'Walmart')} Floorplan Path
            </h3>
            <p className="text-[10px] text-slate-400 font-medium">
              Tap pins to check off items along the continuous walking line
            </p>
          </div>
        </div>

        <span className="px-2.5 py-1 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800 text-[10px] font-extrabold">
          Single-Path Route
        </span>
      </div>

      {/* SVG Interactive Floorplan Map Canvas */}
      <div className="relative w-full aspect-[4/3] bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden shadow-inner select-none">
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full"
          preserveAspectRatio="none"
        >
          <defs>
            {/* Gradient for continuous walking trajectory */}
            <linearGradient id="walkingPathGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="50%" stopColor="#6366f1" />
              <stop offset="100%" stopColor="#10b981" />
            </linearGradient>

            {/* Glowing filter */}
            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="1.2" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* BACKGROUND: Store Department Zones */}
          {/* GM Entrance Zone */}
          <rect x="3" y="86" width="16" height="10" rx="2" fill="#1e293b" stroke="#334155" strokeWidth="0.5" />
          <text x="11" y="92" fill="#94a3b8" fontSize="2.2" fontWeight="bold" textAnchor="middle">ENTRANCE</text>

          {/* Household & Baby Zone (Left) */}
          <rect x="12" y="40" width="18" height="42" rx="3" fill="#1e1b4b" stroke="#3730a3" strokeWidth="0.5" opacity="0.6" />
          <text x="21" y="44" fill="#a5b4fc" fontSize="2.2" fontWeight="bold" textAnchor="middle">HOUSEHOLD / BABY</text>

          {/* Center Pantry Aisles (A1 - A25) */}
          <rect x="33" y="40" width="45" height="30" rx="3" fill="#0f172a" stroke="#1e293b" strokeWidth="0.5" />
          <text x="55" y="44" fill="#94a3b8" fontSize="2.5" fontWeight="extrabold" textAnchor="middle">CENTER AISLES A1–A25</text>
          
          {/* Aisle Grid Lines */}
          <line x1="39" y1="47" x2="39" y2="65" stroke="#334155" strokeWidth="0.8" strokeDasharray="1 1" />
          <line x1="49" y1="47" x2="49" y2="65" stroke="#334155" strokeWidth="0.8" strokeDasharray="1 1" />
          <line x1="59" y1="47" x2="59" y2="65" stroke="#334155" strokeWidth="0.8" strokeDasharray="1 1" />
          <line x1="69" y1="47" x2="69" y2="65" stroke="#334155" strokeWidth="0.8" strokeDasharray="1 1" />

          {/* Frozen Cases (Center Top) */}
          <rect x="52" y="22" width="20" height="15" rx="3" fill="#1e1b4b" stroke="#4338ca" strokeWidth="0.5" opacity="0.8" />
          <text x="62" y="30" fill="#c7d2fe" fontSize="2.2" fontWeight="bold" textAnchor="middle">FROZEN FOODS</text>

          {/* Fresh Meat Dept (Back Wall) */}
          <rect x="80" y="10" width="16" height="22" rx="3" fill="#450a0a" stroke="#991b1b" strokeWidth="0.5" opacity="0.8" />
          <text x="88" y="22" fill="#fca5a5" fontSize="2.2" fontWeight="bold" textAnchor="middle">MEAT DEPT</text>

          {/* Dairy Wall (Back Right) */}
          <rect x="80" y="34" width="16" height="20" rx="3" fill="#083344" stroke="#155e75" strokeWidth="0.5" opacity="0.8" />
          <text x="88" y="45" fill="#67e8f9" fontSize="2.2" fontWeight="bold" textAnchor="middle">DAIRY WALL</text>

          {/* Produce & Bakery (Front Right / Door) */}
          <rect x="76" y="60" width="20" height="25" rx="3" fill="#064e3b" stroke="#047857" strokeWidth="0.5" opacity="0.8" />
          <text x="86" y="72" fill="#6ee7b7" fontSize="2.3" fontWeight="bold" textAnchor="middle">PRODUCE & BAKERY</text>

          {/* Checkout & Registers */}
          <rect x="35" y="84" width="30" height="12" rx="3" fill="#0f172a" stroke="#334155" strokeWidth="0.5" />
          <text x="50" y="91" fill="#cbd5e1" fontSize="2.3" fontWeight="bold" textAnchor="middle">REGISTERS / CHECKOUT</text>

          {/* PATH LINE: Glowing Continuous SVG Trajectory */}
          {svgPathData && (
            <path
              d={svgPathData}
              fill="none"
              stroke="url(#walkingPathGradient)"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              filter="url(#glow)"
              className="transition-all duration-500"
            />
          )}

          {/* START PIN: Store Entrance */}
          <circle cx={STORE_ENTRANCE_POINT.x} cy={STORE_ENTRANCE_POINT.y} r="3" fill="#3b82f6" stroke="#ffffff" strokeWidth="0.8" />
          <text x={STORE_ENTRANCE_POINT.x} y={STORE_ENTRANCE_POINT.y + 0.8} fill="#ffffff" fontSize="2" fontWeight="black" textAnchor="middle">S</text>

          {/* END PIN: Checkout */}
          <circle cx={STORE_CHECKOUT_POINT.x} cy={STORE_CHECKOUT_POINT.y} r="3" fill="#10b981" stroke="#ffffff" strokeWidth="0.8" />
          <text x={STORE_CHECKOUT_POINT.x} y={STORE_CHECKOUT_POINT.y + 0.8} fill="#ffffff" fontSize="2" fontWeight="black" textAnchor="middle">E</text>

          {/* NUMBERED ITEM PINS */}
          {itemPoints.map(({ item, point, index }) => {
            const isSelected = item.id === selectedItemId;

            return (
              <g
                key={item.id}
                onClick={() => {
                  setSelectedItemId(item.id);
                  onToggleComplete(item.id);
                }}
                className="cursor-pointer group"
              >
                {/* Outer halo pulse ring */}
                <circle
                  cx={point.x}
                  cy={point.y}
                  r={isSelected ? "4.5" : "3.5"}
                  fill={item.completed ? "#059669" : isSelected ? "#3b82f6" : "#4f46e5"}
                  opacity={item.completed ? 0.6 : 0.9}
                  stroke="#ffffff"
                  strokeWidth="0.6"
                  className="transition-all duration-200 group-hover:scale-110"
                />

                {/* Pin Index Number or Checkmark */}
                {item.completed ? (
                  <text
                    x={point.x}
                    y={point.y + 0.8}
                    fill="#ffffff"
                    fontSize="2.2"
                    fontWeight="black"
                    textAnchor="middle"
                  >
                    ✓
                  </text>
                ) : (
                  <text
                    x={point.x}
                    y={point.y + 0.8}
                    fill="#ffffff"
                    fontSize="2.2"
                    fontWeight="extrabold"
                    textAnchor="middle"
                  >
                    {index}
                  </text>
                )}
              </g>
            );
          })}
        </svg>
      </div>

      {/* Selected Item Drawer / Quick Card */}
      {selectedItem ? (
        <div className="p-3.5 rounded-2xl bg-slate-950 border border-blue-500/80 shadow-lg flex items-center justify-between animate-in fade-in">
          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded-md bg-blue-600 text-white text-[10px] font-black">
                {selectedItem.aisleTag}
              </span>
              <span className={`text-sm font-bold ${selectedItem.completed ? 'line-through text-slate-500' : 'text-white'}`}>
                {selectedItem.cleanName}
              </span>
            </div>
            <p className="text-xs text-slate-400">{selectedItem.category}</p>
          </div>

          <button
            onClick={() => onToggleComplete(selectedItem.id)}
            className={`px-3 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-1.5 ${
              selectedItem.completed
                ? 'bg-emerald-600 text-white shadow-md'
                : 'bg-blue-600 hover:bg-blue-500 text-white shadow-md'
            }`}
          >
            <Check className="w-4 h-4" />
            <span>{selectedItem.completed ? 'Completed' : 'Got Item'}</span>
          </button>
        </div>
      ) : (
        <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800 text-center text-xs text-slate-400 flex items-center justify-center gap-1.5">
          <Info className="w-3.5 h-3.5 text-blue-400" />
          <span>Tap any numbered pin on the map to mark items as collected!</span>
        </div>
      )}
    </div>
  );
};
