This is a very large scope (9 major feature areas, dozens of subfeatures). To keep quality high and avoid a half-broken build, I'll deliver in prioritized phases. Please confirm the phase order — or tell me which to do first and I'll skip the rest for now.

## Phase 1 — Core booking flows (highest value)
- Complete Movie flow: Movie → Seats → Food → Payment → QR Ticket (downloadable PNG)
- Fix Food & Snacks: full cart (add / qty / remove / summary / checkout), all 14 categories, link cart into gaming + movie checkout
- Ensure gaming flow mirror: Game → Slot → Food → Payment → QR Gaming Pass
- QR generation via `qrcode` lib; downloadable ticket component reused for both flows

## Phase 2 — Content expansion
- Gaming library expanded to the full 20-title list (GTA V, GTA VI Coming Soon, Minecraft, WWE 2K, EA FC, Valorant, PUBG, COD, Fortnite, Rocket League, Tekken, MK, NFS, RDR2, AC, Forza, Spider-Man, GoW, Elden Ring, VR) with cover, banner, rating, genre, price, Book Now
- GTA VI "Coming Soon" card: countdown, status, trailer modal, Notify Me + Wishlist (localStorage), no booking button
- Play Online: expand to 18 games with cover/category/difficulty/mode badges; ensure all registered games actually run (fill gaps: Bubble Shooter, Solitaire, Minesweeper, Connect Four, Ludo, Checkers, Air Hockey, Pool, Uno, Racing — some as playable, some as "coming soon" stubs if time-boxed)

## Phase 3 — Rewards & personalization
- ArenaCoins wallet + XP store (persisted in arena-store)
- Daily Spin wheel (24h lockout via localStorage timestamp)
- Daily challenges, achievement badges, login streak
- Leaderboard page, redeem catalog (gaming/movies/snacks/membership/tournament)

## Phase 4 — Premium UX
- Live search (global command palette style)
- Wishlist, Favorites, Continue Playing/Watching, Recently Booked, Popular/Trending, Recommended
- Live occupancy indicator on booking pages
- Booking history / payment history in Profile
- Event calendar, new arrivals, referral program, in-app notifications drawer
- QR entry verification page (scan mock)

## Phase 5 — Responsiveness + navigation audit
- Sweep every route with responsive grid/padding fixes (mobile-first)
- Verify homepage links to: Gaming, Movies, Play Online, Food, Tournaments, Support, Profile, Membership, Leaderboard, About, Booking
- Remove any dead links; add mobile bottom-nav for key destinations

## Technical notes
- No backend / Cloud enablement needed — everything stays client-side in the existing `arena-store` (localStorage) to preserve current architecture
- New deps: `qrcode` (QR generation), `canvas-confetti` (spin wheel celebration)
- Preserve existing luxury theme, tokens, and Shell layout — extension only, no redesign
- Each phase ends in a runnable, non-broken state

**Recommendation:** ship Phase 1 + 2 in this turn (most user-visible), then Phase 3–5 in follow-ups. Doing all 5 in one turn risks regressions across ~40 files.

Reply with: "do all", "phase 1+2 only", or list the specific items you want first.