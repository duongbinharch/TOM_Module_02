import { IProject, Project } from './Project';//import Project class from Project.ts


export class ProjectsManager{
  list: Project[] = []//mảng chứa các project hiện tại là empty array
  ui: HTMLElement//UI của project this will be the HTML container for all the projects cards
  
  constructor(container: HTMLElement) {
    //constructor là một phương thức đặc biệt trong một class được gọi khi một instance mới của class được tạo, 
    //và nó được sử dụng để khởi tạo các thuộc tính của object
    this.ui = container //gán container cho ui
    this.newProject({
      name: "Default Project",
      description: "This is a default project",
      status: "pending",
      userRole: "architect",
      finishDate: new Date()
    })
    /* này là phần 3rd Assignment 
    if(this.list.length === 0) {
    this.createDefaultProject()
    }*/
  }
  /*//3rd Assignment > Defautl value
  createDefaultProject(){
  const defaultData : IProject = {
  name : "Default Project",
  description : "This is a default project",
  status : "pending",
  userRole : "architect",
  finishDate : new Date()
  }
  this.newProject(defaultData)//tạo project mới từ defaultData
  }*/
  
  newProject(data: IProject) {//tạo một phương thức (method) là project mới từ data
    const projectNames = this.list.map((project)=>{//tạo một newlist projectNames, map method sẽ tạo ra một mảng mới từ mảng cũ, lấy mỗi project trong list và return project.name
      return project.name
    })
    
    // validate name length (must be > 5 chars)
    const nameTrimmed = (data.name ?? '').trim()
    if (nameTrimmed.length <= 5) {
      throw new Error('Project name must be at least 6 characters long')
    }

    //check if the name is already in use
    const nameInUse = projectNames.includes(data.name)//kiểm tra xem data.name đã được sử dụng chưa, include method trả về boolean value rằng data.name đã được sử dụng hay chưa
    if(nameInUse) {
      throw new Error(`A project with the name "${data.name}" already exists`)//nếu data.name đã được sử dụng thì throw error
    }//nếu data.name đã được sử dụng thì return, không tạo project mới
    
    const project = new Project(data)//tạo một project mới từ data
    
    //Switch page to detail page
    project.ui.addEventListener("click", () => {
      const projectsPage = document.getElementById("projects-page")//lấy phần tử DOM với id "projects-page"
      const detailPage = document.getElementById("project-details")//lấy phần tử DOM với id "detail-page"
      if(!(projectsPage && detailPage)) {//kiểm tra xem projectsPage và detailPage có giá trị không
        //another way: if(projectsPage === null || detailPage === null)
        //another way: if(!projectsPage || !detailPage) {
        return}
        projectsPage.style.display = "none"//ẩn projectsPage
        detailPage.style.display = "flex"//hiện detailPage
        this.setDetailsPage(project)//setDetailsPage
      })
      
      //Add project to UI and list
      this.ui.append(project.ui)//thêm project vào UI
      this.list.push(project)//thêm project vào mảng list
      return project//trả về project mới
  }
    
  private setDetailsPage(project: Project): void {
    const detailsPage = document.getElementById("project-details")
    if (!detailsPage) { return }

    const initialsEl = detailsPage.querySelector<HTMLElement>("[data-project-info='initials']")
    const idEl = detailsPage.querySelector<HTMLElement>("[data-project-info='id']")
    const nameEl = detailsPage.querySelector<HTMLElement>("[data-project-info='name']")
    const descEl = detailsPage.querySelector<HTMLElement>("[data-project-info='description']")
    const statusEl = detailsPage.querySelector<HTMLElement>("[data-project-info='status']")
    const costEl = detailsPage.querySelector<HTMLElement>("[data-project-info='cost']")
    const roleEl = detailsPage.querySelector<HTMLElement>("[data-project-info='role']")
    const finishEl = detailsPage.querySelector<HTMLElement>("[data-project-info='finishDate']")
    const progressEl = detailsPage.querySelector<HTMLElement>("[data-project-info='progress']")

    if (initialsEl) {
      initialsEl.textContent = project.initials ?? ''
      if (project.initialsColor) initialsEl.style.backgroundColor = project.initialsColor
      initialsEl.style.display = ''
    }
    if (idEl) idEl.textContent = project.id ?? ''
    if (nameEl) nameEl.textContent = project.name ?? ''
    if (descEl) descEl.textContent = project.description ?? ''
    if (statusEl) statusEl.textContent = String(project.status ?? '')
    if (costEl) costEl.textContent = `$ ${project.cost ?? 0}`
    if (roleEl) roleEl.textContent = String(project.userRole ?? '')
    if (finishEl) finishEl.textContent = project.shortFinishDate ?? new Date(project.finishDate).toLocaleDateString("vi-VN")
    if (progressEl) progressEl.textContent = `${Math.round(project.progress ?? 0)}%`
  }
  
    
  /*
  clearList(){
  this.list.pop[0];//xóa project đầu tiên trong mảng list
  this.ui.removeChild(this.ui.children[0])//xóa project đầu tiên trong UI
  }*/
  
  
  //Intoduction to Unique Project ID - UUID
  getProject(id: string) {
    const project = this.list.find((project)=>{
      return project.id === id
    })//for obtaining a reference to a stored project
    return project
  }//for obtaining a reference to a stored project
    
