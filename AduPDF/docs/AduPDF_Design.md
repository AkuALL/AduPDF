---
name: Quiet Campus Utility
product: AduPDF
description: Institutional operations design system for campus facility reservation and reporting.
colors:
  background: '#F7F8FA'
  surface: '#FFFFFF'
  surface-subtle: '#F3F5F7'
  surface-muted: '#EEF1F4'
  surface-inverse: '#1F2937'

  text-primary: '#111827'
  text-secondary: '#667085'
  text-tertiary: '#98A2B3'
  text-inverse: '#FFFFFF'

  border: '#E5E7EB'
  border-strong: '#D0D5DD'

  primary: '#2D4C79'
  primary-hover: '#243E63'
  primary-active: '#1C3150'
  primary-soft: '#E9EEF5'
  primary-soft-hover: '#DCE4EE'
  on-primary: '#FFFFFF'

  success: '#16794A'
  success-soft: '#EAF7F0'
  success-border: '#B7E2CB'

  warning: '#A15C00'
  warning-soft: '#FFF5E6'
  warning-border: '#F5D6A6'

  info: '#2463A7'
  info-soft: '#EBF3FB'
  info-border: '#BFD6ED'

  danger: '#B42318'
  danger-hover: '#912018'
  danger-soft: '#FDECEC'
  danger-border: '#F2B8B5'

  neutral-status: '#5D6673'
  neutral-status-soft: '#F0F2F4'
  neutral-status-border: '#D7DBE0'

  repair: '#B54708'
  repair-soft: '#FFF0E8'
  repair-border: '#F5C6A7'

typography:
  fontFamily: Plus Jakarta Sans, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif

  display:
    fontSize: 3rem
    fontWeight: '700'
    lineHeight: 3.5rem
    letterSpacing: -0.025em

  display-mobile:
    fontSize: 2.25rem
    fontWeight: '700'
    lineHeight: 2.75rem
    letterSpacing: -0.02em

  page-title:
    fontSize: 2rem
    fontWeight: '650'
    lineHeight: 2.5rem
    letterSpacing: -0.02em

  page-title-mobile:
    fontSize: 1.75rem
    fontWeight: '650'
    lineHeight: 2.25rem
    letterSpacing: -0.015em

  section-title:
    fontSize: 1.375rem
    fontWeight: '600'
    lineHeight: 1.875rem
    letterSpacing: -0.01em

  card-title:
    fontSize: 1rem
    fontWeight: '600'
    lineHeight: 1.5rem
    letterSpacing: -0.005em

  body-lg:
    fontSize: 1rem
    fontWeight: '400'
    lineHeight: 1.625rem
    letterSpacing: 0em

  body-md:
    fontSize: 0.9375rem
    fontWeight: '400'
    lineHeight: 1.5rem
    letterSpacing: 0em

  body-sm:
    fontSize: 0.8125rem
    fontWeight: '400'
    lineHeight: 1.25rem
    letterSpacing: 0em

  label-md:
    fontSize: 0.8125rem
    fontWeight: '600'
    lineHeight: 1.125rem
    letterSpacing: 0.01em

  label-sm:
    fontSize: 0.75rem
    fontWeight: '600'
    lineHeight: 1rem
    letterSpacing: 0.015em

rounded:
  xs: 0.125rem
  sm: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px

spacing:
  gutter: 1.5rem
  gutter-mobile: 1rem
  page-margin: 2.5rem
  page-margin-tablet: 2rem
  page-margin-mobile: 1rem

  space-2xs: 0.25rem
  space-xs: 0.5rem
  space-sm: 0.75rem
  space-md: 1rem
  space-lg: 1.5rem
  space-xl: 2rem
  space-2xl: 3rem

layout:
  max-content-width: 1360px
  public-content-width: 1200px
  form-content-width: 720px
  sidebar-width: 240px
  topbar-height: 64px

elevation:
  card: '0 1px 2px rgba(16, 24, 40, 0.03)'
  popover: '0 6px 18px rgba(16, 24, 40, 0.08)'
  modal: '0 18px 48px rgba(16, 24, 40, 0.14)'
