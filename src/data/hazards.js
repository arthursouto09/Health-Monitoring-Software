// The 5 official hazards of human spaceflight, as named by the NASA Human
// Research Program (HRP). Source: https://www.nasa.gov/hrp/hazards/
export const NASA_HAZARDS = {
  radiation: { id: "radiation", name: "Space Radiation", url: "https://www.nasa.gov/hrp/hazards/" },
  isolation: { id: "isolation", name: "Isolation and Confinement", url: "https://www.nasa.gov/hrp/hazards/" },
  distance: { id: "distance", name: "Distance from Earth", url: "https://www.nasa.gov/hrp/hazards/" },
  gravity: { id: "gravity", name: "Altered Gravity Fields", url: "https://www.nasa.gov/hrp/hazards/" },
  closedEnv: { id: "closedEnv", name: "Hostile/Closed Environments", url: "https://www.nasa.gov/hrp/hazards/" },
};

// Links each dashboard indicator to the hazard(s) that drive it, its HRP risk
// category, and a concrete countermeasure. riskCategory and countermeasure
// summarize NASA HRP risk areas (nasa.gov/hrp/risks/); they are not direct
// quotes, so validate wording with a flight surgeon before any real use.
export const INDICATOR_NASA_META = {
  heartRate: {
    hazardIds: ["gravity", "radiation"],
    riskCategory: "Cardiovascular",
    countermeasure: "Daily aerobic exercise (CEVIS cycle ergometer) and fluid-loading protocol",
    nasaUrl: "https://www.nasa.gov/hrp/risks/",
  },
  systolic: {
    hazardIds: ["gravity"],
    riskCategory: "Cardiovascular",
    countermeasure: "Lower-body negative pressure device and hydration before landing/EVA",
    nasaUrl: "https://www.nasa.gov/hrp/risks/",
  },
  temperature: {
    hazardIds: ["closedEnv", "radiation"],
    riskCategory: "Immune",
    countermeasure: "Isolate and monitor; report to flight surgeon if fever persists",
    nasaUrl: "https://www.nasa.gov/hrp/risks/",
  },
  glucose: {
    hazardIds: ["gravity", "radiation"],
    riskCategory: "Metabolic",
    countermeasure: "Scheduled meals and regular exercise (insulin sensitivity countermeasure)",
    nasaUrl: "https://www.nasa.gov/hrp/risks/",
  },
  sleep: {
    hazardIds: ["isolation", "closedEnv"],
    riskCategory: "Behavioral Health",
    countermeasure: "Circadian light & sleep schedule",
    nasaUrl: "https://www.nasa.gov/hrp/risks/",
  },
  mood: {
    hazardIds: ["isolation", "distance"],
    riskCategory: "Behavioral Health",
    countermeasure: "Private crew/family check-in",
    nasaUrl: "https://www.nasa.gov/hrp/risks/",
  },
  exercise: {
    hazardIds: ["gravity"],
    riskCategory: "Bone & Muscle",
    countermeasure: "ARED resistance exercise session",
    nasaUrl: "https://www.nasa.gov/hrp/risks/",
  },
};
