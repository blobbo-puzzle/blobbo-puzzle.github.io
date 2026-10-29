# Second design tournament — 30 October 2026

Designer agents (**claude-opus-5.5 / max reasoning effort**) built Extra hard candidates in four mechanic palettes: ballistics, garden tools, pits and spikes, and minimalist rooms. Fresh blind agent players then tried each frozen layout. **Seven rooms were added to Extra hard after maintainer playtesting.** No blind-failure claim is made for them: every room that was played blind was solved by the stronger player, and four of six by the cheaper one too. Calibration showed the stronger player also solves all four existing Extra hard rooms.

## Method

Designers worked with a local analysis tool on the unchanged engine. It reports the breadth-first shortest win, the complete reachable state graph with single actions that make a winnable position hopeless, and ablation searches that forbid one interaction to show it is necessary. All seven selected references equal the shortest winning route. Designers saw blind results and revised between rounds.

Each blind attempt used a fresh agent with a neutral puzzle ID, a precise rules sheet, a text board and a logged play interface. The allowance was 15 minutes and at most 60 batches of up to 20 actions, with unlimited undo and restart. Automated search, code, designer files, solutions and git history were prohibited; reading the engine source to understand a rule was allowed. Separation was procedural, not a security boundary. Every logged win was independently replayed.

- **Stronger player:** claude-sonnet-5.5 / high.
- **Cheaper player:** claude-haiku-5.5 / high.

## Results

| Room | Size | Reference | Sonnet 5.5 (high) | Haiku 5.5 (high) |
| --- | --- | ---: | --- | --- |
| Cellar Door | 11 × 9 | 23 | Solved, 105 s | Solved, 366 s |
| The Doorman | 9 × 9 | 37 | Solved, 114 s¹ | Solved, 343 s |
| Standoff | 10 × 8 | 29 | Not played² | Not played² |
| The Lean-To | 11 × 8 | 28 | Solved, 120 s | Unsolved; stopped with 11 min left³ |
| Top Shelf | 11 × 8 | 38 | Solved, 127 s | Solved, 564 s |
| Tenth Frame | 10 × 9 | 29 | Solved, 232 s | Unsolved; stopped with about 6.5 min left³ |
| Greenhouse Aisle | 15 × 10 | 41 | Solved, 272 s | Solved, 260 s |

Calibration on the existing rooms used the same protocol:

| Room | Sonnet 5.5 (high) | Haiku 5.5 (high) |
| --- | --- | --- |
| Secondhand Supports | Solved, 136 s | Solved, 236 s |
| The Last Cork | Solved, 181 s | Solved, 346 s |
| Second Floor | Solved, 200 s | Unsolved, full allowance |
| The Third Hand | Solved, 490 s | Unsolved; stopped with about 7 min left³ |

1. The rules sheet for this first attempt included an example of a ball stopping a spike's charge, close to the room's central idea. The example was removed before any later attempt.
2. Standoff shares The Doorman's spike lure and was verified by replay and exhaustive search only.
3. The player concluded, wrongly, that the room was impossible and stopped. The interface refuses an early unsolved finish, so these attempts are unsolved but did not use the whole allowance.

## Rules-sheet corrections

- Added the exact order of events within one turn, which spike-luring rooms depend on.
- Removed the example noted above (1).
- Replaced "one square at a time" for spikes, balls and arrows with an explicit statement that each flight or charge completes within the same turn. Two cheaper players had read it as one square per turn.
- Extended the prohibited reading list to `docs/`, `tests/`, `maps/` and the room sources before the calibration attempts.

## Selection and limits

The stronger player solved every room it was given in 105–490 seconds, usually after planning the full route in its head. Trap density did not slow it: rooms with 96–99.7% hopeless reachable states fell as fast as others. Rooms that slowed or stopped players needed an object in an unexpected role, such as an arrow as a shield or a vine as a stopper.

Selection therefore rests on the maintainer's judgement that the rooms are hard enough for people, plus verification:
- each reference replays legally through the engine;
- each reference equals the breadth-first shortest win;
- each room has one exhausted wrong-order check in the test suite.

These are statements about agents under a bounded protocol, not human solve rates. Raw attempt logs, designer files and analysis tools stayed in a local, untracked workspace.
