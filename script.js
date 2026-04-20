const marketSkills = {
  dataAnalytics: { title: "Data Analytics", demand: 84, oversupply: 41, salaryBoost: 850 },
  renewableEnergy: { title: "Renewable Energy", demand: 91, oversupply: 26, salaryBoost: 980 },
  cloudSupport: { title: "Cloud Support", demand: 79, oversupply: 38, salaryBoost: 780 },
  advancedManufacturing: { title: "Advanced Manufacturing", demand: 73, oversupply: 45, salaryBoost: 620 },
  digitalMarketing: { title: "Digital Marketing", demand: 65, oversupply: 62, salaryBoost: 520 },
  basicAdmin: { title: "Basic Administration", demand: 48, oversupply: 77, salaryBoost: 210 }
};

const courses = [
  {
    id: "tvet-data",
    name: "TVET Diploma in Data Operations",
    duration: 11,
    skills: ["dataAnalytics", "cloudSupport"]
  },
  {
    id: "tvet-green",
    name: "TVET Certificate in Green Technology",
    duration: 10,
    skills: ["renewableEnergy", "advancedManufacturing"]
  },
  {
    id: "tvet-industry",
    name: "TVET Industrial Mechatronics",
    duration: 12,
    skills: ["advancedManufacturing", "cloudSupport"]
  },
  {
    id: "tvet-business",
    name: "TVET Digital Business Essentials",
    duration: 8,
    skills: ["digitalMarketing", "basicAdmin"]
  }
];

const internships = [
  { id: "intern-sme", name: "SME Operations Internship", experienceBoost: 9, demandBias: "advancedManufacturing", duration: 4 },
  { id: "intern-data", name: "Data Team Internship", experienceBoost: 14, demandBias: "dataAnalytics", duration: 5 },
  { id: "intern-energy", name: "Renewable Site Internship", experienceBoost: 13, demandBias: "renewableEnergy", duration: 5 },
  { id: "intern-marketing", name: "Agency Internship", experienceBoost: 8, demandBias: "digitalMarketing", duration: 4 }
];

const certifications = [
  { id: "cert-cloud", name: "Cloud Support Associate", signalBoost: 12, skill: "cloudSupport" },
  { id: "cert-analyst", name: "Junior Data Analyst", signalBoost: 15, skill: "dataAnalytics" },
  { id: "cert-solar", name: "Solar Installation Professional", signalBoost: 15, skill: "renewableEnergy" },
  { id: "cert-admin", name: "Office Administration Specialist", signalBoost: 8, skill: "basicAdmin" }
];

const yearRange = document.getElementById("yearRange");
const yearLabel = document.getElementById("yearLabel");
const simulateBtn = document.getElementById("simulateBtn");

const courseSelect = document.getElementById("courseSelect");
const internshipSelect = document.getElementById("internshipSelect");
const certSelect = document.getElementById("certSelect");
const scenarioSelect = document.getElementById("scenarioSelect");

const hireProbabilityEl = document.getElementById("hireProbability");
const salaryLevelEl = document.getElementById("salaryLevel");
const employmentTimeEl = document.getElementById("employmentTime");
const insightTextEl = document.getElementById("insightText");

function populateSelect(select, items) {
  items.forEach((item) => {
    const option = document.createElement("option");
    option.value = item.id;
    option.textContent = item.name;
    select.appendChild(option);
  });
}

populateSelect(courseSelect, courses);
populateSelect(internshipSelect, internships);
populateSelect(certSelect, certifications);

yearRange.addEventListener("input", () => {
  yearLabel.textContent = yearRange.value;
});

function logisticScore(x) {
  return 1 / (1 + Math.exp(-x));
}

