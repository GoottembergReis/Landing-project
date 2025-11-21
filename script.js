// script.js
document.addEventListener('DOMContentLoaded', () => {
    // year
    document.getElementById('ano').textContent = new Date().getFullYear();

    // AOS init
    AOS.init({ duration: 650, once: true });

    // Hero swiper
    const heroSwiper = new Swiper('.hero-swiper', {
        loop: true,
        autoplay: { delay: 3000 },
        speed: 900
    });

    // Depoimentos swiper
    const depoSwiper = new Swiper('.depo-swiper', {
        loop: true,
        autoplay: { delay: 4500 },
        pagination: { el: '.swiper-pagination', clickable: true },
        speed: 700
    });

    // Load portfolio & testimonials from API
    fetch('/api/portfolio').then(r => r.json()).then(data => {
        const grid = document.getElementById('portfolioGrid');
        if (!data || !data.length) {
            grid.innerHTML = '<p style="text-align:center;color:#999">Sem itens no portfólio ainda</p>';
            return;
        }
        grid.innerHTML = data.map(i => `
      <div class="item">
        <img src="${i.image}" alt="${i.title}">
      </div>
    `).join('');
    }).catch(() => { });

    fetch('/api/testimonials').then(r => r.json()).then(list => {
        const wrapper = document.getElementById('depoWrapper');
        if (!list || !list.length) {
            wrapper.innerHTML = '<div class="swiper-slide">Sem depoimentos ainda</div>';
            return;
        }
        wrapper.innerHTML = list.map(t => `
      <div class="swiper-slide">
        <blockquote>"${t.text}"<footer style="margin-top:8px;color:#ccc">— ${t.author} ${t.job ? '· ' + t.job : ''}</footer></blockquote>
      </div>
    `).join('');
        depoSwiper.update();
    }).catch(() => { });

    // Contact form submit
    const form = document.getElementById('contactForm');
    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const fd = new FormData(form);
        const body = {
            name: fd.get('name'),
            email: fd.get('email'),
            phone: fd.get('phone'),
            message: fd.get('message')
        };
        const msgEl = document.getElementById('contactMsg');
        msgEl.textContent = 'Enviando...';
        try {
            const res = await fetch('/api/contact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body)
            });
            const json = await res.json();
            if (json.ok) {
                msgEl.style.color = '#7bd389';
                msgEl.textContent = 'Mensagem enviada! Obrigado.';
                form.reset();
            } else {
                throw new Error(json.error || 'Erro');
            }
        } catch (err) {
            msgEl.style.color = '#ff6b6b';
            msgEl.textContent = 'Erro ao enviar. Tente novamente.';
        }
    });

});