// All health content lives here, separate from the code.
// Each indicator documents which numbers come from a source and which are
// design choices of this app. Validate with medical professionals before real use.
//
// normalLow/High   -> inside = "normal"
// criticalLow/High -> outside = "critical"; between = "attention"

export const INDICATORS = [
  {
    id: "heartRate", label: "Heart rate", unit: "bpm", icon: "♥",
    step: 1, input: { min: 30, max: 200 },
    normalLow: 60, normalHigh: 100, criticalLow: 40, criticalHigh: 120,
    hazard: "Altered gravity, radiation",
    why: "Shows how the cardiovascular system is adapting to microgravity and stress. Well-trained people can rest below 60 bpm, so compare with your own baseline.",
    howTo: "Rest for 5 minutes, then count pulse beats for 30 seconds and multiply by 2.",
    advice: {
      normal: "Within the typical resting range for adults. Keep up exercise sessions.",
      attention: "Outside the typical resting range (60 to 100 bpm). Rest, hydrate, avoid caffeine and measure again in 30 minutes. If it persists, tell the flight surgeon.",
      critical: "Very far from the typical range. Stop activity, sit down and contact the flight surgeon.",
    },
    source: "Normal range: 60-100 bpm at rest (American Heart Association, via Mayo Clinic: mayoclinic.org/heart-rate/expert-answers/faq-20057979). Critical cutoffs (40 and 120 bpm): design choice of this app.",
  },
  {
    id: "systolic", label: "Systolic blood pressure", unit: "mmHg", icon: "◍",
    step: 1, input: { min: 60, max: 220 },
    normalLow: 90, normalHigh: 119, criticalLow: 80, criticalHigh: 180,
    hazard: "Altered gravity (fluid shifts)",
    why: "Fluids shift toward the head in microgravity, which can change blood pressure. Only the top number is tracked in this version.",
    howTo: "Sit relaxed for 5 minutes with the cuff at heart level, then measure.",
    advice: {
      normal: "Within the normal range. Continue your routine.",
      attention: "Outside the normal range. Rest, limit salt and caffeine, and measure again after 5 minutes. If it stays outside the range, tell the flight surgeon.",
      critical: "Very high or very low. Wait 5 minutes and measure again. If it is still in this range, contact the flight surgeon immediately.",
    },
    source: "Normal: below 120 mmHg; above 180 is severe (American Heart Association, via Harvard Health: health.harvard.edu/heart-health/reading-the-current-blood-pressure-guidelines). Lower limits (90 and 80): design choice, because the AHA gives no number for low pressure.",
  },
  {
    id: "temperature", label: "Body temperature", unit: "°C", icon: "☀",
    step: 0.1, input: { min: 34, max: 42 },
    normalLow: 36.1, normalHigh: 37.2, criticalLow: 35.0, criticalHigh: 38.0,
    hazard: "Closed environment, radiation",
    why: "A rise can signal infection or immune changes, which matter in a closed spacecraft.",
    howTo: "Use the thermometer in the medical kit, following the device instructions.",
    advice: {
      normal: "Within the normal range. Nothing to do.",
      attention: "Slightly outside the normal range. Hydrate, rest and measure again in a few hours.",
      critical: "Fever (38 °C or more) or dangerously low temperature (below 35 °C). Contact the flight surgeon.",
    },
    source: "Normal 36.1-37.2 °C and fever from 38 °C (MedlinePlus and Cleveland Clinic ranges, as summarized in secondary sources); hypothermia below 35 °C (Mayo Clinic, via MedicineNet).",
  },
  {
    id: "sleep", label: "Sleep", unit: "h", icon: "☾",
    step: 0.5, input: { min: 0, max: 14 },
    normalLow: 7, normalHigh: 9, criticalLow: 5, criticalHigh: 11,
    hazard: "Isolation, confinement",
    why: "Astronauts average about 6 hours of sleep in space, less than the 7 to 9 hours adults need. Short sleep reduces alertness and performance.",
    howTo: "Enter the total hours you slept in the last sleep period.",
    advice: {
      normal: "Within the recommended 7 to 9 hours. Keep your sleep schedule.",
      attention: "Outside the recommended range. Keep a fixed routine, dim lights before sleep and avoid screens before bed.",
      critical: "Severe sleep loss (or excess) affects safety. Report it to the crew and the flight surgeon.",
    },
    source: "Recommended 7-9 h for adults and in-flight average of about 6 h (NASA OCHMO sleep technical brief: nasa.gov/wp-content/uploads/2023/03/sleep-accomodations-technical-brief-ochmo.pdf). Critical cutoffs (5 and 11 h): design choice of this app.",
  },
  {
    id: "mood", label: "Mood", unit: "/5", icon: "☺",
    step: 1, input: { min: 1, max: 5 },
    normalLow: 3, normalHigh: 5, criticalLow: 2, criticalHigh: 6,
    hazard: "Isolation, distance from Earth",
    why: "Mood changes are an early sign of behavioral health problems during isolation.",
    howTo: "Rate how you feel today: 1 = very low, 5 = very good.",
    advice: {
      normal: "Stable mood. Keep social contact with the crew and family.",
      attention: "Mood is low. Talk with a crewmate and schedule a call with the ground team.",
      critical: "Very low mood needs support. Contact the flight surgeon or psychologist.",
    },
    source: "Simple 1-5 self-rating created for this app. It is NOT a validated clinical scale; a real system should use a validated questionnaire chosen with a psychologist.",
  },
];