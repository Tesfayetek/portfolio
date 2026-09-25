/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  PortfolioContentState,
  SiteSettings,
  MediaAssetsState,
  ExecutiveLetterRecord,
  HeroTechnologyIcon,
} from '../types';
import {
  INITIAL_PROFILE,
  INITIAL_BENCHMARKS,
  INITIAL_EXPERIENCE,
  INITIAL_EDUCATION,
  SKILL_DOMAINS,
  INITIAL_CERTIFICATIONS,
  CASE_STUDIES,
  AWARDS,
  INITIAL_LANGUAGES,
  ASSETS,
} from '../data/portfolioData';
import { authService } from './authService';
import { indexedDbService } from './indexedDbService';

const PUBLISHED_KEY = 'tt_portfolio_published_content_v2';
const DRAFT_KEY = 'tt_portfolio_draft_content_v2';

export const INITIAL_SITE_SETTINGS: SiteSettings = {
  siteTitle: 'Tesfaye Teklu | Professional Portfolio',
  heroHeadline: 'Tesfaye Teklu Feyissa',
  heroTagline: 'System Support Application Officer | IT Systems | Database Administration | Web Development',
  ctaCvButtonText: 'Download CV',
  ctaContactButtonText: 'Contact Me',
  footerText: 'System Support & Database Administration',
  footerCopyright: 'Tesfaye Teklu Feyissa • Professional Portfolio',
  statusAvailability: 'Available for Strategic IT & Database Roles',
  contactSubtitle: 'Open for enterprise technology architecture and database administration inquiries.',
};

export const INITIAL_MEDIA_ASSETS: MediaAssetsState = {
  logo: '',
  avatar: '',
  headerThumb: ASSETS.headerThumb,
  adminPortrait: ASSETS.adminPortrait,
  caseStudyOmnichannel: ASSETS.caseStudyOmnichannel,
  caseStudyBanking: ASSETS.caseStudyBanking,
  caseStudyData: ASSETS.caseStudyData,
  customUploads: [],
};

export const INITIAL_EXECUTIVE_LETTERS: ExecutiveLetterRecord[] = [
  {
    id: 'let_01',
    title: 'Chief Technology Officer / VP of Engineering - Apex Global',
    date: new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
    recipientName: 'Search Committee',
    recipientTitle: 'Board of Directors & Search Committee',
    recipientOrg: 'Apex FinTech Global',
    recipientLocation: 'London / Remote',
    subject: 'Executive Application: Chief Technology Officer / VP of Engineering',
    greeting: 'Dear Members of the Search Committee,',
    introParagraph: 'I am writing to express my enthusiastic interest in the Chief Technology Officer / VP of Engineering role with Apex FinTech Global. With over a decade of hands-on experience spearheading enterprise IT infrastructure, high-availability Oracle database architectures, and business application support across national and enterprise bodies, I offer a disciplined foundation in technology governance and operational resiliency.',
    bullets: [
      {
        title: 'Enterprise Database Administration & Integrity',
        description: 'Deep specialization in Oracle 11g DBA, automated disaster recovery, zero data-loss replication, and multi-tiered business application schemas across financial and regulatory institutions.',
      },
      {
        title: 'Infrastructure & Network Operations',
        description: 'Proven track record overseeing high-throughput Cisco networking, Windows Server, Linux deployments, and network security across 7+ years of public-sector revenue reforms.',
      },
      {
        title: 'Application Support & Stakeholder Enablement',
        description: 'Extensive background leading incident root-cause mitigation, access-control auditing, and cross-functional technical leadership for mission-critical enterprise systems.',
      },
    ],
    closingParagraph: 'I welcome the opportunity to discuss how my technical expertise, operational rigor, and commitment to organizational excellence can support Apex FinTech Global in achieving its strategic technology objectives. Thank you for your consideration.',
    senderName: 'Tesfaye Teklu Feyissa',
    senderTitle: 'System Support Application Officer | Database Administrator',
    createdAt: Date.now() - 86400000 * 2,
    published: true,
  },
];

