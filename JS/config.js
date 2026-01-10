// Central configuration for simulation and risk thresholds

export const SIMULATION = {
  timeStep: 0.05,        // seconds per frame
  canvasWidth: 800,
  canvasHeight: 600
};

export const RISK_THRESHOLDS = {
  // Distance units are arbitrary but consistent
  dangerCPA: 30,         // very close
  dangerTCPA: 10,        // seconds

  warningCPA: 60,        // moderate distance
  warningTCPA: 25        // seconds
};

export const COLORS = {
  ownShip: "#0066ff",
  safeTarget: "#00aa00",
  warningTarget: "#ffaa00",
  dangerTarget: "#ff0000"
};
