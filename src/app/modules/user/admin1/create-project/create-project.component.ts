import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { MastersService } from 'src/app/core/services/masters/masters.service';
import { SolutionService } from 'src/app/core/services/solution/solution.service';
import { UsersService } from 'src/app/core/services/users/users.service';
import { ToastComponent } from '../../all-common/toast/toast.component';
import { LoaderService } from 'src/app/core/services/loader.service';
import { PopupService } from 'src/app/core/services/popup.service';

@Component({
  selector: 'app-create-project',
  templateUrl: './create-project.component.html',
  styleUrls: ['./create-project.component.scss'],
})
export class CreateProjectComponent implements OnInit {
  AddEventProceeding: boolean | undefined;
  addEventIndex: any;
  AllProcess: any;
  flag = true;
  processName: any;
  choice: any;
  projectForm!: FormGroup;
  submited: boolean = false;

  // id = '1E6ADE20-C96B-4090-9022-03DAADF33C92';
  userProcess: any;
  processes: any;
  processdetails: any;
  CreationData: any;

  constructor(
    private loader: LoaderService,
    private Users_service: UsersService,
    private Master: MastersService,
    private solution: SolutionService,
    private _sanitizer: DomSanitizer,
    private toast: ToastComponent,
    private router: Router,
    private route: ActivatedRoute,
    private popup:PopupService,
    private formbuilder: FormBuilder
  ) { }

  ngOnInit(): void {
    this.projectForm = this.formbuilder.group({
      processname: [''],
      projectname: ['', Validators.required],
      standalone: [''],
    });
    // this.getAllProcess();
    this.getprocessbyid()
    this.CreationData = JSON.parse(this.route.snapshot.paramMap.get('createproject') || '');
    console.log(this.CreationData);
    
  }
  getprocessbyid() {
    // this.loader.show();
    let data = JSON.parse(localStorage.getItem("userInfo") || '{}')
    console.log(data, data.userId);
    // let data = this.id;
    this.Users_service.getprocessbyid(data.userId, 1).subscribe((res: any) => {
      this.processes = res.responseData;
      console.log(this.processes);

      this.userProcess = [];
      // console.log('this.AllProcess', this.AllProcess);
      if (this.CreationData != '') {
        this.processdetails = this.CreationData;
        // console.log(data);
        this.processName = this.CreationData.processName;
      }
      this.AllProcess.forEach((element: any) => {
        res.responseData.forEach((ele: any) => {
          if (ele.processId == element.processId) {
            this.userProcess.push(element);
          }
        });
        // element.img = this._sanitizer.bypassSecurityTrustResourceUrl('data:image/png;base64,'+element.imageUrl)
      });
      this.loader.hide();
      console.log('userid process', this.userProcess, this.processes);
    });
  }
  // getAllProcess() {
  //   this.loader.show();

  //   this.Master.getAllProcess().subscribe((res: any) => {

  //     this.AllProcess = res.responseData;
  //     console.log(this.AllProcess);
  //     this.getprocessbyid();


  //   });
  // }
  addProject(data: any) {
    this.processdetails = data;
    console.log(data);
    this.processName = data.processName;
  }
  success(e: any) {
    this.AddEventProceeding = true;
    this.addEventIndex = e;
  }
  CloseModal() {
    this.AddEventProceeding = false;
  }

  createProject() { }

  projectSubmit() {
    this.loader.show();
    this.submited = true;
    if (this.projectForm.invalid) {
      console.log(this.projectForm);
      this.toast.error({
        title: 'Error',
        message: 'Enter All the Required Fields',
      });
      return;
    }
    // console.log(this.processes.orgSolnId);
    let orgsid;
    this.processes.forEach((ele: any) => {
      if (ele.processId == this.processdetails.processId) {
        // this.userProcess.push(element)
        // console.log(ele, this.processdetails);
        localStorage.setItem('projectProcess', JSON.stringify(ele.processId));
        orgsid = this.processdetails.orgsolnId;
      }
    });
    // this.processes[0].orgsolnId

    let data: any = {
      projectName: this.projectForm.value.projectname,
      executionType: this.projectForm.value.standalone ? 'S' : 'I',
      processName: this.processName,
      // projectname: this.projectForm.value.projectname,
    };

    this.processes.forEach((obj: any) => {
      if (this.processName == obj.processName)
        data.organizationSolutionId = obj.orgsolnId
    })
    console.log(data);

    this.solution.createProject(data).subscribe(
      (res: any) => {
        console.log(res);
        this.toast.success({ title: 'Success', message: "Project created successfully !" });
        // this.router.navigate(["/auth/landing"])
        localStorage.setItem('project', JSON.stringify(res.responseData));
        this.AddEventProceeding = true;
        this.loader.hide();
        this.router.navigate(['/user/admin1/view-download1']);
      },
      (err: any) => {
        this.loader.hide();
        this.toast.error({ title: 'Error', message: err.statusMessage });
      }
    );
  }
}
