import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { MastersService } from 'src/app/core/services/masters/masters.service';
import { SolutionService } from 'src/app/core/services/solution/solution.service';
import { UsersService } from 'src/app/core/services/users/users.service';
import { LoaderService } from 'src/app/core/services/loader.service';
import { SharedService } from 'src/app/core/services/shared.service';
import { HttpClient, HttpEventType } from '@angular/common/http';
import { PopupService } from 'src/app/core/services/popup.service';
import { catchError, tap } from 'rxjs/operators';
import { forkJoin, of } from 'rxjs';

@Component({
  selector: 'app-new-project',
  templateUrl: './new-project.component.html',
  styleUrls: ['./new-project.component.scss']
})
export class NewProjectComponent implements OnInit {

  AddEventProceeding: boolean | undefined;
  AddEventProceeding1: boolean | undefined;
  addEventIndex: any;
  AllProcess: any;
  flag = true;
  processName: any;
  choice: any;
  projectForm!: FormGroup;
  submited: boolean = false;
  userProcess: any;
  processes: any;
  processdetails: any;
  fileElem!: HTMLElement | null;
  process: any;
  projectData1: any;
  processname1: any;
  projectname1: any;
  panelOpenStateFive = true;
  down = true;
  scheduleForms: boolean = false;
  projectid: any;
  processId: any;
  anaytics: any;
  anayticfile: any;
  downloadt: any;
  demo: any;
  executionForm!: FormGroup;
  tabs = [
    { id: 0, value: 'Download Files', isActive: true },
    { id: 1, value: 'Execute Project', isActive: false },
    { id: 2, value: 'Shedule Project', isActive: false },
  ];
  projectData: any;
  processname: any;
  projectname: any;
  subtab1: boolean = true;
  subtab2: boolean = false;
  subtab3: boolean = false;
  scheduleForm!: FormGroup;
  anyData: any;
  progressBar: Array<any> = []
  progressBarPopup: boolean = false
  userData: any = {}
  projectcreated: boolean = false;
  uploadData: any;
  typestandalone: boolean = true;
  tabincremental: boolean = true;
  selectedTypeFromMyProject: any = {}
  
  fileList: any = [];
  day: Array<any> = [
    { id: 0, value: 'Sunday', isSelected: false },
    { id: 1, value: 'Monday', isSelected: false },
    { id: 2, value: 'Tuesday', isSelected: false },
    { id: 3, value: 'Wednesday', isSelected: false },
    { id: 4, value: 'Thursday', isSelected: false },
    { id: 5, value: 'Friday', isSelected: false },
    { id: 6, value: 'Saturday', isSelected: false },
  ];
  date: Array<any> = [
    { id: 0, value: '0', isSelected: false },
    { id: 1, value: '1', isSelected: false },
    { id: 2, value: '2', isSelected: false },
    { id: 3, value: '3', isSelected: false },
    { id: 4, value: '4', isSelected: false },
    { id: 5, value: '5', isSelected: false },
    { id: 6, value: '6', isSelected: false },
    { id: 7, value: '7', isSelected: false },
    { id: 8, value: '8', isSelected: false },
    { id: 9, value: '9', isSelected: false },
    { id: 10, value: '10', isSelected: false },
    { id: 11, value: '11', isSelected: false },
    { id: 12, value: '12', isSelected: false },
    { id: 13, value: '13', isSelected: false },
    { id: 14, value: '14', isSelected: false },
    { id: 15, value: '15', isSelected: false },
    { id: 16, value: '16', isSelected: false },
    { id: 17, value: '17', isSelected: false },
    { id: 18, value: '18', isSelected: false },
    { id: 19, value: '19', isSelected: false },
    { id: 20, value: '20', isSelected: false },
    { id: 21, value: '21', isSelected: false },
    { id: 22, value: '22', isSelected: false },
    { id: 23, value: '23', isSelected: false },
    { id: 24, value: '24', isSelected: false },
    { id: 25, value: '25', isSelected: false },
    { id: 26, value: '26', isSelected: false },
    { id: 27, value: '27', isSelected: false },
    { id: 28, value: '28', isSelected: false },
    { id: 29, value: '29', isSelected: false },
    { id: 30, value: '30', isSelected: false },
    { id: 31, value: '31', isSelected: false },
  ];
  typeExecution: any;
  timeline: any = 'Daily';
  projectstandalone: boolean = false;
  manualupload: boolean = true;
  projectexecute: boolean = false;
  executeForms: boolean = false;
  projectTypes: any;
  idproject: any;
  idprocess: any;
  pdata: any;
  filetypes: any;
  dataproject: any;

