# Blog AI Pro

AI-powered SEO blog generation platform with structured prompt flow, hybrid model routing, SERP analysis, and production-ready content workflow.

## Table of Contents

1. Overview
2. Core Capabilities
3. Analysis Metrics Coverage
4. Tech Stack
5. Architecture
6. Project Structure
7. Getting Started
8. Environment Configuration
9. Available Scripts
10. Testing
11. Supabase Setup
12. Deployment Notes
13. Troubleshooting
14. Roadmap

## Overview

Blog AI Pro converts keyword intent into full blog drafts optimized for search visibility and content quality. The app supports:

- Single and bulk blog generation
- Intent-aware writing modes
- SEO and readability scoring
- SERP and content gap analysis
- AI-vs-human writing diagnostics
- Content repurposing and export
- Saved blogs with Supabase authentication

## Core Capabilities

### Blog Generation

- Primary keyword + optional secondary keywords
- Intent targeting: informational, transactional, navigational
- Optional GEO targeting for localized content
- Model selection: gemini, openai, hybrid
- Structured output: title, meta description, sections, FAQs, CTA, keywords

### SEO and Quality Insights

- SEO score ring and rank probability
- Readability and keyword density checks
- Failure predictor for common SEO issues
- SERP snippet preview and truncation checks
- Content gap and SERP gap analysis
- Competitor beat score and engagement prediction

### Publishing Workflow

- Save generated blogs to Supabase
- Load and delete saved blogs
- Export generated content
- Repurpose to social formats (LinkedIn, Twitter/X, summary)
- Mock publish actions

## Analysis Metrics Coverage

This project maps directly to common hackathon SEO engine evaluation criteria:

1. Prompt architecture clarity: structured generation and optimizer tooling
2. Keyword clustering logic: primary + secondary keyword workflow
3. SERP gap identification: SERP and heatmap analysis panels
4. Projected traffic potential: ranking probability and engagement indicators
5. SEO optimization percentage: aggregate score and checks
6. AI detection and naturalness: AI-vs-human score breakdown
7. Snippet readiness probability: title/meta validation and SERP preview
8. Keyword density compliance: density breakdown with status flags
9. Internal linking logic: auto interlinking suggestions
10. Scalability and replicability: bulk generation plus template-driven input

## Tech Stack

- Frontend: React 18, TypeScript, Vite
- UI: Tailwind CSS, shadcn/ui, Framer Motion
- Backend: Supabase Edge Functions (Deno)
- Database/Auth: Supabase PostgreSQL + Auth
- AI integration: gateway-based chat completion calls from edge function
- Testing: Vitest, Testing Library, Playwright

## Architecture

The frontend calls a single edge function endpoint using action-based routing.

- generate: creates blog draft + SEO insights
- repurpose: converts blog into social formats
- serp-gap: finds topic gaps vs competitors
- content-gap-heatmap: returns comparative coverage dataset

The UI is organized as a dashboard:

- Input and template controls
- Generated blog output panel
- Insight and analysis widgets
- Auth and saved content management

## Project Structure

```text
.
|-- public/
|-- src/
|   |-- components/
|   |-- hooks/
|   |-- integrations/supabase/
|   |-- lib/
|   |-- pages/
|   `-- test/
|-- supabase/
|   |-- functions/generate-blog/
|   `-- migrations/
|-- package.json
`-- vite.config.ts
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+
- Supabase CLI (optional for local backend workflow)

### Install

```bash
npm install
```

### Run Development Server

```bash
npm run dev
```

## Environment Configuration

Create a local env file named .env with frontend variables:

```bash
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
```

For edge function execution, configure the required AI gateway secret expected by:

- supabase/functions/generate-blog/index.ts

Set that secret in your Supabase project or local function environment before invoking generation actions.

## Available Scripts

- npm run dev: start Vite development server
- npm run build: production build
- npm run build:dev: development-mode build
- npm run preview: serve built output
- npm run lint: run ESLint
- npm run test: run Vitest once
- npm run test:watch: run Vitest in watch mode

## Testing

Unit and component tests:

```bash
npm run test
```

Watch mode:

```bash
npm run test:watch
```

## Supabase Setup

### Link project (if needed)

```bash
supabase login
supabase link --project-ref <your-project-ref>
```

### Apply database migrations

```bash
supabase db push
```

### Deploy function

```bash
supabase functions deploy generate-blog
```

## Deployment Notes

- Frontend can be deployed to any static host (Vercel, Netlify, Cloudflare Pages, etc.)
- Ensure frontend environment variables are set in your host
- Ensure function secrets are configured in Supabase
- Confirm CORS policy fits your production domain strategy

## Troubleshooting

- 401 or auth issues: verify Supabase URL/key and session configuration
- Function invocation failures: check function logs and secret configuration
- Empty blog output: verify AI secret exists and request body includes keyword and intent
- Rate or credit errors: inspect edge function response codes (429/402)

## Roadmap

- Advanced keyword cluster generation
- More publishing targets and CMS integrations
- Team workspaces and role-based collaboration
- Historical analytics for generated content performance
- Improved offline/local evaluation tooling
