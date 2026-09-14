Chefin — Chef Signup Flow: Build Plan
Reference design: split-screen chef registration page (image hero left, multi-step form right, orange/navy brand palette).
1. Scope
Build a 3-step "Create your Chef account" flow:
Account Details — Full Name, Email, Phone (with country code), Password + strength meter, Confirm Password, Years of Experience, Specialization, Preferred Job Location, Terms checkbox.
Profile Details — bio, photo/resume upload, certifications, availability, cuisine tags (not yet designed — needs mockup or spec).
Complete — confirmation screen, next steps (verify email, complete profile, browse jobs).
2. Tech Stack
Framework: React (Vite) or Next.js — pick based on whether SSR/SEO matters for the marketing side.
Styling: Tailwind CSS (matches clean rounded-input, pill-badge aesthetic in mockup).
Forms: React Hook Form + Zod for schema validation.
State across steps: local component state or lightweight context (`SignupFlowContext`) to persist step 1 data while user is on steps 2–3.
Icons: lucide-react (matches the line-icon style: user, mail, phone, lock, briefcase, tag, map-pin).
3. Component Breakdown
`SignupLayout` — two-column shell (image/hero left, form right); collapses to single column on mobile (hero becomes a compact top banner or is hidden).
`HeroPanel` — background image, headline ("Your skills. Your kitchen. Your next opportunity."), 3 feature bullets (Find/Showcase/Grow), back-to-home link.
`StepProgress` — numbered circles + connecting lines, active/completed/upcoming states.
`AccountDetailsForm` (Step 1)
Text inputs: full name, email
Phone input: country code dropdown + number
Password input: show/hide toggle, strength meter (weak/fair/good/strong)
Confirm password: match validation
Number input: years of experience
Tag/text input: specialization (consider chips/autocomplete for cuisines)
Location input: city (consider Google Places autocomplete)
Terms checkbox with inline links
Submit CTA: "Create Chef Account"
`ProfileDetailsForm` (Step 2) — TBD, needs its own spec
`SignupComplete` (Step 3) — success state
`AuthFooterLink` — "Already have an account? Sign in"
4. Validation Rules (Step 1)
Field	Rule
Full Name	required, min 2 chars
Email	required, valid email format, async uniqueness check
Phone	required, valid format per country code
Password	min 8 chars, upper/lower/number (drives strength meter)
Confirm Password	must match password
Years of Experience	required, integer ≥ 0
Specialization	required, at least 1 cuisine
Location	required
Terms checkbox	must be checked to enable submit
5. API / Backend Touchpoints
`POST /api/auth/signup/chef` — create account with Step 1 fields (status: `pending_profile`)
`PATCH /api/chefs/:id/profile` — Step 2 data
`POST /api/auth/verify-email` — triggered after Step 3
Consider whether phone verification (OTP) is needed before allowing Step 2.
6. Open Questions / Gaps to Resolve Before Building
Step 2 & 3 screens are not designed yet — need mockups for Profile Details and the Complete/success state.
Is specialization a free-text field or should it be multi-select chips (Indian, Chinese, Italian… suggests chip/tag UI)?
Does phone require OTP verification, or is it just contact info?
Mobile breakpoint behavior for the hero image panel.
Password strength algorithm — client-side heuristic (zxcvbn) vs simple rule-based?
Does progress persist if user refreshes mid-flow (localStorage draft vs backend draft record)?
7. Suggested Build Order
Static layout + StepProgress + HeroPanel (pixel-match Step 1 screen)
Step 1 form with full validation + password strength
Wire Step 1 submit to backend, transition to Step 2
Design + build Step 2 (pending spec)
Build Step 3 completion screen
Responsive/mobile pass
Accessibility pass (labels, focus states, error announcements)
QA: form validation edge cases, password visibility toggle, country code selector
