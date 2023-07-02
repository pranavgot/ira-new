import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { Router } from '@angular/router';
import { MastersService } from 'src/app/core/services/masters/masters.service';
// import { ToastComponent } from '../../all-common/toast/toast.component';

@Component({
  selector: 'app-view-approval',
  templateUrl: './view-approval.component.html',
  styleUrls: ['./view-approval.component.scss']
})
export class ViewApprovalComponent implements OnInit {
  getAllService: any;
  // approveserviceForm!: FormGroup;
  getAllService1: any;
  submited: boolean = false;

  constructor(
    private formbuilder: FormBuilder,
    private Master: MastersService,
    private router: Router,
    // private toast: ToastComponent,
  ) {}


    ngOnInit(): void {
      // this.approveserviceForm = this.formbuilder.group({
      //   name: [''],
      //   designation: [''],
      //   Organization: [''],
      //   contactnumber: [''],
      //   emailId: [''],
      // })
      // this.getAllServiceRequests()
  }

  // AddEventProceeding: boolean | undefined;
  // Eventproceedings() {
  //    this.addEventForm?.reset();
  //    this.AddEventProceeding = true
  //  }
 
  // addEventFormSubmit() {
  //    let data: any = {}
       
  //  }
 
 
 
  
   edit(e:any,item: any) {
    //  this.AddEventProceeding = true;
    //  this.addEventIndex = e;
    //  this.servicerequrstid= item.
  //    this.approveserviceForm?.patchValue({
  //       name: item.userResponse.userName,
  //       designation: item.userResponse.designation,
  //       Organization: item.userResponse.organizationMstDTO.organizationName,
  //       contactnumber: item.userResponse.contactNo,
  //       emailId: item.userResponse.emailId,
  //       renewsubscription: item.userResponse.emailId,
  //       message: item.requestMessage,
  //       renewworkspace:,
  
  //    })
   }
  //  CloseModal() {
  //   this.AddEventProceeding = false;
  //  }

  //  getAllServiceRequests(){
  //   this.Master.getAllServiceRequests().subscribe((res: any) => {
  //     console.log("getall",res);
  //     this.getAllService = res.responseData;
  //     this.getAllService1 = res.responseData[0].serviceRequestDetailResponseList
  //     console.log(this.getAllService1);
      
  //   })
  //  }

  //  approve(){
  // console.log("id",this.getAllService[0].userResponse.organizationMstDTO.organizationId);
  // console.log(this.getAllService[0].serviceRequestId);
  //   this.router.navigate(["/user/admin2/view-subscription",{organizationId: this.getAllService[0].userResponse.organizationMstDTO.organizationId, serviceRequestId: this.getAllService[0].serviceRequestId}])
  //  }
}
