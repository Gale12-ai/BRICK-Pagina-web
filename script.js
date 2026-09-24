const menuButton = document.querySelector('.menu-toggle');
const nav = document.querySelector('.nav-links');

menuButton.addEventListener('click', () => {
  const open = nav.classList.toggle('open');
  menuButton.setAttribute('aria-expanded', String(open));
  menuButton.setAttribute('aria-label', open ? 'Cerrar menú' : 'Abrir menú');
  document.body.style.overflow = open ? 'hidden' : '';
});

nav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
  nav.classList.remove('open');
  menuButton.setAttribute('aria-expanded', 'false');
  document.body.style.overflow = '';
}));

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    entry.target.classList.add('visible');
    observer.unobserve(entry.target);
  });
}, { threshold: 0.14 });

document.querySelectorAll('.reveal').forEach(element => observer.observe(element));

const countObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    const target = Number(entry.target.dataset.count);
    const duration = 1100;
    const start = performance.now();
    const tick = now => {
      const progress = Math.min((now - start) / duration, 1);
      entry.target.textContent = Math.round(target * (1 - Math.pow(1 - progress, 3)));
      if (progress < 1) requestAnimationFrame(tick);
      else if (target === 360) entry.target.textContent += '°';
    };
    requestAnimationFrame(tick);
    countObserver.unobserve(entry.target);
  });
}, { threshold: .5 });

document.querySelectorAll('[data-count]').forEach(element => countObserver.observe(element));

const form = document.querySelector('#contact-form');
const status = form.querySelector('.form-status');
form.addEventListener('submit', event => {
  event.preventDefault();
  status.textContent = '';
  let valid = true;
  form.querySelectorAll('[required]').forEach(field => {
    const fieldValid = field.type === 'email' ? /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(field.value.trim()) : field.value.trim().length > 0;
    field.closest('.field').classList.toggle('invalid', !fieldValid);
    valid = valid && fieldValid;
  });
  if (!valid) return;
  const name = form.elements.name.value.trim().split(' ')[0];
  status.textContent = `Gracias, ${name}. Tu solicitud está lista; conectaremos el envío cuando definas el correo receptor.`;
  form.reset();
});

form.querySelectorAll('input, textarea').forEach(field => field.addEventListener('input', () => field.closest('.field').classList.remove('invalid')));
document.querySelector('#year').textContent = new Date().getFullYear();
