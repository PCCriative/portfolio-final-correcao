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
});