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

const projectForm = document.getElementById("new-project-form")//Biến chứa thông tin project mới

// removed duplicate submit handler — keep only the single guarded handler later in file
// if(projectForm && projectForm instanceof HTMLFormElement) {
//   projectForm.addEventListener("submit", (e) => { ... old handler ... })
// } else { console.warn("The project form was not found. Check the ID!") }

// ---- TẠO DỰ ÁN MỚI TỪ FORM // ---- New Project Form Submit -----------------------------------------------------------------------------
if(projectForm && projectForm instanceof HTMLFormElement) {// check projectForm có giá trị và là 1 HTMLFormElement không
  projectForm.addEventListener("submit", (e) => {// e được hiểu là event được truyền vào khi sự kiện submit được kích hoạt, nó chứa thông tin về sự kiện đó, không thực sự là biến dữ liệu
    e.preventDefault()//This is to prevent the default behavior of the form/not be refreshed, which is to submit the form to the server
    const formData = new FormData(projectForm)//This is to create a new FormData object with the data from the form

    // Validate / normalize finish date: use 15 Aug 1991 when invalid
    const finishRaw = formData.get("finishDate") as string | null
    let finishDate = new Date(finishRaw ?? "1991-08-15")
    if (isNaN(finishDate.getTime())) {
      finishDate = new Date("1991-08-15")
    }

    const projectData : IProject = { //Tạo 1 object projectData với IProject interface, chứa dữ liệu từ form
      name: formData.get("name") as string, //Lấy dữ liệu từ form, và ép kiểu về string
      description: formData.get("description") as string,
      status: formData.get("status") as ProjectStatus, //Ép kiểu về ProjectStatus
      userRole: formData.get("userRole") as UserRole,
      finishDate // dùng finishDate đã được kiểm tra
    }
    
    try {
      const project = projectsManager.newProject(projectData)// Tạo một project mới từ projectData và ghi vào mảng list trong projectsManager
      projectForm.reset()//Reset the form after the project is created
      toggleModal("new-project-modal")//Close the modal after the project is created
      //console.log(project)
      
    } catch (err) {
      //alert(err)//Show an alert with the error message if the project name is already in use

      //SHOW ERROR MODAL
      const errorDialog = document.getElementById("error-popup-modal") as HTMLDialogElement | null
      //const errorParagraph = errorDialog?.querySelector<HTMLParagraphElement>("p") ?? null
      let errorParagraph: HTMLParagraphElement | null;
      if (errorDialog) {
        errorParagraph = errorDialog.querySelector<HTMLParagraphElement>("p");
      } else {
        errorParagraph = null;
      }
      const cancelErrorBtn = document.getElementById("cancel-error-popup-button") as HTMLButtonElement | null

      // set message from thrown Error
      const message = (err instanceof Error) ? err.message : String(err)
      if (errorParagraph) errorParagraph.textContent = message

      // show the dialog
      toggleModal("error-popup-modal")

      // attach a single handler (replace any previous)
      if (cancelErrorBtn) {
        cancelErrorBtn.onclick = (e) => {
          e.preventDefault()
          toggleModal("error-popup-modal")
        }
      }
    }
      
      
    })
  } else {
    console.warn("The project form was not found. Check the ID!")
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

// // modify existing submit handler: build payload and branch create/update
// let projectFormListenerAttached = (window as any).__projectFormListenerAttached ?? false
// if (!projectFormListenerAttached) {
//   if (projectForm && projectForm instanceof HTMLFormElement) {
//     projectForm.addEventListener("submit", (e) => {
//       e.preventDefault() // quan trọng: ngăn reload trang

//       const formData = new FormData(projectForm)
//       const name = (formData.get("name") as string ?? "").trim()

//       // quick validation client-side before calling manager
//       if (name.length <= 5) {
//         // show error modal (reuse existing error UI)
//         const errorDialog = document.getElementById("error-popup-modal") as HTMLDialogElement | null
//         const errorPara = errorDialog?.querySelector<HTMLParagraphElement>("p")
//         if (errorPara) errorPara.textContent = "Project name must be at least 6 characters long"
//         // console.log(errorPara)
//         try { errorDialog?.showModal() } catch { if (errorDialog) errorDialog.style.display = "block" }
//         return
//       }

//       // build payload (normalize finish date)
//       const finishRaw = formData.get("finishDate") as string | null
//       let finishDate = new Date(finishRaw ?? "1991-08-15")
//       if (isNaN(finishDate.getTime())) finishDate = new Date("1991-08-15")

//       const payload: IProject = {
//         name,
//         description: (formData.get("description") as string) ?? "",
//         userRole: ((formData.get("userRole") as string) ?? "developer").toLowerCase() as UserRole,
//         status: ((formData.get("status") as string) ?? "pending").toLowerCase() as ProjectStatus,
//         finishDate
//       }

//       try {
//         if (currentEditingId) {
//           projectsManager.updateProject(currentEditingId, payload)
//           currentEditingId = null
//         } else {
//           projectsManager.newProject(payload)
//         }
//         projectForm.reset()
//         const modal = document.getElementById("new-project-modal") as HTMLDialogElement | null
//         if (modal) try { modal.close() } catch { modal.style.display = "none" }
//       } catch (err: any) {
//         const errorDialog = document.getElementById("error-popup-modal") as HTMLDialogElement | null
//         const errorPara = errorDialog?.querySelector<HTMLParagraphElement>("p")
//         if (errorPara) errorPara.textContent = (err instanceof Error) ? err.message : String(err)
//         try { errorDialog?.showModal() } catch { if (errorDialog) errorDialog!.style.display = "block" }
//       }
//     })
//     ;(window as any).__projectFormListenerAttached = true
//   }
// }

