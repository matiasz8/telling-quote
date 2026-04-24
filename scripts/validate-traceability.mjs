#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const indexPath = path.join(root, 'FEATURE_INDEX.json');

function fail(message) {
  console.error(`TRACEABILITY ERROR: ${message}`);
  process.exitCode = 1;
}

function exists(relPath) {
  return fs.existsSync(path.join(root, relPath));
}

if (!fs.existsSync(indexPath)) {
  console.error('TRACEABILITY ERROR: FEATURE_INDEX.json not found at repository root.');
  process.exit(1);
}

const raw = fs.readFileSync(indexPath, 'utf-8');
let parsed;

try {
  parsed = JSON.parse(raw);
} catch (error) {
  console.error('TRACEABILITY ERROR: FEATURE_INDEX.json is not valid JSON.');
  console.error(error instanceof Error ? error.message : String(error));
  process.exit(1);
}

if (!Array.isArray(parsed.features)) {
  console.error('TRACEABILITY ERROR: FEATURE_INDEX.json must contain a features[] array.');
  process.exit(1);
}

for (const feature of parsed.features) {
  const id = feature?.id || 'UNKNOWN-ID';
  const prdId = feature?.prd_id || id;
  const trdId = feature?.trd_id;
  const prdLink = feature?.prd_link;
  const trdLink = feature?.trd_link;
  const status = feature?.status || 'draft';
  const requiresTrd = status === 'completed' || status === 'in-progress';

  if (!prdId) {
    fail(`${id} is missing prd_id.`);
    continue;
  }

  if (!prdLink) {
    fail(`${id} is missing prd_link.`);
    continue;
  }

  if (requiresTrd && (!trdId || !trdLink)) {
    fail(`${id} must define trd_id and trd_link because status is ${status}.`);
    continue;
  }

  if (!exists(prdLink)) {
    fail(`${id} points to missing PRD file: ${prdLink}`);
  }

  if (trdLink && !exists(trdLink)) {
    fail(`${id} points to missing TRD file: ${trdLink}`);
  }

  if (!String(prdLink).includes(prdId)) {
    fail(`${id} has prd_link (${prdLink}) not matching prd_id (${prdId}).`);
  }

  if (trdId && trdLink && !String(trdLink).includes(trdId)) {
    fail(`${id} has trd_link (${trdLink}) not matching trd_id (${trdId}).`);
  }
}

if (process.exitCode === 1) {
  console.error('\nTraceability validation failed.');
  process.exit(1);
}

console.log(`Traceability validation passed for ${parsed.features.length} features.`);
