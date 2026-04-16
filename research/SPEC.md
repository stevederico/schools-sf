# Spec — Schools Deep Research (Broad Pass)

## Goal

Deep research every school in the database — both preschools and upper schools — to enrich tuition AND notes with verifiable information from primary sources. This is the **broad pass**; a follow-up spec will narrow in on gaps.

## Database

- Path: `backend/databases/preschools.db`
- Tables: `preschools` (~52 rows), `upperschools` (~40 rows)
- Relevant columns:
  - `name` — school name
  - `url` — official website (may be `N/A`)
  - `address` — physical address
  - `tuition` — pricing text (may be `Not publicly available`)
  - `notes` — free-form research notes (may be NULL)

## Rules — NON-NEGOTIABLE

1. **Never estimate or guess.** If a fact isn't on a primary source, it doesn't go in the DB.
2. **Source required for every update.** Log the URL in the results file. No source = no update.
3. **Primary sources only:** the school's own website, SFUSD pages for public schools, annual reports, official admissions pages. Avoid Niche.com, GreatSchools rankings, Reddit, random blogs.
4. **Leave existing pricing alone** if it already contains a dollar amount — only replace if the new source is clearly more current AND the old value is obviously stale.
5. **Rate limiting:** respect external APIs. Exponential backoff (1s → 2s → 4s) on 429/5xx. Max 3-5 retries per request.
6. **Batch commits:** after every ~10 schools researched, commit progress to the DB and to the results file so work isn't lost.

## What to Research (Per School)

For each school, try to capture:

**Tuition** — target column `tuition`
- Annual tuition range for the ages/grades served
- Note if sliding-scale, subsidy-eligible (e.g., SF Preschool for All), or public (free)
- Format: `$XX,XXX-$YY,YYY/year` or `Public (free)` or `Sliding scale: $X-$Y` or `Not publicly available`

**Notes** — target column `notes` (concise, 2-4 sentences)
- Program philosophy / approach (Reggio Emilia, Montessori, play-based, classical, IB, etc.)
- Accreditation (WASC, CAIS, NAEYC, etc.)
- Schedule / calendar highlights (half-day vs. full-day, year-round vs. academic)
- Distinctive offerings (Spanish/Mandarin immersion, outdoor programs, faith-based, etc.)
- Admissions notes (rolling vs. January deadline, tour requirements, sibling priority)
- Waitlist reality if publicly stated (e.g., "currently full through 2027")

## Process

Work through schools in this order to maximize hit rate:

1. **Schools with `url` and no dollar amount in `tuition`** — visit the site first.
2. **Schools with `url = 'N/A'`** — web search `"<school name>" San Francisco tuition` and `"<school name>" San Francisco admissions`.
3. **Schools with existing tuition but no notes** — visit the site to populate notes only; don't touch tuition unless obviously wrong.

For each school:

1. `WebSearch` the school name + "tuition" + "San Francisco" to find authoritative pages.
2. `WebFetch` the most likely admissions/tuition page from the results.
3. Extract tuition and program notes from the fetched content.
4. Update the DB via SQL:
   ```sql
   UPDATE preschools SET tuition = '...', notes = '...' WHERE id = ?;
   UPDATE upperschools SET tuition = '...', notes = '...' WHERE id = ?;
   ```
5. Append a row to `research/pricing-results.md` with school name, tuition found (or "Not publicly available"), notes summary, and source URL(s).

## Guardrails

- **Never loop external API calls without delays.** 1 second minimum between web fetches to the same domain.
- **Circuit breaker:** if 3 consecutive WebFetches fail on different schools, pause and report the issue before continuing.
- **Do not overwrite good data with empty data.** If a school already has notes and the research turned up nothing new, leave notes alone.
- **Log every school, even if nothing changed.** The results file is the audit trail.

## Output

`research/pricing-results.md` — one section per school:

```markdown
### <School Name> (id=<N>, type=<preschool|upperschool>)
- **Tuition:** <value> (was: <previous>)
- **Notes:** <summary of updates to notes, or "no change">
- **Source(s):** <URL 1>, <URL 2>
- **Updated DB:** yes | no
```

Group preschools first, then upper schools. At the top, include a summary table: total researched, tuition found, notes enriched, schools where nothing was findable.

## Done Criteria

- Every row in `preschools` and `upperschools` has been visited at least once.
- `research/pricing-results.md` has one entry per school with source URLs.
- DB reflects all confirmed findings.
- Snapshot `SPEC.md` to `research/pricing-results.spec.md` at the end.
- Output `<promise>DONE</promise>` to end the loop.
