# Development

For playing, controls and map submissions, start with the [game README](../README.md). This guide covers working on the source and preparing releases.

## Run locally

Use Node.js 18 or newer. There are no npm dependencies to install.

```sh
npm start
```

Open http://127.0.0.1:4173. To use another port: `PORT=4174 npm start`.

```sh
npm test               # Engine, room, save migration and bundle checks
npm run audit:levels   # Replay all shipped winning routes and 1,000 maze seeds
npm run build          # Build the website and self-contained offline HTML
npm run release        # Verify and prepare upload folders and downloads
```

The release command also uses the standard `zip` utility, available on macOS and GitHub's Ubuntu runners.

## Hosting and release files

The [hosting guide](hosting.md) covers GitHub Pages and other static hosts. The included Pages workflow verifies pushes to `main` and deploys the game from `dist/` when configured with **Settings → Pages → Source → GitHub Actions**. It does not deploy the README or developer walkthroughs.

`npm run release` generates:

| Output | Purpose |
| --- | --- |
| `release/Blobbo.html` | Self-contained game for offline play |
| `release/upload-to-host/` | Ready-to-upload static website |
| `release/upload-to-github/` | Clean source repository, including hidden workflow files |
| `release/blobbo-web.zip` | Website ZIP, with `index.html` at the root |
| `release/blobbo-source.zip` | Complete source ZIP |
| `release/START-HERE.txt` | Upload instructions |
| `release/SHA256SUMS` | Download checksums |

These paths are generated locally and ignored by Git. The Pages workflow also makes the release outputs available as a build artifact. See [hosting and release](hosting.md) for distribution options.

## Project structure

- `src/` — engine, canvas renderer, audio, UI and playable rooms
- `maps/` — editor JSON examples and community map submissions
- `tests/` — behavior checks and solution fixtures; historical rooms remain as regression fixtures
- `scripts/` — local server, build, room audit and release packaging
- `docs/` — verification, research, credits and developer walkthroughs
- `.github/workflows/` — automated checks and Pages deployment

## Puzzle verification

Built-in solution keys are kept outside the browser assets. The [room audit](level-audit.md) explains what is verified and what still depends on human playtesting. The [five-designer tournament](tournament-2026-10-24.md) records how the two newest Extra hard rooms were selected, including the later starting-position correction.

Developer [Regular solutions](solutions.md) and [Extra hard solutions](challenge-solutions.md) contain spoilers. Keep solutions out of the playing interface and use them to verify complete, legal winning routes when changing a map.

For new room submissions, follow the [map contribution guide](../maps/README.md).

## Scope and references

This is an independent reconstruction. Some original gadgets are still unimplemented, and exact historical behavior is not guaranteed. The optional generator produces solvable mazes rather than authored gadget puzzles. [Verification notes](verification.md) document the checks and remaining limits; [research notes](research.md) record the references.

The engine, artwork, sound effects, music and room layouts were created for this project; no original game assets or executable are bundled. Rights remain reserved under [LICENSE](../LICENSE).
