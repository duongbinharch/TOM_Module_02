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

  
  renderAll() {//Clear container and re-render all todos
    this.container.innerHTML = ""//Clear container
    this.list.forEach(t => { t.setUI(); if (t.ui) this.container.appendChild(t.ui); this.attachTodoEvents(t) })//Render each todo and attach events
  }
  
  attachTodoEvents(todo: ToDo) {//Add event listener for delete request
    if (!todo.ui) return
    todo.ui.addEventListener("todo:delete-request", (ev: any) => {
      this.deleteTodo(ev.detail as string)
      console.log("Delete request received for todo ID:", ev.detail)
    })
    todo.ui.addEventListener("todo:edit-request", (ev: any) => {  // <--- thêm
      this.editTodo(ev.detail as string)
      console.log("Edit request received for todo ID:", ev.detail)  // <--- thêm
    })
  }
  
  deleteTodo(id: string) {
    const idx = this.list.findIndex(t => t.id === id)
    if (idx === -1) return
    const [t] = this.list.splice(idx, 1)
    if (t.ui && t.ui.parentElement) t.ui.parentElement.removeChild(t.ui)
  }

  editTodo(id: string) {
    const todo = this.findById(id)
    if (!todo) return
    
    // Phát event để index.ts lắng nghe và mở modal edit với dữ liệu todo
    const event = new CustomEvent("todos:edit-todo", { 
      detail: { 
        id: todo.id, 
        title: todo.title,
        description: todo.description,
        dueDate: todo.dueDate,
        done: todo.done,
        priority: todo.priority
      },
      bubbles: true
    })
    this.container.dispatchEvent(event)
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