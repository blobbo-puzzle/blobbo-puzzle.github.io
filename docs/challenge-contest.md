# Compact challenge contest

This document records a bounded puzzle-design and blind-play experiment. It is not a human difficulty benchmark.

## Protocol

Three independent designer agents construct one map each using the unchanged game engine. All candidates have exactly 15 columns and 13 rows, including the outer walls. Each needs a completely legal winning route of at most 110 actions; the design target is 40–90. The goal is several interdependent decisions and reuse of objects, rather than longer walks. Prototype water filling and vertical-arrow extensions are excluded.

Before testing, the referee replays each solution, freezes the map, and hashes its rows. Fresh solver agents receive neutral puzzle IDs, only the board and complete rules, and a logged play interface. They do not receive titles, design notes, solution strings, or earlier players' attempts. The same engine is used to play and verify solutions.

Each map receives two independent blind attempts. An attempt allows eight minutes from its first `start` and at most 60 manually planned move batches of 1–20 actions, whichever limit arrives first. Undo, restart, and board inspection are allowed. Automated search, enumerating possible move sequences, reading designer files, and asking other players are prohibited. The isolation is enforced by agent instructions and separate packets, not by an operating-system sandbox.

Primary selection evidence is the number of unsolved blind attempts. The referee also checks solution length, actual object interactions, critical dependencies, and obvious shortcuts. A timeout is recorded as a timeout, not a proof that a map is impossible or that it is harder for every human. Differences in agent strategies and the small sample remain important limitations.

All submissions and their test outcomes are recorded below. Only selected, independently replayed maps are added to the optional challenge collection. Solution keys belong in test fixtures and separate spoiler documentation, not in the browser assets.

## Round 1: rejected drafts

All six attempts succeeded, so none of these drafts qualified for the extra hard set. Each winning route was independently replayed by the referee.

| Submission | Reference route | Blind attempt 1 | Blind attempt 2 | Decision |
| --- | ---: | --- | --- | --- |
| Borrowed Bearings | 42 moves | Solved, 4m 14s, 16 batches | Solved, 4m 41s, 12 batches | Revise: many mechanisms, but few competing plans |
| Borrowed Growth | 65 moves | Solved, 2m 55s, 8 batches | Solved, 3m 18s, 9 batches | Revise: both players bypassed intended growth dependency |
| The Shield Exchange | 83 moves | Solved, 2m 19s, 6 batches | Solved, 3m 29s, 10 batches | Revise: clear initial deductions followed by too much tool transport |

Reference routes are legally verified, shortened upper bounds. Blind routes can differ and contain detours. In particular, a player found a 77-move route through The Shield Exchange.

The designers receive this feedback for a second round. Footprint, action cap, rules, and blind attempt allowance stay the same. New players receive new neutral packets without this feedback or the first-round layouts. This is iterative selection, not a preregistered one-shot benchmark.

## Round 2: final selection

Three fresh players made six new attempts, with each map played once first and once second. The engine and maps stayed frozen throughout each attempt. The referee independently replayed every reported winning route and verified the packet hashes. The unsolved attempt used its full time allowance; its last accepted action was at 474.6 seconds and the finish record was at 483.8 seconds, after play had closed at eight minutes.

| Submission | Verified reference | Blind attempt 1 | Blind attempt 2 | Selection |
| --- | ---: | --- | --- | --- |
| The Last Cork | 90 moves | Solved, 4m 35s, 8 batches | **Unsolved at 8-minute limit**, 11 batches, 2/3 chests | Contest winner; included |
| Secondhand Supports | 45 moves | Solved, 6m 18s, 11 batches | Solved, 4m 34s, 10 batches | Strongest fully solved entry; included |
| The Relay Garden | 80 moves | Solved, 2m 24s, 6 batches | Solved, 3m 02s, 5 batches | Excluded: quickly solved by both players |

The winning garden attempts used 73 and 76 moves, showing that a longer authored plan did not establish greater difficulty. It is retained in the local experiment record, not added to the challenge collection.

**Only The Last Cork stumped a tester.** Secondhand Supports is a runner-up, not an undefeated map. Both of its attempts took longer than either garden attempt, and its 45-move reference provides the more compact execution. The selected rooms offer different kinds of reasoning: shared object movement and release order in one, constrained object placement and resource use in the other. Their references have 11 and 25 interaction turns respectively; this is a descriptive count, not a difficulty score.

Across both rounds, 11 of 12 attempts succeeded and one reached the time limit. The final collection therefore does not claim to contain two maps that defeated players, much less maps proven hard for every human. The timeout included a coordinate error, a failed route through locked stairs, and substantial progress; it was not an engine error or an impossible map. One successful support-room player described mostly planning, while the other described walking between a few decisive discoveries. That disagreement is retained rather than replaced with a universal difficulty label.

## Evidence and limits

- [Machine-readable outcomes and frozen map hashes](challenge-contest.json) include every submission and all twelve attempts, including rejected drafts. The game tests require the selected layouts to match their tested hashes.
- Raw local attempts, debriefs, authoring work, and referee checks are in `reports/contest-2026-10-23/`, ignored by Git and excluded from release archives. The source repository retains the compact outcome record and selected winning references.
- Two batches had malformed reason arguments (round 1 solver 3, round 2 solver 5): an accidental space caused planned continuation text to be recorded as the reason. The players disclosed this; their executed moves, timings, and wins remained logged and independently replayable. No extra actions or time were granted.
- Players used text boards and a logged play interface, with full rules available. This tests agent planning under a time limit, not graphical perception or a representative human audience. Second attempts can benefit from learning rules on the first map.
- Authoring search counts are not used as the ranking criterion. They depend heavily on the heuristic, state representation, and irrelevant branches. No automated search was permitted during blind play.
- Instructions and fresh contexts enforce the separation procedurally. All agents share the filesystem, so this is not a security-isolated experiment. There is no claim of statistical significance or global optimality.
- Developer [challenge solutions](challenge-solutions.md) contain spoilers. They and the test fixtures are included in the source repository for verification, but excluded from the hosted game and offline HTML.
