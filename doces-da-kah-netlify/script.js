const menuToggle = document.getElementById('menuToggle');
const mainNav = document.getElementById('mainNav');

if (menuToggle && mainNav) {
  menuToggle.addEventListener('click', () => {
    const open = mainNav.classList.toggle('open');
    menuToggle.setAttribute('aria-expanded', String(open));
    menuToggle.textContent = open ? '×' : '☰';
  });

  mainNav.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
    mainNav.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.textContent = '☰';
  }));
}

const yearElement = document.getElementById('year');
if (yearElement) yearElement.textContent = new Date().getFullYear();

const WHATSAPP_NUMBER = '5591981075813';
const toast = document.getElementById('toast');

function escapeHTML(value = '') {
  return String(value).replace(/[&<>"']/g, ch => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[ch]);
}

function orderButton(product, price, label) {
  return `<button class="button order-button" data-product="${escapeHTML(product)}" data-price="${escapeHTML(price)}">${escapeHTML(label || 'Encomendar')} <span>→</span></button>`;
}

function getProductImages(product) {
  // Aceita várias fotos em "images" e mantém compatibilidade com o campo antigo "image".
  const images = Array.isArray(product.images)
    ? product.images.filter(image => typeof image === 'string' && image.trim())
    : [];
  if (images.length) return images;
  return product.image ? [product.image] : [];
}

function renderGallery(product, productIndex) {
  const images = getProductImages(product);
  if (!images.length) return '';

  const thumbnails = images.length > 1
    ? `<div class="product-gallery-thumbnails" aria-label="Escolher foto">
        ${images.map((src, imageIndex) => `
          <button type="button"
            class="gallery-thumb${imageIndex === 0 ? ' is-active' : ''}"
            data-gallery-product="${productIndex}"
            data-gallery-image="${imageIndex}"
            aria-label="Mostrar foto ${imageIndex + 1} de ${images.length}"
            aria-pressed="${imageIndex === 0}">
            <img src="${escapeHTML(src)}" alt="" loading="lazy">
          </button>`).join('')}
      </div>`
    : '';

  return `<div class="product-gallery" data-product-gallery="${productIndex}" data-current-image="0">
    <div class="product-gallery-main">
      <img class="managed-card-image gallery-main-image"
        src="${escapeHTML(images[0])}"
        alt="${escapeHTML(product.name || 'Foto do produto')}"
        loading="lazy">
      ${images.length > 1 ? `
        <button type="button" class="gallery-arrow gallery-prev"
          data-gallery-step="-1" data-gallery-product="${productIndex}"
          aria-label="Foto anterior">‹</button>
        <button type="button" class="gallery-arrow gallery-next"
          data-gallery-step="1" data-gallery-product="${productIndex}"
          aria-label="Próxima foto">›</button>
        <span class="gallery-counter">1 / ${images.length}</span>` : ''}
    </div>
    ${thumbnails}
  </div>`;
}

function renderProduct(product, productIndex) {
  const details = Array.isArray(product.details) ? product.details : [];
  const sizes = Array.isArray(product.sizes) ? product.sizes : [];
  return `<article class="managed-card">
    ${renderGallery(product, productIndex)}
    <div class="managed-card-body">
      <span class="product-tag">${escapeHTML(product.tag || product.category || 'DOCES DA KAH')}</span>
      <h3>${escapeHTML(product.name)}</h3>
      <p>${escapeHTML(product.description || '')}</p>
      ${sizes.length ? `<div class="managed-details"><strong>Tamanhos e opções</strong><ul>${sizes.map(x => `<li>${escapeHTML(x)}</li>`).join('')}</ul></div>` : ''}
      ${details.length ? `<div class="managed-details"><strong>${escapeHTML(product.details_title || 'Detalhes')}</strong><ul>${details.map(x => `<li>${escapeHTML(x)}</li>`).join('')}</ul></div>` : ''}
      <div class="managed-price">${escapeHTML(product.price || 'Consulte')}</div>
      ${orderButton(product.name || 'Produto', product.price || 'Consultar', product.button)}
    </div>
  </article>`;
}

function showGalleryImage(productIndex, imageIndex) {
  const gallery = document.querySelector(`[data-product-gallery="${productIndex}"]`);
  if (!gallery) return;

  const productImages = gallery.querySelectorAll('.gallery-thumb');
  const mainImage = gallery.querySelector('.gallery-main-image');
  const counter = gallery.querySelector('.gallery-counter');
  const images = Array.from(productImages).map(button => button.querySelector('img').getAttribute('src'));

  if (!images.length) return;
  const safeIndex = (imageIndex + images.length) % images.length;
  mainImage.src = images[safeIndex];
  gallery.dataset.currentImage = String(safeIndex);

  productImages.forEach((button, index) => {
    const active = index === safeIndex;
    button.classList.toggle('is-active', active);
    button.setAttribute('aria-pressed', String(active));
  });

  if (counter) counter.textContent = `${safeIndex + 1} / ${images.length}`;
}

function attachGalleryControls() {
  document.querySelectorAll('[data-gallery-image]').forEach(button => {
    button.addEventListener('click', () => {
      showGalleryImage(Number(button.dataset.galleryProduct), Number(button.dataset.galleryImage));
    });
  });

  document.querySelectorAll('[data-gallery-step]').forEach(button => {
    button.addEventListener('click', () => {
      const productIndex = Number(button.dataset.galleryProduct);
      const gallery = document.querySelector(`[data-product-gallery="${productIndex}"]`);
      const current = Number(gallery?.dataset.currentImage || 0);
      showGalleryImage(productIndex, current + Number(button.dataset.galleryStep));
    });
  });
}

async function loadProducts() {
  const target = document.getElementById('productsGrid');
  if (!target) return;

  try {
    const response = await fetch('/data/catalogo.json', { cache: 'no-store' });
    if (!response.ok) throw new Error('Não foi possível carregar o catálogo');
    const data = await response.json();
    target.innerHTML = (data.products || []).map((product, index) => renderProduct(product, index)).join('')
      || '<p class="loading-products">Em breve teremos novidades!</p>';
    attachGalleryControls();
    attachOrderButtons();
  } catch (error) {
    target.innerHTML = '<p class="loading-products">Não foi possível carregar o catálogo agora. Tente novamente mais tarde.</p>';
  }
}


function attachOrderButtons() {
  document.querySelectorAll('.order-button').forEach(button => {
    button.addEventListener('click', () => {

      const produto = button.dataset.product;
      const preco = button.dataset.price;

      const tamanho = prompt('Qual tamanho você deseja?');
      if (tamanho === null) return;

      const sabor = prompt('Qual sabor você deseja?');
      if (sabor === null) return;

      const quantidade = prompt('Qual a quantidade desejada?', '1');
      if (quantidade === null || !quantidade.trim()) return;

      const data = prompt('Para qual data deseja a encomenda?');
      if (data === null) return;

      const message =
`Olá! 💗 Vim pelo site da Doces da Kah!

Gostaria de fazer uma encomenda:

🧁 Produto: ${produto}
💰 Valor: ${preco}
📏 Tamanho: ${tamanho}
🍓 Sabor: ${sabor}
📦 Quantidade: ${quantidade}
📅 Data desejada: ${data}

Gostaria de confirmar a disponibilidade.

Obrigada! ❤️`;

      if (toast) toast.classList.add('show');

     window.open(
  `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`,
  '_blank',
  'noopener'
);

      window.setTimeout(() => {
        if (toast) toast.classList.remove('show');
      }, 2600);

    });
  });
}


loadProducts();
