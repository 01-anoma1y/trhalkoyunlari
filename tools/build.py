#!/usr/bin/env python3
"""content/site.json içeriğini index.html'e yazar.

Kullanım:  python3 tools/build.py          (yazar)
           python3 tools/build.py --check  (yalnızca denetler, dosyayı değiştirmez)

- data-bind="..."    öğelerinin metnini doldurur (e-posta, site, tarihler)
- data-render="..."  kapsayıcılarına kurullar, zaman çizelgesi ve programı yazar
- <script id="site-data"> içine veriyi koyar (assets/js/main.js buradan okur)
- canonical / hreflang / og:url / og:image etiketlerini baseUrl'e göre üretir
Böylece sayfa JavaScript çalışmadan da (arama motorları, önizlemeler) eksiksiz okunur.
"""
import datetime, html, json, re, sys
from html.parser import HTMLParser
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
DATA = json.loads((ROOT / 'content/site.json').read_text(encoding='utf-8'))
PAGE = ROOT / 'index.html'
D = DATA['dates']

MONTHS = {'tr': 'Ocak Şubat Mart Nisan Mayıs Haziran Temmuz Ağustos Eylül Ekim Kasım Aralık'.split(),
          'en': 'January February March April May June July August September October November December'.split()}
DAYS = {'tr': 'Pazartesi Salı Çarşamba Perşembe Cuma Cumartesi Pazar'.split(),
        'en': 'Monday Tuesday Wednesday Thursday Friday Saturday Sunday'.split()}

def iso(k): return D.get(k, k)
def dt(k): return datetime.date.fromisoformat(iso(k))
def daymonth(k, l): d = dt(k); return f'{d.day} {MONTHS[l][d.month - 1]}'
def weekday(k, l): return DAYS[l][dt(k).weekday()]
FMT = {
    'date': lambda a, l: f'{daymonth(a, l)} {dt(a).year}',
    'daymonth': daymonth,
    'dmy': lambda a, l: dt(a).strftime('%d.%m.%Y'),
    'weekday': weekday,
    'weekrange': lambda a, l: ' – '.join(weekday(k, l) for k in a.split(',')),
    'range': lambda a, l: (lambda x, y: f'{x.day}–{y.day} {MONTHS[l][y.month-1]} {y.year}' if x.month == y.month
                           else f'{x.day} {MONTHS[l][x.month-1]} – {y.day} {MONTHS[l][y.month-1]} {y.year}')(*[dt(k) for k in a.split(',')]),
    'count': lambda a, l: str(len(DATA['committees'][a])),
    'days': lambda a, l: '',  # kalan gün tarayıcıda hesaplanır
}
e = lambda s: html.escape(str(s), quote=True)

def initials(name):
    p = re.sub(r'(Prof\.|Dr\.|Doç\.|Öğr\.|Gör\.|Üy\.|Üyesi|Arş\.)', '', name).split()
    return (p[0][0] + (p[-1][0] if p else '')).upper()

def person(p):
    pres = '<span lang="tr">Başkan</span><span lang="en">President</span> · ' if p.get('lead') else ''
    q = (p['name'] + ' ' + p['institution']).replace('I', 'ı').replace('İ', 'i').lower()
    return (f'<div class="person{" lead" if p.get("lead") else ""}" data-q="{e(q)}"><div class="av" aria-hidden="true">{e(initials(p["name"]))}</div>'
            f'<div><b>{e(p["name"])}</b><span>{pres}{e(p["institution"])}</span></div></div>')

def timeline(limit):
    today, nxt, out = datetime.date.today(), False, []
    for it in DATA['timeline'][:limit or None]:
        past = dt(it['date']) < today
        cls, badge = ('past' if past else ''), ''
        if not past and not nxt: nxt, cls, badge = True, cls + ' next', '<span class="badge">Sıradaki</span>'
        if it.get('congress'): cls += ' congress'
        out.append(f'<li class="{cls.strip()}"><div class="d">{daymonth(it["date"], "tr")}<small>{weekday(it["date"], "tr")} · {FMT["dmy"](it["date"], "tr")}</small></div>'
                   f'<div class="c">{e(it["tr"])}{badge}</div></li>')
    return ''.join(out)