  constructor(
    private popup: PopupService,
    private formbuilder: FormBuilder,
    private shared: SharedService,
    private solService: SolutionService,
    private Users_service: UsersService,
    private Master: MastersService,
    private _sanitizer: DomSanitizer,
    private http: HttpClient,
    private loader: LoaderService,
    private router: Router,
    private solution: SolutionService,
  ) { }

  ngOnInit(): void {
    this.selectedTypeFromMyProject = JSON.parse(localStorage.getItem('selectionTypeMyproject') || '{"viewType":"List"}')

    this.processId = JSON.parse(localStorage.getItem('projectProcess') || 'null')
    this.projectData = JSON.parse(localStorage.getItem('project') || "null")
    this.userData = JSON.parse(localStorage.getItem('userInfo') || "{}")
    console.log(this.projectData);

    if (this.selectedTypeFromMyProject?.projectType == 'Standalone') {
      this.projectstandalone = true;
    }
    if (this.selectedTypeFromMyProject?.projectType == 'Incremental') {
      this.projectstandalone = false;
    }

    if (this.projectData?.projectType == 'Standalone') {
      this.projectstandalone = true;
    }
    if (this.projectData?.projectType == 'Incremental') {
      this.projectstandalone = false;
    }

    if (this.projectData?.schedulerDTO?.startDate == null) {
      this.scheduleForms = false;
    }
    if (!this.projectData?.schedulerDTO?.startDate == null) {
      this.scheduleForms = true;
    }

    if (this.dataproject?.scheduleFrequency == null) {
      this.scheduleForms = false;
      if (this.dataproject?.userEmailId == null) {
        this.manualupload = true;
      }
      else {
        this.manualupload = false;
      }
    }
    if (!this.dataproject?.scheduleFrequency == null) {
      this.scheduleForms = true;
    }

    this.process = JSON.parse(localStorage.getItem("projectProcess") || '{}')

    this.fileElem = document.getElementById('browse');
    this.shared.getClick()

    this.projectForm = this.formbuilder.group({
      chooseProcess: ['', Validators.required],
      projectname: ['', Validators.required],
      standalone: [''],
      executiontype: ['', Validators.required]
    });

    this.executionForm = this.formbuilder.group({
      filetype: this.formbuilder.array([]),
      path: [''],
      email: [''],
      password: [''],
      domain: [''],
      executionType: [''],
      startdate: [''],
      enddate: [''],
      time: [''],
      day: [''],
      date: [''],
      uploadtype: ['']
    });


    if (this.selectedTypeFromMyProject != '') this.projectForm.patchValue({ standalone: this.selectedTypeFromMyProject.projectType?.toLowerCase() })
    this.scheduleForm = this.formbuilder.group({
      startdate: [''],
      enddate: [''],
      time: [''],
      day: [''],
      date: ['']
    });

    this.getprocessbyid();
    
    if (this.projectData) {
      this.processname = this.projectData.processName
      this.projectname = this.projectData.projectName
      this.projectid = this.projectData.projectId
      this.getAllUploadFileTemplate();
    }
  }

  fileArr() {
    return this.executionForm.controls.filetype as FormArray
  }
  fileListObj() {
    return this.formbuilder.group({
      // fileId: [''],
      // fileName: [''],
      executionType: ['']
    })
  }
  fileListAdd() {
    this.fileArr().push(this.fileListObj());
  }
  removeList(i: any) {
    this.fileArr().removeAt(i);
  }

