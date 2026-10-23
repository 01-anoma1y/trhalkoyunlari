#!/usr/bin/env python3
"""Hosting'e (cPanel / Plesk / DirectAdmin, Apache veya LiteSpeed) yüklenecek paketi hazırlar.

Kullanım:  python3 tools/yayin.py                       (adres: content/site.json → contact.site)
           python3 tools/yayin.py https://www.ornek.org/  (adresi elle ver)

Çıktı: yayin/site/ klasörü ve yayin/uhok-site.zip
  - index.html: canonical / og / hreflang canlı adrese göre, CSS/JS önbellek sürümüyle (?v=...)
  - .htaccess: HTTPS ve tek alan adına yönlendirme, 404 sayfası, sıkıştırma, önbellek, güvenlik başlıkları
  - robots.txt, sitemap.xml (Google Search Console için)
Zip dosyasını hosting'in dosya yöneticisinde public_html içine yükleyip "çıkart" demek yeterlidir.
"""
import datetime, hashlib, re, shutil, sys, zipfile
from pathlib import Path
from urllib.parse import urlparse

sys.path.insert(0, str(Path(__file__).resolve().parent))
import build  # noqa: E402

ROOT = build.ROOT
OUT = ROOT / 'yayin'
SITE = OUT / 'site'
FILES = ['index.html', '404.html']

def used_assets():
    """index.html, 404.html, CSS ve JS içinde adı geçen assets/ dosyaları (kullanılmayanlar pakete girmez)."""
    used = {'assets/css/style.css', 'assets/js/main.js'}
    for src in ('index.html', '404.html', 'assets/css/style.css', 'assets/js/main.js'):
        text = (ROOT / src).read_text(encoding='utf-8')
        for m in re.findall(r'(?:assets/|\.\./)((?:img|logos|css|js)/[\w./-]+?\.(?:png|jpe?g|webp|svg|ico|css|js))', text):
            used.add('assets/' + m)
    missing = [u for u in used if not (ROOT / u).exists()]
    if missing: sys.exit('Eksik dosya: ' + ', '.join(sorted(missing)))
    return sorted(used)

def live_url():
    if len(sys.argv) > 1: u = sys.argv[1]
    else: u = build.DATA['contact']['site']
    if not u.startswith('http'): u = 'https://' + u
    return u.rstrip('/') + '/'

def ver(p): return hashlib.sha1(p.read_bytes()).hexdigest()[:8]

HTACCESS = """# UHOK 2026 — tools/yayin.py üretti
DirectoryIndex index.html
Options -Indexes
ErrorDocument 404 /404.html

<IfModule mod_rewrite.c>
  RewriteEngine On
  # Let's Encrypt / AutoSSL doğrulaması engellenmesin
  RewriteRule ^\\.well-known/ - [L]
  # HTTP -> HTTPS
  RewriteCond %{{HTTPS}} !=on
  RewriteCond %{{HTTP:X-Forwarded-Proto}} !https
  RewriteRule ^ https://{host}%{{REQUEST_URI}} [L,R=301]
  # Tek alan adı: {host}
  RewriteCond %{{HTTP_HOST}} !^{host_re}$ [NC]
  RewriteRule ^ https://{host}%{{REQUEST_URI}} [L,R=301]
  # /index.html -> /
  RewriteCond %{{THE_REQUEST}} \\s/index\\.html[\\s?] [NC]
  RewriteRule ^index\\.html$ / [L,R=301]
  # Gizli dosyalar (.git, .htaccess vb.) açılmasın
  RewriteRule (^|/)\\.(?!well-known/) - [F]
</IfModule>

<IfModule mod_headers.c>
  Header always set X-Content-Type-Options "nosniff"
  Header always set X-Frame-Options "SAMEORIGIN"
  Header always set Referrer-Policy "strict-origin-when-cross-origin"
  Header always set Permissions-Policy "camera=(), microphone=(), geolocation=()"
  Header always set Strict-Transport-Security "max-age=15552000" env=HTTPS
  <FilesMatch "\\.(html)$">
    Header set Cache-Control "no-cache"
  </FilesMatch>
  <FilesMatch "\\.(css|js)$">
    Header set Cache-Control "public, max-age=31536000, immutable"
  </FilesMatch>
  <FilesMatch "\\.(png|jpe?g|webp|svg|ico|woff2?)$">
    Header set Cache-Control "public, max-age=2592000"
  </FilesMatch>
</IfModule>

<IfModule mod_mime.c>
  AddType image/webp .webp
  AddType application/manifest+json .webmanifest
  AddDefaultCharset utf-8
  AddCharset utf-8 .html .css .js .xml .txt
</IfModule>

<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/css text/plain text/xml application/javascript application/json application/xml image/svg+xml
</IfModule>
"""

def main():
    url = live_url(); host = urlparse(url).hostname
    if not host or 'siteadi' in host:
        print(f'UYARI: canlı adres henüz geçici: {url} (content/site.json → contact.site)')
    if SITE.exists(): shutil.rmtree(SITE)
    SITE.mkdir(parents=True)
    for a in used_assets():
        (SITE / a).parent.mkdir(parents=True, exist_ok=True); shutil.copy2(ROOT / a, SITE / a)
    build.DATA['baseUrl'] = url
    page, _ = build.build((ROOT / 'index.html').read_text(encoding='utf-8'))
    for a in ('assets/css/style.css', 'assets/js/main.js'):
        page = page.replace(f'"{a}"', f'"{a}?v={ver(ROOT / a)}"')
    (SITE / 'index.html').write_text(page, encoding='utf-8')
    shutil.copy2(ROOT / '404.html', SITE / '404.html')
    (SITE / '.htaccess').write_text(HTACCESS.format(host=host, host_re=host.replace('.', '\\.')), encoding='utf-8')
    (SITE / 'robots.txt').write_text(f'User-agent: *\nAllow: /\n\nSitemap: {url}sitemap.xml\n', encoding='utf-8')
    today = datetime.date.today().isoformat()
    (SITE / 'sitemap.xml').write_text(
        '<?xml version="1.0" encoding="UTF-8"?>\n'
        '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n'
        f'  <url>\n    <loc>{url}</loc>\n    <lastmod>{today}</lastmod>\n'
        f'    <xhtml:link rel="alternate" hreflang="tr" href="{url}"/>\n'
        f'    <xhtml:link rel="alternate" hreflang="en" href="{url}?lang=en"/>\n  </url>\n</urlset>\n', encoding='utf-8')
    z = OUT / 'uhok-site.zip'
    with zipfile.ZipFile(z, 'w', zipfile.ZIP_DEFLATED) as f:
        for p in sorted(SITE.rglob('*')):
            if p.is_file(): f.write(p, p.relative_to(SITE).as_posix())
    size = sum(p.stat().st_size for p in SITE.rglob('*') if p.is_file())
    print(f'Canlı adres: {url}\nKlasör: {SITE}  ({size/1e6:.1f} MB)\nZip: {z}  ({z.stat().st_size/1e6:.1f} MB)')

if __name__ == '__main__':
    main()