---

# AduPDF Design System

## 1. Design Direction

AduPDF uses a **Quiet Campus Utility** visual language: calm, institutional, clear, and operational.

The product is not styled as a luxury SaaS, consumer lifestyle app, or decorative university landing page. AduPDF is a campus service used to inspect facility availability, submit reservations, process approvals, report damage, manage facility condition, and review operational data. The interface must therefore prioritize clarity, state visibility, confidence, and speed.

The visual character should feel like a modern university service with the discipline of an operations dashboard.

### Design principles

1. **Operational clarity over decoration**  
   Every visual element should make information easier to scan, compare, understand, or act on.

2. **Institutional, not bureaucratic**  
   The interface should feel credible and structured without becoming rigid, dated, or form-heavy.

3. **Calm hierarchy**  
   Use whitespace, typography, borders, grouping, and alignment before using shadows, color blocks, or ornamental elements.

4. **Semantic color**  
   Colors outside the primary navy family are reserved for meaning: status, feedback, warning, repair, success, and destructive actions.

5. **State must be obvious**  
   Reservation status, report status, facility condition, and availability must never depend on color alone. Pair color with text, iconography, shape, or explicit labels.

6. **Different density for different jobs**  
   Guest and Pengguna pages may breathe more. Petugas and Admin pages should be denser because they are operational workspaces.

7. **Availability is a first-class interaction**  
   The room–tool availability relationship is central to AduPDF and should receive stronger visual treatment than generic CRUD content.

---

# 2. Brand Character

AduPDF should communicate:

- dependable
- calm
- structured
- campus-oriented
- practical
- contemporary
- transparent

Avoid styling that implies:

- luxury
- premium membership
- fintech
- VIP hierarchy
- gaming
- playful consumer app
- heavy glassmorphism
- neon gradients
- oversized decorative dashboard cards
- excessive rounded shapes

The identity should come primarily from **navy, disciplined spacing, strong information hierarchy, and well-designed operational states**.

---

# 3. Color System

## 3.1 Primary Brand Color

The primary brand color is:

`#2D4C79`

Use it for:

- primary actions
- active navigation
- selected tabs
- focused controls
- important links
- selected dates or slots
- subtle brand accents

Do not use primary navy as a large decorative background across every screen.

### Primary states

| Role | Color |
|---|---|
| Primary | `#2D4C79` |
| Hover | `#243E63` |
| Active | `#1C3150` |
| Soft background | `#E9EEF5` |
| Soft hover | `#DCE4EE` |
| Text on primary | `#FFFFFF` |

---

## 3.2 Neutral Surfaces

The application should remain predominantly neutral.

| Role | Color |
|---|---|
| Page background | `#F7F8FA` |
| Main surface | `#FFFFFF` |
| Subtle surface | `#F3F5F7` |
| Muted surface | `#EEF1F4` |
| Border | `#E5E7EB` |
| Strong border | `#D0D5DD` |
| Primary text | `#111827` |
| Secondary text | `#667085` |
| Tertiary text | `#98A2B3` |

White surfaces should normally be separated using a border before adding shadow.

---

## 3.3 Semantic Status Colors

Semantic colors are functional, not decorative.

### Success

Use for:

- reservation `disetujui`
- report `selesai`
- facility `aktif`
- successful submission
- explicitly available slot when emphasis is required

Colors:

- text: `#16794A`
- background: `#EAF7F0`
- border: `#B7E2CB`

### Warning / Pending

Use for:

- reservation `menunggu`
- account verification `pending`
- attention states that are not errors

Colors:

- text: `#A15C00`
- background: `#FFF5E6`
- border: `#F5D6A6`

### Info / In Progress

Use for:

- report `diproses`
- informational system state

Colors:

- text: `#2463A7`
- background: `#EBF3FB`
- border: `#BFD6ED`

### Danger

Use for:

- reservation/report `ditolak`
- destructive confirmation
- validation failure
- error state

Colors:

- text: `#B42318`
- background: `#FDECEC`
- border: `#F2B8B5`

### Neutral / Cancelled / Inactive

Use for:

