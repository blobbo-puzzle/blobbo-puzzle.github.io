# Compact-room tournament — 24 October 2026

Five independent **gpt-6-astra / high** designers submitted four Regular drafts and an Extra hard entry each. Nineteen additions were selected for Regular, including one screened challenge. The existing first 11 Regular rooms and two Extra hard rooms are preserved.

**2 new Extra hard rooms qualified.** Each has an independently replayed winning route and defeated at least two of three fresh **gpt-6-luna / high** players. This is a bounded agent experiment, not a measure of human solve rates.

## Method

Layouts were frozen and SHA-256 hashed after legal-route replay. Players received neutral IDs, the rules, and a logged board interface, with no names, walkthroughs or solution keys. Each attempt allowed eight minutes or 60 manually planned batches of up to 20 actions. Undo and restart were allowed. Automated search and direct engine play were prohibited; reading the rules implementation was permitted. Contexts were separate, but the filesystem was shared, so blindness was procedural.

All five entries received screening attempts. The most resistant distinct candidates received fresh follow-ups. Only candidates with three valid attempts and a majority of failures could enter Extra hard. Compactness, object reuse, variety and avoidable walking also informed selection. Winning move counts are verified upper bounds, not difficulty scores. Every logged win was independently replayed.

## Results

| Candidate | Size | Reference actions | Counted blind attempts | Placement |
| --- | --- | ---: | --- | --- |
| Three Brief Shields (puzzle-5) | 10 × 10 | 38 | Solved in 438.0 s (79 actions) | Not shortlisted |
| Second Floor (puzzle-1) | 9 × 9 | 43 | Unsolved at the 8-minute limit (11 batches); Unsolved at the 8-minute limit (13 batches); Unsolved at the 8-minute limit (8 batches) | Extra hard |
| The Chain of Custody (puzzle-3) | 15 × 11 | 85 | No counted attempt | Rejected before play |
| The Third Hand (puzzle-6) | 15 × 11 | 103 | Unsolved at the 8-minute limit (46 batches); Unsolved at the 8-minute limit (25 batches); Unsolved at the 8-minute limit (17 batches) | Extra hard |
| Two Passing Places (puzzle-4) | 10 × 9 | 51 | No counted attempt | Replaced before play |
| Switchyard (puzzle-7) | 11 × 9 | 51 | Solved in 103.0 s (63 actions) | Regular |
| Passing Places (puzzle-2) | 12 × 8 | 49 | Solved in 102.1 s (65 actions) | Not selected |

There were **9 counted attempts** (3 wins, 6 exhausted allowances) and **4 excluded attempts**. Detailed hashes, decisions, rules versions, command logs and debriefs are in the [machine-readable record](tournament-2026-10-24.json), which contains spoilers.

## Corrections and exclusions

- The first tool-chain draft had a shorter route that bypassed its intended dependency. It was rejected before blind play; the revised layout received a new ID and hash.
- The first two-cork challenge needed a right-hand wall border. Its playable geometry and reference stayed the same, but the corrected layout was frozen separately before play.
- The initial rules sheet omitted arrows sliding diagonally around balls. One completed and two interrupted attempts on the affected room were excluded. Its layout stayed unchanged; fresh players received corrected rules. The optional in-game field guide now explains this general rule too.
- One unsolved attempt ended 5.173 seconds early. It was excluded and replaced. The play interface now refuses an early unsolved finish.

No excluded or unfinished attempt contributes to the majority-failure requirement. The three other original screening rooms contain no bowling balls, so the rounded-object clarification did not affect their required mechanics.

Some players reported after the clock expired. The interface rejected further play at eight minutes; the raw record preserves the later finish timestamp separately from effective play time. The referee closed one overdue attempt after its play allowance had expired and then collected its debrief. No additional gameplay time was granted.

## Start-position follow-up

After the tournament, Second Floor’s start moved from (5,2) to (5,3), one tile below the spike line (zero-based coordinates). This is exactly the puzzle state after the original layout’s only safe progressing first move, Down. All objects and terrain are unchanged; the verified route is now 42 actions. The tests reconstruct and hash the original layout, replay that opening move, and check state equivalence. The three blind attempts above used the original start; their hashes and logs remain unchanged.

## Selection and limits

- **Three Brief Shields:** The first blind player solved it in 438 seconds using an alternative tool-cover route. A strong entry, but the two unresolved designs took priority. No majority-solve claim is made from one attempt.
- **Second Floor:** Selected for multiple roles played by just two movable objects in a 9 × 9 room. The reference takes 43 actions. All three fresh attempts with the corrected rules failed; the earlier incomplete-rule attempts do not count.
- **The Chain of Custody:** A verified 61-action shortcut bypassed the intended dependency. Rejected before any blind attempts; revised as a new layout.
- **The Third Hand:** Selected for coupled tool and storage decisions. All three valid blind players failed within the allowance. The longer 103-action reference has no removable contiguous detours; an independent constrained search exhausted 194,314 states without bypassing the central arrow interaction.
- **Two Passing Places:** An exterior right-hand wall column was missing. The corrected version preserves every playable square and reference action, but received its own frozen hash before testing.
- **Switchyard:** Its first blind player solved it in 103 seconds. The two-object staging is useful Regular content: 51 reference actions, 22 interaction turns and a longest uninterrupted walk of six actions. It replaces a weaker later draft as room 29, Switchyard.
- **Passing Places:** Its first blind player solved it in 102 seconds. Related cork-access ideas are already represented in Regular, so this version was not added as another Extra hard room.

The first 11 Regular rooms retain their layouts and save IDs. New Regular references take 9–51 actions; larger footprints are mixed with very small puzzles. Wrong-order checks exhaust reachable states after selected mistakes. A search cap is treated as inconclusive. These checks prove solvability and particular dependencies, not fun or a strict human difficulty progression.

The blind time allowance includes model reasoning and tool overhead. Solvers were independent runs of one cheaper model family; their weaknesses can be correlated. Results depend on the supplied rules and interface. Human playtesting remains the best check of clarity and enjoyment. No claim is made that a room is unbeatable. Earlier contest evidence for the original two Extra hard rooms is [recorded separately](challenge-contest.md).