export const INITIAL_HERO_TECHNOLOGY_ICONS: HeroTechnologyIcon[] = [
  {
    id: 'hero_icon_oracle',
    name: 'Oracle',
    imageUrl: '',
    position: 'Top',
    displayOrder: 1,
    enabled: true,
    createdAt: Date.now() - 70000,
    updatedAt: Date.now() - 70000,
  },
  {
    id: 'hero_icon_aspnet',
    name: 'ASP.NET',
    imageUrl: '',
    position: 'Top Right',
    displayOrder: 2,
    enabled: true,
    createdAt: Date.now() - 60000,
    updatedAt: Date.now() - 60000,
  },
  {
    id: 'hero_icon_mysql',
    name: 'MySQL',
    imageUrl: '',
    position: 'Right',
    displayOrder: 3,
    enabled: true,
    createdAt: Date.now() - 50000,
    updatedAt: Date.now() - 50000,
  },
  {
    id: 'hero_icon_javascript',
    name: 'JavaScript',
    imageUrl: '',
    position: 'Bottom Right',
    displayOrder: 4,
    enabled: true,
    createdAt: Date.now() - 40000,
    updatedAt: Date.now() - 40000,
  },
  {
    id: 'hero_icon_html',
    name: 'HTML',
    imageUrl: '',
    position: 'Bottom',
    displayOrder: 5,
    enabled: true,
    createdAt: Date.now() - 30000,
    updatedAt: Date.now() - 30000,
  },
  {
    id: 'hero_icon_cisco',
    name: 'Cisco Networking',
    imageUrl: '',
    position: 'Bottom Left',
    displayOrder: 6,
    enabled: true,
    createdAt: Date.now() - 20000,
    updatedAt: Date.now() - 20000,
  },
  {
    id: 'hero_icon_linux',
    name: 'Linux',
    imageUrl: '',
    position: 'Left',
    displayOrder: 7,
    enabled: true,
    createdAt: Date.now() - 10000,
    updatedAt: Date.now() - 10000,
  },
  {
    id: 'hero_icon_windows',
    name: 'Windows Server',
    imageUrl: '',
    position: 'Top Left',
    displayOrder: 8,
    enabled: true,
    createdAt: Date.now(),
    updatedAt: Date.now(),
  },
];

export function getInitialContentState(): PortfolioContentState {
  return {
    profile: { ...INITIAL_PROFILE },
    benchmarks: { ...INITIAL_BENCHMARKS },
    experience: INITIAL_EXPERIENCE.map((item, idx) => ({
      ...item,
      published: true,
      order: idx,
    })),
    education: INITIAL_EDUCATION.map((item, idx) => ({
      ...item,
      published: true,
      order: idx,
    })),
    skillDomains: SKILL_DOMAINS.map((item, idx) => ({
      ...item,
      published: true,
      order: idx,
      skills: [...item.skills],
    })),
    certifications: INITIAL_CERTIFICATIONS.map((item, idx) => ({
      ...item,
      published: true,
      order: idx,
    })),
    caseStudies: CASE_STUDIES.map((item, idx) => ({
      ...item,
      published: true,
      order: idx,
      detailedImpact: item.detailedImpact ? [...item.detailedImpact] : [],
      techTags: [...item.techTags],
    })),
    awards: AWARDS.map((item, idx) => ({
      ...item,
      published: true,
      order: idx,
    })),
    languages: INITIAL_LANGUAGES.map((item, idx) => ({
      ...item,
      published: true,
      order: idx,
    })),
    executiveLetters: [...INITIAL_EXECUTIVE_LETTERS],
    heroTechnologyIcons: [...INITIAL_HERO_TECHNOLOGY_ICONS],
    siteSettings: { ...INITIAL_SITE_SETTINGS },
    mediaAssets: { ...INITIAL_MEDIA_ASSETS },
    lastPublishedAt: Date.now(),
    hasDraftChanges: false,
  };
}

type Listener = (state: PortfolioContentState) => void;
const listeners: Set<Listener> = new Set();

