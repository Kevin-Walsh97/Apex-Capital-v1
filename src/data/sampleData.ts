import type { User, Fund, LPInterest, QAEntry, FundSummary, CalendarEvent, AnalyticsData, FundDocument } from '../types';

export const sampleUsers: User[] = [
  {
    id: 'gp-1',
    email: 'gp@demo.com',
    password: 'password123',
    role: 'GP',
    name: 'James Chen',
    organization: 'Apex Capital Partners',
    createdAt: '2024-01-15T00:00:00Z',
  },
  {
    id: 'lp-1',
    email: 'lp@demo.com',
    password: 'password123',
    role: 'LP',
    name: 'Sarah Mitchell',
    organization: 'Pacific Endowment Fund',
    createdAt: '2024-02-01T00:00:00Z',
  },
  {
    id: 'lp-2',
    email: 'lp2@demo.com',
    password: 'password123',
    role: 'LP',
    name: 'David Park',
    organization: 'Horizon Family Office',
    createdAt: '2024-02-15T00:00:00Z',
  },
  {
    id: 'lp-3',
    email: 'lp3@demo.com',
    password: 'password123',
    role: 'LP',
    name: 'Emily Rodriguez',
    organization: 'CalPERS',
    createdAt: '2024-03-01T00:00:00Z',
  },
];

