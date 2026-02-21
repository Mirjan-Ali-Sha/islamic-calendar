const fs = require('fs');
const path = require('path');

const appJsPath = path.join(__dirname, 'app.js');
const contentJsPath = path.join(__dirname, 'islamic-content.js');

let appJs = fs.readFileSync(appJsPath, 'utf8');

const regex = /const tutorials = \[([\s\S]*?)\];\s+list\.innerHTML = tutorials\.map/m;
const match = appJs.match(regex);

if (!match) {
    console.log("Could not find tutorials array in app.js");
    process.exit(1);
}

// Convert string back to JS object to manipulate it
const tutorialsStr = `[${match[1]}]`;
const tutorials = eval(tutorialsStr);

// Now map over it and add translations
const translatedTutorials = tutorials.map(t => {
    // Simple translation for titles for demonstration
    // Since we don't have an AI API in this script, we'll just mock a few translations or leave them structured ready for the app
    const titleTrans = {
        en: t.title,
        bn: `[BN] ${t.title}`, // Placeholder
        ur: `[UR] ${t.title}`
    };

    if (t.title.includes('Five Pillars')) {
        titleTrans.bn = 'ইসলামের পাঁচটি স্তম্ভ';
        titleTrans.ur = 'اسلام کے پانچ ستون';
    } else if (t.title.includes('Fatihah')) {
        titleTrans.bn = 'সূরা আল-ফাতিহা';
        titleTrans.ur = 'سورہ الفاتحہ';
    } else if (t.title.includes('Ayat al-Kursi')) {
        titleTrans.bn = 'আয়াতুল কুরসী';
        titleTrans.ur = 'آیۃ الکرسی';
    } else if (t.title.includes('Wudu')) {
        titleTrans.bn = 'ওযুর নিয়ম';
        titleTrans.ur = 'وضو کا طریقہ';
    } else if (t.title.includes('Salah')) {
        titleTrans.bn = 'নামাযের নিয়ম';
        titleTrans.ur = 'نماز کا طریقہ';
    } else if (t.title.includes('Fasting')) {
        titleTrans.bn = 'রোজার নিয়ম';
        titleTrans.ur = 'روزے کا طریقہ';
    } else if (t.title.includes('Hajj')) {
        titleTrans.bn = 'হজ্বের গাইড';
        titleTrans.ur = 'حج کا طریقہ';
    } else if (t.title.includes('Daily Duas')) {
        titleTrans.bn = 'দৈনন্দিন দোয়া';
        titleTrans.ur = 'روزمرہ کی دعائیں';
    } else if (t.title.includes('Dhikr After Salah')) {
        titleTrans.bn = 'নামাযের পর যিকির';
        titleTrans.ur = 'نماز کے بعد ذکر';
    } else if (t.title.includes('Etiquette')) {
        titleTrans.bn = 'ইসলামী শিষ্টাচার';
        titleTrans.ur = 'اسلامی آداب';
    }

    t.translations = {
        title: titleTrans,
        // For body, we store the english body. Expanding to full html for multiple languages is huge.
        // As a starting point, we define `bodyTrans` with just `en`, to make it "supported" and later easily expandable.
        body: {
            en: t.body,
            // Example of a minimal translated body for Bengali just for the first one to prove it works
            bn: t.title.includes('Five Pillars') ? `
                    <h4>১. শাহাদাত (বিশ্বাসের ঘোষণা)</h4>
                    <div class="tutorial-arabic">أَشْهَدُ أَنْ لَا إِلٰهَ إِلَّا اللّٰهُ وَأَشْهَدُ أَنَّ مُحَمَّدًا رَسُولُ اللّٰهِ</div>
                    <div class="tutorial-pronunciation">🔊 আশহাদু আল্লা ইলাহা ইল্লাল্লাহু, ওয়া আশহাদু আন্না মুহাম্মাদান রাসুলুল্লাহ</div>
                    <p>"আমি সাক্ষ্য দিচ্ছি যে আল্লাহ ছাড়া কোনো ইলাহ নেই, এবং আমি আরও সাক্ষ্য দিচ্ছি যে মুহাম্মদ (সাঃ) আল্লাহর রাসুল।"</p>
                    <h4>২. সালাত (নামায)</h4>
                    <p>প্রতিদিন পাঁচ ওয়াক্ত নামায ফরজ: ফজর, যোহর, আসর, মাগরিব, ইশা।</p>
                    <h4>৩. যাকাত (দান)</h4>
                    <p>সঞ্চয়ের ২.৫% বার্ষিক দান, যা অভাবগ্রস্তদের দেওয়া হয়।</p>
                    <h4>৪. সাওম (রোজা)</h4>
                    <p>রমজান মাসে সুবহে সাদিক থেকে সূর্যাস্ত পর্যন্ত পানাহার ও পার্থিব কামনা থেকে বিরত থাকা।</p>
                    <h4>৫. হজ্ব (তীর্থযাত্রা)</h4>
                    <p>মক্কায় তীর্থযাত্রা, যা আর্থিকভাবে সচ্ছল ব্যক্তিদের জন্য জীবনে একবার ফরজ।</p>
            ` : t.body
        }
    };

    // We remove the old static properties if we want, but keeping them might be easier for migration.
    // Actually, let's keep it clean.
    return t;
});

// Now we need to write this to islamic-content.js
let contentJs = fs.readFileSync(contentJsPath, 'utf8');

// Convert translatedTutorials to a formatted string
const stringifiedTutorials = JSON.stringify(translatedTutorials, null, 4);

// Find the return statement in islamic-content.js and insert TUTORIALS before it
if (!contentJs.includes('const TUTORIALS =')) {
    const returnRegex = /return\s+\{\s*getDailyContent,\s*getAllNames,\s*DAILY_CONTENT,\s*NAMES_OF_ALLAH\s*\};/;
    contentJs = contentJs.replace(returnRegex, `
    const TUTORIALS = ${stringifiedTutorials};

    function getTutorials() {
        return TUTORIALS;
    }

    return { getDailyContent, getAllNames, getTutorials, DAILY_CONTENT, NAMES_OF_ALLAH, TUTORIALS };`);
    fs.writeFileSync(contentJsPath, contentJs);
    console.log("Injected TUTORIALS into islamic-content.js");
} else {
    console.log("TUTORIALS already exists in islamic-content.js");
}

// And remove the array from app.js
appJs = appJs.replace(regex, `const tutorials = IslamicContent.getTutorials ? IslamicContent.getTutorials() : [];\n        list.innerHTML = tutorials.map`);
fs.writeFileSync(appJsPath, appJs);
console.log("Updated app.js to use IslamicContent.getTutorials()");

