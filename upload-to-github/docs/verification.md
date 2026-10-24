# Release verification

## 0.6.2 — Upload folders and full screen

Checked 24 October 2026. All **163 automated tests**, **48 authored solutions**, and **1,000 generator seeds** pass. Room layouts and puzzle rules are unchanged.

The ready-to-upload website runs from a project subdirectory in the actual browser. Checked movement, undo, editor access and the new Full screen control with audio muted; no browser errors or warnings. The fullscreen request was accepted and the button changed to Exit full screen, and Escape returned to ordinary play. The embedded test browser did not retain fullscreen between later automation actions, so persistent fullscreen and removal of browser chrome still need a manual check in the player's standalone browser.

Both upload folders are generated from an explicit source allowlist. The website's index.html is byte-identical to the offline HTML. The website ZIP contains only that game, credits, license and .nojekyll. The source ZIP includes hidden workflow files and excludes generated output, local reports, browser saves and earlier builds. Both archives pass integrity checks and the download checksums match. A fresh source extraction rebuilds the same offline HTML without installing dependencies.

GitHub deployment remains unrun because no repository has been published. Direct-file and physical-phone limitations below still apply.

## 0.6.1 — Death animations

Checked 24 October 2026. All **163 automated tests**, **48 authored solutions**, and **1,000 generator seeds** pass. New tests cover incoming impact coordinates in all four arrow directions, ball compression, mirrored arrow contours, fatal terrain and adjacent spikes, isolated trace/undo snapshots, visual metadata excluded from solver identity, and drawing each impact object exactly once.

Actual browser checks covered ball crushing, left/right arrow penetration, spike impacts, fire, water and holes. Every death leaves the board unobscured with frame controls instead of the old result card. Tested frame-button undo/restart, keyboard undo/restart during an unfinished animation, a safe move after cancellation, reduced-motion death, and a subsequent legal room win. The room-completion card still works. Checked death recovery and undo inside a 390px-wide viewport. Sound and music stayed off during these game checks; no browser errors or warnings were recorded.

Also tested the rebuilt single-file HTML over localhost with a fatal ball move and checked its recovery controls. Automated bundle checks confirm inline code, styles and icon, with no external gameplay assets. The release artifacts are regenerated from the tested source. Direct-file browser security behavior and touch operation on a physical phone remain the manual limitations described below.

The original Ball, Left Arrow, Right Arrow, Flame and Drown sheets were decoded as temporary research references. The new artwork is independently drawn; exact original timing and recovery UI remain unverified. See [the death-animation research notes](research.md#death-animation-follow-up--24-october-2026).

## 0.6.0 — Compact challenge contest

Checked 23 October 2026. All **158 automated tests**, **48 authored solutions**, and **1,000 generator seeds** pass. Two selected 15 × 13 layouts match their frozen blind-test hashes. Tests replay their complete 45- and 90-action winning references and check four wrong-order branches against the documented blocked configurations. Challenge keys are absent from browser assets.

Three designers and six fresh blind players completed two design rounds and twelve timed attempts. One of the four attempts on the selected pair reached the eight-minute limit. The other selected room was the hardest fully solved entry; it is not presented as undefeated. See [complete contest results and limitations](challenge-contest.md).

In the actual browser, completed both selected rooms at 45 and 90 moves, checked next-room navigation and the two-room browser, switched among all three collections, and verified saved-room identity after reload and after removing an unselected candidate. Sound and music remained off. The focused map layout and hidden controls are preserved. No browser errors or warnings were recorded.

The source and website ZIPs pass integrity and boundary checks. A fresh extraction of the source ZIP passes all 11 challenge/bundle tests without dependencies or the ignored contest workspace. Rebuilt the offline HTML and both ZIPs; final checksums cover the downloads. The existing direct-file and physical-phone limitations below still apply.

## 0.5.1 — Plant orientation

Checked 23 October 2026. All **150 automated tests**, **46 authored solutions**, and **1,000 generator seeds** pass. New rendering regressions cover growing stems in all four directions, animation snapshots, cutting the tip and stems, and preserving undo states. The visual direction metadata does not affect puzzle rules or solver state identity.

In the actual browser game, grew the upward vine in “The green jack” through four stem segments and verified a continuous vertical stalk. No browser errors or warnings; sound and music stayed off. Rebuilt the offline HTML, website ZIP, source ZIP, and checksums.

## 0.5.0 — Repository preparation

Version 0.5.0, checked 23 October 2026.

- **148 automated tests passed.** Coverage includes engine interactions, campaign counterexamples, practice mechanics, audio activation, animation traces, saved-room migration, and standalone-bundle syntax/assets.
- **46 authored rooms replayed to legal wins**, with no blocked actions or deaths. **1,000 generated seeds (0–999)** also replayed to completion. [Full level audit](level-audit.md).
- Compared all 46 layouts and their original solution strings against the previous build: unchanged. Only campaign order and chapter grouping changed.
- Tested `npm run release` from a fresh extraction of the source ZIP, outside the workspace. Tests, audit, site build, offline build, and packaging all passed without installing npm dependencies.
- Checked both ZIPs for corruption and archive boundaries. The source includes `.github/workflows/pages.yml` and `.gitignore`; it excludes generated output and previous builds. The web ZIP has `index.html` at its root and excludes research, tests, and walkthrough documentation. SHA-256 hashes match all three downloads.
- Opened the extracted web ZIP in a real browser under `/blobbo-browser/`, matching GitHub Pages project-subdirectory hosting. Every runtime asset returned HTTP 200. Movement, undo, room selection, and reload worked with no browser errors or warnings.
- Observed the legacy first-room selection migrate to the same named room at its new position, with completed rooms and best scores intact. Selecting the new finale persisted correctly across reload.
- Opened the self-contained HTML file over localhost and checked its game and editor UI. No browser errors or warnings. Sound and music remained off throughout testing.

The workflow has been prepared but not run on GitHub, because no remote repository or deployment has been created. Direct `file:` playback and touch gestures on physical phones remain manual checks. Existing desktop/narrow viewport coverage is described in the README; this release did not change layout or input behavior.

Puzzle solvability is established by successful execution. Puzzle difficulty and the clarity of the prose walkthroughs still benefit from blind human playtesting. The audit explicitly distinguishes known winning routes from globally shortest solutions.
