'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Header } from '@/components/Header';
import { StoreSelectorModal } from '@/components/StoreSelectorModal';
import { InputSection } from '@/components/InputSection';
import { ItemReviewList } from '@/components/ItemReviewList';
import { RouteView } from '@/components/RouteView';
import { FamilyPortalModal } from '@/components/FamilyPortalModal';
import { ListTemplatesModal } from '@/components/ListTemplatesModal';
import { TripHistoryModal } from '@/components/TripHistoryModal';
import { WalmartStoreProfile, MappedGroceryItem, FamilyUserProfile } from '@/lib/types';
import { DEFAULT_WALMART_STORES } from '@/sampleData/walmartStores';
import { mapAndOptimizeGroceryRoute } from '@/lib/routeOptimizer';
import { CacheManager } from '@/lib/cacheManager';
import { useTripSync } from '@/lib/useTripSync';
import { RotateCcw } from 'lucide-react';

export default function Home() {
  const [currentStore, setCurrentStore] = useState<WalmartStoreProfile>(DEFAULT_WALMART_STORES[0]);
  const [isStoreModalOpen, setIsStoreModalOpen] = useState(false);
  const [step, setStep] = useState<'input' | 'review' | 'route'>('input');

  // Modal states for new roadmap features
  const [isFamilyModalOpen, setIsFamilyModalOpen] = useState(false);
  const [isTemplatesModalOpen, setIsTemplatesModalOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [activeProfile, setActiveProfile] = useState<FamilyUserProfile>(CacheManager.getActiveUserProfile());

  // Active Trip states
  const [rawItems, setRawItems] = useState<string[]>([]);
  const [mappedItems, setMappedItems] = useState<MappedGroceryItem[]>([]);
  const [tripStartTime, setTripStartTime] = useState<number>(Date.now());
  const [hasRestoredActiveTrip, setHasRestoredActiveTrip] = useState(false);

  // Load saved store preference & active trip state on initial mount
  useEffect(() => {
    try {
      const savedStore = localStorage.getItem('aislepilot_selected_store');
      if (savedStore) {
        setCurrentStore(JSON.parse(savedStore));
      }

      // Restore active trip if available
      const savedTrip = CacheManager.getActiveTripState();
      if (savedTrip && savedTrip.items && savedTrip.items.length > 0) {
        setMappedItems(savedTrip.items);
        setStep(savedTrip.step || 'route');
        if (savedTrip.startTime) setTripStartTime(savedTrip.startTime);
        setHasRestoredActiveTrip(true);
      }
    } catch (e) {
      console.warn('Error reading saved state', e);
    }
  }, []);

  // Save active trip state whenever items or step change
  useEffect(() => {
    if (mappedItems.length > 0) {
      CacheManager.saveActiveTripState({
        items: mappedItems,
        storeId: currentStore.id,
        step,
        startTime: tripStartTime,
      });
    } else if (step === 'input') {
      CacheManager.clearActiveTripState();
    }
  }, [mappedItems, step, currentStore.id, tripStartTime]);

  // Real-Time Cross-Tab Sync
  const handleRemoteItemsUpdate = useCallback((newItems: MappedGroceryItem[]) => {
    setMappedItems(newItems);
  }, []);

  const handleRemoteToggleItem = useCallback((itemId: string) => {
    setMappedItems((prev) =>
      prev.map((i) => (i.id === itemId ? { ...i, completed: !i.completed } : i))
    );
  }, []);

  const { broadcastSync } = useTripSync(handleRemoteItemsUpdate, handleRemoteToggleItem);

  const handleSelectStore = (store: WalmartStoreProfile) => {
    setCurrentStore(store);
    try {
      localStorage.setItem('aislepilot_selected_store', JSON.stringify(store));
    } catch (e) {
      console.warn('Error saving store preference', e);
    }

    if (mappedItems.length > 0) {
      const raw = mappedItems.map((i) => i.originalText);
      const reoptimized = mapAndOptimizeGroceryRoute(raw, store.id);
      setMappedItems(reoptimized);
      broadcastSync('SYNC_ITEMS', { items: reoptimized });
    }
  };

  // STEP 1 -> STEP 2: Items parsed from scan/manual/preset/templates
  const handleItemsParsed = (items: string[]) => {
    setRawItems(items);
    setStep('review');
  };

  // STEP 2 -> STEP 3: Generate optimal store route
  const handleGenerateRoute = () => {
    const optimized = mapAndOptimizeGroceryRoute(rawItems, currentStore.id);
    setMappedItems(optimized);
    setTripStartTime(Date.now());
    setStep('route');
    broadcastSync('SYNC_ITEMS', { items: optimized });
  };

  // Shopping Mode: Toggle item completed checkmark
  const handleToggleComplete = (id: string) => {
    setMappedItems((prev) => {
      const updated = prev.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item
      );

      // Check if all items are completed to log trip history
      const allDone = updated.length > 0 && updated.every((i) => i.completed);
      if (allDone) {
        const durationSeconds = Math.max(Math.round((Date.now() - tripStartTime) / 1000), 60);
        CacheManager.recordCompletedTrip({
          storeName: currentStore.name,
          storeId: currentStore.id,
          itemCount: updated.length,
          completedItemCount: updated.length,
          durationSeconds,
          savedFeet: updated.length * 135,
          items: updated.map((i) => ({ cleanName: i.cleanName, aisleTag: i.aisleTag, completed: true })),
        });
      }

      broadcastSync('TOGGLE_ITEM', { itemId: id });
      return updated;
    });
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

      broadcastSync('SYNC_ITEMS', { items: updated });
      return updated;
    });
  };

  // Shopping Mode: Add item mid-trip
  const handleAddItemMidTrip = (itemText: string) => {
    const combinedRaw = [...mappedItems.map((i) => i.originalText), itemText];
    const reoptimized = mapAndOptimizeGroceryRoute(combinedRaw, currentStore.id);

    const completedMap = new Set(mappedItems.filter((i) => i.completed).map((i) => i.cleanName.toLowerCase()));
    const merged = reoptimized.map((item) => ({
      ...item,
      completed: completedMap.has(item.cleanName.toLowerCase()),
    }));

    setMappedItems(merged);
    broadcastSync('SYNC_ITEMS', { items: merged });
  };

  const handleResetTrip = () => {
    setRawItems([]);
    setMappedItems([]);
    setStep('input');
    setHasRestoredActiveTrip(false);
    CacheManager.clearActiveTripState();
  };

  const handleSelectTemplate = (templateItems: string[]) => {
    handleItemsParsed(templateItems);
  };

  const handleSelectProfile = (profile: FamilyUserProfile) => {
    setActiveProfile(profile);
    CacheManager.setActiveUserProfile(profile);
  };

  return (
    <main className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      {/* Sticky Top Header */}
      <Header
        currentStore={currentStore}
        onOpenStoreModal={() => setIsStoreModalOpen(true)}
        currentStep={step}
        onNavigateStep={(targetStep) => setStep(targetStep)}
        activeProfile={activeProfile}
        onOpenFamilyModal={() => setIsFamilyModalOpen(true)}
        onOpenTemplatesModal={() => setIsTemplatesModalOpen(true)}
        onOpenHistoryModal={() => setIsHistoryModalOpen(true)}
      />

      {/* Main Content Area */}
      <div className="flex-1 max-w-md mx-auto w-full px-4 py-4 space-y-4">
        {/* Active Trip Auto-Restored Banner */}
        {hasRestoredActiveTrip && step === 'route' && (
          <div className="p-3 rounded-2xl bg-blue-950/50 border border-blue-800/60 text-xs text-blue-200 flex items-center justify-between animate-in fade-in">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              <span>Active Trip Auto-Restored ({mappedItems.filter(i => i.completed).length}/{mappedItems.length} items got)</span>
            </div>
            <button
              onClick={handleResetTrip}
              className="text-[11px] font-bold text-slate-400 hover:text-white underline"
            >
              Start New Trip
            </button>
          </div>
        )}

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

      {/* Family Multi-User Sync Portal Modal */}
      <FamilyPortalModal
        isOpen={isFamilyModalOpen}
        onClose={() => setIsFamilyModalOpen(false)}
        currentProfile={activeProfile}
        onSelectProfile={handleSelectProfile}
      />

      {/* Saved List Templates Modal */}
      <ListTemplatesModal
        isOpen={isTemplatesModalOpen}
        onClose={() => setIsTemplatesModalOpen(false)}
        onSelectTemplate={handleSelectTemplate}
      />

      {/* Trip History & Efficiency Analytics Modal */}
      <TripHistoryModal
        isOpen={isHistoryModalOpen}
        onClose={() => setIsHistoryModalOpen(false)}
      />
    </main>
  );
}

