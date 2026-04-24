#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();

const PRD_DIR = path.join(root, 'docs', 'prd');
const TRD_DIR = path.join(root, 'docs', 'trd');

const FAIL_STATUSES = new Set(['completed', 'in progress', 'approved']);
const STRICT_FROM_ID = 16;

function normalizeStatus(value) {
  return String(value || '')
    .replace(/[*_`]/g, '')
    .replace(/[|]/g, '')
    .replace(/[^a-zA-Z\s-]/g, '')
    .trim()
    .toLowerCase();
}

function extractStatus(content) {
  const line = content
    .split('\n')
    .find((l) => /\*\*Status/i.test(l) || /^Status\s*:/i.test(l));

  if (!line) return 'draft';
  const value = line.split(':').slice(1).join(':').trim();
  return normalizeStatus(value);
}

function fileList(dir, prefix) {
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((name) => name.startsWith(prefix) && name.endsWith('.md'))
    .sort();
}

function hasHeadingLike(content, candidates) {
  return candidates.some((candidate) => {
    const pattern = new RegExp(`^#{2,6}\\s+.*${candidate}.*$`, 'im');
    return pattern.test(content);
  });
}

function hasRelatedPrdReference(content) {
  return /^\*\*Related PRD:?\*\*/im.test(content) || hasHeadingLike(content, ['Related\\s+PRD']);
}

function ensureTitlePrefix(content, expectedPrefix) {
  const firstHeading = content.split('\n').find((line) => line.startsWith('# '));
  if (!firstHeading) return false;
  return firstHeading.toUpperCase().includes(expectedPrefix.toUpperCase());
}

function validateDoc(filePath, type) {
  const content = fs.readFileSync(filePath, 'utf-8');
  const status = extractStatus(content);
  const fileName = path.basename(filePath);
  const numericId = Number((fileName.match(/^[A-Z]+-(\d+)/i) || [])[1] || '0');
  const mustBeStrict = FAIL_STATUSES.has(status) && numericId >= STRICT_FROM_ID;
  const issues = [];

  if (!ensureTitlePrefix(content, type)) {
    issues.push(`${path.relative(root, filePath)} has invalid title prefix (expected ${type}).`);
  }

  const requiredSections =
    type === 'PRD'
      ? [
          { name: 'Overview', candidates: ['Overview'] },
          { name: 'Problem', candidates: ['Problem', 'Problem\\s+Statement'] },
          { name: 'Requirements', candidates: ['Requirements', 'Functional\\s+Requirements', 'Detailed\\s+Requirements'] },
          { name: 'Success Metrics', candidates: ['Success\\s+Metrics', 'Success\\s+Criteria'] },
        ]
      : [
          { name: 'Overview', candidates: ['Overview'] },
          { name: 'Related PRD', candidates: ['Related\\s+PRD'] },
          { name: 'Implementation', candidates: ['Implementation', 'Implementation\\s+Plan', 'Core\\s+Implementation', 'Time\\s+Calculation\\s+Algorithm'] },
          { name: 'Testing', candidates: ['Testing', 'Testing\\s+Strategy', 'Verification'] },
        ];

  for (const section of requiredSections) {
    const hasSection =
      type === 'TRD' && section.name === 'Related PRD'
        ? hasRelatedPrdReference(content)
        : hasHeadingLike(content, section.candidates);

    if (!hasSection) {
      const message = `${path.relative(root, filePath)} missing section matching "${section.name}".`;
      if (mustBeStrict) {
        issues.push(message);
      } else {
        console.warn(`TRACEABILITY WARN: ${message} (status: ${status || 'draft'})`);
      }
    }
  }

  return issues;
}

const prdFiles = fileList(PRD_DIR, 'PRD-');
const trdFiles = fileList(TRD_DIR, 'TRD-');

let hasErrors = false;

for (const file of prdFiles) {
  const full = path.join(PRD_DIR, file);
  const issues = validateDoc(full, 'PRD');
  if (issues.length > 0) {
    hasErrors = true;
    issues.forEach((issue) => console.error(`TRACEABILITY ERROR: ${issue}`));
  }
}

for (const file of trdFiles) {
  const full = path.join(TRD_DIR, file);
  const issues = validateDoc(full, 'TRD');
  if (issues.length > 0) {
    hasErrors = true;
    issues.forEach((issue) => console.error(`TRACEABILITY ERROR: ${issue}`));
  }
}

if (hasErrors) {
  console.error('\nPRD/TRD validation failed.');
  process.exit(1);
}

console.log(`PRD/TRD validation passed (${prdFiles.length} PRDs, ${trdFiles.length} TRDs checked).`);
