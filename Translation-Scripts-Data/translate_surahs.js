const fs = require('fs');
const path = require('path');
const https = require('https');

const langs = ['ar', 'bn', 'ur', 'tr', 'ms', 'id', 'fr', 'hi', 'te', 'ta', 'ml'];

function fetchJson(url) {
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                if (res.statusCode === 200) {
                    try { resolve(JSON.parse(data)); } catch (e) { reject(e); }
                } else {
                    reject(new Error(`Status ${res.statusCode}`));
                }
            });
        }).on('error', reject);
    });
}

const sleep = ms => new Promise(r => setTimeout(r, ms));

async function translate(text, target) {
    if (!text || text.trim() === '') return text;
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=${target}&dt=t&q=${encodeURIComponent(text)}`;
    let retries = 3;
    while (retries > 0) {
        try {
            const json = await fetchJson(url);
            let result = '';
            if (json && json[0]) {
                json[0].forEach(item => {
                    if (item[0]) result += item[0];
                });
                return result;
            }
            return text;
        } catch (e) {
            retries--;
            if (retries === 0) return text;
            await sleep(500);
        }
    }
    return text;
}

async function translateHtml(html, target) {
    const parts = html.split(/(<[^>]+>)/g);
    let insideArabicOrPronunciation = false;
    let tasks = [];

    for (let i = 0; i < parts.length; i++) {
        const part = parts[i];
        if (part.startsWith('<')) {
            if (part.includes('class="tutorial-arabic"') || part.includes('class="tutorial-pronunciation"')) {
                insideArabicOrPronunciation = true;
            } else if (part === '</div>') {
                insideArabicOrPronunciation = false;
            }
        } else {
            if (!insideArabicOrPronunciation && part.trim() !== '') {
                if (!/^[\s🔊✖️×0-9\-\.,:]+$/.test(part)) {
                    tasks.push({ index: i, text: part.trim() });
                }
            }
        }
    }

    if (tasks.length === 0) return html;

    for (let j = 0; j < tasks.length; j++) {
        const translatedText = await translate(tasks[j].text, target);
        const originalIndex = tasks[j].index;
        parts[originalIndex] = parts[originalIndex].replace(tasks[j].text, translatedText);
        await sleep(200);
    }

    return parts.join('');
}

async function run() {
    const surahs = require('./english_surahs.js');
    console.log(`Loaded ${surahs.length} base English surahs.`);

    for (let i = 0; i < surahs.length; i++) {
        let s = surahs[i];
        console.log(`Translating [${i + 1}/${surahs.length}]: ${s.title}`);

        s.translations = { title: { en: s.title }, body: { en: s.body } };

        const langPromises = langs.map(async (lang) => {
            const translatedTitle = await translate(s.title, lang);
            const translatedBody = await translateHtml(s.body, lang);
            s.translations.title[lang] = translatedTitle;
            s.translations.body[lang] = translatedBody;
            process.stdout.write(`.` + lang);
        });

        await Promise.all(langPromises);
        console.log(` (done)`);
    }

    const contentJsPath = path.join(__dirname, '../islamic-content.js');
    let contentJs = fs.readFileSync(contentJsPath, 'utf8');

    const stringifiedSurahs = JSON.stringify(surahs, null, 4);

    if (contentJs.includes('const SURAHS =')) {
        const regex = /const SURAHS = (\[[\s\S]*?\]);\s+function getSurahs\(\)/m;
        contentJs = contentJs.replace(regex, `const SURAHS = ${stringifiedSurahs};\n\n    function getSurahs()`);
        console.log("Overwrote existing SURAHS array.");
    } else {
        const returnRegex = /return\s+\{([a-zA-Z0-9_,\s]+)\};/;
        const match = contentJs.match(returnRegex);
        if (match) {
            let exports = match[1].split(',').map(s => s.trim());
            if (!exports.includes('getSurahs')) exports.push('getSurahs');
            if (!exports.includes('SURAHS')) exports.push('SURAHS');

            const injection = `
    const SURAHS = ${stringifiedSurahs};

    function getSurahs() {
        return SURAHS;
    }

    return { ${exports.join(', ')} };`;
            contentJs = contentJs.replace(returnRegex, injection);
            console.log("Injected SURAHS array into islamic-content.js");
        } else {
            console.error("Could not find return statement in islamic-content.js");
        }
    }

    fs.writeFileSync(contentJsPath, contentJs);
    console.log("\nSuccessfully updated islamic-content.js with fresh Surahs!");
}

run();
