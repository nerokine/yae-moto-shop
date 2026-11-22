// Inline SVG icons (line style). Use: <i data-i="cart"></i>  — size with font-size, color with color.
const ICONS = {
  cart:'<circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/>',
  tire:'<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="4"/><path d="M12 2v4M12 18v4M2 12h4M18 12h4"/>',
  wind:'<path d="M17.7 7.7a2.5 2.5 0 1 1 1.8 4.3H2"/><path d="M9.6 4.6A2 2 0 1 1 11 8H2"/><path d="M12.6 19.4A2 2 0 1 0 14 16H2"/>',
  mirror:'<ellipse cx="12" cy="9" rx="7" ry="6"/><path d="M12 15v6M8 21h8"/>',
  oil:'<path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z"/>',
  shield:'<path d="M20 13c0 5-3.5 7.5-7.66 8.95a1 1 0 0 1-.67-.01C7.5 20.5 4 18 4 13V6a1 1 0 0 1 1-1c2 0 4.5-1.2 6.24-2.72a1.17 1.17 0 0 1 1.52 0C14.51 3.81 17 5 19 5a1 1 0 0 1 1 1z"/><path d="m9 12 2 2 4-4"/>',
  book:'<path d="M12 7v14"/><path d="M3 18a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h5a4 4 0 0 1 4 4 4 4 0 0 1 4-4h5a1 1 0 0 1 1 1v13a1 1 0 0 1-1 1h-6a3 3 0 0 0-3 3 3 3 0 0 0-3-3z"/>',
  zap:'<path d="M4 14a1 1 0 0 1-.78-1.63l9.9-10.2a.5.5 0 0 1 .86.46l-1.92 6.02A1 1 0 0 0 13 10h7a1 1 0 0 1 .78 1.63l-9.9 10.2a.5.5 0 0 1-.86-.46l1.92-6.02A1 1 0 0 0 11 14z"/>',
  check:'<circle cx="12" cy="12" r="10"/><path d="m9 12 2 2 4-4"/>',
  bike:'<circle cx="18.5" cy="17.5" r="3.5"/><circle cx="5.5" cy="17.5" r="3.5"/><circle cx="15" cy="5" r="1"/><path d="M12 17.5V14l-3-3 4-3 2 3h2"/>'
};
function icons(){
  document.querySelectorAll('i[data-i]:not([data-done])').forEach(el=>{
    const p = ICONS[el.dataset.i]; if(!p) return;
    el.innerHTML = '<svg viewBox="0 0 24 24" width="1em" height="1em" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+p+'</svg>';
    el.dataset.done = 1;
  });
}
icons();

// mobile menu
const nav = document.querySelector('nav');
const mb = document.querySelector('.menu-btn');
if (mb) mb.onclick = () => nav.classList.toggle('open');

// cart badge (reads the cart saved by products.html)
try {
  const cart = JSON.parse(localStorage.getItem('cart') || '{}');
  const n = Object.values(cart).reduce((a, b) => a + b, 0);
  const el = document.getElementById('cart-count');
  if (el) el.textContent = n;
} catch (e) {}

// scroll reveal
const io = new IntersectionObserver(es => es.forEach(e => {
  if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
}), { threshold: .15 });
document.querySelectorAll('.reveal').forEach(el => io.observe(el));

// count-up numbers
const co = new IntersectionObserver(es => es.forEach(e => {
  if (!e.isIntersecting) return;
  const el = e.target, end = +el.dataset.count, t0 = performance.now();
  const step = t => {
    const p = Math.min((t - t0) / 1200, 1);
    el.textContent = Math.floor(end * p).toLocaleString() + (p === 1 ? (el.dataset.suffix || '') : '');
    if (p < 1) requestAnimationFrame(step);
  };
  requestAnimationFrame(step); co.unobserve(el);
}), { threshold: .5 });
document.querySelectorAll('[data-count]').forEach(el => co.observe(el));

// FAQ search
const fs = document.getElementById('faq-search');
if (fs) fs.oninput = () => {
  const q = fs.value.trim().toLowerCase();
  document.querySelectorAll('details').forEach(d => d.style.display = d.textContent.toLowerCase().includes(q) ? '' : 'none');
};

// contact form
const cf = document.getElementById('contact-form');
if (cf) cf.onsubmit = e => {
  e.preventDefault();
  const v = id => document.getElementById(id);
  const bad = (id, b) => { v(id).parentNode.classList.toggle('bad', b); return !b; };
  const ok = [
    bad('c-name', v('c-name').value.trim().length < 2),
    bad('c-email', !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v('c-email').value.trim())),
    bad('c-msg', v('c-msg').value.trim().length < 10)
  ].every(Boolean);
  if (!ok) return;
  console.log('Message ready to send to your backend:', { name: v('c-name').value, email: v('c-email').value, message: v('c-msg').value });
  cf.style.display = 'none';
  document.getElementById('sent').style.display = 'block';
};
