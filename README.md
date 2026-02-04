# Apex Capital Solutions

AI-Powered Data Room for Private Markets. Replace static PDF repositories with intelligent, conversational due diligence.

## Quick Start

```bash
npm install
npm run dev
```

The app runs at `http://localhost:5173`.

## Demo Credentials

### Three User Roles

| Role | Email | Password | Access |
|------|-------|----------|--------|
| **Advisor/Consultant** | advisor@demo.com | password123 | All funds across all firms |
| **GP (Sequoia)** | gp@sequoia.com | password123 | Sequoia funds only |
| **GP (Apollo)** | gp@apollo.com | password123 | Apollo funds only |
| **GP (Blackstone)** | gp@blackstone.com | password123 | Blackstone funds only |
| **GP (FirstMark)** | gp@firstmark.com | password123 | FirstMark funds only |
| **LP (Investor)** | lp@demo.com | password123 | Investor view with Q&A |

### Role Differences
- **Advisor**: Consultants/placement agents who work across multiple fund managers. Can see all funds and pipeline activity.
- **GP (General Partner)**: Fund managers who only see their own firm's funds. Each GP login is scoped to a specific firm.
- **LP (Limited Partner)**: Institutional investors evaluating fund opportunities with AI-powered Q&A.

## Features

### Advisor Dashboard (Cross-Firm View)
- View all funds across all firms (Sequoia, Apollo, Blackstone, FirstMark)
- Aggregate pipeline across all fundraises
- Full document access and analytics

### GP Dashboard (Firm-Specific View)
- **Overview**: Your firm's fund stats, pipeline summary, quick actions
- **Documents**: Upload and manage fund documents (PPM, DDQ, Track Record, LPA, Quarterly Letters)
- **Pipeline**: Kanban-style LP fundraising pipeline (Inquired → Under Review → Soft Circle → Committed → Passed)
- **Analytics**: Document views, LP engagement, fundraising progress charts, common questions
- **Data Room**: Organize documents by category, manage LP access permissions

### LP Dashboard
- **Fund Discovery**: Browse and filter funds by strategy, geography, status
- **Fund Detail**: Overview, documents, AI Q&A with source citations, automated summaries
- **Documents**: Access all granted documents across funds with search and review tracking
- **Comparison**: Side-by-side comparison of up to 3 funds with charts
- **Calendar**: Fundraising schedule tracker with closing dates
- **My Funds**: Saved funds and pipeline status tracking

### AI-Powered Q&A
Ask natural language questions about fund documents and receive answers with source citations:
- "What is the management fee structure?"
- "How did Fund XXI perform?"
- "What is the key person provision?"
- "How did portfolio companies perform during Q3 2024?"

### Sample Data
Pre-loaded with 4 realistic funds, each tied to a specific GP firm:
1. **Sequoia Capital Fund XXIII** - VC, $2B target (Sequoia GP)
2. **Apollo Credit Opportunities IV** - Credit, $5B target (Apollo GP)
3. **Blackstone Real Estate Partners X** - Real Estate, $20B target (Blackstone GP)
4. **FirstMark Capital Fund V** - Early-stage VC, $500M target (FirstMark GP)

Each fund includes PPM, track record, DDQ, and quarterly letter documents with full content for AI Q&A.

## Tech Stack

- React 18 + TypeScript
- Vite
- Tailwind CSS 4
- React Router v6
- Zustand (state management)
- Recharts (analytics charts)
- Lucide React (icons)

## Project Structure

```
src/
├── components/
│   └── layout/        # Sidebar, DashboardLayout, GP/LP/Advisor layouts
├── hooks/             # Custom hooks (useFundsForUser)
├── pages/
│   ├── gp/            # GP/Advisor dashboard pages
│   └── lp/            # LP dashboard pages
├── store/             # Zustand store
├── types/             # TypeScript type definitions
├── utils/             # Formatting helpers
└── data/              # Sample data (funds, pipeline, Q&A history)
```

## Building

```bash
npm run build
```

Output is in the `dist/` directory, ready for deployment to Vercel, Netlify, or any static host.
