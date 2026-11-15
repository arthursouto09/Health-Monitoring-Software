# 🧑‍🚀 Astronaut Health Monitor

> A health dashboard for long-duration missions: measure, understand and act.

![Challenge](https://img.shields.io/badge/NASA%20Space%20Apps-2026-red)
![Status](https://img.shields.io/badge/status-hackathon%20prototype-blue)

**Live demo:** [ADD LINK]  
**Demo video:** [ADD LINK]  
**Challenge:** *Create Health Monitoring Software for Astronauts on Space Missions* (NASA International Space Apps Challenge 2026)

---

## About

On long missions, astronauts are exposed to radiation, isolation and confinement, altered gravity and a closed environment. With communication delays, they carry much of the responsibility for noticing health changes in themselves.

**Astronaut Health Monitor** lets an astronaut sign in, record daily health indicators, see their status at a glance, follow trends over time and get plain-language guidance on what to do next, including when to contact the flight surgeon. It assumes the user is **not** a medical expert, so every measurement comes with instructions and an explanation.

## Features

- **Sign-in without sign-up:** crew accounts are created by mission control. A demo account (`astronaut` / `mars2026`) is shown on the login screen
- **Review before saving:** each value is shown with the status it will get, and the whole dashboard previews it, so typos are caught before they become false alarms
- **Realistic values only:** each indicator accepts a plausible range (for example 34 to 41 °C), checked in the form and on the server
- **Partial check-ins:** blank fields keep the value already saved today
- **Daily check-in** for six indicators, with a hint on how to measure each one
- **Color-coded status** (normal, attention, contact flight surgeon). Each status also has an icon and text, so it never depends on color alone
- **Interactive body map:** click the brain, heart, whole body or bones to see what the part does, its spaceflight risk and the linked indicators
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

## How a reading becomes a status

1. The value is compared with the indicator's ranges in `src/data/indicators.js`.
2. Inside the normal range: **normal**. Outside it but not far: **attention**. Beyond the critical limits: **contact flight surgeon**.
3. The app shows an explanation and a recommended action for that status.
4. Each body part shows the **worst status** among its linked indicators.
5. Separately, the reading is compared with the astronaut's **personal baseline**. This adds an "Unusual for you" flag but does not change the status.

All medical content (ranges, texts, sources) lives in one data file, separate from the code. Updating a range never requires touching the logic.

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

These ranges are for healthy adults at rest, which is why the app also compares each person with their **own baseline**. The baseline parameters (14 readings, at least 5, 2 standard deviations) are design choices of this app.

## Tech stack

- React 18 and Vite
- Recharts for charts
- SVG for the body map
- Vercel serverless functions (`api/`) for the backend
- Postgres (`pg`); Neon in production, Docker Compose locally
- Node's built-in `crypto` for password hashing (scrypt) and signed session cookies

## Getting started

Requires [Node.js](https://nodejs.org/) (LTS).

```bash
git clone https://github.com/arthursouto09/Health-Monitoring-Software.git
cd Health-Monitoring-Software
npm install
npm run dev
```

Open the address shown in the terminal (usually `http://localhost:5173`) and sign in with **astronaut / mars2026**. `npm run dev` serves the frontend and the `/api` routes together. Without a database configured, data is saved to `.data/db.json`.

**With Postgres (optional, same as production):**

```bash
docker compose up -d
cp .env.example .env.local    # then set DATABASE_URL=postgres://ahm:ahm@localhost:5432/ahm
npm run dev
```

**Crew accounts** (there is no sign-up):

```bash
npm run create-user -- <username> "<Full name>" <password>
```

**Windows note:** if PowerShell blocks `npm`, run `Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned` once, or use the Command Prompt.

Production build:

```bash
npm run build
npm run preview
```

**Deploy on Vercel:** import the repository, connect a Postgres database (Neon) under Storage so `DATABASE_URL` is set, add a long random `SESSION_SECRET` under Environment Variables, and deploy. Step-by-step instructions are in [`docs/como-executar.md`](docs/como-executar.md) (Portuguese).

## Architecture

Medical content, logic and interface are kept apart: changing a range or a text never requires touching the logic.

```mermaid
flowchart LR
    DATA["src/data/<br/>indicators, environments"] --> UI["React app (src/)<br/>login, dashboard, check-in"]
    LOGIC["src/logic/<br/>status, baseline, engagement,<br/>report, dates"] --> UI
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
│   ├── BodyMap.jsx         # clickable body figure
│   ├── CheckIn.jsx         # check-in form and review step
│   ├── Login.jsx           # sign-in screen
│   ├── Reminder.jsx        # check-in reminder
│   └── StatusBadge.jsx     # status badge (color + icon + text)
├── data/
│   ├── indicators.js       # ranges, texts and sources
│   └── environments.js     # mission environments and tips
└── logic/
    ├── status.js           # status rules and demo data
    ├── baseline.js         # personal baseline
    ├── engagement.js       # day streak and readiness score
    ├── report.js           # CSV report
    └── dates.js            # local-time dates
```

Internal team documentation (Portuguese) is in [`docs/`](docs/README.md).

## Limitations and roadmap

This is a hackathon prototype.

- [x] Blood glucose
- [x] Comparison with each astronaut's personal baseline
- [x] Reminders to take measurements (while the app is open)
- [x] Gamification (streak, readiness score)
- [x] Environment selector (spacecraft, station, rover, lunar or Mars base)
- [x] Report export for the flight surgeon (CSV)
- [x] Backend with sign-in and per-astronaut storage
- [x] Review step before saving a check-in
- [ ] Flight surgeon role to view the crew's readings
- [ ] Login rate limiting and session revocation
- [ ] Mood measured with a validated questionnaire
- [ ] Image-based inputs (camera, ultrasound)
- [ ] More indicators (for example bone density and exercise)
- [ ] Reminders when the app is closed

Crew accounts are managed from the command line only; there is no account management screen yet.

## Sources

- NASA Human Research Program: hazards of human spaceflight [ADD LINK]
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
| Erick  | Developer | https://github.com/DevNinee |
| Letícia | Pitch and submission | https://github.com/Leticiaferrer02 |
| Milena | |

## Disclaimer

Independent educational project created for the NASA Space Apps Challenge. It is **not** an official NASA product and **not a medical device**. It does not diagnose or treat any condition. Reference values and recommendations are for demonstration and must be validated by medical professionals before any real use.

## License

[ADD LICENSE, e.g. MIT]
