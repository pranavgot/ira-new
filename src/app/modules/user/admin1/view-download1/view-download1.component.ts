import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
// import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { LoaderService } from 'src/app/core/services/loader.service';
import { MastersService } from 'src/app/core/services/masters/masters.service';
import { PopupService } from 'src/app/core/services/popup.service';
import { SharedService } from 'src/app/core/services/shared.service';
import { SolutionService } from 'src/app/core/services/solution/solution.service';
import { UsersService } from 'src/app/core/services/users/users.service';
import { ToastComponent } from '../../all-common/toast/toast.component';

@Component({
  selector: 'app-view-download1',
  templateUrl: './view-download1.component.html',
  styleUrls: ['./view-download1.component.scss']
})
export class ViewDownload1Component implements OnInit {

  AddEventProceeding: boolean | undefined;
  addEventIndex: any;
  // $!: JQueryStatic
  fileElem!: HTMLElement | null;
  process: any;
  projectData1: any;
  processname1: any;
  projectname1: any;
  panelOpenStateFive = true;
  down = true;
  hideschedule: boolean = false;
  // id = '014014F4-ABB5-4C06-9FAE-1E333591AFDA';
  // projectid ="2585bcb4-58e7-4241-a9e2-cd22e46e92b5"
  projectid :any;
  processId:any;
  anaytics: any;
  anayticfile: any;
  downloadt: any;
  demo: any;
  tabs = [
    { id: 0, value: 'Download Files', isActive: true },
    { id: 1, value: 'Execute Project', isActive: false },
    { id: 2, value: 'Shedule Project', isActive: false },
    // { id: 3, value: 'Join', isActive: false },
    // { id: 4, value: 'Target Files', isActive: false },
    // { id: 5, value: 'Data Modelling', isActive: false },
  ];
  projectData:any;
  processname: any;
  projectname: any;
  subtab1: boolean = true;
  subtab2: boolean = false;
  subtab3: boolean = false;
  scheduleForm!: FormGroup;
  uploaddata: any;
  anyData: any;
  // formbuilder: any;

  constructor(
    private formbuilder: FormBuilder,
    private shared:SharedService,
    private solService: SolutionService,
    private Users_service: UsersService,
    private Master: MastersService,
    // private solution: SolutionService,
    private popup:PopupService,
    private _sanitizer: DomSanitizer,
    private toast: ToastComponent,
    private http: HttpClient,
    private loader:LoaderService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.scheduleForm = this.formbuilder.group({
      startdate1: [''],
      enddate1: [''],
      time1: [''],
      startdate2: [''],
      enddate2: [''],
      day: [''],
      time2: [''],
      startdate3: [''],
      enddate3: [''],
      date: [''],
      time3: [''],
      // message: ['', Validators.required],
    })
    // this.downloadTemplates();
    this.processId=JSON.parse(localStorage.getItem('projectProcess')||"")
    // this.getAllAnalyticsAndTemplates();
    this.projectData=JSON.parse(localStorage.getItem('project')||"")
    this.processname=this.projectData.processName
    this.projectname=this.projectData.projectName
    this.projectid=this.projectData.projectId
    
    this.process = JSON.parse(localStorage.getItem("projectProcess") || '') 

    this.fileElem = document.getElementById('browse');
    this.shared.getClick()
  }
  // getAllAnalyticsAndTemplates() {
  //   let data = this.processId;
  //   this.Users_service.getAllAnalyticsAndTemplates(data).subscribe(
  //     (res: any) => {
  //       this.anyData = res.responseData;
  //       this.anaytics = res.responseData.processAnalyticsDTOList;
  //       this.anayticfile = res.responseData.templateResponse;
  //       // this.processname = res.responseData.processName;

  //       console.log('analytics', this.anaytics);
  //     }
  //   );
  // }

  downloadTemplates() {
    let data = this.processId;
    this.loader.show()
    this.Master.downloadTemplates(data).subscribe((res: any) => {
      this.downloadt = res.responseData;
      this.downloadt.forEach((element: any) => {
        let type = element.fileName.split('.');
        console.log(type[1]);
        if (type[1] == 'jpg') {
          let src = `data:image/jpg;base64,${element.content}`;
          // console.log(demo);
          let a = document.createElement('a');
          a.download = element.fileName;
          a.href = src;
          a.click();
          window.URL.revokeObjectURL(res.URL);
        }
        if (type[1] == 'xlsx' || type[1] == 'xls') {
          let src = `data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,${element.content}`;
          // console.log(demo);
          let a = document.createElement('a');
          a.download = element.fileName;
          a.href = src;
          a.click();
          window.URL.revokeObjectURL(res.URL);
        }
        if (type[1] == 'pdf') {
          let src = `data:application/pdf;base64,${element.content}`;
          // console.log(demo);
          let a = document.createElement('a');
          a.download = element.fileName;
          a.href = src;
          a.click();
          window.URL.revokeObjectURL(res.URL);
        }
        if (type[1] == 'png') {
          let src = `data:image/png;base64,${element.content}`;
          // console.log('png');
          let a = document.createElement('a');
          a.download = element.fileName;
          a.href = src;
          a.click();
          window.URL.revokeObjectURL(res.URL);
        }
        if (type[1] == 'csv') {
          let src = `data:application/csv;base64,${element.content}`;
          // console.log(demo);
          let a = document.createElement('a');
          a.download = element.fileName;
          a.href = src;
          a.click();
          window.URL.revokeObjectURL(res.URL);
        }
        if (type[1] == 'txt') {
          let src = `data:application/txt;base64,${element.content}`;
          // console.log('demo');
          let a = document.createElement('a');
          a.download = element.fileName;
          a.href = src;
          a.click();
          window.URL.revokeObjectURL(res.URL);
        }
        if (type[1] == 'zip') {
          let src = `data:application/zip;base64,${element.content}`;
          // console.log('demo');
          let a = document.createElement('a');
          a.download = element.fileName;
          a.href = src;
          a.click();
          window.URL.revokeObjectURL(res.URL);
        }
      });
      // this.down = !this.down;
      this.loader.hide();
      this.toast.success({title: 'Success',message: 'Downloaded Successfully!'});
      // this.router.navigate(["/user/admin1/execute-process"])
    },
    (err:any)=>{
      this.loader.hide(); 
      this.toast.error({ title: 'Error', message: 'Download Failed!' });     
    })
  }
  customPage() {}
  executePage() {}

