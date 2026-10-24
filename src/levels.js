// Original room layouts; no maps are copied from Blobbo or Globbo.
import {CAMPAIGN_ORDER} from './campaign.js';
export const PRACTICE_CHAPTERS = [
  {
    "id": "first-steps",
    "name": "The toy cupboard",
    "description": "Find every treasure chest, then reach the doorway."
  },
  {
    "id": "gravity",
    "name": "A little gravity",
    "description": "Bowling balls wait beside you. Give them room to fall."
  },
  {
    "id": "arrows",
    "name": "Point taken",
    "description": "Redirect arrows and let the ramps do the work."
  },
  {
    "id": "marshmallows",
    "name": "Soft landings",
    "description": "Push marshmallows into place and build your own crossings."
  },
  {
    "id": "garden",
    "name": "The growing room",
    "description": "Plants follow your line. Tools open new routes."
  },
  {
    "id": "workshop",
    "name": "The curious workshop",
    "description": "Bring the lessons together in the final rooms."
  },
  {
    "id": "prototype-water",
    "name": "Prototype water experiments",
    "description": "Optional puzzles using an unverified rule: heavy objects fill water squares."
  }
];

export const PRACTICE_LEVELS = [
  {
    "id": "01",
    "name": "A box of possibilities",
    "chapter": "first-steps",
    "description": "One chest, one door, and a small pair of feet.",
    "hint": "Walk onto the chest. The doorway opens once you have every chest.",
    "rows": [
      "###########",
      "#@........#",
      "#.###.###.#",
      "#...$...#.#",
      "###.###.#E#",
      "#.........#",
      "###########"
    ],
    "solution": "DDRRRRRRDDRRU"
  },
  {
    "id": "02",
    "name": "Take the long way",
    "chapter": "first-steps",
    "description": "The nearest route is not always the useful one.",
    "hint": "Both sides of the room connect along the bottom. Visit both chests.",
    "rows": [
      "#############",
      "#@..#.....$E#",
      "###.#.#####.#",
      "#...#.....#.#",
      "#.#######.#.#",
      "#.$.......#.#",
      "#.#########.#",
      "#...........#",
      "#############"
    ],
    "solution": "RRDDLLDDRRRRRRRRUULLLLUURRRRRR"
  },
  {
    "id": "03",
    "name": "Pocket corners",
    "chapter": "first-steps",
    "description": "Treasure has a way of hiding just around a corner.",
    "hint": "The three short branches each contain a chest. The door is in the far right branch.",
    "rows": [
      "#############",
      "#$..#...#..$#",
      "###.#.#.#.###",
      "#...#.#.....#",
      "#.###.#####.#",
      "#.....@.....#",
      "###.#####.###",
      "#$..#....E..#",
      "#############"
    ],
    "solution": "LLLDDLLRRUULLUURRUULLRRDDLLDDRRRRUUUURRDDRRUURRLLDDRRDDLLDD"
  },
  {
    "id": "04",
    "name": "Around the block",
    "chapter": "first-steps",
    "description": "A central wall turns a small room into a round trip.",
    "hint": "Collect the four corner chests before heading to the middle doorway.",
    "rows": [
      "#############",
      "#$.........$#",
      "#.#########.#",
      "#.#.......#.#",
      "#.#.##E##.#.#",
      "#...#.@.#...#",
      "#.###.#.###.#",
      "#$....#....$#",
      "#############"
    ],
    "solution": "LDDLLLLUUUUUURRRRRRRRRRDDDDDDLLLLUULU"
  },
  {
    "id": "05",
    "name": "A heavy lid",
    "chapter": "gravity",
    "description": "The chest beneath the ball is safe. Leaving it takes a little care.",
    "hint": "Collect the chest, step right, then return through the space the ball has left behind. Stepping down immediately releases the ball onto you.",
    "rows": [
      "###########",
      "#####E#####",
      "#####.#####",
      "#####O#####",
      "#####$..###",
      "#.@...#####",
      "#####.#####",
      "#####.#####",
      "###########"
    ],
    "solution": "RRRURLUUU"
  },
  {
    "id": "06",
    "name": "Under the bowling ball",
    "chapter": "gravity",
    "description": "The treasure is tucked underneath something heavy.",
    "hint": "Stand beside the ball to hold it still, then push it sideways off the chest.",
    "rows": [
      "#############",
      "#...........#",
      "#.#########.#",
      "#.@..O......#",
      "####...######",
      "#####$#######",
      "#####.....E##",
      "#############"
    ],
    "solution": "RRDRDDRRRRR"
  },
  {
    "id": "07",
    "name": "First things first",
    "chapter": "gravity",
    "description": "A stack of balls makes one doorway a one-way trip.",
    "hint": "Collect the lower-left chest first. Take the chest under the balls, then step right before they fall.",
    "rows": [
      "#############",
      "######O######",
      "######O..####",
      "######$..####",
      "#@.....#....#",
      "#.########.##",
      "#..$....#.E.#",
      "#############"
    ],
    "solution": "DDRRLLUURRRRRURRDRRDD"
  },
  {
    "id": "08",
    "name": "The lower shelf",
    "chapter": "gravity",
    "description": "Let gravity deliver the bridge to the correct floor.",
    "hint": "Push the ball off the upper shelf, then leave space for it to fall into the puddle.",
    "rows": [
      "#############",
      "#@...O......#",
      "#.####.######",
      "#.####.######",
      "#....#......#",
      "####.#.####.#",
      "#$....~..$.E#",
      "#############"
    ],
    "solution": "RRRRLRRDDDDDLLLLLRRRRRRRRRR"
  },
  {
    "id": "09",
    "name": "Look both ways",
    "chapter": "arrows",
    "description": "An arrow waits when you are next to it. Elsewhere, it keeps going.",
    "hint": "Step down before walking right. The arrow will stop at the upper chest; reach it from below.",
    "rows": [
      "#############",
      "#####.#######",
      "#####.#######",
      "#...>@..$...#",
      "#####.##.####",
      "#$.........E#",
      "#.#########.#",
      "#.....$.....#",
      "#############"
    ],
    "solution": "DDRRRUUDDLLLLLLLDDRRRRRRRRRRUU"
  },
  {
    "id": "10",
    "name": "Across the grain",
    "chapter": "arrows",
    "description": "An arrow can point one way while you push it another.",
    "hint": "Approach from above and push the arrow down into the little alcove. Its chest is now within reach.",
    "rows": [
      "#############",
      "#@.........E#",
      "#.##.########",
      "#...>$.######",
      "#.##.########",
      "#$..........#",
      "#############"
    ],
    "solution": "DDDDUUUURRRDDRLUURRRRRRR"
  },
  {
    "id": "11",
    "name": "A saving turn",
    "chapter": "arrows",
    "description": "The ramp shifts the arrow down one row while it keeps flying right.",
    "hint": "Leave the arrow sideways and approach the chest from the right. The ramp keeps the arrow out of that narrow chest pocket.",
    "rows": [
      "############",
      "############",
      "#E.>..\\.$..#",
      "#..@....#..#",
      "#..........#",
      "############",
      "############"
    ],
    "solution": "DRRRRRRUULLDLLULLLL"
  },
  {
    "id": "12",
    "name": "A small chain reaction",
    "chapter": "arrows",
    "description": "One chest holds an arrow, which in turn holds a bowling ball.",
    "hint": "Take the chest and step up next to the ball. Then step down to release it before finding the newly cleared route to the stairs.",
    "rows": [
      "###########",
      "###EO.#####",
      "###.>$....#",
      "####.@#####",
      "####\\.#####",
      "####..#####",
      "###########"
    ],
    "solution": "UUDULL"
  },
  {
    "id": "13",
    "name": "Soft centre",
    "chapter": "marshmallows",
    "description": "Marshmallows are much easier to steer than bowling balls.",
    "hint": "Get the marshmallow onto the row with the water, then push it right to make a bridge.",
    "rows": [
      "#############",
      "#......######",
      "#..##..######",
      "#@..M..######",
      "#......~.$.E#",
      "#......######",
      "#############"
    ],
    "solution": "RRRRURDLDRRRRRR"
  },
  {
    "id": "14",
    "name": "Move it aside",
    "chapter": "marshmallows",
    "description": "A chest cannot be pushed. The things in front of it can.",
    "hint": "Push each marshmallow vertically out of the narrow passage to its chest.",
    "rows": [
      "#############",
      "#@......#####",
      "#.##.##.#####",
      "#...M$#...E##",
      "#.##.##.#####",
      "#......M$####",
      "#.#####.#####",
      "#.......#####",
      "#############"
    ],
    "solution": "RRRDDRLUURRRDDDDRLUURRR"
  },
  {
    "id": "15",
    "name": "Two for the crossing",
    "chapter": "marshmallows",
    "description": "One stepping stone is only half a bridge.",
    "hint": "Fill the first water square, then bring the lower marshmallow up and push it across to the second.",
    "rows": [
      "#############",
      "#@....#######",
      "#.....#######",
      "#..M..~~.$.E#",
      "#.....#######",
      "#..M..#######",
      "#.....#######",
      "#############"
    ],
    "solution": "DDRRRRDDDLLUULURRRRRRRRR"
  },
  {
    "id": "16",
    "name": "Hot foot",
    "chapter": "marshmallows",
    "description": "The last marshmallow blocks the way into a room full of treasure.",
    "hint": "Push the marshmallow right once. Walk above it and push it down into the lower alcove to clear the passage.",
    "rows": [
      "###############",
      "#@.....#.....$#",
      "#......#.###..#",
      "#..FFF.#.#....#",
      "#......#...####",
      "#.##....M..$.E#",
      "#....F.#..#####",
      "#.$....#......#",
      "###############"
    ],
    "solution": "DDDDDDRURRURRRRUUUURRRRRDDLLLDDRRR"
  },
  {
    "id": "17",
    "name": "Leave room to grow",
    "chapter": "garden",
    "description": "This little plant reaches towards you. Its stem stays behind.",
    "hint": "Go up first. Cross the vine’s row at the narrow vertical passage before it can grow across it.",
    "rows": [
      "#############",
      "###$.......E#",
      "###.##.######",
      "#P....@######",
      "###.#########",
      "###$....#####",
      "#############"
    ],
    "solution": "UULLLDDDDUUUURRRRRRRR"
  },
  {
    "id": "18",
    "name": "A little off the top",
    "chapter": "garden",
    "description": "Hedge shears can make a new path through an old vine.",
    "hint": "Pick up the shears and walk into the stems. You can use the same tool as often as you need.",
    "rows": [
      "#############",
      "#@..S..#...E#",
      "#####..#.####",
      "#P.....p.$..#",
      "#####.####.##",
      "#$..pp#.....#",
      "#############"
    ],
    "solution": "RRRRDDDDLLLLRRRRUURRRRLUURRR"
  },
  {
    "id": "19",
    "name": "A tree, a boat, a voyage",
    "chapter": "garden",
    "description": "An axe and a palm tree are the start of a small adventure.",
    "hint": "Use the axe on the tree, push the canoe into the water, and step aboard. Return to your canoe after collecting the island chest.",
    "rows": [
      "###############",
      "#@.A.T~~~..$..#",
      "#.#####~#######",
      "#.....#~#######",
      "#####.#~#######",
      "#..$..#~~~...E#",
      "###############"
    ],
    "solution": "DDRRRRDDLLRRUULLLLUURRRRRRRRRRRLLLLDDDDRRRRRR"
  },
  {
    "id": "20",
    "name": "One pair of hands",
    "chapter": "garden",
    "description": "You can carry one tool, so leave the first where you can spare it.",
    "hint": "Cut the vine, then press X to drop the shears onto empty floor ahead. Pick up the axe, carve the canoe, and head downstream.",
    "rows": [
      "###############",
      "#@.S..#..A....#",
      "#.....p.....T~#",
      "#$....#.....#~#",
      "#############~#",
      "###########$.~#",
      "###########.E.#",
      "###############"
    ],
    "solution": "DDUURRDRRRRRRXURRDRRRDDDLLDR"
  },
  {
    "id": "21",
    "name": "Mind the gap",
    "chapter": "workshop",
    "description": "A cork is just the thing for a hole in the floor.",
    "hint": "Move the cork right until it is directly above the hole. Get behind it and push down.",
    "rows": [
      "#############",
      "#@.....######",
      "#.###..######",
      "#..C...######",
      "#....#h######",
      "#....#...$.E#",
      "#############"
    ],
    "solution": "DDRRRRURDDDRRRRR"
  },
  {
    "id": "22",
    "name": "The fire brigade",
    "chapter": "workshop",
    "description": "Some toys are best approached with an extinguisher.",
    "hint": "Take the extinguisher before entering the fire. It works on every flame you touch.",
    "rows": [
      "#############",
      "#@.....######",
      "#.##K..######",
      "#......F..$E#",
      "#.#####F##.##",
      "#.$....F...##",
      "#############"
    ],
    "solution": "DDDDRLUURRRUDRRRRRRR"
  },
  {
    "id": "23",
    "name": "The potting shed",
    "chapter": "workshop",
    "description": "Shears, a cork, and an extinguisher each have a job to do.",
    "hint": "Cut the entrance vine, exchange the shears for the extinguisher, and push the cork into the hole before going downstairs.",
    "rows": [
      "#################",
      "#@..S..#..K.....#",
      "#.###..p.....C..#",
      "#.$....#.####h###",
      "#############.###",
      "#############F###",
      "###########$...E#",
      "#################"
    ],
    "solution": "DDRLUURRRRDRRRRRXURRRDDDDDLLRRRR"
  },
  {
    "id": "24",
    "name": "The grand toy run",
    "chapter": "workshop",
    "description": "A final trip through the garden, across the water, and back to the toy cupboard.",
    "hint": "Use the shears, marshmallow, axe, canoe, extinguisher, and cork in that order. Find a clear patch of floor whenever you need to exchange tools.",
    "rows": [
      "#################",
      "#@.S...#....#A..#",
      "#.###..p.M..~.$.#",
      "#.$....#....#...#",
      "##############T##",
      "##############~##",
      "##############~##",
      "##############~##",
      "##############~##",
      "#E.$.hC.F.K...~##",
      "#....##.#.....###",
      "#################"
    ],
    "solution": "DDRLUURRRRDRRRURXLDRRRRRURDDDDDDDDDLDLXULLLLLLLLLLL"
  },
  {
    "id": "campaign-04",
    "chapter": "prototype-water",
    "name": "The load-bearing marshmallow",
    "description": "Prototype water rule: One soft block holds up a ball and supplies the bridge to the eastern gallery. There is work to finish underneath it first.",
    "hint": "This optional experiment lets heavy objects fill water. Retrieve the chest in the narrow shaft before moving the marshmallow. Then push the same marshmallow east into the water; the released ball makes your other crossing.",
    "difficulty": "Hard",
    "synopsis": "A shared support is consumed to build one bridge while releasing the ball needed for another. The shaft treasure must be retrieved before either transformation.",
    "design": {
      "critical": [
        "Collect the shaft chest before shifting its overhead support.",
        "Push the marshmallow east into the water instead of parking it in a corner.",
        "Visit both newly opened wings and return to the original stairway."
      ],
      "trap": "Release the ball before retrieving the shaft chest and it lands on the only entrance to that chest. The chest cannot then be approached from any side.",
      "mechanics": [
        "push:M",
        "fall:O",
        "splash:O",
        "splash:M"
      ],
      "counterfactual": {
        "prefix": "UUUUUUUURRRRRRRRRR",
        "expectedStatus": "playing",
        "solvedAfterMistake": false,
        "searchVisited": 259,
        "searchReason": "no-solution-within-limits"
      }
    },
    "rows": [
      "#####################",
      "#####################",
      "###########O###....$#",
      "##..$......M..~.....#",
      "##.###.###..###.....#",
      "##..........###.....#",
      "##.########$###..$..#",
      "##.########~#########",
      "##.########.#########",
      "##.######.....#######",
      "##.######.....#######",
      "##@######.....#######",
      "##E######$...$#######",
      "#####################",
      "#####################"
    ],
    "solution": "UUUUUUUURRRRDDRRRRRDUULURRRRRURRRRDDDDLLUUULLLLLLDDDDDDDDDLLRRRRUUULLUUUULLLLLLLLLDDDDDDD",
    "proof": {
      "moves": 89,
      "chests": 6,
      "replay": "won"
    },
    "prototype": true
  },
  {
    "id": "campaign-05",
    "chapter": "prototype-water",
    "name": "One block, two jobs",
    "description": "Prototype water rule: The marshmallow must first steer a falling ball, then come back to become a completely different bridge.",
    "hint": "This optional experiment lets heavy objects fill water. Place the marshmallow immediately left of the lower ball before collecting the upper chest. After the ball rolls right, get behind the marshmallow and push it back left to the downward water shaft.",
    "difficulty": "Hard",
    "synopsis": "A shared marshmallow is first a routing barrier that forces a ball away from a fatal hole, then must be recovered from the opposite side and consumed as the second bridge.",
    "design": {
      "critical": [
        "Push the marshmallow three squares RIGHT to block the left roll.",
        "Collect the upper support chest and leave sideways so the top ball rolls RIGHT into the water.",
        "Recover the same marshmallow from its right side and move it three squares LEFT.",
        "Push it DOWN the left shaft to make the second crossing."
      ],
      "trap": "Collect the support chest before positioning the barrier and the useful ball rolls left into the hole. Pushing the marshmallow one square too far right also makes it unrecoverable.",
      "mechanics": [
        "push:M",
        "fall:O",
        "splash:O",
        "splash:M"
      ],
      "counterfactual": {
        "prefix": "UUUUURRRRUUURRRRRL",
        "expectedStatus": "playing",
        "solvedAfterMistake": false,
        "searchVisited": 1879,
        "searchReason": "no-solution-within-limits"
      },
      "additionalCounterfactual": {
        "prefix": "UUUUURRRRRRRR",
        "expectedStatus": "playing",
        "solvedAfterMistake": false,
        "searchVisited": 180,
        "searchReason": "no-solution-within-limits"
      }
    },
    "rows": [
      "#####################",
      "#####################",
      "######.....O#########",
      "##.###.....$#########",
      "##.###......#########",
      "##.###......#########",
      "##.....M.....########",
      "##.####.##hO.########",
      "##.####.####.########",
      "##.####.####.########",
      "##.####~####~########",
      "##@####.####.###$####",
      "##.##$...###.......##",
      "##E##...$###......$##",
      "#####################"
    ],
    "solution": "UUUUURRRRRRRUUURRLDDRDRDDDDDDDRRRRRRULLUDLLLLUUUUUULLLLULDDDDDDDDRULLLRRUUUUUULLLLLDDDDDDD",
    "proof": {
      "moves": 90,
      "chests": 5,
      "replay": "won"
    },
    "prototype": true
  }
];

