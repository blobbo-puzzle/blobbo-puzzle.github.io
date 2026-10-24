# Original Blobbo: rule evidence

Research date: 13 October 2026. This document distinguishes original-game evidence from reconstruction choices. The project should not claim exact compatibility until representative actions are compared against original gameplay.

## Primary source: the game's own help

The full Blobbo 1.0.1 application archived at [Macintosh Garden](https://macintoshgarden.org/games/blobbo) contains readable help in its Macintosh resource fork. For research, `BlobboFull.hqx` was downloaded from the mirror linked on that page, BinHex-decoded with Python's `binhex`, and the application alone extracted with the official Unarchiver CLI. No original artwork, executable, sound, map, or help text should be bundled in the game output. This is evidence for behavior, not a source asset pack.

The application’s Macintosh resource fork was inspected temporarily and is not included. `strings` exposes the help paragraphs; useful headings are Playing, Items, Dangers, Obstacles, Creatures, and Editing Levels.

### Confirmed objective, controls, and interface

- Four cardinal directions. Original keyboard controls are configurable; mouse can make one movement per click or repeat while held.
- Rest/wait advances a turn. The official FAQ identifies Space as the default. Clicking Blobbo also rests.
- Collect every toy chest, then enter the stairs. Some levels hide the exit until the final chest is collected.
- The status menu reports collected/total chests, held item, and move count. The final chest has a distinct pickup sound.
- Only one held item at once. Items are picked up by walking onto them.
- Item dropping acts toward the last direction moved. The original mouse interface drops via the status menu.
- The game is deterministic and based on strategy, with no random chance or reflex requirement.
- Original contextual help (`What Is...`) lets players inspect objects without interrupting keyboard play.

### Most important danger rule

The original help states: **“all such devices are stable when you are next to them”**. The surrounding paragraph refers specifically to bowling balls and arrows, including when Blobbo stands in their path. Its example says that collecting a chest immediately below a bowling ball is safe, but then moving downward causes the ball to fall and flatten Blobbo.

**Arrow timing directly verified:** the original gameplay video at approximately 2:54–2:55 shows Blobbo pick up a chest immediately left of a left-firing arrow. The arrow stays while adjacent. Blobbo then moves one tile upward, and the arrow travels roughly fifteen tiles left, changes row at a ramp, and stops against another chest during that single player action. Arrows therefore resolve along their path when released; they do not move only one tile per player input, and release does not require Blobbo in their line of sight. **Correction:** this observation did not establish that the arrow changed its facing or continued vertically. The earlier interpretation as a 90-degree reflection was unsupported. The contemporary secondary book’s one-square description is inaccurate for this case. Exact simultaneous hazard update order and bowling-ball path resolution still need targeted replay; the original help supports departure-triggered ball danger.

- Balls fall; arrows fire sideways and can set off interacting traps as blockers move.
- Hazards can be held back by objects the player must collect or move.
- Ramps deflect moving objects.
- The official author FAQ describes pushing an arrow upward and pushing balls sideways. It does not establish every allowed push direction.

### Confirmed objects and tools

| Object | Behavior stated by original help |
| --- | --- |
| Ordinary block | Blocks movement; separate secret blocks are passable, movable blocks can be pushed |
| One-way door | Restricts direction of passage |
| Marshmallow | Pushable obstruction |
| Roller skate | Continues moving after a push until it meets something |
| Cork + hole | Pushing cork into the hole produces ordinary floor |
| Two toy chest halves | Pushing the halves together forms a chest |
| Vertical boring machine + marked X | Machine exposes buried treasure at the marked spot |
| Balloon | Rises |
| Mirror | Reflects the remote's beam |
| Tube | Can be pushed and slid through |
| Teeter-totter ramp | Deflects things and then changes position |
| Key | Opens a locked door |
| Fire extinguisher | Walking into fire while holding it extinguishes the fire |
| Axe | Walking into a tree while holding it cuts the tree into a dugout canoe |
| Pick-axe | Digs through some blocks |
| Hedge shears | Cut plants |
| Sunglasses | Prevent certain creatures from recognizing/chasing Blobbo |
| Bomb | Dropping it destroys an adjacent object; acts in last moved direction |
| Remote control | Dropping fires a beam; sliding doors can open when struck, including via mirror reflections |
| Plain rock | No special intrinsic use stated; still a carryable object |
| Clockwise/counterclockwise rotaters | Relevant to one-way passages; detailed use/timing is not fully described |

There is **no umbrella** in the original application's help/object list. Do not invent it as an authentic original tool.

### Confirmed creatures and water

- Plants (creeping vines) and smileys obstruct/annoy Blobbo rather than killing him. The original level-two video at 6:54 visibly uses downward-facing hanging vine tips across the top edge and left-facing tips on the right edge, supporting a directional plant model. Exact growth scheduling remains unverified.
- Sparky chases Blobbo and is deadly.
- Spike traps shoot toward Blobbo when aligned and are deadly.
- Tetra-spiders and couch snails have autonomous movement. Guiding a spider to its home/web or a snail to a TV rewards another chest. Their exact movement rules still need verification.
- Water requires a dugout canoe/raft. The current controls travel.
- The original editor distinguishes water currents and special raft-sinking water cells.

## Author FAQ corroboration

[Glenn Andreas's official FAQ, mirrored](https://carbon-izer.s3.amazonaws.com/projects/BlobboFAQ.html), revised 1996, confirms 25 built-in levels, an editor, and recorded solution playback. Canoes drift when resting and cannot move upstream. Its level-two hint uses a marshmallow as a shield against a smiley. Triggered plant growth can block another plant's growth and the canoe route. Level-seven hints use pushable mirrors and a freely drifting empty canoe. Level-sixteen hints use a pushed arrow, rearranged bowling balls, and a lured spike. The FAQ records sale of all Blobbo rights in 1996. This does not establish current permission to reproduce the original assets or levels.

## Original editor and solutions

The original editor uses a palette or menus to select tiles, then paints on click. A new world begins with Blobbo in the corner and enclosing walls. It can switch between editing and play. Validation requires exactly one Blobbo and at least one exit; limits are one secret exit, one Sparky, twenty spiders, twenty snails, and seven switch-controlled doors. Recorded solutions are ordinary text move sequences (U/D/L/R), with playback interruptible by manual movement.

Switch/door association is unusual: seven switch icon pairs map to the first seven doors in column-major order (left column to right, top to bottom within each column). Multiple identical switch icons can operate one door. Other doors can be controlled by remote beams. This association should not be generalized into a claim that modern IDs are original behavior.

## Other inspected sources

- [Globbo by siwu](https://www.lexaloffle.com/bbs/?tid=46390): creator describes a deliberate subset and condensed 16×16 reinterpretation. It is a useful comparison, not an authoritative complete Blobbo ruleset. The listed license is CC BY-NC-SA; this implementation should not copy its code or assets.
- [Macintosh Bible Guide to Games, printed pp. 174–175](https://oldapplestuff.com/download/Macintosh/Macintosh_Garden/manuals/The_Macintosh_bible_guide_to_games.pdf): contemporary description of untimed turns, one-square motion, toy chests, palm-tree canoes, and obstructing smileys. Its timing description conflicts with the more specific original danger example noted above.
- [Original gameplay video by The Rarest Gamer](https://www.youtube.com/watch?v=qUhcM2zZ6Yg), 7 May 2019: archive page identifies this as original Macintosh footage. Level two begins at 6:45. Directly inspected in the browser using paused frame stepping, particularly 2:54–2:55 for adjacent arrow stability and full-path release; see timing evidence above.
- [Jonathan Campbell's reference hub](https://www.campbelljc.com/oldgames/blobbo/): links the author FAQ, interview, reverse-engineering work, and descendants.
- [ucosty level decoder/viewer](https://github.com/ucosty/blobbo): useful evidence of original level encoding; it is a level viewer rather than a verified complete physics implementation.

## Recommended development boundary

Ship a clearly labeled browser reconstruction with new art and original new levels. Confirmed early mechanics can include chests/stairs, walls, pushing, bowling balls, arrows, ramps, one-way doors, nonlethal plant growth, cork/hole interaction, key/door, and shears. Keep unverified timing choices centralized and documented. Add canoes, mirrors/remotes, creatures, and advanced gadgets only with targeted replay comparisons. Unlimited undo, a modern level picker, JSON import/export, and solver-checked generated levels are helpful modern additions and should be identified as such.

## Movement animation and sound follow-up

Follow-up research inspected the original application's named bitmap, animation, and sound resources. These resources remain temporary research references; none are copied into the browser game.

### Movement appearance

The original contains separate bitmap sheets named **Move**, **Push**, **NoPush**, **Rest**, **Enter Tube**, **Exit Tube**, **Push Tube**, and **Down Stairs**. The Move and Push bitmap bounds are 64×64. That is a sheet dimension, not a claim that it contains sixteen independent animation frames: the sheet includes extended poses and masks.

Decoded monochrome Move silhouettes show a distinctive **oozing stretch**. Horizontal movement spreads the character into a low, broad shape spanning roughly two tile widths; vertical movement uses a tall, narrow, diagonally leaning shape. The eyes remain a recognizable part of the stretched body. Push poses add a more pronounced pointed extension at the leading end. NoPush has compressed, strained leaning poses. These are materially different from sliding an unchanged sprite or adding a conventional legged walk/hopping cycle.

Recommended new-art interpretation: begin with the upright blob, briefly compress, spread/lean along the movement direction, then gather into the upright form at the destination. Pushing can use a stronger forward reach; a blocked move can compress without changing position. Direction-sensitive body deformation matters more than decorative particle effects. Separate animations exist for important outcomes, including stairs and deaths; animation resource names include Ball, Flame, Sparky, Left Arrow, Right Arrow, and Drown.

Exact normal-move timing was not decoded. Animation records have per-frame Delay values, but their unit and the normal Move playback code were not verified. A roughly 120–220ms step animation would be a modern tuning choice, not an established original duration. On this follow-up, browser inspection was unavailable because the computer-use tool reported no available browsers; earlier gameplay inspection established hazard release but not measured movement timing.

The subsequent redraw inspects the resource layout more precisely: the upper left of the Move sheet contains two horizontal extended silhouettes, with the body mound and eyes near the departure and arrival ends respectively. The upper right contains two narrow diagonal vertical silhouettes. The lower half contains masks. This supports a discrete spread/reach sequence with a stationary two-cell footprint, rather than continuously enlarging and translating the upright character. The browser renderer now uses independently drawn rest, compression, spread, reach, and gathering contours, keeping its eyes inside the body. Its extra transition contours and timing remain reconstruction choices; no original bitmap is shipped.

The temporary Move, Push, NoPush, and Rest inspection images are not distributed.

### Audio character and verified lengths

The original resource fork contains **33 named short sound effects**. Names include Thud, Click, Woosh, Twang, Ahah, Yeah, Ow, oooh, No Push, Roll, Slide, Blurp, Burp, Snip, IntoWater, Drown, Cork, Extinguish, FallingTree, All, End Screen, and TV. These names support a comic vocal/foley direction for new synthesized effects; this is not a report of directly listening to every sample.

Most standard-format effects are 8-bit sampled audio at approximately 22.254kHz, with a few at 11.127kHz or 7.418kHz. There are also extended-format sound headers. Reading the sound headers gives approximate durations:

| Original resource name | Duration |
| --- | ---: |
| Thud | 109ms |
| Yeah | 152ms |
| Click | 155ms |
| Ow | 162ms |
| No Push | 312ms |
| Twang | 368ms |
| Roll | 447ms |
| Ahah | 452ms |
| Snip | 454ms |
| All | 522ms |
| Woosh | 591ms |
| Extinguish | 597ms |
| IntoWater | 690ms |
| TV | 1.000s |

The original help explicitly says the final toy chest has a different sound. A faithful new sound system should therefore distinguish ordinary chest pickup, collecting the last chest, and completing the room. Object-specific effects should distinguish a dull heavy impact, elastic arrow twang/whoosh, watery splash/bubble, scissors, and blocked exertion. Short formant-like vocal chirps would fit the evidence better than making every event an interchangeable square-wave beep.

### Background music boundary

No music-named resource, song/score resource, or Music menu item was found. The Preferences menu has a Sound toggle. Every identified sound is short, with the longest about one second. This is strong evidence for a sound-effects-led presentation, but it does not mathematically rule out code-generated or externally supplied music.

Accordingly, any background music added here should be described as **new optional music inspired by the era**, not as a restoration of Blobbo's original soundtrack. Give effects and music separate controls, and let players choose effects-only playback. New synthesized sounds and a new composition preserve the intended personality without redistributing original audio.

## Globbo source and room-design comparison

The [public cartridge and Code panel](https://www.lexaloffle.com/bbs/?tid=46390) were inspected as research references. The decoded source and map data are temporary research files, not distributed assets or implementation code. Globbo is an adaptation, so its precise rules are supporting evidence rather than proof of the Macintosh executable's behavior.

Its nine rooms combine many mechanisms even in 16×16 cells. “First steps” already has 13 chests, 10 balls, 13 ramps, and 3 arrows. “Bowler's block” has 25 chests and 22 balls. “Combination lock” combines 13 arrows, five balls, a spike trap, and ten chests. “Sliding marshmallows” has 13 pushable blocks and one-way entrances. The characteristic difficulty comes from shared supports, changing firing lanes, approach-side constraints, and reusing the same space after an irreversible rearrangement.

Two engine distinctions matter. First, Globbo schedules dangers around changed cells; initially unsupported devices remain still until disturbed. Second, ramps move arrows diagonally past a corner while preserving their horizontal facing, and balls slide diagonally around ramps or balls when clearance permits. It does not turn a horizontal arrow into a vertical arrow. These findings supersede the first prototype's global settling and cardinal reflection assumptions. The original application's named arrow animations are Left Arrow and Right Arrow, consistent with this interpretation, but additional Macintosh replay comparison remains useful.

Globbo displays one extended two-cell movement sprite for 0.08 seconds, then returns to rest. Its input coroutine waits for hazard resolution; each moving hazard advances one cell per 30 Hz frame. Input pressed while a chain is running is not buffered. This timing describes Globbo only.

### One-way floor doors

The original Help identifies four directions of one-way passage. Globbo supplies a precise supporting contract: entering a door against its arrow is forbidden; entering from either perpendicular side is allowed. Leaving a door has no direction restriction. Balls, flying arrows, and pushed objects cannot enter these tiles, so a player can shelter there from balls and arrows. Spike traps are an exception: their adjacent impact can still reach a player standing on a door. The browser editor uses `r`, `u`, `l`, and `d` for these four floor tiles. These edge cases are Globbo-corroborated reconstruction rules; the original Help alone does not establish all of them.

The corrected engine uses local release scheduling and keeps arrow facing through ramps. Root's actual browser play completed Globbo's first room and directly observed a left arrow change rows around a ramp while retaining its leftward facing. In room two, a leftward arrow can eventually block a distant chest alcove if it is released before that chest is collected. This is a useful design benchmark: the consequence of an action can occur across the room, and the wrong resting position can make a later approach permanently impossible.

Two new campaign layouts were authored independently around those patterns, without copying Globbo maps: **Clockwise Clearing** has a four-room one-way circuit and three falling balls sharing an outgoing gate; **The Freight Door** moves a shared marshmallow through a plain opening while the player uses object-blocking doors to change sides. Saved winning move sequences and concrete wrong-order examples accompany both. These rooms use the corrected physics, and they do not rely on the prototype's unverified water-bridge behavior.

### Spike traps

The original Help and FAQ identify lethal traps that shoot toward Blobbo when aligned. Globbo's precise supporting behavior is more specific: after each successful player move, scan outward in all four cardinal directions until the first nonempty tile. A spike at that first tile is queued to charge toward Blobbo. Any intervening chest, door, ball, arrow, or marshmallow hides the player. The trap cannot be pushed and does not turn at ramps. It travels through empty floor and kills on reaching the cell next to Blobbo; an already-adjacent trigger is also lethal. Standing on a one-way tile does not prevent that adjacent impact. A queued normal hazard can become a shield before the trap's charge is resolved. Trap motion itself does not release nearby hazards in Globbo.

The new renderer draws an independent four-point steel trap and dashed guides along clear sight lines. These guides are an aid based on Globbo's visible hazard preview, not evidence that the Macintosh original displayed the same overlay. The browser engine's treatment of water and other extra tiles as sight blockers follows the nonempty-tile rule, but Globbo does not contain those water interactions; they remain reconstruction choices.

### Actual browser playthrough evidence

On 13 October 2026, the primary agent played and completed **all nine Globbo rooms** in the browser. Rooms 1–5 were solved through direct play; rooms 6–9 used independently computed move plans which were then executed with keyboard input and checked in the actual game. All nine completion banners were observed, with every chest collected. Offline plans were replayed in the independently written engine before browser verification; the final room’s 212-move route matched the actual game throughout. Offline search by a supporting agent is not described as browser play.

Observed design lessons include:

- **Bowler's block:** releasing an arrow too soon can send it around a ramp into a distant chest alcove. Once it stops there, nearby walls prevent a correcting push.
- **Get over it:** several balls must fill a shaft before a later ball can roll across the completed stack. A chest acts as a temporary support, and the destination route must be cleared before the shaft is packed. Three attempted arrangements preceded the successful playthrough.
- **Trap death:** shield replacement frees a marshmallow for use elsewhere. A box which initially looks redundant is a resource needed for a later route. The 163-move offline plan matched every browser checkpoint and completed the room.
- **Combination lock:** collecting the chest at (8,2) before (6,2) positions the first ball to initiate a long linked release through the arrow staircase. The chest at (1,2) must remain until the end; approaching it from above bypasses the arrows parked beside the exit. The 65-move offline plan completed the actual room.
- **Sliding marshmallows:** a marshmallow must first be moved into the lower landing zone to catch a falling ball while preserving a return passage. A one-way gate becomes inaccessible once a left-side arrow is parked beside it, so the remote chest collection must precede the final arrow rearrangement. The 182-move plan completed the actual room.
- **Slants and arrows:** an early ball release launches a chain of arrows that seals a distant chest alcove; a careful lower approach avoids waking the chain. The lower-right ball must be pushed from its right side before the upper ball drops into that access column. Four upper arrows must then be pushed up individually while their chest stop remains. The 212-move plan completed the actual room, with no missing input after allowing longer pauses for cascades.

Coordinates here are zero-based and refer only to the research maps. These plans and maps remain research material and are not part of the distributed campaign.

These checks corroborate the engine on those particular arrangements. They do not establish complete compatibility with either Globbo or every Macintosh Blobbo mechanism. The new campaign uses independently authored layouts, art, audio, and implementation; public reference maps and cartridge code remain temporary research material.

## Death-animation follow-up — 24 October 2026

Re-downloaded the full 1.0.1 archive using the second mirror linked by [Macintosh Garden](https://macintoshgarden.org/games/blobbo), decoded its BinHex data and extracted only the application with the official Unarchiver command-line utility. The original executable was **not run**. Parsed the resource map and decoded the monochrome animation sheets for read-only visual study. No original resources, inspection images, utilities, executable, or layouts are included in the release.

Directly observed in those resources:

- `ANIM`/`BTMP` 201 (Ball) has five 16 × 32 poses. A ball starts above Blobbo, descends through a compressed body, and ends with Blobbo squeezed under the ball. The animation visits frames 0, 1, 2, 3, 4, 3, 4, alternating the last two compressed poses.
- 204 and 205 (Left Arrow / Right Arrow) each have five 32 × 16 poses. The feathered shaft enters the body from the corresponding side; Blobbo recoils, narrows and collapses around it. This is not an unchanged upright sprite beside a stopped arrow.
- 202 (Flame) shows flames followed by a darkened body, with the eyes still visible. 206 (Drown) shows a progressively submerged character followed by bubbles.
- The help says death forces a restart of the current level. The File menu has a Restart Screen action. The inspected dialog resources have no dedicated death card, but that alone does not prove the absence of every possible runtime prompt.

The [original gameplay video](https://www.youtube.com/watch?v=qUhcM2zZ6Yg) was viewed muted at 1:00–1:12 and sampled at 1:50, 3:20 and 5:00. These samples show normal play, not a death sequence, so they are **not** evidence for post-death timing or an exact original recovery interface. The sprite resources supply the direct death-animation evidence here.

The browser version now uses original, code-drawn impact contours informed by those observations. Playback durations (760ms for ball impact, 900ms for the other outcomes), small settling motion, vertical-arrow and spike variants, and hole shrinking are reconstruction choices. The final pose remains visible until the player undoes or restarts. The discreet recovery buttons in the window frame and unlimited undo are modern conveniences, not a claim to reproduce the original recovery UI exactly.
