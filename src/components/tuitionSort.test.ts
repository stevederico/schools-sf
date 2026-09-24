/**
 * Tuition parsing and sorting tests.
 *
 * Uses Node.js built-in test runner (node --test) to match the project standard.
 */
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { parseTuition, compareTuition } from './tuitionSort.ts';

describe('parseTuition', () => {
  it('parses a simple annual amount', () => {
    assert.deepEqual(parseTuition('$29,550/year (2026-2027)'), {
      min: 29550,
      max: 29550,
      isUnknown: false,
    });
  });

  it('parses an annual range', () => {
    assert.deepEqual(parseTuition('$14,090-$41,138/year (2026-2027)'), {
      min: 14090,
      max: 41138,
      isUnknown: false,
    });
  });

  it('converts monthly to annual', () => {
    assert.deepEqual(parseTuition('$2,200/month'), {
      min: 26400,
      max: 26400,
      isUnknown: false,
    });
  });

  it('converts monthly range to annual', () => {
    assert.deepEqual(parseTuition('$1,435-$3,105/month (preschool or toddler, 2-5 days/week)'), {
      min: 17220,
      max: 37260,
      isUnknown: false,
    });
  });

  it('treats "Public (free)" as $0', () => {
    assert.deepEqual(parseTuition('Public (free)'), { min: 0, max: 0, isUnknown: false });
  });

  it('treats "Free via ELFA..." as $0 (dominant outcome)', () => {
    assert.deepEqual(parseTuition('Free via ELFA (SF residents ≤110% AMI) or $2,200/month tuition-based'), {
      min: 0,
      max: 0,
      isUnknown: false,
    });
  });

  it('flags "Not publicly available" as unknown', () => {
    assert.deepEqual(parseTuition('Not publicly available (contact 415-323-6343)'), {
      min: null,
      max: null,
      isUnknown: true,
    });
  });

  it('flags "Contact for quote" as unknown', () => {
    assert.deepEqual(parseTuition('Contact for quote (chain pricing varies)'), {
      min: null,
      max: null,
      isUnknown: true,
    });
  });

  it('flags sliding-scale without numbers as unknown', () => {
    assert.deepEqual(parseTuition('Sliding scale; free via ELFA (≤110% AMI) or subsidized based on income'), {
      min: null,
      max: null,
      isUnknown: true,
    });
  });

  it('flags "Operating status uncertain" as unknown', () => {
    assert.deepEqual(parseTuition('Operating status uncertain (closing sale reported; verify before applying)'), {
      min: null,
      max: null,
      isUnknown: true,
    });
  });

  it('handles null/undefined/empty', () => {
    assert.equal(parseTuition(null).isUnknown, true);
    assert.equal(parseTuition(undefined).isUnknown, true);
    assert.equal(parseTuition('').isUnknown, true);
  });
});

describe('compareTuition', () => {
  const schoolA = { name: 'A School', tuition: '$10,000/year' };
  const schoolB = { name: 'B School', tuition: '$50,000/year' };
  const schoolC = { name: 'C School', tuition: '$5,000-$30,000/year' };
  const unknownSchool = { name: 'U School', tuition: 'Not publicly available' };

  it('sorts ascending by min value', () => {
    const list = [schoolB, schoolC, schoolA];
    list.sort((a, b) => compareTuition(a, b, 'asc'));
    // min values: C=5000, A=10000, B=50000
    assert.deepEqual(list.map((s) => s.name), ['C School', 'A School', 'B School']);
  });

  it('sorts descending by max value', () => {
    const list = [schoolA, schoolC, schoolB];
    list.sort((a, b) => compareTuition(a, b, 'desc'));
    // max values: B=50000, C=30000, A=10000
    assert.deepEqual(list.map((s) => s.name), ['B School', 'C School', 'A School']);
  });

  it('places unknown at the end when sorting ascending', () => {
    const list = [unknownSchool, schoolA, schoolB];
    list.sort((a, b) => compareTuition(a, b, 'asc'));
    assert.deepEqual(list.map((s) => s.name), ['A School', 'B School', 'U School']);
  });

  it('places unknown at the top when sorting descending', () => {
    const list = [schoolA, schoolB, unknownSchool];
    list.sort((a, b) => compareTuition(a, b, 'desc'));
    assert.deepEqual(list.map((s) => s.name), ['U School', 'B School', 'A School']);
  });

  it('breaks ties alphabetically', () => {
    const dup1 = { name: 'Zebra', tuition: '$10,000/year' };
    const dup2 = { name: 'Alpha', tuition: '$10,000/year' };
    const list = [dup1, dup2];
    list.sort((a, b) => compareTuition(a, b, 'asc'));
    assert.deepEqual(list.map((s) => s.name), ['Alpha', 'Zebra']);
  });
});