const sequoiaDocuments: FundDocument[] = [
  {
    id: 'doc-1',
    fundId: 'fund-1',
    fileName: 'Sequoia Capital Fund XXIII - PPM.pdf',
    fileType: 'PPM',
    uploadedBy: 'gp-1',
    uploadedAt: '2024-06-01T00:00:00Z',
    fileSize: 2500000,
    filePath: '/documents/sequoia-ppm.pdf',
    version: 1,
    accessibleTo: ['lp-1', 'lp-2', 'lp-3'],
    content: `PRIVATE PLACEMENT MEMORANDUM - Sequoia Capital Fund XXIII

FUND OVERVIEW
Sequoia Capital Fund XXIII ("the Fund") is a $2.0 billion venture capital fund focused on early-stage and growth-stage technology investments across North America. The Fund targets exceptional founders building category-defining technology companies.

INVESTMENT STRATEGY
The Fund will invest primarily in Series A through Series C rounds, with initial check sizes of $10-50 million. Target sectors include enterprise SaaS, artificial intelligence, fintech, and healthcare technology. The Fund maintains a concentrated portfolio approach with 25-35 investments per fund.

MANAGEMENT FEE STRUCTURE
Annual management fee of 2.0% on committed capital during the investment period (first 5 years), stepping down to 1.5% on invested capital thereafter. The management fee covers operational expenses, team compensation, and deal sourcing costs.

CARRIED INTEREST
20% carried interest over an 8% preferred return hurdle rate. The GP commits 2% of total fund size ($40 million) as co-investment alongside LPs.

FUND TERMS
Fund term: 10 years with two 1-year extensions. Investment period: 5 years. Minimum LP commitment: $10 million.

TEAM
The investment team comprises 12 partners with an average of 18 years of venture capital experience. Key partners include: Michael Moritz (Senior Partner, 25 years), Alfred Lin (Partner, 15 years), and Roelof Botha (Managing Partner, 20 years).

HISTORICAL PERFORMANCE
Fund XXI (2018 vintage): 32% Net IRR, 3.2x MOIC
Fund XXII (2020 vintage): 28% Net IRR, 2.5x MOIC (still actively investing)
Realized returns across all Sequoia funds: 25% average Net IRR since inception.

RISK FACTORS
1. Technology sector concentration risk
2. Early-stage investment risk with higher failure rates
3. Illiquidity risk with 10+ year fund terms
4. Market timing risk in technology cycles
5. Key person risk related to senior partners`
  },
  {
    id: 'doc-2',
    fundId: 'fund-1',
    fileName: 'Sequoia Capital - Track Record.pdf',
    fileType: 'Track Record',
    uploadedBy: 'gp-1',
    uploadedAt: '2024-06-01T00:00:00Z',
    fileSize: 1800000,
    filePath: '/documents/sequoia-track-record.pdf',
    version: 1,
    accessibleTo: ['lp-1', 'lp-2', 'lp-3'],
    content: `SEQUOIA CAPITAL - HISTORICAL TRACK RECORD

FUND PERFORMANCE SUMMARY

Fund XIX (2014 vintage):
- Net IRR: 35.2%
- MOIC: 4.1x
- DPI: 3.8x
- Notable investments: Stripe (Series A), DoorDash (Series B)

Fund XX (2016 vintage):
- Net IRR: 29.8%
- MOIC: 3.5x
- DPI: 2.9x
- Notable investments: Snowflake (Series B), Unity Technologies (Growth)

Fund XXI (2018 vintage):
- Net IRR: 32.0%
- MOIC: 3.2x
- DPI: 1.8x
- Notable investments: Figma (Series C), Notion (Series B)

Fund XXII (2020 vintage):
- Net IRR: 28.0%
- MOIC: 2.5x
- DPI: 0.8x (still actively investing)
- Notable investments: Arc (Series A), Harvey AI (Series A)

Q4 2023 PORTFOLIO PERFORMANCE:
Portfolio companies showed strong resilience in Q4 2023, with revenue growth averaging 45% YoY. 8 out of 12 portfolio companies in Fund XXII exceeded revenue targets. The AI/ML portfolio segment saw exceptional growth of 120% YoY.

TOP QUARTILE PERFORMANCE:
Sequoia has consistently delivered top-quartile returns across 8 consecutive fund vintages. The firm's strategy of concentrated, conviction-driven investing has generated significant alpha relative to the VC benchmark.`
  },
  {
    id: 'doc-3',
    fundId: 'fund-1',
    fileName: 'Sequoia Capital - DDQ Responses.pdf',
    fileType: 'DDQ',
    uploadedBy: 'gp-1',
    uploadedAt: '2024-06-15T00:00:00Z',
    fileSize: 3200000,
    filePath: '/documents/sequoia-ddq.pdf',
    version: 1,
    accessibleTo: ['lp-1', 'lp-2'],
    content: `DUE DILIGENCE QUESTIONNAIRE - Sequoia Capital Fund XXIII

1. FIRM OVERVIEW
Sequoia Capital was founded in 1972 and manages over $85 billion in assets across venture capital, growth equity, and public market strategies. The firm operates from offices in Menlo Park, London, Singapore, and Mumbai.

2. INVESTMENT PROCESS
Deal sourcing: Proprietary network of 500+ founders, accelerators, and co-investors. Evaluate 3,000+ companies annually, invest in <1%.
Due diligence: 4-8 week process including market analysis, customer references, technical assessment, and financial modeling.
Investment committee: Unanimous consent required from 3-person deal team plus Managing Partner approval.

3. PORTFOLIO CONSTRUCTION
Target: 25-35 investments per fund
Initial check: $10-50M
Reserve ratio: 60% of fund for follow-on investments
Sector allocation: AI/ML (30%), Enterprise SaaS (25%), Fintech (20%), Healthcare (15%), Other (10%)

4. ESG INTEGRATION
Sequoia integrates ESG factors into investment decisions. All portfolio companies complete annual ESG assessments. The firm publishes an annual impact report.

5. KEY PERSON PROVISIONS
Key persons: Roelof Botha, Alfred Lin, Pat Grady
Trigger: Departure of any 2 key persons suspends investment period
Cure period: 90 days to identify replacement approved by LPAC

6. FUND EXPENSES
Management fee: 2.0% (investment period), 1.5% (post-investment)
Organizational expenses: Capped at $2M
Broken deal costs: Borne by the fund, capped at $500K per deal
Annual audit: KPMG`
  },
  {
    id: 'doc-4',
    fundId: 'fund-1',
    fileName: 'Sequoia Capital - Q3 2024 Quarterly Letter.pdf',
    fileType: 'Quarterly Letter',
    uploadedBy: 'gp-1',
    uploadedAt: '2024-10-15T00:00:00Z',
    fileSize: 1500000,
    filePath: '/documents/sequoia-quarterly.pdf',
    version: 1,
    accessibleTo: ['lp-1', 'lp-2', 'lp-3'],
    content: `SEQUOIA CAPITAL FUND XXIII - Q3 2024 QUARTERLY LETTER

Dear Limited Partners,

PORTFOLIO UPDATE
Fund XXIII has deployed $680M across 12 investments as of September 30, 2024. The portfolio is performing well with a gross IRR of 18.5% and gross MOIC of 1.3x.

KEY HIGHLIGHTS:
1. New Investment: Led $40M Series B in NeuralPath AI (autonomous coding platform)
2. Follow-on: $25M Series C in DataForge (enterprise data infrastructure)
3. Markup: QuantumSec received a 3x markup following Series C at $2B valuation

MARKET ENVIRONMENT
The AI investment landscape remains highly active. We are seeing exceptional founder quality and larger market opportunities than previous technology cycles. Enterprise AI adoption is accelerating, with our portfolio companies reporting 150% average ARR growth.

FUND METRICS:
- Investments made: 12 of target 30
- Capital deployed: $680M of $2B (34%)
- Remaining dry powder: $1.32B
- Average check size: $56.7M
- Gross IRR: 18.5%
- Gross MOIC: 1.3x

OUTLOOK
We expect to deploy an additional $200-300M in Q4 2024, with a focus on AI infrastructure and vertical AI applications. The pipeline includes 5 companies in advanced due diligence.

Best regards,
Roelof Botha, Managing Partner`
  }
];

