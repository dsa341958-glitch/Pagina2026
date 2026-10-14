const STORAGE_KEY = "kanban_tasks_v1";
const THEME_KEY = "kanban_theme";
const STATUSES = ["todo", "doing", "done"];

let tasks = loadTasks();
let editingId = null;
let draggedId = null;

// ---------- Elementos del DOM ----------
const searchInput = document.getElementById("search");
const filterSelect = document.getElementById("filterPriority");
const themeToggle = document.getElementById("themeToggle");
const addBtn = document.getElementById("addBtn");
const dialog = document.getElementById("taskDialog");
const form = document.getElementById("taskForm");
const cancelBtn = document.getElementById("cancelBtn");
const dialogTitle = document.getElementById("dialogTitle");
const titleInput = document.getElementById("taskTitle");
const descInput = document.getElementById("taskDesc");
const priorityInput = document.getElementById("taskPriority");
const dueInput = document.getElementById("taskDue");
const progressBar = document.getElementById("progressBar");
const progressText = document.getElementById("progressText");

// ---------- Almacenamiento ----------
function loadTasks() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (Array.isArray(saved)) return saved;
  } catch (e) {
    console.warn("No se pudo leer localStorage", e);
  }
  return [
    { id: uid(), title: "Crear repositorio", desc: "Inicializar el repo y la rama develop", priority: "alta", due: "", status: "done" },
    { id: uid(), title: "Maquetar el tablero", desc: "HTML y CSS de las tres columnas", priority: "media", due: "", status: "doing" },
    { id: uid(), title: "Probar GitHub Pages", desc: "Publicar la rama master", priority: "baja", due: "", status: "todo" }
  ];
}

function saveTasks() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
}

function uid() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
}

// ---------- Renderizado ----------
function render() {
  const query = searchInput.value.trim().toLowerCase();
  const priority = filterSelect.value;

  STATUSES.forEach(status => {
    const list = document.getElementById("list-" + status);
    list.innerHTML = "";

    const visibles = tasks.filter(t =>
      t.status === status &&
      (priority === "todas" || t.priority === priority) &&
      (t.title.toLowerCase().includes(query) || t.desc.toLowerCase().includes(query))
    );

    if (visibles.length === 0) {
      const empty = document.createElement("div");
      empty.className = "empty";
      empty.textContent = "Sin tareas";
      list.appendChild(empty);
    } else {
      visibles.forEach(t => list.appendChild(createCard(t)));
    }

    document.getElementById("count-" + status).textContent =
      tasks.filter(t => t.status === status).length;
  });

  updateProgress();
}

function createCard(task) {
  const card = document.createElement("article");
  card.className = "card " + task.priority;
  card.draggable = true;
  card.dataset.id = task.id;

  const title = document.createElement("h3");
  title.textContent = task.title;
  card.appendChild(title);

  if (task.desc) {
    const desc = document.createElement("p");
    desc.textContent = task.desc;
    card.appendChild(desc);
  }

  const footer = document.createElement("div");
  footer.className = "card-footer";

  const left = document.createElement("div");
  const badge = document.createElement("span");
  badge.className = "badge " + task.priority;
  badge.textContent = task.priority;
  left.appendChild(badge);

  if (task.due) {
    const due = document.createElement("span");
    due.className = "due";
    due.textContent = " 📅 " + formatDate(task.due);
    if (task.status !== "done" && task.due < todayString()) {
      due.classList.add("vencida");
      due.textContent += " (vencida)";
    }
    left.appendChild(due);
  }

  const actions = document.createElement("div");
  actions.className = "card-actions";

  const editBtn = document.createElement("button");
  editBtn.className = "icon-btn";
  editBtn.title = "Editar";
  editBtn.textContent = "✏️";
  editBtn.addEventListener("click", () => openDialog(task.id));

  const delBtn = document.createElement("button");
  delBtn.className = "icon-btn";
  delBtn.title = "Eliminar";
  delBtn.textContent = "🗑️";
  delBtn.addEventListener("click", () => deleteTask(task.id));

  actions.append(editBtn, delBtn);
  footer.append(left, actions);
  card.appendChild(footer);

  // Drag & drop
  card.addEventListener("dragstart", e => {
    draggedId = task.id;
    card.classList.add("dragging");
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", task.id);
  });
  card.addEventListener("dragend", () => {
    card.classList.remove("dragging");
    draggedId = null;
  });

  return card;
}

function updateProgress() {
  const total = tasks.length;
  const done = tasks.filter(t => t.status === "done").length;
  const pct = total === 0 ? 0 : Math.round((done / total) * 100);
  progressBar.style.width = pct + "%";
  progressText.textContent = pct + "% (" + done + "/" + total + ")";
}

// ---------- Utilidades de fecha ----------
function todayString() {
  const d = new Date();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return d.getFullYear() + "-" + month + "-" + day;
}

function formatDate(iso) {
  const [y, m, d] = iso.split("-");
  return d + "/" + m + "/" + y;
}

// ---------- CRUD ----------
function openDialog(id = null) {
  editingId = id;
  if (id) {
    const t = tasks.find(x => x.id === id);
    dialogTitle.textContent = "Editar tarea";
    titleInput.value = t.title;
    descInput.value = t.desc;
    priorityInput.value = t.priority;
    dueInput.value = t.due;
  } else {
    dialogTitle.textContent = "Nueva tarea";
    form.reset();
    priorityInput.value = "media";
  }
  dialog.showModal();
  titleInput.focus();
}

function deleteTask(id) {
  if (!confirm("¿Eliminar esta tarea?")) return;
  tasks = tasks.filter(t => t.id !== id);
  saveTasks();
  render();
}

form.addEventListener("submit", e => {
  e.preventDefault();
  const data = {
    title: titleInput.value.trim(),
    desc: descInput.value.trim(),
    priority: priorityInput.value,
    due: dueInput.value
  };
  if (!data.title) return;

  if (editingId) {
    const t = tasks.find(x => x.id === editingId);
    Object.assign(t, data);
  } else {
    tasks.push({ id: uid(), status: "todo", ...data });
  }

  saveTasks();
  render();
  dialog.close();
});

// ---------- Eventos ----------
addBtn.addEventListener("click", () => openDialog());
cancelBtn.addEventListener("click", () => dialog.close());
searchInput.addEventListener("input", render);
filterSelect.addEventListener("change", render);

// Zonas de drop (las columnas)
document.querySelectorAll(".list").forEach(list => {
  list.addEventListener("dragover", e => {
    e.preventDefault();
    list.classList.add("drag-over");
  });
  list.addEventListener("dragleave", () => list.classList.remove("drag-over"));
  list.addEventListener("drop", e => {
    e.preventDefault();
    list.classList.remove("drag-over");
    const newStatus = list.id.replace("list-", "");
    const task = tasks.find(t => t.id === draggedId);
    if (task && task.status !== newStatus) {
      task.status = newStatus;
      saveTasks();
      render();
    }
  });
});

// ---------- Tema claro / oscuro ----------
function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  themeToggle.textContent = theme === "dark" ? "☀️" : "🌙";
  localStorage.setItem(THEME_KEY, theme);
}

themeToggle.addEventListener("click", () => {
  const current = document.documentElement.getAttribute("data-theme");
  applyTheme(current === "dark" ? "light" : "dark");
});

applyTheme(localStorage.getItem(THEME_KEY) || "light");

// ---------- Inicio ----------
render();