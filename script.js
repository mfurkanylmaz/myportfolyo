/* =========================================================
   Ortak JavaScript dosyası (tüm sayfalar)
   Etkileşimler:
   1. Karanlık / açık tema (seçim tarayıcıda hatırlanır)
   2. Mobil menü (aç/kapat, Esc ile kapanır)
   3. Menüde kayan sekme göstergesi
   4. Kaydırınca beliren içerik
   5. Proje detay penceresi (modal)
   6. Proje filtreleme ve arama
   7. İletişim formu doğrulama + geri bildirim mesajı
   ========================================================= */

// JS çalıştığını CSS'e bildir (JS yoksa .reveal öğeleri gizlenmez)
document.documentElement.classList.add("js");

/* ---------- 1. Tema ---------- */
// localStorage bazı gizli modlarda hata verebilir; try/catch ile güvenli okuma/yazma
function readTheme() {
  try { return localStorage.getItem("theme"); } catch (e) { return null; }
}
function saveTheme(value) {
  try { localStorage.setItem("theme", value); } catch (e) { /* kaydedilemezse sorun değil */ }
}

function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
  const btn = document.querySelector(".theme-toggle");
  if (btn) {
    btn.setAttribute("aria-label", theme === "dark" ? "Açık temaya geç" : "Koyu temaya geç");
  }
}

applyTheme(readTheme() || "dark"); // varsayılan: koyu tema

document.addEventListener("DOMContentLoaded", () => {
  applyTheme(document.documentElement.dataset.theme); // buton etiketini güncelle

  document.querySelector(".theme-toggle")?.addEventListener("click", () => {
    const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    applyTheme(next);
    saveTheme(next);
  });

  // Footer'daki yılı otomatik güncelle
  const year = document.getElementById("year");
  if (year) year.textContent = new Date().getFullYear();

  initMobileMenu();
  initTabIndicator();
  initReveal();
  initModal();
  initFilters();
  initContactForm();
});

/* ---------- 2. Mobil menü ---------- */
function initMobileMenu() {
  const toggle = document.querySelector(".menu-toggle");
  const menu = document.getElementById("nav-menu");
  if (!toggle || !menu) return;

  function setOpen(open) {
    menu.classList.toggle("is-open", open);
    toggle.setAttribute("aria-expanded", String(open)); // ekran okuyucuya menü durumu
    toggle.setAttribute("aria-label", open ? "Menüyü kapat" : "Menüyü aç");
  }

  toggle.addEventListener("click", () => {
    setOpen(toggle.getAttribute("aria-expanded") !== "true");
  });

  // Esc tuşu menüyü kapatır ve odağı butona geri verir
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && menu.classList.contains("is-open")) {
      setOpen(false);
      toggle.focus();
    }
  });

  // Ekran genişleyince açık kalan menüyü sıfırla
  window.matchMedia("(min-width: 860px)").addEventListener("change", () => setOpen(false));
}

/* ---------- 3. Kayan sekme göstergesi ---------- */
function initTabIndicator() {
  const wrap = document.querySelector(".tabs-wrap");
  const indicator = document.querySelector(".tab-indicator");
  if (!wrap || !indicator) return;

  const links = [...wrap.querySelectorAll(".tabs a")];
  const active = wrap.querySelector('a[aria-current="page"]');

  // Göstergeyi verilen sekmenin konumuna ve genişliğine taşı
  function moveTo(link) {
    if (!link) { indicator.style.opacity = "0"; return; }
    const wrapBox = wrap.getBoundingClientRect();
    const box = link.getBoundingClientRect();
    indicator.style.width = box.width + "px";
    indicator.style.transform = `translateX(${box.left - wrapBox.left}px)`;
    indicator.style.opacity = "1";
  }

  // Önceki sayfadaki sekmeden başlayıp yenisine kaysın
  let previous = null;
  try { previous = sessionStorage.getItem("lastTab"); } catch (e) {}
  const start = links.find((a) => a.dataset.tab === previous);
  if (start && active && start !== active) {
    indicator.style.transition = "none";
    moveTo(start);
    indicator.getBoundingClientRect(); // tarayıcıyı başlangıç konumunu çizmeye zorlar
    indicator.style.transition = "";
  }
  requestAnimationFrame(() => moveTo(active));

  links.forEach((link) => {
    link.addEventListener("mouseenter", () => moveTo(link));
    link.addEventListener("focus", () => moveTo(link));
    link.addEventListener("click", () => {
      try { sessionStorage.setItem("lastTab", link.dataset.tab); } catch (e) {}
    });
  });
  wrap.addEventListener("mouseleave", () => moveTo(active));
  wrap.addEventListener("focusout", (e) => {
    if (!wrap.contains(e.relatedTarget)) moveTo(active);
  });
  window.addEventListener("resize", () => moveTo(active));

  try { if (active) sessionStorage.setItem("lastTab", active.dataset.tab); } catch (e) {}
}

/* ---------- 4. Kaydırınca belirme ---------- */
function initReveal() {
  const items = document.querySelectorAll(".reveal");
  if (!("IntersectionObserver" in window)) {
    items.forEach((el) => el.classList.add("is-visible"));
    return;
  }
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target); // bir kez göründükten sonra izlemeyi bırak
      }
    });
  }, { threshold: 0.12 });
  items.forEach((el) => observer.observe(el));
}

