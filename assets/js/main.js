/* =========================================================
   5. Uluslararası Halk Oyunları Kongresi — site kodu
   İçerik (iletişim, tarihler, kurullar, program) content/site.json dosyasındadır.
   tools/build.py bu veriyi index.html içine hem metin olarak hem de
   <script id="site-data"> olarak yazar; bu dosya aynı veriyi okur.
   ========================================================= */
const DATA = JSON.parse(document.getElementById('site-data').textContent);
const D = DATA.dates;

const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const lang = () => document.documentElement.dataset.lang;
const T = (tr, en) => (lang() === 'tr' ? tr : en);
const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const iso = k => D[k] || k; // anahtar ya da doğrudan ISO tarih

/* ---------- Tarih biçimleri (gün adları tarihten üretilir) ---------- */
const MONTHS = {
  tr: ['Ocak','Şubat','Mart','Nisan','Mayıs','Haziran','Temmuz','Ağustos','Eylül','Ekim','Kasım','Aralık'],
  en: ['January','February','March','April','May','June','July','August','September','October','November','December'],
};
const DAYS = {
  tr: ['Pazar','Pazartesi','Salı','Çarşamba','Perşembe','Cuma','Cumartesi'],
  en: ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'],
};
function parts(isoDate, l = lang()) {
  const [y, m, d] = isoDate.split('-').map(Number);
  const wd = new Date(Date.UTC(y, m - 1, d)).getUTCDay();
  return { y, m, d, month: MONTHS[l][m - 1], day: DAYS[l][wd] };
}
const FMT = {
  date: (k, l) => { const p = parts(iso(k), l); return `${p.d} ${p.month} ${p.y}`; },
  daymonth: (k, l) => { const p = parts(iso(k), l); return `${p.d} ${p.month}`; },
  dmy: k => iso(k).split('-').reverse().join('.'),
  weekday: (k, l) => parts(iso(k), l).day,
  range: (ks, l) => { const [a, b] = ks.split(',').map(k => parts(iso(k), l)); return a.m === b.m ? `${a.d}–${b.d} ${b.month} ${b.y}` : `${a.d} ${a.month} – ${b.d} ${b.month} ${b.y}`; },
  weekrange: (ks, l) => ks.split(',').map(k => parts(iso(k), l).day).join(' – '),
  days: (k, l) => {
    const [y, m, d] = iso(k).split('-').map(Number), t = new Date();
    const n = Math.round((Date.UTC(y, m - 1, d) - Date.UTC(t.getFullYear(), t.getMonth(), t.getDate())) / 864e5);
    if (n > 0) return l === 'tr' ? `${n} gün kaldı` : `${n} days left`;
    return n === 0 ? (l === 'tr' ? 'Bugün son gün' : 'Last day today') : (l === 'tr' ? 'Süre doldu' : 'Closed');
  },
  count: k => String(DATA.committees[k].length),
};

