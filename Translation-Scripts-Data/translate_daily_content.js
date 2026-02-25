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
    if (target === 'en') return text;
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

async function run() {
    const contentJsPath = path.join(__dirname, '..', 'islamic-content.js');
    let contentJs = fs.readFileSync(contentJsPath, 'utf8');

    const regex = /const DAILY_CONTENT = (\[[\s\S]*?\]);\s*\/\/[^\n]*\n\s*const NAMES_OF_ALLAH/m;
    const match = contentJs.match(regex);
    if (!match) return console.error('DAILY_CONTENT array not found in islamic-content.js');

    let dailyContent;
    try {
        dailyContent = eval(match[1]);
    } catch (e) {
        return console.error('Failed to parse DAILY_CONTENT array:', e);
    }

    console.log(`Found ${dailyContent.length} daily items.`);
    let updatedCount = 0;

    for (let i = 0; i < dailyContent.length; i++) {
        let dc = dailyContent[i];
        if (!dc.translations) dc.translations = {};

        // If English translation is missing, skip or set fallback
        let engText = dc.translations.en || '';
        if (!engText) {
            console.log(`Item ${i + 1} missing EN translation. Skipping translation.`);
            continue;
        }

        let needsUpdate = false;

        for (let j = 0; j < langs.length; j++) {
            const lang = langs[j];
            // Only translate if missing or explicitly marked "TBD" or empty string
            if (!dc.translations[lang] || dc.translations[lang] === 'TBD' || dc.translations[lang].trim() === '') {
                // If the target is Arabic and we have the raw Arabic `ar` field, use it if it's not a translation of literal english.
                // Wait, the translations.ar should usually just be the raw Arabic.
                if (lang === 'ar' && dc.ar) {
                    dc.translations.ar = dc.ar;
                } else {
                    process.stdout.write(`Translating item ${i + 1} to ${lang}... `);
                    const translatedText = await translate(engText, lang);
                    dc.translations[lang] = translatedText;
                    process.stdout.write(`Done.\n`);
                    needsUpdate = true;
                    await sleep(200);
                }
            }
        }
        if (needsUpdate) {
            updatedCount++;
        }
    }

    if (updatedCount > 0) {
        const stringifiedContent = JSON.stringify(dailyContent, null, 4);
        // Correct formatting to match original indentation
        const indentedContent = stringifiedContent.split('\n').map((line, idx) => idx === 0 ? line : '    ' + line).join('\n');

        contentJs = contentJs.replace(regex, `const DAILY_CONTENT = ${indentedContent};\n\n    const NAMES_OF_ALLAH`);
        fs.writeFileSync(contentJsPath, contentJs);
        console.log(`\nSuccessfully updated islamic-content.js with new translations for ${updatedCount} items!`);
    } else {
        console.log(`\nNo missing translations found. Nothing updated.`);
    }
}

run();
