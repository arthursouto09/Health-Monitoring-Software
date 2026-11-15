// Mission environments and context tips per indicator.
// Educational content: validate with mission medical staff before real use.

export const ENVIRONMENTS = [
  {
    id: "station", label: "Space station (low Earth orbit)",
    context: "Microgravity, about 16 sunrises a day, exercise equipment on board and near real-time contact with Earth.",
    tips: {
      heartRate: "Measure at the same time of day, away from your exercise sessions.",
      systolic: "Fluids shift toward the head in microgravity; keep the cuff at heart level and stay still while measuring.",
      temperature: "Air in the module is recycled; report fever early so the crew can limit contact.",
      glucose: "Keep using the exercise devices every day; regular activity helps glucose control.",
      sleep: "With about 16 sunrises a day, use the eye mask and follow the station's light schedule.",
      mood: "Use the regular calls with family and the ground team.",
    },
  },
  {
    id: "spacecraft", label: "Spacecraft in transit",
    context: "Small cabin, limited exercise space and higher radiation once outside Earth's magnetic field.",
    tips: {
      heartRate: "Space for exercise is limited; follow the in-flight exercise plan to keep your heart conditioned.",
      systolic: "Measure seated and strapped in, at the same time each day.",
      temperature: "In a small shared cabin, report any fever right away.",
      glucose: "Meals are fixed and activity is lower; measure fasting, before the first meal.",
      sleep: "Keep the sleep schedule set by the mission timeline, even without a day-night cycle.",
      mood: "Confinement is high; plan some private time and keep in touch with the crew.",
    },
  },
  {
    id: "rover", label: "Pressurized rover",
    context: "Cramped cabin, heavy workload on excursions and long distance from the main habitat.",
    tips: {
      heartRate: "Measure after resting at least 5 minutes, not right after a spacewalk or driving shift.",
      systolic: "Measure after resting, not right after suiting up or a spacewalk.",
      temperature: "Suit work raises body heat; wait 30 minutes after an excursion before measuring.",
      glucose: "Long shifts can delay meals; carry fast-acting carbohydrate on excursions.",
      sleep: "Short excursions often cut sleep; plan rest before the next drive.",
      mood: "Workload is high; report stress during the daily check with the habitat.",
    },
  },
  {
    id: "moon", label: "Lunar base",
    context: "One-sixth of Earth's gravity, abrasive dust and about two weeks of daylight followed by two weeks of night.",
    tips: {
      heartRate: "Partial gravity still loads the heart less than on Earth; keep up the exercise plan.",
      systolic: "Measure seated after resting, at the same time each day.",
      temperature: "Lunar dust can irritate the airways; report fever or cough to the flight surgeon.",
      glucose: "Less physical load can reduce insulin sensitivity; keep the exercise plan.",
      sleep: "Two-week days and nights break the natural rhythm; rely on the habitat lighting schedule.",
      mood: "Earth is visible but far; use the scheduled calls home.",
    },
  },
  {
    id: "mars", label: "Mars base",
    context: "About three-eighths of Earth's gravity and a communication delay of up to about 22 minutes each way, so the crew must act more on its own.",
    tips: {
      heartRate: "With delayed contact, follow the guidance in this app first and send the reading to the flight surgeon.",
      systolic: "Measure twice if the value is outside the range; the flight surgeon's answer may take a while.",
      temperature: "Answers from Earth are delayed; follow the medical kit procedure for fever while you wait.",
      glucose: "Long-duration diet changes matter more here; measure fasting at the same time each day.",
      sleep: "A Mars day lasts about 24 h 40 min; follow the mission schedule to keep a steady rhythm.",
      mood: "Isolation and delay are greatest here; talk with the crew and send recorded messages home.",
    },
  },
];
