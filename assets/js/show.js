/* =========================================================
   ŞOV KATMANI — halay ekibi, ritim haritası (davul sesli),
   kilim perdeli sekme geçişi, sayaçlar, parallax
   ========================================================= */
(() => {
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;
const NS = 'http://www.w3.org/2000/svg';
const C = { red: '#a8232b', indigo: '#1f3c88', saffron: '#d79a2b', cream: '#f4ece0', ink: '#1c2541' };

/* ---------- Oyunlar ve usulleri ---------- */
// p: sekizlik (ya da onaltılık) zamanlara göre davul deseni. D = düm, T = tek, K = kaşık, . = es
const DANCES = [
  { id: 'karsilama', lon: 26.8, lat: 41.45, name: 'Karşılama', nameEn: 'Karşılama',
    reg: 'Trakya · Edirne, Kırklareli', regEn: 'Thrace · Edirne, Kırklareli',
    meter: '9/8', groups: [2, 2, 2, 3], p: 'D.T.D.TT.', ms: 175,
    tr: 'Karşılıklı oynanan, 9/8’lik aksak ritmiyle tanınan neşeli Rumeli oyunu. Düğünlerde ve şenliklerde meydanı doldurur.',
    en: 'A cheerful Rumelian dance performed face to face, known for its asymmetric 9/8 rhythm. It fills the square at weddings and festivals.' },
  { id: 'zeybek', lon: 27.9, lat: 38.05, name: 'Zeybek', nameEn: 'Zeybek',
    reg: 'Ege · İzmir, Aydın, Muğla', regEn: 'Aegean · İzmir, Aydın, Muğla',
    meter: '9/8', groups: [2, 2, 2, 3], p: 'D.T.T.D.T', ms: 330,
    tr: 'Efelerin ağır, vakur ve gösterişli oyunu. Kartal kanadı gibi açılan kollar ve yere çöküşlerle yiğitliği anlatır.',
    en: 'The slow, dignified and striking dance of the efe. Arms spread like an eagle’s wings and kneeling figures express valour.' },
  { id: 'teke', lon: 30.3, lat: 37.55, name: 'Teke', nameEn: 'Teke',
    reg: 'Göller Yöresi · Burdur, Isparta, Antalya', regEn: 'Lakes Region · Burdur, Isparta, Antalya',
    meter: '9/8', groups: [2, 2, 2, 3], p: 'D.T.T.DTT', ms: 160,
    tr: 'Tekenin sıçrayışlarını andıran çevik ve hızlı oyunlar. “Teke zortlatması” bu yörenin en bilinen örneğidir.',
    en: 'Agile, fast dances that echo the leaps of a mountain goat. “Teke zortlatması” is the best known example from the region.' },
  { id: 'kasik', lon: 32.7, lat: 37.55, name: 'Kaşık Oyunları', nameEn: 'Spoon Dances',
    reg: 'Konya, Silifke ve çevresi', regEn: 'Konya, Silifke and surroundings',
    meter: '9/8', groups: [2, 2, 2, 3], p: 'DKTKDKTKK', ms: 165,
    tr: 'Oyuncular ellerindeki tahta kaşıkları birbirine vurarak ritmi kendileri tutar. Kaşık sesi oyunun bir parçasıdır.',
    en: 'Dancers keep the rhythm themselves by clicking wooden spoons together. The sound of the spoons is part of the dance.' },
  { id: 'halay', lon: 39.0, lat: 38.7, name: 'Halay', nameEn: 'Halay',
    reg: 'Doğu, Güneydoğu ve Orta Anadolu', regEn: 'Eastern, Southeastern and Central Anatolia',
    meter: '2/4', groups: [2, 2, 2, 2], p: 'D.TTD.T.', ms: 190,
    tr: 'Davul-zurna eşliğinde el ele, omuz omuza oynanan toplu oyun. Mendil sallayan halaybaşı ekibi yönetir.',
    en: 'A group dance performed hand in hand, shoulder to shoulder, to drum and zurna. The leader waving a handkerchief guides the line.' },
  { id: 'horon', lon: 39.8, lat: 40.85, name: 'Horon', nameEn: 'Horon',
    reg: 'Karadeniz · Trabzon, Rize, Artvin', regEn: 'Black Sea · Trabzon, Rize, Artvin',
    meter: '7/16', groups: [2, 2, 3], p: 'DTDTDTT', ms: 105,
    tr: 'Kemençe eşliğinde, omuz omuza dizilen oyuncuların titreme hareketleriyle oynadığı hızlı ve coşkulu oyun.',
    en: 'A fast, exuberant dance in which dancers lined up shoulder to shoulder shimmy to the kemençe.' },
  { id: 'bar', lon: 41.3, lat: 39.95, name: 'Bar', nameEn: 'Bar',
    reg: 'Kuzeydoğu Anadolu · Erzurum, Bayburt', regEn: 'Northeastern Anatolia · Erzurum, Bayburt',
    meter: '2/4', groups: [2, 2, 2, 2], p: 'D.T.DDT.', ms: 230,
    tr: 'Açık alanda yan yana dizilerek oynanan toplu oyunlar. Ağır ve yürük bölümleriyle birlik ve yiğitliği yansıtır.',
    en: 'Group dances performed side by side in the open air. Their slow and lively sections reflect unity and courage.' },
  { id: 'kafkas', lon: 43.0, lat: 40.55, name: 'Kafkas', nameEn: 'Caucasian Dances',
    reg: 'Kars, Ardahan', regEn: 'Kars, Ardahan',
    meter: '6/8', groups: [3, 3], p: 'D.TDTT', ms: 135,
    tr: 'Parmak uçlarında yapılan hızlı figürleri, dik duruşu ve kılıç-kalkan gösterileriyle dikkat çeken oyunlar.',
    en: 'Dances that stand out with fast figures on tiptoe, upright posture and sword-and-shield displays.' },
];

/* ---------- Davul sesi (Web Audio) ---------- */
let ctx, master, noiseBuf;
function audio() {
  if (ctx) return ctx;
  ctx = new (window.AudioContext || window.webkitAudioContext)();
  master = ctx.createGain(); master.gain.value = .8;
  const comp = ctx.createDynamicsCompressor(); master.connect(comp); comp.connect(ctx.destination);
  noiseBuf = ctx.createBuffer(1, ctx.sampleRate * .5, ctx.sampleRate);
  const d = noiseBuf.getChannelData(0); for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  return ctx;
}
function noise(t, dur, type, freq, q, vol) {
  const s = ctx.createBufferSource(); s.buffer = noiseBuf;
  const f = ctx.createBiquadFilter(); f.type = type; f.frequency.value = freq; f.Q.value = q;
  const g = ctx.createGain(); g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(.001, t + dur);
  s.connect(f); f.connect(g); g.connect(master); s.start(t); s.stop(t + dur + .02);
}
function dum(t) { // davulun tokmak tarafı
  const o = ctx.createOscillator(), g = ctx.createGain();
  o.type = 'sine'; o.frequency.setValueAtTime(120, t); o.frequency.exponentialRampToValueAtTime(48, t + .18);
  g.gain.setValueAtTime(1.1, t); g.gain.exponentialRampToValueAtTime(.001, t + .45);
  o.connect(g); g.connect(master); o.start(t); o.stop(t + .5);
  noise(t, .08, 'lowpass', 900, .7, .5);
}
function tek(t) { // çubuk tarafı
  noise(t, .07, 'bandpass', 2600, 1.2, .7);
  const o = ctx.createOscillator(), g = ctx.createGain();
  o.type = 'triangle'; o.frequency.setValueAtTime(420, t); o.frequency.exponentialRampToValueAtTime(260, t + .05);
  g.gain.setValueAtTime(.35, t); g.gain.exponentialRampToValueAtTime(.001, t + .08);
  o.connect(g); g.connect(master); o.start(t); o.stop(t + .1);
}
function kasik(t) { // tahta kaşık
  noise(t, .03, 'highpass', 3500, .8, .55);
  noise(t + .03, .03, 'highpass', 4200, .8, .4);
}

/* ---------- Ritim çalar ---------- */
let current = DANCES[4], playing = false, timer, slot = 0, nextT = 0;
function setBeat(ms) { document.documentElement.style.setProperty('--beat', ms ? (ms * 2 / 1000) + 's' : '.6s'); }
function tickSched() {
  while (nextT < ctx.currentTime + .12) {
    const ch = current.p[slot % current.p.length];
    if (ch === 'D') dum(nextT); else if (ch === 'T') tek(nextT); else if (ch === 'K') kasik(nextT);
    const s = slot % current.p.length, delay = Math.max(0, (nextT - ctx.currentTime) * 1000);
    setTimeout(() => lightBeat(s), delay);
    nextT += current.ms / 1000; slot++;
  }
}
function lightBeat(i) {
  $$('.beats .b').forEach((b, k) => b.classList.toggle('now', k === i));
}
function play() {
  audio(); if (ctx.state === 'suspended') ctx.resume();
  playing = true; slot = 0; nextT = ctx.currentTime + .06;
  clearInterval(timer); timer = setInterval(tickSched, 25); tickSched();
  setBeat(current.ms); updatePlayBtn();
}
function stop() {
  playing = false; clearInterval(timer); lightBeat(-1); setBeat(0); updatePlayBtn();
}
function updatePlayBtn() {
  const b = $('#play'); if (!b) return;
  b.classList.toggle('on', playing);
  b.setAttribute('aria-pressed', playing);
}

/* ---------- Kart ---------- */
function renderCard(d, animate) {
  const card = $('#dance-card'); if (!card) return;
  let k = 0;
  const beats = d.groups.map(n => `<div class="g">${Array.from({ length: n }, () => {
    const ch = d.p[k++]; return `<div class="b ${ch === '.' ? '' : ch}">${ch === 'D' ? 'DÜM' : ch === 'T' ? 'TEK' : ch === 'K' ? '✦' : ''}</div>`;
  }).join('')}</div>`).join('');
  card.querySelector('.reg').innerHTML = `<span lang="tr">${d.reg}</span><span lang="en">${d.regEn}</span>`;
  card.querySelector('h3').innerHTML = `<span lang="tr">${d.name}</span><span lang="en">${d.nameEn}</span>`;
  card.querySelector('p').innerHTML = `<span lang="tr">${d.tr}</span><span lang="en">${d.en}</span>`;
  card.querySelector('.meter').textContent = d.meter;
  card.querySelector('.grp').innerHTML = d.meter === '2/4' ? '<span lang="tr">düz usul</span><span lang="en">even metre</span>' : '<span lang="tr">aksak · </span><span lang="en">asymmetric · </span>' + d.groups.join(' + ');
  card.querySelector('.beats').innerHTML = beats;
  if (animate && !calm) { card.classList.remove('swap'); void card.offsetWidth; card.classList.add('swap'); }
  $$('.map-wrap .hot').forEach(h => h.classList.toggle('on', h.dataset.id === d.id));
  $$('.dance-list button').forEach(b => b.classList.toggle('on', b.dataset.id === d.id));
  paintMap(d.id);
}
function select(id) {
  const d = DANCES.find(x => x.id === id); if (!d || d === current && $('#dance-card .beats').children.length) return;
  current = d; slot = 0;
  renderCard(d, true);
  if (playing) { setBeat(d.ms); nextT = ctx.currentTime + .05; }
}

/* ---------- Noktalı Türkiye haritası ---------- */
// Yaklaşık kıyı/sınır hattı (boylam, enlem) — süsleme amaçlı, ölçekli harita değildir
const OUTLINE = [[26.05,41.75],[26.6,41.98],[27.5,42.0],[28.0,41.95],[28.9,41.35],[29.1,41.22],[30.2,41.18],[31.3,41.25],[32.3,41.73],[33.3,42.0],[34.2,41.97],[35.0,42.08],[35.3,41.72],[36.1,41.68],[36.6,41.33],[37.4,41.12],[38.3,40.95],[39.5,41.05],[40.3,40.95],[41.4,41.42],[41.6,41.52],[42.5,41.48],[43.2,41.25],[43.65,40.95],[43.7,40.55],[43.55,40.25],[44.3,40.05],[44.75,39.75],[44.45,39.4],[44.2,38.95],[44.45,38.4],[44.25,37.95],[44.8,37.25],[44.25,37.15],[43.4,37.32],[42.4,37.15],[41.3,37.08],[40.2,36.85],[39.0,36.7],[38.1,36.85],[37.1,36.65],[36.65,36.83],[36.6,36.25],[36.2,35.83],[35.85,35.98],[36.15,36.55],[35.6,36.6],[34.8,36.78],[34.0,36.28],[33.1,36.1],[32.4,36.15],[31.4,36.75],[30.6,36.85],[30.45,36.3],[29.6,36.17],[29.0,36.62],[28.2,36.7],[27.4,36.98],[27.25,37.4],[27.15,37.8],[26.35,38.2],[26.75,38.45],[26.9,38.95],[26.65,39.3],[26.1,39.5],[26.2,40.05],[26.7,40.4],[27.5,40.35],[28.9,40.4],[29.4,40.75],[29.0,41.05],[28.1,41.05],[27.2,40.95],[26.55,40.45],[26.2,40.6],[26.05,40.75],[26.6,41.2],[26.35,41.7]];
const MARMARA = [[27.6,40.45],[28.8,40.45],[29.2,40.72],[28.6,40.95],[27.5,40.9],[27.1,40.62]];
const K = 52, COS = Math.cos(39 * Math.PI / 180), LON0 = 25.7, LAT0 = 42.3;
const proj = (lon, lat) => [(lon - LON0) * COS * K, (LAT0 - lat) * K];
const inPoly = (x, y, poly) => { let c = false; for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) { const [xi, yi] = poly[i], [xj, yj] = poly[j]; if ((yi > y) !== (yj > y) && x < (xj - xi) * (y - yi) / (yj - yi) + xi) c = !c; } return c; };
let dots = [];
function buildMap() {
  const wrap = $('.map-wrap'); if (!wrap) return;
  const P = OUTLINE.map(p => proj(...p)), M = MARMARA.map(p => proj(...p));
  const W = (44.9 - LON0) * COS * K, H = (LAT0 - 35.75) * K, step = 11;
  const svg = document.createElementNS(NS, 'svg');
  svg.setAttribute('viewBox', `-10 -10 ${W + 20} ${H + 20}`);
  svg.setAttribute('role', 'img');
  svg.setAttribute('aria-label', 'Türkiye halk oyunları ritim haritası');
  const gd = document.createElementNS(NS, 'g');
  const hots = DANCES.map(d => ({ d, xy: proj(d.lon, d.lat) }));
  for (let y = 0; y < H; y += step) for (let x = (y / step) % 2 ? step / 2 : 0; x < W; x += step) {
    if (!inPoly(x, y, P) || inPoly(x, y, M)) continue;
    let best = null, bd = 1e9;
    hots.forEach(h => { const dd = Math.hypot(h.xy[0] - x, h.xy[1] - y); if (dd < bd) { bd = dd; best = h.d.id; } });
    const c = document.createElementNS(NS, 'circle');
    c.setAttribute('cx', x.toFixed(1)); c.setAttribute('cy', y.toFixed(1)); c.setAttribute('r', 3.1);
    c.setAttribute('class', 'dot');
    gd.appendChild(c); dots.push({ el: c, id: best, dist: bd, x, y });
  }
  svg.appendChild(gd);
  hots.forEach(({ d, xy: [x, y] }) => {
    const g = document.createElementNS(NS, 'g');
    g.setAttribute('class', 'hot'); g.setAttribute('tabindex', '0'); g.setAttribute('role', 'button');
    g.setAttribute('aria-label', d.name); g.dataset.id = d.id;
    const above = ['karsilama', 'horon', 'kafkas', 'teke'].includes(d.id);
    g.innerHTML = `<circle class="ring" cx="${x}" cy="${y}" r="9"/><circle class="core" cx="${x}" cy="${y}" r="7"/><text x="${x}" y="${above ? y - 15 : y + 24}" data-above="${above ? 1 : 0}" text-anchor="middle">${(d.id === 'kasik' ? 'Kaşık' : d.name).toLocaleUpperCase('tr')}</text>`;
    g.addEventListener('click', () => { select(d.id); if (!playing) play(); });
    g.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); select(d.id); if (!playing) play(); } });
    svg.appendChild(g);
  });
  wrap.prepend(svg);
}
function paintMap(id) {
  const h = DANCES.find(d => d.id === id), [hx, hy] = proj(h.lon, h.lat);
  dots.forEach(o => {
    const k = Math.max(0, 1 - Math.hypot(o.x - hx, o.y - hy) / 95); // yörenin etrafında yumuşak ışıltı
    o.el.style.fill = k > 0 ? (k > .45 ? C.saffron : '#b9883f') : '#3a4a7a';
    o.el.style.opacity = (.5 + k * .5).toFixed(2);
    o.el.setAttribute('r', (3 + k * 1.2).toFixed(2));
  });
}
/* ---------- Halay ekibi ---------- */
function figure(i, leader, color) {
  const arm = 'stroke="' + C.ink + '" stroke-width="3.4" stroke-linecap="round" fill="none"';
  const rightArm = leader
    ? `<path d="M38 30 L52 8" ${arm}/><g class="mendil"><path d="M52 6 Q62 -4 70 4 Q63 9 60 18 Q57 10 52 6Z" fill="${C.red}"/></g>`
    : `<path d="M38 30 L60 47" ${arm}/>`;
  return `<svg viewBox="0 0 60 112" aria-hidden="true"><g class="body">
    <path d="M22 30 L0 47" ${arm}/>${rightArm}
    <g class="legL"><path d="M25 60 L23 97 L16 99" stroke="${C.ink}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" fill="none"/></g>
    <g class="legR"><path d="M35 60 L37 97 L44 99" stroke="${C.ink}" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" fill="none"/></g>
    <path d="M21 25 Q30 20 39 25 L43 64 L17 64Z" fill="${color}"/>
    <path d="M17 64 L43 64 L42.4 59 L17.6 59Z" fill="${C.ink}" opacity=".35"/>
    <rect x="19.5" y="40" width="21" height="5" fill="${C.cream}"/>
    <path d="M30 38.5 33.5 42.5 30 46.5 26.5 42.5Z" fill="${color === C.saffron ? C.red : C.saffron}"/>
    <rect x="27.5" y="16" width="5" height="7" fill="${C.ink}"/>
    <path d="M30 2 37 10 30 18 23 10Z" fill="${C.ink}"/>
    <path d="M30 6.5 33 10 30 13.5 27 10Z" fill="${C.cream}"/>
  </g></svg>`;
}
function buildHalay() {
  const host = $('.halay'); if (!host) return;
  const w = Math.min(window.innerWidth, 1600), fw = window.innerWidth < 700 ? 46 : 58;
  const n = Math.max(5, Math.min(24, Math.floor((w - 70) / fw)));
  const colors = [C.red, C.indigo, C.saffron];
  host.innerHTML = `<div class="line">${Array.from({ length: n }, (_, i) => figure(i, i === n - 1, colors[i % 3])).join('')}</div>`;
}

