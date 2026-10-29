'use strict';
// أذان بلال — كل الحساب على الجهاز (لا إنترنت). المواقيت: أم القرى (مكتبة adhan) + قاعدة عشاء رمضان المتحقَّق منها.
const IOS = !!(window.Capacitor && Capacitor.getPlatform && Capacitor.getPlatform()==='ios'); if (IOS) document.body.classList.add('ios');
const Bilal = (window.Capacitor && Capacitor.Plugins && Capacitor.Plugins.Bilal) || null;
const NAMES = {fajr:'الفجر', sunrise:'الشروق', dhuhr:'الظهر', asr:'العصر', maghrib:'المغرب', isha:'العشاء'};
const CITIES = [['مكة المكرمة',21.426666,39.831666],['المدينة المنورة',24.54,39.63],['الرياض',24.67,46.69],['جدة',21.5,39.17],
 ['الدمام',26.44,50.1],['الطائف',21.25,40.4],['أبها',18.22,42.51],['تبوك',28.4,36.58],['بريدة',26.35,43.96],
 ['حائل',27.52,41.7],['جازان',16.89,42.54],['نجران',17.52,44.2],['رابغ',22.79,39.03],['ينبع',24.09,38.07],
 ['الجوف',29.8117,40.0988],['الباحة',20.01,41.47],['الأحساء',24.1389,49.4277],['القاهرة',30.0444,31.2357],['دبي',25.2048,55.2708],
 ['الكويت',29.3759,47.9774],['الدوحة',25.2854,51.5310],['عمّان',31.9454,35.9284],['إسطنبول',41.0082,28.9784],['كوالالمبور',3.1390,101.6869],['لندن',51.5074,-0.1278]];
const LIB=[{id:'haram',n:'أذان الحرم المكي',lic:'CC BY 3.0',full:1,tk:1},{id:'aaqib',n:'مؤذن ١ (Aaqib Azeez)',lic:'CC BY-SA 4.0',full:1,tk:1},{id:'adam',n:'مؤذن ٢ (Adam-synagda)',lic:'CC0',full:1,tk:1},
 {id:'sabah',n:'صباح فخري — مقام شامي',lic:'ملكية عامة',full:1,tk:1},{id:'aishatu',n:'تكبير ختامي (Aishatu98)',lic:'CC0',full:0,tk:1},
 ];
const DEF = {loc:{name:'مكة المكرمة',lat:21.4225,lon:39.8262,auto:false}, adhan:{fajr:1,dhuhr:1,asr:1,maghrib:1,isha:1}, sound:'takbir_haram',
  silent:20, ramAdj:0, imsak:10, theme:'light', wbg:'', wfg:'', wacc:'', walpha:0, imsakAlert:1, boost:1, method:'auto', asr:'shafi'};
let S = Object.assign({}, DEF, JSON.parse(localStorage.getItem('bilal')||'{}'));
if(!/^(takbir|adhan)_(haram|aaqib|adam|sabah|aishatu|m\d+)$/.test(S.sound)) S.sound='takbir_haram';
if(!localStorage.getItem('bilal_h1')){ localStorage.setItem('bilal_h1','1'); if(S.sound==='takbir_aaqib') S.sound='takbir_haram'; }   // الحرم صار الافتراضي   // ترحيل الأصوات القديمة
S.adhan = Object.assign({}, DEF.adhan, S.adhan); S.loc = Object.assign({}, DEF.loc, S.loc);
if(S.theme==='dark'||S.theme==='auto') S.theme='light';   // لا وضع داكن: الشاشات فاتحة دائماً
const isLight = () => true;   // الشاشات رقيّة بخلفية البردي دائماً؛ الداكن فقط باختيار المستخدم
const syncBars = () => { if (Bilal && Bilal.setBars) Bilal.setBars(isLight() ? {top:'#e6d7b3', bottom:'#120b05', lightTop:true} : {top:'#120d08', bottom:'#120b05', lightTop:false}).catch(()=>{}); };
const save = () => { localStorage.setItem('bilal', JSON.stringify(S)); document.body.classList.toggle('light', isLight()); syncBars(); };
if (window.matchMedia) matchMedia('(prefers-color-scheme: light)').addEventListener('change', ()=>{ if(S.theme==='auto') save(); });
const $ = (s,r=document) => r.querySelector(s);
const pad = n => String(n).padStart(2,'0');
const tf = d => new Intl.DateTimeFormat(I18N.locale,{hour:'numeric',minute:'2-digit',hour12:true}).format(d);

