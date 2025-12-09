import { ToDo, IToDo } from "./ToDo.ts"

export class ToDos {
  list: ToDo[] = []
  container: HTMLElement

  constructor(container: HTMLElement) {
    this.container = container
  }

  newTodo(data: IToDo) {
    const todo = new ToDo(data)
    todo.setUI()
    if (todo.ui) this.container.appendChild(todo.ui)
    this.list.push(todo)
    this.attachTodoEvents(todo)
    return todo
  }

  findById(id: string) { return this.list.find(t => t.id === id) ?? null }

  updateTodo(id: string, data: Partial<IToDo>) {
    const t = this.findById(id)
    if (!t) throw new Error("Todo not found")
    if (data.title !== undefined) t.title = data.title
    if (data.description !== undefined) t.description = data.description
    if (data.dueDate !== undefined) t.dueDate = data.dueDate ? String(data.dueDate) : null
    if (data.done !== undefined) t.done = !!data.done
    if (data.priority !== undefined) t.priority = data.priority
    t.refreshUI()
    return t
  }

  deleteTodo(id: string) {
    const idx = this.list.findIndex(t => t.id === id)
    if (idx === -1) return
    const [t] = this.list.splice(idx, 1)
    if (t.ui && t.ui.parentElement) t.ui.parentElement.removeChild(t.ui)
  }

  renderAll() {
    this.container.innerHTML = ""
    this.list.forEach(t => { t.setUI(); if (t.ui) this.container.appendChild(t.ui); this.attachTodoEvents(t) })
  }

  attachTodoEvents(todo: ToDo) {
    if (!todo.ui) return
    todo.ui.addEventListener("todo:delete-request", (ev: any) => {
      this.deleteTodo(ev.detail as string)
    })
  }

  exportData() { return this.list.map(t => t.toJSON()) }

  importData(arr: IToDo[]) {
    this.list = arr.map(a => ToDo.fromJSON(a))
    this.renderAll()
  }

  exportAsFile(filename = "todos.json") {
    const blob = new Blob([JSON.stringify(this.exportData(), null, 2)], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)
  }
}