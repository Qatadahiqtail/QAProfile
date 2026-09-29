# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Single-page personal portfolio (Qatadah Iqtail), bilingual English/Arabic (Arabic is RTL). Dark theme with a purple accent, IBM Plex fonts. Plain static site: `index.html`, `style.css`, `script.js`, and assets in `images/` (`cv.pdf`, `logo.svg`, `profile.png`, `projects/*.png`). No build step, package manager, linter, or tests.

## Working rules

- **Always update both languages together.** Any text change must update the English and Arabic versions in the same edit: the element's inner text, `data-en` and `data-ar` in `index.html`, plus the `phrases` object in `script.js` for the preloader loading phrases.
- **Stop for approval after each change.** Make one change, summarize it, and wait for the user to approve before starting the next.

## Running

```bash
python -m http.server 8000   # then open http://localhost:8000
```

Serve over HTTP rather than opening the file directly so `localStorage`/`sessionStorage` behave normally. External deps are loaded from CDNs: Google Fonts (IBM Plex Sans / Sans Arabic / Mono) and Font Awesome 6.5.2.

## Architecture

**Bilingual text (EN/AR).** Every translatable element carries both `data-en` and `data-ar` attributes, and its inner text duplicates the English value as the default. `applyLanguage()` in `script.js` swaps `textContent` from those attributes and sets `<html lang>` and `dir` (`rtl` for Arabic). When adding or editing visible text, update all three (inner text, `data-en`, `data-ar`). Because it replaces `textContent`, put `data-en`/`data-ar` on a leaf element (e.g. a `<span>` next to an icon), never on an element with child markup. The chosen language persists in `localStorage` under `lang`.

**RTL styling.** Direction-specific overrides live in `style.css` as `html[dir="rtl"] ...` rules next to the LTR rule they adjust. Arabic uses the `--font-ar` font stack.

**Design tokens.** Colors, fonts, navbar height and transition timing are CSS custom properties on `:root` at the top of `style.css` (dark theme with a purple accent). Use these instead of hard-coded values.

**Preloader.** A full-screen intro (`#preloader`) runs once per browser session, gated by `sessionStorage['preloaderShown']`. A small inline `<script>` right after the preloader markup in `index.html` hides it before first paint on repeat visits, and the IIFE at the bottom of `script.js` handles the counters, phrases, progress bar and dismissal. The stat numbers animate up to their `data-count` values, so update those if the project or training counts change. To see the preloader again, clear session storage or open a new tab.

**Scroll behavior.** Two `IntersectionObserver`s: one adds `.active` to the nav link for the `main .section[id]` currently in view, and one adds `.revealed` to `.reveal` elements (one-shot). New sections need `class="section"` plus an `id` that matches a `#`-link in the nav. Animations are wrapped in `prefers-reduced-motion` media queries.

**Footer links.** `.footer-pill` links whose `href` is empty, `#`, or `mailto:` are hidden at runtime, so placeholder links can stay in the markup.
