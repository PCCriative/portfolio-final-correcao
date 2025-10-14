// Funções de inicialização do UI
// Usa 'load' para garantir que TUDO, incluindo Lightbox e Masonry, rode por último
window.addEventListener('load', function() {
    // 1. Inicializa o Lazy Loading
    setupLazyLoading();

    // 2. Tenta o Lightbox AGORA, depois que todos os elementos estão na tela
    setupLightbox();
    
    // 3. Inicializa o carrossel
    initializeCarousel(); 
    
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
        
        // CORREÇÃO CRÍTICA: Força o itemWidth a ser a largura do contêiner
        const itemWidth = carousel.clientWidth;
        inner.style.transform = `translateX(${-currentIndex * itemWidth}px)`;
        
        // Aplica o Lazy Loading APENAS para a foto atual
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
    
    // Carrega APENAS a primeira imagem imediatamente
    loadItemImage(items[0]);
    
    // Inicializa o posicionamento
    updateCarousel();

    // Opcional: Auto-play
    setInterval(() => {
        goToSlide(currentIndex + 1);
    }, 5000); 
}


// NOVO CÓDIGO: Inicialização e Lógica do Lightbox com Navegação
function setupLightbox() {
    const lightbox = document.querySelector('.lightbox');
    const lightboxImg = lightbox ? lightbox.querySelector('img') : null;
    const closeButton = lightbox ? lightbox.querySelector('.close') : null;
    
    // Cria os botões de navegação no JavaScript
    const prevButton = document.createElement('button');
    prevButton.innerHTML = '❮';
    prevButton.className = 'lightbox-nav prev-lightbox';
    
    const nextButton = document.createElement('button');
    nextButton.innerHTML = '❯';
    nextButton.className = 'lightbox-nav next-lightbox';

    let currentImages = []; // Array de URLs das fotos do álbum atual
    let currentIndex = 0;   // Índice da foto atual

    if (lightbox) {
        // Anexa os botões ao Lightbox
        lightbox.appendChild(prevButton);
        lightbox.appendChild(nextButton);
    }
    
    // Função para abrir o lightbox
    document.querySelectorAll('.photo-grid a, .album-grid-images a').forEach((link) => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            // 1. Coleta todas as URLs do álbum clicado
            const parentGrid = link.closest('.photo-grid') || link.closest('.album-grid-images');
            currentImages = Array.from(parentGrid.querySelectorAll('a')).map(a => a.href);
            
            // 2. Encontra o índice da foto clicada
            currentIndex = currentImages.indexOf(this.href);

            // 3. Abre a foto no Lightbox
            showImage(currentIndex);
            
            lightbox.style.display = 'flex';
        });
    });

    // Função para exibir uma imagem específica
    function showImage(index) {
        if (lightboxImg && currentImages.length > 0) {
            // Garante o loop
            currentIndex = (index + currentImages.length) % currentImages.length;
            if (currentIndex < 0) {
                 currentIndex = currentImages.length - 1;
            }

            lightboxImg.src = currentImages[currentIndex];
        }
    }

    // Navegação (Próxima/Anterior)
    prevButton.addEventListener('click', () => {
        showImage(currentIndex - 1);
    });

    nextButton.addEventListener('click', () => {
        showImage(currentIndex + 1);
    });

    // Fechar o Lightbox
    if (closeButton) {
        closeButton.addEventListener('click', () => {
            lightbox.style.display = 'none';
        });
    }

    // Fechar com a tecla ESC
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightbox && lightbox.style.display === 'flex') {
            lightbox.style.display = 'none';
        }
    });
}