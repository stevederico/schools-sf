# Spec — Preschool & Upper School Pricing Research

## Goal

Research and update tuition/pricing for every school in the SQLite database that currently has "Not publicly available", "Inquire", or no pricing data.

## Database

- Path: `backend/databases/preschools.db`
- Tables: `preschools` (24 rows), `upperschools` (31 rows)
- Schema: `tuition TEXT` column stores pricing

## Rules

1. **Skip schools that already have pricing** — if `tuition` contains a dollar amount (e.g. "$16,350-$22,000/year"), leave it untouched
2. **Never estimate or guess** — only record pricing found from a verifiable source
3. **Source required** — when updating pricing, include the source URL in the research output
4. **If pricing can't be found**, update tuition to "Not publicly available" (leave as-is if already set)
5. **Use the school's own website first** (the `url` column), then try web search as a fallback
6. **Schools with `N/A` as URL** — use web search to find official site and pricing

## Process

For each school where tuition is "Not publicly available", "Inquire", or similar:

1. Visit the school's website (from `url` column) and look for tuition/pricing pages
2. If not found on website, web search for `"<school name>" tuition <current year>`
3. If pricing is found:
   - Update the `tuition` column in the database via SQL
   - Log: school name, new tuition value, source URL
4. If pricing is NOT found:
   - Log: school name, "Not publicly available", sources checked
5. Move to the next school

## Schools to Research

### Preschools (skip if already priced)
- ID 1: Bluebell Kids Daycare
- ID 2: Bright Horizons at Letterman
- ID 4: Chibi Chan Preschool
- ID 5: Claudette's Family Daycare
- ID 6: Cow Hollow School
- ID 8: Hungry Caterpillars (HC Education)
- ID 9: Kids Kingdom SF
- ID 10: L'Academy Schools Nob Hill
- ID 11: Laura Vicuña Pre-Kindergarten
- ID 12: Laurel Hill Nursery School
- ID 13: Little Bee Preschool
- ID 14: Little Gators Preschool
- ID 15: North Beach Kids
- ID 17: Playgroup
- ID 18: Seabird Preschool
- ID 19: Spire School
- ID 20: TEL HI Preschool
- ID 21: TelHi Co-op
- ID 22: The Little School
- ID 23: The Serra Preschool
- ID 24: Tiny Giants SF

### Upper Schools (skip if already priced)
- ID 1: Bay School of San Francisco
- ID 2: Sacred Heart Cathedral Prep
- ID 3: Drew School
- ID 7: Brightworks School
- ID 9: St. Vincent de Paul School (SVDP)
- ID 10: Hamlin School
- ID 14: Cathedral School for Boys
- ID 15: Children's Day
- ID 16: Chinese American
- ID 17: Convent of the Sacred Heart
- ID 18: French American
- ID 19: The Hamlin School
- ID 20: Katherine Del Mar Burke School
- ID 21: Kittredge School
- ID 22: Live Oak School
- ID 24: Marin Country Day School
- ID 25: Marin Primary and Middle School
- ID 26: Mount Tam
- ID 29: San Francisco Day School
- ID 30: San Francisco Friends
- ID 31: Saint Vincent De Paul
- ID 32: Saints Peter and Paul
- ID 33: St. Brigids
- ID 34: Stuart Hall
- ID 40: Town School

## Output

When complete, produce `research/pricing-results.md` summarizing:
- Each school researched
- Tuition found (or not)
- Source URL
- Whether the database was updated
