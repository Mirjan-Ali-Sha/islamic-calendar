const https = require('https');
function fetchJson(url) {
    return new Promise((resolve, reject) => {
        https.get(url, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => resolve(JSON.parse(data)));
        }).on('error', reject);
    });
}
async function test() {
    const text = "Hello \n\n 🛑🛑🛑 \n\n World";
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=tr&dt=t&q=${encodeURIComponent(text)}`;
    const json = await fetchJson(url);
    let result = '';
    json[0].forEach(item => { if (item[0]) result += item[0]; });
    console.log("tr:", result);

    const url2 = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=ms&dt=t&q=${encodeURIComponent(text)}`;
    const json2 = await fetchJson(url2);
    let result2 = '';
    json2[0].forEach(item => { if (item[0]) result2 += item[0]; });
    console.log("ms:", result2);
}
test();
