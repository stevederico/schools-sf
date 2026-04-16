# Preschool Call List — Pricing Not Publicly Available

17 SF preschools that don't publish tuition online. All three web-research passes came up empty — phone is the only path.

## What to Ask

For each school, try to get:

1. **Current tuition** — 2026-2027 school year
   - Full-day vs. half-day rates if both offered
   - Part-time (2/3 day) schedule rates if offered
   - Extended/before/after care add-ons
2. **Enrollment fees** — application, deposit, materials, annual
3. **Waitlist status** — "Are you currently enrolling? Any waitlist for 2026-2027?"
4. **Financial aid** — ELFA provider? sliding scale? need-based aid?

Then run:
```sql
UPDATE preschools SET tuition = '<found value>', notes = notes || ' [Updated via call YYYY-MM-DD]' WHERE id = <id>;
```

---

## By Neighborhood

### Cow Hollow (2)

| # | School | Phone | Address | Notes |
|---|---|---|---|---|
| 5 | Claudette's Family Daycare | **(415) 269-0766** | 1961 Lombard St | Small family daycare |
| 14 | Little Gators Preschool | **(415) 346-8608** | 3149 Steiner St | Est. 1984. Ages 2-5. $150 app fee. Multiple schedules (2s T/Th, 3/4 MWF, PreK M-F). Tours Saturdays |

### Inner Richmond (1)

| # | School | Phone | Address | Notes |
|---|---|---|---|---|
| 35 | St. James Preschool | **(415) 629-4195** | 4620 California St | Founded 1963. Nonprofit nonsectarian. Ages 2-5. Half + full day |

### Laurel Heights (1)

| # | School | Phone | Address | Notes |
|---|---|---|---|---|
| 38 | UCSF Laurel Heights CDC | **(628) 895-0087** | 2675 Geary Blvd | Bright Horizons / UCSF-affiliated. NAEYC accredited. Priority for UCSF faculty/staff |

### Marina (6)

| # | School | Phone | Address | Notes |
|---|---|---|---|---|
| 1 | Bluebell Kids Daycare | **(415) 323-6343** | 243 Avila St | In-home. Ages 6mo-5yr. M-F 8-5 |
| 8 | Hungry Caterpillars (HC Education) | **(415) 712-4169** (Daycare at 1901 Stockton) | 3219A Laguna St / 1901 Stockton St | Year-round Montessori + Reggio Spanish immersion. Two programs (Daycare 0-2, EEC 2-6) |
| 9 | Kids Kingdom SF | **(415) 621-9894** | 1840 Lombard St | Christian preschool |
| 25 | Marina Tots | **(415) 931-7778** | 2394 Lombard St | Boutique, est. 1996. Part-day T/Th by age group |
| 26 | Marina Children's Center | **(415) 931-0833** | 3219 Laguna St | Play-based. Ages 2.5-6. Full-day M-F 8-6. Ask for Pat Woodward (admissions) |
| 40 | Kids Club Preschool | **(415) 567-4680** | 161 Pixley St | Est. 1989. In-home. M-Th 8:30am-2pm. Owner/teacher Joanne |

### Nob Hill (2)

| # | School | Phone | Address | Notes |
|---|---|---|---|---|
| 24 | Tiny Giants SF (Nob Hill) | **(415) 359-9499** (preschool) / **(415) 409-6581** (infants, Cow Hollow) | 1748 Clay St | Two locations: Nob Hill preschool + Cow Hollow infant/toddler |
| 31 | Sunshine Adventures (Nob Hill) | **(415) 699-5820** | 1439 Pacific Ave | Mandarin immersion + Creative Curriculum. Max 24 kids. Accepts ELS/ELFA vouchers |

### North Beach (1)

| # | School | Phone | Address | Notes |
|---|---|---|---|---|
| 15 | North Beach Kids | **(415) 350-9213** | 724 Lombard St | Ages 6mo-5yr. M-F 8am-5pm. Second location at 728 Broadway |

### Pacific Heights (1)

| # | School | Phone | Address | Notes |
|---|---|---|---|---|
| 30 | Building Kidz Pacific Heights | **(415) 839-5188** | 2426 California St | International chain. Whole-child + performing arts. Ages infant-preschool. CA license #384004854 |

### Presidio (1)

| # | School | Phone | Address | Notes |
|---|---|---|---|---|
| 2 | Bright Horizons at Letterman | **(415) 400-0104** | 1 Letterman Dr, Bldg B | Corporate-sponsored (Lucasfilm/LDAC). Tuition varies by schedule and age. May require employer verification |

### Richmond (Outer) (1)

| # | School | Phone | Address | Notes |
|---|---|---|---|---|
| 37 | Little Seeds Childcare | **(415) 932-9316** | 4355 Anza St | State-licensed. Ages 5mo-5yr. M-F 7:30am-5:30pm |

### Russian Hill (1)

| # | School | Phone | Address | Notes |
|---|---|---|---|---|
| 28 | Russian Hill Academy | **(415) 260-6847** | 1520 Pacific Ave | Mandarin immersion. Currently enrolling. Distinct from Russian Hill School (id 27) |

---

## Call Order Recommendation

Most likely to give a quote easily:
1. **Small private preschools with clear programs** (Little Gators, Marina Children's Center, St. James, Russian Hill Academy, Sunshine Adventures) — just ask, they'll tell you
2. **In-home / family daycares** (Bluebell, Claudette's, Kids Kingdom, Kids Club, Little Seeds, North Beach Kids, Marina Tots) — quick call, owner will answer
3. **Chain / corporate** (Building Kidz, Bright Horizons, UCSF Laurel Heights, Tiny Giants, Hungry Caterpillars) — may require tour/inquiry form before quoting

## Status Tracking

Mark as you go:
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
