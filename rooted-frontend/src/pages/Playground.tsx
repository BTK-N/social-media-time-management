import React, { useState } from 'react';
import { Leaf, Vine, Blob, GrowthRing, Seedling } from '../components/nature';
import { FadeInOnScroll, BreathingButton } from '../components/motion';
import { LanguagePill } from '../components/layout/LanguagePill';
import { PageHeader } from '../components/layout/PageHeader';
import { useNavigate } from 'react-router-dom';

export default function Playground() {
  const [leafAnimate, setLeafAnimate] = useState<'none' | 'sway' | 'grow'>('none');
  
  const [vinePlay, setVinePlay] = useState(false);
  
  const [blobSpeed, setBlobSpeed] = useState<'slow' | 'base' | 'drift'>('drift');
  
  const [ringValue, setRingValue] = useState(3.2);
  const [ringRisk, setRingRisk] = useState<'deep' | 'shallow' | 'tangled'>('shallow');
  
  const [seedStage, setSeedStage] = useState<1 | 2 | 3>(1);

  const [buttonLoading, setButtonLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleReducedMotionToggle = () => {
    document.documentElement.classList.toggle('force-reduced-motion');
  };

  return (
    <div className="py-12 px-6 max-w-6xl mx-auto space-y-24">
      
      <div className="mb-12">
        <h1 className="font-display text-4xl font-semibold mb-4 text-primary">Rooted Playground</h1>
        <p className="text-muted max-w-xl">
          A development gallery showcasing the unified design system, motion presets, and custom SVG primitives.
        </p>
      </div>

      {/* SECTION 1: NATURE PRIMITIVES */}
      <section>
        <h2 className="font-display text-2xl font-semibold border-b border-border pb-2 mb-8 text-primary">1. Nature Primitives</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          
          {/* Leaf */}
          <div className="p-6 rounded-xl bg-surface border border-border shadow-soft flex flex-col gap-6">
            <h3 className="font-semibold">Leaf</h3>
            <div className="flex-1 flex items-center justify-center min-h-[120px]">
              <Leaf size={64} animate={leafAnimate} />
            </div>
            <div className="flex gap-2 justify-center">
              <button onClick={() => setLeafAnimate('none')} className="px-3 py-1 text-xs bg-canvas border border-border rounded">None</button>
              <button onClick={() => setLeafAnimate('sway')} className="px-3 py-1 text-xs bg-canvas border border-border rounded">Sway</button>
              <button onClick={() => setLeafAnimate('grow')} className="px-3 py-1 text-xs bg-canvas border border-border rounded">Grow</button>
            </div>
          </div>

          {/* Vine */}
          <div className="p-6 rounded-xl bg-surface border border-border shadow-soft flex flex-col gap-6">
            <h3 className="font-semibold">Vine</h3>
            <div className="flex-1 flex items-center justify-center min-h-[120px]">
              <Vine length={150} play={vinePlay} leaves={3} onComplete={() => setVinePlay(false)} />
            </div>
            <div className="flex justify-center">
              <BreathingButton size="sm" onClick={() => setVinePlay(true)} disabled={vinePlay}>
                {vinePlay ? 'Growing...' : 'Play Vine'}
              </BreathingButton>
            </div>
          </div>

          {/* Seedling */}
          <div className="p-6 rounded-xl bg-surface border border-border shadow-soft flex flex-col gap-6">
            <h3 className="font-semibold">Seedling</h3>
            <div className="flex-1 flex items-center justify-center min-h-[120px]">
              <Seedling stage={seedStage} size={120} />
            </div>
            <div className="flex gap-2 justify-center">
              <button onClick={() => setSeedStage(1)} className="px-3 py-1 text-xs bg-canvas border border-border rounded">Stage 1</button>
              <button onClick={() => setSeedStage(2)} className="px-3 py-1 text-xs bg-canvas border border-border rounded">Stage 2</button>
              <button onClick={() => setSeedStage(3)} className="px-3 py-1 text-xs bg-canvas border border-border rounded">Stage 3</button>
            </div>
          </div>

          {/* Growth Ring */}
          <div className="p-6 rounded-xl bg-surface border border-border shadow-soft flex flex-col gap-6">
            <h3 className="font-semibold">GrowthRing</h3>
            <div className="flex-1 flex items-center justify-center min-h-[120px]">
              {/* Force remount to replay animation */}
              <GrowthRing key={`${ringValue}-${ringRisk}`} value={ringValue} risk={ringRisk} size={160} />
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-xs">Value ({ringValue})</span>
                <input type="range" min="0" max="5" step="0.1" value={ringValue} onChange={e => setRingValue(parseFloat(e.target.value))} />
              </div>
              <div className="flex gap-2 justify-center mt-2">
                <button onClick={() => setRingRisk('deep')} className="px-3 py-1 text-xs bg-moss-100 text-moss-900 rounded">Deep</button>
                <button onClick={() => setRingRisk('shallow')} className="px-3 py-1 text-xs bg-ochre-100 text-ochre-900 rounded">Shallow</button>
                <button onClick={() => setRingRisk('tangled')} className="px-3 py-1 text-xs bg-terracotta-100 text-terracotta-900 rounded">Tangled</button>
              </div>
            </div>
          </div>

          {/* Blob */}
          <div className="p-6 rounded-xl bg-surface border border-border shadow-soft flex flex-col gap-6 md:col-span-2">
            <h3 className="font-semibold">Blob (Ambient Background)</h3>
            <div className="flex-1 flex items-center justify-center min-h-[200px] overflow-hidden relative border border-dashed border-border rounded-lg bg-canvas">
               <Blob speed={blobSpeed} size={300} blur={40} className="absolute inset-0 m-auto" />
               <div className="z-10 bg-surface/80 backdrop-blur px-4 py-2 rounded-lg shadow-sm">Content over blob</div>
            </div>
            <div className="flex gap-2 justify-center">
              <button onClick={() => setBlobSpeed('slow')} className="px-3 py-1 text-xs bg-canvas border border-border rounded">Slow (20s)</button>
              <button onClick={() => setBlobSpeed('drift')} className="px-3 py-1 text-xs bg-canvas border border-border rounded">Drift (12s)</button>
              <button onClick={() => setBlobSpeed('base')} className="px-3 py-1 text-xs bg-canvas border border-border rounded">Base (8s)</button>
            </div>
          </div>

        </div>
      </section>

      {/* SECTION 2: MOTION WRAPPERS */}
      <section>
        <h2 className="font-display text-2xl font-semibold border-b border-border pb-2 mb-8 text-primary">2. Motion Wrappers</h2>
        
        <div className="space-y-12">
          <div>
            <h3 className="font-semibold mb-4">BreathingButton</h3>
            <div className="flex flex-wrap gap-4 items-center p-8 bg-surface rounded-xl border border-border shadow-soft">
              <BreathingButton variant="primary">Primary</BreathingButton>
              <BreathingButton variant="warm">Warm</BreathingButton>
              <BreathingButton variant="ghost">Ghost</BreathingButton>
              <div className="w-px h-8 bg-border mx-2" />
              <BreathingButton loading={buttonLoading} onClick={() => {
                setButtonLoading(true);
                setTimeout(() => setButtonLoading(false), 2000);
              }}>
                Test Loading
              </BreathingButton>
              <BreathingButton onClick={() => navigate('/playground?reload=' + Date.now())} variant="ghost">
                Trigger PageTransition
              </BreathingButton>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-4">FadeInOnScroll</h3>
            <div className="p-8 bg-surface rounded-xl border border-border shadow-soft max-h-[400px] overflow-y-auto">
              <div className="h-[200px] flex items-center justify-center text-muted mb-8 border border-dashed border-border rounded">Scroll down inside this box</div>
              <div className="space-y-4">
                {[0, 0.1, 0.2, 0.3, 0.4].map((delay, i) => (
                  <FadeInOnScroll key={i} delay={delay}>
                    <div className="p-4 bg-canvas rounded border border-border shadow-sm">
                      Item {i + 1} (Delay: {delay}s)
                    </div>
                  </FadeInOnScroll>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 3: A11Y */}
      <section>
        <h2 className="font-display text-2xl font-semibold border-b border-border pb-2 mb-8 text-primary">3. Accessibility</h2>
        <div className="p-6 bg-surface rounded-xl border border-border shadow-soft flex items-center justify-between">
          <div>
            <h3 className="font-semibold">Reduced Motion</h3>
            <p className="text-sm text-muted">Toggle a class that simulates OS-level reduced motion preferences.</p>
          </div>
          <BreathingButton variant="warm" onClick={handleReducedMotionToggle}>
            Toggle Fallbacks
          </BreathingButton>
        </div>
      </section>

      {/* SECTION 4: TOKENS */}
      <section>
        <h2 className="font-display text-2xl font-semibold border-b border-border pb-2 mb-8 text-primary">4. Token Inspector</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="space-y-2">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted">Primary</h4>
            <div className="h-10 rounded bg-moss-50 border border-border flex items-center px-3 text-xs">moss-50</div>
            <div className="h-10 rounded bg-moss-200 border border-border flex items-center px-3 text-xs">moss-200</div>
            <div className="h-10 rounded bg-moss-600 border border-border flex items-center px-3 text-xs text-white">moss-600</div>
            <div className="h-10 rounded bg-moss-900 border border-border flex items-center px-3 text-xs text-white">moss-900</div>
          </div>
          <div className="space-y-2">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted">Warm</h4>
            <div className="h-10 rounded bg-ochre-50 border border-border flex items-center px-3 text-xs">ochre-50</div>
            <div className="h-10 rounded bg-ochre-300 border border-border flex items-center px-3 text-xs">ochre-300</div>
            <div className="h-10 rounded bg-ochre-500 border border-border flex items-center px-3 text-xs text-white">ochre-500</div>
            <div className="h-10 rounded bg-ochre-800 border border-border flex items-center px-3 text-xs text-white">ochre-800</div>
          </div>
          <div className="space-y-2">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted">Alert</h4>
            <div className="h-10 rounded bg-terracotta-50 border border-border flex items-center px-3 text-xs">terracotta-50</div>
            <div className="h-10 rounded bg-terracotta-400 border border-border flex items-center px-3 text-xs">terracotta-400</div>
            <div className="h-10 rounded bg-terracotta-600 border border-border flex items-center px-3 text-xs text-white">terracotta-600</div>
            <div className="h-10 rounded bg-terracotta-900 border border-border flex items-center px-3 text-xs text-white">terracotta-900</div>
          </div>
          <div className="space-y-2">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted">Neutrals</h4>
            <div className="h-10 rounded bg-sand-50 border border-border flex items-center px-3 text-xs">sand-50</div>
            <div className="h-10 rounded bg-sand-200 border border-border flex items-center px-3 text-xs">sand-200</div>
            <div className="h-10 rounded bg-sand-600 border border-border flex items-center px-3 text-xs text-white">sand-600</div>
            <div className="h-10 rounded bg-charcoal-900 border border-border flex items-center px-3 text-xs text-white">charcoal-900</div>
          </div>
        </div>
      </section>

      {/* SECTION 5: UI PRIMITIVES */}
      <section>
        <h2 className="font-display text-2xl font-semibold border-b border-border pb-2 mb-8 text-primary">5. UI Primitives</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Language Pill */}
          <div className="p-6 rounded-xl bg-surface border border-border shadow-soft flex flex-col gap-6">
            <h3 className="font-semibold">Language Pill</h3>
            <div className="flex-1 flex items-center justify-center min-h-[120px] bg-canvas rounded-lg">
              <LanguagePill />
            </div>
            <p className="text-sm text-muted text-center">Toggles language and LTR/RTL dir.</p>
          </div>

          {/* Page Header */}
          <div className="p-6 rounded-xl bg-surface border border-border shadow-soft flex flex-col gap-6">
            <h3 className="font-semibold">Page Header</h3>
            <div className="flex-1 flex flex-col items-center justify-center bg-canvas rounded-lg overflow-hidden border border-border">
              <div className="w-full scale-75 origin-top relative top-4">
                <PageHeader 
                  eyebrow="Connections"
                  title="Deep Roots"
                  subtitle="How your habits connect to one another beneath the surface."
                />
              </div>
            </div>
            <p className="text-sm text-muted text-center">Consistent typography scale across pages.</p>
          </div>
        </div>
      </section>

    </div>
  );
}