- reservation `dibatalkan`
- facility `nonaktif`
- historical state with no active process

Colors:

- text: `#5D6673`
- background: `#F0F2F4`
- border: `#D7DBE0`

### Repair

Use for:

- facility `dalam_perbaikan`

Colors:

- text: `#B54708`
- background: `#FFF0E8`
- border: `#F5C6A7`

---

# 4. Typography

Use **Plus Jakarta Sans** as the main application typeface.

The typography should feel modern and approachable, but not editorially dramatic. Large display typography is reserved for the public landing page only.

## 4.1 Hierarchy

| Role | Size | Weight | Usage |
|---|---:|---:|---|
| Display | 48px | 700 | Landing hero only |
| Page title | 32px | 650 | Main page heading |
| Section title | 22px | 600 | Major page sections |
| Card title | 16px | 600 | Cards, panels, modules |
| Body large | 16px | 400 | Introductory copy |
| Body | 15px | 400 | Default UI copy |
| Small body | 13px | 400 | Metadata and supporting detail |
| Label | 13px | 600 | Form labels, table emphasis |
| Compact label | 12px | 600 | Badges and dense operational metadata |

### Rules

- Avoid uppercase for normal navigation and titles.
- Uppercase may be used sparingly for very small overlines or table categories.
- Do not use excessive negative tracking on operational pages.
- Numeric values in tables, counts, dates, and time ranges should use tabular figures when possible.
- Status labels must remain legible at compact sizes.

---

# 5. Layout System

## 5.1 Grid

### Desktop

- 12-column layout
- maximum content width: `1360px`
- default outer margin: `40px`
- gutter: `24px`

### Tablet

- 8 columns
- outer margin: `32px`
- gutter: `24px`

### Mobile

- 4 columns
- outer margin: `16px`
- gutter: `16px`

Do not force a 12-column visual structure when a simpler single-column form layout is clearer.

---

## 5.2 Density by Role

### Guest / Pengguna

Default to a more spacious layout.

Characteristics:

- top navigation
- larger page spacing
- facility cards or structured list cards
- clear task-oriented calls to action
- visual availability section
- simple history/detail views

### Petugas / Admin

Default to a more compact operational layout.

Characteristics:

- persistent sidebar on desktop
- compact top bar
- tables and queues
- filter bars
- dense metadata
- action menus
- side-by-side summary/detail layouts when useful

Do not make Petugas/Admin screens look like oversized marketing dashboards.

---

# 6. Navigation

## 6.1 Guest / Pengguna Navigation

Desktop:

- AduPDF brand/name on the left
- primary navigation in the center or left group
- account/action area on the right

Suggested Guest items:

- Beranda
- Fasilitas
- Login
- Daftar

Suggested Pengguna items:

- Beranda / Dashboard
- Fasilitas
- Reservasi Saya
- Laporan Saya
- Profil

Mobile uses a compact navigation drawer or sheet.

---

## 6.2 Petugas Navigation

Use a sidebar on desktop.

Suggested sections:

- Dashboard
- Reservasi
- Laporan
- Kondisi Fasilitas

Queue counts may appear as compact numeric badges.

---

## 6.3 Admin Navigation

Use a sidebar on desktop.

Suggested sections:

- Dashboard
- Verifikasi Akun
- Kelola Akun
- Fasilitas
- Rekap

The currently active item uses `primary-soft` background with primary text and icon.

---

# 7. Surfaces, Borders, and Elevation

AduPDF should rely more on grouping and borders than on floating cards.

## Level 0 — Page

- background: `#F7F8FA`
- no shadow

## Level 1 — Card / Panel

- background: `#FFFFFF`
- border: `1px solid #E5E7EB`
- radius: `8px`
- shadow: optional `0 1px 2px rgba(16, 24, 40, 0.03)`

Use cards when content represents a meaningful module. Do not wrap every paragraph, statistic, or row in a card.

## Level 2 — Dropdown / Popover

- white background
- border
- 8px radius
- shadow: `0 6px 18px rgba(16, 24, 40, 0.08)`

## Level 3 — Modal