const OBSOLETE_HERO_URLS = [
  'https://lh3.googleusercontent.com/aida-public/AB6AXuC83zoylQsEqr44w9DLYFx8yWQAeJRQGrlmnS6XeP9dwSGl6brtLv_Gt0HnOL6FTSTFuwFmC5kRCO1rZRRdJcltl7nADn4_DXIYeizHezrW4n3SssNi_AFkatOC6PEvPOGikTh3meTqwbzhWHqAWw1tk9JRO4ZriS1InnWuI0J_S_Adis4FM2j4Len62nx0JLDaGXgOPbBFdovu2v3jnZS_ou-pbJOeNrbh26XhkPwMwsIZre9hB1F7IQ',
];

const OBSOLETE_LOGO_URLS = [
  'https://lh3.googleusercontent.com/aida/AEtjO1U22tDXMr4FfLvZCuSJKF9XFffi9uwi7ySB0vSlh6jLEtC1RZ61Ira7-1Vbv4GRc3HHNCq9Xq5eLWTPdDwrrEBqxILjeeQ2ZGN99R3ITuESqPGpy7WopKP_q12pQaIubotWT7-PW6uFXBv0CwZGj4vm4v1FZ4F24gE_HQKO2hSqtQi6VuUvEDoWX8NHH1v8TOm2N_cHGZiKfbYm8WF-VQzL3LGy6xC-OUYiAT6_OWuR2qGgd7NO1RMFmVy8',
];

// In-memory runtime cache to guarantee synchronous, non-failing reads
let memoryPublishedState: PortfolioContentState | null = null;
let memoryDraftState: PortfolioContentState | null = null;
let hasHydratedFromIdb = false;

/**
 * Sanitizes portfolio state by stripping obsolete hardcoded default media URLs.
 * Guarantees that no obsolete Hero Profile Image or Monogram Logo URLs remain in storage.
 */
function sanitizeMediaState(state: PortfolioContentState): { state: PortfolioContentState; modified: boolean } {
  let modified = false;
  let avatar = (state.mediaAssets?.avatar || '').trim();
  let logo = (state.mediaAssets?.logo || '').trim();
  let profileAvatar = (state.profile?.avatarUrl || '').trim();

  if (OBSOLETE_HERO_URLS.includes(avatar)) {
    avatar = '';
    modified = true;
  }
  if (OBSOLETE_HERO_URLS.includes(profileAvatar)) {
    profileAvatar = '';
    modified = true;
  }
  if (OBSOLETE_LOGO_URLS.includes(logo)) {
    logo = '';
    modified = true;
  }

  if (modified) {
    return {
      state: {
        ...state,
        profile: {
          ...state.profile,
          avatarUrl: profileAvatar,
        },
        mediaAssets: {
          ...state.mediaAssets,
          avatar,
          logo,
        },
      },
      modified: true,
    };
  }

  return { state, modified: false };
}

/**
 * Checks if a string is a large embedded data URL that would consume
 * significant localStorage quota.
 */
function isLargeDataUrl(val: unknown): boolean {
  return typeof val === 'string' && val.startsWith('data:') && val.length > 2000;
}

/**
 * Creates a slim copy of the state suitable for localStorage.
 * Replaces large data URLs with lightweight `idb_ref:` pointers while
 * saving the full resolution data URLs into IndexedDB.
 */
