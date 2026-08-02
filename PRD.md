# Hotel Valentino — Product Requirements Document

| | |
| --- | --- |
| Product | Hotel Valentino website, booking engine and property admin portal |
| Property | Ahsan Bhaban, Guptanka, Main Road, Maijdee Court, Sadar, Noakhali-3800, Bangladesh |
| Owner | YusuF Faisal |
| Status | v1.0 shipped — this document specifies what is built and what v1.1 must add |
| Date | 2 August 2026 |
| Source | Approved design prototype (`Hotel Valentino.dc.html`) + the implementation in this repository |

---

## 1. Problem

Hotel Valentino is a premium eight-category hotel in the centre of Maijdee Court with a rooftop
restaurant, a hall room and a travel desk. Before this product, every booking came through a phone
call to reception, rates lived on paper, and the property had no presence a guest could evaluate
before arriving. Three consequences:

1. **Bookings are capped by the phone.** Reservations only happen while someone is on the desk and
   free to talk. Out-of-town guests booking at 1am off a coach, or from Dhaka a week ahead, have no
   route in.
2. **Nothing is changeable without a developer.** Rates move, the Sky View menu changes, rooms go out
   of service. Any static site would be stale within a month.
3. **Reception has no record.** Occupancy, revenue and tonight's arrivals live in a notebook, so
   nobody can answer "how many rooms are free on the 21st" without reading back through it.

## 2. Product goal

A bilingual (English / বাংলা) site that sells the property, takes a booking end to end without a phone
call — including by conversation with an AI reception desk — and hands the property a dashboard that
runs rates, inventory, content and reservations without a deploy.

### Success measures

| Measure | Target |
| --- | --- |
| Bookings placed without a phone call | ≥ 40% of reservations within 3 months of launch |
| Bookings completed through the AI reception desk | ≥ 15% of online bookings |
| Content changes needing a developer | 0 for rates, rooms, menu, gallery, hours, phone numbers |
| Booking flow completion (dates → confirmation) | ≥ 35% of sessions that open the panel |
| Reception time on the dashboard | Daily — it is the answer to "what is free tonight" |

### Non-goals for v1

- Real payment capture. Payment method is recorded; money is settled at the desk.
- Multi-property or channel-manager integration (Booking.com, Agoda).
- Guest accounts, loyalty, or a booking-history login.
- Restaurant ordering or delivery. Sky View takes table reservations only.
- Native mobile apps.

## 3. Users

| User | What they need | Where they are served |
| --- | --- | --- |
| **Out-of-town guest** (business traveller, NSTU visitor, family) | See the rooms honestly, know the rate, book for specific dates, get a code | Public site + booking panel |
| **Bengali-speaking local guest** | The same, in বাংলা, on a phone | Language toggle, mobile layout, WhatsApp / call buttons |
| **Guest who would rather ask than click** | Describe the stay in plain language and be booked | AI reception desk (chat widget) |
| **Reception staff** | Tonight's arrivals, a bookings list, an invoice to print, the ability to close out a room | `/admin` → dashboard, bookings, room management |
| **Hotel management** | Change rates and inventory, edit the menu and gallery, update phone numbers and hours | `/admin` → rooms, menu, gallery, settings |
| **Sky View diner** | Hold a rooftop table for a date, time and party size | Table reservation flow |

## 4. Scope — public site

Nine public surfaces, each a port of the approved design. Copy, sectioning and motion are part of the
spec, not decoration: the site is the property's only shopfront.

| Route | Requirement |
| --- | --- |
| `/` | Home: hero, room track, Sky View, facilities, services, explore, contact strip |
| `/rooms`, `/rooms/[slug]` | All eight categories with rate, sleeps, configuration, imagery, and what the rate includes |
| `/restaurant` | Sky View — the menu by category, and the table reservation entry point |
| `/facilities` | The six facilities included in the rate |
| `/events` | Hall room for weddings, gaye holud and corporate meetings |
| `/explore`, `/explore/[slug]` | Tour-desk destinations: NSTU, Bajra Shahi Mosque, Nijhum Dweep, Gandhi Ashram |
| `/gallery` | Photography, filterable by Building / Rooms / Views / Sky View |
| `/about`, `/contact` | The property, the address, phones, WhatsApp, map, and a contact form |
| `/policies/[slug]` | Terms of use, booking terms, cancellation and refund, privacy |

