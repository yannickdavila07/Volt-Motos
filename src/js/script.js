// DADOS DOS PRODUTOS

const produtos = [
  {
    id: 1,
    nome: "Voltz EV1 Sport",
    categoria: "Veículo Elétrico",
    descricao: "Uma das scooters elétricas mais populares do Brasil, com proposta puramente urbana.",
    preco: 15000,
    imagem: "src/assets/moto1.jpg"
  },
  {
    id: 2,
    nome: "Watts W125",
    categoria: "Veículo Elétrico",
    descricao: "Um modelo com visual mais robusto e 'esportivo', que concorre diretamente na categoria de motos de 125cc equivalentes.",
    preco: 18500,
    imagem: "src/assets/moto2.webp"
  },
  {
    id: 3,
    nome: "Voltz EVS",
    categoria: "Veículo Elétrico",
    descricao: "A moto de estilo street da Voltz, que foi pensada para ser a equivalente elétrica de modelos tradicionais do dia a dia.",
    preco: 11600,
    imagem: "src/assets/moto3.jpg"
  },
  {
    id: 4,
    nome: "Shineray SHE S",
    categoria: "Veículo Elétrico",
    descricao: "Uma scooter com linhas bem futuristas e minimalistas, focada em deslocamento ágil nas cidades.",
    preco: 19000,
    imagem: "src/assets/moto4.webp"
  },
  {
    id: 5,
    nome: "Scooter Elétrica JET 1000W",
    categoria: "Veículo Elétrico",
    descricao: "A JET 1000W é uma scooter elétrica compacta e minimalista, projetada especificamente para deslocamentos urbanos rápidos e de curta distância.",
    preco: 11000,
    imagem: "src/assets/moto5.webp"
  }
];


// FORMATAÇÃO DE MOEDA

function formatarMoeda(valor) {
  return valor.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  });
}


// INDEX.HTML — RENDERIZAR CARDS VIA DOM

function renderizarProdutos() {
  const grade = document.getElementById('grade-produtos');
  if (!grade) return;

  grade.innerHTML = '';

  produtos.forEach(produto => {
    const card = document.createElement('article');
    card.classList.add('card-produto');

    card.innerHTML = `
      <img src="${produto.imagem}" alt="${produto.nome}" loading="lazy" />
      <div class="card-info">
        <p class="card-categoria">${produto.categoria}</p>
        <h2 class="card-nome">${produto.nome}</h2>
        <p class="card-descricao">${produto.descricao}</p>
        <div class="card-rodape">
          <span class="card-preco">${formatarMoeda(produto.preco)}</span>
          <button class="btn-comprar" onclick="mostrarNotificacao('${produto.nome}')">
            Comprar
          </button>
        </div>
      </div>
    `;

    grade.appendChild(card);
  });
}


// NOTIFICAÇÃO TOAST

function mostrarNotificacao(nome) {
  let notif = document.getElementById('notificacao');
  if (!notif) {
    notif = document.createElement('div');
    notif.id = 'notificacao';
    notif.classList.add('notificacao');
    document.body.appendChild(notif);
  }

  notif.textContent = `✓ "${nome}" adicionado ao carrinho!`;
  notif.classList.add('visivel');

  setTimeout(() => {
    notif.classList.remove('visivel');
  }, 2500);
}

// LOJA.HTML — CARRINHO COM REDUCE + DOM

const carrinho = [
  { nome: "Voltz EV1 Sport",             qtd: 1, preco: 15000,  imagem: "/src/assets/moto1.jpg" },
  { nome: "Watts W125",                qtd: 1, preco: 18500, imagem: "/src/assets/moto2.webp" },
  { nome: "Voltz EVS",qtd: 1, preco: 11600,  imagem: "/src/assets/moto3.jpg" },
  { nome: "Shineray SHE S",       qtd: 1, preco: 19000, imagem: "/src/assets/moto4.webp" },
  { nome: "Scooter Elétrica JET 1000W",          qtd: 1, preco: 11000,  imagem: "/src/assets/moto5.webp" },
];


let totalAtual = 0;
let descontoAplicado = false;

// Calcula o total usando Array.reduce
function calcularTotal(itens) {
  return itens.reduce((acumulador, item) => {
    return acumulador + (item.preco * item.qtd);
  }, 0);
}

// Renderiza os itens do carrinho no DOM
function renderizarCarrinho() {
  const lista = document.getElementById('lista-carrinho');
  if (!lista) return;

  lista.innerHTML = '';

  carrinho.forEach(item => {
    const li = document.createElement('li');
    li.classList.add('item-carrinho');

    li.innerHTML = `
      <img class="item-img" src="${item.imagem}" alt="${item.nome}" />
      <div>
        <p class="item-nome">${item.nome}</p>
        <p class="item-qtd">Qtd: ${item.qtd}</p>
      </div>
      <span class="item-preco">${formatarMoeda(item.preco * item.qtd)}</span>
    `;

    lista.appendChild(li);
  });

  // Atualiza o total no DOM usando Reduce
  totalAtual = calcularTotal(carrinho);
  atualizarExibicaoTotal(totalAtual);
}

