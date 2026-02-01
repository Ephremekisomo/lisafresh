// JS amélioré : menu mobile, modale produit et carrousel témoignages
document.addEventListener('DOMContentLoaded', ()=>{
  const menuToggle = document.getElementById('menu-toggle');
  const mainNav = document.getElementById('main-nav');
  menuToggle?.addEventListener('click', ()=>{ mainNav.classList.toggle('open'); });

  // Modale produit
  const productViewButtons = document.querySelectorAll('.btn-view');
  const modal = document.getElementById('product-modal');
  const modalImage = document.getElementById('modal-image');
  const modalTitle = document.getElementById('modal-title');
  const modalPrice = document.getElementById('modal-price');
  const modalDesc = document.getElementById('modal-desc');
  const modalClose = document.getElementById('modal-close');
  const modalBackdrop = document.getElementById('modal-backdrop');

  productViewButtons.forEach(btn=>{
    btn.addEventListener('click', ()=>{
      modalImage.src = btn.dataset.image;
      modalImage.alt = btn.dataset.title;
      modalTitle.textContent = btn.dataset.title;
      modalPrice.textContent = btn.dataset.price;
      modalDesc.textContent = btn.dataset.desc || '';
      modal.setAttribute('aria-hidden','false');
      document.body.style.overflow='hidden';
      modal.classList.add('open');
    });
  });
  function closeModal(){
    modal.setAttribute('aria-hidden','true');
    document.body.style.overflow='';
    modal.classList.remove('open');
  }
  modalClose?.addEventListener('click', closeModal);
  modalBackdrop?.addEventListener('click', closeModal);
  document.addEventListener('keydown', e=>{ if(e.key==='Escape') closeModal(); });

  // Témoignages - slider simple avec support tactile
  const track = document.querySelector('.testi-track');
  const slides = track?.querySelectorAll('.testi');
  const prev = document.querySelector('.testi-prev');
  const next = document.querySelector('.testi-next');
  const dotsContainer = document.querySelector('.testi-dots');
  const viewport = document.querySelector('.testi-viewport');
  let current = 0;

  // créer les points de pagination dynamiquement
  function initDots(){
    if(!slides || !dotsContainer) return;
    dotsContainer.innerHTML = '';
    slides.forEach((s, i)=>{
      const btn = document.createElement('button');
      btn.className = 'testi-dot';
      btn.setAttribute('aria-label', `Slide ${i + 1}`);
      btn.setAttribute('role', 'tab');
      btn.dataset.index = i;
      btn.addEventListener('click', ()=>{ showSlide(i); resetAutoplay(); });
      dotsContainer.appendChild(btn);
    });
    updateDots();
  }

  function updateDots(){
    if(!dotsContainer) return;
    const dots = dotsContainer.querySelectorAll('.testi-dot');
    dots.forEach((d, i)=>{
      const active = i === current;
      d.classList.toggle('active', active);
      d.setAttribute('aria-selected', active ? 'true' : 'false');
    });
  }

  function showSlide(index){
    if(!slides) return;
    current = (index + slides.length) % slides.length;
    track.style.transform = `translateX(-${current * 100}%)`;
    // appliquer la classe active à la slide visible pour permettre l'animation de fondu/scale
    slides.forEach((s,i)=> s.classList.toggle('active', i === current));
    updateDots();
  }

  prev?.addEventListener('click', ()=> { showSlide(current - 1); resetAutoplay(); });
  next?.addEventListener('click', ()=> { showSlide(current + 1); resetAutoplay(); });

  // autoplay (3s)
  let autoplay = setInterval(()=> showSlide(current + 1), 3000);
  function resetAutoplay(){ clearInterval(autoplay); autoplay = setInterval(()=> showSlide(current + 1), 3000); }

  [prev, next, track, dotsContainer].forEach(el=> el?.addEventListener('mouseover', ()=> clearInterval(autoplay)));
  [prev, next, track, dotsContainer].forEach(el=> el?.addEventListener('mouseout', ()=> autoplay = setInterval(()=> showSlide(current + 1), 3000)));

  // Support swipe/touch
  let startX = 0; let deltaX = 0; let isDown = false;
  const threshold = 45; // pixels
  function onPointerDown(e){
    isDown = true; startX = e.touches ? e.touches[0].clientX : e.clientX; deltaX = 0; clearInterval(autoplay);
  }
  function onPointerMove(e){
    if(!isDown) return; const x = e.touches ? e.touches[0].clientX : e.clientX; deltaX = x - startX;
  }
  function onPointerUp(){
    if(!isDown) return; isDown = false;
    if(Math.abs(deltaX) > threshold){
      if(deltaX < 0) showSlide(current + 1); else showSlide(current - 1);
    }
    resetAutoplay();
  }

  // Attach events (touch & mouse)
  viewport?.addEventListener('touchstart', onPointerDown, {passive:true});
  viewport?.addEventListener('touchmove', onPointerMove, {passive:true});
  viewport?.addEventListener('touchend', onPointerUp);
  viewport?.addEventListener('pointerdown', onPointerDown);
  viewport?.addEventListener('pointermove', onPointerMove);
  viewport?.addEventListener('pointerup', onPointerUp);
  viewport?.addEventListener('pointercancel', onPointerUp);

  // ensure current slide visible on resize
  window.addEventListener('resize', ()=> showSlide(current));

  // initialisation
  initDots();
  showSlide(0);

  // Toast de confirmation et bouton contact flottant
  const buyButtons = document.querySelectorAll('.btn-buy');
  const toast = document.getElementById('toast');
  const toastMessage = document.getElementById('toast-message');
  const toastContact = document.getElementById('toast-contact');
  const toastClose = document.getElementById('toast-close');
  const waUrl = 'https://wa.me/243833189272?text=Bonjour%2C%20je%20souhaite%20des%20informations%20sur%20vos%20produits.';
  let toastTimer = null;

  function showToast(text){
    if(!toast) return;
    toastMessage.textContent = text;
    toast.hidden = false;
    toast.setAttribute('aria-hidden','false');
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(()=>{ hideToast(); }, 4000);
  }
  function hideToast(){
    if(!toast) return;
    toast.classList.remove('show');
    toast.hidden = true;
    toast.setAttribute('aria-hidden','true');
    clearTimeout(toastTimer);
  }

  buyButtons.forEach(btn=>{
    btn.addEventListener('click', (e)=>{
      e.preventDefault();
      // message demandé par l'utilisateur
      showToast("Merci ! Produit ajouté au panier. Je suis content de m'avoir ajouté — contactez-nous via le bouton Contact en bas de l'écran.");
    });
  });

  toastContact?.addEventListener('click', ()=>{ window.open(waUrl,'_blank'); });
  toastClose?.addEventListener('click', hideToast);

  // fermer le toast au clic ailleurs pour mobile
  toast?.addEventListener('touchstart', ()=> hideToast());

  // Contact form (dev behavior)
  const form = document.querySelector('.contact-form');
  if(form){
    form.addEventListener('submit', ()=>{
      alert('Merci ! Votre message sera envoyé via votre application e-mail par défaut.');
    });
  }
});