**PR-1 Bilingual.** Every guest-facing string renders in English and বাংলা. The toggle is global,
persists across route changes, and never leaves a mixed-language screen.

**PR-2 Motion is a requirement.** Smooth scroll, the pinned floor rail, word-by-word reveals, the
pinned room track, the scaling wordmark mask, the flipping menu book, and the page-transition curtain.
They must degrade to a plain scrolling page rather than break when a device cannot drive them.

**PR-3 Never render blank.** If the database is unreachable, every page still renders the signed-off
content from the design defaults. A database outage must not take the shopfront down.

**PR-4 Mobile parity.** Every flow — including booking and chat — completes on a phone. Persistent
mobile bar with call, WhatsApp and book.

**PR-5 Discoverability.** Per-page titles and descriptions, Open Graph and Twitter cards, canonical
URLs, indexable.

## 5. Scope — booking flow

A five-step panel, openable from anywhere in the site, plus a confirmation step.

| Step | Requirement |
| --- | --- |
| 1 · Dates | Calendar, check-in / check-out, adults, children, rooms. Cannot select the past; checkout must follow check-in. |
| 2 · Room | Rooms that sleep the party, each showing rate, imagery, and **rooms left for these exact dates**. Sold-out categories are shown as sold out, not hidden. Sortable. |
| 3 · Extras | Airport pick-up, car with driver, tour package, extra bed (priced per night), early check-in. |
| 4 · Details | Name, mobile, email, arrival time, notes. Inline validation, in the active language. |
| 5 · Payment | bKash / Nagad / Card selected and recorded. Full price breakdown: room nights, extras, 15% VAT, total. |
| 6 · Confirmation | `HV-XXXXX` code shown and copyable. |

**BK-1 Real availability.** Rooms free = category inventory − reservations overlapping the stay
(`ci < otherCo && co > otherCi`, so a same-day checkout and check-in do not collide). Cancelled and
rejected bookings do not consume inventory.

**BK-2 The guest always leaves with a code.** If the write to the database fails, the panel still
issues the confirmation code and reception reconciles by phone. A backend error must never look to
the guest like a failed booking.

**BK-3 Price transparency.** The guest sees the total, inclusive of VAT and extras, before confirming.

**BK-4 Sky View tables.** A three-step flow — date/time/party → name and mobile → `SV-XXXX` hold code.

## 6. Scope — AI reception desk

A chat widget on every page, backed by Llama 3.3 70B on Groq, server side.

**AI-1 Live facts.** The system prompt is built from live room data at request time, so quoted rates
and codes always match what the admin has set. It knows today's date and resolves relative dates
("next week", "next month 21 to 23").

**AI-2 Conversational booking.** It collects, across turns: dates or check-in plus nights, guest name,
mobile, email, and room choice — recommending a category that fits the party.

**AI-3 Handoff, not a dead end.** Every reply carries a hidden `||BOOKING_DATA:{…}||` block the client
parses to pre-fill the booking panel. On guest confirmation the assistant marks it `"complete":true`,
which opens the panel at the payment step with everything filled in.

**AI-4 The key never reaches the browser.** All model calls are server side. (The prototype shipped
the key to the client; this is a hard requirement, not an improvement.)

**AI-5 Graceful failure.** If the model or the key is unavailable, the widget returns the reception
phone number rather than an error.

**AI-6 Tone.** Warm, professional, two to three sentences.

## 7. Scope — admin portal

`/admin`, password gated, seven panels. Every write lands in the database and appears on the public
site on the next page load.

