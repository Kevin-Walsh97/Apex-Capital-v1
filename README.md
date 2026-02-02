# Apex Capital Solutions

AI-Powered Data Room for Private Markets. Replace static PDF repositories with intelligent, conversational due diligence.

## Quick Start

```bash
npm install
npm run dev
```

The app runs at `http://localhost:5173`.

## Demo Credentials

| Role | Email | Password |
|------|-------|----------|
| GP (General Partner) | gp@demo.com | password123 |
| LP (Limited Partner) | lp@demo.com | password123 |

## Features

### GP Dashboard
- **Overview**: Fund stats, pipeline summary, quick actions
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
Pre-loaded with 4 realistic funds:
1. **Sequoia Capital Fund XXIII** - VC, $2B target
2. **Apollo Credit Opportunities IV** - Credit, $5B target
3. **Blackstone Real Estate Partners X** - Real Estate, $20B target
4. **FirstMark Capital Fund V** - Early-stage VC, $500M target

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
│   └── layout/        # Sidebar, DashboardLayout, GP/LP layouts
├── pages/
│   ├── gp/            # GP dashboard pages
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
