# Preschool Call List — Pricing Not Publicly Available

26 SF preschools without public pricing. Phone/tour is the only path to current rates.

**Database state (v0.9.1):** 65 preschools total, 39 priced, 26 on this list.

## What to Ask

1. **Current tuition** (2026-2027)
   - Full-day vs. half-day rates
   - Part-time (2/3 day) schedule rates
   - Extended/before/after care add-ons
2. **Enrollment fees** — application, deposit, materials, annual
3. **Waitlist** — "Currently enrolling? Waitlist for 2026-2027?"
4. **Financial aid** — ELFA participant? sliding scale? need-based aid?

Then update the DB:
```sql
UPDATE preschools SET tuition = '<found>', notes = notes || ' [Updated via call YYYY-MM-DD]' WHERE id = <id>;
```

---

## By Neighborhood

### Cow Hollow (2)

| # | School | Phone | Address | Notes |
|---|---|---|---|---|
| 5 | Claudette's Family Daycare | **(415) 269-0766** | 1961 Lombard St | Small family daycare |
| 14 | Little Gators Preschool | **(415) 346-8608** | 3149 Steiner St | Est. 1984. Ages 2-5. $150 app fee. Multiple schedule options |

### Hayes Valley (1)

| # | School | Phone | Address | Notes |
|---|---|---|---|---|
| 57 | L'Academy Schools Hayes Valley | Use "Find A Location" at lacademyschools.com | 42 Waller St | Mandarin + Spanish enrichment. **ELFA participant (free for qualifying families)** |

### Inner Richmond (1)

| # | School | Phone | Address | Notes |
|---|---|---|---|---|
| 35 | St. James Preschool | **(415) 629-4195** | 4620 California St | Founded 1963. Nonprofit nonsectarian |

### Laurel Heights (1)

| # | School | Phone | Address | Notes |
|---|---|---|---|---|
| 38 | UCSF Laurel Heights CDC | **(628) 895-0087** | 2675 Geary Blvd | Bright Horizons / UCSF-affiliated. NAEYC accredited. UCSF priority |

### Marina (6)

| # | School | Phone | Address | Notes |
|---|---|---|---|---|
| 1 | Bluebell Kids Daycare | **(415) 323-6343** | 243 Avila St | In-home. Ages 6mo-5yr |
| 8 | Hungry Caterpillars (HC Education) | **(415) 712-4169** | 3219A Laguna St / 1901 Stockton St | Montessori + Reggio Spanish immersion. Two programs |
| 9 | Kids Kingdom SF | **(415) 621-9894** | 1840 Lombard St | Christian preschool |
| 25 | Marina Tots | **(415) 931-7778** | 2394 Lombard St | Boutique, est. 1996. Part-day by age |
| 26 | Marina Children's Center | **(415) 931-0833** | 3219 Laguna St | Ages 2.5-6. Full-day. Ask for Pat Woodward |
| 40 | Kids Club Preschool | **(415) 567-4680** | 161 Pixley St | Est. 1989. In-home. M-Th only |
| 59 | Circle of Friends Preschool | **(415) 345-9184** | 265 Moulton St | Ages 2.5-5. Daily Art/French/Music |

### Mission (1)

| # | School | Phone | Address | Notes |
|---|---|---|---|---|
| 58 | L'Academy Schools Mission/Noe Valley | Use "Find A Location" | 866 Valencia St | Mandarin or Spanish immersion. **ELFA participant** |

### Nob Hill (2)

| # | School | Phone | Address | Notes |
|---|---|---|---|---|
| 24 | Tiny Giants SF (Nob Hill) | **(415) 359-9499** / (Cow Hollow infants: 415-409-6581) | 1748 Clay St | Two locations |
| 31 | Sunshine Adventures Preschool | **(415) 699-5820** | 1439 Pacific Ave | Mandarin immersion + Creative Curriculum. Accepts ELS/ELFA vouchers |

### North Beach (1)

| # | School | Phone | Address | Notes |
|---|---|---|---|---|
| 15 | North Beach Kids | **(415) 350-9213** | 724 Lombard St | Ages 6mo-5yr. Second location at 728 Broadway |

### Pacific Heights (3)

