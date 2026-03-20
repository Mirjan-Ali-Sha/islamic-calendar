/**
 * Islamic Calendar PWA — Main Application Logic
 *
 * ╔══════════════════════════════════════════════════════╗
 * ║  APP VERSION — Change this to trigger app updates    ║
 * ║  Format: major.minor.micro                           ║
 * ║  Also update CACHE_NAME in sw.js to match!           ║
 * ╚══════════════════════════════════════════════════════╝
 */
const APP_VERSION = '2.0.0';
const App = (() => {
    // ── State ──
    let currentLang = localStorage.getItem('ic-lang') || 'en';
    let currentHijriYear = 0;
    let currentHijriMonth = 0;

    // Hijri Adjustment Map: {"Y-M": adjustment, "default": -1}
    let hijriAdjustments = {};
    try {
        const savedMap = localStorage.getItem('ic-hijri-adj-map');
        if (savedMap) {
            hijriAdjustments = JSON.parse(savedMap);
        } else {
            // Migration from old single value
            const oldAdj = localStorage.getItem('ic-adj');
            const defaultAdj = oldAdj !== null ? parseInt(oldAdj) : -1;
            hijriAdjustments = { "default": defaultAdj };
        }
    } catch (e) {
        hijriAdjustments = { "default": -1 };
    }
    let currentHijriAdj = hijriAdjustments.default;

    // Location & Prayer state
    let currentCity = null;
    let calcMethod = localStorage.getItem('ic-method') || 'mwl';
    let asrSchool = localStorage.getItem('ic-asr') || 'shafii';
    let prayerCountdownInterval = null;

    // Time adjustment state
    let timeAdjustSign = localStorage.getItem('ic-time-adj-sign') || '+';
    let timeAdjustMin = parseInt(localStorage.getItem('ic-time-adj-min')) || 0;
    let timeAdjustSec = parseInt(localStorage.getItem('ic-time-adj-sec')) || 0;

    // Service worker update state
    let waitingWorker = null;

    // Qibla state
    let qiblaBearing = 0;
    let compassActive = false;
    let lastHeading = null;
    let qiblaGpsWatcher = null;
    let isCalibrating = false;
    let calibrationSamples = [];
    const SMOOTHING_FACTOR = 0.2; // 0.1 to 1.0 (lower is smoother)

    // Notification state
    let notificationsEnabled = localStorage.getItem('ic-notif') === 'true';
    let notifiedPrayersToday = new Set(); // Track all prayers notified today

    // RTL languages
    const RTL_LANGS = ['ar', 'ur'];

    // UI strings
    const UI_STRINGS = {
        en: { eventsTitle: 'Events This Month', noEvents: 'No special events this month', selectLang: 'Select Language', today: 'Today', install: 'Install this app on your device', footerNote: 'Dates are based on the tabular Islamic calendar (arithmetic approximation). Actual dates may vary by 1-2 days based on moon sighting.', prayerProhibited: 'Prayer Prohibited', shuruq: 'Shuruq', istiwa: 'Istiwa', ghurub: 'Ghurub', hubWarning: 'This section is not completely verified. Please ask for details from an Imam. Also, the full app translation was done using Google Translate. Users should verify all contents with a knowledgeable person like an Imam in the selected language.', langWarning: 'The author used Google Translate for regional languages. Please contribute on GitHub for any corrections and definitely check with a knowledgeable person like an Imam for clarifications.', proceedBtn: 'Proceed', warningTitle: 'Note/Warning', notifPrayerTime: 'It is time for {prayer} prayer.' },
        ar: { eventsTitle: 'أحداث هذا الشهر', noEvents: 'لا توجد أحداث خاصة هذا الشهر', selectLang: 'اختر اللغة', today: 'اليوم', install: 'ثبت هذا التطبيق على جهازك', footerNote: 'التواريخ مبنية على التقويم الإسلامي الحسابي. قد تختلف التواريخ الفعلية بيوم أو يومين حسب رؤية الهلال.', prayerProhibited: 'الصلاة منهي عنها', shuruq: 'الشروق', istiwa: 'الاستواء', ghurub: 'الغروب', hubWarning: 'هذا القسم غير محقق بالكامل، يرجى سؤال الإمام للحصول على التفاصيل. تم ترجمة التطبيق بواسطة مترجم جوجل، لذا يرجى التحقق من المحتوى من شخص مطلع مثل الإمام باللغة المختارة.', langWarning: 'استخدم المؤلف مترجم جوجل للغات الإقليمية. يرجى المساهمة في GitHub لأي تصحيح والتحقق مع شخص مطلع مثل الإمام للتوضيح.', proceedBtn: 'متابعة', warningTitle: 'ملاحظة/تحذير', notifPrayerTime: 'حان وقت صلاة {prayer}.' },
        bn: { eventsTitle: 'এই মাসের ইভেন্ট', noEvents: 'এই মাসে কোনো বিশেষ ইভেন্ট নেই', selectLang: 'ভাষা নির্বাচন করুন', today: 'আজ', install: 'এই অ্যাপটি আপনার ডিভাইসে ইনস্টল করুন', footerNote: 'তারিখগুলি ট্যাবুলার ইসলামি ক্যালেন্ডারের উপর ভিত্তি করে। প্রকৃত তারিখ চাঁদ দেখার উপর নির্ভর করে ১-২ দিন ভিন্ন হতে পারে।', prayerProhibited: 'নামাজ নিষিদ্ধ', shuruq: 'শুরুক', istiwa: 'ইস্তিওয়া', ghurub: 'ঘুরুব', hubWarning: 'এই বিভাগটি সম্পূর্ণরূপে যাচাই করা হয়নি। অনুগ্রহ করে একজন ইমামের কাছ থেকে বিস্তারিত জেনে নিন। এছাড়াও, পুরো অ্যাপটি গুগল ট্রান্সলেটর ব্যবহার করে অনুবাদ করা হয়েছে। ব্যবহারকারীদের উচিত নির্বাচিত ভাষায় ইমামের মতো একজন জ্ঞানী ব্যক্তির কাছ থেকে সমস্ত বিষয়বস্তু যাচাই করে নেওয়া।', langWarning: 'আঞ্চলিক ভাষার জন্য লেখক গুগল ট্রান্সলেটর ব্যবহার করেছেন। কোনো সংশোধনের জন্য অনুগ্রহ করে গিটহাবে (GitHub) অবদান রাখুন এবং স্পষ্টীকরণের জন্য অবশ্যই ইমামের মতো কোনো জ্ঞানী ব্যক্তির সাথে পরীক্ষা করুন।', proceedBtn: 'এগিয়ে যান', warningTitle: 'দ্রষ্টব্য/সতর্কতা' },
        ur: { eventsTitle: 'اس مہینے کے واقعات', noEvents: 'اس مہینے کوئی خاص واقعہ نہیں', selectLang: 'زبان منتخب کریں', today: 'آج', install: 'یہ ایپ اپنے ڈیوائس پر انسٹال کریں', footerNote: 'تاریخیں حسابی اسلامی تقویم پر مبنی ہیں۔ اصل تاریخیں چاند دیکھنے کی بنیاد پر 1-2 دن مختلف ہو سکتی ہیں۔', prayerProhibited: 'نماز ممنوع ہے', shuruq: 'شروق', istiwa: 'استواء', ghurub: 'غروب', hubWarning: 'یہ حصہ مکمل طور پر تصدیق شدہ نہیں ہے، براہ کرم تفصیلات کے لیے امام سے پوچھیں۔ اس کے علاوہ، ایپ کا مکمل ترجمہ گوگل ٹرانسلیٹر کے ذریعے کیا گیا ہے، صارف کو منتخب زبان میں امام جیسے باشعور شخص سے تمام مواد کی تصدیق کرنی ہوگی۔', langWarning: 'مصنف نے علاقائی زبانوں کے لیے گوگل ٹرانسلیٹر کا استعمال کیا ہے، براہ کرم کسی بھی تصحیح کے لیے گٹ ہب میں حصہ لیں اور وضاحت کے لیے امام جیسے کسی جانکار شخص سے ضرور رابطہ کریں۔', proceedBtn: 'آگے بڑھیں', warningTitle: 'نوٹ/انتباہ' },
        tr: { eventsTitle: 'Bu Ayın Etkinlikleri', noEvents: 'Bu ay özel etkinlik yok', selectLang: 'Dil Seçin', today: 'Bugün', install: 'Bu uygulamayı cihazınıza yükleyin', footerNote: 'Tarihler tablo tabanlı İslami takvime dayanmaktadır. Gerçek tarihler hilal gözlemine göre 1-2 gün farklılık gösterebilir.', prayerProhibited: 'Namaz Yasak', shuruq: 'İşrak', istiwa: 'İstiva', ghurub: 'Kerahet', hubWarning: 'Bu bölüm tamamen doğrulanmamıştır, lütfen ayrıntılar için bir İmama danışın. Ayrıca, uygulama çevirisi Google Çeviri ile yapılmıştır. Kullanıcılar içerikleri ilgili dilde yetkin bir kişiye (İmam gibi) doğrulatmalıdır.', langWarning: 'Yazar bölgesel diller için Google Çeviri kullanmıştır. Düzeltmeler için lütfen GitHub üzerinden katkıda bulunun ve netleştirme için bir İmama danışın.', proceedBtn: 'Devam Et', warningTitle: 'Not/Uyarı' },
        ms: { eventsTitle: 'Acara Bulan Ini', noEvents: 'Tiada acara khas bulan ini', selectLang: 'Pilih Bahasa', today: 'Hari Ini', install: 'Pasang aplikasi ini pada peranti anda', footerNote: 'Tarikh adalah berdasarkan kalendar Islam jadual. Tarikh sebenar mungkin berbeza 1-2 hari berdasarkan cerapan anak bulan.', prayerProhibited: 'Solat Dilarang', shuruq: 'Syuruk', istiwa: 'Istiwa', ghurub: 'Ghurub', hubWarning: 'Bahagian ini tidak disahkan sepenuhnya, sila tanya Imam untuk butiran. Selain itu, terjemahan aplikasi dilakukan menggunakan Google Translate. Pengguna perlu mengesahkan kandungan dengan orang yang berilmu seperti Imam dalam bahasa yang dipilih.', langWarning: 'Penulis menggunakan Google Translate untuk bahasa serantau. Sila menyumbang di GitHub untuk sebarang pembetulan dan pastikan anda menyemak dengan orang yang berilmu seperti Imam.', proceedBtn: 'Teruskan', warningTitle: 'Nota/Amaran' },
        id: { eventsTitle: 'Peristiwa Bulan Ini', noEvents: 'Tidak ada peristiwa khusus bulan ini', selectLang: 'Pilih Bahasa', today: 'Hari Ini', install: 'Pasang aplikasi ini di perangkat Anda', footerNote: 'Tanggal didasarkan pada kalender Islam tabuler. Tanggal sebenarnya mungkin berbeda 1-2 hari berdasarkan pengamatan bulan.', prayerProhibited: 'Waktu Larangan', shuruq: 'Terbit', istiwa: 'Istiwa', ghurub: 'Terbenam', hubWarning: 'Bagian ini tidak sepenuhnya diverifikasi, silakan tanyakan detailnya kepada Imam. Selain itu, terjemahan aplikasi dilakukan menggunakan Google Translate. Pengguna harus memverifikasi semua konten kepada orang yang berpengetahuan seperti Imam dalam bahasa yang dipilih.', langWarning: 'Penulis menggunakan Google Translate untuk bahasa daerah. Silakan berkontribusi di GitHub untuk koreksi apa pun dan pastikan untuk memeriksa dengan orang yang berpengetahuan seperti Imam.', proceedBtn: 'Lanjutkan', warningTitle: 'Catatan/Peringatan' },
        fr: { eventsTitle: 'Événements du mois', noEvents: 'Aucun événement spécial ce mois-ci', selectLang: 'Choisir la langue', today: 'Aujourd\'hui', install: 'Installez cette application sur votre appareil', footerNote: 'Les dates sont basées sur le calendrier islamique tabulaire. Les dates réelles peuvent varier de 1 à 2 jours selon l\'observation lunaire.', prayerProhibited: 'Prière Interdite', shuruq: 'Chourouk', istiwa: 'Istiwa', ghurub: 'Ghurub', hubWarning: 'Cette section n\'est pas entièrement vérifiée, veuillez demander des détails à un imam. De plus, la traduction complète de l\'application a été faite via Google Translate. L\'utilisateur doit vérifier tous les contenus avec une personne compétente comme un imam dans la langue sélectionnée.', langWarning: 'L\'auteur a utilisé Google Translate pour les langues régionales. Veuillez contribuer sur GitHub pour toute correction et vérifiez certainement avec une personne compétente comme un imam pour des clarifications.', proceedBtn: 'Procéder', warningTitle: 'Note/Avertissement' },
        hi: { eventsTitle: 'इस महीने के कार्यक्रम', noEvents: 'इस महीने कोई विशेष कार्यक्रम नहीं', selectLang: 'भाषा चुनें', today: 'आज', install: 'इस ऐप को इंस्टॉल करें', footerNote: 'तारीखें गणितीय इस्लामी कैलेंडर पर आधारित हैं। चाँद दिखने के आधार पर वास्तविक तारीखें 1-2 दिन भिन्न हो सकती हैं।', prayerProhibited: 'नमाज़ निषेध है', shuruq: 'शुरूक़', istiwa: 'इस्तिवा', ghurub: 'घूरूब', hubWarning: 'यह अनुभाग पूरी तरह से सत्यापित नहीं है, कृपया विवरण के लिए इमाम से पूछें। इसके अलावा, पूर्ण ऐप अनुवाद Google Translator का उपयोग करके किया गया है, उपयोगकर्ता को चयनित भाषा में इमाम जैसे प्रतिष्ठित जानकार व्यक्ति से सभी सामग्री को सत्यापित करना होगा।', langWarning: 'लेखक ने क्षेत्रीय भाषाओं के लिए Google Translator का उपयोग किया है, कृपया किसी भी सुधार के लिए github में योगदान दें और स्पष्टीकरण के लिए निश्चित रूप से इमाम जैसे किसी जानकार व्यक्ति से जाँच करें।', proceedBtn: 'आगे बढ़ें', warningTitle: 'नोट/चेतावनी' },
        te: { eventsTitle: 'ఈ నెల కార్యక్రమాలు', noEvents: 'ఈ నెలలో ప్రత్యేక కార్యక్రమాలు ఏమీ లేవు', selectLang: 'భాషను ఎంచుకోండి', today: 'ఈ రోజు', install: 'ఈ యాప్‌ను ఇన్‌స్టాల్ చేయండి', footerNote: 'తేదీలు పట్టిక ఆధారిత ఇస్లామిక్ క్యాలెండర్‌పై ఆధారపడి ఉంటాయి. చంద్రుని దర్శనం ఆధారంగా నిజమైన తేదీలు 1-2 రోజులు మారవచ్చు.', prayerProhibited: 'ప్రార్థన నిషిద్ధం', shuruq: 'శురుక్', istiwa: 'ఇస్తివా', ghurub: 'ఘురుబ్', hubWarning: 'ఈ విభాగం పూర్తిగా ధృవీకరించబడలేదు, దయచేసి వివరాల కోసం ఇమామ్‌ను అడగండి. అలాగే, పూర్తి యాప్ అనువాదం Google Translatorని ఉపయోగించి చేయబడింది. వినియోగదారు ఎంచుకున్న భాషలో ఇమామ్ వంటి విజ్ఞానవంతులైన వ్యక్తి నుండి అన్ని విషయాలను ధృవీకరించుకోవాలి.', langWarning: 'ప్రాంతీయ భాషల కోసం రచయిత Google Translatorని ఉపయోగించారు. ఏదైనా సవరణ కోసం దయచేసి GitHubలో సహకరించండి మరియు వివరణల కోసం ఖచ్చితంగా ఇమామ్ వంటి తెలిసిన వ్యక్తితో తనిఖీ చేయండి.', proceedBtn: 'కొనసాగించు', warningTitle: 'గమనిక/హెచ్చరిక' },
        ta: { eventsTitle: 'இந்த மாத நிகழ்வுகள்', noEvents: 'இந்த மாதத்தில் சிறப்பு நிகழ்வுகள் ஏதுமில்லை', selectLang: 'மொழியைத் தேர்ந்தெடுக்கவும்', today: 'இன்று', install: 'இந்த செயலியை நிறுவவும்', footerNote: 'தேதிகள் அட்டவணை இஸ்லாமிய நாட்காட்டியை அடிப்படையாகக் கொண்டவை. சந்திரன் பார்வையின் அடிப்படையில் உண்மையான தேதிகள் 1-2 நாட்கள் மாறுபடலாம்.', prayerProhibited: 'தொழுகை தடைசெய்யப்பட்டுள்ளது', shuruq: 'ஷுரூக்', istiwa: 'இஸ்திவா', ghurub: 'குரூப்', hubWarning: 'இந்த பகுதி முழுமையாக சரிபார்க்கப்படவில்லை, விவரங்களுக்கு இமாமிடம் கேட்கவும். முழு பயன்பாட்டு மொழிபெயர்ப்பும் கூகுள் டிரான்ஸ்లేட்டரைப் பயன்படுத்தி செய்யப்பட்டுள்ளது. பயனர் தேர்ந்தெடுக்கப்பட்ட மொழியில் இமாம் போன்ற ஒருவரிடம் உள்ளடக்கங்களைச் சரிபார்க்க வேண்டும்.', langWarning: 'ஆசிரியர் பிராந்திய மொழிகளுக்கு கூகுள் டிரான்্সலேட்டரைப் பயன்படுத்தியுள்ளார். ஏதேனும் திருத்தம் இருந்தால் கிட்ஹப்பில் பங்களிக்கவும் மற்றும் தெளிவுபடுத்துவதற்கு இமாம் போன்ற ஒருவரிடம் சரிபார்க்கவும்.', proceedBtn: 'தொடரவும்', warningTitle: 'குறிப்பு/எச்சரிக்கை' },
        ml: { eventsTitle: 'ഈ മാസത്തെ പരിപാടികൾ', noEvents: 'ഈ മാസം പ്രത്യേക പരിപാടികളൊന്നുമില്ല', selectLang: 'ഭാഷ തിരഞ്ഞെടുക്കുക', today: 'ഇന്ന്', install: 'ഈ ആപ്പ് ഇൻസ്റ്റാൾ ചെയ്യുക', footerNote: 'തീയതികൾ കണക്കാക്കിയ ഇസ്ലാമിക് കലണ്ടറിനെ അടിസ്ഥാനമാക്കിയുള്ളതാണ്. ചന്ദ്രദർശനത്തെ അടിസ്ഥാനമാക്കി യഥാർത്ഥ തീയতিകൾ 1-2 ദിവസം വ്യത്യാസപ്പെടാം.', prayerProhibited: 'നിസ്കാരം നിരോധിച്ചിരിക്കുന്നു', shuruq: 'ശുറൂഖ്', istiwa: 'ഇസ്തിവാ', ghurub: 'ഗുറൂബ്', hubWarning: 'ഈ വിഭാഗം പൂർണ്ണമായും പരിശോധിച്ചിട്ടില്ല, വിശദാംശങ്ങൾക്കായി ഒരു ഇമാമിനോട് ചോദിക്കുക. ആപ്പ് വിവർത്തനം ഗൂഗിൾ ട്രানസ്ലേറ്റ് വഴിയാണ് ചെയ്തിരിക്കുന്നത്. ഉപയോക്താവ് തിരഞ്ഞെടുത്ത ഭാഷയിൽ ഇമാം പോലുള്ള ഒരു പണ്ഡിതനിൽ നിന്ന് ഉള്ളടക്കം പരിശോധിച്ചുറപ്പിക്കണം.', langWarning: 'പ്രാദേശിക ഭാഷകൾക്കായി രചയിതാവ് ഗൂഗിൾ ട്രানസ്ലേറ്റ് ഉപയോഗിച്ചു. തിരുത്തലുകൾക്കായി ദയവായി GitHub-ൽ പങ്കുചേരുക, വിശദീകരണങ്ങൾക്കായി ഇമാം പോലുള്ള ഒരാളുമായി ബന്ധപ്പെട്ടുക.', proceedBtn: 'തുടരുക', warningTitle: 'ശ്രദ്ധിക്കുക/മുന്നറിയിപ്പ്' }
    };

    function str(key) {
        return (UI_STRINGS[currentLang] || UI_STRINGS.en)[key] || UI_STRINGS.en[key] || '';
    }

    // ── DST-aware timezone offset ──
    // Maps city IDs to IANA timezone names for DST-affected regions
    const DST_TIMEZONES = {
        london: 'Europe/London', paris: 'Europe/Paris', berlin: 'Europe/Berlin',
        newyork: 'America/New_York', toronto: 'America/Toronto',
        chicago: 'America/Chicago', losangeles: 'America/Los_Angeles',
        sydney: 'Australia/Sydney', istanbul: 'Europe/Istanbul',
        jerusalem: 'Asia/Jerusalem', amman: 'Asia/Amman',
        beirut: 'Asia/Beirut', tehran: 'Asia/Tehran',
        casablanca: 'Africa/Casablanca'
    };

    function getDSTAwareTimezone(city, date) {
        const ianaZone = DST_TIMEZONES[city.id];
        if (!ianaZone) return city.tz; // No DST — use hardcoded offset

        try {
            // Use Intl to get the actual UTC offset for this date & timezone
            const formatter = new Intl.DateTimeFormat('en-US', {
                timeZone: ianaZone,
                timeZoneName: 'shortOffset'
            });
            const parts = formatter.formatToParts(date);
            const tzPart = parts.find(p => p.type === 'timeZoneName');
            if (tzPart) {
                // Parse "GMT+1", "GMT-5", "GMT+5:30" etc.
                const match = tzPart.value.match(/GMT([+-]?)(\d+)(?::(\d+))?/);
                if (match) {
                    const sign = match[1] === '-' ? -1 : 1;
                    const hours = parseInt(match[2]) || 0;
                    const minutes = parseInt(match[3]) || 0;
                    return sign * (hours + minutes / 60);
                }
            }
        } catch (e) {
            // Intl not supported or timezone not recognized — fallback
        }
        return city.tz;
    }

    // ── DOM refs ──
    const $ = id => document.getElementById(id);

    // ── Helper: Hijri Adjustment Lookup ──
    function getAdjustmentFor(year, month) {
        // key format: "Y-M"
        if (hijriAdjustments[`${year}-${month}`] !== undefined) {
            return hijriAdjustments[`${year}-${month}`];
        }
        // Find most recent preceding adjustment
        const keys = Object.keys(hijriAdjustments).filter(k => k !== 'default').sort((a, b) => {
            const [y1, m1] = a.split('-').map(Number);
            const [y2, m2] = b.split('-').map(Number);
            return (y1 * 12 + m1) - (y2 * 12 + m2);
        });

        const targetVal = year * 12 + month;
        let lastBest = hijriAdjustments.default;
        for (const k of keys) {
            const [y, m] = k.split('-').map(Number);
            if (y * 12 + m <= targetVal) {
                lastBest = hijriAdjustments[k];
            } else {
                break;
            }
        }
        return lastBest;
    }

    function syncHijriEngine(year, month) {
        currentHijriAdj = getAdjustmentFor(year, month);
        HijriEngine.setAdjustment(currentHijriAdj);
    }

    function getNextMonth(y, m) {
        let ny = y, nm = m + 1;
        if (nm > 12) { nm = 1; ny++; }
        return { year: ny, month: nm };
    }

    function showWarningModal(key, onProceed, lang = null) {
        const modal = $('warning-modal');
        if (!modal) {
            onProceed();
            return;
        }

        const lookup = (k) => {
            if (lang && UI_STRINGS[lang]) {
                return UI_STRINGS[lang][k] || UI_STRINGS.en[k] || '';
            }
            return str(k);
        };

        $('warning-title').textContent = lookup('warningTitle');
        $('warning-desc').textContent = lookup(key);
        $('warning-proceed-btn').textContent = lookup('proceedBtn');

        // Store the callback on the proceed button element
        const proceedBtn = $('warning-proceed-btn');
        const newProceedBtn = proceedBtn.cloneNode(true);
        proceedBtn.parentNode.replaceChild(newProceedBtn, proceedBtn);

        newProceedBtn.onclick = () => {
            modal.style.display = 'none';
            onProceed();
        };

        modal.style.display = 'flex';
    }

    // ── Init ──
    let initialized = false;
    function init() {
        if (initialized) return;
        initialized = true;

        console.log('App: Initializing...');
        try {
            // First sync for today
            const todayRaw = HijriEngine.getToday();
            syncHijriEngine(todayRaw.year, todayRaw.month);

            bindEvents();
            loadLocation();
            setLanguage(currentLang);
            // Start by going to today's date
            goToToday();
            initPWA();
            startPrayerCountdown();

            // ── Online / Offline indicator ──
            const offlineBanner = $('offline-banner');
            const offlineText = $('offline-text');
            const connectivityDot = $('connectivity-dot');
            let onlineToastTimer = null;

            let currentIsOnline = navigator.onLine;

            function applyOnlineState(isOnline, isInitial = false) {
                if (!isInitial && currentIsOnline === isOnline) return;
                currentIsOnline = isOnline;

                // Update connectivity dot
                if (connectivityDot) {
                    connectivityDot.classList.toggle('offline', !isOnline);
                    connectivityDot.title = isOnline ? 'Online' : 'Offline';
                }

                if (offlineBanner) {
                    if (!isOnline) {
                        // Offline: show amber banner briefly for 3 seconds, then hide
                        clearTimeout(onlineToastTimer);
                        offlineBanner.classList.remove('online-mode');
                        offlineBanner.querySelector('.offline-icon').textContent = '📡';
                        if (offlineText) offlineText.textContent = 'You are offline — using cached data';
                        offlineBanner.style.display = 'flex';
                        offlineBanner.style.animation = 'none';
                        void offlineBanner.offsetWidth;
                        offlineBanner.style.animation = 'slideDown 0.4s var(--ease)';
                        
                        onlineToastTimer = setTimeout(() => {
                            offlineBanner.style.display = 'none';
                        }, 3000);
                    } else if (!isInitial) {
                        // Came back online: show green toast briefly, then hide
                        offlineBanner.classList.add('online-mode');
                        offlineBanner.querySelector('.offline-icon').textContent = '✅';
                        if (offlineText) offlineText.textContent = 'Back online';
                        offlineBanner.style.display = 'flex';
                        offlineBanner.style.animation = 'none';
                        void offlineBanner.offsetWidth;
                        offlineBanner.style.animation = 'slideDown 0.4s var(--ease)';
                        clearTimeout(onlineToastTimer);
                        onlineToastTimer = setTimeout(() => {
                            offlineBanner.style.display = 'none';
                        }, 3000);
                    } else {
                        // Initial online state: no banner
                        offlineBanner.style.display = 'none';
                    }
                }
            }

            async function checkRealConnectivity() {
                if (!navigator.onLine) {
                    applyOnlineState(false);
                    return;
                }
                if (window.location.protocol === 'file:') {
                    applyOnlineState(true);
                    return;
                }
                try {
                    // Fetch manifest.json to ensure a valid endpoint. 
                    // Bypass SW using HEAD since SW only intercepts GET.
                    const url = new URL('manifest.json', window.location.href);
                    url.searchParams.set('ping', Date.now());
                    
                    await fetch(url.toString(), {
                        method: 'HEAD',
                        cache: 'no-store'
                    });
                    
                    // If fetch succeeds without throwing a network exception, we are online.
                    // Even a 404 or 405 HTTP status means we reached the remote server.
                    applyOnlineState(true);
                } catch (e) {
                    console.warn('Connectivity ping failed:', e);
                    applyOnlineState(false);
                }
            }

            window.addEventListener('online', checkRealConnectivity);
            window.addEventListener('offline', () => applyOnlineState(false));

            // Periodic real check
            setInterval(checkRealConnectivity, 15000);

            // Initial check
            applyOnlineState(navigator.onLine, true);
            checkRealConnectivity();

            console.log('App: Initialization complete.');

            // Hide Splash
            const splash = document.getElementById('splash-screen');
            if (splash) {
                setTimeout(() => {
                    splash.classList.add('hidden');
                    setTimeout(() => { splash.style.display = 'none'; }, 700);
                }, 800);
            }
        } catch (error) {
            console.error('App: Initialization failed:', error);
            // Attempt to recover basic UI even if some features fail
            try { render(); } catch (e) { }
        }
        updateNotifUI();
    }

    // ── Event bindings (called once) ──
    function bindEvents() {
        $('btn-prev-month').addEventListener('click', () => navigateMonth(-1));
        $('btn-next-month').addEventListener('click', () => navigateMonth(1));
        $('btn-today').addEventListener('click', () => {
            // Add feedback to button
            const btn = $('btn-today');
            btn.style.transform = 'scale(0.9)';
            setTimeout(() => btn.style.transform = '', 150);
            goToToday();
        });
        $('btn-lang').addEventListener('click', () => toggleModal('lang-modal', true));
        $('lang-modal-close').addEventListener('click', () => toggleModal('lang-modal', false));
        $('event-modal-close').addEventListener('click', () => toggleModal('event-modal', false));

        // Duas button removed



        // Language selection
        $('lang-grid').addEventListener('click', e => {
            const btn = e.target.closest('.lang-option');
            if (!btn) return;
            const lang = btn.dataset.lang;
            if (lang === currentLang) {
                toggleModal('lang-modal', false);
                return;
            }

            const proceed = () => {
                setLanguage(lang);
                render();
                toggleModal('lang-modal', false);
            };

            if (lang !== 'en' && lang !== 'bn') {
                showWarningModal('langWarning', proceed, lang);
            } else {
                proceed();
            }
        });

        // Calendar grid — event delegation (bound ONCE)
        $('calendar-grid').addEventListener('click', e => {
            const cell = e.target.closest('.day-cell:not(.empty)');
            if (!cell) return;
            const day = parseInt(cell.dataset.day);
            const month = parseInt(cell.dataset.month);
            const year = parseInt(cell.dataset.year);
            // Show prayer times + events for this date
            showDayPrayerTimes(year, month, day);
        });

        // Events list — event delegation (bound ONCE)
        $('events-list').addEventListener('click', e => {
            const card = e.target.closest('.event-card');
            if (!card) return;
            const eventId = card.dataset.eventId;
            const day = parseInt(card.dataset.day);
            showEventDetail(eventId, currentHijriYear, currentHijriMonth, day);
        });

        // Close modals on overlay click
        ['lang-modal', 'event-modal', 'date-prayer-modal', 'location-modal'].forEach(id => {
            $(id).addEventListener('click', e => {
                if (e.target === $(id)) toggleModal(id, false);
            });
        });

        // Date prayer modal close
        $('date-prayer-modal-close').addEventListener('click', () => toggleModal('date-prayer-modal', false));

        // Keyboard
        document.addEventListener('keydown', e => {
            if (e.key === 'ArrowLeft') navigateMonth(-1);
            if (e.key === 'ArrowRight') navigateMonth(1);
            if (e.key === 'Escape') {
                toggleModal('lang-modal', false);
                toggleModal('event-modal', false);
                toggleModal('date-prayer-modal', false);
                toggleModal('location-modal', false);
            }
        });

        // ── Hardware Back Button Support ──
        window.addEventListener('popstate', (e) => {
            // Close standard modals
            ['lang-modal', 'event-modal', 'date-prayer-modal', 'location-modal', 'settings-modal', 'zakat-modal', 'warning-modal'].forEach(id => {
                const el = $(id);
                if (el) el.style.display = 'none';
            });
            // Close full-screen views
            const qibla = $('qibla-view');
            if (qibla) qibla.style.display = 'none';
            const tasbih = $('tasbih-view');
            if (tasbih) tasbih.classList.remove('active');
            const hub = $('islamic-hub-view');
            if (hub) hub.classList.remove('active');
            
            document.body.style.overflow = '';
            if (typeof stopQibla === 'function' && qibla && qibla.style.display === 'none') {
                stopQibla();
            }
        });

        // ── Location bindings ──
        $('btn-change-location').addEventListener('click', () => {
            renderCityList();
            toggleModal('location-modal', true);
        });
        $('location-modal-close').addEventListener('click', () => toggleModal('location-modal', false));
        $('location-modal').addEventListener('click', e => {
            if (e.target === $('location-modal')) toggleModal('location-modal', false);
        });

        // GPS button
        $('btn-gps').addEventListener('click', detectGPS);

        // City search
        $('location-search').addEventListener('input', e => {
            renderCityList(e.target.value);
        });

        // City list clicks
        $('city-list').addEventListener('click', e => {
            const item = e.target.closest('.city-item');
            if (!item) return;
            const cityId = item.dataset.cityId;
            selectCity(cityId);
            toggleModal('location-modal', false);
        });

        // Method/school selectors
        $('calc-method').addEventListener('change', e => {
            calcMethod = e.target.value;
            localStorage.setItem('ic-method', calcMethod);
            renderPrayerTimes();
            startPrayerCountdown(); // Force immediate timer update
        });
        $('asr-school').addEventListener('change', e => {
            asrSchool = e.target.value;
            localStorage.setItem('ic-asr', asrSchool);
            renderPrayerTimes();
            startPrayerCountdown(); // Force immediate timer update
        });

        // Time adjustment controls
        $('time-adjust-sign').addEventListener('change', e => {
            timeAdjustSign = e.target.value;
            localStorage.setItem('ic-time-adj-sign', timeAdjustSign);
            renderPrayerTimes();
            startPrayerCountdown();
        });
        $('time-adjust-min').addEventListener('input', e => {
            timeAdjustMin = Math.max(0, Math.min(59, parseInt(e.target.value) || 0));
            localStorage.setItem('ic-time-adj-min', timeAdjustMin);
            renderPrayerTimes();
            startPrayerCountdown();
        });
        $('time-adjust-sec').addEventListener('input', e => {
            timeAdjustSec = Math.max(0, Math.min(59, parseInt(e.target.value) || 0));
            localStorage.setItem('ic-time-adj-sec', timeAdjustSec);
            renderPrayerTimes();
            startPrayerCountdown();
        });

        // Qibla
        $('btn-qibla').addEventListener('click', () => {
            initQibla();
            history.pushState({ modal: 'qibla-view' }, '');
            $('qibla-view').style.display = 'flex';
            document.body.style.overflow = 'hidden';
        });
        $('qibla-back-btn').addEventListener('click', () => {
            stopQibla();
            $('qibla-view').style.display = 'none';
            document.body.style.overflow = '';
            if (history.state && history.state.modal === 'qibla-view') history.back();
        });

        // Zakat
        $('btn-zakat').addEventListener('click', () => toggleModal('zakat-modal', true));
        $('zakat-modal-close').addEventListener('click', () => toggleModal('zakat-modal', false));

        // Zakat Inputs
        ['zakat-cash', 'zakat-gold', 'zakat-other', 'zakat-debts'].forEach(id => {
            $(id).addEventListener('input', calculateZakat);
        });

        // Notifications
        $('btn-notifications').addEventListener('click', toggleNotifications);

        // Tasbih counter
        $('btn-tasbih').addEventListener('click', () => {
            history.pushState({ modal: 'tasbih-view' }, '');
            $('tasbih-view').classList.add('active');
            document.body.style.overflow = 'hidden';
        });
        $('tasbih-back-btn').addEventListener('click', () => {
            $('tasbih-view').classList.remove('active');
            document.body.style.overflow = '';
            if (history.state && history.state.modal === 'tasbih-view') history.back();
        });

        // Restore tasbih state from localStorage
        let tasbihCount = parseInt(localStorage.getItem('ic-tasbih-count')) || 0;
        let tasbihTarget = parseInt(localStorage.getItem('ic-tasbih-target')) || 0; // 0 = unlimited
        let tasbihVibrate = localStorage.getItem('ic-tasbih-vibrate') !== 'false';

        function saveTasbihState() {
            localStorage.setItem('ic-tasbih-count', tasbihCount);
            localStorage.setItem('ic-tasbih-target', tasbihTarget);
            localStorage.setItem('ic-tasbih-vibrate', tasbihVibrate);
        }

        function updateTasbihUI() {
            $('tasbih-count').textContent = tasbihCount;
            if (tasbihTarget === 0) {
                $('tasbih-target-label').textContent = '\u221e Unlimited';
                $('tasbih-progress').style.width = '0%';
            } else {
                $('tasbih-target-label').textContent = `Target: ${tasbihTarget}`;
                const pct = Math.min((tasbihCount / tasbihTarget) * 100, 100);
                $('tasbih-progress').style.width = `${pct}%`;
            }
            const vibBtn = $('tasbih-vibrate-btn');
            if (vibBtn) {
                vibBtn.classList.toggle('active', tasbihVibrate);
                vibBtn.style.opacity = tasbihVibrate ? '1' : '0.5';
                vibBtn.textContent = tasbihVibrate ? '📳' : '📴';
            }
        }

        // Restore the target dropdown to match saved state
        $('tasbih-target-select').value = tasbihTarget;
        updateTasbihUI();

        const vibBtn = $('tasbih-vibrate-btn');
        if (vibBtn) {
            vibBtn.addEventListener('click', () => {
                tasbihVibrate = !tasbihVibrate;
                saveTasbihState();
                updateTasbihUI();
                if (tasbihVibrate && navigator.vibrate) navigator.vibrate(15);
            });
        }

        $('tasbih-tap-btn').addEventListener('click', () => {
            tasbihCount++;
            saveTasbihState();
            updateTasbihUI();
            // Pulse animation
            const el = $('tasbih-count');
            el.classList.add('pulse');
            setTimeout(() => el.classList.remove('pulse'), 100);
            // Haptic feedback
            if (tasbihVibrate && navigator.vibrate) navigator.vibrate(15);
            // Notify when target reached (only if a target is set)
            if (tasbihTarget > 0 && tasbihCount === tasbihTarget) {
                if (tasbihVibrate && navigator.vibrate) navigator.vibrate([50, 30, 50]);
            }
        });

        $('tasbih-target-select').addEventListener('change', e => {
            tasbihTarget = parseInt(e.target.value);
            saveTasbihState();
            updateTasbihUI();
        });

        $('tasbih-reset-btn').addEventListener('click', () => {
            tasbihCount = 0;
            saveTasbihState();
            updateTasbihUI();
        });

        // Day-cell ripple micro-animation
        document.addEventListener('click', e => {
            const cell = e.target.closest('.day-cell:not(.empty)');
            if (!cell) return;
            const rect = cell.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width * 100).toFixed(0) + '%';
            const y = ((e.clientY - rect.top) / rect.height * 100).toFixed(0) + '%';
            cell.style.setProperty('--ripple-x', x);
            cell.style.setProperty('--ripple-y', y);
            cell.classList.remove('ripple');
            // Force reflow
            void cell.offsetWidth;
            cell.classList.add('ripple');
            setTimeout(() => cell.classList.remove('ripple'), 500);
        });

        // Touch swipe (calendar grid + month heading area)
        let touchStartX = 0;
        const swipeHandler = {
            start: e => { touchStartX = e.changedTouches[0].screenX; },
            end: e => {
                const delta = e.changedTouches[0].screenX - touchStartX;
                if (Math.abs(delta) > 60) {
                    navigateMonth(delta > 0 ? -1 : 1);
                }
            }
        };
        [$('calendar-grid'), $('month-nav')].forEach(el => {
            el.addEventListener('touchstart', swipeHandler.start, { passive: true });
            el.addEventListener('touchend', swipeHandler.end, { passive: true });
        });

        // ── Hijri Adjustment Stepper ──
        function syncHijriAdjUI() {
            const settingsVal = $('settings-adj-value');

            // Show duration delta: -(Adj(M+1) - Adj(M))
            const next = getNextMonth(currentHijriYear, currentHijriMonth);
            const adjM = getAdjustmentFor(currentHijriYear, currentHijriMonth);
            const adjNext = getAdjustmentFor(next.year, next.month);
            const durDelta = -(adjNext - adjM);

            const sign = durDelta > 0 ? '+' : (durDelta < 0 ? '' : '');
            const text = `Len: ${sign}${durDelta}`;

            if (settingsVal) settingsVal.textContent = text;
        }

        function changeHijriAdj(delta) {
            // "End of month" logic: clicking +/- affects the NEXT month's start
            const next = getNextMonth(currentHijriYear, currentHijriMonth);
            const currentNextAdj = getAdjustmentFor(next.year, next.month);

            // User clicks [-] (Shorter) -> delta is -1. 
            // We want durDelta to decrease. durDelta = -(adjNext - adjM).
            // So adjNext should INCREASE.
            // clicks [+] (Longer) -> delta is +1. durDelta increases.
            // So adjNext should DECREASE.

            let newNextAdj = currentNextAdj - delta;

            // Hard limit: absolute adjustment must be within [-2, 2]
            newNextAdj = Math.max(-2, Math.min(2, newNextAdj));

            hijriAdjustments[`${next.year}-${next.month}`] = newNextAdj;
            localStorage.setItem('ic-hijri-adj-map', JSON.stringify(hijriAdjustments));

            syncHijriEngine(currentHijriYear, currentHijriMonth); // Keep current month view's start point
            syncHijriAdjUI();
            render();
        }

        $('settings-adj-minus').addEventListener('click', () => changeHijriAdj(-1));
        $('settings-adj-plus').addEventListener('click', () => changeHijriAdj(1));
        syncHijriAdjUI();

        // ── Month/Year Jump Settings ──
        $('btn-settings-jump').addEventListener('click', () => {
            currentHijriMonth = parseInt($('settings-month-select').value);
            currentHijriYear = parseInt($('settings-year-select').value);
            render();
            toggleModal('settings-modal', false);
        });

        // ── Settings Modal ──
        $('btn-settings').addEventListener('click', () => toggleModal('settings-modal', true));
        $('settings-modal-close').addEventListener('click', () => toggleModal('settings-modal', false));
        $('settings-modal').addEventListener('click', e => {
            if (e.target === $('settings-modal')) toggleModal('settings-modal', false);
        });

        // ── Theme Picker ──
        const savedTheme = localStorage.getItem('ic-theme') || 'default';
        setTheme(savedTheme);

        $('theme-picker').addEventListener('click', e => {
            const swatch = e.target.closest('.theme-swatch');
            if (!swatch) return;
            const theme = swatch.dataset.theme;
            setTheme(theme);
        });

        // ── Islamic Tutorials & Duas Hub ──
        $('btn-names').addEventListener('click', () => {
            showWarningModal('hubWarning', () => {
                history.pushState({ modal: 'islamic-hub-view' }, '');
                $('islamic-hub-view').classList.add('active');
                document.body.style.overflow = 'hidden';
                renderNames();
                renderDuasList();
                renderTutorials();
                renderSurahs();
            });
        });
        $('islamic-hub-back-btn').addEventListener('click', () => {
            $('islamic-hub-view').classList.remove('active');
            document.body.style.overflow = '';
            if (history.state && history.state.modal === 'islamic-hub-view') history.back();
        });

        // Tab switching
        document.querySelector('.hub-tabs').addEventListener('click', e => {
            const tab = e.target.closest('.hub-tab');
            if (!tab) return;
            const targetId = tab.dataset.tab;
            // Update tab buttons
            document.querySelectorAll('.hub-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            // Update tab content
            document.querySelectorAll('.hub-tab-content').forEach(c => c.classList.remove('active'));
            $(targetId).classList.add('active');
        });

        // ── Share Daily Dua/Hadith ──
        $('btn-share-dua').addEventListener('click', (e) => {
            const content = IslamicContent.getDailyContent();
            const typeLabel = content.type === 'dua' ? 'Dua' : 'Hadith';
            const translation = (content.translations && content.translations[currentLang]) || (content.translations && content.translations.en) || content.en || '';
            const data = {
                isDua: true,
                icon: content.type === 'dua' ? '🤲' : '📜',
                name: `${typeLabel} of the Day`,
                dua: content.ar,
                pronunciation: content.tr,
                translation: `"${translation}"`,
                ref: `— ${content.ref}`,
                color: '#2ecc71'
            };
            shareCardObj(e.currentTarget, data);
        });

        // ── Share Event Cards ──
        document.addEventListener('click', e => {
            const shareBtn = e.target.closest('.event-share-btn');
            if (!shareBtn) return;
            const data = {
                isDua: false,
                id: shareBtn.getAttribute('data-id'),
                name: shareBtn.getAttribute('data-name'),
                date: shareBtn.getAttribute('data-date'),
                desc: shareBtn.getAttribute('data-desc'),
                icon: shareBtn.getAttribute('data-icon'),
                color: shareBtn.getAttribute('data-color')
            };
            shareCardObj(shareBtn, data);
        });
    }

    // ── Navigation ──
    function navigateMonth(delta) {
        const grid = $('calendar-grid');
        // Slide out animation based on direction
        const slideOut = delta > 0 ? 'slide-left' : 'slide-right';
        const slideIn = delta > 0 ? 'slide-in-left' : 'slide-in-right';

        grid.classList.add(slideOut);

        setTimeout(() => {
            try {
                currentHijriMonth += delta;
                if (currentHijriMonth > 12) {
                    currentHijriMonth = 1;
                    currentHijriYear++;
                } else if (currentHijriMonth < 1) {
                    currentHijriMonth = 12;
                    currentHijriYear--;
                }
                render();
            } catch (err) {
                console.error('Render error:', err);
            } finally {
                grid.classList.remove(slideOut);
                grid.classList.add(slideIn);
                setTimeout(() => grid.classList.remove(slideIn), 250);
            }
        }, 220);
    }

    function goToToday() {
        try {
            const today = HijriEngine.getToday();
            // If already on current month, just scroll
            if (currentHijriYear !== today.year || currentHijriMonth !== today.month) {
                currentHijriYear = today.year;
                currentHijriMonth = today.month;
                render();
            } else {
                // Determine if we need to re-render to clear any state, 
                // but usually regular scroll is enough. 
                // Let's force render to be safe and ensure 'today' class is correct.
                render();
            }

            // Multiple attempts to scroll to ensure it catches after layout
            setTimeout(() => scrollToToday(true), 10);
            setTimeout(() => scrollToToday(true), 100);
            setTimeout(() => scrollToToday(true), 300);
        } catch (err) {
            console.error('GoToToday error:', err);
        }
    }

    // ── Language ──
    function setLanguage(lang) {
        currentLang = lang;
        localStorage.setItem('ic-lang', lang);

        document.documentElement.lang = lang;
        document.documentElement.dir = RTL_LANGS.includes(lang) ? 'rtl' : 'ltr';

        document.querySelectorAll('.lang-option').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.lang === lang);
        });

        $('lang-modal-title').textContent = str('selectLang');
        $('events-title').textContent = str('eventsTitle');
        $('footer-note').textContent = str('footerNote');
        $('install-text').textContent = str('install');
    }

    // ── Main render ──
    function render() {
        // Ensure engine is synced for the month we are about to render
        syncHijriEngine(currentHijriYear, currentHijriMonth);

        renderTodayBanner();
        renderMonthTitle();
        renderWeekdays();
        renderCalendarGrid();
        renderPrayerTimes();
        renderRamadan();
        renderDua();
        renderEventsList();
        renderLegend();
        renderFooterYear();
        syncSettingsSelectors();
    }

    function syncSettingsSelectors() {
        const monthSel = $('settings-month-select');
        const yearSel = $('settings-year-select');
        if (!monthSel || !yearSel) return;

        // Re-populate months to ensure correct language
        let html = '';
        for (let i = 1; i <= 12; i++) {
            html += `<option value="${i}">${HijriEngine.getMonthName(i, currentLang)}</option>`;
        }
        monthSel.innerHTML = html;
        monthSel.value = currentHijriMonth;

        // Populate years around current
        const startYear = currentHijriYear - 5;
        const endYear = currentHijriYear + 10;
        let yHtml = '';
        for (let y = startYear; y <= endYear; y++) {
            yHtml += `<option value="${y}">${y}</option>`;
        }
        yearSel.innerHTML = yHtml;
        yearSel.value = currentHijriYear;
    }

    // ── Zakat Calculator ──
    function calculateZakat() {
        const cash = parseFloat($('zakat-cash').value) || 0;
        const gold = parseFloat($('zakat-gold').value) || 0;
        const other = parseFloat($('zakat-other').value) || 0;
        const debts = parseFloat($('zakat-debts').value) || 0;

        const netWealth = (cash + gold + other) - debts;
        const zakatDue = Math.max(0, netWealth * 0.025);

        $('zakat-result').textContent = zakatDue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    }


    // ── Qibla Compass ──
    function positionQiblaMarker() {
        // Position 🕋 at the bearing angle on the compass (N=top, clockwise)
        const marker = $('qibla-marker');
        if (!marker) return;
        const radius = 108; // ~distance from center to near edge of ring
        const rad = qiblaBearing * Math.PI / 180;
        const x = Math.sin(rad) * radius; // positive = right
        const y = -Math.cos(rad) * radius; // negative = up
        // compass-container is 280x280, center is 140,140
        marker.style.left = `${140 + x - 16}px`;  // 16 = half of 32px marker
        marker.style.top = `${140 + y - 16}px`;
    }

    async function initQibla() {
        compassActive = true;
        isCalibrating = false;
        let calibratedBearingOffset = 0;

        const badge = $('qibla-accuracy-badge');
        $('compass-needle').style.opacity = '0';
        $('qibla-marker').style.opacity = '0';
        $('qibla-bearing').style.opacity = '0';

        // Start with city-based bearing immediately (before GPS resolves)
        if (currentCity) {
            qiblaBearing = calculateQiblaBearing(currentCity.lat, currentCity.lng);
            positionQiblaMarker();
            $('compass-needle').style.opacity = '1';
            $('qibla-marker').style.opacity = '1';
            $('qibla-bearing').style.opacity = '1';
            $('qibla-bearing').textContent = `Bearing: ${Math.round(qiblaBearing)}°`;
            badge.textContent = 'City-based (Approximate)';
            badge.className = 'qibla-accuracy-badge';
            $('qibla-status').textContent = 'Turn until the red needle points at 🕋';
        } else {
            badge.textContent = 'Waiting for GPS...';
            badge.className = 'qibla-accuracy-badge';
            $('qibla-status').textContent = 'Searching for satellites...';
        }

        // Bind refresh and grant buttons
        const refreshBtn = $('qibla-refresh-gps');
        if (refreshBtn) {
            refreshBtn.onclick = () => {
                refreshBtn.style.animation = 'spin 1s linear infinite';
                requestQiblaGPS();
            };
        }

        const grantBtn = $('qibla-grant-gps');
        if (grantBtn) {
            grantBtn.onclick = requestQiblaGPS;
        }

        // Bind calibration button
        const calibrateBtn = $('btn-calibrate');
        if (calibrateBtn) {
            calibrateBtn.onclick = startCalibration;
        }

        // Try GPS for higher accuracy
        requestQiblaGPS();

        // Request Orientation Permission
        if (typeof DeviceOrientationEvent.requestPermission === 'function') {
            try {
                const permissionState = await DeviceOrientationEvent.requestPermission();
                if (permissionState === 'granted') {
                    window.addEventListener('deviceorientation', handleOrientation);
                } else {
                    $('qibla-status').textContent = 'Sensor permission denied';
                }
            } catch (e) {
                console.error(e);
            }
        } else {
            window.addEventListener('deviceorientationabsolute', handleOrientation, true);
            window.addEventListener('deviceorientation', handleOrientation, true);
        }
    }

    function requestQiblaGPS() {
        if (!navigator.geolocation) {
            // No GPS — use city fallback
            useCityFallback('GPS not available on this device');
            return;
        }

        const overlay = $('qibla-gps-overlay');
        const badge = $('qibla-accuracy-badge');
        const errEl = $('qibla-gps-error');

        badge.textContent = 'Updating Location...';
        badge.className = 'qibla-accuracy-badge';
        errEl.style.display = 'none';

        if (qiblaGpsWatcher) navigator.geolocation.clearWatch(qiblaGpsWatcher);

        qiblaGpsWatcher = navigator.geolocation.watchPosition(
            pos => {
                const lat = pos.coords.latitude;
                const lng = pos.coords.longitude;
                const accuracy = pos.coords.accuracy;

                qiblaBearing = calculateQiblaBearing(lat, lng);
                positionQiblaMarker();

                overlay.style.display = 'none';
                $('compass-needle').style.opacity = '1';
                $('qibla-marker').style.opacity = '1';
                $('qibla-bearing').style.opacity = '1';

                badge.textContent = accuracy < 100 ? 'High Accuracy (GPS)' : 'Good Accuracy (GPS)';
                badge.className = 'qibla-accuracy-badge high';
                $('qibla-bearing').textContent = `Bearing: ${Math.round(qiblaBearing)}°`;
                $('qibla-status').textContent = 'Turn until the red needle points at 🕋';

                const refreshBtn = $('qibla-refresh-gps');
                if (refreshBtn) refreshBtn.style.animation = '';
            },
            err => {
                console.warn('GPS Error:', err);

                // Fall back to selected city
                if (currentCity) {
                    const msg = err.code === 1
                        ? 'Location denied — using city location'
                        : 'GPS unavailable — using city location';
                    useCityFallback(msg);
                } else {
                    overlay.style.display = 'flex';
                    badge.textContent = 'GPS Required';
                    badge.className = 'qibla-accuracy-badge low';

                    if (err.code === 1) {
                        errEl.textContent = 'Location access was denied. Please select a city or enable GPS.';
                    } else {
                        errEl.textContent = 'Could not get GPS fix. Please select a city or try again.';
                    }
                    errEl.style.display = 'block';
                }

                const refreshBtn = $('qibla-refresh-gps');
                if (refreshBtn) refreshBtn.style.animation = '';
            },
            { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
        );
    }

    function useCityFallback(reason) {
        if (!currentCity) return;

        qiblaBearing = calculateQiblaBearing(currentCity.lat, currentCity.lng);
        positionQiblaMarker();

        const overlay = $('qibla-gps-overlay');
        const badge = $('qibla-accuracy-badge');
        const errEl = $('qibla-gps-error');

        overlay.style.display = 'none';
        $('compass-needle').style.opacity = '1';
        $('qibla-marker').style.opacity = '1';
        $('qibla-bearing').style.opacity = '1';

        badge.textContent = `City-based: ${currentCity.name}`;
        badge.className = 'qibla-accuracy-badge';
        $('qibla-bearing').textContent = `Bearing: ${Math.round(qiblaBearing)}°`;
        $('qibla-status').textContent = 'Turn until the red needle points at 🕋';

        errEl.textContent = reason;
        errEl.style.display = 'block';
    }

    function startCalibration() {
        if (isCalibrating) return;

        isCalibrating = true;
        calibrationSamples = [];

        const btn = $('btn-calibrate');
        const progress = $('qibla-calibration-progress');
        const statusEl = $('qibla-status');

        btn.style.display = 'none';
        progress.style.display = 'flex';
        statusEl.textContent = 'Hold device steady...';

        // Collect samples for 2 seconds
        setTimeout(() => {
            finishCalibration();
        }, 2000);
    }

    function finishCalibration() {
        isCalibrating = false;

        const btn = $('btn-calibrate');
        const progress = $('qibla-calibration-progress');
        const statusEl = $('qibla-status');

        btn.style.display = 'flex';
        btn.innerHTML = '<span class="icon">✅</span> Recalibrate';
        progress.style.display = 'none';

        if (calibrationSamples.length > 0) {
            // We use the last smoothed heading as a baseline for stability
            // This is essentially "locking" the current sensor jitter out
            statusEl.textContent = 'Compass Stabilized';
            setTimeout(() => {
                if (compassActive) statusEl.textContent = 'Align your device';
            }, 1000);
        }
    }

    function updateQiblaBearingDisplay() {
        // City fallback is handled in initQibla and useCityFallback
    }

    function stopQibla() {
        compassActive = false;
        lastHeading = null;

        if (qiblaGpsWatcher) {
            navigator.geolocation.clearWatch(qiblaGpsWatcher);
            qiblaGpsWatcher = null;
        }

        window.removeEventListener('deviceorientation', handleOrientation);
        window.removeEventListener('deviceorientationabsolute', handleOrientation);
        $('compass-needle').style.transform = 'translate(-50%, -50%)';
        $('qibla-status').textContent = 'Turn until the red needle points at 🕋';
        const container = $('compass-needle').closest('.compass-container');
        if (container) container.classList.remove('aligned');

        const refreshBtn = $('qibla-refresh-gps');
        if (refreshBtn) refreshBtn.style.animation = '';
    }

    function handleOrientation(e) {
        if (!compassActive) return;

        let heading = null;

        if (e.webkitCompassHeading !== undefined) {
            heading = e.webkitCompassHeading; // iOS
        } else if (e.alpha !== null) {
            if (e.absolute || e.webkitCompassHeading === undefined) {
                heading = 360 - e.alpha; // Android
            }
        }

        if (heading === null) return;

        // Smoothing
        if (lastHeading === null) {
            lastHeading = heading;
        } else {
            let diff = heading - lastHeading;
            if (diff > 180) diff -= 360;
            if (diff < -180) diff += 360;
            lastHeading = (lastHeading + diff * SMOOTHING_FACTOR + 360) % 360;
        }

        const currentHeading = lastHeading;

        // Rotate needle to show where the device is pointing on the compass
        // heading = compass direction the device top faces
        // On the fixed dial: 0° = North (up), 90° = East (right), etc.
        $('compass-needle').style.transform = `translate(-50%, -50%) rotate(${currentHeading}deg)`;

        // Alignment check: device faces Qibla when heading ≈ qiblaBearing
        let diff = (currentHeading - qiblaBearing + 360) % 360;
        if (diff > 180) diff -= 360;
        const absDiff = Math.round(Math.abs(diff));

        const guidEl = $('qibla-guide');
        const statusEl = $('qibla-status');
        const container = $('compass-needle').closest('.compass-container');

        if (absDiff < 5) {
            statusEl.textContent = '🎯 ALIGNED WITH QIBLA';
            guidEl.textContent = '🕋';
            guidEl.style.animation = 'pulse-primary 1s infinite ease-in-out';
            if (container) container.classList.add('aligned');
        } else {
            guidEl.style.animation = '';
            if (container) container.classList.remove('aligned');

            if (diff > 0) {
                statusEl.textContent = `Turn ${absDiff}° LEFT`;
                guidEl.textContent = '⬅️';
            } else {
                statusEl.textContent = `Turn ${absDiff}° RIGHT`;
                guidEl.textContent = '➡️';
            }
        }
    }

    function calculateQiblaBearing(lat, lng) {
        const phi1 = lat * Math.PI / 180;
        const lambda1 = lng * Math.PI / 180;
        const phi2 = 21.4225 * Math.PI / 180; // Mecca Lat
        const lambda2 = 39.8262 * Math.PI / 180; // Mecca Lng

        const y = Math.sin(lambda2 - lambda1);
        const x = Math.cos(phi1) * Math.tan(phi2) - Math.sin(phi1) * Math.cos(lambda2 - lambda1);
        let bearing = Math.atan2(y, x) * 180 / Math.PI;
        return (bearing + 360) % 360;
    }

    // ── Notifications ──
    async function toggleNotifications() {
        if (!notificationsEnabled) {
            if (Notification.permission === 'default') {
                const permission = await Notification.requestPermission();
                if (permission !== 'granted') return;
            } else if (Notification.permission === 'denied') {
                alert('Notification permission is blocked. Please enable it in browser settings.');
                return;
            }
            notificationsEnabled = true;
        } else {
            notificationsEnabled = false;
        }

        localStorage.setItem('ic-notif', notificationsEnabled);
        updateNotifUI();
    }

    function updateNotifUI() {
        const btn = $('btn-notifications');
        btn.classList.toggle('enabled', notificationsEnabled);
        btn.title = notificationsEnabled ? 'Disable Notifications' : 'Enable Notifications';
    }

    function checkNotifications(times, currentHrs) {
        if (!notificationsEnabled) return;

        const prayers = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'];
        for (const prayer of prayers) {
            const prayerTime = times[prayer].decimal;
            const diff = (currentHrs - prayerTime) * 60; // diff in minutes

            // Notify if within 1 minute of prayer time AND not already notified for this prayer today
            if (diff >= 0 && diff < 1 && !notifiedPrayersToday.has(prayer)) {
                notifiedPrayersToday.add(prayer);

                const names = PrayerTimes.PRAYER_NAMES[currentLang] || PrayerTimes.PRAYER_NAMES.en;
                const prayerName = names[prayer];

                // Use translated notification text
                const notifText = (str('notifPrayerTime') || 'It is time for {prayer} prayer.').replace('{prayer}', prayerName);

                new Notification('Prayer Time', {
                    body: notifText,
                    icon: 'icons/icon-192.png'
                });

                // Play Adhan tone
                playAdhan();
            }
        }

        // Reset all notified prayers at midnight
        if (currentHrs < 0.01) {
            notifiedPrayersToday.clear();
        }
    }

    function playAdhan() {
        // Generate a pleasant notification tone using Web Audio API (works offline)
        try {
            const ctx = new (window.AudioContext || window.webkitAudioContext)();
            const now = ctx.currentTime;

            // Play a two-note chime
            const frequencies = [523.25, 659.25, 783.99]; // C5, E5, G5
            frequencies.forEach((freq, i) => {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.type = 'sine';
                osc.frequency.value = freq;
                gain.gain.setValueAtTime(0.3, now + i * 0.3);
                gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.3 + 0.8);
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.start(now + i * 0.3);
                osc.stop(now + i * 0.3 + 0.8);
            });

            // Close context after chime finishes
            setTimeout(() => ctx.close(), 3000);
        } catch (e) {
            console.warn('Audio playback not supported:', e);
        }
    }

    function scrollToToday(animate = false) {
        // Find today's cell
        const todayCell = document.querySelector('.day-cell.today');

        if (todayCell) {
            // Scroll into view - center it
            todayCell.scrollIntoView({ behavior: 'smooth', block: 'center', inline: 'center' });

            if (animate) {
                // Visual feedback
                todayCell.classList.remove('highlight-effect');
                void todayCell.offsetWidth; // Trigger reflow
                todayCell.classList.add('highlight-effect');
            }
        }
    }

    function renderTodayBanner() {
        const today = HijriEngine.getToday();
        const greg = HijriEngine.hijriToGregorian(today.year, today.month, today.day);

        const hijriStr = `${today.day} ${HijriEngine.getMonthName(today.month, currentLang)} ${today.year} AH`;
        const gregStr = `${greg.day} ${HijriEngine.getGregMonthName(greg.month, currentLang)} ${greg.year}`;

        const hEl = $('today-hijri-date');
        const gEl = $('today-greg-date');
        const eEl = $('today-event');

        if (hEl) hEl.textContent = hijriStr;
        if (gEl) gEl.textContent = gregStr;

        // Show today's events
        const todayEvents = IslamicEvents.getEventsForDate(today.month, today.day);
        if (eEl) {
            if (todayEvents.length > 0) {
                eEl.textContent = todayEvents.map(e => (e.name[currentLang] || e.name.en)).join(' · ');
            } else {
                eEl.textContent = '';
            }
        }
    }

    function renderMonthTitle() {
        const hijriName = HijriEngine.getMonthName(currentHijriMonth, currentLang);
        $('month-title-hijri').textContent = `${hijriName} ${currentHijriYear} AH`;

        // Compute the Gregorian range for this Hijri month
        const firstGreg = HijriEngine.hijriToGregorian(currentHijriYear, currentHijriMonth, 1);
        const displayedLen = getDisplayedMonthLen(currentHijriYear, currentHijriMonth);
        const lastGreg = HijriEngine.hijriToGregorian(currentHijriYear, currentHijriMonth, displayedLen);

        let gregRange;
        if (firstGreg.month === lastGreg.month && firstGreg.year === lastGreg.year) {
            gregRange = `${firstGreg.day} – ${lastGreg.day} ${HijriEngine.getGregMonthName(firstGreg.month, currentLang)} ${firstGreg.year}`;
        } else if (firstGreg.year === lastGreg.year) {
            gregRange = `${firstGreg.day} ${HijriEngine.getGregMonthName(firstGreg.month, currentLang)} – ${lastGreg.day} ${HijriEngine.getGregMonthName(lastGreg.month, currentLang)} ${firstGreg.year}`;
        } else {
            gregRange = `${firstGreg.day} ${HijriEngine.getGregMonthName(firstGreg.month, currentLang)} ${firstGreg.year} – ${lastGreg.day} ${HijriEngine.getGregMonthName(lastGreg.month, currentLang)} ${lastGreg.year}`;
        }
        $('month-title-greg').textContent = gregRange;
    }

    function getDisplayedMonthLen(y, m) {
        const tabularLen = HijriEngine.hijriMonthLength(y, m);
        const next = getNextMonth(y, m);
        const adjM = getAdjustmentFor(y, m);
        const adjNext = getAdjustmentFor(next.year, next.month);
        return tabularLen - (adjNext - adjM);
    }

    function renderWeekdays() {
        const dayNames = HijriEngine.getDayNames(currentLang);
        const container = $('calendar-weekdays');
        container.innerHTML = dayNames.map((name, i) =>
            `<div class="weekday${i === 5 ? ' friday' : ''}">${name}</div>`
        ).join('');
    }

    function renderCalendarGrid() {
        const today = HijriEngine.getToday();
        const firstDayOfWeek = HijriEngine.getDayOfWeek(currentHijriYear, currentHijriMonth, 1);

        let cells = '';

        // Empty cells for padding
        for (let i = 0; i < firstDayOfWeek; i++) {
            cells += '<div class="day-cell empty"></div>';
        }

        // Day cells
        const displayedLen = getDisplayedMonthLen(currentHijriYear, currentHijriMonth);
        for (let day = 1; day <= displayedLen; day++) {
            const greg = HijriEngine.hijriToGregorian(currentHijriYear, currentHijriMonth, day);
            const isToday = (day === today.day && currentHijriMonth === today.month && currentHijriYear === today.year);
            const dayOfWeek = (firstDayOfWeek + day - 1) % 7;
            const isFriday = dayOfWeek === 5;
            const events = IslamicEvents.getEventsForDate(currentHijriMonth, day);
            const hasEvents = events.length > 0;

            let classes = 'day-cell';
            if (isToday) classes += ' today';
            if (isFriday) classes += ' friday';
            if (hasEvents) classes += ' has-event';

            // Event dots
            let dotsHtml = '';
            if (hasEvents) {
                const uniqueCategories = [...new Set(events.map(e => e.category))];
                const dots = uniqueCategories.slice(0, 3).map(cat => {
                    const info = IslamicEvents.getCategoryInfo(cat);
                    return `<span class="event-dot" style="background:${info.color}"></span>`;
                }).join('');
                dotsHtml = `<div class="day-dots">${dots}</div>`;
            }

            cells += `
                <div class="${classes}" data-day="${day}" data-month="${currentHijriMonth}" data-year="${currentHijriYear}">
                    <span class="day-hijri">${day}</span>
                    <span class="day-greg">${greg.day} ${HijriEngine.getGregMonthName(greg.month, currentLang).substring(0, 3)}</span>
                    ${dotsHtml}
                </div>`;
        }

        const grid = $('calendar-grid');
        grid.innerHTML = cells;
    }

    function renderEventsList() {
        const events = IslamicEvents.getEventsForMonth(currentHijriMonth);
        const container = $('events-list');
        $('events-title').textContent = str('eventsTitle');

        if (events.length === 0) {
            container.innerHTML = `<div class="no-events">${str('noEvents')}</div>`;
            return;
        }

        // Sort by day
        const sorted = [...events].sort((a, b) => a.day - b.day);

        container.innerHTML = sorted.map(event => {
            const cat = IslamicEvents.getCategoryInfo(event.category);
            const name = event.name[currentLang] || event.name.en;
            const greg = HijriEngine.hijriToGregorian(currentHijriYear, currentHijriMonth, event.day);
            const dateStr = `${event.day} ${HijriEngine.getMonthName(currentHijriMonth, currentLang)} · ${greg.day} ${HijriEngine.getGregMonthName(greg.month, currentLang)}`;
            const catLabel = cat.label[currentLang] || cat.label.en;
            const desc = event.desc[currentLang] || event.desc.en || '';

            return `
                <div class="event-card" data-event-id="${event.id}" data-day="${event.day}" style="--cat-color:${cat.color}">
                    <div style="position:absolute;left:0;top:0;bottom:0;width:3px;background:${cat.color};border-radius:0 2px 2px 0;"></div>
                    <div class="event-card-icon">${cat.icon}</div>
                    <div class="event-card-body">
                        <div class="event-card-name">${name}</div>
                        <div class="event-card-date">${dateStr}</div>
                    </div>
                    <span class="event-card-category" style="color:${cat.color};background:${cat.bg}">${catLabel}</span>
                    <button class="event-share-btn" title="Share"
                            data-id="${event.id}"
                            data-name="${name.replace(/"/g, '&quot;')}" 
                            data-date="${dateStr.replace(/"/g, '&quot;')}" 
                            data-desc="${desc.replace(/"/g, '&quot;')}" 
                            data-icon="${cat.icon}" 
                            data-color="${cat.color}">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8"/><polyline points="16 6 12 2 8 6"/><line x1="12" y1="2" x2="12" y2="15"/></svg>
                    </button>
                </div>`;
        }).join('');

        // Click handler is bound once in bindEvents()
    }

    function renderLegend() {
        const container = $('legend-items');
        const cats = IslamicEvents.CATEGORIES;
        container.innerHTML = Object.keys(cats).map(key => {
            const cat = cats[key];
            const label = cat.label[currentLang] || cat.label.en;
            return `
                <div class="legend-item">
                    <span class="legend-dot" style="background:${cat.color}"></span>
                    ${cat.icon} ${label}
                </div>`;
        }).join('');
    }

    function renderFooterYear() {
        const today = HijriEngine.getToday();
        const now = new Date();
        $('footer-year').textContent = `${today.year} AH / ${now.getFullYear()} CE`;
        // Show app version in footer
        const footerEl = $('app-footer');
        if (footerEl && !$('app-version-label')) {
            const vEl = document.createElement('p');
            vEl.id = 'app-version-label';
            vEl.className = 'footer-note';
            vEl.textContent = `v${APP_VERSION}`;
            footerEl.appendChild(vEl);
        }
    }

    // ── Daily Dua / Hadith ──
    function renderDua() {
        if (typeof IslamicContent === 'undefined') return;
        const content = IslamicContent.getDailyContent();

        // Multi-language type labels
        const typeLabels = {
            dua: {
                en: '📖 Dua of the Day',
                ar: '📖 دعاء اليوم',
                bn: '📖 আজকের দুয়া',
                ur: '📖 آج کی دعا',
                tr: '📖 Günün Duası',
                ms: '📖 Doa Hari Ini',
                id: '📖 Doa Hari Ini',
                fr: '📖 Doua du jour',
                hi: '📖 आज की दुआ',
                te: '📖 నేటి దువా',
                ta: '📖 இன்றைய துஆ',
                ml: '📖 ഇന്നത്തെ ദുആ'
            },
            hadith: {
                en: '📜 Hadith of the Day',
                ar: '📜 حديث اليوم',
                bn: '📜 আজকের হাদিস',
                ur: '📜 آج کی حدیث',
                tr: '📜 Günün Hadisi',
                ms: '📜 Hadis Hari Ini',
                id: '📜 Hadis Hari Ini',
                fr: '📜 Hadith du jour',
                hi: '📜 आज की हदीस',
                te: '📜 నేటి హదీస్',
                ta: '📜 இன்றைய ஹதீ‌ஸ்',
                ml: '📜 ഇന്നത്തെ ഹദീസ്'
            }
        };

        const typeInfo = typeLabels[content.type] || typeLabels.dua;
        const typeLabel = typeInfo[currentLang] || typeInfo.en;

        $('dua-type-label').textContent = typeLabel;
        $('dua-arabic').textContent = content.ar;

        // Pronunciation (Transliteration)
        const pronEl = $('dua-pronunciation');
        if (pronEl) {
            pronEl.textContent = content.tr || '';
            pronEl.style.display = content.tr ? 'block' : 'none';
        }

        // Translation
        const translation = (content.translations && content.translations[currentLang]) || (content.translations && content.translations.en) || content.en || '';
        $('dua-english').textContent = translation ? `"${translation}"` : '';

        $('dua-ref').textContent = `— ${content.ref}`;
    }

    // ── 99 Names of Allah ──
    function renderNames() {
        if (typeof IslamicContent === 'undefined') return;
        const grid = $('names-grid');
        const names = IslamicContent.getAllNames();
        grid.innerHTML = names.map(n => {
            const translation = (n.translations && (n.translations[currentLang] || n.translations.en)) || n.en || '';
            const pronunciation = (n.en !== translation) ? n.en : '';
            return `
                <div class="name-card">
                    <div class="name-card-num">${n.num}</div>
                    <div class="name-card-ar">${n.ar}</div>
                    <div class="name-card-en">${n.en}</div>
                    ${pronunciation ? `<div class="name-card-pronunciation">🔊 ${pronunciation}</div>` : ''}
                    <div class="name-card-meaning">${translation}</div>
                </div>
            `;
        }).join('');
    }

    // ── Duas & Hadiths List ──
    function renderDuasList() {
        if (typeof IslamicContent === 'undefined') return;
        const list = $('duas-list');
        const items = IslamicContent.DAILY_CONTENT;

        const duas = items.filter(item => item.type === 'dua');
        const hadiths = items.filter(item => item.type === 'hadith');

        const renderItems = (itemsList) => itemsList.map((item) => {
            const translation = (item.translations && (item.translations[currentLang] || item.translations.en)) || item.en || '';
            const pronunciation = item.tr || '';
            const itemTypeLabel = item.type === 'dua' ? '🤲 Dua' : '📜 Hadith';
            return `
                <div class="dua-list-card" style="margin-bottom: 8px;">
                    <span class="dua-list-type ${item.type}">${itemTypeLabel}</span>
                    <div class="dua-list-arabic">${item.ar}</div>
                    ${pronunciation ? `<div class="dua-list-pronunciation">🔊 ${pronunciation}</div>` : ''}
                    <div class="dua-list-translation">"${translation}"</div>
                    <div class="dua-list-ref">— ${item.ref}</div>
                </div>
            `;
        }).join('');

        list.innerHTML = `
            <div class="tutorial-card" style="margin-bottom: 12px;">
                <div class="tutorial-card-header" onclick="this.parentElement.classList.toggle('open')">
                    <span class="tutorial-card-icon">🤲</span>
                    <span class="tutorial-card-title">Daily Duas</span>
                    <span class="tutorial-card-chevron">▼</span>
                </div>
                <div class="tutorial-card-body">
                    ${renderItems(duas)}
                </div>
            </div>
            <div class="tutorial-card">
                <div class="tutorial-card-header" onclick="this.parentElement.classList.toggle('open')">
                    <span class="tutorial-card-icon">📜</span>
                    <span class="tutorial-card-title">Selected Hadiths</span>
                    <span class="tutorial-card-chevron">▼</span>
                </div>
                <div class="tutorial-card-body">
                    ${renderItems(hadiths)}
                </div>
            </div>
        `;
    }

    // ── Islamic Tutorials ──
    function renderTutorials() {
        const list = $('tutorials-list');

        const tutorials = IslamicContent.getTutorials ? IslamicContent.getTutorials() : [];
        list.innerHTML = tutorials.map(t => {
            const title = t.translations?.title?.[currentLang] || t.translations?.title?.en || t.title;
            const body = t.translations?.body?.[currentLang] || t.translations?.body?.en || t.body;

            return `
                <div class="tutorial-card">
                    <div class="tutorial-card-header" onclick="this.parentElement.classList.toggle('open')">
                        <span class="tutorial-card-icon">${t.icon}</span>
                        <span class="tutorial-card-title">${title}</span>
                        <span class="tutorial-card-chevron">▼</span>
                    </div>
                    <div class="tutorial-card-body">${body}</div>
                </div>
            `;
        }).join('');
    }

    // ── Small Surahs ──
    function renderSurahs() {
        const list = $('surahs-list');
        if (!list) return;

        const surahs = IslamicContent.getSurahs ? IslamicContent.getSurahs() : [];
        list.innerHTML = surahs.map(s => {
            const title = s.translations?.title?.[currentLang] || s.translations?.title?.en || s.title;
            const body = s.translations?.body?.[currentLang] || s.translations?.body?.en || s.body;

            return `
                <div class="tutorial-card">
                    <div class="tutorial-card-header" onclick="this.parentElement.classList.toggle('open')">
                        <span class="tutorial-card-icon">${s.icon}</span>
                        <span class="tutorial-card-title">${title}</span>
                        <span class="tutorial-card-chevron">▼</span>
                    </div>
                    <div class="tutorial-card-body">${body}</div>
                </div>
            `;
        }).join('');
    }

    // ── Theme ──
    function setTheme(theme) {
        if (theme === 'default') {
            document.documentElement.removeAttribute('data-theme');
        } else {
            document.documentElement.setAttribute('data-theme', theme);
        }
        localStorage.setItem('ic-theme', theme);
        // Update swatch UI
        document.querySelectorAll('.theme-swatch').forEach(s => {
            s.classList.toggle('active', s.dataset.theme === theme);
        });
    }

    // ── Share helper ──
    function shareText(text) {
        if (navigator.share) {
            navigator.share({ text }).catch(() => { });
        } else {
            navigator.clipboard.writeText(text).then(() => {
                alert('Copied to clipboard!');
            }).catch(() => {
                // Final fallback
                const ta = document.createElement('textarea');
                ta.value = text;
                document.body.appendChild(ta);
                ta.select();
                document.execCommand('copy');
                document.body.removeChild(ta);
                alert('Copied to clipboard!');
            });
        }
    }

    // ── Ramadan Mode ──
    function renderRamadan(passedNow = null, passedTimes = null) {
        const today = HijriEngine.getToday();
        const banner = $('ramadan-banner');

        // Ramadan is Hijri month 9
        if (today.month !== 9) {
            banner.classList.remove('active');
            return;
        }

        if (!currentCity) {
            banner.classList.remove('active');
            return;
        }

        banner.classList.add('active');

        const now = passedNow || new Date();
        let times = passedTimes;

        if (!times) {
            times = PrayerTimes.calculate(
                now,
                currentCity.lat,
                currentCity.lng,
                getDSTAwareTimezone(currentCity, now),
                calcMethod,
                asrSchool
            );
            times = applyTimeAdjustment(times);
        }

        // Suhoor ends = Fajr time (some communities subtract 10 min)
        const suhoorHrs = times._raw.fajr;
        const suhoorEnd = formatAdjustedTime(suhoorHrs - 10 / 60);
        $('ramadan-suhoor').textContent = suhoorEnd.h12;

        // Iftar = Maghrib
        $('ramadan-iftar').textContent = times.maghrib.h12;

        // Countdown to Iftar or Suhoor
        const currentHrs = now.getHours() + (now.getMinutes() + (now.getSeconds() + now.getMilliseconds() / 1000) / 60) / 60;
        const fajrHrs = suhoorHrs - 10 / 60;
        // Round targets to displayed minute (matching what the user sees)
        const roundedMaghrib = Math.round(times._raw.maghrib * 60) / 60;
        const roundedFajr = Math.round(fajrHrs * 60) / 60;

        if (currentHrs < roundedMaghrib && currentHrs >= roundedFajr) {
            // During fasting — countdown to Iftar
            const diff = roundedMaghrib - currentHrs;
            const totalSeconds = Math.max(0, Math.ceil(diff * 3600));
            const h = Math.floor(totalSeconds / 3600);
            const m = Math.floor((totalSeconds % 3600) / 60);
            const s = totalSeconds % 60;
            $('ramadan-countdown').textContent = `🍽️ Iftar in ${h}h ${m}m ${s}s`;
        } else {
            // After Iftar or before Suhoor — countdown to Suhoor
            let diff = roundedFajr - currentHrs;
            if (diff < 0) diff += 24;
            const totalSeconds = Math.max(0, Math.ceil(diff * 3600));
            const h = Math.floor(totalSeconds / 3600);
            const m = Math.floor((totalSeconds % 3600) / 60);
            const s = totalSeconds % 60;
            $('ramadan-countdown').textContent = `🌙 Suhoor ends in ${h}h ${m}m ${s}s`;
        }


    }

    // ── Event detail modal ──
    function showDayEvents(year, month, day) {
        const events = IslamicEvents.getEventsForDate(month, day);
        if (events.length === 0) return; // No modal if no events
        if (events.length === 1) {
            showEventDetail(events[0].id, year, month, day);
            return;
        }
        // Multiple events — show first one (could extend to multi-event view)
        showEventDetail(events[0].id, year, month, day);
    }

    function showEventDetail(eventId, year, month, day) {
        const allEvents = IslamicEvents.EVENTS;
        const event = allEvents.find(e => e.id === eventId);
        if (!event) return;

        const cat = IslamicEvents.getCategoryInfo(event.category);
        const name = event.name[currentLang] || event.name.en;
        const desc = (event.desc && (event.desc[currentLang] || event.desc.en)) || '';
        const greg = HijriEngine.hijriToGregorian(year, month, day);
        const dateStr = `${day} ${HijriEngine.getMonthName(month, currentLang)} ${year} AH  ·  ${greg.day} ${HijriEngine.getGregMonthName(greg.month, currentLang)} ${greg.year}`;
        const catLabel = cat.label[currentLang] || cat.label.en;

        $('event-modal-icon').textContent = cat.icon;
        $('event-modal-title').textContent = name;
        $('event-modal-date').textContent = dateStr;
        $('event-modal-desc').textContent = desc;
        $('event-modal-category').textContent = catLabel;
        $('event-modal-category').style.color = cat.color;
        $('event-modal-category').style.background = cat.bg;

        toggleModal('event-modal', true);
    }

    // ── Modal helpers ──
    function toggleModal(id, show) {
        const el = $(id);
        if (!el) return;
        if (show) {
            history.pushState({ modal: id }, '');
            el.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        } else {
            el.style.display = 'none';
            document.body.style.overflow = '';
            if (history.state && history.state.modal === id) {
                history.back();
            }
        }
    }

    // ── Time Adjustment helper ──
    function getTimeAdjustmentHours() {
        const sign = timeAdjustSign === '-' ? -1 : 1;
        return sign * (timeAdjustMin / 60 + timeAdjustSec / 3600);
    }

    function applyTimeAdjustment(times) {
        // Adjust all _raw values and reformat
        const adj = getTimeAdjustmentHours();
        if (adj === 0) return times;
        const raw = { ...times._raw };
        const adjusted = {};
        for (const key of Object.keys(raw)) {
            raw[key] = raw[key] + adj;
            adjusted[key] = formatAdjustedTime(raw[key]);
        }
        adjusted._raw = raw;
        return adjusted;
    }

    function formatAdjustedTime(hours) {
        if (isNaN(hours)) return { h24: '--:--', h12: '--:-- AM', decimal: hours };
        hours = ((hours % 24) + 24) % 24;
        const h = Math.floor(hours);
        const m = Math.round((hours - h) * 60);
        const hh = h.toString().padStart(2, '0');
        const mm = m.toString().padStart(2, '0');
        const h12 = h === 0 ? 12 : (h > 12 ? h - 12 : h);
        const ampm = h < 12 ? 'AM' : 'PM';
        return { h24: `${hh}:${mm}`, h12: `${h12}:${mm} ${ampm}`, decimal: hours };
    }

    // ── PWA Install ──
    let deferredPrompt = null;
    function initPWA() {
        // Register service worker
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('sw.js').then(registration => {
                // Check for updates on registration
                registration.addEventListener('updatefound', () => {
                    const newWorker = registration.installing;
                    if (!newWorker) return;

                    newWorker.addEventListener('statechange', () => {
                        // New SW is installed & waiting, and there's already an active controller
                        if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                            waitingWorker = newWorker;
                            $('update-banner-text').textContent = `🔄 v${APP_VERSION} → New version available!`;
                            $('update-banner').style.display = 'flex';
                        }
                    });
                });

                // If there's already a waiting worker (page was refreshed while update is pending)
                if (registration.waiting && navigator.serviceWorker.controller) {
                    waitingWorker = registration.waiting;
                    $('update-banner-text').textContent = `🔄 v${APP_VERSION} → New version available!`;
                    $('update-banner').style.display = 'flex';
                }
            }).catch(() => { });

            // Auto-reload when the new SW takes control
            navigator.serviceWorker.addEventListener('controllerchange', () => {
                window.location.reload();
            });
        }

        // Update banner buttons
        $('update-btn').addEventListener('click', () => {
            if (waitingWorker) {
                waitingWorker.postMessage({ type: 'SKIP_WAITING' });
            }
        });
        $('update-dismiss').addEventListener('click', () => {
            $('update-banner').style.display = 'none';
        });

        // Install prompt
        window.addEventListener('beforeinstallprompt', e => {
            e.preventDefault();
            deferredPrompt = e;
            $('install-banner').style.display = 'flex';
        });

        $('install-btn').addEventListener('click', async () => {
            if (!deferredPrompt) return;
            deferredPrompt.prompt();
            const result = await deferredPrompt.userChoice;
            deferredPrompt = null;
            $('install-banner').style.display = 'none';
        });

        $('install-dismiss').addEventListener('click', () => {
            $('install-banner').style.display = 'none';
        });

        window.addEventListener('appinstalled', () => {
            $('install-banner').style.display = 'none';
        });
    }

    // ── Boot ──
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }



    // ── Location Management ──
    function loadLocation() {
        const savedType = localStorage.getItem('ic-loc-type');
        if (savedType === 'gps') {
            // Restore GPS-based location
            currentCity = {
                id: '__gps__',
                name: localStorage.getItem('ic-loc-name') || 'GPS Location',
                country: '',
                lat: parseFloat(localStorage.getItem('ic-loc-lat')) || 21.4225,
                lng: parseFloat(localStorage.getItem('ic-loc-lng')) || 39.8262,
                tz: parseFloat(localStorage.getItem('ic-loc-tz')) || 3,
                region: 'custom'
            };
        } else {
            const savedId = localStorage.getItem('ic-city');
            if (savedId) {
                currentCity = CityDatabase.getById(savedId);
            } else {
                currentCity = CityDatabase.getById('mecca');
            }
        }
        $('calc-method').value = calcMethod;
        $('asr-school').value = asrSchool;

        // Restore time adjustment UI
        $('time-adjust-sign').value = timeAdjustSign;
        $('time-adjust-min').value = timeAdjustMin;
        $('time-adjust-sec').value = timeAdjustSec;

        updateLocationBar();
    }

    function selectCity(cityId) {
        currentCity = CityDatabase.getById(cityId);
        localStorage.setItem('ic-loc-type', 'city');
        localStorage.setItem('ic-city', cityId);
        updateLocationBar();
        renderPrayerTimes();
    }

    function setCustomLocation(lat, lng, name, timezone = null) {
        // Use provided timezone, or estimate from longitude if null
        // (1 hour per 15°)
        const tz = timezone !== null ? timezone : Math.round(lng / 15 * 2) / 2;

        currentCity = {
            id: '__gps__',
            name: name || `${lat.toFixed(4)}°, ${lng.toFixed(4)}°`,
            country: '',
            lat: lat,
            lng: lng,
            tz: tz,
            region: 'custom'
        };
        localStorage.setItem('ic-loc-type', 'gps');
        localStorage.setItem('ic-loc-name', currentCity.name);
        localStorage.setItem('ic-loc-lat', lat.toString());
        localStorage.setItem('ic-loc-lng', lng.toString());
        localStorage.setItem('ic-loc-tz', tz.toString());
        updateLocationBar();
        renderPrayerTimes();
    }

    function updateLocationBar() {
        if (!currentCity) return;
        if (currentCity.id === '__gps__') {
            const tz = getDSTAwareTimezone(currentCity, new Date());
            $('location-name').textContent = `${currentCity.name} (GMT${tz >= 0 ? '+' : ''}${tz})`;
        } else {
            $('location-name').textContent = `${currentCity.name}, ${currentCity.country}`;
        }
    }

    function detectGPS() {
        const btn = $('btn-gps');
        if (!navigator.geolocation) {
            btn.textContent = 'GPS not available';
            return;
        }
        btn.classList.add('loading');
        btn.innerHTML = '<span class="gps-icon">⏳</span> Detecting...';

        navigator.geolocation.getCurrentPosition(
            pos => {
                const lat = pos.coords.latitude;
                const lng = pos.coords.longitude;
                // Find nearest city for name AND timezone reference
                const nearest = CityDatabase.findNearest(lat, lng);
                const distKm = haversineDistance(lat, lng, nearest.lat, nearest.lng);

                // If within 500km, assume same timezone (handles political TZs like India 5.5)
                // Otherwise fallback to geometric calculation (pass null)
                const smartTZ = distKm < 500 ? nearest.tz : null;

                // If within 50km of a known city, use that city name
                const name = distKm < 50
                    ? `Near ${nearest.name}`
                    : `${lat.toFixed(4)}°, ${lng.toFixed(4)}°`;

                setCustomLocation(lat, lng, name, smartTZ);
                toggleModal('location-modal', false);
                btn.classList.remove('loading');
                btn.innerHTML = '<span class="gps-icon">🛰️</span> Auto-detect (GPS)';
            },
            err => {
                btn.classList.remove('loading');
                btn.innerHTML = '<span class="gps-icon">❌</span> Location denied';
                setTimeout(() => {
                    btn.innerHTML = '<span class="gps-icon">🛰️</span> Auto-detect (GPS)';
                }, 2000);
            },
            { timeout: 10000, enableHighAccuracy: true }
        );
    }

    function haversineDistance(lat1, lng1, lat2, lng2) {
        const R = 6371; // km
        const dLat = (lat2 - lat1) * Math.PI / 180;
        const dLng = (lng2 - lng1) * Math.PI / 180;
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
            Math.sin(dLng / 2) * Math.sin(dLng / 2);
        return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    }

    function renderCityList(query = '') {
        const cities = CityDatabase.search(query);
        const grouped = {};
        for (const c of cities) {
            if (!grouped[c.region]) grouped[c.region] = [];
            grouped[c.region].push(c);
        }

        let html = '';
        for (const [region, regionCities] of Object.entries(grouped)) {
            const regionName = CityDatabase.REGIONS[region]?.en || region;
            html += `<div class="city-region-title">${regionName}</div>`;
            for (const city of regionCities) {
                const isActive = currentCity && city.id === currentCity.id;
                html += `
                    <div class="city-item${isActive ? ' active' : ''}" data-city-id="${city.id}">
                        <span class="city-item-name">${city.name}</span>
                        <span class="city-item-country">${city.country}</span>
                    </div>`;
            }
        }
        $('city-list').innerHTML = html;
    }

    // ── Prayer Times Rendering ──
    function renderPrayerTimes() {
        if (!currentCity) return;

        const now = new Date();
        let times = PrayerTimes.calculate(
            now,
            currentCity.lat,
            currentCity.lng,
            getDSTAwareTimezone(currentCity, now),
            calcMethod,
            asrSchool
        );

        // Apply time adjustment
        times = applyTimeAdjustment(times);

        const currentHrs = now.getHours() + now.getMinutes() / 60 + now.getSeconds() / 3600;
        const nextPrayer = PrayerTimes.getNextPrayer(times, currentHrs);
        const names = PrayerTimes.PRAYER_NAMES[currentLang] || PrayerTimes.PRAYER_NAMES.en;
        const icons = PrayerTimes.PRAYER_ICONS;
        const order = ['sehri', 'fajr', 'sunrise', 'dhuhr', 'asr', 'maghrib', 'isha', 'tahajjud'];

        let html = '';
        for (const key of order) {
            const isNext = key === nextPrayer.name && !nextPrayer.tomorrow;
            html += `
                <div class="prayer-card${isNext ? ' next-prayer' : ''}">
                    <div class="prayer-card-icon">${icons[key]}</div>
                    <div class="prayer-card-name">${names[key]}</div>
                    <div class="prayer-card-time">${times[key].h12}</div>
                </div>`;
        }
        $('prayer-grid').innerHTML = html;

        // Update countdown label
        const nextName = (PrayerTimes.PRAYER_NAMES[currentLang] || PrayerTimes.PRAYER_NAMES.en)[nextPrayer.name];
        $('countdown-label').textContent = nextName + ':';

        // Method note
        const methodName = PrayerTimes.METHODS[calcMethod]?.name || 'MWL';
        const adjStr = getTimeAdjustmentHours() !== 0 ? ` | Adj: ${timeAdjustSign}${timeAdjustMin}m ${timeAdjustSec}s` : '';
        $('prayer-method-note').textContent = `Method: ${methodName}${adjStr}`;
    }

    // ── Date-specific Prayer Times (clicked from calendar) ──
    function showDayPrayerTimes(hYear, hMonth, hDay) {
        if (!currentCity) {
            // Fallback to showing events if no location set
            showDayEvents(hYear, hMonth, hDay);
            return;
        }

        // Convert Hijri date to Gregorian for calculation
        const greg = HijriEngine.hijriToGregorian(hYear, hMonth, hDay);
        const gregDate = new Date(greg.year, greg.month - 1, greg.day);
        let times = PrayerTimes.calculateForDate(
            greg.year, greg.month, greg.day,
            currentCity.lat, currentCity.lng, getDSTAwareTimezone(currentCity, gregDate),
            calcMethod, asrSchool
        );

        // Apply time adjustment
        times = applyTimeAdjustment(times);

        const names = PrayerTimes.PRAYER_NAMES[currentLang] || PrayerTimes.PRAYER_NAMES.en;
        const icons = PrayerTimes.PRAYER_ICONS;
        const hijriMonths = HijriEngine.getMonthName(hMonth, currentLang);
        const order = ['sehri', 'fajr', 'sunrise', 'dhuhr', 'asr', 'maghrib', 'isha', 'tahajjud'];

        // Title: Hijri date
        $('date-prayer-title').textContent = `🕌 ${hDay} ${hijriMonths} ${hYear} AH`;
        $('date-prayer-subtitle').textContent =
            `${greg.day}/${greg.month}/${greg.year} • ${currentCity.name}`;

        // Prayer grid
        let html = '';
        for (const key of order) {
            html += `
                <div class="date-prayer-item">
                    <span class="date-prayer-item-icon">${icons[key]}</span>
                    <div class="date-prayer-item-info">
                        <div class="date-prayer-item-name">${names[key]}</div>
                        <div class="date-prayer-item-time">${times[key].h12}</div>
                    </div>
                </div>`;
        }

        // Also show events for this date
        const monthEvents = IslamicEvents.getEventsForMonth(hMonth);
        const dayEvents = monthEvents.filter(e => e.day === hDay);
        if (dayEvents.length > 0) {
            html += '<div style="grid-column: 1/-1; margin-top: 8px; border-top: 1px solid var(--border); padding-top: 8px;">';
            for (const ev of dayEvents) {
                const evName = ev.name[currentLang] || ev.name.en;
                html += `<div style="font-size:0.82rem; color:var(--text-primary); margin-bottom:4px;">📅 ${evName}</div>`;
            }
            html += '</div>';
        }

        $('date-prayer-grid').innerHTML = html;
        toggleModal('date-prayer-modal', true);
    }

    // ── Day/Night Header Gradient ──
    function updateHeaderGradient(times, currentHrs) {
        const header = $('app-header');
        if (!header || !times._raw) return;

        const raw = times._raw;
        let tint, accentLine;

        if (currentHrs < raw.fajr) {
            // Late night / pre-Fajr — deep navy
            tint = 'rgba(6, 12, 28, 0.92)';
            accentLine = 'linear-gradient(90deg, transparent, rgba(100, 120, 180, 0.3), transparent)';
        } else if (currentHrs < raw.sunrise) {
            // Fajr to Sunrise — dawn amber
            tint = 'rgba(40, 22, 10, 0.88)';
            accentLine = 'linear-gradient(90deg, transparent, rgba(245, 180, 80, 0.5), transparent)';
        } else if (currentHrs < raw.dhuhr) {
            // Morning — warm blue
            tint = 'rgba(12, 28, 50, 0.85)';
            accentLine = 'linear-gradient(90deg, transparent, rgba(80, 180, 220, 0.4), transparent)';
        } else if (currentHrs < raw.asr) {
            // Afternoon — golden
            tint = 'rgba(20, 16, 8, 0.88)';
            accentLine = 'linear-gradient(90deg, transparent, rgba(245, 200, 66, 0.4), transparent)';
        } else if (currentHrs < raw.maghrib) {
            // Late afternoon — sunset orange
            tint = 'rgba(35, 15, 8, 0.88)';
            accentLine = 'linear-gradient(90deg, transparent, rgba(230, 120, 50, 0.5), transparent)';
        } else if (currentHrs < raw.isha) {
            // Maghrib to Isha — twilight purple
            tint = 'rgba(20, 10, 35, 0.90)';
            accentLine = 'linear-gradient(90deg, transparent, rgba(160, 100, 220, 0.4), transparent)';
        } else {
            // Night — deep indigo
            tint = 'rgba(8, 8, 25, 0.92)';
            accentLine = 'linear-gradient(90deg, transparent, rgba(60, 80, 160, 0.3), transparent)';
        }

        header.style.setProperty('--header-tint', tint);

    }

    function startPrayerCountdown() {
        if (prayerCountdownInterval) clearInterval(prayerCountdownInterval);

        const CIRC = 2 * Math.PI * 15.5; // ~97.4 circumference of SVG ring

        function tick() {
            try {
                if (!currentCity) return;
                const now = new Date();
                let times = PrayerTimes.calculate(now, currentCity.lat, currentCity.lng, getDSTAwareTimezone(currentCity, now), calcMethod, asrSchool);
                // Apply time adjustment for countdown too
                times = applyTimeAdjustment(times);
                const currentHrs = now.getHours() + (now.getMinutes() + (now.getSeconds() + now.getMilliseconds() / 1000) / 60) / 60;
                const next = PrayerTimes.getNextPrayer(times, currentHrs);

                // ── Prohibited Times Check ──
                const prohibited = [
                    { name: 'shuruq', start: times._raw.sunrise, end: times._raw.sunrise + 20 / 60 },
                    { name: 'istiwa', start: times._raw.dhuhr - 10 / 60, end: times._raw.dhuhr },
                    { name: 'ghurub', start: times._raw.maghrib - 15 / 60, end: times._raw.maghrib }
                ];

                let activeProhibited = prohibited.find(p => currentHrs >= p.start && currentHrs < p.end);

                if (activeProhibited) {
                    const label = str(activeProhibited.name);
                    const msg = str('prayerProhibited');

                    $('countdown-timer').textContent = msg;
                    $('countdown-label').textContent = label;
                    const heroEl = $('hero-countdown');
                    if (heroEl) {
                        heroEl.style.display = 'flex';
                        $('hero-countdown-label').textContent = label;
                        $('hero-countdown-time').textContent = msg;
                    }
                } else {
                    const names = PrayerTimes.PRAYER_NAMES[currentLang] || PrayerTimes.PRAYER_NAMES.en;
                    const prayerDisplayName = names[next.name] || 'Next';
                    const icon = PrayerTimes.PRAYER_ICONS[next.name] || '';

                    $('countdown-timer').textContent = PrayerTimes.formatCountdown(next.time, currentHrs);
                    $('countdown-label').textContent = `${icon} ${prayerDisplayName}`;

                    // ── Hero countdown ring ──
                    const heroEl = $('hero-countdown');
                    if (heroEl) {
                        heroEl.style.display = 'flex';
                        $('hero-countdown-label').textContent = prayerDisplayName;
                        $('hero-countdown-time').textContent = PrayerTimes.formatCountdown(next.time, currentHrs);
                    }
                }

                // ── Progress calculation (Refined Salah-to-Salah) ──
                const salahOrder = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'];

                // 1. Find the next actual Salah (skipping sunrise/sehri)
                let actualNext = next;
                if (!salahOrder.includes(next.name)) {
                    actualNext = getNextSalahOnly(times, currentHrs);
                }

                // 2. Find the previous actual Salah
                const sIdx = salahOrder.indexOf(actualNext.name);
                let prevSalahKey = (sIdx > 0 && !actualNext.tomorrow) ? salahOrder[sIdx - 1] : 'isha';

                let prevTime = times._raw[prevSalahKey] ?? times[prevSalahKey]?.decimal ?? 0;
                let nextTime = actualNext.time;

                // Normalize for 24h wrap-around
                if (actualNext.tomorrow || (actualNext.name === 'fajr' && currentHrs > 12)) {
                    // Next is tomorrow
                } else if (prevSalahKey === 'isha' && currentHrs < 12) {
                    prevTime -= 24; // Isha was yesterday
                }

                if (nextTime < prevTime) nextTime += 24;

                let totalSpan = nextTime - prevTime;
                let elapsed = currentHrs - prevTime;
                const pct = Math.max(0, Math.min(elapsed / totalSpan, 1));

                // Update Hero Ring & Progress Bar
                const progressFill = $('prayer-progress-fill');
                if (progressFill) progressFill.style.width = `${(pct * 100).toFixed(1)}%`;

                const ring = $('countdown-ring');
                if (ring) {
                    const CIRC = 283;
                    ring.style.strokeDashoffset = CIRC * (1 - pct);
                }

                // ── Ramadan Banner Refresh ──
                renderRamadan(now, times);

                // ── Day/Night header gradient ──
                updateHeaderGradient(times, currentHrs);

                checkNotifications(times, currentHrs);
            } catch (e) {
                console.error("Tick error:", e);
            }
        }

        tick();
        prayerCountdownInterval = setInterval(tick, 1000);
    }

    /**
     * Helper to find the next actual Salah (skipping sun positions)
     */
    function getNextSalahOnly(times, currentHrs) {
        const salahOrder = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'];
        for (const name of salahOrder) {
            const t = times._raw[name];
            if (t > currentHrs) return { name, time: t, tomorrow: false };
        }
        return { name: 'fajr', time: times._raw['fajr'] + 24, tomorrow: true };
    }

    // Splash Screen & Date Jumper Init
    window.addEventListener('load', () => {
        // Date Jumper init
        const dateBtn = $('btn-date-jump');
        const dateInput = $('date-jumper');

        if (dateBtn && dateInput) {
            dateBtn.addEventListener('click', () => {
                if ('showPicker' in HTMLInputElement.prototype) {
                    dateInput.showPicker();
                } else {
                    dateInput.click();
                }
            });

            dateInput.addEventListener('change', (e) => {
                try {
                    const val = e.target.value;
                    if (!val) return;

                    const parts = val.split('-');
                    const y = parseInt(parts[0], 10);
                    const m = parseInt(parts[1], 10);
                    const d = parseInt(parts[2], 10);

                    e.target.value = ''; // Reset

                    const h = HijriEngine.gregorianToHijri(y, m, d);
                    currentHijriYear = h.year;
                    currentHijriMonth = h.month;

                    render();

                    setTimeout(() => {
                        const cell = document.querySelector(`.day-cell[data-day="${h.day}"]`);
                        if (cell) {
                            cell.classList.add('selected-highlight');
                            cell.scrollIntoView({ behavior: 'smooth', block: 'center' });
                        }
                    }, 100);

                    showDayPrayerTimes(h.year, h.month, h.day);
                } catch (err) {
                    console.error('DateJumpError', err);
                    alert('Error: ' + err.message);
                }
            });
        }
    });

    // ══════════════════════════════════════
    // DYNAMIC IMAGE CANVAS GENERATOR & SHARE
    // ══════════════════════════════════════
    function generateShareImage(data) {
        const W = 1080, H = 1080;
        const canvas = document.createElement('canvas'); canvas.width = W; canvas.height = H;
        const ctx = canvas.getContext('2d');

        const bgGrad = ctx.createRadialGradient(W/2, H*0.3, 0, W/2, H*0.3, H);
        bgGrad.addColorStop(0, '#0b2c1c'); bgGrad.addColorStop(0.5, '#071d12'); bgGrad.addColorStop(1, '#030a06');
        ctx.fillStyle = bgGrad; ctx.fillRect(0, 0, W, H);

        for (let i = 0; i < 150; i++) {
            const x = Math.random() * W, y = Math.random() * H, r = Math.random() * 2 + 0.5, alpha = Math.random() * 0.7 + 0.1;
            ctx.beginPath(); ctx.arc(x, y, r, 0, Math.PI * 2);
            ctx.fillStyle = Math.random() < 0.4 ? `rgba(212, 165, 55, ${alpha})` : `rgba(255, 255, 248, ${alpha})`;
            ctx.fill();
        }

        const cardX = 80, cardW = W - 160, cardY = 120, cardH = H - 240, cardR = 30;
        function drawRoundedRect(x, y, w, h, r) {
            ctx.beginPath(); ctx.moveTo(x+r, y); ctx.lineTo(x+w-r, y); ctx.quadraticCurveTo(x+w, y, x+w, y+r);
            ctx.lineTo(x+w, y+h-r); ctx.quadraticCurveTo(x+w, y+h, x+w-r, y+h); ctx.lineTo(x+r, y+h);
            ctx.quadraticCurveTo(x, y+h, x, y+h-r); ctx.lineTo(x, y+r); ctx.quadraticCurveTo(x, y, x+r, y); ctx.closePath();
        }
        ctx.shadowColor = 'rgba(0, 0, 0, 0.8)'; ctx.shadowBlur = 60; ctx.shadowOffsetY = 20;
        drawRoundedRect(cardX, cardY, cardW, cardH, cardR);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.08)'; ctx.fill();
        ctx.shadowColor = 'transparent'; ctx.shadowBlur = 0; ctx.shadowOffsetY = 0;
        ctx.strokeStyle = data.color || 'rgba(212, 165, 55, 0.25)'; ctx.lineWidth = 3; ctx.stroke();

        const topGrad = ctx.createLinearGradient(cardX, cardY, cardX + cardW, cardY);
        topGrad.addColorStop(0, 'transparent'); topGrad.addColorStop(0.5, data.color || 'rgba(212, 165, 55, 0.9)'); topGrad.addColorStop(1, 'transparent');
        ctx.fillStyle = topGrad; ctx.fillRect(cardX + 40, cardY, cardW - 80, 4);

        const cx = W / 2;
        function writeCenter(text, y, font, color, maxW = cardW - 80) {
            ctx.font = font; ctx.fillStyle = color; ctx.textAlign = 'center'; ctx.textBaseline = 'top';
            const words = text.split(' '); let line = ''; const lines = [];
            for (const word of words) {
                const testLine = line + word + ' ';
                if (ctx.measureText(testLine).width > maxW && line) { lines.push(line.trim()); line = word + ' '; } 
                else { line = testLine; }
            }
            lines.push(line.trim());
            const match = font.match(/(\d+)px/);
            const lineH = (match ? parseInt(match[1]) : 30) * 1.5;
            for (const l of lines) { ctx.fillText(l, cx, y); y += lineH; }
            return y;
        }

        let currY = cardY + 120;

        if (data.isDua) {
            currY = writeCenter(data.icon, currY - 60, '80px serif', '#fff') + 20;
            currY = writeCenter(data.name, currY, 'bold 44px Inter, sans-serif', '#2ecc71') + 40;
            
            const dGrad = ctx.createLinearGradient(cx - 150, currY, cx + 150, currY);
            dGrad.addColorStop(0, 'transparent'); dGrad.addColorStop(0.5, data.color || 'rgba(46, 204, 113, 0.6)'); dGrad.addColorStop(1, 'transparent');
            ctx.fillStyle = dGrad; ctx.fillRect(cx - 150, currY, 300, 2);
            ctx.font = '20px serif'; ctx.fillStyle = data.color || 'rgba(46, 204, 113, 0.8)'; ctx.fillText('◆', cx, currY - 8);
            currY += 40;

            currY = writeCenter(data.dua, currY, 'bold 44px Amiri, serif', '#f5d782') + 25;
            if (data.pronunciation) {
                currY = writeCenter(data.pronunciation, currY, 'italic 24px Inter, sans-serif', 'rgba(255, 215, 0, 0.9)') + 25;
            }
            currY = writeCenter(data.translation, currY, 'italic 26px Inter, sans-serif', 'rgba(255, 255, 255, 0.8)') + 30;
            currY = writeCenter(data.ref, currY, '22px Inter, sans-serif', 'rgba(255, 255, 255, 0.5)') + 40;
        } else {
            currY = writeCenter(data.icon, currY - 60, '100px serif', '#fff') + 30;
            currY = writeCenter(data.name, currY, 'bold 56px Inter, sans-serif', '#fff') + 30;
            
            const dGrad = ctx.createLinearGradient(cx - 150, currY, cx + 150, currY);
            dGrad.addColorStop(0, 'transparent'); dGrad.addColorStop(0.5, data.color || 'rgba(212, 165, 55, 0.6)'); dGrad.addColorStop(1, 'transparent');
            ctx.fillStyle = dGrad; ctx.fillRect(cx - 150, currY, 300, 2);
            ctx.font = '20px serif'; ctx.fillStyle = data.color || 'rgba(212, 165, 55, 0.8)'; ctx.fillText('◆', cx, currY - 8);
            currY += 40;

            currY = writeCenter(data.date, currY, '32px Inter, sans-serif', 'rgba(255,255,255,0.8)') + 40;
            currY = writeCenter(data.desc, currY, '400 34px Amiri, Inter, sans-serif', '#f5d782', cardW - 120) + 40;
            
            if (data.wish) {
                currY = writeCenter(`"${data.wish}"`, currY + 10, 'italic 30px Inter, sans-serif', 'rgba(255, 255, 255, 0.9)', cardW - 100) + 40;
            }
        }

        ctx.font = '24px Inter, sans-serif'; ctx.fillStyle = 'rgba(255,255,255,0.3)'; ctx.textAlign = 'center';
        ctx.fillText(`Islamic Calendar App`, cx, H - 60);

        return canvas;
    }

    async function shareCardObj(btn, data) {
        const originalHTML = btn.innerHTML;
        btn.innerHTML = '<span>⏳</span>...';
        btn.disabled = true;

        if (!data.isDua && !data.wish) {
            const eventId = data.id || 'generic';
            
            let wishesPool;
            if (window.EventWishes && window.EventWishes.hasOwnProperty(eventId)) {
                wishesPool = window.EventWishes[eventId];
            } else if (window.EventWishes) {
                wishesPool = window.EventWishes['generic'];
            }
            
            if (!wishesPool) {
                // Event is explicitly set to null, or no data loaded
                data.wish = '';
            } else {
                const currentHijriYear = hijri.hYear || 1445;
                const varietyIndex = currentHijriYear % wishesPool.length;
                const selectedWish = wishesPool[varietyIndex];
                data.wish = selectedWish[currentLang] || selectedWish['en'] || "";
            }
        }
        
        let text = `${data.icon} ${data.name} ${data.icon}\n\n${data.isDua ? (data.dua + '\n' + (data.pronunciation ? data.pronunciation + '\n' : '') + data.translation + '\n' + data.ref) : ('📅 ' + data.date + '\n\n' + data.desc + (data.wish ? '\n\n✨ "' + data.wish + '"' : ''))}`;
        const filename = `${data.name.replace(/\s+/g, '-').toLowerCase()}-islamic-calendar.png`;

        try {
            const canvas = generateShareImage(data);
            const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png', 1.0));
            
            let shareSuccess = false;

            try { 
                if (!blob) throw new Error("Canvas gen failed");
                const file = new File([blob], filename, { type: 'image/png' });
                if (navigator.canShare && navigator.canShare({ files: [file] })) {
                    await navigator.share({ title: data.name, text: text + '\n\n🔗 ', url: window.location.href, files: [file] });
                    shareSuccess = true;
                    btn.innerHTML = originalHTML; btn.disabled = false; return;
                }
            } catch(e) { if(e.name==='AbortError') { btn.innerHTML=originalHTML; btn.disabled=false; return; } }

            if (!shareSuccess) {
                try {
                    if (navigator.share) {
                        await navigator.share({ title: data.name, text: text, url: window.location.href });
                        if (blob) downloadBlob(blob, filename); 
                        shareSuccess = true;
                        btn.innerHTML = originalHTML; btn.disabled = false; return;
                    }
                } catch(e) { if(e.name==='AbortError') { btn.innerHTML=originalHTML; btn.disabled=false; return; } }
            }

            if (!shareSuccess) {
                if (blob) downloadBlob(blob, filename);
                try {
                    await navigator.clipboard.writeText(text + '\n\n🔗 ' + window.location.href);
                    customToast('Image downloaded & text copied! 📋');
                } catch (e) {
                    customToast('Image downloaded! 📥');
                }
            }
        } catch (err) {
            console.error('Share Error:', err);
            customToast('Err: ' + (err.message || 'Unknown'));
        } finally {
            btn.innerHTML = originalHTML;
            btn.disabled = false;
        }
    }

    function downloadBlob(blob, filename) {
        if (!blob) return;
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a'); a.style.display = 'none';
        a.href = url; a.download = filename;
        document.body.appendChild(a); a.click();
        setTimeout(() => { URL.revokeObjectURL(url); if (a.parentNode) a.parentNode.removeChild(a); }, 1000);
    }

    function customToast(msg) {
        let toast = document.getElementById('ic-toast');
        if (!toast) {
            toast = document.createElement('div');
            toast.id = 'ic-toast';
            toast.style.cssText = 'position:fixed;bottom:80px;left:50%;transform:translateX(-50%);background:rgba(0,0,0,0.8);color:#fff;padding:12px 24px;border-radius:30px;z-index:99999;transition:opacity 0.3s;opacity:0;pointer-events:none;font-size:0.95rem;text-align:center;box-shadow:0 4px 12px rgba(0,0,0,0.3);';
            document.body.appendChild(toast);
        }
        toast.textContent = msg;
        toast.style.opacity = '1';
        setTimeout(() => toast.style.opacity = '0', 3000);
    }

    // Replace the plaintext shareText entirely if any calls remain
    function shareText(text) {
        if (navigator.share) {
            navigator.share({ text: text }).catch(() => {});
        } else {
            navigator.clipboard.writeText(text);
            customToast('Copied to clipboard');
        }
    }

    return { navigateMonth, goToToday, setLanguage };
})();
