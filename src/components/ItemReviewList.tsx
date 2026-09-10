'use client';

import React, { useState } from 'react';
import { Trash2, Edit3, Plus, ArrowRight, Check, ListChecks, RefreshCw } from 'lucide-react';

interface ItemReviewListProps {
  items: string[];
  onUpdateItems: (updatedItems: string[]) => void;
  onGenerateRoute: () => void;
  onReset: () => void;
}

export const ItemReviewList: React.FC<ItemReviewListProps> = ({
  items,
  onUpdateItems,
  onGenerateRoute,
  onReset,
}) => {
  const [editingIdx, setEditingIdx] = useState<number | null>(null);
  const [editingText, setEditingText] = useState('');
  const [newItemText, setNewItemText] = useState('');
  const [isAddingItem, setIsAddingItem] = useState(false);

  const handleStartEdit = (index: number) => {
    setEditingIdx(index);
    setEditingText(items[index]);
  };

  const handleSaveEdit = (index: number) => {
    if (editingText.trim()) {
      const copy = [...items];
      copy[index] = editingText.trim();
      onUpdateItems(copy);
    }
    setEditingIdx(null);
  };

  const handleDelete = (index: number) => {
    const copy = items.filter((_, i) => i !== index);
    onUpdateItems(copy);
  };

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (newItemText.trim()) {
      onUpdateItems([...items, newItemText.trim()]);
      setNewItemText('');
      setIsAddingItem(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-4 animate-in fade-in duration-300">
      {/* Header Info Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 font-extrabold text-sm">
            {items.length}
          </div>
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-1.5">
              <ListChecks className="w-4 h-4 text-blue-400" />
              Review Your List
            </h2>
            <p className="text-xs text-slate-400">
              Edit misspellings or add missing items before building route
            </p>
          </div>
        </div>

        <button
          onClick={onReset}
          className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors"
          title="Rescan or restart list"
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>

      {/* Item List Container */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-3 shadow-xl space-y-2 max-h-[55vh] overflow-y-auto">
        {items.length === 0 ? (
          <div className="p-8 text-center space-y-3">
            <p className="text-sm text-slate-400">Your shopping list is currently empty.</p>
            <button
              onClick={onReset}
              className="px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-lg"
            >
              Add Items
            </button>
          </div>
        ) : (
          items.map((item, idx) => {
            const isEditing = editingIdx === idx;
            return (
              <div
                key={`review-item-${idx}`}
                className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 hover:border-slate-700 transition-all flex items-center justify-between gap-2"
              >
                {isEditing ? (
                  <div className="flex-1 flex items-center gap-2">
                    <input
                      type="text"
                      value={editingText}
                      onChange={(e) => setEditingText(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSaveEdit(idx)}
                      autoFocus
                      className="flex-1 px-3 py-1.5 bg-slate-900 border border-blue-500 rounded-lg text-sm text-white focus:outline-none"
                    />
                    <button
                      onClick={() => handleSaveEdit(idx)}
                      className="p-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-500 transition-colors"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      <span className="w-6 h-6 rounded-full bg-slate-800 text-slate-400 font-mono text-xs flex items-center justify-center font-semibold shrink-0">
                        {idx + 1}
                      </span>
                      <span className="text-sm font-medium text-slate-200 truncate">
                        {item}
                      </span>
                    </div>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => handleStartEdit(idx)}
                        className="p-1.5 text-slate-400 hover:text-blue-400 hover:bg-slate-800 rounded-lg transition-colors"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(idx)}
                        className="p-1.5 text-slate-400 hover:text-red-400 hover:bg-slate-800 rounded-lg transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </>
                )}
              </div>
            );
          })
        )}

        {/* Add Item Form */}
        {isAddingItem ? (
          <form onSubmit={handleAddItem} className="p-2 flex items-center gap-2">
            <input
              type="text"
              placeholder="e.g. Avocado, Paper Towels..."
              value={newItemText}
              onChange={(e) => setNewItemText(e.target.value)}
              autoFocus
              className="flex-1 px-3 py-2 bg-slate-950 border border-blue-500 rounded-xl text-sm text-white focus:outline-none"
            />
            <button
              type="submit"
              disabled={!newItemText.trim()}
              className="px-3 py-2 bg-blue-600 disabled:opacity-50 text-white text-xs font-bold rounded-xl"
            >
              Add
            </button>
            <button
              type="button"
              onClick={() => setIsAddingItem(false)}
              className="px-2 py-2 text-slate-400 hover:text-slate-200 text-xs"
            >
              Cancel
            </button>
          </form>
        ) : (
          <button
            onClick={() => setIsAddingItem(true)}
            className="w-full py-2.5 px-3 border border-dashed border-slate-700 hover:border-blue-500 rounded-xl text-slate-400 hover:text-blue-400 text-xs font-semibold transition-all flex items-center justify-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Add Extra Item</span>
          </button>
        )}
      </div>

      {/* Action Button to Generate Store Route */}
      <button
        onClick={onGenerateRoute}
        disabled={items.length === 0}
        className="w-full py-4 px-6 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 hover:from-blue-500 hover:to-indigo-500 disabled:opacity-50 text-white font-extrabold text-base rounded-2xl shadow-xl shadow-blue-600/30 transition-all flex items-center justify-center gap-2 active:scale-[0.98]"
      >
        <span>Generate Store Route</span>
        <ArrowRight className="w-5 h-5" />
      </button>
    </div>
  );
};
