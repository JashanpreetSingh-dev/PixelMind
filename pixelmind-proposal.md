## PixelMind – Concept & MVP Proposal

### 1. Product Overview
PixelMind is a PWA that combines a **pixel-based habit tracker**, a lightweight **night journaling ritual**, and an **AI memory layer** that connects what you do with how you feel over time. The goal is a single daily home for consistency, reflection, and pattern awareness—without juggling multiple apps.

### 2. Problem
- **Habits are tracked in isolation**: Most habit apps only care about binary completion, not emotional context.
- **Journals live separately**: Reflection happens in different apps, disconnected from what actually happened that day.
- **No long-term “story”**: Very few tools help users see how their habits and moods weave into a narrative over weeks and months.

PixelMind aims to connect **habits**, **feelings**, and **memories** into one coherent loop.

### 3. Target Users
- People aged roughly **20–35** investing in self-improvement.
- Users who want **accountability plus reflection**, but don’t want the overhead of managing several apps.
- People drawn to **visual progress** (pixel mosaics, streaks) and **gentle, non-judgmental** insights.

### 4. Core Concept
- **One daily surface**: A pixel mosaic that grows as habits are completed.
- **One daily ritual**: A 3–5 minute night check-in (typed or spoken) with light guidance.
- **One slow-burn layer**: An AI system that gradually learns the user’s patterns and surfaces meaningful insights and memories.

### 5. Core Features (MVP)

#### 5.1 Pixel Habit Tracker
- Users define a small set of **custom habits** (e.g., 3–7).
- Each habit is assigned a **color**.
- Completing a habit for the day fills in the corresponding pixel in a **day/weekly grid**, building a visual mosaic of consistency.

#### 5.2 Night Journal (Hybrid)
- End-of-day flow that takes **3–5 minutes**.
- Users can **type** or **speak** their reflection (speech is transcribed to text).
- Includes **1–2 micro-prompts** (e.g., “What’s one moment you’re glad happened today?”) plus optional free-form space.
- Optionally captures a **quick mood snapshot** (slider or tags) to anchor the day emotionally.

#### 5.3 AI Memory Layer
- Powered by an external LLM API (initially **Claude API**).
- Over time, learns from:
  - Habit completions (which habits, how often, on which days).
  - Journal entries (topics, emotions, recurring themes).
  - Optional mood snapshots.
- After the first few weeks, starts to:
  - Surface **weekly insights** about trends and correlations (e.g., “Your best-slept nights tend to follow days when you complete your evening walk.”).
  - Gently **recall past entries** that feel similar to the current week (“Last time you felt this stuck, you wrote about taking a long walk the next day.”).
  - Offer **small, time-bound experiments** (“Want to try journaling before 10pm for the next 5 days?”).

### 6. Why It’s Different
- **Merged surfaces**: Habit tracker + journal + AI insights in one place instead of separate apps.
- **Story-aware**: Focuses on the **narrative arc** of the user’s life across weeks, not just streaks or raw metrics.
- **Gentle, not naggy**: Insights are infrequent, contextual, and grounded in the user’s own words and behavior.

### 7. Technical Direction (High Level)
- **Platform**: Progressive Web App (PWA) to support installation to home screen on iOS, Android, and desktop without app store friction.
- **Frontend stack**: Modern web framework (e.g., React/Next, SvelteKit, etc. – to be decided later) with responsive, mobile-first UI.
- **Backend**:
  - User accounts and persistent data storage (habits, days, journal entries, insights).
  - Scheduled or on-demand jobs to generate **weekly insights**.
- **AI Integration**:
  - Use **Claude API** for:
    - Extracting themes and moods from journal text.
    - Generating human-readable weekly insights and gentle nudges.
    - Optionally suggesting prompts and recalling relevant past entries.

### 8. MVP Scope (Initial Release)
- **Must-have**
  - User accounts and secure authentication.
  - Pixel tracker with **custom habits** and colored pixels.
  - Night journal with **voice + text** input and a small set of rotating prompts.
  - Storage of journal entries and habit completions per day.
  - Weekly AI-generated insight card(s) based on habits and journals.
  - Basic settings: manage habits, set reminder time, simple AI/notification preferences.

- **Nice-to-have (post-MVP or stretch)**
  - Rich search: “Show me weeks I felt proud” or “Show entries about work.”
  - Deeper insight types (e.g., correlations across longer time windows, “similar weeks”).
  - Data export and more granular privacy controls.

### 9. Non-Goals for MVP
- Full social features, shared journals, or friend feeds.
- Complex gamification systems (badges, levels, etc.).
- Heavy analytics dashboards; focus instead on **one or a few insight cards** that feel human and narrative.

### 10. Success Signals (Early)
- Users complete the **night journal flow** on a majority of days within their first 2 weeks.
- Users open and read the **weekly insight** view and feel it is “accurate” or “helpful” in qualitative feedback.
- Users describe PixelMind as:
  - “One place I check in with myself,” and
  - “It remembers patterns I would have forgotten.”

