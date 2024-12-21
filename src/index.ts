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


//1st Assignment
//Funtion to toggle the modal when the close button is clicked
function toggleModal(id: string) {
    const modal = document.getElementById(id); // Lấy phần tử DOM với ID được cung cấp
    if (modal && modal instanceof HTMLDialogElement) { // Kiểm tra xem phần tử DOM có tồn tại hay không
        modal.open ? modal.close(): modal.showModal(); // Nếu tồn tại, gọi phương thức open để mở modal, nếu modal đã mở thì gọi phương thức close để đóng modal
    } else {
        console.warn("modal not found. ID:", id); // Nếu không tồn tại, ghi cảnh báo vào console
    }
}

//LẤY DANH SÁCH PROJECTs
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

//TƯƠNG TÁC CHÍNH
const projectForm = document.getElementById("new-project-form")//Biến chứa thông tin project mới
if(projectForm && projectForm instanceof HTMLFormElement) {// check projectForm có giá trị và là 1 HTMLFormElement không
    projectForm.addEventListener("submit", (e) => {
        e.preventDefault()//This is to prevent the default behavior of the form/not be refreshed, which is to submit the form to the server
        const formData = new FormData(projectForm)//This is to create a new FormData object with the data from the form
        const projectData : IProject = { //Tạo 1 object projectData với IProject interface, chứa dữ liệu từ form
            name: formData.get("name") as string, //Lấy dữ liệu từ form, và ép kiểu về string
            description: formData.get("description") as string,
            status: formData.get("status") as ProjectStatus, //Ép kiểu về ProjectStatus
            userRole: formData.get("userRole") as UserRole,
            finishDate: new Date(formData.get("finishDate") as string) //Ép kiểu về Date
        }
        
        try {
            const project = projectsManager.newProject(projectData)// Tạo một project mới từ projectData và ghi vào mảng list trong projectsManager
            projectForm.reset()//Reset the form after the project is created
            toggleModal("new-project-modal")//Close the modal after the project is created
            //console.log(project)

        } catch (err) {
            //alert(err)//Show an alert with the error message if the project name is already in use
            
            //const errorMsg = document.getElementById("err") as HTMLElement//lấy DOM element với ID được cung cấp
            const cancelErrorBtn = document.getElementById("cancel-error-popup-button") as HTMLElement//lấy DOM element với ID được cung cấp
            //errorMsg.textContent = err//gán nội dung lỗi vào errorMsg
            toggleModal("error-popup-modal")//mở modal error-popup
            if(cancelErrorBtn) {
                cancelErrorBtn.addEventListener("click", (e) => {
                    e.preventDefault()
                    toggleModal("error-popup-modal")})//thêm sự kiện click vào button, khi click vào button sẽ gọi hàm showModal
            }
        }


    })
    } else {
        console.warn("The project form was not found. Check the ID!")
}

const exportProjectsBtn = document.getElementById("export-projects-btn")//Lấy phần tử DOM với ID được cung cấp
if (exportProjectsBtn) {
    exportProjectsBtn.addEventListener("click", () => {
        projectsManager.exportToJSON()//Gọi hàm exportToJSON từ projectsManager
    })
}

const importProjectsBtn = document.getElementById("import-projects-btn")//Lấy phần tử DOM với ID được cung cấp
if (importProjectsBtn) {
    importProjectsBtn.addEventListener("click", () => {
        projectsManager.importFromJSON()//Gọi hàm exportToJSON từ projectsManager
    })
}