- white surface
- 8–12px radius
- restrained shadow
- dark translucent backdrop

Destructive modals should not use a fully red layout. Keep the modal neutral and apply danger color to the icon, warning message, and destructive action.

---

# 8. Shape Language

AduPDF should use restrained radii.

| Component | Radius |
|---|---|
| Inputs / buttons | 4–6px |
| Cards / tables / panels | 8px |
| Large modal / feature panel | 8–12px |
| Status badge | full pill or 6px |
| Avatar | circular |

Avoid excessive 16–24px rounded cards.

A page filled with floating rounded rectangles is not the target style.

---

# 9. Buttons

## 9.1 Primary

Use for the main action of a screen or section.

Example:

- Buat Reservasi
- Kirim Laporan
- Tambah Fasilitas
- Approve

Style:

- background `#2D4C79`
- text white
- height 40px desktop / 44px mobile
- radius 6px
- medium/semi-bold label

Hover: `#243E63`

Active: `#1C3150`

---

## 9.2 Secondary

Use for supporting actions.

Style:

- white background
- primary or primary text
- `1px solid #D0D5DD`
- subtle neutral hover

Examples:

- Edit
- Export
- Lihat Detail

---

## 9.3 Ghost

Use for low-emphasis actions inside tables, cards, and compact toolbars.

Examples:

- Batal
- Tutup
- Reset Filter

---

## 9.4 Destructive

Use only for truly destructive or high-impact actions.

Examples:

- Tolak
- Batalkan Reservasi
- Nonaktifkan Fasilitas

Style:

- danger text or danger fill depending on emphasis
- do not use danger styling for ordinary navigation

---

# 10. Inputs and Forms

Forms should feel simple and conventional.

## Inputs

- height: 40px desktop
- mobile touch target: minimum 44px
- border: `#D0D5DD`
- background: white
- radius: 6px
- padding: 10–12px
- focus: primary border + subtle focus ring

Focus ring:

`0 0 0 3px rgba(45, 76, 121, 0.12)`

## Form hierarchy

Use:

1. label
2. field
3. helper text or constraint
4. validation message when needed

Validation messages belong close to the affected input.

Long forms should be divided into meaningful sections, not one uninterrupted stack of fields.

---

# 11. Status Badges

Badges are used for explicit state, not decoration.

A status badge should contain:

- text label
- optional small icon
- semantic background
- semantic text
- optional border

Examples:

- `✓ Disetujui`
- `○ Menunggu`
- `× Ditolak`
- `— Dibatalkan`
- `✓ Aktif`
- `! Dalam perbaikan`
- `— Nonaktif`
- `↻ Diproses`
- `✓ Selesai`

Do not display status as a small colored dot without text in primary workflows.

---

# 12. Tables and Operational Lists

Tables are preferred on Petugas/Admin pages when users need to compare many records.

## Table rules

- white or transparent table surface
- subtle horizontal separators
- no heavy zebra striping
- header background may use `#F7F8FA`
- header labels use 12–13px semi-bold text
- row hover uses `#F8FAFC`
- numeric values aligned right
- actions aligned right
- status shown as badge
- primary record name/title visually stronger than metadata

Do not overuse vertical borders.

### Example

```text
Fasilitas             Tipe          Lokasi           Status               Aksi
Lab Komputer A        Laboratorium  Gedung E Lt. 2   ✓ Aktif              •••
Projector 04          Alat          Lab Komputer A   ! Dalam perbaikan    •••
Aula Utama            Aula          Gedung A         — Nonaktif           •••
```

---

# 13. Filters and Search

List-heavy pages should provide a compact filter toolbar.

Recommended order:

1. search
2. primary filter
3. secondary filters
4. optional reset
5. result count

Example:

```text
[ Cari fasilitas...              ] [ Tipe ▾ ] [ Lokasi ▾ ] [ Status ▾ ]
```

On mobile, secondary filters may open inside a filter sheet.

Active filters should remain visible.

---

# 14. Facility Discovery

Facility discovery is one of the most important user-facing experiences.

## Facility list

Each facility item should make these attributes easy to scan:

