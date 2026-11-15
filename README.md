# 🧑‍🚀 Astronaut Health Monitor

> A health dashboard for long-duration missions: measure, understand and act.

![Challenge](https://img.shields.io/badge/NASA%20Space%20Apps-2026-red)
![Status](https://img.shields.io/badge/status-hackathon%20prototype-blue)

**Live demo:** [ADD LINK]
**Demo video:** [ADD LINK]
**Challenge:** *Create Health Monitoring Software for Astronauts on Space Missions* (NASA International Space Apps Challenge 2026)

---

## About

On long missions, astronauts are exposed to radiation, isolation and confinement, altered gravity and a closed environment. With communication delays of up to ~20 minutes to Mars, they carry much of the responsibility for noticing health changes in themselves, without real-time help from the ground.

**Astronaut Health Monitor** lets an astronaut sign in, record daily health indicators, see their status at a glance, follow trends over time, get plain-language guidance on what to do next, and generate a report for the flight surgeon. It assumes the user is **not** a medical expert, so every measurement comes with instructions and an explanation. It also looks beyond single readings: it flags combinations of mild symptoms that together point at a known spaceflight risk pattern, and ties every indicator back to one of NASA's own official spaceflight hazards.

## Features

- **Sign-in without sign-up:** crew accounts are created by mission control. A demo account (`astronaut` / `mars2026`) is shown on the login screen
- **1-click demo scenarios:** load 14 days of a specific situation (a normal orbit, a fatigue pattern, a post-EVA health scare) instantly, so judges and the demo video can see a crisis unfold without typing in numbers
- **Daily check-in** for seven indicators, with a hint on how to measure each one
- **Review before saving:** each value is shown with the status it will get, and the whole dashboard previews it, so typos are caught before they become false alarms
- **Realistic values only:** each indicator accepts a plausible range (for example 34 to 41 °C), checked in the form and on the server
- **Partial check-ins:** blank fields keep the value already saved today
- **Color-coded status** (normal, attention, contact flight surgeon). Each status also has an icon and text, so it never depends on color alone
- **Interactive, anatomical body map:** click the brain, heart, whole body or bones/muscles to see what the part does, its spaceflight risk and the linked indicators
- **NASA hazard map:** every indicator is linked to one of the 5 official NASA Human Research Program (HRP) hazards and a concrete countermeasure (for example "ARED resistance exercise")
- **Combined risk alerts:** looks for patterns across indicators, not just one at a time — for example reduced sleep together with a rising heart rate, or a fever together with little exercise — and names which readings triggered it
- **Trend charts** with the normal range shaded and the personal baseline drawn as a dashed line
- **Personal baseline:** flags readings that are unusual *for you* (more than 2 standard deviations from your last 14 readings), even when they are inside the general range
- **Guidance per result:** what the value means and what to do
- **Mission environment selector:** space station, spacecraft, rover, lunar base or Mars base, with a context tip for each indicator
- **Check-in reminder:** on-screen banner and an optional browser notification
- **Readiness score and day streak** to keep the routine going (not clinical scores)
- **CSV report** of all readings to send to the flight surgeon, generated on the device
- **Demo account with 14 days of simulated readings**, so charts are never empty
- **Backend:** readings are stored per astronaut in Postgres and validated on the server, so they follow the astronaut to any device

## Health indicators

| Indicator | Why it matters in spaceflight | Related hazard |
|---|---|---|
| Heart rate (bpm) | Cardiovascular adaptation and stress | Altered gravity, radiation |
| Systolic blood pressure (mmHg) | Fluid shifts in microgravity | Altered gravity |
| Body temperature (°C) | Infection and immune changes in a closed environment | Closed environment, radiation |
| Fasting blood glucose (mg/dL) | Spaceflight can reduce insulin sensitivity | Altered gravity, radiation, less physical activity |
| Sleep (h) | Astronauts average about 6 h in space, below the 7 to 9 h adults need | Isolation, confinement |
| Mood (1 to 5) | Early sign of behavioral health problems | Isolation, distance from Earth |
| Resistance exercise (min) | Microgravity causes bone density loss and muscle atrophy without daily mechanical loading | Altered gravity |

## How a reading becomes a status

1. The value is compared with the indicator's ranges in `src/data/indicators.js`.
2. Inside the normal range: **normal**. Outside it but not far: **attention**. Beyond the critical limits: **contact flight surgeon**.
3. The app shows an explanation and a recommended action for that status.
4. Each body part shows the **worst status** among its linked indicators.
5. Separately, the reading is compared with the astronaut's **personal baseline**. This adds an "Unusual for you" flag but does not change the status.
6. The app also checks for **combinations** of readings that are each mild alone but, together, match a known spaceflight stress pattern (see below). These show up as a highlighted "Combined Risk" alert naming exactly which indicators caused it.

All medical content (ranges, texts, sources) lives in one data file, separate from the code. Updating a range never requires touching the logic.

## NASA hazards and combined risk alerts

**Hazard map.** `src/data/hazards.js` links every indicator to one or two of the 5 official hazards named by the NASA Human Research Program (HRP): Space Radiation, Isolation and Confinement, Distance from Earth, Altered Gravity Fields, and Hostile/Closed Environments. Each link also carries a risk category (Cardiovascular, Immune, Behavioral Health, Metabolic, Bone & Muscle) and a concrete countermeasure, shown as a discreet tag in the indicator detail panel and on the body map.

**Combined risk alerts.** `src/logic/combinedAlerts.js` looks at the latest reading as a whole, not indicator by indicator:

| Pattern | Fires when | Suggested action |
|---|---|---|
| Behavioral & Fatigue Strain | Sleep is statistically low for that person (or below a fixed floor), together with a low mood or a heart rate statistically high for them | Prioritize sleep recovery, reduce workload, schedule a check-in |
| Closed-Env Immune Watch | Temperature or heart rate already above their own sourced normal range, together | Monitor temperature, hydrate, limit contact, prepare a flight surgeon packet |
| Musculoskeletal Deconditioning Risk | Average exercise minutes over the last 3 days below the daily target | Schedule a resistance session (ARED protocol equivalent) |

Where possible, these rules reuse the astronaut's own personal baseline (`src/logic/baseline.js`) or an indicator's own sourced range, instead of inventing a new cutoff — see the comments in `combinedAlerts.js` for exactly which numbers are sourced and which are a design choice of this app.

## Reference ranges and what comes from a source

Each indicator in `src/data/indicators.js` states which numbers come from a source and which are **design choices of this app**.

| Indicator | From a source | Design choice of this app |
|---|---|---|
| Heart rate | Normal resting range of 60 to 100 bpm | Critical limits (40 and 120 bpm) |
| Systolic pressure | Normal below 120 mmHg; above 180 is severe | Lower limits (90 and 80 mmHg) |
| Temperature | Normal 36.1 to 37.2 °C; fever from 38 °C; hypothermia below 35 °C | None |
| Fasting glucose | Normal below 100 mg/dL; hypoglycemia below 70, significant below 54 | Critical high limit (180 mg/dL) |
| Sleep | 7 to 9 h recommended; astronauts average about 6 h in flight | Critical limits (5 and 11 h) |
| Mood | None | The whole 1 to 5 self-rating scale |
| Resistance exercise | NASA HRP exercise countermeasure risk area | Daily minute cutoffs (45, 150, 15, 180) |

These ranges are for healthy adults at rest, which is why the app also compares each person with their **own baseline**. The baseline parameters (14 readings, at least 5, 2 standard deviations) are design choices of this app.

## Tech stack

- React 18 and Vite
- Recharts for charts
- Inline SVG for the body map (no image assets)
- Vercel serverless functions (`api/`) for the backend
- Postgres (`pg`); Neon in production, Docker Compose locally
- Node's built-in `crypto` for password hashing (scrypt) and signed session cookies

## Getting started

### 1. Prerequisites

- [Node.js](https://nodejs.org/) (LTS)
- Git

### 2. Clone and install

```bash
git clone https://github.com/arthursouto09/Health-Monitoring-Software.git
cd Health-Monitoring-Software
npm install
```

### 3. Run it (no database needed)

```bash
npm run dev
```

`npm run dev` serves the frontend **and** the `/api` routes together on the same address — there is no separate backend process to start. Without a database configured, readings are saved to a local file, `.data/db.json`, created automatically.

Open the address printed in the terminal (usually `http://localhost:5173`) and sign in with the demo account:

- **Username:** `astronaut`
- **Password:** `mars2026`

### 4. Try it without typing any data

Once signed in, use the **demo scenario** buttons in the header to load 14 days of a specific situation with one click (for example "Mars Transit Fatigue"). This is the fastest way to see the combined risk alerts, the body map lighting up, and the trend chart all react to a real stored dataset.

### 5. (Optional) Run with Postgres, same as production

Only needed to test the database path locally; the file-based store from step 3 is enough for everyday development.

```bash
docker compose up -d
cp .env.example .env.local
# then edit .env.local and set:
# DATABASE_URL=postgres://ahm:ahm@localhost:5432/ahm
npm run dev
```

### 6. Create a crew account

There is no sign-up screen; accounts are created from the command line:

```bash
npm run create-user -- <username> "<Full name>" <password>
```

### 7. Windows note

If PowerShell blocks `npm`, run this once: `Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned`, or use the Command Prompt instead.

### 8. Production build

```bash
npm run build
npm run preview
```

### 9. Deploy on Vercel

1. Import the repository into Vercel.
2. Under **Storage**, connect a Postgres database (for example Neon) — this sets `DATABASE_URL` automatically.
3. Under **Settings > Environment Variables**, add a long random `SESSION_SECRET` (generate one with `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"`).
4. Deploy.

A more detailed, Portuguese walkthrough is in [`docs/como-executar.md`](docs/como-executar.md).

## Architecture

Medical content, logic and interface are kept apart: changing a range, a hazard or a text never requires touching the logic.

```mermaid
flowchart LR
    DATA["src/data/<br/>indicators, hazards,<br/>environments"] --> UI["React app (src/)<br/>login, dashboard, check-in"]
    LOGIC["src/logic/<br/>status, baseline,<br/>combinedAlerts, engagement,<br/>report, dates"] --> UI
    UI <-- "fetch + session cookie" --> API["api/<br/>login, logout, me, entries"]
    API --> SERVER["server/<br/>session, passwords,<br/>validation, store"]
    DATA --> SERVER
    SERVER --> DB[("Postgres")]
    UI --> CSV[/"CSV report"/]
```

| Route | Method | What it does |
|---|---|---|
| `/api/login` | POST | Checks the password and sets an HttpOnly session cookie |
| `/api/logout` | POST | Clears the session |
| `/api/me` | GET | Returns the signed-in astronaut |
| `/api/entries` | GET / PUT | Lists or saves the signed-in astronaut's readings (one per day) |

```text
api/                        # backend routes (Vercel functions)
server/                     # session, passwords, validation, database store
scripts/create-user.js      # creates crew accounts
docker-compose.yml          # local Postgres
src/
├── main.jsx
├── Root.jsx                # login or dashboard
├── api.js                  # client for /api
├── App.jsx                 # dashboard, cards, chart, alerts, export
├── styles.css
├── components/
│   ├── BodyMap.jsx         # clickable, anatomical body figure
│   ├── HazardTag.jsx       # NASA hazard + countermeasure tag
│   ├── CheckIn.jsx         # check-in form and review step
│   ├── Login.jsx           # sign-in screen
│   ├── Reminder.jsx        # check-in reminder
│   └── StatusBadge.jsx     # status badge (color + icon + text)
├── data/
│   ├── indicators.js       # ranges, texts and sources
│   ├── hazards.js          # NASA HRP hazards + countermeasures
│   └── environments.js     # mission environments and tips
└── logic/
    ├── status.js           # status rules, demo data and demo scenarios
    ├── baseline.js         # personal baseline
    ├── combinedAlerts.js   # cross-indicator risk patterns
    ├── engagement.js       # day streak and readiness score
    ├── report.js           # CSV report
    └── dates.js            # local-time dates
```

Internal team documentation (Portuguese) is in [`docs/`](docs/README.md).

## Limitations and roadmap

This is a hackathon prototype.

- [x] Blood glucose and resistance exercise indicators
- [x] NASA HRP hazard map and countermeasures per indicator
- [x] Combined, cross-indicator risk alerts
- [x] One-click demo scenarios for judging and the demo video
- [x] Comparison with each astronaut's personal baseline
- [x] Reminders to take measurements (while the app is open)
- [x] Gamification (streak, readiness score)
- [x] Environment selector (spacecraft, station, rover, lunar or Mars base)
- [x] Report export for the flight surgeon (CSV)
- [x] Backend with sign-in and per-astronaut storage
- [x] Review step before saving a check-in
- [ ] Radiation dose indicator
- [ ] Flight surgeon role to view the crew's readings
- [ ] Login rate limiting and session revocation
- [ ] Mood measured with a validated questionnaire
- [ ] Image-based inputs (camera, ultrasound)
- [ ] Reminders when the app is closed

Crew accounts are managed from the command line only; there is no account management screen yet.

## Sources

- NASA Human Research Program, the 5 hazards of human spaceflight: https://www.nasa.gov/hrp/hazards/
- NASA Human Research Program, risks and countermeasures (exercise, cardiovascular, immune, behavioral): https://www.nasa.gov/hrp/risks/
- NASA OCHMO, sleep technical brief: https://www.nasa.gov/wp-content/uploads/2023/03/sleep-accomodations-technical-brief-ochmo.pdf
- Barger et al., sleep of astronauts before, during and after spaceflight (The Lancet Neurology, 2014): https://pmc.ncbi.nlm.nih.gov/articles/PMC4188436
- American Heart Association blood pressure categories, via Harvard Health: https://www.health.harvard.edu/heart-health/reading-the-current-blood-pressure-guidelines
- Resting heart rate, Mayo Clinic: https://www.mayoclinic.org/heart-rate/expert-answers/faq-20057979
- Fasting blood glucose, CDC: https://www.cdc.gov/diabetes/diabetes-testing/
- Hypoglycemia levels, American Diabetes Association, Standards of Care in Diabetes [ADD LINK]
- Body temperature and hypothermia: [ADD PRIMARY SOURCE, e.g. MedlinePlus or Mayo Clinic]

## Team

| Name | Role | Links |
|---|---|---|
| Arthur | Developer | https://github.com/arthursouto09 |
| Enrico | Developer | https://github.com/sidts |
| Erick | Developer | https://github.com/DevNinee |
| Letícia | Pitch and submission | https://github.com/Leticiaferrer02 |
| Milena | | |

## Disclaimer

Independent educational project created for the NASA Space Apps Challenge. It is **not** an official NASA product and **not a medical device**. It does not diagnose or treat any condition. Reference values and recommendations are for demonstration and must be validated by medical professionals before any real use.

## License

MIT — see [`LICENSE`](LICENSE).
