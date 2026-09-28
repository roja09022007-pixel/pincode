# PostalAI — Intelligent Postal Address & PIN Verification System

PostalAI is a modern, responsive web application designed to solve the critical logistical and postal dispatch problem of incorrect PIN codes and misidentified delivery post offices.

---

## 1. How the Project Works

PostalAI decouples address verification into four auditable, modular layers:

1. **AI & Heuristic Address Parser (`addressParser.ts`)**:
   Deconstructs structured forms or raw address blocks into semantic components: House/Premises, Street, Locality, City/Taluk, District, State, and 6-digit Indian PIN codes.
2. **Postal Data Service (`postalService.ts`)**:
   Queries postal records by PIN code or locality keywords to retrieve delivery office hierarchy (Head Office `H.O`, Sub Office `S.O`, Branch Office `B.O`, or General Post Office `G.P.O`).
3. **Verification Engine (`verificationService.ts`)**:
   Executes progressive 6-stage verification:
   - **Step 1:** Parsing address
   - **Step 2:** Identifying locality
   - **Step 3:** Checking PIN information
   - **Step 4:** Identifying delivery post office
   - **Step 5:** Comparing address and postal data
   - **Step 6:** Generating verification result
   Detects geographic mismatches (e.g. entering Lawsons Bay PIN `530018` for MVP Colony which is served by `530017`), flags ambiguous localities (`NEEDS REVIEW`), and issues verified delivery certificates (`VERIFIED`).
4. **AI Agent & n8n Orchestrator (`agentService.ts`)**:
   Operates as a tool-using agent coordinator. Can dispatch payloads to an external n8n AI webhook or fall back seamlessly to the offline verification engine.

---

## 2. Folder Structure

```text
/
├── .env.example                     # Environment configuration template
├── index.html                       # HTML entry point with synchronized SEO meta
├── package.json                     # Dependencies and build scripts
├── vite.config.ts                   # Vite build configuration with Tailwind CSS v4
├── tsconfig.json                    # TypeScript strict compiler configuration
└── src/
    ├── main.tsx                     # React application entry point
    ├── App.tsx                      # Root application layout and navigation router
    ├── index.css                    # Tailwind CSS v4 directives and typography
    ├── types/
    │   └── postal.ts                # TypeScript interfaces for addresses, results, and stats
    ├── data/
    │   ├── demoPostalRecords.ts     # Curated Indian postal records across major circles
    │   └── demoPresets.ts           # Workshop test scenarios (Verified, Mismatch, Review)
    ├── services/
    │   ├── addressParser.ts         # Multi-entity tokenization and state recognizer
    │   ├── postalService.ts         # Abstracted postal data access layer with API hook
    │   ├── verificationService.ts   # 6-stage verification rules and explanation builder
    │   ├── agentService.ts          # n8n webhook dispatcher and AI tool caller
    │   └── storageService.ts        # Browser localStorage persistence and activity metrics
    └── components/
        ├── common/
        │   ├── StatusBadge.tsx      # VERIFIED / NEEDS REVIEW / MISMATCH status badge
        │   ├── ConfidenceBadge.tsx  # High / Medium / Low verification confidence
        │   └── DemoModeBanner.tsx   # Persistent demo data mode indicator
        ├── layout/
        │   ├── Header.tsx           # Global app header with operator identity
        │   ├── Sidebar.tsx          # Responsive navigation sidebar & drawer
        │   └── PrivacyBanner.tsx    # Data privacy and non-retention notification
        ├── dashboard/
        │   ├── DashboardOverview.tsx # KPI summary cards, quick presets, and audit table
        │   └── ActivityChart.tsx    # Stacked 7-day verification activity chart
        ├── verify/
        │   ├── VerifyForm.tsx       # Standardized fields & raw auto-parse form
        │   ├── ProcessingSteps.tsx  # Progressive 6-stage verification step visualizer
        │   ├── ResultCard.tsx       # Audit outcome card with reasons and suggestions
        │   ├── AddressBreakdown.tsx # AI-parsed entity cards
        │   └── ResultDetailModal.tsx # Full-screen inspection modal
        ├── bulk/
        │   └── BulkVerification.tsx # CSV upload, batch runner, and result exporter
        ├── history/
        │   └── VerificationHistory.tsx # Audit log with search, filters, and CSV export
        └── about/
            └── AboutPage.tsx        # System architecture, agent workflow, and n8n guide
```

---

## 3. How to Run Locally

### Prerequisites
- Node.js 18+ or 20+
- npm or yarn

### Steps
```bash
# 1. Install dependencies
npm install

# 2. Start the local development server (port 3000)
npm run dev

# 3. Open in your browser
http://localhost:3000
```

---

## 4. Environment Variables

Create a `.env` file in the root directory:

```env
# Optional: External n8n webhook URL for AI workflow execution
# If omitted or empty, the app runs offline using the high-fidelity local engine
VITE_N8N_WEBHOOK_URL=""
```

---

## 5. n8n AI Chatbot & Webhook Integration

The application includes a real-time **PostalAI Assistant Chatbot** powered by your n8n AI Cloud webhook:

- **Webhook Endpoint:**
  `https://roja0902.app.n8n.cloud/webhook/dd564b0c-2213-4c63-aed9-40d2a9338199/chat`

- **Features in the UI:**
  - Floating chat bubble in the bottom-right corner with live indicator.
  - Header **"AI Chat"** quick-access button.
  - Sidebar **"n8n AI Chatbot"** item.
  - Session persistence across messages.
  - Quick postal prompt chips (*Check MVP Colony PIN*, *Why 530018 is Mismatch*, *Indiranagar Post Office*).
  - Contextual fallback engine providing accurate postal details if the n8n webhook workflow is temporarily paused or in test mode.

- **Payload Dispatched to n8n:**
  ```json
  {
    "chatInput": "What is the correct PIN code for MVP Colony in Visakhapatnam?",
    "message": "What is the correct PIN code for MVP Colony in Visakhapatnam?",
    "sessionId": "session-1727512800000-xyz",
    "timestamp": "2026-09-28T09:40:00.000Z"
  }
  ```

---

## 6. How to Replace Demo Postal Data with a Real Postal API

All postal queries are centralized in `src/services/postalService.ts`.

To switch from the local offline dataset to live data:
1. Open `src/services/postalService.ts`.
2. Locate the `getByPincode` method.
3. Uncomment the API call hook:
   ```typescript
   async getByPincode(pincode: string): Promise<PostalOfficeRecord[]> {
     // Switch from demo records to live API:
     return this.getPostalDataFromAPI(pincode);
   }
   ```
4. You can point `getPostalDataFromAPI` to the **data.gov.in All India Pincode Directory API** or your internal enterprise postal database.
5. No changes to the UI components or verification rules are required.

---

## 7. How to Deploy to Vercel

### Option 1: Vercel CLI
```bash
npm install -g vercel
vercel
```

### Option 2: GitHub Integration
1. Push this repository to GitHub.
2. In the [Vercel Dashboard](https://vercel.com), click **Add New Project** and select the repository.
3. Framework Preset: **Vite**
4. Build Command: `npm run build`
5. Output Directory: `dist`
6. (Optional) Set `VITE_N8N_WEBHOOK_URL` under Environment Variables.
7. Click **Deploy**.
