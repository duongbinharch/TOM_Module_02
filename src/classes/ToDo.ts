export interface IToDo {
  id?: string
  title: string
  description?: string
  dueDate?: string | null
  done?: boolean
  priority?: "low" | "medium" | "high"
}

export class ToDo implements IToDo {
  id: string
  title: string
  description: string
  dueDate: string | null
  done: boolean
  priority: "low" | "medium" | "high"
  ui: HTMLElement | null = null

  constructor(data: IToDo) {
    this.id = data.id ?? (crypto && (crypto as any).randomUUID ? (crypto as any).randomUUID() : String(Date.now()))
    this.title = data.title
    this.description = data.description ?? ""
    this.dueDate = data.dueDate ? String(data.dueDate) : null
    this.done = !!data.done
    this.priority = data.priority ?? "medium"
  }

  setUI() {
    if (this.ui) return
    const el = document.createElement("div")
    el.className = "todo-item"
    el.setAttribute("data-todo-id", this.id)
    el.style.backgroundColor = this.getPriorityColor() // <--- Thêm dòng này
    el.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center;">
        <div style="display:flex; gap:12px; align-items:center;">
          <select class="todo-priority" style="padding:6px 10px; border-radius:6px; border:1px solid #cccccc71; background:transparent; cursor:pointer;">
            <option style="color:green" value="low" ${this.priority === "low" ? "selected" : ""}>L</option>
            <option style="color:orange" value="medium" ${this.priority === "medium" ? "selected" : ""}>M</option>
            <option style="color:red" value="high" ${this.priority === "high" ? "selected" : ""}>H</option>
          </select>
          <div>
            <p class="todo-title" style="margin:0">${this.title}</p>
            <small class="todo-due" style="color:#999">${this.formatDue()}</small>
            <p class="todo-desc" style="margin:0; color:#777; font-size:0.9rem">${this.description}</p>
          </div>
        </div>
        <div style="display:flex; gap:8px; align-items:center;">
          <button class="todo-edit btn-danger">Edit</button>
          <button class="todo-delete btn-danger">Delete</button>
        </div>
      </div>
    `
    const prioritySelect = el.querySelector<HTMLSelectElement>(".todo-priority")
    prioritySelect?.addEventListener("change", () => {
      this.priority = prioritySelect.value as "low" | "medium" | "high"
      el.style.backgroundColor = this.getPriorityColor() // <--- Cập nhật màu khi thay đổi
      this.refreshUI()
      el.dispatchEvent(new CustomEvent("todo:change", { detail: this.toJSON() }))
    })
    el.querySelector<HTMLButtonElement>(".todo-edit")?.addEventListener("click", (e) => {
      e.preventDefault()
      el.dispatchEvent(new CustomEvent("todo:edit-request", { detail: this.id }))
    })
    el.querySelector<HTMLButtonElement>(".todo-delete")?.addEventListener("click", (e) => {
      e.preventDefault()
      el.dispatchEvent(new CustomEvent("todo:delete-request", { detail: this.id }))
    })
    this.ui = el
  }

  refreshUI() {
    if (!this.ui) return
    const titleEl = this.ui.querySelector<HTMLElement>(".todo-title")
    const descEl = this.ui.querySelector<HTMLElement>(".todo-desc")
    const dueEl = this.ui.querySelector<HTMLElement>(".todo-due")
    const prioritySelect = this.ui.querySelector<HTMLSelectElement>(".todo-priority")
    if (titleEl) titleEl.textContent = this.title
    if (descEl) descEl.textContent = this.description
    if (dueEl) dueEl.textContent = this.formatDue()
    if (prioritySelect) prioritySelect.value = this.priority
    this.ui.style.backgroundColor = this.getPriorityColor() // <--- Cập nhật màu khi refresh
    this.ui.classList.toggle("todo-done", !!this.done)
  }

  formatDue(): string {
    if (!this.dueDate) return ""
    const d = new Date(this.dueDate)
    return isNaN(d.getTime()) ? "" : d.toLocaleDateString("vi-VN")
  }

  toJSON() {
    return { id: this.id, title: this.title, description: this.description, dueDate: this.dueDate, done: this.done, priority: this.priority }
  }

  static fromJSON(data: IToDo) { return new ToDo(data) }

  // Hàm helper để lấy màu theo priority
  private getPriorityColor(): string {
    switch (this.priority) {
      case "low":
        return "#d4edda"    // Light green
      case "medium":
        return "#fff3cd"    // Light orange/yellow
      case "high":
        return "#f8d7da"    // Light red
      default:
        return "#ffffff"
    }
  }
}