/* ---------- Sayaçlar ---------- */
function countUp() {
  const els = $$('.stats [data-count]'); if (!els.length) return;
  const run = el => {
    const to = +el.dataset.count, suf = el.dataset.suffix || '';
    if (calm) { el.textContent = to + suf; return; }
    const t0 = performance.now(), dur = 1400;
    const f = now => { const k = Math.min(1, (now - t0) / dur), e = 1 - Math.pow(1 - k, 3); el.textContent = Math.round(to * e) + suf; if (k < 1) requestAnimationFrame(f); };
    requestAnimationFrame(f);
  };
  if (!('IntersectionObserver' in window)) return els.forEach(run);
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { run(e.target); io.unobserve(e.target); } }), { threshold: .5 });
  els.forEach(el => io.observe(el));
}

/* ---------- Kilim perdesi ile sekme geçişi ---------- */
function curtain() {
  const cur = document.createElement('div');
  cur.className = 'curtain'; cur.setAttribute('aria-hidden', 'true');
  cur.innerHTML = '<i></i><i></i><i></i><i></i><i></i><div class="logo"></div>';
  document.body.appendChild(cur);
  let busy = false;
  document.addEventListener('click', e => {
    const a = e.target.closest('a[href^="#"]'); if (!a || calm || busy) return;
    const target = a.getAttribute('href').slice(1).split('/')[0];
    const curPage = ($('.page.show') || {}).id;
    if (!target || !$('#p-' + target) || 'p-' + target === curPage) return;
    e.preventDefault(); busy = true;
    cur.classList.remove('out'); cur.classList.add('in');
    setTimeout(() => {
      location.hash = a.getAttribute('href');
      setTimeout(() => { cur.classList.remove('in'); cur.classList.add('out'); }, 120);
      setTimeout(() => { cur.classList.remove('out'); busy = false; }, 700);
    }, 470);
  }, true);
}

