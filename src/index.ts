//Đây là file thực tập trên lớp về TypeScript, có thể tìm hiểu chi tiết phần thực hành trước trong file index backup.js

import {IProject, ProjectStatus, UserRole } from "./classes/Project"

import {ProjectsManager} from "./classes/ProjectsManager"
/*
//Funtion to open the modal when the new project button is clicked
function showModal(id: string) {
const modal = document.getElementById(id); // Lấy phần tử DOM với ID được cung cấp
if (modal && modal instanceof HTMLDialogElement) { // Kiểm tra xem phần tử DOM có tồn tại hay không
modal.showModal(); // Nếu tồn tại, gọi phương thức showModal để hiển thị modal, này là 1 phương thức có sẵn của phần tử <dialog> trong Html
} else {
  console.warn("modal not found. ID:", id); // Nếu không tồn tại, ghi cảnh báo vào console
}
}
//Funtion to close the modal when the close button is clicked
function closeModal(id: string) {
const modal = document.getElementById(id); // Lấy phần tử DOM với ID được cung cấp
if (modal && modal instanceof HTMLDialogElement) { // Kiểm tra xem phần tử DOM có tồn tại hay không
modal.close(); // Nếu tồn tại, gọi phương thức close để đóng modal, này là 1 phương thức có sẵn của phần tử <dialog> trong Html
} else {
  console.warn("modal not found. ID:", id); // Nếu không tồn tại, ghi cảnh báo vào console
}
}*/


// ---- TOGGLE MODAL FUNCTION -----------------------------------------------------------------------------
//Funtion to toggle the modal when the close button is clicked
function toggleModal(id: string) {
  const modal = document.getElementById(id); // Lấy phần tử DOM với ID được cung cấp
  if (modal && modal instanceof HTMLDialogElement) { // Kiểm tra xem phần tử DOM có tồn tại hay không
    modal.open ? modal.close(): modal.showModal(); // Nếu tồn tại, gọi phương thức open để mở modal, nếu modal đã mở thì gọi phương thức close để đóng modal
  } else {
    console.warn("modal not found. ID:", id); // Nếu không tồn tại, ghi cảnh báo vào console
  }
}

// ---- LẤY DANH SÁCH PROJECTs // ---- COLLECTION THE PROJECTS FROM UI -----------------------------------------------------------------------------
const projectsListUI = document.getElementById("projects-list") as HTMLElement//Lấy phần tử DOM với ID được cung cấp //Ép kiểu về HTMLElement tránh bị Null
const projectsManager = new ProjectsManager(projectsListUI)//Tạo một instance của class ProjectsManager

//BẬT : Bật các modal với form mới khi click vào button
// This document object is provided by the browser, and its main purpose is to help us interact with the DOM.
const newProjectBtn = document.getElementById("new-project-btn" )
if(newProjectBtn) {
  newProjectBtn.addEventListener("click", () => {toggleModal("new-project-modal")})//thêm sự kiện click vào button, khi click vào button sẽ gọi hàm showModal
} else {
  console.warn("new-project-btn not found")
}

//TẮT : Tắt modal khi click vào button close
//2nd Assignment > Cancel button
const cancelButton = document.getElementById("form-cancel-button")
if(cancelButton) {
  cancelButton.addEventListener("click", () => {toggleModal("new-project-modal")})//thêm sự kiện click vào button, khi click vào button sẽ gọi hàm showModal
} else {
  console.warn("cancelButton not found")
}


// ensure projectsManager instance is reachable (created earlier in this file or from ProjectsManager.ts)
// prefer the instance created in this module; fallback to window
const pm = (typeof projectsManager !== "undefined" ? (projectsManager as any) : (window as any).projectsManager) as any