| Panel | Requirement |
| --- | --- |
| Dashboard | Revenue, occupancy tonight, room nights by weekday, table reservation count |
| Bookings | Full reservation list; mark paid; cancel; printable invoice per booking |
| Room management | Rate, inventory, bookable on/off, copy and imagery per category |
| Sky View menu | Add, edit, reorder, retire menu lines by category |
| Gallery | Add, edit, reorder, retire photographs by category |
| Messages | Contact-form submissions, markable as handled |
| Site settings | Phone numbers, address lines, WhatsApp, social links, restaurant hours, from-rate, email |

**AD-1 Session.** Login sets an httpOnly cookie holding a hash of the admin password, never the
password. Every admin API route checks it.

**AD-2 Content authority.** Once a row exists in the database it wins over the design default. Seeding
copies the defaults in and is safe to re-run.

**AD-3 Freshness.** Public pages render dynamically so an admin edit is visible on the next load
without a deploy.

## 8. Data and API

Postgres (Neon) via Prisma. Models: `Booking`, `TableReservation`, `ContactMessage`, `Room`,
`MenuItem`, `GalleryImage`, `Facility`, `Service`, `Attraction`, `Addon`, `Setting`.

| Route | Method | Auth | Purpose |
| --- | --- | --- | --- |
| `/api/availability` | GET | public | Rooms free for `?ci=&co=&guests=` |
| `/api/bookings` | POST / GET | public / admin | Place a booking · list reservations |
| `/api/bookings/[id]` | PATCH, DELETE | admin | Mark paid · cancel |
| `/api/reservations` | POST / GET | public / admin | Sky View tables |
| `/api/messages` | POST / GET, PATCH | public / admin | Contact form |
| `/api/content/[model]` | GET / POST, PATCH, DELETE | public / admin | Rooms, menu, gallery, facilities, services, attractions, add-ons |
| `/api/settings` | GET / PATCH | public / admin | Phones, address, social, hours |
| `/api/chat` | POST | public | AI reception desk |
| `/api/admin/session` | POST / DELETE / GET | — | Log in, log out, check session |

## 9. Non-functional requirements

- **NF-1 Resilience.** Database unreachable → design defaults for content, prototype behaviour for
  availability, booking codes still issued. No blank pages, no dead flows.
- **NF-2 Secrets.** `GROQ_API_KEY` and `ADMIN_PASSWORD` are server-only. The fallback admin password
  is never printed on a production login screen; an unset `ADMIN_PASSWORD` logs a server warning.
- **NF-3 Accessibility.** Alt text on every photograph (already authored per image), keyboard-operable
  booking panel, and motion that degrades.
- **NF-4 Performance.** Photography is currently ~2 MB per file served from `/img` and `/uploads`.
  Compressing it and moving to `next/image` is the outstanding performance requirement.
- **NF-5 Stack.** Next.js 14 App Router, React 18, TypeScript, Prisma, Neon. Deployed on Vercel.

## 10. Open questions

These are unresolved in the content today and must be answered by the property before launch copy is
final. They are marked `CONFIRM` in `lib/defaults.ts`.

1. Sky View opening hours (`restaurantHours`).
2. The hotel's public email address (`email`).
3. Distances from the hotel for all four Explore destinations (`dist`).
4. Whether `HV-07 Deluxe Four Bed` should keep the Twin Deluxe photograph or get its own.
5. Cancellation window and refund percentages, for the policy page and for the booking terms the guest
   accepts at step 5.

## 11. Next phase (v1.1)

Ranked by what the property gets back.

1. **Booking confirmation to the guest.** SMS and email on confirmation, and on cancellation. Today the
   guest leaves with a code and nothing else; this is the largest single gap.
2. **Image pipeline.** Compress the photography and move to `next/image`. Biggest measurable win on a
   phone over mobile data in Noakhali.
3. **Payment capture.** bKash and Nagad checkout, so the panel takes money rather than recording an
   intent.
4. **Admin accounts.** Named users with roles (reception vs management) instead of one shared password,
   and an audit line on rate changes.
5. **Rate calendar.** Seasonal and weekend rates per category, rather than one rate per room.
6. **AI reception desk, phase two.** Let it answer availability from `/api/availability` directly, and
   handle Sky View table holds as well as rooms.