// ——— الحساب ———
const BC = BilalCalc;
const hijri = (d, adj=0) => BC.hijri(d, adj);
const HMONTH = ['','محرم','صفر','ربيع الأول','ربيع الآخر','جمادى الأولى','جمادى الآخرة','رجب','شعبان','رمضان','شوال','ذو القعدة','ذو الحجة'];
function day(date){ return BC.compute(S.loc.lat, S.loc.lon, date, {method:S.method, asr:S.asr, ramAdj:S.ramAdj}); }
const PI = {fajr:1,sunrise:2,dhuhr:3,asr:4,maghrib:5,isha:6};
const label = (k, date) => (k==='dhuhr' && date.getDay()===5) ? 'الجمعة' : NAMES[k];
function schedule(days=60){
  const items = [], now = new Date();
  for (let i=0;i<days;i++){
    const d = day(new Date(now.getFullYear(), now.getMonth(), now.getDate()+i));
    for (const k of ['fajr','sunrise','dhuhr','asr','maghrib','isha'])
      items.push({t:+d[k], n:k, l:I18N.tr(label(k,d.date)), k:k==='sunrise'?'sun':'p', a:(k!=='sunrise'&&S.adhan[k])?1:0, s:(k==='sunrise')?0:S.silent});
    if (d.ram && S.imsakAlert) items.push({t:+d.fajr - S.imsak*6e4, n:'imsak', l:I18N.tr(`الإمساك بعد ${S.imsak} دقائق`), k:'imsak', a:0, s:0});
  }
  return items.sort((a,b)=>a.t-b.t);
}
function nextPrayer(){ const now=Date.now(); return schedule(3).find(x=>x.k==='p' && x.t>now); }
async function push(){ if (!Bilal) return; try { if (Bilal.setUi) await Bilal.setUi(I18N.ui).catch(()=>{}); await Bilal.schedule({items:schedule(60), sound:S.sound, theme:S.theme, boost:!!S.boost, wbg:S.wbg||'', wfg:S.wfg||'', wacc:S.wacc||'', walpha:S.walpha||-1}); } catch(e){} }

