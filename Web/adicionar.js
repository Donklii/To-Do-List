async function carregarFormulario() {
  const resposta = await fetch("formulario.html");
  const conteudo = await resposta.text();
  document.body.insertAdjacentHTML("beforeend", conteudo);

  formularioTarefa = document.getElementById("formulario-tarefa");
  const listaTarefas = document.getElementById("task-list");

  formularioTarefa.addEventListener("submit", submeterFormulario);
}

function novaTarefa() {
  tarefaEditando = null;
  formularioTarefa.reset();
  document.getElementById("BotaoAdicionarTarefa").textContent = "Adicionar Tarefa";
  mostrarFormulario();
}

function submeterFormulario(e) {
  e.preventDefault();

  const titulo = document.getElementById("Titulo").value;
  const data = document.getElementById("Data").value;
  const comentario = document.getElementById("Comentario").value;
  const prioridade = document.getElementById("Prioridade").value;
  const notificar = document.getElementById("Notificar").checked;

  if (tarefaEditando) {
    Object.assign(tarefaEditando, { titulo, data, comentario, prioridade, notificar });

    tarefaEditando.remover();
    tarefaEditando.renderizarNaLista();
    tarefaEditando = null;
  } else {
    const nova = new Tarefa(titulo, data, comentario, prioridade, notificar);
    nova.renderizarNaLista();
  }

  document.getElementById("BotaoAdicionarTarefa").textContent = "Adicionar Tarefa";
  formularioTarefa.reset();
  aplicarFiltrosNaLista();
  mostrarTelaInicial();
}

function preencherFormularioComTarefa(tarefa) {
  document.getElementById("Titulo").value = tarefa.titulo;
  document.getElementById("Data").value = tarefa.data;
  document.getElementById("Comentario").value = tarefa.comentario;
  document.getElementById("Prioridade").value = tarefa.prioridade;
  document.getElementById("Notificar").checked = tarefa.notificar;
  document.getElementById("BotaoAdicionarTarefa").textContent = "Atualizar Tarefa";
  mostrarFormulario();
}