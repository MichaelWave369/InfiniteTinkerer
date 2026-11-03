# InfiniteTinkerer · Rung Roadmap

## Rung 001 · First working browser prototype

- Lil' Phi Guy original vector **placeholder** coin art, with Phi, tiny robots, spiral and 1 REPO badge. The original portrait-based commissioned coins can replace this once approved assets are supplied to the repository.
- Four interactive Infinite Quarter scene concepts with a Gen.E-Wrist and its suspicious string.
- Local audio file picker for an **original song provided by the creator**, with tiny synthesized fallback chime; no copyrighted audio bundled.
- 3/6/9 Pieces of Phi milestone tracker: 18 checkboxes per project, local-only state, minted coin.
- Φ Content Lab: original-text draft generator; editable drafts and local queue; vetted Facebook group research notes; manual qualified-view and earnings tracking by time slot.
- Responsive, keyboard-accessible layout; no build step; Node standard-library tests; MIT license.


## Rung 002 · Portrait video maker (implemented on this branch)

- 540×960 9:16 Canvas preview with four retro device mini-scenes and a returning green/gold quarter.
- Same eight-second four-phase story arc for jukebox, payphone, avocado kitchen phone and cosmic switchboard.
- The Gen.E-Wrist and suspicious string follow the coin through its trip.
- Local selection of the user's own coin PNG/JPG/WebP; use either previously generated medallion without uploading it to a server.
- Optional local original song, embedded in the exported clip when browser MediaRecorder and audio mixing are supported.
- On-device WebM or MP4 export depending on supported codecs; browser feature detection and graceful preview-only fallback.
- Timeline, coin positioning and encoding-choice unit tests. No dependencies, tracking, sign-in or paid renderer.

**Known limitations:** This produces stylized 2D animations, not photorealistic filmed hands or jukeboxes. Recording uses real-time Canvas capture, so rendering 8 seconds takes approximately 8 seconds. Audio inclusion varies by browser and should be checked before posting. Selected files remain session-only and are not synced; browser-local drafts and milestones from Rung 001 are unaffected.


## Rung 002+ · The real moving quarter

- Bring in the two approved portrait-based coin artworks as optimized web images, retaining the original vector placeholder as fallback.
- Upgrade the stage visuals: looping frame-based animation or Web Animations with deterministic retrieve motion; optional Gen.E-Wrist model/asset reference.
- Storyboard the jukebox, payphone, kitchen curly-cord and patch-switchboard as vertical 9:16 micro-scenes.
- Music synchronized to consented user-supplied track or original licensed assets. Avoid auto-playing media without a gesture.

## Rung 003 · Community discovery and measured distribution

- Import/export local dashboard JSON or CSV so browser clearing does not destroy the user's research.
- Store per-post content type, group, native-post URL and measured qualified-view data (do not infer from total views).
- Randomized or balanced posting-time experiment plans; sample-size warnings and comparisons without fake claims.
- Explicit human approvals, posting reminders, and official scheduling only where actually supported. **No Facebook scraping, mass group auto-posting, simulated human engagement, or bots.**

## Rung 004 · Pieces of Phi across Φ369

- Make manual milestone definitions extensible; optional verification links to repos, issues, commits, demos, CI.
- Add a public share card export of symbolic progress. Never call the collectible money, crypto or financial returns.
- Link out to Gen.E-Wrist, FieldConstellation/Phitarium, PhiOS, and other existing projects instead of duplicating their code.

## Hosting

Static site can run by opening `index.html` in a browser with module support via a local server, or with GitHub Pages using repository root / main after merge. For local serving, use `python -m http.server 8000`, then visit `http://localhost:8000/`.

## Privacy and provenance

- All local notes remain in browser localStorage; audio object URLs remain in memory for this session.
- No ad network, analytics collector, Facebook API integration, or hosted backend.
- Only publish original or properly licensed art and music.
- This project is not affiliated with Meta or Facebook.
