// Motor de movimiento portado de la maqueta de Claude Design:
// revelados con máscara, parallax interno, galería horizontal anclada,
// línea de proceso, contadores, cabecera que se oculta, menú y cursor.
const EXPO = 'cubic-bezier(0.16,1,0.3,1)';
const reduce = !document.documentElement.classList.contains('motion');
const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
const clamp01 = (v: number) => Math.max(0, Math.min(1, v));
const root = document.documentElement;
const $ = <T extends Element = HTMLElement>(s: string, c: ParentNode = document) => c.querySelector<T>(s) as T | null;
const $$ = <T extends Element = HTMLElement>(s: string, c: ParentNode = document) => [...c.querySelectorAll<T>(s)];

type Anim = HTMLElement & { _a?: Animation; _z?: Animation };
let introDone = false;
const pending: Anim[] = [];
const viaTransition = sessionStorage.getItem('vt') === '1';
sessionStorage.removeItem('vt');

/* ---------- Revelados ---------- */
const K: Record<string, Keyframe[]> = {
  up: [{ transform: 'translateY(108%)' }, { transform: 'translateY(0)' }],
  fade: [{ opacity: 0, transform: 'translateY(28px)' }, { opacity: 1, transform: 'translateY(0)' }],
  curtain: [{ clipPath: 'inset(100% 0 0 0)' }, { clipPath: 'inset(0% 0 0 0)' }],
  hero: [{ clipPath: 'inset(100% 0 0 0)' }, { clipPath: 'inset(0% 0 0 0)' }],
  bar: [{ transform: 'scaleX(0)' }, { transform: 'scaleX(1)' }],
};

function play(el: Anim) {
  if (el.dataset.reveal === 'hero' && !introDone) { pending.push(el); return; }
  el._a?.play(); el._z?.play();
}

// Se observa el contenedor (no el elemento): un elemento oculto por su propia máscara
// o desplazado fuera de su caja nunca "intersecta" y su animación no arrancaría.
const watch = new Map<Element, Anim[]>();
const io = new IntersectionObserver((es) => es.forEach((e) => {
  if (!e.isIntersecting) return;
  io.unobserve(e.target);
  (watch.get(e.target) || []).forEach(play);
  watch.delete(e.target);
}), { rootMargin: '0px 0px -6% 0px', threshold: 0.01 });

function setupReveals() {
  $$<Anim>('[data-reveal]').forEach((el) => {
    const t = el.dataset.reveal!;
    if (t === 'none' || reduce || !K[t]) { el.setAttribute('data-done', ''); return; }
    // Si se llegó a la ficha con transición de imagen compartida, el hero ya está en su sitio.
    if (t === 'hero' && viaTransition) { el.setAttribute('data-done', ''); return; }
    const d = +(el.dataset.delay || 0);
    const dur = t === 'hero' ? 1400 : t === 'curtain' ? 1100 : 900;
    el._a = el.animate(K[t], { duration: dur, delay: d, easing: EXPO, fill: 'both' });
    el._a.pause();
    el._a.onfinish = () => { el.setAttribute('data-done', ''); el._a?.cancel(); };
    if (t === 'hero' || t === 'curtain') {
      const z = $('[data-zoom]', el);
      if (z) { el._z = z.animate([{ transform: 'scale(1.1)' }, { transform: 'scale(1)' }], { duration: t === 'hero' ? 2000 : 1500, delay: d, easing: EXPO, fill: 'backwards' }); el._z.pause(); }
    }
    const host = el.parentElement || el;
    if (!watch.has(host)) { watch.set(host, []); io.observe(host); }
    watch.get(host)!.push(el);
  });
}