- name
- type
- location
- capacity where relevant
- current facility condition
- availability cue
- relation to parent room where relevant for tools

Cards may be used for public/user discovery when the number of records is modest. Use structured lists when the dataset grows.

Avoid decorative stock illustrations for every facility.

---

# 15. Facility Detail

The facility detail page should establish three layers of information:

## 15.1 Identity

Show:

- facility name
- facility type
- location
- capacity
- current condition
- concise description

## 15.2 Availability

Availability should be visually prominent.

## 15.3 Related resources

For rooms:

- list child tools
- show each child tool condition
- clearly indicate if a broken tool does not make the room itself unavailable

For tools:

- show parent room
- provide a clear path back to the parent room

---

# 16. Availability as Signature Interaction

Availability is not just a green/red label. It must communicate the room–tool relationship defined by the system.

## 16.1 Slot Grid

Use a compact horizontal time-slot grid based on 30-minute intervals.

Example:

```text
Rabu, 16 September

07:00  07:30  08:00  08:30  09:00  09:30  10:00
  ✓      ✓      ■      ■      ✓      ✓      ✓
```

Recommended states:

- available
- unavailable
- selected
- unavailable because parent room is blocked
- unavailable because target facility is under repair/nonactive

Use labels or tooltips to explain reasons where appropriate.

Guest users may see only whether a slot is available or unavailable. Do not expose reservation identity or purpose.

---

## 16.2 Room–Tool Context

For a room page, show the availability relationship explicitly:

```text
Lab Komputer A
Status: ✓ Aktif

Peralatan di ruangan:
Projector 01        ✓ Aktif
Camera Kit          ✓ Aktif
VR Headset 01       ! Dalam perbaikan
```

When a tool is reserved during a slot:

- that tool becomes unavailable
- full-room reservation becomes unavailable for that overlap
- available sibling tools remain reservable

When a room is fully reserved:

- the room becomes unavailable
- every child tool becomes unavailable during that overlap

The UI should explain this behavior in plain language when it affects an action.

---

# 17. Reservation Flow

Reservation should feel like a focused task, not an admin form.

Recommended sequence:

1. facility context
2. date
3. start and end slot
4. purpose
5. conflict/availability validation
6. submission
7. result state

Use a single-page form unless complexity proves otherwise.

Before submit, show a compact reservation summary.

Example:

```text
Lab Komputer A
Rabu, 16 September 2026
10:00–12:00

Tujuan
Praktikum kelompok mata kuliah ...

[ Ajukan Reservasi ]
```

After submission, make it explicit that the request is **Menunggu** and not yet approved.

---

# 18. Reservation History

Use a structured list or table.

Each entry should show:

- facility
- date
- time
- status
- purpose summary
- detail action

Mobile may use stacked rows.

Cancellation availability should be clearly communicated, especially near the H-2 / 48-hour deadline.

When cancellation is no longer allowed, disable or remove the action and provide an explanatory message.

---

# 19. Damage Reporting

The report form should prioritize:

- facility
- category
- description
- supporting photos

Photo upload must communicate:

- maximum 8 files
- maximum 2 MB each
- JPG/JPEG/PNG only

Uploaded images should appear as compact previews with file removal controls before submit.

Do not build a decorative gallery UI.

---

# 20. Petugas Dashboard

The Petugas dashboard is a work queue, not a KPI showcase.

Prioritize actionable items:

```text
Petugas Dashboard

Reservasi Menunggu     12
Laporan Baru            5

Reservasi terbaru
------------------------------------------------
Lab A        Gege C.        16 Sep · 10:00–12:00
Aula         User X         16 Sep · 13:00–15:00
...

Laporan terbaru
------------------------------------------------
Projector 04  Proyektor tidak menyala       Baru
Lab B         AC bocor                      Baru
...
```

Small counts may support scanning, but do not turn the top of the page into a row of oversized analytics cards.

---

# 21. Reservation Approval UI

Approval is high-impact and must show enough context before action.

The detail view should expose:

- requester
- facility
- room/tool relation
- date and time
- purpose
- current facility condition
- conflict result
- relevant overlapping approved reservation when the Petugas is allowed to see it
- pending conflict warning where applicable

