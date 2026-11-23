# Án Trong Sương — Redesign v3

## Direction (derived from the product)
- **Product:** A private character-reveal companion for a Vietnamese historical deduction board game.
- **Character:** quiet, archival, discreet, tactile.
- **World:** late-19th-century Northern Vietnam; aged dó paper, ink, moss-green card stock, muted gold.
- **Moments:** the six green-and-gold card backs, and the single selected character card revealed at full scale.
- **Signature:** gold dragonfly/butterfly elements from the supplied brand kit, used as faint corner accents and small dividers rather than heavy decoration.

## Redline audit
- Previous screen: dark full-screen ground was at odds with the requested aged-paper surface; header metadata was unnecessary; six cards were too widely spaced; decorative texture was too broad and repeated.
- Flip: the card face/back setup is kept as a single rotator with two backface-hidden faces. The selected card rotates 180 degrees and stays in the reveal state for 1180ms before moving to the character dossier.
- Motion: one restrained card-arrival stagger, 2px hover lift, no looping pulse, glow, tilt or parallax. Reduced-motion disables the motion.

## Nine Unslop passes
1. **Spacing:** 4px-based spacing scale; six-card grid tuned for a complete desktop view; 2-column mobile layout.
2. **Color:** paper #F5E8D5 with lighter stains, subtle grain, and a low-contrast repeating pattern; deep green #26372B; gold #C89A55. No gradients or glow on UI surfaces; only soft tonal radial stains in the paper ground.
3. **Icons:** only Lucide icons for actions; decorative icons removed. Supplied dragonfly/butterfly corner elements and the divider are used sparingly; pattern opacity stays low.
4. **Copy:** shorter instructions; labels in natural title case, not all-caps tracked UI copy.
5. **Type:** Be Vietnam Pro for UI; Kusp Papyrus only for one supporting end-screen sentence. The broken An Trong Suong font was removed and is no longer loaded or referenced.
6. **Layout:** centered logo header with a quiet exit control at left; heading block without the case-number label or divider; tighter 3x2 desktop card table, 2-column mobile card table, clear private-reveal layout.
7. **Details:** one button style pair, one card treatment, quiet status line, keyboard focus.
8. **Visuals:** real supplied card art, logo, refreshed dragonfly/butterfly elements, divider, pattern and fonts; no placeholder imagery.
9. **Motion:** 2px hover, short entrance, deliberate 900ms card flip, no animation loops; reduced-motion fallback.

## Known verification limitation
The React/Vite build could not be run because `npm install` failed while contacting the npm registry (`EAI_AGAIN`). Source files and asset paths were reviewed, but a full Vite build and interactive runtime test remain to be run locally.

## Latest paper and element pass
- Lightened the paper base from #F0DFC7 to #F5E8D5 and reduced the brown radial stain intensity.
- Kept the repeating pattern at very low opacity to avoid muddying the background.
- Added the supplied dragonfly/butterfly artwork as two large, faint corner accents on selection and reveal screens, with mobile sizing/opacity adjustments.
- Added a small supplied divider ornament under the reveal heading.
- Refreshed the reference-elements assets with the user-uploaded versions.
