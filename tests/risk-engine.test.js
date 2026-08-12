import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateTCPA,
  calculateCPA,
  classifyRisk,
  evaluateRisk,
} from '../shared/risk-engine.js';

const ownShip = {
  x: 0,
  y: 0,
  velocity: { vx: 0, vy: 0 },
};

test('calculateTCPA returns Infinity when relative speed is zero', () => {
  const target = {
    x: 100,
    y: 100,
    velocity: { vx: 0, vy: 0 },
  };

  const tcpa = calculateTCPA(ownShip, target);
  assert.equal(tcpa, Infinity);
});

test('classifyRisk returns SAFE for negative TCPA', () => {
  const risk = classifyRisk(-1, 1);
  assert.equal(risk, 'SAFE');
});

test('classifyRisk returns WARNING on warning boundary', () => {
  const risk = classifyRisk(25, 60);
  assert.equal(risk, 'WARNING');
});

test('classifyRisk returns DANGER on danger boundary', () => {
  const risk = classifyRisk(10, 30);
  assert.equal(risk, 'DANGER');
});

test('evaluateRisk returns deterministic values for straight-line approach', () => {
  const target = {
    x: 100,
    y: 0,
    velocity: { vx: -10, vy: 0 },
  };

  const result = evaluateRisk(ownShip, target);
  assert.equal(result.tcpa, 10);
  assert.equal(result.cpa, 0);
  assert.equal(result.risk, 'DANGER');
});

test('calculateCPA uses the provided TCPA', () => {
  const target = {
    x: 100,
    y: 100,
    velocity: { vx: -10, vy: 0 },
  };

  const cpa = calculateCPA(ownShip, target, 10);
  assert.equal(cpa, 100);
});
