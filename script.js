const rooms = [
  {
    id: 'adm',
    title: 'Bloco Administrativo',
    subtitle: 'Gestão acadêmica e atendimento',
    doorX: 120,
    summary:
      'Área de direção-geral, coordenações e setores de apoio ao estudante (registro acadêmico, assistência estudantil e protocolos).',
    details: [
      'Ponto de apoio para calendário, editais e serviços institucionais.',
      'Espaço onde normalmente ficam secretaria, gabinete, comunicação e TI administrativa.',
    ],
    chips: ['Atendimento', 'Secretaria', 'Gestão'],
  },
  {
    id: 'salas',
    title: 'Salas de Aula',
    subtitle: 'Ensino técnico e superior',
    doorX: 290,
    summary:
      'Conjunto de salas para cursos técnicos integrados e graduações, com projetor, quadro e recursos multimídia.',
    details: [
      'Cursos frequentemente associados ao campus: Agropecuária, Informática e Química (técnicos).',
      'Na graduação, o campus é reconhecido por formações ligadas às ciências agrárias e tecnologia.',
    ],
    chips: ['Técnico', 'Graduação', 'Multimídia'],
  },
  {
    id: 'labs',
    title: 'Laboratórios',
    subtitle: 'Ciência aplicada e prática profissional',
    doorX: 460,
    summary:
      'Ambientes para aulas práticas de informática, química, biologia e áreas agropecuárias, conectando teoria e aplicação.',
    details: [
      'Inclui espaços de experimentação, análise e desenvolvimento de projetos.',
      'Estrutura típica de campus agrícola: apoio a atividades de campo, produção e pesquisa.',
    ],
    chips: ['Química', 'Informática', 'Pesquisa'],
  },
  {
    id: 'biblioteca',
    title: 'Biblioteca',
    subtitle: 'Estudo, acervo e apoio à pesquisa',
    doorX: 630,
    summary:
      'Espaço para consulta local, empréstimo de livros, estudo individual/coletivo e suporte a bases acadêmicas.',
    details: [
      'Atende ensino médio técnico, graduação e pós, com obras didáticas e literárias.',
      'Costuma oferecer terminais de consulta, mesas de estudo e orientação de normalização.',
    ],
    chips: ['Acervo', 'Estudo', 'Empréstimo'],
  },
  {
    id: 'esporte',
    title: 'Área Esportiva',
    subtitle: 'Quadras e integração estudantil',
    doorX: 800,
    summary:
      'Setor para educação física, jogos e eventos estudantis, com quadras e espaços abertos de convivência.',
    details: [
      'Usado por turmas regulares e projetos de extensão.',
      'Apoia campeonatos internos e atividades de bem-estar.',
    ],
    chips: ['Quadras', 'Eventos', 'Qualidade de vida'],
  },
  {
    id: 'refeitorio',
    title: 'Refeitório e Convivência',
    subtitle: 'Alimentação e permanência estudantil',
    doorX: 970,
    summary:
      'Área de refeições e socialização essencial para a rotina do campus, sobretudo em jornada integral.',
    details: [
      'Relaciona-se às políticas de assistência estudantil e permanência.',
      'Em campus com perfil agrícola, costuma atender grande fluxo diário e atividades prolongadas.',
    ],
    chips: ['Alimentação', 'Assistência', 'Convivência'],
  },
];

const history = [
  'Décadas anteriores: atuação histórica da escola agrícola que originou o campus em Araquari.',
  '2008: integração à Rede Federal com a criação dos Institutos Federais (Lei nº 11.892).',
  'Expansão contínua: consolidação de cursos técnicos, graduações e projetos de pesquisa/extensão.',
  'Presente: referência regional em educação pública com forte ligação entre campo, tecnologia e comunidade.',
];

let current = 0;
const scene = document.getElementById('scene');
const panel = document.getElementById('infoPanel');
const btnContainer = document.getElementById('roomButtons');
const roomTemplate = document.getElementById('roomCardTemplate');
const timeline = document.getElementById('historyTimeline');
const dialog = document.getElementById('historyDialog');

function renderScene() {
  const room = rooms[current];
  const offset = Math.max(0, room.doorX - 360);

  scene.innerHTML = `
    <div class="corridor" style="transform: translateX(${-offset}px)">
      <div class="wall left"></div>
      <div class="wall right"></div>
      <div class="floor"></div>
      ${rooms
        .map(
          (r, index) => `
          <button
            class="door ${index === current ? 'active' : ''}"
            style="left:${r.doorX}px"
            data-index="${index}"
            aria-label="Entrar em ${r.title}"
          ></button>
      `,
        )
        .join('')}
    </div>
  `;

  scene.querySelectorAll('.door').forEach((door) => {
    door.addEventListener('click', () => {
      current = Number(door.dataset.index);
      updateAll();
    });
  });
}

function renderPanel() {
  const room = rooms[current];
  panel.innerHTML = `
    <h2>${room.title}</h2>
    <p>${room.summary}</p>
    <ul>
      ${room.details.map((d) => `<li>${d}</li>`).join('')}
    </ul>
    <div class="chips">${room.chips.map((c) => `<span class="chip">${c}</span>`).join('')}</div>
  `;
}

function renderRoomButtons() {
  btnContainer.innerHTML = '';
  rooms.forEach((room, index) => {
    const node = roomTemplate.content.cloneNode(true);
    const btn = node.querySelector('.room-btn');
    btn.querySelector('.label').textContent = room.title;
    btn.querySelector('.meta').textContent = room.subtitle;
    btn.classList.toggle('active', index === current);
    btn.addEventListener('click', () => {
      current = index;
      updateAll();
    });
    btnContainer.appendChild(node);
  });
}

function renderHistory() {
  timeline.innerHTML = history.map((item) => `<li>${item}</li>`).join('');
}

function updateAll() {
  renderScene();
  renderPanel();
  renderRoomButtons();
}

document.addEventListener('keydown', (event) => {
  if (event.key === 'ArrowRight') {
    current = (current + 1) % rooms.length;
    updateAll();
  }
  if (event.key === 'ArrowLeft') {
    current = (current - 1 + rooms.length) % rooms.length;
    updateAll();
  }
});

document.getElementById('openHistory').addEventListener('click', () => dialog.showModal());
document.getElementById('closeHistory').addEventListener('click', () => dialog.close());

let touchStartX = 0;
scene.addEventListener('touchstart', (e) => {
  touchStartX = e.changedTouches[0].clientX;
});
scene.addEventListener('touchend', (e) => {
  const endX = e.changedTouches[0].clientX;
  if (touchStartX - endX > 40) current = Math.min(current + 1, rooms.length - 1);
  if (endX - touchStartX > 40) current = Math.max(current - 1, 0);
  updateAll();
});

renderHistory();
updateAll();