| # | School | Phone | Address | Notes |
|---|---|---|---|---|
| 30 | Building Kidz Pacific Heights | **(415) 839-5188** | 2426 California St | International chain. Whole-child + performing arts |
| 65 | San Francisco Waldorf Nursery | **(415) 931-2750** | 2938 Washington St | Ages 2¾-4. Waldorf. **No preschool FA available** |
| 67 | Alta Plaza Preschool | **(415) 928-6483** | 2140 Pierce St | Play-based. Ages 2.5-5.5 |

### Potrero Hill (1)

| # | School | Phone | Address | Notes |
|---|---|---|---|---|
| 54 | L'Academy Schools Potrero Hill | Use "Find A Location" | 200 Kansas St | Mandarin immersion. **ELFA participant** |

### Presidio (1)

| # | School | Phone | Address | Notes |
|---|---|---|---|---|
| 2 | Bright Horizons at Letterman | **(415) 400-0104** | 1 Letterman Dr, Bldg B | Corporate-sponsored (LDAC/Lucasfilm). Employer may be required |

### Presidio Heights (1)

| # | School | Phone | Address | Notes |
|---|---|---|---|---|
| 66 | Amigos de Presidio Heights | **(415) 325-5764** | 3437 Clay St | Spanish immersion, art-based, play-based. Ages 2-5 |

### Richmond (Outer) (1)

| # | School | Phone | Address | Notes |
|---|---|---|---|---|
| 37 | Little Seeds Childcare | **(415) 932-9316** | 4355 Anza St | Ages 5mo-5yr |

### Russian Hill (1)

| # | School | Phone | Address | Notes |
|---|---|---|---|---|
| 28 | Russian Hill Academy | **(415) 260-6847** | 1520 Pacific Ave | Mandarin immersion. Distinct from Russian Hill School (id 27) |

### SoMa (2)

| # | School | Phone | Address | Notes |
|---|---|---|---|---|
| 55 | L'Academy Schools SoMa Natoma | Use "Find A Location" | 685 Natoma St | Ages 4mo-6yr. Mandarin/Spanish. **ELFA participant** |
| 56 | L'Academy Schools SoMa 8th St | Use "Find A Location" | 322 8th St | Mandarin immersion. **ELFA participant** |

---

## Call Order Recommendation

**Quickest wins** (owner-operated, likely to answer and quote):
1. Small in-home daycares — Bluebell, Claudette's, Kids Kingdom, Kids Club, Little Seeds, North Beach Kids, Marina Tots, Bluebell
2. Dedicated single-location preschools — Little Gators, Marina Children's Center, St. James, Russian Hill Academy, Sunshine Adventures, Alta Plaza, Amigos de Presidio Heights, Circle of Friends, Hungry Caterpillars, Tiny Giants, SF Waldorf Nursery

**Chain/corporate** (may require form/tour before quoting):
3. L'Academy × 5 branches — same chain; one call might cover all
4. Building Kidz Pacific Heights
5. Bright Horizons at Letterman (may need employer verification)
6. UCSF Laurel Heights CDC (UCSF affiliation may affect rates)

**ELFA watch:** 7 schools flagged as ELFA participants — for SF families ≤110% AMI, tuition is waived entirely at these. Ask "Do you participate in ELFA and what's my out-of-pocket if I qualify?"

## Status Tracking

- [ ] id 1 — Bluebell
- [ ] id 2 — Bright Horizons Letterman
- [ ] id 5 — Claudette's
- [ ] id 8 — Hungry Caterpillars
- [ ] id 9 — Kids Kingdom
- [ ] id 14 — Little Gators
- [ ] id 15 — North Beach Kids
- [ ] id 24 — Tiny Giants
- [ ] id 25 — Marina Tots
- [ ] id 26 — Marina Children's Center
- [ ] id 28 — Russian Hill Academy
- [ ] id 30 — Building Kidz Pacific Heights
- [ ] id 31 — Sunshine Adventures
- [ ] id 35 — St. James Preschool
- [ ] id 37 — Little Seeds
- [ ] id 38 — UCSF Laurel Heights CDC
- [ ] id 40 — Kids Club Preschool
- [ ] id 54 — L'Academy Potrero Hill
- [ ] id 55 — L'Academy SoMa Natoma
- [ ] id 56 — L'Academy SoMa 8th St
- [ ] id 57 — L'Academy Hayes Valley
- [ ] id 58 — L'Academy Mission/Noe Valley
- [ ] id 59 — Circle of Friends Preschool
- [ ] id 65 — SF Waldorf Nursery
- [ ] id 66 — Amigos de Presidio Heights
- [ ] id 67 — Alta Plaza Preschool
