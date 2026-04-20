const marketSkills = {
  dataAnalytics: { title: "Data Analytics", demand: 84, oversupply: 41, salaryBoost: 850 },
  renewableEnergy: { title: "Renewable Energy", demand: 91, oversupply: 26, salaryBoost: 980 },
  cloudSupport: { title: "Cloud Support", demand: 79, oversupply: 38, salaryBoost: 780 },
  advancedManufacturing: { title: "Advanced Manufacturing", demand: 73, oversupply: 45, salaryBoost: 620 },
  digitalMarketing: { title: "Digital Marketing", demand: 65, oversupply: 62, salaryBoost: 520 },
  basicAdmin: { title: "Basic Administration", demand: 48, oversupply: 77, salaryBoost: 210 }
};

const programs = [
  {
    id: "tvet-data",
    name: "TVET Diploma in Data Operations",
    duration: 11,
    skills: ["dataAnalytics", "cloudSupport"]
  },
  {
    id: "tvet-green",
    name: "TVET Diploma in Green Technology",
    duration: 10,
    skills: ["renewableEnergy", "advancedManufacturing"]
  },
  {
    id: "non-tvet-business",
    name: "Non-TVET Diploma in Business Administration",
    duration: 10,
    skills: ["digitalMarketing", "basicAdmin"]
  },
  {
    id: "non-tvet-it",
    name: "Non-TVET Diploma in Information Systems",
    duration: 11,
    skills: ["dataAnalytics", "cloudSupport"]
  },
  {
    id: "tvet-industry",
    name: "TVET Industrial Mechatronics",
    duration: 12,
    skills: ["advancedManufacturing", "cloudSupport"]
  },
  {
    id: "degree-civil",
    name: "Degree in Civil Engineering",
    duration: 16,
    skills: ["advancedManufacturing", "renewableEnergy"]
  },
  {
    id: "degree-electrical",
    name: "Degree in Electrical Engineering",
    duration: 16,
    skills: ["renewableEnergy", "cloudSupport"]
  },
  {
    id: "degree-mechanical",
    name: "Degree in Mechanical Engineering",
    duration: 16,
    skills: ["advancedManufacturing", "cloudSupport"]
  }
];

const internships = [
  { id: "intern-petronas", name: "PETRONAS Operations Internship", experienceBoost: 14, demandBias: "advancedManufacturing", duration: 5 },
  { id: "intern-tnb", name: "TNB Grid and Energy Internship", experienceBoost: 15, demandBias: "renewableEnergy", duration: 5 },
  { id: "intern-mimos", name: "MIMOS Digital Systems Internship", experienceBoost: 13, demandBias: "dataAnalytics", duration: 5 },
  { id: "intern-sime", name: "Sime Darby Engineering Internship", experienceBoost: 12, demandBias: "cloudSupport", duration: 5 },
  { id: "intern-cimb", name: "CIMB Operations Internship", experienceBoost: 10, demandBias: "digitalMarketing", duration: 4 }
];

const degreeOptions = [
  { id: "degree-civil", name: "Degree in Civil Engineering", signalBoost: 15, skills: ["advancedManufacturing", "renewableEnergy"] },
  { id: "degree-electrical", name: "Degree in Electrical Engineering", signalBoost: 16, skills: ["renewableEnergy", "cloudSupport"] },
  { id: "degree-mechanical", name: "Degree in Mechanical Engineering", signalBoost: 16, skills: ["advancedManufacturing", "cloudSupport"] }
];

const yearRange = document.getElementById("yearRange");
const yearLabel = document.getElementById("yearLabel");
const simulateBtn = document.getElementById("simulateBtn");
const prevBtn = document.getElementById("prevBtn");
const nextBtn = document.getElementById("nextBtn");
const stepCounter = document.getElementById("stepCounter");
const stepTitle = document.getElementById("stepTitle");
const questionSteps = Array.from(document.querySelectorAll(".question-step"));

const programSelect = document.getElementById("programSelect");
const internshipSelect = document.getElementById("internshipSelect");
const degreeSelect = document.getElementById("degreeSelect");
const scenarioSelect = document.getElementById("scenarioSelect");

const hireProbabilityEl = document.getElementById("hireProbability");
const salaryLevelEl = document.getElementById("salaryLevel");
const employmentTimeEl = document.getElementById("employmentTime");
const insightTextEl = document.getElementById("insightText");
const resultsPanel = document.getElementById("resultsPanel");

let activeStep = 0;

function populateSelect(select, items) {
  items.forEach((item) => {
    const option = document.createElement("option");
    option.value = item.id;
    option.textContent = item.name;
    select.appendChild(option);
  });
}

populateSelect(programSelect, programs);
populateSelect(internshipSelect, internships);
populateSelect(degreeSelect, degreeOptions);

yearRange.addEventListener("input", () => {
  yearLabel.textContent = yearRange.value;
});

function updateStepUI() {
  questionSteps.forEach((step, idx) => {
    step.classList.toggle("active", idx === activeStep);
  });

  stepCounter.textContent = `Question ${activeStep + 1} of ${questionSteps.length}`;
  stepTitle.textContent = questionSteps[activeStep].dataset.stepTitle;

  prevBtn.disabled = activeStep === 0;
  nextBtn.classList.toggle("hidden", activeStep === questionSteps.length - 1);
  simulateBtn.classList.toggle("hidden", activeStep !== questionSteps.length - 1);
}

prevBtn.addEventListener("click", () => {
  if (activeStep > 0) {
    activeStep -= 1;
    updateStepUI();
  }
});

nextBtn.addEventListener("click", () => {
  if (activeStep < questionSteps.length - 1) {
    activeStep += 1;
    updateStepUI();
  }
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
  const selectedProgram = programs.find((x) => x.id === programSelect.value);
  const selectedInternship = internships.find((x) => x.id === internshipSelect.value);
  const selectedDegree = degreeOptions.find((x) => x.id === degreeSelect.value);

  const year = Number(yearRange.value);
  const scenario = scenarioSelect.value;

  const chosenSkills = new Set([...selectedProgram.skills, selectedInternship.demandBias, ...selectedDegree.skills]);

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
  const degreeAdvantage = selectedDegree.signalBoost;

  const employabilityRaw =
    (demandAverage - oversupplyAverage) / 22 +
    internshipAdvantage / 18 +
    degreeAdvantage / 22 -
    selectedProgram.duration / 28;

  const hireProbability = logisticScore(employabilityRaw) * 100;

  const baseSalary = 2200;
  const scenarioMultiplier =
    scenario === "global-slowdown" ? 0.94 : scenario === "green-shift" ? 1.06 : scenario === "automation-wave" ? 1.04 : 1;

  const estimatedSalary =
    (baseSalary + salaryPremium / chosenSkills.size + selectedInternship.experienceBoost * 30 + selectedDegree.signalBoost * 22) *
    scenarioMultiplier;

  const timeToEmployment = Math.max(
    1,
    Math.round(
      12 +
        selectedProgram.duration * 0.28 +
        (oversupplyAverage - demandAverage) / 24 -
        selectedInternship.experienceBoost / 3.4 -
        selectedDegree.signalBoost / 6
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
    `Internship exposure and degree signalling improve employability, while longer training delays entry.`;

  resultsPanel.classList.remove("hidden");
}

simulateBtn.addEventListener("click", simulate);
updateStepUI();
