'use strict';
// اللغات: العربية (الأصل) + English, اردو, বাংলা, Bahasa Indonesia, Filipino, हिन्दी
// الطريقة: الواجهة مكتوبة بالعربية، وهذا الملف يترجم عقد النص بعد رسمها (تطابق تام ← أنماط ← مقاطع قصيرة). لا يمسّ منطق التطبيق.
(function(){
const LANGS=[['ar','العربية','rtl','ar-SA-u-nu-latn'],['en','English','ltr','en-US'],['ur','اردو','rtl','ur-PK-u-nu-latn'],['bn','বাংলা','ltr','bn-BD-u-nu-latn'],
  ['id','Bahasa Indonesia','ltr','id-ID'],['tl','Filipino','ltr','fil-PH'],['hi','हिन्दी','ltr','hi-IN-u-nu-latn'],
  ['tr','Türkçe','ltr','tr-TR'],['fa','فارسی','rtl','fa-IR-u-nu-latn'],['ms','Bahasa Melayu','ltr','ms-MY'],['fr','Français','ltr','fr-FR'],['ru','Русский','ltr','ru-RU'],
  ['zh','中文','ltr','zh-CN'],['sw','Kiswahili','ltr','sw-KE'],['ha','Hausa','ltr','ha-NG'],['ps','پښتو','rtl','ps-AF-u-nu-latn'],['so','Soomaali','ltr','so-SO'],
  ['de','Deutsch','ltr','de-DE'],['es','Español','ltr','es-ES'],['ku','Kurdî','ltr','ku-TR'],['uz','Oʻzbekcha','ltr','uz-UZ'],['sq','Shqip','ltr','sq-AL']];
const EXTL=['tr','fa','ms','fr','ru','zh','sw','ha','ps','so','de','es','ku','uz','sq'];   // لغات كل منها في ملف lang/xx.js يُحمَّل عند اختيارها
const IDX={en:1,ur:2,bn:3,id:4,tl:5,hi:6};
let cur='ar';
try{ const s=localStorage.getItem('bilal_lang'); if(s&&LANGS.some(l=>l[0]===s)) cur=s;
  else { const n=(navigator.language||'ar').slice(0,2).toLowerCase(); const m={fi:'tl',fil:'tl'}[n]||n; if(LANGS.some(l=>l[0]===m)) cur=m; } }catch(_){}
const EXT=(window.BILAL_L||{})[cur];
if(EXTL.indexOf(cur)>=0&&!EXT) cur='ar';   // ملف اللغة غير موجود: نعرض العربية بدل «undefined»
const meta=LANGS.find(l=>l[0]===cur);
document.documentElement.lang=cur; document.documentElement.dir=meta[2]; document.documentElement.dataset.l=cur;

// [عربي, en, ur, bn, id, tl, hi] — تطابق تام لعقدة نص
const X=[
['الرئيسية','Home','ہوم','হোম','Beranda','Home','होम'],
['القبلة','Qibla','قبلہ','কিবলা','Kiblat','Qibla','क़िबला'],
['اللغة','Language','زبان','ভাষা','Bahasa','Wika','भाषा'],
['حمّل التطبيق','Get the app','ایپ حاصل کریں','অ্যাপ নিন','Unduh aplikasi','I-download ang app','ऐप पाएँ'],
['إغلاق','Close','بند کریں','বন্ধ করুন','Tutup','Isara','बंद करें'],
['رمضان','Ramadan','رمضان','রমজান','Ramadan','Ramadan','रमज़ान'],
['مستشاري','Mustashari','مستشاری','মুস্তাশারি','Mustashari','Mustashari','मुस्तशारी'],
['الإعدادات','Settings','ترتیبات','সেটিংস','Pengaturan','Mga Setting','सेटिंग्स'],
['الفجر','Fajr','فجر','ফজর','Subuh','Fajr','फ़ज्र'],
['الشروق','Sunrise','طلوعِ آفتاب','সূর্যোদয়','Terbit','Sunrise','सूर्योदय'],
['الظهر','Dhuhr','ظہر','যোহর','Zuhur','Dhuhr','ज़ुहर'],
['العصر','Asr','عصر','আসর','Asar','Asr','अस्र'],
['المغرب','Maghrib','مغرب','মাগরিব','Magrib','Maghrib','मग़रिब'],
['العشاء','Isha','عشاء','এশা','Isya','Isha','इशा'],
['الجمعة','Jumu\'ah','جمعہ','জুমআ','Jumat','Jumu\'ah','जुमा'],
['افتح التطبيق لتحديث المواقيت','Open the app to refresh prayer times','اوقات اپڈیٹ کرنے کے لیے ایپ کھولیں','নামাজের সময় হালনাগাদ করতে অ্যাপ খুলুন','Buka aplikasi untuk memperbarui waktu salat','Buksan ang app para i-update ang oras ng dasal','नमाज़ के समय अपडेट करने के लिए ऐप खोलें'],
['٨ مستشارين · مجلسك الاستشاري','8 Advisors · Your Advisory Council','۸ مشیر · آپ کی مشاورتی مجلس','৮ উপদেষ্টা · আপনার পরামর্শ সভা','8 Penasihat · Majelis Konsultasi Anda','8 Tagapayo · Ang Iyong Konseho','8 सलाहकार · आपकी सलाह-सभा'],
['المواقيت تُحسب على جهازك بحسب موقعك وطريقة الحساب المختارة (الأصل: بحسب بلدك؛ وأم القرى في السعودية)، ولا تُرسل بياناتك لأي جهة.','Prayer times are calculated on your device from your location and the chosen method (default: by your country; Umm al-Qura in Saudi Arabia). Your data is never sent anywhere.','اوقاتِ نماز آپ کے فون پر آپ کے مقام اور منتخب طریقے سے نکالے جاتے ہیں (بنیادی طور پر آپ کے ملک کے مطابق؛ سعودی عرب میں اُم القریٰ)۔ آپ کا ڈیٹا کہیں نہیں بھیجا جاتا۔','নামাজের সময় আপনার ফোনেই আপনার অবস্থান ও নির্বাচিত পদ্ধতিতে হিসাব হয় (ডিফল্ট: আপনার দেশ অনুযায়ী; সৌদিতে উম্মুল কুরা)। আপনার তথ্য কোথাও পাঠানো হয় না।','Waktu salat dihitung di perangkat Anda berdasarkan lokasi dan metode yang dipilih (bawaan: sesuai negara Anda; Umm al-Qura di Arab Saudi). Data Anda tidak dikirim ke mana pun.','Kinukuwenta ang oras ng dasal sa iyong device ayon sa lokasyon at piniling paraan (default: ayon sa bansa mo; Umm al-Qura sa Saudi Arabia). Walang ipinapadalang data.','नमाज़ के समय आपके फ़ोन पर ही आपकी लोकेशन और चुनी गई विधि से निकाले जाते हैं (डिफ़ॉल्ट: आपके देश के अनुसार; सऊदी में उम्मुल क़ुरा)। आपका डेटा कहीं नहीं भेजा जाता।'],
// المعالج
['أهلاً بك في أذان بلال','Welcome to Bilal Adhan','اذانِ بلال میں خوش آمدید','বিলাল আজানে স্বাগতম','Selamat datang di Adzan Bilal','Maligayang pagdating sa Bilal Adhan','बिलाल अज़ान में आपका स्वागत है'],
['أين أنت؟','Where are you?','آپ کہاں ہیں؟','আপনি কোথায়?','Di mana lokasi Anda?','Nasaan ka?','आप कहाँ हैं?'],
['نحسب مواقيت الصلاة على جهازك بحسب موقعك، ولا يُرسل موقعك لأي جهة.','We calculate prayer times on your device from your location. Your location is never sent anywhere.','ہم نماز کے اوقات آپ کے فون پر آپ کے مقام سے نکالتے ہیں، اور آپ کا مقام کہیں نہیں بھیجا جاتا۔','আমরা আপনার ফোনেই অবস্থান থেকে নামাজের সময় হিসাব করি। আপনার অবস্থান কোথাও পাঠানো হয় না।','Kami menghitung waktu salat di perangkat Anda berdasarkan lokasi. Lokasi Anda tidak dikirim ke mana pun.','Kinukuwenta namin ang oras ng dasal sa device mo ayon sa lokasyon. Hindi ipinapadala ang lokasyon mo.','हम नमाज़ के समय आपके फ़ोन पर ही आपकी लोकेशन से निकालते हैं। आपकी लोकेशन कहीं नहीं भेजी जाती।'],
['تحديد موقعي تلقائياً','Detect my location','میرا مقام خودکار طور پر معلوم کریں','আমার অবস্থান নিজে থেকে নির্ধারণ করুন','Deteksi lokasi saya','Hanapin ang lokasyon ko','मेरी लोकेशन अपने-आप पता करें'],
['أو اختر مدينة','Or choose a city','یا شہر منتخب کریں','অথবা শহর বেছে নিন','Atau pilih kota','O pumili ng lungsod','या शहर चुनें'],
['الإشعارات','Notifications','اطلاعات','নোটিফিকেশন','Notifikasi','Mga Notification','नोटिफ़िकेशन'],
['لتظهر شاشة الأذان وتنبيه الصلاة.','So the adhan screen and prayer alert can appear.','تاکہ اذان کی اسکرین اور نماز کی اطلاع ظاہر ہو۔','যাতে আজানের স্ক্রিন ও নামাজের সতর্কতা দেখা যায়।','Agar layar adzan dan pengingat salat dapat muncul.','Para lumabas ang adhan screen at paalala ng dasal.','ताकि अज़ान की स्क्रीन और नमाज़ की सूचना दिख सके।'],
['السماح بالإشعارات','Allow notifications','اطلاعات کی اجازت دیں','নোটিফিকেশনের অনুমতি দিন','Izinkan notifikasi','Payagan ang mga notification','नोटिफ़िकेशन की अनुमति दें'],
['الأذان على الدقيقة','Adhan right on time','اذان عین وقت پر','ঠিক সময়ে আজান','Adzan tepat waktu','Adhan sa eksaktong oras','अज़ान ठीक समय पर'],
['يطلب أندرويد إذن «المنبّهات والتذكيرات» ليبدأ الأذان في وقته تماماً.','Android asks for the “Alarms & reminders” permission so the adhan starts exactly on time.','اینڈرائیڈ «الارم اور یاد دہانیاں» کی اجازت مانگتا ہے تاکہ اذان عین وقت پر شروع ہو۔','অ্যান্ড্রয়েড «অ্যালার্ম ও রিমাইন্ডার» অনুমতি চায়, যাতে আজান ঠিক সময়ে শুরু হয়।','Android meminta izin “Alarm & pengingat” agar adzan mulai tepat waktu.','Hinihingi ng Android ang pahintulot na “Alarms & reminders” para magsimula ang adhan sa eksaktong oras.','एंड्रॉयड «अलार्म और रिमाइंडर» की अनुमति माँगता है ताकि अज़ान ठीक समय पर शुरू हो।'],
['منح الإذن','Grant permission','اجازت دیں','অনুমতি দিন','Berikan izin','Ibigay ang pahintulot','अनुमति दें'],
['الصامت وقت الصلاة','Silent during prayer','نماز کے وقت خاموش','নামাজের সময় সাইলেন্ট','Senyap saat salat','Silent habang nagdarasal','नमाज़ के समय साइलेंट'],
['اختياري: يحوّل الجوال لصامت وقت الصلاة ثم يعيده. يلزمه «الوصول إلى عدم الإزعاج».','Optional: switches your phone to silent during prayer, then restores it. Needs “Do Not Disturb access”.','اختیاری: نماز کے وقت فون خاموش کرتا ہے پھر بحال کر دیتا ہے۔ اس کے لیے «ڈسٹرب نہ کریں» تک رسائی درکار ہے۔','ঐচ্ছিক: নামাজের সময় ফোন সাইলেন্ট করে, পরে আগের অবস্থায় ফেরায়। এর জন্য «বিরক্ত করবেন না» অ্যাক্সেস লাগে।','Opsional: mengubah ponsel menjadi senyap saat salat lalu mengembalikannya. Butuh akses “Jangan Ganggu”.','Opsyonal: ginagawang silent ang phone habang nagdarasal, saka ibinabalik. Kailangan ng access sa “Do Not Disturb”.','वैकल्पिक: नमाज़ के समय फ़ोन को साइलेंट करता है, फिर वापस कर देता है। इसके लिए «डू नॉट डिस्टर्ब» की पहुँच चाहिए।'],
['لا أريد الصامت','I don\'t want silent mode','مجھے خاموش موڈ نہیں چاہیے','আমি সাইলেন্ট চাই না','Saya tidak mau mode senyap','Ayaw ko ng silent mode','मुझे साइलेंट नहीं चाहिए'],
['البطارية','Battery','بیٹری','ব্যাটারি','Baterai','Baterya','बैटरी'],
['بعض الهواتف توقف التطبيقات لتوفير الطاقة فيفوتك الأذان. اختر «بلا قيود» لهذا التطبيق.','Some phones stop apps to save power and you may miss the adhan. Choose “Unrestricted” for this app.','کچھ فون بجلی بچانے کے لیے ایپس بند کر دیتے ہیں اور اذان رہ سکتی ہے۔ اس ایپ کے لیے «بلا پابندی» منتخب کریں۔','কিছু ফোন চার্জ বাঁচাতে অ্যাপ বন্ধ করে দেয়, ফলে আজান মিস হতে পারে। এই অ্যাপের জন্য «সীমাহীন» বেছে নিন।','Beberapa ponsel menghentikan aplikasi demi hemat daya sehingga adzan bisa terlewat. Pilih “Tanpa batasan” untuk aplikasi ini.','Pinipigil ng ilang phone ang apps para makatipid ng power kaya maaaring hindi marinig ang adhan. Piliin ang “Unrestricted” para sa app na ito.','कुछ फ़ोन बिजली बचाने के लिए ऐप बंद कर देते हैं और अज़ान छूट सकती है। इस ऐप के लिए «बिना प्रतिबंध» चुनें।'],
['إعدادات البطارية','Battery settings','بیٹری کی ترتیبات','ব্যাটারি সেটিংস','Pengaturan baterai','Mga setting ng baterya','बैटरी सेटिंग्स'],
['✓ تم','✓ Done','✓ ہو گیا','✓ সম্পন্ন','✓ Selesai','✓ Tapos na','✓ हो गया'],
['ابدأ','Start','شروع کریں','শুরু করুন','Mulai','Simulan','शुरू करें'],
['التالي','Next','اگلا','পরবর্তী','Berikutnya','Susunod','आगे'],
['إنهاء','Finish','ختم کریں','শেষ করুন','Selesai','Tapusin','समाप्त करें'],
['تخطَّ','Skip','چھوڑیں','এড়িয়ে যান','Lewati','Laktawan','छोड़ें'],
['أكمل الإعداد','Finish setup','سیٹ اپ مکمل کریں','সেটআপ সম্পন্ন করুন','Selesaikan pengaturan','Tapusin ang setup','सेटअप पूरा करें'],
['المنبّهات الدقيقة','Exact alarms','درست الارم','সঠিক অ্যালার্ম','Alarm tepat','Eksaktong alarm','सटीक अलार्म'],
['بدونها لا يظهر الأذان ولا التنبيه.','Without it, the adhan and alert will not appear.','اس کے بغیر اذان اور اطلاع ظاہر نہیں ہوگی۔','এটি ছাড়া আজান ও সতর্কতা দেখা যাবে না।','Tanpa ini, adzan dan pengingat tidak akan muncul.','Kung wala ito, hindi lalabas ang adhan at paalala.','इसके बिना अज़ान और सूचना नहीं दिखेगी।'],
['لضبط الأذان على الدقيقة؛ بدونه قد يتأخر دقائق.','To set the adhan to the exact minute; without it, it may be a few minutes late.','اذان کو عین منٹ پر لگانے کے لیے؛ اس کے بغیر چند منٹ تاخیر ہو سکتی ہے۔','আজান ঠিক মিনিটে বাজানোর জন্য; এটি ছাড়া কয়েক মিনিট দেরি হতে পারে।','Agar adzan berbunyi tepat menit; tanpa ini bisa terlambat beberapa menit.','Para tumunog ang adhan sa eksaktong minuto; kung wala ito, maaaring ma-late ng ilang minuto.','अज़ान ठीक मिनट पर बजाने के लिए; इसके बिना कुछ मिनट की देरी हो सकती है।'],
['يلزم «الوصول إلى عدم الإزعاج» ليصمت الجوال وقت الصلاة (اختياري).','“Do Not Disturb access” is needed to silence the phone during prayer (optional).','نماز کے وقت فون خاموش کرنے کے لیے «ڈسٹرب نہ کریں» تک رسائی چاہیے (اختیاری)۔','নামাজের সময় ফোন সাইলেন্ট করতে «বিরক্ত করবেন না» অ্যাক্সেস লাগবে (ঐচ্ছিক)।','Diperlukan akses “Jangan Ganggu” agar ponsel senyap saat salat (opsional).','Kailangan ang access sa “Do Not Disturb” para ma-silent ang phone habang nagdarasal (opsyonal).','नमाज़ के समय फ़ोन साइलेंट करने के लिए «डू नॉट डिस्टर्ब» की पहुँच चाहिए (वैकल्पिक)।'],
['بعض الهواتف توقف التطبيقات لتوفير البطارية فيفوتك الأذان. اختر «بلا قيود».','Some phones stop apps to save battery and you may miss the adhan. Choose “Unrestricted”.','کچھ فون بیٹری بچانے کے لیے ایپس بند کر دیتے ہیں اور اذان رہ سکتی ہے۔ «بلا پابندی» منتخب کریں۔','কিছু ফোন ব্যাটারি বাঁচাতে অ্যাপ বন্ধ করে দেয়, ফলে আজান মিস হতে পারে। «সীমাহীন» বেছে নিন।','Beberapa ponsel menghentikan aplikasi demi hemat baterai sehingga adzan bisa terlewat. Pilih “Tanpa batasan”.','Pinipigil ng ilang phone ang apps para makatipid ng baterya kaya maaaring hindi marinig ang adhan. Piliin ang “Unrestricted”.','कुछ फ़ोन बैटरी बचाने के लिए ऐप बंद कर देते हैं और अज़ान छूट सकती है। «बिना प्रतिबंध» चुनें।'],
['يبقى إذن واحد لتعمل الأذانات كما ينبغي.','One permission left so the adhans work properly.','اذانیں ٹھیک چلنے کے لیے ایک اجازت باقی ہے۔','আজান ঠিকমতো চলতে আর একটি অনুমতি বাকি।','Tinggal satu izin lagi agar adzan berfungsi dengan baik.','Isang pahintulot na lang para gumana nang maayos ang adhan.','अज़ान ठीक से चलने के लिए एक अनुमति बाकी है।'],
['يبقى إذنان لتعمل الأذانات كما ينبغي.','Two permissions left so the adhans work properly.','اذانیں ٹھیک چلنے کے لیے دو اجازتیں باقی ہیں۔','আজান ঠিকমতো চলতে আর দুটি অনুমতি বাকি।','Tinggal dua izin lagi agar adzan berfungsi dengan baik.','Dalawang pahintulot na lang para gumana nang maayos ang adhan.','अज़ान ठीक से चलने के लिए दो अनुमतियाँ बाकी हैं।'],
// الرئيسية والقبلة
['نحن في شهر رمضان — تقبّل الله منا ومنكم','We are in Ramadan — may Allah accept from us and you','ہم رمضان کے مہینے میں ہیں — اللہ ہم سب سے قبول فرمائے','আমরা রমজান মাসে — আল্লাহ আমাদের ও আপনাদের কবুল করুন','Kita berada di bulan Ramadan — semoga Allah menerima amal kita semua','Nasa buwan tayo ng Ramadan — nawa\'y tanggapin ito ng Allah mula sa atin','हम रमज़ान के महीने में हैं — अल्लाह हम सबसे क़बूल करे'],
['التاريخ','Date','تاریخ','তারিখ','Tanggal','Petsa','तारीख़'],
['الإمساك','Imsak','امساک','ইমসাক','Imsak','Imsak','इमसाक'],
['المغرب (الإفطار)','Maghrib (Iftar)','مغرب (افطار)','মাগরিব (ইফতার)','Magrib (Berbuka)','Maghrib (Iftar)','मग़रिब (इफ़्तार)'],
['لم يُعثر على رمضان القادم.','Could not find the next Ramadan.','اگلا رمضان نہیں مل سکا۔','পরবর্তী রমজান পাওয়া যায়নি।','Ramadan berikutnya tidak ditemukan.','Hindi nahanap ang susunod na Ramadan.','अगला रमज़ान नहीं मिला।'],
['أنت في الحرم المكي','You are in the Holy Mosque of Makkah','آپ مسجدِ حرام (مکہ) میں ہیں','আপনি মক্কার মসজিদুল হারামে আছেন','Anda berada di Masjidil Haram, Makkah','Nasa Masjid al-Haram ka sa Makkah','आप मक्का की मस्जिदुल हराम में हैं'],
['جارٍ قراءة البوصلة…','Reading the compass…','قطب نما پڑھا جا رہا ہے…','কম্পাস পড়া হচ্ছে…','Membaca kompas…','Binabasa ang compass…','कम्पास पढ़ा जा रहा है…'],
['ضع الجوال أفقياً ومسطّحاً وبعيداً عن المعادن والمغناطيس. إن بدت القراءة خاطئة حرّكه على شكل ٨ في الهواء لمعايرته.','Hold the phone flat and level, away from metal and magnets. If the reading looks wrong, move it in a figure-8 in the air to calibrate.','فون کو سیدھا اور ہموار رکھیں، دھات اور مقناطیس سے دور۔ ریڈنگ غلط لگے تو ہوا میں ۸ کی شکل میں گھمائیں تاکہ کیلیبریٹ ہو جائے۔','ফোন সমতলভাবে ধরুন, ধাতু ও চুম্বক থেকে দূরে। রিডিং ভুল মনে হলে বাতাসে ৮ আকারে ঘুরিয়ে ক্যালিব্রেট করুন।','Pegang ponsel mendatar, jauh dari logam dan magnet. Jika pembacaan terlihat salah, gerakkan membentuk angka 8 di udara untuk kalibrasi.','Hawakan nang patag ang phone, malayo sa metal at magnet. Kung mali ang basa, igalaw nang hugis-8 sa hangin para ma-calibrate.','फ़ोन को सीधा और समतल रखें, धातु और चुंबक से दूर। रीडिंग गलत लगे तो हवा में ८ की आकृति में घुमाकर कैलिब्रेट करें।'],
['لم تحدد موقعك بعد.','You haven\'t set your location yet.','آپ نے ابھی اپنا مقام طے نہیں کیا۔','আপনি এখনো অবস্থান নির্ধারণ করেননি।','Anda belum menentukan lokasi.','Hindi mo pa naitatakda ang lokasyon mo.','आपने अभी लोकेशन तय नहीं की है।'],
['الاتجاه الظاهر محسوب من مكة (الموقع الافتراضي)، فهو غير صحيح لك.','The direction shown is calculated from Makkah (the default location), so it is not correct for you.','دکھائی گئی سمت مکہ (طے شدہ مقام) سے نکالی گئی ہے، لہٰذا آپ کے لیے درست نہیں۔','দেখানো দিকটি মক্কা (ডিফল্ট অবস্থান) থেকে হিসাব করা, তাই আপনার জন্য সঠিক নয়।','Arah yang tampil dihitung dari Makkah (lokasi bawaan), jadi tidak tepat untuk Anda.','Ang direksyong ipinapakita ay kinuwenta mula sa Makkah (default na lokasyon), kaya hindi ito tama para sa iyo.','दिखाई गई दिशा मक्का (डिफ़ॉल्ट लोकेशन) से निकाली गई है, इसलिए आपके लिए सही नहीं है।'],
['حدّد موقعي','Set my location','میرا مقام طے کریں','আমার অবস্থান নির্ধারণ করুন','Tentukan lokasi saya','Itakda ang lokasyon ko','मेरी लोकेशन तय करें'],
['أنت باتجاه القبلة ✓','You are facing the Qibla ✓','آپ قبلے کی سمت میں ہیں ✓','আপনি কিবলার দিকে আছেন ✓','Anda menghadap kiblat ✓','Nakaharap ka sa Qibla ✓','आप क़िबले की ओर हैं ✓'],
['لا توجد بوصلة متاحة في هذا الجهاز — اتجه بزاوية القبلة المكتوبة من الشمال','No compass available on this device — turn to the Qibla angle shown, measured from north','اس فون میں قطب نما نہیں — شمال سے لکھی گئی قبلے کی زاویے کی طرف رخ کریں','এই ফোনে কম্পাস নেই — উত্তর থেকে লেখা কিবলার কোণ অনুযায়ী ঘুরুন','Tidak ada kompas di perangkat ini — hadap sesuai sudut kiblat dari utara','Walang compass sa device na ito — humarap ayon sa anggulo ng Qibla mula hilaga','इस फ़ोन में कम्पास नहीं है — उत्तर से लिखे क़िबले के कोण की ओर मुड़ें'],
// الإعدادات
['الموقع','Location','مقام','অবস্থান','Lokasi','Lokasyon','लोकेशन'],
['الموقع الحالي','Current location','موجودہ مقام','বর্তমান অবস্থান','Lokasi saat ini','Kasalukuyang lokasyon','वर्तमान लोकेशन'],
['تحديد تلقائي','Auto-detect','خودکار','স্বয়ংক্রিয়','Deteksi otomatis','Auto-detect','ऑटो-डिटेक्ट'],
['طريقة الحساب','Calculation method','حساب کا طریقہ','হিসাবের পদ্ধতি','Metode perhitungan','Paraan ng pagkuwenta','गणना की विधि'],
['الطريقة','Method','طریقہ','পদ্ধতি','Metode','Paraan','विधि'],
['تلقائي بحسب بلدك','Automatic, by your country','خودکار، آپ کے ملک کے مطابق','স্বয়ংক্রিয়, আপনার দেশ অনুযায়ী','Otomatis sesuai negara Anda','Awtomatiko, ayon sa bansa mo','स्वचालित, आपके देश के अनुसार'],
['وقت العصر','Asr time','وقتِ عصر','আসরের সময়','Waktu Asar','Oras ng Asr','अस्र का समय'],
['الجمهور: مثل الظل. الحنفي: مثلا الظل','Majority: shadow equals object. Hanafi: twice the shadow','جمہور: سایہ ایک مثل۔ حنفی: دو مثل','জমহুর: ছায়া এক গুণ। হানাফি: ছায়া দ্বিগুণ','Jumhur: bayangan sama panjang. Hanafi: dua kali panjang','Jumhur: katumbas ang anino. Hanafi: dalawang beses ang anino','जमहूर: साया बराबर। हनफ़ी: साया दोगुना'],
['الجمهور (الأصل)','Majority (default)','جمہور (بنیادی)','জমহুর (ডিফল্ট)','Jumhur (bawaan)','Jumhur (default)','जमहूर (डिफ़ॉल्ट)'],
['الحنفي','Hanafi','حنفی','হানাফি','Hanafi','Hanafi','हनफ़ी'],
['في المدن البعيدة شمالاً (فوق 48°) يُستعمل «سُبع الليل» للفجر والعشاء في الصيف، وقد تختلف المساجد المحلية عنه؛ اتبع مسجدك إن اختلف.','In far-northern cities (above 48°) the “seventh of the night” rule is used for Fajr and Isha in summer; local mosques may differ — follow your mosque if it does.','دور شمالی شہروں (48° سے اوپر) میں گرمیوں میں فجر اور عشاء کے لیے «رات کا ساتواں حصہ» استعمال ہوتا ہے؛ مقامی مساجد مختلف ہو سکتی ہیں — اختلاف ہو تو اپنی مسجد کی پیروی کریں۔','উত্তরের দূরবর্তী শহরে (৪৮° এর উপরে) গ্রীষ্মে ফজর ও এশার জন্য «রাতের সপ্তমাংশ» নিয়ম ব্যবহৃত হয়; স্থানীয় মসজিদ ভিন্ন হতে পারে — ভিন্ন হলে আপনার মসজিদ অনুসরণ করুন।','Di kota-kota jauh di utara (di atas 48°) digunakan aturan “sepertujuh malam” untuk Subuh dan Isya saat musim panas; masjid setempat bisa berbeda — ikuti masjid Anda bila berbeda.','Sa mga lungsod na malayo sa hilaga (higit 48°), ginagamit ang “ikapitong bahagi ng gabi” para sa Fajr at Isha tuwing tag-init; maaaring magkaiba ang lokal na moske — sundin ang moske mo kung iba.','उत्तर के दूर वाले शहरों (48° से ऊपर) में गर्मियों में फ़ज्र और इशा के लिए «रात का सातवाँ हिस्सा» नियम इस्तेमाल होता है; स्थानीय मस्जिदें अलग हो सकती हैं — अलग हो तो अपनी मस्जिद का पालन करें।'],
['الأذان','Adhan','اذان','আজান','Adzan','Adhan','अज़ान'],
['المؤذن','Muezzin','مؤذن','মুয়াজ্জিন','Muazin','Muezzin','मुअज़्ज़िन'],
['الأصوات من مكتبة حرّة الترخيص','Sounds from freely licensed libraries','آوازیں آزاد لائسنس والی لائبریریوں سے','শব্দ মুক্ত লাইসেন্সের লাইব্রেরি থেকে','Suara dari pustaka berlisensi bebas','Mga tunog mula sa mga libreng-lisensyang library','आवाज़ें मुक्त लाइसेंस वाली लाइब्रेरी से'],
['النوع','Type','قسم','ধরন','Jenis','Uri','प्रकार'],
['تكبيرتان «الله أكبر الله أكبر» فقط، أو الأذان كاملاً','Only the two takbirs “Allahu Akbar, Allahu Akbar”, or the full adhan','صرف دو تکبیریں «اللہ اکبر اللہ اکبر»، یا مکمل اذان','শুধু দুই তাকবির «আল্লাহু আকবার আল্লাহু আকবার», অথবা পূর্ণ আজান','Hanya dua takbir “Allahu Akbar, Allahu Akbar”, atau adzan lengkap','Dalawang takbir lang na “Allahu Akbar, Allahu Akbar”, o ang buong adhan','सिर्फ़ दो तकबीरें «अल्लाहु अकबर अल्लाहु अकबर», या पूरी अज़ान'],
['تكبيرتان فقط','Two takbirs only','صرف دو تکبیریں','শুধু দুই তাকবির','Dua takbir saja','Dalawang takbir lang','सिर्फ़ दो तकबीरें'],
['الأذان كاملاً','Full adhan','مکمل اذان','পূর্ণ আজান','Adzan lengkap','Buong adhan','पूरी अज़ान'],
['رفع الصوت تلقائياً','Raise volume automatically','آواز خودکار بلند کریں','স্বয়ংক্রিয়ভাবে ভলিউম বাড়ান','Naikkan volume otomatis','Awtomatikong itaas ang volume','आवाज़ अपने-आप बढ़ाएँ'],
['إن كان صوت المنبّه منخفضاً جداً فيفوتك الأذان','If the alarm volume is very low you might miss the adhan','الارم کی آواز بہت کم ہو تو اذان رہ سکتی ہے','অ্যালার্মের ভলিউম খুব কম হলে আজান মিস হতে পারে','Jika volume alarm sangat rendah, adzan bisa terlewat','Kung masyadong mahina ang alarm, maaaring hindi marinig ang adhan','अलार्म की आवाज़ बहुत कम हो तो अज़ान छूट सकती है'],
['جرّب الصوت','Try the sound','آواز آزمائیں','শব্দ পরীক্ষা করুন','Coba suara','Subukan ang tunog','आवाज़ आज़माएँ'],
['تشغيل','Play','چلائیں','চালান','Putar','I-play','चलाएँ'],
['إيقاف','Stop','روکیں','থামান','Hentikan','Ihinto','रोकें'],
['اختبار الأذان الفعلي','Real adhan test','حقیقی اذان کا تجربہ','প্রকৃত আজান পরীক্ষা','Uji adzan sebenarnya','Totoong pagsubok ng adhan','असली अज़ान टेस्ट'],
['يشغّل الأذان بالمسار نفسه الذي يعمل وقت الصلاة (إشعار + شاشة كاملة). اختر التأخير ثم اقفل الجوال أو اتركه لتجرّب الحالتين.','Plays the adhan through the same path used at prayer time (notification + full screen). Pick a delay, then lock the phone or leave it on to try both cases.','اذان اسی راستے سے چلاتا ہے جو نماز کے وقت چلتا ہے (اطلاع + مکمل اسکرین)۔ تاخیر منتخب کریں پھر فون لاک کریں یا کھلا رہنے دیں تاکہ دونوں صورتیں آزمائی جا سکیں۔','নামাজের সময় যে পথে চলে সেই একই পথে আজান চালায় (নোটিফিকেশন + পূর্ণ স্ক্রিন)। বিলম্ব বেছে নিন, তারপর ফোন লক করুন বা খোলা রাখুন—দুই অবস্থাই পরীক্ষা করুন।','Memutar adzan lewat jalur yang sama saat waktu salat (notifikasi + layar penuh). Pilih jeda, lalu kunci ponsel atau biarkan menyala untuk mencoba kedua kondisi.','Pinapatugtog ang adhan sa parehong paraan tuwing oras ng dasal (notification + full screen). Pumili ng pagkaantala, saka i-lock ang phone o iwang bukas para masubukan ang dalawa.','नमाज़ के समय जिस रास्ते से अज़ान चलती है उसी से चलाता है (नोटिफ़िकेशन + पूरी स्क्रीन)। देरी चुनें, फिर फ़ोन लॉक करें या खुला छोड़ें और दोनों हालात आज़माएँ।'],
['فوراً','Now','ابھی','এখনই','Sekarang','Ngayon','अभी'],
['بعد 15 ثانية','After 15 seconds','15 سیکنڈ بعد','১৫ সেকেন্ড পরে','Setelah 15 detik','Pagkalipas ng 15 segundo','15 सेकंड बाद'],
['بعد دقيقة','After a minute','ایک منٹ بعد','এক মিনিট পরে','Setelah semenit','Pagkalipas ng isang minuto','एक मिनट बाद'],
['في الساعة المحدّدة ↓','At the chosen time ↓','مقررہ وقت پر ↓','নির্ধারিত সময়ে ↓','Pada jam yang ditentukan ↓','Sa napiling oras ↓','चुने हुए समय पर ↓'],
['تحويل الجوال لصامت لمدة','Switch phone to silent for','فون کو اتنی دیر خاموش کریں','ফোন সাইলেন্ট রাখুন','Ubah ponsel ke senyap selama','I-silent ang phone sa loob ng','फ़ोन को साइलेंट रखें'],
['يسمح بالمنبّهات فقط، ثم يعود لوضعه السابق','Allows alarms only, then returns to its previous mode','صرف الارم کی اجازت، پھر پچھلی حالت پر واپس','শুধু অ্যালার্ম চলবে, তারপর আগের অবস্থায় ফিরবে','Hanya alarm yang diizinkan, lalu kembali ke mode semula','Alarms lang ang papayagan, saka babalik sa dating mode','सिर्फ़ अलार्म चलेंगे, फिर पहले वाली स्थिति में लौटेगा'],
['بدون','None','نہیں','বন্ধ','Tidak ada','Wala','नहीं'],
['تنبيه قبل الإمساك','Alert before Imsak','امساک سے پہلے اطلاع','ইমসাকের আগে সতর্কতা','Pengingat sebelum Imsak','Paalala bago ang Imsak','इमसाक से पहले सूचना'],
['الإمساك قبل الفجر بـ','Imsak before Fajr by','امساک فجر سے پہلے','ফজরের কত আগে ইমসাক','Imsak sebelum Subuh selama','Imsak bago ang Fajr nang','फ़ज्र से कितना पहले इमसाक'],
['تصحيح بداية الشهر','Month start correction','مہینے کے آغاز کی درستی','মাসের শুরু সংশোধন','Koreksi awal bulan','Pagtatama sa simula ng buwan','महीने की शुरुआत में सुधार'],
['إن اختلفت الرؤية عن التقويم','If moon sighting differs from the calendar','اگر رویتِ ہلال کیلنڈر سے مختلف ہو','চাঁদ দেখা ক্যালেন্ডার থেকে ভিন্ন হলে','Jika rukyat berbeda dari kalender','Kung iba ang pagkakita ng buwan sa kalendaryo','अगर चाँद दिखना कैलेंडर से अलग हो'],
['يوم أبكر','One day earlier','ایک دن پہلے','এক দিন আগে','Sehari lebih awal','Isang araw na mas maaga','एक दिन पहले'],
['كما في التقويم','As in the calendar','کیلنڈر کے مطابق','ক্যালেন্ডার অনুযায়ী','Sesuai kalender','Ayon sa kalendaryo','कैलेंडर के अनुसार'],
['يوم أبعد','One day later','ایک دن بعد','এক দিন পরে','Sehari lebih lambat','Isang araw na mas huli','एक दिन बाद'],
['المظهر والودّجت','Appearance & widget','ظاہری شکل اور ویجٹ','চেহারা ও উইজেট','Tampilan & widget','Itsura at widget','रूप और विजेट'],
['الوضع','Mode','موڈ','মোড','Mode','Mode','मोड'],
['تلقائي = يتبع الوضع الليلي/النهاري للجوال (التطبيق والودّجت)','Auto = follows the phone\'s dark/light mode (app and widget)','خودکار = فون کے دن/رات موڈ کے مطابق (ایپ اور ویجٹ)','স্বয়ংক্রিয় = ফোনের দিন/রাত মোড অনুসরণ করে (অ্যাপ ও উইজেট)','Otomatis = mengikuti mode gelap/terang ponsel (aplikasi & widget)','Auto = sumusunod sa dark/light mode ng phone (app at widget)','स्वचालित = फ़ोन के डार्क/लाइट मोड के अनुसार (ऐप और विजेट)'],
['تلقائي','Auto','خودکار','স্বয়ংক্রিয়','Otomatis','Auto','ऑटो'],
['داكن','Dark','گہرا','গাঢ়','Gelap','Madilim','डार्क'],
['فاتح','Light','ہلکا','হালকা','Terang','Maliwanag','लाइट'],
['شفاف','Clear','شفاف','স্বচ্ছ','Transparan','Malinaw','पारदर्शी'],
['لون التمييز','Accent color','نمایاں رنگ','হাইলাইট রং','Warna aksen','Kulay ng accent','एक्सेंट रंग'],
['الصلاة القادمة في الودّجت','Next prayer in the widget','ویجٹ میں آنے والی نماز','উইজেটে পরবর্তী নামাজ','Salat berikutnya di widget','Susunod na dasal sa widget','विजेट में अगली नमाज़'],
['لون خلفية الودّجت','Widget background color','ویجٹ کا پس منظر رنگ','উইজেটের ব্যাকগ্রাউন্ড রং','Warna latar widget','Kulay ng background ng widget','विजेट का बैकग्राउंड रंग'],
['لون النص','Text color','متن کا رنگ','লেখার রং','Warna teks','Kulay ng teksto','टेक्स्ट का रंग'],
['شفافية الخلفية','Background transparency','پس منظر کی شفافیت','ব্যাকগ্রাউন্ডের স্বচ্ছতা','Transparansi latar','Transparency ng background','बैकग्राउंड की पारदर्शिता'],
['إعادة الألوان للافتراضي','Reset colors to default','رنگ بنیادی پر لوٹائیں','রং ডিফল্টে ফেরান','Setel ulang warna ke bawaan','I-reset ang mga kulay sa default','रंग डिफ़ॉल्ट पर लौटाएँ'],
['إعادة','Reset','بحال کریں','রিসেট','Setel ulang','I-reset','रीसेट'],
['أضف الودّجت من الشاشة الرئيسية للجوال:','Add the widget from the phone\'s home screen:','ہوم اسکرین سے ویجٹ شامل کریں:','ফোনের হোম স্ক্রিন থেকে উইজেট যোগ করুন:','Tambahkan widget dari layar utama ponsel:','Idagdag ang widget mula sa home screen ng phone:','फ़ोन की होम स्क्रीन से विजेट जोड़ें:'],
['صف 1×4','1×4 row','1×4 قطار','১×৪ সারি','Baris 1×4','1×4 na hanay','1×4 पंक्ति'],
['(الصلوات الست مرتبة والقادمة ملوّنة وعليها العدّاد)، و','(six prayers in order, the next one colored with a countdown), and','(چھ نمازیں ترتیب سے، آنے والی رنگین اور کاؤنٹ ڈاؤن کے ساتھ)، اور','(ছয় ওয়াক্ত ক্রমানুসারে, পরবর্তীটি রঙিন ও কাউন্টডাউনসহ), এবং','(enam waktu berurutan, yang berikutnya berwarna dengan hitung mundur), dan','(anim na dasal nang magkakasunod, may kulay ang susunod at may countdown), at','(छह नमाज़ें क्रम में, अगली रंगीन और काउंटडाउन के साथ), और'],
['صغير','Small','چھوٹا','ছোট','Kecil','Maliit','छोटा'],
['، و',', and','، اور',', এবং',', dan',', at',', और'],
['مواقيت الصلوات','Prayer times','نماز کے اوقات','নামাজের সময়সূচি','Waktu salat','Oras ng dasal','नमाज़ के समय'],
['مشهد بلال','Bilal scene','بلال کا منظر','বিলালের দৃশ্য','Adegan Bilal','Eksena ni Bilal','बिलाल का दृश्य'],
['عن التطبيق','About','ایپ کے بارے میں','অ্যাপ সম্পর্কে','Tentang aplikasi','Tungkol sa app','ऐप के बारे में'],
['أذان بلال','Bilal Adhan','اذانِ بلال','বিলাল আজান','Adzan Bilal','Bilal Adhan','बिलाल अज़ान'],
['من تطبيقاتنا: مستشاري','From our apps: Mustashari','ہماری ایپس میں سے: مستشاری','আমাদের অ্যাপ: মুস্তাশারি','Dari aplikasi kami: Mustashari','Mula sa mga app namin: Mustashari','हमारे ऐप्स से: मुस्तशारी'],
['مجلس استشاري من علماء التاريخ بالذكاء الاصطناعي','An AI advisory council of scholars from history','تاریخ کے علما کی مصنوعی ذہانت پر مبنی مشاورتی مجلس','ইতিহাসের আলেমদের এআই-ভিত্তিক পরামর্শ সভা','Majelis konsultasi ulama sejarah berbasis AI','Isang AI na konseho ng mga iskolar mula sa kasaysayan','इतिहास के विद्वानों की एआई सलाह-सभा'],
['افتح','Open','کھولیں','খুলুন','Buka','Buksan','खोलें'],
['حمّل','Download','ڈاؤن لوڈ','ডাউনলোড','Unduh','I-download','डाउनलोड'],
['الخصوصية: موقعك يُستعمل لحساب المواقيت على جهازك فقط ولا يُرسل لأي جهة، والتطبيق لا يطلب الإنترنت.','Privacy: your location is used only on your device to calculate times and is never sent anywhere; the app does not need the internet.','رازداری: آپ کا مقام صرف آپ کے فون پر اوقات نکالنے میں استعمال ہوتا ہے اور کہیں نہیں بھیجا جاتا؛ ایپ کو انٹرنیٹ درکار نہیں۔','গোপনীয়তা: আপনার অবস্থান শুধু আপনার ফোনেই সময় হিসাবে ব্যবহৃত হয়, কোথাও পাঠানো হয় না; অ্যাপে ইন্টারনেট লাগে না।','Privasi: lokasi Anda hanya dipakai di perangkat untuk menghitung waktu dan tidak dikirim ke mana pun; aplikasi tidak memerlukan internet.','Privacy: ginagamit lang ang lokasyon mo sa device para kuwentahin ang oras at hindi ipinapadala kahit saan; hindi kailangan ng internet ng app.','गोपनीयता: आपकी लोकेशन सिर्फ़ आपके फ़ोन पर समय निकालने में इस्तेमाल होती है और कहीं नहीं भेजी जाती; ऐप को इंटरनेट नहीं चाहिए।'],
['الأصوات من ويكيميديا كومنز: أذان الحرم المكي — التكبيرتان من تسجيل Seyfula Islam والأذان الكامل من تسجيل 3omar Faruq (CC BY 3.0، مقطوعان ومعدّلا الشدّة)، Aaqib Azeez (CC BY-SA 4.0)، وAdam-synagda وAishatu98 (CC0)، وصباح فخري (ملكية عامة). المقاطع المقصوصة (تكبيرتان) مشتقة منها وتحمل رخصة الأصل.','Sounds from Wikimedia Commons: the Makkah Haram adhan — the two takbirs from a recording by Seyfula Islam and the full adhan from a recording by 3omar Faruq (CC BY 3.0, trimmed and volume-adjusted), Aaqib Azeez (CC BY-SA 4.0), Adam-synagda and Aishatu98 (CC0), and Sabah Fakhri (public domain). The trimmed clips (two takbirs) are derived from them and carry the original license.','آوازیں ویکیمیڈیا کامنز سے: اذانِ حرمِ مکی — دو تکبیریں Seyfula Islam کی ریکارڈنگ سے اور مکمل اذان 3omar Faruq کی ریکارڈنگ سے (CC BY 3.0، تراشی اور آواز درست کی گئی)، Aaqib Azeez (CC BY-SA 4.0)، Adam-synagda اور Aishatu98 (CC0)، اور صباح فخری (پبلک ڈومین)۔ تراشے گئے حصے (دو تکبیریں) انہی سے ماخوذ ہیں اور اصل لائسنس رکھتے ہیں۔','শব্দ উইকিমিডিয়া কমন্স থেকে: মসজিদুল হারামের আজান — দুই তাকবির Seyfula Islam-এর রেকর্ডিং থেকে এবং পূর্ণ আজান 3omar Faruq-এর রেকর্ডিং থেকে (CC BY 3.0, কাটা ও ভলিউম সমন্বিত), Aaqib Azeez (CC BY-SA 4.0), Adam-synagda ও Aishatu98 (CC0), এবং সাবাহ ফখরি (পাবলিক ডোমেইন)। কাটা অংশ (দুই তাকবির) এগুলো থেকে নেওয়া এবং মূল লাইসেন্স বহন করে।','Suara dari Wikimedia Commons: adzan Masjidil Haram — dua takbir dari rekaman Seyfula Islam dan adzan lengkap dari rekaman 3omar Faruq (CC BY 3.0, dipotong dan disesuaikan volumenya), Aaqib Azeez (CC BY-SA 4.0), Adam-synagda dan Aishatu98 (CC0), serta Sabah Fakhri (domain publik). Potongan (dua takbir) diturunkan dari rekaman tersebut dan mengikuti lisensi aslinya.','Mga tunog mula sa Wikimedia Commons: ang adhan ng Masjid al-Haram — ang dalawang takbir mula sa recording ni Seyfula Islam at ang buong adhan mula sa recording ni 3omar Faruq (CC BY 3.0, pinutol at inayos ang lakas), Aaqib Azeez (CC BY-SA 4.0), Adam-synagda at Aishatu98 (CC0), at Sabah Fakhri (public domain). Ang mga pinutol na clip (dalawang takbir) ay hinango mula sa mga ito at dala ang orihinal na lisensya.','ध्वनियाँ विकिमीडिया कॉमन्स से: मस्जिदुल हराम की अज़ान — दो तकबीरें Seyfula Islam की रिकॉर्डिंग से और पूरी अज़ान 3omar Faruq की रिकॉर्डिंग से (CC BY 3.0, काटी हुई और आवाज़ समायोजित), Aaqib Azeez (CC BY-SA 4.0), Adam-synagda और Aishatu98 (CC0), और सबाह फ़ख़री (पब्लिक डोमेन)। कटे हुए अंश (दो तकबीरें) इन्हीं से बने हैं और मूल लाइसेंस रखते हैं।'],
['الموقع غير متاح على هذا الجهاز','Location is not available on this device','اس فون پر مقام دستیاب نہیں','এই ফোনে অবস্থান পাওয়া যাচ্ছে না','Lokasi tidak tersedia di perangkat ini','Hindi available ang lokasyon sa device na ito','इस फ़ोन पर लोकेशन उपलब्ध नहीं है'],
['تعذّر تحديد الموقع. اسمح للتطبيق بالموقع أو اختر مدينتك من القائمة.','Could not determine location. Allow the app to use location or pick your city from the list.','مقام معلوم نہیں ہو سکا۔ ایپ کو مقام کی اجازت دیں یا فہرست سے اپنا شہر چنیں۔','অবস্থান নির্ধারণ করা যায়নি। অ্যাপকে অবস্থানের অনুমতি দিন বা তালিকা থেকে শহর বেছে নিন।','Gagal menentukan lokasi. Izinkan aplikasi mengakses lokasi atau pilih kota dari daftar.','Hindi matukoy ang lokasyon. Payagan ang app na gamitin ang lokasyon o pumili ng lungsod sa listahan.','लोकेशन तय नहीं हो सकी। ऐप को लोकेशन की अनुमति दें या सूची से अपना शहर चुनें।'],
['موقعك الحالي','Your current location','آپ کا موجودہ مقام','আপনার বর্তমান অবস্থান','Lokasi Anda saat ini','Ang kasalukuyan mong lokasyon','आपकी वर्तमान लोकेशन'],
['تعرّف على تطبيق مستشاري','Meet the Mustashari app','مستشاری ایپ سے متعارف ہوں','মুস্তাশারি অ্যাপের সাথে পরিচিত হন','Kenali aplikasi Mustashari','Kilalanin ang Mustashari app','मुस्तशारी ऐप से मिलिए'],
['اللغة · Language','Language · اللغة','Language · اللغة','Language · اللغة','Language · اللغة','Language · اللغة','Language · اللغة'],
['مؤذن ١','Muezzin 1','مؤذن ۱','মুয়াজ্জিন ১','Muazin 1','Muezzin 1','मुअज़्ज़िन १'],
['مؤذن ٢','Muezzin 2','مؤذن ۲','মুয়াজ্জিন ২','Muazin 2','Muezzin 2','मुअज़्ज़िन २'],
['أذان الحرم المكي','Makkah Haram Adhan','اذانِ حرمِ مکی','মসজিদুল হারামের আজান','Adzan Masjidil Haram','Adhan ng Masjid al-Haram','मस्जिदुल हराम की अज़ान'],
['صباح فخري — مقام شامي','Sabah Fakhri — Shami maqam','صباح فخری — مقامِ شامی','সাবাহ ফখরি — শামি মাকাম','Sabah Fakhri — maqam Syami','Sabah Fakhri — Shami maqam','सबाह फ़ख़री — शामी मक़ाम'],
['تكبير ختامي','Closing takbir','اختتامی تکبیر','সমাপনী তাকবির','Takbir penutup','Pangwakas na takbir','समापन तकबीर'],
];
// أنماط بأرقام: [regex, en, ur, bn, id, tl, hi] — $1 $2 تُستبدل
const P=[
[/^(\d+) دقائق$/,'$1 min','$1 منٹ','$1 মিনিট','$1 menit','$1 minuto','$1 मिनट'],
[/^(\d+) دقيقة$/,'$1 min','$1 منٹ','$1 মিনিট','$1 menit','$1 minuto','$1 मिनट'],
[/^يبقى (\d+) أذونات لتعمل الأذانات كما ينبغي\.$/,'$1 permissions left so the adhans work properly.','اذانیں ٹھیک چلنے کے لیے $1 اجازتیں باقی ہیں۔','আজান ঠিকমতো চলতে আর $1টি অনুমতি বাকি।','Tinggal $1 izin lagi agar adzan berfungsi dengan baik.','$1 pahintulot na lang para gumana nang maayos ang adhan.','अज़ान ठीक से चलने के लिए $1 अनुमतियाँ बाकी हैं।'],
[/^رمضان القادم يبدأ بعد (\d+) يوماً تقريباً$/,'Next Ramadan starts in about $1 days','اگلا رمضان تقریباً $1 دن بعد شروع ہوگا','পরবর্তী রমজান প্রায় $1 দিন পরে শুরু','Ramadan berikutnya dimulai sekitar $1 hari lagi','Magsisimula ang susunod na Ramadan sa mga $1 araw','अगला रमज़ान लगभग $1 दिन बाद शुरू होगा'],
[/^الإمساك بعد (\d+) دقائق$/,'Imsak in $1 min','امساک $1 منٹ بعد','ইমসাক $1 মিনিট পরে','Imsak $1 menit lagi','Imsak sa $1 minuto','इमसाक $1 मिनट बाद'],
[/^الإمساك بعد ([\d:]+)$/,'Imsak in $1','امساک میں $1','ইমসাকে বাকি $1','Imsak dalam $1','Imsak sa loob ng $1','इमसाक में $1'],
[/^الإفطار بعد ([\d:]+)$/,'Iftar in $1','افطار میں $1','ইফতারে বাকি $1','Berbuka dalam $1','Iftar sa loob ng $1','इफ़्तार में $1'],
[/^الإمساك = قبل الفجر بـ (\d+) دقائق \(يُضبط من الإعدادات\)\. بداية الشهر بحسب تقويم أم القرى المدني \(والعشاء بزيادة رمضان لطريقة أم القرى فقط\) وقد تختلف يوماً عن الرؤية؛ صحّحها من الإعدادات\.$/,
 'Imsak = $1 minutes before Fajr (adjustable in Settings). The month start follows the Umm al-Qura civil calendar (with the Ramadan Isha extension for the Umm al-Qura method only) and may differ by a day from moon sighting; correct it in Settings.',
 'امساک = فجر سے $1 منٹ پہلے (ترتیبات میں تبدیل کریں)۔ مہینے کا آغاز اُم القریٰ کے شہری کیلنڈر کے مطابق ہے (رمضان میں عشاء کا اضافہ صرف اُم القریٰ طریقے میں) اور رویتِ ہلال سے ایک دن مختلف ہو سکتا ہے؛ ترتیبات میں درست کریں۔',
 'ইমসাক = ফজরের $1 মিনিট আগে (সেটিংসে পরিবর্তনযোগ্য)। মাসের শুরু উম্মুল কুরা সিভিল ক্যালেন্ডার অনুযায়ী (রমজানে এশার বাড়তি সময় শুধু উম্মুল কুরা পদ্ধতিতে) এবং চাঁদ দেখা থেকে এক দিন ভিন্ন হতে পারে; সেটিংসে সংশোধন করুন।',
 'Imsak = $1 menit sebelum Subuh (dapat diatur di Pengaturan). Awal bulan mengikuti kalender sipil Umm al-Qura (dengan tambahan Isya Ramadan hanya untuk metode Umm al-Qura) dan bisa berbeda sehari dari rukyat; koreksi di Pengaturan.',
 'Imsak = $1 minuto bago ang Fajr (maaaring baguhin sa Mga Setting). Ang simula ng buwan ay ayon sa civil calendar ng Umm al-Qura (may dagdag sa Isha tuwing Ramadan para lang sa Umm al-Qura) at maaaring magkaiba ng isang araw sa pagkakita ng buwan; itama sa Mga Setting.',
 'इमसाक = फ़ज्र से $1 मिनट पहले (सेटिंग्स में बदलें)। महीने की शुरुआत उम्मुल क़ुरा के सिविल कैलेंडर के अनुसार है (रमज़ान में इशा की बढ़ोतरी सिर्फ़ उम्मुल क़ुरा विधि में) और चाँद दिखने से एक दिन अलग हो सकती है; सेटिंग्स में सही करें।'],
[/^المسافة إلى الكعبة نحو ([\d,]+) كم · الاتجاه بالدرجات من الشمال الحقيقي$/,'Distance to the Kaaba about $1 km · bearing in degrees from true north','کعبہ تک فاصلہ تقریباً $1 کلومیٹر · حقیقی شمال سے ڈگری میں سمت','কাবা পর্যন্ত দূরত্ব প্রায় $1 কিমি · প্রকৃত উত্তর থেকে ডিগ্রিতে দিক','Jarak ke Ka\'bah sekitar $1 km · arah dalam derajat dari utara sejati','Layo sa Kaaba mga $1 km · direksyon sa digri mula sa tunay na hilaga','काबा तक दूरी लगभग $1 किमी · सच्चे उत्तर से डिग्री में दिशा'],
[/^در يميناً (\d+)°$/,'Turn right $1°','دائیں مڑیں $1°','ডানে ঘুরুন $1°','Putar ke kanan $1°','Lumiko pakanan $1°','दाएँ मुड़ें $1°'],
[/^در يساراً (\d+)°$/,'Turn left $1°','بائیں مڑیں $1°','বামে ঘুরুন $1°','Putar ke kiri $1°','Lumiko pakaliwa $1°','बाएँ मुड़ें $1°'],
[/^الصلاة القادمة: (.+)$/,'Next prayer: $1','آنے والی نماز: $1','পরবর্তী নামাজ: $1','Salat berikutnya: $1','Susunod na dasal: $1','अगली नमाज़: $1'],
[/^الحالية: (.+)$/,'Current: $1','موجودہ: $1','বর্তমান: $1','Saat ini: $1','Kasalukuyan: $1','वर्तमान: $1'],
[/^الحالي: (.+)$/,'Current: $1','موجودہ: $1','বর্তমান: $1','Saat ini: $1','Kasalukuyan: $1','वर्तमान: $1'],
[/^(.+) \(تلقائي\)$/,'$1 (auto)','$1 (خودکار)','$1 (স্বয়ংক্রিয়)','$1 (otomatis)','$1 (auto)','$1 (ऑटो)'],
[/^(.+) \(تلقائي بحسب بلدك\)$/,'$1 (automatic, by your country)','$1 (خودکار، آپ کے ملک کے مطابق)','$1 (স্বয়ংক্রিয়, আপনার দেশ অনুযায়ী)','$1 (otomatis sesuai negara Anda)','$1 (awtomatiko, ayon sa bansa mo)','$1 (स्वचालित, आपके देश के अनुसार)'],
[/^(\d+) (.+?) (\d+) هـ · (.+)$/,'$1 $2 $3 AH · $4','$1 $2 $3 ھ · $4','$1 $2 $3 হি · $4','$1 $2 $3 H · $4','$1 $2 $3 AH · $4','$1 $2 $3 हि. · $4'],
[/^(\d+)° \((.+)\)$/,'$1° ($2)','$1° ($2)','$1° ($2)','$1° ($2)','$1° ($2)','$1° ($2)'],
[/^✓ (.+)$/,'✓ $1','✓ $1','✓ $1','✓ $1','✓ $1','✓ $1'],
];
// مقاطع قصيرة لعقد مختلطة (أشهر، مدن، اتجاهات، طرق الحساب)
const F=[
['محرم','Muharram','محرم','মুহাররম','Muharram','Muharram','मुहर्रम'],['صفر','Safar','صفر','সফর','Safar','Safar','सफ़र'],
['ربيع الأول','Rabi al-Awwal','ربیع الاول','রবিউল আউয়াল','Rabiul Awal','Rabi al-Awwal','रबीउल अव्वल'],['ربيع الآخر','Rabi al-Thani','ربیع الثانی','রবিউস সানি','Rabiul Akhir','Rabi al-Thani','रबीउस सानी'],
['جمادى الأولى','Jumada al-Ula','جمادی الاول','জমাদিউল আউয়াল','Jumadil Awal','Jumada al-Ula','जमादिउल अव्वल'],['جمادى الآخرة','Jumada al-Akhirah','جمادی الثانی','জমাদিউস সানি','Jumadil Akhir','Jumada al-Akhirah','जमादिउस सानी'],
['رجب','Rajab','رجب','রজব','Rajab','Rajab','रजब'],['شعبان','Shaban','شعبان','শাবান','Syakban','Shaban','शाबान'],['رمضان','Ramadan','رمضان','রমজান','Ramadan','Ramadan','रमज़ान'],
['شوال','Shawwal','شوال','শাওয়াল','Syawal','Shawwal','शव्वाल'],['ذو القعدة','Dhul Qadah','ذوالقعدہ','জিলকদ','Zulkaidah','Dhul Qadah','ज़ुल क़ादा'],['ذو الحجة','Dhul Hijjah','ذوالحجہ','জিলহজ','Zulhijah','Dhul Hijjah','ज़ुल हिज्जा'],
['مكة المكرمة','Makkah','مکہ مکرمہ','মক্কা','Makkah','Makkah','मक्का'],['المدينة المنورة','Madinah','مدینہ منورہ','মদিনা','Madinah','Madinah','मदीना'],['الرياض','Riyadh','ریاض','রিয়াদ','Riyadh','Riyadh','रियाद'],
['جدة','Jeddah','جدہ','জেদ্দা','Jeddah','Jeddah','जेद्दा'],['الدمام','Dammam','دمام','দাম্মাম','Dammam','Dammam','दम्माम'],['الطائف','Taif','طائف','তায়েফ','Taif','Taif','ताइफ़'],['أبها','Abha','ابھا','আবহা','Abha','Abha','अभा'],
['تبوك','Tabuk','تبوک','তাবুক','Tabuk','Tabuk','तबूक'],['بريدة','Buraydah','بریدہ','বুরাইদা','Buraydah','Buraydah','बुरैदा'],['حائل','Hail','حائل','হায়েল','Hail','Hail','हाइल'],['جازان','Jazan','جازان','জাযান','Jazan','Jazan','जाज़ान'],
['نجران','Najran','نجران','নাজরান','Najran','Najran','नज्रान'],['رابغ','Rabigh','رابغ','রাবিগ','Rabigh','Rabigh','राबिग़'],['ينبع','Yanbu','ینبع','ইয়ানবু','Yanbu','Yanbu','यनबू'],['الجوف','Al-Jouf','الجوف','আল-জাওফ','Al-Jouf','Al-Jouf','अल-जौफ़'],
['الباحة','Al-Baha','الباحہ','আল-বাহা','Al-Baha','Al-Baha','अल-बाहा'],['الأحساء','Al-Ahsa','الاحساء','আল-আহসা','Al-Ahsa','Al-Ahsa','अल-अहसा'],['القاهرة','Cairo','قاہرہ','কায়রো','Kairo','Cairo','काहिरा'],
['دبي','Dubai','دبئی','দুবাই','Dubai','Dubai','दुबई'],['الكويت','Kuwait','کویت','কুয়েত','Kuwait','Kuwait','कुवैत'],['الدوحة','Doha','دوحہ','দোহা','Doha','Doha','दोहा'],['عمّان','Amman','عمان','আম্মান','Amman','Amman','अम्मान'],
['إسطنبول','Istanbul','استنبول','ইস্তাম্বুল','Istanbul','Istanbul','इस्तांबुल'],['كوالالمبور','Kuala Lumpur','کوالالمپور','কুয়ালালামপুর','Kuala Lumpur','Kuala Lumpur','क्वालालंपुर'],['لندن','London','لندن','লন্ডন','London','London','लंदन'],
['مؤذن ١','Muezzin 1','مؤذن ۱','মুয়াজ্জিন ১','Muazin 1','Muezzin 1','मुअज़्ज़िन १'],['مؤذن ٢','Muezzin 2','مؤذن ۲','মুয়াজ্জিন ২','Muazin 2','Muezzin 2','मुअज़्ज़िन २'],['تكبير ختامي','Closing takbir','اختتامی تکبیر','সমাপনী তাকবির','Takbir penutup','Pangwakas na takbir','समापन तकबीर'],
['شمال شرق','Northeast','شمال مشرق','উত্তর-পূর্ব','Timur Laut','Hilagang-silangan','उत्तर-पूर्व'],['جنوب شرق','Southeast','جنوب مشرق','দক্ষিণ-পূর্ব','Tenggara','Timog-silangan','दक्षिण-पूर्व'],
['جنوب غرب','Southwest','جنوب مغرب','দক্ষিণ-পশ্চিম','Barat Daya','Timog-kanluran','दक्षिण-पश्चिम'],['شمال غرب','Northwest','شمال مغرب','উত্তর-পশ্চিম','Barat Laut','Hilagang-kanluran','उत्तर-पश्चिम'],
['شمال','North','شمال','উত্তর','Utara','Hilaga','उत्तर'],['شرق','East','مشرق','পূর্ব','Timur','Silangan','पूर्व'],['جنوب','South','جنوب','দক্ষিণ','Selatan','Timog','दक्षिण'],['غرب','West','مغرب','পশ্চিম','Barat','Kanluran','पश्चिम'],
['رابطة العالم الإسلامي','Muslim World League','مسلم ورلڈ لیگ','মুসলিম ওয়ার্ল্ড লীগ','Liga Muslim Dunia','Muslim World League','मुस्लिम वर्ल्ड लीग'],
['الهيئة المصرية العامة للمساحة','Egyptian General Authority of Survey','مصری جنرل اتھارٹی آف سروے','মিশরীয় জেনারেল সার্ভে অথরিটি','Otoritas Survei Umum Mesir','Egyptian General Authority of Survey','मिस्र की जनरल सर्वे अथॉरिटी'],
['جامعة العلوم الإسلامية بكراتشي','University of Islamic Sciences, Karachi','جامعہ علومِ اسلامیہ، کراچی','ইসলামি বিজ্ঞান বিশ্ববিদ্যালয়, করাচি','Universitas Ilmu Islam, Karachi','University of Islamic Sciences, Karachi','इस्लामी विज्ञान विश्वविद्यालय, कराची'],
['أم القرى (مكة المكرمة)','Umm al-Qura (Makkah)','اُم القریٰ (مکہ مکرمہ)','উম্মুল কুরা (মক্কা)','Umm al-Qura (Makkah)','Umm al-Qura (Makkah)','उम्मुल क़ुरा (मक्का)'],
['لجنة رؤية الهلال','Moonsighting Committee','رویتِ ہلال کمیٹی','চাঁদ দেখা কমিটি','Komite Rukyat Hilal','Moonsighting Committee','चाँद देखने की समिति'],
['أمريكا الشمالية','North America','شمالی امریکہ','উত্তর আমেরিকা','Amerika Utara','North America','उत्तरी अमेरिका'],['قطر','Qatar','قطر','কাতার','Qatar','Qatar','क़तर'],
['سنغافورة / بروناي','Singapore / Brunei','سنگاپور / برونائی','সিঙ্গাপুর / ব্রুনেই','Singapura / Brunei','Singapore / Brunei','सिंगापुर / ब्रुनेई'],
['جاكيم (ماليزيا)','JAKIM (Malaysia)','جاکِم (ملائیشیا)','জাকিম (মালয়েশিয়া)','JAKIM (Malaysia)','JAKIM (Malaysia)','जाकिम (मलेशिया)'],
['وزارة الشؤون الدينية (إندونيسيا)','Ministry of Religious Affairs (Indonesia)','وزارتِ مذہبی امور (انڈونیشیا)','ধর্ম মন্ত্রণালয় (ইন্দোনেশিয়া)','Kementerian Agama (Indonesia)','Ministry of Religious Affairs (Indonesia)','धार्मिक मामलों का मंत्रालय (इंडोनेशिया)'],
['جامعة طهران','University of Tehran','جامعہ تہران','তেহরান বিশ্ববিদ্যালয়','Universitas Teheran','University of Tehran','तेहरान विश्वविद्यालय'],['ديانت تركيا','Diyanet (Turkey)','دیانت ترکی','দিয়ানেত (তুরস্ক)','Diyanet (Turki)','Diyanet (Turkey)','दियानत (तुर्की)'],
];
// نصوص الإشعار وشاشة الأذان الأصلية (جافا) — {n} = اسم الصلاة
const UI={ar:{now:'حان وقت {n}',close:'إغلاق',test:'تجربة الأذان',open:'اضغط لفتح شاشة الأذان',hint:'اضغط إغلاق لإنهاء الأذان'},
 en:{now:'Time for {n}',close:'Close',test:'Adhan test',open:'Tap to open the adhan screen',hint:'Tap Close to end the adhan'},
 ur:{now:'{n} کا وقت ہو گیا',close:'بند کریں',test:'اذان کا تجربہ',open:'اذان کی اسکرین کھولنے کے لیے دبائیں',hint:'اذان ختم کرنے کے لیے بند کریں دبائیں'},
 bn:{now:'{n} এর সময় হয়েছে',close:'বন্ধ করুন',test:'আজান পরীক্ষা',open:'আজানের স্ক্রিন খুলতে চাপুন',hint:'আজান শেষ করতে বন্ধ করুন চাপুন'},
 id:{now:'Waktunya {n}',close:'Tutup',test:'Uji adzan',open:'Ketuk untuk membuka layar adzan',hint:'Ketuk Tutup untuk mengakhiri adzan'},
 tl:{now:'Oras na ng {n}',close:'Isara',test:'Pagsubok ng adhan',open:'I-tap para buksan ang adhan screen',hint:'I-tap ang Isara para tapusin ang adhan'},
 hi:{now:'{n} का समय हो गया',close:'बंद करें',test:'अज़ान टेस्ट',open:'अज़ान स्क्रीन खोलने के लिए टैप करें',hint:'अज़ान ख़त्म करने के लिए बंद करें दबाएँ'}};
// دمج لغة خارجية: عمود إضافي (7) في الصفوف نفسها، فيبقى المحرك كما هو
if(EXT){ X.forEach((r,i)=>{ r[7]=EXT.x[i]; }); P.forEach((r,i)=>{ r[7]=EXT.p[i]; }); F.forEach((r,i)=>{ r[7]=EXT.f[i]; }); UI[cur]=EXT.ui; }
// ——— المحرّك ———
const norm=s=>s.replace(/\s+/g,' ').trim();
const MAP=new Map(); X.forEach(r=>MAP.set(norm(r[0]),r));
const FR=F.slice().sort((a,b)=>b[0].length-a[0].length);
const ix=EXT?7:IDX[cur];
const AR=/[؀-ۿ]/;
function tr(s){
  if(cur==='ar'||!s||!AR.test(s)) return s;
  const lead=s.match(/^\s*/)[0], trail=s.match(/\s*$/)[0], n=norm(s);
  const r=MAP.get(n); if(r) return lead+r[ix]+trail;
  for(const p of P){ const m=n.match(p[0]); if(m){ let o=p[ix]; for(let i=m.length-1;i>=1;i--) o=o.split('$'+i).join(tr(m[i])); return lead+o+trail; } }
  let o=n; for(const f of FR){ if(o.indexOf(f[0])>=0) o=o.split(f[0]).join(f[ix]); }
  return lead+o+trail;
}
const DONE=new WeakMap();   // نص أنتجناه نحن: لا نترجمه ثانية (الأردية بحروف عربية فلا تُميَّز عن الأصل)
function setNode(t){ const v=t.nodeValue; if(DONE.get(t)===v||!AR.test(v)) return; const o=tr(v); DONE.set(t,o); if(o!==v) t.nodeValue=o; }
function walk(root){
  if(cur==='ar') return;
  const w=document.createTreeWalker(root,NodeFilter.SHOW_TEXT,null);
  const list=[]; let n; while((n=w.nextNode())) list.push(n);
  for(const t of list){ const p=t.parentNode&&t.parentNode.nodeName; if(p==='SCRIPT'||p==='STYLE'||p==='TEXT') continue; setNode(t); }
  if(root.querySelectorAll) root.querySelectorAll('[placeholder],[title],[aria-label]').forEach(e=>{ if(e.dataset.i18n) return; e.dataset.i18n='1'; for(const a of ['placeholder','title','aria-label']){ const v=e.getAttribute(a); if(v&&AR.test(v)) e.setAttribute(a,tr(v)); } });
}
let busy=false;
function start(){
  if(cur==='ar') return;
  document.title=tr(document.title)||document.title;
  walk(document.body);
  new MutationObserver(ms=>{ if(busy) return; busy=true;
    try{ for(const m of ms){ if(m.type==='childList') m.addedNodes.forEach(n=>{ if(n.nodeType===3) setNode(n); else if(n.nodeType===1) walk(n); });
      else if(m.type==='characterData') setNode(m.target); } }
    finally{ busy=false; } }).observe(document.body,{childList:true,subtree:true,characterData:true});
}
window.I18N={cur,ui:UI[cur],langs:LANGS,locale:meta[3],dir:meta[2],tr,set(l){ try{localStorage.setItem('bilal_lang',l);}catch(_){} location.reload(); },start};
})();