def program():
    out = []
    for i, day in enumerate(DATA['program'], 1):
        if day['sessions']:
            body = '<ul class="sessions">' + ''.join(f'<li><b>{e(s["time"])}</b> {e(s["tr"])}' + (f' <span>· {e(s["hall"])}</span>' if s.get('hall') else '') + '</li>' for s in day['sessions']) + '</ul>'
        else:
            body = f'<p class="note">Oturum detayları {FMT["date"]("programAnnouncement", "tr")} tarihinde yayınlanacak.</p>'
        out.append(f'<div class="card"><div class="day-label">{i}. GÜN · {daymonth(day["date"], "tr").upper()} · {weekday(day["date"], "tr")}</div><h3>{e(day["tr"])}</h3>{body}</div>')
    return ''.join(out)

def render(kind, attrs):
    if kind == 'timeline': return timeline(int(attrs.get('data-limit') or 0))
    if kind == 'program': return program()
    if kind in DATA['committees']: return ''.join(person(p) for p in DATA['committees'][kind])
    raise SystemExit(f'Bilinmeyen data-render: {kind}')

def bind(spec, l, tag):
    kind, _, arg = spec.partition(':')
    c = DATA['contact']
    if kind == 'email': return e(c['email']), {'href': 'mailto:' + c['email']} if tag == 'a' else {}
    if kind == 'site':
        return e(c['site']), ({'href': 'https://' + re.sub(r'^https?://', '', c['site']), 'target': '_blank', 'rel': 'noopener'} if tag == 'a' else {})
    if kind in FMT: return e(FMT[kind](arg, l)), {}
    raise SystemExit(f'Bilinmeyen data-bind: {spec}')

class Scan(HTMLParser):
    """data-bind / data-render öğelerinin konumlarını ve dil bağlamını bulur."""
    VOID = {'area','base','br','col','embed','hr','img','input','link','meta','source','track','wbr'}
    def __init__(self, text):
        super().__init__(convert_charrefs=False)
        self.lines = [0]
        for m in re.finditer('\n', text): self.lines.append(m.end())
        self.stack, self.hits = [], []
    def off(self): l, c = self.getpos(); return self.lines[l - 1] + c
    def handle_starttag(self, tag, attrs):
        a = dict(attrs); start = self.off(); inner = start + len(self.get_starttag_text())
        lang = a.get('lang') or (self.stack[-1]['lang'] if self.stack else 'tr')
        node = {'tag': tag, 'attrs': a, 'start': start, 'inner': inner, 'lang': lang}
        if tag not in self.VOID: self.stack.append(node)
    def handle_endtag(self, tag):
        while self.stack:
            n = self.stack.pop()
            if n['tag'] == tag: break
        else: return
        if 'data-bind' in n['attrs'] or 'data-render' in n['attrs']:
            n['end'] = self.off(); self.hits.append(n)

def set_attrs(starttag, new):
    for k, v in new.items():
        if re.search(rf'\s{k}="[^"]*"', starttag): starttag = re.sub(rf'(\s{k}=)"[^"]*"', lambda m: f'{m.group(1)}"{e(v)}"', starttag)
        else: starttag = starttag[:-1] + f' {k}="{e(v)}">'
    return starttag

def event_schema(base):
    """Google etkinlik kartı için schema.org Event (tarihler ve iletişim site.json'dan)."""
    org = lambda n, u: {'@type': 'Organization', 'name': n, 'url': u}
    return {
        '@context': 'https://schema.org', '@type': 'EducationEvent',
        'name': '5. Uluslararası Halk Oyunları Kongresi (UHOK 2026)',
        'alternateName': '5th International Folk Dance Congress (IFDC 2026)',
        'description': 'Ana tema: Gelenek ve Gelecek Arasında: Halk Oyunlarında Aktarım, Dönüşüm ve Dijital Miras.',
        'startDate': f"{iso('congressStart')}T{DATA.get('congressStartTime', '09:00')}+03:00",
        'endDate': iso('congressEnd'),
        'eventStatus': 'https://schema.org/EventScheduled',
        'eventAttendanceMode': 'https://schema.org/OfflineEventAttendanceMode',
        'inLanguage': ['tr', 'en'],
        'url': base,
        'image': [f'{base}assets/img/uluslararasi-halk-oyunlari-kongresi-2026-sakarya.jpg'],
        'location': {'@type': 'Place', 'name': 'Sakarya Üniversitesi Turgut Özal Kültür ve Kongre Merkezi',
                     'address': {'@type': 'PostalAddress', 'streetAddress': 'Esentepe Kampüsü', 'addressLocality': 'Serdivan',
                                 'addressRegion': 'Sakarya', 'postalCode': '54050', 'addressCountry': 'TR'}},
        'organizer': [org('Sakarya Üniversitesi', 'https://www.sakarya.edu.tr/'),
                      {'@type': 'Organization', 'name': 'Türkiye Halk Oyunları Federasyonu', 'alternateName': 'THOF'}],
        'offers': {'@type': 'Offer', 'price': '0', 'priceCurrency': 'TRY', 'availability': 'https://schema.org/InStock',
                   'url': base + '#kayit', 'validThrough': iso('registrationDeadline')},
        'contactPoint': {'@type': 'ContactPoint', 'email': DATA['contact']['email'], 'contactType': 'customer support'},
    }