// Atualiza o elemento <span> ou <h2> com o total formatado
function atualizarExibicaoTotal(valor) {
  const spanTotal = document.getElementById('total-compra');
  if (spanTotal) {
    spanTotal.textContent = formatarMoeda(valor);
  }

  const spanSubtotal = document.getElementById('subtotal');
  if (spanSubtotal) {
    spanSubtotal.textContent = formatarMoeda(calcularTotal(carrinho));
  }
}

// Aplica desconto de 10% usando Reduce ou manipulação do resultado anterior
function aplicarDesconto() {
  if (descontoAplicado) return;

  // Usando Reduce para calcular o total com desconto aplicado em cada item
  const totalComDesconto = carrinho.reduce((acumulador, item) => {
    const precoComDesconto = item.preco * item.qtd * 0.9; // 10% de desconto
    return acumulador + precoComDesconto;
  }, 0);

  totalAtual = totalComDesconto;
  descontoAplicado = true;

  // Atualiza o DOM
  atualizarExibicaoTotal(totalAtual);

  // Atualiza UI do botão
  const btn = document.getElementById('btn-desconto');
  if (btn) {
    btn.disabled = true;
    btn.innerHTML = `✓ Desconto de 10% aplicado! <span class="badge-desconto">-10%</span>`;
  }

  // Exibe linha de desconto
  const linhaDesconto = document.getElementById('linha-desconto');
  if (linhaDesconto) {
    const valorDesconto = calcularTotal(carrinho) - totalAtual;
    linhaDesconto.style.display = 'flex';
    linhaDesconto.querySelector('span:last-child').textContent = `- ${formatarMoeda(valorDesconto)}`;
    linhaDesconto.querySelector('span:last-child').style.color = 'var(--cor-desconto)';
  }
}


// INICIALIZAÇÃO — detecta a página atual

document.addEventListener('DOMContentLoaded', () => {
  // Index — renderiza produtos (com suporte a filtro)
  filtrarProdutos();

  // Loja — renderiza carrinho
  renderizarCarrinho();

  // Botão de desconto
  const btnDesconto = document.getElementById('btn-desconto');
  if (btnDesconto) {
    btnDesconto.addEventListener('click', aplicarDesconto);
  }

  // Marca nav ativo
  const links = document.querySelectorAll('nav a');
  links.forEach(link => {
    if (link.href === window.location.href) {
      link.classList.add('ativo');
    }
  });
});

// FILTRO E BUSCA — INDEX.HTML

function filtrarProdutos() {
  const termo = document.getElementById('campo-busca')?.value.toLowerCase() ?? '';
  const ordem = document.getElementById('select-ordem')?.value ?? 'padrao';

  let lista = [...produtos];

  // Filtra por termo de busca
  if (termo) {
    lista = lista.filter(p =>
      p.nome.toLowerCase().includes(termo) ||
      p.descricao.toLowerCase().includes(termo)
    );
  }

  // Ordena
  if (ordem === 'menor') {
    lista.sort((a, b) => a.preco - b.preco);
  } else if (ordem === 'maior') {
    lista.sort((a, b) => b.preco - a.preco);
  }

  const grade = document.getElementById('grade-produtos');
  const semResultados = document.getElementById('sem-resultados');
  const termoBuscado = document.getElementById('termo-buscado');

  if (!grade) return;

  if (lista.length === 0) {
    grade.innerHTML = '';
    if (semResultados) {
      semResultados.style.display = 'block';
      if (termoBuscado) termoBuscado.textContent = termo;
    }
    return;
  }

  if (semResultados) semResultados.style.display = 'none';

  grade.innerHTML = '';
  lista.forEach(produto => {
    const card = document.createElement('article');
    card.classList.add('card-produto');
    card.innerHTML = `
      <img src="${produto.imagem}" alt="${produto.nome}" loading="lazy" />
      <div class="card-info">
        <p class="card-categoria">${produto.categoria}</p>
        <h2 class="card-nome">${produto.nome}</h2>
        <p class="card-descricao">${produto.descricao}</p>
        <div class="card-rodape">
          <span class="card-preco">${formatarMoeda(produto.preco)}</span>
          <button class="btn-comprar" onclick="mostrarNotificacao('${produto.nome}')">
            Comprar
          </button>
        </div>
      </div>
    `;
    grade.appendChild(card);
  });
}


// NEWSLETTER

function assinarNewsletter(event) {
  event.preventDefault();
  const input = event.target.querySelector('input[type="email"]');
  const email = input?.value;
  if (!email) return;

  let notif = document.getElementById('notificacao');
  if (!notif) {
    notif = document.createElement('div');
    notif.id = 'notificacao';
    notif.classList.add('notificacao');
    document.body.appendChild(notif);
  }

  notif.textContent = `✓ "${email}" inscrito com sucesso!`;
  notif.classList.add('visivel');
  input.value = '';

  setTimeout(() => notif.classList.remove('visivel'), 3000);
}
