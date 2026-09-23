'use client';

import React, { useState, useEffect } from 'react';
import { X, Cloud, QrCode, Copy, Check, ArrowDown, ArrowUp, RefreshCw, Smartphone, Laptop, AlertCircle, Loader2 } from 'lucide-react';
import { uploadListToCloud, downloadListFromCloud, getShareableUrl, getQrCodeImageUrl, getSavedSyncCode, CloudSyncPayload } from '@/lib/cloudSync';

interface CloudSyncModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentItems: string[];
  currentStoreId?: string;
  onLoadSyncedList: (items: string[], storeId?: string) => void;
}

export const CloudSyncModal: React.FC<CloudSyncModalProps> = ({
  isOpen,
  onClose,
  currentItems,
  currentStoreId,
  onLoadSyncedList,
}) => {
  const [activeTab, setActiveTab] = useState<'push' | 'pull'>('push');
  const [syncCode, setSyncCode] = useState('');
  const [shareUrl, setShareUrl] = useState('');
  const [qrImageUrl, setQrImageUrl] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  
  // Pull Tab State
  const [inputCode, setInputCode] = useState('');
  const [isDownloading, setIsDownloading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setErrorMessage(null);
      setSuccessMessage(null);
      const savedCode = getSavedSyncCode();
      if (savedCode) {
        setSyncCode(savedCode);
        const url = getShareableUrl(savedCode);
        setShareUrl(url);
        setQrImageUrl(getQrCodeImageUrl(url));
      }
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleGeneratePushCode = async () => {
    if (!currentItems || currentItems.length === 0) {
      setErrorMessage('Add items to your list on PC first before syncing to phone!');
      return;
    }

    setIsUploading(true);
    setErrorMessage(null);

    try {
      const { code, shareUrl: url } = await uploadListToCloud(currentItems, currentStoreId);
      setSyncCode(code);
      setShareUrl(url);
      setQrImageUrl(getQrCodeImageUrl(url));
      setSuccessMessage('Shopping list synced to cloud! Scan QR code or enter code on phone.');
    } catch (err: any) {
      console.warn('Cloud sync upload error:', err);
      setErrorMessage(err.message || 'Failed to sync list to cloud.');
    } finally {
      setIsUploading(false);
    }
  };

  const handlePullList = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputCode.trim()) {
      setErrorMessage('Please enter a sync code or paste a link');
      return;
    }

    setIsDownloading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const payload: CloudSyncPayload = await downloadListFromCloud(inputCode);
      if (payload.items && payload.items.length > 0) {
        onLoadSyncedList(payload.items, payload.storeId);
        setSuccessMessage(`Successfully loaded ${payload.items.length} items from cloud!`);
        setTimeout(() => {
          onClose();
        }, 1200);
      } else {
        setErrorMessage('Cloud list is empty.');
      }
    } catch (err: any) {
      console.warn('Cloud sync download error:', err);
      setErrorMessage(err.message || 'Could not load list. Check your code and try again.');
    } finally {
      setIsDownloading(false);
    }
  };

  const handleCopyCode = () => {
    if (!syncCode) return;
    navigator.clipboard.writeText(syncCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleCopyUrl = () => {
    if (!shareUrl) return;
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/40">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400">
              <Cloud className="w-4 h-4 animate-bounce" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white flex items-center gap-1.5">
                Cross-Device Cloud Sync
              </h2>
              <p className="text-[11px] text-slate-400">Type on PC ➔ View instantly on Phone</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="grid grid-cols-2 p-2 bg-slate-950 border-b border-slate-800 gap-1.5">
          <button
            type="button"
            onClick={() => setActiveTab('push')}
            className={`py-2 px-3 rounded-xl text-xs font-extrabold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'push'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Laptop className="w-3.5 h-3.5" />
            <span>1. Push List (PC)</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('pull')}
            className={`py-2 px-3 rounded-xl text-xs font-extrabold transition-all flex items-center justify-center gap-1.5 ${
              activeTab === 'pull'
                ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>2. Pull List (Phone)</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-4 flex-1">
          {/* Notifications / Alerts */}
          {errorMessage && (
            <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-800/80 text-xs text-rose-300 flex items-start gap-2 text-left">
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {successMessage && (
            <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-800/80 text-xs text-emerald-300 flex items-start gap-2 text-left">
              <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              <span>{successMessage}</span>
            </div>
          )}

          {/* TAB 1: PUSH TO PHONE / CLOUD */}
          {activeTab === 'push' && (
            <div className="space-y-4 text-center">
              <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-400">
                  <span>Current PC List Items:</span>
                  <span className="font-bold text-white bg-blue-950 px-2 py-0.5 rounded-md border border-blue-800">
                    {currentItems.length} items
                  </span>
                </div>

                <button
                  type="button"
                  onClick={handleGeneratePushCode}
                  disabled={isUploading || currentItems.length === 0}
                  className="w-full py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 disabled:opacity-50 text-white font-black text-xs rounded-xl shadow-lg shadow-blue-600/30 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                      <span>Syncing List to Cloud...</span>
                    </>
                  ) : (
                    <>
                      <Cloud className="w-4 h-4" />
                      <span>{syncCode ? 'Re-Sync Current List' : 'Sync List to Cloud & Mobile'}</span>
                    </>
                  )}
                </button>
              </div>

              {/* Sync Code & QR Code display */}
              {syncCode && (
                <div className="p-5 rounded-2xl bg-gradient-to-b from-slate-950 to-slate-900 border border-blue-900/60 space-y-4 shadow-xl">
                  <div className="space-y-1">
                    <p className="text-[11px] font-bold text-blue-300 uppercase tracking-wider">
                      Your Mobile Sync Code
                    </p>
                    <div className="flex items-center justify-center gap-2">
                      <span className="text-2xl font-black font-mono tracking-widest text-amber-300 bg-slate-900 px-4 py-1.5 rounded-xl border border-amber-500/40 shadow-inner">
                        {syncCode}
                      </span>
                      <button
                        type="button"
                        onClick={handleCopyCode}
                        className="p-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition-colors"
                        title="Copy Code"
                      >
                        {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* QR Code Container for instant phone camera scanning */}
                  {qrImageUrl && (
                    <div className="space-y-2 pt-2 border-t border-slate-800">
                      <p className="text-[11px] text-slate-400 font-semibold flex items-center justify-center gap-1">
                        <QrCode className="w-3.5 h-3.5 text-blue-400" />
                        Point your Phone Camera at this screen:
                      </p>
                      <div className="p-3 bg-white rounded-2xl inline-block shadow-2xl border-4 border-blue-500/30">
                        <img
                          src={qrImageUrl}
                          alt="Scan QR Code with Phone"
                          className="w-44 h-44 object-contain mx-auto"
                        />
                      </div>
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={handleCopyUrl}
                    className="w-full py-2 px-3 bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs rounded-xl border border-slate-700 transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Mobile Direct Web Link</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: PULL LIST ON PHONE */}
          {activeTab === 'pull' && (
            <form onSubmit={handlePullList} className="space-y-4">
              <div className="space-y-1 text-center">
                <h3 className="text-sm font-bold text-white flex items-center justify-center gap-1.5">
                  <Smartphone className="w-4 h-4 text-blue-400" />
                  Load PC List onto Phone
                </h3>
                <p className="text-xs text-slate-400">
                  Enter the 9-character code displayed on your PC screen
                </p>
              </div>

              <div className="space-y-2">
                <input
                  type="text"
                  placeholder="Enter Sync Code (e.g. G3HU92GHW)"
                  value={inputCode}
                  onChange={(e) => setInputCode(e.target.value.toUpperCase())}
                  className="w-full p-3.5 bg-slate-950 border border-slate-800 rounded-xl text-center font-mono font-bold text-lg text-amber-300 placeholder-slate-600 focus:outline-none focus:border-blue-500 transition-colors"
                />

                <button
                  type="submit"
                  disabled={isDownloading || !inputCode.trim()}
                  className="w-full py-3.5 px-4 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-extrabold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isDownloading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                      <span>Downloading List from Cloud...</span>
                    </>
                  ) : (
                    <>
                      <ArrowDown className="w-4 h-4" />
                      <span>Load List onto Device</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