// ——— الواجهة ———
const ACC=['#e0b45a','#2f9e6f','#3b82c4','#c0392b','#8e5bc4','#e08a2c'];
const openSec=new Set(['الأذان']);
let tab='home', status=null, tick=null;
const toggle = (on) => `<span class="sw ${on?'on':''}"></span>`;
async function refreshStatus(){ if (Bilal) try { status = await Bilal.status(); } catch(e){} }
function missing(){
  if (!Bilal || !status) return [];
  const b=[];
  if (!status.notifications) b.push({k:'notif',t:'الإشعارات',why:'بدونها لا يظهر الأذان ولا التنبيه.',btn:'السماح بالإشعارات'});
  if (!status.exact) b.push({k:'exact',t:'المنبّهات الدقيقة',why:'لضبط الأذان على الدقيقة؛ بدونه قد يتأخر دقائق.',btn:'منح الإذن'});
  if (S.silent>0 && !status.dnd) b.push({k:'dnd',t:'الصامت وقت الصلاة',why:'يلزم «الوصول إلى عدم الإزعاج» ليصمت الجوال وقت الصلاة (اختياري).',btn:'منح الإذن',opt:1});
  if (!status.battery) b.push({k:'battery',t:'البطارية',why:'بعض الهواتف توقف التطبيقات لتوفير البطارية فيفوتك الأذان. اختر «بلا قيود».',btn:'إعدادات البطارية'});
  return b;
}
function banners(){
  const m=missing(); if(!m.length) return '';
  return `<div class="banner">يبقى ${m.length===1?'إذن واحد':m.length===2?'إذنان':m.length+' أذونات'} لتعمل الأذانات كما ينبغي.<br><button data-wiz="1">أكمل الإعداد</button></div>`;
}
// ——— معالج أول تشغيل: خطوة واحدة في الشاشة ———
let wizStep=0, wizOn=false;
function wizSteps(){
  const st=status||{};
  const steps=[{id:'loc',title:'أين أنت؟',text:'نحسب مواقيت الصلاة على جهازك بحسب موقعك، ولا يُرسل موقعك لأي جهة.',done:()=>S.loc.auto||S.loc.chosen,
    body:()=>`<button class="btn big" data-w="gps">تحديد موقعي تلقائياً</button><div class="or">أو اختر مدينة</div><select id="wcity"><option value="">—</option>${CITIES.map((c,i)=>`<option value="${i}">${c[0]}</option>`).join('')}</select><p class="cur">الحالي: ${S.loc.name}</p>`}];
  if (Bilal) steps.push(
    {id:'notif',title:'الإشعارات',text:'لتظهر شاشة الأذان وتنبيه الصلاة.',done:()=>st.notifications,body:()=>`<button class="btn big" data-w="notif">السماح بالإشعارات</button>`});
  if (Bilal && !st.ios) steps.push(
    {id:'exact',title:'الأذان على الدقيقة',text:'يطلب أندرويد إذن «المنبّهات والتذكيرات» ليبدأ الأذان في وقته تماماً.',done:()=>st.exact,body:()=>`<button class="btn big" data-w="exact">منح الإذن</button>`},
    {id:'dnd',title:'الصامت وقت الصلاة',text:'اختياري: يحوّل الجوال لصامت وقت الصلاة ثم يعيده. يلزمه «الوصول إلى عدم الإزعاج».',done:()=>st.dnd||S.silent===0,
      body:()=>`<button class="btn big" data-w="dnd">منح الإذن</button><button class="btn sec" data-w="nosilent">لا أريد الصامت</button>`},
    {id:'battery',title:'البطارية',text:'بعض الهواتف توقف التطبيقات لتوفير الطاقة فيفوتك الأذان. اختر «بلا قيود» لهذا التطبيق.',done:()=>st.battery,body:()=>`<button class="btn big" data-w="battery">إعدادات البطارية</button>`});
  return steps;
}
function wizard(){
  const steps=wizSteps(); if(wizStep>=steps.length){ closeWiz(); return; }
  const w=steps[wizStep], last=wizStep===steps.length-1, ok=w.done();
  let el=$('#wiz'); if(!el){ el=document.createElement('div'); el.id='wiz'; document.body.appendChild(el); }
  el.innerHTML=`<div class="wbox"><div class="dots">${steps.map((_,i)=>`<i class="${i===wizStep?'on':i<wizStep?'ok':''}"></i>`).join('')}</div>
   <h1>${wizStep===0?'أهلاً بك في أذان بلال':w.title}</h1>${wizStep===0?`<h3>${w.title}</h3>`:''}<p>${w.text}</p>${w.body()}
   ${ok?'<div class="okmark">✓ تم</div>':''}
   <div class="wnav"><button class="btn ${ok?'':'sec'}" data-w="next">${ok?(last?'ابدأ':'التالي'):(last?'إنهاء':'تخطَّ')}</button></div></div>`;
  const on=(sel,fn)=>{const e=el.querySelector(sel); if(e) e.onclick=fn;};
  on('[data-w=gps]',async()=>{ await locate(); wizard(); });
  const c=el.querySelector('#wcity'); if(c) c.onchange=async e=>{ const x=CITIES[+e.target.value]; if(!x)return; S.loc={name:x[0],lat:x[1],lon:x[2],auto:false,chosen:1}; save(); await push(); wizard(); };
  on('[data-w=notif]',async()=>{ if(Bilal.requestNotifications) await Bilal.requestNotifications(); setTimeout(async()=>{await refreshStatus();wizard();},1500); });
  for(const k of ['exact','dnd','battery']) on('[data-w='+k+']',()=>Bilal.openSettings({type:k}));
  on('[data-w=nosilent]',async()=>{ S.silent=0; save(); await push(); wizStep++; wizard(); });
  on('[data-w=next]',()=>{ wizStep++; wizard(); });
}
function openWiz(first){ wizOn=true; if (Bilal && Bilal.setBars) Bilal.setBars({top:'#120d08',bottom:'#120b05',lightTop:false}).catch(()=>{}); wizStep=0; if(!first){ const s=wizSteps(); const i=s.findIndex(x=>!x.done()); wizStep=i<0?0:i; } wizard(); }
function closeWiz(){ wizOn=false; syncBars(); localStorage.setItem('bilal_wiz','1'); const e=$('#wiz'); if(e) e.remove(); render(); }
function toast(t){ let e=$('#toast'); if(!e){ e=document.createElement('div'); e.id='toast'; document.body.appendChild(e); } e.textContent=t; e.classList.add('show'); clearTimeout(e._t); e._t=setTimeout(()=>e.classList.remove('show'),4200); }
function home(){
  const nx = nextPrayer(), td = day(new Date()), now=Date.now();
  const h = hijri(new Date(), S.ramAdj);
  const key = nx ? nx.n : 'fajr';
  const rows = ['fajr','sunrise','dhuhr','asr','maghrib','isha'].map(k=>{
    const t=+td[k], isNx = nx && nx.n===k && Math.abs(nx.t-t)<6e4, past = t<now && !isNx;
    return `<div class="row ${isNx?'next':''} ${past?'past':''}"><span class="pn"><img class="pi" src="kit2/P${PI[k]}.webp" alt="">${label(k,td.date)}</span><span class="t">${tf(new Date(t))}</span></div>`; }).join('');
  const img = S.theme==='bilal' || true ? `style="background-image:url(img/scene_${key}.jpg)"` : '';
  return `<div class="hero" ${img}><small>${h.d} ${HMONTH[h.m]} ${h.y} هـ · ${S.loc.name}</small>
    <div class="plaque">${nx?('الصلاة القادمة: '+nx.l):'افتح التطبيق لتحديث المواقيت'}</div><div class="cd" id="cd">--:--:--</div>
    <div class="sub">${nx?tf(new Date(nx.t)):''}</div><div class="ramcd" id="ramcd"></div></div>${banners()}<div class="card">${rows}</div>
    <p class="note">المواقيت تُحسب على جهازك بحسب موقعك وطريقة الحساب المختارة (الأصل: بحسب بلدك؛ وأم القرى في السعودية)، ولا تُرسل بياناتك لأي جهة.</p>`;
}
function ramadan(){
  const today = new Date(); today.setHours(12,0,0,0);
  let start=null;
  for (let i=-35;i<400 && !start;i++){ const d=new Date(+today+i*864e5); if (hijri(d,S.ramAdj).m===9 && hijri(new Date(+d-864e5),S.ramAdj).m!==9) start=d; if (i<0 && hijri(d,S.ramAdj).m===9 && hijri(new Date(+d-864e5),S.ramAdj).m!==9) {} }
  // لو نحن داخل رمضان فالبداية قبل اليوم
  if (!start) return '<p class="note">لم يُعثر على رمضان القادم.</p>';
  const days=[]; for (let i=0;i<30;i++){ const d=new Date(+start+i*864e5); const hj=hijri(d,S.ramAdj); if (hj.m!==9) break; days.push([d,hj]); }
  const left = Math.round((+start-+today)/864e5);
  const head = left>0 ? `رمضان القادم يبدأ بعد ${left} يوماً تقريباً` : 'نحن في شهر رمضان — تقبّل الله منا ومنكم';
  const rows = days.map(([d,hj])=>{ const x=day(d), isT = d.toDateString()===today.toDateString();
    return `<tr class="${isT?'today':''}"><td>${hj.d}</td><td>${new Intl.DateTimeFormat(I18N.locale,{day:'numeric',month:'short'}).format(d)}</td>
    <td>${tf(new Date(+x.fajr - S.imsak*6e4))}</td><td>${tf(x.fajr)}</td><td>${tf(x.maghrib)}</td></tr>`; }).join('');
  return `<h2>${head}</h2><div class="card" style="padding:6px"><table><tr><th>رمضان</th><th>التاريخ</th><th>الإمساك</th><th>الفجر</th><th>المغرب (الإفطار)</th></tr>${rows}</table></div>
  <p class="note">الإمساك = قبل الفجر بـ ${S.imsak} دقائق (يُضبط من الإعدادات). بداية الشهر بحسب تقويم أم القرى المدني (والعشاء بزيادة رمضان لطريقة أم القرى فقط) وقد تختلف يوماً عن الرؤية؛ صحّحها من الإعدادات.</p>`;
}
// ——— القبلة ———
let heading=null, decl=0, qSrc='', qEv=null;
function qiblaView(){
  const q=BC.qibla(S.loc.lat,S.loc.lon), dirs=['شمال','شمال شرق','شرق','جنوب شرق','جنوب','جنوب غرب','غرب','شمال غرب'];
  const name=dirs[Math.round(q.deg/45)%8], inHaram=q.km<1, noLoc=!(S.loc.auto||S.loc.chosen);
  let ticks=''; for(let a=0;a<360;a+=10){ const big=a%90===0, r1=big?128:136, r2=146, x=(r)=>150+r*Math.sin(a*Math.PI/180), y=(r)=>150-r*Math.cos(a*Math.PI/180);
    ticks+=`<line x1="${x(r1)}" y1="${y(r1)}" x2="${x(r2)}" y2="${y(r2)}" stroke="${big?'#e0b45a':'#a8761f'}" stroke-width="${big?3:1.5}"/>`; }
  const lab=(t,a,c)=>`<text x="${150+112*Math.sin(a*Math.PI/180)}" y="${150-112*Math.cos(a*Math.PI/180)+6}" text-anchor="middle" font-family="Amiri,serif" font-size="20" font-weight="700" fill="${c}">${t}</text>`;
  const qx=150+98*Math.sin(q.deg*Math.PI/180), qy=150-98*Math.cos(q.deg*Math.PI/180);
  const svg=`<svg id="dial" viewBox="0 0 300 300"><circle cx="150" cy="150" r="148" fill="#1a120b" stroke="#a8761f" stroke-width="3"/><circle cx="150" cy="150" r="124" fill="#241709" stroke="#5a4127"/>
   ${ticks}${lab('N',0,'#e8a090')}${lab('E',90,'#f3e6c8')}${lab('S',180,'#f3e6c8')}${lab('W',270,'#f3e6c8')}
   <line x1="150" y1="150" x2="${qx}" y2="${qy}" stroke="#e0b45a" stroke-width="3" stroke-dasharray="5 4"/>
   <g transform="translate(${qx} ${qy}) rotate(${q.deg})"><rect x="-17" y="-19" width="34" height="38" rx="3" fill="#0e0905" stroke="#e0b45a" stroke-width="2.5"/><rect x="-17" y="-9" width="34" height="5" fill="#e0b45a"/></g></svg>`;
  const warn = noLoc ? `<div class="banner" style="margin:0 0 8px"><b>لم تحدد موقعك بعد.</b> الاتجاه الظاهر محسوب من مكة (الموقع الافتراضي)، فهو غير صحيح لك.<br><button data-gotoloc="1">حدّد موقعي</button></div>` : '';
  return `${warn}<div class="qwrap"><div class="dialbox" id="dialbox"><div class="pointer"></div><div class="dialclip">${svg}</div></div>
   <div class="qinfo"><b>${inHaram?'أنت في الحرم المكي':q.deg.toFixed(1)+'° ('+name+')'}</b><div class="qstate" id="qstate">جارٍ قراءة البوصلة…</div>
   <small>${inHaram?'':'المسافة إلى الكعبة نحو '+Math.round(q.km).toLocaleString(I18N.locale)+' كم · الاتجاه بالدرجات من الشمال الحقيقي'}<br>ضع الجوال أفقياً ومسطّحاً وبعيداً عن المعادن والمغناطيس. إن بدت القراءة خاطئة حرّكه على شكل ٨ في الهواء لمعايرته.</small></div></div>`;
}
function startCompass(){
  stopCompass();
  const q=BC.qibla(S.loc.lat,S.loc.lon); let got=false, last=0;
  if (IOS && Bilal && Bilal.addListener) {   // iOS: الاتجاه الحقيقي (للشمال الجغرافي) من النظام مباشرة
    Bilal.addListener('heading', ev=>qEv&&qEv({webkitCompassHeading:ev.deg})).then(h=>{ iosHd=h; });
    Bilal.startHeading().catch(()=>{});
  }
  if (Bilal && Bilal.declination) Bilal.declination({lat:S.loc.lat,lon:S.loc.lon}).then(r=>decl=r.deg||0).catch(()=>{});
  qEv=e=>{
    let h=null;
    if (e.webkitCompassHeading!=null) h=e.webkitCompassHeading;                              // iOS (لاحقاً)
    else if (e.alpha!=null && (e.absolute || e.type==='deviceorientationabsolute')) h=(360-e.alpha)%360;
    if (h==null) return;
    h=(h + ((screen.orientation&&screen.orientation.angle)||0) + decl + 360)%360;               // تصحيح دوران الشاشة + الانحراف المغناطيسي
    got=true; heading = heading==null ? h : (heading + ((((h-heading)+540)%360)-180)*0.25 + 360)%360;   // تنعيم دائري
    const now=Date.now(); if (now-last<60) return; last=now;
    const d=$('#dial'), box=$('#dialbox'), st=$('#qstate'); if(!d) return;
    const tg=-heading; if(dialRot===null) dialRot=tg; dialRot+=((tg-dialRot+540)%360+360)%360-180+0*0; d.style.transform=`rotate(${dialRot}deg)`;   // زاوية متصلة: لا قفزة عند عبور 0/360
    const off=((q.deg-heading)+540)%360-180, ok=Math.abs(off)<=4;
    if (box) box.classList.toggle('ok',ok);
    if (st) st.textContent = ok ? 'أنت باتجاه القبلة ✓' : (off>0?'در يميناً ':'در يساراً ')+Math.abs(Math.round(off))+'°';
    if (ok && !qiblaFlag) { qiblaFlag=true; try{navigator.vibrate&&navigator.vibrate(40)}catch(_){} } else if(!ok) qiblaFlag=false;
  };
  window.addEventListener('deviceorientationabsolute',qEv,true);
  setTimeout(()=>{ if(!got){ window.addEventListener('deviceorientation',qEv,true); } },1200);
  setTimeout(()=>{ if(!got){ const st=$('#qstate'); if(st) st.textContent='لا توجد بوصلة متاحة في هذا الجهاز — اتجه بزاوية القبلة المكتوبة من الشمال'; } },4000);
}
let qiblaFlag=false, dialRot=null;
let iosHd=null;
function stopCompass(){ if(IOS&&Bilal){ Bilal.stopHeading&&Bilal.stopHeading().catch(()=>{}); if(iosHd){ iosHd.remove(); iosHd=null; } }
  if(qEv){ window.removeEventListener('deviceorientationabsolute',qEv,true); window.removeEventListener('deviceorientation',qEv,true); qEv=null; heading=null; dialRot=null; } }

