/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { NavTab, ProfileData, CaseStudy } from './types';
import { INITIAL_PROFILE, INITIAL_BENCHMARKS } from './data/portfolioData';
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

export default function App() {
  const [activeTab, setActiveTab] = useState<NavTab>('home');
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [profile, setProfile] = useState<ProfileData>(INITIAL_PROFILE);
  const [benchmarks] = useState(INITIAL_BENCHMARKS);
  const [selectedCaseStudy, setSelectedCaseStudy] = useState<CaseStudy | null>(null);
  const [isContactOpen, setIsContactOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [experienceTrack, setExperienceTrack] = useState<'experience' | 'education' | 'certifications'>('experience');

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage((current) => (current === message ? null : current));
    }, 3500);
  };

  const handleDownloadCv = () => {
    showToast('Generating official CV (PDF)...');
    const element = document.createElement('a');
    const content = `TESFAYE TEKLU FEYISSA - CURRICULUM VITAE\n` +
      `Role: System Support Application Officer | IT Systems | Database Administration | Web Development\n` +
      `Phone: ${profile.phone} | Email: ${profile.email}\n` +
      `Website: ${profile.website} | Location: ${profile.location}\n\n` +
      `PROFESSIONAL SUMMARY:\n${profile.bio1}\n\n` +
      `CORE COMPETENCIES:\n${profile.bio2}\n\n` +
      `PROFESSIONAL EXPERIENCE:\n\n` +
      `1. System Support Application Officer\n` +
      `   Ethiopian Reinsurance S.C. (July 2025 – Present)\n` +
      `   • Provide day-to-day technical and functional support for business applications.\n` +
      `   • Create, modify, disable, and manage application user accounts.\n` +
      `   • Manage user roles and permissions according to approved access requirements.\n` +
      `   • Receive and analyze application-related incidents.\n` +
      `   • Identify root causes of recurring problems.\n\n` +
      `2. Network and Hardware Administrator\n` +
      `   Urban Revenue Reform Project Office (July 2018 – July 2025)\n` +
      `   • Oversee IT systems and network operations to ensure optimal performance.\n` +
      `   • Implement and maintain hardware and software solutions to support organizational goals.\n` +
      `   • Collaborate with teams to troubleshoot and resolve technical issues efficiently.\n\n` +
      `3. Database Administrator\n` +
      `   Federal Urban Land and Land-Related Property Registry and Information Agency (July 2017 – June 2018)\n` +
      `   • Managed Oracle database systems critical to national land management.\n` +
      `   • Ensured data security, integrity, and reliability.\n` +
      `   • Optimized database performance and implemented backup and recovery strategies.\n\n` +
      `4. IT Expert\n` +
      `   Ethiopian Fruit and Vegetable Market S.C. (July 2014 – July 2017)\n` +
      `   • Spearheaded IT infrastructure projects to enhance operational efficiency.\n` +
      `   • Provided technical support and training to staff.\n` +
      `   • Maintained IT systems and ensured secure data management.\n\n` +
      `5. Database Administrator\n` +
      `   Radiation Protection Authority (August 2013 – July 2014)\n` +
      `   • Designed and managed Oracle databases to support organizational activities.\n` +
      `   • Implemented database security measures to protect sensitive information.\n` +
      `   • Developed reports to support decision-making processes.\n\n` +
      `EDUCATION:\n` +
      `- B.Sc. in Information Technology\n\n` +
      `CERTIFICATIONS:\n` +
      `- Oracle Database Administrator Certified (OCA / OCP)\n` +
      `- Cisco Certified Network Associate (CCNA)\n` +
      `- Microsoft Certified: Systems & Cloud Administration\n` +
      `- ITIL® 4 Foundation in IT Service Management\n`;

    const file = new Blob([content], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = 'Tesfaye_Teklu_Feyissa_CV.txt';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
    setTimeout(() => {
      showToast('CV downloaded successfully');
    }, 1000);
  };

  const handleNavigateToCredentials = () => {
    setExperienceTrack('certifications');
    setActiveTab('experience');
  };

  return (
    <div className="min-h-screen bg-surface text-on-surface flex flex-col font-body-md antialiased selection:bg-secondary-container selection:text-on-secondary-container">
      {/* Top Fixed Header */}
      <Header
        activeTab={activeTab}
        isAdmin={isAdmin}
        onOpenDrawer={() => setIsDrawerOpen(true)}
        setActiveTab={setActiveTab}
        setIsAdmin={setIsAdmin}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full max-w-2xl mx-auto pt-16 pb-20 flex flex-col">
        {activeTab === 'home' && (
          <HomeView
            benchmarks={benchmarks}
            onDownloadCv={handleDownloadCv}
            onNavigateToCredentials={handleNavigateToCredentials}
            onOpenContact={() => setIsContactOpen(true)}
            profile={profile}
            setActiveTab={setActiveTab}
            toastMessage={toastMessage}
          />
        )}

        {activeTab === 'experience' && (
          <ExperienceView
            benchmarks={benchmarks}
            initialTab={experienceTrack}
          />
        )}

        {activeTab === 'skills' && (
          <SkillsView
            onDownloadCv={handleDownloadCv}
            onOpenContact={() => setIsContactOpen(true)}
            onSelectCaseStudy={(caseStudy) => setSelectedCaseStudy(caseStudy)}
          />
        )}

        {activeTab === 'projects' && (
          <ProjectsView
            onOpenContact={() => setIsContactOpen(true)}
            profile={profile}
          />
        )}

        {activeTab === 'admin' && (
          <AdminView
            onUpdateProfile={(updated) => setProfile(updated)}
            profile={profile}
            setActiveTab={setActiveTab}
          />
        )}
      </main>

      {/* Fixed Bottom Navigation */}
      <BottomNav
        activeTab={activeTab}
        setActiveTab={(tab) => {
          if (tab === 'admin') {
            setIsAdmin(true);
          }
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
        profile={profile}
      />

      <ExecutiveDrawer
        activeTab={activeTab}
        isAdmin={isAdmin}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onDownloadCv={handleDownloadCv}
        onOpenContact={() => setIsContactOpen(true)}
        profile={profile}
        setActiveTab={(tab) => {
          if (tab === 'admin') setIsAdmin(true);
          setActiveTab(tab);
        }}
        setIsAdmin={setIsAdmin}
      />

      <CaseStudyModal
        caseStudy={selectedCaseStudy}
        onClose={() => setSelectedCaseStudy(null)}
        onContactClick={() => setIsContactOpen(true)}
      />
    </div>
  );
}