def build(text):
    # Önce veri betiği ve SEO bloğu
    public = {k: v for k, v in DATA.items() if not k.startswith('_') and k != 'gscVerification'}
    text = re.sub(r'(<script id="site-data" type="application/json">).*?(</script>)',
                  lambda m: m.group(1) + json.dumps(public, ensure_ascii=False, separators=(',', ':')).replace('</', '<\\/') + m.group(2), text, flags=re.S)
    base = DATA['baseUrl']
    seo = (f'<!-- seo:start (tools/build.py doldurur) -->\n<link rel="canonical" href="{base}">\n'
           f'<link rel="alternate" hreflang="tr" href="{base}">\n<link rel="alternate" hreflang="en" href="{base}?lang=en">\n'
           f'<link rel="alternate" hreflang="x-default" href="{base}">\n<meta property="og:url" content="{base}">\n'
           f'<meta property="og:image" content="{base}assets/img/uluslararasi-halk-oyunlari-kongresi-2026-sakarya.jpg">\n')
    seo += f'<meta name="twitter:image" content="{base}assets/img/uluslararasi-halk-oyunlari-kongresi-2026-sakarya.jpg">\n'
    seo += '<script type="application/ld+json">' + json.dumps(event_schema(base), ensure_ascii=False, separators=(',', ':')).replace('</', '<\\/') + '</script>\n'
    if DATA.get('gscVerification'):  # Google Search Console doğrulama kodu
        seo += f'<meta name="google-site-verification" content="{html.escape(DATA["gscVerification"])}">\n'
    seo += '<!-- seo:end -->'
    text = re.sub(r'<!-- seo:start.*?<!-- seo:end -->', seo, text, flags=re.S)
    sc = Scan(text); sc.feed(text)
    for n in sorted(sc.hits, key=lambda n: n['start'], reverse=True):  # sondan başa, konumlar kaymasın
        a = n['attrs']; starttag = text[n['start']:n['inner']]
        if 'data-render' in a: inner = render(a['data-render'], a)
        else:
            inner, extra = bind(a['data-bind'], n['lang'], n['tag'])
            starttag = set_attrs(starttag, extra)
        text = text[:n['start']] + starttag + inner + text[n['end']:]
    return text, sc.hits

def check():
    errs = []
    order = ['abstractDeadline', 'acceptance', 'registrationDeadline', 'programAnnouncement', 'congressStart', 'congressDay2', 'congressEnd']
    for a, b in zip(order, order[1:]):
        if not dt(a) < dt(b): errs.append(f'Tarih sırası hatalı: {a} ({iso(a)}) >= {b} ({iso(b)})')
    for k in order: print(f'  {k:22} {iso(k)}  {weekday(k, "tr"):10} {weekday(k, "en")}')
    for k in ('email', 'site'):
        if not DATA['contact'].get(k): errs.append(f'contact.{k} boş')
    return errs

if __name__ == '__main__':
    print('Tarihler (gün adları tarihten hesaplanır):')
    errs = check()
    out, hits = build(PAGE.read_text(encoding='utf-8'))
    empty = [h['attrs'].get('data-bind') for h in hits if 'data-bind' in h['attrs'] and not h['attrs']['data-bind'].startswith('days')]
    sc = Scan(out); sc.feed(out)
    for n in sc.hits:
        if 'data-bind' in n['attrs'] and not n['attrs']['data-bind'].startswith('days') and not out[n['inner']:n['end']].strip():
            errs.append(f'Boş kalan alan: data-bind="{n["attrs"]["data-bind"]}"')
    print(f'{sum("data-bind" in h["attrs"] for h in hits)} bağlı alan, {sum("data-render" in h["attrs"] for h in hits)} liste dolduruldu.')
    if errs: print('HATA:\n  ' + '\n  '.join(errs)); sys.exit(1)
    if '--check' in sys.argv:
        print('Denetim tamam.' if out == PAGE.read_text(encoding='utf-8') else 'index.html güncel değil: python3 tools/build.py çalıştırın.')
        sys.exit(0 if out == PAGE.read_text(encoding='utf-8') else 1)
    PAGE.write_text(out, encoding='utf-8'); print('index.html yazıldı.')