  success(e: any) {
    // let prodata = this.projectid;
    // console.log("projectid",data);

    let userid = JSON.parse(localStorage.getItem("userInfo") || '{}')
     console.log(userid, userid.userId);
    
    // const formData = new FormData();
    //  formData.append('projectId',data);
    //  formData.append('userId',userid.userId);
    //  formData.append('processId',this.anyData.processId);
    let data =  {
      projectId : this.projectid,
      userId: userid.userId,
      processId: this.anyData.processId
    }
     
    this.solService.executeProject(data).subscribe((res: any) => {
      console.log(res);
      this.AddEventProceeding = true;
      this.addEventIndex = e;
      this.hideschedule = false;
    })
  }
  saveiputFiles(event:any){
    // let processId: string = this.process.processId;
    let data = this.projectid;
    console.log("projectid",data);

    let userid = JSON.parse(localStorage.getItem("userInfo") || '{}')
     console.log(userid, userid.userId);
    
    const formData = new FormData();
     formData.append('projectId',data);
     formData.append('userId',userid.userId);
     formData.append('processId',this.anyData.processId);
     
    // console.log(formData);

    for (let i = 0; i < event.target.files.length; i++) {
      formData.append('file', event.target.files[i])
    }
    console.log(formData);
    
    this.loader.show()
    this.solService.uploadExcelToProjectExecutionNreExecution(formData).subscribe((res: any) => {
      this.uploaddata = res.responseData;
      this.loader.hide()
      console.log(this.uploaddata);
      this.toast.success({title: 'Success',message: 'Upload Successfully!'});
    }),
    (err:any)=>{
      this.toast.error({ title: 'Error', message: 'Upload Failed!' });
    }

  }

  scheduler(){
    // this.submited = true
    // if (this.contactForm.invalid) {
      // console.log(this.contactForm);
    //   this.toast.error({ title: 'Error', message: "Enter All the Required Fields" });
    //   return;
    // }

    this.subtab1 
    this.subtab2 
    this.subtab3
      
    let scfreq =(this.subtab1)? 'Daily': (this.subtab2)? 'Weekly': 'Monthly'
     let scheduledata = {
      // if(this.subtab1 == true){
      //   scheduleFrequency: "daily";
      // }
      // else if(this.subtab2 == true){
      //   scheduleFrequency: "weekly";
      // }
      // else{
      //     scheduleFrequency: "montly";
      // },
      projectId : this.projectid,
      scheduleFrequency: scfreq,

      startDate: this.scheduleForm.value.startdate1,
      endDate: this.scheduleForm.value.enddate1,
      executionTime: this.scheduleForm.value.time1,
      // startdate2: this.scheduleForm.value.startdate2,
      // enddate2: this.scheduleForm.value.enddate2,
      executionDay: this.scheduleForm.value.day,
      // time2: this.scheduleForm.value.time2,
      // startdate3: this.scheduleForm.value.startdate3,
      // enddate3: this.scheduleForm.value.enddate3,
      dateOfmonth: this.scheduleForm.value.date,
      // time3: this.scheduleForm.value.time3,

      }
      this.solService.addScheduler(scheduledata).subscribe((res:any)=>{
        console.log("contactus",res);
        this.toast.success({ title: 'Success', message: "Project Scheduled Successfully!" });
        this.router.navigate(["/user/admin1/project"])
        
      })
      ,(err:any)=>{
          this.toast.error({ title: 'Error', message: err.statusMessage });
        }
    }
  // addScheduler

  changesubtab(id:any){
    if(id == 1){
      this.subtab1 = true;
      this.subtab2 = false;
      this.subtab3 = false;
    }
    else if(id == 2){
      this.subtab1 = false;
      this.subtab2 = true;
      this.subtab3 = false;
    }
    else{
      this.subtab1 = false;
      this.subtab2 = false;
      this.subtab3 = true;
    }
  }
  executelater(){
    this.hideschedule = true;
  }
  closePopup(){
    this.AddEventProceeding = false;
  }
}