// single submit handler that handles both New and Edit
const projectForm = document.getElementById("new-project-form") as HTMLFormElement | null
if (projectForm && projectForm instanceof HTMLFormElement) {
  // remove existing duplicated listeners by using a guard
  if (!(window as any).__projectFormSubmitBound) {
    projectForm.addEventListener("submit", (e) => {
      e.preventDefault()

      const formData = new FormData(projectForm)
      const name = (formData.get("name") as string ?? "").trim()
      const description = (formData.get("description") as string ?? "").trim()
      const status = (formData.get("status") as string) ?? ""
      const userRole = (formData.get("userRole") as string) ?? ""
      const finishRaw = formData.get("finishDate") as string | null

      // normalize finish date with fallback 1991-08-15 when invalid/empty
      let finishDate = new Date(finishRaw ?? "1991-08-15")
      if (isNaN(finishDate.getTime())) finishDate = new Date("1991-08-15")

      // client-side validation
      if (!name || name.length < 6) {
        const errorDialog = document.getElementById("error-popup-modal") as HTMLDialogElement | null
        const errorParagraph = errorDialog?.querySelector<HTMLParagraphElement>("p") ?? null
        if (errorParagraph) errorParagraph.textContent = "Project name must be at least 6 characters long"
        try { errorDialog?.showModal() } catch { if (errorDialog) errorDialog.style.display = "block" }
        return
      }

      const payload = {
        name,
        description,
        status,
        userRole,
        finishDate
      }

      try {
        if (currentEditingId) {
          // prefer ProjectsManager API updateProject
          if (pm && typeof pm.updateProject === "function") {
            pm.updateProject(currentEditingId, payload)
          } else {
            // fallback: try to find and patch project object then refresh UI if possible
            const find = pm && typeof pm.findById === "function" ? pm.findById(currentEditingId) : null
            if (find) {
              Object.assign(find, payload)
              if (typeof pm.updateProject !== "function" && typeof find.refreshUI === "function") find.refreshUI()
            }
          }
          currentEditingId = null
        } else {
          if (pm && typeof pm.newProject === "function") {
            pm.newProject(payload)
          } else {
            console.warn("projectsManager.newProject not available; project not created", payload)
          }
        }

        // reset form and close modal
        projectForm.reset()
        const dialog = document.getElementById("new-project-modal") as HTMLDialogElement | null
        if (dialog) {
          try { dialog.close() } catch { dialog.style.display = "none" }
        }
      } catch (err) {
        const errorDialog = document.getElementById("error-popup-modal") as HTMLDialogElement | null
        const errorParagraph = errorDialog?.querySelector<HTMLParagraphElement>("p") ?? null
        const message = (err instanceof Error) ? err.message : String(err)
        if (errorParagraph) errorParagraph.textContent = message
        try { errorDialog?.showModal() } catch { if (errorDialog) errorDialog!.style.display = "block" }
      }
    })

    ;(window as any).__projectFormSubmitBound = true
  }
} else {
  console.warn("new-project-form not found in DOM")
}

//XUẤT NHẬP DỮ LIỆU DẠNG JSON
//Xuất dữ liệu dự án ra file JSON
const exportProjectsBtn = document.getElementById("export-projects-btn")//Lấy phần tử DOM với ID được cung cấp
if (exportProjectsBtn) {
  exportProjectsBtn.addEventListener("click", () => {
    projectsManager.exportToJSON()//Gọi hàm exportToJSON từ projectsManager
  })
}
//Nhập dữ liệu
const importProjectsBtn = document.getElementById("import-projects-btn")//Lấy phần tử DOM với ID được cung cấp
if (importProjectsBtn) {
  importProjectsBtn.addEventListener("click", () => {
    projectsManager.importFromJSON()//Gọi hàm exportToJSON từ projectsManager
  })
}
  
// ---- OPEN EDIT PROJECT MODAL FUNCTION -----------------------------------------------------------------------------
// Biến toàn cục để theo dõi project hiện đang được chỉnh sửa
let currentEditingId: string | null = null

function openProjectModal(mode: "new" | "edit", project?: any) {
  console.log('openProjectModal called', mode, project?.id ?? null)

  let dialog = document.getElementById("new-project-modal") as HTMLDialogElement | null
  const form = document.getElementById("new-project-form") as HTMLFormElement | null
  if (!dialog || !form) {
    console.warn('Modal or form not found: new-project-modal / new-project-form')
    return
  }

  // nếu dialog nằm trong một container bị display:none thì di chuyển tạm ra body
  if (dialog.parentElement !== document.body) {
    document.body.appendChild(dialog)
    console.debug('Moved dialog to document.body to ensure visibility')
  }

  // ưu tiên style để tránh bị css ẩn
  dialog.style.zIndex = '9999'
  dialog.style.position = 'fixed'

  const title = form.querySelector("h2")
  if (title) title.textContent = mode === "edit" ? "Edit Project" : "New Project"

  form.reset()
  currentEditingId = null

  if (mode === "edit" && project) {
    currentEditingId = project.id ? String(project.id) : null

    const nameInput = form.querySelector('input[name="name"]') as HTMLInputElement | null
    if (nameInput) nameInput.value = project.name ?? ""

    const descInput = form.querySelector('textarea[name="description"]') as HTMLTextAreaElement | null
    if (descInput) descInput.value = project.description ?? ""

    const roleEl = form.querySelector('select[name="userRole"]') as HTMLSelectElement | null
    if (roleEl) roleEl.value = project.userRole ?? roleEl.value

    const statusEl = form.querySelector('select[name="status"]') as HTMLSelectElement | null
    if (statusEl) statusEl.value = project.status ?? statusEl.value

    const finishEl = form.querySelector('input[name="finishDate"]') as HTMLInputElement | null
    if (finishEl && project && project.finishDate != null) {
      const d = new Date(project.finishDate)
      if (!isNaN(d.getTime())) finishEl.value = d.toISOString().slice(0, 10)
      else finishEl.value = ""
    }
  }

  try {
    dialog.showModal()
    console.log('dialog.showModal succeeded, dialog.open=', !!dialog.open)
  } catch (err) {
    console.warn('dialog.showModal failed, falling back to manual open. Error:', err)
    // fallback: set attribute open + display block
    try {
      dialog.setAttribute('open', '')
      dialog.style.display = 'block'
      dialog.style.zIndex = '9999'
      console.log('dialog opened via fallback')
    } catch (e) {
      console.error('fallback open failed', e)
    }
  }
}