function settings(){
  const sw=(k,t)=>`<div class="row" data-ad="${k}"><span>${t}</span>${toggle(S.adhan[k])}</div>`;
  const opts=(arr,cur)=>arr.map(([v,t])=>`<option value="${v}" ${String(v)===String(cur)?'selected':''}>${t}</option>`).join('');
  return `${banners()}
  <details class="sec" data-s="اللغة" ${openSec.has('اللغة')?'open':''}><summary>اللغة</summary><div class="card"><div class="row" style="display:block"><select id="lang" style="width:100%">${I18N.langs.map(l=>`<option value="${l[0]}" ${l[0]===I18N.cur?'selected':''}>${l[1]}</option>`).join('')}</select></div></div></details>
  <details class="sec" data-s="الموقع" ${openSec.has('الموقع')?'open':''}><summary>الموقع</summary><div class="card"><div class="row"><span>الموقع الحالي<small>${S.loc.name}${S.loc.auto?' (تلقائي)':''}</small></span><button class="btn" id="gps">تحديد تلقائي</button></div>
   <div class="row"><span>أو اختر مدينة</span><select id="city"><option value="">—</option>${CITIES.map((c,i)=>`<option value="${i}">${c[0]}</option>`).join('')}</select></div></div></details>
  <details class="sec" data-s="طريقة الحساب" ${openSec.has('طريقة الحساب')?'open':''}><summary>طريقة الحساب</summary><div class="card">
   <div class="row"><span>الطريقة<small>الحالية: ${BC.LABEL[BC.compute(S.loc.lat,S.loc.lon,new Date(),{method:S.method,asr:S.asr,ramAdj:S.ramAdj}).method]}${S.method==='auto'?' (تلقائي بحسب بلدك)':''}</small></span>
    <select id="method"><option value="auto" ${S.method==='auto'?'selected':''}>تلقائي بحسب بلدك</option>${Object.keys(BC.LABEL).map(k=>`<option value="${k}" ${S.method===k?'selected':''}>${BC.LABEL[k]}</option>`).join('')}</select></div>
   <div class="row"><span>وقت العصر<small>الجمهور: مثل الظل. الحنفي: مثلا الظل</small></span>
    <select id="asr"><option value="shafi" ${S.asr==='shafi'?'selected':''}>الجمهور (الأصل)</option><option value="hanafi" ${S.asr==='hanafi'?'selected':''}>الحنفي</option></select></div></div></details>
  <p class="note">في المدن البعيدة شمالاً (فوق 48°) يُستعمل «سُبع الليل» للفجر والعشاء في الصيف، وقد تختلف المساجد المحلية عنه؛ اتبع مسجدك إن اختلف.</p>
  <details class="sec" data-s="الأذان" ${openSec.has('الأذان')?'open':''}><summary>الأذان</summary><div class="card">${sw('fajr','الفجر')}${sw('dhuhr','الظهر')}${sw('asr','العصر')}${sw('maghrib','المغرب')}${sw('isha','العشاء')}
   <div class="row"><span>المؤذن<small>الأصوات من مكتبة حرّة الترخيص</small></span><select id="mu">${LIB.map(l=>`<option value="${l.id}" ${S.sound.endsWith('_'+l.id)?'selected':''}>${l.n}</option>`).join('')}</select></div>
   <div class="row"><span>النوع<small>تكبيرتان «الله أكبر الله أكبر» فقط، أو الأذان كاملاً</small></span><select id="mk"><option value="takbir" ${S.sound.startsWith('takbir')?'selected':''} ${(LIB.find(l=>S.sound.endsWith('_'+l.id))||{}).tk?'':'disabled'}>تكبيرتان فقط</option><option value="adhan" ${S.sound.startsWith('adhan')?'selected':''} ${(LIB.find(l=>S.sound.endsWith('_'+l.id))||{}).full?'':'disabled'}>الأذان كاملاً</option></select></div>
   <div class="row" id="boostT"><span>رفع الصوت تلقائياً<small>إن كان صوت المنبّه منخفضاً جداً فيفوتك الأذان</small></span>${toggle(S.boost)}</div>
   <div class="row"><span>جرّب الصوت</span><span><button class="btn" id="prev">تشغيل</button> <button class="btn sec" id="stop">إيقاف</button></span></div>
  </div>
  <details class="sec" data-s="الصامت وقت الصلاة" ${openSec.has('الصامت وقت الصلاة')?'open':''}><summary>الصامت وقت الصلاة</summary><div class="card"><div class="row"><span>تحويل الجوال لصامت لمدة<small>يسمح بالمنبّهات فقط، ثم يعود لوضعه السابق</small></span>
   <select id="silent">${opts([[0,'بدون'],[10,'10 دقائق'],[15,'15 دقيقة'],[20,'20 دقيقة'],[30,'30 دقيقة'],[45,'45 دقيقة']],S.silent)}</select></div></div></details>
  <details class="sec" data-s="رمضان" ${openSec.has('رمضان')?'open':''}><summary>رمضان</summary><div class="card">
   <div class="row" id="imsakT"><span>تنبيه قبل الإمساك</span>${toggle(S.imsakAlert)}</div>
   <div class="row"><span>الإمساك قبل الفجر بـ</span><select id="imsak">${opts([[5,'5 دقائق'],[10,'10 دقائق'],[15,'15 دقيقة']],S.imsak)}</select></div>
   <div class="row"><span>تصحيح بداية الشهر<small>إن اختلفت الرؤية عن التقويم</small></span><select id="ramAdj">${opts([[-1,'يوم أبكر'],[0,'كما في التقويم'],[1,'يوم أبعد']],S.ramAdj)}</select></div></div></details>
  <details class="sec" data-s="المظهر والودّجت" ${openSec.has('المظهر والودّجت')?'open':''}><summary>المظهر والودّجت</summary><div class="card">
   <div class="row"><span>الوضع<small>لون الودّجت: فاتح أو شفاف</small></span><div class="chips" id="theme">
   ${[['light','فاتح'],['clear','شفاف']].map(([v,t])=>`<span class="chip ${S.theme===v?'on':''}" data-v="${v}">${t}</span>`).join('')}</div></div>
   <div class="row"><span>لون التمييز<small>الصلاة القادمة في الودّجت</small></span><div class="sw-row">${ACC.map(c=>`<i class="swatch ${S.wacc.toLowerCase()===c?'on':''}" data-acc="${c}" style="background:${c}"></i>`).join('')}<input type="color" id="accc" value="${S.wacc||'#e0b45a'}"></div></div>
   <div class="row"><span>لون خلفية الودّجت</span><span class="pick"><input type="color" id="bgc" value="${S.wbg||'#1a120b'}"><button class="btn sec mini" data-reset="wbg">تلقائي</button></span></div>
   <div class="row"><span>لون النص</span><span class="pick"><input type="color" id="fgc" value="${S.wfg||'#f3e6c8'}"><button class="btn sec mini" data-reset="wfg">تلقائي</button></span></div>
   <div class="row"><span>شفافية الخلفية<small>${S.walpha?S.walpha+'%':'تلقائي'}</small></span><input type="range" id="alp" min="10" max="100" step="5" value="${S.walpha||94}"></div>
   <div class="row"><span>إعادة الألوان للافتراضي</span><button class="btn sec mini" id="rstc">إعادة</button></div></div></details>
  <p class="note wnote">أضف الودّجت من الشاشة الرئيسية للجوال: <b>صف 1×4</b> (الصلوات الست مرتبة والقادمة ملوّنة وعليها العدّاد)، و<b>صغير</b>، و<b>مواقيت الصلوات</b>، و<b>مشهد بلال</b>.</p>
  <details class="sec" data-s="عن التطبيق" ${openSec.has('عن التطبيق')?'open':''}><summary>عن التطبيق</summary><div class="card"><div class="row"><span>أذان بلال</span><span class="t">2.3</span></div>
   <div class="row" id="mus"><span>من تطبيقاتنا: مستشاري<small>مجلس استشاري من علماء التاريخ بالذكاء الاصطناعي</small></span><span id="musb">‹</span></div></div></details>
  <p class="note">الخصوصية: موقعك يُستعمل لحساب المواقيت على جهازك فقط ولا يُرسل لأي جهة، والتطبيق لا يطلب الإنترنت.<br>
  الأصوات من ويكيميديا كومنز: أذان الحرم المكي — التكبيرتان من تسجيل Seyfula Islam والأذان الكامل من تسجيل 3omar Faruq (CC BY 3.0، مقطوعان ومعدّلا الشدّة)، Aaqib Azeez (CC BY-SA 4.0)، وAdam-synagda وAishatu98 (CC0)، وصباح فخري (ملكية عامة). المقاطع المقصوصة (تكبيرتان) مشتقة منها وتحمل رخصة الأصل.</p>`;
}
function render(){
  const app=$('#app'); app.innerHTML = tab==='home'?home():tab==='ram'?ramadan():tab==='qib'?qiblaView():settings();
  document.querySelectorAll('#nav button').forEach(b=>b.classList.toggle('on',b.dataset.t===tab));
  clearInterval(tick); if (tab==='home') { cd(); tick=setInterval(cd,1000); }
  if (tab==='qib') startCompass(); else stopCompass();
  bind();
}
function ramCd(){
  const el=$('#ramcd'); if(!el) return; const now=Date.now(), td=day(new Date());
  const tm=day(new Date(new Date().getFullYear(),new Date().getMonth(),new Date().getDate()+1));
  let txt='';
  const imsakT=d=>+d.fajr-S.imsak*6e4, f=ms=>{const s=Math.max(0,Math.floor(ms/1000));return `${pad(Math.floor(s/3600))}:${pad(Math.floor(s%3600/60))}:${pad(s%60)}`};
  if (td.ram && now<imsakT(td)) txt='الإمساك بعد '+f(imsakT(td)-now);
  else if (td.ram && now<+td.maghrib) txt='الإفطار بعد '+f(+td.maghrib-now);
  else if (tm.ram) txt='الإمساك بعد '+f(imsakT(tm)-now);
  el.textContent=txt; el.style.display=txt?'':'none';
}
function cd(){ ramCd(); const el=$('#cd'); if(!el) return; const nx=nextPrayer(); if(!nx){el.textContent='--:--:--';return;}
  let s=Math.max(0,Math.floor((nx.t-Date.now())/1000)); const h=Math.floor(s/3600), m=Math.floor(s%3600/60); el.textContent=`${pad(h)}:${pad(m)}:${pad(s%60)}`;
  if (s===0) setTimeout(render,1500); }