/* ---------- Küçük dokunuşlar ---------- */
function progress() {
  const bar = document.createElement('div'); bar.className = 'scroll-progress'; document.body.appendChild(bar);
  const upd = () => { const h = document.documentElement.scrollHeight - innerHeight; bar.style.transform = `scaleX(${h > 0 ? scrollY / h : 0})`; };
  addEventListener('scroll', upd, { passive: true }); addEventListener('hashchange', () => setTimeout(upd, 50)); upd();
}
function parallax() {
  const hero = $('.hero'); if (!hero || calm || !matchMedia('(hover: hover)').matches) return;
  const art = $('.hero-art'), mq = $('.hero-marquee');
  hero.addEventListener('mousemove', e => {
    const r = hero.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
    art.style.transform = `translate(${x * -18}px, ${y * -12}px)`;
    if (mq) mq.style.marginLeft = `${x * 40}px`;
  });
  hero.addEventListener('mouseleave', () => { art.style.transform = ''; if (mq) mq.style.marginLeft = ''; });
  art.style.transition = 'transform .4s ease-out';
}
function tilt() {
  if (calm || !matchMedia('(hover: hover)').matches) return;
  $$('.sub-theme, .dance-card').forEach(c => {
    c.classList.add('tilt');
    c.addEventListener('mousemove', e => {
      const r = c.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
      c.style.transform = `perspective(900px) rotateY(${x * 6}deg) rotateX(${y * -6}deg) translateY(-4px)`;
    });
    c.addEventListener('mouseleave', () => { c.style.transform = ''; });
  });
}

document.addEventListener('DOMContentLoaded', () => {
  buildHalay(); buildMap(); renderCard(current, false);
  $('#play')?.addEventListener('click', () => playing ? stop() : play());
  const list = $('.dance-list');
  if (list) {
    list.innerHTML = DANCES.map(d => `<button type="button" data-id="${d.id}"><span lang="tr">${d.name}</span><span lang="en">${d.nameEn}</span></button>`).join('');
    list.addEventListener('click', e => { const b = e.target.closest('button'); if (b) select(b.dataset.id); });
  }
  $$('.lang button').forEach(b => b.addEventListener('click', () => renderCard(current, false)));
  countUp(); curtain(); progress(); parallax(); tilt();
  addEventListener('hashchange', () => { if (playing && !$('#p-anasayfa').classList.contains('show')) stop(); });
  document.addEventListener('visibilitychange', () => { if (document.hidden && playing) stop(); });
  let rw; addEventListener('resize', () => { clearTimeout(rw); rw = setTimeout(buildHalay, 200); });
});
})();
