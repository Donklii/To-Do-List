class Tarefa {
  constructor(titulo, data, comentario, prioridade, notificar, criadoEm = new Date().toLocaleString("pt-BR")) {
    this.titulo = titulo;
    this.data = data;
    this.comentario = comentario;
    this.prioridade = prioridade;
    this.notificar = notificar;
    this.criadoEm = criadoEm;
    this.elemento = null;
  }

  gerarHTML() {
    const comentarioCurto = this.comentario?.length > 60
      ? this.comentario.slice(0, 60) + "..."
      : this.comentario;

    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    const dataTarefa = this.data ? new Date(this.data) : null;
    const estaAtrasada = dataTarefa && dataTarefa < hoje;

    return `
      <div class="ms-2 me-auto conteudo-tarefa">
        <div class="fw-bold d-flex align-items-center flex-wrap gap-2">
          <span>${this.titulo}</span>
          <span class="badge bg-${obterCorPrioridade(this.prioridade)}">${this.prioridade}</span>
          ${estaAtrasada ? `<span class="badge bg-danger">⏰ Atrasado</span>` : ""}
        </div>

        ${this.data ? `<small class="tarefa-data d-block mt-1">📅 ${this.data}</small>` : ""}
        ${this.comentario ? `<small class="tarefa-comentario d-block mt-1" data-expandido="false">💬 ${comentarioCurto}</small>` : ""}
        ${this.notificar ? `<span class="badge bg-info text-dark d-inline-block mt-1">🔔 Notificar</span>` : ""}
        <small class="text-muted tarefa-criacao d-none d-block mt-1">🕒 Criado em: ${this.criadoEm}</small>
      </div>

      <div class="d-flex flex-column justify-content-between align-items-end">
        <div class="btn-group mb-2" role="group">
          <button class="btn btn-sm btn-primary editar" title="Editar">📝</button>
          <button class="btn btn-sm btn-danger remover" title="Remover">🗑️</button>
        </div>
        <button class="btn btn-sm btn-outline-secondary expandir" title="Expandir/Recolher">🔽</button>
      </div>
    `;
  }


  renderizarNaLista() {
    const itemTarefa = document.createElement("li");
    itemTarefa.className = "list-group-item d-flex justify-content-between align-items-start";
    itemTarefa.innerHTML = this.gerarHTML();
    this.elemento = itemTarefa;
    itemTarefa.addEventListener("click", (e) => {
    if (!e.target.closest("button")) {
      exibirDetalhesTarefa(this);
    }
    });


    document.getElementById("task-list").appendChild(itemTarefa);
    listaDeTarefas.push(this);
    this.atualizarListeners();
  }

  remover() {
    this.elemento.remove();
    this.elemento = null;
  }

  atualizarListeners() {
    if (!this.elemento) return;
    this.elemento.querySelector(".editar")?.addEventListener("click", e => this.gerenciarAcoes(e));
    this.elemento.querySelector(".remover")?.addEventListener("click", e => this.gerenciarAcoes(e));
    this.elemento.querySelector(".expandir")?.addEventListener("click", e => this.gerenciarAcoes(e));
    
  }

  gerenciarAcoes(e) {
    const item = this.elemento;

    if (e.target.classList.contains("remover")) {
      this.remover();
      listaDeTarefas = listaDeTarefas.filter(t => t !== this);
      atualizarAvisoDeVazio();
    }

    if (e.target.classList.contains("editar")) {
      preencherFormularioComTarefa(this);
      tarefaEditando = this;
    }

    if (e.target.classList.contains("expandir")) {
      const comentarioEl = item.querySelector(".tarefa-comentario");
      const criacaoEl = item.querySelector(".tarefa-criacao");
      const botaoExpandir = e.target;

      // Verifica se está expandido com base no botão
      const estaExpandido = botaoExpandir.dataset.expandido === "true";

      if (!estaExpandido) {
        if (comentarioEl) {
          comentarioEl.textContent = "💬 " + this.comentario;
          comentarioEl.dataset.expandido = "true";
        }
        criacaoEl?.classList.remove("d-none");
        botaoExpandir.textContent = "🔼";
        botaoExpandir.dataset.expandido = "true";
      } else {
        if (comentarioEl) {
          const comentarioCortado = this.comentario.length > 60
            ? this.comentario.slice(0, 60) + "..."
            : this.comentario;
          comentarioEl.textContent = "💬 " + comentarioCortado;
          comentarioEl.dataset.expandido = "false";
        }
        criacaoEl?.classList.add("d-none");
        botaoExpandir.textContent = "🔽";
        botaoExpandir.dataset.expandido = "false";
      }
    }
    
    
  }

}