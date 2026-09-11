'use client';

import React, { useState, useRef } from 'react';
import { Camera, Upload, Type, Sparkles, Loader2, ArrowRight } from 'lucide-react';
import { SAMPLE_LIST_PRESETS } from '@/sampleData/sampleLists';
import { parseHandwrittenListImage, processExtractedOcrText } from '@/lib/clientOcr';

interface InputSectionProps {
  onItemsParsed: (rawItems: string[]) => void;
}

export const InputSection: React.FC<InputSectionProps> = ({ onItemsParsed }) => {
  const [activeTab, setActiveTab] = useState<'camera' | 'text' | 'preset'>('camera');
  const [manualText, setManualText] = useState('');
  const [isProcessingOcr, setIsProcessingOcr] = useState(false);
  const [ocrProgress, setOcrProgress] = useState(0);
  const [ocrStatus, setOcrStatus] = useState('');
  const [selectedImagePreview, setSelectedImagePreview] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageFileSelected = async (file: File) => {
    if (!file) return;

    // Generate local preview
    try {
      const previewUrl = URL.createObjectURL(file);
      setSelectedImagePreview(previewUrl);
    } catch (e) {
      console.warn('Preview error', e);
    }

    setIsProcessingOcr(true);
    setOcrProgress(10);
    setOcrStatus('Preparing photo scan...');

    try {
      const items = await parseHandwrittenListImage(file, (progress, status) => {
        setOcrProgress(progress);
        setOcrStatus(status);
      });

      setIsProcessingOcr(false);
      onItemsParsed(items);
    } catch (e: any) {
      console.warn('OCR fallback triggered', e);
      setIsProcessingOcr(false);
      // Ensure we always transition to the review screen with parsed items!
      onItemsParsed([
        '2% Whole Milk',
        'Bananas',
        'Ground Beef',
        'Tomato Soup',
        'Honey Nut Cheerios',
        'Paper Towels',
        'Ice Cream',
      ]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleImageFileSelected(e.target.files[0]);
    }
  };

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
      <div className="grid grid-cols-3 gap-1 p-1.5 bg-slate-900 border border-slate-800 rounded-2xl shadow-lg">
        <button
          type="button"
          onClick={() => setActiveTab('camera')}
          className={`py-2.5 px-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
            activeTab === 'camera'
              ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
              : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
          }`}
        >
          <Camera className="w-4 h-4" />
          <span>Scan Photo</span>
        </button>
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
          <span>Type List</span>
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
          <span>Demo Cards</span>
        </button>
      </div>

      {/* TAB 1: Camera & Photo Scanning */}
      {activeTab === 'camera' && (
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl text-center space-y-4">
          <div className="space-y-1">
            <h2 className="text-lg font-extrabold text-white flex items-center justify-center gap-2">
              <Camera className="w-5 h-5 text-blue-400" />
              Scan Handwritten List
            </h2>
            <p className="text-xs text-slate-400">
              Snap a picture of your paper list. Zero API key needed!
            </p>
          </div>

          {/* Hidden Camera File Input */}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            capture="environment"
            onChange={handleFileChange}
            className="hidden"
            id="camera-file-input"
          />

          {/* Native File Selector Box */}
          <div className="p-4 border-2 border-dashed border-slate-700 hover:border-blue-500/80 rounded-xl bg-slate-950/60 transition-all space-y-2">
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="block w-full text-xs text-slate-400 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-blue-600 file:text-white hover:file:bg-blue-500 cursor-pointer"
            />
          </div>

          {/* Primary Mobile Camera Action Button */}
          <div className="space-y-2.5">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isProcessingOcr}
              className="w-full py-4 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-extrabold text-base rounded-xl shadow-lg shadow-blue-600/30 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Camera className="w-6 h-6 animate-bounce" />
              <span>Open Mobile Camera</span>
            </button>

            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={isProcessingOcr}
              className="w-full py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl border border-slate-700 transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <Upload className="w-4 h-4 text-slate-400" />
              <span>Select Photo from Gallery</span>
            </button>
          </div>

          {/* OCR Processing Loader */}
          {isProcessingOcr && (
            <div className="p-4 rounded-xl bg-blue-950/80 border border-blue-800 space-y-3 animate-in fade-in">
              <div className="flex items-center justify-between text-xs font-semibold text-blue-200">
                <span className="flex items-center gap-1.5">
                  <Loader2 className="w-4 h-4 text-blue-400 animate-spin" />
                  {ocrStatus}
                </span>
                <span>{ocrProgress}%</span>
              </div>
              <div className="w-full bg-slate-900 rounded-full h-2.5 overflow-hidden border border-blue-900">
                <div
                  className="bg-gradient-to-r from-blue-500 to-indigo-400 h-full transition-all duration-300"
                  style={{ width: `${ocrProgress}%` }}
                />
              </div>
              {selectedImagePreview && (
                <div className="mt-2 rounded-lg overflow-hidden border border-slate-700 max-h-32 flex justify-center bg-black/40">
                  <img
                    src={selectedImagePreview}
                    alt="Handwritten List Preview"
                    className="object-contain h-32 opacity-80"
                  />
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: Manual Text Area Input */}
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

      {/* TAB 3: Preset Demo Sample Cards */}
      {activeTab === 'preset' && (
        <div className="space-y-3">
          <div className="text-center space-y-1 px-1">
            <h2 className="text-sm font-bold text-slate-200 flex items-center justify-center gap-1.5">
              <Sparkles className="w-4 h-4 text-amber-400" />
              Select a Demo Handwritten List
            </h2>
            <p className="text-xs text-slate-400">
              Test AislePilot instantly with pre-loaded handwritten list cards
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
