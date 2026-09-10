'use client';

import React, { useState, useEffect } from 'react';
import { Header } from '@/components/Header';
import { StoreSelectorModal } from '@/components/StoreSelectorModal';
import { InputSection } from '@/components/InputSection';
import { ItemReviewList } from '@/components/ItemReviewList';
import { RouteView } from '@/components/RouteView';
import { WalmartStoreProfile, MappedGroceryItem } from '@/lib/types';
import { DEFAULT_WALMART_STORES } from '@/sampleData/walmartStores';
import { mapAndOptimizeGroceryRoute } from '@/lib/routeOptimizer';
import { CacheManager } from '@/lib/cacheManager';

export default function Home() {
  const [currentStore, setCurrentStore] = useState<WalmartStoreProfile>(DEFAULT_WALMART_STORES[0]);
  const [isStoreModalOpen, setIsStoreModalOpen] = useState(false);
  const [step, setStep] = useState<'input' | 'review' | 'route'>('input');

  // Item states
  const [rawItems, setRawItems] = useState<string[]>([]);
  const [mappedItems, setMappedItems] = useState<MappedGroceryItem[]>([]);

  // Load saved store preference if available
  useEffect(() => {
    try {
      const savedStore = localStorage.getItem('aislepilot_selected_store');
      if (savedStore) {
        setCurrentStore(JSON.parse(savedStore));
      }
    } catch (e) {
      console.warn('Error reading saved store', e);
    }
  }, []);

  const handleSelectStore = (store: WalmartStoreProfile) => {
    setCurrentStore(store);
    try {
      localStorage.setItem('aislepilot_selected_store', JSON.stringify(store));
    } catch (e) {
      console.warn('Error saving store preference', e);
    }

    // Re-optimize route if currently on route step
    if (mappedItems.length > 0) {
      const raw = mappedItems.map((i) => i.originalText);
      const reoptimized = mapAndOptimizeGroceryRoute(raw, store.id);
      setMappedItems(reoptimized);
    }
  };

  // STEP 1 -> STEP 2: Scanned/typed items parsed
  const handleItemsParsed = (items: string[]) => {
    setRawItems(items);
    setStep('review');
  };

  // STEP 2 -> STEP 3: Generate optimal store route
  const handleGenerateRoute = () => {
    const optimized = mapAndOptimizeGroceryRoute(rawItems, currentStore.id);
    setMappedItems(optimized);
    setStep('route');
  };

  // Shopping Mode: Toggle item completed checkmark
  const handleToggleComplete = (id: string) => {
    setMappedItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, completed: !item.completed } : item))
    );
  };

  // Shopping Mode: User edits aisle location for their specific store
  const handleEditAisleLocation = (
    id: string,
    newAisleTag: string,
    newAisleNumber: number
  ) => {
    setMappedItems((prev) => {
      const updated = prev.map((item) => {
        if (item.id === id) {
          // Save custom override to persistent local cache
          CacheManager.saveCustomAisle(
            currentStore.id,
            item.cleanName,
            newAisleTag,
            newAisleNumber
          );
          return {
            ...item,
            aisleTag: newAisleTag,
            aisleNumber: newAisleNumber,
            isCustomLocation: true,
          };
        }
        return item;
      });

      // Re-sort items according to new topological position
      return updated.sort((a, b) => {
        const keyA = (a.zoneId === 'ZONE_6_FROZEN' ? 6 : a.zoneId === 'ZONE_4_DAIRY' ? 4 : 2) * 1000 + a.aisleNumber;
        const keyB = (b.zoneId === 'ZONE_6_FROZEN' ? 6 : b.zoneId === 'ZONE_4_DAIRY' ? 4 : 2) * 1000 + b.aisleNumber;
        return keyA - keyB;
      });
    });
  };

  // Shopping Mode: Add item mid-trip
  const handleAddItemMidTrip = (itemText: string) => {
    const combinedRaw = [...mappedItems.map((i) => i.originalText), itemText];
    const reoptimized = mapAndOptimizeGroceryRoute(combinedRaw, currentStore.id);

    // Preserve completed states for existing items
    const completedMap = new Set(mappedItems.filter((i) => i.completed).map((i) => i.cleanName.toLowerCase()));

    const merged = reoptimized.map((item) => ({
      ...item,
      completed: completedMap.has(item.cleanName.toLowerCase()),
    }));

    setMappedItems(merged);
  };

  const handleResetTrip = () => {
    setRawItems([]);
    setMappedItems([]);
    setStep('input');
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* Sticky Top Header */}
      <Header
        currentStore={currentStore}
        onOpenStoreModal={() => setIsStoreModalOpen(true)}
        currentStep={step}
        onNavigateStep={(targetStep) => setStep(targetStep)}
      />

      {/* Main Content Area */}
      <div className="flex-1 max-w-md mx-auto w-full px-4 py-4">
        {step === 'input' && (
          <InputSection onItemsParsed={handleItemsParsed} />
        )}

        {step === 'review' && (
          <ItemReviewList
            items={rawItems}
            onUpdateItems={(updated) => setRawItems(updated)}
            onGenerateRoute={handleGenerateRoute}
            onReset={handleResetTrip}
          />
        )}

        {step === 'route' && (
          <RouteView
            items={mappedItems}
            store={currentStore}
            onToggleComplete={handleToggleComplete}
            onEditAisleLocation={handleEditAisleLocation}
            onAddItemMidTrip={handleAddItemMidTrip}
            onBackToReview={() => setStep('review')}
            onNewTrip={handleResetTrip}
          />
        )}
      </div>

      {/* Store Selector Modal */}
      <StoreSelectorModal
        isOpen={isStoreModalOpen}
        onClose={() => setIsStoreModalOpen(false)}
        currentStore={currentStore}
        onSelectStore={handleSelectStore}
      />
    </main>
  );
}
