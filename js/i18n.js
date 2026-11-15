// --- Languages: English (source text in index.html) / Japanese / Traditional Chinese ---
// The language comes from ?lang=ja|zh-Hant|en, then the last choice, then the browser language
import { LANGS, LANG_KEY } from './config.js';
import ja from './i18n/ja.js';
import zhHant from './i18n/zh-Hant.js';
import enExtra from './i18n/en.js';

const DICT = { ja, 'zh-Hant': zhHant };
// English captured from the page on first run (plus texts that are not in the page), so switching back needs no reload
const EN = { ...enExtra };
let lang = 'en';

const store = { get: () => { try { return localStorage.getItem(LANG_KEY); } catch { return null; } }, set: v => { try { localStorage.setItem(LANG_KEY, v); } catch { } } };

function detect() {
  const q = new URLSearchParams(location.search).get('lang');
  if (LANGS.includes(q)) return q;
  const saved = store.get();
  if (LANGS.includes(saved)) return saved;
  const nav = (navigator.language || '').toLowerCase();
  if (nav.startsWith('ja')) return 'ja';
  if (nav.startsWith('zh')) return 'zh-Hant';
  return 'en';
}

/** Text for a key in the current language (English when a translation is missing) */
export const t = key => (DICT[lang] && DICT[lang][key]) || EN[key] || key;

function apply() {
  document.documentElement.lang = lang;
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const k = el.dataset.i18n;
    if (!(k in EN)) EN[k] = el.textContent;
    el.textContent = t(k);
  });
  document.querySelectorAll('[data-i18n-html]').forEach(el => {
    const k = el.dataset.i18nHtml;
    if (!(k in EN)) EN[k] = el.innerHTML;
    el.innerHTML = t(k);
  });
  document.querySelectorAll('[data-i18n-attr]').forEach(el => el.dataset.i18nAttr.split(';').forEach(pair => {
    const [attr, k] = pair.split(':');
    if (!(k in EN)) EN[k] = el.getAttribute(attr) || '';
    el.setAttribute(attr, t(k));
  }));
  if (DICT[lang] && DICT[lang]['meta.title']) document.title = DICT[lang]['meta.title'];
  else if (EN['meta.title']) document.title = EN['meta.title'];
  document.querySelectorAll('[data-lang]').forEach(b => b.classList.toggle('on', b.dataset.lang === lang));
}

export function initI18n() {
  if (!('meta.title' in EN)) EN['meta.title'] = document.title;
  lang = detect();
  apply();
}

/** Switches language in place and keeps it in the URL, so each language has its own shareable link */
export function setLang(code) {
  if (!LANGS.includes(code)) return;
  lang = code; store.set(code);
  const u = new URL(location.href);
  if (code === 'en') u.searchParams.delete('lang'); else u.searchParams.set('lang', code);
  history.replaceState(null, '', u);
  apply();
}