function offloadLargeMediaAssets(state: PortfolioContentState): {
  slimState: PortfolioContentState;
  offloadedMap: Record<string, string>;
} {
  const offloadedMap: Record<string, string> = {};
  let avatar = state.mediaAssets?.avatar || '';
  let logo = state.mediaAssets?.logo || '';
  let profileAvatar = state.profile?.avatarUrl || '';

  if (isLargeDataUrl(avatar)) {
    const key = 'media_asset_hero_avatar';
    offloadedMap[key] = avatar;
    avatar = `idb_ref:${key}`;
  }

  if (isLargeDataUrl(profileAvatar)) {
    const key = 'media_asset_hero_avatar';
    offloadedMap[key] = profileAvatar;
    profileAvatar = `idb_ref:${key}`;
  }

  if (isLargeDataUrl(logo)) {
    const key = 'media_asset_monogram_logo';
    offloadedMap[key] = logo;
    logo = `idb_ref:${key}`;
  }

  const slimUploads = (state.mediaAssets?.customUploads || []).map((upload) => {
    if (isLargeDataUrl(upload.url)) {
      const key = `media_custom_${upload.id}`;
      offloadedMap[key] = upload.url;
      return { ...upload, url: `idb_ref:${key}` };
    }
    return upload;
  });

  const slimCaseStudies = (state.caseStudies || []).map((cs) => {
    if (isLargeDataUrl(cs.image)) {
      const key = cs.storageKey || `project_image_${cs.id}`;
      offloadedMap[key] = cs.image;
      return { ...cs, image: `idb_ref:${key}`, storageKey: key };
    }
    return cs;
  });

  const slimHeroIcons = (state.heroTechnologyIcons || INITIAL_HERO_TECHNOLOGY_ICONS).map((icon) => {
    if (isLargeDataUrl(icon.imageUrl)) {
      const key = icon.storageKey || `hero_tech_icon_${icon.id}`;
      offloadedMap[key] = icon.imageUrl;
      return { ...icon, imageUrl: `idb_ref:${key}`, storageKey: key };
    }
    return icon;
  });

  const slimState: PortfolioContentState = {
    ...state,
    profile: {
      ...state.profile,
      avatarUrl: profileAvatar,
    },
    caseStudies: slimCaseStudies,
    heroTechnologyIcons: slimHeroIcons,
    mediaAssets: {
      ...state.mediaAssets,
      avatar,
      logo,
      customUploads: slimUploads,
    },
  };

  return { slimState, offloadedMap };
}

/**
 * Hydrates any `idb_ref:` pointer references with real data URLs from a lookup source.
 */
function hydrateMediaAssets(
  state: PortfolioContentState,
  resolver: (key: string) => string | null
): PortfolioContentState {
  let avatar = state.mediaAssets?.avatar || '';
  let logo = state.mediaAssets?.logo || '';
  let profileAvatar = state.profile?.avatarUrl || '';

  if (typeof avatar === 'string' && avatar.startsWith('idb_ref:')) {
    const key = avatar.replace('idb_ref:', '');
    const real = resolver(key);
    if (real) avatar = real;
  }

  if (typeof profileAvatar === 'string' && profileAvatar.startsWith('idb_ref:')) {
    const key = profileAvatar.replace('idb_ref:', '');
    const real = resolver(key);
    if (real) profileAvatar = real;
  }

  if (typeof logo === 'string' && logo.startsWith('idb_ref:')) {
    const key = logo.replace('idb_ref:', '');
    const real = resolver(key);
    if (real) logo = real;
  }

  const hydratedUploads = (state.mediaAssets?.customUploads || []).map((upload) => {
    if (typeof upload.url === 'string' && upload.url.startsWith('idb_ref:')) {
      const key = upload.url.replace('idb_ref:', '');
      const real = resolver(key);
      if (real) return { ...upload, url: real };
    }
    return upload;
  });

  const hydratedCaseStudies = (state.caseStudies || []).map((cs) => {
    if (typeof cs.image === 'string' && cs.image.startsWith('idb_ref:')) {
      const key = cs.image.replace('idb_ref:', '');
      const real = resolver(key);
      if (real) return { ...cs, image: real, storageKey: key };
    }
    return cs;
  });

  const hydratedHeroIcons = (state.heroTechnologyIcons || INITIAL_HERO_TECHNOLOGY_ICONS).map((icon) => {
    if (typeof icon.imageUrl === 'string' && icon.imageUrl.startsWith('idb_ref:')) {
      const key = icon.imageUrl.replace('idb_ref:', '');
      const real = resolver(key);
      if (real) return { ...icon, imageUrl: real, storageKey: key };
    }
    return icon;
  });

  return {
    ...state,
    profile: {
      ...state.profile,
      avatarUrl: profileAvatar,
    },
    caseStudies: hydratedCaseStudies,
    heroTechnologyIcons: hydratedHeroIcons,
    mediaAssets: {
      ...state.mediaAssets,
      avatar,
      logo,
      customUploads: hydratedUploads,
    },
  };
}

