/**
 * Parse a tuition string into a numeric range (annual) for sorting.
 *
 * Tuition strings are inconsistent across schools — some are annual, some monthly,
 * some ranges, some free, some explicitly unknown. This normalizes everything to
 * annual dollar values so we can sort by price.
 *
 * Returns:
 *   { min, max, isUnknown }
 *   - isUnknown: true for "Not publicly available" / "Contact for quote" / sliding-scale-only
 *   - min/max: annual dollars (e.g. "$2,200/month" → 26400 for both min and max)
 */
export function parseTuition(tuition) {
  if (!tuition) return { min: null, max: null, isUnknown: true };

  const s = tuition.trim();
  const lower = s.toLowerCase();

  // Explicit unknown markers
  if (
    lower.includes('not publicly available') ||
    lower.includes('contact for') ||
    lower.includes('operating status uncertain')
  ) {
    return { min: null, max: null, isUnknown: true };
  }

  // Public / free — sorts as $0 (the dominant real-world outcome for most families)
  if (lower.startsWith('public') || lower.startsWith('free')) {
    return { min: 0, max: 0, isUnknown: false };
  }

  // Sliding scale without explicit numeric bounds is effectively unknown
  if (lower.startsWith('sliding') && !/\$/.test(s)) {
    return { min: null, max: null, isUnknown: true };
  }

  // Extract dollar amounts with optional commas/decimals
  const matches = [...s.matchAll(/\$([\d,]+)(?:\.\d+)?/g)];
  if (matches.length === 0) return { min: null, max: null, isUnknown: true };

  const numbers = matches.map((m) => parseInt(m[1].replace(/,/g, ''), 10));
  const min = Math.min(...numbers);
  const max = Math.max(...numbers);

  const isMonthly = /\/(month|mo)\b/i.test(s);
  if (isMonthly) return { min: min * 12, max: max * 12, isUnknown: false };

  return { min, max, isUnknown: false };
}

/**
 * Compare two schools by tuition for sorting.
 *
 * Unknown tuition sorts above the highest known price:
 *   - "low → high" (asc): unknowns at the bottom
 *   - "high → low" (desc): unknowns at the top
 *
 * Ranges use min for ascending (cheapest entry point) and max for descending
 * (most expensive ceiling), so wide-range schools rank appropriately in both
 * directions. Ties break alphabetically by name for stable ordering.
 */
export function compareTuition(a, b, direction) {
  const pa = parseTuition(a.tuition);
  const pb = parseTuition(b.tuition);

  const vA = pa.isUnknown ? Infinity : direction === 'asc' ? pa.min : pa.max;
  const vB = pb.isUnknown ? Infinity : direction === 'asc' ? pb.min : pb.max;

  if (vA === vB) return a.name.localeCompare(b.name);
  return direction === 'desc' ? vB - vA : vA - vB;
}