const apolloDocuments: FundDocument[] = [
  {
    id: 'doc-5',
    fundId: 'fund-2',
    fileName: 'Apollo Credit Opportunities IV - PPM.pdf',
    fileType: 'PPM',
    uploadedBy: 'gp-1',
    uploadedAt: '2024-05-01T00:00:00Z',
    fileSize: 3500000,
    filePath: '/documents/apollo-ppm.pdf',
    version: 1,
    accessibleTo: ['lp-1', 'lp-2', 'lp-3'],
    content: `PRIVATE PLACEMENT MEMORANDUM - Apollo Credit Opportunities Fund IV

FUND OVERVIEW
Apollo Credit Opportunities Fund IV ("the Fund") is a $5.0 billion credit-focused fund targeting opportunistic and distressed credit investments across North America and Europe. The Fund seeks to capitalize on market dislocations and stressed/distressed situations.

INVESTMENT STRATEGY
Primary strategies: (1) Distressed debt acquisition at discount, (2) Rescue financing for companies undergoing restructuring, (3) Direct lending to middle-market companies, (4) Structured credit opportunities.
Target returns: 12-15% net IRR with 1.5-2.0x net MOIC.

MANAGEMENT FEE
1.5% annual management fee on committed capital during the 4-year investment period, reducing to 1.0% on invested capital thereafter.

CARRIED INTEREST
20% carried interest above a 7% preferred return. GP commitment: 5% of fund ($250 million), demonstrating strong alignment.

TEAM
35 investment professionals with deep credit and restructuring expertise. Average tenure at Apollo: 11 years. Led by Senior Partners with combined 100+ years of distressed investing experience.

HISTORICAL PERFORMANCE
Credit Opportunities I (2012): 18.5% Net IRR, 2.1x MOIC (Fully Realized)
Credit Opportunities II (2016): 15.2% Net IRR, 1.8x MOIC (Partially Realized)
Credit Opportunities III (2019): 13.8% Net IRR, 1.6x MOIC (Active)

RISK FACTORS
1. Credit risk: default and recovery risk in distressed situations
2. Macro risk: interest rate and economic cycle sensitivity
3. Liquidity risk: lock-up period and limited secondary market
4. Concentration risk: large positions in individual credits
5. Legal/regulatory risk in restructuring processes`
  },
  {
    id: 'doc-6',
    fundId: 'fund-2',
    fileName: 'Apollo Credit - Track Record.pdf',
    fileType: 'Track Record',
    uploadedBy: 'gp-1',
    uploadedAt: '2024-05-01T00:00:00Z',
    fileSize: 2100000,
    filePath: '/documents/apollo-track-record.pdf',
    version: 1,
    accessibleTo: ['lp-1', 'lp-2', 'lp-3'],
    content: `APOLLO CREDIT OPPORTUNITIES - TRACK RECORD

FUND PERFORMANCE DETAIL

Credit Opportunities I (2012 vintage, $2.5B):
- Invested: $2.4B across 45 investments
- Realized: $5.0B in total distributions
- Net IRR: 18.5%, Net MOIC: 2.1x
- Key deals: Restructuring of Caesars Entertainment (3.5x), Momentive Performance Materials (2.8x)

Credit Opportunities II (2016 vintage, $3.5B):
- Invested: $3.2B across 52 investments
- Realized to date: $4.8B (with $1.5B remaining NAV)
- Net IRR: 15.2%, Net MOIC: 1.8x
- Key deals: Hertz restructuring (2.5x), Energy sector workout portfolio (2.2x)

Credit Opportunities III (2019 vintage, $4.0B):
- Invested: $3.8B across 38 investments
- Current NAV: $5.2B, Distributed: $1.2B
- Net IRR: 13.8%, Net MOIC: 1.6x
- Key deals: COVID-impacted travel sector (performing well), Healthcare direct lending portfolio

LOSS RATIO
Historical loss ratio of 2.3% across all Credit Opportunities funds, well below industry average of 5.1%.

MARKET CYCLE PERFORMANCE
Apollo's credit platform has demonstrated the ability to generate strong returns across market cycles, with particular outperformance during periods of market stress (2012-2013, 2020).`
  }
];

