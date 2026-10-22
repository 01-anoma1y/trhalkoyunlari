/* =========================================================
   AYARLAR — yeni e-posta ve site adı açılınca SADECE burayı değiştirin.
   ========================================================= */
const CONFIG = {
  email: 'yenimail@gmail.com',      // TODO: yeni kongre e-postası
  site: 'www.siteadi.com',          // TODO: yeni site adresi
  congressStart: '2026-12-10T09:00:00+03:00',
};

/* ---------- Kurul listeleri (Word dosyasından) ---------- */
const ORGANIZING = [
  ['Prof. Kerem Cenk YILMAZ', 'Sakarya Üniversitesi', true],
  ['Prof. Dr. Sertan DEMİR', 'Sakarya Üniversitesi'],
  ['Prof. Dr. Mustafa ŞAHİN', 'Ardahan Üniversitesi'],
  ['Prof. Dr. Zeynel TURAN', 'Burdur Mehmet Akif Ersoy Üniversitesi'],
  ['Doç. Dr. Dilek CANTEKİN ELYAĞUTU', 'Sakarya Üniversitesi'],
  ['Doç. Dr. Arda ERAVCI', 'Giresun Üniversitesi'],
  ['Dr. Öğr. Üy. Umut ERDOĞAN', 'Sakarya Üniversitesi'],
  ['Öğr. Gör. Dr. Yiğit Hakan ÜNLÜ', 'Sakarya Üniversitesi'],
  ['Öğr. Gör. Dr. Deniz KÖKTAN', 'Sakarya Üniversitesi'],
  ['Öğr. Gör. Eda ERTURAL', 'Sakarya Üniversitesi'],
  ['Öğr. Gör. Gökhan ÜLKER', 'Eskişehir Osmangazi Üniversitesi'],
];
const SECRETARIAT = [
  ['Arş. Gör. Dr. Gül KAPLAN EKEMEN', 'Sakarya Üniversitesi'],
  ['Arş. Gör. Semih ÖZBİLGİ', 'Sakarya Üniversitesi'],
];
const REFEREES = [
  ['Dr. Ahmet Selim DOĞAN','ATATÜRK ÜNİVERSİTESİ'],
  ['Dr. Adem KOÇ','ESKİŞEHİR OSMANGAZİ ÜNİVERSİTESİ'],
  ['Dr. Abdulmenaf KORKUTATA','ÇANAKKALE ONSEKİZ MART ÜNİVERSİTESİ'],
  ['Dr. Anna HOFFMAN','RESEARCH CENTER OF SLOVIAN ACD OF SCIENCES AND ARTS'],
  ['Dr. Ann R. DAVID','BONH ÜNİVERSİTESİ'],
  ['Dr. Arda ERAVCI','GİRESUN ÜNİVERSİTESİ'],
  ['Dr. Arzu ÖZTÜRKMEN','BOĞAZİÇİ ÜNİVERSİTESİ'],
  ['Dr. Aslı Büyükokutan TÖRET','ESKİŞEHİR OSMANGAZİ ÜNİVERSİTESİ'],
  ['Dr. Asuman TURAN','MEHMET AKİF ERSOY ÜNİVERSİTESİ'],
  ['Dr. Ayrin ERSÖZ','YILDIZ TEKNİK ÜNİVERSİTESİ'],
  ['Dr. Ayşin KABALAK','MİMAR SİNAN GÜZEL SANATLAR ÜNİVERSİTESİ'],
  ['Dr. Bora OKTAN','EGE ÜNİVERSİTESİ'],
  ['Dr. Bülent KURTİŞOĞLU','ARDAHAN ÜNİVERSİTESİ'],
  ['Dr. Cafer Talha ŞEKER','İSTANBUL TİCARET ÜNİVERSİTESİ'],
  ['Dr. Cihan YURTÇU','İSTANBUL TEKNİK ÜNİVERSİTESİ'],
  ['Dr. Chi -Fang CHAO','ROEHAMPTON UNIVERSITY'],
  ['Dr. Dilek CANTEKİN ELYAĞUTU','SAKARYA ÜNİVERSİTESİ'],
  ['Dr. Dilek TÜRKYILMAZ','HACI BAYRAM VELİ ÜNİVERSİTESİ'],
  ['Dr. Elsie IVANCICH DUNIN','KALIFORNİA ÜNİVERSİTESİ'],
  ['Dr. Elvan Deniz YUMUK','ALAADDİN KEYKUBAT ÜNİVERSİTESİ'],
  ['Dr. Emrah ÖZDEMİR','RUMELİ ÜNİVERSİTESİ'],
  ['Dr. Enver SADIKOVA','BAKÜ MÜZİK AKADEMİSİ'],
  ['Dr. Ercan KILKIL','MUĞLA SITKI KOÇMAN ÜNİVERSİTESİ'],
  ['Dr. Erhan TEKİN','HATAY MUSTAFA KEMAL ÜNİVERSİSTESİ'],
  ['Dr. Eylem DERELİ','ESKİŞEHİR OSMANGAZİ ÜNİVERSİTESİ'],
  ['Dr. Faik TANRIKULU','İSTANBUL MEDİPOL ÜNİVERSİTESİ'],
  ['Dr. F. Belma OĞUL','İSTANBUL TEKNİK ÜNİVERSİTESİ'],
  ['Dr. Gencay KARAKAYA','İSTANBUL TİCARET ÜNİVERSİTESİ'],
  ['Dr. Gülay MİRZAOĞLU','HACETTEPE ÜNİVERSİTESİ'],
  ['Dr. Habiba MAMEDOVA','BAKÜ KOREOGRAFİ AKADEMİSİ'],
  ['Dr. Hakan ACAR','MEHMET AKİF ERSOY ÜNİVERSİTESİ'],
  ['Dr. Hale YAMANER','EGE ÜNİVERSİTESİ'],
  ['Dr. Hasan Ali DAĞLI','EGE ÜNİVERSİTESİ'],
  ['Dr. Haydar TANRIVERDİ','İSTANBUL TEKNİK ÜNİVERSİTESİ'],
  ['Dr. Ida MEFTAHI','MARYLAND ÜNİVERSİTESİ'],
  ['Dr. İdris Ersan KÜÇÜK','EGE ÜNİVERSİTESİ'],
  ['Dr. İlknur BEKTAŞ','İSTANBUL TEKNİK ÜNİVERSİTESİ'],
  ['Dr. Irene MARKOFF','YORK ÜNİVERSİTESİ'],
  ['Dr. İsmail GÜVEN','ANKARA ÜNİVERSİTESİ'],
  ['Dr. İsmail SINIR','MUĞLA SITKI KOÇMAN ÜNİVERSİTESİ'],
  ['Dr. John MARGON O\'CONNELL','CARDIFF ÜNİVERSİTESİ'],
  ['Dr. Kamile PERÇİN AKGÜL','GAZİANTEP ÜNİVERSİTESİ'],
  ['Dr. Kemal ÖZAVCI','ARDAHAN ÜNİVERSİTESİ'],
  ['Dr. Kerem CENK YILMAZ','SAKARYA ÜNİVERSİTESİ'],
  ['Dr. Konstantinos DIMOPOULOS','NATIONAL AND KAPODISTRIAN UNIVERSITY OF ATHENS'],
  ['Dr. Kürşat ÖNCÜL','ESKİŞEHİR OSMANGAZİ ÜNİVERSİTESİ'],
  ['Dr. Lucie HAYASHI','ACADEMY OF PERFORMING ARTS IN PRAGUE'],
  ['Dr. Maria ARGYRIOU','APPLIED MUSIC PEDAGOGY UNIVERSITY OF THE AEGEAN'],
  ['Dr. Mehmet Onurhan GÜCÜŞ','KARAMANOĞLU MEHMETBEY ÜNİVERSİTESİ'],
  ['Dr. Mehmet Öcal ÖZBİLGİN','EGE ÜNİVERSİTESİ'],
  ['Dr. Mırna SABLJAR','JOSIP JURAJ STROSSMAYER UNIVERSITY OF OSIJEK'],
  ['Dr. Mustafa KAYA','SİVAS CUMHURİYET ÜNİVERSİTESİ'],
  ['Dr. Mustafa ŞAHİN','ARDAHAN ÜNİVERSİTESİ'],
  ['Dr. Muzaffer SÜMBÜL','ÇUKUROVA ÜNİVERSİTESİ'],
  ['Dr. Necip ÇETİN','VAN YÜZÜNCÜ YIL ÜNİVERSİTESİ'],
  ['Dr. Öcal OĞUZ','GAZİ ÜNİVERSİTESİ'],
  ['Dr. Ömer ADIGÜZEL','ANKARA ÜNİVERSİTESİ'],
  ['Dr. Ömer Barbaros ÜNLÜ','EGE ÜNİVERSİTESİ'],
  ['Dr. Onur AYKAÇ','KARAMANOĞLU MEHMETBEY ÜNİVERSİTESİ'],
  ['Dr. Özkul ÇOBANOĞLU','HACETTEPE ÜNİVERSİTESİ'],
  ['Dr. Pınar KASAPOĞLU','HACETTEPE ÜNİVERSİTESİ'],
  ['Dr. Pınar Karacan DOĞAN','GAZİ ÜNİVERSİTESİ'],
  ['Dr. Rumiana MARGARİTOVA','INSTITUTE OF ART STUDIES, BULGARIAN ACADEMY OF SCIENCES'],
  ['Dr. Savaş EKİCİ','GAZİANTEP ÜNİVERSİTESİ'],
  ['Dr. Selami AKIŞ','ARDAHAN ÜNİVERSİTESİ'],
  ['Dr. Serdar KASTELLİ','EGE ÜNİVERSİTESİ'],
  ['Dr. Öğr. Üyesi Seren ERAVCI','GİRESUN ÜNİVERSİTESİ'],
  ['Dr. Serpil MÜRTEZAOĞLU','İSTANBUL TEKNİK ÜNİVERSİTESİ'],
  ['Dr. Sema ERKAN','EGE ÜNİVERSİTESİ'],
  ['Dr. Serhat TURUNÇ','İSTANBUL TEKNİK ÜNİVERSİTESİ'],
  ['Dr. Serkan KELEŞOĞLU','ANKARA ÜNİVERSİTESİ'],
  ['Dr. Şirin ŞENGEL','ESKİŞEHİR OSMANGAZİ ÜNİVERSİTESİ'],
  ['Dr. Süleyman FİDAN','GAZİANTEP ÜNİVERSİTESİ'],
  ['Dr. Tatyana KARTASHOVA','L. V. SARATOV DEVLET KONSERVATUVARI SOBINOVA'],
  ['Dr. Tolga KARACA','GAZİOSMANPAŞA ÜNİVERSİTESİ'],
  ['Dr. Tuğçe TUNA','MİMAR SİNAN ÜNİVERSİTESİ'],
  ['Dr. Turgay AKDAĞOĞLU','ARDAHAN ÜNİVERSİTESİ'],
  ['Dr. Umut ERDOĞAN','SAKARYA ÜNİVERSİTESİ'],
  ['Dr. Yakup AÇAR','KAFKAS ÜNİVERSİTESİ'],
  ['Dr. Yunus Emre ÜSTGÖRÜL','MUĞLA SITKI KOÇMAN ÜNİVERSİTESİ'],
  ['Dr. Zeynel TURAN','MEHMET AKİF ERSOY ÜNİVERSİTESİ'],
  ['Dr. Zinnur GEREK','GAZİANTEP ÜNİVERSİTESİ'],
];

