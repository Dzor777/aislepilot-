'use client';

import React, { useState } from 'react';
import { FamilyUserProfile } from '@/lib/types';
import { CacheManager } from '@/lib/cacheManager';
import { Users, X, Check, ShieldCheck, UserPlus, Radio } from 'lucide-react';

interface FamilyPortalModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentProfile: FamilyUserProfile;
  onSelectProfile: (profile: FamilyUserProfile) => void;
}

export const FamilyPortalModal: React.FC<FamilyPortalModalProps> = ({
  isOpen,
  onClose,
  currentProfile,
  onSelectProfile,
}) => {
  const [profiles, setProfiles] = useState<FamilyUserProfile[]>(CacheManager.DEFAULT_FAMILY_PROFILES);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newName, setNewName] = useState('');
  const [newRole, setNewRole] = useState<'Mom' | 'Dad' | 'Kid' | 'Roommate' | 'Custom'>('Custom');

  if (!isOpen) return null;

  const handleAddProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;

    const created: FamilyUserProfile = {
      id: `profile-${Date.now()}`,
      name: newName.trim(),
      role: newRole,
      avatarColor: 'bg-purple-600',
      initials: newName.trim().substring(0, 2).toUpperCase(),
    };

    setProfiles((prev) => [...prev, created]);
    onSelectProfile(created);
    setNewName('');
    setIsAddingNew(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
      <div className="bg-slate-900 border border-slate-800 rounded-3xl w-full max-w-md p-6 shadow-2xl space-y-6 relative overflow-hidden">
        {/* Top Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-2xl bg-rose-500/10 border border-rose-500/20 text-rose-400">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-white">Family Multi-User Portal</h2>
              <p className="text-xs text-slate-400">Shared workspace & real-time list sync</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-white rounded-xl bg-slate-800/60 hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live Sync Status Banner */}
        <div className="p-3.5 rounded-2xl bg-emerald-950/40 border border-emerald-800/40 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 text-emerald-300 font-bold">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
            </span>
            <span>Real-Time Family Sync Active</span>
          </div>
          <span className="text-[10px] bg-emerald-900/60 text-emerald-200 px-2 py-0.5 rounded-full font-extrabold border border-emerald-700/50">
            Multi-Tab Ready
          </span>
        </div>

        {/* Profile Selector List */}
        <div className="space-y-3">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-400 px-1">
            Active Household Profiles
          </label>
          <div className="grid grid-cols-1 gap-2.5">
            {profiles.map((profile) => {
              const isSelected = profile.id === currentProfile.id;
              return (
                <button
                  key={profile.id}
                  onClick={() => onSelectProfile(profile)}
                  className={`w-full p-3.5 rounded-2xl border transition-all text-left flex items-center justify-between ${
                    isSelected
                      ? 'bg-blue-600/10 border-blue-500 shadow-md'
                      : 'bg-slate-950/60 border-slate-800/80 hover:border-slate-700 hover:bg-slate-800/40'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-2xl ${profile.avatarColor} text-white font-black text-sm flex items-center justify-center shadow-md`}>
                      {profile.initials}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-white flex items-center gap-1.5">
                        <span>{profile.name}</span>
                        {isSelected && <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />}
                      </div>
                      <span className="text-[10px] text-slate-400 font-medium">Role: {profile.role}</span>
                    </div>
                  </div>

                  {isSelected ? (
                    <span className="p-1 rounded-full bg-blue-600 text-white">
                      <Check className="w-4 h-4" />
                    </span>
                  ) : (
                    <span className="text-xs text-slate-500 font-semibold group-hover:text-slate-300">
                      Switch
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Add Custom Family Member */}
        {!isAddingNew ? (
          <button
            onClick={() => setIsAddingNew(true)}
            className="w-full py-3 bg-slate-800 hover:bg-slate-700/80 text-slate-200 font-bold text-xs rounded-2xl transition-all border border-slate-700/60 flex items-center justify-center gap-2"
          >
            <UserPlus className="w-4 h-4 text-blue-400" />
            <span>Add Family Member Profile</span>
          </button>
        ) : (
          <form onSubmit={handleAddProfile} className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
            <div className="text-xs font-bold text-white">New Family Profile</div>
            <input
              type="text"
              placeholder="Name (e.g. Sarah, Grandma)"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl p-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
              autoFocus
            />
            <div className="flex gap-2">
              <button
                type="submit"
                className="flex-1 py-2 bg-blue-600 text-white font-bold text-xs rounded-xl hover:bg-blue-500 transition-colors"
              >
                Save Profile
              </button>
              <button
                type="button"
                onClick={() => setIsAddingNew(false)}
                className="px-3 py-2 bg-slate-800 text-slate-400 font-bold text-xs rounded-xl hover:text-white"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
