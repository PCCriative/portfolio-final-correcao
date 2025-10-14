// Funções de inicialização do UI
// Usa 'load' para garantir que TUDO, incluindo Lightbox e Masonry, rode por último
window.addEventListener('load', function() {
    // 1. Inicializa o Lazy Loading
    setupLazyLoading();

    // 2. Tenta o Lightbox AGORA, depois que todos os elementos estão na tela
    setupLightbox();
    
    // 3. Inicializa o carrossel com um pequeno atraso para garantir o cálculo correto da largura (fix de 0px)
    setTimeout(initializeCarousel, 50); 
    
    // 4. Inicializa o filtro de álbuns (se houver)
    setupAlbumFilter();
});

// Implementação do Lazy Loading para todas as imagens com data-src (para as capas dos álbuns)
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

// CORREÇÃO APLICADA AQUI: Removida a chamada "items.forEach(loadItemImage);" na inicialização.
function initializeCarousel() {
    const carousel = document.querySelector('.carousel');
    if (!carousel) return;

    const inner = carousel.querySelector('.carousel-inner');
    const items = carousel.querySelectorAll('.carousel-item');
    
    // Assegura que o HTML tem as classes 'prev' e 'next' nos botões de navegação
    const prevButton = carousel.querySelector('.prev'); 
    const nextButton = carousel.querySelector('.next'); 

    // Garante que o primeiro item está visível e ativo (essencial para o CSS/layout)
    if (items.length > 0) {
        // Removido o item.classList.add('active') - o posicionamento é feito pelo transform/CSS agora.
        // Deixaremos o CSS e o JS cuidarem da visibilidade.
    }

    let currentIndex = 0;

    function updateCarousel() {
        if (items.length === 0) return;
        
        // CORREÇÃO FINAL: Usando getBoundingClientRect() para garantir a largura real
        const itemWidth = carousel.getBoundingClientRect().width;
        inner.style.transform = `translateX(${-currentIndex * itemWidth}px)`;
        
        // Aplica o Lazy Loading APENAS para a foto atual
        loadItemImage(items[currentIndex]);
    }

    function