// ensure a global opener is available (ProjectsManager calls this)
;(window as any).openProjectEditor = (projectId: string) => {
  console.log('window.openProjectEditor called for', projectId)
  // projectsManager should be the instance you created in this module
  const pm = (window as any).projectsManager ?? (typeof projectsManager !== 'undefined' ? projectsManager : null)
  const project = pm && typeof pm.findById === 'function' ? pm.findById(projectId) : null
  if (!project) {
    console.warn('openProjectEditor: project not found', projectId)
    return
  }
  openProjectModal('edit', project)
}


// ---- TO-DOs MODAL AND FORM HANDLING -----------------------------------------------------------------------------
// Open new-todo modal when user clicks the add icon (selector in your index.html)
const addTodoBtn = document.querySelector<HTMLElement>('[data-action="add-todo"]')
const newTodoDialog = document.getElementById('new-todo-modal') as HTMLDialogElement | null
const newTodoForm = document.getElementById('new-todo-form') as HTMLFormElement | null
const cancelNewTodoBtn = document.getElementById('cancel-new-todo') as HTMLButtonElement | null

if (addTodoBtn && newTodoDialog && newTodoForm) {
  addTodoBtn.addEventListener('click', (ev) => {
    ev.preventDefault()
    newTodoForm.reset()
    try { newTodoDialog.showModal() } catch { newTodoDialog.style.display = 'block' }
  })

  cancelNewTodoBtn?.addEventListener('click', (ev) => {
    ev.preventDefault()
    try { newTodoDialog.close() } catch { newTodoDialog.style.display = 'none' }
  })

  newTodoForm.addEventListener('submit', (ev) => {
    ev.preventDefault()
    const fd = new FormData(newTodoForm)
    const title = (fd.get('todoTitle') as string ?? '').trim()
    if (!title) return
    const description = (fd.get('todoDescription') as string ?? '').trim()
    const dueRaw = fd.get('todoDueDate') as string | null
    const due = dueRaw && dueRaw !== '' ? dueRaw : null

    // dynamic lookup of current project's ToDos manager
    const todosMgr = (window as any).todosManager as any | undefined
    const currentProjectId = (window as any).currentProjectId as string | undefined
    const pm = (window as any).projectsManager as any | undefined

    if (todosMgr && typeof todosMgr.newTodo === 'function') {
      todosMgr.newTodo({ title, description, dueDate: due })
      // sync into project's stored data
      if (pm && currentProjectId) {
        // use ProjectsManager.syncProjectTodos to persist and refresh detail
        if (typeof pm.syncProjectTodos === 'function') {
          pm.syncProjectTodos(currentProjectId)
        } else {
          // fallback: write directly into project object
          const proj = pm.findById ? pm.findById(currentProjectId) : null
          if (proj) (proj as any).todos = todosMgr.exportData?.() ?? []
        }
      }
    } else {
      // fallback: append DOM-only card (shouldn't happen if ProjectsManager.setDetailsPage created todosMgr)
      const todosListEl = document.getElementById('todos-list')
      if (todosListEl) {
        const el = document.createElement('div')
        el.className = 'todo-item'
        el.innerHTML = `
          <div style="display: flex; justify-content: space-between; align-items: center;">
            <div style="display: flex; column-gap: 15px; align-items: center;">
              <span class="material-icons-round" style="padding: 10px; background-color: #686868; border-radius: 10px;">construction</span>
              <p>${escapeHtml(title)}</p>
            </div>
            <p style="text-wrap: nowrap; margin-left: 10px;">${due ? new Date(due).toLocaleDateString() : ''}</p>
          </div>`
        todosListEl.appendChild(el)
      }
    }

    try { newTodoDialog.close() } catch { newTodoDialog.style.display = 'none' }
    newTodoForm.reset()
  })
} else {
  console.warn('To-Do UI elements missing', { addTodoBtn, newTodoDialog, newTodoForm })
}

