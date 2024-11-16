

const { globSync } = require('glob');
const fs = require('fs');
const path = require('path');

const tsConfigPath = path.join(process.cwd(), '../tsconfig.json');
const tsconfigContent = fs.readFileSync(tsConfigPath, 'utf8');

const tsconfigObject = JSON.parse(tsconfigContent);
const paths = tsconfigObject.compilerOptions.paths;

const filesList = globSync('dist/**/*.js');

console.log(`[BUILD] Building ${filesList.length} files`);

filesList.forEach(file => {

    let raw = fs.readFileSync(file, 'utf8');
    for (const path in paths) {
        const deep = (file.match(/\\|\//g) || []).length;
        const pathText = path.replace('*', '');
        const toReplaceText = new RegExp(`"${pathText}(.*?)"`, 'g');

        try {
            raw = raw.replace(toReplaceText, `"${new Array(deep - 2).fill('../').join('')}.${paths[path][0].replace('*', '')}${'$1'}"`);
        } catch (ex) {
            console.log({ deep, pathText, toReplaceText, path })
        }
    }

    fs.writeFileSync(file, raw);

});

console.log(`[BUILD] Done`);