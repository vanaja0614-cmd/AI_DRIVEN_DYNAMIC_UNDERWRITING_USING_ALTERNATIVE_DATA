# TrustFlow AI — Frontend

React + Vite + Tailwind frontend for the TrustFlow AI underwriting engine.

## Setup

```bash
cd frontend
npm install
npm run dev
```

The dev server runs on `http://localhost:5173` and proxies any request to
`/api/*` through to your FastAPI backend at `http://localhost:8000`
(configured in `vite.config.js`). Start your backend separately:

```bash
cd backend
uvicorn app.main:app --reload
```

## Folder structure

```
src/
  api/          One file per backend router (applications, consent, risk,
                fraud, explanations, fairness, monitoring) — thin wrappers
                around axios calls matching your FastAPI schemas exactly.
  context/      ApplicationContext — holds wizard state (form answers,
                consent toggles, application_id, and results) across the
                Application → Consent → Results flow.
  components/
    layout/     SideNav, ProgressStepper — shared chrome.
    ui/         Toggle — the consent switch component.
  pages/
    ApplicationForm.jsx        Step 1
    ConsentManager.jsx         Step 2 — submits application + consent
    ResultsDashboard.jsx       Step 3 — calls risk, fraud, explanation
    ComplianceCenter.jsx       Admin placeholder (screen not built yet)
    WithdrawalRequestDetail.jsx Admin — consent withdrawal review
```

## Known gaps between the current backend and this frontend

These are flagged inline in the code with `// TODO` comments too:

1. **No customer-creation endpoint.** `ConsentManager.jsx` currently sends a
   hardcoded `customer_id: 1` when submitting. Add a `POST /customers`
   endpoint (or fold customer creation into `POST /applications/`) and
   replace the placeholder.
2. **Consent schema mismatch.** The Consent Manager UI has 4 toggles
   (employment, professional, digital, public) but `ConsentCreate` only has
   3 fields. `src/api/consent.js` maps them down for now — extend the
   backend schema to match 1:1 and simplify that mapping.
3. **Loan amount / loan term aren't collected** on the Application Form yet
   (only income, job title, years employed, education, bureau score). The
   frontend currently reuses `income` as a stand-in for `loan_amount` and
   hardcodes `loan_term: 12`. Add real fields once you decide how loan
   amount should be captured.
4. **Fraud check inputs aren't collected anywhere** (`transaction_count`,
   `unusual_transaction_ratio`, `account_age_days`, `login_frequency`).
   `ResultsDashboard.jsx` currently sends zeros. Either add fields to the
   form, or better, derive these server-side from the alternative data the
   customer consented to.
5. **No risk-history endpoint**, so the "Risk Score Evolution" timeline
   chart on the Results dashboard is a placeholder. Add something like
   `GET /risk/history/{application_id}` returning past scores to wire it up.
6. **No withdrawal-request endpoints** for the Compliance pages
   (`ComplianceCenter.jsx`, `WithdrawalRequestDetail.jsx`) — both currently
   render mock data.
7. **Digital activity / transaction consistency scores** sent to
   `POST /risk/score` are hardcoded to `0` — these should eventually be
   computed from the consented alternative-data sources rather than sent
   from the frontend directly.
