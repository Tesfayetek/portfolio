/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { NavTab, CaseStudy, PortfolioContentState } from './types';
import { contentService } from './services/contentService';
import { downloadResumeDocx, downloadResumePdf } from './utils/resumeExport';
import { authService } from './services/authService';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { ContactModal } from './components/ContactModal';
import { ExecutiveDrawer } from './components/ExecutiveDrawer';
import { CaseStudyModal } from './components/CaseStudyModal';
import { HomeView } from './views/HomeView';
import { ExperienceView } from './views/ExperienceView';
import { SkillsView } from './views/SkillsView';
import { ProjectsView } from './views/ProjectsView';
import { AdminView } from './views/AdminView';
import { AdminLoginView } from './views/AdminLoginView';

export default function App() {
  // Public portfolio is the default landing page (Requirement 1)
  const [activeTab, setActiveTab] = useState<NavTab>('home');
  const [isAdmin, setIsAdmin] = useState<boolean>(() => authService.isAuthenticated());
  const [publishedContent, setPublishedContent] = useState<PortfolioContentState>(() =>
    contentService.getPublishedContent()
  );
  const [selectedCaseStudy, setSelectedCaseStudy] = useState<CaseStudy | null>(null);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [experienceTrack, setExperienceTrack] = useState<'experience' | 'education' | 'certifications'>('experience');

  useEffect(() => {
    const unsub = contentService.subscribe((_updated) => {
      setPublishedContent(contentService.getPublishedContent());
    });
    return unsub;
  }, []);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage((current) => (current === message ? null : current));
    }, 3500);
  };

  const handleLoginSuccess = () => {
    setIsAdmin(true);
    setActiveTab('admin');
    showToast('Administrator authenticated successfully');
  };

  const handleLogout = () => {
    authService.logout();
    setIsAdmin(false);
    setActiveTab('home');
    showToast('Logged out of administrative session');
  };

  // Only DOCX and PDF formats are generated (No .txt format anywhere)
  const handleDownloadCv = async (format: 'pdf' | 'docx' = 'pdf') => {
    try {
      const currentPublished = contentService.getPublishedContent();
      if (format === 'docx') {
        showToast('Generating Word resume (.docx)...');
        await downloadResumeDocx(currentPublished);
        showToast('Word resume (.docx) generated successfully');
      } else {
        showToast('Generating PDF resume (.pdf)...');
        await downloadResumePdf(currentPublished);
        showToast('PDF resume (.pdf) generated successfully');
      }
    } catch (err) {
      console.error('Failed to export resume:', err);
      showToast('Error exporting resume. Please try again.');
    }
  };

  const handleNavigateToCredentials = () => {
    setExperienceTrack('certifications');
    setActiveTab('experience');
  };

  return (
    <div className="min-h-screen bg-surface text-on-surface flex flex-col font-body-md antialiased selection:bg-secondary-container selection:text-on-secondary-container">
      {/* Top Fixed Header with Unobtrusive Admin Control */}
      <Header
        activeTab={activeTab}
        fullName={publishedContent.profile.fullName}
        isAdmin={isAdmin}
        logoUrl={publishedContent.mediaAssets?.logo}
        onLogout={handleLogout}
        onOpenAdminLogin={() => setActiveTab('login')}
        onOpenDrawer={() => setIsDrawerOpen(true)}
        setActiveTab={setActiveTab}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-5xl mx-auto pt-16 pb-20 flex flex-col">
        {activeTab === 'home' && (
          <HomeView
            benchmarks={publishedContent.benchmarks}
            isAdmin={isAdmin}
            mediaAssets={publishedContent.mediaAssets}
            onDownloadCv={handleDownloadCv}
            onNavigateToCredentials={handleNavigateToCredentials}
            onOpenAdminLogin={() => setActiveTab('login')}
            onOpenContact={() => setIsContactOpen(true)}
            onToast={showToast}
            profile={publishedContent.profile}
            setActiveTab={setActiveTab}
            siteSettings={publishedContent.siteSettings}
            skillDomains={publishedContent.skillDomains}
            heroTechnologyIcons={publishedContent.heroTechnologyIcons}
            toastMessage={toastMessage}
          />
        )}

        {activeTab === 'experience' && (
          <ExperienceView
            benchmarks={publishedContent.benchmarks}
            certifications={publishedContent.certifications}
            education={publishedContent.education}
            experience={publishedContent.experience}
            initialTab={experienceTrack}
          />
        )}

        {activeTab === 'skills' && (
          <SkillsView
            awards={publishedContent.awards}
            caseStudies={publishedContent.caseStudies}
            languages={publishedContent.languages}
            onDownloadCv={handleDownloadCv}
            onOpenContact={() => setIsContactOpen(true)}
            onSelectCaseStudy={(caseStudy) => setSelectedCaseStudy(caseStudy)}
            skillDomains={publishedContent.skillDomains}
          />
        )}

        {activeTab === 'projects' && (
          <ProjectsView
            onOpenContact={() => setIsContactOpen(true)}
            profile={publishedContent.profile}
          />
        )}

        {/* Dedicated Admin Login Route */}
        {activeTab === 'login' && (
          isAdmin ? (
            <AdminView
              onLogout={handleLogout}
              onUpdateProfile={(_updated) => {
                setPublishedContent(contentService.getPublishedContent());
              }}
              profile={publishedContent.profile}
              setActiveTab={setActiveTab}
            />
          ) : (
            <AdminLoginView
              logoUrl={publishedContent.mediaAssets?.logo}
              onLoginSuccess={handleLoginSuccess}
              onNavigate={setActiveTab}
            />
          )
        )}

        {/* Protected Admin Route: Redirects unauthenticated visitors to Admin Login */}
        {activeTab === 'admin' && (
          isAdmin ? (
            <AdminView
              onLogout={handleLogout}
              onUpdateProfile={(_updated) => {
                setPublishedContent(contentService.getPublishedContent());
              }}
              profile={publishedContent.profile}
              setActiveTab={setActiveTab}
            />
          ) : (
            <AdminLoginView
              logoUrl={publishedContent.mediaAssets?.logo}
              onLoginSuccess={handleLoginSuccess}
              onNavigate={setActiveTab}
            />
          )
        )}
      </main>

      {/* Fixed Bottom Navigation (Includes Admin only if authenticated) */}
      <BottomNav
        activeTab={activeTab}
        isAdmin={isAdmin}
        setActiveTab={(tab) => {
          if (tab === 'experience') {
            setExperienceTrack('experience');
          }
          setActiveTab(tab);
        }}
      />

      {/* Global Modals & Drawers */}
      <ContactModal
        isOpen={isContactOpen}
        onClose={() => setIsContactOpen(false)}
        profile={publishedContent.profile}
      />

      <ExecutiveDrawer
        activeTab={activeTab}
        isAdmin={isAdmin}
        isOpen={isDrawerOpen}
        logoUrl={publishedContent.mediaAssets?.logo}
        onClose={() => setIsDrawerOpen(false)}
        onDownloadCv={handleDownloadCv}
        onLogout={handleLogout}
        onOpenAdminLogin={() => setActiveTab('login')}
        onOpenContact={() => setIsContactOpen(true)}
        profile={publishedContent.profile}
        setActiveTab={setActiveTab}
      />

      <CaseStudyModal
        caseStudy={selectedCaseStudy}
        onClose={() => setSelectedCaseStudy(null)}
        onContactClick={() => setIsContactOpen(true)}
      />
    </div>
  );
}
