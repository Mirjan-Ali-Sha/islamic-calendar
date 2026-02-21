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

    // Batch translate
    const delimiter = " ~|~ ";
    const combinedText = tasks.map(t => t.text).join(delimiter);
    const translatedCombined = await translate(combinedText, target);

    // Split back, some spaces might be added around the delimiter by Google Translate
    const translatedArray = translatedCombined.split(/\s*~\|~\s*/);

    // Reconstruct
    for (let j = 0; j < tasks.length; j++) {
        const originalIndex = tasks[j].index;
        parts[originalIndex] = parts[originalIndex].replace(tasks[j].text, translatedArray[j] || tasks[j].text);
    }

    return parts.join('');
}

async function run() {
    const contentJsPath = path.join(__dirname, 'islamic-content.js');
    let contentJs = fs.readFileSync(contentJsPath, 'utf8');

    const regex = /const TUTORIALS = (\[[\s\S]*?\]);\s+function getTutorials\(\)/m;
    const match = contentJs.match(regex);
    if (!match) return console.error('TUTORIALS array not found in islamic-content.js');

    let tutorials;
    try {
        tutorials = eval(match[1]);
    } catch (e) {
        return console.error('Failed to parse TUTORIALS array:', e);
    }

    console.log(`Found ${tutorials.length} tutorials.`);

    for (let i = 0; i < tutorials.length; i++) {
        let t = tutorials[i];
        console.log(`Translating [${i + 1}/${tutorials.length}]: ${t.title}`);

        if (!t.translations) t.translations = { title: {}, body: {} };
        if (!t.translations.title) t.translations.title = {};
        if (!t.translations.body) t.translations.body = {};

        t.translations.title.en = t.title;
        t.translations.body.en = t.body;

        // Concurrently run languages for this single tutorial to speed it up wildly (max 11 requests)
        const langPromises = langs.map(async (lang) => {
            const translatedTitle = await translate(t.title, lang);
            const translatedBody = await translateHtml(t.body, lang);
            t.translations.title[lang] = translatedTitle;
            t.translations.body[lang] = translatedBody;
            process.stdout.write(`.` + lang);
        });

        await Promise.all(langPromises);
        console.log(` (done)`);
    }

    const stringifiedTutorials = JSON.stringify(tutorials, null, 4);
    contentJs = contentJs.replace(regex, `const TUTORIALS = ${stringifiedTutorials};\n\n    function getTutorials()`);
    fs.writeFileSync(contentJsPath, contentJs);
    console.log("\\nSuccessfully updated islamic-content.js with all translations!");
}

run();
