
function mostrarCadastro() {
  const cadastro = document.getElementById('cadastro');
  cadastro.hidden = false;
  document.getElementById('nome').focus();
}

async function carregarProdutos() {
  const area = document.getElementById('produtos');

  area.innerHTML = '<p>Carregando produtos...</p>';

  try {
    const resposta = await fetch('/data/catalogo.json', {
      cache: 'no-store'
    });

    if (!resposta.ok) {
      throw new Error('Erro ao carregar catálogo');
    }

    const dados = await resposta.json();

    area.innerHTML = '<h2>Produtos cadastrados</h2>';

    (dados.products || []).forEach(produto => {
      const item = document.createElement('article');
      item.style.background = 'white';
      item.style.padding = '15px';
      item.style.marginBottom = '12px';
      item.style.borderRadius = '12px';

      const nome = document.createElement('h3');
      nome.textContent = produto.name || 'Produto';

      const preco = document.createElement('p');
      preco.textContent = produto.price || 'Consultar';

      item.append(nome, preco);
      area.appendChild(item);
    });

    if (!dados.products || !dados.products.length) {
      area.innerHTML += '<p>Nenhum produto encontrado.</p>';
    }

  } catch (erro) {
    area.textContent = 'Não foi possível carregar os produtos.';
  }
}
