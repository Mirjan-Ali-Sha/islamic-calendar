/**
 * Daily Dua/Hadith Collection & 99 Names of Allah
 * Embedded data for the Islamic Calendar PWA.
 */

const IslamicContent = (() => {
    'use strict';

    // ── Daily Duas & Hadiths (30 items — one per day-of-month) ──
    const DAILY_CONTENT = [
        {
            type: 'dua',
            ar: 'بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيمِ',
            tr: 'Bismillahir Rahmanir Rahim',
            translations: {
                en: 'In the name of Allah, the Most Gracious, the Most Merciful.',
                bn: 'পরম করুণাময় ও অসীম দয়ালু আল্লাহর নামে শুরু করছি।',
                ur: 'اللہ کے نام سے شروع جو بڑا مہربان نہایت رحم والا ہے۔',
                ar: 'بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيمِ',
                tr: 'Rahman ve Rahim olan Allah\'ın adıyla.',
                ms: 'Dengan nama Allah, Yang Maha Pemurah, lagi Maha Mengasihani.',
                id: 'Dengan nama Allah Yang Maha Pengasih, Maha Penyayang.',
                fr: 'Au nom d\'Allah, le Tout Miséricordieux, le Très Miséricordieux.',
                hi: 'अल्लाह के नाम से, जो बड़ा मेहरबान और निहायत रहम वाला है।',
                te: 'అత్యంత దయగల, కరుణామయుడైన అల్లాహ్ పేరుతో.',
                ta: 'அளவற்ற அருளாளனும் நிகரற்ற அன்புடையோனுமாகிய அல்லாஹ்வின் பெயரால்.',
                ml: 'പരമകാരുണികനും കരുണാനിധിയുമായ അള്ളാഹുവിന്റെ നാമത്തിൽ.'
            },
            ref: 'Quran 1:1'
        },
        {
            type: 'hadith',
            ar: 'إِنَّمَا الْأَعْمَالُ بِالنِّيَّاتِ',
            tr: 'Innamal a\'malu bin-niyyat',
            translations: {
                en: 'Actions are judged by intentions.',
                bn: 'নিশ্চয়ই সকল কাজ নিয়তের ওপর নির্ভরশীল।',
                ur: 'اعمال کا دارومدار نیتوں پر ہے۔',
                ar: 'إِنَّمَا الْأَعْمَالُ بِالنِّيَّاتِ',
                tr: 'Ameller niyetlere göredir.',
                ms: 'Sesungguhnya setiap amalan itu bergantung pada niat.',
                id: 'Sesungguhnya amal itu tergantung pada niatnya.',
                fr: 'Certes, les actions ne valent que par les intentions.',
                hi: 'कार्यों का आधार नियत (इरादे) पर है।',
                te: 'పనులు ఉద్దేశాల పైనే ఆధారపడి ఉంటాయి.',
                ta: 'செயல்கள் அனைத்தும் எண்ணங்களைப் பொறுத்தே அமைகின்றன.',
                ml: 'കർമ്മങ്ങൾ ഉദ്ദേശ്യങ്ങൾക്കനുസരിച്ചാണ് പരിഗണിക്കപ്പെടുന്നത്.'
            },
            ref: 'Bukhari & Muslim'
        },
        {
            type: 'dua',
            ar: 'رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ',
            tr: 'Rabbana atina fid-dunya hasanatan wa fil-akhirati hasanatan waqina \'adhaban-nar',
            translations: {
                en: 'Our Lord, give us good in this world and good in the Hereafter, and protect us from the torment of the Fire.',
                bn: 'হে আমাদের প্রভু! আমাদের দুনিয়াতে কল্যাণ দিন এবং আখেরাতেও কল্যাণ দিন এবং আগুনের আজাব থেকে আমাদের রক্ষা করুন।',
                ur: 'اے ہمارے رب! ہمیں دنیا میں بھی بھلائی دے اور آخرت میں بھی بھلائی دے اور ہمیں آگ کے عذاب سے بچا۔',
                ar: 'رَبَّنَا آتِنَا فِي الدُّنْيَا حَسَنَةً وَفِي الْآخِرَةِ حَسَنَةً وَقِنَا عَذَابَ النَّارِ',
                tr: 'Rabbimiz! Bize dünyada da iyilik ver, ahirette de iyilik ver ve bizi ateş azabından koru.',
                ms: 'Wahai Tuhan kami, berilah kami kebaikan di dunia dan kebaikan di akhirat, dan peliharalah kami dari azab neraka.',
                id: 'Ya Tuhan kami, berilah kami kebaikan di dunia dan kebaikan di akhirat dan peliharalah kami dari siksa neraka.',
                fr: 'Notre Seigneur ! Accorde-nous belle part ici-bas, et belle part aussi dans l\'au-delà ; et protège-nous du châtiment du Feu !',
                hi: 'ऐ हमारे रब, हमें दुनिया में भलाई दे और आख़िरत में भी भलाई दे, और हमें आग के अज़ाब से बचा।',
                te: 'ఓ మా ప్రభూ! మాకు ఈ లోకంలోనూ మేలు కలిగించు, పరలోకంలోనూ మేలు కలిగించు మరియు నరకాగ్ని నుండి మమ్మల్ని రక్షించు.',
                ta: 'எங்கள் இறைவா! எகளுக்கு இவ்வுலகிலும் நன்மையை வழங்குவாயாக! மறுமையிலும் நன்மையை வழங்குவாயாக! இன்னும் நரக நெருப்பின் தண்டனையிலிருந்து எங்களைக் காத்தருள்வாயாக!',
                ml: 'ഞങ്ങളുടെ നാഥാ! ഞങ്ങൾക്ക് ഇഹലോകത്ത് നന്മ നൽകേണമേ, പരലോകത്തും നന്മ നൽകേണമേ, നരകശിക്ഷയിൽ നിന്ന് ഞങ്ങളെ കാക്കേണമേ.'
            },
            ref: 'Quran 2:201'
        },
        {
            type: 'hadith',
            ar: 'خَيْرُكُمْ مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ',
            tr: 'Khairukum man ta\'allamal-Qur\'ana wa \'allamahu',
            translations: {
                en: 'The best of you are those who learn the Quran and teach it.',
                bn: 'তোমাদের মধ্যে সেই ব্যক্তিই উত্তম যে কুরআন শিক্ষা করে এবং অন্যকে শিক্ষা দেয়।',
                ur: 'تم میں سے بہترین وہ ہے جو قرآن سیکھے اور سکھائے۔',
                ar: 'خَيْرُكُمْ مَنْ تَعَلَّمَ الْقُرْآنَ وَعَلَّمَهُ',
                tr: 'Sizin en hayırlınız Kur\'an\'ı öğrenen ve öğreteninizdir.',
                ms: 'Sebaik-baik kamu adalah orang yang mempelajari al-Quran dan mengajarkannya.',
                id: 'Sebaik-baik kalian adalah orang yang belajar Al-Qur\'an dan mengajarkannya.',
                fr: 'Le meilleur d\'entre vous est celui qui apprend le Coran et l\'enseigne.',
                hi: 'तुममें सबसे बेहतर वह है जो कुरआन सीखे और दूसरों को सिखाए।',
                te: 'మీలో ఉత్తముడు ఖురాన్‌ను నేర్చుకుని ఇతరులకు నేర్పించేవాడు.',
                ta: 'உங்களில் சிறந்தவர் குர்ஆனைக் கற்றுக்கொண்டு அதைப் பிறருக்குக் கற்பிப்பவரே ஆவார்.',
                ml: 'നിങ്ങളിൽ ഉത്തമൻ ഖുർആൻ പഠിക്കുകയും പഠിപ്പിക്കുകയും ചെയ്യുന്നവനാണ്.'
            },
            ref: 'Bukhari'
        },
        {
            type: 'dua',
            ar: 'رَبِّ اشْرَحْ لِي صَدْرِي وَيَسِّرْ لِي أَمْرِي',
            tr: 'Rabbi-shrah li sadri wa yassir li amri',
            translations: {
                en: 'My Lord, expand my chest and ease my task for me.',
                bn: 'হে আমার পালনকর্তা! আমার বক্ষ প্রশস্ত করে দিন এবং আমার কাজ সহজ করে দিন।',
                ur: 'اے میرے رب! میرا سینہ کھول دے اور میرا کام میرے لیے آسان کر دے۔',
                ar: 'رَبِّ اشْرَحْ لِي صَدْرِي وَيَسِّرْ لِي أَمْرِي',
                tr: 'Rabbim! Gönlümü ferahlat, işimi kolaylaştır.',
                ms: 'Wahai Tuhanku, lapangkanlah bagiku dadaku, dan mudahkanlah bagiku tugasku.',
                id: 'Ya Tuhanku, lapangkanlah untukku dadaku, dan mudahkanlah untukku urusanku.',
                fr: 'Seigneur, ouvre-moi ma poitrine, et facilite-moi ma tâche.',
                hi: 'ऐ मेरे रब! मेरा सीना (दिल) खोल दे और मेरे काम को मेरे लिए आसान कर दे।',
                te: 'ఓ నా ప్రభూ! నా హృదయాన్ని విశాలం చేయి మరియు నా పనిని సులభతరం చేయి.',
                ta: 'என் இறைவா! எனக்காக என் நெஞ்சத்தை விரிவுபடுத்துவாயாக! என் காரியத்தை எனக்கு எளிதாக்குவாயாக!',
                ml: 'എന്റെ നാഥാ! നീ എനിക്ക് എന്റെ ഹൃദയം വിശാലമാക്കിത്തരേണമേ, എന്റെ കാര്യം നീ എനിക്ക് എളുപ്പമാക്കിത്തരേണമേ.'
            },
            ref: 'Quran 20:25-26'
        },
        {
            type: 'hadith',
            ar: 'الْمُسْلِمُ مَنْ سَلِمَ الْمُسْلِمُونَ مِنْ لِسَانِهِ وَيَدِهِ',
            tr: 'Al-Muslimu man salimal-Muslimuna min lisanihi wa yadihi',
            translations: {
                en: 'A Muslim is one from whose tongue and hand other Muslims are safe.',
                bn: 'প্রকৃত মুসলিম সে-ই, যার জিহ্বা ও হাত থেকে অন্য মুসলিমরা নিরাপদ থাকে।',
                ur: 'مسلمان وہ ہے جس کی زبان اور ہاتھ سے دوسرے مسلمان محفوظ رہیں۔',
                ar: 'الْمُسْلِمُ مَنْ سَلِمَ الْمُسْلِمُونَ مِنْ لِسَانِهِ وَيَدِهِ',
                tr: 'Müslüman, dilinden ve elinden Müslümanların emin olduğu kimsedir.',
                ms: 'Seorang Muslim itu adalah orang yang mana orang-orang Muslim yang lain selamat daripada lidahnya dan tangannya.',
                id: 'Muslim adalah seseorang yang orang-orang Muslim lainnya selamat dari lisan dan tangannya.',
                fr: 'Le musulman est celui dont les musulmans sont à l\'abri de sa langue et de sa main.',
                hi: 'मुसलमान वह है जिसके हाथ और ज़बान (बोल) से दूसरे मुसलमान महफूज़ रहें।',
                te: 'నిజమైన ముస్లిం ఎవరు అంటే అతని నాలుక మరియు చేతి నుండి ఇతర ముస్లింలు సురక్షితంగా ఉన్నవాడు.',
                ta: 'முஸ்லிம் என்பவர் எவருடைய நாவு மற்றும் கையின் தீங்குகளிலிருந்து மற்ற முஸ்லிம்கள் பாதுகாப்புப் பெறுகிறார்களோ அவரே ஆவார்.',
                ml: 'ഏതൊരാളുടെ നാവിൽ നിന്നും കയ്യിൽ നിന്നും മറ്റുള്ളവർ സുരക്ഷിതരാണോ അയാളാണ് യഥാർത്ഥ മുസ്ലിം.'
            },
            ref: 'Bukhari & Muslim'
        },
        {
            type: 'dua',
            ar: 'لَا إِلٰهَ إِلَّا أَنتَ سُبْحَانَكَ إِنِّي كُنتُ مِنَ الظَّالِمِينَ',
            tr: 'La ilaha illa Anta subhanaka inni kuntu minadh-dhalimin',
            translations: {
                en: 'There is no deity except You; exalted are You. Indeed, I have been of the wrongdoers.',
                bn: 'আপনি ছাড়া কোনো উপাস্য নেই, আপনি পবিত্র। নিশ্চয়ই আমি পাপিষ্ঠদের অন্তর্ভুক্ত হয়ে গেছি।',
                ur: 'تیرے سوا کوئی معبود نہیں، تو پاک ہے، بے شک میں ہی ظالموں میں سے تھا۔',
                ar: 'لَا إِلٰهَ إِلَّا أَنتَ سُبْحَانَكَ إِنِّي كُنتُ مِنَ الظَّالِمِينَ',
                tr: 'Senden başka ilah yoktur, Seni tenzih ederim. Şüphesiz ben zalimlerden oldum.',
                ms: 'Tiada Tuhan melainkan Engkau, Maha Suci Engkau, sesungguhnya aku adalah dari orang-orang yang zalim.',
                id: 'Tidak ada Tuhan selain Engkau. Maha Suci Engkau, sesungguhnya aku adalah termasuk orang-orang yang zalim.',
                fr: 'Point de divinité à part Toi ! Pureté à Toi ! J\'ai été vraiment du nombre des injustes.',
                hi: 'तेरे सिवा कोई माबूद (ईश्वर) नहीं, तू पाक है, बेशक मैं ही ज़ालिमों में से था।',
                te: 'నీవు తప్ప మరొక ఆరాధ్యుడు లేడు, నీవు మహా పవిత్రుడివి, నిశ్చయంగా నేను అపరాధినైపోయాను.',
                ta: 'உன்னைத் தவிர வணக்கத்திற்குரியவன் வேறு யாருமில்லை; நீ மிகத் தூய்மையானவன்; நிச்சயமாக நான் அநியாயம் செய்பவர்களில் ஒருவனாகிவிட்டேன்.',
                ml: 'നീയല്ലാതെ യാതൊരു ദൈവവുമില്ല, നീ എത്ര പരിശുദ്ധൻ! തീർച്ചയായും ഞാൻ അക്രമികളുടെ കൂട്ടത്തിൽ പെട്ടുപോയിരിക്കുന്നു.'
            },
            ref: 'Quran 21:87'
        },
        {
            type: 'hadith',
            ar: 'مَنْ كَانَ يُؤْمِنُ بِاللَّهِ وَالْيَوْمِ الآخِرِ فَلْيَقُلْ خَيْرًا أَوْ لِيَصْمُتْ',
            tr: 'Man kana yu\'minu billahi wal-yawmil-akhiri falyaqul khairan aw liyasmut',
            translations: {
                en: 'Whoever believes in Allah and the Last Day, let him speak good or remain silent.',
                bn: 'যে ব্যক্তি আল্লাহ ও পরকালের ওপর বিশ্বাস রাখে, সে যেন ভালো কথা বলে অথবা চুপ থাকে।',
                ur: 'جو اللہ اور قیامت کے دن پر ایمان رکھتا ہے وہ اچھی بات کہے یا خاموش رہے۔',
                ar: 'مَنْ كَانَ يُؤْمِنُ بِاللَّهِ وَالْيَوْمِ الآخِرِ فَلْيَقُلْ خَيْرًا أَوْ لِيَصْمُتْ',
                tr: 'Allah\'a ve ahiret gününe iman eden ya hayır söylesin ya da sussun.',
                ms: 'Sesiapa yang beriman dengan Allah dan Hari Akhirat, maka hendaklah dia berkata yang baik atau diam.',
                id: 'Barangsiapa yang beriman kepada Allah dan hari akhir, hendaklah dia berkata yang baik atau diam.',
                fr: 'Que celui qui croit en Allah et au Jour dernier dise du bien ou qu\'il se taise.',
                hi: 'जो व्यक्ति अल्लाह और परलोक के दिन पर ईमान रखता है, उसे चाहिए कि वह अच्छी बात कहे या चुप रहे।',
                te: 'అల్లాహ్‌ను మరియు ప్రళయ దినాన్ని నమ్మే వ్యక్తి మంచి మాట పలకాలి లేదా మౌనంగా ఉండాలి.',
                ta: 'அல்லாஹ்வையும் இறுதி நாளையும் நம்புபவர் நல்லதைப் பேசட்டும்; அல்லது வாய்மூடி மௌனமாக இருக்கட்டும்.',
                ml: 'അല്ലാഹുവിലും അന്ത്യദിനത്തിലും വിശ്വസിക്കുന്നവൻ നല്ലത് സംസാരിക്കട്ടെ, അല്ലെങ്കിൽ മിണ്ടാതിരിക്കട്ടെ.'
            },
            ref: 'Bukhari & Muslim'
        },
        {
            type: 'dua',
            ar: 'حَسْبُنَا اللّٰهُ وَنِعْمَ الْوَكِيلُ',
            tr: 'Hasbunallahu wa ni\'mal-wakil',
            translations: {
                en: 'Sufficient for us is Allah, and He is the best Disposer of affairs.',
                bn: 'আমাদের জন্য আল্লাহই যথেষ্ট এবং তিনি কতই না চমৎকার কর্মবিধায়ক।',
                ur: 'ہمیں اللہ ہی کافی ہے اور وہ بہترین کارساز ہے۔',
                ar: 'حَسْبُنَا اللّٰهُ وَنِعْمَ الْوَكِيلُ',
                tr: 'Allah bize yeter, O ne güzel vekildir.',
                ms: 'Cukuplah Allah bagi kami dan Dialah sebaik-baik Pelindung.',
                id: 'Cukuplah Allah menjadi Penolong kami dan Allah adalah sebaik-baik Pelindung.',
                fr: 'Allah nous suffit; Il est notre meilleur garant.',
                hi: 'हमारे लिए अल्लाह ही काफी है और वह बेहतरीन कार्यसाधक है।',
                te: 'మాకు అల్లాహ్ చాలు, మరియు ఆయన ఉత్తమ కార్యసాధకుడు.',
                ta: 'அல்லாஹ்வே நமக்கு போதுமானவன்; இன்னும் அவன் மிகச் சிறந்த பாதுகாவலன்.',
                ml: 'ഞങ്ങൾക്ക് അല്ലാഹു മതി; അവൻ എത്ര നല്ല ഭാരമേൽപ്പിക്കപ്പെടുന്നവനാണ്.'
            },
            ref: 'Quran 3:173'
        },
        {
            type: 'hadith',
            ar: 'لَا يُؤْمِنُ أَحَدُكُمْ حَتَّى يُحِبَّ لِأَخِيهِ مَا يُحِبُّ لِنَفْسِهِ',
            tr: 'La yu\'minu ahadukum hatta yuhibba li-akhihi ma yuhibbu linafsihi',
            translations: {
                en: 'None of you truly believes until he loves for his brother what he loves for himself.',
                bn: 'তোমাদের কেউ ততক্ষণ পর্যন্ত পূর্ণ মুমিন হতে পারবে না, যতক্ষণ না সে তার ভাইয়ের জন্য তা-ই পছন্দ করে যা সে নিজের জন্য পছন্দ করে।',
                ur: 'تم میں سے کوئی اس وقت تک مومن نہیں ہو سکتا جب تک وہ اپنے بھائی کے لیے وہی پسند نہ کرے جو اپنے لیے کرتا ہے۔',
                ar: 'لَا يُؤْمِنُ أَحَدُكُمْ حَتَّى يُحِبَّ لِأَخِيهِ مَا يُحِبُّ لِنَفْسِهِ',
                tr: 'Sizden biriniz kendisi için istediğini kardeşi için de istemedikçe iman etmiş olmaz.',
                ms: 'Tidak beriman seseorang di antara kamu sehinggalah dia menyayangi untuk saudaranya apa yang dia sayangi untuk dirinya sendiri.',
                id: 'Tidak beriman salah seorang di antara kalian sampai dia mencintai saudaranya seperti dia mencintai dirinya sendiri.',
                fr: 'Aucun de vous ne sera un vrai croyant tant qu\'il n\'aimera pas pour son frère ce qu\'il aime pour lui-même.',
                hi: 'तुममें से कोई तब तक मोमिन (ईमान वाला) नहीं हो सकता जब तक वह अपने भाई के लिए भी वही पसंद न करे जो वह अपने लिए पसंद करता है।',
                te: 'మీలో ఎవరూ తన సోదరుడి కోసం తాను ఇష్టపడేదానిని ఇష్టపడే వరకు విశ్వాసి కాలేడు.',
                ta: 'தனக்கு விரும்புவதையே தன் சகோதரனுக்கும் விரும்பும் வரை உங்களில் எவரும் முழுமையான முஃமின் (இறையச்சமுடையவர்) ஆக முடியாது.',
                ml: 'നിങ്ങളിൽ ഒരാൾ തനിക്ക് ഇഷ്ടപ്പെടുന്നത് തന്റെ സഹോദരനും ഇഷ്ടപ്പെടുന്നത് വരെ വിശ്വാസിയാവുകയില്ല.'
            },
            ref: 'Bukhari & Muslim'
        },
        {
            type: 'dua',
            ar: 'رَبِّ زِدْنِي عِلْمًا',
            tr: 'Rabbi zidni \'ilma',
            translations: {
                en: 'My Lord, increase me in knowledge.',
                bn: 'হে আমার পালনকর্তা! আমার জ্ঞান বৃদ্ধি করে দিন।',
                ur: 'اے میرے رب! میرے علم میں اضافہ فرما۔',
                ar: 'رَبِّ زِدْنِي عِلْمًا',
                tr: 'Rabbim, ilmimi arttır.',
                ms: 'Wahai Tuhanku, tambahilah ilmuku.',
                id: 'Ya Tuhanku, tambahkanlah kepadaku ilmu.',
                fr: 'Seigneur, augmente ma science.',
                hi: 'ऐ मेरे रब! मेरे ज्ञान में वृद्धि कर।',
                te: 'ఓ నా ప్రభూ! నా జ్ఞానాన్ని పెంచు.',
                ta: 'என் இறைவா! எனக்குக் கல்வியை அதிகப்படுத்துவாயாக!',
                ml: 'എന്റെ നാഥാ! നീ എനിക്ക് അറിവ് വർദ്ധിപ്പിച്ചു തരേണമേ.'
            },
            ref: 'Quran 20:114'
        },
        {
            type: 'hadith',
            ar: 'الطُّهُورُ شَطْرُ الْإِيمَانِ',
            tr: 'At-tuhuru shatrul-iman',
            translations: {
                en: 'Cleanliness is half of faith.',
                bn: 'পবিত্রতা ঈমানের অর্ধেক।',
                ur: 'پاکیزگی ایمان کا حصہ ہے۔',
                ar: 'الطُّهُورُ شَطْرُ الْإِيمَانِ',
                tr: 'Temizlik imanın yarısıdır.',
                ms: 'Bersuci itu adalah sebahagian daripada iman.',
                id: 'Bersuci (thaharah) itu setengah daripada iman.',
                fr: 'La pureté est la moitié de la foi.',
                hi: 'पाक-पवित्रता ईमान का आधा हिस्सा है।',
                te: 'శుభ్రత విశ్వాసంలో సగం.',
                ta: 'சுத்தம் ஈமானில் (விசுவாசத்தில்) பாதி ஆகும்.',
                ml: 'ശുദ്ധി വിശ്വാസത്തിന്റെ പകുതിയാകുന്നു.'
            },
            ref: 'Muslim'
        },
        {
            type: 'dua',
            ar: 'رَبَّنَا لَا تُزِغْ قُلُوبَنَا بَعْدَ إِذْ هَدَيْتَنَا وَهَبْ لَنَا مِن لَّدُنكَ رَحْمَةً',
            tr: 'Rabbana la tuzigh qulubana ba\'da idh hadaitana wa hab lana min ladunka rahmah',
            translations: {
                en: 'Our Lord, let not our hearts deviate after You have guided us and grant us mercy from Yourself.',
                bn: 'হে আমাদের প্রভু! সরল পথ প্রদর্শনের পর আমাদের অন্তরকে সত্যলুঙ্খিত করবেন না এবং আপনার পক্ষ থেকে আমাদের রহমত দান করুন।',
                ur: 'اے ہمارے رب! ہمارے دلوں کو ٹیڑھا نہ ہونے دے اس کے بعد کہ تو نے ہمیں ہدایت دی اور ہمیں اپنی طرف سے رحمت عطا فرما۔',
                ar: 'رَبَّنَا لَا تُزِغْ قُلُوبَنَا بَعْدَ إِذْ هَدَيْتَنَا وَهَبْ لَنَا مِن لَّدُنكَ رَحْمَةً',
                tr: 'Rabbimiz! Bizi hidayete erdirdikten sonra kalplerimizi saptırma ve bize katından bir rahmet bağışla.',
                ms: 'Wahai Tuhan kami, janganlah Engkau pesongkan hati kami sesudah Engkau memberi petunjuk kepada kami, dan kurniakanlah kepada kami rahmat dari sisi-Mu.',
                id: 'Ya Tuhan kami, janganlah Engkau jadikan hati kami condong kepada kesesatan sesudah Engkau beri petunjuk kepada kami, dan karuniakanlah kepada kami rahmat dari sisi-Mu.',
                fr: 'Seigneur ! Ne laisse pas dévier nos cœurs après que Tu nous as guidés; et accorde-nous Ta miséricorde.',
                hi: 'ऐ हमारे रब! हमें सीधा रास्ता दिखाने के बाद हमारे दिलों को भटकने न दे, और अपनी तरफ से हमें रहमत (दया) अता कर।',
                te: 'ఓ మా ప్రభూ! నీవు మాకు మార్గదర్శకత్వం చేసిన తర్వాత మా హృదయాలను పక్కదారి పట్టనివ్వకు మరియు నీ తరపు నుండి మాకు కరుణను ప్రసాదించు.',
                ta: 'எங்கள் இறைவா! நீ எங்களுக்கு நேர்வழி காட்டிய பிறகு எங்கள் இதயங்களைத் தடம் புரளச் செய்யாதே! இன்னும் உன் புறத்திலிருந்து எங்களுக்கு அருளை வழங்குவாயாக!',
                ml: 'ഞങ്ങളുടെ നാഥാ! നീ ഞങ്ങളെ നേർവഴിയിലാക്കിയ ശേഷം ഞങ്ങളുടെ ഹൃദയങ്ങളെ നീ തെറ്റിക്കരുതേ, നിന്റെ അടുക്കൽ നിന്നുള്ള കാരുണ്യം നീ ഞങ്ങൾക്ക് നൽകേണമേ.'
            },
            ref: 'Quran 3:8'
        },
        {
            type: 'hadith',
            ar: 'تَبَسُّمُكَ فِي وَجْهِ أَخِيكَ لَكَ صَدَقَةٌ',
            tr: 'Tabassumuka fi wajhi akhika laka sadaqah',
            translations: {
                en: 'Your smile in the face of your brother is charity.',
                bn: 'তোমার ভাইয়ের (হাস্যউজ্জ্বল) মুখের দিকে তাকিয়ে মুচকি হাসিও একটি সদকা।',
                ur: 'تمہارا اپنے بھائی کے سامنے مسکرانا تمہارے لیے صدقہ ہے۔',
                ar: 'تَبَسُّمُكَ فِي وَجْهِ أَخِيكَ لَكَ صَدَقَةٌ',
                tr: 'Gülümsemen senin için bir sadakadır.',
                ms: 'Senyumanmu kepada saudaramu adalah sedekah.',
                id: 'Senyummu di hadapan saudaramu adalah sedekah.',
                fr: 'Ton sourire face à ton frère est pour toi une aumône.',
                hi: 'अपने भाई के सामने तुम्हारा मुस्कुराना भी सदाक़ा (दान) है।',
                te: 'నీ సోదరుని వైపు చూసి నవ్వడం కూడా దానమే.',
                ta: 'உன் சகோதரனின் முகத்தைப் பார்த்து நீ புன்னகைப்பது உனக்கு ஒரு தர்மமாகும்.',
                ml: 'നിന്റെ സഹോദരന്റെ മുഖത്ത് നോക്കിയുള്ള നിന്റെ പുഞ്ചിരി നിനക്ക് ഒരു ധർമ്മമാണ്.'
            },
            ref: 'Tirmidhi'
        },
        {
            type: 'dua',
            ar: 'رَبَّنَا اغْفِرْ لَنَا ذُنُوبَنَا وَإِسْرَافَنَا فِي أَمْرِنَا',
            tr: 'Rabbana-ghfirlana dhunubana wa israfana fi amrina',
            translations: {
                en: 'Our Lord, forgive us our sins and excesses in our affairs.',
                bn: 'হে আমাদের পালনকর্তা! আমাদের গুনাহসমূহ এবং আমাদের কাজে আমাদের বাড়াবাড়িগুলো ক্ষমা করে দিন।',
                ur: 'اے ہمارے رب! ہمارے گناہ معاف فرما اور ہمارے کاموں میں ہماری زیادتیاں بھی۔',
                ar: 'رَبَّنَا اغْفِرْ لَنَا ذُنُوبَنَا وَإِسْرَافَنَا فِي أَمْرِنَا',
                tr: 'Rabbimiz! Günahlarımızı ve işimizdeki taşkınlıklarımızı bağışla.',
                ms: 'Wahai Tuhan kami, ampunkanlah dosa-dosa kami dan keterlanjuran kami dalam urusan kami.',
                id: 'Ya Tuhan kami, ampunilah dosa-dosa kami dan tindakan-tindakan kami yang berlebih-lebihan dalam urusan kami.',
                fr: 'Seigneur, pardonne-nous nos péchés ainsi que nos excès dans nos comportements.',
                hi: 'ऐ हमारे रब! हमारे गुनाह माफ कर और हमारे कामों में हमारी ज़्यादतियों को भी।',
                te: 'ఓ మా ప్రభూ! మా పాపాలను మరియు మా పనులలో మేము చేసిన అతిక్రమణలను క్షమించు.',
                ta: 'எங்கள் இறைவா! எங்கள் பாவங்களையும், எங்கள் காரியங்களில் நாங்கள் செய்த வரம்பு மீறல்களையும் எங்களுக்கு மன்னிப்பாயாக!',
                ml: 'ഞങ്ങളുടെ നാഥാ! ഞങ്ങളുടെ പാപങ്ങളും ഞങ്ങളുടെ കാര്യങ്ങളിലുണ്ടായ അതിക്രമങ്ങളും നീ ഞങ്ങൾക്ക് പൊറുത്തുതരേണമേ.'
            },
            ref: 'Quran 3:147'
        },
        {
            type: 'hadith',
            ar: 'الدُّنْيَا سِجْنُ الْمُؤْمِنِ وَجَنَّةُ الْكَافِرِ',
            tr: 'Ad-dunya sijnul-mu\'min wa jannatul-kafir',
            translations: {
                en: 'This world is a prison for the believer and a paradise for the disbeliever.',
                bn: 'দুনিয়া মুমিনের জন্য কারাগার এবং কাফিরের জন্য জান্নাত।',
                ur: 'دنیا مومن کے لیے قید خانہ اور کافر کے لیے جنت ہے۔',
                ar: 'الدُّنْيَا سِجْنُ الْمُؤْمِنِ وَجَنَّةُ الْكَافِرِ',
                tr: 'Dünya müminin zindanı, kafirin cennetidir.',
                ms: 'Dunia adalah penjara bagi orang mukmin dan syurga bagi orang kafir.',
                id: 'Dunia adalah penjara bagi orang mukmin dan surga bagi orang kafir.',
                fr: 'Le bas-monde est la prison du croyant et le paradis du mécréant.',
                hi: 'दुनिया मोमिन के लिए जेलखाना है और काफिर के लिए जन्नत।',
                te: 'ఈ ప్రపంచం విశ్వాసికి చెరసాల మరియు అవిశ్వాసికి స్వర్గం.',
                ta: 'இவ்வுலகம் முஃமினுக்குச் (இறையச்சமுடையவருக்கு) சிறைச்சாலையாகும்; காஃபிருக்கு (சத்தியத்தை நிராகரிப்பவருக்கு) சுவனமாகும்.',
                ml: 'ദുനിയാവ് സത്യവിശ്വാസിക്ക് തടവറയും സത്യനിഷേധിക്ക് സ്വർഗ്ഗവുമാണ്.'
            },
            ref: 'Muslim'
        },
        {
            type: 'dua',
            ar: 'رَبِّ أَوْزِعْنِي أَنْ أَشْكُرَ نِعْمَتَكَ الَّتِي أَنْعَمْتَ عَلَيَّ',
            tr: 'Rabbi awzi\'ni an ashkura ni\'mataka-llati an\'amta \'alayya',
            translations: {
                en: 'My Lord, enable me to be grateful for Your favor which You have bestowed upon me.',
                bn: 'হে আমার পালনকর্তা! আমাকে সামর্থ্য দিন যাতে আমি আপনার সেই নেয়ামতের কৃতজ্ঞতা প্রকাশ করতে পারি যা আপনি আমাকে দান করেছেন।',
                ur: 'اے میرے رب! مجھے توفیق دے کہ میں تیری اس نعمت کا شکر ادا کروں جو تو نے مجھ پر کی ہے۔',
                ar: 'رَبِّ أَوْزِعْنِي أَنْ أَشْكُرَ نِعْمَتَكَ الَّتِي أَنْعَمْتَ عَلَيَّ',
                tr: 'Rabbim! Bana verdiğin nimete şükretmemi nasip eyle.',
                ms: 'Wahai Tuhanku, ilhamkanlah daku supaya tetap bersyukur akan nikmat-Mu yang Engkau kurniakan kepadaku.',
                id: 'Ya Tuhanku, berilah aku ilham untuk tetap mensyukuri nikmat-Mu yang telah Engkau anugerahkan kepadaku.',
                fr: 'Seigneur ! Permets-moi d\'être reconnaissant pour le bienfait dont Tu m\'as comblé.',
                hi: 'ऐ मेरे रब! मुझे तौफीक दे कि मैं तेरी उन नेमतों का शुक्र अदा करूँ जो तूने मुझ पर की हैं।',
                te: 'ఓ నా ప్రభూ! నీవు నాకు ప్రసాదించిన నీ ఉపకారానికి కృతజ్ఞతగా ఉండటానికి నాకు శక్తినివ్వు.',
                ta: 'என் இறைவா! நீ எனக்குச் செய்த உன்னுடைய அருட்கொடைகளுக்காக நான் நன்றி செலுத்த எனக்கு அருள்புரிவாயாக!',
                ml: 'എന്റെ നാഥാ! നീ എനിക്കും എന്റെ മാതാപിതാക്കൾക്കും നൽകിയ അനുഗ്രഹത്തിന് നന്ദി കാണിക്കാൻ എനിക്ക് നീ കരുത്തേണമേ.'
            },
            ref: 'Quran 27:19'
        },
        {
            type: 'hadith',
            ar: 'إِنَّ اللّٰهَ جَمِيلٌ يُحِبُّ الْجَمَالَ',
            tr: 'Innallaha jamilun yuhibbul-jamal',
            translations: {
                en: 'Indeed Allah is Beautiful and He loves beauty.',
                bn: 'নিশ্চয়ই আল্লাহ সুন্দর এবং তিনি সৌন্দর্য পছন্দ করেন।',
                ur: 'بیشک اللہ خوبصورت ہے اور خوبصورتی کو پسند کرتا ہے۔',
                ar: 'إِنَّ اللّٰهَ جَمِيلٌ يُحِبُّ الْجَمَالَ',
                tr: 'Şüphesiz Allah güzeldir, güzelliği sever.',
                ms: 'Sesungguhnya Allah itu indah dan Dia menyukai keindahan.',
                id: 'Sesungguhnya Allah itu indah dan menyukai keindahan.',
                fr: 'Certes, Allah est Beau et Il aime la beauté.',
                hi: 'बेशक अल्लाह सुंदर है और वह सुंदरता को पसंद करता है।',
                te: 'నిశ్చయంగా అల్లాహ్ అందమైనవాడు మరియు ఆయన అందాన్ని ప్రేమిస్తాడు.',
                ta: 'நிச்சயமாக அல்லாஹ் அழகானவன்; அவன் அழகையே விரும்புகிறான்.',
                ml: 'തീർച്ചയായും അല്ലാഹു ഭംഗിയുള്ളവനാണ്, അവൻ ഭംഗി ഇഷ്ടപ്പെടുന്നു.'
            },
            ref: 'Muslim'
        },
        {
            type: 'dua',
            ar: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ الْهُدَى وَالتُّقَى وَالْعَفَافَ وَالْغِنَى',
            tr: 'Allahumma inni as-alukal-huda wat-tuqa wal-\'afafa wal-ghina',
            translations: {
                en: 'O Allah, I ask You for guidance, piety, chastity and self-sufficiency.',
                bn: 'হে আল্লাহ! আমি আপনার কাছে হেদায়াত, তাকওয়া, চারিত্রিক পবিত্রতা এবং সচ্ছলতা প্রার্থনা করছি।',
                ur: 'اے اللہ! میں تجھ سے ہدایت، تقویٰ، پاکدامنی اور غنا (بے نیازی) کا سوال کرتا ہوں۔',
                ar: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ الْهُدَى وَالتُّقَى وَالْعَفَافَ وَالْغِنَى',
                tr: 'Allah\'ım! Senden hidayet, takva, iffet ve gönül zenginliği isterim.',
                ms: 'Ya Allah, sesungguhnya aku memohon kepada-Mu petunjuk, ketakwaan, sifat iffah dan kekayaan.',
                id: 'Ya Allah, aku memohon kepada-Mu petunjuk, ketakwaan, kesucian diri, dan kecukupan.',
                fr: 'Ô Allah, je Te demande l\'orientation, la piété, la chasteté et la suffisance.',
                hi: 'ऐ अल्लाह! मैं तुझसे हिदायत, परहेज़गारी, पाकीज़गी और बे-नियाज़ी (आत्मनिर्भरता) का सवाल करता हूँ।',
                te: 'ఓ అల్లాహ్! నేను నిన్ను మార్గదర్శకత్వం, దైవభీతి, పవిత్రత మరియు స్వావలంబన కోరుతున్నాను.',
                ta: 'யா அல்லாஹ்! நான் உன்னிடம் நேர்வழியையும், இறையச்சத்தையும், ஒழுக்கத்தையும், போதுமென்ற மனத்தையும் வேண்டுகிறேன்.',
                ml: 'അല്ലാഹുവേ! നിന്നോട് ഞാൻ നേർവഴിയും, സൂക്ഷ്മതയും, സദാചാരനിഷ്ഠയും, ഐശ്വര്യവും ചോദിക്കുന്നു.'
            },
            ref: 'Muslim'
        },
        {
            type: 'hadith',
            ar: 'مَنْ سَلَكَ طَرِيقًا يَلْتَمِسُ فِيهِ عِلْمًا سَهَّلَ اللَّهُ لَهُ بِهِ طَرِيقًا إِلَى الْجَنَّةِ',
            tr: 'Man salaka tariqan yaltamisu fihi \'ilman sahalallahu lahu bihi tariqan ilal-Jannah',
            translations: {
                en: 'Whoever follows a path seeking knowledge, Allah will make easy for him a path to Paradise.',
                bn: 'যে ব্যক্তি জ্ঞান অন্বেষণের পথে চলবে, আল্লাহ তার জন্য জান্নাতের পথ সুগম করে দেবেন।',
                ur: 'جو علم کی تلاش میں کسی راستے پر چلے، اللہ اس کے لیے جنت کا راستہ آسان کر دیتا ہے۔',
                ar: 'مَنْ سَلَكَ طَرِيقًا يَلْتَمِسُ فِيهِ عِلْمًا سَهَّلَ اللَّهُ لَهُ بِهِ طَرِيقًا إِلَى الْجَنَّةِ',
                tr: 'Kim ilim öğrenmek için bir yola girerse, Allah ona cennete giden yolu kolaylaştırır.',
                ms: 'Sesiapa yang menempuh jalan untuk mencari ilmu, maka Allah akan memudahkan baginya jalan ke syurga.',
                id: 'Barangsiapa menempuh suatu jalan untuk mencari ilmu, maka Allah akan memudahkan baginya jalan menuju surga.',
                fr: 'Celui qui emprunte un chemin pour rechercher une science, Allah lui facilite un chemin vers le Paradis.',
                hi: 'जो व्यक्ति इल्म (ज्ञान) की तलाश में किसी रास्ते पर चले, अल्लाह उसके लिए जन्नत का रास्ता आसान कर देता है।',
                te: 'జ్ఞానాన్ని కోరుతూ ఎవరైనా ఒక మార్గంలో ప్రయాణిస్తే, అల్లాహ్ అతని కోసం స్వర్గానికి వెళ్ళే మార్గాన్ని సులభతరం చేస్తాడు.',
                ta: 'கல்வியைத் தேடி ஒருவர் ஒரு பாதையில் நடந்தால், அதன் மூலம் அவருக்குச் சுவனத்திற்கான பாதையை அல்லாஹ் எளிதாக்குகிறான்.',
                ml: 'അറിവ് തേടിക്കൊണ്ട് ആരെങ്കിലും ഒരു വഴിയിൽ സഞ്ചരിച്ചാൽ അല്ലാഹു അവർക്ക് സ്വർഗ്ഗത്തിലേക്കുള്ള വഴി എളുപ്പമാക്കിക്കൊടുക്കും.'
            },
            ref: 'Muslim'
        },
        {
            type: 'dua',
            ar: 'رَبَّنَا هَبْ لَنَا مِنْ أَزْوَاجِنَا وَذُرِّيَّاتِنَا قُرَّةَ أَعْيُنٍ',
            tr: 'Rabbana hab lana min azwajina wa dhurriyyatina qurrata a\'yun',
            translations: {
                en: 'Our Lord, grant us from our spouses and offspring comfort to our eyes.',
                bn: 'হে আমাদের পালনকর্তা! আমাদের স্ত্রীদের এবং সন্তানদের পক্ষ থেকে আমাদের চোখের শীতলতা দান করুন।',
                ur: 'اے ہمارے رب! ہمیں اپنی بیویوں اور اپنی اولاد سے آنکھوں کی ٹھنڈک عطا فرما۔',
                ar: 'رَبَّنَا هَبْ لَنَا مِنْ أَزْوَاجِنَا وَذُرِّيَّاتِنَا قُرَّةَ أَعْيُنٍ',
                tr: 'Rabbimiz! Bize eşlerimizden ve çocuklarımızdan gözümüzün aydınlığı olacak nesiller ihsan et.',
                ms: 'Wahai Tuhan kami, berilah kami beroleh dari isteri-isteri dan zuriat keturunan kami perkara-perkara yang menyukakan hati.',
                id: 'Ya Tuhan kami, anugerahkanlah kepada kami istri-istri kami dan keturunan kami sebagai penyenang hati (kami).',
                fr: 'Notre Seigneur ! Accorde-nous de nos épouses et de notre descendance la joie des yeux.',
                hi: 'ऐ हमारे रब! हमें हमारी पत्नियों और हमारी औलाद की तरफ से आँखों की ठंडक अता कर।',
                te: 'ఓ మా ప్రభూ! మా జీవిత భాగస్వాముల నుండి మరియు మా సంతానం నుండి మాకు కనువిందును ప్రసాదించు.',
                ta: 'எங்கள் இறைவா! எங்கள் துணைவியரிடமிருந்தும், எங்கள் சந்ததியினரிடமிருந்தும் எங்களுக்குக் கண் குளிர்ச்சியைத் தந்தருள்வாயாக!',
                ml: 'ഞങ്ങളുടെ നാഥാ! ഞങ്ങളുടെ ഇണകളിൽ നിന്നും സന്താനങ്ങളിൽ നിന്നും ഞങ്ങൾക്ക് നീ കൺകുളിർമ നൽകേണമേ.'
            },
            ref: 'Quran 25:74'
        },
        {
            type: 'hadith',
            ar: 'الْكَلِمَةُ الطَّيِّبَةُ صَدَقَةٌ',
            tr: 'Al-kalimatut-tayyibatu sadaqah',
            translations: {
                en: 'A good word is charity.',
                bn: 'ভালো কথা বলাও একটি সদকা।',
                ur: 'اچھی بات کہنا بھی صدقہ ہے۔',
                ar: 'الْكَلِمَةُ الطَّيِّبَةُ صَدَقَةٌ',
                tr: 'Güzel söz sadakadır.',
                ms: 'Perkataan yang baik itu adalah sedekah.',
                id: 'Perkataan yang baik adalah sedekah.',
                fr: 'Une bonne parole est une aumône.',
                hi: 'अच्छी बात कहना भी सदाक़ा (दान) है।',
                te: 'మంచి మాట పలకడం కూడా దానమే.',
                ta: 'நல்ல சொல் ஒரு தர்மமாகும்.',
                ml: 'നല്ല വാക്ക് ഒരു ധർമ്മമാണ്.'
            },
            ref: 'Bukhari & Muslim'
        },
        {
            type: 'dua',
            ar: 'اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْهَمِّ وَالْحَزَنِ',
            tr: 'Allahumma inni a\'udhu bika minal-hammi wal-hazan',
            translations: {
                en: 'O Allah, I seek refuge in You from anxiety and sorrow.',
                bn: 'হে আল্লাহ! আমি আপনার কাছে উদ্বেগ ও শোক থেকে আশ্রয় প্রার্থনা করছি।',
                ur: 'اے اللہ! میں فکر اور غم سے تیری پناہ مانگتا ہوں۔',
                ar: 'اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْهَمِّ وَالْحَزَنِ',
                tr: 'Allah\'ım! Gam ve kederden Sana sığınırım.',
                ms: 'Ya Allah, sesungguhnya aku berlindung kepada-Mu daripada kegelisahan dan kedukaan.',
                id: 'Ya Allah, sesungguhnya aku berlindung kepada-Mu dari keluh kesah dan kesedihan.',
                fr: 'Ô Allah, je cherche refuge auprès de Toi contre l\'anxiété et la tristesse.',
                hi: 'ऐ अल्लाह! मैं चिंता और शोक से तेरी पناہ मांगता हूँ।',
                te: 'ఓ అల్లాహ్! నేను ఆందోళన మరియు విచారం నుండి నీ శరణు కోరుతున్నాను.',
                ta: 'யா அல்லாஹ்! கவலையிலிருந்தும் துக்கத்திலிருந்தும் உன்னிடம் நான் பாதுகாப்புத் தேடுகிறேன்.',
                ml: 'അല്ലാഹുവേ! ഉത്കണ്ഠയിൽ നിന്നും ദുഃഖത്തിൽ നിന്നും ഞാൻ നിന്നോട് കാവൽ ചോദിക്കുന്നു.'
            },
            ref: 'Bukhari'
        },
        {
            type: 'hadith',
            ar: 'الصَّدَقَةُ تُطْفِئُ الْخَطِيئَةَ كَمَا يُطْفِئُ الْمَاءُ النَّارَ',
            tr: 'As-sadaqatu tutfi\'ul-khati\'ata kama yutfi\'ul-ma\'un-nar',
            translations: {
                en: 'Charity extinguishes sin as water extinguishes fire.',
                bn: 'দান-সদকা গুনাহকে নিভিয়ে দেয় যেমনভাবে পানি আগুনকে নিভিয়ে দেয়।',
                ur: 'صدقہ گناہ کو ایسے بجھا دیتا ہے جیسے پانی آگ کو بجھا دیتا ہے۔',
                ar: 'الصَّدَقَةُ تُطْفِئُ الْخَطِيئَةَ كَمَا يُطْفِئُ الْمَاءُ النَّارَ',
                tr: 'Sadaka, suyun ateşi söndürdüğü gibi günahları söndürür.',
                ms: 'Sedekah itu menghapuskan dosa sebagaimana air memadamkan api.',
                id: 'Sedekah dapat menghapus dosa sebagaimana air memadamkan api.',
                fr: 'L\'aumône éteint le péché comme l\'eau éteint le feu.',
                hi: 'सदाक़ा (दान) गुनाहों को वैसे ही मिटा देता है जैसे पानी आग को बुझा देता है।',
                te: 'నీరు నిప్పును ఆర్పేసినట్లుగా దానం పాపాలను తుడిచివేస్తుంది.',
                ta: 'தண்ணீர் நெருப்பை அணைப்பதைப் போல், தர்மம் பாவங்களை அழித்துவிடும்.',
                ml: 'വെള്ളം തീയെ കെടുത്തുന്നത് പോലെ ധർമ്മം പാപങ്ങളെ ഇല്ലാതാക്കുന്നു.'
            },
            ref: 'Tirmidhi'
        },
        {
            type: 'dua',
            ar: 'رَبِّ هَبْ لِي حُكْمًا وَأَلْحِقْنِي بِالصَّالِحِينَ',
            tr: 'Rabbi hab li hukman wa al-hiqni bis-salihin',
            translations: {
                en: 'My Lord, grant me wisdom and join me with the righteous.',
                bn: 'হে আমার পালনকর্তা! আমাকে প্রজ্ঞা দান করুন এবং আমাকে সৎকর্মশীলদের অন্তর্ভুক্ত করুন।',
                ur: 'اے میرے رب! مجھے حکمت عطا فرما اور مجھے نیک لوگوں کے ساتھ ملا دے۔',
                ar: 'رَبِّ هَبْ لِي حُكْمًا وَأَلْحِقْنِي بِالصَّالِحِينَ',
                tr: 'Rabbim! Bana hikmet ver ve beni salihlere kat.',
                ms: 'Wahai Tuhanku, berikanlah daku hikmat, dan hubungkanlah daku dengan orang-orang yang soleh.',
                id: 'Ya Tuhanku, berikanlah kepadaku hikmah dan pertemukanlah aku dengan orang-orang yang saleh.',
                fr: 'Seigneur, accorde-moi la sagesse et joins-moi aux gens de bien.',
                hi: 'ऐ मेरे रब! मुझे हिकमत (बुद्धिमत्ता) अता कर और मुझे नेक लोगों में शामिल कर।',
                te: 'ఓ నా ప్రభూ! నాకు జ్ఞానాన్ని ప్రసాదించు మరియు నన్ను పుణ్యాత్ములతో చేర్చు.',
                ta: 'என் இறைவா! எனக்கு ஞானத்தை வழங்குவாயாக! இன்னும் என்னை நல்லடியார்களுடன் சேர்த்து வைப்பாயாக!',
                ml: 'എന്റെ നാഥാ! നീ എനിക്ക് ജ്ഞാനം നൽകേണമേ, എന്നെ നീ സജ്ജനങ്ങളുടെ കൂട്ടത്തിൽ ചേർക്കേണമേ.'
            },
            ref: 'Quran 26:83'
        },
        {
            type: 'hadith',
            ar: 'لَا تَحَاسَدُوا وَلَا تَنَاجَشُوا وَلَا تَبَاغَضُوا',
            tr: 'La tahasadu wa la tanajashu wa la tabaghadu',
            translations: {
                en: 'Do not envy one another, do not inflate prices, do not hate one another.',
                bn: 'তোমরা একে অপরের প্রতি হিংসা করো না, কেনাবেচায় ধোঁকা দিও না এবং একে অপরের প্রতি বিদ্বেষ পোষণ করো না।',
                ur: 'ایک دوسرے سے حسد نہ کرو، دھوکہ دہی سے بولی نہ بڑھاؤ، اور ایک دوسرے سے بغض نہ رکھو۔',
                ar: 'لَا تَحَاسَدُوا وَلَا تَنَاجَشُوا وَلَا تَبَاغَضُوا',
                tr: 'Birbirinize haset etmeyin, alışverişte birbirinizi aldatmayın, birbirinize buğzetmeyin.',
                ms: 'Janganlah kamu hasad-menghasad, janganlah kamu tipu-menipu, janganlah kamu benci-membenci.',
                id: 'Janganlah kalian saling mendengki, janganlah kalian saling menipu, janganlah kalian saling membenci.',
                fr: 'Ne vous enviez pas les uns les autres, ne surenchérissez pas, ne vous haïssez pas.',
                hi: 'एक दूसरे से हसद (जलन) न करो, खरीदारी में धोखा न दो, और एक दूसरे से नफरत न करो।',
                te: 'ఒకరిపై ఒకరు అసూయ పడకండి, తప్పుడు ధరలు పెంచకండి, ఒకరినొకరు ద్వేషించుకోకండి.',
                ta: 'நீங்கள் ஒருவருக்கொருவர் பொறாமை கொள்ளாதீர்கள்; விலையை உயர்த்துவதற்காக வியாபாரத்தில் மோசடி செய்யாதீர்கள்; ஒருவருக்கொருவர் பகைத்துக் கொள்ளாதீர்கள்.',
                ml: 'നിങ്ങൾ പരസ്പരം അസൂയപ്പെടരുത്, കച്ചവടത്തിൽ കൃത്രിമം കാണിക്കരുത്, പരസ്പരം വിദ്വേഷം വെച്ചുപുലർത്തരുത്.'
            },
            ref: 'Muslim'
        },
        {
            type: 'dua',
            ar: 'اللَّهُمَّ اجْعَلْ فِي قَلْبِي نُورًا وَفِي بَصَرِي نُورًا',
            tr: 'Allahummaj-\'al fi qalbi nuran wa fi basari nuran',
            translations: {
                en: 'O Allah, place light in my heart and light in my sight.',
                bn: 'হে আল্লাহ! আমার হৃদয়ে নূর দান করুন এবং আমার দৃষ্টিতে নূর দান করুন।',
                ur: 'اے اللہ! میرے دل میں نور پیدا کر دے اور میری بصارت میں نور پیدا کر دے۔',
                ar: 'اللَّهُمَّ اجْعَلْ فِي قَلْبِي نُورًا وَفِي بَصَرِي نُورًا',
                tr: 'Allah\'ım! Kalbime nur ver, gözüme nur ver.',
                ms: 'Ya Allah, jadikanlah cahaya dalam hatiku dan cahaya pada penglihatanku.',
                id: 'Ya Allah, jadikanlah cahaya dalam hatiku dan cahaya pada pandanganku.',
                fr: 'Ô Allah, place une lumière dans mon cœur et une lumière dans ma vue.',
                hi: 'ऐ अल्लाह! मेरे दिल में नूर पैदा कर और मेरी आँखों (दृष्टि) में नूर पैदा कर।',
                te: 'ఓ అల్లాహ్! నా హృదయంలో కాంతిని మరియు నా దృష్టిలో కాంతిని నింపు.',
                ta: 'யா அல்லாஹ்! என் உள்ளத்தில் ஒளியையும், என் பார்வையில் ஒளியையும் ஏற்படுத்துவாயாக!',
                ml: 'അല്ലാഹുവേ! എന്റെ ഹൃദയത്തിൽ പ്രകാശവും എന്റെ കാഴ്ചയിൽ പ്രകാശവും നീ നൽകേണമേ.'
            },
            ref: 'Bukhari & Muslim'
        },
        {
            type: 'hadith',
            ar: 'خَيْرُ النَّاسِ أَنْفَعُهُمْ لِلنَّاسِ',
            tr: 'Khairun-nasi anfa\'uhum lin-nas',
            translations: {
                en: 'The best of people are those most beneficial to people.',
                bn: 'মানুষের মধ্যে সেই ব্যক্তিই উত্তম, যে মানুষের জন্য সবচেয়ে বেশি কল্যাণকর।',
                ur: 'لوگوں میں بہترین وہ ہے جو لوگوں کے لیے سب سے زیادہ فائدہ مند ہو۔',
                ar: 'خَيْرُ النَّاسِ أَنْفَعُهُمْ لِلنَّاسِ',
                tr: 'İnsanların en hayırlısı, insanlara en faydalı olanıdır.',
                ms: 'Sebaik-baik manusia adalah yang paling bermanfaat bagi manusia yang lain.',
                id: 'Sebaik-baik manusia adalah yang paling bermanfaat bagi manusia lainnya.',
                fr: 'Le meilleur des hommes est celui qui est le plus utile aux hommes.',
                hi: 'लोगों में सबसे बेहतर वह है जो लोगों के लिए सबसे ज़्यादा फायदेमंद हो।',
                te: 'మనుషుల్లో ఉత్తముడు ఎవరంటే ఇతరులకు అత్యధిక ప్రయోజనం చేకూర్చేవాడు.',
                ta: 'மக்களில் சிறந்தவர் எவர் என்றால், மனிதர்களுக்கு அதிகப் பயன் தருபவரே ஆவார்.',
                ml: 'ജനങ്ങളിൽ ഉത്തമൻ ജനങ്ങൾക്ക് പ്രയോജനപ്പെടുന്നവനാണ്.'
            },
            ref: 'Daraqutni'
        },
        {
            type: 'dua',
            ar: 'رَبَّنَا تَقَبَّلْ مِنَّا إِنَّكَ أَنتَ السَّمِيعُ الْعَلِيمُ',
            tr: 'Rabbana taqabbal minna innaka Antas-Sami\'ul-\'Alim',
            translations: {
                en: 'Our Lord, accept from us. Indeed You are the Hearing, the Knowing.',
                bn: 'হে আমাদের পালনকর্তা! আমাদের পক্ষ থেকে কবুল করুন। নিশ্চয়ই আপনি শ্রবণকারী ও সর্বজ্ঞ।',
                ur: 'اے ہمارے رب! ہم سے قبول فرما، بیشک تو ہی سننے والا اور جاننے والا ہے۔',
                ar: 'رَبَّنَا تَقَبَّلْ مِنَّا إِنَّكَ أَنتَ السَّمِيعُ الْعَلِيمُ',
                tr: 'Rabbimiz! Bizden kabul et. Şüphesiz Sen, işitensin, bilensin.',
                ms: 'Wahai Tuhan kami, terimalah daripada kami, sesungguhnya Engkaulah Yang Maha Mendengar, lagi Maha Mengetahui.',
                id: 'Ya Tuhan kami, terimalah (amal) dari kami. Sungguh, Engkaulah Yang Maha Mendengar, Maha Mengetahui.',
                fr: 'Notre Seigneur ! Accepte ceci de notre part ! Car c\'est Toi l\'Audient, l\'Omniscient.',
                hi: 'ऐ हमारे रब! हमसे (यह इबादत) कबूल फरमा। बेशक तू ही सुनने वाला और जानने वाला है।',
                te: 'ఓ మా ప్రభూ! మా నుండి అంగీకరించు. నిశ్చయంగా నీవు వినేవాడివి మరియు తెలిసినవాడివి.',
                ta: 'எங்கள் இறைவா! எங்களிடமிருந்து (இதைப்) பெற்றுக் கொள்வாயாக! நிச்சயமாக நீயே (யாவற்றையும்) செவியேற்பவனாகவும், அறிபவனாகவும் இருக்கிறாய்.',
                ml: 'ഞങ്ങളുടെ നാഥാ! ഞങ്ങളിൽ നിന്ന് നീ സ്വീകരിക്കേണമേ. തീർച്ചയായും നീ എല്ലാം കേൾക്കുന്നവനും അറിയുന്നവനുമാകുന്നു.'
            },
            ref: 'Quran 2:127'
        },
        {
            type: 'hadith',
            ar: 'مَا نَقَصَتْ صَدَقَةٌ مِنْ مَالٍ',
            tr: 'Ma naqasat sadaqatun min malin',
            translations: {
                en: 'Wealth does not decrease because of charity.',
                bn: 'সদকা করার কারণে কখনো সম্পদ কমে যায় না।',
                ur: 'صدقہ سے مال کم نہیں ہوتا۔',
                ar: 'مَا نَقَصَتْ صَدَقَةٌ مِنْ مَالٍ',
                tr: 'Sadaka vermekle mal eksilmez.',
                ms: 'Sedekah itu tidak mengurangkan harta.',
                id: 'Sedekah tidak akan mengurangi harta.',
                fr: 'L\'aumône ne diminue en rien la richesse.',
                hi: 'सदाक़ा (दान) देने से धन कम नहीं होता।',
                te: 'దానం చేయడం వల్ల సంపద తగ్గదు.',
                ta: 'தர்மம் செய்வதால் செல்வம் குறைந்து போவதில்லை.',
                ml: 'ദാനധർമ്മം കാരണം സമ്പത്ത് കുറയുകയില്ല.'
            },
            ref: 'Muslim'
        }
    ];

    // ── 99 Names of Allah ──
    const NAMES_OF_ALLAH = [
        { num: 1, ar: 'ٱلرَّحْمَـٰنُ', en: 'Ar-Rahman', meaning: 'The Most Gracious' },
        { num: 2, ar: 'ٱلرَّحِيمُ', en: 'Ar-Raheem', meaning: 'The Most Merciful' },
        { num: 3, ar: 'ٱلْمَلِكُ', en: 'Al-Malik', meaning: 'The King' },
        { num: 4, ar: 'ٱلْقُدُّوسُ', en: 'Al-Quddus', meaning: 'The Most Holy' },
        { num: 5, ar: 'ٱلسَّلَامُ', en: 'As-Salam', meaning: 'The Source of Peace' },
        { num: 6, ar: 'ٱلْمُؤْمِنُ', en: 'Al-Mu\'min', meaning: 'The Granter of Security' },
        { num: 7, ar: 'ٱلْمُهَيْمِنُ', en: 'Al-Muhaymin', meaning: 'The Guardian' },
        { num: 8, ar: 'ٱلْعَزِيزُ', en: 'Al-Aziz', meaning: 'The Almighty' },
        { num: 9, ar: 'ٱلْجَبَّارُ', en: 'Al-Jabbar', meaning: 'The Compeller' },
        { num: 10, ar: 'ٱلْمُتَكَبِّرُ', en: 'Al-Mutakabbir', meaning: 'The Supreme' },
        { num: 11, ar: 'ٱلْخَالِقُ', en: 'Al-Khaliq', meaning: 'The Creator' },
        { num: 12, ar: 'ٱلْبَارِئُ', en: 'Al-Bari', meaning: 'The Originator' },
        { num: 13, ar: 'ٱلْمُصَوِّرُ', en: 'Al-Musawwir', meaning: 'The Fashioner' },
        { num: 14, ar: 'ٱلْغَفَّارُ', en: 'Al-Ghaffar', meaning: 'The Forgiver' },
        { num: 15, ar: 'ٱلْقَهَّارُ', en: 'Al-Qahhar', meaning: 'The Subduer' },
        { num: 16, ar: 'ٱلْوَهَّابُ', en: 'Al-Wahhab', meaning: 'The Bestower' },
        { num: 17, ar: 'ٱلرَّزَّاقُ', en: 'Ar-Razzaq', meaning: 'The Provider' },
        { num: 18, ar: 'ٱلْفَتَّاحُ', en: 'Al-Fattah', meaning: 'The Opener' },
        { num: 19, ar: 'ٱلْعَلِيمُ', en: 'Al-Aleem', meaning: 'The All-Knowing' },
        { num: 20, ar: 'ٱلْقَابِضُ', en: 'Al-Qabid', meaning: 'The Restrainer' },
        { num: 21, ar: 'ٱلْبَاسِطُ', en: 'Al-Basit', meaning: 'The Extender' },
        { num: 22, ar: 'ٱلْخَافِضُ', en: 'Al-Khafid', meaning: 'The Abaser' },
        { num: 23, ar: 'ٱلرَّافِعُ', en: 'Ar-Rafi', meaning: 'The Exalter' },
        { num: 24, ar: 'ٱلْمُعِزُّ', en: 'Al-Mu\'izz', meaning: 'The Honorer' },
        { num: 25, ar: 'ٱلْمُذِلُّ', en: 'Al-Mudhill', meaning: 'The Humiliator' },
        { num: 26, ar: 'ٱلسَّمِيعُ', en: 'As-Sami', meaning: 'The All-Hearing' },
        { num: 27, ar: 'ٱلْبَصِيرُ', en: 'Al-Basir', meaning: 'The All-Seeing' },
        { num: 28, ar: 'ٱلْحَكَمُ', en: 'Al-Hakam', meaning: 'The Judge' },
        { num: 29, ar: 'ٱلْعَدْلُ', en: 'Al-Adl', meaning: 'The Just' },
        { num: 30, ar: 'ٱللَّطِيفُ', en: 'Al-Latif', meaning: 'The Subtle' },
        { num: 31, ar: 'ٱلْخَبِيرُ', en: 'Al-Khabir', meaning: 'The All-Aware' },
        { num: 32, ar: 'ٱلْحَلِيمُ', en: 'Al-Haleem', meaning: 'The Forbearing' },
        { num: 33, ar: 'ٱلْعَظِيمُ', en: 'Al-Azeem', meaning: 'The Magnificent' },
        { num: 34, ar: 'ٱلْغَفُورُ', en: 'Al-Ghafur', meaning: 'The All-Forgiving' },
        { num: 35, ar: 'ٱلشَّكُورُ', en: 'Ash-Shakur', meaning: 'The Grateful' },
        { num: 36, ar: 'ٱلْعَلِيُّ', en: 'Al-Ali', meaning: 'The Most High' },
        { num: 37, ar: 'ٱلْكَبِيرُ', en: 'Al-Kabir', meaning: 'The Greatest' },
        { num: 38, ar: 'ٱلْحَفِيظُ', en: 'Al-Hafiz', meaning: 'The Preserver' },
        { num: 39, ar: 'ٱلْمُقِيتُ', en: 'Al-Muqit', meaning: 'The Sustainer' },
        { num: 40, ar: 'ٱلْحَسِيبُ', en: 'Al-Hasib', meaning: 'The Reckoner' },
        { num: 41, ar: 'ٱلْجَلِيلُ', en: 'Al-Jalil', meaning: 'The Majestic' },
        { num: 42, ar: 'ٱلْكَرِيمُ', en: 'Al-Karim', meaning: 'The Generous' },
        { num: 43, ar: 'ٱلرَّقِيبُ', en: 'Ar-Raqib', meaning: 'The Watchful' },
        { num: 44, ar: 'ٱلْمُجِيبُ', en: 'Al-Mujib', meaning: 'The Responsive' },
        { num: 45, ar: 'ٱلْوَاسِعُ', en: 'Al-Wasi', meaning: 'The All-Encompassing' },
        { num: 46, ar: 'ٱلْحَكِيمُ', en: 'Al-Hakim', meaning: 'The Wise' },
        { num: 47, ar: 'ٱلْوَدُودُ', en: 'Al-Wadud', meaning: 'The Loving' },
        { num: 48, ar: 'ٱلْمَجِيدُ', en: 'Al-Majid', meaning: 'The Glorious' },
        { num: 49, ar: 'ٱلْبَاعِثُ', en: 'Al-Ba\'ith', meaning: 'The Resurrector' },
        { num: 50, ar: 'ٱلشَّهِيدُ', en: 'Ash-Shahid', meaning: 'The Witness' },
        { num: 51, ar: 'ٱلْحَقُّ', en: 'Al-Haqq', meaning: 'The Truth' },
        { num: 52, ar: 'ٱلْوَكِيلُ', en: 'Al-Wakil', meaning: 'The Trustee' },
        { num: 53, ar: 'ٱلْقَوِيُّ', en: 'Al-Qawiyy', meaning: 'The Strong' },
        { num: 54, ar: 'ٱلْمَتِينُ', en: 'Al-Matin', meaning: 'The Firm' },
        { num: 55, ar: 'ٱلْوَلِيُّ', en: 'Al-Waliyy', meaning: 'The Protecting Friend' },
        { num: 56, ar: 'ٱلْحَمِيدُ', en: 'Al-Hamid', meaning: 'The Praiseworthy' },
        { num: 57, ar: 'ٱلْمُحْصِي', en: 'Al-Muhsi', meaning: 'The Accounter' },
        { num: 58, ar: 'ٱلْمُبْدِئُ', en: 'Al-Mubdi', meaning: 'The Originator' },
        { num: 59, ar: 'ٱلْمُعِيدُ', en: 'Al-Mu\'id', meaning: 'The Restorer' },
        { num: 60, ar: 'ٱلْمُحْيِي', en: 'Al-Muhyi', meaning: 'The Giver of Life' },
        { num: 61, ar: 'ٱلْمُمِيتُ', en: 'Al-Mumit', meaning: 'The Taker of Life' },
        { num: 62, ar: 'ٱلْحَيُّ', en: 'Al-Hayy', meaning: 'The Ever-Living' },
        { num: 63, ar: 'ٱلْقَيُّومُ', en: 'Al-Qayyum', meaning: 'The Self-Subsisting' },
        { num: 64, ar: 'ٱلْوَاجِدُ', en: 'Al-Wajid', meaning: 'The Finder' },
        { num: 65, ar: 'ٱلْمَاجِدُ', en: 'Al-Majid', meaning: 'The Noble' },
        { num: 66, ar: 'ٱلْوَاحِدُ', en: 'Al-Wahid', meaning: 'The One' },
        { num: 67, ar: 'ٱلْأَحَدُ', en: 'Al-Ahad', meaning: 'The Unique' },
        { num: 68, ar: 'ٱلصَّمَدُ', en: 'As-Samad', meaning: 'The Eternal' },
        { num: 69, ar: 'ٱلْقَادِرُ', en: 'Al-Qadir', meaning: 'The Able' },
        { num: 70, ar: 'ٱلْمُقْتَدِرُ', en: 'Al-Muqtadir', meaning: 'The Powerful' },
        { num: 71, ar: 'ٱلْمُقَدِّمُ', en: 'Al-Muqaddim', meaning: 'The Expediter' },
        { num: 72, ar: 'ٱلْمُؤَخِّرُ', en: 'Al-Mu\'akhkhir', meaning: 'The Delayer' },
        { num: 73, ar: 'ٱلْأَوَّلُ', en: 'Al-Awwal', meaning: 'The First' },
        { num: 74, ar: 'ٱلْآخِرُ', en: 'Al-Akhir', meaning: 'The Last' },
        { num: 75, ar: 'ٱلظَّاهِرُ', en: 'Az-Zahir', meaning: 'The Manifest' },
        { num: 76, ar: 'ٱلْبَاطِنُ', en: 'Al-Batin', meaning: 'The Hidden' },
        { num: 77, ar: 'ٱلْوَالِي', en: 'Al-Wali', meaning: 'The Governor' },
        { num: 78, ar: 'ٱلْمُتَعَالِي', en: 'Al-Muta\'ali', meaning: 'The Most Exalted' },
        { num: 79, ar: 'ٱلْبَرُّ', en: 'Al-Barr', meaning: 'The Source of Goodness' },
        { num: 80, ar: 'ٱلتَّوَّابُ', en: 'At-Tawwab', meaning: 'The Acceptor of Repentance' },
        { num: 81, ar: 'ٱلْمُنْتَقِمُ', en: 'Al-Muntaqim', meaning: 'The Avenger' },
        { num: 82, ar: 'ٱلْعَفُوُّ', en: 'Al-Afuww', meaning: 'The Pardoner' },
        { num: 83, ar: 'ٱلرَّءُوفُ', en: 'Ar-Ra\'uf', meaning: 'The Compassionate' },
        { num: 84, ar: 'مَالِكُ ٱلْمُلْكِ', en: 'Malik-ul-Mulk', meaning: 'Owner of Sovereignty' },
        { num: 85, ar: 'ذُو ٱلْجَلَالِ وَٱلْإِكْرَامِ', en: 'Dhul-Jalali wal-Ikram', meaning: 'Lord of Majesty & Generosity' },
        { num: 86, ar: 'ٱلْمُقْسِطُ', en: 'Al-Muqsit', meaning: 'The Equitable' },
        { num: 87, ar: 'ٱلْجَامِعُ', en: 'Al-Jami', meaning: 'The Gatherer' },
        { num: 88, ar: 'ٱلْغَنِيُّ', en: 'Al-Ghani', meaning: 'The Self-Sufficient' },
        { num: 89, ar: 'ٱلْمُغْنِي', en: 'Al-Mughni', meaning: 'The Enricher' },
        { num: 90, ar: 'ٱلْمَانِعُ', en: 'Al-Mani', meaning: 'The Preventer' },
        { num: 91, ar: 'ٱلضَّارُّ', en: 'Ad-Darr', meaning: 'The Distresser' },
        { num: 92, ar: 'ٱلنَّافِعُ', en: 'An-Nafi', meaning: 'The Benefactor' },
        { num: 93, ar: 'ٱلنُّورُ', en: 'An-Nur', meaning: 'The Light' },
        { num: 94, ar: 'ٱلْهَادِي', en: 'Al-Hadi', meaning: 'The Guide' },
        { num: 95, ar: 'ٱلْبَدِيعُ', en: 'Al-Badi', meaning: 'The Incomparable' },
        { num: 96, ar: 'ٱلْبَاقِي', en: 'Al-Baqi', meaning: 'The Everlasting' },
        { num: 97, ar: 'ٱلْوَارِثُ', en: 'Al-Warith', meaning: 'The Inheritor' },
        { num: 98, ar: 'ٱلرَّشِيدُ', en: 'Ar-Rashid', meaning: 'The Guide to the Right Path' },
        { num: 99, ar: 'ٱلصَّبُورُ', en: 'As-Sabur', meaning: 'The Patient' }
    ];

    function getDailyContent() {
        // Use day-of-year to rotate content
        const now = new Date();
        const start = new Date(now.getFullYear(), 0, 0);
        const dayOfYear = Math.floor((now - start) / 86400000);
        return DAILY_CONTENT[dayOfYear % DAILY_CONTENT.length];
    }

    function getAllNames() {
        return NAMES_OF_ALLAH;
    }

    return { getDailyContent, getAllNames, DAILY_CONTENT, NAMES_OF_ALLAH };
})();
