import express from 'express';
import { evaluateRisk, DEFAULT_THRESHOLDS } from '../../shared/risk-engine.js';

function serializeNumber(value) {
  return Number.isFinite(value) ? value : null;
}

export function createApp() {
  const app = express();

  app.use(express.json());

  app.get('/api/v1/health', (_req, res) => {
    res.status(200).json({ status: 'ok' });
  });

  app.post('/api/v1/risk/evaluate', (req, res) => {
    try {
      const { ownShip, target, thresholds } = req.body ?? {};
      const result = evaluateRisk(ownShip, target, {
        ...DEFAULT_THRESHOLDS,
        ...thresholds,
      });

      res.status(200).json({
        tcpa: serializeNumber(result.tcpa),
        cpa: serializeNumber(result.cpa),
        risk: result.risk,
      });
    } catch (error) {
      res.status(400).json({
        error: 'INVALID_INPUT',
        message: error.message,
      });
    }
  });

  return app;
}