const blackstoneDocuments: FundDocument[] = [
  {
    id: 'doc-7',
    fundId: 'fund-3',
    fileName: 'Blackstone Real Estate Partners X - PPM.pdf',
    fileType: 'PPM',
    uploadedBy: 'gp-1',
    uploadedAt: '2024-04-01T00:00:00Z',
    fileSize: 4200000,
    filePath: '/documents/blackstone-ppm.pdf',
    version: 1,
    accessibleTo: ['lp-1', 'lp-3'],
    content: `PRIVATE PLACEMENT MEMORANDUM - Blackstone Real Estate Partners X

FUND OVERVIEW
Blackstone Real Estate Partners X ("BREP X") is a $20.0 billion global real estate private equity fund. The Fund targets high-quality assets across major property types and geographies, focusing on value creation through operational improvements and strategic repositioning.

INVESTMENT STRATEGY
Core-plus and opportunistic real estate investments globally. Target sectors: logistics/industrial (35%), residential (25%), life sciences (20%), hospitality (10%), office repositioning (10%).
Target returns: 15-20% gross IRR, 11-14% net IRR, 1.8-2.2x net MOIC.

MANAGEMENT FEE
1.25% annual management fee on committed capital. This represents a reduction from the 1.5% fee in prior funds, reflecting the firm's commitment to LP alignment at scale.

CARRIED INTEREST
20% carried interest above an 8% preferred return with catch-up provision. Clawback guarantee provided by the GP.

TEAM
Over 200 real estate professionals across 12 global offices. Blackstone Real Estate is the largest institutional real estate investor globally with $325B+ in AUM.

FUND IX PERFORMANCE (predecessor):
- Fund IX (2019, $20.5B): 16.2% Net IRR, 1.7x Net MOIC as of Q3 2024
- Notable investments: Logistics portfolio acquisition ($4.5B), Major residential platform

RISK FACTORS
1. Interest rate sensitivity affecting property valuations
2. Geographic and political risk in global investments
3. Construction and development risk
4. Tenant credit and occupancy risk
5. Currency risk on non-USD investments`
  }
];

const firstmarkDocuments: FundDocument[] = [
  {
    id: 'doc-8',
    fundId: 'fund-4',
    fileName: 'FirstMark Capital Fund V - PPM.pdf',
    fileType: 'PPM',
    uploadedBy: 'gp-1',
    uploadedAt: '2024-07-01T00:00:00Z',
    fileSize: 1900000,
    filePath: '/documents/firstmark-ppm.pdf',
    version: 1,
    accessibleTo: ['lp-1', 'lp-2'],
    content: `PRIVATE PLACEMENT MEMORANDUM - FirstMark Capital Fund V

FUND OVERVIEW
FirstMark Capital Fund V is a $500 million early-stage venture capital fund focused on B2B SaaS, infrastructure software, and applied AI companies in New York City and the broader US market.

INVESTMENT STRATEGY
Lead or co-lead Seed and Series A rounds with initial checks of $3-15M. The Fund leverages FirstMark's deep NYC network and operational expertise to support founders. Target portfolio: 20-25 companies.

MANAGEMENT FEE
2.5% annual management fee on committed capital during the 4-year investment period, reducing to 2.0% on invested capital thereafter.

CARRIED INTEREST
20% carried interest above a 0% preferred return (no hurdle). European-style waterfall with whole-fund carry calculation.

TEAM
6 partners, 4 principals, 8 support staff. The team has deep operating experience with backgrounds at companies like Google, Salesforce, and MongoDB.

HISTORICAL PERFORMANCE
Fund III (2018): 42% Net IRR, 3.8x MOIC
Fund IV (2021): 22% Net IRR, 1.9x MOIC (early)
Notable exits: Shopify (IPO), Discord (growth), Pinterest (IPO), Airbnb (early investor)

The Fund hosts the annual FirstMark CTO Summit, connecting portfolio CTOs with enterprise buyers and talent.

MINIMUM INVESTMENT: $5 million

RISK FACTORS
1. Early-stage concentration with higher loss rates
2. NYC market dependency
3. B2B SaaS market competition and compression
4. Smaller fund size limits diversification`
  }
];

