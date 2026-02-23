const fs = require('fs');
const file = 'Translation-Scripts-Data/An Exhaustive Theological and Jurisprudential Guide to the Mechanics of Islamic Prayer (Salah)_BN.txt';
let text = fs.readFileSync(file, 'utf8');

// Using a regex to find all English digits attached immediately after a Bengali character or punctuation.
const regex = /([।\)\.\,\'\"\u0980-\u09FF])[0-9]+/g;

let match;
let matches = [];
while ((match = regex.exec(text)) !== null) {
    matches.push(match[0]);
}
console.log("Found citations to replace:", matches.join(', '));

// Perform the replacement
let newText = text.replace(regex, '$1');
fs.writeFileSync(file, newText);

console.log("Citations removed effectively!");
