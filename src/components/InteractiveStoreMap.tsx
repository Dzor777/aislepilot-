'use client';

import React, { useState, useRef } from 'react';
import { MappedGroceryItem, WalmartStoreProfile } from '@/lib/types';
import { getItemCoordinates, generateSvgPathD, STORE_ENTRANCE_POINT, STORE_CHECKOUT_POINT, Point2D } from '@/lib/mapCoordinates';
import { Footprints, Check, Info, ZoomIn, ZoomOut, RotateCcw, Move } from 'lucide-react';

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

  // Zoom & Pan state
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [panOffset, setPanOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const dragStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  const handleZoomIn = () => {
    setZoomLevel((prev) => Math.min(prev + 0.4, 3.5));
  };

  const handleZoomOut = () => {
    setZoomLevel((prev) => {
      const next = Math.max(prev - 0.4, 1);
      if (next === 1) setPanOffset({ x: 0, y: 0 });
      return next;
    });
  };

  const handleResetZoom = () => {
    setZoomLevel(1);
    setPanOffset({ x: 0, y: 0 });
  };

  // Mouse & Touch Drag Handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (zoomLevel <= 1) return;
    setIsDragging(true);
    dragStartRef.current = { x: e.clientX - panOffset.x, y: e.clientY - panOffset.y };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || zoomLevel <= 1) return;
    const maxOffset = (zoomLevel - 1) * 120;
    const newX = Math.min(Math.max(e.clientX - dragStartRef.current.x, -maxOffset), maxOffset);
    const newY = Math.min(Math.max(e.clientY - dragStartRef.current.y, -maxOffset), maxOffset);
    setPanOffset({ x: newX, y: newY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    if (zoomLevel <= 1 || e.touches.length !== 1) return;
    setIsDragging(true);
    const touch = e.touches[0];
    dragStartRef.current = { x: touch.clientX - panOffset.x, y: touch.clientY - panOffset.y };
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (!isDragging || zoomLevel <= 1 || e.touches.length !== 1) return;
    const touch = e.touches[0];
    const maxOffset = (zoomLevel - 1) * 120;
    const newX = Math.min(Math.max(touch.clientX - dragStartRef.current.x, -maxOffset), maxOffset);
    const newY = Math.min(Math.max(touch.clientY - dragStartRef.current.y, -maxOffset), maxOffset);
    setPanOffset({ x: newX, y: newY });
  };

  const handleTouchEnd = () => {
    setIsDragging(false);
  };

  const handleWheel = (e: React.WheelEvent) => {
    if (e.deltaY < 0) {
      handleZoomIn();
    } else {
      handleZoomOut();
    }
  };

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

  // 16 Horizontal Grocery Aisles (A1 through A32 filled with odd & even shelf labels)
  const groceryAisleRows = [
    { odd: 'A31', even: 'A32', y: 19, category: 'Cleaning' },
    { odd: 'A29', even: 'A30', y: 23, category: 'Cleaning' },
    { odd: 'A27', even: 'A28', y: 27, category: 'Household Paper' },
    { odd: 'A25', even: 'A26', y: 31, category: 'Household / Snacks' },
    { odd: 'A23', even: 'A24', y: 35, category: 'Snacks & Bev' },
    { odd: 'A21', even: 'A22', y: 39, category: 'Grocery / Snacks' },
    { odd: 'A19', even: 'A20', y: 43, category: 'Grocery' },
    { odd: 'A17', even: 'A18', y: 47, category: 'Grocery' },
    { odd: 'A15', even: 'A16', y: 51, category: 'Grocery' },
    { odd: 'A13', even: 'A14', y: 55, category: 'Grocery' },
    { odd: 'A11', even: 'A12', y: 59, category: 'Grocery' },
    { odd: 'A9',  even: 'A10', y: 63, category: 'Alcohol / Bev' },
    { odd: 'A7',  even: 'A8',  y: 67, category: 'Alcohol / Bev' },
    { odd: 'A5',  even: 'A6',  y: 71, category: 'Food / Pantry' },
    { odd: 'A3',  even: 'A4',  y: 75, category: 'Frozen Cases' },
    { odd: 'A1',  even: 'A2',  y: 79, category: 'Frozen Cases' },
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
            <h3 className="font-extrabold text-sm text-white flex items-center gap-1.5">
              <span>{store.name}</span>
            </h3>
            <p className="text-[10px] text-slate-400 font-medium">
              Pinch or tap zoom • Drag to pan map
            </p>
          </div>
        </div>

        <span className="px-2.5 py-1 rounded-full bg-emerald-950 text-emerald-300 border border-emerald-800 text-[10px] font-extrabold">
          Single-Path Trajectory
        </span>
      </div>

      {/* SVG Interactive Floorplan Canvas */}
      <div
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onWheel={handleWheel}
        className={`relative w-full aspect-[4/3] bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden shadow-inner select-none ${
          zoomLevel > 1 ? (isDragging ? 'cursor-grabbing' : 'cursor-grab') : 'cursor-default'
        }`}
      >
        {/* Floating Zoom & Pan Controls Overlay */}
        <div className="absolute top-2.5 right-2.5 z-20 flex items-center gap-1 bg-slate-900/90 border border-slate-700/80 backdrop-blur-md p-1 rounded-xl shadow-lg">
          <button
            onClick={handleZoomIn}
            title="Zoom In"
            className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center justify-center transition cursor-pointer"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleZoomOut}
            title="Zoom Out"
            className="w-7 h-7 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center justify-center transition cursor-pointer"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          {zoomLevel > 1 && (
            <button
              onClick={handleResetZoom}
              title="Reset Zoom"
              className="px-2 h-7 rounded-lg bg-blue-600/30 text-blue-300 border border-blue-500/30 hover:bg-blue-600/50 text-[10px] font-extrabold flex items-center gap-1 transition cursor-pointer"
            >
              <RotateCcw className="w-3 h-3" />
              <span>{zoomLevel.toFixed(1)}x</span>
            </button>
          )}
        </div>

        {/* Pan Hint Overlay when Zoomed In */}
        {zoomLevel > 1 && (
          <div className="absolute bottom-2.5 left-2.5 z-20 pointer-events-none bg-slate-900/80 border border-slate-800 px-2.5 py-1 rounded-lg text-[10px] text-slate-400 font-bold flex items-center gap-1.5">
            <Move className="w-3 h-3 text-blue-400 animate-pulse" />
            <span>Drag map to pan</span>
          </div>
        )}

        <div
          className="w-full h-full transition-transform duration-100 ease-out origin-center"
          style={{
            transform: `translate(${panOffset.x}px, ${panOffset.y}px) scale(${zoomLevel})`,
          }}
        >
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

              {/* Glow filter */}
              <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="1.2" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>
            </defs>

            {/* 1. STORE EXTERIOR BOUNDARY & ENTRANCES */}
            <rect x="2" y="5" width="96" height="90" rx="3" fill="#020617" stroke="#1e293b" strokeWidth="0.6" />

            {/* Grocery Entrance Door */}
            <rect x="82" y="91" width="12" height="4" rx="1" fill="#2563eb" stroke="#ffffff" strokeWidth="0.4" />
            <text x="88" y="93.8" fill="#ffffff" fontSize="1.8" fontWeight="black" textAnchor="middle">GROCERY ENTRANCE</text>

            {/* GM Entrance Door */}
            <rect x="22" y="91" width="12" height="4" rx="1" fill="#1e293b" stroke="#475569" strokeWidth="0.4" />
            <text x="28" y="93.8" fill="#94a3b8" fontSize="1.8" fontWeight="bold" textAnchor="middle">GM ENTRANCE</text>

            {/* 2. GENERAL MERCHANDISE (GM) DEPARTMENTS (LEFT & CENTER) */}
            {/* Garden Center Y1–Y35 (Far Left) */}
            <rect x="4" y="52" width="10" height="36" rx="1.5" fill="#064e3b" stroke="#047857" strokeWidth="0.4" opacity="0.5" />
            <text x="9" y="71" fill="#6ee7b7" fontSize="1.8" fontWeight="bold" textAnchor="middle" writingMode="tb">GARDEN Y1–Y35</text>

            {/* Health & Beauty G1–G37 (Front Left) */}
            <rect x="16" y="76" width="28" height="12" rx="1.5" fill="#1e1b4b" stroke="#3730a3" strokeWidth="0.4" opacity="0.7" />
            <text x="30" y="83" fill="#c7d2fe" fontSize="1.8" fontWeight="bold" textAnchor="middle">HEALTH & BEAUTY (G1–G37)</text>

            {/* Apparel & Fashion B/C/D/E */}
            <rect x="16" y="54" width="30" height="18" rx="1.5" fill="#0f172a" stroke="#1e293b" strokeWidth="0.4" />
            <text x="31" y="64" fill="#94a3b8" fontSize="1.8" fontWeight="bold" textAnchor="middle">FASHION & SHOES (B/C/D)</text>

            {/* Baby E1–E15 */}
            <rect x="40" y="44" width="8" height="8" rx="1" fill="#311042" stroke="#701a75" strokeWidth="0.4" opacity="0.8" />
            <text x="44" y="49" fill="#f5d0fe" fontSize="1.7" fontWeight="bold" textAnchor="middle">BABY E1–E15</text>

            {/* Home, Kitchen, Bedding, Bath, Laundry H1–H53 */}
            <rect x="16" y="22" width="22" height="28" rx="1.5" fill="#1e293b" stroke="#334155" strokeWidth="0.4" opacity="0.7" />
            <text x="27" y="36" fill="#cbd5e1" fontSize="1.9" fontWeight="bold" textAnchor="middle">HOME & KITCHEN (H1–H53)</text>

            {/* Toys & Sports I1–I27 */}
            <rect x="4" y="22" width="10" height="28" rx="1.5" fill="#1c1917" stroke="#44403c" strokeWidth="0.4" />
            <text x="9" y="36" fill="#d6d3d1" fontSize="1.8" fontWeight="bold" textAnchor="middle" writingMode="tb">TOYS & SPORTS (I1–I27)</text>

            {/* Auto & Hardware L1–L27 */}
            <rect x="4" y="8" width="22" height="11" rx="1.5" fill="#0f172a" stroke="#1e293b" strokeWidth="0.4" />
            <text x="15" y="15" fill="#64748b" fontSize="1.8" fontWeight="bold" textAnchor="middle">AUTO & HARDWARE (L1–L27)</text>

            {/* Electronics K11–K21 */}
            <rect x="28" y="8" width="12" height="11" rx="1.5" fill="#1e1b4b" stroke="#312e81" strokeWidth="0.4" />
            <text x="34" y="15" fill="#a5b4fc" fontSize="1.8" fontWeight="bold" textAnchor="middle">ELECTRONICS</text>

            {/* Pets J1–J9 & Arts & Crafts J11–J23 */}
            <rect x="42" y="8" width="16" height="11" rx="1.5" fill="#1c1917" stroke="#334155" strokeWidth="0.4" />
            <text x="50" y="15" fill="#94a3b8" fontSize="1.8" fontWeight="bold" textAnchor="middle">PETS & CRAFTS (J1–J23)</text>

            {/* 3. GROCERY CENTER AISLES A1 THROUGH A32 (RIGHT SIDE) */}
            <rect x="62" y="15" width="24" height="66" rx="2" fill="#090d16" stroke="#1e293b" strokeWidth="0.5" />
            <text x="74" y="14" fill="#94a3b8" fontSize="2" fontWeight="black" textAnchor="middle">GROCERY AISLES A1–A31</text>

            {/* Draw 16 Horizontal Shelf Bars with odd & even labels */}
            {groceryAisleRows.map((aisle) => (
              <g key={aisle.odd}>
                <rect x="63" y={aisle.y - 1} width="22" height="2" rx="0.5" fill="#1e293b" stroke="#334155" strokeWidth="0.3" />
                <text x="65" y={aisle.y - 0.2} fill="#60a5fa" fontSize="1.4" fontWeight="extrabold">{aisle.odd}</text>
                <text x="83" y={aisle.y + 0.8} fill="#93c5fd" fontSize="1.4" fontWeight="extrabold" textAnchor="end">{aisle.even}</text>
              </g>
            ))}

            {/* 4. PERIMETER GROCERY DEPARTMENTS */}
            {/* Dairy Wall A33 (Top Wall above Grocery) */}
            <rect x="62" y="8" width="24" height="5" rx="1" fill="#083344" stroke="#155e75" strokeWidth="0.4" />
            <text x="74" y="11.5" fill="#67e8f9" fontSize="2" fontWeight="black" textAnchor="middle">DAIRY WALL (A33)</text>

            {/* Meat & Seafood A34/A35 (Right Wall Perimeter) */}
            <rect x="88" y="30" width="8" height="30" rx="1.5" fill="#450a0a" stroke="#991b1b" strokeWidth="0.4" />
            <text x="92" y="45" fill="#fca5a5" fontSize="2" fontWeight="black" textAnchor="middle" writingMode="tb">MEAT & SEAFOOD (A34/A35)</text>

            {/* Fresh Produce (Front Right Diagonal Tables) */}
            <g transform="translate(74, 71) rotate(-20)">
              <rect x="0" y="0" width="14" height="10" rx="2" fill="#064e3b" stroke="#047857" strokeWidth="0.4" />
              <text x="7" y="6" fill="#6ee7b7" fontSize="2" fontWeight="black" textAnchor="middle">PRODUCE</text>
            </g>

            {/* Deli AD1 (Front Center Right) */}
            <rect x="60" y="82" width="12" height="5" rx="1" fill="#701a75" stroke="#a21caf" strokeWidth="0.4" />
            <text x="66" y="85.5" fill="#f0abfc" fontSize="1.8" fontWeight="bold" textAnchor="middle">DELI (AD1)</text>

            {/* Bakery (Right Perimeter Lower) */}
            <rect x="88" y="65" width="8" height="15" rx="1.5" fill="#78350f" stroke="#b45309" strokeWidth="0.4" />
            <text x="92" y="72.5" fill="#fde68a" fontSize="2" fontWeight="black" textAnchor="middle" writingMode="tb">BAKERY</text>

            {/* Checkout Registers Z1–Z43 */}
            <rect x="34" y="86" width="34" height="4" rx="1" fill="#0f172a" stroke="#334155" strokeWidth="0.4" />
            <text x="50" y="88.8" fill="#e2e8f0" fontSize="1.9" fontWeight="bold" textAnchor="middle">REGISTERS (Z1–Z43)</text>

            {/* 5. ANIMATED CONTINUOUS SVG WALKING LINE */}
            {svgPathData && (
              <path
                d={svgPathData}
                fill="none"
                stroke="url(#walkingPathGradient)"
                strokeWidth={1.8 / Math.sqrt(zoomLevel)}
                strokeLinecap="round"
                strokeLinejoin="round"
                filter="url(#glow)"
                className="transition-all duration-500"
              />
            )}

            {/* START PIN: Grocery Entrance */}
            <circle cx={STORE_ENTRANCE_POINT.x} cy={STORE_ENTRANCE_POINT.y} r={3 / Math.sqrt(zoomLevel)} fill="#2563eb" stroke="#ffffff" strokeWidth="0.8" />
            <text x={STORE_ENTRANCE_POINT.x} y={STORE_ENTRANCE_POINT.y + 0.8} fill="#ffffff" fontSize={2 / Math.sqrt(zoomLevel)} fontWeight="black" textAnchor="middle">S</text>

            {/* END PIN: Checkout */}
            <circle cx={STORE_CHECKOUT_POINT.x} cy={STORE_CHECKOUT_POINT.y} r={3 / Math.sqrt(zoomLevel)} fill="#10b981" stroke="#ffffff" strokeWidth="0.8" />
            <text x={STORE_CHECKOUT_POINT.x} y={STORE_CHECKOUT_POINT.y + 0.8} fill="#ffffff" fontSize={2 / Math.sqrt(zoomLevel)} fontWeight="black" textAnchor="middle">E</text>

            {/* NUMBERED ITEM PINS */}
            {itemPoints.map(({ item, point, index }) => {
              const isSelected = item.id === selectedItemId;

              return (
                <g
                  key={item.id}
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedItemId(item.id);
                    onToggleComplete(item.id);
                  }}
                  className="cursor-pointer group"
                >
                  {/* Halo pulse ring */}
                  <circle
                    cx={point.x}
                    cy={point.y}
                    r={(isSelected ? 4.5 : 3.5) / Math.sqrt(zoomLevel)}
                    fill={item.completed ? "#059669" : isSelected ? "#3b82f6" : "#4f46e5"}
                    opacity={item.completed ? 0.6 : 0.9}
                    stroke="#ffffff"
                    strokeWidth={0.6 / Math.sqrt(zoomLevel)}
                    className="transition-all duration-200 group-hover:scale-110"
                  />

                  {/* Pin Index Number or Checkmark */}
                  {item.completed ? (
                    <text
                      x={point.x}
                      y={point.y + 0.8}
                      fill="#ffffff"
                      fontSize={2.2 / Math.sqrt(zoomLevel)}
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
                      fontSize={2.2 / Math.sqrt(zoomLevel)}
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
          <span>Tap any numbered pin on the map to mark items as collected!</span>
        </div>
      )}
    </div>
  );
};
