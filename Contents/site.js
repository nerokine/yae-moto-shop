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
