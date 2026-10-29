// حساب المواقيت (يعمل في المتصفح وNode): اثنتا عشرة طريقة + مذهب العصر + خطوط العرض العليا. يُختبر مقابل Aladhan في /root/adhan-bilal/test_calc.js
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory;
  else root.BilalCalc = factory(root.adhan);
})(typeof self !== 'undefined' ? self : this, function (adhan) {
  const KEYS = {mwl:'MuslimWorldLeague', egypt:'Egyptian', karachi:'Karachi', makkah:'UmmAlQura', dubai:'Dubai', moonsighting:'MoonsightingCommittee',
    isna:'NorthAmerica', kuwait:'Kuwait', qatar:'Qatar', singapore:'Singapore', tehran:'Tehran', turkey:'Turkey', jakim:'Other', kemenag:'Other', jordan:'Other'};
  // طرق مضبوطة على جداول الجهات الرسمية (زوايا + احتياط بالدقائق لكل صلاة، تقريب لأقرب دقيقة): قيس خطؤها على بياناتها (انظر CONSTITUTION)
  const CUSTOM = {
    jakim:   {fa:17.5, ia:18, adj:{fajr:-0.5, sunrise:-0.5, dhuhr:2.5, asr:1.5, maghrib:1.5, isha:1.5}},   // JAKIM ماليزيا (متوسط 4 مناطق 2026)
    kemenag: {fa:20,   ia:18, adj:{fajr:2.5,  sunrise:-3,   dhuhr:3.5, asr:2.5, maghrib:3,   isha:2.5}},   // وزارة الشؤون الدينية إندونيسيا (5 مدن 2026)
    dubai:   {fa:18,   ia:18, adj:{fajr:-1,   sunrise:-3.5, dhuhr:3,   asr:1,   maghrib:3.5, isha:1}},     // الإمارات (دبي وأبوظبي، عيّنة سنة من الجهات الرسمية عبر وسيط)
    jordan:  {fa:18,   ia:18, adj:{fajr:0.5,  sunrise:-5.5, dhuhr:1.5, asr:1.5, maghrib:7.5, isha:1.5}},   // وزارة الأوقاف الأردنية (عمّان، عيّنة سنة عبر وسيط)
    turkey:  {fa:18,   ia:16, adj:{fajr:0,    sunrise:-7,   dhuhr:5,   asr:5,   maghrib:7.5, isha:6}}      // ديانت تركيا (4 مدن، شهر واحد فقط — يُعاد ضبطها)
  };
  const LABEL = {mwl:'رابطة العالم الإسلامي', egypt:'الهيئة المصرية العامة للمساحة', karachi:'جامعة العلوم الإسلامية بكراتشي', makkah:'أم القرى (مكة المكرمة)',
    dubai:'دبي', moonsighting:'لجنة رؤية الهلال', isna:'أمريكا الشمالية (ISNA)', kuwait:'الكويت', qatar:'قطر', singapore:'سنغافورة / بروناي',
    tehran:'جامعة طهران', turkey:'ديانت تركيا', jakim:'جاكيم (ماليزيا)', kemenag:'وزارة الشؤون الدينية (إندونيسيا)', jordan:'وزارة الأوقاف (الأردن)'};
  const TZ = {'Asia/Riyadh':'makkah','Asia/Kuwait':'kuwait','Asia/Qatar':'qatar','Asia/Dubai':'dubai','Asia/Amman':'jordan','Africa/Cairo':'egypt','Europe/Istanbul':'turkey',
    'Asia/Karachi':'karachi','Asia/Kolkata':'karachi','Asia/Calcutta':'karachi','Asia/Dhaka':'karachi','Asia/Singapore':'singapore','Asia/Kuala_Lumpur':'jakim','Asia/Kuching':'jakim',
    'Asia/Jakarta':'kemenag','Asia/Makassar':'kemenag','Asia/Pontianak':'kemenag','Asia/Jayapura':'kemenag','Asia/Brunei':'singapore','Asia/Tehran':'tehran','Pacific/Honolulu':'isna'};
  /** الطريقة الافتراضية بحسب منطقة الجهاز الزمنية — يستطيع المستخدم تغييرها دائماً */
  function autoMethod(tz) {
    if (TZ[tz]) return TZ[tz];
    if (/^America\//.test(tz)) return 'isna';
    return 'mwl';
  }
  // أيام (منذ 1970) لأول كل شهر في تقويم أم القرى الرسمي من محرم 1446 حتى محرم 1451، مأخوذة من Aladhan (HJCoSA) ومطابقة لـIntl؛
  // نعتمدها بدل محرك الجهاز لأن جدول WebView القديم قد يخالف الرسمي بيوم. بعدها نرجع إلى Intl.
  const UQ = [19911,19940,19970,20000,20030,20059,20089,20119,20148,20177,20207,20236,20265,20295,20324,20354,20384,20414,20443,20473,20502,20532,20561,20591,20620,20649,20679,20708,20738,20768,20797,20827,20857,20886,20916,20945,20975,21004,21033,21063,21092,21122,21151,21181,21211,21240,21270,21300,21329,21359,21388,21418,21447,21476,21506,21535,21565,21594,21624,21654,21683];
  function hijri(d, adj) {
    const x = new Date(d.getTime() + (adj || 0) * 864e5);
    const rd = new Date(x.toLocaleString('en-US', {timeZone: 'Asia/Riyadh'}));
    const day = Math.round(Date.UTC(rd.getFullYear(), rd.getMonth(), rd.getDate()) / 864e5);
    if (day >= UQ[0] && day < UQ[UQ.length - 1]) {
      let i = UQ.length - 2; while (UQ[i] > day) i--;
      return {d: day - UQ[i] + 1, m: i % 12 + 1, y: 1446 + Math.floor(i / 12)};
    }
    const p = new Intl.DateTimeFormat('en-u-ca-islamic-umalqura-nu-latn', {day:'numeric', month:'numeric', year:'numeric', timeZone:'Asia/Riyadh'}).formatToParts(x);
    const g = t => +p.find(q => q.type === t).value;
    return {d: g('day'), m: g('month'), y: g('year')};
  }
  // معاملات التصحيح الموسمي (جيب/جيب تمام لمرتبة 4 + حد خط العرض) مُعايَرة على جداول أم القرى الرسمية 2025–2030 لثماني مدن سعودية
  const UQC = {"fajr":[61.04,-4.655,-36.093,7.77,5.012,-1.973,-1.793,0.717,-0.077,0.113,-1.641,-7.159,0.68,0.728],"sunrise":[2.035,0.14,2.198,-0.957,0.249,0.006,0.352,-0.01,-0.349,0.225,0.934,0.544,0.543,0.513],"dhuhr":[61.015,-0.544,-0.509,-1.064,-0.122,0.078,-0.124,-0.405,0.426,0.218,-0.488,-0.443,-0.15,-0.9],"asr":[60.758,-5.661,-26.085,-4.711,4.527,0.711,-0.458,-1.604,-1.458,0.056,0.116,-0.055,1.147,2.177],"maghrib":[60.885,-0.438,-2.284,-0.765,0.331,-0.328,-0.191,0.404,0.273,-0.356,-0.498,0.238,-0.042,0.254],"isha":[60.971,-0.31,-2.168,-0.75,0.499,-0.424,-0.066,0.263,0.296,-0.349,-0.485,0.253,-0.04,0.282]};
  function uqCorr(k, date, lat) {
    const doy = Math.round((Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()) - Date.UTC(date.getFullYear(), 0, 0)) / 864e5), th = 2 * Math.PI * doy / 365.25;
    const b = [1]; for (let i = 1; i <= 4; i++) b.push(Math.cos(i * th), Math.sin(i * th));
    const z = (lat - 24) / 4, f = b.concat(b.slice(0, 5).map(v => v * z)), c = UQC[k];
    let s = 0; for (let i = 0; i < c.length; i++) s += c[i] * f[i];
    return s;
  }
  /** opts: {method:'auto'|مفتاح, asr:'shafi'|'hanafi', ramAdj, tz} */
  function compute(lat, lon, date, opts) {
    opts = opts || {};
    const method = (!opts.method || opts.method === 'auto') ? autoMethod(opts.tz || Intl.DateTimeFormat().resolvedOptions().timeZone) : opts.method;
    const coords = new adhan.Coordinates(lat, lon);
    const cu = CUSTOM[method];
    const params = cu ? new adhan.CalculationParameters('Other', cu.fa, cu.ia) : adhan.CalculationMethod[KEYS[method] || 'MuslimWorldLeague']();
    if (cu) params.rounding = adhan.Rounding.None;
    params.madhab = opts.asr === 'hanafi' ? adhan.Madhab.Hanafi : adhan.Madhab.Shafi;
    params.highLatitudeRule = adhan.HighLatitudeRule.recommended(coords);
    const noon = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 12);
    if (method === 'makkah') params.rounding = adhan.Rounding.None;
    const p = new adhan.PrayerTimes(coords, noon, params);
    if (cu) for (const k of ['fajr', 'sunrise', 'dhuhr', 'asr', 'maghrib', 'isha'])
      p[k] = new Date(Math.round((p[k].getTime() + cu.adj[k] * 6e4) / 6e4) * 6e4);
    if (method === 'makkah') {   // الجدول الرسمي (KACST): تصحيح موسمي ثم قصّ للدقيقة؛ يطابق الرسمي ~95% والباقي بدقيقة (اختبار 8 مدن × 6 سنوات)
      for (const k of ['fajr', 'sunrise', 'dhuhr', 'asr', 'maghrib', 'isha'])
        p[k] = new Date(Math.floor((p[k].getTime() + uqCorr(k, noon, lat) * 1000) / 6e4) * 6e4);
    }
    const ram = hijri(noon, opts.ramAdj).m === 9;
    // أم القرى وحدها: عشاء رمضان = مغرب + 120 دقيقة (90 خارجه). غيرها بزواياها ولا شيء إضافي.
    const isha = (method === 'makkah' && ram) ? new Date(p.maghrib.getTime() + 120 * 6e4) : p.isha;
    return {fajr:p.fajr, sunrise:p.sunrise, dhuhr:p.dhuhr, asr:p.asr, maghrib:p.maghrib, isha, ram, date:noon, method};
  }
  const KAABA = [21.422487, 39.826206];
  /** اتجاه القبلة بالدرجات من الشمال الحقيقي + المسافة بالكيلومتر (دائرة عظمى) */
  function qibla(lat, lon) {
    const r = x => x * Math.PI / 180, f1 = r(lat), f2 = r(KAABA[0]), dl = r(KAABA[1] - lon);
    const deg = (adhan.Qibla(new adhan.Coordinates(lat, lon)) + 360) % 360;
    const h = Math.sin((f2 - f1) / 2) ** 2 + Math.cos(f1) * Math.cos(f2) * Math.sin(dl / 2) ** 2;
    return {deg, km: 2 * 6371 * Math.asin(Math.sqrt(h))};
  }
  return {compute, autoMethod, hijri, qibla, LABEL, KEYS};
});
