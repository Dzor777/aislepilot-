'use client';

import React, { useState } from 'react';
import { MappedGroceryItem, WalmartStoreProfile } from '@/lib/types';
import { getItemCoordinates, generateSvgPathD, STORE_ENTRANCE_POINT, STORE_CHECKOUT_POINT, Point2D } from '@/lib/mapCoordinates';
import { Footprints, Check, Info } from 'lucide-react';

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

  // Compute waypoint sequence: Entrance -> Items -> Checkout
  const itemPoints = items.map((item, idx) => ({
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

  // Aisles grid definitions (A1 through A32 filled with odd & even labels)
  const aisleRows = [
    { odd: 'A31', even: 'A32', y: 20, category: 'Cleaning' },
    { odd: 'A29', even: 'A30', y: 23, category: 'Cleaning' },
    { odd: 'A27', even: 'A28', y: 26, category: 'Household Paper' },
    { odd: 'A25', even: 'A26', y: 29, category: 'Household / Snacks' },
    { odd: 'A23', even: 'A24', y: 32, category: 'Snacks & Bev' },
    { odd: 'A21', even: 'A22', y: 35, category: 'Grocery / Snacks' },
    { odd: 'A19', even: 'A20', y: 38, category: 'Grocery' },
    { odd: 'A17', even: 'A18', y: 41, category: 'Grocery' },
    { odd: 'A15', even: 'A16', y: 44, category: 'Grocery' },
    { odd: 'A13', even: 'A14', y: 47, category: 'Grocery' },
    { odd: 'A11', even: 'A12', y: 50, category: 'Grocery' },
    { odd: 'A9',  even: 'A10', y: 53, category: 'Alcohol / Bev' },
    { odd: 'A7',  even: 'A8',  y: 56, category: 'Alcohol / Bev' },
    { odd: 'A5',  even: 'A6',  y: 59, category: 'Food / Pantry' },
    { odd: 'A3',  even: 'A4',  y: 62, category: 'Frozen Cases' },
    { odd: 'A1',  even: 'A2',  y: 65, category: 'Frozen Cases' },
  ];

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
              Anna Supercenter Map (1:1 Blueprint)
            </h3>
            <p className="text-[10px] text-slate-400 font-medium">
              Exact match to official Walmart map • Tap pins to check off
            </p>
          </div>
        </div>

        <span className="px-2.5 py-1 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800 text-[10px] font-extrabold">
          Single-Path Trajectory
        </span>
      </div>

      {/* SVG Interactive Floorplan Canvas */}
      <div className="relative w-full aspect-[4/3] bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden shadow-inner select-none">
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="walkingPathGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="50%" stopColor="#6366f1" />
              <stop offset="100%" stopColor="#10b981" />
            </linearGradient>

            <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="1.2" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* 1. STORE BOUNDARY & DUAL ENTRANCES */}
          <rect x="2" y="2" width="96" height="96" rx="2" fill="#020617" stroke="#1e293b" strokeWidth="0.5" />

          {/* Grocery Entrance (Bottom Right Door ⇅) */}
          <rect x="73" y="90" width="12" height="4" rx="1" fill="#2563eb" stroke="#ffffff" strokeWidth="0.4" />
          <text x="79" y="92.8" fill="#ffffff" fontSize="1.6" fontWeight="black" textAnchor="middle">⇅ GROCERY ENTRANCE</text>

          {/* GM Entrance (Bottom Left-Center Door ⇅) */}
          <rect x="28" y="90" width="12" height="4" rx="1" fill="#1e293b" stroke="#475569" strokeWidth="0.4" />
          <text x="34" y="92.8" fill="#94a3b8" fontSize="1.6" fontWeight="bold" textAnchor="middle">⇅ GM ENTRANCE</text>

          {/* 2. TOP PERIMETER ROW (Left to Right) */}
          <rect x="4" y="5" width="8" height="8" rx="1" fill="#0f172a" stroke="#334155" strokeWidth="0.3" />
          <text x="8" y="10" fill="#64748b" fontSize="1.4" fontWeight="bold" textAnchor="middle">Auto</text>

          <rect x="13" y="5" width="15" height="8" rx="1" fill="#0f172a" stroke="#334155" strokeWidth="0.3" />
          <text x="20.5" y="10" fill="#64748b" fontSize="1.4" fontWeight="bold" textAnchor="middle">Home Improvement</text>

          <rect x="29" y="5" width="18" height="8" rx="1" fill="#0f172a" stroke="#334155" strokeWidth="0.3" />
          <text x="38" y="10" fill="#64748b" fontSize="1.4" fontWeight="bold" textAnchor="middle">Electronics</text>

          <rect x="48" y="5" width="10" height="8" rx="1" fill="#0f172a" stroke="#334155" strokeWidth="0.3" />
          <text x="53" y="10" fill="#64748b" fontSize="1.4" fontWeight="bold" textAnchor="middle">Arts & Crafts</text>

          <rect x="59" y="5" width="10" height="8" rx="1" fill="#1c1917" stroke="#44403c" strokeWidth="0.3" />
          <text x="64" y="10" fill="#d6d3d1" fontSize="1.4" fontWeight="bold" textAnchor="middle">Pets</text>

          {/* Dairy Wall (Top Right Back Wall A33) */}
          <rect x="71" y="5" width="25" height="8" rx="1" fill="#083344" stroke="#155e75" strokeWidth="0.4" />
          <text x="83.5" y="10" fill="#67e8f9" fontSize="1.8" fontWeight="black" textAnchor="middle">Dairy Wall (A33)</text>

          {/* 3. LEFT COLUMN (Sports, Toys, Garden, Health & Beauty) */}
          <rect x="4" y="15" width="12" height="15" rx="1" fill="#0f172a" stroke="#334155" strokeWidth="0.3" />
          <text x="10" y="23" fill="#64748b" fontSize="1.4" fontWeight="bold" textAnchor="middle">Sports & Outdoors</text>

          <rect x="4" y="31" width="12" height="20" rx="1" fill="#311042" stroke="#701a75" strokeWidth="0.3" />
          <text x="10" y="42" fill="#f5d0fe" fontSize="1.6" fontWeight="bold" textAnchor="middle">Toys</text>

          <rect x="4" y="53" width="12" height="22" rx="1" fill="#064e3b" stroke="#047857" strokeWidth="0.3" opacity="0.6" />
          <text x="10" y="65" fill="#6ee7b7" fontSize="1.6" fontWeight="bold" textAnchor="middle">Garden</text>

          {/* Health & Beauty / Pharmacy (Front Left G1–G37) */}
          <rect x="18" y="72" width="22" height="14" rx="1" fill="#1e1b4b" stroke="#3730a3" strokeWidth="0.4" />
          <text x="29" y="80" fill="#c7d2fe" fontSize="1.6" fontWeight="bold" textAnchor="middle">Health & Beauty (G1–G37)</text>

          {/* 4. CENTER BLOCKS (Home, Fashion, Narrow Strip) */}
          {/* Home Block (Vertical rectangle left of Fashion) */}
          <rect x="18" y="15" width="16" height="36" rx="1" fill="#1e293b" stroke="#334155" strokeWidth="0.4" />
          <text x="26" y="33" fill="#94a3b8" fontSize="2.2" fontWeight="bold" textAnchor="middle">Home</text>

          {/* Narrow Strip (Office, Party, Seasonal) */}
          <rect x="35" y="15" width="7" height="10" rx="0.5" fill="#0f172a" stroke="#334155" strokeWidth="0.2" />
          <text x="38.5" y="21" fill="#64748b" fontSize="1.1" textAnchor="middle">Office</text>

          <rect x="35" y="26" width="7" height="11" rx="0.5" fill="#0f172a" stroke="#334155" strokeWidth="0.2" />
          <text x="38.5" y="32" fill="#64748b" fontSize="1.1" textAnchor="middle">Party</text>

          <rect x="35" y="38" width="7" height="13" rx="0.5" fill="#0f172a" stroke="#334155" strokeWidth="0.2" />
          <text x="38.5" y="45" fill="#64748b" fontSize="1.1" textAnchor="middle">Seasonal</text>

          {/* Fashion Block (Large center square) */}
          <rect x="43" y="15" width="26" height="36" rx="1.5" fill="#0f172a" stroke="#334155" strokeWidth="0.5" />
          <text x="56" y="33" fill="#e2e8f0" fontSize="2.8" fontWeight="black" textAnchor="middle">Fashion</text>

          {/* Checkout Registers (Front Center Bar Z1–Z43) */}
          <rect x="38" y="53" width="31" height="8" rx="1" fill="#0f172a" stroke="#475569" strokeWidth="0.4" />
          <text x="53.5" y="58" fill="#e2e8f0" fontSize="1.8" fontWeight="black" textAnchor="middle">Checkout Registers</text>

          {/* 5. GROCERY WING (RIGHT BLOCK - A1 THROUGH A32) */}
          <rect x="71" y="15" width="25" height="73" rx="1.5" fill="#090d16" stroke="#1e293b" strokeWidth="0.5" />
          <text x="83.5" y="18.5" fill="#94a3b8" fontSize="1.6" fontWeight="black" textAnchor="middle">GROCERY</text>

          {/* Cleaning Top Section */}
          <rect x="72" y="19" width="18" height="4" rx="0.5" fill="#1e293b" stroke="#334155" strokeWidth="0.2" />
          <text x="81" y="21.8" fill="#cbd5e1" fontSize="1.2" fontWeight="bold" textAnchor="middle">Cleaning</text>

          {/* Draw 16 Horizontal Shelf Bars with odd and even labels */}
          {aisleRows.map((aisle) => (
            <g key={aisle.odd}>
              <rect x="72" y={aisle.y - 0.8} width="16" height="1.8" rx="0.4" fill="#1e293b" stroke="#334155" strokeWidth="0.2" />
              {/* Odd Aisle Label (Top Face) */}
              <text x="73" y={aisle.y - 0.1} fill="#60a5fa" fontSize="1.2" fontWeight="extrabold">{aisle.odd}</text>
              {/* Even Aisle Label (Bottom Face) */}
              <text x="87" y={aisle.y + 0.7} fill="#93c5fd" fontSize="1.2" fontWeight="extrabold" textAnchor="end">{aisle.even}</text>
            </g>
          ))}

          {/* Meat & Seafood (Right Perimeter Wall A34/A35) */}
          <rect x="91" y="25" width="5" height="35" rx="1" fill="#450a0a" stroke="#991b1b" strokeWidth="0.4" />
          <text x="93.5" y="42" fill="#fca5a5" fontSize="1.6" fontWeight="black" textAnchor="middle" writingMode="tb">MEAT & SEAFOOD (A34)</text>

          {/* Fresh Produce (Front Right Area) */}
          <g transform="translate(73, 70) rotate(-20)">
            <rect x="0" y="0" width="12" height="8" rx="1.5" fill="#064e3b" stroke="#047857" strokeWidth="0.4" />
            <text x="6" y="5" fill="#6ee7b7" fontSize="1.6" fontWeight="black" textAnchor="middle">Fresh Produce</text>
          </g>

          {/* Deli (AD1 Front Center Right) */}
          <rect x="73" y="80" width="10" height="4" rx="0.5" fill="#701a75" stroke="#a21caf" strokeWidth="0.3" />
          <text x="78" y="82.8" fill="#f0abfc" fontSize="1.4" fontWeight="bold" textAnchor="middle">Deli (AD1)</text>

          {/* Bakery (Right Lower Perimeter) */}
          <rect x="91" y="68" width="5" height="16" rx="1" fill="#78350f" stroke="#b45309" strokeWidth="0.4" />
          <text x="93.5" y="76" fill="#fde68a" fontSize="1.6" fontWeight="black" textAnchor="middle" writingMode="tb">Bakery</text>

          {/* 6. ANIMATED CONTINUOUS SVG WALKING LINE */}
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

          {/* START PIN: Grocery Entrance */}
          <circle cx={STORE_ENTRANCE_POINT.x} cy={STORE_ENTRANCE_POINT.y} r="2.8" fill="#2563eb" stroke="#ffffff" strokeWidth="0.6" />
          <text x={STORE_ENTRANCE_POINT.x} y={STORE_ENTRANCE_POINT.y + 0.7} fill="#ffffff" fontSize="1.8" fontWeight="black" textAnchor="middle">S</text>

          {/* END PIN: Checkout */}
          <circle cx={STORE_CHECKOUT_POINT.x} cy={STORE_CHECKOUT_POINT.y} r="2.8" fill="#10b981" stroke="#ffffff" strokeWidth="0.6" />
          <text x={STORE_CHECKOUT_POINT.x} y={STORE_CHECKOUT_POINT.y + 0.7} fill="#ffffff" fontSize="1.8" fontWeight="black" textAnchor="middle">E</text>

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
                {/* Halo pulse ring */}
                <circle
                  cx={point.x}
                  cy={point.y}
                  r={isSelected ? "3.8" : "3.0"}
                  fill={item.completed ? "#059669" : isSelected ? "#3b82f6" : "#4f46e5"}
                  opacity={item.completed ? 0.6 : 0.9}
                  stroke="#ffffff"
                  strokeWidth="0.5"
                  className="transition-all duration-200 group-hover:scale-110"
                />

                {/* Pin Index Number or Checkmark */}
                {item.completed ? (
                  <text
                    x={point.x}
                    y={point.y + 0.7}
                    fill="#ffffff"
                    fontSize="1.9"
                    fontWeight="black"
                    textAnchor="middle"
                  >
                    ✓
                  </text>
                ) : (
                  <text
                    x={point.x}
                    y={point.y + 0.7}
                    fill="#ffffff"
                    fontSize="1.9"
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
            className={`px-3 py-2 rounded-xl text-xs font-extrabold transition-all flex items-center gap-1.5 cursor-pointer ${
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
          <span>Tap any numbered pin on the 1:1 Anna Supercenter map to mark items as collected!</span>
        </div>
      )}
    </div>
  );
};