/* ---------- Contadores ---------- */
const cio = new IntersectionObserver((es) => es.forEach((e) => {
  if (!e.isIntersecting) return;
  const el = e.target as HTMLElement; cio.unobserve(el);
  const to = +el.dataset.count!; const tn = el.firstChild;
  if (!tn || reduce) return;
  const t0 = performance.now();
  const step = (t: number) => {
    const k = Math.min(1, (t - t0) / 1600);
    tn.nodeValue = String(k >= 1 ? to : Math.round(to * (1 - Math.pow(2, -10 * k))));
    if (k < 1) requestAnimationFrame(step);
  };
  tn.nodeValue = '0'; requestAnimationFrame(step);
}), { threshold: 0.5 });

/* ---------- Intro (solo primera visita a la home) ---------- */
function intro() {
  const el = $('[data-intro]');
  const release = () => { if (introDone) return; introDone = true; pending.splice(0).forEach(play); };
  if (!el) { release(); return; }
  if (reduce || sessionStorage.getItem('intro') === '1') { el.remove(); release(); return; }
  sessionStorage.setItem('intro', '1');
  el.style.display = 'flex';
  const logo = $('[data-intro-logo]', el)!;
  logo.animate([{ opacity: 0, transform: 'translateY(24px)', letterSpacing: '.5em' }, { opacity: 1, transform: 'translateY(0)', letterSpacing: '.32em' }], { duration: 1000, easing: EXPO, fill: 'both' });
  const out = el.animate([{ clipPath: 'inset(0 0 0 0)' }, { clipPath: 'inset(0 0 100% 0)' }], { duration: 1000, delay: 1300, easing: 'cubic-bezier(0.76,0,0.24,1)', fill: 'forwards' });
  out.onfinish = () => el.remove();
  setTimeout(release, 1650);
}

/* ---------- Scroll: parallax, galería horizontal, proceso ---------- */
let px: HTMLElement[] = [];
let hs: HTMLElement | null = null;
let procs: HTMLElement[] = [];
let raf = 0;

function frame() {
  raf = 0;
  const vh = window.innerHeight, vw = window.innerWidth;
  if (!reduce) px.forEach((el) => {
    const r = (el.parentNode as HTMLElement).getBoundingClientRect();
    if (r.bottom < 0 || r.top > vh) return;
    const p = Math.max(-1, Math.min(1, (r.top + r.height / 2 - vh / 2) / vh));
    el.style.transform = `translate3d(0,${(p * 6).toFixed(2)}%,0)`;
  });
  if (hs && hs.offsetParent !== null) {
    const r = hs.getBoundingClientRect();
    const tr = $('[data-track]', hs);
    const p = clamp01(-r.top / (r.height - vh));
    if (tr) tr.style.transform = `translate3d(${-p * Math.max(0, tr.scrollWidth - vw)}px,0,0)`;
    const n = +(hs.dataset.n || 6);
    const c = $('[data-hcount]', hs);
    if (c) c.textContent = String(Math.min(n, Math.floor(p * n) + 1)).padStart(2, '0');
    const bar = $('[data-hbar]', hs);
    if (bar) bar.style.transform = `scaleX(${Math.max(p, 1 / n)})`;
  }
  procs.forEach((pr) => {
    const r = pr.getBoundingClientRect();
    const p = reduce ? 1 : clamp01((vh * 0.62 - r.top) / r.height);
    const line = $('[data-line]', pr);
    if (line) line.style.transform = `scaleY(${p})`;
    $$('[data-phase]', pr).forEach((ph) => {
      const at = (ph.getBoundingClientRect().top - r.top) / r.height;
      const on = p >= at + 0.005 || p >= 0.999;
      ph.style.opacity = on ? '1' : '0.38';
      const num = $('[data-num]', ph);
      if (num) num.style.color = on ? ph.dataset.on! : ph.dataset.off!;
    });
  });
}
const queue = () => { if (!raf) raf = requestAnimationFrame(frame); };

