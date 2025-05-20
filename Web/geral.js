const botaoNovaTarefa = document.getElementById("NovaTarefaButton");
const botaoOrdenar = document.getElementById("BotaoOrdenar");
const botaoFiltrar = document.getElementById("BotaoFiltrar");
let formularioTarefa;
let tarefaEditando = null;
let listaDeTarefas = [];
let filtrosAplicados = [];

async function iniciar() {
  await carregarFormulario();
  await carregarTelaDetalhes();

  botaoNovaTarefa.addEventListener("click", novaTarefa);
  botaoOrdenar.addEventListener("click", mostrarPopupOrdenar);
  botaoFiltrar.addEventListener("click", mostrarPopupFiltro);
  formularioTarefa.style.display = "none";

  // Adiciona tarefas de teste
  const tarefasDeTeste = [
    new Tarefa("Comprar leite", "2025-05-10", "Usar o cartão de credito", "Média", true),
    new Tarefa("Acabar trabalho", "2025-05-23", "", "Baixa", false),
    new Tarefa("Jogar Fotnite", "", "Falar com o Dart Vader", "Alta", false),
  ];

  tarefasDeTeste.forEach(tarefa => {tarefa.renderizarNaLista();});

  atualizarAvisoDeVazio();
}


function atualizarAvisoDeVazio() {
  const lista = document.getElementById("task-list");
  const aviso = document.getElementById("aviso-vazio");

  const itens = lista.querySelectorAll("li");
  aviso.style.display = itens.length === 0 ? "block" : "none";
}


function obterCorPrioridade(prioridade) {
  switch (prioridade) {
    case "Alta": return "danger";
    case "Média": return "warning";
    case "Baixa": return "success";
    default: return "secondary";
  }
}

function mostrarFormulario() {
  document.getElementById("PaginaInicial").style.display = "none";
  formularioTarefa.style.display = "block";
}

function mostrarTelaInicial() {
  document.getElementById("PaginaInicial").style.display = "block";
  formularioTarefa.style.display = "none";
}


iniciar();