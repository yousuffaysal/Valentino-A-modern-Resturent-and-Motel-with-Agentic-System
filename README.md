# 🏨 Hotel Valentino & Sky View Restaurant — Agentic AI Motel System

[![Next.js 14](https://img.shields.io/badge/Next.js-14.2-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![PostgreSQL](https://img.shields.io/badge/Neon_PostgreSQL-Database-336791?style=for-the-badge&logo=postgresql)](https://neon.tech/)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?style=for-the-badge&logo=prisma)](https://www.prisma.io/)
[![Groq AI](https://img.shields.io/badge/Groq_AI-Llama_3.3_70B-f05032?style=for-the-badge)](https://groq.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)

An architectural masterpiece in hospitality software: **Hotel Valentino** is a full-stack Next.js 14 App Router application paired with **Neon Cloud PostgreSQL**, powered by an autonomous **Agentic AI Reception System** and an editorial design aesthetic.

Located at the iconic *Boro Masjid Moar, Main Road, Maijdee Court, Noakhali-3800, Bangladesh*, this system seamlessly merges modern web design, real-time database persistence, instant bilingual localization (English & Bangla), and intelligent conversational AI.

---

## 🌟 Key Highlights & Features

- **⚡ Full-Stack Next.js 14 App Router**: Server and client components built with high-performance React 18 primitives.
- **🐘 Neon Cloud PostgreSQL & Prisma ORM**: Instant cloud database connectivity with automated migrations and real-time record synchronization for room bookings and restaurant table reservations.
- **🤖 Agentic AI Reception Assistant**: An autonomous 24/7 concierge powered by Groq Llama 3.3 70B that answers guest inquiries, recommends room categories based on budget/party size, provides route guidance, and assists with reservations.
- **🌐 Dynamic Bilingual Localization (EN ↔ BN)**: Complete English and Bangla language toggle across every section of the application—from hero copy to guest counter labels, date formats, invoice generators, and validation errors.
- **🗺️ Interactive Minimalist B&W Real Street Map**: High-contrast black & white vector road map of Maijdee Court featuring an animated pulsing red dot location indicator.
- **📊 Executive Admin Dashboard**: Live revenue analytics, total booking counters, occupancy metrics, filterable status toggles (`Paid` vs `Pending`), search functionality, and print-ready **Invoice Generator** (`@media print`).
- **🍽️ Sky View Rooftop Restaurant Integration**: Interactive dining menu filters (Appetizers, Sizzling Platters, Steaks, Soups) and a 3-step rooftop table reservation workflow.

---

## 🎨 Design Philosophy & Aesthetics

The UI/UX of Hotel Valentino is crafted to evoke **editorial luxury, timeless elegance, and tactile feedback**.

```
                        DESIGN SYSTEM TOKENS
┌───────────────────────────┬───────────────────────────┬───────────────────────────┐
│     Limestone Surface     │        Night Slate        │        Crimson Lacquer    │
│          #E9EAE5          │          #0E1114          │            #A81E2D        │
└───────────────────────────┴───────────────────────────┴───────────────────────────┘
```

### 1. Curated Color Palette
- **Limestone (`#E9EAE5`)**: A soft, matte architectural stone tone used as the primary background.
- **Night (`#0E1114`)**: Deep obsidian black utilized for hero sections, rooftop dining components, and executive admin screens.
- **Crimson Lacquer (`#A81E2D`)**: The primary brand accent tone representing warmth and hospitality.
- **Warm Brass (`#A98A55`)**: Used for subtitled labels, dates, and executive indicators.

### 2. Modern Editorial Typography
- **Primary Body**: `Plus Jakarta Sans` for crisp legibility across mobile and desktop devices.
- **Monospace Numerical Accent**: `JetBrains Mono` for tabular pricing, date ranges, room codes (`HV-01` to `HV-08`), and invoice numbers.
- **Bengali Sub-system**: `Noto Sans Bengali` providing fluid typography when toggled to Bangla mode.

### 3. Micro-Animations & Dynamic Feedback
- **Pulsing Map Beacon**: Keyframe `@keyframes hv-map-pulse` generates an expanding red radar pulse over the hotel's exact coordinates.
- **Slide-Over Drawers**: Multi-step booking workflows animate gracefully from the right edge with backdrop blur filters.

---

## 🧠 The Agentic AI Reception System

### What makes it "Agentic"?
Unlike basic chatbots that simply echo fixed FAQ templates, an **Agentic AI System** possesses **context awareness, goal orientation, decision-making capabilities, and actionable guidance**:

1. **Context Window Integration**: The AI receives a structured knowledge representation of Hotel Valentino (room specs, pricing tiers, menu items, local distances to NSTU/train station, booking policies).
2. **Intent Recognition & Goal Solving**: If a guest says *"I am travelling with my wife and child for 2 nights on a 15,000 BDT budget"*, the Agentic AI calculates room fit, recommends the **Triple Deluxe** or **Couple Deluxe**, and guides them directly to the reservation drawer.
3. **Multilingual Reasoning**: Seamlessly parses and responds in both English and Bangla.

### How the Agentic AI was Built
```mermaid
graph LR
    User[Guest Prompt] --> API[/api/chat Route]
    API --> SystemPrompt[System Prompt & Hotel Knowledge Base]
    SystemPrompt --> GroqEngine[Groq Llama 3.3 70B Model]
    GroqEngine --> Response[Context-Aware Natural Response]
    Response --> UI[Floating AI Reception Widget]
```

- **Runtime**: Next.js Serverless API Route (`/app/api/chat/route.ts`).
- **Engine**: Groq SDK invoking the `llama-3.3-70b-versatile` model with ultra-low latency inference (~200ms response time).
- **Security**: Key authorization handled strictly on the server-side via environment variables (`process.env.GROQ_API_KEY`).

---

## 🏗️ System Architecture & Stack

```
                             ARCHITECTURE OVERVIEW
┌──────────────────────────────────────────────────────────────────────────────────┐
│                             Next.js 14 App Router                                │
├───────────────────────────────┬───────────────────┬──────────────────────────────┤
│  Client Components (React 18) │ Context Providers │      Server API Routes       │
│  - Hero & Room Showcase       │ - LanguageContext │  - GET/POST /api/bookings    │
│  - 6-Step Booking Drawer      │   (EN <-> BN)     │  - PATCH/DELETE /api/bookings│
│  - 3-Step Table Drawer        │                   │  - POST /api/reservations    │
│  - Admin Dashboard & Invoice  │                   │  - POST /api/chat (Groq)     │
└───────────────┬───────────────┴───────────────────┴──────────────┬───────────────┘
                │                                                  │
                ▼                                                  ▼
      Static Media Assets                                Prisma Client (ORM)
  (Real Map B&W, Room Photos)                                      │
                                                                   ▼
                                                         Neon Cloud PostgreSQL
                                                           (Cloud Database)
```

---

## 🚀 Getting Started Locally

### Prerequisites
- Node.js 18.x or higher
- npm or pnpm

### 1. Clone & Install
```bash
git clone https://github.com/yousuffaysal/Valentino-A-modern-Resturent-and-Motel-with-Agentic-System.git
cd Valentino-A-modern-Resturent-and-Motel-with-Agentic-System
npm install
```

### 2. Environment Configuration
Create a `.env` file in the root directory:
```env
DATABASE_URL="postgresql://neondb_owner:npg_obp02BwcjCry@ep-morning-pond-ax3h205s-pooler.c-4.us-east-2.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
GROQ_API_KEY="your-groq-api-key-here"
```

### 3. Database Push & Prisma Setup
```bash
npx prisma db push
```

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📄 License & Author

Distributed under the MIT License.

Developed with precision and vision by:

### **Yousuf H Faysal**
*Software Architect & AI Engineer*