function demandShiftForYear(skillKey, year, scenario) {
  const yearsFromBase = year - 2026;
  const baseShift = yearsFromBase * 1.6;

  const scenarioSkillEffects = {
    baseline: { renewableEnergy: 1.2, dataAnalytics: 1, cloudSupport: 0.8, advancedManufacturing: 0.9, digitalMarketing: 0.4, basicAdmin: -0.4 },
    "green-shift": { renewableEnergy: 2.6, dataAnalytics: 1.1, cloudSupport: 0.7, advancedManufacturing: 1.4, digitalMarketing: 0.3, basicAdmin: -0.5 },
    "automation-wave": { renewableEnergy: 0.8, dataAnalytics: 2.1, cloudSupport: 1.9, advancedManufacturing: 1.6, digitalMarketing: 0.2, basicAdmin: -1.6 },
    "global-slowdown": { renewableEnergy: 0.6, dataAnalytics: 0.7, cloudSupport: 0.6, advancedManufacturing: 0.3, digitalMarketing: -0.4, basicAdmin: -0.8 }
  };

  const multiplier = scenarioSkillEffects[scenario][skillKey] || 0;
  return baseShift * multiplier;
}

function simulate() {
  const selectedCourse = courses.find((x) => x.id === courseSelect.value);
  const selectedInternship = internships.find((x) => x.id === internshipSelect.value);
  const selectedCert = certifications.find((x) => x.id === certSelect.value);

  const year = Number(yearRange.value);
  const scenario = scenarioSelect.value;

  const chosenSkills = new Set([...selectedCourse.skills, selectedInternship.demandBias, selectedCert.skill]);

  let demandScore = 0;
  let oversupplyPenalty = 0;
  let salaryPremium = 0;

  chosenSkills.forEach((skillKey) => {
    const profile = marketSkills[skillKey];
    const adjustedDemand = profile.demand + demandShiftForYear(skillKey, year, scenario);
    demandScore += adjustedDemand;
    oversupplyPenalty += profile.oversupply;
    salaryPremium += profile.salaryBoost;
  });

  const demandAverage = demandScore / chosenSkills.size;
  const oversupplyAverage = oversupplyPenalty / chosenSkills.size;

  const internshipAdvantage = selectedInternship.experienceBoost;
  const certAdvantage = selectedCert.signalBoost;

  const employabilityRaw =
    (demandAverage - oversupplyAverage) / 22 +
    internshipAdvantage / 18 +
    certAdvantage / 20 -
    selectedCourse.duration / 28;

  const hireProbability = logisticScore(employabilityRaw) * 100;

  const baseSalary = 2200;
  const scenarioMultiplier =
    scenario === "global-slowdown" ? 0.94 : scenario === "green-shift" ? 1.06 : scenario === "automation-wave" ? 1.04 : 1;

  const estimatedSalary =
    (baseSalary + salaryPremium / chosenSkills.size + selectedInternship.experienceBoost * 30 + selectedCert.signalBoost * 20) *
    scenarioMultiplier;

  const timeToEmployment = Math.max(
    1,
    Math.round(
      12 +
        selectedCourse.duration * 0.28 +
        (oversupplyAverage - demandAverage) / 24 -
        selectedInternship.experienceBoost / 3.4 -
        selectedCert.signalBoost / 6
    )
  );

  hireProbabilityEl.textContent = `${hireProbability.toFixed(1)}%`;
  salaryLevelEl.textContent = `RM ${Math.round(estimatedSalary).toLocaleString()}`;
  employmentTimeEl.textContent = `${timeToEmployment} months`;

  const demandSignal = demandAverage >= 76 ? "high-demand" : demandAverage >= 60 ? "moderate-demand" : "low-demand";
  const oversupplySignal = oversupplyAverage >= 62 ? "high oversupply" : oversupplyAverage >= 48 ? "medium oversupply" : "low oversupply";

  insightTextEl.textContent =
    `Your profile is weighted toward ${demandSignal} skills with ${oversupplySignal}. ` +
    `Labour demand in ${year} (${scenario.replace("-", " ")}) is directly raising or lowering your hire odds. ` +
    `Internship exposure and certification signaling improve employability, while longer training delays entry.`;
}

simulateBtn.addEventListener("click", simulate);
simulate();
