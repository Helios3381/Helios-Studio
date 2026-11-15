# Generated assets

Images made by Claude Code or by scripts, kept apart from hand-made files. Screenshots of real products are in `assets/images/`.

| File | Content | How it was made | Used in |
|---|---|---|---|
| `icons/sprite.svg` | Logo mark (`i-sun`), service and link icons, hero sun art (`art-sun`), product art for the RPG, travel app and web cards | Hand-written SVG by Claude Code (no external images; LinkedIn and GitHub are shown with generic icons, not their logos) | `index.html` via `<use href="#…">`, inserted by `js/main.js` |
| `icons/favicon.svg` | Browser tab icon: gold sun on a navy tile | Hand-written SVG by Claude Code | `index.html` `<link rel="icon">` |
| `icons/apple-touch-icon.png` | 180×180 home-screen icon, same design as the favicon | `swift tools/make-icons.swift assets/generated/icons` | `index.html` `<link rel="apple-touch-icon">` |
| `icons/og-image.png` | 1200×630 share image: sun, "Helios Studio", tagline, Nagoya | `swift tools/make-icons.swift assets/generated/icons` (Avenir Next) | `index.html` `og:image` |
