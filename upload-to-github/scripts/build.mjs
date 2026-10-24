// Make an offline, double-clickable edition without a bundler or dependencies.
import {readFile,writeFile,mkdir,cp,rm} from 'node:fs/promises';
const root=new URL('../',import.meta.url);
const read=name=>readFile(new URL(name,root),'utf8');
await rm(new URL('dist/',root),{recursive:true,force:true});
await cp(new URL('src/',root),new URL('dist/',root),{recursive:true});
await writeFile(new URL('dist/.nojekyll',root),'');
await mkdir(new URL('release/',root),{recursive:true});
let html=await read('src/index.html');
const css=(await read('src/style.css')).replace(/^\s*@import[^\n]*\n/gm,'');
const publicNames={campaign:['CAMPAIGN_ORDER','LEGACY_CAMPAIGN_ORDER','campaignIndex'],engine:['createState','step','validateLevel','TILE_INFO'],levels:['LEVELS','CHAPTERS','PRACTICE_LEVELS','PRACTICE_CHAPTERS','generateLevel'],challenges:['CHALLENGE_LEVELS','CHALLENGE_CHAPTERS'],render:['drawBoard','drawTile','tileCanvas','CELL'],audio:['BlobboAudio']};
const modules=await Promise.all(['campaign','engine','levels','challenges','render','audio','app'].map(async name=>{
  const source=await read(`src/${name}.js`);
  const body=source.replace(/^import .* from .*;\n/gm,'').replace(/^export /gm,'');
  const names=publicNames[name]?.join(',');
  return names?`const {${names}} = (() => {\n${body}\nreturn {${names}};\n})();`:body;
}));
const icon=await read('src/icon.svg');
html=html.replace('<link rel="stylesheet" href="style.css">',`<style>${css}</style>`)
  .replace('href="icon.svg"',`href="data:image/svg+xml,${encodeURIComponent(icon)}"`)
  .replace('<script type="module" src="app.js"></script>',()=>`<script type="module">\n${modules.join('\n\n')}\n</script>`);
await writeFile(new URL('release/Blobbo.html',root),html);
console.log('Built dist/ for hosting and release/Blobbo.html for offline play.');