  getprocessbyid() {
    let projecttypedata = JSON.parse(localStorage.getItem("selectionTypeMyproject") || '{}')
    this.projectTypes = projecttypedata.projectType;

    let data = JSON.parse(localStorage.getItem("userInfo") || '{}')
    console.log(data);

    if (data.roleName == 'External User') {
      this.Users_service.getprocessbyid(data.userId, 1).subscribe((res: any) => {
        this.processes = res.responseData;

        if (this.projectData) {
          this.processes.forEach((item: any) => {
            if (this.projectData.organizationSolutionId == item.orgsolnId || this.projectData.processId == item.processId) {
                this.projectForm.patchValue({
                chooseProcess: item,
                projectname: this.projectname,
                executiontype: this.projectData.schedulerDTO.startDate == null ? 'execute' : 'schedule'
              })
            }
          });
          this.scheduleForms = this.projectData.schedulerDTO.startDate == null ? false : true
          this.projectForm.get('chooseProcess')?.disable();
          this.projectForm.get('projectname')?.disable();
          this.projectcreated = true
          this.getAllAnalyticsAndTemplates();
          this.getAllUploadFileTemplate();
        }

        this.userProcess = [];
        this.AllProcess?.forEach((element: any) => {
          res.responseData.forEach((ele: any) => {
            if (ele.processId == element.processId) {
              this.userProcess.push(element);
            }
          });

          element.img = this._sanitizer.bypassSecurityTrustResourceUrl('data:image/png;base64,' + element.imageUrl)
        });
        this.loader.hide();
      });
    }
    else {
      this.Users_service.getprocessbyid(data.userId, 2).subscribe((res: any) => {
        this.processes = res.responseData;

        if (this.projectData) {
          this.processes.forEach((item: any) => {
            if (this.projectData.organizationSolutionId == item.orgsolnId || this.projectData.processId == item.processId) {
              this.projectForm.patchValue({
                chooseProcess: item,
                projectname: this.projectname,
                executiontype: this.projectData?.schedulerDTO?.startDate == null ? 'execute' : 'schedule'
              })
            }
          });
          this.scheduleForms = this.projectData?.schedulerDTO?.startDate == null ? false : true
          this.projectForm.get('chooseProcess')?.disable();
          this.projectForm.get('projectname')?.disable();
          this.projectcreated = true
          this.getAllAnalyticsAndTemplates();
          this.getAllUploadFileTemplate();
        }

        this.userProcess = [];
        this.AllProcess?.forEach((element: any) => {
          res.responseData.forEach((ele: any) => {
            if (ele.processId == element.processId) {
              this.userProcess.push(element);
            }
          });

          element.img = this._sanitizer.bypassSecurityTrustResourceUrl('data:image/png;base64,' + element.imageUrl)
        });
        this.loader.hide();
      });
    }
  }
  getAllProcess() {
    this.loader.show();
    this.Master.getAllProcess().subscribe((res: any) => {
      this.AllProcess = res.responseData;
      this.getprocessbyid();
    });
  }

  success(e: any) {
    this.AddEventProceeding = true;
    this.addEventIndex = e;
  }
  CloseModal() {
    this.AddEventProceeding = false;
  }

  projectSubmit() {
    this.loader.show();
    this.submited = true;
    if (this.projectForm.invalid) {
      this.popup.open(false, 'Please select all the required field');
      this.loader.hide();
      return;
    }
    let userid = JSON.parse(localStorage.getItem("userInfo") || '{}')
    let orgsid;
    this.processes.forEach((ele: any) => {

      if (ele.processId == this.processId) {
        this.processId = ele.processId
        orgsid = this.processdetails?.orgsolnId;
      }

    });
    let data: any = {
      projectName: this.projectForm.value.projectname,
      executionType: this.projectForm.value.standalone == 'incremental' ? 'I' : 'S',
      processName: this.projectForm.value.chooseProcess.processName,
      organizationSolutionId: this.projectForm.value.chooseProcess.orgsolnId,
      userId: userid.userId
    };
    this.processId = this.projectForm.value.chooseProcess.processId
    this.processes.forEach((obj: any) => {
      if (this.processName == obj.processName)
        data.organizationSolutionId = obj.orgsolnId
    })
    this.solution.createProject(data).subscribe(
      (res: any) => {
        this.projectcreated = true
        this.projectid = res.responseData.projectId;

        this.popup.open(true, "Project created Successfully");
        localStorage.setItem('project', JSON.stringify(res.responseData));
        localStorage.setItem('projectProcess', JSON.stringify(this.processId));

        this.AddEventProceeding = true;
        this.loader.hide();
        this.getAllAnalyticsAndTemplates();
        this.getAllUploadFileTemplate();
      },
      (err: any) => {
        this.loader.hide();
        this.popup.open(false, err.error.statusMessage);
      }
    );
  }

