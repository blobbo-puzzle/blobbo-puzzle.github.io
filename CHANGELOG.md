# Changelog

## 0.6.2 — Upload folders and full screen

- Add Full screen / Exit full screen to the gear menu, with an explanation when an embedded browser does not support it.
- Package separate ready-to-upload website and source-repository folders with clear setup instructions.
- Make the website ZIP use the self-contained game as index.html; include credits and the existing reserved-rights license.
- Preserve all rooms, puzzle rules, animations, and audio preferences.

## 0.6.1 — Death animations

- Balls descend onto Blobbo and flatten him underneath; arrows enter from their actual direction as his body recoils and crumples around the shaft.
- Independently redraw the impact stages after inspecting the original Ball and Left/Right Arrow resources. Exact playback timing remains a reconstruction.
- Replace the death card with the final pose on the unobscured board and small Undo/Restart controls in the grey frame. Keep keyboard shortcuts and give touch devices larger frame buttons.
- Add sinking, falling and scorching outcomes for water, holes and fire, plus spike impacts. Reduced motion goes straight to the final pose.
- Preserve puzzle rules and undo states; cancel unfinished impacts on undo/restart and synchronize the existing death sound with impact.

## 0.6.0 — Compact challenge rooms

- Added an optional challenge collection in the gear menu, with equal-sized rooms selected through independent blind play attempts.
- Ran three competing designers through two rounds, rejecting the first drafts after all six blind attempts succeeded.
- Kept challenge solutions and strategic explanations in developer fixtures and spoiler documentation, outside browser assets.
- Added winning-route, frozen-layout, and wrong-order consequence checks to the release audit.
- Preserve the selected room separately in each collection using stable IDs.

## 0.5.1 — Plant appearance

- Growing vines retain their direction in every stem, so vertical plants form continuous vertical stalks.
- Preserve stem orientation during animation, cutting, and undo without changing puzzle rules or layouts.

## 0.5.0 — Release preparation

- Replayed all 20 campaign rooms, 26 practice/experimental rooms, and 1,000 generated seeds to legal wins.
- Added repeatable auditing, shortened winning witnesses, and separate spoiler documentation.
- Reordered the campaign into four progression bands without altering the maps; old room selections and completion records retain their stable identities.
- Separated `src/`, `scripts/`, `tests/`, and `docs/` from generated `dist/`, `release/`, and `reports/`.
- Added a tested release command, source/site archives, checksums, and a GitHub Pages workflow.
- Retained all rights pending a later release-license decision.

## 0.4.0 — Focused game view

- Enlarged the map to fit the viewport, on black with a grey Macintosh-style frame.
- Moved controls into a gear menu with hover preview and click-to-pin behavior.
- Removed visible puzzle hints, solution descriptions, and difficulty/dimension labels.
- Added map drag/swipe movement and checked desktop and narrow layouts.

## 0.3.0 — Puzzle reconstruction

- Added the revised 20-room campaign, 24 practice rooms, and two labeled water experiments.
- Reconstructed local hazard release, ramps, shared supports, spike shields, plants, tools, and canoes.
- Added pose-based movement, synthesized effects, optional new music, an editor, room import/export, and a seeded maze generator.