/* ---------- Önemli tarihler ---------- */
const DATES = [
  ['2026-11-25', 'Bildiri özetlerinin gönderilebileceği son tarih', 'Deadline for sending abstracts'],
  ['2026-11-28', 'Kabul edilen bildirilerin ilanı', 'Announcement of accepted papers'],
  ['2026-12-01', 'Kongreye kayıt için son tarih', 'Deadline for congress registration'],
  ['2026-12-04', 'Kongre programının ilanı', 'Announcement of the congress program'],
  ['2026-12-10', '1. Gün — Kongre açılışı ve bildiri sunumları', 'Day 1 — Congress opening and paper presentations', true],
  ['2026-12-11', '2. Gün — Bildiri sunumları', 'Day 2 — Paper presentations', true],
  ['2026-12-12', '3. Gün — Bildiri sunumları, kongre kapanışı ve gezi programı', 'Day 3 — Paper presentations, closing of the congress and excursion', true],
];

/* ========================================================= */
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const lang = () => document.documentElement.dataset.lang;

/* Ayar değerlerini sayfaya yaz */
function applyConfig() {
  $$('[data-email]').forEach(el => {
    el.textContent = CONFIG.email;
    if (el.tagName === 'A') el.href = 'mailto:' + CONFIG.email;
  });
  $$('[data-site]').forEach(el => {
    el.textContent = CONFIG.site;
    if (el.tagName === 'A') el.href = 'https://' + CONFIG.site.replace(/^https?:\/\//, '');
  });
}

/* Dil */
function setLang(l) {
  document.documentElement.dataset.lang = l;
  document.documentElement.lang = l;
  $$('.lang button').forEach(b => b.classList.toggle('on', b.dataset.l === l));
  try { localStorage.setItem('uhok-lang', l); } catch (e) {}
  $$('[data-ph-tr]').forEach(el => el.placeholder = el.dataset['ph' + (l === 'tr' ? 'Tr' : 'En')]);
  document.title = l === 'tr'
    ? '5. Uluslararası Halk Oyunları Kongresi | UHOK 2026'
    : '5th International Folk Dance Congress | IFDC 2026';
  // Açılır listeler: "Türkçe / English" metninden dile göre tek dil göster, gönderilen değer iki dilli kalsın
  $$('select option').forEach(o => {
    if (!o.dataset.both) { o.dataset.both = o.textContent; o.value = o.textContent; }
    const parts = o.dataset.both.split(' / ');
    o.textContent = parts.length === 2 ? (l === 'tr' ? parts[0] : parts[0].match(/^\d+\. /) ? parts[0].match(/^\d+\. /)[0] + parts[1] : parts[1]) : o.dataset.both;
  });
  renderTimeline();
  updateCountdown();
  $$('textarea[data-words]').forEach(ta => ta.dispatchEvent(new Event('input')));
}

/* Sekmeler (hash ile) */
function route() {
  const id = (location.hash || '#anasayfa').slice(1).split('/')[0];
  const page = $('#p-' + id) || $('#p-anasayfa');
  $$('.page').forEach(p => p.classList.toggle('show', p === page));
  $$('nav.main a').forEach(a => a.classList.toggle('active', a.getAttribute('href') === '#' + page.id.slice(2)));
  $('nav.main').classList.remove('open');
  const sub = location.hash.split('/')[1];
  if (sub && $('#' + sub)) setTimeout(() => $('#' + sub).scrollIntoView({ behavior: 'smooth' }), 60);
  else window.scrollTo({ top: 0, behavior: 'instant' in window ? 'instant' : 'auto' });
}

/* Geri sayım */
function updateCountdown() {
  const diff = new Date(CONFIG.congressStart) - new Date();
  const box = $$('.countdown');
  if (!box.length) return;
  const d = Math.max(0, Math.floor(diff / 864e5)),
        h = Math.max(0, Math.floor(diff / 36e5) % 24),
        m = Math.max(0, Math.floor(diff / 6e4) % 60),
        s = Math.max(0, Math.floor(diff / 1e3) % 60);
  const L = lang() === 'tr' ? ['Gün', 'Saat', 'Dakika', 'Saniye'] : ['Days', 'Hours', 'Minutes', 'Seconds'];
  box.forEach(b => b.innerHTML = [d, h, m, s].map((v, i) => `<div><b>${String(v).padStart(2, '0')}</b><span>${L[i]}</span></div>`).join(''));
}

/* Zaman çizelgesi */
function fmtDate(iso) {
  const d = new Date(iso + 'T12:00:00');
  const months = lang() === 'tr'
    ? ['Ocak','Şubat','Mart','Nisan','Mayıs','Haziran','Temmuz','Ağustos','Eylül','Ekim','Kasım','Aralık']
    : ['January','February','March','April','May','June','July','August','September','October','November','December'];
  const days = lang() === 'tr'
    ? ['Pazar','Pazartesi','Salı','Çarşamba','Perşembe','Cuma','Cumartesi']
    : ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
  return { main: `${d.getDate()} ${months[d.getMonth()]}`, sub: `${days[d.getDay()]} · ${iso.split('-').reverse().join('.')}` };
}
function renderTimeline() {
  const today = new Date(); today.setHours(0, 0, 0, 0);
  let nextFound = false;
  const items = DATES.map(([iso, tr, en, cong]) => {
    const past = new Date(iso + 'T23:59:59') < today;
    let cls = past ? 'past' : '';
    let badge = '';
    if (!past && !nextFound) { nextFound = true; cls += ' next'; badge = `<span class="badge">${lang() === 'tr' ? 'Sıradaki' : 'Next'}</span>`; }
    if (cong) cls += ' congress';
    const f = fmtDate(iso);
    return `<li class="${cls}"><div class="d">${f.main}<small>${f.sub}</small></div><div class="c">${lang() === 'tr' ? tr : en}${badge}</div></li>`;
  });
  $$('.timeline').forEach(t => {
    t.innerHTML = items.slice(0, +t.dataset.limit || DATES.length).join('');
  });
}

/* Takvime ekle (.ics) */
function downloadICS() {
  const ev = (iso, title, allDayEnd) => {
    const d = iso.replace(/-/g, '');
    const e = new Date(iso + 'T12:00:00'); e.setDate(e.getDate() + 1);
    const de = e.toISOString().slice(0, 10).replace(/-/g, '');
    return `BEGIN:VEVENT\r\nUID:${d}-${Math.random().toString(36).slice(2)}@uhok\r\nDTSTAMP:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z\r\nDTSTART;VALUE=DATE:${d}\r\nDTEND;VALUE=DATE:${allDayEnd || de}\r\nSUMMARY:${title}\r\nLOCATION:Sakarya Üniversitesi Turgut Özal Kültür ve Kongre Merkezi\r\nEND:VEVENT\r\n`;
  };
  let body = 'BEGIN:VCALENDAR\r\nVERSION:2.0\r\nPRODID:-//UHOK 2026//TR\r\n';
  DATES.slice(0, 4).forEach(([iso, tr, en]) => body += ev(iso, 'UHOK 2026 – ' + (lang() === 'tr' ? tr : en)));
  body += ev('2026-12-10', lang() === 'tr' ? '5. Uluslararası Halk Oyunları Kongresi' : '5th International Folk Dance Congress', '20261213');
  body += 'END:VCALENDAR\r\n';
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([body], { type: 'text/calendar' }));
  a.download = 'UHOK-2026.ics';
  a.click();
}

