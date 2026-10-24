# Challenge solutions — spoilers

Developer/playtester reference, excluded from the deployed site and standalone HTML. Each route is verified against the actual game engine by `npm run audit:levels`. These are winning witnesses, not guaranteed shortest routes. U/D/L/R move, W waits, X drops the held tool.

## Secondhand Supports

Stable ID: `challenge-a2`. 45 moves; 11 turns involving objects or hazards.

1. Move the bottom ball left to enter the central workspace. Push the first marshmallow upward twice; vacating its former support area releases the ball at (7,7) into (7,8).
2. Push the adjacent central marshmallow right to (8,6). Leave it there temporarily: the workspace must be entered from below now and crossed westward later. Do not clear space by shoving the eastern marshmallow into the lower arrow-release alcove.
3. Reach (10,9), then retreat upward to release the left-arrow along the bottom. The ball moved at the start now redirects that arrow into (5,9), reopening the southeast approach.
4. Use the newly open lower route to collect the southeast chest from below. On the return, push the ball at (11,8) left; it drops into the lower route you have finished using. Its timing changes access to the southeast corner.
5. Work upward through the eastern room, collect the two eastern chests, and lift the left-arrow at (8,3) into row 2 to open the northern chest approach.
6. Take the chest under the ball at (6,2), then leave sideways. That ball drops to (6,3); the right-arrow at (5,3) rounds it into row 2 and releases the western gate ball from (4,3). The top chest then acts as a second stopper until collected.
7. Return to the same marshmallow parked at (8,6), approach it from above, and push it down to (8,7). This opens the westbound workspace route while the other central marshmallow remains parked above.
8. Keep the western marshmallow at (3,5) in place. Push the fallen gate ball at (4,6) left into (3,6), then descend onto the stairs. Moving that marshmallow down prematurely would jam this final operation.

<details>
<summary>Verified move sequence</summary>

```text
LLUUUURDRRRDDUDDRRUULLUUUUUDLLULLRUDRDDDLLLLD
```

</details>

## The Last Cork

Stable ID: `challenge-c`. 90 moves; 25 turns involving objects or hazards.

1. Raise the marshmallow only as far as (7,6), reserving it for permanent spike cover. Use the western loop to get above the southern cork.
2. Lower the southern cork to row 9, get to its left, and commit it to the southeast hole. The left recess is an unrecoverable parking trap.
3. Move the upper-right cork down into the shared row 5, then transport it left to (5,5). The northern cork must remain in place as temporary spike cover.
4. Advance the marshmallow to (7,5) while preserving access through the lower loop. Lift the westbound cork at column 5 and plug the western hole from its right.
5. Use the now-vacated eastern lifting space: move the marshmallow right into column 8, raise it to row 3, then push it left into (7,3). This replacement cover releases the northern cork for its final job.
6. Push the former shield cork right to column 9, then up into the northern hole. Collect its chest and return to the stairs.

<details>
<summary>Verified move sequence</summary>

```text
UULLUURRRDDDLDRRRRRLLLLUUUURUULDRDLLLRRDDLUDLLUUURULLLLRRRRDDRDRUURULDDLLURRDRUUUUDDLDLLLL
```

</details>