export const sampleFunds: Fund[] = [
  {
    id: 'fund-1',
    gpId: 'gp-1',
    name: 'Sequoia Capital Fund XXIII',
    strategy: 'VC',
    targetSize: 2000000000,
    currentSize: 680000000,
    minimumInvestment: 10000000,
    geography: 'North America',
    vintageYear: 2024,
    description: 'Early-stage and growth-stage technology investments targeting category-defining companies in AI, enterprise SaaS, fintech, and healthcare technology.',
    managementFee: '2.0%',
    carry: '20%',
    irr: '28% (Fund XXII)',
    moic: '2.5x (Fund XXII)',
    closingSchedule: {
      firstClose: '2024-09-01',
      interimClose: '2025-01-15',
      finalClose: '2025-06-30',
    },
    status: 'Open',
    documents: sequoiaDocuments,
    teamSize: 12,
    createdAt: '2024-06-01T00:00:00Z',
  },
  {
    id: 'fund-2',
    gpId: 'gp-1',
    name: 'Apollo Credit Opportunities IV',
    strategy: 'Credit',
    targetSize: 5000000000,
    currentSize: 3200000000,
    minimumInvestment: 25000000,
    geography: 'North America & Europe',
    vintageYear: 2024,
    description: 'Opportunistic and distressed credit investments targeting market dislocations, rescue financing, direct lending, and structured credit opportunities.',
    managementFee: '1.5%',
    carry: '20%',
    irr: '15.2% (Fund II)',
    moic: '1.8x (Fund II)',
    closingSchedule: {
      firstClose: '2024-07-01',
      interimClose: '2024-12-01',
      finalClose: '2025-03-31',
    },
    status: 'Open',
    documents: apolloDocuments,
    teamSize: 35,
    createdAt: '2024-05-01T00:00:00Z',
  },
  {
    id: 'fund-3',
    gpId: 'gp-1',
    name: 'Blackstone Real Estate Partners X',
    strategy: 'Real Estate',
    targetSize: 20000000000,
    currentSize: 15500000000,
    minimumInvestment: 50000000,
    geography: 'Global',
    vintageYear: 2024,
    description: 'Global real estate private equity fund targeting high-quality assets in logistics, residential, life sciences, hospitality, and office repositioning.',
    managementFee: '1.25%',
    carry: '20%',
    irr: '16.2% (Fund IX)',
    moic: '1.7x (Fund IX)',
    closingSchedule: {
      firstClose: '2024-06-01',
      finalClose: '2025-09-30',
    },
    status: 'Open',
    documents: blackstoneDocuments,
    teamSize: 200,
    createdAt: '2024-04-01T00:00:00Z',
  },
  {
    id: 'fund-4',
    gpId: 'gp-1',
    name: 'FirstMark Capital Fund V',
    strategy: 'VC',
    targetSize: 500000000,
    currentSize: 220000000,
    minimumInvestment: 5000000,
    geography: 'United States',
    vintageYear: 2024,
    description: 'Early-stage venture capital fund focused on B2B SaaS, infrastructure software, and applied AI companies leveraging NYC network and operational expertise.',
    managementFee: '2.5%',
    carry: '20%',
    irr: '42% (Fund III)',
    moic: '3.8x (Fund III)',
    closingSchedule: {
      firstClose: '2024-10-01',
      finalClose: '2025-04-30',
    },
    status: 'Open',
    documents: firstmarkDocuments,
    teamSize: 18,
    createdAt: '2024-07-01T00:00:00Z',
  },
];

export const samplePipeline: LPInterest[] = [
  {
    id: 'pipe-1', fundId: 'fund-1', lpId: 'lp-1', gpId: 'gp-1',
    lpName: 'Sarah Mitchell', lpOrganization: 'Pacific Endowment Fund',
    status: 'Under Review', allocationRequested: 50000000,
    notes: 'Very interested in AI thesis. Requested follow-up call.', lastUpdated: '2024-11-01T00:00:00Z',
  },
  {
    id: 'pipe-2', fundId: 'fund-1', lpId: 'lp-2', gpId: 'gp-1',
    lpName: 'David Park', lpOrganization: 'Horizon Family Office',
    status: 'Soft Circle', allocationRequested: 25000000,
    notes: 'Verbal commitment pending IC approval.', lastUpdated: '2024-11-15T00:00:00Z',
  },
  {
    id: 'pipe-3', fundId: 'fund-1', lpId: 'lp-3', gpId: 'gp-1',
    lpName: 'Emily Rodriguez', lpOrganization: 'CalPERS',
    status: 'Committed', allocationRequested: 100000000,
    notes: 'Signed subscription agreement. Wire pending.', lastUpdated: '2024-12-01T00:00:00Z',
  },
  {
    id: 'pipe-4', fundId: 'fund-2', lpId: 'lp-1', gpId: 'gp-1',
    lpName: 'Sarah Mitchell', lpOrganization: 'Pacific Endowment Fund',
    status: 'Inquired', allocationRequested: 100000000,
    notes: 'Initial meeting scheduled for next week.', lastUpdated: '2024-10-20T00:00:00Z',
  },
  {
    id: 'pipe-5', fundId: 'fund-2', lpId: 'lp-3', gpId: 'gp-1',
    lpName: 'Emily Rodriguez', lpOrganization: 'CalPERS',
    status: 'Committed', allocationRequested: 250000000,
    notes: 'Committed at first close.', lastUpdated: '2024-07-15T00:00:00Z',
  },
  {
    id: 'pipe-6', fundId: 'fund-3', lpId: 'lp-2', gpId: 'gp-1',
    lpName: 'David Park', lpOrganization: 'Horizon Family Office',
    status: 'Inquired', allocationRequested: 75000000,
    notes: 'Interested but needs more detail on logistics portfolio.', lastUpdated: '2024-11-10T00:00:00Z',
  },
  {
    id: 'pipe-7', fundId: 'fund-4', lpId: 'lp-1', gpId: 'gp-1',
    lpName: 'Sarah Mitchell', lpOrganization: 'Pacific Endowment Fund',
    status: 'Under Review', allocationRequested: 15000000,
    notes: 'Reviewing track record. Requested DDQ.', lastUpdated: '2024-11-20T00:00:00Z',
  },
  {
    id: 'pipe-8', fundId: 'fund-4', lpId: 'lp-2', gpId: 'gp-1',
    lpName: 'David Park', lpOrganization: 'Horizon Family Office',
    status: 'Passed', allocationRequested: 0,
    notes: 'Too small for portfolio allocation requirements.', lastUpdated: '2024-10-25T00:00:00Z',
  },
];

