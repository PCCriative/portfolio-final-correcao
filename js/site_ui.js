/* eslint-disable no-undef */
// Funções de inicialização do UI
document.addEventListener('DOMContentLoaded', function() {
    // 1. Inicializa o Lazy Loading
    setupLazyLoading();

    // 2. Inicializa o Fancybox para galerias de imagens (se houver)
    // Fancybox já deve ser carregado via CDN no HTML
    
    // 3. Inicializa o layout Masonry APÓS TUDO CARREGAR
    // Isso garante que o script calcule o alinhamento correto das imagens.
    window.addEventListener('load', function() {
        initializeMasonryLayout();
    });

    // 4. Inicializa o filtro de álbuns (se houver)
    setupAlbumFilter();
});

// Implementação do Lazy Loading para todas as imagens com a classe lazy-image
function setupLazyLoading() {
    const lazyImages = document.querySelectorAll('.lazy-image');
    
    // Fallback para navegadores sem Intersection Observer
    if (!('IntersectionObserver' in window)) {
        lazyImages.forEach(img => {
            img.src = img.dataset.src;
            img.classList.remove('lazy-image');
        });
        return;
    }

    const imageObserver = new IntersectionObserver(function(entries, observer) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy-image');
                observer.unobserve(img);
            }
        });
    });

    lazyImages.forEach(function(img) {
        imageObserver.observe(img);
    });
}

// Implementação do Layout Masonry (Galeria de Imagens)
function initializeMasonryLayout() {
    const grid = document.querySelector('.album-grid-images');
    if (grid) {
        new Masonry(grid, {
            itemSelector: 'a', // Seleciona os links <a> que envolvem as imagens
            columnWidth: 'a',
            gutter: 10,
            percentPosition: true
        });
    }
    
    // Tenta inicializar o Fancybox novamente se necessário, após o layout
    // Fancybox.bind('[data-gallery="aniversario_maria_clara"]'); 
    // Outras inicializações de lightbox aqui
}

// Implementação do filtro de álbuns (se houver)
function setupAlbumFilter() {
    // Código do filtro (se houver)
}