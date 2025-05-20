function mostrarPopupFiltro() {
  fetch("filtrar.html")
    .then(res => res.text())
    .then(html => {
      const modalWrapper = document.createElement("div");
      modalWrapper.innerHTML = html;
      document.body.appendChild(modalWrapper);

      // Manter as check-box já aplicadas
      filtrosAplicados.forEach(filtro => {
        const checkbox = modalWrapper.querySelector(`#filtro${capitalizar(filtro)}`);
        if (checkbox) checkbox.checked = true;
      });

      const modal = new bootstrap.Modal(modalWrapper.querySelector("#modalFiltrar"));
      modal.show();

      modalWrapper.querySelector("#confirmarFiltro").addEventListener("click", () => {
        aplicarFiltros(modalWrapper);
        modal.hide();
        setTimeout(() => modalWrapper.remove(), 500); // Limpar do DOM após fechar
      });
    });
}

// Aplica os filtros baseados no modal atual
function aplicarFiltros(modalWrapper) {
  const filtros = {
    atrasadas: modalWrapper.querySelector("#filtroAtrasadas").checked,
    alta: modalWrapper.querySelector("#filtroAlta").checked,
    media: modalWrapper.querySelector("#filtroMedia").checked,
    baixa: modalWrapper.querySelector("#filtroBaixa").checked,
    notificar: modalWrapper.querySelector("#filtroNotificar").checked,
    comentario: modalWrapper.querySelector("#filtroComentario").checked
  };

  filtrosAplicados = Object.entries(filtros)
    .filter(([_, ativo]) => ativo)
    .map(([filtro]) => filtro);

  renderizarFiltrosAtivos();
  aplicarFiltrosNaLista(); // aplica na lista visual
}

// Renderiza os filtros aplicados em marcações azuis removíveis
function renderizarFiltrosAtivos() {
  const container = document.getElementById("filtros-ativos");
  container.innerHTML = "";

  filtrosAplicados.forEach(filtro => {
    const badge = document.createElement("span");
    badge.className = "badge bg-primary px-3 py-2 me-2";
    badge.style.cursor = "pointer";
    badge.textContent = traduzirFiltro(filtro) + " ×";
    badge.addEventListener("click", () => {
      filtrosAplicados = filtrosAplicados.filter(f => f !== filtro);
      renderizarFiltrosAtivos();
      aplicarFiltrosNaLista();
    });
    container.appendChild(badge);
  });
}

function traduzirFiltro(nome) {
  const map = {
    atrasadas: "Atrasadas",
    alta: "Prioridade Alta",
    media: "Prioridade Média",
    baixa: "Prioridade Baixa",
    notificar: "Com Notificação",
    comentario: "Com Comentário"
  };
  return map[nome] || nome;
}

function aplicarFiltrosNaLista() {
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);

  listaDeTarefas.forEach(tarefa => {
    let visivel = true;

    for (const filtro of filtrosAplicados) {
      switch (filtro) {
        case "atrasadas":
          if (!(tarefa.data && new Date(tarefa.data) < hoje)) visivel = false;
          break;
        case "alta":
          if (tarefa.prioridade !== "Alta") visivel = false;
          break;
        case "media":
          if (tarefa.prioridade !== "Média") visivel = false;
          break;
        case "baixa":
          if (tarefa.prioridade !== "Baixa") visivel = false;
          break;
        case "notificar":
          if (!tarefa.notificar) visivel = false;
          break;
        case "comentario":
          if (!tarefa.comentario || tarefa.comentario.trim() === "") visivel = false;
          break;
      }

      if (!visivel) break;
    }

    if (visivel && tarefa.elemento === null) {
      tarefa.renderizarNaLista();
    } else if (!visivel && tarefa.elemento !== null) {
      tarefa.remover();
    }
  });

  atualizarAvisoDeVazio();
}

// Função de apoio para capitalizar nomes de filtros
function capitalizar(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