/* ---------- 5. Proje detay penceresi ---------- */
function initModal() {
  const modal = document.getElementById("project-modal");
  const content = document.getElementById("modal-content");
  if (!modal || !content) return;

  let opener = null; // pencereyi açan buton; kapanınca odak buraya döner

  document.querySelectorAll(".card-open").forEach((btn) => {
    btn.addEventListener("click", () => {
      const tpl = document.getElementById(btn.dataset.detail);
      if (!tpl) return;
      // <template> içeriğinin kopyasını ekle (innerHTML kullanmıyoruz)
      content.replaceChildren(tpl.content.cloneNode(true));
      opener = btn;
      modal.showModal(); // <dialog>: odağı içeride tutar, Esc ile kapanır
    });
  });

  modal.querySelector(".modal-close").addEventListener("click", () => modal.close());

  // Pencerenin dışına (arka plana) tıklayınca kapat
  modal.addEventListener("click", (e) => {
    if (e.target === modal) modal.close();
  });

  modal.addEventListener("close", () => {
    if (opener) opener.focus();
  });
}

/* ---------- 6. Filtreleme ve arama ---------- */
function initFilters() {
  const list = document.getElementById("project-list");
  if (!list) return; // yalnızca projeler sayfasında çalışır

  const cards = [...list.querySelectorAll(".card")];
  const buttons = document.querySelectorAll(".filter-btn");
  const search = document.getElementById("project-search");
  const count = document.getElementById("result-count");
  const empty = document.getElementById("empty-state");
  let category = "all";

  function update() {
    const query = search.value.trim().toLocaleLowerCase("tr");
    let visible = 0;

    cards.forEach((card) => {
      const matchCat = category === "all" || card.dataset.category === category;
      const matchText = card.dataset.search.includes(query);
      const show = matchCat && matchText;
      card.hidden = !show;
      if (show) {
        visible++;
        card.classList.add("is-visible"); // filtreden dönen kart görünür olsun
      }
    });

    count.textContent = `${visible} proje gösteriliyor`;
    empty.hidden = visible !== 0;
  }

  buttons.forEach((btn) => {
    btn.addEventListener("click", () => {
      category = btn.dataset.filter;
      buttons.forEach((b) => b.setAttribute("aria-pressed", String(b === btn)));
      update();
    });
  });

  search.addEventListener("input", update);
}

/* ---------- 7. İletişim formu ---------- */
function initContactForm() {
  const form = document.getElementById("contact-form");
  if (!form) return; // yalnızca iletişim sayfasında çalışır

  const status = document.getElementById("form-status");
  const message = form.elements.message;
  const charCount = document.getElementById("char-count");

  // Her alan için kural: hata varsa mesaj döndürür, yoksa boş metin
  const rules = {
    name: (v) => (v.length < 2 ? "Lütfen adınızı ve soyadınızı yazın (en az 2 karakter)." : ""),
    email: (v) => {
      if (!v) return "Lütfen e-posta adresinizi yazın.";
      return /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v) ? "" : "Geçerli bir e-posta adresi yazın (ör. ad@ornek.com).";
    },
    topic: (v) => (v ? "" : "Lütfen bir konu seçin."),
    message: (v) => {
      if (v.length < 20) return `Mesajınız en az 20 karakter olmalı (şu an ${v.length}).`;
      if (v.length > 1000) return "Mesajınız en fazla 1000 karakter olabilir.";
      return "";
    },
  };

  function validateField(name) {
    const field = form.elements[name];
    const error = rules[name](field.value.trim());
    // textContent kullanıyoruz: kullanıcı metni HTML olarak işlenmez (XSS önlemi)
    document.getElementById(`${name}-error`).textContent = error;
    field.setAttribute("aria-invalid", error ? "true" : "false");
    return !error;
  }

  // Alan terk edilince kontrol et; hata varsa yazarken anında güncelle
  Object.keys(rules).forEach((name) => {
    const field = form.elements[name];
    field.addEventListener("blur", () => validateField(name));
    field.addEventListener("input", () => {
      if (field.getAttribute("aria-invalid") === "true") validateField(name);
    });
  });

  message.addEventListener("input", () => {
    charCount.textContent = message.value.length;
  });

  form.addEventListener("submit", (e) => {
    e.preventDefault(); // sayfa yenilenmesin; veri hiçbir yere gönderilmez

    const results = Object.keys(rules).map(validateField);
    const firstInvalid = form.querySelector('[aria-invalid="true"]');

    if (results.includes(false)) {
      status.className = "form-status is-error";
      status.textContent = "Lütfen işaretli alanları düzeltin.";
      firstInvalid?.focus();
      return;
    }

    const firstName = form.elements.name.value.trim().split(" ")[0];
    status.className = "form-status is-success";
    status.textContent = `Teşekkürler ${firstName}! Mesajınız doğrulandı. Bu demo form veri göndermez; bana e-posta ile de ulaşabilirsiniz.`;
    form.reset();
    charCount.textContent = "0";
    form.querySelectorAll("[aria-invalid]").forEach((f) => f.removeAttribute("aria-invalid"));
  });
}
