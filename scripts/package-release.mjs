// Invoked by npm run release after tests and the level audit pass.
import { cp, mkdir, mkdtemp, readFile, readdir, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execFileSync } from 'node:child_process';
import { createHash } from 'node:crypto';
import './build.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
const release = path.join(root, 'release');
const hostFolder = path.join(release, 'upload-to-host');
const githubFolder = path.join(release, 'upload-to-github');
const stage = await mkdtemp(path.join(tmpdir(), 'blobbo-release-'));
const sourceEntries = ['src', 'scripts', 'tests', 'docs', 'maps', '.github', '.gitignore', 'package.json', 'README.md', 'LICENSE', 'CREDITS.md', 'CHANGELOG.md'];
async function zip(cwd, entries, filename) {
  const destination = path.join(release, filename);
  await rm(destination, { force: true });
  execFileSync('zip', ['-X', '-q', '-r', destination, ...entries, '-x', '*/.DS_Store', '.DS_Store'], { cwd, stdio: 'pipe' });
}
try {
  const copyOptions = { recursive: true, filter: source => path.basename(source) !== '.DS_Store' };
  for (const entry of sourceEntries) await cp(path.join(root, entry), path.join(stage, 'blobbo', entry), copyOptions);
  await rm(githubFolder, { recursive: true, force: true });
  await cp(path.join(stage, 'blobbo'), githubFolder, copyOptions);
  await rm(hostFolder, { recursive: true, force: true });
  await mkdir(hostFolder, { recursive: true });
  await cp(path.join(release, 'Blobbo.html'), path.join(hostFolder, 'index.html'));
  await cp(path.join(root, 'LICENSE'), path.join(hostFolder, 'LICENSE.txt'));
  await writeFile(path.join(hostFolder, '.nojekyll'), '');
  await writeFile(path.join(hostFolder, 'CREDITS.txt'), `Blobbo — The Browser Project

An independent browser reconstruction inspired by Blobbo, the Macintosh
puzzle game by Glenn Andreas. Not an official port or an endorsed release.
Globbo by siwu provided a playable reference:
https://www.lexaloffle.com/bbs/?tid=46390

The engine, canvas artwork, synthesized effects, new background composition,
and shipped room layouts were created for this project. No original game
executable, artwork, audio, level pack, or Globbo cartridge/code is included.

Rights to the project's new material remain reserved. See LICENSE.txt.
`);
  await cp(path.join(root, 'docs', 'release-start.txt'), path.join(release, 'START-HERE.txt'));
  await zip(stage, ['blobbo'], 'blobbo-source.zip');
  await zip(hostFolder, (await readdir(hostFolder)).sort(), 'blobbo-web.zip');
  const files = ['Blobbo.html', 'blobbo-source.zip', 'blobbo-web.zip'];
  const hashes = await Promise.all(files.map(async name => `${createHash('sha256').update(await readFile(path.join(release, name))).digest('hex')}  ${name}`));
  await writeFile(path.join(release, 'SHA256SUMS'), hashes.join('\n') + '\n');
  console.log('Release ready: release/upload-to-host/, upload-to-github/, Blobbo.html, both ZIPs, SHA256SUMS. Read release/START-HERE.txt.');
} finally {
  await rm(stage, { recursive: true, force: true });
}