/* ---------- Cabecera ---------- */
const header = $('[data-header]');
let ly = 0, hidden = false;
function onScroll() {
  const y = window.scrollY; const dy = y - ly; ly = y;
  const menuOpen = root.classList.contains('menu-open');
  if (y < 120 || menuOpen) hidden = false; else if (dy > 6) hidden = true; else if (dy < -6) hidden = false;
  const heroH = $('[data-hero]')?.offsetHeight ?? 0;
  const onDark = menuOpen || (heroH > 0 && y < heroH - 90);
  header?.classList.toggle('is-hidden', hidden);
  header?.classList.toggle('on-dark', onDark);
  // La barra fija de CTA en mobile aparece al dejar atrás el hero (que ya tiene su propio CTA).
  root.classList.toggle('fab-on', heroH === 0 || y > heroH * 0.6);
  queue();
}

/* ---------- Menú ---------- */
const menu = $('[data-menu]');
const menuBtn = $<HTMLButtonElement>('[data-menu-btn]');
function setMenu(open: boolean) {
  root.classList.toggle('menu-open', open);
  menu?.setAttribute('aria-hidden', String(!open));
  if (menu) (menu as HTMLElement & { inert: boolean }).inert = !open;
  menuBtn?.setAttribute('aria-expanded', String(open));
  const lbl = $('[data-menu-label]'); if (lbl) lbl.textContent = open ? 'Cerrar' : 'Menú';
  document.body.style.overflow = open ? 'hidden' : '';
  onScroll();
}
menuBtn?.addEventListener('click', () => setMenu(!root.classList.contains('menu-open')));
window.addEventListener('keydown', (e) => { if (e.key === 'Escape' && root.classList.contains('menu-open')) setMenu(false); });
$$('[data-menu-item]').forEach((a, i) => {
  const on = () => {
    $$('[data-menu-item]').forEach((b, j) => b.classList.toggle('is-on', i === j));
    $$('[data-menu-photo]').forEach((p, j) => p.classList.toggle('is-on', i === j));
  };
  a.addEventListener('mouseenter', on); a.addEventListener('focus', on);
});

/* ---------- Cursor "Ver casa" y zoom en tarjetas ---------- */
const cur = $('[data-cursor-el]'), dot = $('[data-cursor-dot]'), txt = $('[data-cursor-txt]');
if (fine && cur) {
  root.classList.add('has-cursor');
  document.addEventListener('pointermove', (e) => { cur.style.transform = `translate3d(${e.clientX}px,${e.clientY}px,0)`; }, { passive: true });
}
let hc: HTMLElement | null = null;
document.addEventListener('pointerover', (e) => {
  const card = (e.target as HTMLElement).closest?.<HTMLElement>('[data-card]') ?? null;
  if (card === hc) return;
  if (hc) { const z = $('[data-zoom]', hc); if (z) z.style.transform = 'scale(1)'; }
  hc = card;
  if (card && !reduce) { const z = $('[data-zoom]', card); if (z) { z.style.transition = `transform 800ms ${EXPO}`; z.style.transform = 'scale(1.05)'; } }
  const label = card && e.pointerType === 'mouse' ? card.dataset.cursor : null;
  if (dot) { if (label && txt) txt.textContent = label; dot.style.transform = label ? 'scale(1)' : 'scale(0)'; }
});
// Marca la navegación a una ficha para que el hero no repita su revelado tras la transición compartida.
document.addEventListener('click', (e) => {
  const a = (e.target as HTMLElement).closest?.('a[data-card]');
  if (a && 'startViewTransition' in document) sessionStorage.setItem('vt', '1');
  if (dot) dot.style.transform = 'scale(0)';
});

/* ---------- Arranque ---------- */
setupReveals();
$$('[data-count]').forEach((el) => cio.observe(el));
px = $$('[data-parallax="on"]');
hs = $('[data-hscroll]');
procs = $$('[data-process]');
window.addEventListener('scroll', onScroll, { passive: true });
window.addEventListener('resize', queue);
intro();
onScroll();
frame();
