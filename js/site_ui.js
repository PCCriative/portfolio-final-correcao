/* eslint-disable no-undef */

// Funções de inicialização do UI
document.addEventListener('DOMContentLoaded', function() {
    // 1. Inicializa o Lazy Loading
    setupLazyLoading();

    // 2. Inicializa o layout Masonry APÓS TUDO CARREGAR
    initializeMasonryLayout();

    // 3. Inicializa o filtro de álbuns (se houver)
    setupAlbumFilter();
});

// Implementação do Lazy Loading para todas as imagens com data-src
function setupLazyLoading() {
    // Busca todas as imagens que usam o placeholder (data-src e o gif base64)
    const lazyImages = document.querySelectorAll('.album-grid-images a img');
    
    // Configuração do Intersection Observer
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver(function(entries, observer) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    
                    // Ação crítica: Copia o data-src (foto real) para o src (placeholder)
                    img.src = img.dataset.src; 
                    
                    // Remove os atributos de placeholder após o carregamento
                    img.removeAttribute('data-src');
                    img.classList.remove('lazy-image');
                    
                    observer.unobserve(img);
                }
            });
        }, {
            // O margin root determina a distância antes do elemento entrar na tela
            rootMargin: '0px 0px 50px 0px' 
        });

        lazyImages.forEach(function(img) {
            imageObserver.observe(img);
        });
    } else {
        // Fallback simples para navegadores mais antigos (carrega todas as fotos)
        lazyImages.forEach(img => {
            img.src = img.dataset.src;
        });
    }
}

// Implementação do Layout Masonry (Galeria de Imagens)
function initializeMasonryLayout() {
    const grid = document.querySelector('.album-grid-images');
    if (grid) {
        // O Masonry deve ser inicializado APENAS DEPOIS que a página carregar (incluindo imagens).
        window.addEventListener('load', function() {
            new Masonry(grid, {
                itemSelector: 'a', 
                columnWidth: 'a',
                gutter: 10,
                percentPosition: true
            });
        });
    }
}

// Implementação do filtro de álbuns (se houver)
function setupAlbumFilter() {
    // Seu código de filtro de álbuns original (não alterado)
}