import React, { useState } from 'react';
import { ProfileData } from '../types';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: ProfileData;
}

export const ContactModal: React.FC<ContactModalProps> = ({ isOpen, onClose, profile }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopyEmail = () => {
    navigator.clipboard.writeText(profile.email);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-deep/50 backdrop-blur-xs flex items-end justify-center p-0 transition-opacity duration-300 animate-in fade-in">
      {/* Backdrop click */}
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative z-10 w-full bg-surface-container-lowest rounded-t-2xl p-space-lg shadow-2xl flex flex-col max-w-lg border-t border-border-subtle">
        {/* Modal Handle */}
        <div className="w-10 h-1 rounded-full bg-surface-container-high mx-auto mb-space-sm" />

        <div className="flex items-center justify-between pb-space-sm mb-space-sm">
          <div className="flex items-center gap-space-xs">
            <span className="material-symbols-outlined text-secondary text-[22px]">
              alternate_email
            </span>
            <h3 className="font-headline-sm text-headline-sm text-primary font-bold">
              Connect with Tesfaye
            </h3>
          </div>
          <button
            className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-slate-cool hover:text-primary transition-colors cursor-pointer"
            onClick={onClose}
            type="button"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        <p className="font-body-sm text-body-sm text-slate-cool mb-space-md">
          For executive board appointments, strategic digital consulting, or enterprise cloud initiatives:
        </p>

        <div className="space-y-space-xs mb-space-md">
          {/* Email item with copy action */}
          <div
            className="flex items-center justify-between p-3 rounded-lg bg-surface-container-low hover:bg-surface-container transition-colors cursor-pointer group"
            onClick={handleCopyEmail}
          >
            <div className="flex items-center gap-space-xs min-w-0">
              <span className="material-symbols-outlined text-secondary text-[18px] flex-shrink-0">
                mail
              </span>
              <span className="font-label-md text-label-md text-primary font-medium truncate">
                {profile.email}
              </span>
            </div>
            <div className="flex items-center gap-1 text-slate-cool group-hover:text-secondary">
              <span className="text-xs font-medium">
                {copied ? 'Copied!' : 'Copy'}
              </span>
              <span className="material-symbols-outlined text-[16px]">
                {copied ? 'check' : 'content_copy'}
              </span>
            </div>
          </div>

          {/* LinkedIn item */}
          <a
            className="flex items-center justify-between p-3 rounded-lg bg-surface-container-low hover:bg-surface-container transition-colors"
            href={`https://${profile.linkedIn}`}
            rel="noopener noreferrer"
            target="_blank"
          >
            <div className="flex items-center gap-space-xs min-w-0">
              <span className="material-symbols-outlined text-secondary text-[18px] flex-shrink-0">
                link
              </span>
              <span className="font-label-md text-label-md text-primary font-medium truncate">
                {profile.linkedIn}
              </span>
            </div>
            <span className="material-symbols-outlined text-slate-cool text-[16px]">
              open_in_new
            </span>
          </a>

          {/* Phone item */}
          <a
            className="flex items-center justify-between p-3 rounded-lg bg-surface-container-low hover:bg-surface-container transition-colors"
            href={`tel:${profile.phone}`}
          >
            <div className="flex items-center gap-space-xs min-w-0">
              <span className="material-symbols-outlined text-secondary text-[18px] flex-shrink-0">
                call
              </span>
              <span className="font-label-md text-label-md text-primary font-medium truncate">
                {profile.phone}
              </span>
            </div>
            <span className="material-symbols-outlined text-slate-cool text-[16px]">
              north_east
            </span>
          </a>
        </div>

        <button
          className="w-full py-3 bg-primary text-on-primary rounded-lg font-label-md text-label-md font-semibold hover:bg-secondary transition-colors cursor-pointer active:scale-[0.99]"
          onClick={onClose}
          type="button"
        >
          Close Sheet
        </button>
      </div>
    </div>
  );
};
