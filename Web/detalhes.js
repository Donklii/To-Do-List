async function carregarTelaDetalhes() {
  const resposta = await fetch("detalhes.html");
  const html = await resposta.text();

  const wrapper = document.createElement("div");
  wrapper.innerHTML = html;
  document.body.appendChild(wrapper);

  document.getElementById("fechar-detalhes").addEventListener("click", () => {
    document.getElementById("tela-detalhes").style.display = "none";
    document.getElementById("PaginaInicial").style.display = "block";
  });

  document.getElementById("tela-detalhes").style.display = "none";
}

function exibirDetalhesTarefa(tarefa) {
  document.getElementById("PaginaInicial").style.display = "none";
  const tela = document.getElementById("tela-detalhes");
  tela.style.display = "block";

  document.getElementById("detalhe-titulo").textContent = tarefa.titulo;
  document.getElementById("detalhe-data").textContent = tarefa.data || "Sem data";
  document.getElementById("detalhe-comentario").textContent = tarefa.comentario || "Sem comentário";
  document.getElementById("detalhe-notificar").textContent = tarefa.notificar ? "Sim" : "Não";
  document.getElementById("detalhe-criado-em").textContent = tarefa.criadoEm;

  // Atualizar a cor da borda superior
  document.getElementById("cabecalho-detalhes").className = `bg-${obterCorPrioridade(tarefa.prioridade)} rounded-top`;

  // Verificar atraso
  const aviso = document.getElementById("aviso-atrasado");
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);
  const dataTarefa = tarefa.data ? new Date(tarefa.data) : null;

  if (dataTarefa && dataTarefa < hoje) {
    aviso.style.display = "block";
  } else {
    aviso.style.display = "none";
  }
}
