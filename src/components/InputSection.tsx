'use client';

import React, { useState } from 'react';
import { Type, Sparkles, ArrowRight, Mic, MicOff } from 'lucide-react';
import { SAMPLE_LIST_PRESETS } from '@/sampleData/sampleLists';
import { processExtractedOcrText } from '@/lib/clientOcr';
import { useVoiceInput } from '@/lib/useVoiceInput';

interface InputSectionProps {
  onItemsParsed: (rawItems: string[]) => void;
}

export const InputSection: React.FC<InputSectionProps> = ({ onItemsParsed }) => {
  const [activeTab, setActiveTab] = useState<'text' | 'voice' | 'preset'>('text');
  const [manualText, setManualText] = useState('');

  // Voice Dictation handler
  const handleVoiceTranscript = React.useCallback((newTranscript: string) => {
    setManualText((prev) => (prev ? `${prev}\n${newTranscript}` : newTranscript));
  }, []);

  const { isListening, isSupported: isVoiceSupported, toggleListening } = useVoiceInput(handleVoiceTranscript);

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const items = processExtractedOcrText(manualText);
    if (items.length > 0) {
      onItemsParsed(items);
    }
  };

  const handleSelectPreset = (items: string[]) => {
    onItemsParsed(items);
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-4 animate-in fade-in duration-300">
      {/* Input Mode Selector Tabs */}
      <div className="grid grid-cols-3 gap-1.5 p-1.5 bg-slate-900 border border-slate-800 rounded-2xl shadow-lg">
        <button
          type="button"
          onClick={() => setActiveTab('text')}
          className={`py-2.5 px-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === 'text'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <Type className="w-4 h-4" />
          <span>Type</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('voice')}
          className={`py-2.5 px-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === 'voice'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <Mic className={`w-4 h-4 ${isListening ? 'text-rose-400 animate-pulse' : ''}`} />
          <span>Dictate</span>
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('preset')}
          className={`py-2.5 px-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === 'preset'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <Sparkles className="w-4 h-4 text-amber-300" />
          <span>Demos</span>
        </button>
      </div>

      {/* TAB 1: Manual Text Area Input */}
      {activeTab === 'text' && (
        <form onSubmit={handleManualSubmit} className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-4">
          <div className="space-y-1">
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              <Type className="w-4 h-4 text-blue-400" />
              Manual Item Input
            </h2>
            <p className="text-xs text-slate-400">
              Type or paste your grocery items (one item per line)
            </p>
          </div>

          <textarea
            rows={7}
            value={manualText}
            onChange={(e) => setManualText(e.target.value)}
            placeholder={`2% Whole Milk\nBananas\nGround Beef\nTomato Soup\nCheerios\nPaper Towels\nIce Cream`}
            className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-blue-500 font-mono transition-colors resize-none"
          />

          <button
            type="submit"
            disabled={!manualText.trim()}
            className="w-full py-3.5 px-4 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-extrabold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Parse Items & Review</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      )}

      {/* TAB 2: Voice Dictation Mode */}
      {activeTab === 'voice' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl text-center space-y-4">
          <div className="space-y-1">
            <h2 className="text-base font-bold text-white flex items-center justify-center gap-2">
              <Mic className="w-5 h-5 text-rose-400" />
              Voice List Dictation
            </h2>
            <p className="text-xs text-slate-400">
              Speak out loud: &quot;Milk, Eggs, Chicken, Paper Towels...&quot;
            </p>
          </div>

          {!isVoiceSupported ? (
            <div className="p-4 rounded-xl bg-amber-950/40 border border-amber-800 text-xs text-amber-300">
              Browser speech recognition is not supported in this browser. Please use Chrome or Safari!
            </div>
          ) : (
            <div className="space-y-4">
              <button
                type="button"
                onClick={toggleListening}
                className={`w-24 h-24 rounded-full mx-auto flex items-center justify-center transition-all duration-300 shadow-xl cursor-pointer ${
                  isListening
                    ? 'bg-rose-600 text-white animate-pulse shadow-rose-600/50 ring-8 ring-rose-500/30'
                    : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-2 border-slate-700'
                }`}
              >
                {isListening ? <Mic className="w-10 h-10" /> : <MicOff className="w-10 h-10 text-slate-400" />}
              </button>

              <p className="text-xs font-bold text-slate-300">
                {isListening ? '🎙️ Listening... Speak your grocery items now!' : 'Tap microphone to start dictation'}
              </p>

              <textarea
                rows={5}
                value={manualText}
                onChange={(e) => setManualText(e.target.value)}
                placeholder="Spoken items will appear here line-by-line..."
                className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-sm text-slate-100 placeholder-slate-600 focus:outline-none focus:border-blue-500 font-mono transition-colors resize-none"
              />

              <button
                type="button"
                onClick={handleManualSubmit}
                disabled={!manualText.trim()}
                className="w-full py-3.5 px-4 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-extrabold text-sm rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Parse Dictated List</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: Preset Demo Sample Cards */}
      {activeTab === 'preset' && (
        <div className="space-y-3">
          <div className="text-center space-y-1 px-1">
            <h2 className="text-sm font-bold text-slate-200 flex items-center justify-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-400" />
              Select a Demo List
            </h2>
            <p className="text-xs text-slate-400">
              Test AislePilot instantly with pre-loaded shopping list cards
            </p>
          </div>

          <div className="grid grid-cols-1 gap-2.5">
            {SAMPLE_LIST_PRESETS.map((preset) => (
              <button
                key={preset.id}
                type="button"
                onClick={() => handleSelectPreset(preset.items)}
                className="w-full p-4 rounded-xl bg-slate-900 hover:bg-slate-800/80 border border-slate-800 hover:border-blue-500/60 transition-all text-left group shadow-lg flex items-center justify-between cursor-pointer"
              >
                <div className="space-y-1 pr-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-slate-100 group-hover:text-blue-400 transition-colors">
                      {preset.title}
                    </span>
                    <span className="px-2 py-0.5 text-[10px] font-extrabold rounded-full bg-blue-950 text-blue-300 border border-blue-800">
                      {preset.badgeText}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 line-clamp-1">{preset.description}</p>
                </div>
                <ArrowRight className="w-5 h-5 text-slate-500 group-hover:text-blue-400 group-hover:translate-x-1 transition-all shrink-0" />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
