import React, { useState, useEffect, useRef, useMemo } from 'react';
import {
  PortfolioContentState,
  ExperienceRecord,
  EducationRecord,
  CertificationRecord,
  SkillDomain,
  CaseStudy,
  AwardRecord,
  ExecutiveLetterRecord,
  NavTab,
  ProfileData,
  HeroTechnologyIcon,
  HeroIconPosition,
} from '../types';
import { contentService } from '../services/contentService';
import { downloadResumeDocx, downloadResumePdf } from '../utils/resumeExport';
import {
  downloadExecutiveLetterDocx,
  downloadExecutiveLetterPdf,
  buildExecutiveLetterData,
} from '../utils/executiveLetterExport';
import { heroImageStorageService, HeroImagePreview } from '../services/heroImageStorageService';
import { monogramLogoStorageService } from '../services/monogramLogoStorageService';
import { projectImageStorageService } from '../services/projectImageStorageService';
import { heroIconStorageService } from '../services/heroIconStorageService';
import { compressImageFile } from '../utils/imageUtils';
import { HeroOrbitalSkills } from '../components/HeroOrbitalSkills';
import { TechSkillIcon } from '../components/TechSkillIcon';
import { HeroOrbitalLivePreview } from '../components/HeroOrbitalLivePreview';
import {
  STANDARD_ORBITAL_POSITIONS,
  POSITION_ANGLES,
  POSITION_DESCRIPTIONS,
  StandardOrbitalPosition,
  calculateOrbitalCoordinates,
} from '../utils/orbitalPositionUtils';

interface AdminViewProps {
  onLogout?: () => void;
  setActiveTab: (tab: NavTab) => void;
  onPreviewPublic?: () => void;
  profile?: ProfileData;
  onUpdateProfile?: (profile: ProfileData) => void;
}

type AdminSection =
  | 'dashboard'
  | 'hero-image'
  | 'hero-icons'
  | 'profile'
  | 'experience'
  | 'education'
  | 'skills'
  | 'certifications'
  | 'projects'
  | 'achievements'
  | 'resume'
  | 'letters'
  | 'media'
  | 'contact'
  | 'settings';

