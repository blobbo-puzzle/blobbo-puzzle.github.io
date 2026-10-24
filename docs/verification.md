# Release verification

## 0.8.0 — Expanded compact rooms and blind tournament

README preview follow-up: the earlier sparse screenshots were replaced with **684 frames at 50 fps** (13.68 seconds, 1112 × 774, 274,451 bytes). Capture used the unchanged `animateTurn` function and browser canvas renderer with a deterministic 20 ms frame clock, preserving the game's 220 ms walk timing and all five walking poses; no interpolated frames were invented. Static window chrome was captured from the game CSS. Palette and delta-frame compression keep the GIF small. The 17 × 11 Palm Lake example replays to a legal win in 33 actions with both chests, no deaths and no blocked moves. The loop was reviewed at README display size. Its editor JSON is included under `maps/`, together with submission guidance; this demo is separate from the 34 built-in rooms.

Follow-up: Second Floor now starts one tile below the spike line. Its initial puzzle state matches the original layout after Down; the updated 42-action reference and both wrong-order checks pass. The original tournament hashes and logs are retained, with the start revision recorded separately. All 229 tests still pass, and the revised room was completed in the browser in 42 moves. L now invokes fullscreen and the control reads “Full screen (L)” / “Exit full screen (L)”; typing L in the editor name remains ordinary text input. The in-app browser accepted fullscreen entry and changed the label, but does not retain fullscreen between automation interactions, as noted in the earlier fullscreen check. Audio remained off and no browser warnings or errors were recorded.

Checked 24 October 2026. All **229 automated tests** pass. The shipped set contains **30 Regular and 4 Extra hard rooms**. Every winning reference and generator seeds 0–999 replay legally, with complete collection and no deaths or blocked actions. The first 11 Regular layouts and both existing Extra hard layouts retain their exact rows and save IDs. New Regular references take 9–51 actions, within footprints no larger than 13 × 10.

Five gpt-6-astra/high designers produced the candidates; fresh gpt-6-luna/high players used a logged interface without keys or search. Each selected new Extra hard layout has three valid eight-minute/60-batch attempts, with at least two failures; combined result **6/6 unsolved**. Unsuccessful runs affected by an omitted rule and an early finish were excluded and rerun. The [tournament report](tournament-2026-10-24.md) retains those exclusions, all screening results, hashes, budgets and limitations. This does not estimate human solve rates.

The pickup bubble now lasts two seconds and appears only twice per map. Unit and actual-browser checks cover independent map budgets, persistence across undo/restart/reload and changed editor layouts. The browser showed pickups one and two and stayed quiet on the third and after reload. The silent README GIF was recaptured from the actual game.

Browser checks completed room 30 in 48 actions, and both finalist layouts through the editor in 43 and 103 actions with full animation. Room 30 fits a 390px-wide viewport; its directional buttons and undo work, and completion/selection persist after reload. Enter/Return was checked after an ordinary win, after the last built-in room, and after a successful editor playtest. It stays inactive during play and preserves native Enter activation on a focused button. The optional guide displays the rounded-object rule. Sound and music stayed off. The main standalone-game tab recorded no console warnings or errors. The iframe test harness emitted the known automation MutationObserver error; the game contains no MutationObserver code, and its visible layout and controls were checked successfully through native UI actions.

The final website and source archives pass integrity and content-boundary checks, their SHA-256 checksums match, and a fresh source extraction rebuilds byte-identical standalone HTML without installing dependencies. Built-in solutions, tournament logs and walkthroughs are excluded from the website and standalone HTML. Physical-phone touch and browser-specific direct-file restrictions remain manual checks. No commit, push or deployment was performed.

## 0.7.0 — Compact Regular rooms

Checked 24 October 2026. All **186 automated tests** pass. The shipped set contains **11 new Regular rooms and 2 unchanged Extra hard rooms**. All 13 winning references and generator seeds 0–999 replay successfully. Regular witnesses take 16–34 actions in rooms no larger than 11 tiles on either axis. The old maps now serve only as historical engine regression fixtures.

Six selected wrong-order branches are exhaustively unsolvable after the mistake; two constrained searches establish that key object uses cannot be bypassed. A capped search is never accepted as a proof. These checks establish mechanics and solvability, not a human difficulty ranking; the new Regular set has not been blind-tested. See [the current audit](level-audit.md).

New stable IDs prevent old campaign completions from marking replacement layouts as solved. Existing Extra hard IDs and stored custom rooms are retained. Built-in solution strings and walkthroughs are outside both browser builds.

Actual browser checks completed Borrowed Weight in 16 moves and The Green Jack in 18, exercised undo/restart and editor access, and verified Extra hard selection after reload. A representative old campaign save opens the new Regular set with no false completions and retains its custom room. The standalone HTML accepts moves and fits a 390px-wide frame. Sound and music remained off. No errors or warnings were recorded in the main game tab. Inspecting the narrow test iframe produced an automation MutationObserver error (the game does not use MutationObserver); its visible layout, movement and undo were subsequently checked through the UI. Physical-phone touch and direct-file browser restrictions remain manual checks.

The release archives pass integrity and content-boundary checks, checksums match, and a fresh extraction of the source archive rebuilds byte-identical standalone HTML without installing dependencies.

Every tool pickup now shows a five-second speech bubble naming the tool and explaining X to drop onto empty floor ahead; narrow/touch layouts also point to the gear-menu Drop control. Browser checks cover extinguisher, shears, axe, repeated pickup, dismissal after dropping and undo, automatic timeout, and phone-width placement. The 186-test suite still passes; the puzzle engine and maps are unchanged by this UI follow-up.

The README preview is a silent capture of the actual browser game, cropped to its window. The earlier release records below describe checks at the time of those releases, not the current shipped room count or publication status.


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