// small helper used by fallback
function escapeHtml(s: string) { return String(s).replace(/[&<>"']/g, (c) => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;' }[c] as string)) }


// ---- EDIT TO-DO MODAL AND FORM HANDLING -----------------------------------------------------------------------------
const editTodoDialog = document.getElementById('edit-todo-modal') as HTMLDialogElement | null
const editTodoForm = document.getElementById('edit-todo-form') as HTMLFormElement | null
const cancelEditTodoBtn = document.getElementById('cancel-edit-todo') as HTMLButtonElement | null
const deleteTodoBtn = document.getElementById('delete-todo') as HTMLButtonElement | null
let currentEditingTodoId: string | null = null

if (editTodoDialog && editTodoForm) {
  
  // Lắng nghe event edit-todo từ ToDos.ts
  const todosListEl = document.getElementById('todos-list')
  if (todosListEl) {
    todosListEl.addEventListener('todos:edit-todo', (e: any) => {
      const todoData = e.detail
      if (!todoData) return
      
      // Lưu ID của todo đang edit
      currentEditingTodoId = todoData.id
      
      // Fill form với dữ liệu hiện tại
      const titleInput = editTodoForm.querySelector('input[name="todoTitle"]') as HTMLInputElement | null
      const descInput = editTodoForm.querySelector('textarea[name="todoDescription"]') as HTMLTextAreaElement | null
      const dateInput = editTodoForm.querySelector('input[name="todoDueDate"]') as HTMLInputElement | null
      
      if (titleInput) titleInput.value = todoData.title ?? ''
      if (descInput) descInput.value = todoData.description ?? ''
      if (dateInput) dateInput.value = todoData.dueDate ?? ''
      
      // Mở modal
      try { 
        editTodoDialog.showModal() 
      } catch { 
        editTodoDialog.style.display = 'block' 
      }
    })
  }
  
  // Xử lý submit form edit
  editTodoForm.addEventListener('submit', (ev) => {
    ev.preventDefault()
    if (!currentEditingTodoId) return
    
    const fd = new FormData(editTodoForm)
    const title = (fd.get('todoTitle') as string ?? '').trim()
    if (!title) return
    
    const description = (fd.get('todoDescription') as string ?? '').trim()
    const dueRaw = fd.get('todoDueDate') as string | null
    const dueDate = dueRaw && dueRaw !== '' ? dueRaw : null
    
    // Cập nhật todo qua todosMgr
    const todosMgr = (window as any).todosManager as any | undefined
    if (todosMgr && typeof todosMgr.updateTodo === 'function') {
      todosMgr.updateTodo(currentEditingTodoId, {
        title,
        description,
        dueDate
      })
      
      // Sync vào project data
      const pm = (window as any).projectsManager as any | undefined
      const currentProjectId = (window as any).currentProjectId as string | undefined
      if (pm && currentProjectId && typeof pm.syncProjectTodos === 'function') {
        pm.syncProjectTodos(currentProjectId)
      }
    }
    
    // Đóng modal và reset
    try { editTodoDialog.close() } catch { editTodoDialog.style.display = 'none' }
    editTodoForm.reset()
    currentEditingTodoId = null
  })
  
  // Cancel button
  cancelEditTodoBtn?.addEventListener('click', (ev) => {
    ev.preventDefault()
    try { editTodoDialog.close() } catch { editTodoDialog.style.display = 'none' }
    editTodoForm.reset()
    currentEditingTodoId = null
  })
  
  // Delete button
  deleteTodoBtn?.addEventListener('click', (ev) => {
    ev.preventDefault()
    if (!currentEditingTodoId) return
    
    if (!confirm('Are you sure you want to delete this to-do?')) return
    
    const todosMgr = (window as any).todosManager as any | undefined
    if (todosMgr && typeof todosMgr.deleteTodo === 'function') {
      todosMgr.deleteTodo(currentEditingTodoId)
      
      // Sync vào project data
      const pm = (window as any).projectsManager as any | undefined
      const currentProjectId = (window as any).currentProjectId as string | undefined
      if (pm && currentProjectId && typeof pm.syncProjectTodos === 'function') {
        pm.syncProjectTodos(currentProjectId)
      }
    }
    
    // Đóng modal và reset
    try { editTodoDialog.close() } catch { editTodoDialog.style.display = 'none' }
    editTodoForm.reset()
    currentEditingTodoId = null
  })
  
} else {
  console.warn('Edit To-Do UI elements missing', { editTodoDialog, editTodoForm })
}