const DEFAULT_THRESHOLDS = {
  dangerCPA: 30,
  dangerTCPA: 10,
  warningCPA: 60,
  warningTCPA: 25,
};

function assertFiniteNumber(value, name) {
  if (!Number.isFinite(value)) {
    throw new Error(`${name} must be a finite number`);
  }
}

function validateShip(ship, name) {
  if (!ship || typeof ship !== 'object') {
    throw new Error(`${name} must be an object`);
  }

  assertFiniteNumber(ship.x, `${name}.x`);
  assertFiniteNumber(ship.y, `${name}.y`);

  if (!ship.velocity || typeof ship.velocity !== 'object') {
    throw new Error(`${name}.velocity must be an object`);
  }

  assertFiniteNumber(ship.velocity.vx, `${name}.velocity.vx`);
  assertFiniteNumber(ship.velocity.vy, `${name}.velocity.vy`);
}

function validateThresholds(thresholds) {
  assertFiniteNumber(thresholds.dangerCPA, 'thresholds.dangerCPA');
  assertFiniteNumber(thresholds.dangerTCPA, 'thresholds.dangerTCPA');
  assertFiniteNumber(thresholds.warningCPA, 'thresholds.warningCPA');
  assertFiniteNumber(thresholds.warningTCPA, 'thresholds.warningTCPA');
}

export function calculateTCPA(ownShip, target) {
  validateShip(ownShip, 'ownShip');
  validateShip(target, 'target');

  const dx = target.x - ownShip.x;
  const dy = target.y - ownShip.y;

  const rvx = target.velocity.vx - ownShip.velocity.vx;
  const rvy = target.velocity.vy - ownShip.velocity.vy;

  const relativeSpeedSquared = rvx * rvx + rvy * rvy;

  if (relativeSpeedSquared === 0) {
    return Infinity;
  }

  return -((dx * rvx + dy * rvy) / relativeSpeedSquared);
}

export function calculateCPA(ownShip, target, tcpa) {
  validateShip(ownShip, 'ownShip');
  validateShip(target, 'target');

  if (!(Number.isFinite(tcpa) || tcpa === Infinity)) {
    throw new Error('tcpa must be a finite number or Infinity');
  }

  const ownX = ownShip.x + ownShip.velocity.vx * tcpa;
  const ownY = ownShip.y + ownShip.velocity.vy * tcpa;

  const targetX = target.x + target.velocity.vx * tcpa;
  const targetY = target.y + target.velocity.vy * tcpa;

  const dx = targetX - ownX;
  const dy = targetY - ownY;

  return Math.sqrt(dx * dx + dy * dy);
}

export function classifyRisk(tcpa, cpa, thresholds = DEFAULT_THRESHOLDS) {
  if (!(Number.isFinite(tcpa) || tcpa === Infinity)) {
    throw new Error('tcpa must be a finite number or Infinity');
  }

  assertFiniteNumber(cpa, 'cpa');

  const mergedThresholds = {
    ...DEFAULT_THRESHOLDS,
    ...thresholds,
  };

  validateThresholds(mergedThresholds);

  if (tcpa < 0) {
    return 'SAFE';
  }

  if (cpa <= mergedThresholds.dangerCPA && tcpa <= mergedThresholds.dangerTCPA) {
    return 'DANGER';
  }

  if (cpa <= mergedThresholds.warningCPA && tcpa <= mergedThresholds.warningTCPA) {
    return 'WARNING';
  }

  return 'SAFE';
}

export function evaluateRisk(ownShip, target, thresholds = DEFAULT_THRESHOLDS) {
  const tcpa = calculateTCPA(ownShip, target);
  const cpa = calculateCPA(ownShip, target, tcpa);
  const risk = classifyRisk(tcpa, cpa, thresholds);

  return { tcpa, cpa, risk };
}

export { DEFAULT_THRESHOLDS };