/* Kurullar */
function initials(name) {
  const parts = name.replace(/(Prof\.|Dr\.|Doç\.|Öğr\.|Gör\.|Üy\.|Üyesi|Arş\.)/g, '').trim().split(/\s+/);
  return (parts[0][0] + (parts[parts.length - 1][0] || '')).toUpperCase();
}
function personCard([n, i, lead]) {
  const pres = lead ? `<span lang="tr">Başkan</span><span lang="en">President</span> · ` : '';
  return `<div class="person${lead ? ' lead' : ''}" data-q="${(n + ' ' + i).toLocaleLowerCase('tr')}"><div class="av">${initials(n)}</div><div><b>${n}</b><span>${pres}${i}</span></div></div>`;
}
function renderPeople() {
  $('#org-list').innerHTML = ORGANIZING.map(personCard).join('');
  $('#sec-list').innerHTML = SECRETARIAT.map(personCard).join('');
  $('#ref-list').innerHTML = REFEREES.map(personCard).join('');
  $('#ref-count').textContent = REFEREES.length;
  $('#ref-search').addEventListener('input', e => {
    const q = e.target.value.toLocaleLowerCase('tr').trim();
    $$('#ref-list .person').forEach(p => p.style.display = p.dataset.q.includes(q) ? '' : 'none');
  });
}