function bind(){
  document.querySelectorAll('[data-gotoloc]').forEach(b=>b.onclick=()=>{ tab='set'; openSec.add('الموقع'); render(); });
  document.querySelectorAll('[data-wiz]').forEach(b=>b.onclick=()=>openWiz(false));
  document.querySelectorAll('details.sec').forEach(d=>d.ontoggle=()=>{ d.open?openSec.add(d.dataset.s):openSec.delete(d.dataset.s); });
  document.querySelectorAll('[data-open]').forEach(b=>b.onclick=async()=>{ if(!Bilal)return; if(b.dataset.open==='notif' && Bilal.requestNotifications) await Bilal.requestNotifications(); else await Bilal.openSettings({type:b.dataset.open}); });
  document.querySelectorAll('[data-ad]').forEach(r=>r.onclick=async()=>{ const k=r.dataset.ad; S.adhan[k]=S.adhan[k]?0:1; save(); await push(); render(); });
  document.querySelectorAll('[data-url]').forEach(r=>r.onclick=()=>Bilal&&Bilal.openUrl({url:r.dataset.url}));
  const on=(id,ev,fn)=>{const e=$(id); if(e) e[ev]=fn;};
  on('#boostT','onclick',async()=>{S.boost=S.boost?0:1;save();await push();render();});
  on('#imsakT','onclick',async()=>{S.imsakAlert=S.imsakAlert?0:1;save();await push();render();});
  on('#city','onchange',async e=>{ const c=CITIES[+e.target.value]; if(!c)return; S.loc={name:c[0],lat:c[1],lon:c[2],auto:false,chosen:1}; save(); await push(); render(); });
  on('#method','onchange',async e=>{S.method=e.target.value;save();await push();render();});
  on('#asr','onchange',async e=>{S.asr=e.target.value;save();await push();render();});
  const setSnd=async(id,kind)=>{ const l=LIB.find(x=>x.id===id)||LIB[0]; if(!l.full) kind='takbir'; if(!l.tk) kind='adhan'; S.sound=kind+'_'+l.id; save(); await push(); render(); };
  on('#mu','onchange',e=>setSnd(e.target.value,S.sound.split('_')[0])); on('#mk','onchange',e=>setSnd(S.sound.split('_')[1],e.target.value));
  on('#silent','onchange',async e=>{S.silent=+e.target.value;save();await push();await refreshStatus();render();});
  on('#imsak','onchange',async e=>{S.imsak=+e.target.value;save();await push();});
  on('#ramAdj','onchange',async e=>{S.ramAdj=+e.target.value;save();await push();});
  on('#prev','onclick',()=>Bilal&&Bilal.preview({sound:S.sound})); on('#stop','onclick',()=>Bilal&&Bilal.stop());
  on('#lang','onchange',e=>I18N.set(e.target.value));
  on('#gps','onclick',locate);
  on('#mus','onclick',()=>Bilal&&Bilal.openApp({package:'net.wardyat.mustashari',url:'https://mustashari.wardyat.net'}));
  if (Bilal && $('#musb')) Bilal.isInstalled({package:'net.wardyat.mustashari'}).then(r=>{ const e=$('#musb'); if(e) e.textContent = r.installed ? 'افتح' : 'حمّل'; }).catch(()=>{});
  document.querySelectorAll('#theme .chip').forEach(c=>c.onclick=async()=>{S.theme=c.dataset.v;save();await push();render();});
  document.querySelectorAll('[data-acc]').forEach(e=>e.onclick=async()=>{S.wacc=e.dataset.acc;save();await push();render();});
  const col=(id,key)=>{ const e=$(id); if(e) e.onchange=async ev=>{S[key]=ev.target.value;save();await push();render();}; };
  col('#accc','wacc'); col('#bgc','wbg'); col('#fgc','wfg');
  document.querySelectorAll('[data-reset]').forEach(b=>b.onclick=async()=>{S[b.dataset.reset]='';save();await push();render();});
  on('#alp','onchange',async e=>{S.walpha=+e.target.value;save();await push();render();});
  on('#rstc','onclick',async()=>{S.wacc='';S.wbg='';S.wfg='';S.walpha=0;save();await push();render();});
}
function locate(){
  return new Promise(res=>{
    if (!navigator.geolocation) { toast('الموقع غير متاح على هذا الجهاز'); return res(); }
    navigator.geolocation.getCurrentPosition(async p=>{
      const {latitude:la, longitude:lo}=p.coords; let best=null, bd=1e9;
      for (const c of CITIES){ const d=Math.hypot((c[1]-la)*111,(c[2]-lo)*111*Math.cos(la*Math.PI/180)); if(d<bd){bd=d;best=c;} }
      S.loc={name: bd<60?best[0]:'موقعك الحالي', lat:la, lon:lo, auto:true}; save(); await push(); if(!wizOn) render(); res();
    }, ()=>{ toast('تعذّر تحديد الموقع. اسمح للتطبيق بالموقع أو اختر مدينتك من القائمة.'); res(); }, {enableHighAccuracy:false, timeout:15000, maximumAge:600000});
  });
}

