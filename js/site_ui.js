document.addEventListener('DOMContentLoaded', function(){
    // Carousel
    const carInner = document.querySelector('.carousel-inner');
    if(carInner){
        const items = carInner.children;
        let idx = 0;
        function update(){ carInner.style.transform = 'translateX(' + (-idx*100) + '%)'; }
        document.querySelectorAll('.carousel-button.prev').forEach(b=>b.addEventListener('click', ()=>{ idx = (idx-1+items.length)%items.length; update(); }));
        document.querySelectorAll('.carousel-button.next').forEach(b=>b.addEventListener('click', ()=>{ idx = (idx+1)%items.length; update(); }));
        // Inicia a troca automática apenas se houver mais de um item
        if (items.length > 1) {
            setInterval(()=>{ idx = (idx+1)%items.length; update(); }, 5000);
        }
    }
    // Lightbox
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.innerHTML = '<button class="close">✖</button><img src="" alt="view">';
    document.body.appendChild(lightbox);
    const lbImg = lightbox.querySelector('img');
    const closeBtn = lightbox.querySelector('.close');
    closeBtn.addEventListener('click', ()=> lightbox.style.display='none');

    let srcs = [];
    let current = 0;

    document.body.addEventListener('click', function(e){
        const a = e.target.closest('a[data-gallery]');
        if(!a) return;
        e.preventDefault();
        const galleryName = a.getAttribute('data-gallery');
        const nodes = Array.from(document.querySelectorAll('a[data-gallery="' + galleryName + '"]'));
        srcs = nodes.map(n=>n.href);
        let idx = nodes.indexOf(a);

        function show(i){ 
            lbImg.src = srcs[i]; 
            // Atualiza o texto ALT/Caption
            const imgElement = nodes[i].querySelector('img');
            lbImg.alt = imgElement ? imgElement.alt : ''; 
            lightbox.style.display='flex'; 
            current = i; 
        }
        show(idx);

        // Navegação ao clicar na imagem
        lbImg.onclick = function(){ 
            current = (current+1) % srcs.length; 
            show(current); 
        };
    });

    // IMPLEMENTAÇÃO DO SWIPE/ARRRASTO
    let startX = 0;

    lightbox.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
    });

    lightbox.addEventListener('touchend', (e) => {
        const endX = e.changedTouches[0].clientX;
        const diffX = startX - endX;

        // Se o movimento for maior que 50px (tolerância para um deslize intencional)
        if (lightbox.style.display === 'flex' && Math.abs(diffX) > 50) {
            if (diffX > 0) {
                current = (current + 1) % srcs.length;
            } else {
                current = (current - 1 + srcs.length) % srcs.length;
            }
            // Chama a função para mostrar a nova imagem
            const imgElement = document.querySelector('a[data-gallery] img[src="' + srcs[current] + '"]');
            lbImg.src = srcs[current];
            lbImg.alt = imgElement ? imgElement.alt : '';
        }
    });

    // Suporte a navegação por teclado (Esc, Seta Esquerda/Direita)
    document.addEventListener('keydown', function(e){
        if(lightbox.style.display === 'flex'){
            if(e.key === 'ArrowLeft'){ // Seta Esquerda
                current = (current-1 + srcs.length) % srcs.length;
                lbImg.src = srcs[current];
            } else if(e.key === 'ArrowRight'){ // Seta Direita
                current = (current+1) % srcs.length;
                lbImg.src = srcs[current];
            } else if(e.key === 'Escape'){ // Tecla ESC
                lightbox.style.display = 'none';
            }
        }
    });

    // ===================================================
    // NOVO CÓDIGO: LAZY LOADING (CARREGAMENTO PREGUIÇOSO)
    // ===================================================
    const lazyImages = document.querySelectorAll('img[data-src]');

    if ('IntersectionObserver' in window) {
        const lazyLoadObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    observer.unobserve(img);
                }
            });
        });

        lazyImages.forEach(img => lazyLoadObserver.observe(img));
    } else {
        // Fallback: carrega todas as imagens se o navegador for muito antigo
        lazyImages.forEach(img => {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
        });
    }
});