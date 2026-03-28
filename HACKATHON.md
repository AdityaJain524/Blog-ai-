# 🚀 Blogy AI Engine Pro — Hackathon Submission

> **A scalable AI-powered blog generation engine that systematically converts keyword intent into high-ranking, GEO-optimized, conversion-focused blogs through a structured prompt flow.**

![Status](https://img.shields.io/badge/Status-Production%20Ready-brightgreen)
![Tech](https://img.shields.io/badge/Stack-React%20%2B%20TypeScript%20%2B%20Supabase-blue)
![AI](https://img.shields.io/badge/AI-Gemini%20%2B%20OpenAI%20Hybrid-purple)

---

## 📋 Table of Contents

1. [Problem Statement](#problem-statement)
2. [Our Solution](#our-solution)
3. [Analysis Metrics Coverage](#analysis-metrics-coverage)
4. [Tech Stack](#tech-stack)
5. [System Architecture](#system-architecture)
6. [Hybrid AI Pipeline](#hybrid-ai-pipeline)
7. [Complete Feature List (35 Features)](#complete-feature-list-35-features)
8. [Analysis Metrics — Deep Dive](#analysis-metrics--deep-dive)
9. [Database Schema](#database-schema)
10. [Edge Functions & API Architecture](#edge-functions--api-architecture)
11. [Feature Details](#feature-details)
12. [Design System](#design-system)
13. [Demo Flow](#demo-flow)
14. [Scalability & Replicability](#scalability--replicability)
15. [Folder Structure](#folder-structure)
16. [Setup Guide](#setup-guide)
17. [Future Roadmap](#future-roadmap)

---

## 🎯 Problem Statement

**Objective:** Design a scalable AI-powered blog generation engine that systematically converts keyword intent into high-ranking, GEO-optimized, conversion-focused blogs through a structured prompt flow, ensuring:
- **Repeatability** — consistent output quality across any keyword/niche
- **Measurable SEO strength** — quantified scores and metrics
- **Compatibility** with search engines and generative AI platforms

### Required Analysis Metrics
1. Prompt Architecture Clarity
2. Keyword Clustering Logic
3. SERP Gap Identification
4. Projected Traffic Potential
5. SEO Optimization Percentage (via SEMrush or similar tool)
6. AI Detection Percentage & Naturalness Score
7. Snippet Readiness Probability
8. Keyword Density Compliance
9. Internal Linking Logic
10. Scalability and Replicability

---

## 💡 Our Solution

**Blogy AI Engine Pro** is a fully functional prototype that addresses every analysis metric through a modular, dual-AI architecture:

- Accepts keyword input with search intent classification and GEO targeting
- Generates complete blogs using a **Gemini + OpenAI hybrid pipeline** (structured prompt flow)
- Provides **real-time, quantified SEO analysis** across all 10 required metrics
- Supports **bulk generation** for scalability validation
- Features a production-ready dark-themed dashboard with 35+ features

---

## 📊 Analysis Metrics Coverage

| # | Required Metric | How We Address It | Component |
|---|----------------|-------------------|-----------|
| 1 | **Prompt Architecture Clarity** | 3-step structured prompt flow (Draft → Refine → Analyze). Real-time Prompt Optimizer shows before/after reasoning for keyword expansion, intent reinforcement, and GEO targeting | `PromptOptimizer.tsx`, `generate-blog/index.ts` |
| 2 | **Keyword Clustering Logic** | Primary + up to 5 secondary keywords with intent-based clustering. Prompt Templates auto-cluster related keywords by blog type (How-To, Listicle, Comparison, Review, Pillar Page) | `InputPanel.tsx`, `PromptTemplates.tsx` |
| 3 | **SERP Gap Identification** | SERP Gap Analyzer compares your blog headings against top-ranking competitor topics. Content Gap Heatmap visualizes coverage differences with animated percentage bars | `SerpGapAnalyzer.tsx`, `ContentGapHeatmap.tsx` |
| 4 | **Projected Traffic Potential** | Ranking Probability score (0-100%) based on SEO strength, keyword density, and content depth. Engagement Prediction estimates bounce rate risk and read time | `SeoInsightsPanel.tsx`, `EngagementPrediction.tsx` |
| 5 | **SEO Optimization Percentage** | SEO Score Ring (0-100) with animated visualization. 7-point SEO Failure Predictor checks thin content, title optimization, meta length, heading structure, keyword stuffing, and media signals | `SeoScoreRing.tsx`, `SeoFailurePredictor.tsx` |
| 6 | **AI Detection % & Naturalness Score** | AI vs Human Score Breakdown analyzes sentence length variation, unique word ratio (vocabulary diversity), transition word usage, and tone diversity. Outputs human-likeness percentage with detailed explanation | `AiHumanScore.tsx` |
| 7 | **Snippet Readiness Probability** | Real-Time SERP Preview Simulator shows exact Google rendering. Validates title length (30-60 chars), meta description (120-160 chars), and highlights truncation risks. FAQ sections are structured for featured snippet capture | `SerpPreview.tsx`, `BlogOutputPanel.tsx` |
| 8 | **Keyword Density Compliance** | Real-time keyword density analysis with percentage display. SEO Failure Predictor flags both keyword stuffing (>3%) and low density (<0.5%) risks | `SeoInsightsPanel.tsx`, `SeoFailurePredictor.tsx` |
| 9 | **Internal Linking Logic** | Auto Interlinking Engine scans content sections for semantic link opportunities. Suggests anchor text, target URLs, and optimal placement positions | `AutoInterlinking.tsx` |
| 10 | **Scalability & Replicability** | Bulk Blog Generation (up to 10 keywords simultaneously). Modular edge function architecture with action-based routing. Prompt Templates ensure repeatable quality across niches | `BulkGenerateModal.tsx`, `PromptTemplates.tsx` |

---

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | React 18 + TypeScript + Vite |
| **Styling** | Tailwind CSS + shadcn/ui + Framer Motion |
| **Backend** | Supabase Edge Functions (Deno) |
| **Database** | PostgreSQL (via Supabase) |
| **Authentication** | Supabase Auth (Email/Password) |
| **AI Models** | Google Gemini 2.5 Flash + OpenAI GPT-5 Mini |
| **State Management** | React useState + React Query |
| **Charts** | Recharts |
| **Routing** | React Router v6 |

---

## 🏗 System Architecture

```
┌─────────────────────────────────────────────────────┐
│                   FRONTEND (React)                   │
│                                                      │
│  ┌──────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │  Input    │  │  Blog Output │  │  SEO Insights│  │
│  │  Panel    │  │  Panel       │  │  Panel       │  │
│  └────┬─────┘  └──────┬───────┘  └──────┬───────┘  │
│       │               │                  │           │
│  ┌────┴───────────────┴──────────────────┴────────┐ │
│  │            State Management Layer               │ │
│  └────────────────────┬───────────────────────────┘ │
└───────────────────────┼─────────────────────────────┘
                        │
                        ▼
┌───────────────────────────────────────────────────────┐
│              SUPABASE EDGE FUNCTION                    │
│                                                        │
│  ┌─────────────┐    ┌──────────────────────────────┐  │
│  │   Router     │───▶│  Action Handlers             │  │
│  │             │    │  • generate (blog)             │  │
│  │             │    │  • repurpose (social)          │  │
│  │             │    │  • serp-gap (analysis)         │  │
│  │             │    │  • content-gap-heatmap         │  │
│  └─────────────┘    └──────────┬───────────────────┘  │
│                                │                       │
│                    ┌───────────┴───────────┐           │
│                    ▼                       ▼           │
│            ┌──────────────┐      ┌──────────────┐     │
│            │  Gemini API  │      │  OpenAI API  │     │
│            │  (Draft Gen) │      │  (Refinement)│     │
│            └──────────────┘      └──────────────┘     │
└───────────────────────────────────────────────────────┘
                        │
                        ▼
┌───────────────────────────────────────────────────────┐
│              SUPABASE DATABASE                         │
│                                                        │
│  ┌────────────┐    ┌──────────────┐                   │
│  │  profiles   │    │  saved_blogs  │                  │
│  │  (users)    │    │  (content)    │                  │
│  └────────────┘    └──────────────┘                   │
└───────────────────────────────────────────────────────┘
```

---

## 🔄 Hybrid AI Pipeline

### Prompt Architecture (3-Step Structured Flow)

This is the core prompt architecture that ensures **clarity, repeatability, and measurable output**:

#### Step 1 — Draft Generation (Google Gemini 2.5 Flash)
```
System Prompt: "You are a world-class SEO blog writer..."
Input: keyword + secondaryKeywords + intent + geoTarget
Output: Structured JSON with title, metaDescription, sections[], faqs[], cta, keywords[]
```
- Generates comprehensive blog structure with 5-8 sections
- Each section has SEO-optimized headings and 150-300 word content
- FAQ section targets "People Also Ask" featured snippets
- Intent-specific formatting (informational → educational, transactional → comparison tables, navigational → step-by-step)

#### Step 2 — Refinement & Humanization (OpenAI GPT-5 Mini)
```
System Prompt: "Refine this blog for naturalness, readability, and SEO..."
Input: Gemini draft output
Output: Refined blog with improved tone, varied sentence structure, optimized keyword placement
```
- Humanizes AI-generated content to reduce detection scores
- Improves readability (Flesch-Kincaid optimization)
- Optimizes keyword density to 1-2% range
- Adds conversational hooks and transition words

#### Step 3 — SEO Analysis & Scoring
```
Post-processing: Automated scoring algorithms
Input: Final blog content
Output: seoScore, readabilityScore, keywordDensity, rankingProbability
```
- Calculates overall SEO optimization percentage (0-100)
- Measures keyword density compliance
- Estimates ranking probability based on content signals
- Generates readability score

### Model Routing Logic
```
model === "gemini"  → Gemini 2.5 Flash only (faster, cheaper)
model === "openai"  → OpenAI GPT-5 Mini only (more natural)
model === "hybrid"  → Gemini draft → OpenAI refinement (best quality)
```

---

## ✅ Complete Feature List (35 Features)

### Core Blog Generation
| # | Feature | Status | Component |
|---|---------|--------|-----------|
| 1 | Hybrid AI Pipeline (Gemini + OpenAI) | ✅ Full | `generate-blog/index.ts` |
| 2 | Primary Keyword Input | ✅ Full | `InputPanel.tsx` |
| 3 | Secondary Keywords (up to 5) | ✅ Full | `InputPanel.tsx` |
| 4 | Search Intent Selection (Informational/Transactional/Navigational) | ✅ Full | `InputPanel.tsx` |
| 5 | GEO Target Localization | ✅ Full | `InputPanel.tsx` |
| 6 | AI Model Switcher (Gemini/OpenAI/Hybrid) | ✅ Full | `ModelSwitch.tsx` |
| 7 | Blog Output with Structured Sections & FAQs | ✅ Full | `BlogOutputPanel.tsx` |
| 8 | Meta Description Generation | ✅ Full | `BlogOutputPanel.tsx` |
| 9 | CTA Generation | ✅ Full | `BlogOutputPanel.tsx` |

### SEO Analysis & Metrics
| # | Feature | Status | Component |
|---|---------|--------|-----------|
| 10 | SEO Score Ring (0-100) | ✅ Full | `SeoScoreRing.tsx` |
| 11 | Readability Score | ✅ Full | `SeoInsightsPanel.tsx` |
| 12 | Keyword Density Analysis | ✅ Full | `SeoInsightsPanel.tsx` |
| 13 | Ranking Probability | ✅ Full | `SeoInsightsPanel.tsx` |
| 14 | SEO Failure Predictor (7-point risk analysis) | ✅ Full | `SeoFailurePredictor.tsx` |

### SERP & Competitor Analysis
| # | Feature | Status | Component |
|---|---------|--------|-----------|
| 15 | Real-Time SERP Preview Simulator | ✅ Full | `SerpPreview.tsx` |
| 16 | SERP Gap Analyzer | ✅ Full | `SerpGapAnalyzer.tsx` |
| 17 | Content Gap Heatmap | ✅ Full | `ContentGapHeatmap.tsx` |
| 18 | Competitor Beat Score | ✅ Full | `CompetitorBeatScore.tsx` |

### Content Quality & AI Detection
| # | Feature | Status | Component |
|---|---------|--------|-----------|
| 19 | AI vs Human Score Breakdown | ✅ Full | `AiHumanScore.tsx` |
| 20 | Engagement Prediction Score | ✅ Full | `EngagementPrediction.tsx` |
| 21 | Auto Interlinking Engine | ✅ Full | `AutoInterlinking.tsx` |

### Prompt & Content Management
| # | Feature | Status | Component |
|---|---------|--------|-----------|
| 22 | Real-Time Prompt Optimizer | ✅ Full | `PromptOptimizer.tsx` |
| 23 | Prompt Templates (5 types) | ✅ Full | `PromptTemplates.tsx` |
| 24 | 1-Click Content Repurposing (LinkedIn/Twitter/Summary) | ✅ Full | `SeoInsightsPanel.tsx` |

### Export & Publishing
| # | Feature | Status | Component |
|---|---------|--------|-----------|
| 25 | Export to Markdown | ✅ Full | `BlogOutputPanel.tsx` |
| 26 | Copy to Clipboard | ✅ Full | `BlogOutputPanel.tsx` |
| 27 | Mock Publish to Medium | ✅ Full | `MockPublish.tsx` |
| 28 | Mock Publish to LinkedIn | ✅ Full | `MockPublish.tsx` |

### User Management & Storage
| # | Feature | Status | Component |
|---|---------|--------|-----------|
| 29 | User Authentication (Sign Up/Sign In) | ✅ Full | `AuthModal.tsx` |
| 30 | Blog Saving to Database | ✅ Full | `SavedBlogsList.tsx` |
| 31 | Saved Blogs Library (Load/Delete) | ✅ Full | `SavedBlogsList.tsx` |
| 32 | Bulk Blog Generation (up to 10 keywords) | ✅ Full | `BulkGenerateModal.tsx` |

### UI/UX
| # | Feature | Status | Component |
|---|---------|--------|-----------|
| 33 | Dark Theme UI with Design Tokens | ✅ Full | `index.css` |
| 34 | Responsive Mobile Layout | ✅ Full | All components |
| 35 | Loading States & Animations | ✅ Full | Framer Motion + CSS |

---

## 🔬 Analysis Metrics — Deep Dive

### 1. Prompt Architecture Clarity

Our prompt architecture follows a **3-step structured flow** designed for maximum clarity and reproducibility:

**Why this matters:** A clear prompt architecture ensures consistent output quality regardless of the input keyword or niche. Each step has a defined input/output contract.

**Implementation:**
- **Step 1 (Gemini):** System prompt defines the role, output format (JSON schema), and quality expectations. Input includes keyword, intent, secondary keywords, and GEO target.
- **Step 2 (OpenAI):** Receives Step 1 output as context. System prompt focuses specifically on humanization and SEO refinement.
- **Step 3 (Analysis):** Algorithmic post-processing with deterministic scoring.

**Prompt Optimizer Component:** Shows users the "before" (raw input) vs "after" (optimized prompt) with reasoning for each optimization — making the architecture transparent.

### 2. Keyword Clustering Logic

**Implementation:**
- Primary keyword acts as the cluster seed
- Up to 5 secondary keywords form the semantic cluster
- Search intent (Informational/Transactional/Navigational) determines content structure
- Prompt Templates pre-define keyword clusters for common blog types:
  - **How-To Guide:** "how to [keyword]", "step by step", "tutorial", "guide"
  - **Listicle:** "best [keyword]", "top tools", "alternatives"
  - **Comparison:** "[keyword] vs", "comparison", "which is better"
  - **Review:** "[keyword] review", "pros cons", "worth it"
  - **Pillar Page:** "[keyword] complete guide", "everything about", "definitive"

### 3. SERP Gap Identification

**Implementation:**
- `SerpGapAnalyzer.tsx`: AI-powered analysis comparing your blog headings against what top-ranking pages cover
- `ContentGapHeatmap.tsx`: Visual heatmap showing competitor coverage (%) vs your coverage (%) for each subtopic
- Identifies "missing" topics that competitors cover but your blog doesn't
- Suggests additional sections to fill content gaps

### 4. Projected Traffic Potential

**Implementation:**
- **Ranking Probability:** 0-100% score based on SEO strength, content depth, and keyword optimization
- **Engagement Prediction:** Estimates bounce rate risk (low/medium/high) and average read time
- Factors: intro hook strength, paragraph density, content length, heading structure

### 5. SEO Optimization Percentage

**Implementation:**
- `SeoScoreRing.tsx`: Animated circular score visualization (0-100)
- Calculated from: keyword density, content length, heading structure, meta optimization, readability
- `SeoFailurePredictor.tsx`: 7-point risk assessment:
  1. ❌ Thin content warning (<800 words)
  2. ❌ Missing keyword in title
  3. ❌ Meta description too short/long
  4. ❌ Insufficient heading structure (<3 headings)
  5. ❌ Keyword stuffing risk (>3% density)
  6. ❌ Low keyword density (<0.5%)
  7. ❌ No media/link signals detected

### 6. AI Detection Percentage & Naturalness Score

**Implementation:**
- `AiHumanScore.tsx` analyzes:
  - **Sentence length variation:** >50% coefficient of variation = more human-like
  - **Unique word ratio:** Higher vocabulary diversity = less AI-detectable
  - **Transition word usage:** Natural connectors like "however", "furthermore", "in contrast"
  - **Tone diversity:** Mix of declarative, interrogative, and imperative sentences
- Outputs: Human-likeness percentage (target: >75%) with per-metric breakdown
- **Hybrid pipeline advantage:** OpenAI refinement step specifically targets humanization

### 7. Snippet Readiness Probability

**Implementation:**
- `SerpPreview.tsx`: Pixel-perfect Google search result simulator
- Real-time validation:
  - Title: ✅ 30-60 chars optimal, ⚠️ truncation warning if >60
  - Meta description: ✅ 120-160 chars optimal, ⚠️ too short/long warnings
  - URL preview with keyword slug
- FAQ sections structured as Q&A pairs targeting "People Also Ask" featured snippets
- Blog structure optimized for passage-based ranking

### 8. Keyword Density Compliance

**Implementation:**
- Real-time keyword density calculation (occurrences / total words × 100)
- Displayed in `SeoInsightsPanel.tsx` with percentage
- `SeoFailurePredictor.tsx` flags:
  - **Keyword stuffing:** >3% density → penalty risk
  - **Low density:** <0.5% → weak signal
  - **Optimal range:** 1-2% density maintained by hybrid pipeline

### 9. Internal Linking Logic

**Implementation:**
- `AutoInterlinking.tsx` scans each blog section for semantic link opportunities
- Keyword trigger map:
  - "SEO" → suggests link to SEO tools page
  - "AI" → suggests link to AI resources page
  - "marketing" → suggests link to marketing strategies page
  - (10+ keyword categories)
- Outputs for each suggestion:
  - Section where link should be inserted
  - Recommended anchor text
  - Target URL
  - Reasoning for the link

### 10. Scalability & Replicability

**Implementation:**
- **Bulk Generation:** Process up to 10 keywords simultaneously with progress tracking
- **Prompt Templates:** 5 pre-built templates ensure repeatable quality across niches
- **Modular API:** Single edge function with action-based routing — easy to extend
- **Database Storage:** All generated blogs saved with full metadata for analysis
- **Model Switching:** Easily swap between Gemini, OpenAI, or Hybrid without code changes
- **GEO Targeting:** Same pipeline works for any geographic market

---

## 🗄 Database Schema

### `profiles` Table
Auto-created on user signup via database trigger.

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID (PK) | References auth.users |
| `email` | TEXT | User email |
| `full_name` | TEXT | User display name |
| `avatar_url` | TEXT | Profile picture URL |
| `created_at` | TIMESTAMPTZ | Account creation date |

### `saved_blogs` Table
Stores generated blog content for authenticated users.

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID (PK) | Unique blog ID |
| `user_id` | UUID | Owner reference |
| `keyword` | TEXT | Primary keyword used |
| `title` | TEXT | Blog title |
| `meta_description` | TEXT | SEO meta description |
| `sections` | JSONB | Array of {heading, content} |
| `faqs` | JSONB | Array of {question, answer} |
| `cta` | TEXT | Call to action text |
| `keywords` | JSONB | All keywords used |
| `seo_insights` | JSONB | SEO analysis data |
| `created_at` | TIMESTAMPTZ | Save timestamp |

### Row Level Security (RLS)
- Users can only SELECT, INSERT, UPDATE, DELETE their own `saved_blogs`
- Profiles are readable by the owning user only

---

## ⚡ Edge Functions & API Architecture

### `generate-blog` (Main AI Function)

Modular, action-based routing in a single edge function:

| Action | Description | Input | Output |
|--------|-------------|-------|--------|
| `generate` (default) | Full blog generation via hybrid pipeline | keyword, intent, model, geoTarget | Blog object with SEO insights |
| `repurpose` | Convert blog to social format | format, blogContent | Formatted content string |
| `serp-gap` | SERP gap analysis | keyword, blogHeadings | Gap analysis array |
| `content-gap-heatmap` | Coverage comparison | keyword, blogHeadings | Heatmap data array |

### API Extensibility
The action-based architecture allows adding new capabilities without creating new endpoints:
```typescript
// Adding a new action is a single switch case
case "new-action":
  return handleNewAction(body);
```

---

## 🔍 Feature Details

### SERP Preview Simulator
Live Google search result preview showing how your blog will appear in search results. Highlights issues like title length (optimal: 30-60 chars) and meta description length (optimal: 120-160 chars). Shows keyword in URL slug.

### AI vs Human Score Breakdown
Analyzes generated content for AI detection risk by measuring sentence length variation (>50% = more human), unique word ratio (vocabulary diversity), transition word usage, and overall human-likeness percentage with detailed per-metric explanation.

### Competitor Beat Score
Calculates a percentile ranking against typical competitors based on content depth (word count vs. average), keyword integration density, and structural quality (heading count). Output: "You beat X% of competitors."

### SEO Failure Predictor
7-point risk assessment covering thin content warnings (<800 words), missing keyword in title, meta description length issues, insufficient heading structure, keyword stuffing detection (>3%), low keyword density (<0.5%), and missing media/link suggestions.

### Engagement Prediction
Predicts user engagement metrics: estimated read time (based on word count at 200 WPM), bounce risk assessment (based on intro hooks, paragraph density), and content engagement score.

### Auto Interlinking Engine
Scans content sections for semantic opportunities to insert internal links. Suggests anchor text, target URLs, and optimal placement for 10+ keyword categories including SEO, AI, marketing, content strategy, and more.

### Prompt Optimizer
Shows "before vs after" prompt optimization with reasoning. Demonstrates keyword expansion (adds LSI keywords), intent reinforcement (adjusts tone/format), and GEO targeting (localizes examples and references).

### Prompt Templates
5 pre-built blog templates: How-To Guide (step-by-step tutorial), Listicle (numbered list article), Comparison (product/service comparison), Review (in-depth review format), Pillar Page (comprehensive topic coverage). Each pre-fills keywords, intent, and secondary keyword clusters.

### Mock Publishing
Simulates publishing to Medium and LinkedIn with platform-specific formatting, content preview, copy-to-clipboard, and simulated publish confirmation with success status.

### Content Gap Heatmap
Visual comparison grid showing competitor coverage vs. your content coverage across subtopics. Uses animated gradient bars with percentage indicators for at-a-glance gap identification.

---

## 🎨 Design System

### Color Palette (Dark Theme)

| Token | HSL Value | Usage |
|-------|-----------|-------|
| `--background` | 220 20% 7% | Page background |
| `--foreground` | 210 20% 92% | Primary text |
| `--primary` | 210 100% 56% | Brand blue, CTAs |
| `--accent` | 165 80% 45% | Success indicators |
| `--secondary` | 220 16% 16% | Card backgrounds |
| `--muted` | 220 14% 14% | Subtle backgrounds |
| `--destructive` | 0 72% 55% | Error states |
| `--success` | 142 70% 45% | Success states |
| `--warning` | 38 92% 55% | Warning indicators |

### Typography
- **Heading Font:** Space Grotesk (300-700)
- **Body Font:** Inter (300-600)

### Animations
- Framer Motion for component transitions
- CSS pulse animations for status indicators
- Gradient glow effects on primary elements

---

## 🎬 Demo Flow

1. **Enter Keyword** → Type "best AI tools for SEO" in primary keyword
2. **Add Secondary Keywords** → Add "AI SEO software", "SEO automation"
3. **Select Intent** → Choose "Informational"
4. **Set GEO** → Enter "United States"
5. **Choose Model** → Select "Hybrid" (Gemini + OpenAI)
6. **Generate** → Click "Generate Blog"
7. **Review Output** → See generated blog with sections, FAQs, CTA
8. **Check SEO Metrics** → Review SEO score ring, readability, keyword density
9. **SERP Preview** → See exactly how it appears on Google
10. **Gap Analysis** → Check SERP gaps and content gap heatmap
11. **AI Detection** → Review AI vs Human score breakdown
12. **Competitor Score** → See "You beat X% of competitors"
13. **Link Suggestions** → Review auto-generated internal linking
14. **Risk Check** → SEO Failure Predictor flags any issues
15. **Export** → Copy to clipboard or download as Markdown
16. **Publish** → Mock publish to Medium or LinkedIn

---

## 📈 Scalability & Replicability

### How the System Scales

1. **Keyword Agnostic:** Works for any keyword in any niche — the prompt architecture adapts based on intent and GEO
2. **Bulk Processing:** Built-in bulk generation for up to 10 keywords with parallel status tracking
3. **Template System:** 5 templates ensure consistent quality patterns are replicable
4. **Model Flexibility:** Switch between Gemini, OpenAI, or Hybrid without code changes
5. **Modular API:** Action-based edge function routing — add new capabilities with a single switch case
6. **Database-Backed:** All generated content persisted for analysis, comparison, and iteration
7. **GEO Adaptable:** Same pipeline produces localized content for any geographic market

### Stress Test Ready
- Bulk generation handles 10 sequential keyword generations with progress tracking
- Each generation is independent — failures don't block subsequent keywords
- Auto-save to database ensures no content loss during bulk runs

---

## 📁 Folder Structure

```
blogy-ai-engine-pro/
├── public/
│   ├── placeholder.svg
│   └── robots.txt
├── src/
│   ├── components/
│   │   ├── ui/                        # shadcn/ui components (40+)
│   │   ├── InputPanel.tsx             # Blog configuration form
│   │   ├── BlogOutputPanel.tsx        # Blog display + export
│   │   ├── SeoInsightsPanel.tsx       # SEO metrics + repurposing
│   │   ├── SeoScoreRing.tsx           # Animated circular score
│   │   ├── ModelSwitch.tsx            # AI model selector
│   │   ├── DashboardHeader.tsx        # App header with auth
│   │   ├── AuthModal.tsx              # Sign in/up dialog
│   │   ├── SavedBlogsList.tsx         # Blog library manager
│   │   ├── BulkGenerateModal.tsx      # Bulk generation UI
│   │   ├── ContentGapHeatmap.tsx      # Visual gap analysis
│   │   ├── SerpGapAnalyzer.tsx        # SERP comparison tool
│   │   ├── SerpPreview.tsx            # Google preview simulator
│   │   ├── PromptTemplates.tsx        # Pre-built templates
│   │   ├── AiHumanScore.tsx           # AI detection analysis
│   │   ├── CompetitorBeatScore.tsx    # Competitor comparison
│   │   ├── AutoInterlinking.tsx       # Internal link suggestions
│   │   ├── EngagementPrediction.tsx   # Bounce rate predictor
│   │   ├── SeoFailurePredictor.tsx    # SEO risk warnings
│   │   ├── PromptOptimizer.tsx        # Prompt improvement tool
│   │   └── MockPublish.tsx            # Publish simulator
│   ├── hooks/
│   ├── integrations/supabase/
│   ├── lib/
│   ├── pages/
│   │   ├── Index.tsx                  # Main dashboard
│   │   └── NotFound.tsx
│   ├── App.tsx
│   ├── index.css                      # Design tokens
│   └── main.tsx
├── supabase/
│   ├── config.toml
│   ├── functions/generate-blog/index.ts
│   └── migrations/
├── HACKATHON.md                       # This file
├── PPT_SUBMISSION.md                  # Presentation guide
└── package.json
```

---

## ⚙️ Setup Guide

### Prerequisites
- Node.js 18+ or Bun
- Supabase project (or Lovable Cloud)

### Installation
```bash
git clone <repo-url>
cd blogy-ai-engine-pro
npm install   # or bun install
npm run dev   # or bun dev
```

### Environment Variables (auto-configured with Lovable Cloud)
```env
VITE_SUPABASE_URL=<your-supabase-url>
VITE_SUPABASE_PUBLISHABLE_KEY=<your-supabase-anon-key>
```

### Edge Function Secrets
| Secret | Description |
|--------|-------------|
| `LOVABLE_API_KEY` | API key for AI proxy (auto-configured) |
| `SUPABASE_URL` | Supabase project URL |
| `SUPABASE_ANON_KEY` | Supabase anonymous key |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key |

---

## 🔮 Future Roadmap

- [ ] Real API integration with Google Search Console for live SERP data
- [ ] WordPress/Ghost direct publishing integration
- [ ] Team collaboration with shared blog libraries
- [ ] A/B title testing with click-through rate prediction
- [ ] Multi-language blog generation
- [ ] Image generation for blog headers (DALL-E/Midjourney)
- [ ] Version history and diff comparison
- [ ] Custom brand voice training
- [ ] Scheduled blog generation (cron jobs)
- [ ] Analytics dashboard with traffic tracking

---

## 👥 Team

Built for Hackathon 2026 with ❤️ using [Lovable](https://lovable.dev)

---

## 📄 License

MIT License
