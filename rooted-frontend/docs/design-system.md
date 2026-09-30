# Rooted: Design System Documentation

## The Thesis
"Rooted" reframes digital wellbeing not as a clinical metric to optimize, but as a garden to tend. It posits that digital addiction creates shallow, tangled surface roots, whereas intentional wellbeing grows deep, calm taproots. Every visual token, interaction, and microcopy choice must reinforce this natural, patient metaphor.

## 🎨 Palette Rationale: Botanical & Earth
The palette is grounded in the earth, rejecting the sterile whites and clinical blues common in health apps.
*   **Bark & Sand**: The structural foundation. Bark serves as our heavy, warm darks (trunks, text, sidebar), while Sand and Cream act as our canvas and surfaces, providing a tactile, paper-like warmth.
*   **Sage & Moss**: The healthy core. Sage is our primary accent, symbolizing calm and maturity. Moss provides depth.
*   **Leaf**: Reserved specifically for active growth moments (like completing a goal).
*   **Terracotta**: The "gentle warning" color. Instead of a blaring neon red for errors or high risk, Terracotta is the color of dry clay—indicating a need for water/attention without inducing panic.

## 🔤 Typography & Voice
**Winner:** Fraunces (Display) + Satoshi (Body)
**Shortlist Consulted:**
1.  *Playfair Display + Inter* (Rejected: Inter feels too SaaS/tech)
2.  *Fraunces + Satoshi* (**Selected**: Fraunces is highly organic, variable, and editorial. Satoshi is a clean, modern sans that holds up well next to serifs and supports complex layouts beautifully.)
3.  *Instrument Serif + Outfit* (Rejected: Outfit is slightly too geometric for the organic vibe)

**Urdu Support:** We use `Noto Nastaliq Urdu` for RTL layouts, ensuring the same editorial elegance translates to the Urdu audience.

## 🌊 Motion System (7 Presets)
Animations are slow, heavy, and purposeful.
1.  **.motion-breathe**: Idle 6s loop (AI Avatar).
2.  **.motion-sway**: 8s gentle rotation (organic accents).
3.  **.motion-drift**: 12s translation (mycelium background textures).
4.  **.motion-unfurl**: Leaves opening (dropdowns, accordions).
5.  **.motion-root**: Settling down heavily (page entrances, cards).
6.  **.motion-bloom**: Success states expanding softly.
7.  **.motion-mist**: Blur-to-clear reveals (AI generating text).

## 🎬 GSAP Plugin Playbook
| Plugin | Rooted Use Case |
| :--- | :--- |
| **ScrollTrigger** | Scroll-driven growth reveals. Cards root into place as you scroll. |
| **DrawSVG** | Vines drawing, the Growth Ring (Risk) growing stroke-by-stroke. |
| **MorphSVG** | Seed morphing into sprout; risk pill shapes shifting fluidly. |
| **MotionPath** | Spores drifting, leaves floating down a bezier path in backgrounds. |
| **SplitText** | Editorial headlines unfurling word-by-word like blossoming flowers. |
| **Flip** | Sidebar collapsing, history list sorting, smooth tab transitions. |
| **ScrollSmoother**| App-wide honey-smooth scrolling, eliminating jerky mechanical scrolls. |
| **Observer** | Mobile drawer interactions and fluid swipe gestures. |

## ✅ Do / ❌ Don't
| DO | DON'T |
| :--- | :--- |
| Use organic, soft radii (`sm` to `3xl`). | Do not use sharp `0px` corners. |
| Use warm, bark-tinted shadows. | Do not use pure black/gray shadows. |
| Keep the canvas off-white (`cream-50`). | Do not use `#FFFFFF` or `#000000`. |
| Use "gardening" language in empty states. | Do not use generic tech error states. |
| Animate slowly, emphasizing the ease. | Do not use linear or snapping animations. |

## 🛠️ Extension Guide
When creating a new component:
1.  **Assign Semantic Meaning**: Don't use `--color-sage-500` directly. Assign it to a semantic token (e.g., `--state-info`) and use that.
2.  **Respect Reduced Motion**: Always wrap custom CSS animations in `@media (prefers-reduced-motion: no-preference)`.
3.  **Consult the Layers**: Ensure your component is styled exclusively using Layer 2/3 tokens. If you need a new raw value, add it to Layer 1.
