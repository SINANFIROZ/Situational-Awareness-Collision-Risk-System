# Situational Awareness & Collision Risk System

## Overview
This project implements a **local, browser-based situational awareness system** that simulates vessel motion and evaluates collision risk using **CPA (Closest Point of Approach)** and **TCPA (Time to Closest Point of Approach)**.

The system is designed as a **decision-support tool**, not an autonomous controller.  
It provides clear visual and textual indications of potential collision threats.

---

## Key Features
- Simulation of own vessel and multiple target vessels
- Real-time CPA and TCPA calculations
- Risk classification: SAFE, WARNING, DANGER
- Visual risk indication on canvas
- Emergency detection on collision
- Critical target prioritization
- Interactive identification (hover-to-highlight)
- Runs completely **locally** (no server, no backend)

---

## Technology Stack
- HTML5 Canvas
- Vanilla JavaScript (ES Modules)
- CSS (no frameworks)

---

## How to Run

1. Download or clone the repository
2. Open `index.html` directly in a modern web browser
3. Click **Start** to begin the simulation

No installation, build steps, or server setup required.

---

## System Design

### Vessel Model
Each vessel has:
- Position (x, y)
- Speed
- Heading
- Derived velocity vector

Motion is updated using basic trigonometry.

---

### Risk Calculation
- **TCPA** is calculated using relative velocity and position vectors
- **CPA** is calculated as the minimum distance at TCPA
- Risk levels are classified using configurable thresholds

---

### Risk Prioritization
- Multiple vessels can be in DANGER state simultaneously
- Only **one Critical Target** is highlighted
- The critical target is selected based on **smallest positive TCPA**
- This reflects real-world operator prioritization logic

---

### Visualization & Interaction
- Vessels are rendered as vector ship shapes
- Color-coded risk levels
- Hovering over a risk entry highlights the corresponding vessel on the canvas
- Critical target details are shown separately for quick operator focus

---

### Emergency Handling
- Collision is detected based on proximity thresholds
- Simulation stops immediately on collision
- A persistent emergency banner and message are displayed
- No automatic avoidance actions are taken (operator decision-support only)

---

## Assumptions & Limitations
- Simplified 2D Cartesian plane (not geospatial)
- No real-world nautical charts or AIS data
- No autonomous navigation or avoidance logic
- Intended for demonstration and assessment purposes

---

## Extensibility
The system is designed to be easily extended with:
- Additional vessels
- Improved risk models
- Operator controls (speed/heading)
- Event logging or replay

---

## Author Notes
This implementation focuses on **clarity, correctness, and realistic system behavior**, avoiding unnecessary UI complexity or overengineering, in line with the assessment requirements.
