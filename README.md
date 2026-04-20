# UKM Statistics

## Skill Gap -> Employment Simulator

An interactive simulation for job seekers to test how skill-building choices affect employability outcomes.

### Concept

The simulator models a learner deciding between:
- TVET courses
- internships
- certifications

It then projects labour market outcomes over time using demand and oversupply logic.

### Gameplay Flow

1. Select a TVET program.
2. Select an internship.
3. Select a certification.
4. Pick a labour market scenario.
5. Move the year slider to simulate labour market changes over time.
6. Run simulation.

### Outputs

- Probability of getting hired
- Estimated salary level (monthly)
- Estimated time to employment

### Demand Logic (Core Twist)

The model uses demand-aware scoring:
- High-demand skills increase hiring probability and salary.
- Oversupplied skills increase competition and can reduce hiring probability.
- Market scenarios (green transition, automation wave, slowdown) shift demand by year.
- Internship and certification choices add experience/signal effects.

## Project Files

- [index.html](index.html): UI structure and controls
- [styles.css](styles.css): visual design and responsive layout
- [script.js](script.js): simulation data model and scoring logic

## Run Locally

Open [index.html](index.html) in a browser.

Optional quick local server:

```bash
cd /workspaces/ukm-statistics
python3 -m http.server 8080
```

Then open http://localhost:8080.