  downloadTemplates() {
    let data = this.processId || this.projectData.processId;
    this.loader.show()
    this.Master.downloadTemplates(data).subscribe((res: any) => {
      this.downloadt = res.responseData;
      this.downloadt.forEach((element: any) => {
        let type = element.fileName.split('.');
        if (type[1] == 'jpg') {
          let src = `data:image/jpg;base64,${element.content}`;
          let a = document.createElement('a');
          a.download = element.fileName;
          a.href = src;
          a.click();
          window.URL.revokeObjectURL(res.URL);
        }
        if (type[1] == 'xlsx' || type[1] == 'xls') {
          let src = `data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,${element.content}`;
          let a = document.createElement('a');
          a.download = element.fileName;
          a.href = src;
          a.click();
          window.URL.revokeObjectURL(res.URL);
        }
        if (type[1] == 'pdf') {
          let src = `data:application/pdf;base64,${element.content}`;
          let a = document.createElement('a');
          a.download = element.fileName;
          a.href = src;
          a.click();
          window.URL.revokeObjectURL(res.URL);
        }
        if (type[1] == 'png') {
          let src = `data:image/png;base64,${element.content}`;
          let a = document.createElement('a');
          a.download = element.fileName;
          a.href = src;
          a.click();
          window.URL.revokeObjectURL(res.URL);
        }
        if (type[1] == 'csv') {
          let src = `data:application/csv;base64,${element.content}`;
          let a = document.createElement('a');
          a.download = element.fileName;
          a.href = src;
          a.click();
          window.URL.revokeObjectURL(res.URL);
        }
        if (type[1] == 'txt') {
          let src = `data:application/txt;base64,${element.content}`;
          let a = document.createElement('a');
          a.download = element.fileName;
          a.href = src;
          a.click();
          window.URL.revokeObjectURL(res.URL);
        }
        if (type[1] == 'zip') {
          let src = `data:application/zip;base64,${element.content}`;
          let a = document.createElement('a');
          a.download = element.fileName;
          a.href = src;
          a.click();
          window.URL.revokeObjectURL(res.URL);
        }
      });

      this.loader.hide();
      this.popup.open(true, 'Downloaded Successfully');
    },
      (err: any) => {
        this.loader.hide();
        this.popup.open(false, 'Download Failed');
      })
  }

  getAllAnalyticsAndTemplates() {
    let processid = this.processId || this.projectData.processId;
    this.Users_service.getAllAnalyticsAndTemplates(processid, this.projectid).subscribe(
      (res: any) => {
        this.anyData = res.responseData;
        this.anaytics = res.responseData.processAnalyticsDTOList;
        this.anayticfile = res.responseData.fileResponse;
        this.anayticfile.forEach((element: any) => {
          this.fileListAdd()
        });
        console.log(this.anyData);
        this.getProjectDetailsById();
      }
    );
  }

  getAllUploadFileTemplate() {
    this.uploadData = []
    let data = this.projectData?.projectId || this.projectid;
    this.solService.getAllUploadFileTemplate(data).subscribe(
      (res: any) => {
        this.uploadData = res.responseData;
      }, (err: any) => {

      });
  }