export const sampleQAHistory: QAEntry[] = [
  {
    id: 'qa-1', fundId: 'fund-1', lpId: 'lp-1',
    question: 'What is the management fee structure?',
    answer: 'Sequoia Capital Fund XXIII charges an annual management fee of 2.0% on committed capital during the investment period (first 5 years), stepping down to 1.5% on invested capital thereafter. The management fee covers operational expenses, team compensation, and deal sourcing costs.',
    sources: [{ documentId: 'doc-1', documentName: 'Sequoia Capital Fund XXIII - PPM.pdf', pageNumber: 4, excerpt: 'Annual management fee of 2.0% on committed capital during the investment period (first 5 years), stepping down to 1.5% on invested capital thereafter.' }],
    confidence: 0.97, timestamp: '2024-11-15T10:30:00Z',
  },
  {
    id: 'qa-2', fundId: 'fund-1', lpId: 'lp-1',
    question: 'How did Fund XXI perform?',
    answer: 'Fund XXI (2018 vintage) generated a Net IRR of 32.0% and a MOIC of 3.2x, with a DPI of 1.8x. Notable investments include Figma (Series C) and Notion (Series B). This represents strong top-quartile performance.',
    sources: [{ documentId: 'doc-2', documentName: 'Sequoia Capital - Track Record.pdf', pageNumber: 3, excerpt: 'Fund XXI (2018 vintage): Net IRR: 32.0%, MOIC: 3.2x, DPI: 1.8x. Notable investments: Figma (Series C), Notion (Series B)' }],
    confidence: 0.95, timestamp: '2024-11-15T10:35:00Z',
  },
  {
    id: 'qa-3', fundId: 'fund-1', lpId: 'lp-1',
    question: 'What is the key person provision?',
    answer: 'The key persons for Fund XXIII are Roelof Botha, Alfred Lin, and Pat Grady. If any 2 of the 3 key persons depart, the investment period is suspended. There is a 90-day cure period to identify a replacement approved by the LPAC.',
    sources: [{ documentId: 'doc-3', documentName: 'Sequoia Capital - DDQ Responses.pdf', pageNumber: 8, excerpt: 'Key persons: Roelof Botha, Alfred Lin, Pat Grady. Trigger: Departure of any 2 key persons suspends investment period. Cure period: 90 days.' }],
    confidence: 0.96, timestamp: '2024-11-16T14:20:00Z',
  },
  {
    id: 'qa-4', fundId: 'fund-1', lpId: 'lp-1',
    question: 'How did portfolio companies perform during Q3 2024?',
    answer: 'As of Q3 2024, Fund XXIII has deployed $680M across 12 investments with a gross IRR of 18.5% and gross MOIC of 1.3x. Key highlights include a new $40M Series B investment in NeuralPath AI, a follow-on in DataForge, and a 3x markup for QuantumSec following its Series C at a $2B valuation.',
    sources: [{ documentId: 'doc-4', documentName: 'Sequoia Capital - Q3 2024 Quarterly Letter.pdf', pageNumber: 1, excerpt: 'Fund XXIII has deployed $680M across 12 investments with gross IRR of 18.5% and gross MOIC of 1.3x.' }],
    confidence: 0.94, timestamp: '2024-11-20T09:15:00Z',
  },
];

