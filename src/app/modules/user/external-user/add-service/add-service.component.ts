import { Component, OnInit } from '@angular/core';
import { MastersService } from 'src/app/core/services/masters/masters.service';
import { UsersService } from 'src/app/core/services/users/users.service';
import { MatSelectModule } from '@angular/material/select';
import { SolutionService } from 'src/app/core/services/solution/solution.service';
// import { ToastComponent } from '../../all-common/toast/toast.component';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { dateInputsHaveChanged } from '@angular/material/datepicker/datepicker-input-base';
import { PopupService } from 'src/app/core/services/popup.service';


@Component({
  selector: 'app-add-service',
  templateUrl: './add-service.component.html',
  styleUrls: ['./add-service.component.scss']
})
export class AddServiceComponent implements OnInit {
  GprocData: any;
  CSprocData: any;
  subs: any;
  tab1: boolean = true;
  tab2: boolean = false;
  submited: boolean = false;
  addserviceForm!: FormGroup;


  // id="F81B7026-7D64-4C62-A6F1-BBA60EBBBA18";
  usersubs: any;
  userworkspace: any;
  processId: any=[];
  subscriptionTypeId: any=[];
  userData: any;
  processlist: any;
  sublist: any;

  constructor(
    private Users_service: UsersService,
    private Master: MastersService,
    private popup:PopupService,
    private solution: SolutionService,
    // private toast: ToastComponent,
    private router: Router,
    private formbuilder: FormBuilder,
  ) { }

  ngOnInit(): void {
    this.addserviceForm = this.formbuilder.group({
      oldsubscription: [''],
      oldworkspace: [''],
      newsubscription: [''],
      newworkspace: [''],
      message: [''],
    })
    this.userData = JSON.parse(localStorage.getItem("userInfo") || '{}')
    // console.log(data, data.userId);

    this.getSubscription()
    this.getAllProcess()
    this.getByUserIdSubscritpionDetails()
  }
  getAllProcess() {
    this.Master.getAllProcessByType(1).subscribe((res: any) => {
      this.GprocData = res.responseData;
      console.log("process", this.GprocData);
      // this.getByUserIdSubscritpionDetails()
      // this.lengthProcess = res.responseData.length;
    })
    // this.Master.getAllProcessByClientSpecific().subscribe((res: any) => {
    //   // console.log("process", res);
    //   this.CSprocData = res.responseData;
    //   // this.lengthProcess = res.responseData.length;
    // })
  }

  getSubscription() {
    this.Users_service.getSubscription().subscribe((res: any) => {
      // console.log("subscription", res);
      this.subs = res.responseData;
    })
  }
  getByUserIdSubscritpionDetails(){
    // let data = this.id;
    // let data = JSON.parse(localStorage.getItem("userInfo") || '{}')
    // console.log(data, data.userId);
    this.Users_service.getByUserIdSubscritpionDetails(this.userData.userId).subscribe((res: any) => {
      console.log("userid by subs", res);
      this.usersubs= res.responseData.userSolution;
      this.processlist = res.responseData.processList;
      this.sublist = res.responseData.subscriptionDTO
      this.userworkspace = res.responseData.userSubscription;
    })
  }
  changetab(id: any) {
    if (id == 1) {
      this.tab1 = true;
      this.tab2 = false;
    }
    else  {
      console.log("tab2");
      this.tab1 = false;
      this.tab2 = true;
    }
  }
  addserviceSubmit(){
    this.submited = true
    if (this.addserviceForm.invalid) {
      console.log(this.addserviceForm);
      this.popup.open(false,"Enter All the Required Fields");
      // this.toast.error({ title: 'Error', message: "Enter All the Required Fields" });
      return;
    }
    //console.log(this.addserviceForm);
    let data = {
      userId: this.userData.userId,
      // subscriptionTypeId: this.addserviceForm.value.newsubscription,
      // processId: this.addserviceForm.value. newworkspace,
      processDTO:this.processId,
      subscriptionDTO: this.subscriptionTypeId,
      requestMessage: this.addserviceForm.value.message,
    }
    this.Master.addServiceRequest(data).subscribe((res: any) => {
      console.log(res);
      this.popup.open(true,"Service added successfully !");
      // this.toast.success({ title: 'Success', message: "Service added successfully !" });
      this.router.navigate(["user/external_user/service-request"])


    })
      , (err: any) => {
        this.popup.open(false,err.statusMessage);
        // this.toast.error({ title: 'Error', message: err.statusMessage });
      }

  }
  UpdateSubs(eve:any,data:any){
    console.log(eve,data);
    if(eve.target.checked){
      this.processId.push({processId:data.processId})
    }
    else{
      this.processId.forEach((ele:any,ix:any)=>{
        if(ele.processId==data.processId){
          this.processId.removeAt(ix)
        }
      })
    }
    
  }
  UpdateWs(eve:any,data:any){
    console.log(eve,data);
    if(eve.target.checked){
      this.subscriptionTypeId.push({subscriptionTypeId:data.subscriptionTypeId})
    }
    else{
      this.subscriptionTypeId.forEach((ele:any,ix:any)=>{
        if(ele.subscriptionTypeId==data.subscriptionTypeId){
          this.subscriptionTypeId.removeAt(ix)
        }
      })
    }
    console.log(this.subscriptionTypeId);
    
  }
}