const MUS_PKG='net.wardyat.mustashari', MUS_URL='https://mustashari.wardyat.net';
function promo(){   // الدعاية: فيديو مستشاري + زر التحميل، حين لا يكون التطبيق مثبّتاً
  if($('#mp')) return; const d=document.createElement('div'); d.id='mp';
  d.innerHTML=`<div class="t">مستشاري</div><video src="promo.mp4" autoplay playsinline controls></video><div class="b"><button class="btn" id="mpgo">حمّل التطبيق</button><button class="btn sec" id="mpx" style="color:var(--cream)">إغلاق</button></div>`;
  document.body.appendChild(d);
  const close=()=>{ const v=d.querySelector('video'); try{v.pause()}catch(_){} d.remove(); };
  d.querySelector('#mpx').onclick=close;
  d.querySelector('#mpgo').onclick=()=>{ if(Bilal) Bilal.openApp({package:MUS_PKG,url:MUS_URL}); else window.open(MUS_URL,'_blank'); };
}
async function openMus(){   // مثبّت: يفتح التطبيق نفسه؛ غير ذلك: الدعاية
  try{ if(Bilal){ const r=await Bilal.isInstalled({package:MUS_PKG}); if(r&&r.installed){ Bilal.openApp({package:MUS_PKG,url:MUS_URL}); return; } } }catch(_){}
  promo();
}
document.querySelectorAll('#nav button').forEach(b=>b.onclick=()=>{if(b.dataset.t==='mus'){openMus();return;}tab=b.dataset.t;render();const m=$('main'); if(m) m.scrollTo(0,0);});
document.addEventListener('visibilitychange',async()=>{ if(!document.hidden){ await refreshStatus(); await push(); if(wizOn) wizard(); else render(); }});
(async()=>{ save(); render();   // يظهر المحتوى فوراً ثم تُحدَّث الحالة (على الجوال البطيء كانت الشاشة تبقى فارغة ~20 ثانية)
  if (!localStorage.getItem('bilal_wiz')) openWiz(true);
  await refreshStatus(); await push(); if (!wizOn) render(); else wizard(); })();