/* Formlar → e-posta */
const words = t => (t.trim().match(/\S+/g) || []).length;
function wireCounters() {
  $$('textarea[data-words]').forEach(ta => {
    if (ta.dataset.wired) return; ta.dataset.wired = '1';
    const c = ta.nextElementSibling;
    const upd = () => {
      const n = words(ta.value);
      const ok = n >= 100 && n <= 350;
      c.className = 'counter ' + (n === 0 ? '' : ok ? 'ok' : 'bad');
      c.textContent = (lang() === 'tr' ? `${n} kelime (100–350 arası olmalı)` : `${n} words (must be 100–350)`);
    };
    ta.addEventListener('input', upd); upd();
  });
}
function sendMail(form, subject, lines) {
  const msg = form.querySelector('.form-msg');
  const text = lines.join('\n');
  const go = () => {
    const body = text.length > 1800
      ? (lang() === 'tr' ? 'Başvuru metni panoya kopyalandı; lütfen buraya yapıştırınız ve Word dosyanızı ekleyiniz.\n\n' : 'The submission text was copied to the clipboard; please paste it here and attach your Word file.\n\n') + text.slice(0, 1200) + '…'
      : text;
    location.href = `mailto:${CONFIG.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    msg.className = 'form-msg'; msg.style.display = 'block';
    msg.textContent = lang() === 'tr'
      ? 'E-posta programınız açılıyor. Metin ayrıca panoya kopyalandı. Açılmazsa bilgileri ' + CONFIG.email + ' adresine gönderebilirsiniz.'
      : 'Your e-mail client is opening. The text was also copied to the clipboard. If nothing opens, send the details to ' + CONFIG.email + '.';
  };
  (navigator.clipboard ? navigator.clipboard.writeText(text).catch(() => {}) : Promise.resolve()).then(go);
}
function wireForms() {
  $('#abstract-form').addEventListener('submit', e => {
    e.preventDefault();
    const f = e.target, v = n => f.elements[n].value.trim(), msg = f.querySelector('.form-msg');
    const errs = [];
    const kwTR = v('kw_tr').split(/[,;]/).filter(s => s.trim()).length;
    const kwEN = v('kw_en').split(/[,;]/).filter(s => s.trim()).length;
    const wTR = words(v('abs_tr')), wEN = words(v('abs_en'));
    if (wTR < 100 || wTR > 350 || wEN < 100 || wEN > 350) errs.push(lang() === 'tr' ? 'Özetler her iki dilde 100–350 kelime olmalıdır.' : 'Abstracts must be 100–350 words in both languages.');
    if (kwTR < 3 || kwTR > 5 || kwEN < 3 || kwEN > 5) errs.push(lang() === 'tr' ? 'Anahtar kelimeler 3–5 adet olmalıdır (virgülle ayırınız).' : 'Provide 3–5 keywords (comma separated).');
    if (errs.length) { msg.className = 'form-msg err'; msg.style.display = 'block'; msg.textContent = errs.join(' '); return; }
    sendMail(f, `UHOK 2026 – Bildiri Özeti / Abstract – ${v('name')}`, [
      `Ad Soyad / Name: ${v('name')}`, `Unvan / Title: ${v('title')}`, `Kurum / Institution: ${v('inst')}`,
      `E-posta / E-mail: ${v('mail')}`, `Telefon / Phone: ${v('phone')}`,
      `Katılım türü / Type: ${v('type')}`, `Alt tema / Sub-theme: ${v('theme')}`, '',
      `Başlık (TR): ${v('t_tr')}`, `Title (EN): ${v('t_en')}`, '',
      `ÖZET (TR):\n${v('abs_tr')}`, `Anahtar kelimeler: ${v('kw_tr')}`, '',
      `ABSTRACT (EN):\n${v('abs_en')}`, `Keywords: ${v('kw_en')}`,
    ]);
  });
  $('#reg-form').addEventListener('submit', e => {
    e.preventDefault();
    const f = e.target, v = n => f.elements[n].value.trim();
    sendMail(f, `UHOK 2026 – Kayıt / Registration – ${v('name')}`, [
      `Ad Soyad / Name: ${v('name')}`, `Unvan / Title: ${v('title')}`, `Kurum / Institution: ${v('inst')}`,
      `Ülke / Country: ${v('country')}`, `E-posta / E-mail: ${v('mail')}`, `Telefon / Phone: ${v('phone')}`,
      `Katılım şekli / Participation: ${v('type')}`, `Bildiri başlığı / Paper title: ${v('paper') || '-'}`,
      `Gezi programı / Excursion: ${v('trip')}`, `Not / Note: ${v('note') || '-'}`,
    ]);
  });
}

/* Galeri */
function wireGallery() {
  const lb = $('.lightbox'), img = $('img', lb);
  $$('.gallery a').forEach(a => a.addEventListener('click', e => { e.preventDefault(); img.src = a.href; lb.classList.add('on'); }));
  lb.addEventListener('click', () => lb.classList.remove('on'));
  document.addEventListener('keydown', e => e.key === 'Escape' && lb.classList.remove('on'));
}

/* Başlangıç */
document.addEventListener('DOMContentLoaded', () => {
  applyConfig();
  renderPeople();
  wireCounters();
  let l = new URLSearchParams(location.search).get('lang');
  if (!l) { try { l = localStorage.getItem('uhok-lang'); } catch (e) {} }
  if (!l) l = 'tr';
  setLang(l === 'en' ? 'en' : 'tr');
  $$('.lang button').forEach(b => b.addEventListener('click', () => setLang(b.dataset.l)));
  $('.burger').addEventListener('click', () => $('nav.main').classList.toggle('open'));
  $$('[data-ics]').forEach(b => b.addEventListener('click', downloadICS));
  wireForms(); wireGallery();
  route(); window.addEventListener('hashchange', route);
  updateCountdown(); setInterval(updateCountdown, 1000);
  const tt = $('.to-top');
  window.addEventListener('scroll', () => tt.classList.toggle('on', scrollY > 600));
  tt.addEventListener('click', () => scrollTo({ top: 0, behavior: 'smooth' }));
  $('#year').textContent = new Date().getFullYear();
  initReveal();
});

/* Kaydırınca beliren bloklar */
let revealObs;
function initReveal() {
  if (!('IntersectionObserver' in window) || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  revealObs = new IntersectionObserver(es => es.forEach(e => {
    if (e.isIntersecting) {
      const el = e.target; el.classList.add('in'); revealObs.unobserve(el);
      setTimeout(() => { el.style.transitionDelay = ''; el.classList.add('done'); }, 900);
    }
  }), { rootMargin: '0px 0px -8% 0px' });
  markReveal();
  window.addEventListener('hashchange', () => setTimeout(markReveal, 30));
}
function markReveal() {
  if (!revealObs) return;
  $$('.page.show .section-title, .page.show .card, .page.show .person, .page.show .timeline li, .page.show .gallery a, .page.show details.acc, .page.show .callout, .page.show .chip, .page.show .prose')
    .forEach((el, i) => {
      if (el.classList.contains('reveal')) return;
      const r = el.getBoundingClientRect();
      if (r.top < innerHeight) return; // ekranda olanlar hemen görünür kalsın
      el.classList.add('reveal');
      el.style.transitionDelay = (i % 4) * 60 + 'ms';
      revealObs.observe(el);
    });
}
