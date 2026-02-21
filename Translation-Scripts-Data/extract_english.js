const fs = require('fs');
const path = require('path');

const contentJsPath = path.join(__dirname, 'islamic-content.js');
const contentJs = fs.readFileSync(contentJsPath, 'utf8');

const regex = /const TUTORIALS = (\[[\s\S]*?\]);\s+function getTutorials\(\)/m;
const match = contentJs.match(regex);

if (match) {
    const tutorials = eval(match[1]);
    const englishOnly = tutorials.map(t => {
        return {
            icon: t.icon,
            title: t.translations?.title?.en || t.title,
            body: t.translations?.body?.en || t.body
        };
    });
    fs.writeFileSync(path.join(__dirname, 'english_tutorials.js'), 'module.exports = ' + JSON.stringify(englishOnly, null, 4) + ';\n');
    console.log('Extracted to english_tutorials.js');
}
