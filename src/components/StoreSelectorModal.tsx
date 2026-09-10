'use client';

import React, { useState } from 'react';
import { X, MapPin, Search, Check, Sparkles, Database } from 'lucide-react';
import { WalmartStoreProfile } from '@/lib/types';
import { DEFAULT_WALMART_STORES } from '@/sampleData/walmartStores';

interface StoreSelectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentStore: WalmartStoreProfile;
  onSelectStore: (store: WalmartStoreProfile) => void;
}

export const StoreSelectorModal: React.FC<StoreSelectorModalProps> = ({
  isOpen,
  onClose,
  currentStore,
  onSelectStore,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [customZip, setCustomZip] = useState('');

  if (!isOpen) return null;

  const filteredStores = DEFAULT_WALMART_STORES.filter(
    (store) =>
      store.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      store.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      store.zipCode.includes(searchQuery) ||
      store.storeNumber.includes(searchQuery)
  );

  const handleCreateCustomStore = () => {
    if (!customZip.trim()) return;
    const newStore: WalmartStoreProfile = {
      id: `custom-store-${customZip}`,
      storeNumber: customZip,
      name: `Walmart Supercenter #${customZip}`,
      city: 'Local Store',
      state: 'US',
      zipCode: customZip,
      type: 'Supercenter',
      entranceType: 'GM & Grocery',
    };
    onSelectStore(newStore);
    setCustomZip('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-t-2xl sm:rounded-2xl overflow-hidden shadow-2xl text-white max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-900">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <MapPin className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-100">Select Walmart Store</h3>
              <p className="text-xs text-slate-400">Sets aisle mapping & local memory</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 overflow-y-auto space-y-4 flex-1">
          {/* Search Input */}
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-3 text-slate-400" />
            <input
              type="text"
              placeholder="Search store number, city, or zip code..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500 transition-colors"
            />
          </div>

          {/* Store List */}
          <div className="space-y-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 px-1">
              Popular Walmart Supercenters
            </p>
            {filteredStores.map((store) => {
              const isSelected = store.id === currentStore.id;
              return (
                <button
                  key={store.id}
                  onClick={() => {
                    onSelectStore(store);
                    onClose();
                  }}
                  className={`w-full p-3 rounded-xl border text-left transition-all flex items-center justify-between ${
                    isSelected
                      ? 'bg-blue-600/15 border-blue-500/80 text-white shadow-md'
                      : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-9 h-9 rounded-lg flex items-center justify-center text-xs font-bold ${
                        isSelected
                          ? 'bg-blue-600 text-white shadow-sm'
                          : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      #{store.storeNumber}
                    </div>
                    <div>
                      <div className="font-semibold text-sm">{store.name}</div>
                      <div className="text-xs text-slate-400">
                        {store.city}, {store.state} {store.zipCode} • {store.type}
                      </div>
                    </div>
                  </div>
                  {isSelected && <Check className="w-5 h-5 text-blue-400 shrink-0" />}
                </button>
              );
            })}
          </div>

          {/* Custom Zip Code Lookup Box */}
          <div className="p-3 rounded-xl bg-slate-950/80 border border-slate-800/80 space-y-2">
            <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>Or enter your specific Store ID / Zip:</span>
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="e.g. 72712 or 100"
                value={customZip}
                onChange={(e) => setCustomZip(e.target.value)}
                className="flex-1 px-3 py-2 bg-slate-900 border border-slate-700 rounded-lg text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-blue-500"
              />
              <button
                onClick={handleCreateCustomStore}
                disabled={!customZip.trim()}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white text-sm font-semibold rounded-lg transition-colors"
              >
                Set Store
              </button>
            </div>
          </div>

          {/* 3-Layer Parsing Explanation Banner */}
          <div className="p-3 rounded-xl bg-blue-950/40 border border-blue-800/40 text-xs text-blue-200/90 space-y-1">
            <div className="font-semibold text-blue-300 flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5 text-blue-400" />
              Persistent Local Memory
            </div>
            <p>
              When you edit an aisle tag for this store, AislePilot automatically remembers your custom location in your browser so future lists use your store&apos;s exact layout!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
