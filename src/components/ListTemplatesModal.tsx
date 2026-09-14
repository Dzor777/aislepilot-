'use client';

import React, { useState } from 'react';
import { SavedListTemplate } from '@/lib/types';
import { CacheManager } from '@/lib/cacheManager';
import { Bookmark, X, Sparkles, Trash2, ArrowRight } from 'lucide-react';

interface ListTemplatesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTemplate: (items: string[]) => void;
}

export const ListTemplatesModal: React.FC<ListTemplatesModalProps> = ({
  isOpen,
  onClose,
  onSelectTemplate,
}) => {
  const [templates, setTemplates] = useState<SavedListTemplate[]>(CacheManager.getSavedTemplates());

  if (!isOpen) return null;

  const handleDeleteCustom = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    CacheManager.deleteCustomTemplate(id);
    setTemplates(CacheManager.getSavedTemplates());
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md p-6 shadow-2xl space-y-6 relative overflow-hidden max-h-[85vh] flex flex-col">
        {/* Top Header */}
        <div className="flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
              <Bookmark className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-white">Saved List Templates</h2>
              <p className="text-xs text-slate-400">1-click load favorite grocery runs</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl bg-slate-800/60 hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* List of Templates */}
        <div className="space-y-3 overflow-y-auto pr-1 flex-1">
          {templates.map((template) => (
            <div
              key={template.id}
              onClick={() => {
                onSelectTemplate(template.items);
                onClose();
              }}
              className="p-4 rounded-2xl bg-slate-950 border border-slate-800 hover:border-blue-500/80 hover:bg-slate-900/60 transition-all cursor-pointer group space-y-2 relative"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <span className="text-2xl">{template.emoji}</span>
                  <div>
                    <h3 className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors">
                      {template.title}
                    </h3>
                    <p className="text-xs text-slate-400">{template.description}</p>
                  </div>
                </div>

                {!template.isPreset && (
                  <button
                    onClick={(e) => handleDeleteCustom(e, template.id)}
                    className="p-1.5 text-slate-500 hover:text-rose-400 rounded-lg hover:bg-slate-800 transition-colors"
                    title="Delete template"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Items Preview Pills */}
              <div className="flex flex-wrap gap-1.5 pt-1">
                {template.items.slice(0, 4).map((item, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 rounded-lg bg-slate-900 border border-slate-800 text-[10px] text-slate-300 font-semibold"
                  >
                    {item}
                  </span>
                ))}
                {template.items.length > 4 && (
                  <span className="px-2 py-0.5 rounded-lg bg-blue-950/60 text-blue-300 text-[10px] font-bold border border-blue-800/40">
                    +{template.items.length - 4} more
                  </span>
                )}
              </div>

              {/* Hover Action */}
              <div className="flex items-center justify-end gap-1 text-[11px] font-extrabold text-blue-400 pt-1 group-hover:translate-x-0.5 transition-transform">
                <span>Load List</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
