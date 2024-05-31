
import fs from 'fs';
import { globSync } from 'glob';
const tsconfigContent = fs.readFileSync('tsconfig.json', 'utf8');
const tsconfigObject = JSON.parse(tsconfigContent);
const paths = tsconfigObject.compilerOptions.paths;
const filesList = globSync('dist/**/*.js');
filesList.forEach(file => {
    let raw = fs.readFileSync(file, 'utf8');
    for (const path in paths) {
        const deep = (file.match(/\\/g) || []).length;
        const pathText = path.replace('*', '');
        const toReplaceText = new RegExp(`"${pathText}(.*?)"`, 'g');
        raw = raw.replace(toReplaceText, `"${new Array(deep - 2).fill('../').join('')}${paths[path][0].replace('*', '')}${'$1'}"`);
    }
    fs.writeFileSync(file, raw);
});