/* data-bind="email" | "site" | "date:anahtar" | "range:a,b" | ... */
function applyBinds() {
  const l = lang();
  $$('[data-bind]').forEach(el => {
    const [kind, arg] = el.dataset.bind.split(':');
    const elLang = el.closest('[lang]:not(html)')?.getAttribute('lang') || l;
    if (kind === 'email') { el.textContent = DATA.contact.email; if (el.tagName === 'A') el.href = 'mailto:' + DATA.contact.email; }
    else if (kind === 'site') { el.textContent = DATA.contact.site; if (el.tagName === 'A') { el.href = 'https://' + DATA.contact.site.replace(/^https?:\/\//, ''); el.target = '_blank'; el.rel = 'noopener'; } }
    else if (FMT[kind]) el.textContent = FMT[kind](arg, elLang);
  });
}

/* ---------- Renderlar (tools/build.py aynı çıktıyı Türkçe olarak önceden yazar) ---------- */
function initials(name) {
  const p = name.replace(/(Prof\.|Dr\.|Doç\.|Öğr\.|Gör\.|Üy\.|Üyesi|Arş\.)/g, '').trim().split(/\s+/);
  return (p[0][0] + (p[p.length - 1][0] || '')).toLocaleUpperCase('tr');
}
function personCard(p) {
  const pres = p.lead ? '<span lang="tr">Başkan</span><span lang="en">President</span> · ' : '';
  return `<div class="person${p.lead ? ' lead' : ''}" data-q="${esc((p.name + ' ' + p.institution).toLocaleLowerCase('tr'))}"><div class="av" aria-hidden="true">${esc(initials(p.name))}</div><div><b>${esc(p.name)}</b><span>${pres}${esc(p.institution)}</span></div></div>`;
}
function timelineHTML(limit) {
  const t = new Date(), today = Date.UTC(t.getFullYear(), t.getMonth(), t.getDate());
  let nextFound = false;
  return DATA.timeline.slice(0, limit || undefined).map(it => {
    const [y, m, d] = iso(it.date).split('-').map(Number), past = Date.UTC(y, m - 1, d) < today;
    let cls = past ? 'past' : '', badge = '';
    if (!past && !nextFound) { nextFound = true; cls += ' next'; badge = `<span class="badge">${T('Sıradaki', 'Next')}</span>`; }
    if (it.congress) cls += ' congress';
    return `<li class="${cls.trim()}"><div class="d">${FMT.daymonth(it.date, lang())}<small>${FMT.weekday(it.date, lang())} · ${FMT.dmy(it.date)}</small></div><div class="c">${esc(T(it.tr, it.en))}${badge}</div></li>`;
  }).join('');
}
function programHTML() {
  return DATA.program.map((day, i) => {
    const sessions = day.sessions.length
      ? `<ul class="sessions">${day.sessions.map(s => `<li><b>${esc(s.time)}</b> ${esc(T(s.tr, s.en))}${s.hall ? ` <span>· ${esc(s.hall)}</span>` : ''}</li>`).join('')}</ul>`
      : `<p class="note">${T(`Oturum detayları ${FMT.date('programAnnouncement', 'tr')} tarihinde yayınlanacak.`, `Session details will be announced on ${FMT.date('programAnnouncement', 'en')}.`)}</p>`;
    return `<div class="card"><div class="day-label">${T(`${i + 1}. GÜN`, `DAY ${i + 1}`)} · ${FMT.daymonth(day.date, lang()).toLocaleUpperCase(T('tr', 'en'))} · ${FMT.weekday(day.date, lang())}</div><h3>${esc(T(day.tr, day.en))}</h3>${sessions}</div>`;
  }).join('');
}
function render() {
  $$('[data-render]').forEach(el => {
    const k = el.dataset.render;
    if (k === 'timeline') el.innerHTML = timelineHTML(+el.dataset.limit);
    else if (k === 'program') el.innerHTML = programHTML();
    else if (DATA.committees[k]) { if (!el.dataset.done) { el.innerHTML = DATA.committees[k].map(personCard).join(''); el.dataset.done = 1; } }
  });
}

/* ---------- Dil ---------- */
const META = {
  tr: { title: 'UHOK 2026 | 5. Uluslararası Halk Oyunları Kongresi – Sakarya', desc: '5. Uluslararası Halk Oyunları Kongresi 10–12 Aralık 2026’da Sakarya Üniversitesi’nde. Bildiri çağrısı açık, katılım ücretsiz.' },
  en: { title: 'IFDC 2026 | 5th International Folk Dance Congress – Sakarya', desc: '5th International Folk Dance Congress, 10–12 December 2026 at Sakarya University, Türkiye. Call for papers is open; participation is free.' },
};
function setLang(l, keepPlace) {
  // Kullanıcının bulunduğu yeri korumak için ekranın üstündeki öğeyi işaretle
  let anchor, before;
  if (keepPlace) {
    // ekranın üst kısmındaki, ekrandan küçük en yakın öğe referans alınır
    anchor = document.elementFromPoint(innerWidth / 2, Math.min(160, innerHeight / 4));
    while (anchor && anchor.parentElement && anchor.getBoundingClientRect().height < 24) anchor = anchor.parentElement;
    before = anchor?.getBoundingClientRect().top;
  }
  document.documentElement.dataset.lang = l;
  document.documentElement.lang = l;
  $$('.lang button').forEach(b => { b.classList.toggle('on', b.dataset.l === l); b.setAttribute('aria-pressed', b.dataset.l === l); });
  try { localStorage.setItem('uhok-lang', l); } catch (e) {}
  $$('[data-ph-tr]').forEach(el => { el.placeholder = el.dataset['ph' + (l === 'tr' ? 'Tr' : 'En')]; });
  document.title = META[l].title;
  $('meta[name="description"]')?.setAttribute('content', META[l].desc);
  $('meta[property="og:title"]')?.setAttribute('content', META[l].title);
  $('meta[property="og:description"]')?.setAttribute('content', META[l].desc);
  $('meta[name="twitter:title"]')?.setAttribute('content', META[l].title);
  $('meta[name="twitter:description"]')?.setAttribute('content', META[l].desc);
  $('meta[property="og:locale"]')?.setAttribute('content', l === 'tr' ? 'tr_TR' : 'en_US');
  // Açılır listeler: "Türkçe / English" metninden dile göre tek dil; gönderilen değer iki dilli kalır
  $$('select option').forEach(o => {
    if (!o.dataset.both) { o.dataset.both = o.textContent; o.value = o.textContent; }
    const p = o.dataset.both.split(' / ');
    const num = (p[0].match(/^\d+\. /) || [''])[0];
    o.textContent = p.length === 2 ? (l === 'tr' ? p[0] : num + p[1]) : o.dataset.both;
  });
  applyBinds(); render(); updateCountdown();
  $$('textarea[data-words]').forEach(ta => ta.dispatchEvent(new Event('input')));
  $$('form.f [aria-invalid="true"]').forEach(validateField);
  if (anchor && before != null) window.scrollBy({ top: anchor.getBoundingClientRect().top - before, behavior: 'instant' });
}

/* ---------- Sekmeler (hash ile) ---------- */
function route() {
  const id = (location.hash || '#anasayfa').slice(1).split('/')[0];
  const page = $('#p-' + id) || $('#p-anasayfa');
  $$('.page').forEach(p => p.classList.toggle('show', p === page));
  const pid = page.id.slice(2);
  $$('nav.main a').forEach(a => {
    const on = a.getAttribute('href') === '#' + pid || (a.dataset.group || '').split(' ').includes(pid);
    a.classList.toggle('active', on);
    if (a.getAttribute('href') === '#' + pid) a.setAttribute('aria-current', 'page'); else a.removeAttribute('aria-current');
  });
  closeMenu();
  const sub = location.hash.split('/')[1];
  if (sub && $('#' + sub)) setTimeout(() => {
    const t = $('#' + sub);
    t.scrollIntoView({ behavior: 'smooth', block: 'start' });
    t.classList.remove('flash'); void t.offsetWidth; t.classList.add('flash');
  }, 60);
  else window.scrollTo({ top: 0, behavior: 'auto' });
}
function closeMenu() {
  $('nav.main').classList.remove('open');
  $('.burger')?.setAttribute('aria-expanded', 'false');
}

/* ---------- Geri sayım (yalnızca Önemli Tarihler sayfasında) ---------- */
function updateCountdown() {
  const box = $$('.countdown'); if (!box.length) return;
  const start = new Date(`${D.congressStart}T${DATA.congressStartTime}:00+03:00`);
  const diff = Math.max(0, start - new Date());
  const v = [Math.floor(diff / 864e5), Math.floor(diff / 36e5) % 24, Math.floor(diff / 6e4) % 60, Math.floor(diff / 1e3) % 60];
  const L = T(['Gün', 'Saat', 'Dakika', 'Saniye'], ['Days', 'Hours', 'Minutes', 'Seconds']);
  box.forEach(b => { b.innerHTML = v.map((x, i) => `<div><b>${String(x).padStart(2, '0')}</b><span>${L[i]}</span></div>`).join(''); });
}

/* ---------- Takvime ekle (.ics, tüm gün etkinlikleri — saat dilimi kaymaz) ---------- */
function buildICS() {
  const ymd = k => iso(k).replace(/-/g, '');
  const next = k => { const [y, m, d] = iso(k).split('-').map(Number); return new Date(Date.UTC(y, m - 1, d + 1)).toISOString().slice(0, 10).replace(/-/g, ''); };
  const stamp = new Date().toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  const loc = T('Sakarya Üniversitesi Turgut Özal Kültür ve Kongre Merkezi, Serdivan/Sakarya', 'Sakarya University Turgut Özal Culture and Congress Center, Serdivan/Sakarya, Türkiye');
  const ev = (uid, start, endExcl, title) => `BEGIN:VEVENT\r\nUID:${uid}@uhok2026\r\nDTSTAMP:${stamp}\r\nDTSTART;VALUE=DATE:${start}\r\nDTEND;VALUE=DATE:${endExcl}\r\nSUMMARY:${title}\r\nLOCATION:${loc.replace(/,/g, '\\,')}\r\nEND:VEVENT\r\n`;
  let body = 'BEGIN:VCALENDAR\r\nVERSION:2.0\r\nPRODID:-//UHOK 2026//TR\r\nCALSCALE:GREGORIAN\r\n';
  DATA.timeline.filter(t => !t.congress).forEach(t => { body += ev(t.date, ymd(t.date), next(t.date), 'UHOK 2026 – ' + T(t.tr, t.en)); });
  body += ev('congress', ymd('congressStart'), next('congressEnd'), T('5. Uluslararası Halk Oyunları Kongresi', '5th International Folk Dance Congress'));
  return body + 'END:VCALENDAR\r\n';
}
function downloadICS() {
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([buildICS()], { type: 'text/calendar' }));
  a.download = 'UHOK-2026.ics';
  document.body.appendChild(a); a.click(); a.remove();
}

/* ---------- Hakem kurulu araması (Türkçe karakter duyarlı) ---------- */
function wireSearch() {
  const fold = s => s.toLocaleLowerCase('tr').normalize('NFC');
  $('#ref-search')?.addEventListener('input', e => {
    const q = fold(e.target.value.trim());
    let n = 0;
    $$('#ref-list .person').forEach(p => { const hit = p.dataset.q.includes(q); p.style.display = hit ? '' : 'none'; n += hit; });
    const out = $('#ref-result');
    if (out) out.textContent = q ? T(`${n} sonuç`, `${n} results`) : '';
  });
}

/* ---------- Formlar ---------- */
const words = t => (t.trim().match(/\S+/g) || []).length;
const keywords = t => t.split(/[,;]/).map(s => s.trim()).filter(Boolean).length;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
function fieldError(el) {
  const v = el.value.trim();
  if (el.required && !v) return T('Bu alan zorunludur.', 'This field is required.');
  if (!v) return '';
  if (el.type === 'email' && !EMAIL_RE.test(v)) return T('Geçerli bir e-posta adresi girin (ör. ad@kurum.edu.tr).', 'Enter a valid e-mail address (e.g. name@university.edu).');
  if (el.dataset.words !== undefined) { const n = words(v); if (n < 100 || n > 350) return T(`Özet 100–350 kelime olmalıdır (şu an ${n}).`, `The abstract must be 100–350 words (currently ${n}).`); }
  if (el.dataset.keywords !== undefined) { const n = keywords(v); if (n < 3 || n > 5) return T(`3–5 anahtar kelime girin, virgülle ayırın (şu an ${n}).`, `Enter 3–5 keywords separated by commas (currently ${n}).`); }
  return '';
}
function validateField(el) {
  const msg = fieldError(el);
  let box = el.parentElement.querySelector('.field-err');
  if (!box) { box = document.createElement('div'); box.className = 'field-err'; box.id = el.form.id + '-' + el.name + '-err'; el.parentElement.appendChild(box); }
  box.textContent = msg;
  el.setAttribute('aria-invalid', msg ? 'true' : 'false');
  if (msg) el.setAttribute('aria-describedby', box.id); else el.removeAttribute('aria-describedby');
  return !msg;
}
function wireCounters() {
  $$('textarea[data-words]').forEach(ta => {
    if (ta.dataset.wired) return; ta.dataset.wired = '1';
    const c = ta.parentElement.querySelector('.counter');
    const upd = () => {
      const n = words(ta.value), ok = n >= 100 && n <= 350;
      c.className = 'counter ' + (n === 0 ? '' : ok ? 'ok' : 'bad');
      c.textContent = T(`${n} kelime · 100–350 arası olmalı`, `${n} words · must be 100–350`);
    };
    ta.addEventListener('input', upd); upd();
  });
}
// Taslak: girilen bilgiler bu cihazda saklanır, sayfa yenilense de kaybolmaz
function draft(form) {
  const key = 'uhok-draft-' + form.id;
  try {
    const saved = JSON.parse(localStorage.getItem(key) || '{}');
    Object.entries(saved).forEach(([n, v]) => { if (form.elements[n] && v) form.elements[n].value = v; });
  } catch (e) {}
  form.addEventListener('input', () => {
    try { localStorage.setItem(key, JSON.stringify(Object.fromEntries([...form.elements].filter(x => x.name).map(x => [x.name, x.value])))); } catch (e) {}
  });
  form.querySelector('[data-clear]')?.addEventListener('click', () => {
    form.reset(); try { localStorage.removeItem(key); } catch (e) {}
    $$('.field-err', form).forEach(e => { e.textContent = ''; }); $$('[aria-invalid]', form).forEach(e => e.removeAttribute('aria-invalid'));
    form.querySelector('.form-msg').style.display = 'none';
    $$('textarea[data-words]', form).forEach(ta => ta.dispatchEvent(new Event('input')));
  });
}
function sendMail(form, subject, lines) {
  const msg = form.querySelector('.form-msg');
  const text = lines.join('\n');
  const body = text.length > 1800
    ? T('Başvuru metni panoya kopyalandı; lütfen buraya yapıştırınız.\n\n', 'The submission text was copied to the clipboard; please paste it here.\n\n') + text.slice(0, 1200) + '…'
    : text;
  try { navigator.clipboard?.writeText(text).catch(() => {}); } catch (e) {}
  msg.className = 'form-msg'; msg.style.display = 'block';
  msg.innerHTML = T(
    `E-posta uygulamanız açılıyor. Açılmazsa aşağıdaki düğmeyle metni kopyalayıp <a href="mailto:${esc(DATA.contact.email)}">${esc(DATA.contact.email)}</a> adresine gönderebilirsiniz. Bilgileriniz bu formda kalmaya devam eder.`,
    `Your e-mail app is opening. If it does not, copy the text with the button below and send it to <a href="mailto:${esc(DATA.contact.email)}">${esc(DATA.contact.email)}</a>. Your entries stay in this form.`) +
    `<br><button type="button" class="btn ghost copy-btn">${T('Metni kopyala', 'Copy text')}</button>`;
  msg.querySelector('.copy-btn').addEventListener('click', ev => {
    const b = ev.currentTarget;
    const done = () => { b.textContent = T('Kopyalandı', 'Copied'); };
    if (navigator.clipboard) navigator.clipboard.writeText(text).then(done, () => fallbackCopy(text, done)); else fallbackCopy(text, done);
  });
  location.href = `mailto:${DATA.contact.email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
}
function fallbackCopy(text, done) {
  const ta = document.createElement('textarea'); ta.value = text; ta.style.position = 'fixed'; ta.style.opacity = '0';
  document.body.appendChild(ta); ta.select(); try { document.execCommand('copy'); done(); } catch (e) {} ta.remove();
}
function wireForm(form, build) {
  form.setAttribute('novalidate', '');
  const fields = $$('input, textarea, select', form).filter(x => x.name);
  fields.forEach(el => {
    el.addEventListener('blur', () => { if (el.value.trim() || el.dataset.touched) validateField(el); el.dataset.touched = 1; });
    el.addEventListener('input', () => { if (el.getAttribute('aria-invalid') === 'true') validateField(el); });
  });
  form.addEventListener('submit', e => {
    e.preventDefault();
    const bad = fields.filter(el => !validateField(el));
    const msg = form.querySelector('.form-msg');
    if (bad.length) {
      msg.className = 'form-msg err'; msg.style.display = 'block';
      msg.textContent = T(`Lütfen işaretli ${bad.length} alanı düzeltin.`, `Please correct the ${bad.length} highlighted field(s).`);
      bad[0].focus();
      return;
    }
    const v = n => form.elements[n].value.trim();
    build(v);
  });
  draft(form);
}
function wireForms() {
  wireForm($('#abstract-form'), v => sendMail($('#abstract-form'), `UHOK 2026 – Bildiri Özeti / Abstract – ${v('name')}`, [
    `Ad Soyad / Name: ${v('name')}`, `Unvan / Title: ${v('title') || '-'}`, `Kurum / Institution: ${v('inst')}`,
    `E-posta / E-mail: ${v('mail')}`, `Telefon / Phone: ${v('phone') || '-'}`,
    `Katılım türü / Type: ${v('type')}`, `Alt tema / Sub-theme: ${v('theme')}`, '',
    `Başlık (TR): ${v('t_tr')}`, `Title (EN): ${v('t_en')}`, '',
    `ÖZET (TR):\n${v('abs_tr')}`, `Anahtar kelimeler: ${v('kw_tr')}`, '',
    `ABSTRACT (EN):\n${v('abs_en')}`, `Keywords: ${v('kw_en')}`,
  ]));
  wireForm($('#reg-form'), v => sendMail($('#reg-form'), `UHOK 2026 – Kayıt / Registration – ${v('name')}`, [
    `Ad Soyad / Name: ${v('name')}`, `Unvan / Title: ${v('title') || '-'}`, `Kurum / Institution: ${v('inst')}`,
    `Ülke / Country: ${v('country') || '-'}`, `E-posta / E-mail: ${v('mail')}`, `Telefon / Phone: ${v('phone') || '-'}`,
    `Katılım şekli / Participation: ${v('type')}`, `Bildiri başlığı / Paper title: ${v('paper') || '-'}`,
    `Gezi programı / Excursion: ${v('trip')}`, `Not / Note: ${v('note') || '-'}`,
  ]));
}

/* ---------- Galeri: büyütme, ok tuşları, ESC ---------- */
function wireGallery() {
  const lb = $('.lightbox'), img = $('img', lb), links = $$('.gallery a');
  let idx = 0, opener;
  const show = i => { idx = (i + links.length) % links.length; img.src = links[idx].href; img.alt = links[idx].querySelector('img').alt; $('.lb-count', lb).textContent = `${idx + 1} / ${links.length}`; };
  const close = () => { lb.classList.remove('on'); lb.setAttribute('aria-hidden', 'true'); opener?.focus(); };
  links.forEach((a, i) => a.addEventListener('click', e => { e.preventDefault(); opener = a; show(i); lb.classList.add('on'); lb.setAttribute('aria-hidden', 'false'); $('.lb-close', lb).focus(); }));
  $('.lb-close', lb).addEventListener('click', close);
  $('.lb-prev', lb).addEventListener('click', e => { e.stopPropagation(); show(idx - 1); });
  $('.lb-next', lb).addEventListener('click', e => { e.stopPropagation(); show(idx + 1); });
  lb.addEventListener('click', e => { if (e.target === lb) close(); });
  document.addEventListener('keydown', e => {
    if (!lb.classList.contains('on')) return;
    if (e.key === 'Escape') close();
    else if (e.key === 'ArrowRight') show(idx + 1);
    else if (e.key === 'ArrowLeft') show(idx - 1);
    else if (e.key === 'Tab') { // odak pencere içinde kalsın
      const f = $$('button', lb); const first = f[0], last = f[f.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    }
  });
}

/* ---------- Klavye: ESC menüleri kapatır ---------- */
function wireKeyboard() {
  document.addEventListener('keydown', e => {
    if (e.key !== 'Escape' || $('.lightbox.on')) return;
    const dd = document.activeElement?.closest('.dd');
    if (dd) { dd.classList.add('closed'); dd.querySelector(':scope > a').focus(); }
    if ($('nav.main.open')) { closeMenu(); $('.burger').focus(); }
  });
  // Fareyle tıklanınca menü açık kalmasın: odağı bırak ve menüyü kapat
  $$('.dd a').forEach(a => a.addEventListener('click', () => {
    const dd = a.closest('.dd'); a.blur(); dd.classList.add('closed');
  }));
  $$('.dd').forEach(dd => {
    dd.addEventListener('mouseleave', () => dd.classList.remove('closed'));
    dd.addEventListener('focusout', e => { if (!dd.contains(e.relatedTarget)) dd.classList.remove('closed'); });
  });
}

/* ---------- Yukarı çık düğmesi: footer görünürken gizlenir ---------- */
function wireToTop() {
  const tt = $('.to-top'); let footerVisible = false;
  const upd = () => tt.classList.toggle('on', scrollY > 600 && !footerVisible);
  if ('IntersectionObserver' in window) new IntersectionObserver(es => { footerVisible = es[0].isIntersecting; upd(); }).observe($('footer.site'));
  addEventListener('scroll', upd, { passive: true });
  tt.addEventListener('click', () => { scrollTo({ top: 0, behavior: 'smooth' }); $('.brand').focus({ preventScroll: true }); });
}

/* ---------- Footer: mobilde akordeon ---------- */
function footerAccordion() {
  const mq = matchMedia('(max-width: 700px)');
  const set = () => $$('details.fcol').forEach(d => { d.open = !mq.matches; });
  set();
  mq.addEventListener ? mq.addEventListener('change', set) : mq.addListener(set);
  $$('details.fcol summary').forEach(s => s.addEventListener('click', e => { if (!mq.matches) e.preventDefault(); }));
}

/* ---------- Kaydırınca beliren bloklar ---------- */
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
  addEventListener('hashchange', () => setTimeout(markReveal, 30));
}
function markReveal() {
  if (!revealObs) return;
  $$('.page.show .section-title, .page.show .card, .page.show .person, .page.show .timeline li, .page.show .gallery a, .page.show details.acc, .page.show .callout, .page.show .tl, .page.show .gallery-strip, .page.show .prose')
    .forEach((el, i) => {
      if (el.classList.contains('reveal')) return;
      if (el.getBoundingClientRect().top < innerHeight) return;
      el.classList.add('reveal');
      el.style.transitionDelay = (i % 4) * 60 + 'ms';
      revealObs.observe(el);
    });
}

/* ---------- Başlangıç ---------- */
document.addEventListener('DOMContentLoaded', () => {
  wireCounters();
  let l = new URLSearchParams(location.search).get('lang');
  if (!l) { try { l = localStorage.getItem('uhok-lang'); } catch (e) {} }
  setLang(l === 'en' ? 'en' : 'tr');
  $$('.lang button').forEach(b => b.addEventListener('click', () => setLang(b.dataset.l, true)));
  $('.burger').addEventListener('click', () => {
    const open = $('nav.main').classList.toggle('open');
    $('.burger').setAttribute('aria-expanded', open);
  });
  $$('[data-ics]').forEach(b => b.addEventListener('click', downloadICS));
  wireSearch(); wireForms(); wireGallery(); wireKeyboard(); wireToTop();
  route(); addEventListener('hashchange', route);
  setInterval(updateCountdown, 1000);
  $('#year').textContent = new Date().getFullYear();
  initReveal();
  footerAccordion();
});