  deleteProject(id: string) {
    const project = this.getProject(id)
    if(!project) {return}//if project is not found, return trả về undefined, finish this function
    project.ui.remove()//remove the project from the UI, xóa project từ UI
    const remaining = this.list.filter((project)=>{
      return project.id !== id
    })
    this.list = remaining
  }//to remove a project
    
  //LESSION ASSIGNMENTS
  //1.Create a method to calculate the total cost of all projects>reduce method
  calculateTotalCost() {
    const totalCost = this.list.reduce((total, project)=>{//reduce method là một phương thức của array, nó sẽ thực thi một hàm callback trên mỗi phần tử của array để tính toán một giá trị duy nhất
      return total + project.cost
    }, 0)
    return totalCost
  }//for calculating the total cost of all projects
  //2.Create a getProjectbyName() method to get a project by its name
  getProjectbyName(name: string) {
    const project = this.list.find((project)=>{
      return project.name === name
    })
    return project
  }//for obtaining a reference to a stored project
    
    
  exportToJSON(fileName: string = "projects") {//for exporting projects   
    const json = JSON.stringify(this.list)//convert list to JSON string
    const blob = new Blob([json],{type: 'application/json'})//create a new Blob object, Blob là một đối tượng đại diện cho 1 đoạn dữ liệu không cấu trúc, blob sẽ chứa dữ liệu JSON
    const url = URL.createObjectURL(blob)//create a URL for the Blob object, URL.createObjectURL() method tạo ra một URL đại diện cho đối tượng được truyền vào, URL nghĩa là Uniform Resource Locator để chỉ địa chỉ của một tài nguyên trên mạng
    const a = document.createElement('a')//create a new anchor element, nghĩa là tạo một phần tử anchor mới, anchor là một phần tử HTML cho phép bạn tạo một liên kết đến một trang web khác, 'a' sẽ không được ghi lại trong DOM
    a.href = url//set the href attribute of the anchor element to the URL, set giá trị của href của 'a' là url
    a.download = fileName//set the download attribute of the anchor element to the fileName, set giá trị của download của 'a' là fileName
    a.click()//simulate a click on the anchor element, giả lập một click vào phần tử anchor
    URL.revokeObjectURL(url)//revoke the URL, giải phóng URL, nghĩa là giải phóng bộ nhớ đã được cấp phát cho URL, reset URL
  }
  
  importFromJSON() {//for importing projects data
    const input = document.createElement('input')//create a new input element, tạo một phần tử input mới
    input.type = 'file'//set the type attribute of the input element to 'file', set giá trị của type của 'input' là 'file'
    input.accept = 'application/json'//set the accept attribute of the input element to 'application/json', set giá trị của accept của 'input' là 'application/json'
    const reader = new FileReader()//create a new FileReader object, tạo một đối tượng FileReader mới
    reader.addEventListener('load', () => {//add an event listener to the reader object, thêm một event listener cho đối tượng reader
      const json = reader.result//get the result from the reader object, lấy kết quả từ đối tượng reader
      if(!json) {return}//if there is no result, return, nếu không có kết quả thì return
      const projects: IProject[] = JSON.parse(json as string)//parse the JSON string into an array of projects, chuyển đổi chuỗi JSON thành một mảng các projects
      for (const project of projects) {//iterate over the projects array, lặp qua mảng projects
        try {
          this.newProject(project)//create a new project from each project data, tạo một project mới từ mỗi dữ liệu project
        } catch (error) {
          
        }
      }
    })
    input.addEventListener('change', () => {//add an event listener to the input element, thêm một event listener cho phần tử input
      const filelist = input.files//get the files from the input element, lấy files từ phần tử input
      if(!filelist) {return}//if there are no files, return, nếu không có files thì return; một cách khác để kiểm tra xem filelist có giá trị không là if(filelist === null)/ if(file.length === 0)
      reader.readAsText(filelist[0])//read the first file in the filelist as text, đọc file đầu tiên trong filelist dưới dạng text
    })
    input.click()//simulate a click on the input element, giả lập một click vào phần tử input
    
  }
}