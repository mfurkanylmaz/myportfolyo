# Mevlüt Furkan Yılmaz — Portfolyo

GEP1316 Kodlama Okuryazarlığı · Ara Değerlendirme Ödevi 2 (Kişisel Web Portfolyosu)

**Canlı site:** https://KULLANICI-ADIN.github.io/gep1316-portfolyo/  <!-- TODO: GitHub Pages linkini yaz -->

## Sayfalar
| Dosya | İçerik |
|---|---|
| `index.html` | Ana sayfa: avatar, slogan, kısa biyografi, öne çıkan 4 çalışma |
| `projeler.html` | Work: 7 proje kartı, kategori filtresi ve arama |
| `hakkimda.html` | Info: deneyim, eğitim, lisans/beceriler |
| `iletisim.html` | Contact: doğrulamalı form, aydınlatma metni, profesyonel bağlantılar |

`style.css` ve `script.js` tüm sayfalarda ortaktır.

## JavaScript etkileşimleri
1. Karanlık/açık tema (seçim `localStorage` ile hatırlanır)
2. Mobil menü (`aria-expanded`, Esc ile kapanır)
3. Menüde kayan sekme göstergesi
4. Kaydırınca beliren içerik (`IntersectionObserver`)
5. Proje detay penceresi (`<dialog>` modal, Esc ve dış tıklama ile kapanır)
6. Proje filtreleme ve arama
7. Form doğrulama + geri bildirim mesajı

## Erişilebilirlik ve gizlilik
- Anlamsal HTML (`header`, `nav`, `main`, `footer`), “İçeriğe geç” bağlantısı, görünür odak halkası
- Tüm görsellerde alt metin, tüm form alanlarında `label`
- Kontrast: metin #F5F5F7 / zemin #0A0A0C, ikincil metin #A1A1AA (≈ 7.9:1)
- `prefers-reduced-motion` desteği
- Sistem yazı tipleri kullanılır; **çerez, izleyici veya üçüncü taraf betik yoktur**
- Form veriyi hiçbir sunucuya göndermez; yalnızca tarayıcıda doğrular

## Yapay zekâ kullanımı
Anthropic. (2026). *Claude* [Büyük dil modeli]. https://claude.ai
