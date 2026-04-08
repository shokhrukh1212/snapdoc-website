# Snapdoc Website

Live site: [https://snapdoc-website.vercel.app/](https://snapdoc-website.vercel.app/)

This repository contains the public-facing Snapdoc website and interactive demo experience.

It is not the Chrome extension itself. This app explains the product, routes visitors to install Snapdoc, and gives them a guided, hands-on demo of the core workflow before they try the real extension.

## What Snapdoc Is

Snapdoc is a Chrome MV3 extension for turning browser workflows into polished step-by-step documentation.

The product is built for people who repeatedly document web apps:

- Technical writers
- Product managers
- IT and support teams
- Training and onboarding owners

Instead of recording a workflow, rewatching it, taking screenshots manually, cropping them, and rewriting steps every time the UI changes, Snapdoc captures meaningful browser interactions and assembles the guide for you.

Core product ideas:

- Capture browser workflows from a Chrome extension side panel
- Detect clicked elements from the DOM through a content script
- Take screenshots with `chrome.tabs.captureVisibleTab()`
- Generate cleaner step descriptions from element metadata
- Keep screenshot sizing consistent
- Detect outdated steps later with a CSS selector-based diff engine

## What This Website Does

This site has two jobs:

1. Explain the Snapdoc value proposition on the landing page
2. Let users try a simulated demo flow on `/demo`

The interactive demo walks users through the product story:

- install Snapdoc
- start capture
- capture a few UI elements on a live task board
- simulate a product update
- run change detection
- see Snapdoc find the changed and missing elements automatically

The demo is intentionally self-contained and browser-based. It mirrors the product experience for marketing and validation purposes, but it does not call the real Chrome extension APIs.

## Pages

- `/` - marketing landing page with product positioning, feature narrative, and demo CTA
- `/demo` - guided interactive demo that simulates capture, change, and diff detection
- `/privacy` - privacy policy page

## Stack

- React 19
- TypeScript
- Vite
- React Router
- Tailwind CSS v4
- GSAP
- `@dnd-kit` for the interactive task board behavior

The app is configured for SPA deployment on Vercel via [`vercel.json`](/Users/Apple/Shokhrukh Karimov/startups/snapdoc-website/vercel.json).

## Local Development

Install dependencies and start the dev server:

```bash
npm install
npm run dev
```

Other commands:

```bash
npm run build
npm run preview
npm run lint
```

## Demo Architecture

The interactive demo is centered around a simulated task board and guided tour flow.

Key areas:

- [`src/pages/HomePage.tsx`](/Users/Apple/Shokhrukh Karimov/startups/snapdoc-website/src/pages/HomePage.tsx) - landing page composition and demo CTA
- [`src/pages/DemoPage.tsx`](/Users/Apple/Shokhrukh Karimov/startups/snapdoc-website/src/pages/DemoPage.tsx) - full-page demo route
- [`src/components/demo/GuidedTour.tsx`](/Users/Apple/Shokhrukh Karimov/startups/snapdoc-website/src/components/demo/GuidedTour.tsx) - 7-step walkthrough and state transitions
- [`src/components/demo/DemoApp.tsx`](/Users/Apple/Shokhrukh Karimov/startups/snapdoc-website/src/components/demo/DemoApp.tsx) - simulated product surface shown during the demo
- [`src/components/demo/demoStorage.ts`](/Users/Apple/Shokhrukh Karimov/startups/snapdoc-website/src/components/demo/demoStorage.ts) - localStorage persistence for the demo state

## Product Positioning

Snapdoc is designed around a simple promise:

**Screenshots to polished docs in seconds.**

The strongest value is not only faster first-pass documentation, but easier maintenance later. When a product UI changes, Snapdoc is meant to help users update only the broken steps instead of recreating an entire guide from scratch.

That is the product story this website is built to communicate.