export const sampleSummaries: Record<string, FundSummary> = {
  'fund-1': {
    executiveBrief: 'Sequoia Capital Fund XXIII is a $2.0B venture capital fund targeting early-stage and growth-stage technology companies across North America. Led by a world-class team of 12 partners with an average of 18 years of experience, the fund focuses on AI, enterprise SaaS, fintech, and healthcare technology. Sequoia has consistently delivered top-quartile returns across 8 consecutive fund vintages, with the most recent fully deployed fund (Fund XXI) generating 32% Net IRR and 3.2x MOIC. The fund has already deployed $680M across 12 investments with strong early performance metrics.',
    keyTerms: {
      managementFee: '2.0% on committed capital (investment period), 1.5% on invested capital (post-investment)',
      carry: '20% over 8% preferred return',
      minimumInvestment: '$10 million',
      term: '10 years + two 1-year extensions',
      targetSize: '$2.0 billion',
    },
    trackRecordHighlights: [
      'Fund XXI (2018): 32% Net IRR, 3.2x MOIC - notable investments in Figma and Notion',
      'Fund XX (2016): 29.8% Net IRR, 3.5x MOIC - Snowflake and Unity Technologies',
      'Fund XIX (2014): 35.2% Net IRR, 4.1x MOIC - Stripe and DoorDash',
      'Consistent top-quartile performance across 8 consecutive fund vintages',
      '25% average Net IRR since inception across all Sequoia funds',
    ],
    riskFactors: [
      'Technology sector concentration risk',
      'Early-stage investment risk with higher failure rates',
      'Illiquidity risk with 10+ year fund terms',
      'Market timing risk in technology cycles',
      'Key person risk related to senior partners (Botha, Lin, Grady)',
    ],
  },
  'fund-2': {
    executiveBrief: 'Apollo Credit Opportunities Fund IV is a $5.0B credit-focused fund targeting opportunistic and distressed credit investments across North America and Europe. With a team of 35 experienced professionals, the fund capitalizes on market dislocations through distressed debt, rescue financing, direct lending, and structured credit. Apollo\'s credit platform has a strong track record with a historical loss ratio of just 2.3% (vs. industry average of 5.1%).',
    keyTerms: {
      managementFee: '1.5% on committed capital (investment period), 1.0% on invested capital (post-investment)',
      carry: '20% over 7% preferred return',
      minimumInvestment: '$25 million',
      term: '8 years + two 1-year extensions',
      targetSize: '$5.0 billion',
    },
    trackRecordHighlights: [
      'Credit Opportunities I (2012): 18.5% Net IRR, 2.1x MOIC - fully realized',
      'Credit Opportunities II (2016): 15.2% Net IRR, 1.8x MOIC',
      'Credit Opportunities III (2019): 13.8% Net IRR, 1.6x MOIC - active',
      'Historical loss ratio of 2.3% vs. industry average of 5.1%',
      'Strong performance during market stress periods (2012-13, 2020)',
    ],
    riskFactors: [
      'Credit risk: default and recovery risk in distressed situations',
      'Macro risk: interest rate and economic cycle sensitivity',
      'Liquidity risk: lock-up period and limited secondary market',
      'Concentration risk: large positions in individual credits',
      'Legal/regulatory risk in restructuring processes',
    ],
  },
  'fund-3': {
    executiveBrief: 'Blackstone Real Estate Partners X (BREP X) is a $20.0B global real estate PE fund, the largest in the series. Targeting logistics, residential, life sciences, hospitality, and office repositioning, the fund leverages Blackstone\'s position as the world\'s largest institutional real estate investor with $325B+ in AUM and 200+ professionals across 12 global offices.',
    keyTerms: {
      managementFee: '1.25% on committed capital (reduced from 1.5% in prior funds)',
      carry: '20% over 8% preferred return with clawback',
      minimumInvestment: '$50 million',
      term: '10 years + two 1-year extensions',
      targetSize: '$20.0 billion',
    },
    trackRecordHighlights: [
      'BREP IX (2019): 16.2% Net IRR, 1.7x Net MOIC',
      'Largest institutional real estate investor globally ($325B+ AUM)',
      'Reduced management fee to 1.25% demonstrating LP alignment',
      'Strong logistics/industrial portfolio performance',
    ],
    riskFactors: [
      'Interest rate sensitivity affecting property valuations',
      'Geographic and political risk in global investments',
      'Construction and development risk',
      'Tenant credit and occupancy risk',
      'Currency risk on non-USD investments',
    ],
  },
  'fund-4': {
    executiveBrief: 'FirstMark Capital Fund V is a $500M early-stage VC fund focused on B2B SaaS, infrastructure software, and applied AI in NYC. With a lean team of 6 partners featuring deep operating backgrounds, FirstMark has generated exceptional returns including 42% Net IRR and 3.8x MOIC from Fund III. The firm\'s CTO Summit and NYC network provide unique deal sourcing advantages.',
    keyTerms: {
      managementFee: '2.5% on committed capital (investment period), 2.0% on invested capital (post-investment)',
      carry: '20% with no preferred return (European-style waterfall)',
      minimumInvestment: '$5 million',
      term: '10 years',
      targetSize: '$500 million',
    },
    trackRecordHighlights: [
      'Fund III (2018): 42% Net IRR, 3.8x MOIC - exceptional performance',
      'Fund IV (2021): 22% Net IRR, 1.9x MOIC (early)',
      'Notable exits: Shopify, Discord, Pinterest, Airbnb',
      'Annual CTO Summit connecting portfolio with enterprise buyers',
    ],
    riskFactors: [
      'Early-stage concentration with higher loss rates',
      'NYC market dependency',
      'B2B SaaS market competition and compression',
      'Smaller fund size limits diversification',
    ],
  },
};

