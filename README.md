# 5. Uluslararası Halk Oyunları Kongresi (UHOK – IFDC 2026)

Sakarya Üniversitesi & Türkiye Halk Oyunları Federasyonu · 10–12 Aralık 2026

Kongre web sitesi örneği ve basılı materyaller. Site Türkçe / İngilizce (sağ üstteki **TR | EN** düğmesi).

## Klasörler

| Yol | İçerik |
|---|---|
| `index.html` | Web sitesi (tek sayfa, sekmeli) |
| `content/site.json` | İletişim, tarihler, kurullar, program (tek kaynak) |
| `tools/build.py` | site.json içeriğini index.html'e yazan ve denetleyen betik |
| `404.html` | Bulunamayan sayfa |
| `assets/` | Site stilleri, kodu, logolar ve görseller |
| `baski/afis.png`, `baski/afis-A3.pdf` | Açıklayıcı afiş |
| `baski/davetiye-tr-en.pdf` (+ PNG'ler) | Davetiye, Türkçe ve İngilizce |
| `baski/banner-1-1050x600.png`, `baski/banner-2-1600x680.png`, `baski/branda-1600x414.png` | Eski bannerların yeni hâli (aynı ölçüler) |
| `baski/sosyal-medya-gorseli.png` | Paylaşım görseli (1200×630) |
| `baski/kaynak/` | Afiş / davetiye / banner kaynak dosyaları (HTML, düzenlenebilir) |

## Sitedeki sekmeler

Ana Sayfa · Kongre · Tema ve Konular · Önemli Tarihler · Kurullar · Bildiri Gönderimi · Kayıt · Program · Konaklama · İletişim

- Önemli tarihler: zaman çizelgesi, geri sayım, "takvime ekle" (.ics)
- Kurullar: onursal başkanlar, düzenleme kurulu, **yürütme kurulu (boş, sonra doldurulacak)**, bilimsel sekreterya, aranabilir hakem kurulu
- Bildiri: yazım kuralları, poster kuralları, kelime sayaçlı özet gönderim formu
- Kayıt: kayıt formu (formlar bilgileri kongre e-postasına gönderir)

## İçerik nasıl güncellenir

Sitedeki **e-posta, web adresi, tüm tarihler, kurul listeleri ve program** tek bir dosyadan gelir: `content/site.json`.

1. `content/site.json` dosyasında ilgili değeri değiştirin (ör. `contact.email`, `dates.abstractDeadline`).
2. `python3 tools/build.py` çalıştırın. Betik değerleri `index.html` içine yazar, tarihlerin sırasını ve gün adlarını denetler, boş kalan alan olursa hata verir.
3. `python3 tools/build.py --check` ile sayfanın güncel olduğunu doğrulayabilirsiniz.

Notlar:
- Özet son tarihi (`abstractDeadline`) ve kayıt son tarihi (`registrationDeadline`) ayrı tanımlıdır.
- Gün adları (Çarşamba, Perşembe…) elle yazılmaz, tarihten otomatik üretilir.
- Program geldiğinde `program[].sessions` listesine `{"time": "09:30", "tr": "…", "en": "…", "hall": "Salon A"}` biçiminde oturum eklemek yeterlidir.
- Değerler HTML'e yazıldığı için sayfa JavaScript çalışmadan da (arama motorları, link önizlemeleri) eksiksiz okunur.

## Yapılacaklar

1. **Yeni e-posta ve site adı:** `content/site.json` içinde `contact.email` ve `contact.site` değerlerini değiştirip `python3 tools/build.py` çalıştırın.
   Afiş/davetiye/bannerlarda geçici olarak `yenimail@gmail.com` ve `www.siteadi.com` yazıyor; `baski/kaynak/*.html` içinde değiştirilip yeniden çıktısı alınmalı.
2. Yürütme Kurulu isimleri gelince `index.html` içindeki "Yürütme Kurulu" bölümüne eklenecek.
3. Kongre programı (4 Aralık) gelince **Program** sekmesi doldurulacak.
4. Davetiyede "Sayın Prof. Dr. ……" kısmı ve imza kişiye göre düzenlenecek.

## Boyut ve yayın

- Site: yaklaşık **2 MB** (HTML + görseller). Sunucu tarafı gerektirmez; herhangi bir statik barındırmada (GitHub Pages, Netlify, üniversite sunucusu, ucuz bir paylaşımlı hosting) çalışır. Veritabanı yok.
- Basılı dosyalar (`baski/`) yaklaşık 13 MB; siteye yüklenmeleri gerekmez.
