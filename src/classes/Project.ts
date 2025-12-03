import { v4 as uuidv4} from 'uuid'//import uuidv4 from 'uuid' để tạo ra unique id cho project, uuidv4() sẽ tạo ra một unique id cho project

//Project class này giúp tạo ra/ THIẾT LẬP CẤU HÌNH các project cards, với các thông tin như tên, mô tả, status, role, cost, và estimated progress
//IProject giup định nghĩa các thuộc tính của project, ProjectStatus và UserRole giúp định nghĩa các giá trị cho status và role
//Quay lại Project thì nó bao gồm Constructor để khởi tạo các thuộc tính của project, và setUI để tạo ra UI cho project card dựa vào "data", data sẽ là argument của constructor/ hay Project class
//Tiếp theo trong Project nó cũng bao gồm setUI() để tạo ra UI cho project-card, nó tạo ra một div element và tạo classnName cho nó, sau đó gán innerHTML cho nó
//Trong innerHTML sẽ chứa các thông tin như tên, mô tả, status, role, cost, và estimated progress của project, giống phần trước đã tạo trong index.html

export type ProjectStatus =  "pending" | "active" | "finished" //Tạo datatype cho status của project, chỉ chấp nhận 3 giá trị là "pending", "active", "finished"
export type UserRole = "architect" | "engineer" | "developer" //Tạo datatype cho userRole, chỉ chấp nhận 3 giá trị là "architect", "engineer", "developer"

export interface IProject{//IProject with I just for Interface is a common naming convention in TypeScript, and to avoid naming conflicts with the class Project
  // describle object datatypes
  name: string
  description: string
  status: ProjectStatus
  userRole: UserRole
  finishDate: Date
  //Additional properties for class internal use
  cost?: number
  initials?: string
  progress?: number
  id?: string
  //todoList?: ToDo[]
}


export class Project implements IProject{//use the "implements" keyword to implement the IProject interface, the class must use the type as the interface
  //To satify IProject interface, we need to have the following properties
  name!: string //! có nghĩa là property sẽ được khởi tạo sau trong constructor
  description!: string
  status!: ProjectStatus
  userRole!: UserRole
  finishDate!: Date
  //Additional properties to satisfy IProject interface
  
  initials!: string
  initialsColor: string = "#000000" //default value
  ui!: HTMLDivElement
  cost: number = 0 //default value
  id!: string
  progress: number = 0 //default value
  shortFinishDate!: string
  
  constructor(data: IProject){//constructor is a special method in a class that is called when a new instance of the class is created, and it is used to initialize the object's properties
    //Project data definition
    /* Assign properties one by one
    this.name = data.name //"this" is a special keyword in JavaScript that refers to the object that "owns" the code, inside the class like the items above
    this.description = data.description
    this.status = data.status
    this.userRole = data.userRole
    this.finishDate = data.finishDate
    */
    
    /*Alternate way to set properties with interating over the keys of the object
    for (const key in data) {
    this[key] = data[key]//gán giá trị của data[key] cho this[key]
    }
    */
    
    Object.assign(this, data)//Another way to assign properties from data to this object
    this.id = uuidv4()//tạo ra một unique id cho project
    this.findInitials()
    this.setShortFinishDate()
    this.setUI()//setUi bên dưới
    
  }
  findInitials() {
    console.warn("P - findInitials invoked")
    if (!this.name) { return }
    const words = this.name.split(' ', 2)
    const map1 = words.map((x) => x.charAt(0))
    if (map1[1]) {
      this.initials = map1[0] + map1[1] as string
    } else {
      this.initials = map1[0] as string
    }
    
    function getRandomInt(max : number): number {
      return Math.floor(Math.random() * max);
    }
    const random = getRandomInt(11)
    const colors = Array.of("powderblue", "lightsteelblue", "lightblue", "darkseagreen", "palegoldenrod", "lightslategrey", "cadetblue", "rosybrown", "silver", "tan", "indianred")
    this.initialsColor = colors[random]
    console.log("Initials color: ", this.initialsColor, random)
  }
  setShortFinishDate() {
        this.shortFinishDate = new Date (this.finishDate).toLocaleDateString("vi-VN")
    }
  //Tạo project card UI trên page index.html, setUI method
  setUI() {
    //Project card UI> ĐẨY CÁC THÔNG TIN PROJECT VÀ PROJECTS LIST của index.html
    if (this.ui && this.ui instanceof HTMLElement) {return}//kiểm tra ui, thỉ thoảng project data được imported từ 1 data có chứa key "ui" nên cần kiểm tra xem ui có phải là HTMLElement không?
    //Hàm điều kiện trên nếu hok thỏa mãn, tức là hok có ui hoặc ui sai định dạng, thì ui của 1 project card mới sẽ được tự động tạo ra.
    //const card = document.createElement('div')//create a new div element, bởi vì div là một container element mà ta dùng trong idex.html
    this.ui = document.createElement('div')
    this.ui.className = "project-card"
    this.ui.innerHTML = 
    `<div class="card">
      <div class="card-header">
        <p data-project-info="initials" style="background-color: ${this.initialsColor}; padding:10px; border-radius: 8px; aspect-ratio: 1">${this.initials}</p>
        <div>
          <h5 data-project-info="name">${this.name}</h5>
          <h5 data-project-info="description" class="description">${this.description}</h5>
        </div>
      </div>
      <div class="card-content">
        <div style="display: none" class="card-property">
          <p style="color: #969696;">Id</p>
          <p data-project-info="id">${this.id}</p>
        </div>
        <div class="card-property">
          <p style="color: #969696;">Status</p>
          <p data-project-info="status">${this.status}</p>
        </div>
        <div class="card-property">
          <p style="color: #969696;">Role</p>
          <p data-project-info="userRole">${this.userRole}</p>
        </div>
        <div class="card-property">
          <p style="color: #969696;">Cost</p>
          <p data-project-info="cost">$${this.cost}</p>
        </div>
        <div style="display:none" class="card-property">
          <p style="color: #969696;">Finish Date</p>
          <p data-project-info="finishDate">${this.finishDate}</p>
        </div>
        <div class="card-property">
          <p style="color: #969696;">Finish Date</p>
          <p data-project-info="shortFinishDate">${this.shortFinishDate}</p>
        </div>
        <div class="card-property">
          <p style="color: #969696;">Estimated Progress</p>
          <p data-project-info="progress">${this.progress}%</p>
        </div>
        <div style="display:none" class="card-property">
          <p style="color: #969696;">Initials</p>
          <p data-project-info="initials" style="text-transform: uppercase">${this.initials}</p>
        </div>

    </div>`
  }
}


        