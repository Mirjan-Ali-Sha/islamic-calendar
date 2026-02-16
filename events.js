/**
 * Islamic Events Database
 * Comprehensive listing of Islamic events by Hijri month and day.
 * Each event has: month, day, name (multilingual), category, description.
 * 
 * Categories: eid, holy, fasting, hajj, historical, monthly
 */

const IslamicEvents = (() => {

    const EVENTS = [
        // ── MUHARRAM (Month 1) ──
        {
            month: 1, day: 1, category: 'holy', id: 'new_year',
            name: { en: 'Islamic New Year', ar: 'رأس السنة الهجرية', bn: 'ইসলামি নববর্ষ', ur: 'اسلامی نیا سال', tr: 'Hicri Yılbaşı', ms: 'Awal Muharam', id: 'Tahun Baru Islam', fr: 'Nouvel An Islamique' },
            desc: { en: 'The first day of the Islamic lunar calendar year.', ar: 'أول يوم في السنة الهجرية القمرية.', bn: 'ইসলামি চান্দ্র বর্ষপঞ্জির প্রথম দিন।', ur: 'اسلامی قمری تقویم سال کا پہلا دن۔' }
        },
        {
            month: 1, day: 10, category: 'fasting', id: 'ashura',
            name: { en: 'Day of Ashura', ar: 'يوم عاشوراء', bn: 'আশুরা', ur: 'یوم عاشورہ', tr: 'Aşure Günü', ms: 'Hari Asyura', id: 'Hari Asyura', fr: 'Jour d\'Achoura' },
            desc: { en: 'A day of fasting and remembrance. Marks the day Prophet Musa (Moses) was saved from Pharaoh.', ar: 'يوم صيام وذكرى. يصادف اليوم الذي نجّى الله فيه موسى من فرعون.', bn: 'রোজা ও স্মরণের দিন। মুসা (আ.) ফেরাউন থেকে মুক্তি পেয়েছিলেন।', ur: 'روزے اور یاد کا دن۔ حضرت موسیٰ کو فرعون سے نجات ملی۔' }
        },
        {
            month: 1, day: 9, category: 'fasting', id: 'tasu_a',
            name: { en: 'Tasu\'a (9th Muharram)', ar: 'تاسوعاء', bn: 'তাসুআ', ur: 'تاسوعاء', tr: 'Tasuâ', ms: 'Tasua', id: 'Tasua', fr: 'Tâsou\'â' },
            desc: { en: 'Recommended fasting day, the day before Ashura.', ar: 'يوم صيام مستحب، اليوم الذي يسبق عاشوراء.', bn: 'আশুরার আগের দিন, রোজা রাখা মুস্তাহাব।', ur: 'عاشوراء سے پہلے کا دن، روزہ مستحب ہے۔' }
        },

        // ── SAFAR (Month 2) ──
        {
            month: 2, day: 1, category: 'historical', id: 'safar_start',
            name: { en: 'Beginning of Safar', ar: 'بداية صفر', bn: 'সফর মাসের শুরু', ur: 'صفر کی ابتدا', tr: 'Safer Ayı Başlangıcı', ms: 'Awal Safar', id: 'Awal Safar', fr: 'Début de Safar' },
            desc: { en: 'The second month of the Islamic calendar begins.', ar: 'بداية الشهر الثاني من التقويم الإسلامي.', bn: 'ইসলামি বর্ষপঞ্জির দ্বিতীয় মাস শুরু।', ur: 'اسلامی تقویم کا دوسرا مہینہ شروع۔' }
        },
        {
            month: 2, day: 27, category: 'historical', id: 'hijra_madinah',
            name: { en: 'Prophet\'s ﷺ Migration to Madinah', ar: 'هجرة النبي ﷺ إلى المدينة', bn: 'নবী ﷺ এর মদিনায় হিজরত', ur: 'نبی ﷺ کی مدینہ ہجرت', tr: 'Hz. Peygamber\'in Medine\'ye Hicreti', ms: 'Hijrah Nabi ke Madinah', id: 'Hijrah Nabi ke Madinah', fr: 'Hégire vers Médine' },
            desc: { en: 'Commemoration of the Prophet Muhammad\'s ﷺ migration from Makkah to Madinah.', ar: 'ذكرى هجرة النبي محمد ﷺ من مكة إلى المدينة.', bn: 'নবী মুহাম্মাদ ﷺ এর মক্কা থেকে মদিনায় হিজরতের স্মরণ।', ur: 'نبی محمد ﷺ کی مکہ سے مدینہ ہجرت کی یاد۔' }
        },

        // ── RABI AL-AWWAL (Month 3) ──
        {
            month: 3, day: 12, category: 'holy', id: 'mawlid',
            name: { en: 'Mawlid al-Nabi ﷺ (Prophet\'s Birthday)', ar: 'المولد النبوي الشريف ﷺ', bn: 'ঈদে মিলাদুন্নবী ﷺ', ur: 'عید میلاد النبی ﷺ', tr: 'Mevlid Kandili', ms: 'Maulidur Rasul', id: 'Maulid Nabi', fr: 'Mawlid an-Nabî' },
            desc: { en: 'Celebration of the birth of Prophet Muhammad ﷺ (12th Rabi al-Awwal, widely observed).', ar: 'الاحتفال بمولد النبي محمد ﷺ (12 ربيع الأول).', bn: 'নবী মুহাম্মাদ ﷺ এর জন্ম উদযাপন।', ur: 'نبی محمد ﷺ کے یوم پیدائش کا جشن۔' }
        },

        // ── RABI AL-THANI (Month 4) ──
        {
            month: 4, day: 11, category: 'historical', id: 'abdulqadir_urs',
            name: { en: 'Urs of Sheikh Abdul Qadir Jilani', ar: 'عرس الشيخ عبد القادر الجيلاني', bn: 'শেখ আবদুল কাদের জিলানীর ওরশ', ur: 'عرس شیخ عبدالقادر جیلانی', tr: 'Abdülkâdir Geylânî Anma', ms: 'Urs Syeikh Abdul Qadir', id: 'Haul Syeikh Abdul Qadir', fr: 'Commémoration du Cheikh Abdul Qadir' },
            desc: { en: 'Anniversary commemorating the great Sufi saint Sheikh Abdul Qadir Jilani.', ar: 'ذكرى الولي الصوفي الكبير الشيخ عبد القادر الجيلاني.', bn: 'মহান সুফি সাধক শেখ আবদুল কাদের জিলানীর স্মরণ।', ur: 'عظیم صوفی بزرگ شیخ عبدالقادر جیلانی کی یاد۔' }
        },

        // ── JUMADA AL-ULA (Month 5) ──
        // No widely universal events, but keep month marker

        // ── JUMADA AL-THANI (Month 6) ──
        {
            month: 6, day: 20, category: 'historical', id: 'fatima_birth',
            name: { en: 'Birth of Fatimah al-Zahra (RA)', ar: 'مولد فاطمة الزهراء رضي الله عنها', bn: 'ফাতিমা আল-জাহরা (রা.) এর জন্ম', ur: 'ولادت فاطمہ الزہراء رضی اللہ عنہا', tr: 'Hz. Fatıma\'nın Doğumu', ms: 'Kelahiran Fatimah Az-Zahra', id: 'Kelahiran Fatimah Az-Zahra', fr: 'Naissance de Fatima az-Zahra' },
            desc: { en: 'Birth anniversary of Lady Fatimah, daughter of Prophet Muhammad ﷺ.', ar: 'ذكرى ولادة السيدة فاطمة بنت النبي محمد ﷺ.', bn: 'নবী মুহাম্মাদ ﷺ এর কন্যা ফাতিমার জন্মদিন।', ur: 'نبی محمد ﷺ کی بیٹی سیدہ فاطمہ کا یوم پیدائش۔' }
        },

        // ── RAJAB (Month 7) ──
        {
            month: 7, day: 1, category: 'holy', id: 'rajab_start',
            name: { en: 'Beginning of Rajab (Sacred Month)', ar: 'بداية رجب (الشهر الحرام)', bn: 'রজব মাসের শুরু (পবিত্র মাস)', ur: 'رجب کی ابتدا (حرمت والا مہینہ)', tr: 'Recep Ayı Başlangıcı', ms: 'Awal Rejab', id: 'Awal Rajab', fr: 'Début de Rajab' },
            desc: { en: 'Rajab is one of the four sacred months in Islam.', ar: 'رجب هو أحد الأشهر الحرم الأربعة في الإسلام.', bn: 'রজব ইসলামের চারটি পবিত্র মাসের একটি।', ur: 'رجب اسلام میں چار حرمت والے مہینوں میں سے ایک ہے۔' }
        },
        {
            month: 7, day: 13, category: 'historical', id: 'ali_birth',
            name: { en: 'Birth of Ali ibn Abi Talib (RA)', ar: 'مولد علي بن أبي طالب رضي الله عنه', bn: 'আলী ইবনে আবু তালিব (রা.) এর জন্ম', ur: 'ولادت علی ابن ابی طالب رضی اللہ عنہ', tr: 'Hz. Ali\'nin Doğumu', ms: 'Kelahiran Ali bin Abu Talib', id: 'Kelahiran Ali bin Abu Thalib', fr: 'Naissance d\'Ali ibn Abi Talib' },
            desc: { en: 'Birth of Ali ibn Abi Talib (RA), the fourth Caliph and cousin of the Prophet ﷺ.', ar: 'ولادة علي بن أبي طالب، الخليفة الرابع وابن عم النبي ﷺ.', bn: 'চতুর্থ খলিফা ও নবী ﷺ এর চাচাতো ভাই আলীর জন্ম।', ur: 'چوتھے خلیفہ اور نبی ﷺ کے چچا زاد بھائی علی کی پیدائش۔' }
        },
        {
            month: 7, day: 27, category: 'holy', id: 'isra_miraj',
            name: { en: 'Isra & Mi\'raj (Night Journey)', ar: 'الإسراء والمعراج', bn: 'ইসরা ও মিরাজ', ur: 'شب اسراء و معراج', tr: 'Miraç Kandili', ms: 'Israk & Mikraj', id: 'Isra Mi\'raj', fr: 'Isra et Miraj' },
            desc: { en: 'The Night Journey of Prophet Muhammad ﷺ from Makkah to Jerusalem and ascension to the heavens.', ar: 'رحلة الإسراء والمعراج للنبي محمد ﷺ من مكة إلى القدس ثم العروج إلى السماوات.', bn: 'নবী মুহাম্মাদ ﷺ এর মক্কা থেকে জেরুজালেম ও ঊর্ধ্বাকাশে আরোহণ।', ur: 'نبی محمد ﷺ کا مکہ سے بیت المقدس اور آسمانوں کی طرف سفر۔' }
        },

        // ── SHA'BAN (Month 8) ──
        {
            month: 8, day: 1, category: 'holy', id: 'shaban_start',
            name: { en: 'Beginning of Sha\'ban', ar: 'بداية شعبان', bn: 'শাবান মাসের শুরু', ur: 'شعبان کی ابتدا', tr: 'Şaban Ayı Başlangıcı', ms: 'Awal Syaaban', id: 'Awal Syakban', fr: 'Début de Chaabane' },
            desc: { en: 'Sha\'ban is the month preceding Ramadan. Extra fasting is recommended.', ar: 'شعبان هو الشهر الذي يسبق رمضان. يستحب الصيام فيه.', bn: 'শাবান রমজানের আগের মাস। অতিরিক্ত রোজা রাখা মুস্তাহাব।', ur: 'شعبان رمضان سے پہلے کا مہینہ ہے۔ نفلی روزے مستحب ہیں۔' }
        },
        {
            month: 8, day: 15, category: 'holy', id: 'shab_e_barat',
            name: { en: 'Shab-e-Barat (Mid-Sha\'ban)', ar: 'ليلة النصف من شعبان', bn: 'শবে বরাত', ur: 'شب برات', tr: 'Berat Kandili', ms: 'Nisfu Syaaban', id: 'Nisfu Sya\'ban', fr: 'Nuit du Mi-Chaabane' },
            desc: { en: 'The Night of Forgiveness. A blessed night when Allah\'s mercy descends abundantly.', ar: 'ليلة المغفرة. ليلة مباركة تنزل فيها رحمة الله بكثرة.', bn: 'ক্ষমার রাত। এক বরকতময় রাত যখন আল্লাহর রহমত প্রচুর পরিমাণে নাযিল হয়।', ur: 'مغفرت کی رات۔ ایک بابرکت رات جب اللہ کی رحمت کثرت سے نازل ہوتی ہے۔' }
        },

        // ── RAMADAN (Month 9) ──
        {
            month: 9, day: 1, category: 'fasting', id: 'ramadan_start',
            name: { en: 'Start of Ramadan', ar: 'بداية رمضان', bn: 'রমজান শুরু', ur: 'رمضان کی ابتدا', tr: 'Ramazan Başlangıcı', ms: 'Awal Ramadan', id: 'Awal Ramadan', fr: 'Début du Ramadan' },
            desc: { en: 'The blessed month of fasting begins. Muslims fast from dawn to sunset.', ar: 'بداية شهر الصيام المبارك. يصوم المسلمون من الفجر إلى غروب الشمس.', bn: 'বরকতময় রোজার মাস শুরু। মুসলিমরা ভোর থেকে সূর্যাস্ত পর্যন্ত রোজা রাখেন।', ur: 'روزوں کا بابرکت مہینہ شروع۔ مسلمان فجر سے غروب تک روزہ رکھتے ہیں۔' }
        },
        {
            month: 9, day: 17, category: 'historical', id: 'badr',
            name: { en: 'Battle of Badr', ar: 'غزوة بدر', bn: 'বদরের যুদ্ধ', ur: 'غزوہ بدر', tr: 'Bedir Savaşı', ms: 'Perang Badar', id: 'Perang Badar', fr: 'Bataille de Badr' },
            desc: { en: 'Anniversary of the first major battle in Islamic history (2 AH).', ar: 'ذكرى أول معركة كبرى في التاريخ الإسلامي (2 هـ).', bn: 'ইসলামি ইতিহাসের প্রথম বড় যুদ্ধের বার্ষিকী (২ হিজরি)।', ur: 'اسلامی تاریخ کی پہلی بڑی جنگ کی سالگرہ (2 ہجری)۔' }
        },
        {
            month: 9, day: 20, category: 'historical', id: 'fath_makkah',
            name: { en: 'Conquest of Makkah', ar: 'فتح مكة', bn: 'মক্কা বিজয়', ur: 'فتح مکہ', tr: 'Mekke\'nin Fethi', ms: 'Pembukaan Mekah', id: 'Penaklukan Mekkah', fr: 'Conquête de La Mecque' },
            desc: { en: 'The Prophet ﷺ entered Makkah peacefully (8 AH / 630 CE).', ar: 'دخل النبي ﷺ مكة سلمياً (8 هـ / 630 م).', bn: 'নবী ﷺ শান্তিপূর্ণভাবে মক্কায় প্রবেশ করেন (৮ হিজরি)।', ur: 'نبی ﷺ نے پرامن طریقے سے مکہ میں داخلہ حاصل کیا (8 ہجری)۔' }
        },
        {
            month: 9, day: 21, category: 'holy', id: 'last_10_start',
            name: { en: 'Last 10 Nights of Ramadan Begin', ar: 'بداية العشر الأواخر من رمضان', bn: 'রমজানের শেষ ১০ রাত শুরু', ur: 'رمضان کی آخری دس راتوں کی ابتدا', tr: 'Ramazan\'ın Son 10 Gecesi', ms: 'Bermula 10 Malam Terakhir', id: 'Awal 10 Malam Terakhir', fr: 'Dernières 10 nuits du Ramadan' },
            desc: { en: 'The most virtuous nights of the year. Seek Laylat al-Qadr in these nights.', ar: 'أفضل ليالي السنة. تحرّوا ليلة القدر فيها.', bn: 'বছরের সবচেয়ে মর্যাদাপূর্ণ রাতগুলি। এই রাতগুলিতে লাইলাতুল কদর খোঁজা হয়।', ur: 'سال کی سب سے افضل راتیں۔ ان میں لیلۃ القدر تلاش کریں۔' }
        },
        {
            month: 9, day: 27, category: 'holy', id: 'laylat_al_qadr',
            name: { en: 'Laylat al-Qadr (Night of Power)', ar: 'ليلة القدر', bn: 'লাইলাতুল কদর (শবে কদর)', ur: 'شب قدر (لیلۃ القدر)', tr: 'Kadir Gecesi', ms: 'Lailatul Qadr', id: 'Lailatul Qadr', fr: 'Nuit du Destin' },
            desc: { en: 'The Night of Power — better than a thousand months. The Quran was first revealed on this night.', ar: 'ليلة القدر خيرٌ من ألف شهر. أُنزل فيها القرآن الكريم.', bn: 'কদরের রাত — হাজার মাসের চেয়ে উত্তম। এই রাতে কুরআন অবতীর্ণ হয়েছিল।', ur: 'شب قدر — ہزار مہینوں سے بہتر۔ اس رات قرآن نازل ہوا۔' }
        },

        // ── SHAWWAL (Month 10) ──
        {
            month: 10, day: 1, category: 'eid', id: 'eid_fitr',
            name: { en: 'Eid al-Fitr', ar: 'عيد الفطر', bn: 'ঈদুল ফিতর', ur: 'عید الفطر', tr: 'Ramazan Bayramı', ms: 'Hari Raya Aidilfitri', id: 'Idul Fitri', fr: 'Aïd al-Fitr' },
            desc: { en: 'The Festival of Breaking the Fast. Celebrates the end of Ramadan with prayers, charity, and feasts.', ar: 'عيد الفطر. يحتفل المسلمون بنهاية رمضان بالصلاة والصدقة والولائم.', bn: 'রোজা ভাঙার উৎসব। নামাজ, দান ও ভোজের মাধ্যমে রমজানের সমাপ্তি উদযাপন।', ur: 'روزے ختم ہونے کی خوشی۔ نماز، صدقے اور دعوتوں سے رمضان کا اختتام۔' }
        },
        {
            month: 10, day: 2, category: 'eid', id: 'eid_fitr_2',
            name: { en: 'Eid al-Fitr (Day 2)', ar: 'عيد الفطر (اليوم الثاني)', bn: 'ঈদুল ফিতর (দ্বিতীয় দিন)', ur: 'عید الفطر (دوسرا دن)', tr: 'Ramazan Bayramı (2. Gün)', ms: 'Hari Raya Aidilfitri (Hari 2)', id: 'Idul Fitri (Hari 2)', fr: 'Aïd al-Fitr (Jour 2)' },
            desc: { en: 'Second day of Eid al-Fitr celebrations.', ar: 'اليوم الثاني من احتفالات عيد الفطر.', bn: 'ঈদুল ফিতর উদযাপনের দ্বিতীয় দিন।', ur: 'عید الفطر کے جشن کا دوسرا دن۔' }
        },
        {
            month: 10, day: 3, category: 'eid', id: 'eid_fitr_3',
            name: { en: 'Eid al-Fitr (Day 3)', ar: 'عيد الفطر (اليوم الثالث)', bn: 'ঈদুল ফিতর (তৃতীয় দিন)', ur: 'عید الفطر (تیسرا دن)', tr: 'Ramazan Bayramı (3. Gün)', ms: 'Hari Raya Aidilfitri (Hari 3)', id: 'Idul Fitri (Hari 3)', fr: 'Aïd al-Fitr (Jour 3)' },
            desc: { en: 'Third day of Eid al-Fitr celebrations.', ar: 'اليوم الثالث من احتفالات عيد الفطر.', bn: 'ঈদুল ফিতর উদযাপনের তৃতীয় দিন।', ur: 'عید الفطر کے جشن کا تیسرا دن۔' }
        },
        {
            month: 10, day: 2, category: 'fasting', id: 'shawwal_fasting_start',
            name: { en: 'Six Days of Shawwal Fasting Begin', ar: 'بداية صيام الست من شوال', bn: 'শাওয়ালের ছয় রোজা শুরু', ur: 'شوال کے چھ روزوں کی ابتدا', tr: 'Şevval Oruçları', ms: 'Puasa Enam Syawal', id: 'Puasa Enam Syawal', fr: 'Jeûne des six jours de Chawwal' },
            desc: { en: 'It is Sunnah to fast six days during Shawwal after Eid.', ar: 'من السنة صيام ستة أيام من شوال بعد العيد.', bn: 'ঈদের পর শাওয়ালে ছয়দিন রোজা রাখা সুন্নত।', ur: 'عید کے بعد شوال کے چھ روزے رکھنا سنت ہے۔' }
        },

        // ── DHUL QI'DAH (Month 11) ──
        {
            month: 11, day: 1, category: 'holy', id: 'dhul_qidah_start',
            name: { en: 'Beginning of Dhul Qi\'dah (Sacred Month)', ar: 'بداية ذي القعدة (الشهر الحرام)', bn: 'জিলকদ মাসের শুরু (পবিত্র মাস)', ur: 'ذوالقعدہ کی ابتدا (حرمت والا مہینہ)', tr: 'Zilkade Ayı Başlangıcı', ms: 'Awal Zulkaedah', id: 'Awal Zulkaidah', fr: 'Début de Dhou al-Qi\'da' },
            desc: { en: 'Dhul Qi\'dah is one of the four sacred months.', ar: 'ذو القعدة هو أحد الأشهر الحرم الأربعة.', bn: 'জিলকদ ইসলামের চারটি পবিত্র মাসের একটি।', ur: 'ذوالقعدہ چار حرمت والے مہینوں میں سے ایک ہے۔' }
        },
        {
            month: 11, day: 25, category: 'historical', id: 'dahw_al_ard',
            name: { en: 'Dahw al-Ard (Spreading of Earth)', ar: 'دحو الأرض', bn: 'দাহউল আরদ', ur: 'دحو الارض', tr: 'Dahvü\'l-Arz', ms: 'Dahw al-Ard', id: 'Dahw al-Ard', fr: 'Dahw al-Ard' },
            desc: { en: 'Commemorates when Allah spread the earth from beneath the Kaaba.', ar: 'ذكرى بسط الأرض من تحت الكعبة.', bn: 'কাবার নিচ থেকে আল্লাহ পৃথিবী বিছিয়ে দেওয়ার স্মরণ।', ur: 'اللہ نے کعبے کے نیچے سے زمین کو پھیلایا اس کی یاد۔' }
        },

        // ── DHUL HIJJAH (Month 12) ──
        {
            month: 12, day: 1, category: 'hajj', id: 'dhul_hijjah_start',
            name: { en: 'Beginning of Dhul Hijjah (Sacred Month)', ar: 'بداية ذي الحجة (الشهر الحرام)', bn: 'জিলহজ মাসের শুরু (পবিত্র মাস)', ur: 'ذوالحجہ کی ابتدا (حرمت والا مہینہ)', tr: 'Zilhicce Ayı Başlangıcı', ms: 'Awal Zulhijjah', id: 'Awal Zulhijah', fr: 'Début de Dhou al-Hijja' },
            desc: { en: 'The most sacred month. First 10 days are the best days of the year.', ar: 'أقدس الشهور. أول عشرة أيام هي أفضل أيام السنة.', bn: 'সবচেয়ে পবিত্র মাস। প্রথম ১০ দিন বছরের সেরা দিন।', ur: 'سب سے مقدس مہینہ۔ پہلے دس دن سال کے بہترین دن ہیں۔' }
        },
        {
            month: 12, day: 1, category: 'fasting', id: 'first_10_dhul_hijjah',
            name: { en: 'First 10 Days of Dhul Hijjah (Fasting Recommended)', ar: 'العشر الأوائل من ذي الحجة (يستحب الصيام)', bn: 'জিলহজের প্রথম ১০ দিন (রোজা মুস্তাহাব)', ur: 'ذوالحجہ کے پہلے دس دن (روزہ مستحب)', tr: 'Zilhicce\'nin İlk 10 Günü', ms: '10 Hari Pertama Zulhijjah', id: '10 Hari Pertama Zulhijah', fr: 'Premiers 10 jours de Dhou al-Hijja' },
            desc: { en: 'Fasting during the first 9 days of Dhul Hijjah is highly recommended (especially day 9, Arafah).', ar: 'صيام التسع الأوائل من ذي الحجة مستحب جداً (خاصة يوم عرفة).', bn: 'জিলহজের প্রথম ৯ দিন রোজা রাখা অত্যন্ত মুস্তাহাব (বিশেষত আরাফার দিন)।', ur: 'ذوالحجہ کے پہلے 9 دن روزہ رکھنا بہت مستحب ہے (خاصکر یوم عرفہ)۔' }
        },
        {
            month: 12, day: 8, category: 'hajj', id: 'tarwiyah',
            name: { en: 'Day of Tarwiyah (Hajj Day 1)', ar: 'يوم التروية (الحج اليوم الأول)', bn: 'তারবিয়াহর দিন (হজের ১ম দিন)', ur: 'یوم الترویہ (حج کا پہلا دن)', tr: 'Terviye Günü', ms: 'Hari Tarwiyah', id: 'Hari Tarwiyah', fr: 'Jour de Tarwiya' },
            desc: { en: 'Pilgrims begin the Hajj rituals. They proceed to Mina.', ar: 'يبدأ الحجاج مناسك الحج ويتوجهون إلى منى.', bn: 'হাজিরা হজের আনুষ্ঠানিকতা শুরু করেন। তারা মিনায় যান।', ur: 'حاجی حج کے مناسک شروع کرتے ہیں اور منیٰ کی طرف جاتے ہیں۔' }
        },
        {
            month: 12, day: 9, category: 'hajj', id: 'arafah',
            name: { en: 'Day of Arafah', ar: 'يوم عرفة', bn: 'আরাফাহর দিন', ur: 'یوم عرفہ', tr: 'Arefe Günü', ms: 'Hari Arafah', id: 'Hari Arafah', fr: 'Jour d\'Arafat' },
            desc: { en: 'The most important day of Hajj. Fasting this day expiates sins of the previous and coming year (for non-pilgrims).', ar: 'أهم أيام الحج. صيام هذا اليوم يكفر ذنوب سنة ماضية وسنة قادمة (لغير الحاج).', bn: 'হজের সবচেয়ে গুরুত্বপূর্ণ দিন। এই দিন রোজা রাখলে আগের ও পরের বছরের গুনাহ মাফ হয়।', ur: 'حج کا سب سے اہم دن۔ اس دن کا روزہ پچھلے اور آنے والے سال کے گناہوں کا کفارہ ہے۔' }
        },
        {
            month: 12, day: 10, category: 'eid', id: 'eid_adha',
            name: { en: 'Eid al-Adha (Festival of Sacrifice)', ar: 'عيد الأضحى', bn: 'ঈদুল আযহা (কুরবানির ঈদ)', ur: 'عید الاضحیٰ (قربانی کی عید)', tr: 'Kurban Bayramı', ms: 'Hari Raya Haji', id: 'Idul Adha', fr: 'Aïd al-Adha' },
            desc: { en: 'The Festival of Sacrifice. Commemorates Prophet Ibrahim\'s willingness to sacrifice his son Ismail.', ar: 'عيد الأضحى. يحيي ذكرى استعداد النبي إبراهيم للتضحية بابنه إسماعيل.', bn: 'কুরবানির ঈদ। ইব্রাহিম (আ.) এর পুত্র ইসমাইলকে কুরবানির প্রস্তুতির স্মরণ।', ur: 'قربانی کی عید۔ ابراہیم علیہ السلام کی اپنے بیٹے اسماعیل کو قربان کرنے کی رضامندی کی یاد۔' }
        },
        {
            month: 12, day: 11, category: 'eid', id: 'eid_adha_2',
            name: { en: 'Eid al-Adha (Day 2) - Ayyam al-Tashreeq', ar: 'عيد الأضحى (اليوم الثاني) - أيام التشريق', bn: 'ঈদুল আযহা (দ্বিতীয় দিন)', ur: 'عید الاضحیٰ (دوسرا دن)', tr: 'Kurban Bayramı (2. Gün)', ms: 'Hari Raya Haji (Hari 2)', id: 'Idul Adha (Hari 2)', fr: 'Aïd al-Adha (Jour 2)' },
            desc: { en: 'Second day of Eid al-Adha. Days of Tashreeq — fasting is prohibited.', ar: 'اليوم الثاني من عيد الأضحى. أيام التشريق — يحرم الصيام.', bn: 'ঈদুল আযহার দ্বিতীয় দিন। তাশরীকের দিন — রোজা নিষিদ্ধ।', ur: 'عید الاضحیٰ کا دوسرا دن۔ ایام تشریق — روزہ حرام ہے۔' }
        },
        {
            month: 12, day: 12, category: 'eid', id: 'eid_adha_3',
            name: { en: 'Eid al-Adha (Day 3) - Ayyam al-Tashreeq', ar: 'عيد الأضحى (اليوم الثالث) - أيام التشريق', bn: 'ঈদুল আযহা (তৃতীয় দিন)', ur: 'عید الاضحیٰ (تیسرا دن)', tr: 'Kurban Bayramı (3. Gün)', ms: 'Hari Raya Haji (Hari 3)', id: 'Idul Adha (Hari 3)', fr: 'Aïd al-Adha (Jour 3)' },
            desc: { en: 'Third day of Eid al-Adha and Ayyam al-Tashreeq.', ar: 'اليوم الثالث من عيد الأضحى وأيام التشريق.', bn: 'ঈদুল আযহার তৃতীয় দিন এবং আইয়ামে তাশরীক।', ur: 'عید الاضحیٰ کا تیسرا دن اور ایام تشریق۔' }
        },
        {
            month: 12, day: 13, category: 'hajj', id: 'tashreeq_3',
            name: { en: 'Last Day of Tashreeq', ar: 'آخر أيام التشريق', bn: 'তাশরীকের শেষ দিন', ur: 'ایام تشریق کا آخری دن', tr: 'Teşrik Günlerinin Sonu', ms: 'Hari Terakhir Tasyriq', id: 'Hari Terakhir Tasyrik', fr: 'Dernier jour de Tachrik' },
            desc: { en: 'End of the Days of Tashreeq and Hajj season.', ar: 'نهاية أيام التشريق وموسم الحج.', bn: 'তাশরীকের দিন এবং হজের মৌসুম শেষ।', ur: 'ایام تشریق اور حج کے موسم کا اختتام۔' }
        },
        {
            month: 12, day: 18, category: 'historical', id: 'ghadir_khumm',
            name: { en: 'Event of Ghadir Khumm', ar: 'حادثة غدير خم', bn: 'গাদীর খুমের ঘটনা', ur: 'واقعہ غدیر خم', tr: 'Gadir Hum Olayı', ms: 'Peristiwa Ghadir Khumm', id: 'Peristiwa Ghadir Khumm', fr: 'Événement de Ghadîr Khumm' },
            desc: { en: 'Commemoration of the Prophet\'s ﷺ sermon at Ghadir Khumm during the Farewell Pilgrimage.', ar: 'ذكرى خطبة النبي ﷺ في غدير خم أثناء حجة الوداع.', bn: 'বিদায় হজের সময় গাদীর খুমে নবী ﷺ এর ভাষণের স্মরণ।', ur: 'حجۃ الوداع کے دوران غدیر خم میں نبی ﷺ کے خطبے کی یاد۔' }
        },

        // ── RECURRING MONTHLY EVENTS ──
        {
            month: 0, day: 13, category: 'fasting', id: 'ayyam_beed_1', recurring: true,
            name: { en: 'Ayyam al-Beed (White Days Fast - Day 1)', ar: 'أيام البيض (اليوم الأول)', bn: 'আইয়ামুল বীজ (১ম দিন)', ur: 'ایام البیض (پہلا دن)', tr: 'Eyyâm-ı Bîd (1. Gün)', ms: 'Ayyamul Bidh (Hari 1)', id: 'Ayyamul Bidh (Hari 1)', fr: 'Ayyam al-Bid (Jour 1)' },
            desc: { en: 'Sunnah fasting on the 13th of each Hijri month (White Days).', ar: 'صيام سنة في 13 من كل شهر هجري (أيام البيض).', bn: 'প্রতি হিজরি মাসের ১৩ তারিখে সুন্নত রোজা।', ur: 'ہر ہجری مہینے کی 13 تاریخ کو سنت روزہ۔' }
        },
        {
            month: 0, day: 14, category: 'fasting', id: 'ayyam_beed_2', recurring: true,
            name: { en: 'Ayyam al-Beed (White Days Fast - Day 2)', ar: 'أيام البيض (اليوم الثاني)', bn: 'আইয়ামুল বীজ (২য় দিন)', ur: 'ایام البیض (دوسرا دن)', tr: 'Eyyâm-ı Bîd (2. Gün)', ms: 'Ayyamul Bidh (Hari 2)', id: 'Ayyamul Bidh (Hari 2)', fr: 'Ayyam al-Bid (Jour 2)' },
            desc: { en: 'Sunnah fasting on the 14th of each Hijri month (White Days).', ar: 'صيام سنة في 14 من كل شهر هجري.', bn: 'প্রতি হিজরি মাসের ১৪ তারিখে সুন্নত রোজা।', ur: 'ہر ہجری مہینے کی 14 تاریخ کو سنت روزہ۔' }
        },
        {
            month: 0, day: 15, category: 'fasting', id: 'ayyam_beed_3', recurring: true,
            name: { en: 'Ayyam al-Beed (White Days Fast - Day 3)', ar: 'أيام البيض (اليوم الثالث)', bn: 'আইয়ামুল বীজ (৩য় দিন)', ur: 'ایام البیض (تیسرا دن)', tr: 'Eyyâm-ı Bîd (3. Gün)', ms: 'Ayyamul Bidh (Hari 3)', id: 'Ayyamul Bidh (Hari 3)', fr: 'Ayyam al-Bid (Jour 3)' },
            desc: { en: 'Sunnah fasting on the 15th of each Hijri month (White Days).', ar: 'صيام سنة في 15 من كل شهر هجري.', bn: 'প্রতি হিজরি মাসের ১৫ তারিখে সুন্নত রোজা।', ur: 'ہر ہجری مہینے کی 15 تاریخ کو سنت روزہ۔' }
        }
    ];

    // Category configs
    const CATEGORIES = {
        eid: { color: '#FFD700', bg: 'rgba(255,215,0,0.15)', icon: '🌙', label: { en: 'Eid', ar: 'عيد', bn: 'ঈদ', ur: 'عید', tr: 'Bayram', ms: 'Hari Raya', id: 'Hari Raya', fr: 'Fête' } },
        holy: { color: '#00E676', bg: 'rgba(0,230,118,0.15)', icon: '🕌', label: { en: 'Holy', ar: 'مقدس', bn: 'পবিত্র', ur: 'مقدس', tr: 'Kutsal', ms: 'Suci', id: 'Suci', fr: 'Sacré' } },
        fasting: { color: '#42A5F5', bg: 'rgba(66,165,245,0.15)', icon: '🤲', label: { en: 'Fasting', ar: 'صيام', bn: 'রোজা', ur: 'روزہ', tr: 'Oruç', ms: 'Puasa', id: 'Puasa', fr: 'Jeûne' } },
        hajj: { color: '#AB47BC', bg: 'rgba(171,71,188,0.15)', icon: '🕋', label: { en: 'Hajj', ar: 'حج', bn: 'হজ', ur: 'حج', tr: 'Hac', ms: 'Haji', id: 'Haji', fr: 'Hajj' } },
        historical: { color: '#FF7043', bg: 'rgba(255,112,67,0.15)', icon: '📜', label: { en: 'Historical', ar: 'تاريخي', bn: 'ঐতিহাসিক', ur: 'تاریخی', tr: 'Tarihî', ms: 'Sejarah', id: 'Sejarah', fr: 'Historique' } }
    };

    function getEventsForDate(month, day) {
        return EVENTS.filter(e =>
            (e.month === month && e.day === day) ||
            (e.recurring && e.month === 0 && e.day === day)
        );
    }

    function getEventsForMonth(month) {
        return EVENTS.filter(e => e.month === month || (e.recurring && e.month === 0));
    }

    function hasEvent(month, day) {
        return EVENTS.some(e =>
            (e.month === month && e.day === day) ||
            (e.recurring && e.month === 0 && e.day === day)
        );
    }

    function getCategoryInfo(category) {
        return CATEGORIES[category] || CATEGORIES.historical;
    }

    return {
        EVENTS,
        CATEGORIES,
        getEventsForDate,
        getEventsForMonth,
        hasEvent,
        getCategoryInfo
    };
})();
