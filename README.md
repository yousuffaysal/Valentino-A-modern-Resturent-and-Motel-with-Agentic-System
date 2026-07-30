# Hotel Valentino

The Hotel Valentino site (Main Road, Maijdee Court, Noakhali) built as a Next.js 14 App Router
application, with a Neon PostgreSQL database behind it so reception can change rates, content and
reservations without a deploy.

The design source is the approved single-file prototype (`Hotel Valentino.dc.html`). Every section,
transition and piece of copy in the public site is a port of that file; the database and admin portal
are the additions that make it operable.

---

## Running it

```bash
npm install
npm run db:push     # create the tables
npm run db:seed     # load the design defaults (safe to re-run)
npm run dev         # http://localhost:3000
```

Environment (`.env`, see `.env.example`):

| Key | Purpose |
| --- | --- |
| `DATABASE_URL` | Neon / PostgreSQL connection string |
| `GROQ_API_KEY` | Server-side key for the AI reception desk |
| `ADMIN_PASSWORD` | Password for `/admin`. Falls back to `valentino` if unset — set it before going live |

---

## How it is put together

### Content: database first, design defaults second

`lib/defaults.ts` holds the content exactly as signed off. `lib/content.ts` reads each collection from
the database and falls back to those defaults when a table is empty or the database is unreachable, so
the site never renders blank. Seeding copies the defaults into the database; from then on the admin
portal is the source of truth.

Editable collections: rooms, menu, gallery, facilities, services, attractions, add-ons, settings.

### Motion

`components/motion/MotionRoot.tsx` is the whole animation system in one client component: Lenis smooth
scroll, the section rail, reveal / counter / clip-fill observers, hero split text, the pinned room
track, the scaling wordmark mask, the flipping menu book, and the responsive chrome rules. Sections opt
in with `data-hv-*` and `data-rev` / `data-fill` / `data-count` attributes, the same way the prototype
opted in with refs.

### Styles

The prototype is written entirely in inline CSS declarations. Rather than hand-convert them (and drift
from the design), `lib/css.ts` parses those declaration strings into React style objects at runtime,
memoised per string. `data-hover-style` reproduces the prototype's `style-hover` attribute.

### State

`context/SiteContext.tsx` owns language, the booking panel state machine (dates → room → add-ons →
details → payment → confirmation), the Sky View table flow, the chat transcript and the page-transition
curtain. `components/chrome/TLink.tsx` plays that curtain before each route change.

### Availability

`lib/availability.ts` computes what is free for a stay from category inventory minus overlapping
reservations, rather than the prototype's pseudo-random placeholder. If the database is unavailable it
falls back to the prototype behaviour so the booking flow still works.

---

## API

| Route | Method | Auth | Purpose |
| --- | --- | --- | --- |
| `/api/availability` | GET | public | Rooms free for `?ci=&co=&guests=` |
| `/api/bookings` | POST | public | Guest booking from the panel or the chat |
| `/api/bookings` | GET | admin | Reservation list |
| `/api/bookings/[id]` | PATCH, DELETE | admin | Mark paid / cancel |
| `/api/reservations` | POST / GET | public / admin | Sky View tables |
| `/api/messages` | POST / GET, PATCH | public / admin | Contact form |
| `/api/content/[model]` | GET / POST, PATCH, DELETE | public / admin | Rooms, menu, gallery, facilities, services, attractions, add-ons |
| `/api/settings` | GET / PATCH | public / admin | Phones, address, social, hours |
| `/api/chat` | POST | public | AI reception desk (Groq, key stays server side) |
| `/api/admin/session` | POST / DELETE / GET | — | Log in, log out, check session |

Admin routes are guarded by an httpOnly cookie holding a hash of `ADMIN_PASSWORD`.

---

## Admin portal

`/admin` — password gated. Dashboard (revenue, occupancy tonight, room nights by weekday, table count),
bookings table with printable invoices, room management (rate, inventory, bookable), Sky View menu,
gallery, contact messages and site settings. Every change writes to the database and appears on the
live site on the next page load; pages render dynamically for that reason.

---

## Notes

- Photography lives in `public/img` and `public/uploads`. The files are large (~2 MB each); compressing
  them or moving to `next/image` is the obvious next performance win.
- The AI assistant returns a hidden `||BOOKING_DATA:{…}||` block that the client parses to pre-fill the
  booking panel, and `"complete":true` opens it at the payment step.
