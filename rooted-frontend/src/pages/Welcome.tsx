import React, { useRef, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { Blob, Leaf, Seedling, VineFrame } from '../components/nature';
import { FadeInOnScroll } from '../components/motion';
import { WordSplitter } from '../components/welcome/WordSplitter';
import { TabSwitcher, TabMode } from '../components/welcome/TabSwitcher';
import { LoginForm } from '../components/welcome/LoginForm';
import { SignupForm } from '../components/welcome/SignupForm';
import { useAuthStore } from '../lib/store';
import { useReducedMotion } from '../lib/gsap';
import { cn } from '../lib/utils';
import { LanguagePill } from '../components/layout/LanguagePill';
import { Sheet, SheetTrigger, SheetContent } from '../components/ui/sheet';

export default function Welcome() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const isAuthed = useAuthStore(s => s.isAuthed);
  const reducedMotion = useReducedMotion();
  
  const [activeTab, setActiveTab] = useState<TabMode>('login');
  const [registerSuccess, setRegisterSuccess] = useState(false);
  
  const formContainerRef = useRef<HTMLDivElement>(null);
  const cardRef = useRef<HTMLDivElement>(null);
  const gatePanelRef = useRef<HTMLDivElement>(null);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthed) {
      navigate('/diagnosis', { replace: true });
    }
  }, [isAuthed, navigate]);

  // Handle Tab Switch Animation
  const handleTabChange = (newTab: TabMode) => {
    if (newTab === activeTab) return;
    
    if (reducedMotion || !formContainerRef.current) {
      setActiveTab(newTab);
      return;
    }

    // Cross-fade the form area
    gsap.to(formContainerRef.current, {
      opacity: 0,
      y: 8,
      duration: 0.15,
      onComplete: () => {
        setActiveTab(newTab);
        setRegisterSuccess(false); // Reset success state when switching tabs manually
        gsap.fromTo(formContainerRef.current,
          { opacity: 0, y: -8 },
          { opacity: 1, y: 0, duration: 0.25, ease: 'rooted' }
        );
      }
    });
  };

  const handleShake = () => {
    if (reducedMotion || !cardRef.current) return;
    gsap.fromTo(cardRef.current,
      { x: -4 },
      { x: 4, clearProps: 'x', duration: 0.05, repeat: 3, yoyo: true, ease: 'power1.inOut' }
    );
  };

  const handleLanguageToggle = () => {
    const nextLang = i18n.language.startsWith('en') ? 'ur' : 'en';
    i18n.changeLanguage(nextLang);
    // document dir is usually updated in i18n setup, but let's be explicit if needed
    document.documentElement.dir = nextLang === 'ur' ? 'rtl' : 'ltr';
    document.documentElement.lang = nextLang;
  };

  return (
    <div id="smooth-wrapper" className="min-h-screen w-full flex flex-col lg:flex-row bg-canvas text-primary relative overflow-hidden">
      <div id="smooth-content" className="w-full flex flex-col lg:flex-row flex-1">
      {/* 
        LEFT PANEL - The Grove 
        - Takes 55% width on desktop, 40vh on tablet, 200px on mobile
      */}
      <div className="relative w-full lg:w-[55%] h-[200px] md:h-[40vh] lg:h-screen flex items-center shrink-0">
        {/* Background Blobs */}
        <Blob speed="drift" size={640} blur={80} className="absolute -top-[20%] -right-[10%] text-sage-200 opacity-60 z-0 pointer-events-none" />
        <Blob speed="slow" size={520} blur={60} className="absolute -bottom-[10%] -left-[10%] text-sand-200 opacity-60 z-0 pointer-events-none" />
        
        {/* Editorial Content - hidden on mobile, partial on tablet, full on desktop */}
        <div className="relative z-10 px-6 md:px-12 lg:px-20 py-8 lg:py-0 h-full flex flex-col justify-center">
          
          <div className="max-w-xl">
            {/* Eyebrow */}
            <p className="font-body text-xs md:text-sm uppercase tracking-wider text-muted mb-4 md:mb-6">
              {t('welcome.eyebrow')}
            </p>
            
            {/* Headline */}
            <div className="relative">
              <div className="absolute -top-4 -left-6 md:-top-6 md:-left-8 opacity-40 md:opacity-100">
                <Leaf size={40} animate="sway" color="var(--accent-growth)" />
              </div>
              <h1 className="font-display text-4xl md:text-5xl lg:text-[64px] font-normal leading-[1.05] tracking-[-0.02em] mb-4 md:mb-8 text-charcoal-900 z-10 relative">
                <WordSplitter text={t('welcome.headline')} />
              </h1>
            </div>
            
            {/* Sub-headline (hidden on smallest mobile) */}
            <div className="hidden md:block">
              <FadeInOnScroll delay={0.6}>
                <p className="font-body text-base lg:text-lg text-muted max-w-[46ch] mb-8 leading-relaxed">
                  {t('welcome.subheadline')}
                </p>
              </FadeInOnScroll>
              
              {/* Trust Markers */}
              <FadeInOnScroll delay={0.8}>
                <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[12px] text-muted">
                  <span className="flex items-center gap-1.5">
                    <Leaf size={10} color="var(--accent-quiet)" animate="none" />
                    {t('welcome.trust.checkIn')}
                  </span>
                  <span className="hidden lg:inline opacity-30">·</span>
                  <span className="flex items-center gap-1.5">
                    <Leaf size={10} color="var(--accent-quiet)" animate="none" />
                    {t('welcome.trust.private')}
                  </span>
                  <span className="hidden lg:inline opacity-30">·</span>
                  <span className="flex items-center gap-1.5">
                    <Leaf size={10} color="var(--accent-quiet)" animate="none" />
                    {t('welcome.trust.languages')}
                  </span>
                </div>
              </FadeInOnScroll>
            </div>
          </div>
          
          {/* Footer Signature */}
          <div className="absolute bottom-6 md:bottom-12 left-6 md:left-12 lg:left-20 text-[11px] text-muted opacity-60 hidden lg:block">
            {t('welcome.footer.signature')}
          </div>
        </div>
      </div>

      {/* 
        RIGHT PANEL - The Gate 
        - Takes 45% width on desktop, fills rest on mobile/tablet
      */}
      <div 
        ref={gatePanelRef}
        className={cn(
          "relative w-full lg:w-[45%] flex-1 flex flex-col justify-center items-center",
          "px-6 py-8 md:p-12 lg:p-16",
          "bg-surface lg:border-l lg:border-border-subtle z-20 shadow-[0_-4px_24px_rgba(0,0,0,0.02)] lg:shadow-none"
        )}
      >
        <div className="w-full max-w-[400px]">
          
          {/* Mobile-only headline context (if they can't see the left panel well) */}
          <div className="md:hidden mb-8 text-center">
            <p className="font-body text-sm text-muted leading-relaxed">
              {t('welcome.subheadline')}
            </p>
          </div>

          <FadeInOnScroll delay={0.1} y={12} duration={0.6}>
            <div 
              ref={cardRef}
              className={cn(
                "w-full rounded-2xl border border-border-subtle shadow-elevated overflow-hidden relative",
                // Glassmorphism support with solid fallback
                "bg-surface-raised @supports(backdrop-filter:blur(20px)):bg-glass @supports(backdrop-filter:blur(20px)):backdrop-blur-[20px] @supports(backdrop-filter:blur(20px)):backdrop-saturate-120"
              )}
            >
              <VineFrame edges={['left', 'top']} />
              <div className="p-6 md:p-10 relative z-10">
                
                {/* Header */}
                <h2 className="font-display text-[28px] font-normal mb-8 text-primary">
                  {activeTab === 'login' && !registerSuccess ? t('welcome.form.login.title') : ''}
                  {activeTab === 'signup' && !registerSuccess ? t('welcome.form.signup.title') : ''}
                  {registerSuccess ? t('welcome.register.success.title') : ''}
                </h2>

                {/* Main Content Area */}
                <div ref={formContainerRef}>
                  
                  {registerSuccess ? (
                    <div className="py-6 flex flex-col items-center justify-center text-center space-y-6">
                      <Seedling stage={2} size={80} />
                      <button 
                        onClick={() => handleTabChange('login')}
                        className="font-medium text-secondary hover:text-primary transition-colors focus-visible:outline-none focus-visible:underline"
                      >
                        {t('welcome.register.success.cta')}
                      </button>
                    </div>
                  ) : (
                    <>
                      <TabSwitcher 
                        activeTab={activeTab} 
                        onChange={handleTabChange}
                        labels={{
                          login: t('welcome.tab.return'),
                          signup: t('welcome.tab.plant')
                        }}
                      />
                      
                      {activeTab === 'login' ? (
                        <LoginForm onSuccess={() => navigate('/diagnosis')} onError={handleShake} />
                      ) : (
                        <SignupForm onSuccess={() => setRegisterSuccess(true)} onError={handleShake} />
                      )}
                    </>
                  )}
                </div>

              </div>

              {/* Card Footer */}
              <div className="px-6 md:px-10 py-4 bg-black/5 border-t border-border-subtle flex justify-between items-center text-xs text-muted relative z-10">
                <LanguagePill />
                
                <Sheet>
                  <SheetTrigger asChild>
                    <button className="hover:text-primary transition-colors focus-visible:outline-none focus-visible:underline">
                      {t('welcome.privacy.link')}
                    </button>
                  </SheetTrigger>
                  <SheetContent side="right" className="w-[400px] sm:max-w-md p-8 md:p-12 overflow-y-auto">
                    <div className="flex flex-col h-full mt-8 text-primary">
                      <h3 className="font-display text-2xl mb-6 text-primary">Private by Default</h3>
                      <div className="prose prose-sage text-sm leading-relaxed space-y-4">
                        <p>
                          Your data stays yours. Rooted is designed as a companion to help you reflect, not to collect your data.
                        </p>
                        <p>
                          <strong>1. Local First</strong><br />
                          Most of your usage data, growth history, and journal entries remain encrypted on your device.
                        </p>
                        <p>
                          <strong>2. AI Consultation</strong><br />
                          When you consult the Arborist, your responses are securely transmitted for generating insights, but they are not stored on our servers for longer than the session duration.
                        </p>
                        <p>
                          <strong>3. No Ads, No Tracking</strong><br />
                          We don't use cookies for tracking, nor do we sell your data. Rooted exists to reduce digital noise, not add to it.
                        </p>
                        <div className="mt-12 p-6 bg-surface/50 border border-border/50 rounded-xl text-center">
                          <p className="italic text-muted mb-0">Full policy coming soon.</p>
                        </div>
                      </div>
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            </div>
          </FadeInOnScroll>

        </div>
      </div>

      </div>
    </div>
  );
}