export const AdminView: React.FC<AdminViewProps> = ({
  onLogout,
  setActiveTab,
  onPreviewPublic,
}) => {
  const [activeSection, setActiveSection] = useState<AdminSection>('dashboard');
  const [content, setContent] = useState<PortfolioContentState>(() => contentService.getDraftContent());
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Delete Confirmation Modal State
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
  });

  // Modal / Form states for Adding / Editing items
  const [editingExperience, setEditingExperience] = useState<ExperienceRecord | null>(null);
  const [isAddingExperience, setIsAddingExperience] = useState(false);

  const [editingEducation, setEditingEducation] = useState<EducationRecord | null>(null);
  const [isAddingEducation, setIsAddingEducation] = useState(false);

  const [editingCertification, setEditingCertification] = useState<CertificationRecord | null>(null);
  const [isAddingCertification, setIsAddingCertification] = useState(false);

  const [editingCaseStudy, setEditingCaseStudy] = useState<CaseStudy | null>(null);
  const [isAddingCaseStudy, setIsAddingCaseStudy] = useState(false);

  const [editingSkillDomain, setEditingSkillDomain] = useState<SkillDomain | null>(null);
  const [isAddingSkillDomain, setIsAddingSkillDomain] = useState(false);

  const [editingAward, setEditingAward] = useState<AwardRecord | null>(null);
  const [isAddingAward, setIsAddingAward] = useState(false);

  const [editingLetter, setEditingLetter] = useState<ExecutiveLetterRecord | null>(null);
  const [isAddingLetter, setIsAddingLetter] = useState(false);

  // Media upload local state
  const [newMediaTitle, setNewMediaTitle] = useState('');
  const [newMediaAlt, setNewMediaAlt] = useState('');
  const [newMediaUrl, setNewMediaUrl] = useState('');

  // Hero Profile Image Management (600 × 800 px, 3:4 aspect ratio)
  const heroFileInputRef = useRef<HTMLInputElement>(null);
  const logoFileInputRef = useRef<HTMLInputElement>(null);
  const projectImageInputRef = useRef<HTMLInputElement>(null);
  const [isProjectImageUploading, setIsProjectImageUploading] = useState(false);
  const [projectImageError, setProjectImageError] = useState<string | null>(null);
  const [heroPreviewModalOpen, setHeroPreviewModalOpen] = useState(false);
  const [pendingHeroImage, setPendingHeroImage] = useState<HeroImagePreview | null>(null);
  const [heroPreviewModeTab, setHeroPreviewModeTab] = useState<'portrait' | 'simulation' | 'comparison'>('portrait');
  const [heroPreviewFit, setHeroPreviewFit] = useState<'contain' | 'cover'>('contain');
  const [isHeroDragging, setIsHeroDragging] = useState(false);
  const [isSavingHeroImage, setIsSavingHeroImage] = useState(false);
  const [heroImageMeta, setHeroImageMeta] = useState<{ width: number; height: number; ratio: string } | null>(null);

  // Hero Technology Icons Management
  const [editingHeroIcon, setEditingHeroIcon] = useState<HeroTechnologyIcon | null>(null);
  const [isAddingHeroIcon, setIsAddingHeroIcon] = useState(false);
  const [isHeroIconUploading, setIsHeroIconUploading] = useState(false);
  const [heroIconUploadError, setHeroIconUploadError] = useState<string | null>(null);
  const [showIconUploadGuidelinesTooltip, setShowIconUploadGuidelinesTooltip] = useState(false);
  const heroIconInputRef = useRef<HTMLInputElement>(null);
  const replacingHeroIconTargetId = useRef<string | null>(null);

  // Active Hero Profile reference directly from state
  const heroAvatarUrl = (content.mediaAssets.avatar || content.profile.avatarUrl || '').trim();
  const hasHeroImage = heroAvatarUrl.length > 0;

  // Derive technical skills list for realistic Hero simulation in Preview mode
  const heroSkillsList = useMemo(() => {
    const list: string[] = [];
    (content.skillDomains || []).forEach((dom: SkillDomain) => {
      (dom.skills || []).forEach((it) => {
        if (it.name && !list.includes(it.name)) list.push(it.name);
      });
    });
    return list.length > 0
      ? list
      : ['Oracle Cloud', 'Linux', 'React', 'TypeScript', 'Docker', 'Kubernetes', 'Python', 'PostgreSQL'];
  }, [content.skillDomains]);

  // Resume export loading indicators
  const [isExportingResumeDocx, setIsExportingResumeDocx] = useState(false);
  const [isExportingResumePdf, setIsExportingResumePdf] = useState(false);

  useEffect(() => {
    const unsub = contentService.subscribe((updated) => {
      setContent(updated);
    });
    return unsub;
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((c) => (c === msg ? null : c));
    }, 3500);
  };

  /**
   * Prepares the selected image file for Local Preview mode:
   * Validates format (JPG, JPEG, PNG, WEBP) & size (<= 10MB),
   * reads dimensions, and loads into browser memory for review.
   * Nothing is uploaded or written to storage until the administrator confirms.
   */
  const processSelectedHeroFile = async (file: File) => {
    try {
      const preview = await heroImageStorageService.prepareImagePreview(file);
      setPendingHeroImage(preview);
      setActiveSection('hero-image');
      setHeroPreviewModeTab('portrait');
      showToast(`Loaded "${file.name}" in Local Preview Mode. Review before saving to storage.`);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Invalid image file.';
      showToast(msg);
    }
  };

  const handleHeroFileSelected = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    await processSelectedHeroFile(file);
    if (e.target) e.target.value = '';
  };

  const handleHeroDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsHeroDragging(true);
  };

  const handleHeroDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsHeroDragging(false);
  };

  const handleHeroDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsHeroDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    await processSelectedHeroFile(file);
  };

  /**
   * Commits the pending hero image to persistent storage, updates the DB reference,
   * sets it active, and automatically renders it on the public Home page.
   */
  const handleConfirmSaveHeroImage = async () => {
    if (!pendingHeroImage) return;

    setIsSavingHeroImage(true);
    try {
      const result = await heroImageStorageService.replaceHeroImageSafely(pendingHeroImage.file);
      setContent((prev) => ({
        ...prev,
        mediaAssets: {
          ...prev.mediaAssets,
          avatar: result.newUrl,
        },
        profile: {
          ...prev.profile,
          avatarUrl: result.newUrl,
        },
      }));
      setPendingHeroImage(null);
      showToast(result.message || 'Hero image saved to storage and set active on the public Home page.');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to save Hero image to storage.';
      showToast(msg);
    } finally {
      setIsSavingHeroImage(false);
    }
  };

  /**
   * Discards the pending image preview without modifying storage or the active image.
   */
  const handleCancelHeroPreview = () => {
    setPendingHeroImage(null);
    showToast('Preview cancelled. Active Hero image was kept unchanged.');
  };

  /**
   * Removes the active hero image reference, deletes it from persistent storage,
   * and clears it from the public Home page (with no rectangular placeholder).
   */
  const handleRemoveHeroImage = () => {
    confirmDelete(
      'Remove Hero Profile Image',
      'Are you sure you want to remove the current Hero Profile Image? The active reference and stored file will be permanently deleted, and the public Home page will display no image.',
      async () => {
        try {
          const result = await heroImageStorageService.removeHeroImageSafely();
          setContent((prev) => ({
            ...prev,
            mediaAssets: {
              ...prev.mediaAssets,
              avatar: '',
            },
            profile: {
              ...prev.profile,
              avatarUrl: '',
            },
          }));
          setPendingHeroImage(null);
          setHeroImageMeta(null);
          showToast(result.message || 'Hero profile image removed and deleted from storage.');
        } catch (err: unknown) {
          const msg = err instanceof Error ? err.message : 'Error removing Hero image.';
          showToast(msg);
        }
      }
    );
  };

  const handleMonogramLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const result = await monogramLogoStorageService.uploadLogo(file);
      setContent((prev) => ({
        ...prev,
        mediaAssets: {
          ...prev.mediaAssets,
          logo: result.dataUrl,
        },
      }));
      showToast(result.message);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to upload monogram logo.';
      showToast(msg);
    } finally {
      if (e.target) e.target.value = '';
    }
  };

  const handleRemoveMonogramLogo = () => {
    confirmDelete(
      'Remove Monogram Logo',
      'Are you sure you want to remove the Monogram Logo? The website header will display clean monogram typography without any fallback URL.',
      async () => {
        try {
          const result = await monogramLogoStorageService.removeLogo();
          setContent((prev) => ({
            ...prev,
            mediaAssets: {
              ...prev.mediaAssets,
              logo: '',
            },
          }));
          showToast(result.message);
        } catch (err: unknown) {
          const msg = err instanceof Error ? err.message : 'Failed to remove monogram logo.';
          showToast(msg);
        }
      }
    );
  };

  const handleProjectImageUpload = async (file: File) => {
    if (!editingCaseStudy) return;
    setProjectImageError(null);
    const validation = projectImageStorageService.validateImageFile(file);
    if (!validation.valid) {
      setProjectImageError(validation.error || 'Invalid project image file.');
      return;
    }

    try {
      setIsProjectImageUploading(true);
      // Clean up previous storage file if replacing
      if (editingCaseStudy.storageKey) {
        await projectImageStorageService.deleteProjectImage(editingCaseStudy.storageKey);
      }
      const { dataUrl, storageKey } = await projectImageStorageService.uploadProjectImage(
        file,
        editingCaseStudy.id
      );
      setEditingCaseStudy((prev) => (prev ? { ...prev, image: dataUrl, storageKey } : null));
      showToast('Project image uploaded.');
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to process project image.';
      setProjectImageError(msg);
    } finally {
      setIsProjectImageUploading(false);
    }
  };

  const handleRemoveProjectImage = async () => {
    if (!editingCaseStudy) return;
    if (editingCaseStudy.storageKey) {
      await projectImageStorageService.deleteProjectImage(editingCaseStudy.storageKey);
    }
    setEditingCaseStudy((prev) => (prev ? { ...prev, image: '', storageKey: undefined } : null));
    setProjectImageError(null);
    showToast('Project image removed.');
  };

  const handleHeroIconFileUpload = async (file: File) => {
    setHeroIconUploadError(null);
    setIsHeroIconUploading(true);
    try {
      // 1. Validate file format, size (<= 2MB), and dimensions (>= 64×64 px)
      const validation = await heroIconStorageService.validateIconFile(file);
      if (!validation.valid) {
        const errorMsg = validation.error || 'The selected file does not meet the requirements.';
        setHeroIconUploadError(errorMsg);
        showToast(errorMsg);

        // If replacing directly from table row, open editing form to clearly display error & guidelines
        if (replacingHeroIconTargetId.current) {
          const target = (content.heroTechnologyIcons || []).find(
            (i) => i.id === replacingHeroIconTargetId.current
          );
          if (target) {
            setEditingHeroIcon({ ...target });
            setIsAddingHeroIcon(false);
          }
        }
        return;
      }

      const targetDirectId = replacingHeroIconTargetId.current;
      const iconId = targetDirectId || editingHeroIcon?.id || `icon_${Date.now()}`;
      const { dataUrl, storageKey } = await heroIconStorageService.uploadIconImage(file, iconId);

      // Direct replace from table row
      if (targetDirectId) {
        const existingIcon = (content.heroTechnologyIcons || []).find((i) => i.id === targetDirectId);
        if (existingIcon?.storageKey) {
          await heroIconStorageService.deleteIconImage(existingIcon.storageKey);
        }
        const updatedIcons = (content.heroTechnologyIcons || []).map((i) =>
          i.id === targetDirectId ? { ...i, imageUrl: dataUrl, storageKey, updatedAt: Date.now() } : i
        );
        const updatedContent = { ...content, heroTechnologyIcons: updatedIcons };
        setContent(updatedContent);
        contentService.saveDraft(updatedContent);
        showToast(`Updated icon image for "${existingIcon?.name || 'Technology'}"`);
        replacingHeroIconTargetId.current = null;
        return;
      }

      // Add or Edit form
      if (editingHeroIcon) {
        if (editingHeroIcon.storageKey) {
          await heroIconStorageService.deleteIconImage(editingHeroIcon.storageKey);
        }
        setEditingHeroIcon({
          ...editingHeroIcon,
          imageUrl: dataUrl,
          storageKey,
          updatedAt: Date.now(),
        });
        showToast('Icon image uploaded successfully');
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to upload icon image.';
      setHeroIconUploadError(msg);
      showToast(msg);
      if (replacingHeroIconTargetId.current) {
        const target = (content.heroTechnologyIcons || []).find(
          (i) => i.id === replacingHeroIconTargetId.current
        );
        if (target) {
          setEditingHeroIcon({ ...target });
          setIsAddingHeroIcon(false);
        }
      }
    } finally {
      setIsHeroIconUploading(false);
      replacingHeroIconTargetId.current = null;
    }
  };

  const handleSaveHeroIcon = () => {
    if (!editingHeroIcon) return;
    if (!editingHeroIcon.name.trim()) {
      setHeroIconUploadError('Please provide an icon name.');
      return;
    }

    const currentIcons = content.heroTechnologyIcons || [];
    const exists = currentIcons.some((i) => i.id === editingHeroIcon.id);
    const updatedIcons = exists
      ? currentIcons.map((i) => (i.id === editingHeroIcon.id ? { ...editingHeroIcon, updatedAt: Date.now() } : i))
      : [...currentIcons, { ...editingHeroIcon, updatedAt: Date.now() }];

    const updatedContent = { ...content, heroTechnologyIcons: updatedIcons };
    setContent(updatedContent);
    contentService.saveDraft(updatedContent);
    setIsAddingHeroIcon(false);
    setEditingHeroIcon(null);
    setHeroIconUploadError(null);
    showToast(exists ? `Updated "${editingHeroIcon.name}"` : `Added "${editingHeroIcon.name}" icon`);
  };

  const handleToggleHeroIcon = (iconId: string) => {
    const updatedIcons = (content.heroTechnologyIcons || []).map((i) =>
      i.id === iconId ? { ...i, enabled: !i.enabled, updatedAt: Date.now() } : i
    );
    const updatedContent = { ...content, heroTechnologyIcons: updatedIcons };
    setContent(updatedContent);
    contentService.saveDraft(updatedContent);
    const target = updatedIcons.find((i) => i.id === iconId);
    showToast(`"${target?.name}" ${target?.enabled ? 'enabled' : 'disabled'}`);
  };

  const handleDeleteHeroIcon = (icon: HeroTechnologyIcon) => {
    confirmDelete('Delete Technology Icon?', `Permanently delete "${icon.name}" from hero icons?`, async () => {
      if (icon.storageKey) {
        await heroIconStorageService.deleteIconImage(icon.storageKey);
      }
      const updatedIcons = (content.heroTechnologyIcons || []).filter((i) => i.id !== icon.id);
      const updatedContent = { ...content, heroTechnologyIcons: updatedIcons };
      setContent(updatedContent);
      contentService.saveDraft(updatedContent);
      showToast(`Deleted "${icon.name}"`);
    });
  };

  const handleRemoveEditingIconImage = async () => {
    if (!editingHeroIcon) return;
    if (editingHeroIcon.storageKey) {
      await heroIconStorageService.deleteIconImage(editingHeroIcon.storageKey);
    }
    setEditingHeroIcon({
      ...editingHeroIcon,
      imageUrl: '',
      storageKey: undefined,
      updatedAt: Date.now(),
    });
    showToast('Icon image removed');
  };

  const handleSaveDraft = () => {
    try {
      contentService.saveDraft(content);
      showToast('Draft changes saved successfully.');
    } catch (err: unknown) {
      if (err instanceof Error) {
        showToast(`Save error: ${err.message}`);
      }
    }
  };

  const handlePublish = () => {
    try {
      contentService.publishDraft();
      showToast('Published! Public portfolio is now live with your changes.');
    } catch (err: unknown) {
      if (err instanceof Error) {
        showToast(`Publish error: ${err.message}`);
      }
    }
  };

  const handleDiscardDraft = () => {
    if (window.confirm('Discard all unsaved draft changes and restore the live published state?')) {
      const restored = contentService.discardDraft();
      setContent(restored);
      showToast('Draft reverted to live published version.');
    }
  };

  // Helper to trigger delete confirmation
  const confirmDelete = (title: string, message: string, onConfirm: () => void) => {
    setDeleteModal({
      isOpen: true,
      title,
      message,
      onConfirm: () => {
        onConfirm();
        setDeleteModal((prev) => ({ ...prev, isOpen: false }));
      },
    });
  };

  // Section navigation menu items
  const navMenuItems: Array<{
    id: AdminSection;
    label: string;
    icon: string;
    badge?: string | number;
  }> = [
    { id: 'dashboard', label: 'Dashboard', icon: 'dashboard' },
    { id: 'hero-image', label: 'Hero Image', icon: 'portrait', badge: hasHeroImage ? 'Active' : undefined },
    {
      id: 'hero-icons',
      label: 'Hero Technology Icons',
      icon: 'hub',
      badge: (content.heroTechnologyIcons || []).filter((i) => i.enabled).length,
    },
    { id: 'profile', label: 'Profile & Bio', icon: 'person' },
    { id: 'experience', label: 'Work Experience', icon: 'work_history', badge: content.experience.length },
    { id: 'education', label: 'Education', icon: 'school', badge: content.education.length },
    { id: 'skills', label: 'Skills & Domains', icon: 'psychology', badge: content.skillDomains.length },
    { id: 'certifications', label: 'Certifications', icon: 'workspace_premium', badge: content.certifications.length },
    { id: 'projects', label: 'Projects & Cases', icon: 'rocket_launch', badge: content.caseStudies.length },
    { id: 'achievements', label: 'Achievements', icon: 'military_tech', badge: content.awards.length },
    { id: 'resume', label: 'Resume / CV', icon: 'description' },
    { id: 'letters', label: 'Executive Letters', icon: 'mail', badge: content.executiveLetters.length },
    { id: 'media', label: 'Media & Assets', icon: 'photo_library' },
    { id: 'contact', label: 'Contact & Social', icon: 'contacts' },
    { id: 'settings', label: 'Site Settings', icon: 'tune' },
  ];

  return (
    <div className="flex flex-col w-full min-h-screen pb-16 animate-in fade-in duration-300">
      {/* Hidden File Input for Hero Profile Image (JPG, JPEG, PNG, WEBP) */}
      <input
        ref={heroFileInputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp"
        className="hidden"
        onChange={handleHeroFileSelected}
      />
      {/* Hidden File Input for Hero Technology Icon Image */}
      <input
        ref={heroIconInputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp,image/svg+xml,.jpg,.jpeg,.png,.webp,.svg"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleHeroIconFileUpload(file);
          e.target.value = '';
        }}
      />
      {/* Top Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed top-20 right-4 z-50 bg-primary text-on-primary px-4 py-2.5 rounded-lg shadow-xl font-label-md text-label-md flex items-center gap-2 border border-secondary/30 animate-in slide-in-from-top-2">
          <span className="material-symbols-outlined text-[18px] text-secondary">
            check_circle
          </span>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in">
          <div className="bg-surface-container-lowest rounded-2xl max-w-md w-full p-6 shadow-2xl border border-border-subtle flex flex-col gap-4 animate-in zoom-in-95">
            <div className="flex items-center gap-3 text-error">
              <div className="w-10 h-10 rounded-full bg-error/10 flex items-center justify-center flex-shrink-0">
                <span className="material-symbols-outlined text-[24px]">warning</span>
              </div>
              <h3 className="font-headline-sm text-headline-sm font-bold text-primary">
                {deleteModal.title}
              </h3>
            </div>
            <p className="text-body-sm text-slate-cool leading-relaxed">
              {deleteModal.message}
            </p>
            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteModal((prev) => ({ ...prev, isOpen: false }))}
                className="px-4 py-2 rounded-lg font-label-md text-label-md font-semibold text-slate-cool hover:text-primary hover:bg-surface-container transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={deleteModal.onConfirm}
                className="px-4 py-2 rounded-lg font-label-md text-label-md font-semibold bg-error text-white hover:bg-error/90 shadow-xs transition-colors cursor-pointer"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Hero Profile Image Preview Lightbox Modal */}
      {heroPreviewModalOpen && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/80 backdrop-blur-md animate-in fade-in"
          onClick={() => setHeroPreviewModalOpen(false)}
        >
          <div
            className="bg-surface-container-lowest rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-border-subtle flex flex-col items-center gap-4 animate-in zoom-in-95"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-full flex items-center justify-between pb-3 border-b border-border-subtle">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-secondary text-[22px]">account_box</span>
                <div>
                  <h3 className="font-headline-sm text-sm font-bold text-primary">
                    Hero Profile Image Preview
                  </h3>
                  <span className="text-xs text-secondary font-medium">
                    Recommended size: 600 × 800 px (3:4)
                  </span>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setHeroPreviewModalOpen(false)}
                className="w-8 h-8 rounded-full bg-surface-container flex items-center justify-center text-slate-cool hover:text-primary transition-colors cursor-pointer"
                aria-label="Close Preview"
              >
                <span className="material-symbols-outlined text-[18px]">close</span>
              </button>
            </div>

            {/* 3:4 Rendered Frame with object-contain */}
            <div className="w-full max-w-[400px] aspect-[3/4] max-h-[540px] rounded-2xl overflow-hidden bg-gradient-to-b from-surface-container-high/50 to-surface-container-lowest border-2 border-secondary/30 shadow-xl flex items-center justify-center p-2 relative">
              {(content.mediaAssets.avatar || content.profile.avatarUrl) ? (
                <img
                  src={content.mediaAssets.avatar || content.profile.avatarUrl}
                  alt="Hero Profile Full Preview"
                  className="w-full h-full object-contain rounded-xl"
                />
              ) : (
                <div className="text-center p-4 text-slate-cool">
                  <span className="material-symbols-outlined text-[32px] text-secondary">image_not_supported</span>
                  <p className="text-xs font-semibold mt-1">No Hero Profile Image uploaded</p>
                </div>
              )}
              <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-full bg-surface-container-lowest/90 backdrop-blur-md border border-secondary/30 shadow-md text-secondary flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">verified</span>
                <span className="text-[11px] font-bold text-primary">Verified</span>
              </div>
            </div>

            {/* Dimensional Telemetry & Specs */}
            <div className="w-full grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-2 text-center text-xs">
              <div className="p-2.5 rounded-xl bg-surface-container-low border border-border-subtle">
                <span className="text-slate-cool block text-[10px] uppercase font-semibold">Aspect Ratio</span>
                <span className="font-bold text-primary">3:4 (Portrait)</span>
              </div>
              <div className="p-2.5 rounded-xl bg-surface-container-low border border-border-subtle">
                <span className="text-slate-cool block text-[10px] uppercase font-semibold">Target Size</span>
                <span className="font-bold text-secondary">600 × 800 px</span>
              </div>
              <div className="p-2.5 rounded-xl bg-surface-container-low border border-border-subtle col-span-2 sm:col-span-1">
                <span className="text-slate-cool block text-[10px] uppercase font-semibold">Image Rendering</span>
                <span className="font-bold text-primary">object-fit: contain</span>
              </div>
            </div>

            <div className="flex items-center justify-end w-full gap-2 pt-2 border-t border-border-subtle">
              <button
                type="button"
                onClick={() => {
                  setHeroPreviewModalOpen(false);
                  heroFileInputRef.current?.click();
                }}
                className="px-4 py-2 rounded-xl bg-primary text-on-primary text-xs font-semibold hover:bg-secondary transition-colors cursor-pointer"
              >
                Replace Image
              </button>
              <button
                type="button"
                onClick={() => setHeroPreviewModalOpen(false)}
                className="px-4 py-2 rounded-xl bg-surface-container text-primary text-xs font-semibold hover:bg-surface-container-high transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Master Action Header */}
      <div className="sticky top-16 z-40 bg-surface-container-lowest/95 backdrop-blur-md border-b border-border-subtle/80 px-gutter-sm py-3 flex flex-wrap items-center justify-between gap-3 shadow-xs">
        <div className="flex items-center gap-2 min-w-0">
          <span className="material-symbols-outlined text-secondary text-[22px]">
            admin_panel_settings
          </span>
          <div className="min-w-0">
            <h1 className="font-headline-sm text-headline-sm text-primary font-bold truncate leading-tight">
              Executive CMS Console
            </h1>
            <span className="font-label-sm text-xs text-slate-cool truncate block">
              Logged in as <strong className="text-secondary">contactesfaye@gmail.com</strong>
            </span>
          </div>
        </div>

        {/* Global Action Buttons: Draft, Preview, Publish, Discard */}
        <div className="flex items-center gap-2">
          {content.hasDraftChanges ? (
            <span className="hidden sm:inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-accent-bronze/10 text-accent-bronze font-semibold border border-accent-bronze/30">
              <span className="w-2 h-2 rounded-full bg-accent-bronze animate-pulse" />
              Unpublished Draft
            </span>
          ) : (
            <span className="hidden sm:inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-full bg-secondary/10 text-secondary font-semibold border border-secondary/30">
              <span className="w-2 h-2 rounded-full bg-secondary" />
              All Changes Published
            </span>
          )}

          <button
            type="button"
            onClick={handleSaveDraft}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-primary font-label-sm text-label-sm font-semibold transition-all cursor-pointer border border-border-subtle shadow-xs active:scale-95"
            title="Save draft changes without publishing publicly"
          >
            <span className="material-symbols-outlined text-[16px] text-secondary">
              save
            </span>
            <span>Save Draft</span>
          </button>

          <button
            type="button"
            onClick={() => {
              if (onPreviewPublic) {
                onPreviewPublic();
              } else {
                setActiveTab('home');
              }
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-primary font-label-sm text-label-sm font-semibold transition-all cursor-pointer border border-border-subtle shadow-xs active:scale-95"
            title="Preview how changes look on the public portfolio"
          >
            <span className="material-symbols-outlined text-[16px]">visibility</span>
            <span className="hidden sm:inline">Preview</span>
          </button>

          <button
            type="button"
            onClick={handlePublish}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-primary text-on-primary hover:bg-secondary font-label-sm text-label-sm font-semibold transition-all cursor-pointer shadow-sm active:scale-95"
            title="Publish all changes to the live public portfolio"
          >
            <span className="material-symbols-outlined text-[16px]">publish</span>
            <span>Publish Live</span>
          </button>

          {content.hasDraftChanges && (
            <button
              type="button"
              onClick={handleDiscardDraft}
              className="p-1.5 text-slate-cool hover:text-error hover:bg-error/10 rounded-lg transition-colors cursor-pointer"
              title="Discard draft changes"
            >
              <span className="material-symbols-outlined text-[18px]">undo</span>
            </button>
          )}

          {onLogout && (
            <button
              type="button"
              onClick={onLogout}
              className="p-1.5 text-slate-cool hover:text-error hover:bg-error/10 rounded-lg transition-colors cursor-pointer ml-1"
              title="Logout of Administrator Session"
            >
              <span className="material-symbols-outlined text-[20px]">logout</span>
            </button>
          )}
        </div>
      </div>

      {/* Main CMS Layout with Navigation and Content Pane */}
      <div className="px-gutter-sm pt-4 flex flex-col md:flex-row gap-6">
        {/* Left Side Navigation Sidebar */}
        <aside className="w-full md:w-64 flex-shrink-0">
          <div className="bg-surface-container-lowest rounded-2xl p-3 shadow-xs border border-border-subtle/70 sticky top-36">
            <div className="px-3 py-2 text-xs font-bold uppercase tracking-wider text-slate-cool flex items-center justify-between">
              <span>CMS Sections</span>
              <span className="text-[10px] text-secondary font-semibold">
                Full Control
              </span>
            </div>

            <nav className="flex flex-row md:flex-col gap-1 overflow-x-auto md:overflow-visible pb-2 md:pb-0 no-scrollbar">
              {navMenuItems.map((item) => {
                const isActive = activeSection === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setActiveSection(item.id)}
                    className={`flex items-center justify-between px-3 py-2.5 rounded-xl font-label-md text-label-md font-medium transition-all text-left whitespace-nowrap cursor-pointer ${
                      isActive
                        ? 'bg-primary text-on-primary shadow-xs font-semibold'
                        : 'text-slate-cool hover:text-primary hover:bg-surface-container'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span
                        className={`material-symbols-outlined text-[20px] ${
                          isActive ? 'text-secondary' : 'text-slate-cool'
                        }`}
                      >
                        {item.icon}
                      </span>
                      <span className="truncate">{item.label}</span>
                    </div>
                    {item.badge !== undefined && (
                      <span
                        className={`text-xs px-2 py-0.5 rounded-full font-bold ml-2 ${
                          isActive
                            ? 'bg-on-primary/20 text-on-primary'
                            : 'bg-surface-container-high text-slate-cool'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>

            <div className="mt-4 pt-3 border-t border-border-subtle/50 hidden md:flex flex-col gap-2">
              <button
                type="button"
                onClick={() => setActiveTab('home')}
                className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-semibold text-slate-cool hover:text-primary hover:bg-surface-container transition-colors cursor-pointer"
              >
                <span className="material-symbols-outlined text-[16px]">arrow_back</span>
                <span>View Public Portfolio</span>
              </button>
              {onLogout && (
                <button
                  type="button"
                  onClick={onLogout}
                  className="w-full flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-semibold text-error/80 hover:text-error hover:bg-error/10 transition-colors cursor-pointer"
                >
                  <span className="material-symbols-outlined text-[16px]">logout</span>
                  <span>End Admin Session</span>
                </button>
              )}
            </div>
          </div>
        </aside>

        {/* Right Active Content Editor Area */}
        <main className="flex-1 min-w-0">
          {/* 1. DASHBOARD OVERVIEW */}
          {activeSection === 'dashboard' && (
            <div className="space-y-6 animate-in fade-in">
              <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-xs border border-border-subtle flex flex-col gap-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-border-subtle">
                  <div>
                    <span className="text-xs uppercase tracking-widest text-secondary font-bold">
                      Central Command
                    </span>
                    <h2 className="text-xl font-bold text-primary">
                      Portfolio Status & Telemetry
                    </h2>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-cool">Last Published:</span>
                    <span className="text-xs font-semibold text-primary bg-surface-container px-2.5 py-1 rounded-md">
                      {new Date(content.lastPublishedAt).toLocaleDateString()} at{' '}
                      {new Date(content.lastPublishedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>

                {/* Status Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-4 rounded-xl bg-surface-container-low border border-border-subtle/60 flex flex-col">
                    <span className="text-xs text-slate-cool font-medium">Work History</span>
                    <span className="text-2xl font-bold text-primary mt-1">
                      {content.experience.length}
                    </span>
                    <span className="text-[11px] text-secondary mt-0.5">
                      {content.experience.filter((e) => e.published !== false).length} Published
                    </span>
                  </div>
                  <div className="p-4 rounded-xl bg-surface-container-low border border-border-subtle/60 flex flex-col">
                    <span className="text-xs text-slate-cool font-medium">Projects & Cases</span>
                    <span className="text-2xl font-bold text-primary mt-1">
                      {content.caseStudies.length}
                    </span>
                    <span className="text-[11px] text-secondary mt-0.5">
                      {content.caseStudies.filter((c) => c.published !== false).length} Published
                    </span>
                  </div>
                  <div className="p-4 rounded-xl bg-surface-container-low border border-border-subtle/60 flex flex-col">
                    <span className="text-xs text-slate-cool font-medium">Skill Domains</span>
                    <span className="text-2xl font-bold text-primary mt-1">
                      {content.skillDomains.length}
                    </span>
                    <span className="text-[11px] text-secondary mt-0.5">
                      {content.skillDomains.reduce((acc, d) => acc + d.skills.length, 0)} Skills
                    </span>
                  </div>
                  <div className="p-4 rounded-xl bg-surface-container-low border border-border-subtle/60 flex flex-col">
                    <span className="text-xs text-slate-cool font-medium">Credentials</span>
                    <span className="text-2xl font-bold text-primary mt-1">
                      {content.certifications.length}
                    </span>
                    <span className="text-[11px] text-secondary mt-0.5">
                      {content.certifications.filter((c) => c.published !== false).length} Active
                    </span>
                  </div>
                </div>

                {/* Quick Shortcuts */}
                <div className="pt-2">
                  <h3 className="text-xs font-bold uppercase tracking-wider text-slate-cool mb-3">
                    Direct Management Actions
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    <button
                      type="button"
                      onClick={() => setActiveSection('profile')}
                      className="p-3 rounded-xl bg-surface-container hover:bg-surface-container-high transition-colors text-left flex items-center gap-3 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-secondary">edit_note</span>
                      <span className="text-xs font-semibold text-primary">Edit Bio & Intro</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveSection('experience')}
                      className="p-3 rounded-xl bg-surface-container hover:bg-surface-container-high transition-colors text-left flex items-center gap-3 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-primary">add_circle</span>
                      <span className="text-xs font-semibold text-primary">Add Experience</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveSection('hero-image')}
                      className="p-3 rounded-xl bg-surface-container hover:bg-surface-container-high transition-colors text-left flex items-center gap-3 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-secondary">portrait</span>
                      <span className="text-xs font-semibold text-primary">Manage Hero Image</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setActiveSection('resume')}
                      className="p-3 rounded-xl bg-surface-container hover:bg-surface-container-high transition-colors text-left flex items-center gap-3 cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-accent-bronze">download</span>
                      <span className="text-xs font-semibold text-primary">Generate Resume</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* HERO IMAGE MANAGEMENT SECTION */}
          {activeSection === 'hero-image' && (
            <div className="space-y-6 animate-in fade-in">
              {/* Section Header */}
              <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-xs border border-border-subtle">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-border-subtle">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary flex-shrink-0">
                      <span className="material-symbols-outlined text-[24px]">portrait</span>
                    </div>
                    <div>
                      <h2 className="text-xl font-bold text-primary">Hero Image Management & Preview</h2>
                      <p className="text-xs text-slate-cool">
                        Select, inspect in local preview mode, replace, or safely remove the portrait displayed in the public Hero Section.
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setActiveTab('home')}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-container text-primary font-semibold text-xs border border-border-subtle hover:bg-surface-container-high cursor-pointer transition-colors"
                    >
                      <span className="material-symbols-outlined text-[16px] text-secondary">visibility</span>
                      <span>View Public Home</span>
                    </button>
                  </div>
                </div>

                {/* Architecture Pipeline Visualizer */}
                <div className="mt-4 p-3.5 rounded-xl bg-surface-container-low border border-border-subtle">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-cool block mb-2">
                    Hero Image Pipeline Flow
                  </span>
                  <div className="flex flex-wrap items-center gap-1 text-[11px] font-medium text-slate-cool">
                    <span className="px-2 py-0.5 rounded-md bg-surface-container-highest text-primary font-semibold">1. Select Local Image</span>
                    <span className="text-secondary font-bold">→</span>
                    <span className="px-2 py-0.5 rounded-md bg-surface-container-highest text-primary font-semibold">2. Validate Format</span>
                    <span className="text-secondary font-bold">→</span>
                    <span className={`px-2 py-0.5 rounded-md font-bold transition-colors ${pendingHeroImage ? 'bg-amber-500/20 text-amber-700 ring-1 ring-amber-500/30' : 'bg-secondary/15 text-secondary'}`}>
                      3. Local Preview Mode {pendingHeroImage ? '(Active)' : ''}
                    </span>
                    <span className="text-secondary font-bold">→</span>
                    <span className="px-2 py-0.5 rounded-md bg-surface-container-highest text-primary font-semibold">4. Confirm & Save to Storage</span>
                    <span className="text-secondary font-bold">→</span>
                    <span className="px-2 py-0.5 rounded-md bg-surface-container-highest text-primary font-semibold">5. Set Active Ref</span>
                    <span className="text-secondary font-bold">→</span>
                    <span className="px-2 py-0.5 rounded-md bg-emerald-500/15 text-emerald-700 font-bold">6. Live on Public Home</span>
                  </div>
                </div>
              </div>

              {/* LOCAL PREVIEW MODE (When an image has been selected for review) */}
              {pendingHeroImage && (
                <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-md border-2 border-secondary space-y-6 animate-in zoom-in-95">
                  {/* Preview Banner Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-border-subtle">
                    <div className="flex items-start sm:items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-amber-500/15 text-amber-700 flex items-center justify-center flex-shrink-0">
                        <span className="material-symbols-outlined text-[24px] animate-pulse">visibility</span>
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-base font-bold text-primary">Local Preview Mode</h3>
                          <span className="px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-700 text-[10px] font-extrabold uppercase tracking-wider border border-amber-500/30">
                            Unsaved In Memory
                          </span>
                        </div>
                        <p className="text-xs text-slate-cool">
                          Reviewing <strong className="text-primary font-semibold">{pendingHeroImage.fileName}</strong> locally in browser memory before committing to persistent storage.
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        disabled={isSavingHeroImage}
                        onClick={handleConfirmSaveHeroImage}
                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-primary text-on-primary font-bold text-xs shadow-xs hover:bg-secondary transition-colors cursor-pointer disabled:opacity-50"
                      >
                        {isSavingHeroImage ? (
                          <>
                            <span className="material-symbols-outlined text-[16px] animate-spin">progress_activity</span>
                            <span>Saving...</span>
                          </>
                        ) : (
                          <>
                            <span className="material-symbols-outlined text-[16px]">cloud_upload</span>
                            <span>Confirm & Save</span>
                          </>
                        )}
                      </button>
                      <button
                        type="button"
                        disabled={isSavingHeroImage}
                        onClick={handleCancelHeroPreview}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-surface-container text-slate-deep hover:text-error hover:bg-error/10 font-semibold text-xs border border-border-subtle transition-colors cursor-pointer"
                        title="Cancel preview and revert to current image"
                      >
                        <span className="material-symbols-outlined text-[16px]">close</span>
                        <span>Cancel</span>
                      </button>
                    </div>
                  </div>

                  {/* Preview Mode View Switcher Bar */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-2 rounded-xl bg-surface-container-low border border-border-subtle">
                    <div className="flex flex-wrap items-center gap-1">
                      <button
                        type="button"
                        onClick={() => setHeroPreviewModeTab('portrait')}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                          heroPreviewModeTab === 'portrait'
                            ? 'bg-surface-container-lowest text-primary shadow-xs font-bold ring-1 ring-border-subtle'
                            : 'text-slate-cool hover:text-primary'
                        }`}
                      >
                        <span className="material-symbols-outlined text-[16px]">crop_portrait</span>
                        <span>3:4 Portrait Frame</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setHeroPreviewModeTab('simulation')}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                          heroPreviewModeTab === 'simulation'
                            ? 'bg-surface-container-lowest text-primary shadow-xs font-bold ring-1 ring-border-subtle'
                            : 'text-slate-cool hover:text-primary'
                        }`}
                      >
                        <span className="material-symbols-outlined text-[16px]">planet</span>
                        <span>Hero Orbital Simulation</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setHeroPreviewModeTab('comparison')}
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all ${
                          heroPreviewModeTab === 'comparison'
                            ? 'bg-surface-container-lowest text-primary shadow-xs font-bold ring-1 ring-border-subtle'
                            : 'text-slate-cool hover:text-primary'
                        }`}
                      >
                        <span className="material-symbols-outlined text-[16px]">compare</span>
                        <span>Side-by-Side Comparison</span>
                      </button>
                    </div>

                    {/* Fit Controls (Active for portrait view) */}
                    {heroPreviewModeTab === 'portrait' && (
                      <div className="flex items-center gap-1.5 text-xs text-slate-cool px-2">
                        <span className="text-[11px] font-medium">Fit Mode:</span>
                        <button
                          type="button"
                          onClick={() => setHeroPreviewFit('contain')}
                          className={`px-2 py-0.5 rounded text-[11px] font-semibold cursor-pointer transition-colors ${
                            heroPreviewFit === 'contain'
                              ? 'bg-secondary text-on-secondary font-bold'
                              : 'bg-surface-container text-slate-cool hover:text-primary'
                          }`}
                        >
                          Fit All
                        </button>
                        <button
                          type="button"
                          onClick={() => setHeroPreviewFit('cover')}
                          className={`px-2 py-0.5 rounded text-[11px] font-semibold cursor-pointer transition-colors ${
                            heroPreviewFit === 'cover'
                              ? 'bg-secondary text-on-secondary font-bold'
                              : 'bg-surface-container text-slate-cool hover:text-primary'
                          }`}
                        >
                          Fill Frame
                        </button>
                      </div>
                    )}
                  </div>

                  {/* TAB 1: 3:4 PORTRAIT FRAME VIEW */}
                  {heroPreviewModeTab === 'portrait' && (
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                      <div className="md:col-span-5 flex flex-col items-center justify-center">
                        <div className="relative w-52 sm:w-60 aspect-[3/4] rounded-2xl overflow-hidden bg-surface-container-high border-2 border-secondary shadow-lg flex items-center justify-center p-1.5">
                          <img
                            src={pendingHeroImage.previewUrl}
                            alt="Local Hero Preview"
                            className={`w-full h-full rounded-xl transition-all duration-200 ${
                              heroPreviewFit === 'cover' ? 'object-cover' : 'object-contain'
                            }`}
                          />
                          <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded-md bg-surface-container-lowest/90 backdrop-blur-md text-[10px] font-bold text-primary shadow-xs border border-border-subtle">
                            3:4 Portrait
                          </span>
                          <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-amber-500/90 backdrop-blur-md text-[10px] font-bold text-white shadow-xs">
                            Local Memory
                          </span>
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-[11px] text-slate-cool font-mono">
                            {pendingHeroImage.aspectRatio}
                          </span>
                          <span className="text-slate-cool text-[10px]">•</span>
                          <span className="text-[11px] text-slate-cool font-medium">
                            {heroPreviewFit === 'contain' ? 'Fit All (Preserve Edges)' : 'Fill Frame (Cover)'}
                          </span>
                        </div>
                      </div>

                      <div className="md:col-span-7 space-y-4">
                        <div className="p-4 rounded-xl bg-surface-container-low border border-border-subtle space-y-2.5">
                          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-cool mb-1">
                            Local File Inspection
                          </h4>
                          <div className="flex justify-between text-xs pb-1 border-b border-border-subtle/50">
                            <span className="text-slate-cool font-medium">File Name:</span>
                            <span className="text-primary font-semibold truncate max-w-[220px]">{pendingHeroImage.fileName}</span>
                          </div>
                          <div className="flex justify-between text-xs pb-1 border-b border-border-subtle/50">
                            <span className="text-slate-cool font-medium">Format:</span>
                            <span className="text-primary font-semibold uppercase">{pendingHeroImage.fileType.replace('image/', '')}</span>
                          </div>
                          <div className="flex justify-between text-xs pb-1 border-b border-border-subtle/50">
                            <span className="text-slate-cool font-medium">File Size:</span>
                            <span className="text-primary font-semibold">{(pendingHeroImage.fileSize / 1024).toFixed(1)} KB</span>
                          </div>
                          {pendingHeroImage.width && pendingHeroImage.height && (
                            <div className="flex justify-between text-xs pb-1 border-b border-border-subtle/50">
                              <span className="text-slate-cool font-medium">Dimensions:</span>
                              <span className="text-primary font-semibold">{pendingHeroImage.width} × {pendingHeroImage.height} px</span>
                            </div>
                          )}
                          <div className="flex justify-between text-xs">
                            <span className="text-slate-cool font-medium">Storage State:</span>
                            <span className="text-amber-700 font-bold">Pending Confirmation (Zero Storage Used)</span>
                          </div>
                        </div>

                        <div className="p-3.5 rounded-xl bg-secondary/10 border border-secondary/20 text-xs text-primary leading-relaxed flex items-start gap-2.5">
                          <span className="material-symbols-outlined text-secondary text-[20px] flex-shrink-0 mt-0.5">verified_user</span>
                          <span>
                            This image passes all format and size requirements. Click <strong>Confirm & Save to Storage</strong> to commit it to persistent storage and make it active on the live website.
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* TAB 2: LIVE HERO ORBITAL SIMULATION */}
                  {heroPreviewModeTab === 'simulation' && (
                    <div className="space-y-4">
                      <div className="p-3 rounded-xl bg-secondary/10 border border-secondary/20 text-xs text-primary flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-secondary text-[18px]">motion_photos_on</span>
                          <span>
                            <strong>Interactive Simulation:</strong> This renders your selected local image inside the actual orbiting skills layout as it will appear on the public Home page.
                          </span>
                        </div>
                        <span className="text-[10px] font-bold text-secondary uppercase tracking-wider px-2 py-0.5 bg-secondary/15 rounded">
                          Simulated View
                        </span>
                      </div>

                      <div className="relative rounded-2xl bg-surface-container-low border border-border-subtle p-6 overflow-hidden flex items-center justify-center min-h-[440px]">
                        <div className="w-full max-w-[480px]">
                          <HeroOrbitalSkills
                            avatarUrl={pendingHeroImage.previewUrl}
                            fullName={content.profile.fullName || 'Tesfaye Teklu Feyissa'}
                            skills={heroSkillsList}
                            heroTechnologyIcons={content.heroTechnologyIcons}
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* TAB 3: SIDE-BY-SIDE COMPARISON */}
                  {heroPreviewModeTab === 'comparison' && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        {/* Current Active */}
                        <div className="p-5 rounded-2xl bg-surface-container-low border border-border-subtle flex flex-col items-center space-y-3">
                          <div className="flex items-center justify-between w-full">
                            <span className="text-xs font-bold text-primary">Current Active Image</span>
                            {hasHeroImage ? (
                              <span className="px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-700 text-[10px] font-bold">
                                Live on Home
                              </span>
                            ) : (
                              <span className="px-2 py-0.5 rounded-full bg-surface-container text-slate-cool text-[10px] font-semibold">
                                None Active
                              </span>
                            )}
                          </div>

                          <div className="w-40 aspect-[3/4] rounded-xl overflow-hidden bg-surface-container border border-border-subtle flex items-center justify-center shadow-xs">
                            {hasHeroImage ? (
                              <img src={heroAvatarUrl} alt="Current Active Hero" className="w-full h-full object-contain" />
                            ) : (
                              <div className="text-center p-3 text-slate-cool">
                                <span className="material-symbols-outlined text-[28px] mb-1">portrait</span>
                                <span className="text-[11px] block">No image set</span>
                              </div>
                            )}
                          </div>

                          <div className="w-full text-xs space-y-1 text-slate-cool pt-2 border-t border-border-subtle/50">
                            <div className="flex justify-between">
                              <span>Status:</span>
                              <span className="text-primary font-semibold">{hasHeroImage ? 'Published' : 'Empty'}</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Storage:</span>
                              <span className="text-primary font-semibold">{hasHeroImage ? 'Persistent Stored' : 'None'}</span>
                            </div>
                          </div>
                        </div>

                        {/* New Preview Image */}
                        <div className="p-5 rounded-2xl bg-secondary/5 border-2 border-secondary flex flex-col items-center space-y-3">
                          <div className="flex items-center justify-between w-full">
                            <span className="text-xs font-bold text-primary">New Selected Image</span>
                            <span className="px-2 py-0.5 rounded-full bg-amber-500/15 text-amber-700 text-[10px] font-bold">
                              Local Preview
                            </span>
                          </div>

                          <div className="w-40 aspect-[3/4] rounded-xl overflow-hidden bg-surface-container border border-secondary shadow-md flex items-center justify-center">
                            <img src={pendingHeroImage.previewUrl} alt="New Preview Hero" className="w-full h-full object-contain" />
                          </div>

                          <div className="w-full text-xs space-y-1 text-slate-cool pt-2 border-t border-border-subtle/50">
                            <div className="flex justify-between">
                              <span>Dimensions:</span>
                              <span className="text-primary font-semibold">{pendingHeroImage.width} × {pendingHeroImage.height} px</span>
                            </div>
                            <div className="flex justify-between">
                              <span>Size & Format:</span>
                              <span className="text-primary font-semibold">{(pendingHeroImage.fileSize / 1024).toFixed(1)} KB ({pendingHeroImage.fileType.replace('image/', '').toUpperCase()})</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="p-3 rounded-xl bg-surface-container-low border border-border-subtle text-xs text-slate-cool text-center">
                        Confirming will replace the active image in persistent storage and publish the new photo across the website.
                      </div>
                    </div>
                  )}

                  {/* Actions Footer Toolbar */}
                  <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-border-subtle">
                    <button
                      type="button"
                      disabled={isSavingHeroImage}
                      onClick={handleConfirmSaveHeroImage}
                      className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-on-primary font-bold text-xs shadow-md hover:bg-secondary transition-colors cursor-pointer disabled:opacity-50"
                    >
                      {isSavingHeroImage ? (
                        <>
                          <span className="material-symbols-outlined text-[18px] animate-spin">progress_activity</span>
                          <span>Saving to Persistent Storage...</span>
                        </>
                      ) : (
                        <>
                          <span className="material-symbols-outlined text-[18px]">cloud_upload</span>
                          <span>Confirm & Save to Persistent Storage</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      disabled={isSavingHeroImage}
                      onClick={handleCancelHeroPreview}
                      className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-surface-container text-slate-deep hover:text-error hover:bg-error/10 font-semibold text-xs border border-border-subtle transition-colors cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[18px]">close</span>
                      <span>Discard Preview</span>
                    </button>

                    <button
                      type="button"
                      disabled={isSavingHeroImage}
                      onClick={() => heroFileInputRef.current?.click()}
                      className="inline-flex items-center gap-1.5 px-3 py-2.5 rounded-xl text-secondary hover:underline font-semibold text-xs cursor-pointer ml-auto"
                    >
                      <span className="material-symbols-outlined text-[16px]">folder_open</span>
                      <span>Choose Different File</span>
                    </button>
                  </div>
                </div>
              )}

              {/* LOCAL PREVIEW LAUNCHER / DROPZONE (Shown when no preview is currently loaded) */}
              {!pendingHeroImage && (
                <div
                  onDragOver={handleHeroDragOver}
                  onDragLeave={handleHeroDragLeave}
                  onDrop={handleHeroDrop}
                  className={`bg-surface-container-lowest rounded-2xl p-8 shadow-xs border-2 border-dashed transition-all text-center space-y-4 cursor-pointer ${
                    isHeroDragging
                      ? 'border-secondary bg-secondary/5 scale-[1.01]'
                      : 'border-border-subtle hover:border-secondary/60 hover:bg-surface-container-low/40'
                  }`}
                  onClick={() => heroFileInputRef.current?.click()}
                >
                  <div className="w-14 h-14 rounded-2xl bg-secondary/10 text-secondary flex items-center justify-center mx-auto transition-transform group-hover:scale-105">
                    <span className="material-symbols-outlined text-[32px]">
                      {isHeroDragging ? 'file_download' : 'add_photo_alternate'}
                    </span>
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-base font-bold text-primary">
                      {isHeroDragging ? 'Drop image here to preview' : 'Select Image for Local Preview'}
                    </h3>
                    <p className="text-xs text-slate-cool max-w-md mx-auto leading-relaxed">
                      Drag & drop an image or click to browse. Images are opened in <strong>Local Preview Mode</strong> first, allowing you to inspect them before any upload to storage occurs.
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
                    <button
                      type="button"
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-primary text-on-primary font-bold text-xs shadow-xs hover:bg-secondary transition-colors cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[18px]">folder_open</span>
                      <span>Browse Local Image</span>
                    </button>
                  </div>
                  <span className="text-[11px] text-slate-cool block font-mono">
                    Supported: JPG, JPEG, PNG, WEBP • Max 10 MB • 3:4 portrait recommended
                  </span>
                </div>
              )}

              {/* CURRENT ACTIVE HERO IMAGE CARD */}
              <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-xs border border-border-subtle space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-border-subtle">
                  <div>
                    <h3 className="text-base font-bold text-primary">Currently Active Hero Image</h3>
                    <p className="text-xs text-slate-cool">
                      The active portrait currently stored and rendered on the public Home page.
                    </p>
                  </div>
                  {hasHeroImage ? (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-700 text-xs font-bold border border-emerald-500/20">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                      <span>Live on Public Home Page</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-surface-container text-slate-cool text-xs font-semibold border border-border-subtle">
                      <span>No Hero Image Active</span>
                    </span>
                  )}
                </div>

                <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                  {/* Active Image Box */}
                  <div className="relative w-44 sm:w-52 aspect-[3/4] rounded-2xl overflow-hidden bg-surface-container border border-border-subtle flex-shrink-0 flex items-center justify-center shadow-xs">
                    {hasHeroImage ? (
                      <img
                        src={heroAvatarUrl}
                        alt="Active Hero Profile"
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center text-center p-4 text-slate-cool">
                        <span className="material-symbols-outlined text-[36px] text-secondary mb-1">portrait</span>
                        <span className="text-xs font-bold text-primary">No Active Image</span>
                        <span className="text-[11px] text-slate-cool mt-1">Public home page renders orbiting skills with no rectangular placeholder</span>
                      </div>
                    )}
                    <span className="absolute bottom-2 right-2 px-2 py-0.5 rounded-md bg-surface-container-lowest/90 backdrop-blur-md text-[10px] font-bold text-primary shadow-xs border border-border-subtle pointer-events-none">
                      3:4
                    </span>
                  </div>

                  {/* Status, Details & Primary Actions */}
                  <div className="flex-1 w-full space-y-4">
                    <div className="space-y-1">
                      <h4 className="text-sm font-bold text-primary">
                        {hasHeroImage ? 'Active Hero Profile Image' : 'Hero Section Status'}
                      </h4>
                      <p className="text-xs text-slate-cool leading-relaxed">
                        {hasHeroImage
                          ? 'This image is loaded dynamically on the public Home page inside the orbital tech skills sphere. When replaced, the new image is safely uploaded and set active before the old one is pruned.'
                          : 'No hero profile image is currently assigned. The public Home page renders orbiting skills cleanly with no default image, no hardcoded URL, and no rectangular placeholder.'}
                      </p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-wrap items-center gap-2.5 pt-2">
                      {hasHeroImage ? (
                        <>
                          <button
                            type="button"
                            onClick={() => heroFileInputRef.current?.click()}
                            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-primary text-on-primary font-bold text-xs shadow-xs hover:bg-secondary transition-colors cursor-pointer"
                            title="Select a new image to preview and replace current hero image"
                          >
                            <span className="material-symbols-outlined text-[18px]">change_circle</span>
                            <span>Preview & Replace Image</span>
                          </button>

                          <button
                            type="button"
                            onClick={handleRemoveHeroImage}
                            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-error hover:bg-error/10 font-bold text-xs transition-colors cursor-pointer"
                            title="Remove the current hero image from storage and website"
                          >
                            <span className="material-symbols-outlined text-[18px]">delete</span>
                            <span>Remove Hero Image</span>
                          </button>

                          <button
                            type="button"
                            onClick={() => setHeroPreviewModalOpen(true)}
                            className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-surface-container text-primary font-semibold text-xs border border-border-subtle hover:bg-surface-container-high transition-colors cursor-pointer"
                            title="Preview active image at full 600 × 800 px resolution"
                          >
                            <span className="material-symbols-outlined text-[18px] text-secondary">fullscreen</span>
                            <span>Preview Full-Size</span>
                          </button>
                        </>
                      ) : (
                        <button
                          type="button"
                          onClick={() => heroFileInputRef.current?.click()}
                          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-primary text-on-primary font-bold text-xs shadow-md hover:bg-secondary transition-colors cursor-pointer"
                          title="Select and preview a new hero image"
                        >
                          <span className="material-symbols-outlined text-[18px]">upload_file</span>
                          <span>Select Image for Preview</span>
                        </button>
                      )}
                    </div>

                    {/* Specifications Card */}
                    <div className="pt-3 border-t border-border-subtle/70">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-slate-cool block mb-2">
                        Specifications & Supported Formats
                      </span>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                        <div className="p-2.5 rounded-lg bg-surface-container-low border border-border-subtle">
                          <span className="text-slate-cool text-[10px] block">Supported Formats</span>
                          <span className="text-primary font-bold">JPG, JPEG, PNG, WEBP</span>
                        </div>
                        <div className="p-2.5 rounded-lg bg-surface-container-low border border-border-subtle">
                          <span className="text-slate-cool text-[10px] block">Aspect Ratio</span>
                          <span className="text-primary font-bold">3:4 Portrait</span>
                        </div>
                        <div className="p-2.5 rounded-lg bg-surface-container-low border border-border-subtle">
                          <span className="text-slate-cool text-[10px] block">Max Resolution</span>
                          <span className="text-primary font-bold">600 × 800 px (Retina)</span>
                        </div>
                        <div className="p-2.5 rounded-lg bg-surface-container-low border border-border-subtle">
                          <span className="text-slate-cool text-[10px] block">Storage</span>
                          <span className="text-primary font-bold">IndexedDB + Safe Store</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 1.5. HERO TECHNOLOGY ICONS SECTION */}
          {activeSection === 'hero-icons' && (
            <div className="space-y-6 animate-in fade-in">
              {/* Header & Controls Bar */}
              <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-xs border border-border-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="material-symbols-outlined text-secondary text-[24px]">hub</span>
                    <h2 className="text-xl font-bold text-primary">Hero Technology Icons</h2>
                  </div>
                  <p className="text-xs text-slate-cool mt-1">
                    Manage the technology and skill icons orbiting around the Hero portrait on the public Home page.
                  </p>
                  <div className="flex flex-wrap items-center gap-3 mt-3 text-xs">
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface-container text-slate-cool font-medium">
                      <span>Total:</span>
                      <strong className="text-primary font-bold">
                        {(content.heroTechnologyIcons || []).length}
                      </strong>
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 text-emerald-700 font-medium">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      <span>Enabled:</span>
                      <strong className="font-bold">
                        {(content.heroTechnologyIcons || []).filter((i) => i.enabled).length}
                      </strong>
                    </span>
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-500/10 text-blue-700 font-medium">
                      <span>Custom Uploads:</span>
                      <strong className="font-bold">
                        {(content.heroTechnologyIcons || []).filter((i) => Boolean(i.imageUrl)).length}
                      </strong>
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    type="button"
                    onClick={() => {
                      const iconsList = content.heroTechnologyIcons || [];
                      setEditingHeroIcon({
                        id: `hero_icon_${Date.now()}`,
                        name: '',
                        imageUrl: '',
                        position: 'Top',
                        customAngle: 0,
                        customDistance: 100,
                        displayOrder: iconsList.length + 1,
                        enabled: true,
                        createdAt: Date.now(),
                        updatedAt: Date.now(),
                      });
                      setIsAddingHeroIcon(true);
                      setHeroIconUploadError(null);
                    }}
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-on-primary font-semibold text-xs hover:bg-secondary transition-colors cursor-pointer shadow-xs active:scale-95"
                  >
                    <span className="material-symbols-outlined text-[18px]">add</span>
                    <span>Add Technology Icon</span>
                  </button>
                </div>
              </div>

              {/* Real-time Hero Orbital Live Preview Panel */}
              <div className="space-y-2">
                <HeroOrbitalLivePreview
                  avatarUrl={content.mediaAssets.avatar || content.profile.avatarUrl}
                  fullName={content.profile.fullName}
                  icons={content.heroTechnologyIcons || []}
                  activeEditingIcon={editingHeroIcon}
                  onSelectIcon={(icon) => {
                    setEditingHeroIcon({ ...icon });
                    setIsAddingHeroIcon(false);
                    setHeroIconUploadError(null);
                  }}
                />
              </div>

              {/* Add / Edit Icon Form Modal / Card */}
              {(isAddingHeroIcon || editingHeroIcon) && editingHeroIcon && (
                <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-md border-2 border-secondary/35 space-y-5 animate-in fade-in">
                  <div className="flex items-center justify-between pb-3 border-b border-border-subtle">
                    <div className="flex items-center gap-2">
                      <span className="material-symbols-outlined text-secondary text-[20px]">
                        {isAddingHeroIcon ? 'add_circle' : 'edit_square'}
                      </span>
                      <h3 className="font-bold text-primary text-base">
                        {isAddingHeroIcon ? 'Add Technology Icon' : `Edit Icon: ${editingHeroIcon.name || 'Untitled'}`}
                      </h3>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setIsAddingHeroIcon(false);
                        setEditingHeroIcon(null);
                        setHeroIconUploadError(null);
                      }}
                      className="p-1 rounded-lg text-slate-cool hover:text-primary hover:bg-surface-container transition-colors cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[18px]">close</span>
                    </button>
                  </div>

                  {heroIconUploadError && (
                    <div className="p-3 rounded-xl bg-error/10 border border-error/20 flex items-center gap-2 text-error text-xs">
                      <span className="material-symbols-outlined text-[18px]">error</span>
                      <span>{heroIconUploadError}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Technology Name */}
                    <div>
                      <label className="block text-xs font-bold text-primary mb-1">
                        Technology / Skill Name <span className="text-error">*</span>
                      </label>
                      <input
                        type="text"
                        value={editingHeroIcon.name}
                        onChange={(e) =>
                          setEditingHeroIcon({ ...editingHeroIcon, name: e.target.value })
                        }
                        className="w-full px-3.5 py-2.5 rounded-xl border border-border-subtle bg-surface text-sm focus:border-secondary focus:ring-1 focus:ring-secondary outline-none font-medium"
                        placeholder="e.g. Oracle, MySQL, ASP.NET, JavaScript, Docker"
                      />
                      <span className="text-[11px] text-slate-cool mt-1 block">
                        Displayed in the label beneath the orbital icon badge.
                      </span>
                    </div>

                    {/* Display Order */}
                    <div>
                      <label className="block text-xs font-bold text-primary mb-1">
                        Display Order (1 - 99)
                      </label>
                      <input
                        type="number"
                        min="1"
                        max="99"
                        value={editingHeroIcon.displayOrder}
                        onChange={(e) =>
                          setEditingHeroIcon({
                            ...editingHeroIcon,
                            displayOrder: parseInt(e.target.value, 10) || 1,
                          })
                        }
                        className="w-full px-3.5 py-2.5 rounded-xl border border-border-subtle bg-surface text-sm focus:border-secondary focus:ring-1 focus:ring-secondary outline-none font-medium"
                      />
                      <span className="text-[11px] text-slate-cool mt-1 block">
                        Numeric sequence for priority rendering.
                      </span>
                    </div>

                    {/* Status Enabled / Disabled */}
                    <div className="sm:col-span-2">
                      <label className="block text-xs font-bold text-primary mb-1">
                        Public Visibility Status
                      </label>
                      <select
                        value={editingHeroIcon.enabled ? 'enabled' : 'disabled'}
                        onChange={(e) =>
                          setEditingHeroIcon({
                            ...editingHeroIcon,
                            enabled: e.target.value === 'enabled',
                          })
                        }
                        className="w-full px-3.5 py-2.5 rounded-xl border border-border-subtle bg-surface text-sm focus:border-secondary focus:ring-1 focus:ring-secondary outline-none font-medium cursor-pointer"
                      >
                        <option value="enabled">Enabled (Visible on public hero)</option>
                        <option value="disabled">Disabled (Hidden from public hero)</option>
                      </select>
                    </div>
                  </div>

                  {/* Orbital Position & Custom Coordinates System */}
                  <div className="p-4 rounded-xl bg-surface-container-low border border-border-subtle space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-2 pb-2 border-b border-border-subtle">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-secondary text-[20px]">
                          orbit
                        </span>
                        <label className="text-xs font-bold text-primary">
                          Orbital Position & Distance Configuration
                        </label>
                      </div>
                      <span className="text-[11px] text-slate-cool">
                        Hero image center is the orbital center
                      </span>
                    </div>

                    {/* Position Selector Dropdown */}
                    <div>
                      <label className="block text-xs font-bold text-primary mb-1.5">
                        Selected Orbital Position <span className="text-error">*</span>
                      </label>
                      <select
                        value={editingHeroIcon.position}
                        onChange={(e) => {
                          const newPos = e.target.value as HeroIconPosition;
                          const defaultAngle =
                            newPos in POSITION_ANGLES
                              ? POSITION_ANGLES[newPos as StandardOrbitalPosition]
                              : editingHeroIcon.customAngle ?? 0;
                          setEditingHeroIcon({
                            ...editingHeroIcon,
                            position: newPos,
                            customAngle: defaultAngle,
                            customDistance: editingHeroIcon.customDistance ?? 100,
                          });
                        }}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-border-subtle bg-surface text-sm focus:border-secondary focus:ring-1 focus:ring-secondary outline-none font-medium cursor-pointer"
                      >
                        <option value="Top">Top (12 o'clock • 0°)</option>
                        <option value="Top Right">Top Right (1:30 • 45°)</option>
                        <option value="Right">Right (3 o'clock • 90°)</option>
                        <option value="Bottom Right">Bottom Right (4:30 • 135°)</option>
                        <option value="Bottom">Bottom (6 o'clock • 180°)</option>
                        <option value="Bottom Left">Bottom Left (7:30 • 225°)</option>
                        <option value="Left">Left (9 o'clock • 270°)</option>
                        <option value="Top Left">Top Left (10:30 • 315°)</option>
                        <option value="Custom">Custom Position (Exact Angle & Distance)</option>
                      </select>
                    </div>

                    {/* Quick 8-Way Cardinal & Diagonal Position Buttons */}
                    <div>
                      <span className="block text-[11px] font-semibold text-slate-cool mb-2">
                        Quick Position Presets:
                      </span>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {STANDARD_ORBITAL_POSITIONS.map((pos) => {
                          const isSelected = editingHeroIcon.position === pos;
                          const angle = POSITION_ANGLES[pos];
                          return (
                            <button
                              key={pos}
                              type="button"
                              onClick={() => {
                                setEditingHeroIcon({
                                  ...editingHeroIcon,
                                  position: pos,
                                  customAngle: angle,
                                });
                              }}
                              className={`px-3 py-2 rounded-xl text-xs font-semibold flex items-center justify-between border transition-all cursor-pointer ${
                                isSelected
                                  ? 'bg-secondary text-on-secondary border-secondary shadow-xs scale-[1.02]'
                                  : 'bg-surface hover:bg-surface-container text-primary border-border-subtle hover:border-secondary/50'
                              }`}
                            >
                              <span>{pos}</span>
                              <span
                                className={`text-[10px] font-mono ${
                                  isSelected ? 'text-white/80' : 'text-slate-cool'
                                }`}
                              >
                                {angle}°
                              </span>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Custom Orbital Angle & Distance Fine-Tuning Controls */}
                    <div className="p-3.5 rounded-xl bg-surface border border-secondary/25 space-y-4">
                      <div className="flex items-center justify-between text-xs font-bold text-primary">
                        <div className="flex items-center gap-1.5">
                          <span className="material-symbols-outlined text-secondary text-[18px]">
                            compass_calibration
                          </span>
                          <span>Custom Angle & Distance from Hero Image</span>
                        </div>
                        {editingHeroIcon.position === 'Custom' && (
                          <span className="px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-700 text-[10px] font-bold border border-amber-500/20">
                            Custom Mode Active
                          </span>
                        )}
                      </div>

                      {/* 1. Orbital Angle Slider (0–360°) */}
                      <div>
                        <div className="flex items-center justify-between text-xs mb-1">
                          <label className="font-semibold text-primary">
                            Orbital Angle (0° – 360°):
                          </label>
                          <div className="flex items-center gap-1.5">
                            <span className="text-secondary font-bold font-mono text-sm">
                              {editingHeroIcon.customAngle ??
                                POSITION_ANGLES[editingHeroIcon.position as StandardOrbitalPosition] ??
                                0}
                              °
                            </span>
                            <span className="text-[10px] text-slate-cool">(0° = Top / 12 o'clock)</span>
                          </div>
                        </div>
                        <input
                          type="range"
                          min="0"
                          max="360"
                          step="1"
                          value={
                            editingHeroIcon.customAngle ??
                            POSITION_ANGLES[editingHeroIcon.position as StandardOrbitalPosition] ??
                            0
                          }
                          onChange={(e) => {
                            const newAngle = parseInt(e.target.value, 10);
                            setEditingHeroIcon({
                              ...editingHeroIcon,
                              customAngle: newAngle,
                              position: 'Custom',
                            });
                          }}
                          className="w-full accent-secondary cursor-pointer h-2 bg-surface-container rounded-lg"
                        />
                        <div className="flex justify-between text-[10px] text-slate-cool mt-1 font-mono">
                          <span>Top (0°)</span>
                          <span>Right (90°)</span>
                          <span>Bottom (180°)</span>
                          <span>Left (270°)</span>
                          <span>Top (360°)</span>
                        </div>
                      </div>

                      {/* 2. Orbital Distance from Hero Image (60% – 140%) */}
                      <div>
                        <div className="flex items-center justify-between text-xs mb-1">
                          <label className="font-semibold text-primary">
                            Orbital Distance from Hero Image:
                          </label>
                          <div className="flex items-center gap-1.5">
                            <span className="text-secondary font-bold font-mono text-sm">
                              {editingHeroIcon.customDistance ?? 100}%
                            </span>
                            <span className="text-[10px] text-slate-cool">
                              {(editingHeroIcon.customDistance ?? 100) === 100
                                ? '(Standard default)'
                                : (editingHeroIcon.customDistance ?? 100) < 100
                                ? '(Closer to portrait)'
                                : '(Farther from portrait)'}
                            </span>
                          </div>
                        </div>
                        <input
                          type="range"
                          min="60"
                          max="140"
                          step="5"
                          value={editingHeroIcon.customDistance ?? 100}
                          onChange={(e) => {
                            const newDist = parseInt(e.target.value, 10);
                            setEditingHeroIcon({
                              ...editingHeroIcon,
                              customDistance: newDist,
                            });
                          }}
                          className="w-full accent-secondary cursor-pointer h-2 bg-surface-container rounded-lg"
                        />
                        <div className="flex flex-wrap items-center gap-2 mt-2">
                          <button
                            type="button"
                            onClick={() =>
                              setEditingHeroIcon({ ...editingHeroIcon, customDistance: 75 })
                            }
                            className={`px-2.5 py-1 rounded-lg text-[11px] font-medium border cursor-pointer ${
                              (editingHeroIcon.customDistance ?? 100) === 75
                                ? 'bg-secondary text-on-secondary border-secondary'
                                : 'bg-surface hover:bg-surface-container text-slate-cool border-border-subtle'
                            }`}
                          >
                            Compact (75%)
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              setEditingHeroIcon({ ...editingHeroIcon, customDistance: 100 })
                            }
                            className={`px-2.5 py-1 rounded-lg text-[11px] font-medium border cursor-pointer ${
                              (editingHeroIcon.customDistance ?? 100) === 100
                                ? 'bg-secondary text-on-secondary border-secondary'
                                : 'bg-surface hover:bg-surface-container text-slate-cool border-border-subtle'
                            }`}
                          >
                            Standard (100%)
                          </button>
                          <button
                            type="button"
                            onClick={() =>
                              setEditingHeroIcon({ ...editingHeroIcon, customDistance: 125 })
                            }
                            className={`px-2.5 py-1 rounded-lg text-[11px] font-medium border cursor-pointer ${
                              (editingHeroIcon.customDistance ?? 100) === 125
                                ? 'bg-secondary text-on-secondary border-secondary'
                                : 'bg-surface hover:bg-surface-container text-slate-cool border-border-subtle'
                            }`}
                          >
                            Extended (125%)
                          </button>
                        </div>
                      </div>

                      {/* Real-time Calculated Coordinate Feedback */}
                      {(() => {
                        const coords = calculateOrbitalCoordinates(
                          editingHeroIcon.position,
                          editingHeroIcon.customAngle,
                          editingHeroIcon.customDistance ?? 100
                        );
                        return (
                          <div className="p-2.5 rounded-lg bg-surface-container flex flex-wrap items-center justify-between gap-2 text-[11px] border border-border-subtle">
                            <span className="text-slate-cool">
                              Calculated Relative Coordinates:
                            </span>
                            <span className="font-mono font-bold text-primary">
                              X: {coords.leftPct}% • Y: {coords.topPct}% (Angle: {Math.round(coords.effectiveAngle)}°, Distance: {coords.effectiveDistance}%)
                            </span>
                          </div>
                        );
                      })()}
                    </div>
                  </div>

                  {/* Icon Image Management Component */}
                  <div className="p-4 rounded-xl bg-surface-container-low border border-border-subtle space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <label className="text-xs font-bold text-primary">Upload Icon</label>
                        {/* Info Icon with Hover/Click Tooltip */}
                        <div className="relative inline-flex items-center">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setShowIconUploadGuidelinesTooltip((prev) => !prev);
                            }}
                            onMouseEnter={() => setShowIconUploadGuidelinesTooltip(true)}
                            onMouseLeave={() => setShowIconUploadGuidelinesTooltip(false)}
                            className="w-5 h-5 rounded-full bg-secondary/15 text-secondary hover:bg-secondary/25 flex items-center justify-center transition-colors cursor-pointer text-xs font-bold leading-none select-none"
                            aria-label="Image Upload Guidelines"
                            title="View Image Upload Guidelines"
                          >
                            ⓘ
                          </button>
                          {showIconUploadGuidelinesTooltip && (
                            <>
                              <div
                                className="fixed inset-0 z-40"
                                onClick={() => setShowIconUploadGuidelinesTooltip(false)}
                              />
                              <div
                                className="absolute left-0 sm:left-1/2 sm:-translate-x-1/2 bottom-full mb-2 w-72 sm:w-84 p-4 bg-slate-900 text-white rounded-xl shadow-2xl z-50 text-left text-xs animate-in fade-in border border-slate-700 pointer-events-auto"
                                onClick={(e) => e.stopPropagation()}
                              >
                              <div className="font-bold text-sky-400 flex items-center gap-1.5 mb-2.5 pb-2 border-b border-slate-700 text-xs tracking-wider">
                                <span className="material-symbols-outlined text-[16px]">info</span>
                                <span>IMAGE UPLOAD GUIDELINES</span>
                              </div>
                              <ul className="space-y-1.5 text-[11px] text-slate-200">
                                <li className="flex items-start gap-1.5">
                                  <span className="text-sky-400 font-bold">•</span>
                                  <span><strong>Recommended size:</strong> 128 × 128 pixels</span>
                                </li>
                                <li className="flex items-start gap-1.5">
                                  <span className="text-sky-400 font-bold">•</span>
                                  <span><strong>Minimum size:</strong> 64 × 64 pixels</span>
                                </li>
                                <li className="flex items-start gap-1.5">
                                  <span className="text-sky-400 font-bold">•</span>
                                  <span><strong>Recommended format:</strong> PNG</span>
                                </li>
                                <li className="flex items-start gap-1.5">
                                  <span className="text-sky-400 font-bold">•</span>
                                  <span><strong>Also supported:</strong> JPG, JPEG, and WebP</span>
                                </li>
                                <li className="flex items-start gap-1.5">
                                  <span className="text-sky-400 font-bold">•</span>
                                  <span><strong>Recommended:</strong> transparent background</span>
                                </li>
                                <li className="flex items-start gap-1.5">
                                  <span className="text-sky-400 font-bold">•</span>
                                  <span><strong>Recommended shape:</strong> square (1:1)</span>
                                </li>
                                <li className="flex items-start gap-1.5">
                                  <span className="text-sky-400 font-bold">•</span>
                                  <span><strong>Maximum file size:</strong> 2 MB</span>
                                </li>
                                <li className="flex items-start gap-1.5">
                                  <span className="text-sky-400 font-bold">•</span>
                                  <span>Use a clear, high-quality technology or skill icon</span>
                                </li>
                                <li className="flex items-start gap-1.5">
                                  <span className="text-sky-400 font-bold">•</span>
                                  <span>Avoid large text inside the icon</span>
                                </li>
                              </ul>
                            </div>
                          </>
                        )}
                        </div>
                      </div>

                      {editingHeroIcon.imageUrl ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 font-label-sm text-[11px] font-semibold">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          Custom Image Attached
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-600 font-label-sm text-[11px] font-medium">
                          Using Vector Preset
                        </span>
                      )}
                    </div>

                    {/* Inline Validation Error Message (if upload failed requirements) */}
                    {heroIconUploadError && (
                      <div className="p-3.5 rounded-xl bg-error/10 border-2 border-error/30 flex items-start gap-2.5 text-error text-xs animate-in fade-in">
                        <span className="material-symbols-outlined text-[20px] flex-shrink-0 text-error mt-0.5">
                          warning
                        </span>
                        <div className="flex-1">
                          <strong className="block text-xs font-bold text-error">Validation Error</strong>
                          <p className="mt-0.5 text-[11px] leading-relaxed font-medium">{heroIconUploadError}</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => setHeroIconUploadError(null)}
                          className="p-1 rounded-md hover:bg-error/20 text-error transition-colors"
                          title="Dismiss message"
                        >
                          <span className="material-symbols-outlined text-[16px]">close</span>
                        </button>
                      </div>
                    )}

                    {editingHeroIcon.imageUrl ? (
                      <div className="flex flex-col sm:flex-row items-center gap-4 p-4 bg-surface-container-lowest rounded-xl border border-border-subtle">
                        <div className="w-16 h-16 rounded-full bg-white border border-secondary/30 shadow-md flex items-center justify-center p-2.5 flex-shrink-0">
                          <img
                            src={editingHeroIcon.imageUrl}
                            alt={editingHeroIcon.name || 'Preview'}
                            className="w-full h-full object-contain"
                          />
                        </div>

                        <div className="flex-1 text-center sm:text-left">
                          <h4 className="text-xs font-bold text-primary">
                            {editingHeroIcon.name || 'Uploaded Icon'}
                          </h4>
                          <span className="text-[11px] text-slate-cool block mt-0.5">
                            Position: <strong>{editingHeroIcon.position}</strong> • Order:{' '}
                            <strong>{editingHeroIcon.displayOrder}</strong>
                          </span>

                          <div className="flex flex-wrap items-center gap-2 mt-2">
                            <button
                              type="button"
                              disabled={isHeroIconUploading}
                              onClick={() => {
                                replacingHeroIconTargetId.current = null;
                                heroIconInputRef.current?.click();
                              }}
                              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-primary text-on-primary text-xs font-semibold hover:bg-secondary transition-colors cursor-pointer disabled:opacity-50"
                            >
                              <span className="material-symbols-outlined text-[15px]">sync</span>
                              <span>{isHeroIconUploading ? 'Uploading...' : 'Replace Icon Image'}</span>
                            </button>
                            <button
                              type="button"
                              disabled={isHeroIconUploading}
                              onClick={handleRemoveEditingIconImage}
                              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold text-error hover:bg-error/10 transition-colors cursor-pointer disabled:opacity-50"
                            >
                              <span className="material-symbols-outlined text-[15px]">delete</span>
                              <span>Remove Custom Image</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div
                        onClick={() => {
                          replacingHeroIconTargetId.current = null;
                          heroIconInputRef.current?.click();
                        }}
                        onDragOver={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                        }}
                        onDrop={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          const file = e.dataTransfer.files?.[0];
                          if (file) handleHeroIconFileUpload(file);
                        }}
                        className="border-2 border-dashed border-border-subtle hover:border-secondary transition-colors rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer bg-surface/50 hover:bg-surface-container-low"
                      >
                        <div className="w-12 h-12 rounded-full bg-secondary/10 text-secondary flex items-center justify-center mb-2">
                          {editingHeroIcon.name ? (
                            <TechSkillIcon
                              skillName={editingHeroIcon.name}
                              className="w-6 h-6 object-contain"
                            />
                          ) : (
                            <span className="material-symbols-outlined text-[24px]">
                              add_photo_alternate
                            </span>
                          )}
                        </div>
                        <p className="text-sm font-bold text-primary mb-2">
                          {isHeroIconUploading ? 'Processing File...' : 'Upload Technology Icon'}
                        </p>
                        <button
                          type="button"
                          disabled={isHeroIconUploading}
                          onClick={(e) => {
                            e.stopPropagation();
                            replacingHeroIconTargetId.current = null;
                            heroIconInputRef.current?.click();
                          }}
                          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary text-on-primary text-xs font-semibold hover:bg-secondary transition-colors cursor-pointer shadow-xs disabled:opacity-50 mb-3 active:scale-95"
                        >
                          <span className="material-symbols-outlined text-[16px]">upload_file</span>
                          <span>Choose Image</span>
                        </button>
                        <div className="text-[11px] text-slate-cool leading-relaxed">
                          <div className="flex items-center justify-center gap-1 font-medium text-slate-700">
                            <span className="text-secondary font-bold">ⓘ</span>
                            <span>Recommended: 128 × 128 px • PNG/WebP</span>
                          </div>
                          <div className="text-slate-500">
                            Transparent background • Max 2 MB
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Visible Image Upload Guidelines Instruction Panel */}
                    <div className="rounded-xl border border-secondary/30 bg-secondary/5 p-4 text-xs space-y-2.5">
                      <div className="flex items-center gap-2 text-primary font-bold text-xs uppercase tracking-wider pb-1.5 border-b border-secondary/20">
                        <span className="material-symbols-outlined text-secondary text-[18px]">tips_and_updates</span>
                        <span>IMAGE UPLOAD GUIDELINES</span>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-1.5 text-[11px] text-slate-cool">
                        <div className="flex items-start gap-1.5">
                          <span className="text-secondary font-bold">•</span>
                          <span><strong>Recommended size:</strong> 128 × 128 pixels</span>
                        </div>
                        <div className="flex items-start gap-1.5">
                          <span className="text-secondary font-bold">•</span>
                          <span><strong>Minimum size:</strong> 64 × 64 pixels</span>
                        </div>
                        <div className="flex items-start gap-1.5">
                          <span className="text-secondary font-bold">•</span>
                          <span><strong>Recommended format:</strong> PNG</span>
                        </div>
                        <div className="flex items-start gap-1.5">
                          <span className="text-secondary font-bold">•</span>
                          <span><strong>Also supported:</strong> JPG, JPEG, and WebP</span>
                        </div>
                        <div className="flex items-start gap-1.5">
                          <span className="text-secondary font-bold">•</span>
                          <span><strong>Recommended:</strong> transparent background</span>
                        </div>
                        <div className="flex items-start gap-1.5">
                          <span className="text-secondary font-bold">•</span>
                          <span><strong>Recommended shape:</strong> square (1:1)</span>
                        </div>
                        <div className="flex items-start gap-1.5">
                          <span className="text-secondary font-bold">•</span>
                          <span><strong>Maximum file size:</strong> 2 MB</span>
                        </div>
                        <div className="flex items-start gap-1.5">
                          <span className="text-secondary font-bold">•</span>
                          <span>Use a clear, high-quality technology or skill icon</span>
                        </div>
                        <div className="flex items-start gap-1.5 sm:col-span-2">
                          <span className="text-secondary font-bold">•</span>
                          <span>Avoid large text inside the icon</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Form Action Controls */}
                  <div className="flex items-center justify-end gap-3 pt-3 border-t border-border-subtle">
                    <button
                      type="button"
                      onClick={() => {
                        setIsAddingHeroIcon(false);
                        setEditingHeroIcon(null);
                        setHeroIconUploadError(null);
                      }}
                      className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-cool hover:text-primary hover:bg-surface-container transition-colors cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={handleSaveHeroIcon}
                      className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-primary text-on-primary font-bold text-xs shadow-md hover:bg-secondary transition-colors cursor-pointer"
                    >
                      <span className="material-symbols-outlined text-[16px]">check</span>
                      <span>Save Icon</span>
                    </button>
                  </div>
                </div>
              )}

              {/* Table / List of Managed Hero Icons */}
              <div className="bg-surface-container-lowest rounded-2xl shadow-xs border border-border-subtle overflow-hidden">
                <div className="p-4 sm:p-5 border-b border-border-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-surface-container-low/50">
                  <div>
                    <h3 className="text-sm font-bold text-primary">Configured Hero Technology Icons</h3>
                    <p className="text-[11px] text-slate-cool mt-0.5">
                      Icons are sorted by display order and rendered around the hero portrait on public Home.
                    </p>
                  </div>
                  <span className="text-xs font-semibold text-slate-cool">
                    Showing {(content.heroTechnologyIcons || []).length} icons
                  </span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="border-b border-border-subtle bg-surface-container-low text-slate-cool font-semibold text-[11px] uppercase tracking-wider">
                        <th className="py-3 px-4 w-16 text-center">Icon</th>
                        <th className="py-3 px-4">Name</th>
                        <th className="py-3 px-4">Position</th>
                        <th className="py-3 px-4 w-20 text-center">Order</th>
                        <th className="py-3 px-4 w-28 text-center">Status</th>
                        <th className="py-3 px-4 w-40 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border-subtle/60">
                      {(content.heroTechnologyIcons || []).length === 0 ? (
                        <tr>
                          <td colSpan={6} className="py-8 text-center text-slate-cool">
                            No technology icons configured. Click "Add Technology Icon" to create one.
                          </td>
                        </tr>
                      ) : (
                        (content.heroTechnologyIcons || [])
                          .slice()
                          .sort((a, b) => a.displayOrder - b.displayOrder)
                          .map((icon) => (
                            <tr
                              key={icon.id}
                              className={`hover:bg-surface-container-low/40 transition-colors ${
                                !icon.enabled ? 'opacity-60 bg-surface-container-low/20' : ''
                              }`}
                            >
                              {/* Icon Badge Thumbnail */}
                              <td className="py-3 px-4 text-center">
                                <div className="w-10 h-10 mx-auto rounded-full bg-white shadow-xs border border-secondary/25 flex items-center justify-center p-1.5">
                                  {icon.imageUrl && icon.imageUrl.trim().length > 0 ? (
                                    <img
                                      src={icon.imageUrl}
                                      alt={icon.name}
                                      className="w-6 h-6 object-contain"
                                    />
                                  ) : (
                                    <TechSkillIcon
                                      skillName={icon.name}
                                      className="w-6 h-6 object-contain"
                                    />
                                  )}
                                </div>
                              </td>

                              {/* Technology Name */}
                              <td className="py-3 px-4">
                                <div className="font-bold text-primary text-sm flex items-center gap-1.5">
                                  <span>{icon.name}</span>
                                  {icon.imageUrl && (
                                    <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-500/10 px-1.5 py-0.5 rounded">
                                      Custom
                                    </span>
                                  )}
                                </div>
                                <span className="text-[10px] text-slate-cool block">
                                  ID: {icon.id}
                                </span>
                              </td>

                              {/* Position Badge */}
                              <td className="py-3 px-4">
                                <div className="flex flex-col gap-1 items-start">
                                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-surface-container text-primary font-semibold text-[11px] border border-border-subtle/80">
                                    <span className="material-symbols-outlined text-[13px] text-secondary">
                                      my_location
                                    </span>
                                    <span>{icon.position}</span>
                                  </span>
                                  <span className="text-[10px] text-slate-cool font-mono">
                                    {icon.position === 'Custom' || typeof icon.customAngle === 'number'
                                      ? `${Math.round(icon.customAngle ?? 0)}° • ${icon.customDistance ?? 100}% dist`
                                      : `${POSITION_ANGLES[icon.position as StandardOrbitalPosition] ?? 0}° • 100% dist`}
                                  </span>
                                </div>
                              </td>

                              {/* Display Order */}
                              <td className="py-3 px-4 text-center">
                                <span className="inline-block w-7 h-7 rounded-full bg-surface-container text-primary font-bold leading-7 text-center text-xs">
                                  {icon.displayOrder}
                                </span>
                              </td>

                              {/* Status Toggle */}
                              <td className="py-3 px-4 text-center">
                                <button
                                  type="button"
                                  onClick={() => handleToggleHeroIcon(icon.id)}
                                  className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold transition-colors cursor-pointer ${
                                    icon.enabled
                                      ? 'bg-emerald-500/10 text-emerald-700 border border-emerald-500/30 hover:bg-emerald-500/20'
                                      : 'bg-slate-200/70 text-slate-600 border border-slate-300 hover:bg-slate-300'
                                  }`}
                                  title="Click to toggle enabled/disabled status"
                                >
                                  <span
                                    className={`w-1.5 h-1.5 rounded-full ${
                                      icon.enabled ? 'bg-emerald-500' : 'bg-slate-400'
                                    }`}
                                  />
                                  <span>{icon.enabled ? 'Enabled' : 'Disabled'}</span>
                                </button>
                              </td>

                              {/* Actions */}
                              <td className="py-3 px-4 text-right">
                                <div className="flex items-center justify-end gap-1">
                                  {/* Edit Button */}
                                  <button
                                    type="button"
                                    onClick={() => {
                                      setEditingHeroIcon({ ...icon });
                                      setIsAddingHeroIcon(false);
                                      setHeroIconUploadError(null);
                                    }}
                                    className="p-1.5 text-slate-cool hover:text-primary hover:bg-surface-container rounded-lg cursor-pointer transition-colors"
                                    title="Edit icon settings"
                                  >
                                    <span className="material-symbols-outlined text-[18px]">edit</span>
                                  </button>

                                  {/* Replace Icon Image Button */}
                                  <button
                                    type="button"
                                    onClick={() => {
                                      replacingHeroIconTargetId.current = icon.id;
                                      heroIconInputRef.current?.click();
                                    }}
                                    className="p-1.5 text-slate-cool hover:text-secondary hover:bg-surface-container rounded-lg cursor-pointer transition-colors"
                                    title="Replace icon image from computer"
                                  >
                                    <span className="material-symbols-outlined text-[18px]">
                                      sync
                                    </span>
                                  </button>

                                  {/* Delete Button */}
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteHeroIcon(icon)}
                                    className="p-1.5 text-slate-cool hover:text-error hover:bg-error/10 rounded-lg cursor-pointer transition-colors"
                                    title="Delete icon permanently"
                                  >
                                    <span className="material-symbols-outlined text-[18px]">
                                      delete
                                    </span>
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* 2. PROFILE & HERO SECTION */}
          {activeSection === 'profile' && (
            <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-xs border border-border-subtle space-y-5 animate-in fade-in">
              <div className="flex items-center justify-between pb-4 border-b border-border-subtle">
                <div>
                  <h2 className="text-xl font-bold text-primary">Profile & Hero Details</h2>
                  <p className="text-xs text-slate-cool mt-0.5">
                    Controls your headline, job title, biographical summaries, and key metrics visible on the public hero.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleSaveDraft}
                  className="px-3.5 py-1.5 rounded-lg bg-primary text-on-primary font-semibold text-xs shadow-xs hover:bg-secondary transition-colors cursor-pointer"
                >
                  Save Section
                </button>
              </div>

              {/* Hero Profile Image Management (600 × 800 px, 3:4 Aspect Ratio) */}
              {(() => {
                const heroAvatarUrl = (content.mediaAssets.avatar || content.profile.avatarUrl || '').trim();
                const hasHeroImage = heroAvatarUrl.length > 0;

                return (
                  <div className="p-5 rounded-2xl bg-surface-container-low border border-border-subtle shadow-xs space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-border-subtle">
                      <div className="flex items-center gap-2">
                        <span className="material-symbols-outlined text-secondary text-[22px]">account_box</span>
                        <div>
                          <h3 className="text-sm font-bold text-primary">Hero Profile Image</h3>
                          <p className="text-[11px] text-slate-cool">Upload and manage the portrait displayed prominently in the public Hero Section.</p>
                        </div>
                      </div>
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-secondary/10 border border-secondary/20 text-secondary text-xs font-semibold self-start sm:self-auto">
                        <span className="material-symbols-outlined text-[15px]">aspect_ratio</span>
                        <span>Recommended size: 600 × 800 px (3:4)</span>
                      </div>
                    </div>

                    <div className="flex flex-col md:flex-row gap-5 items-start">
                      {/* 3:4 Aspect Ratio Preview Frame */}
                      <div className="flex flex-col items-center flex-shrink-0">
                        <div className="relative w-44 sm:w-48 aspect-[3/4] max-w-[600px] max-h-[800px] rounded-2xl overflow-hidden bg-surface-container-lowest border-2 border-secondary/30 shadow-md p-1 group flex items-center justify-center">
                          {hasHeroImage ? (
                            <>
                              <img
                                src={heroAvatarUrl}
                                alt="Hero Profile Preview"
                                className="w-full h-full object-contain rounded-xl"
                              />
                              <button
                                type="button"
                                onClick={() => setHeroPreviewModalOpen(true)}
                                className="absolute inset-0 bg-primary/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-on-primary font-medium text-xs gap-1 cursor-pointer"
                                title="Click to Preview Image (600 × 800 px)"
                              >
                                <span className="material-symbols-outlined text-[24px]">visibility</span>
                                <span>Preview Image</span>
                              </button>
                            </>
                          ) : (
                            <div
                              onClick={() => heroFileInputRef.current?.click()}
                              className="w-full h-full rounded-xl border border-dashed border-secondary/35 flex flex-col items-center justify-center text-center p-3 cursor-pointer hover:bg-secondary/5 transition-colors"
                            >
                              <span className="material-symbols-outlined text-[32px] text-secondary mb-1">add_photo_alternate</span>
                              <span className="text-xs font-bold text-primary">No Image</span>
                              <span className="text-[10px] text-slate-cool">Click to Upload</span>
                            </div>
                          )}
                          <span className="absolute bottom-1.5 right-1.5 px-2 py-0.5 rounded-md bg-surface-container-lowest/90 backdrop-blur-md text-[10px] font-bold text-primary shadow-xs border border-border-subtle pointer-events-none">
                            3:4
                          </span>
                        </div>
                        <span className="text-[11px] text-slate-cool mt-1.5">Max 600 × 800 px</span>
                      </div>

                      {/* Controls & Management */}
                      <div className="flex-1 space-y-3 w-full">
                        {/* Automatic Image Action Buttons
                            IF hero image exists:
                                Show Replace
                                Show Remove
                                Hide Upload
                            IF hero image does not exist:
                                Show Upload
                                Hide Replace
                                Hide Remove
                        */}
                        <div className="flex flex-wrap items-center gap-2">
                          {hasHeroImage ? (
                            <>
                              <button
                                type="button"
                                onClick={() => heroFileInputRef.current?.click()}
                                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-primary text-on-primary font-semibold text-xs shadow-xs hover:bg-secondary transition-colors cursor-pointer"
                                title="Replace the hero image with a new file"
                              >
                                <span className="material-symbols-outlined text-[17px]">change_circle</span>
                                <span>Replace</span>
                              </button>

                              <button
                                type="button"
                                onClick={handleRemoveHeroImage}
                                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-error hover:bg-error/10 font-semibold text-xs transition-colors cursor-pointer"
                                title="Remove the current hero image"
                              >
                                <span className="material-symbols-outlined text-[17px]">delete</span>
                                <span>Remove</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => setHeroPreviewModalOpen(true)}
                                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-surface-container text-primary font-semibold text-xs border border-border-subtle hover:bg-surface-container-high transition-colors cursor-pointer ml-auto"
                              >
                                <span className="material-symbols-outlined text-[17px] text-secondary">visibility</span>
                                <span>Preview Image</span>
                              </button>
                            </>
                          ) : (
                            <button
                              type="button"
                              onClick={() => heroFileInputRef.current?.click()}
                              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-on-primary font-semibold text-xs shadow-md hover:bg-secondary transition-colors cursor-pointer"
                              title="Upload a new hero profile image"
                            >
                              <span className="material-symbols-outlined text-[17px]">upload_file</span>
                              <span>Upload Image</span>
                            </button>
                          )}
                        </div>

                        {/* Direct Image URL Option */}
                        <div className="pt-1">
                          <label className="block text-[11px] font-bold text-slate-cool mb-1 uppercase tracking-wider">
                            Or Enter Direct Image URL
                          </label>
                          <input
                            type="text"
                            value={content.mediaAssets.avatar}
                            onChange={(e) => {
                              const newUrl = e.target.value;
                              setContent((prev) => ({
                                ...prev,
                                mediaAssets: { ...prev.mediaAssets, avatar: newUrl },
                                profile: { ...prev.profile, avatarUrl: newUrl },
                              }));
                            }}
                            placeholder="https://example.com/portrait-600x800.jpg"
                            className="w-full px-3 py-1.5 rounded-lg border border-border-subtle bg-surface text-xs focus:border-secondary focus:outline-none"
                          />
                        </div>

                        {/* Technical Specifications Callout */}
                        <div className="p-3 rounded-xl bg-surface-container/70 border border-border-subtle/60 text-[11px] text-slate-cool space-y-1">
                          <div className="flex items-center gap-1 text-primary font-semibold">
                            <span className="material-symbols-outlined text-[15px] text-secondary">verified_user</span>
                            <span>Image & Display Standards</span>
                          </div>
                          <p>
                            • <strong>Aspect Ratio:</strong> 3:4 portrait orientation preferred.<br />
                            • <strong>Rendered Size:</strong> Maximum 600 × 800 px on desktop; scaled proportionally on tablets and mobile devices.<br />
                            • <strong>Zero Distortion:</strong> Rendered with <code className="text-secondary font-mono">object-fit: contain</code> to ensure complete portrait visibility with no stretched pixels or facial cropping.<br />
                            • <strong>Formats Supported:</strong> JPG, JPEG, PNG, WEBP.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })()}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-primary mb-1">Full Legal Name</label>
                  <input
                    type="text"
                    value={content.profile.fullName}
                    onChange={(e) =>
                      setContent((prev) => ({
                        ...prev,
                        profile: { ...prev.profile, fullName: e.target.value },
                      }))
                    }
                    className="w-full px-3 py-2 rounded-lg border border-border-subtle bg-surface text-sm focus:border-secondary focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-primary mb-1">Executive Rank / Title</label>
                  <input
                    type="text"
                    value={content.profile.executiveTitleRank}
                    onChange={(e) =>
                      setContent((prev) => ({
                        ...prev,
                        profile: { ...prev.profile, executiveTitleRank: e.target.value },
                      }))
                    }
                    className="w-full px-3 py-2 rounded-lg border border-border-subtle bg-surface text-sm focus:border-secondary focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-primary mb-1">Credential Title Line</label>
                <input
                  type="text"
                  value={content.profile.credentialTitle}
                  onChange={(e) =>
                    setContent((prev) => ({
                      ...prev,
                      profile: { ...prev.profile, credentialTitle: e.target.value },
                    }))
                  }
                  className="w-full px-3 py-2 rounded-lg border border-border-subtle bg-surface text-sm focus:border-secondary focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-primary mb-1">Hero Tagline</label>
                <input
                  type="text"
                  value={content.profile.tagline}
                  onChange={(e) =>
                    setContent((prev) => ({
                      ...prev,
                      profile: { ...prev.profile, tagline: e.target.value },
                    }))
                  }
                  className="w-full px-3 py-2 rounded-lg border border-border-subtle bg-surface text-sm focus:border-secondary focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-primary mb-1">Professional Summary (Paragraph 1)</label>
                <textarea
                  rows={3}
                  value={content.profile.bio1}
                  onChange={(e) =>
                    setContent((prev) => ({
                      ...prev,
                      profile: { ...prev.profile, bio1: e.target.value },
                    }))
                  }
                  className="w-full px-3 py-2 rounded-lg border border-border-subtle bg-surface text-sm focus:border-secondary focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-primary mb-1">Core Competencies / Summary (Paragraph 2)</label>
                <textarea
                  rows={3}
                  value={content.profile.bio2}
                  onChange={(e) =>
                    setContent((prev) => ({
                      ...prev,
                      profile: { ...prev.profile, bio2: e.target.value },
                    }))
                  }
                  className="w-full px-3 py-2 rounded-lg border border-border-subtle bg-surface text-sm focus:border-secondary focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-primary mb-1">Board Abstract / Executive Summary</label>
                <textarea
                  rows={3}
                  value={content.profile.boardAbstract}
                  onChange={(e) =>
                    setContent((prev) => ({
                      ...prev,
                      profile: { ...prev.profile, boardAbstract: e.target.value },
                    }))
                  }
                  className="w-full px-3 py-2 rounded-lg border border-border-subtle bg-surface text-sm focus:border-secondary focus:outline-none"
                />
              </div>

              {/* Benchmarks / Stats */}
              <div className="pt-4 border-t border-border-subtle">
                <h3 className="text-sm font-bold text-primary mb-3">Hero Benchmarks / KPI Metrics</h3>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
                  <div>
                    <label className="block text-xs text-slate-cool mb-1">Years Exp.</label>
                    <input
                      type="text"
                      value={content.benchmarks.years}
                      onChange={(e) =>
                        setContent((prev) => ({
                          ...prev,
                          benchmarks: { ...prev.benchmarks, years: e.target.value },
                        }))
                      }
                      className="w-full px-2.5 py-1.5 rounded-lg border border-border-subtle bg-surface text-sm font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-cool mb-1">Certifications</label>
                    <input
                      type="text"
                      value={content.benchmarks.certifications}
                      onChange={(e) =>
                        setContent((prev) => ({
                          ...prev,
                          benchmarks: { ...prev.benchmarks, certifications: e.target.value },
                        }))
                      }
                      className="w-full px-2.5 py-1.5 rounded-lg border border-border-subtle bg-surface text-sm font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-cool mb-1">Projects</label>
                    <input
                      type="text"
                      value={content.benchmarks.projects}
                      onChange={(e) =>
                        setContent((prev) => ({
                          ...prev,
                          benchmarks: { ...prev.benchmarks, projects: e.target.value },
                        }))
                      }
                      className="w-full px-2.5 py-1.5 rounded-lg border border-border-subtle bg-surface text-sm font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-cool mb-1">Pillars</label>
                    <input
                      type="text"
                      value={content.benchmarks.pillars}
                      onChange={(e) =>
                        setContent((prev) => ({
                          ...prev,
                          benchmarks: { ...prev.benchmarks, pillars: e.target.value },
                        }))
                      }
                      className="w-full px-2.5 py-1.5 rounded-lg border border-border-subtle bg-surface text-sm font-semibold"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-cool mb-1">Scope</label>
                    <input
                      type="text"
                      value={content.benchmarks.governedValue}
                      onChange={(e) =>
                        setContent((prev) => ({
                          ...prev,
                          benchmarks: { ...prev.benchmarks, governedValue: e.target.value },
                        }))
                      }
                      className="w-full px-2.5 py-1.5 rounded-lg border border-border-subtle bg-surface text-sm font-semibold"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 3. WORK EXPERIENCE SECTION */}
          {activeSection === 'experience' && (
            <div className="space-y-4 animate-in fade-in">
              <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-xs border border-border-subtle flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-primary">Work Experience Management</h2>
                  <p className="text-xs text-slate-cool mt-0.5">
                    Add, edit, delete, reorder, and publish/unpublish career positions.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setEditingExperience({
                      id: `exp_${Date.now()}`,
                      role: '',
                      company: '',
                      period: '2025 – Present',
                      location: 'Addis Ababa, Ethiopia',
                      summary: '',
                      scopeMetric: 'Enterprise',
                      scopeLabel: 'Systems Scope',
                      resiliencyMetric: '99.9%',
                      resiliencyLabel: 'Uptime',
                      deliverables: [''],
                      active: true,
                      published: true,
                    });
                    setIsAddingExperience(true);
                  }}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-primary text-on-primary font-semibold text-xs hover:bg-secondary transition-colors cursor-pointer shadow-xs"
                >
                  <span className="material-symbols-outlined text-[16px]">add</span>
                  <span>Add Role</span>
                </button>
              </div>

              {/* Experience Modal / Form */}
              {(isAddingExperience || editingExperience) && editingExperience && (
                <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-md border-2 border-secondary/30 space-y-4">
                  <div className="flex items-center justify-between pb-3 border-b border-border-subtle">
                    <h3 className="font-bold text-primary text-base">
                      {isAddingExperience ? 'Add New Experience' : `Edit: ${editingExperience.role || 'Role'}`}
                    </h3>
                    <div className="flex items-center gap-2">
                      <label className="flex items-center gap-1.5 text-xs font-medium cursor-pointer">
                        <input
                          type="checkbox"
                          checked={editingExperience.published !== false}
                          onChange={(e) =>
                            setEditingExperience({ ...editingExperience, published: e.target.checked })
                          }
                          className="rounded text-secondary"
                        />
                        <span>Published Publicly</span>
                      </label>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-primary mb-1">Role Title</label>
                      <input
                        type="text"
                        value={editingExperience.role}
                        onChange={(e) =>
                          setEditingExperience({ ...editingExperience, role: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded-lg border border-border-subtle bg-surface text-sm"
                        placeholder="e.g. System Support Application Officer"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-primary mb-1">Company / Organization</label>
                      <input
                        type="text"
                        value={editingExperience.company}
                        onChange={(e) =>
                          setEditingExperience({ ...editingExperience, company: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded-lg border border-border-subtle bg-surface text-sm"
                        placeholder="e.g. Ethiopian Reinsurance S.C."
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-primary mb-1">Period / Dates</label>
                      <input
                        type="text"
                        value={editingExperience.period}
                        onChange={(e) =>
                          setEditingExperience({ ...editingExperience, period: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded-lg border border-border-subtle bg-surface text-sm"
                        placeholder="July 2025 – Present"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-primary mb-1">Location</label>
                      <input
                        type="text"
                        value={editingExperience.location}
                        onChange={(e) =>
                          setEditingExperience({ ...editingExperience, location: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded-lg border border-border-subtle bg-surface text-sm"
                        placeholder="Addis Ababa, Ethiopia"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-primary mb-1">Executive Role Summary</label>
                    <textarea
                      rows={2}
                      value={editingExperience.summary}
                      onChange={(e) =>
                        setEditingExperience({ ...editingExperience, summary: e.target.value })
                      }
                      className="w-full px-3 py-2 rounded-lg border border-border-subtle bg-surface text-sm"
                    />
                  </div>

                  {/* Deliverables */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-xs font-bold text-primary">Key Deliverables & Responsibilities</label>
                      <button
                        type="button"
                        onClick={() =>
                          setEditingExperience({
                            ...editingExperience,
                            deliverables: [...(editingExperience.deliverables || []), ''],
                          })
                        }
                        className="text-xs text-secondary hover:text-primary font-semibold cursor-pointer"
                      >
                        + Add Bullet
                      </button>
                    </div>
                    <div className="space-y-2">
                      {(editingExperience.deliverables || []).map((bullet, bIdx) => (
                        <div key={bIdx} className="flex items-center gap-2">
                          <input
                            type="text"
                            value={bullet}
                            onChange={(e) => {
                              const updated = [...(editingExperience.deliverables || [])];
                              updated[bIdx] = e.target.value;
                              setEditingExperience({ ...editingExperience, deliverables: updated });
                            }}
                            className="flex-1 px-3 py-1.5 rounded-lg border border-border-subtle bg-surface text-xs"
                            placeholder="Describe responsibility or accomplishment..."
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const updated = (editingExperience.deliverables || []).filter((_, idx) => idx !== bIdx);
                              setEditingExperience({ ...editingExperience, deliverables: updated });
                            }}
                            className="text-slate-cool hover:text-error p-1 cursor-pointer"
                          >
                            <span className="material-symbols-outlined text-[18px]">delete</span>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Form actions */}
                  <div className="flex items-center justify-end gap-2 pt-3 border-t border-border-subtle">
                    <button
                      type="button"
                      onClick={() => {
                        setIsAddingExperience(false);
                        setEditingExperience(null);
                      }}
                      className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-cool hover:bg-surface-container cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (!editingExperience.role.trim()) {
                          showToast('Role title is required.');
                          return;
                        }
                        let updatedList: ExperienceRecord[];
                        if (isAddingExperience) {
                          updatedList = [editingExperience, ...content.experience];
                        } else {
                          updatedList = content.experience.map((item) =>
                            item.id === editingExperience.id ? editingExperience : item
                          );
                        }
                        const updatedContent = { ...content, experience: updatedList };
                        setContent(updatedContent);
                        contentService.saveDraft(updatedContent);
                        setIsAddingExperience(false);
                        setEditingExperience(null);
                        showToast('Experience entry saved to draft.');
                      }}
                      className="px-4 py-2 rounded-lg text-xs font-semibold bg-primary text-on-primary hover:bg-secondary cursor-pointer"
                    >
                      Save Role
                    </button>
                  </div>
                </div>
              )}

              {/* Experience List */}
              <div className="space-y-3">
                {content.experience.map((exp, idx) => (
                  <div
                    key={exp.id}
                    className={`bg-surface-container-lowest rounded-xl p-4 shadow-xs border transition-all ${
                      exp.published === false ? 'border-dashed border-slate-300 opacity-75' : 'border-border-subtle'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-primary text-sm">{exp.role}</h4>
                          <span className="text-xs text-secondary font-semibold">— {exp.company}</span>
                          {exp.published === false && (
                            <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-200 text-slate-700 font-medium">
                              Unpublished Draft
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-slate-cool">
                          {exp.period} • {exp.location}
                        </span>
                      </div>

                      {/* Controls: Reorder, Visibility, Edit, Delete */}
                      <div className="flex items-center gap-1.5 self-end sm:self-auto">
                        <button
                          type="button"
                          disabled={idx === 0}
                          onClick={() => {
                            const copy = [...content.experience];
                            const temp = copy[idx - 1];
                            copy[idx - 1] = copy[idx];
                            copy[idx] = temp;
                            setContent({ ...content, experience: copy });
                          }}
                          className="p-1 rounded text-slate-cool hover:text-primary disabled:opacity-30 cursor-pointer"
                          title="Move up"
                        >
                          <span className="material-symbols-outlined text-[18px]">arrow_upward</span>
                        </button>
                        <button
                          type="button"
                          disabled={idx === content.experience.length - 1}
                          onClick={() => {
                            const copy = [...content.experience];
                            const temp = copy[idx + 1];
                            copy[idx + 1] = copy[idx];
                            copy[idx] = temp;
                            setContent({ ...content, experience: copy });
                          }}
                          className="p-1 rounded text-slate-cool hover:text-primary disabled:opacity-30 cursor-pointer"
                          title="Move down"
                        >
                          <span className="material-symbols-outlined text-[18px]">arrow_downward</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            const copy = content.experience.map((item) =>
                              item.id === exp.id ? { ...item, published: item.published === false } : item
                            );
                            setContent({ ...content, experience: copy });
                          }}
                          className={`px-2 py-1 rounded text-xs font-semibold cursor-pointer ${
                            exp.published !== false
                              ? 'bg-secondary/15 text-secondary'
                              : 'bg-slate-200 text-slate-600'
                          }`}
                        >
                          {exp.published !== false ? 'Published' : 'Unpublished'}
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setEditingExperience({ ...exp });
                            setIsAddingExperience(false);
                          }}
                          className="p-1.5 text-slate-cool hover:text-primary hover:bg-surface-container rounded-lg cursor-pointer"
                          title="Edit"
                        >
                          <span className="material-symbols-outlined text-[18px]">edit</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            confirmDelete(
                              'Delete Experience Role?',
                              `Are you sure you want to permanently remove "${exp.role} at ${exp.company}" from the portfolio?`,
                              () => {
                                const filtered = content.experience.filter((item) => item.id !== exp.id);
                                const updated = { ...content, experience: filtered };
                                setContent(updated);
                                contentService.saveDraft(updated);
                                showToast('Role deleted from draft.');
                              }
                            );
                          }}
                          className="p-1.5 text-slate-cool hover:text-error hover:bg-error/10 rounded-lg cursor-pointer"
                          title="Delete"
                        >
                          <span className="material-symbols-outlined text-[18px]">delete</span>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 4. EDUCATION SECTION */}
          {activeSection === 'education' && (
            <div className="space-y-4 animate-in fade-in">
              <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-xs border border-border-subtle flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-primary">Education & Degrees</h2>
                  <p className="text-xs text-slate-cool mt-0.5">
                    Manage university degrees, honors, and academic coursework.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setEditingEducation({
                      id: `edu_${Date.now()}`,
                      degree: 'B.Sc.',
                      field: '',
                      institution: '',
                      honors: 'Conferred with Distinction',
                      researchFocus: '',
                      published: true,
                    });
                    setIsAddingEducation(true);
                  }}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-primary text-on-primary font-semibold text-xs hover:bg-secondary transition-colors cursor-pointer shadow-xs"
                >
                  <span className="material-symbols-outlined text-[16px]">add</span>
                  <span>Add Degree</span>
                </button>
              </div>

              {/* Education Add/Edit Form */}
              {(isAddingEducation || editingEducation) && editingEducation && (
                <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-md border-2 border-secondary/30 space-y-4">
                  <h3 className="font-bold text-primary text-base pb-3 border-b border-border-subtle">
                    {isAddingEducation ? 'Add New Degree' : 'Edit Degree'}
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-primary mb-1">Degree (e.g. B.Sc., M.Sc.)</label>
                      <input
                        type="text"
                        value={editingEducation.degree}
                        onChange={(e) =>
                          setEditingEducation({ ...editingEducation, degree: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded-lg border border-border-subtle bg-surface text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-primary mb-1">Field of Study</label>
                      <input
                        type="text"
                        value={editingEducation.field}
                        onChange={(e) =>
                          setEditingEducation({ ...editingEducation, field: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded-lg border border-border-subtle bg-surface text-sm"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-primary mb-1">Institution</label>
                      <input
                        type="text"
                        value={editingEducation.institution}
                        onChange={(e) =>
                          setEditingEducation({ ...editingEducation, institution: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded-lg border border-border-subtle bg-surface text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-primary mb-1">Honors</label>
                      <input
                        type="text"
                        value={editingEducation.honors}
                        onChange={(e) =>
                          setEditingEducation({ ...editingEducation, honors: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded-lg border border-border-subtle bg-surface text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-primary mb-1">Research Focus / Curriculum</label>
                    <textarea
                      rows={2}
                      value={editingEducation.researchFocus}
                      onChange={(e) =>
                        setEditingEducation({ ...editingEducation, researchFocus: e.target.value })
                      }
                      className="w-full px-3 py-2 rounded-lg border border-border-subtle bg-surface text-sm"
                    />
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-3 border-t border-border-subtle">
                    <button
                      type="button"
                      onClick={() => {
                        setIsAddingEducation(false);
                        setEditingEducation(null);
                      }}
                      className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-cool hover:bg-surface-container cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (!editingEducation.field.trim()) return;
                        let updatedList: EducationRecord[];
                        if (isAddingEducation) {
                          updatedList = [editingEducation, ...content.education];
                        } else {
                          updatedList = content.education.map((item) =>
                            item.id === editingEducation.id ? editingEducation : item
                          );
                        }
                        const updated = { ...content, education: updatedList };
                        setContent(updated);
                        contentService.saveDraft(updated);
                        setIsAddingEducation(false);
                        setEditingEducation(null);
                        showToast('Education record saved.');
                      }}
                      className="px-4 py-2 rounded-lg text-xs font-semibold bg-primary text-on-primary hover:bg-secondary cursor-pointer"
                    >
                      Save Degree
                    </button>
                  </div>
                </div>
              )}

              {/* Education List */}
              <div className="space-y-3">
                {content.education.map((edu) => (
                  <div
                    key={edu.id}
                    className="bg-surface-container-lowest rounded-xl p-4 shadow-xs border border-border-subtle flex items-center justify-between"
                  >
                    <div>
                      <h4 className="font-bold text-primary text-sm">
                        {edu.degree} in {edu.field}
                      </h4>
                      <span className="text-xs text-secondary font-semibold">{edu.institution}</span>
                      <p className="text-xs text-slate-cool mt-1">{edu.researchFocus}</p>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingEducation({ ...edu });
                          setIsAddingEducation(false);
                        }}
                        className="p-1.5 text-slate-cool hover:text-primary hover:bg-surface-container rounded-lg cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[18px]">edit</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          confirmDelete('Delete Education Record?', `Delete ${edu.degree} in ${edu.field}?`, () => {
                            const updated = {
                              ...content,
                              education: content.education.filter((item) => item.id !== edu.id),
                            };
                            setContent(updated);
                            contentService.saveDraft(updated);
                          });
                        }}
                        className="p-1.5 text-slate-cool hover:text-error hover:bg-error/10 rounded-lg cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[18px]">delete</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 5. SKILLS & DOMAINS SECTION */}
          {activeSection === 'skills' && (
            <div className="space-y-4 animate-in fade-in">
              <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-xs border border-border-subtle flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-primary">Technical Skills & Domains</h2>
                  <p className="text-xs text-slate-cool mt-0.5">
                    Manage competency domains and individual technologies with proficiency tags.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setEditingSkillDomain({
                      id: `domain_${Date.now()}`,
                      title: '',
                      icon: 'code',
                      tierBadge: 'Specialization',
                      tierClass: 'bg-primary/10 text-primary',
                      skills: [{ name: '', level: 'Expert' }],
                      published: true,
                    });
                    setIsAddingSkillDomain(true);
                  }}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-primary text-on-primary font-semibold text-xs hover:bg-secondary transition-colors cursor-pointer shadow-xs"
                >
                  <span className="material-symbols-outlined text-[16px]">add</span>
                  <span>Add Skill Domain</span>
                </button>
              </div>

              {/* Skill Domain Editor Form */}
              {(isAddingSkillDomain || editingSkillDomain) && editingSkillDomain && (
                <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-md border-2 border-secondary/30 space-y-4">
                  <h3 className="font-bold text-primary text-base pb-3 border-b border-border-subtle">
                    {isAddingSkillDomain ? 'Add Skill Domain' : `Edit: ${editingSkillDomain.title}`}
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-primary mb-1">Domain Title</label>
                      <input
                        type="text"
                        value={editingSkillDomain.title}
                        onChange={(e) =>
                          setEditingSkillDomain({ ...editingSkillDomain, title: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded-lg border border-border-subtle bg-surface text-sm"
                        placeholder="e.g. Cloud Infrastructure"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-primary mb-1">Material Icon</label>
                      <input
                        type="text"
                        value={editingSkillDomain.icon}
                        onChange={(e) =>
                          setEditingSkillDomain({ ...editingSkillDomain, icon: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded-lg border border-border-subtle bg-surface text-sm"
                        placeholder="e.g. dns, hub, code, computer"
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <label className="text-xs font-bold text-primary">Technologies / Skills in this Domain</label>
                      <button
                        type="button"
                        onClick={() =>
                          setEditingSkillDomain({
                            ...editingSkillDomain,
                            skills: [...editingSkillDomain.skills, { name: '', level: 'Expert' }],
                          })
                        }
                        className="text-xs text-secondary hover:text-primary font-semibold cursor-pointer"
                      >
                        + Add Skill
                      </button>
                    </div>

                    <div className="space-y-2">
                      {editingSkillDomain.skills.map((sk, sIdx) => (
                        <div key={sIdx} className="flex items-center gap-2">
                          <input
                            type="text"
                            value={sk.name}
                            onChange={(e) => {
                              const updated = [...editingSkillDomain.skills];
                              updated[sIdx] = { ...updated[sIdx], name: e.target.value };
                              setEditingSkillDomain({ ...editingSkillDomain, skills: updated });
                            }}
                            className="flex-1 px-3 py-1.5 rounded-lg border border-border-subtle bg-surface text-xs"
                            placeholder="Skill name (e.g. Oracle, Docker, React)"
                          />
                          <select
                            value={sk.level}
                            onChange={(e) => {
                              const updated = [...editingSkillDomain.skills];
                              updated[sIdx] = {
                                ...updated[sIdx],
                                level: e.target.value as 'Expert' | 'Advanced',
                              };
                              setEditingSkillDomain({ ...editingSkillDomain, skills: updated });
                            }}
                            className="px-2 py-1.5 rounded-lg border border-border-subtle bg-surface text-xs font-semibold text-secondary"
                          >
                            <option value="Expert">Expert</option>
                            <option value="Advanced">Advanced</option>
                          </select>
                          <button
                            type="button"
                            onClick={() => {
                              const updated = editingSkillDomain.skills.filter((_, idx) => idx !== sIdx);
                              setEditingSkillDomain({ ...editingSkillDomain, skills: updated });
                            }}
                            className="text-slate-cool hover:text-error p-1 cursor-pointer"
                          >
                            <span className="material-symbols-outlined text-[18px]">delete</span>
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-3 border-t border-border-subtle">
                    <button
                      type="button"
                      onClick={() => {
                        setIsAddingSkillDomain(false);
                        setEditingSkillDomain(null);
                      }}
                      className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-cool hover:bg-surface-container cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (!editingSkillDomain.title.trim()) return;
                        let updatedList: SkillDomain[];
                        if (isAddingSkillDomain) {
                          updatedList = [...content.skillDomains, editingSkillDomain];
                        } else {
                          updatedList = content.skillDomains.map((item) =>
                            item.id === editingSkillDomain.id ? editingSkillDomain : item
                          );
                        }
                        const updated = { ...content, skillDomains: updatedList };
                        setContent(updated);
                        contentService.saveDraft(updated);
                        setIsAddingSkillDomain(false);
                        setEditingSkillDomain(null);
                        showToast('Skill domain saved.');
                      }}
                      className="px-4 py-2 rounded-lg text-xs font-semibold bg-primary text-on-primary hover:bg-secondary cursor-pointer"
                    >
                      Save Domain
                    </button>
                  </div>
                </div>
              )}

              {/* Skill Domains List */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {content.skillDomains.map((dom, idx) => (
                  <div
                    key={dom.id}
                    className="bg-surface-container-lowest rounded-xl p-4 shadow-xs border border-border-subtle flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="material-symbols-outlined text-secondary text-[20px]">
                            {dom.icon}
                          </span>
                          <h4 className="font-bold text-primary text-sm">{dom.title}</h4>
                        </div>
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => {
                              setEditingSkillDomain({ ...dom });
                              setIsAddingSkillDomain(false);
                            }}
                            className="p-1 text-slate-cool hover:text-primary rounded cursor-pointer"
                          >
                            <span className="material-symbols-outlined text-[16px]">edit</span>
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              confirmDelete('Delete Skill Domain?', `Delete domain "${dom.title}"?`, () => {
                                const updated = {
                                  ...content,
                                  skillDomains: content.skillDomains.filter((d) => d.id !== dom.id),
                                };
                                setContent(updated);
                                contentService.saveDraft(updated);
                              });
                            }}
                            className="p-1 text-slate-cool hover:text-error rounded cursor-pointer"
                          >
                            <span className="material-symbols-outlined text-[16px]">delete</span>
                          </button>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {dom.skills.map((sk, sIdx) => (
                          <span
                            key={sIdx}
                            className="text-[11px] px-2 py-0.5 rounded-md bg-surface-container font-medium text-on-surface"
                          >
                            {sk.name} <strong className="text-secondary">({sk.level})</strong>
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 6. CERTIFICATIONS SECTION */}
          {activeSection === 'certifications' && (
            <div className="space-y-4 animate-in fade-in">
              <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-xs border border-border-subtle flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-primary">Certifications & Credentials</h2>
                  <p className="text-xs text-slate-cool mt-0.5">
                    Manage verified certifications (Oracle 11g, Cisco CCNA, Windows Server, ASP.NET, etc.)
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setEditingCertification({
                      id: `cert_${Date.now()}`,
                      title: '',
                      issuer: '',
                      level: 'Professional Certification',
                      period: 'Certified',
                      credentialId: '',
                      status: 'Active',
                      verifyUrl: 'https://',
                      icon: 'verified',
                      published: true,
                    });
                    setIsAddingCertification(true);
                  }}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-primary text-on-primary font-semibold text-xs hover:bg-secondary transition-colors cursor-pointer shadow-xs"
                >
                  <span className="material-symbols-outlined text-[16px]">add</span>
                  <span>Add Certification</span>
                </button>
              </div>

              {/* Certification Edit Form */}
              {(isAddingCertification || editingCertification) && editingCertification && (
                <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-md border-2 border-secondary/30 space-y-4">
                  <h3 className="font-bold text-primary text-base pb-3 border-b border-border-subtle">
                    {isAddingCertification ? 'Add New Certification' : 'Edit Certification'}
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-primary mb-1">Certification Name</label>
                      <input
                        type="text"
                        value={editingCertification.title}
                        onChange={(e) =>
                          setEditingCertification({ ...editingCertification, title: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded-lg border border-border-subtle bg-surface text-sm"
                        placeholder="e.g. Oracle 11g: DBA Administration"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-primary mb-1">Issuing Body</label>
                      <input
                        type="text"
                        value={editingCertification.issuer}
                        onChange={(e) =>
                          setEditingCertification({ ...editingCertification, issuer: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded-lg border border-border-subtle bg-surface text-sm"
                        placeholder="e.g. Oracle Corporation, Cisco Systems"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-primary mb-1">Credential ID</label>
                      <input
                        type="text"
                        value={editingCertification.credentialId}
                        onChange={(e) =>
                          setEditingCertification({ ...editingCertification, credentialId: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded-lg border border-border-subtle bg-surface text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-primary mb-1">Status</label>
                      <select
                        value={editingCertification.status}
                        onChange={(e) =>
                          setEditingCertification({
                            ...editingCertification,
                            status: e.target.value as 'Active' | 'Certified' | 'Expiring',
                          })
                        }
                        className="w-full px-3 py-2 rounded-lg border border-border-subtle bg-surface text-sm"
                      >
                        <option value="Active">Active</option>
                        <option value="Certified">Certified</option>
                        <option value="Expiring">Expiring</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-primary mb-1">Verification URL</label>
                      <input
                        type="text"
                        value={editingCertification.verifyUrl}
                        onChange={(e) =>
                          setEditingCertification({ ...editingCertification, verifyUrl: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded-lg border border-border-subtle bg-surface text-sm"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-3 border-t border-border-subtle">
                    <button
                      type="button"
                      onClick={() => {
                        setIsAddingCertification(false);
                        setEditingCertification(null);
                      }}
                      className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-cool hover:bg-surface-container cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (!editingCertification.title.trim()) return;
                        let updatedList: CertificationRecord[];
                        if (isAddingCertification) {
                          updatedList = [...content.certifications, editingCertification];
                        } else {
                          updatedList = content.certifications.map((item) =>
                            item.id === editingCertification.id ? editingCertification : item
                          );
                        }
                        const updated = { ...content, certifications: updatedList };
                        setContent(updated);
                        contentService.saveDraft(updated);
                        setIsAddingCertification(false);
                        setEditingCertification(null);
                        showToast('Certification saved.');
                      }}
                      className="px-4 py-2 rounded-lg text-xs font-semibold bg-primary text-on-primary hover:bg-secondary cursor-pointer"
                    >
                      Save Certification
                    </button>
                  </div>
                </div>
              )}

              {/* Certifications List */}
              <div className="space-y-3">
                {content.certifications.map((cert) => (
                  <div
                    key={cert.id}
                    className="bg-surface-container-lowest rounded-xl p-4 shadow-xs border border-border-subtle flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                        <span className="material-symbols-outlined text-[20px]">{cert.icon || 'verified'}</span>
                      </div>
                      <div>
                        <h4 className="font-bold text-primary text-sm">{cert.title}</h4>
                        <span className="text-xs text-secondary font-semibold">
                          {cert.issuer} ({cert.status})
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingCertification({ ...cert });
                          setIsAddingCertification(false);
                        }}
                        className="p-1.5 text-slate-cool hover:text-primary hover:bg-surface-container rounded-lg cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[18px]">edit</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          confirmDelete('Delete Certification?', `Delete "${cert.title}"?`, () => {
                            const updated = {
                              ...content,
                              certifications: content.certifications.filter((c) => c.id !== cert.id),
                            };
                            setContent(updated);
                            contentService.saveDraft(updated);
                          });
                        }}
                        className="p-1.5 text-slate-cool hover:text-error hover:bg-error/10 rounded-lg cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[18px]">delete</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 7. PROJECTS & CASE STUDIES SECTION */}
          {activeSection === 'projects' && (
            <div className="space-y-4 animate-in fade-in">
              <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-xs border border-border-subtle flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-primary">Projects & Case Studies</h2>
                  <p className="text-xs text-slate-cool mt-0.5">
                    Manage flagship e-commerce platforms, national registries, and government web systems.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setEditingCaseStudy({
                      id: `case_${Date.now()}`,
                      title: '',
                      role: 'Lead Architect & Developer',
                      year: '2025',
                      domain: 'Enterprise Technology',
                      summary: '',
                      detailedImpact: [''],
                      techTags: ['Web Development', 'Database'],
                      kpiHighlight: {
                        icon: 'rocket_launch',
                        text: 'High Impact',
                        colorClass: 'text-primary',
                      },
                      image: '',
                      published: true,
                    });
                    setIsAddingCaseStudy(true);
                    setProjectImageError(null);
                  }}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-primary text-on-primary font-semibold text-xs hover:bg-secondary transition-colors cursor-pointer shadow-xs"
                >
                  <span className="material-symbols-outlined text-[16px]">add</span>
                  <span>Add Project</span>
                </button>
              </div>

              {/* Project Editor Form */}
              {(isAddingCaseStudy || editingCaseStudy) && editingCaseStudy && (
                <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-md border-2 border-secondary/30 space-y-4">
                  <h3 className="font-bold text-primary text-base pb-3 border-b border-border-subtle">
                    {isAddingCaseStudy ? 'Add Project' : `Edit: ${editingCaseStudy.title}`}
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-primary mb-1">Project / System Title</label>
                      <input
                        type="text"
                        value={editingCaseStudy.title}
                        onChange={(e) =>
                          setEditingCaseStudy({ ...editingCaseStudy, title: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded-lg border border-border-subtle bg-surface text-sm"
                        placeholder="e.g. Yerora.com"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-primary mb-1">Role in Project</label>
                      <input
                        type="text"
                        value={editingCaseStudy.role}
                        onChange={(e) =>
                          setEditingCaseStudy({ ...editingCaseStudy, role: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded-lg border border-border-subtle bg-surface text-sm"
                        placeholder="e.g. Lead Web Architect & Developer"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-primary mb-1">Domain / Category</label>
                      <input
                        type="text"
                        value={editingCaseStudy.domain}
                        onChange={(e) =>
                          setEditingCaseStudy({ ...editingCaseStudy, domain: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded-lg border border-border-subtle bg-surface text-sm"
                        placeholder="e.g. Online Retail, Public Sector"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-primary mb-1">Year / Classification</label>
                      <input
                        type="text"
                        value={editingCaseStudy.year}
                        onChange={(e) =>
                          setEditingCaseStudy({ ...editingCaseStudy, year: e.target.value })
                        }
                        className="w-full px-3 py-2 rounded-lg border border-border-subtle bg-surface text-sm"
                        placeholder="e.g. 2025, Official Portal"
                      />
                    </div>
                  </div>

                  {/* Project Image Management Component */}
                  <div className="p-4 rounded-xl bg-surface-container-low border border-border-subtle space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="block text-xs font-bold text-primary">Project Image</label>
                        <span className="text-[11px] text-slate-cool">Upload project image directly from your computer</span>
                      </div>
                      {editingCaseStudy.image ? (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 font-label-sm text-[11px] font-semibold">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                          Attached
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-surface-container text-slate-cool font-label-sm text-[11px] font-medium">
                          No Image
                        </span>
                      )}
                    </div>

                    <input
                      type="file"
                      ref={projectImageInputRef}
                      accept="image/jpeg,image/jpg,image/png,image/webp,image/svg+xml,.jpg,.jpeg,.png,.webp,.svg"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) handleProjectImageUpload(file);
                        e.target.value = '';
                      }}
                    />

                    {projectImageError && (
                      <div className="p-2.5 rounded-lg bg-error/10 border border-error/20 flex items-center gap-2 text-error text-xs">
                        <span className="material-symbols-outlined text-[16px]">error</span>
                        <span>{projectImageError}</span>
                      </div>
                    )}

                    {editingCaseStudy.image ? (
                      <div className="space-y-3">
                        {/* Image Preview */}
                        <div className="relative w-full h-48 sm:h-56 rounded-xl overflow-hidden bg-surface-container border border-secondary/30 shadow-xs">
                          <img
                            src={editingCaseStudy.image}
                            alt="Project Preview"
                            className="w-full h-full object-cover"
                          />
                          <div className="absolute top-2.5 left-2.5">
                            <span className="px-2.5 py-1 rounded-md bg-black/60 backdrop-blur text-white text-[11px] font-semibold">
                              Preview
                            </span>
                          </div>
                        </div>

                        {/* Action Controls */}
                        <div className="flex flex-wrap items-center gap-2">
                          <button
                            type="button"
                            disabled={isProjectImageUploading}
                            onClick={() => projectImageInputRef.current?.click()}
                            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-primary text-on-primary text-xs font-semibold hover:bg-secondary transition-colors cursor-pointer disabled:opacity-50"
                          >
                            <span className="material-symbols-outlined text-[16px]">sync</span>
                            <span>{isProjectImageUploading ? 'Processing...' : 'Replace Image'}</span>
                          </button>
                          <button
                            type="button"
                            disabled={isProjectImageUploading}
                            onClick={handleRemoveProjectImage}
                            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold text-error hover:bg-error/10 transition-colors cursor-pointer disabled:opacity-50"
                          >
                            <span className="material-symbols-outlined text-[16px]">delete</span>
                            <span>Remove Image</span>
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div
                        onClick={() => projectImageInputRef.current?.click()}
                        onDragOver={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                        }}
                        onDrop={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          const file = e.dataTransfer.files?.[0];
                          if (file) handleProjectImageUpload(file);
                        }}
                        className="border-2 border-dashed border-border-subtle hover:border-primary/50 transition-colors rounded-xl p-6 flex flex-col items-center justify-center text-center cursor-pointer bg-surface/50 hover:bg-surface-container-low"
                      >
                        <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-2">
                          <span className="material-symbols-outlined text-[24px]">
                            {isProjectImageUploading ? 'hourglass_top' : 'add_photo_alternate'}
                          </span>
                        </div>
                        <p className="text-xs font-bold text-primary mb-1">
                          {isProjectImageUploading ? 'Processing Image...' : 'No Project Image Attached'}
                        </p>
                        <p className="text-[11px] text-slate-cool mb-3 max-w-xs">
                          PNG, JPG, WEBP, or SVG up to 10 MB. Drag & drop or select directly from your computer.
                        </p>
                        <button
                          type="button"
                          disabled={isProjectImageUploading}
                          onClick={(e) => {
                            e.stopPropagation();
                            projectImageInputRef.current?.click();
                          }}
                          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-primary text-on-primary text-xs font-semibold hover:bg-secondary transition-colors cursor-pointer shadow-xs disabled:opacity-50"
                        >
                          <span className="material-symbols-outlined text-[16px]">upload_file</span>
                          <span>Upload Project Image</span>
                        </button>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-primary mb-1">Executive Summary</label>
                    <textarea
                      rows={3}
                      value={editingCaseStudy.summary}
                      onChange={(e) =>
                        setEditingCaseStudy({ ...editingCaseStudy, summary: e.target.value })
                      }
                      className="w-full px-3 py-2 rounded-lg border border-border-subtle bg-surface text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-primary mb-1">
                      Tech Tags (comma separated)
                    </label>
                    <input
                      type="text"
                      value={editingCaseStudy.techTags.join(', ')}
                      onChange={(e) =>
                        setEditingCaseStudy({
                          ...editingCaseStudy,
                          techTags: e.target.value.split(',').map((t) => t.trim()).filter(Boolean),
                        })
                      }
                      className="w-full px-3 py-2 rounded-lg border border-border-subtle bg-surface text-sm"
                    />
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-3 border-t border-border-subtle">
                    <button
                      type="button"
                      onClick={() => {
                        setIsAddingCaseStudy(false);
                        setEditingCaseStudy(null);
                        setProjectImageError(null);
                      }}
                      className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-cool hover:bg-surface-container cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (!editingCaseStudy.title.trim()) return;
                        let updatedList: CaseStudy[];
                        if (isAddingCaseStudy) {
                          updatedList = [...content.caseStudies, editingCaseStudy];
                        } else {
                          updatedList = content.caseStudies.map((item) =>
                            item.id === editingCaseStudy.id ? editingCaseStudy : item
                          );
                        }
                        const updated = { ...content, caseStudies: updatedList };
                        setContent(updated);
                        contentService.saveDraft(updated);
                        setIsAddingCaseStudy(false);
                        setEditingCaseStudy(null);
                        setProjectImageError(null);
                        showToast('Project saved.');
                      }}
                      className="px-4 py-2 rounded-lg text-xs font-semibold bg-primary text-on-primary hover:bg-secondary cursor-pointer"
                    >
                      Save Project
                    </button>
                  </div>
                </div>
              )}

              {/* Projects List */}
              <div className="space-y-3">
                {content.caseStudies.map((cs) => (
                  <div
                    key={cs.id}
                    className="bg-surface-container-lowest rounded-xl p-4 shadow-xs border border-border-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      {cs.image ? (
                        <img
                          src={cs.image}
                          alt={cs.title}
                          className="w-14 h-14 rounded-lg object-cover flex-shrink-0 border border-border-subtle"
                        />
                      ) : (
                        <div className="w-14 h-14 rounded-lg bg-surface-container flex items-center justify-center flex-shrink-0 text-slate-cool border border-border-subtle">
                          <span className="material-symbols-outlined text-[24px] text-secondary">account_tree</span>
                        </div>
                      )}
                      <div className="min-w-0">
                        <h4 className="font-bold text-primary text-sm truncate">{cs.title}</h4>
                        <span className="text-xs text-secondary font-semibold block">{cs.role}</span>
                        <span className="text-[11px] text-slate-cool truncate block">{cs.domain}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 self-end sm:self-auto">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingCaseStudy({ ...cs });
                          setIsAddingCaseStudy(false);
                          setProjectImageError(null);
                        }}
                        className="p-1.5 text-slate-cool hover:text-primary hover:bg-surface-container rounded-lg cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[18px]">edit</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          confirmDelete('Delete Project?', `Delete "${cs.title}" from portfolio?`, () => {
                            if (cs.storageKey) {
                              projectImageStorageService.deleteProjectImage(cs.storageKey);
                            }
                            const updated = {
                              ...content,
                              caseStudies: content.caseStudies.filter((item) => item.id !== cs.id),
                            };
                            setContent(updated);
                            contentService.saveDraft(updated);
                          });
                        }}
                        className="p-1.5 text-slate-cool hover:text-error hover:bg-error/10 rounded-lg cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[18px]">delete</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 8. ACHIEVEMENTS & AWARDS */}
          {activeSection === 'achievements' && (
            <div className="space-y-4 animate-in fade-in">
              <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-xs border border-border-subtle flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-primary">Honors & Achievements</h2>
                  <p className="text-xs text-slate-cool mt-0.5">
                    Recognitions, awards of appreciation, and institutional milestones.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setEditingAward({
                      id: `award_${Date.now()}`,
                      title: '',
                      conferrer: '',
                      year: '2024',
                      description: '',
                      icon: 'military_tech',
                      colorClass: 'text-secondary',
                      published: true,
                    });
                    setIsAddingAward(true);
                  }}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-primary text-on-primary font-semibold text-xs hover:bg-secondary transition-colors cursor-pointer shadow-xs"
                >
                  <span className="material-symbols-outlined text-[16px]">add</span>
                  <span>Add Award</span>
                </button>
              </div>

              {/* Award Edit Form */}
              {(isAddingAward || editingAward) && editingAward && (
                <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-md border-2 border-secondary/30 space-y-4">
                  <h3 className="font-bold text-primary text-base pb-3 border-b border-border-subtle">
                    {isAddingAward ? 'Add Honor / Award' : 'Edit Award'}
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-primary mb-1">Award Title</label>
                      <input
                        type="text"
                        value={editingAward.title}
                        onChange={(e) => setEditingAward({ ...editingAward, title: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg border border-border-subtle bg-surface text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-primary mb-1">Conferred By</label>
                      <input
                        type="text"
                        value={editingAward.conferrer}
                        onChange={(e) => setEditingAward({ ...editingAward, conferrer: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg border border-border-subtle bg-surface text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-primary mb-1">Description</label>
                    <textarea
                      rows={2}
                      value={editingAward.description}
                      onChange={(e) => setEditingAward({ ...editingAward, description: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-border-subtle bg-surface text-sm"
                    />
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-3 border-t border-border-subtle">
                    <button
                      type="button"
                      onClick={() => {
                        setIsAddingAward(false);
                        setEditingAward(null);
                      }}
                      className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-cool hover:bg-surface-container cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (!editingAward.title.trim()) return;
                        let updatedList: AwardRecord[];
                        if (isAddingAward) {
                          updatedList = [...content.awards, editingAward];
                        } else {
                          updatedList = content.awards.map((item) =>
                            item.id === editingAward.id ? editingAward : item
                          );
                        }
                        const updated = { ...content, awards: updatedList };
                        setContent(updated);
                        contentService.saveDraft(updated);
                        setIsAddingAward(false);
                        setEditingAward(null);
                        showToast('Award saved.');
                      }}
                      className="px-4 py-2 rounded-lg text-xs font-semibold bg-primary text-on-primary hover:bg-secondary cursor-pointer"
                    >
                      Save Award
                    </button>
                  </div>
                </div>
              )}

              {/* Awards List */}
              <div className="space-y-3">
                {content.awards.map((aw) => (
                  <div
                    key={aw.id}
                    className="bg-surface-container-lowest rounded-xl p-4 shadow-xs border border-border-subtle flex items-center justify-between"
                  >
                    <div>
                      <h4 className="font-bold text-primary text-sm">{aw.title}</h4>
                      <span className="text-xs text-secondary font-semibold">
                        {aw.conferrer} ({aw.year})
                      </span>
                      <p className="text-xs text-slate-cool mt-1">{aw.description}</p>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingAward({ ...aw });
                          setIsAddingAward(false);
                        }}
                        className="p-1.5 text-slate-cool hover:text-primary hover:bg-surface-container rounded-lg cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[18px]">edit</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          confirmDelete('Delete Award?', `Delete "${aw.title}"?`, () => {
                            const updated = {
                              ...content,
                              awards: content.awards.filter((item) => item.id !== aw.id),
                            };
                            setContent(updated);
                            contentService.saveDraft(updated);
                          });
                        }}
                        className="p-1.5 text-slate-cool hover:text-error hover:bg-error/10 rounded-lg cursor-pointer"
                      >
                        <span className="material-symbols-outlined text-[18px]">delete</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 9. RESUME / CV DOCUMENT MANAGEMENT */}
          {activeSection === 'resume' && (
            <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-xs border border-border-subtle space-y-6 animate-in fade-in">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-border-subtle">
                <div>
                  <h2 className="text-xl font-bold text-primary">Resume / CV Document Generation</h2>
                  <p className="text-xs text-slate-cool mt-0.5">
                    Generate the official, formatted executive resume in Word (.docx) and PDF (.pdf) formats. No .txt files are generated.
                  </p>
                </div>
              </div>

              {/* Action Buttons: Download DOCX and Download PDF */}
              <div className="p-4 rounded-xl bg-surface-container-low border border-border-subtle flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-primary text-on-primary flex items-center justify-center">
                    <span className="material-symbols-outlined text-[24px]">description</span>
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-primary">Executive Dossier & CV</h3>
                    <span className="text-xs text-slate-cool">
                      Compiled with live experience, education, skills, and certifications.
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 w-full sm:w-auto">
                  <button
                    type="button"
                    disabled={isExportingResumeDocx}
                    onClick={async () => {
                      setIsExportingResumeDocx(true);
                      try {
                        await downloadResumeDocx(content);
                        showToast('Word resume (.docx) generated successfully.');
                      } catch (e) {
                        showToast('Failed to export DOCX.');
                      } finally {
                        setIsExportingResumeDocx(false);
                      }
                    }}
                    className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-primary font-semibold text-xs border border-border-subtle transition-all cursor-pointer shadow-xs active:scale-95 disabled:opacity-60"
                  >
                    <span className="material-symbols-outlined text-[16px] text-secondary">
                      file_present
                    </span>
                    <span>{isExportingResumeDocx ? 'Generating...' : 'Download Word (.docx)'}</span>
                  </button>

                  <button
                    type="button"
                    disabled={isExportingResumePdf}
                    onClick={async () => {
                      setIsExportingResumePdf(true);
                      try {
                        await downloadResumePdf(content);
                        showToast('PDF resume (.pdf) generated successfully.');
                      } catch (e) {
                        showToast('Failed to export PDF.');
                      } finally {
                        setIsExportingResumePdf(false);
                      }
                    }}
                    className="flex-1 sm:flex-none inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-lg bg-primary text-on-primary hover:bg-secondary font-semibold text-xs transition-all cursor-pointer shadow-xs active:scale-95 disabled:opacity-60"
                  >
                    <span className="material-symbols-outlined text-[16px]">picture_as_pdf</span>
                    <span>{isExportingResumePdf ? 'Generating...' : 'Download PDF (.pdf)'}</span>
                  </button>
                </div>
              </div>

              {/* Resume Preview Highlights */}
              <div className="space-y-3 text-xs text-on-surface">
                <h4 className="font-bold text-primary text-sm">Resume Preview Breakdown</h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="p-3 rounded-lg bg-surface-container">
                    <span className="font-bold block text-primary">1. Personal Summary</span>
                    <span className="text-slate-cool line-clamp-3 mt-1">{content.profile.bio1}</span>
                  </div>
                  <div className="p-3 rounded-lg bg-surface-container">
                    <span className="font-bold block text-primary">2. Experience Count</span>
                    <span className="text-slate-cool mt-1 block">
                      {content.experience.filter((e) => e.published !== false).length} Published Roles
                    </span>
                  </div>
                  <div className="p-3 rounded-lg bg-surface-container">
                    <span className="font-bold block text-primary">3. Certifications Count</span>
                    <span className="text-slate-cool mt-1 block">
                      {content.certifications.filter((c) => c.published !== false).length} Verified Credentials
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* 10. EXECUTIVE LETTERS MANAGEMENT */}
          {activeSection === 'letters' && (
            <div className="space-y-4 animate-in fade-in">
              <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-xs border border-border-subtle flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-bold text-primary">Executive Letters Management</h2>
                  <p className="text-xs text-slate-cool mt-0.5">
                    Create, edit, preview, and generate tailored executive letters (.docx and .pdf only).
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setEditingLetter({
                      id: `let_${Date.now()}`,
                      title: 'Executive Letter of Intent',
                      date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
                      recipientName: 'Search Committee',
                      recipientTitle: 'Search Committee & Leadership',
                      recipientOrg: 'Enterprise Organization',
                      recipientLocation: 'Addis Ababa / Remote',
                      subject: 'Executive Application: Technology Leadership',
                      greeting: 'Dear Members of the Search Committee,',
                      introParagraph: 'I am writing to express my enthusiastic interest in technology leadership roles with your esteemed organization...',
                      bullets: [
                        {
                          title: 'Database Systems & Architecture',
                          description: 'Decade of specialized Oracle 11g DBA and mission-critical system administration.',
                        },
                      ],
                      closingParagraph: 'I welcome the opportunity to discuss how my technical expertise can support your strategic objectives. Thank you.',
                      senderName: content.profile.fullName,
                      senderTitle: content.profile.credentialTitle,
                      createdAt: Date.now(),
                      published: true,
                    });
                    setIsAddingLetter(true);
                  }}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-primary text-on-primary font-semibold text-xs hover:bg-secondary transition-colors cursor-pointer shadow-xs"
                >
                  <span className="material-symbols-outlined text-[16px]">add</span>
                  <span>Create Letter</span>
                </button>
              </div>

              {/* Letter Editor Form */}
              {(isAddingLetter || editingLetter) && editingLetter && (
                <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-md border-2 border-secondary/30 space-y-4">
                  <h3 className="font-bold text-primary text-base pb-3 border-b border-border-subtle">
                    {isAddingLetter ? 'Create Executive Letter' : 'Edit Executive Letter'}
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-primary mb-1">Letter Reference Title</label>
                      <input
                        type="text"
                        value={editingLetter.title}
                        onChange={(e) => setEditingLetter({ ...editingLetter, title: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg border border-border-subtle bg-surface text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-primary mb-1">Letter Date</label>
                      <input
                        type="text"
                        value={editingLetter.date}
                        onChange={(e) => setEditingLetter({ ...editingLetter, date: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg border border-border-subtle bg-surface text-sm"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-primary mb-1">Target Organization</label>
                      <input
                        type="text"
                        value={editingLetter.recipientOrg}
                        onChange={(e) => setEditingLetter({ ...editingLetter, recipientOrg: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg border border-border-subtle bg-surface text-sm"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-primary mb-1">Subject Line</label>
                      <input
                        type="text"
                        value={editingLetter.subject}
                        onChange={(e) => setEditingLetter({ ...editingLetter, subject: e.target.value })}
                        className="w-full px-3 py-2 rounded-lg border border-border-subtle bg-surface text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-primary mb-1">Opening Greeting</label>
                    <input
                      type="text"
                      value={editingLetter.greeting}
                      onChange={(e) => setEditingLetter({ ...editingLetter, greeting: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-border-subtle bg-surface text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-primary mb-1">Introduction Paragraph</label>
                    <textarea
                      rows={3}
                      value={editingLetter.introParagraph}
                      onChange={(e) => setEditingLetter({ ...editingLetter, introParagraph: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-border-subtle bg-surface text-sm"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-primary mb-1">Closing Paragraph</label>
                    <textarea
                      rows={2}
                      value={editingLetter.closingParagraph}
                      onChange={(e) => setEditingLetter({ ...editingLetter, closingParagraph: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-border-subtle bg-surface text-sm"
                    />
                  </div>

                  <div className="flex items-center justify-end gap-2 pt-3 border-t border-border-subtle">
                    <button
                      type="button"
                      onClick={() => {
                        setIsAddingLetter(false);
                        setEditingLetter(null);
                      }}
                      className="px-4 py-2 rounded-lg text-xs font-semibold text-slate-cool hover:bg-surface-container cursor-pointer"
                    >
                      Cancel
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        if (!editingLetter.title.trim()) return;
                        let updatedList: ExecutiveLetterRecord[];
                        if (isAddingLetter) {
                          updatedList = [editingLetter, ...content.executiveLetters];
                        } else {
                          updatedList = content.executiveLetters.map((item) =>
                            item.id === editingLetter.id ? editingLetter : item
                          );
                        }
                        const updated = { ...content, executiveLetters: updatedList };
                        setContent(updated);
                        contentService.saveDraft(updated);
                        setIsAddingLetter(false);
                        setEditingLetter(null);
                        showToast('Executive letter saved.');
                      }}
                      className="px-4 py-2 rounded-lg text-xs font-semibold bg-primary text-on-primary hover:bg-secondary cursor-pointer"
                    >
                      Save Letter
                    </button>
                  </div>
                </div>
              )}

              {/* Letters List with Direct DOCX and PDF export */}
              <div className="space-y-3">
                {content.executiveLetters.map((letItem) => {
                  const letterExportData = {
                    senderName: content.profile.fullName,
                    senderTitle: content.profile.credentialTitle,
                    senderLocation: content.profile.location,
                    senderPhone: content.profile.phone,
                    senderEmail: content.profile.email,
                    senderWebsite: content.profile.website,
                    date: letItem.date,
                    recipientAuthority: letItem.recipientName,
                    recipientOrganization: letItem.recipientOrg,
                    recipientLocation: letItem.recipientLocation,
                    subject: letItem.subject,
                    greeting: letItem.greeting,
                    introParagraph: letItem.introParagraph,
                    competencyHeading: 'STRATEGIC PILLARS & IMPACT',
                    bullets: letItem.bullets,
                    alignmentParagraph: 'My technological foundations in Oracle DBA, networking, and application engineering provide reliable execution.',
                    closingParagraph: letItem.closingParagraph,
                    signoff: 'Sincerely,',
                  };

                  return (
                    <div
                      key={letItem.id}
                      className="bg-surface-container-lowest rounded-xl p-4 shadow-xs border border-border-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div>
                        <h4 className="font-bold text-primary text-sm">{letItem.title}</h4>
                        <span className="text-xs text-secondary font-semibold">
                          {letItem.recipientOrg} • {letItem.date}
                        </span>
                        <p className="text-xs text-slate-cool line-clamp-1 mt-1">{letItem.subject}</p>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-auto">
                        <button
                          type="button"
                          onClick={() => downloadExecutiveLetterDocx(letterExportData)}
                          className="px-2.5 py-1.5 rounded-lg bg-surface-container text-xs font-semibold hover:bg-surface-container-high transition-colors cursor-pointer border border-border-subtle flex items-center gap-1 text-primary"
                          title="Download Word .docx"
                        >
                          <span className="material-symbols-outlined text-[15px] text-secondary">
                            file_present
                          </span>
                          <span>Word</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => downloadExecutiveLetterPdf(letterExportData)}
                          className="px-2.5 py-1.5 rounded-lg bg-surface-container text-xs font-semibold hover:bg-surface-container-high transition-colors cursor-pointer border border-border-subtle flex items-center gap-1 text-primary"
                          title="Download PDF .pdf"
                        >
                          <span className="material-symbols-outlined text-[15px] text-accent-bronze">
                            picture_as_pdf
                          </span>
                          <span>PDF</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            setEditingLetter({ ...letItem });
                            setIsAddingLetter(false);
                          }}
                          className="p-1.5 text-slate-cool hover:text-primary hover:bg-surface-container rounded-lg cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-[18px]">edit</span>
                        </button>

                        <button
                          type="button"
                          onClick={() => {
                            confirmDelete('Delete Letter?', `Delete letter "${letItem.title}"?`, () => {
                              const updated = {
                                ...content,
                                executiveLetters: content.executiveLetters.filter((l) => l.id !== letItem.id),
                              };
                              setContent(updated);
                              contentService.saveDraft(updated);
                            });
                          }}
                          className="p-1.5 text-slate-cool hover:text-error hover:bg-error/10 rounded-lg cursor-pointer"
                        >
                          <span className="material-symbols-outlined text-[18px]">delete</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* 11. MEDIA & ASSETS MANAGEMENT */}
          {activeSection === 'media' && (
            <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-xs border border-border-subtle space-y-6 animate-in fade-in">
              <div className="flex items-center justify-between pb-4 border-b border-border-subtle">
                <div>
                  <h2 className="text-xl font-bold text-primary">Public Media & Assets</h2>
                  <p className="text-xs text-slate-cool mt-0.5">
                    Manage profile photos, monogram logos, project images, and custom uploaded media.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleSaveDraft}
                  className="px-3.5 py-1.5 rounded-lg bg-primary text-on-primary font-semibold text-xs shadow-xs hover:bg-secondary cursor-pointer"
                >
                  Save Assets
                </button>
              </div>

              {/* Core Brand Images */}
              <div className="grid grid-cols-1 gap-4">
                {/* Hero Profile Image (3:4 Aspect Ratio, 600 × 800 px) */}
                {(() => {
                  const mediaHeroAvatar = (content.mediaAssets.avatar || content.profile.avatarUrl || '').trim();
                  const hasMediaHeroImage = mediaHeroAvatar.length > 0;
                  return (
                    <div className="p-4 rounded-xl bg-surface-container-low border border-border-subtle flex flex-col sm:flex-row items-start sm:items-center gap-4">
                      <div className="relative w-24 aspect-[3/4] rounded-xl overflow-hidden bg-surface-container border border-secondary/30 flex-shrink-0 flex items-center justify-center">
                        {hasMediaHeroImage ? (
                          <img
                            src={mediaHeroAvatar}
                            alt="Hero Profile Image"
                            className="w-full h-full object-contain"
                          />
                        ) : (
                          <div className="flex flex-col items-center justify-center text-center p-1 text-slate-cool">
                            <span className="material-symbols-outlined text-[20px] text-secondary">add_photo_alternate</span>
                            <span className="text-[9px] font-semibold">No Image</span>
                          </div>
                        )}
                        <span className="absolute bottom-1 right-1 px-1 py-0.5 rounded bg-surface-container-lowest/90 text-[9px] font-bold text-primary pointer-events-none">
                          3:4
                        </span>
                      </div>
                      <div className="flex-1 min-w-0 w-full space-y-2">
                        <div className="flex flex-wrap items-center justify-between gap-1">
                          <div>
                            <label className="block text-xs font-bold text-primary">Hero Profile Image</label>
                            <span className="text-[11px] text-secondary font-medium">Recommended size: 600 × 800 px (3:4)</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            {hasMediaHeroImage ? (
                              <>
                                <button
                                  type="button"
                                  onClick={() => heroFileInputRef.current?.click()}
                                  className="px-2.5 py-1 rounded-lg bg-primary text-on-primary text-xs font-semibold hover:bg-secondary cursor-pointer"
                                  title="Replace Hero image"
                                >
                                  Replace
                                </button>
                                <button
                                  type="button"
                                  onClick={handleRemoveHeroImage}
                                  className="px-2 py-1 text-xs text-error hover:bg-error/10 rounded-lg cursor-pointer"
                                  title="Remove Hero image"
                                >
                                  Remove
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setHeroPreviewModalOpen(true)}
                                  className="px-2.5 py-1 rounded-lg bg-surface-container text-primary text-xs font-semibold hover:bg-surface-container-high cursor-pointer border border-border-subtle"
                                >
                                  Preview
                                </button>
                              </>
                            ) : (
                              <button
                                type="button"
                                onClick={() => heroFileInputRef.current?.click()}
                                className="px-3 py-1 rounded-lg bg-primary text-on-primary text-xs font-semibold hover:bg-secondary cursor-pointer"
                                title="Upload Hero image"
                              >
                                Upload Image
                              </button>
                            )}
                          </div>
                        </div>
                        <input
                          type="text"
                          value={content.mediaAssets.avatar}
                          onChange={(e) => {
                            const newUrl = e.target.value;
                            setContent((prev) => ({
                              ...prev,
                              mediaAssets: { ...prev.mediaAssets, avatar: newUrl },
                              profile: { ...prev.profile, avatarUrl: newUrl },
                            }));
                          }}
                          placeholder="Image URL (e.g. https://...)"
                          className="w-full px-2.5 py-1.5 rounded-lg border border-border-subtle bg-surface text-xs focus:border-secondary focus:outline-none"
                        />
                      </div>
                    </div>
                  );
                })()}

                {/* Monogram Logo (Header & Navigation) */}
                {(() => {
                  const mediaLogo = (content.mediaAssets.logo || '').trim();
                  const hasMediaLogo = mediaLogo.length > 0;
                  return (
                    <div className="p-4 rounded-xl bg-surface-container-low border border-border-subtle flex flex-col sm:flex-row items-start sm:items-center gap-4">
                      <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-surface-container border border-secondary/30 flex-shrink-0 flex items-center justify-center p-1">
                        {hasMediaLogo ? (
                          <img
                            src={mediaLogo}
                            alt="Monogram Logo"
                            className="w-full h-full object-contain"
                          />
                        ) : (
                          <div className="flex flex-col items-center justify-center text-center p-1 text-slate-cool">
                            <span className="material-symbols-outlined text-[18px] text-secondary">shield_person</span>
                            <span className="text-[8px] font-semibold mt-0.5">No Logo</span>
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0 w-full space-y-2">
                        <div className="flex flex-wrap items-center justify-between gap-1">
                          <div>
                            <label className="block text-xs font-bold text-primary">Monogram Logo</label>
                            <span className="text-[11px] text-secondary font-medium">Displayed in top header & drawer (PNG, SVG, WEBP, JPG)</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <input
                              type="file"
                              ref={logoFileInputRef}
                              onChange={handleMonogramLogoUpload}
                              accept="image/png,image/svg+xml,image/webp,image/jpeg,image/jpg,.png,.svg,.webp,.jpg,.jpeg"
                              className="hidden"
                            />
                            {hasMediaLogo ? (
                              <>
                                <button
                                  type="button"
                                  onClick={() => logoFileInputRef.current?.click()}
                                  className="px-2.5 py-1 rounded-lg bg-primary text-on-primary text-xs font-semibold hover:bg-secondary cursor-pointer"
                                  title="Replace Monogram Logo"
                                >
                                  Replace
                                </button>
                                <button
                                  type="button"
                                  onClick={handleRemoveMonogramLogo}
                                  className="px-2 py-1 text-xs text-error hover:bg-error/10 rounded-lg cursor-pointer"
                                  title="Remove Monogram Logo"
                                >
                                  Remove
                                </button>
                              </>
                            ) : (
                              <button
                                type="button"
                                onClick={() => logoFileInputRef.current?.click()}
                                className="px-3 py-1 rounded-lg bg-primary text-on-primary text-xs font-semibold hover:bg-secondary cursor-pointer"
                                title="Upload Monogram Logo"
                              >
                                Upload Logo
                              </button>
                            )}
                          </div>
                        </div>
                        <input
                          type="text"
                          value={content.mediaAssets.logo}
                          onChange={(e) => {
                            const newLogo = e.target.value;
                            setContent((prev) => ({
                              ...prev,
                              mediaAssets: { ...prev.mediaAssets, logo: newLogo },
                            }));
                            contentService.updateMonogramLogo(newLogo);
                          }}
                          placeholder="Logo URL or custom media reference"
                          className="w-full px-2.5 py-1.5 rounded-lg border border-border-subtle bg-surface text-xs focus:border-secondary focus:outline-none"
                        />
                      </div>
                    </div>
                  );
                })()}
              </div>

              {/* Upload Image Section */}
              <div className="p-4 rounded-xl bg-surface-container-low border border-border-subtle space-y-3">
                <h3 className="text-sm font-bold text-primary">Upload or Add Custom Media</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-xs text-slate-cool mb-1">Media Title</label>
                    <input
                      type="text"
                      value={newMediaTitle}
                      onChange={(e) => setNewMediaTitle(e.target.value)}
                      placeholder="e.g. Server Room Infrastructure"
                      className="w-full px-3 py-1.5 rounded-lg border border-border-subtle bg-surface text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-cool mb-1">Image URL or Local Upload</label>
                    <input
                      type="text"
                      value={newMediaUrl}
                      onChange={(e) => setNewMediaUrl(e.target.value)}
                      placeholder="https://... or choose file below"
                      className="w-full px-3 py-1.5 rounded-lg border border-border-subtle bg-surface text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-slate-cool mb-1">Alt Text / Caption</label>
                    <input
                      type="text"
                      value={newMediaAlt}
                      onChange={(e) => setNewMediaAlt(e.target.value)}
                      placeholder="e.g. Hardware server rack"
                      className="w-full px-3 py-1.5 rounded-lg border border-border-subtle bg-surface text-xs"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-container hover:bg-surface-container-high text-xs font-semibold text-primary cursor-pointer border border-border-subtle">
                    <span className="material-symbols-outlined text-[16px]">upload_file</span>
                    <span>Upload Local Image File</span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={async (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          try {
                            const optimizedUrl = await compressImageFile(file, 800, 800, 0.82);
                            setNewMediaUrl(optimizedUrl);
                            if (!newMediaTitle) setNewMediaTitle(file.name);
                          } catch {
                            const reader = new FileReader();
                            reader.onload = (ev) => {
                              if (ev.target?.result) {
                                setNewMediaUrl(ev.target.result as string);
                                if (!newMediaTitle) setNewMediaTitle(file.name);
                              }
                            };
                            reader.readAsDataURL(file);
                          }
                        }
                      }}
                    />
                  </label>

                  <button
                    type="button"
                    onClick={() => {
                      if (!newMediaUrl.trim()) {
                        showToast('Please provide an image URL or choose a file.');
                        return;
                      }
                      const newUpload = {
                        id: `media_${Date.now()}`,
                        title: newMediaTitle || 'Portfolio Asset',
                        url: newMediaUrl,
                        altText: newMediaAlt || newMediaTitle || 'Asset',
                        uploadedAt: Date.now(),
                      };
                      const updated = {
                        ...content,
                        mediaAssets: {
                          ...content.mediaAssets,
                          customUploads: [...content.mediaAssets.customUploads, newUpload],
                        },
                      };
                      setContent(updated);
                      contentService.saveDraft(updated);
                      setNewMediaTitle('');
                      setNewMediaUrl('');
                      setNewMediaAlt('');
                      showToast('Media asset added.');
                    }}
                    className="px-4 py-1.5 rounded-lg bg-primary text-on-primary text-xs font-semibold hover:bg-secondary cursor-pointer"
                  >
                    Add to Media Library
                  </button>
                </div>
              </div>

              {/* Custom Uploads Gallery */}
              {content.mediaAssets.customUploads.length > 0 && (
                <div>
                  <h3 className="text-sm font-bold text-primary mb-3">Custom Media Assets</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {content.mediaAssets.customUploads.map((asset) => (
                      <div
                        key={asset.id}
                        className="p-2 rounded-xl bg-surface-container-lowest border border-border-subtle flex flex-col gap-2 relative group"
                      >
                        <img
                          src={asset.url}
                          alt={asset.altText}
                          className="w-full h-24 object-cover rounded-lg"
                        />
                        <span className="text-xs font-bold text-primary truncate">{asset.title}</span>
                        <div className="flex flex-col gap-1 text-[10px] text-slate-cool pt-1 border-t border-border-subtle/50">
                          <button
                            type="button"
                            onClick={() => {
                              contentService.updateHeroImage(asset.url);
                              setContent((prev) => ({
                                ...prev,
                                profile: { ...prev.profile, avatarUrl: asset.url },
                                mediaAssets: { ...prev.mediaAssets, avatar: asset.url },
                              }));
                              showToast('Set as active Hero Profile Image.');
                            }}
                            className="text-left text-secondary hover:underline cursor-pointer font-semibold"
                          >
                            Set as Hero Image
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              contentService.updateMonogramLogo(asset.url);
                              setContent((prev) => ({
                                ...prev,
                                mediaAssets: { ...prev.mediaAssets, logo: asset.url },
                              }));
                              showToast('Set as active Monogram Logo.');
                            }}
                            className="text-left text-secondary hover:underline cursor-pointer font-semibold"
                          >
                            Set as Monogram Logo
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              const updated = {
                                ...content,
                                mediaAssets: {
                                  ...content.mediaAssets,
                                  customUploads: content.mediaAssets.customUploads.filter(
                                    (m) => m.id !== asset.id
                                  ),
                                },
                              };
                              setContent(updated);
                              contentService.saveDraft(updated);
                              showToast('Custom media removed from library.');
                            }}
                            className="text-left text-error hover:underline cursor-pointer font-medium"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* 12. CONTACT & SOCIAL LINKS */}
          {activeSection === 'contact' && (
            <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-xs border border-border-subtle space-y-5 animate-in fade-in">
              <div className="flex items-center justify-between pb-4 border-b border-border-subtle">
                <div>
                  <h2 className="text-xl font-bold text-primary">Contact & Social Channels</h2>
                  <p className="text-xs text-slate-cool mt-0.5">
                    Update your public email, telephone, website, and professional social profiles.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleSaveDraft}
                  className="px-3.5 py-1.5 rounded-lg bg-primary text-on-primary font-semibold text-xs shadow-xs hover:bg-secondary cursor-pointer"
                >
                  Save Contact
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-primary mb-1">Public Email</label>
                  <input
                    type="email"
                    value={content.profile.email}
                    onChange={(e) =>
                      setContent((prev) => ({
                        ...prev,
                        profile: { ...prev.profile, email: e.target.value },
                      }))
                    }
                    className="w-full px-3 py-2 rounded-lg border border-border-subtle bg-surface text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-primary mb-1">Phone Number</label>
                  <input
                    type="text"
                    value={content.profile.phone}
                    onChange={(e) =>
                      setContent((prev) => ({
                        ...prev,
                        profile: { ...prev.profile, phone: e.target.value },
                      }))
                    }
                    className="w-full px-3 py-2 rounded-lg border border-border-subtle bg-surface text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-primary mb-1">Location</label>
                  <input
                    type="text"
                    value={content.profile.location}
                    onChange={(e) =>
                      setContent((prev) => ({
                        ...prev,
                        profile: { ...prev.profile, location: e.target.value },
                      }))
                    }
                    className="w-full px-3 py-2 rounded-lg border border-border-subtle bg-surface text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-primary mb-1">Website URL</label>
                  <input
                    type="text"
                    value={content.profile.website}
                    onChange={(e) =>
                      setContent((prev) => ({
                        ...prev,
                        profile: { ...prev.profile, website: e.target.value },
                      }))
                    }
                    className="w-full px-3 py-2 rounded-lg border border-border-subtle bg-surface text-sm"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-primary mb-1">LinkedIn Profile</label>
                  <input
                    type="text"
                    value={content.profile.linkedIn}
                    onChange={(e) =>
                      setContent((prev) => ({
                        ...prev,
                        profile: { ...prev.profile, linkedIn: e.target.value },
                      }))
                    }
                    className="w-full px-3 py-2 rounded-lg border border-border-subtle bg-surface text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-primary mb-1">GitHub Profile</label>
                  <input
                    type="text"
                    value={content.profile.github}
                    onChange={(e) =>
                      setContent((prev) => ({
                        ...prev,
                        profile: { ...prev.profile, github: e.target.value },
                      }))
                    }
                    className="w-full px-3 py-2 rounded-lg border border-border-subtle bg-surface text-sm"
                  />
                </div>
              </div>
            </div>
          )}

          {/* 13. SITE SETTINGS & CTA LABELS */}
          {activeSection === 'settings' && (
            <div className="bg-surface-container-lowest rounded-2xl p-6 shadow-xs border border-border-subtle space-y-5 animate-in fade-in">
              <div className="flex items-center justify-between pb-4 border-b border-border-subtle">
                <div>
                  <h2 className="text-xl font-bold text-primary">Site Settings & Labels</h2>
                  <p className="text-xs text-slate-cool mt-0.5">
                    Edit public CTA button text, footer copyright, and status banners.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleSaveDraft}
                  className="px-3.5 py-1.5 rounded-lg bg-primary text-on-primary font-semibold text-xs shadow-xs hover:bg-secondary cursor-pointer"
                >
                  Save Settings
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-primary mb-1">Download CV Button Text</label>
                  <input
                    type="text"
                    value={content.siteSettings.ctaCvButtonText}
                    onChange={(e) =>
                      setContent((prev) => ({
                        ...prev,
                        siteSettings: { ...prev.siteSettings, ctaCvButtonText: e.target.value },
                      }))
                    }
                    className="w-full px-3 py-2 rounded-lg border border-border-subtle bg-surface text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-primary mb-1">Contact Button Text</label>
                  <input
                    type="text"
                    value={content.siteSettings.ctaContactButtonText}
                    onChange={(e) =>
                      setContent((prev) => ({
                        ...prev,
                        siteSettings: { ...prev.siteSettings, ctaContactButtonText: e.target.value },
                      }))
                    }
                    className="w-full px-3 py-2 rounded-lg border border-border-subtle bg-surface text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-primary mb-1">Public Availability Badge Text</label>
                <input
                  type="text"
                  value={content.siteSettings.statusAvailability}
                  onChange={(e) =>
                    setContent((prev) => ({
                      ...prev,
                      siteSettings: { ...prev.siteSettings, statusAvailability: e.target.value },
                    }))
                  }
                  className="w-full px-3 py-2 rounded-lg border border-border-subtle bg-surface text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-primary mb-1">Footer Copyright Line</label>
                <input
                  type="text"
                  value={content.siteSettings.footerCopyright}
                  onChange={(e) =>
                    setContent((prev) => ({
                      ...prev,
                      siteSettings: { ...prev.siteSettings, footerCopyright: e.target.value },
                    }))
                  }
                  className="w-full px-3 py-2 rounded-lg border border-border-subtle bg-surface text-sm"
                />
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