export const sampleCalendarEvents: CalendarEvent[] = [
  { id: 'cal-1', fundId: 'fund-1', fundName: 'Sequoia Capital Fund XXIII', gpName: 'Sequoia Capital', strategy: 'VC', geography: 'North America', eventType: 'Interim Close', date: '2025-01-15', targetSize: 2000000000 },
  { id: 'cal-2', fundId: 'fund-2', fundName: 'Apollo Credit Opportunities IV', gpName: 'Apollo Global', strategy: 'Credit', geography: 'North America & Europe', eventType: 'Final Close', date: '2025-03-31', targetSize: 5000000000 },
  { id: 'cal-3', fundId: 'fund-1', fundName: 'Sequoia Capital Fund XXIII', gpName: 'Sequoia Capital', strategy: 'VC', geography: 'North America', eventType: 'Final Close', date: '2025-06-30', targetSize: 2000000000 },
  { id: 'cal-4', fundId: 'fund-4', fundName: 'FirstMark Capital Fund V', gpName: 'FirstMark Capital', strategy: 'VC', geography: 'United States', eventType: 'Final Close', date: '2025-04-30', targetSize: 500000000 },
  { id: 'cal-5', fundId: 'fund-3', fundName: 'Blackstone Real Estate Partners X', gpName: 'Blackstone', strategy: 'Real Estate', geography: 'Global', eventType: 'Final Close', date: '2025-09-30', targetSize: 20000000000 },
  { id: 'cal-6', fundId: 'fund-3', fundName: 'Blackstone Real Estate Partners X', gpName: 'Blackstone', strategy: 'Real Estate', geography: 'Global', eventType: 'Interim Close', date: '2025-03-15', targetSize: 20000000000 },
];

export const sampleAnalytics: AnalyticsData = {
  documentViews: [
    { documentName: 'Sequoia - PPM', views: 145, uniqueViewers: 12 },
    { documentName: 'Sequoia - Track Record', views: 132, uniqueViewers: 11 },
    { documentName: 'Apollo - PPM', views: 98, uniqueViewers: 8 },
    { documentName: 'Sequoia - DDQ', views: 87, uniqueViewers: 7 },
    { documentName: 'Sequoia - Q3 Quarterly', views: 76, uniqueViewers: 9 },
    { documentName: 'Blackstone - PPM', views: 65, uniqueViewers: 6 },
  ],
  lpEngagement: [
    { lpName: 'Sarah Mitchell', timeSpent: 245, questionsAsked: 18, documentsViewed: 8 },
    { lpName: 'David Park', timeSpent: 180, questionsAsked: 12, documentsViewed: 6 },
    { lpName: 'Emily Rodriguez', timeSpent: 310, questionsAsked: 24, documentsViewed: 11 },
  ],
  fundraisingProgress: {
    target: 2000000000,
    committed: 680000000,
    softCircle: 250000000,
    pipeline: 450000000,
  },
  commonQuestions: [
    { question: 'What is the management fee structure?', frequency: 24 },
    { question: 'What is the historical track record?', frequency: 21 },
    { question: 'Who are the key persons?', frequency: 18 },
    { question: 'What is the investment strategy?', frequency: 16 },
    { question: 'What are the fund terms?', frequency: 14 },
    { question: 'How did the portfolio perform last quarter?', frequency: 12 },
  ],
  weeklyActivity: [
    { week: 'Oct 7', views: 45, questions: 8 },
    { week: 'Oct 14', views: 62, questions: 12 },
    { week: 'Oct 21', views: 58, questions: 10 },
    { week: 'Oct 28', views: 71, questions: 15 },
    { week: 'Nov 4', views: 89, questions: 18 },
    { week: 'Nov 11', views: 95, questions: 22 },
    { week: 'Nov 18', views: 110, questions: 28 },
    { week: 'Nov 25', views: 88, questions: 20 },
  ],
};
