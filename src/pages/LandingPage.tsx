import React, { useState } from 'react';
import { MainNavbar } from '../components/navigation/MainNavbar';
import { HeroSection } from '../components/hero/HeroSection';
import { ThreeFeatureStrip } from '../components/landing/ThreeFeatureStrip';
import { AboutSmartHcmSection } from '../components/landing/AboutSmartHcmSection';
import { PlatformServicesShowcase } from '../components/landing/PlatformServicesShowcase';
import { ProductDashboardShowcase } from '../components/landing/ProductDashboardShowcase';
import { SolutionsSection } from '../components/landing/SolutionsSection';
import { HowItWorksSection } from '../components/landing/HowItWorksSection';
import { TrustSection } from '../components/landing/TrustSection';
import { BenefitsSection } from '../components/landing/BenefitsSection';
import { PricingSection } from '../components/landing/PricingSection';
import { FaqSection } from '../components/landing/FaqSection';
import { CompanyApplicationSection } from '../components/landing/CompanyApplicationSection';
import { Footer } from '../components/landing/Footer';

// Modals & Drawers
import { RequestDemoModal } from '../components/modals/RequestDemoModal';
import { SearchModal } from '../components/modals/SearchModal';
import { VideoWalkthroughModal } from '../components/modals/VideoWalkthroughModal';
import { WikiDrawer } from '../components/modals/WikiDrawer';
import { SupportModal } from '../components/modals/SupportModal';
import { MobileNavDrawer } from '../components/navigation/MobileNavDrawer';
import { ContactSalesModal } from '../components/modals/ContactSalesModal';

export const LandingPage: React.FC = () => {
  const [demoModalOpen, setDemoModalOpen] = useState(false);
  const [selectedDemoModule, setSelectedDemoModule] = useState<string | undefined>(undefined);
  const [applicationMode, setApplicationMode] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);
  const [videoModalOpen, setVideoModalOpen] = useState(false);
  const [wikiDrawerOpen, setWikiDrawerOpen] = useState(false);
  const [supportModalOpen, setSupportModalOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [contactSalesOpen, setContactSalesOpen] = useState(false);

  const handleOpenDemo = (moduleName?: string) => {
    setApplicationMode(false);
    setSelectedDemoModule(moduleName);
    setDemoModalOpen(true);
  };

  const handleOpenCompanyApplication = () => {
    setApplicationMode(true);
    setSelectedDemoModule(undefined);
    setDemoModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#051720] text-slate-100 flex flex-col selection:bg-[#ff6f32]/25 selection:text-white transition-colors">
      {/* Primary Navigation */}
      <MainNavbar
        onRequestDemo={() => handleOpenDemo()}
        onApplyAsCompany={handleOpenCompanyApplication}
        onOpenSearch={() => setSearchModalOpen(true)}
        onOpenMobileMenu={() => setMobileMenuOpen(true)}
        onContactSales={() => setContactSalesOpen(true)}
        onOpenWiki={() => setWikiDrawerOpen(true)}
        onOpenSupport={() => setSupportModalOpen(true)}
      />

      {/* Hero Section */}
      <HeroSection
        onRequestDemo={() => handleOpenDemo()}
      />

      {/* Core Capabilities Strip */}
      <ThreeFeatureStrip />

      {/* About SmartHCM Section */}
      <AboutSmartHcmSection
        onWhySmartHcm={() => setVideoModalOpen(true)}
        onRequestDemo={() => handleOpenDemo()}
      />

      {/* Platform and Services Showcase */}
      <PlatformServicesShowcase
        onRequestDemo={(mod) => handleOpenDemo(mod)}
      />

      {/* Product Dashboard Showcase */}
      <ProductDashboardShowcase />

      {/* Industry & Organizational Solutions */}
      <SolutionsSection />

      {/* Implementation Process */}
      <HowItWorksSection />

      {/* Security & Compliance Credentials */}
      <TrustSection />

      {/* Business Benefits & Metrics */}
      <BenefitsSection onOpenDemo={() => handleOpenDemo()} />

      {/* Pricing & Feature Comparison */}
      <PricingSection
        onRequestDemo={() => handleOpenDemo()}
        onContactSales={() => setContactSalesOpen(true)}
      />

      {/* FAQ Accordion */}
      <FaqSection />

      {/* Conversion CTA Strip */}
      <CompanyApplicationSection
        onApply={handleOpenCompanyApplication}
        onRequestDemo={() => handleOpenDemo()}
      />

      {/* Corporate Footer */}
      <Footer
        onRequestDemo={() => handleOpenDemo()}
        onOpenWiki={() => setWikiDrawerOpen(true)}
        onOpenSupport={() => setSupportModalOpen(true)}
      />

      {/* Modals & Interactive Overlays */}
      <RequestDemoModal
        isOpen={demoModalOpen}
        onClose={() => setDemoModalOpen(false)}
        defaultModule={selectedDemoModule}
        applicationMode={applicationMode}
      />

      <ContactSalesModal
        isOpen={contactSalesOpen}
        onClose={() => setContactSalesOpen(false)}
      />

      <SearchModal
        isOpen={searchModalOpen}
        onClose={() => setSearchModalOpen(false)}
      />

      <VideoWalkthroughModal
        isOpen={videoModalOpen}
        onClose={() => setVideoModalOpen(false)}
        onRequestDemo={() => {
          setVideoModalOpen(false);
          handleOpenDemo();
        }}
      />

      <WikiDrawer
        isOpen={wikiDrawerOpen}
        onClose={() => setWikiDrawerOpen(false)}
      />

      <SupportModal
        isOpen={supportModalOpen}
        onClose={() => setSupportModalOpen(false)}
      />

      <MobileNavDrawer
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        onRequestDemo={() => handleOpenDemo()}
        onOpenSearch={() => setSearchModalOpen(true)}
        onOpenWiki={() => setWikiDrawerOpen(true)}
        onOpenSupport={() => setSupportModalOpen(true)}
      />
    </div>
  );
};