Actions:

- Approve
- Reject

Approve should be primary when valid.

Reject may use secondary-danger styling and should request confirmation when appropriate.

The interface must make clear that approving one request may automatically reject pending requests that become conflicting.

---

# 22. Report Handling UI

Petugas report handling should visually separate:

- report state
- facility condition

Never merge them into one badge.

Example:

```text
Laporan
↻ Diproses

Kondisi fasilitas
! Dalam perbaikan
```

This separation is mandatory because `dalam_perbaikan` is a facility condition, not a report status.

---

# 23. Admin Dashboard

The Admin dashboard should focus on administration and exceptions.

Priority modules:

- verification queue
- facility management
- account management
- recap / export

Avoid large vanity metrics unless they directly support an admin decision.

---

# 24. Verification Queue

The verification page should make pending accounts quick to process.

Recommended table columns:

- name
- email
- submitted date
- current status
- actions

Actions:

- Approve
- Reject
- View detail if needed

Status should remain explicit after processing.

---

# 25. Facility Management

Facility management should be table-first.

Recommended columns:

- facility
- type
- parent room where relevant
- location
- capacity
- condition
- action

Nonaktifkan is a destructive/high-impact action.

The confirmation must clearly state that pending reservations will be rejected and approved unfinished reservations will be cancelled automatically.

---

# 26. Recap and Export

Recap pages should be analytical but visually restrained.

Use:

- compact filters
- clear date/period context if implemented
- small summary metrics when helpful
- tables as the primary evidence
- simple charts only when they add interpretation

Exports should be visible as an action near the report heading or filters.

Do not use chart-heavy dashboards merely for visual interest.

---

# 27. Empty States

Empty states should be compact and useful.

Example:

```text
Belum ada reservasi

Reservasi yang kamu ajukan akan muncul di sini.
[ Lihat Fasilitas ]
```

Avoid large illustrations unless they genuinely help comprehension.

---

# 28. Loading States

Use:

- skeleton rows for tables and lists
- small spinners inside buttons when submitting
- disabled actions during submission

Avoid blocking full-page loaders when only one component is updating.

---

# 29. Error States

Errors should:

- explain what failed
- avoid leaking sensitive system detail
- identify what the user can do next

Validation belongs near fields.

System-level errors may use an inline alert above the relevant content.

---

# 30. Success Feedback

Use concise inline alerts, toast notifications, or result states.

Examples:

- Reservasi berhasil diajukan dan sedang menunggu persetujuan.
- Laporan kerusakan berhasil dikirim.
- Fasilitas berhasil diperbarui.
- Reservasi berhasil disetujui.

Do not rely on toast messages for important state changes that should remain visible in the page content.

---

# 31. Confirmation Patterns

Confirmation is required for consequential actions such as:

- cancel reservation
- reject reservation
- emergency cancellation
- deactivate facility
- destructive administrative changes

A confirmation dialog should contain:

1. action name
2. affected resource
3. concrete consequence
4. cancel action
5. explicit confirm action

Avoid generic copy such as `Are you sure?` without context.

---

# 32. Icons

Use a single simple outline icon family.

Icons should support comprehension, especially for:

- availability
- time
- location
- capacity
- room/tool relation
- report status
- facility condition
- destructive actions

Do not use icons as the only representation of state.

Avoid mixing multiple icon styles.

---

# 33. Responsiveness

## Mobile priorities

- preserve task completion
- preserve status clarity
- preserve availability interaction
- convert tables into stacked rows where necessary
- keep minimum touch target around 44px
- place primary action within easy reach
- avoid horizontal page overflow

Availability slot grids may scroll horizontally if needed, but date and legend context should remain clear.

---

# 34. Accessibility

Minimum requirements:

- body text maintains sufficient contrast
- status never relies on color alone
- keyboard focus is clearly visible
- controls have labels
- icon-only actions have accessible names/tooltips
- destructive and primary buttons remain distinguishable beyond hue
- error text is associated with its field
- touch targets remain large enough on mobile

---

# 35. Content Tone

AduPDF uses direct, practical Indonesian.

