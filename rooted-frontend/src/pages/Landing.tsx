import React, { useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { gsap, SplitText } from '../lib/gsap';
import { useGSAP } from '@gsap/react';
import { Sprout, MessageSquare, Flower2 } from 'lucide-react';
import { Blob, Leaf, FallingLeaves, BackgroundVines } from '../components/nature';
import { BreathingButton } from '../components/motion/BreathingButton';
import { FadeInOnScroll } from '../components/motion';
import { LanguagePill } from '../components/layout/LanguagePill';
import { useReducedMotion } from '../lib/gsap';
import { Sheet, SheetTrigger, SheetContent } from '../components/ui/sheet';

export default function Landing() {
  const navigate = useNavigate();
  const reducedMotion = useReducedMotion();
  
  const heroRef = useRef<HTMLDivElement>(null);
  const eyebrowRef = useRef<HTMLParagraphElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subheadRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const trustRef = useRef<HTMLParagraphElement>(null);
  const splitHeadlineRef = useRef<any>(null); // For SplitText instance
  const leavesRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    if (reducedMotion) {
      gsap.set([eyebrowRef.current, headlineRef.current, subheadRef.current, ctaRef.current, trustRef.current], { opacity: 1, y: 0 });
      return;
    }

    // Wait for fonts to load before splitting text
    document.fonts.ready.then(() => {
      if (!headlineRef.current) return;
      
      splitHeadlineRef.current = new SplitText(headlineRef.current, { type: "words" });
      gsap.set(splitHeadlineRef.current.words, { opacity: 0, y: 20 });
      gsap.set(headlineRef.current, { autoAlpha: 1 }); // Unhide the parent safely
      
      const tl = gsap.timeline({ delay: 0.1 });
      
      tl.fromTo(eyebrowRef.current, 
        { opacity: 0, y: 12 }, 
        { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }
      )
      .to(splitHeadlineRef.current.words, 
        { opacity: 1, y: 0, duration: 0.7, stagger: 0.05, ease: "power3.out" }, 
        "-=0.2"
      )
      .fromTo(subheadRef.current, 
        { opacity: 0, y: 8 }, 
        { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }, 
        "-=0.4"
      )
      .fromTo(ctaRef.current, 
        { opacity: 0, y: 8 }, 
        { opacity: 1, y: 0, duration: 0.5, ease: "power2.out" }, 
        "-=0.3"
      )
      .fromTo(trustRef.current, 
        { opacity: 0 }, 
        { opacity: 1, duration: 0.4, ease: "none" }, 
        "-=0.2"
      );
    });

    // 7.5 Hero scroll-out parallax
    gsap.to([headlineRef.current], {
      y: -40,
      scrollTrigger: { trigger: heroRef.current, start: "top top", end: "bottom top", scrub: 1 }
    });
    gsap.to([subheadRef.current], {
      y: -20,
      scrollTrigger: { trigger: heroRef.current, start: "top top", end: "bottom top", scrub: 1 }
    });
    gsap.to([ctaRef.current], {
      y: -10,
      scrollTrigger: { trigger: heroRef.current, start: "top top", end: "bottom top", scrub: 1 }
    });
    if (leavesRef.current) {
      gsap.to(leavesRef.current, {
        y: 30,
        scrollTrigger: { trigger: heroRef.current, start: "top top", end: "bottom top", scrub: 1 }
      });
    }

    return () => {
      if (splitHeadlineRef.current) splitHeadlineRef.current.revert();
    };
  }, { scope: heroRef, dependencies: [reducedMotion] });

  // Handle philosophy quote animation on scroll
  const section2HeadlineRef = useRef<HTMLHeadingElement>(null);
  const quoteRef = useRef<HTMLQuoteElement>(null);
  const attributionRef = useRef<HTMLParagraphElement>(null);
  
  useGSAP(() => {
    if (reducedMotion) return;

    // 7.2 Section 2 headline
    if (section2HeadlineRef.current) {
      const splitSection2 = new SplitText(section2HeadlineRef.current, { type: "lines" });
      gsap.set(section2HeadlineRef.current, { autoAlpha: 1 });
      gsap.from(splitSection2.lines, {
        scrollTrigger: {
          trigger: section2HeadlineRef.current,
          start: "top 80%",
          once: true
        },
        opacity: 0,
        y: 20,
        filter: "blur(6px)",
        duration: 0.9,
        stagger: 0.09,
        ease: "rooted"
      });
    }

    // 7.3 Philosophy pull-quote
    if (quoteRef.current) {
      const splitQuote = new SplitText(quoteRef.current, { type: "lines" });
      gsap.set(quoteRef.current, { autoAlpha: 1 });
      
      const quoteTl = gsap.timeline({
        scrollTrigger: {
          trigger: quoteRef.current,
          start: "top 80%",
          once: true
        }
      });
      
      quoteTl.from(splitQuote.lines, {
        opacity: 0,
        y: 20,
        filter: "blur(6px)",
        duration: 1.1,
        stagger: 0.11,
        ease: "rooted"
      });

      if (attributionRef.current) {
        quoteTl.fromTo(attributionRef.current, 
          { opacity: 0 }, 
          { opacity: 1, duration: 0.8, ease: "power2.out" }, 
          "+=0.3"
        );
      }
    }

  }, { dependencies: [reducedMotion] });

  // 7.4 Pillar Cards
  const cardsContainerRef = useRef<HTMLDivElement>(null);
  useGSAP(() => {
    if (reducedMotion || !cardsContainerRef.current) return;

    const cards = gsap.utils.toArray<HTMLElement>('.pillar-card');
    cards.forEach((card, i) => {
      const delay = i * 0.1;
      
      gsap.fromTo(card,
        { opacity: 0, y: 28 },
        {
          opacity: 1, y: 0, duration: 0.8, delay, ease: "rooted",
          scrollTrigger: {
            trigger: cardsContainerRef.current,
            start: "top 85%",
            once: true
          }
        }
      );

      const circle = card.querySelector('.icon-circle');
      const icon = card.querySelector('.icon-svg');
      if (circle && icon) {
        gsap.fromTo(circle,
          { scale: 0.8 },
          {
            scale: 1, duration: 0.6, ease: "rooted-bounce", delay: delay + 0.2,
            scrollTrigger: {
              trigger: cardsContainerRef.current,
              start: "top 85%",
              once: true
            }
          }
        );
        gsap.fromTo(icon,
          { opacity: 0 },
          {
            opacity: 1, duration: 0.6, ease: "power2.out", delay: delay + 0.2,
            scrollTrigger: {
              trigger: cardsContainerRef.current,
              start: "top 85%",
              once: true
            }
          }
        );
      }
    });
  }, { scope: cardsContainerRef, dependencies: [reducedMotion] });

  // 7.6 Background vines scrub parallax
  const vinesWrapperRef = useRef<HTMLDivElement>(null);
  useGSAP(() => {
    if (reducedMotion || !vinesWrapperRef.current) return;
    gsap.to(vinesWrapperRef.current, {
      y: -50,
      scrollTrigger: {
        trigger: vinesWrapperRef.current,
        start: "top bottom",
        end: "bottom top",
        scrub: true
      }
    });
  }, { dependencies: [reducedMotion] });

  // 7.8 Section 4 closing CTA
  const closingSectionRef = useRef<HTMLDivElement>(null);
  const closingHeadlineRef = useRef<HTMLHeadingElement>(null);
  const closingCtaRef = useRef<HTMLDivElement>(null);
  useGSAP(() => {
    if (reducedMotion || !closingHeadlineRef.current) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: closingSectionRef.current,
        start: "top 85%",
        once: true
      }
    });

    tl.fromTo(closingHeadlineRef.current,
      { opacity: 0, y: 24 },
      { opacity: 1, y: 0, duration: 0.8, ease: "rooted" }
    );
    // DrawSVG underline logic requires an SVG underline. I will inject one.
    tl.fromTo('.closing-underline path', 
      { drawSVG: "0%" },
      { drawSVG: "100%", duration: 0.9, ease: "rooted" },
      "+=0.2"
    );
    if (closingCtaRef.current) {
      tl.fromTo(closingCtaRef.current,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.6, ease: "power2.out" },
        "+=0.6"
      );
    }
  }, { scope: closingSectionRef, dependencies: [reducedMotion] });

  // 7.9 Scroll progress indicator
  const progressLineRef = useRef<HTMLDivElement>(null);
  useGSAP(() => {
    if (reducedMotion || !progressLineRef.current) return;
    gsap.to(progressLineRef.current, {
      scaleY: 1,
      transformOrigin: "top center",
      ease: "none",
      scrollTrigger: {
        trigger: document.body,
        start: "top top",
        end: "bottom bottom",
        scrub: true
      }
    });
  }, { dependencies: [reducedMotion] });

  // Seed pop effect for icons (hover)
  const popIcon = (e: React.MouseEvent) => {
    if (reducedMotion) return;
    const circle = e.currentTarget.querySelector('.icon-circle');
    if (circle) {
      gsap.fromTo(circle, 
        { scale: 0.8 }, 
        { scale: 1, duration: 0.6, ease: "rooted-bounce" }
      );
    }
  };

  return (
    <div className="bg-canvas text-primary overflow-hidden selection-leaf relative">
      {/* 7.9 Scroll Progress Indicator */}
      <div className="hidden lg:block fixed right-6 top-[20vh] bottom-[20vh] w-[2px] bg-sage-200/30 z-50 rounded-full overflow-hidden">
        <div ref={progressLineRef} className="absolute top-0 left-0 w-full h-full bg-sage-600 scale-y-0 origin-top" />
      </div>

      {/* SECTION 1 — HERO */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center px-6 md:px-12 pt-20 pb-12">
        <div ref={vinesWrapperRef} className="absolute inset-0 z-0">
          <BackgroundVines />
        </div>
        <div ref={leavesRef} className="absolute inset-0 z-0 pointer-events-none">
          <FallingLeaves intensity="subtle" count={12} className="z-0" />
        </div>
        <Blob speed="slow" size={600} blur={80} intensity="whisper" className="absolute top-[10%] -left-[10%] text-[var(--color-sage-200)] z-0 pointer-events-none" />
        <Blob speed="drift" size={500} blur={60} intensity="soft" className="absolute bottom-[20%] -right-[5%] text-[var(--color-sand-200)] z-0 pointer-events-none" />

        <div className="relative z-10 max-w-[720px] mx-auto text-center flex flex-col items-center">
          <p ref={eyebrowRef} className="font-body text-xs md:text-sm uppercase tracking-[0.1em] text-muted mb-6 opacity-0">
            A quiet place to put your phone down
          </p>
          
          <h1 ref={headlineRef} className="font-display text-5xl md:text-[80px] font-normal leading-[1.02] tracking-[-0.03em] mb-6 text-charcoal-900" style={{ visibility: reducedMotion ? 'visible' : 'hidden' }}>
            Grow deep in a shallow world.
          </h1>
          
          <p ref={subheadRef} className="font-body text-lg md:text-xl text-[var(--text-secondary)] max-w-[54ch] leading-[1.6] mb-10 opacity-0">
            Rooted helps you understand how social media shapes your mind — 
            and grow the quiet, intentional habits that replace the scroll.
          </p>
          
          <div ref={ctaRef} className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-6 opacity-0 w-full sm:w-auto">
            <BreathingButton onClick={() => navigate('/welcome')} variant="primary" size="lg" className="w-full sm:w-auto px-8">
              Plant your first seed
            </BreathingButton>
            <BreathingButton onClick={() => navigate('/welcome')} variant="ghost" size="lg" className="w-full sm:w-auto px-8">
              Return to the garden
            </BreathingButton>
          </div>
          
          <p ref={trustRef} className="font-mono text-xs text-muted opacity-0">
            Free · Private by default · English · اردو
          </p>
        </div>
      </section>

      {/* SECTION 2 — HOW ROOTED GROWS */}
      <section className="relative bg-surface py-24 md:py-32 border-t border-border-subtle z-10">
        <div className="max-w-6xl mx-auto px-6 md:px-12">
          <div className="text-center mb-16 md:mb-24">
            <p className="font-body text-xs md:text-sm uppercase tracking-wider text-muted mb-4">
              Three things grow here
            </p>
            <h2 ref={section2HeadlineRef} className="font-display text-3xl md:text-[44px] font-normal leading-tight text-primary max-w-2xl mx-auto" style={{ visibility: reducedMotion ? 'visible' : 'hidden' }}>
              Nothing here is loud. Everything is intentional.
            </h2>
          </div>

          <div ref={cardsContainerRef} className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div 
                className="pillar-card group bg-canvas rounded-2xl p-8 border border-border-subtle shadow-soft hover:shadow-elevated hover:-translate-y-0.5 transition-all duration-200 ease-out h-full opacity-0"
                onMouseEnter={popIcon}
              >
                <div className="icon-circle w-12 h-12 rounded-full bg-sage-100 flex items-center justify-center mb-6 text-sage-700">
                  <Sprout size={24} strokeWidth={1.5} className="icon-svg" />
                </div>
                <h3 className="font-display text-2xl mb-3 text-primary">Check your soil</h3>
                <p className="font-body text-muted leading-relaxed">
                  A calm three-step check-in. Real ML, real answers — no scores you can lose.
                </p>
              </div>

              <div 
                className="pillar-card group bg-canvas rounded-2xl p-8 border border-border-subtle shadow-soft hover:shadow-elevated hover:-translate-y-0.5 transition-all duration-200 ease-out h-full opacity-0"
                onMouseEnter={popIcon}
              >
                <div className="icon-circle w-12 h-12 rounded-full bg-sage-100 flex items-center justify-center mb-6 text-sage-700">
                  <MessageSquare size={24} strokeWidth={1.5} className="icon-svg" />
                </div>
                <h3 className="font-display text-2xl mb-3 text-primary">The Arborist</h3>
                <p className="font-body text-muted leading-relaxed">
                  A companion chat that adapts to your language. Roman Urdu, English, or something in between.
                </p>
              </div>

              <div 
                className="pillar-card group bg-canvas rounded-2xl p-8 border border-border-subtle shadow-soft hover:shadow-elevated hover:-translate-y-0.5 transition-all duration-200 ease-out h-full opacity-0"
                onMouseEnter={popIcon}
              >
                <div className="icon-circle w-12 h-12 rounded-full bg-sage-100 flex items-center justify-center mb-6 text-sage-700">
                  <Flower2 size={24} strokeWidth={1.5} className="icon-svg" />
                </div>
                <h3 className="font-display text-2xl mb-3 text-primary">Tend the garden</h3>
                <p className="font-body text-muted leading-relaxed">
                  Small daily goals that grow with you. A seed becomes a sprout becomes a tree — one day at a time.
                </p>
              </div>
          </div>
        </div>
      </section>

      {/* SECTION 3 — PHILOSOPHY */}
      <section className="relative min-h-screen bg-canvas flex items-center justify-center py-24 px-6 md:px-12 z-10">
        <div className="max-w-[780px] mx-auto text-center flex flex-col items-center">
          <Leaf size={48} animate="sway" color="var(--accent-growth)" className="mb-12 opacity-80" />
          
          <blockquote 
            ref={quoteRef}
            className="font-display text-3xl md:text-[40px] italic leading-tight text-primary mb-8"
            style={{ visibility: reducedMotion ? 'visible' : 'hidden' }}
          >
            "The scroll is a shallow root. It spreads wide but holds nothing. We help you grow deep instead."
          </blockquote>
          
          <p ref={attributionRef} className="font-body text-sm uppercase tracking-wider text-muted opacity-0">
            — The Rooted thesis
          </p>
        </div>
      </section>

      {/* SECTION 4 — CLOSING CTA */}
      <section ref={closingSectionRef} className="bg-surface py-32 px-6 border-t border-border-subtle z-10 relative">
        <div className="max-w-xl mx-auto text-center flex flex-col items-center">
            <div className="relative inline-block mb-8">
              <h2 ref={closingHeadlineRef} className="font-display text-3xl md:text-[32px] font-normal text-primary m-0 opacity-0 relative z-10">
                Plant your first seed today.
              </h2>
              <svg className="closing-underline absolute -bottom-2 left-0 w-full h-3 z-0" viewBox="0 0 200 12" preserveAspectRatio="none">
                <path d="M 5,8 Q 100,2 195,8" fill="none" stroke="var(--color-sage-400)" strokeWidth="3" strokeLinecap="round" />
              </svg>
            </div>
            
            <div ref={closingCtaRef} className="flex flex-col items-center opacity-0">
              <BreathingButton onClick={() => navigate('/welcome')} variant="primary" size="lg" className="px-12 mb-12">
                Begin
              </BreathingButton>
              
              <div className="flex items-center justify-center gap-2">
                <Leaf size={16} animate="none" color="var(--accent-quiet)" className="opacity-40" />
                <Leaf size={20} animate="none" color="var(--accent-quiet)" className="opacity-60" />
                <Leaf size={16} animate="none" color="var(--accent-quiet)" className="opacity-40" />
              </div>
            </div>
        </div>
      </section>

      {/* SECTION 5 — FOOTER */}
      <FadeInOnScroll delay={0.1} duration={0.6}>
        <footer className="bg-canvas border-t border-border-subtle py-8 px-6 md:px-12">
          <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
            <p className="font-display italic text-muted text-lg">
              Rooted · Grow deep in a shallow world.
            </p>
            
            <div className="flex-shrink-0">
              <LanguagePill />
            </div>
            
            <div className="flex items-center gap-6 text-sm text-muted">
              <Sheet>
                <SheetTrigger asChild>
                  <button className="hover:text-primary transition-colors focus-visible:outline-none focus-visible:underline">
                    Privacy
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
              
              <button onClick={() => navigate('/welcome')} className="hover:text-primary transition-colors">
                Return to the garden
              </button>
            </div>
          </div>
        </footer>
      </FadeInOnScroll>
    </div>
  );
}
