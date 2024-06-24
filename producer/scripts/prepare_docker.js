
const child = require('child_process');

const p = child.exec('pnpm run compile && pnpm run build');

p.stdout.on('data', (e) => { console.log(e.toString()); });
p.stderr.on('data', (e) => { console.log(e.toString()); });