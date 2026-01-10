// Entry point for simulation and rendering

import { Vessel } from "./vessel.js";
import {
  calculateTCPA,
  calculateCPA,
  classifyRisk
} from "./risk.js";
import {
  SIMULATION,
  RISK_THRESHOLDS,
  COLORS
} from "./config.js";

// Canvas setup
const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.width = SIMULATION.canvasWidth;
canvas.height = SIMULATION.canvasHeight;


// Hover state
let highlightedTargetId = null;

// Hover detection on risk cards
document.addEventListener("mouseover", (e) => {
  const card = e.target.closest(".risk-card");

  if (card && card.dataset.target) {
    highlightedTargetId = card.dataset.target;
  }
});

document.addEventListener("mouseout", (e) => {
  const card = e.target.closest(".risk-card");

  if (card) {
    highlightedTargetId = null;
  }
});


// Create vessels
const ownShip = new Vessel(
  "OWN",
  canvas.width / 2,
  canvas.height / 2,
  0,
  0,
  true
);

const TARGET_COUNT = 6;
const targets = [];

for (let i = 0; i < TARGET_COUNT; i++) {
  targets.push(
    new Vessel(
      `T${i + 1}`,
      Math.random() * canvas.width,
      Math.random() * canvas.height,
      20 + Math.random() * 40,
      Math.random() * 360
    )
  );
}


// Simulation state
let running = false;
let lastTime = null;


// Controls
document.getElementById("startBtn").onclick = () => {
  running = true;
};

document.getElementById("pauseBtn").onclick = () => {
  running = false;
};


// Main loop
function loop(timestamp) {
  if (!lastTime) lastTime = timestamp;

  const dt = (timestamp - lastTime) / 1000;
  lastTime = timestamp;

  if (running) {
    update(dt);
  }

  render();
  requestAnimationFrame(loop);
}

requestAnimationFrame(loop);


// Update logic
function update(dt) {
  targets.forEach((t) => {
    t.update(dt);
    wrapAround(t);
  });
}


// Render logic
function render() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw own ship
  drawVessel(ownShip, COLORS.ownShip);

  const riskData = [];

  targets.forEach((target) => {
    const tcpa = calculateTCPA(ownShip, target);
    const cpa = calculateCPA(ownShip, target, tcpa);
    const risk = classifyRisk(tcpa, cpa, RISK_THRESHOLDS);

    // Collision handling
    if (risk === "DANGER" && checkCollision(ownShip, target)) {
      running = false;
      showEmergencyAlert(target);
    }

    let color = COLORS.safeTarget;
    if (risk === "WARNING") color = COLORS.warningTarget;
    if (risk === "DANGER") color = COLORS.dangerTarget;

    drawVessel(target, color);

    riskData.push({
      id: target.id,
      tcpa,
      cpa,
      risk
    });
  });

  updateInfoPanel(riskData);
  updateFocusPanel(riskData);
}


// Drawing
function drawVessel(vessel, color) {
  ctx.save();

  ctx.translate(vessel.x, vessel.y);
  ctx.rotate(vessel.headingRad);

  ctx.beginPath();

  if (vessel.isOwnShip) {
    ctx.moveTo(14, 0);
    ctx.lineTo(6, -8);
    ctx.lineTo(-10, -10);
    ctx.lineTo(-14, 0);
    ctx.lineTo(-10, 10);
    ctx.lineTo(6, 8);
  } else {
    ctx.moveTo(12, 0);
    ctx.lineTo(4, -7);
    ctx.lineTo(-10, -7);
    ctx.lineTo(-12, 0);
    ctx.lineTo(-10, 7);
    ctx.lineTo(4, 7);
  }

  ctx.closePath();

  ctx.fillStyle = color;
  ctx.fill();

  // Default outline
  ctx.strokeStyle = "#222";
  ctx.lineWidth = 1;
  ctx.stroke();

  // Highlight + label on hover
  if (vessel.id === highlightedTargetId) {
    ctx.strokeStyle = "#000";
    ctx.lineWidth = 3;
    ctx.stroke();

    ctx.font = "12px Arial";
    ctx.fillStyle = "#000";
    ctx.fillText(vessel.id, 16, -16);
  }

  // Bridge for own ship
  if (vessel.isOwnShip) {
    ctx.beginPath();
    ctx.rect(-2, -4, 6, 8);
    ctx.fillStyle = "#ffffff";
    ctx.fill();
    ctx.stroke();
  }

  ctx.restore();
}


// Panels
function updateInfoPanel(riskData) {
  const panel = document.getElementById("info");

  panel.innerHTML = riskData
    .map((d) => {
      let riskClass = "risk-safe";
      if (d.risk === "WARNING") riskClass = "risk-warning";
      if (d.risk === "DANGER") riskClass = "risk-danger";

      return `
        <div class="risk-card ${riskClass}" data-target="${d.id}">
          <div class="risk-header">
            <span class="risk-id">${d.id}</span>
            <span class="risk-status">${d.risk}</span>
          </div>
          <div class="risk-metrics">
            <div>TCPA: <b>${d.tcpa.toFixed(2)} s</b></div>
            <div>CPA: <b>${d.cpa.toFixed(2)} units</b></div>
          </div>
        </div>
      `;
    })
    .join("");
}

function updateFocusPanel(riskData) {
  const panel = document.getElementById("focusPanel");

  const dangerTargets = riskData.filter(
    (r) => r.risk === "DANGER" && r.tcpa > 0
  );

  if (dangerTargets.length === 0) {
    panel.innerHTML = "No immediate threats";
    return;
  }

  const critical = dangerTargets.reduce((a, b) =>
    a.tcpa < b.tcpa ? a : b
  );

  panel.innerHTML = `
    <div class="focus-danger">
      Target ${critical.id}<br/>
      TCPA: ${critical.tcpa.toFixed(2)} s<br/>
      CPA: ${critical.cpa.toFixed(2)} units
    </div>
  `;
}


// Helpers
function wrapAround(vessel) {
  if (vessel.x < 0) vessel.x = canvas.width;
  if (vessel.x > canvas.width) vessel.x = 0;
  if (vessel.y < 0) vessel.y = canvas.height;
  if (vessel.y > canvas.height) vessel.y = 0;
}

function checkCollision(a, b) {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  const distance = Math.sqrt(dx * dx + dy * dy);

  const ra = a.isOwnShip ? 14 : 12;
  const rb = b.isOwnShip ? 14 : 12;

  return distance <= ra + rb;
}

function showEmergencyAlert(target) {
  const banner = document.getElementById("emergencyBanner");
  banner.style.display = "block";

  const panel = document.getElementById("info");
  panel.innerHTML = `
    <div class="emergency">
      <strong>COLLISION CONFIRMED</strong><br/>
      Target: ${target.id}<br/>
      Immediate operator action required.
    </div>
  `;
}
