import { Component, OnInit } from '@angular/core';
import { SharedService } from 'src/app/core/services/shared.service';
import { SolutionService } from 'src/app/core/services/solution/solution.service';

@Component({
  selector: 'app-execute-process',
  templateUrl: './execute-process.component.html',
  styleUrls: ['./execute-process.component.scss'],
})
export class ExecuteProcessComponent implements OnInit {
  AddEventProceeding: boolean | undefined;
  addEventIndex: any;
  // $!: JQueryStatic
  fileElem!: HTMLElement | null;
  process: any;
  projectData: any;
  processname: any;
  projectname: any;
  constructor(
    private shared:SharedService,
    private solService:SolutionService
  ) {}

  ngOnInit(): void {
    this.projectData=JSON.parse(localStorage.getItem('project')||"")
    this.processname=this.projectData.processName
    this.projectname=this.projectData.projectName
    this.process = JSON.parse(localStorage.getItem("projectProcess") || '') //just commented
    // $('#browse').trigger("click");
    this.fileElem = document.getElementById('browse');
    this.shared.getClick()
    // console.log(this.fileElem);
    // this.fileElem?.click();
  }
  success(e: any) {
    this.solService.executeProject(this.process).subscribe((res:any)=>{
      console.log(res);
      this.AddEventProceeding = true;
      this.addEventIndex = e;
    })
  }
  saveiputFiles(event:any){
    let processId: string = this.process.processId;
    const formData = new FormData();
    formData.append('processId', processId);

    for (let i = 0; i < event.target.files.length; i++) {
      formData.append('file', event.target.files[i])
    }
    this.solService.uploadExcelToProjectExecutionNreExecution(formData).subscribe((res: any) => {
      console.log(res);
    })

  }
}
