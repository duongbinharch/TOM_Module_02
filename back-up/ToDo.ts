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
    el.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center;">
        <div style="display:flex; gap:12px; align-items:center;">
          <input type="checkbox" class="todo-toggle" ${this.done ? "checked" : ""}>
          <div>
            <p class="todo-title" style="margin:0">${this.title}</p>
            <p class="todo-desc" style="margin:0; color:#777; font-size:0.9rem">${this.description}</p>
          </div>
        </div>
        <div style="display:flex; gap:8px; align-items:center;">
          <small class="todo-due" style="color:#999">${this.formatDue()}</small>
          <button class="todo-edit btn-secondary">Edit</button>
          <button class="todo-delete btn-danger">Delete</button>
        </div>
      </div>
    `
    const checkbox = el.querySelector<HTMLInputElement>(".todo-toggle")
    checkbox?.addEventListener("change", () => {
      this.done = !!checkbox.checked
      this.refreshUI()
      el.dispatchEvent(new CustomEvent("todo:change", { detail: this.toJSON() }))
    })
    el.querySelector<HTMLButtonElement>(".todo-edit")?.addEventListener("click", (e) => {
      e.preventDefault()
      ;(window as any).openTodoEditor?.(this.id)
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
    const checkbox = this.ui.querySelector<HTMLInputElement>(".todo-toggle")
    if (titleEl) titleEl.textContent = this.title
    if (descEl) descEl.textContent = this.description
    if (dueEl) dueEl.textContent = this.formatDue()
    if (checkbox) checkbox.checked = !!this.done
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
}