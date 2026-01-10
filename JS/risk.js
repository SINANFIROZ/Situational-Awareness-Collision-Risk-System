// Contains collision risk calculations (CPA / TCPA)

export function calculateTCPA(ownShip, target) {
  // Relative position
  const dx = target.x - ownShip.x;
  const dy = target.y - ownShip.y;

  // Relative velocity
  const rvx = target.velocity.vx - ownShip.velocity.vx;
  const rvy = target.velocity.vy - ownShip.velocity.vy;

  const relativeSpeedSquared = rvx * rvx + rvy * rvy;

  // If relative speed is zero, TCPA is infinite
  if (relativeSpeedSquared === 0) {
    return Infinity;
  }

  // TCPA formula (time to closest approach)
  const tcpa = -((dx * rvx + dy * rvy) / relativeSpeedSquared);

  return tcpa;
}

export function calculateCPA(ownShip, target, tcpa) {
  // Positions at time of CPA
  const ownX = ownShip.x + ownShip.velocity.vx * tcpa;
  const ownY = ownShip.y + ownShip.velocity.vy * tcpa;

  const tgtX = target.x + target.velocity.vx * tcpa;
  const tgtY = target.y + target.velocity.vy * tcpa;

  // Distance between vessels at CPA
  const dx = tgtX - ownX;
  const dy = tgtY - ownY;

  return Math.sqrt(dx * dx + dy * dy);
}

export function classifyRisk(tcpa, cpa, thresholds) {
  if (tcpa < 0) {
    return "SAFE"; // Target is moving away
  }

  if (
    cpa <= thresholds.dangerCPA &&
    tcpa <= thresholds.dangerTCPA
  ) {
    return "DANGER";
  }

  if (
    cpa <= thresholds.warningCPA &&
    tcpa <= thresholds.warningTCPA
  ) {
    return "WARNING";
  }

  return "SAFE";
}
