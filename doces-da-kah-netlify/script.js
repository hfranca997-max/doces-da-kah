const menuToggle = document.getElementById('menuToggle');
const mainNav = document.getElementById('mainNav');
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
document.getElementById('year').textContent = new Date().getFullYear();

const WHATSAPP_NUMBER = '5591981075813';
const toast = document.getElementById('toast');

function escapeHTML(value = '') {
  return String(value).replace(/[&<>"']/g, ch => ({
    '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;'
  })[ch]);
}
function orderButton(product, price, label) {
  return `<button class="button order-button" data-product="${escapeHTML(product)}" data-price="${escapeHTML(price)}">${escapeHTML(label || 'Encomendar')} <span>→</span></button>`;
}
function renderProduct(product) {
  const image = product.image || '';
  const details = Array.isArray(product.details) ? product.details : [];
  const sizes = Array.isArray(product.sizes) ? product.sizes : [];
  return `<article class="managed-card">
    <img class="managed-card-image" src="${escapeHTML(image)}" alt="${escapeHTML(product.name)}" loading="lazy">
    <div class="managed-card-body">
      <span class="product-tag">${escapeHTML(product.tag || product.category || 'DOCES DA KAH')}</span>
      <h3>${escapeHTML(product.name)}</h3>
      <p>${escapeHTML(product.description || '')}</p>
      ${sizes.length ? `<div class="managed-details"><strong>Tamanhos e opções</strong><ul>${sizes.map(x=>`<li>${escapeHTML(x)}</li>`).join('')}</ul></div>` : ''}
      ${details.length ? `<div class="managed-details"><strong>${escapeHTML(product.details_title || 'Detalhes')}</strong><ul>${details.map(x=>`<li>${escapeHTML(x)}</li>`).join('')}</ul></div>` : ''}
      <div class="managed-price">${escapeHTML(product.price || 'Consulte')}</div>
      ${orderButton(product.name || 'Produto', product.price || 'Consultar', product.button)}
    </div>
  </article>`;
}
async function loadProducts() {
  const target = document.getElementById('productsGrid');
  try {
    const response = await fetch('/data/catalogo.json', { cache: 'no-store' });
    if (!response.ok) throw new Error('Não foi possível carregar o catálogo');
    const data = await response.json();
    target.innerHTML = (data.products || []).map(renderProduct).join('') || '<p class="loading-products">Em breve teremos novidades!</p>';
    attachOrderButtons();
  } catch (error) {
    target.innerHTML = '<p class="loading-products">Não foi possível carregar o catálogo agora. Tente novamente mais tarde.</p>';
  }
}
function attachOrderButtons() {
  document.querySelectorAll('.order-button').forEach(button => {
    button.addEventListener('click', () => {
      const message = `Olá! Vim pelo site da Doces da Kah e gostaria de encomendar: ${button.dataset.product}. Pode me passar mais informações e disponibilidade?`;
      toast.classList.add('show');
      window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`, '_blank', 'noopener');
      window.setTimeout(() => toast.classList.remove('show'), 2600);
    });
  });
}
loadProducts();