  saveiputFiles(event: any) {
    let data = this.projectid;
    let userid = JSON.parse(localStorage.getItem("userInfo") || '{}')
    let postRequestArray: Array<any> = []
    this.progressBar = []
    if (this.projectstandalone) {
      for (let i = 0; i < event.target.files.length; i++) {
        const formData = new FormData();
        formData.append('projectId', this.projectid);
        formData.append('userId', userid.userId);
        formData.append('processId', this.anyData.processId);
        formData.append('file', event.target.files[i])
        if (this.projectData?.statusName == 'Success' || this.projectData?.statusName == 'Failed' || this.projectData?.statusName == 'PBI-Failed') {
          formData.append('flag', "1")
        }
        postRequestArray.push(this.solService.uploadExcelToProjectExecutionNreExecution(formData).pipe(
          tap((e: any) => {
            if (e.type === HttpEventType.UploadProgress) {
              this.progressBar[i] = { percentage: Math.round((95 / e.total) * e.loaded), file: event.target.files[i].name, isError: false, icon: false }
            }
          }),
          catchError((err) => {
            return of({ error: err, isError: true })
          }
          )))
      }
    }
    if (!this.projectstandalone) {
      this.fileArr().controls.forEach((element: any, i: any) => {
        console.log(element);
        this.fileList.push({
          fileId: this.anayticfile[i].fileId,
        })
      });
      for (let i = 0; i < event.target.files.length; i++) {
        const formData = new FormData();
        formData.append('projectId', this.projectid);
        formData.append('userId', userid.userId);
        formData.append('processId', this.anyData.processId);
        formData.append('file', event.target.files[i])
        // formData.append('fileType', )
        formData.append('fileId', this.anayticfile[i].fileId,)
        if (this.projectData?.statusName == 'Success' || this.projectData?.statusName == 'Failed' || this.projectData?.statusName == 'PBI-Failed') {
          formData.append('flag', "1")
        }
        postRequestArray.push(this.solService.uploadExcelToProjectExecutionNreExecution(formData).pipe(
          tap((e: any) => {
            if (e.type === HttpEventType.UploadProgress) {
              this.progressBar[i] = { percentage: Math.round((95 / e.total) * e.loaded), file: event.target.files[i].name, isError: false, icon: false }
            }
          }),
          catchError((err) => {
            return of({ error: err, isError: true })
          }
          )))
      }
    }

    this.uploadData = []
    this.progressBarPopup = true
    forkJoin(
      postRequestArray
    ).subscribe((response: any) => {
      response.forEach((res: any, i: number) => {
        this.progressBar[i].percentage = 100
        this.progressBar[i].icon = true
        if (res.isError) {
          this.progressBar[i].isError = res.isError
          this.progressBar[i].errMsg = res.error.error.statusMessage
        }
        else this.progressBar[i].isError = false
      })

      let err = response.map((x: any) => x.isError)
      if (!err.includes(true)) {
        this.progressBarPopup = false
      }
      this.getAllUploadFileTemplate()
    });
  }

  changesubtab(id: any) {
    if (id == 1) {
      this.subtab1 = true;
      this.subtab2 = false;
      this.subtab3 = false;
      this.timeline = 'Daily'
    }
    else if (id == 2) {
      this.subtab1 = false;
      this.subtab2 = true;
      this.subtab3 = false;
      this.timeline = 'Weekly'
    }
    else {
      this.subtab1 = false;
      this.subtab2 = false;
      this.subtab3 = true;
      this.timeline = 'Monthly'
    }
  }

  scheduleProject() {
    this.scheduleForms = true;
  }
  executeProject() {
    this.scheduleForms = false;
  }

  manualType() {
    this.manualupload = true;
  }
  pathType() {
    this.manualupload = false;
  }

  closePopup() {
    this.AddEventProceeding1 = false;
  }

