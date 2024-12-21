import { v4 as uuidv4} from 'uuid'//import uuidv4 from 'uuid' để tạo ra unique id cho project, uuidv4() sẽ tạo ra một unique id cho project

//Project class này giúp tạo ra/ THIẾT LẬP CẤU HÌNH các project cards, với các thông tin như tên, mô tả, status, role, cost, và estimated progress
//IProject giup định nghĩa các thuộc tính của project, ProjectStatus và UserRole giúp định nghĩa các giá trị cho status và role
//Quay lại Project thì nó bao gồm Constructor để khởi tạo các thuộc tính của project, và setUI để tạo ra UI cho project card dựa vào "data", data sẽ là argument của constructor/ hay Project class
//Tiếp theo trong Project nó cũng bao gồm setUI() để tạo ra UI cho project-card, nó tạo ra một div element và tạo classnName cho nó, sau đó gán innerHTML cho nó
//Trong innerHTML sẽ chứa các thông tin như tên, mô tả, status, role, cost, và estimated progress của project, giống phần trước đã tạo trong index.html

export type ProjectStatus =  "pending" | "active" | "finished" //Tạo datatype cho status của project, chỉ chấp nhận 3 giá trị là "pending", "active", "finished"
export type UserRole = "architect" | "engineer" | "developer" //Tạo datatype cho userRole, chỉ chấp nhận 3 giá trị là "architect", "engineer", "developer"

export interface IProject{//IProject with I just for Interface is a common naming convention in TypeScript, and to avoid naming conflicts with the class Project
    name: string
    description: string
    status: ProjectStatus
    userRole: UserRole
    finishDate: Date
    // describle object datatypes
}


export class Project implements IProject{//use the "implements" keyword to implement the IProject interface, the class must use the type as the interface
    //To satify IProject interface, we need to have the following properties
    name: string
    description: string
    status: "pending" | "active" | "finished"
    userRole: "architect" | "engineer" | "developer"
    finishDate: Date
    //object template

    //Class internal
    ui: HTMLDivElement
    cost: number = 0 //default value
    process: number = 0 //default value
    id: string

    constructor(data: IProject){//constructor is a special method in a class that is called when a new instance of the class is created, and it is used to initialize the object's properties
        //Project data definition
        /*
        this.name = data.name //"this" is a special keyword in JavaScript that refers to the object that "owns" the code, inside the class like the items above
        this.description = data.description
        this.status = data.status
        this.userRole = data.userRole
        this.finishDate = data.finishDate
        */

        //atternate way to set properties with interating over the keys of the object
        for (const key in data) {
            this[key] = data[key]
        }

        this.id = uuidv4()//tạo ra một unique id cho project
        this.setUI()
    
    }

    //Tạo project card UI trên page index.html //cũng tương đương với action importFromJSON() trong ProjectsManager.ts, tạo các project card bằng data imported
    setUI() {
        //Project card UI> ĐẨY CÁC THÔNG TIN PROJECT VÀ PROJECTS LIST của index.html
        if (this.ui && this.ui instanceof HTMLElement) {return}//kiểm tra ui, thỉ thoảng project data được imported từ 1 data có chứa key "ui" nên cần kiểm tra xem ui có phải là HTMLElement không?
        //Hàm điều kiện trên nếu hok thỏa mãn, tức là hok có ui hoặc ui sai định dạng, thì ui của 1 project card mới sẽ được tự động tạo ra.
        //const card = document.createElement('div')//create a new div element, bởi vì div là một container element mà ta dùng trong idex.html
        this.ui = document.createElement('div')
        this.ui.className = "project-card"
        this.ui.innerHTML = 
        `<div class="project-card">
            <div class="card-header">
                <p style="background-color: #ca8134; padding: 10px; border-radius: 8px; aspect-ratio: 1;">HC</p>
                <div>
                    <h5>${this.name}</h5>
                    <p>${this.description}</p>
                </div>
            </div>
            <div class="card-content">
                <div class="card-property">
                    <p style="color: #969696;">Status</p>
                    <p>${this.status}</p>
                </div>
                <div class="card-property">
                    <p style="color: #969696;">Role</p>
                    <p>${this.userRole}</p>
                </div>
                <div class="card-property">
                    <p style="color: #969696;">Cost</p>
                    <p>$${this.cost}</p>
                </div>
                <div class="card-property">
                    <p style="color: #969696;">Estimated Progress</p>
                    <p>${this.process * 100}%</p>
                </div>
            </div>
         </div>`}
}