Prefer:

- `Ajukan Reservasi`
- `Menunggu persetujuan`
- `Fasilitas sedang dalam perbaikan`
- `Reservasi tidak dapat dibatalkan karena sudah melewati batas 48 jam`
- `Akun menunggu verifikasi Admin`

Avoid:

- marketing language
- exaggerated friendliness
- overly formal bureaucratic phrasing
- unexplained technical implementation terms in user-facing copy

Technical terms may remain where they are appropriate for Petugas/Admin.

---

# 36. Page-Level Direction

## Guest Home

Should communicate:

- what AduPDF does
- primary path to browse facilities
- secondary path to login/register

Keep the hero compact. The application itself is more important than promotional copy.

## Facilities

Primary experience:

- search
- filters
- facility list
- status
- availability

## Facility Detail

Primary experience:

- identity
- condition
- availability
- room/tool relationship
- reservation CTA

## Pengguna Dashboard

Primary experience:

- upcoming/current reservation state
- quick facility discovery
- recent reservation/report state

Do not overload with analytics.

## Petugas Dashboard

Primary experience:

- reservation queue
- report queue
- exceptions requiring action

## Admin Dashboard

Primary experience:

- pending verification
- facility administration
- account administration
- recap access

---

# 37. Component Density Reference

## Spacious

Use for:

- landing page
- facility discovery
- facility detail
- reservation creation
- report creation

Typical vertical section spacing:

`32–48px`

## Standard

Use for:

- user history
- profile
- detail pages

Typical section spacing:

`24–32px`

## Compact

Use for:

- Petugas queues
- Admin tables
- management screens
- recap tables

Typical row height:

`44–52px`

Do not reduce readability merely to maximize density.

---

# 38. Anti-Patterns

Do not:

- add champagne gold or luxury accents
- use gradients as the main brand treatment
- create glassmorphism panels
- use giant KPI cards on every dashboard
- wrap every UI group inside separate floating cards
- use saturated semantic colors as page backgrounds
- represent states using colored dots only
- hide critical actions inside ambiguous icon buttons
- use 20px+ radius on standard cards
- make public pages and operational dashboards share identical density
- expose reservation identity or purpose to Guest through availability UI
- visually merge report status and facility condition
- imply pending reservation is already approved
- hide room–tool dependency behind unexplained availability states

---

# 39. Implementation Guidance for Laravel + Blade

The design system should map cleanly into reusable Blade components.

Recommended reusable component groups:

```text
components/
  button/
  badge/
  alert/
  input/
  select/
  textarea/
  modal/
  table/
  empty-state/
  pagination/
  facility/
  availability/
  reservation/
  report/
  navigation/
```

Recommended semantic components include:

```text
<x-status.reservation />
<x-status.report />
<x-status.facility />

<x-facility.card />
<x-facility.relationship />

<x-availability.slot-grid />
<x-availability.legend />

<x-reservation.summary />
<x-reservation.conflict-warning />

<x-report.attachment-upload />
```

Component names are recommendations, not mandatory architecture.

The important rule is that semantic behavior should not be reconstructed independently on every Blade page.

---

# 40. Design Token Usage Rules

The token block at the top of this document is the primary visual source of truth.

Implementation should not introduce alternate primary colors or independent semantic palettes without updating this document.

In particular:

- `primary` means `#2D4C79`
- page background means `#F7F8FA`
- surface means `#FFFFFF`
- semantic colors are used by state, not decoration
- radii remain restrained
- Plus Jakarta Sans remains the primary font
- shadows remain subtle

When implementation needs a new visual token, add it here first rather than silently creating a one-off value.

---

# 41. Final Visual Target

A finished AduPDF screen should feel:

**quiet, structured, useful, and trustworthy.**

A Guest should be able to find a facility and understand availability without learning the system.

A Pengguna should immediately understand whether a reservation is available, pending, approved, rejected, or cancelled.

A Petugas should be able to process queues without visual friction.

An Admin should be able to manage accounts and facilities without wading through decorative dashboard chrome.

The visual identity should come from the quality of information design, not from ornamental styling.
