function mostrarPopupOrdenar() {
  fetch("organizar.html")
    .then(res => res.text())
    .then(html => {
      const modalWrapper = document.createElement("div");
      modalWrapper.innerHTML = html;
      document.body.appendChild(modalWrapper);

      const modal = new bootstrap.Modal(modalWrapper.querySelector("#modalOrdenar"));
      modal.show();

      modalWrapper.querySelector("#confirmarOrdenacao").addEventListener("click", () => {
        const criterio = modalWrapper.querySelector("#criterioOrdenacao").value;
        ordenarTarefas(criterio);
        modal.hide();
      });
    });
}

let criterioAtual = "criação";

const taskList = document.getElementById("task-list");

// Observador de mutações
const observer = new MutationObserver(mutations => {
  for (const mutation of mutations) {
    if (mutation.addedNodes.length > 0) {
      observer.disconnect(); // impede loop
      ordenarTarefas(criterioAtual); // organiza novamente
      observer.observe(taskList, { childList: true }); // reativa após execução
      break;
    }
  }
});

observer.observe(taskList, { childList: true });

function ordenarTarefas(criterio) {
  criterioAtual = criterio;
  atualizarTextoBotaoOrdenar();

  listaDeTarefas.sort((a, b) => {
    switch (criterio) {
      case "criação":
        return new Date(a.criadoEm) - new Date(b.criadoEm);
      case "prioridade": {
        const ordem = { Alta: 1, Média: 2, Baixa: 3 };
        return ordem[a.prioridade] - ordem[b.prioridade];
      }
      case "data":
        return new Date(a.data || "9999-12-31") - new Date(b.data || "9999-12-31");
      case "titulo":
        return a.titulo.localeCompare(b.titulo);
      default:
        return 0;
    }
  });

  taskList.innerHTML = '<p id="aviso-vazio" class="text-muted text-center">Não há nenhuma tarefa pendente.</p>';

  listaDeTarefas.forEach(tarefa => {
    if (tarefa.elemento) taskList.appendChild(tarefa.elemento);
  });

  atualizarAvisoDeVazio();
}

function atualizarTextoBotaoOrdenar() {
  const botao = document.getElementById("BotaoOrdenar");
  const nomes = {
    "criação": "Criação",
    "prioridade": "Prioridade",
    "data": "Data",
    "titulo": "Título"
  };

  botao.textContent = `Ordenar: ${nomes[criterioAtual] || criterioAtual}`;
}
