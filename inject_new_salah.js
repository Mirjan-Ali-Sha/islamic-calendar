const fs = require('fs');
const path = require('path');

function formatToHTML(lines) {
    let html = '';
    let i = 0;
    while (i < lines.length) {
        let rawLine = lines[i];
        let line = rawLine.trim();
        if (!line) { i++; continue; }

        let cols = 0;
        if (line === "Salah Time" || line === "ওয়াক্ত") {
            console.log("FOUND SALAH TIME", line, "NEXT:", lines[i + 1]);
            if (lines[i + 1] && (lines[i + 1].includes('Prayer Type') || lines[i + 1].includes('নামাজের ধরন'))) {
                cols = 4;
            } else if (lines[i + 1] && (lines[i + 1].includes('Sunnah Before') || lines[i + 1].includes('ফরজের আগে'))) {
                cols = 6;
            } else if (line === "ওয়াক্ত") {
                cols = 4; // fallback for Bangla table 1
            } else if (lines[i + 1] && lines[i + 1].includes('নামাজের ধরন')) {
                cols = 4;
            }
        } else if (line === "নামাজের ওয়াক্ত") {
            cols = 6;
        } else if ((line === "Scenario" || line === "দৃশ্যপট") && lines[i + 1] && (lines[i + 1].includes('Jurisprudential') || lines[i + 1].includes('ফিকহী'))) {
            cols = 2;
        }

        if (cols > 0 && i + cols <= lines.length) {
            console.log("GENERATING TABLE WITH COLS:", cols);
            html += '<div style="overflow-x:auto;"><table class="salah-table"><thead><tr>';
            html += `<th>${line}</th>`;
            for (let c = 1; c < cols; c++) {
                html += `<th>${lines[i + c].trim()}</th>`;
            }
            html += '</tr></thead><tbody>\n';
            i += cols;

            while (i < lines.length) {
                if (!lines[i].startsWith('\t') && !lines[i].match(/^\s+/)) {
                    break;
                }

                let cells = [];
                let valid = true;
                for (let c = 0; c < cols; c++) {
                    if (i + c < lines.length && (lines[i + c].startsWith('\t') || lines[i + c].match(/^\s+/))) {
                        cells.push(lines[i + c].trim());
                    } else {
                        valid = false;
                        break;
                    }
                }

                if (!valid) break;

                html += '<tr>' + cells.map(c => `<td>${c}</td>`).join('') + '</tr>\n';
                i += cols;
            }
            html += '</tbody></table></div>\n';
            continue;
        }

        // Not a table
        if (line.match(/^[0-9]+\./) || line.startsWith('*')) {
            html += `<li>${line}</li>\n`;
        } else if (rawLine.startsWith('\t> ') || line.match(/^> /)) {
            html += `<blockquote>${line.replace(/^>\s*/, '')}</blockquote>\n`;
        } else if (line.length < 100 && !line.endsWith('.') && !line.endsWith('।')) {
            html += `<h4>${line}</h4>\n`;
        } else {
            html += `<p>${line}</p>\n`;
        }
        i++;
    }

    html = html.replace(/(<li>.*<\/li>\n)+/g, match => `<ul>\n${match}</ul>\n`);
    return html;
}

const enText = fs.readFileSync('./Translation-Scripts-Data/An Exhaustive Theological and Jurisprudential Guide to the Mechanics of Islamic Prayer (Salah)_EN.txt', 'utf8').split('\n');
const bnText = fs.readFileSync('./Translation-Scripts-Data/An Exhaustive Theological and Jurisprudential Guide to the Mechanics of Islamic Prayer (Salah)_BN.txt', 'utf8').split('\n');

const enSections = [
    enText.slice(1, 8),      // 1: Introduction & Taxonomy
    enText.slice(8, 82),     // 2: Niyyah
    enText.slice(82, 136),   // 3: Micro-Mechanics & Qa'dah
    enText.slice(136, 176),  // 4: Recitation & Combinations
    enText.slice(176, 245),  // 5: Witr, Jumu'ah, Special
    enText.slice(245, 287)   // 6: Catalog & Conclusion
];

const bnSections = [
    bnText.slice(1, 8),      // 1
    bnText.slice(8, 82),     // 2
    bnText.slice(82, 136),   // 3
    bnText.slice(136, 164),  // 4
    bnText.slice(164, 227),  // 5
    bnText.slice(227, 269)   // 6
];

const titles = [
    "Introduction & Jurisprudence of Salah",
    "The Theology and Articulation of Niyyah",
    "Micro-Mechanics of a Rakat & Sitting Postures",
    "Jurisprudence of Recitation & Executing Combinations",
    "Specific Prayers: Witr, Jumu'ah, and Occasions",
    "Comprehensive Catalog of Prayers & Conclusion"
];

const ids = [
    "salah-intro",
    "salah-niyyah",
    "salah-mechanics",
    "salah-recitation",
    "salah-specific",
    "salah-catalog"
];

const icons = [
    "📖", // Introduction
    "💭", // Niyyah
    "🕌", // Mechanics
    "📿", // Recitation
    "🌙", // Specific Prayers
    "📚"  // Catalog
];

let newTutorials = [];

for (let i = 0; i < 6; i++) {
    const enHtml = formatToHTML(enSections[i]);
    const bnHtml = formatToHTML(bnSections[i]);

    newTutorials.push({
        id: ids[i],
        title: titles[i],
        icon: icons[i],
        body: enHtml,
        translations: {
            title: {
                en: titles[i],
                bn: bnSections[i][0] // taking the first line as potential title, or similar
            },
            body: {
                en: enHtml,
                bn: bnHtml
            }
        }
    });
}

// 1. Update english_tutorials.js
let engJs = require('./Translation-Scripts-Data/english_tutorials.js');
// The current state of engJs has 13 items.
// Index 7 is "How to Pray Salah (Step by Step)". It needs to be removed.
engJs.splice(7, 1);

// We want to insert the 6 new tutorials at index 5 so they appear BEFORE Surah Al-Fatihah.
engJs.splice(5, 0, ...newTutorials.map(t => ({ id: t.id, title: t.title, icon: t.icon, body: t.body })));
fs.writeFileSync('./Translation-Scripts-Data/english_tutorials.js', 'module.exports = ' + JSON.stringify(engJs, null, 4) + ';\n');

// 2. Update islamic-content.js (since it was reverted by git checkout, it also has the old structure)
let contentJs = fs.readFileSync('islamic-content.js', 'utf8');
const regex = /const TUTORIALS = (\[[\s\S]*?\]);\s+function getTutorials\(\)/m;
const match = contentJs.match(regex);
if (match) {
    let t = eval(match[1]);

    // Check if index 7 is the one we want to remove
    if (t[7] && t[7].title === 'How to Pray Salah (Step by Step)') {
        t.splice(7, 1);
        t.splice(5, 0, ...newTutorials);

        let newT = 'const TUTORIALS = ' + JSON.stringify(t, null, 4) + ';\n\n    function getTutorials()';
        contentJs = contentJs.replace(regex, newT);
        fs.writeFileSync('islamic-content.js', contentJs);
        console.log("Successfully replaced old 1 tutorial with 6 new verbose ones.");
    } else {
        console.log("Error: Expected index 7 to be 'How to Pray Salah'. Instead got", t[7] ? t[7].title : 'undefined');
    }
} else {
    console.log("Error: Could not find TUTORIALS array in islamic-content.js");
}

