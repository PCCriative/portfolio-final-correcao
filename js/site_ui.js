/* eslint-disable no-undef */

// Funções de inicialização do UI

document.addEventListener('DOMContentLoaded', function() {
    // 1. Inicializa o Lazy Loading
    setupLazyLoading();

    // ** LINHA ADICIONAL OBRIGATÓRIA AQUI! **
    initializeCarousel(); 

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
// NOVO CÓDIGO: Inicialização e Lógica do Carrossel (Slideshow)
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
        items[0].classList.add('active');
    }

    let currentIndex = 0;

    function updateCarousel() {
        if (items.length === 0) return;
        
        // Lógica de Rotação
        const itemWidth = items[0].clientWidth;
        inner.style.transform = `translateX(${-currentIndex * itemWidth}px)`;
        
        // Aplica o Lazy Loading para a foto atual
        loadItemImage(items[currentIndex]);
    }

    function goToSlide(index) {
        currentIndex = (index + items.length) % items.length; // Garante o loop
        updateCarousel();
    }
    
    // Função local de Lazy Loading para a imagem de capa (se usar data-src)
    function loadItemImage(item) {
        const img = item.querySelector('img');
        if (img && img.dataset.src) {
            img.src = img.dataset.src;
            img.removeAttribute('data-src'); 
        }
    }

    // Conecta a Navegação se os botões existirem
    if (prevButton && nextButton) {
        prevButton.addEventListener('click', () => {
            goToSlide(currentIndex - 1);
        });

        nextButton.addEventListener('click', () => {
            goToSlide(currentIndex + 1);
        });
    }

    // Inicia o Carrossel
    window.addEventListener('resize', updateCarousel);
    
    // Carrega a primeira imagem imediatamente
    items.forEach(loadItemImage); 
    
    // Inicializa o posicionamento
    updateCarousel();

    // Opcional: Auto-play
    setInterval(() => {
        goToSlide(currentIndex + 1);
    }, 5000); 
}
