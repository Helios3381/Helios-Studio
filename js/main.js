// --- Entry point: icons, language, menu, scroll effects, contact form ---
import { COPYRIGHT, CONTACT_EMAIL } from './config.js';
import { initI18n, t, setLang } from './i18n.js';

const $ = id => document.getElementById(id);

// Icons and illustrations are SVG symbols in the generated assets folder; once inserted, <use href="#…"> works
fetch('assets/generated/icons/sprite.svg').then(r => r.text()).then(svg => {
  const box = document.createElement('div');
  // Not display:none — gradients inside hidden symbols would stop rendering
  box.style.cssText = 'position:absolute;width:0;height:0;overflow:hidden';
  box.setAttribute('aria-hidden', 'true');
  box.innerHTML = svg;
  document.body.prepend(box);
}).catch(e => console.warn('[sprite]', e));

$('copyright').textContent = COPYRIGHT;
initI18n();

// Language buttons
document.querySelectorAll('[data-lang]').forEach(b => b.addEventListener('click', () => setLang(b.dataset.lang)));

// Phone menu: opens under the header, closes after choosing a section
const burger = $('burger'), menu = $('menu');
burger.addEventListener('click', () => {
  const open = burger.getAttribute('aria-expanded') !== 'true';
  burger.setAttribute('aria-expanded', open); menu.classList.toggle('open', open);
});
menu.addEventListener('click', e => { if (e.target.closest('a')) { burger.setAttribute('aria-expanded', 'false'); menu.classList.remove('open'); } });

// Header border once the page scrolls
const top = $('top');
addEventListener('scroll', () => top.classList.toggle('scrolled', scrollY > 8), { passive: true });

// Sections fade in as they enter the screen
const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: .12 });
document.querySelectorAll('.card,.svc,.steps li,.case-list li,.about,details').forEach(el => { el.classList.add('rv'); io.observe(el); });

// --- Contact: the form writes an email in the visitor's own mail app (no server needed) ---
const form = $('cf');
if (CONTACT_EMAIL) {
  $('mail-link').hidden = false;
  $('mail-link').href = `mailto:${CONTACT_EMAIL}`;
  $('mail-text').textContent = CONTACT_EMAIL;
  form.addEventListener('submit', e => {
    e.preventDefault();
    const f = new FormData(form), name = f.get('name').trim(), msg = f.get('msg').trim();
    if (!name || !msg) { $('cf-note').textContent = t('ct.need'); $('cf-note').classList.add('err'); return; }
    const type = form.type.selectedOptions[0].textContent;
    const subject = `[Helios Studio] ${type} — ${name}`;
    location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(`${msg}\n\n— ${name}`)}`;
  });
} else {
  form.hidden = true;
  $('contact').querySelector('.sub').dataset.i18n = 'ct.subNoMail';
  initI18n();
}