function notifyListeners(state: PortfolioContentState) {
  listeners.forEach((l) => {
    try {
      l(state);
    } catch (e) {
      console.error('Content listener notification error:', e);
    }
  });
}

/**
 * Clean up legacy or jammed localStorage entries that may be consuming quota.
 */
function cleanupLocalStorageQuotaSafeguards() {
  try {
    const heroRaw = localStorage.getItem('tt_hero_profile_image_store_v1');
    if (heroRaw && heroRaw.length > 500000) {
      localStorage.removeItem('tt_hero_profile_image_store_v1');
    }
  } catch (e) {
    console.warn('LocalStorage cleanup safeguard error:', e);
  }
}

export const contentService = {
  // Subscribe to changes in content state
  subscribe(listener: Listener): () => void {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },

  // Retrieve the published content (visible to public visitors)
  getPublishedContent(): PortfolioContentState {
    if (memoryPublishedState) {
      return memoryPublishedState;
    }

    try {
      const stored = localStorage.getItem(PUBLISHED_KEY);
      if (stored) {
        const parsed: PortfolioContentState = JSON.parse(stored);
        if (
          !parsed.heroTechnologyIcons ||
          !Array.isArray(parsed.heroTechnologyIcons) ||
          parsed.heroTechnologyIcons.length === 0
        ) {
          parsed.heroTechnologyIcons = [...INITIAL_HERO_TECHNOLOGY_ICONS];
        }
        const { state: cleanState } = sanitizeMediaState(parsed);
        const hydrated = hydrateMediaAssets(cleanState, (k) => indexedDbService.getItemSync(k));
        memoryPublishedState = hydrated;
        this.triggerAsyncHydration();
        return hydrated;
      }
    } catch (e) {
      console.error('Error loading published content from localStorage:', e);
    }

    const initial = getInitialContentState();
    memoryPublishedState = initial;
    this.persistPublished(initial);
    this.triggerAsyncHydration();
    return initial;
  },

  // Retrieve the working draft content (used inside the Admin Dashboard)
  getDraftContent(): PortfolioContentState {
    if (memoryDraftState) {
      return memoryDraftState;
    }

    try {
      const stored = localStorage.getItem(DRAFT_KEY);
      if (stored) {
        const parsed: PortfolioContentState = JSON.parse(stored);
        if (
          !parsed.heroTechnologyIcons ||
          !Array.isArray(parsed.heroTechnologyIcons) ||
          parsed.heroTechnologyIcons.length === 0
        ) {
          parsed.heroTechnologyIcons = [...INITIAL_HERO_TECHNOLOGY_ICONS];
        }
        const { state: cleanDraft } = sanitizeMediaState(parsed);
        const hydrated = hydrateMediaAssets(cleanDraft, (k) => indexedDbService.getItemSync(k));
        memoryDraftState = hydrated;
        this.triggerAsyncHydration();
        return hydrated;
      }
    } catch (e) {
      console.error('Error loading draft content from localStorage:', e);
    }

    // Default to published content if draft doesn't exist
    const published = this.getPublishedContent();
    const draft = { ...published, hasDraftChanges: false };
    memoryDraftState = draft;
    this.persistDraft(draft);
    this.triggerAsyncHydration();
    return draft;
  },

  // Save changes to the draft (authenticated admin only)
  saveDraft(updatedDraft: PortfolioContentState): PortfolioContentState {
    if (!authService.isAuthenticated()) {
      throw new Error('Unauthorized. Administrator session required to save changes.');
    }

    const draftWithFlag: PortfolioContentState = {
      ...updatedDraft,
      hasDraftChanges: true,
    };

    memoryDraftState = draftWithFlag;
    this.persistDraft(draftWithFlag);
    notifyListeners(draftWithFlag);
    return draftWithFlag;
  },

  // Retrieve the current active Hero Profile Image URL from published state
  getHeroImageUrl(): string {
    try {
      const published = this.getPublishedContent();
      return (published.mediaAssets.avatar || published.profile.avatarUrl || '').trim();
    } catch {
      return '';
    }
  },

  // Retrieve the current active Monogram Logo URL from published state
  getMonogramLogoUrl(): string {
    try {
      const published = this.getPublishedContent();
      return (published.mediaAssets.logo || '').trim();
    } catch {
      return '';
    }
  },

  // Update Hero Profile Image directly (authenticated admin only)
  // Updates both live published and draft states persistently
  updateHeroImage(imageUrl: string | null): PortfolioContentState {
    if (!authService.isAuthenticated()) {
      throw new Error('Unauthorized. Administrator session required to manage Hero Image.');
    }

    const cleanUrl = (imageUrl || '').trim();
    const published = this.getPublishedContent();
    const draft = this.getDraftContent();

    const updatedPublished: PortfolioContentState = {
      ...published,
      profile: {
        ...published.profile,
        avatarUrl: cleanUrl,
      },
      mediaAssets: {
        ...published.mediaAssets,
        avatar: cleanUrl,
      },
      lastPublishedAt: Date.now(),
    };

    const updatedDraft: PortfolioContentState = {
      ...draft,
      profile: {
        ...draft.profile,
        avatarUrl: cleanUrl,
      },
      mediaAssets: {
        ...draft.mediaAssets,
        avatar: cleanUrl,
      },
    };

    memoryPublishedState = updatedPublished;
    memoryDraftState = updatedDraft;

    this.persistPublished(updatedPublished);
    this.persistDraft(updatedDraft);
    notifyListeners(updatedPublished);
    return updatedPublished;
  },

  // Update Monogram Logo directly (authenticated admin only)
  // Updates both live published and draft states persistently
  updateMonogramLogo(logoUrl: string | null): PortfolioContentState {
    if (!authService.isAuthenticated()) {
      throw new Error('Unauthorized. Administrator session required to manage Monogram Logo.');
    }

    const cleanUrl = (logoUrl || '').trim();
    const published = this.getPublishedContent();
    const draft = this.getDraftContent();

    const updatedPublished: PortfolioContentState = {
      ...published,
      mediaAssets: {
        ...published.mediaAssets,
        logo: cleanUrl,
      },
      lastPublishedAt: Date.now(),
    };

    const updatedDraft: PortfolioContentState = {
      ...draft,
      mediaAssets: {
        ...draft.mediaAssets,
        logo: cleanUrl,
      },
    };

    memoryPublishedState = updatedPublished;
    memoryDraftState = updatedDraft;

    this.persistPublished(updatedPublished);
    this.persistDraft(updatedDraft);
    notifyListeners(updatedPublished);
    return updatedPublished;
  },

  // Publish the current draft to become the live public portfolio
  publishDraft(): PortfolioContentState {
    if (!authService.isAuthenticated()) {
      throw new Error('Unauthorized. Administrator session required to publish changes.');
    }

    const draft = this.getDraftContent();
    const publishedState: PortfolioContentState = {
      ...draft,
      lastPublishedAt: Date.now(),
      hasDraftChanges: false,
    };

    memoryPublishedState = publishedState;
    memoryDraftState = publishedState;

    this.persistPublished(publishedState);
    this.persistDraft(publishedState);
    notifyListeners(publishedState);
    return publishedState;
  },

  // Discard working draft changes and revert to live published state
  discardDraft(): PortfolioContentState {
    if (!authService.isAuthenticated()) {
      throw new Error('Unauthorized. Administrator session required.');
    }

    const published = this.getPublishedContent();
    const restoredDraft: PortfolioContentState = {
      ...published,
      hasDraftChanges: false,
    };

    memoryDraftState = restoredDraft;
    this.persistDraft(restoredDraft);
    notifyListeners(restoredDraft);
    return restoredDraft;
  },

  // Reset to factory initial data
  resetToDefaults(): PortfolioContentState {
    if (!authService.isAuthenticated()) {
      throw new Error('Unauthorized.');
    }

    const initial = getInitialContentState();
    memoryPublishedState = initial;
    memoryDraftState = initial;

    this.persistPublished(initial);
    this.persistDraft(initial);
    notifyListeners(initial);
    return initial;
  },

  // Quota-resilient persistence helpers
  persistPublished(state: PortfolioContentState) {
    memoryPublishedState = state;

    // Asynchronously write full state to high-capacity IndexedDB
    try {
      indexedDbService.setItem(PUBLISHED_KEY, JSON.stringify(state));
    } catch (e) {
      console.warn('IndexedDB write published warning:', e);
    }

    // Try direct localStorage write
    try {
      localStorage.setItem(PUBLISHED_KEY, JSON.stringify(state));
    } catch {
      // Quota exceeded! Offload large media assets and save slim state
      cleanupLocalStorageQuotaSafeguards();
      const { slimState, offloadedMap } = offloadLargeMediaAssets(state);

      // Persist offloaded items to IndexedDB
      Object.entries(offloadedMap).forEach(([k, v]) => {
        indexedDbService.setItem(k, v);
      });

      try {
        localStorage.setItem(PUBLISHED_KEY, JSON.stringify(slimState));
      } catch (err2) {
        console.warn('LocalStorage full; published state safely retained in IndexedDB and memory:', err2);
      }
    }
  },

  persistDraft(state: PortfolioContentState) {
    memoryDraftState = state;

    // Asynchronously write full state to high-capacity IndexedDB
    try {
      indexedDbService.setItem(DRAFT_KEY, JSON.stringify(state));
    } catch (e) {
      console.warn('IndexedDB write draft warning:', e);
    }

    // Try direct localStorage write
    try {
      localStorage.setItem(DRAFT_KEY, JSON.stringify(state));
    } catch {
      // Quota exceeded! Offload large media assets and save slim state
      cleanupLocalStorageQuotaSafeguards();
      const { slimState, offloadedMap } = offloadLargeMediaAssets(state);

      // Persist offloaded items to IndexedDB
      Object.entries(offloadedMap).forEach(([k, v]) => {
        indexedDbService.setItem(k, v);
      });

      try {
        localStorage.setItem(DRAFT_KEY, JSON.stringify(slimState));
      } catch (err2) {
        console.warn('LocalStorage full; draft state safely retained in IndexedDB and memory:', err2);
      }
    }
  },

  /**
   * Asynchronously hydrates any offloaded images from IndexedDB
   * on app boot and updates state seamlessly.
   */
  async triggerAsyncHydration() {
    if (hasHydratedFromIdb) return;

    try {
      await indexedDbService.primeCache();
      hasHydratedFromIdb = true;

      // Check if memory states need hydration from prime cache
      let updated = false;
      if (memoryPublishedState) {
        const hydrated = hydrateMediaAssets(memoryPublishedState, (k) => indexedDbService.getItemSync(k));
        if (
          hydrated.mediaAssets.avatar !== memoryPublishedState.mediaAssets.avatar ||
          hydrated.mediaAssets.logo !== memoryPublishedState.mediaAssets.logo
        ) {
          memoryPublishedState = hydrated;
          updated = true;
        }
      }

      if (memoryDraftState) {
        const hydrated = hydrateMediaAssets(memoryDraftState, (k) => indexedDbService.getItemSync(k));
        if (
          hydrated.mediaAssets.avatar !== memoryDraftState.mediaAssets.avatar ||
          hydrated.mediaAssets.logo !== memoryDraftState.mediaAssets.logo
        ) {
          memoryDraftState = hydrated;
          updated = true;
        }
      }

      if (updated && memoryPublishedState) {
        notifyListeners(memoryPublishedState);
      }
    } catch (e) {
      console.warn('Async hydration from IndexedDB completed with warning:', e);
    }
  },
};

// Immediate cleanup of any bloated historical keys on initial load
cleanupLocalStorageQuotaSafeguards();
// Kick off async cache priming
contentService.triggerAsyncHydration();
