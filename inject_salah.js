const fs = require('fs');

function formatToHTML(lines) {
    let html = '';
    let inTable = false;
    for (let i = 0; i < lines.length; i++) {
        let line = lines[i].trim();
        if (!line) continue;

        if (line.includes('\t')) {
            if (!inTable) {
                html += '<div style="overflow-x:auto;"><table><tbody>\n';
                inTable = true;
            }
            html += '<tr>' + line.split('\t').map(cell => `<td>${cell.trim()}</td>`).join('') + '</tr>\n';
        } else {
            if (inTable) {
                html += '</tbody></table></div>\n';
                inTable = false;
            }
            if (line.match(/^[0-9]+\./) || line.startsWith('*')) {
                html += `<li>${line}</li>\n`;
            } else if (line.length < 100 && !line.endsWith('.') && !line.endsWith('।')) {
                html += `<h4>${line}</h4>\n`;
            } else {
                html += `<p>${line}</p>\n`;
            }
        }
    }
    if (inTable) {
        html += '</tbody></table></div>\n';
    }
    html = html.replace(/(<li>.*<\/li>\n)+/g, match => `<ul>\n${match}</ul>\n`);
    return html;
}

const enText = fs.readFileSync('./Translation-Scripts-Data/An Exhaustive Theological and Jurisprudential Guide to the Mechanics of Islamic Prayer (Salah)_EN.txt', 'utf8').split('\n');
const bnText = fs.readFileSync('./Translation-Scripts-Data/An Exhaustive Theological and Jurisprudential Guide to the Mechanics of Islamic Prayer (Salah)_BN.txt', 'utf8').split('\n');

const enCat1 = formatToHTML([].concat(enText.slice(8, 82), enText.slice(245, 284)));
const enCat2 = formatToHTML([].concat(enText.slice(0, 4), enText.slice(82, 136), enText.slice(176, 245)));
const enCat3 = formatToHTML([].concat(enText.slice(4, 8), enText.slice(136, 176)));

const bnCat1 = formatToHTML([].concat(bnText.slice(8, 82), bnText.slice(227, 266)));
const bnCat2 = formatToHTML([].concat(bnText.slice(0, 4), bnText.slice(82, 136), bnText.slice(164, 227)));
const bnCat3 = formatToHTML([].concat(bnText.slice(4, 8), bnText.slice(136, 164)));

let contentJs = fs.readFileSync('islamic-content.js', 'utf8');
const regex = /const TUTORIALS = (\[[\s\S]*?\]);\s+function getTutorials\(\)/m;
const match = contentJs.match(regex);
let t = eval(match[1]);

t[5].translations.body.en = enCat2;
t[5].translations.body.bn = bnCat2;
t[5].body = enCat2;

t[6].translations.body.en = enCat3;
t[6].translations.body.bn = bnCat3;
t[6].body = enCat3;

t[7].translations.body.en = enCat1;
t[7].translations.body.bn = bnCat1;
t[7].body = enCat1;

let newT = 'const TUTORIALS = ' + JSON.stringify(t, null, 4) + ';\n\n    function getTutorials()';
contentJs = contentJs.replace(regex, newT);
fs.writeFileSync('islamic-content.js', contentJs);

let engJs = require('./Translation-Scripts-Data/english_tutorials.js');
engJs[5].body = enCat2;
engJs[6].body = enCat3;
engJs[7].body = enCat1;
fs.writeFileSync('./Translation-Scripts-Data/english_tutorials.js', 'module.exports = ' + JSON.stringify(engJs, null, 4) + ';\n');

console.log('Successfully injected detailed EN and BN texts!');
