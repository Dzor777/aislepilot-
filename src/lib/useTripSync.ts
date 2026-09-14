'use client';

import { useEffect, useRef } from 'react';
import { MappedGroceryItem } from './types';

export interface TripSyncMessage {
  type: 'SYNC_ITEMS' | 'TOGGLE_ITEM' | 'RESET_TRIP';
  senderId: string;
  items?: MappedGroceryItem[];
  itemId?: string;
  timestamp: number;
}

export function useTripSync(
  onRemoteItemsUpdate: (items: MappedGroceryItem[]) => void,
  onRemoteToggleItem: (itemId: string) => void
) {
  const senderIdRef = useRef<string>(`client-${Math.random().toString(36).substring(2, 9)}`);
  const channelRef = useRef<BroadcastChannel | null>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // 1. Initialize BroadcastChannel if supported
    if ('BroadcastChannel' in window) {
      try {
        const channel = new BroadcastChannel('aislepilot_family_sync');
        channelRef.current = channel;

        channel.onmessage = (e: MessageEvent<TripSyncMessage>) => {
          const msg = e.data;
          if (!msg || msg.senderId === senderIdRef.current) return;

          if (msg.type === 'SYNC_ITEMS' && msg.items) {
            onRemoteItemsUpdate(msg.items);
          } else if (msg.type === 'TOGGLE_ITEM' && msg.itemId) {
            onRemoteToggleItem(msg.itemId);
          }
        };
      } catch (err) {
        console.warn('BroadcastChannel error:', err);
      }
    }

    // 2. Storage Event Listener for multi-tab fallback
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'aislepilot_active_trip_state' && e.newValue) {
        try {
          const state = JSON.parse(e.newValue);
          if (state && Array.isArray(state.items)) {
            onRemoteItemsUpdate(state.items);
          }
        } catch (err) {
          console.warn('Error handling storage sync event:', err);
        }
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      if (channelRef.current) {
        channelRef.current.close();
      }
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [onRemoteItemsUpdate, onRemoteToggleItem]);

  const broadcastSync = (type: 'SYNC_ITEMS' | 'TOGGLE_ITEM', payload?: { items?: MappedGroceryItem[]; itemId?: string }) => {
    if (channelRef.current) {
      try {
        channelRef.current.postMessage({
          type,
          senderId: senderIdRef.current,
          items: payload?.items,
          itemId: payload?.itemId,
          timestamp: Date.now(),
        } as TripSyncMessage);
      } catch (err) {
        console.warn('Error broadcasting sync message:', err);
      }
    }
  };

  return { broadcastSync };
}