function seedNumber(value) {
  const text = String(value ?? Date.now());
  let hash = 2166136261;
  for (let i = 0; i < text.length; i++) hash = Math.imul(hash ^ text.charCodeAt(i), 16777619);
  return hash >>> 0;
}

function randomSource(seed) {
  let state = seed >>> 0;
  return () => {
    state += 0x6D2B79F5;
    let value = Math.imul(state ^ (state >>> 15), 1 | state);
    value ^= value + Math.imul(value ^ (value >>> 7), 61 | value);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

const DIRECTIONS = [
  { dx: 0, dy: -1, action: 'U' }, { dx: 1, dy: 0, action: 'R' },
  { dx: 0, dy: 1, action: 'D' }, { dx: -1, dy: 0, action: 'L' },
];

function route(grid, from, to) {
  const queue = [{ ...from, path: '' }];
  const visited = new Set([`${from.x},${from.y}`]);
  for (let at = 0; at < queue.length; at++) {
    const current = queue[at];
    if (current.x === to.x && current.y === to.y) return current.path;
    for (const { dx, dy, action } of DIRECTIONS) {
      const x = current.x + dx, y = current.y + dy, key = `${x},${y}`;
      if (!grid[y] || !grid[y][x] || grid[y][x] === '#' || visited.has(key)) continue;
      visited.add(key);
      queue.push({ x, y, path: current.path + action });
    }
  }
  throw new Error('Generator produced disconnected floor.');
}

/** A seeded maze with a verified construction path. No chance of an unwinnable roll. */
export function generateLevel(seed = Date.now()) {
  const normalizedSeed = seedNumber(seed);
  const random = randomSource(normalizedSeed);
  const width = 17, height = 13;
  const grid = Array.from({ length: height }, () => Array(width).fill('#'));
  const start = { x: 1, y: 1 };
  grid[start.y][start.x] = '.';
  const stack = [start];
  while (stack.length) {
    const current = stack[stack.length - 1];
    const options = DIRECTIONS.filter(({ dx, dy }) => {
      const x = current.x + dx * 2, y = current.y + dy * 2;
      return x > 0 && x < width - 1 && y > 0 && y < height - 1 && grid[y][x] === '#';
    });
    if (!options.length) { stack.pop(); continue; }
    const { dx, dy } = options[Math.floor(random() * options.length)];
    const next = { x: current.x + dx * 2, y: current.y + dy * 2 };
    grid[current.y + dy][current.x + dx] = '.';
    grid[next.y][next.x] = '.';
    stack.push(next);
  }
  const deadEnds = [];
  for (let y = 1; y < height; y += 2) for (let x = 1; x < width; x += 2) {
    if (x === start.x && y === start.y) continue;
    const neighbors = DIRECTIONS.filter(({ dx, dy }) => grid[y + dy]?.[x + dx] === '.').length;
    if (neighbors === 1) deadEnds.push({ x, y, distance: route(grid, start, { x, y }).length });
  }
  // A leaf door is never needed as a through route while treasure remains.
  deadEnds.sort((a, b) => b.distance - a.distance);
  const exit = deadEnds.shift();
  for (let i = deadEnds.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [deadEnds[i], deadEnds[j]] = [deadEnds[j], deadEnds[i]];
  }
  const chests = deadEnds.slice(0, 5);
  // Very rare near-Hamiltonian mazes can have too few leaf cells; use other rooms.
  if (chests.length < 3) {
    for (let y = height - 2; y > 0 && chests.length < 3; y -= 2) {
      for (let x = width - 2; x > 0 && chests.length < 3; x -= 2) {
        if ((x === exit.x && y === exit.y) || (x === 1 && y === 1) || chests.some(c => c.x === x && c.y === y)) continue;
        chests.push({ x, y });
      }
    }
  }
  let position = start, solution = '';
  const remaining = [...chests];
  while (remaining.length) {
    remaining.sort((a, b) => route(grid, position, a).length - route(grid, position, b).length);
    const next = remaining.shift();
    solution += route(grid, position, next);
    position = next;
  }
  solution += route(grid, position, exit);
  grid[start.y][start.x] = '@';
  grid[exit.y][exit.x] = 'E';
  for (const chest of chests) grid[chest.y][chest.x] = '$';
  return {
    id: `generated-${normalizedSeed}`, name: `Pocket maze ${String(seed).slice(0, 24)}`,
    chapter: 'generated', description: 'A fresh, solvable treasure maze. Save it in the workshop to keep it.',
    hint: 'Every passage connects. Search the short dead ends for treasure, then follow the route to the door.',
    rows: grid.map(row => row.join('')), solution, generated: true,
    generator: { seed: String(seed), normalizedSeed, version: 1 },
  };
}


// New campaign: original layouts, replayed with local hazard release and diagonal slides.
const CAMPAIGN_ROOMS = [
  {
    "id": "campaign-01",
    "chapter": "shared-routes",
    "name": "Clockwise Clearing",
    "rows": [
      "#####################",
      "#........##.........#",
      "#.@..O..#$#...OOO...#",
      "#.#..$....#...$$$.#.#",
      "#.>$.$....r......$<.#",
      "#.#.......#...\\./.#.#",
      "#.$.......#.$.....$.#",
      "#.........#.........#",
      "#####u#########d#####",
      "#.........#.........#",
      "#...O.O...#..$......#",
      "#...$.$...#......$..#",
      "#...$..M..l.#...MM..#",
      "#../..\\...#.>$......#",
      "#.E....$..#.#...M.$.#",
      "#.........#.........#",
      "#####################"
    ],
    "solution": "URRRRDDRRRUDDLLLLLLUDRRULDDDLLRUUURRRRRRDRRURRRLDDDRRRDLLLUUUURRLDLDDDRRRRUUUULLDDDRDLUUURRDDRLLLLLLRDRRDDDLLDRRRRDDLLLLUDRRRRDRULLLLLLLULLULLDLLLURRLDDDRRLLLLL",
    "description": "A circuit of four workrooms. Clear the shared firing lane, park each falling ball, and commit to the next one-way door only when its room is ready.",
    "hint": "The three northern balls share one landing lane. Move each clear before releasing the next. Do not park an arrow under an unopened chest alcove.",
    "design": {
      "features": [
        "one-way floor doors",
        "shared ball landing lane",
        "arrow parking",
        "supported chests",
        "marshmallow detours"
      ],
      "solutionMoves": 160,
      "chests": 19,
      "planning": "The west arrow and supported chest pair share a firing lane. A directional four-room circuit limits retreat. In the north-east, three released balls converge on the same gate; each must be moved before the next release.",
      "counterfactuals": {
        "nook": {
          "prefix": "RDDURDDDRRRRRUU",
          "player": {
            "x": 9,
            "y": 4,
            "onBoat": false
          },
          "blockedChest": [
            9,
            2
          ],
          "blockingArrow": [
            9,
            3
          ]
        },
        "gate": {
          "prefix": "URRRRDDRRRUDDLLLLLLUDRRULDDDLLRUUURRRRRRDRRURRRRRRDDDRLLLLLL",
          "attemptTarget": [
            15,
            8
          ],
          "result": "exhausted",
          "visited": 385,
          "ballrow": "#....O....#...OOO...#"
        }
      },
      "verified": "The saved 160-move solution wins in the corrected local-release and diagonal-ramp engine; every move is productive. A target-reachability search after the wrong northern release order exhausts 385 reachable states without reaching the only outgoing gate at (15,8). This checks gate reachability, not all winning states. Wrong arrow parking physically seals the sole entrance to chest (9,2)."
    },
    "difficulty": "Hard",
    "synopsis": "A one-way circuit links an arrow alcove to three balls that converge on the same exit lane.",
    "proof": {
      "moves": 160,
      "chests": 19,
      "replay": "won"
    }
  },
  {
    "id": "campaign-02",
    "chapter": "shared-routes",
    "name": "The counterweight",
    "description": "Four movable objects share one narrow gateway. The arrow must be stopped before it reaches the far chest.",
    "hint": "Use the marshmallow to catch the upper ball, move the ball into the firing lane, then clear a place to park the arrow. Leave the final ball chest sideways.",
    "difficulty": "Hard",
    "synopsis": "The cork opens a support chest above the marshmallow; the released ball can become an arrow stop. Clearing the support creates an arrow parking bay, and the same ball is then moved through the gateway into the final chest shaft.",
    "design": {
      "critical": [
        "cork unlocks the upper support chest",
        "marshmallow catches the released ball",
        "a staged stop prevents the arrow from sealing remote treasure",
        "perpendicular arrow parking frees the shared gateway"
      ],
      "trap": "Releasing the arrow before dropping the ball leaves it beside a chest in a narrow track with no safe collection route.",
      "milestones": [
        {
          "label": "Ball installed as arrow stop",
          "move": 27,
          "player": {
            "x": 8,
            "y": 10,
            "onBoat": false
          },
          "collected": 1
        },
        {
          "label": "Arrow parked below the gateway",
          "move": 66,
          "player": {
            "x": 8,
            "y": 9,
            "onBoat": false
          },
          "collected": 5
        }
      ],
      "mechanics": [
        "push:C",
        "splash:C",
        "fall:O",
        "push:O",
        "push:M",
        "arrow:>",
        "push:>"
      ],
      "counterfactual": {
        "prefix": "URRUD",
        "expectedStatus": "playing",
        "proofType": "trapped-chest",
        "arrow": {
          "x": 13,
          "y": 9,
          "tile": ">"
        },
        "chest": {
          "x": 14,
          "y": 9
        },
        "explanation": "Walls above and below the arrow forbid perpendicular pushes. The chest has walls above and below too; collecting it from the right leaves only a fatal retreat into the released arrow path."
      }
    },
    "rows": [
      "#################",
      "#####......######",
      "#####...O..######",
      "#####...$..######",
      "#####.##.########",
      "#####.##.########",
      "#####h##.########",
      "#$.......########",
      "#........########",
      "#..>$.........$.#",
      "#.......M###.##.#",
      "#.@C.....#......#",
      "#........#.....E#",
      "#........#......#",
      "#$.....$.#..$..$#",
      "#################"
    ],
    "solution": "RRDRUUUUUUUUURRRLRDDDDDLDRDUUULLLLLLLDDDDDDDRRRRRRUUUULLLUDUURRRRDRRRLRRRRRDDLDDRDLLLRUURR",
    "proof": {
      "moves": 90,
      "chests": 8,
      "replay": "won"
    }
  },
  {
    "id": "campaign-03",
    "chapter": "shared-routes",
    "name": "The closing doors",
    "description": "Every pair of chests seals a doorway behind you. Six doors share three galleries.",
    "hint": "Think of each pair as a one-way crossing. You need a return visit to the left gallery before taking your final door into the right.",
    "difficulty": "Hard",
    "synopsis": "Six chest-supported double-ball gates share three galleries; closing all routes to one gallery too soon makes the remaining chests permanently unreachable.",
    "design": {
      "critical": [
        "six irreversible double-ball gates",
        "shared three-gallery route network"
      ],
      "trap": "Closing all three right-hand doors before finishing the left-hand doors strands four chests.",
      "milestones": [
        {
          "label": "First crossing committed",
          "move": 7,
          "player": {
            "x": 6,
            "y": 3,
            "onBoat": false
          },
          "collected": 2
        },
        {
          "label": "Right gallery revisit remains possible",
          "move": 26,
          "player": {
            "x": 9,
            "y": 3,
            "onBoat": false
          },
          "collected": 6
        }
      ],
      "mechanics": [
        "fall:O"
      ],
      "counterfactual": {
        "prefix": "RDDRRRRRRRRRRRDDDDLLLLDDLDDRRRR",
        "expectedStatus": "playing",
        "solvedAfterMistake": false,
        "searchVisited": 38,
        "searchReason": "no-solution-within-limits"
      }
    },
    "rows": [
      "################",
      "#@..##....##...#",
      "#..#OO#..#OO#..#",
      "#...$$....$$...#",
      "#...##....##...#",
      "#...##....##...#",
      "#..#OO#..#OO#..#",
      "#...$$....$$...#",
      "#...##....##...#",
      "#...##....##...#",
      "#..#OO#..#OO#..#",
      "#...$$....$$...#",
      "#...##....##...#",
      "#...##....##...#",
      "#...##....##..E#",
      "################"
    ],
    "solution": "RDDRRRRRRDDDDRRRRRUUUULLLLDDLDDLLLLLDDLDDRRRRRRRRRRRRDDD",
    "proof": {
      "moves": 56,
      "chests": 12,
      "replay": "won"
    }
  },
  {
    "name": "The double closing",
    "description": "One release opens the gallery, seals the cellar, and dispatches two arrows into distant passages.",
    "hint": "Clear the cellar and the little western alcove first. Move the marshmallow into the eastern firing lane before taking the chest beside the right arrow.",
    "rows": [
      "#################",
      "#################",
      "#.E...##$.$######",
      "#..@..Or$.$...###",
      "#.....>$...\\.$..#",
      "##......##......#",
      "#$#....####drM#$#",
      "#...........#.###",
      "#.\\....<###...###",
      "#..$...##########",
      "#......##########",
      "######.##########",
      "######r##########",
      "####$...$########",
      "####.....########",
      "####$...$########",
      "#################"
    ],
    "difficulty": "Hard",
    "synopsis": "The same release opens an upper gallery while closing two remote treasure routes; a staged marshmallow keeps a third route recoverable.",
    "design": {
      "critical": [
        "Recover the cellar chests before the falling ball seals its only entrance.",
        "Empty the western alcove before the secondary arrow is released.",
        "Stage the marshmallow above its niche to catch the eastern arrow before it pins the final chest.",
        "Push that stopped arrow into the higher lane, then lower the marshmallow to enter the pocket."
      ],
      "trap": "Taking the trigger chest and releasing its arrow before preparing the distant rooms can permanently bury their remaining chests.",
      "mechanics": [
        "push:M",
        "push:>",
        "fall:O",
        "arrow:>",
        "arrow:<",
        "gate:r",
        "gate:d"
      ],
      "counterfactuals": [
        {
          "prefix": "DDRRRRUD",
          "mistake": "Release the main arrow before clearing the remote rooms or staging the bumper.",
          "expectedStatus": "playing",
          "solvedAfterMistake": false,
          "searchVisited": 103188,
          "searchReason": "no-solution-within-limits"
        },
        {
          "prefix": "DDDDLLUDDDRRDRRRDDDLLRRRRDDLLLLUURRUUUUUUUURUD",
          "mistake": "Clear the cellar and western alcove, but release the cascade without staging the marshmallow.",
          "expectedStatus": "playing",
          "solvedAfterMistake": false,
          "searchVisited": 106603,
          "searchReason": "no-solution-within-limits"
        }
      ]
    },
    "solution": "DDDDLLUDDDRRDRRRDDDLLRRRRDDLLLLUURRUUUUUURRRRRDRRUUDDLLULLLLLUURUDUULLRRRURRDRRDRULLLDDRDRUURDRRDULLLLLULLLULLULLL",
    "proof": {
      "moves": 114,
      "chests": 13,
      "replay": "won"
    },
    "id": "campaign-07",
    "chapter": "shared-routes"
  },
  {
    "name": "The Escapement",
    "rows": [
      "#####################",
      "#...................#",
      "#..@.$...$.......$..#",
      "#.............O.....#",
      "#.O............#....#",
      "#.>$......../.......#",
      "#.................#$#",
      "##.####d#######u.####",
      "#...................#",
      "#..........$........#",
      "#.$..............#.##",
      "#..#..............$<#",
      "##.#E#..........##.##",
      "##$##..$......$.....#",
      "#.#.................#",
      "#...........$....$..#",
      "#####################"
    ],
    "solution": "RRRRRRRRRRRRRRLLLLLLLLLLLLLLDDDDRRRRRRRRRRRRRRURRDULLDLLLLLLLLLLDDLLLLLLDRDDDDUUUURRDDRRDDRUUUURRRRDDDDDDRRRRRRUULLLUUUUURUULLUUURDURLDDDLLLLLLLDDDRRRRRRRRRRRDDDUDDLLLUULLLLLLLLLLLD",
    "difficulty": "Hard",
    "synopsis": "One arrow releases a ball, catches another, and later must be moved so that ball can stop a second firing lane.",
    "description": "Preserve the lower support chest while the first arrow moves. Reposition the released ball, empty the eastern alcove, then reuse the upper ball to stop the final arrow.",
    "hint": "The chest below the left ball buys time. Move that ball before taking its support, then return above it. Clear the eastern alcove before pushing its arrow down; the upper ball belongs in the lower arrow lane.",
    "design": {
      "features": [
        "arrow-to-ball release chain",
        "temporary chest support",
        "arrow catching a dormant ball",
        "ball reused as arrow stop",
        "directional return doors"
      ],
      "solutionMoves": 181,
      "chests": 13,
      "planning": "The first arrow turns a ramp corner while its departure drops the left ball onto a temporary chest support. The same arrow catches the dormant upper ball. After retrieving the lower shaft chest, avoid pushing its former ball across the exit. Empty the eastern alcove, shift the caught ball onto its ledge, push the arrow away, then deliver that ball to the lower firing lane before releasing the second arrow.",
      "counterfactuals": {
        "rightAlcove": {
          "prefix": "DDDDRRRRRRRRRRUUURD",
          "blocking": [
            19,
            5
          ],
          "tile": ">"
        },
        "blockedExit": {
          "prefix": "RRRRRRRRRRRRRRLLLLLLLLLLLLLLDDDDRRRRRRRRRRRRRRURRDULLDLLLLLLLLLLDDLLLLLLDRDDDDUUUR",
          "blocking": [
            4,
            11
          ],
          "tile": "O"
        },
        "earlyLowerArrow": {
          "prefix": "RRRRRRRRRRRRRRDDDDLDDRRDDDD",
          "blocking": [
            4,
            11
          ],
          "tile": "<"
        }
      },
      "verified": "All 181 saved moves are productive and win with 13 chests. Replays confirm three irreversible bad parking positions: pushing the first arrow down before clearing the eastern alcove; pushing the redirected left ball into the exit approach; and launching the lower arrow before its stop is ready. These are checked by exact tile positions and enclosed approach geometry, not an exhaustive uniqueness proof."
    },
    "id": "campaign-19",
    "chapter": "shared-routes"
  },
  {
    "name": "The Freight Door",
    "rows": [
      "#####################",
      "#...................#",
      "#.$@O.......O.....$.#",
      "#...$..M....$.....O.#",
      "#...........$.....$.#",
      "#......$............#",
      "#...................#",
      "###d###d###u###.#r###",
      "#.>$................#",
      "#.#...............#E#",
      "#....$......$......##",
      "#.................#.#",
      "#................$<.#",
      "#$#...............#.#",
      "##......$.........$.#",
      "#...................#",
      "#####################"
    ],
    "solution": "LDRRRDRRRRRRRURDRRRRRLUURDDDLLLLLLLLLLLLUURRRRRRRRURDDDDDULLLLLLLLDDRRRRRRRRLLLLLLLLLLLLDURRRRRRRRUURRRRDDUURRDDLRUULLDDDDDRDLRRULLDULDLLLLLLLLLLLLLDUUURRRRDDDDRRRUUUURRRRDDDDRRRRRRLUUUULUURRRD",
    "difficulty": "Hard",
    "synopsis": "A shared marshmallow and player-only doors turn two distant arrow releases into a transport-and-parking puzzle.",
    "description": "Bring the marshmallow through the freight opening before releasing the long arrow. Recover it, plan the lower alcove pickup, and keep the stairway approach clear.",
    "hint": "One-way floor doors stop objects. The plain gap admits the marshmallow. Give the upper arrow a temporary stop before collecting its supporting chest; its final resting place can seal the stairs forever.",
    "design": {
      "features": [
        "one-way floor doors",
        "shared marshmallow blocker",
        "two long arrow lanes",
        "supported chests",
        "object transport"
      ],
      "solutionMoves": 193,
      "chests": 14,
      "planning": "Clear the supported chests from the transport lane, take the marshmallow through the only plain gap in the dividing wall, and use player-only doors to reach its other side. Intercept the upper arrow before it blocks the stairway approach. The saved solution then recovers the marshmallow and reuses it in the opposite-firing lower lane; alternatively, visit that lane’s chest alcove before releasing its arrow.",
      "counterfactuals": {
        "exit": {
          "prefix": "DDDDDDD",
          "player": {
            "x": 3,
            "y": 9,
            "onBoat": false
          },
          "arrowRow": "#..................>#"
        },
        "nook": {
          "prefix": "URRRRRRRRRRRRRRDDDDDDDDDDDU",
          "player": {
            "x": 17,
            "y": 11,
            "onBoat": false
          },
          "arrowRow": "#<..................#"
        }
      },
      "verified": "All 193 saved moves are productive and the final state wins with 14 chests. Releasing the upper arrow without a blocker parks it at (19,8), immediately above the exit. Walls forbid pushing from above; the exit alcove cannot be entered from any other side. Releasing the lower arrow before visiting its alcove or placing a blocker parks it at (1,12), sealing the chest at (1,13). These two locks are checked by exact final tile positions and their enclosing geometry; no exhaustive full-level solve is claimed."
    },
    "id": "campaign-08",
    "chapter": "moving-pieces",
    "proof": {
      "moves": 193,
      "chests": 14,
      "replay": "won"
    }
  },
  {
    "name": "The cork depot",
    "description": "One cork is a temporary arrow stop. It must later cross a hole plugged by the other cork.",
    "hint": "Release the arrow while its cork is still in place, then lift the arrow into the upper lane. Use the lower cork to repair the freight route before consuming the first cork at the eastern hole.",
    "difficulty": "Hard",
    "synopsis": "A cork first catches an arrow, then becomes the only plug that can reach the far chest gallery. Its delivery route needs the second cork; player-only floor doors give access to the pushing side but cannot transport either cork.",
    "design": {
      "critical": [
        "keep the first cork as a temporary arrow stop",
        "park the arrow before moving its cork",
        "spend the second cork on the freight route",
        "deliver the reused cork through the only usable approach to the far hole"
      ],
      "trap": "Moving the first cork before parking the arrow permanently seals the eastern chest gallery. Spending the lower cork on the tempting western hole also wastes a finite resource.",
      "milestones": [
        {
          "label": "Arrow caught against its temporary cork stop",
          "move": 26,
          "player": {
            "x": 3,
            "y": 4,
            "onBoat": false
          },
          "collected": 5
        },
        {
          "label": "Arrow parked in the upper lane",
          "move": 30,
          "player": {
            "x": 4,
            "y": 5,
            "onBoat": false
          },
          "collected": 5
        },
        {
          "label": "Second cork repaired the freight route",
          "move": 89,
          "player": {
            "x": 6,
            "y": 8,
            "onBoat": false
          },
          "collected": 12
        }
      ],
      "mechanics": [
        "arrow:>",
        "push:>",
        "push:C",
        "splash:C"
      ],
      "counterfactual": {
        "prefix": "URRRRRRRRRDDDDUULLLLLLLLDURRDD",
        "expectedStatus": "playing",
        "proofType": "sealed-chest-gallery",
        "arrow": {
          "x": 12,
          "y": 6,
          "tile": ">"
        },
        "chests": [
          {
            "x": 13,
            "y": 6
          },
          {
            "x": 14,
            "y": 6
          },
          {
            "x": 14,
            "y": 7
          }
        ],
        "explanation": "The arrow stops below a ramp and above a player-only door, so neither perpendicular push is possible. The three-chest gallery has no other entrance."
      }
    },
    "rows": [
      "#################",
      "#################",
      "##$....$..$..####",
      "##@.........#####",
      "##...........####",
      "##>$.C......\\####",
      "##.........$.$$##",
      "###d#.######d#$##",
      "###....h.....####",
      "###.#.C#####.####",
      "###.h......#.#..#",
      "###..$.....#h...#",
      "###........###E.#",
      "###$....$.$###..#",
      "#################",
      "#################"
    ],
    "solution": "URRRRRRRRRDDDDUULLLLLLLLDUDDRUDRRRRRRRRRRDULLLUUUULDDDDLLLLLDDDDDDDLLRRRRRRRUULLLLLURULURLUURUULDDDULLDDRRRRRRRRLLLLLLUURRRRRRRDDDDDRRD",
    "id": "campaign-10",
    "chapter": "moving-pieces",
    "proof": {
      "moves": 135,
      "chests": 12,
      "replay": "won"
    }
  },
  {
    "name": "The stack switch",
    "description": "Build the arrow ramp out of bowling balls. The support chest must survive until the arrow has taken its raised route.",
    "hint": "Clear the lower treasure first. Feed the three upper balls into the shaft one at a time, starting nearest the shaft. Keep the base chest until after releasing the arrow.",
    "difficulty": "Hard",
    "synopsis": "Three balls must be transported individually onto an existing stack. At full height the stack diverts an arrow above the exit entrance; the same base chest must remain as support throughout delivery and release, then be collected to finish the room.",
    "design": {
      "critical": [
        "transport three adjacent supported balls individually",
        "keep the base chest until the stack reaches the arrow lane",
        "use the raised stack as an arrow deflector",
        "collapse the shared shaft only after securing the exit approach"
      ],
      "trap": "Releasing all three upper balls together jams their delivery lane. Removing the base chest early leaves the pile too low; the arrow then parks permanently above the stairs.",
      "milestones": [
        {
          "label": "First ball delivered into the shared shaft",
          "move": 77,
          "player": {
            "x": 9,
            "y": 5,
            "onBoat": false
          },
          "collected": 10
        },
        {
          "label": "Second ball delivered; base chest still supports the stack",
          "move": 93,
          "player": {
            "x": 9,
            "y": 5,
            "onBoat": false
          },
          "collected": 11
        },
        {
          "label": "Stack raised into the arrow lane",
          "move": 105,
          "player": {
            "x": 9,
            "y": 5,
            "onBoat": false
          },
          "collected": 12
        },
        {
          "label": "Arrow diverted over the completed stack",
          "move": 114,
          "player": {
            "x": 3,
            "y": 4,
            "onBoat": false
          },
          "collected": 13
        }
      ],
      "mechanics": [
        "fall:O",
        "push:O",
        "arrow:>"
      ],
      "counterfactual": {
        "prefix": "UUULRRDDRRDDDURRRRRRRRDUURRUULLLULLDDDDLLLLULUUULUUUUULRRRRRDDRLUURRRRDDDLLLLURRLUURRRDDDLLLLURRRLRRDLLLLULLDLLDDRDDDRRLLUUULUUULLDU",
        "expectedStatus": "playing",
        "proofType": "sealed-exit",
        "arrow": {
          "x": 14,
          "y": 5,
          "tile": ">"
        },
        "exit": {
          "x": 14,
          "y": 6
        },
        "explanation": "Removing the base chest after stacking but before launching lowers the deflector. The arrow then stops at the only stair approach and cannot be pushed in either perpendicular direction."
      },
      "additionalCounterfactual": {
        "prefix": "UUURRUUURRRRRRRR",
        "expectedStatus": "playing",
        "proofType": "packed-delivery-lane",
        "balls": [
          {
            "x": 10,
            "y": 5
          },
          {
            "x": 11,
            "y": 5
          },
          {
            "x": 12,
            "y": 5
          }
        ],
        "explanation": "All three delivery balls are adjacent, supported by wall, and cannot be pushed up. No ball can be pushed horizontally because another occupies its destination or the required pushing position."
      }
    },
    "rows": [
      "##################",
      "##################",
      "##..$....$....####",
      "##........OOO.####",
      "##........$$$.####",
      "##>$...........###",
      "#####.##.#####E###",
      "##$....#.#.$..#..#",
      "##.....#O#.......#",
      "##..$..#O#.......#",
      "##.@....$#......$#",
      "##......$........#",
      "##....$.......$..#",
      "##################",
      "##################",
      "##################"
    ],
    "solution": "UUULRRDDRRDDDURRRRRRRRDUURRUULLLULLDDDDLLLLULUUULUUUUULRRRRRDDRLUURRRRDDDLLLLURRLUURRRDDDLLLLURRRLRRDLLLLULLLLLLDURRDDDRDDDRRLLUUULUURRRRRRRRRD",
    "id": "campaign-14",
    "chapter": "moving-pieces",
    "proof": {
      "moves": 143,
      "chests": 14,
      "replay": "won"
    }
  },
  {
    "name": "The Ball Causeway",
    "rows": [
      "#####################",
      "#.........@.........#",
      "#...O..O.O..O..O....#",
      "#...$..$.$..$..$....#",
      "#...................#",
      "#...................#",
      "#...................#",
      "##l######.########r##",
      "#.......#.#.........#",
      "#.$.....#..#......#.#",
      "#................$<.#",
      "#E#.....#.##......#.#",
      "##......#.#.......$.#",
      "#...$...#$#.$.......#",
      "#........#..........#",
      "#......$.......$....#",
      "#####################"
    ],
    "solution": "DDDDDLLRDDDDDDDUUUUUUUUULLLLLULDDDRRRRRUUULLDDDRRUURRRRURDDDLLLUURRRRRURDDDLLLLLLUUULRDDDRRRRRRRRDDLDDDDRDDDLLLUULLLDDLLLLLUULLLUUUULLDLD",
    "difficulty": "Hard",
    "synopsis": "Fill a shaft from both sides so its last ball rolls into the long arrow’s stopping lane.",
    "description": "Empty the shaft before filling it. Feed the bowling balls from both sides, and build an arrow stop before releasing the lower firing lane.",
    "hint": "Keep the shaft chest reachable. The saved plan stacks four balls, then lets the fifth roll across their top. An arrow released into the empty lower lane seals the stairs.",
    "design": {
      "features": [
        "stacked-ball routing",
        "two-sided feed lane",
        "shaft-first retrieval",
        "arrow stop",
        "long-range exit lock"
      ],
      "solutionMoves": 137,
      "chests": 13,
      "planning": "The bottom chest must be retrieved before a ball enters its one-cell shaft. The saved solution pushes four released balls from the upper gallery into that shaft, then releases the central ball so it rolls diagonally onto their stack and parks beside the lower arrow lane. The arrangement catches the arrow before it can occupy the exit approach.",
      "counterfactuals": {
        "shaft": {
          "prefix": "DDLR",
          "blocking": [
            9,
            12
          ],
          "tile": "O"
        },
        "exit": {
          "prefix": "DDDDDRRRRRRRRDDLDDD",
          "blocking": [
            1,
            10
          ],
          "tile": "<"
        }
      },
      "verified": "All 137 saved moves are productive and win with 13 chests. Exact replays confirm that a premature central release leaves a ball at (9,12), sealing the shaft chest at (9,13), and an early arrow release parks it at (1,10), sealing the only exit entrance. This verifies one five-ball construction; uniqueness or necessity of that exact construction is not claimed."
    },
    "id": "campaign-18",
    "chapter": "moving-pieces"
  },
  {
    "name": "The living shield",
    "description": "The vine can stop an arrow, but you will need to cut it later. The order matters at both ends of the firing lane.",
    "hint": "Approach the shaft chest from below, then lead the vine upward into the arrow lane. Empty the western tool alcove before cutting the living shield.",
    "difficulty": "Hard",
    "synopsis": "An upward vine must be grown across a remote arrow lane to preserve the only route to the shears. The same shears must then dismantle that shield, launching the trapped arrow into the already emptied alcove, and clear the vine down to the exit.",
    "design": {
      "critical": [
        "grow a vine across the shared firing lane",
        "retrieve the shears before dismantling the shield",
        "shearing releases the same arrow into its second route",
        "clear the root shaft for the exit"
      ],
      "trap": "Release the arrow before growing the vine and it seals the shears alcove; without shears neither the arrow nor the exit vine can be cleared.",
      "milestones": [
        {
          "label": "Vine grown across the firing lane",
          "move": 19,
          "player": {
            "x": 6,
            "y": 4,
            "onBoat": false
          },
          "collected": 4
        },
        {
          "label": "Arrow held against the living shield",
          "move": 37,
          "player": {
            "x": 13,
            "y": 7,
            "onBoat": false
          },
          "collected": 7
        },
        {
          "label": "Western alcove emptied and shears retrieved",
          "move": 62,
          "player": {
            "x": 1,
            "y": 4,
            "onBoat": false
          },
          "collected": 11
        },
        {
          "label": "Shears released the arrow and reopened the root shaft",
          "move": 81,
          "player": {
            "x": 6,
            "y": 14,
            "onBoat": false
          },
          "collected": 12
        }
      ],
      "mechanics": [
        "grow:",
        "arrow:<",
        "pickup:S",
        "tool:S"
      ],
      "counterfactual": {
        "prefix": "RUUUD",
        "expectedStatus": "playing",
        "proofType": "sealed-tool-alcove",
        "arrow": {
          "x": 2,
          "y": 6,
          "tile": "<"
        },
        "chest": {
          "x": 1,
          "y": 6
        },
        "tool": {
          "x": 1,
          "y": 4,
          "tile": "S"
        },
        "explanation": "The arrow parks at the sole alcove entrance. Walls above and below it forbid perpendicular pushes; the inaccessible shears are the only way to cut the exit vine."
      }
    },
    "rows": [
      "#################",
      "#################",
      "###$........$..##",
      "###............##",
      "#S#.$.........$##",
      "#$#..........#.##",
      "#$...........$<##",
      "######.######.###",
      "#####.$...$....##",
      "#####$......@.$##",
      "######N##########",
      "######.##########",
      "######$##########",
      "######.##########",
      "######E##########",
      "#################"
    ],
    "solution": "RRULLLLDLLLLLRUUUUUUURRRRRRRRDDLLDDRDULUUUULLLLLLLLLRDDDDLLLUUDDRRUURRRDDDDDDDDDD",
    "id": "campaign-09",
    "chapter": "distant-workshops",
    "proof": {
      "moves": 81,
      "chests": 12,
      "replay": "won"
    }
  },
  {
    "name": "The green jack",
    "description": "An upward-growing vine can catch a bowling ball at a useful height. Let it fall too far and the exit shaft is lost.",
    "hint": "Lead the vine from the lower opening to the upper gallery before taking the overhead chest. Push the caught ball into the eastern room, fetch the shears, and return to cut the root shaft.",
    "difficulty": "Hard",
    "synopsis": "Grow a vine into a raised ball support, release the supported chest, and push the caught ball sideways while that height is still accessible. The ball becomes a second chest trap; the vine must then be dismantled with the shears to reach the exit.",
    "design": {
      "critical": [
        "grow the living support into the upper gallery where both sides are reachable",
        "transfer the caught ball into the eastern chamber",
        "collect the reused ball chest with a sideways escape",
        "return with shears to remove the original living support"
      ],
      "trap": "Releasing the ball before growing the vine drops it into a narrow shaft where it cannot be pushed sideways. Cutting the root only lets the ball fall farther into the sole exit route.",
      "milestones": [
        {
          "label": "Vine raised to the ball transfer level",
          "move": 18,
          "player": {
            "x": 8,
            "y": 4,
            "onBoat": false
          },
          "collected": 3
        },
        {
          "label": "Caught ball transferred into the eastern room",
          "move": 21,
          "player": {
            "x": 8,
            "y": 3,
            "onBoat": false
          },
          "collected": 4
        }
      ],
      "mechanics": [
        "grow:",
        "fall:O",
        "push:O",
        "pickup:S",
        "tool:S"
      ],
      "counterfactual": {
        "prefix": "UULUUUUUURRRRRRLRRRRRRDDDDDLLLLLDLDDRLDRL",
        "expectedStatus": "playing",
        "proofType": "buried-exit-chest",
        "ball": {
          "x": 8,
          "y": 12
        },
        "chest": {
          "x": 8,
          "y": 13
        },
        "explanation": "After an early release the ball is below every usable right-hand pushing position. Shearing the root only lowers it onto the last chest, whose other entrance is the still-closed exit."
      }
    },
    "rows": [
      "#################",
      "#################",
      "########O########",
      "##.$....$..$.S.##",
      "##............$##",
      "##....$........##",
      "##$............##",
      "##.#####....$..##",
      "##.#####.$.....##",
      "##.$.....########",
      "##.......########",
      "##.@.$...########",
      "##.....$N########",
      "########$########",
      "########E########",
      "#################"
    ],
    "solution": "UURRDDRRDURUUUUUUUULRRRRRRRDDDDLLDLLLRUUUUULLLLLLLRRRDDDLLLLUUURRRRRRDDDDDDDDDDD",
    "id": "campaign-13",
    "chapter": "distant-workshops",
    "proof": {
      "moves": 80,
      "chests": 12,
      "replay": "won"
    }
  },
  {
    "name": "A living railway",
    "description": "Grow a rail beneath the sleeping ball. Carry it across the room, then cut the rail at the place where its fall will open the final route.",
    "hint": "Lure the right-growing vine all the way across before approaching the ball. Keep the shears: after transporting the ball above the right-hand shaft, cut the vine from below and step sideways. The lowered ball must lift the released arrow over the stairs, and the shears must still clear the last plant.",
    "rows": [
      "##################",
      "##################",
      "##################",
      "##..$...$....$.###",
      "##.........$..S###",
      "##$.........$.@###",
      "##..O.$.$.$....###",
      "##P............###",
      "####....#......###",
      "####..>$.......NE#",
      "##################",
      "##################",
      "##################",
      "##################"
    ],
    "difficulty": "Hard",
    "synopsis": "A vine changes from nuisance to transport support. Shears dismantle that support at a selected shaft, and the lowered ball diverts an arrow away from a plant-guarded exit.",
    "design": {
      "critical": [
        "Grow the vine below the dormant ball before waking it; its original shaft is a sealed pocket.",
        "Clear the chests on the upper transport lane, push the supported ball across the vine, and cut its support from below.",
        "Keep the shears for the plant in front of the stairs: leaving them as a disposable arrow stop cannot complete the room."
      ],
      "trap": "Releasing the ball before its rail exists drops it into a pocket it cannot be pushed out of; releasing the arrow before a deflector is ready parks it over the stairs.",
      "checkpoints": [
        {
          "moves": 12,
          "player": {
            "x": 14,
            "y": 7,
            "onBoat": false
          },
          "tiles": [
            [
              4,
              6,
              "O"
            ],
            [
              4,
              7,
              "p"
            ],
            [
              10,
              7,
              "p"
            ],
            [
              13,
              7,
              "P"
            ]
          ]
        },
        {
          "moves": 60,
          "player": {
            "x": 9,
            "y": 6,
            "onBoat": false
          },
          "tiles": [
            [
              10,
              6,
              "O"
            ],
            [
              10,
              7,
              "p"
            ]
          ]
        },
        {
          "moves": 75,
          "player": {
            "x": 11,
            "y": 7,
            "onBoat": false
          },
          "tiles": [
            [
              10,
              9,
              "O"
            ],
            [
              10,
              7,
              "."
            ]
          ]
        },
        {
          "moves": 84,
          "player": {
            "x": 7,
            "y": 8,
            "onBoat": false
          },
          "tiles": [
            [
              10,
              9,
              "O"
            ],
            [
              14,
              8,
              ">"
            ],
            [
              14,
              9,
              "."
            ]
          ]
        }
      ],
      "mechanics": [
        "push:O",
        "tool:S",
        "fall:O",
        "arrow:>"
      ],
      "counterfactuals": [
        {
          "prefix": "LLLLLLLLLLD",
          "expectedStatus": "playing",
          "tiles": [
            [
              4,
              9,
              "O"
            ],
            [
              3,
              9,
              "#"
            ],
            [
              4,
              10,
              "#"
            ]
          ],
          "reason": "Waking the ball before growing its support drops it to4,9. Left and down are walls; pushing right requires standing in the left wall, and upward pushes are forbidden, so the only deflector is lost."
        },
        {
          "prefix": "LLLLLLLDDDDU",
          "expectedStatus": "playing",
          "tiles": [
            [
              14,
              9,
              ">"
            ],
            [
              15,
              9,
              "N"
            ],
            [
              14,
              10,
              "#"
            ],
            [
              15,
              8,
              "#"
            ],
            [
              15,
              10,
              "#"
            ]
          ],
          "reason": "An early launch parks the arrow in front of the exit plant. Pushing it down is blocked by the wall below; pushing it up requires standing in that wall. The plant and stairs are only accessible along the blocked corridor."
        },
        {
          "prefix": "UDDDDXUULLLLLLLDDDUUURRRRRRRDDDR",
          "expectedStatus": "dead",
          "cause": "arrow",
          "reason": "Leaving the shears as an arrow stop, retrieving them, and then cutting the exit plant releases the arrow directly into the player. The exit corridor must be protected by the ball."
        }
      ]
    },
    "solution": "DDWWWWWWWWWWUUUULLLLLLLLLLDDLLRRRDRRRRRUURDRLLLLLLLLLDRRRRRRURRRRRDDDLLLLURULLLLDDDUUURRRRRDDDRRRR",
    "proof": {
      "moves": 98,
      "chests": 10,
      "replay": "won"
    },
    "id": "campaign-21",
    "chapter": "distant-workshops"
  },
  {
    "name": "Reed Channels",
    "rows": [
      "#####################",
      "#.#E#..~~~~~~~p.....#",
      "#.@p.$.~~~~~~~p.$...#",
      "#......b~~~~~~Q..$..#",
      "#.$....~~~~~~~p...$.#",
      "#......~~~~~~~pppppp#",
      "#~~~~~~~~~~~~~~~~~~~#",
      "#~~~~~~~ppNpp~~~~~~~#",
      "#~~~~~~~p$.$p~~~~~~~#",
      "#~~~~~~~ppVpp~~~~~~~#",
      "#~~~~~~~~~~~~~~~~~~~#",
      "#pppppp~~~~~~~.$....#",
      "#.$...p~~~~~~~..#O#.#",
      "#.....P~~~~~~~...$S.#",
      "#...$.p~~~~~~~..$/..#",
      "#..$..p~~~~~~~....$.#",
      "#####################"
    ],
    "solution": "DRRURDDLLLURRRRRDDDDDDDRRRRRRDRRDDRRRDDLLUULUULLDDDDLLLLLLLLLLURUULLDDDRRRRRUUUUUUURRRRLLLLUURRRRRRURRURRRULULDDDLLLDRRLLLLLLLLULUUULLLU",
    "difficulty": "Medium",
    "synopsis": "Keep one canoe accessible while collecting shears and reopening three overgrown island landings.",
    "description": "One canoe connects five shores. The shears lie on the open bank; recover them before cutting the other landings, and return the canoe to the starting shore.",
    "hint": "The eastern vine closes the direct channel as you approach. Sail around it to the unsealed southern bank first. After landing, remember where you left the canoe.",
    "design": {
      "features": [
        "canoe return routing",
        "growing vines across water",
        "shears",
        "supported chest and ramp",
        "three enclosed landings"
      ],
      "solutionMoves": 136,
      "chests": 14,
      "planning": "The direct eastern approach grows closed. Reach the open south-eastern bank to collect the only shears, leave the supported chest from the side, and revisit the canoe. Three other island boundaries and the final stair entrance require those same shears. The saved route sails through a cut vine while retaining the water underneath.",
      "counterfactuals": {
        "closedChannel": {
          "prefix": "DRRURDDLLLURRRRRRRR",
          "blockedAction": "R",
          "player": {
            "x": 10,
            "y": 3,
            "onBoat": true
          },
          "vine": [
            11,
            3
          ],
          "result": "blocked"
        }
      },
      "verified": "All 136 saved moves are productive and collect 14 chests before winning. The replay uses no object-sinking bridge, no tool exchange, and no discarded canoe. Its recorded direct-channel branch stops at a growing vine and can be recovered by sailing around to the southern landing; this is a route constraint, not a claimed permanent lock."
    },
    "id": "campaign-12",
    "chapter": "distant-workshops",
    "proof": {
      "moves": 136,
      "chests": 14,
      "replay": "won"
    }
  },
  {
    "name": "The tool relay",
    "description": "The inventory limit is part of the machine: each tool you leave behind must keep the arrow under control.",
    "hint": "Drop the shears into the track before picking up the extinguisher. Later, leave the extinguisher farther along the same track before taking the shears back. Clear the far chest pocket before removing the last shield.",
    "difficulty": "Hard",
    "synopsis": "The shears and extinguisher alternate between working tools and arrow stops. Fire must be opened before the vine corridor; retrieving each tool removes a stop, so its replacement must already be in the firing lane.",
    "design": {
      "critical": [
        "drop a held tool into the track before retrieving the other",
        "extinguisher opens access to the shears gate",
        "single inventory forces an exchange while the arrow remains live",
        "clear the distant chest pocket before removing its last shield"
      ],
      "trap": "Picking up the track tool without a replacement stop sends the arrow into a narrow chest pocket where it can no longer be moved.",
      "milestones": [
        {
          "label": "Shears hold the arrow while the extinguisher is carried",
          "move": 42,
          "player": {
            "x": 5,
            "y": 4,
            "onBoat": false
          },
          "collected": 7
        },
        {
          "label": "Extinguisher replaces shears as the arrow stop",
          "move": 90,
          "player": {
            "x": 8,
            "y": 4,
            "onBoat": false
          },
          "collected": 7
        },
        {
          "label": "Far chest pocket cleared",
          "move": 116,
          "player": {
            "x": 15,
            "y": 5,
            "onBoat": false
          },
          "collected": 10
        }
      ],
      "mechanics": [
        "pickup:S",
        "drop:S",
        "pickup:K",
        "arrow:>",
        "tool:K",
        "drop:K",
        "tool:S"
      ],
      "counterfactual": {
        "prefix": "UUUULLLLLLUURRURRDU",
        "expectedStatus": "playing",
        "proofType": "trapped-chest",
        "arrow": {
          "x": 13,
          "y": 5,
          "tile": ">"
        },
        "chest": {
          "x": 14,
          "y": 5
        },
        "explanation": "Without the dropped replacement tool, the arrow pins the far chest between two walls. It cannot be pushed perpendicular, and retreat after collecting the chest is fatal."
      }
    },
    "rows": [
      "#################",
      "#################",
      "#....$....$..####",
      "#............####",
      "#.#$.........####",
      "#...>K........$.#",
      "#.#############.#",
      "#..........####$#",
      "#..........####.#",
      "#.$........F..p.#",
      "#..........####.#",
      "#...$..@S..####.#",
      "#...$.....$####$#",
      "###F#############",
      "###E#############",
      "#################"
    ],
    "solution": "RRRDLLLLLLUUULLUULUURRUUURRRRRRRDLLDXLDLLUDLLLLDDRRRRRRRRRDDRLUULLLLLLLLLUUUURRRRRRRRDXLDURRRRDRRRDDDDLRDDDUUUUUUULRLLLUULLDXLDULDLLLLLLLDDRRDDDDDDD",
    "id": "campaign-11",
    "chapter": "distant-workshops",
    "proof": {
      "moves": 148,
      "chests": 10,
      "replay": "won"
    }
  },
  {
    "id": "campaign-06",
    "chapter": "distant-workshops",
    "name": "The island exchange",
    "description": "A single canoe connects four workshops. Every useful tool has work to do on more than one island.",
    "hint": "Keep a tool shelf clear beside each dock. Park the carved canoe downwards, then return for the shears. The extinguisher must visit the far island before coming home.",
    "difficulty": "Hard",
    "synopsis": "Shears unlock the extinguisher, which unlocks the axe. The axe makes a canoe that must be parked without sealing the shears route; both earlier tools then return to finish the far island and open the home stairs.",
    "design": {
      "critical": [
        "one carried tool links four islands",
        "park the carved canoe before recovering shears",
        "recover extinguisher for far treasure and home stairs"
      ],
      "trap": "Pushing the carved canoe into the shears gate instead of parking it leaves the far treasure inaccessible.",
      "milestones": [
        {
          "label": "Shears opened the extinguisher island",
          "move": 23,
          "player": {
            "x": 5,
            "y": 12,
            "onBoat": false
          },
          "collected": 2
        },
        {
          "label": "Extinguisher opened the axe island",
          "move": 56,
          "player": {
            "x": 13,
            "y": 4,
            "onBoat": false
          },
          "collected": 5
        },
        {
          "label": "Tree carved; movable canoe must be parked",
          "move": 87,
          "player": {
            "x": 12,
            "y": 12,
            "onBoat": false
          },
          "collected": 7
        },
        {
          "label": "Shears returned for far island",
          "move": 114,
          "player": {
            "x": 16,
            "y": 12,
            "onBoat": false
          },
          "collected": 9
        }
      ],
      "mechanics": [
        "pickup:S",
        "push:B",
        "splash:B",
        "sail:",
        "tool:S",
        "drop:S",
        "pickup:K",
        "tool:K",
        "drop:K",
        "pickup:A",
        "tool:A",
        "drop:A"
      ],
      "counterfactual": {
        "prefix": "DLURRRDLRRRRDDDDDDDDLLLRDUXLLULLDDDRRUURRRRUUUUUUUURRRRRLDUXRRUURLRRDDLLLLLLDDDDDDDDRRRR",
        "expectedStatus": "playing",
        "proofType": "sealed-block",
        "block": {
          "x": 14,
          "y": 12,
          "tile": "B"
        },
        "unreachableChests": [
          {
            "x": 16,
            "y": 11
          },
          {
            "x": 16,
            "y": 12
          },
          {
            "x": 16,
            "y": 14
          }
        ],
        "explanation": "The canoe has walls above and below, a vine on its right, and no route to its right-hand pushing position. All three final chests stay unreachable even when water, fire and vines are treated as passable for reachability."
      }
    },
    "rows": [
      "###################",
      "##E#####~~~########",
      "##F#####~~~###$A.##",
      "##.@.$##~~~#.#...##",
      "##$.S.B.~~~..F..$##",
      "########~~~#.######",
      "########~~~########",
      "#~~~~~~~~~~~~~~~~~#",
      "#~~~~~~~~~~~~~~~~~#",
      "#~~~~~~~~~~~~~~~~~#",
      "########~~~########",
      "##$K.#.#~~~#..##$##",
      "##...p..~~~..T.p$##",
      "##...#.#~~~#..##F##",
      "##$.$###~~~##.##$##",
      "########~~~########",
      "###################"
    ],
    "solution": "DLURRRDLRRRRDDDDDDDDLLLRDUXLLULLDDDRRUURRRRUUUUUUUURRRRRLDUXRRUURLRRDDLLLLLLDDDDDDDDRRRURDDLUXLLLLLLUDRRRRRRRRRRUDLLLDUXLLLUUUUUUUURRUDLLDDDDDDDDRRRRRRDDUULLLLLLUUUUUUUULLLLLULLLUU",
    "proof": {
      "moves": 180,
      "chests": 10,
      "replay": "won"
    }
  },
  {
    "name": "Three lines of fire",
    "description": "Three firing lines share a limited set of shields. Moving an active shield needs a replacement first.",
    "hint": "Shield the northern doorway with the nearby marshmallow. Bring the cork against the northern trap before recovering that marshmallow. The eastern gallery then opens the route to your second marshmallow.",
    "rows": [
      "##################",
      "########!#########",
      "##E........$....##",
      "##.....M..C..$..##",
      "##..@...$.......##",
      "##......l...$...##",
      "##......#.......##",
      "##.$.$.$........!#",
      "##.......#......##",
      "##.......#......##",
      "##.......#.....M##",
      "#!..$.$.$l......##",
      "##.......#......##",
      "##.......#......##",
      "##################"
    ],
    "difficulty": "Hard",
    "synopsis": "A marshmallow travels from north to east to west, while a cork and the second marshmallow successively take over its old shielding jobs.",
    "design": {
      "critical": [
        "Push the first marshmallow into the northern sightline before collecting the doorway chest.",
        "Place the cork directly below the northern trap before sliding that marshmallow out again.",
        "Move the first marshmallow to the east firing lane to reach the second one.",
        "Stage the second marshmallow close to the eastern trap before pulling the first shield west and lowering it into the southern gallery."
      ],
      "trap": "Recovering either active shield before its replacement is in position exposes the square you enter to a spike trap.",
      "mechanics": [
        "push:M",
        "push:C"
      ],
      "checkpoints": [
        {
          "moves": 4,
          "tiles": [
            [
              8,
              3,
              "M"
            ]
          ]
        },
        {
          "moves": 25,
          "tiles": [
            [
              8,
              2,
              "C"
            ],
            [
              8,
              3,
              "M"
            ]
          ]
        },
        {
          "moves": 49,
          "tiles": [
            [
              8,
              2,
              "C"
            ],
            [
              13,
              7,
              "M"
            ]
          ]
        },
        {
          "moves": 79,
          "tiles": [
            [
              13,
              7,
              "M"
            ],
            [
              15,
              7,
              "M"
            ]
          ]
        },
        {
          "moves": 97,
          "tiles": [
            [
              3,
              11,
              "M"
            ],
            [
              15,
              7,
              "M"
            ]
          ]
        }
      ],
      "counterfactuals": [
        {
          "prefix": "URRRDRLUR",
          "mistake": "Remove the northern marshmallow before replacing it.",
          "expectedStatus": "dead",
          "cause": "spike"
        },
        {
          "prefix": "URRRDRRUURRDRRDDLULLURULLDDLLURDRRUULDDLDRRRRURDDLDLLLLLLLLLRRRRRRRDDDDRRRRRLUUUU",
          "mistake": "Try to recover the eastern shield before staging its replacement.",
          "expectedStatus": "dead",
          "cause": "spike"
        }
      ]
    },
    "solution": "URRRDRRUURRDRRDDLULLURULLDDLLURDRRUULDDLDRRRRURDDLDLLLLLLLLLRRRRRRRDDDDRRRRRUUULULLLLLLLLLLULDDDDRDRRRRUUUULUUUUULLLLL",
    "proof": {
      "moves": 118,
      "chests": 10,
      "replay": "won"
    },
    "id": "campaign-16",
    "chapter": "watch-the-lines"
  },
  {
    "name": "The travelling prop",
    "description": "A single arrow has three destinations. Two bowling balls need it underneath them before they can guard the spike galleries.",
    "hint": "Send the left arrow over both ramps before collecting the chest under the high ball. Slide that ball right to keep it shielding you, then push its old arrow support down twice. The marshmallow stops the first push so the second can use the lower ramp.",
    "rows": [
      "##################",
      "##################",
      "##E........#######",
      "##..@.....O#######",
      "##........$#######",
      "##.$.$.$$.......!#",
      "##..####...#$$O.!#",
      "###.#..../.M...###",
      "##>$../###.../.###",
      "###.######$....###",
      "###.######....$###",
      "##################",
      "##################"
    ],
    "difficulty": "Hard",
    "synopsis": "An arrow becomes a ball support; that ball becomes a spike shield while the arrow is repositioned and routed underneath a second shield.",
    "design": {
      "critical": [
        "Launch the distant arrow onto the shelf underneath the high ball before releasing that ball.",
        "Use the supported ball as cover while clearing the upper firing lane.",
        "Slide the ball right onto the solid ledge, preserving its shielding role while reaching the arrow below it.",
        "Push the arrow down onto the marshmallow stop, then down again onto the lower ramp route.",
        "The arrow now supports the second bowling ball, preserving cover while the lower gallery is cleared."
      ],
      "trap": "Release the upper ball too early and it falls past its useful shielding height. Entering either exposed spike gallery is fatal.",
      "mechanics": [
        "arrow:>",
        "fall:O",
        "push:O",
        "push:>",
        "push:M"
      ],
      "checkpoints": [
        {
          "moves": 7,
          "tiles": [
            [
              10,
              6,
              ">"
            ]
          ]
        },
        {
          "moves": 18,
          "tiles": [
            [
              10,
              5,
              "O"
            ],
            [
              10,
              6,
              ">"
            ]
          ]
        },
        {
          "moves": 32,
          "tiles": [
            [
              11,
              5,
              "O"
            ],
            [
              10,
              6,
              ">"
            ]
          ]
        },
        {
          "moves": 33,
          "tiles": [
            [
              11,
              5,
              "O"
            ],
            [
              10,
              7,
              ">"
            ],
            [
              11,
              7,
              "M"
            ]
          ]
        },
        {
          "moves": 34,
          "tiles": [
            [
              11,
              5,
              "O"
            ],
            [
              14,
              6,
              "O"
            ],
            [
              14,
              7,
              ">"
            ]
          ]
        }
      ],
      "counterfactuals": [
        {
          "prefix": "DRRRRRRLD",
          "mistake": "Release the upper ball before parking its arrow support, then enter the unshielded gallery.",
          "expectedStatus": "dead",
          "cause": "spike",
          "tiles": [
            [
              10,
              8,
              "O"
            ]
          ]
        }
      ]
    },
    "solution": "DDLDDDUUUURRRRRRRLDLLLLLLRRRRRRRDDDDDRRRRULLULLURRURLDLLUUUUULLLLLLLL",
    "proof": {
      "moves": 69,
      "chests": 10,
      "replay": "won"
    },
    "id": "campaign-17",
    "chapter": "watch-the-lines"
  },
  {
    "name": "Opposing Traffic",
    "rows": [
      "#####################",
      "#.....#..$...#......#",
      "#.$...#...@..#...$..#",
      "#.....l....$.r......#",
      "#...$.#......#....$.#",
      "###d######u######d###",
      "#.....#......#......#",
      "#.....r...$..l......#",
      "#!...O..M...M..O...!#",
      "#.#E#$r......l.$#$#.#",
      "#..#..#$...$.#...#..#",
      "####u#####d#####u####",
      "#...$.#......#....$.#",
      "#.....l......r......#",
      "#.$...#......#..$...#",
      "#.....#......#......#",
      "#####################"
    ],
    "solution": "ULDDRRLLLLLLULLLDDRRLDDDRRRRURRRUUURRRRURRRDDRLDDDLLLLLLLDDDLLLRRRRLDDDLLLLLDLLLUURRUURURRRRDRDDDRRRRDRRUURRLLUULULLLLLULLLLLLLURRRRRRRRDRRRRRRDULLLLLLLLLLLLLLD",
    "difficulty": "Hard",
    "synopsis": "A one-way courtyard network controls access to two supported balls and a corridor watched from both ends.",
    "description": "The side doors lead below the watched corridor. Collect its supported chests, then rearrange the shields before entering the two alcoves.",
    "hint": "A ball can be a shield as well as a danger. Once a ball drops out of the firing lane, the floor above it becomes exposed. The side doors let you return behind the marshmallows.",
    "design": {
      "features": [
        "one-way floor network",
        "opposed spike sight lines",
        "supported chests",
        "two movable shields",
        "changed return paths"
      ],
      "solutionMoves": 160,
      "chests": 16,
      "planning": "The one-way courtyard network gives access below two supported balls. The saved route removes both supports, returns through the side doors to the protected center, then advances the two marshmallows to shield the exit alcove and final chest. Moving a ball out of the corridor changes which return squares are safe. Alternative ball-parking solutions are possible and intentionally remain valid.",
      "counterfactuals": {
        "exposedReturn": {
          "prefix": "ULDDRRLLLLLLULLLDDRRLDDDRRRRURRRUUURRRRURRRDDRLDDDLLLLLLLDDDLLLRRRRLDDDLLLLLDLLLUURRUURUR",
          "action": "U",
          "status": "dead",
          "cause": "spike",
          "description": "After the left support is collected and the ball falls, immediately returning to the firing lane is lethal."
        },
        "prematureShield": {
          "prefix": "ULDDRRLLLLLLULLLDDRRLDDDRRRRURRRUUURRRRURRRDDRLDDDLLLLLLLDLLL",
          "action": "L",
          "status": "blocked",
          "description": "The left marshmallow cannot be advanced through the supported ball."
        }
      },
      "verified": "The saved solution has 160 productive moves, collects 16 chests and wins. Replays verify both the newly exposed return-square death and the blocked early marshmallow advance. This is a route-and-shield puzzle, not a claim that the published solution is unique."
    },
    "id": "campaign-15",
    "chapter": "watch-the-lines",
    "proof": {
      "moves": 160,
      "chests": 16,
      "replay": "won"
    }
  },
  {
    "name": "The borrowed shield",
    "description": "The cork has two jobs: divert the upper ball into the lower firing lane, then return through the workshop to plug the only entrance to the western vault.",
    "hint": "Keep it beside the lower ball until the upper one rolls right. That ball must remain in the spike’s line; recover the cork from the right and deliver it to the western hole.",
    "difficulty": "Hard",
    "synopsis": "A cork first denies a ball its preferred roll into a hole. The diverted ball becomes a permanent spike shield; only then can the cork be recovered and consumed to open the other vault.",
    "design": {
      "critical": [
        "Use the cork to force the upper ball right into the spike lane.",
        "Keep that ball as a shield while visiting the eastern gallery.",
        "Recover the same cork and plug the western hole."
      ],
      "trap": "Releasing the upper ball early loses the only available spike shield in a hole. Wasting the cork in that hole leaves the western treasure permanently inaccessible.",
      "milestones": [
        {
          "label": "Cork staged beside the rounded support",
          "move": 24,
          "player": {
            "x": 9,
            "y": 6,
            "onBoat": false
          },
          "collected": 3
        },
        {
          "label": "Upper ball diverted into the spike line",
          "move": 30,
          "player": {
            "x": 10,
            "y": 3,
            "onBoat": false
          },
          "collected": 4
        },
        {
          "label": "Eastern gallery cleared behind the ball shield",
          "move": 52,
          "player": {
            "x": 17,
            "y": 12,
            "onBoat": false
          },
          "collected": 8
        },
        {
          "label": "Cork recovered and consumed in the western hole",
          "move": 73,
          "player": {
            "x": 7,
            "y": 9,
            "onBoat": false
          },
          "collected": 8
        }
      ],
      "mechanics": [
        "push:C",
        "fall:O",
        "splash:C"
      ],
      "counterfactual": {
        "prefix": "UUUUURRRRUUURRRRRL",
        "expectedStatus": "playing",
        "solvedAfterMistake": false,
        "searchVisited": 16364,
        "searchReason": "exhausted-state-space"
      }
    },
    "rows": [
      "#####################",
      "#####################",
      "######.....O#########",
      "##.###.....$#########",
      "##.###$...$.#########",
      "##.###...$..#########",
      "##.....C.....########",
      "##.####.##hO.########",
      "##.####.####.########",
      "##.####.####.########",
      "##.####h####.########",
      "##@####.####..##$####",
      "##.##$...#!...$..$.##",
      "##E##...$####.....$##",
      "#####################"
    ],
    "solution": "UUUUURRRRUURRRRDLLLLDRRRUUURRLDRDDRDDDDDRDRRRUDRRDULLLLLULUUUUULLLLULDDDDDDDRDULLLRRUUUUUULLLLLDDDDDDD",
    "id": "campaign-22",
    "chapter": "watch-the-lines"
  },
  {
    "name": "Before the shutters fall",
    "description": "Deliver the marshmallow before the paired balls close the low passage. That same block must then help keep the upper ball at the height needed to protect the final chest.",
    "hint": "Leave the paired balls on their chest until the marshmallow is across. One plan: use the delivered block to catch the arrow, then release the upper ball onto that arrow.",
    "difficulty": "Hard",
    "synopsis": "A temporary chest keeps the delivery corridor open. Releasing it creates an immovable pair, while the delivered marshmallow catches an arrow that must preserve a separate ball shield.",
    "design": {
      "critical": [
        "Deliver the marshmallow before the paired balls permanently close its only passage.",
        "Keep the upper ball high enough to shield the final chest.",
        "The saved plan uses the marshmallow to catch an arrow, which then supports the shield ball. Other uses of the delivered block remain valid."
      ],
      "trap": "Collecting the support chest first jams two balls together across the marshmallow’s only delivery lane.",
      "milestones": [
        {
          "label": "Marshmallow delivered ahead of the closing pair",
          "move": 29,
          "player": {
            "x": 12,
            "y": 7,
            "onBoat": false
          },
          "collected": 4
        },
        {
          "label": "Arrow caught before releasing the shield ball",
          "move": 33,
          "player": {
            "x": 14,
            "y": 7,
            "onBoat": false
          },
          "collected": 5
        },
        {
          "label": "Shield ball rests on the caught arrow",
          "move": 42,
          "player": {
            "x": 14,
            "y": 4,
            "onBoat": false
          },
          "collected": 7
        },
        {
          "label": "Final firing-line chest collected behind the ball",
          "move": 45,
          "player": {
            "x": 12,
            "y": 5,
            "onBoat": false
          },
          "collected": 8
        }
      ],
      "mechanics": [
        "push:M",
        "arrow:<",
        "fall:O"
      ],
      "checkpoints": [
        {
          "moves": 29,
          "tiles": [
            [
              12,
              6,
              "M"
            ]
          ]
        },
        {
          "moves": 33,
          "tiles": [
            [
              12,
              6,
              "M"
            ],
            [
              13,
              6,
              "<"
            ],
            [
              13,
              3,
              "O"
            ]
          ]
        },
        {
          "moves": 42,
          "tiles": [
            [
              13,
              5,
              "O"
            ],
            [
              13,
              6,
              "<"
            ]
          ]
        },
        {
          "moves": 45,
          "tiles": [
            [
              13,
              5,
              "O"
            ],
            [
              12,
              5,
              "."
            ]
          ]
        }
      ],
      "counterfactuals": [
        {
          "prefix": "DDRRRRRL",
          "expectedStatus": "playing",
          "tiles": [
            [
              4,
              8,
              "M"
            ],
            [
              7,
              8,
              "O"
            ],
            [
              8,
              8,
              "O"
            ]
          ],
          "reason": "The pair permanently closes the sole route for the marshmallow; their lower neighbours are walls, and neither can be pushed through the other."
        }
      ]
    },
    "rows": [
      "##################",
      "##################",
      "##E....###.....###",
      "##$@.$.#O#.$#O####",
      "##....$.Ou...$$###",
      "##.$....$#..$...!#",
      "#####..#.#....$<##",
      "##.............###",
      "##..M..........###",
      "##########.....###",
      "##########.$..$###",
      "##################",
      "##################"
    ],
    "solution": "LRRRDRDLLLRRDDLLDRRRRRRRRDRUURURDLLLUUURRRLLDULUDDDDLLLUULRDDRRRDDDRRRUUULLLUUULLLLLUULLLL",
    "id": "campaign-20",
    "chapter": "watch-the-lines"
  }
];

export const CHAPTERS = [
  { id: 'read-the-room', name: 'Read the room', description: 'Learn to preserve a route before changing its supports.' },
  { id: 'set-things-up', name: 'Set things up', description: 'Prepare distant routes before committing to a release.' },
  { id: 'keep-options-open', name: 'Keep options open', description: 'Give the same objects several jobs without losing access.' },
  { id: 'the-long-game', name: 'The long game', description: 'Coordinate return trips, temporary supports, and distant hazards.' },
];
export const LEVELS = CAMPAIGN_ORDER.map((id, index) => ({
  ...CAMPAIGN_ROOMS.find(room => room.id === id),
  chapter: CHAPTERS[Math.floor(index / 5)].id,
}));