  executeNow() {
    // console.log(this.scheduleForms);
    if (this.projectstandalone) {
      let execObj = {
        projectId: this.projectData?.projectId || this.projectid,
        userId: this.userData.userId,
        processId: this.anyData.processId
      }
      this.solService.executeProject(execObj).subscribe(
        (res: any) => {
          this.popup.open(true, res.statusMessage);
          this.loader.hide();
          this.router.navigate(['user/admin1/my-project']);
        },
        (err: any) => {
          this.loader.hide();
          this.popup.open(false, err.error.statusMessage);
        }
      );
    }

    if (!this.projectstandalone && !this.scheduleForms && this.manualupload) {
      let execObj = {
        projectId: this.projectData?.projectId || this.projectid,
        userId: this.userData.userId,
        processId: this.anyData.processId
      }
      this.solService.executeProject(execObj).subscribe(
        (res: any) => {
          this.popup.open(true, res.statusMessage);
          this.loader.hide();
          this.router.navigate(['user/admin1/my-project']);
        },
        (err: any) => {
          this.loader.hide();
          this.popup.open(false, err.error.statusMessage);
        }
      );
    }


    if (this.scheduleForms) {
      let userid = JSON.parse(localStorage.getItem("userInfo") || '{}')
      this.fileArr().controls.forEach((element: any, i: any) => {
        this.fileList.push({
          fileId: this.anayticfile[i].fileId,
          fileName: this.anayticfile[i].fileName,
          executionType: element.value.executionType
        })
      });
        let data1: any = {
        projectId: this.projectData?.projectId || this.projectid,
        userId: this.userData.userId,
        processId: this.anyData.processId,
        scheduleFrequency: this.timeline,
        startDate: this.executionForm.value.startdate,
        endDate: this.executionForm.value.enddate,
        executionTime: this.executionForm.value.time,
        executionDay: this.executionForm.value.day,
        executionDate: this.executionForm.value.date,
        userMailId: this.executionForm.value.email,
        password: this.executionForm.value.password,
        sharePoint: this.executionForm.value.path,
        domain: this.executionForm.value.domain,
        fileDTOList: this.fileList,
      };

      this.solService.addScheduler(data1).subscribe((res: any) => {
        this.popup.open(true, res.statusMessage);
        this.loader.hide();
        this.router.navigate(['user/admin1/my-project']);
      },
        (err: any) => {
          this.loader.hide();
          this.popup.open(false, err.error.statusMessage);
        }
      );

    }


    if (!this.projectstandalone && !this.scheduleForms && !this.manualupload) {
      let userid = JSON.parse(localStorage.getItem("userInfo") || '{}')
      this.fileArr().controls.forEach((element: any, i: any) => {
        // console.log(element);
        this.fileList.push({
          fileId: this.anayticfile[i].fileId,
          fileName: this.anayticfile[i].fileName,
          executionType: element.value.executionType
        })
      });
    
      let data2: any = {
        projectId: this.projectData?.projectId || this.projectid,
        userId: this.userData.userId,
        processId: this.anyData.processId,
        userMailId: this.executionForm.value.email,
        password: this.executionForm.value.password,
        sharePoint: this.executionForm.value.path,
        domain: this.executionForm.value.domain,
      };

      this.solService.incrementalapi(data2).subscribe((res: any) => {
        this.popup.open(true, res.statusMessage);
        this.loader.hide();
        this.router.navigate(['user/admin1/my-project']);
      },
        (err: any) => {
          this.loader.hide();
          this.popup.open(false, err.error.statusMessage);
        }
      );

    }

  }
  savefiletype() {
    let userid = JSON.parse(localStorage.getItem("userInfo") || '{}')
    this.fileArr().controls.forEach((element: any, i: any) => {
      // console.log(element);
      this.fileList.push({
        fileId: this.anayticfile[i].fileId,
        fileName: this.anayticfile[i].fileName,
        executionType: element.value.executionType
      })
    });
    
    let filedata: any = {
      projectId: this.projectData?.projectId || this.projectid,
      userId: this.userData.userId,
      fileDTOList: this.fileList,
    };

    this.solService.saveFileTypeIncremental(filedata).subscribe((res: any) => {
      this.popup.open(true, res.statusMessage);
      this.loader.hide();
    },
      (err: any) => {
        this.loader.hide();
        this.popup.open(false, err.error.statusMessage);
        console.log(err.error.statusMessage);
        
      }
    );

  }

  getProjectDetailsById() {
    console.log(this.anyData, this.projectData, this.projectid);


    this.idproject = this.projectData?.projectId || this.projectid,
      this.idprocess = this.anyData?.processId,


      this.solService.getProjectDetailsById(this.idproject, this.idprocess).subscribe((res: any) => {

        this.dataproject = res.responseData;
        this.pdata = res.responseData.fileDTOList;
        console.log(this.dataproject);


        this.executionForm.patchValue({
          path: this.dataproject.sharePoint,
          email: this.dataproject.userMailId,
          password: this.dataproject.password,
          domain: this.dataproject.domain,
          // executionType: [''],
          startdate: this.dataproject.startDate,
          enddate: this.dataproject.endDate,
          time: this.dataproject.executionTime,
          day: this.dataproject.executionDay,
          date: this.dataproject.dateOfmonth,
          uploadtype: this.dataproject.sharePoint == null ? 'manual' : 'path',

         })
        // console.log(this.fileArr());

        this.fileArr().controls.forEach((fa: any, i: any) => {
          this.fileArr().controls[i].patchValue({
            executionType: this.dataproject.fileDTOList[i].executionType
          })
        });
        this.manualupload = this.dataproject.sharePoint == null ? true : false,
          this.loader.hide();
      },
        (err: any) => {
          this.loader.hide();
        }
      );

  }
}