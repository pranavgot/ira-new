import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LeadsService } from 'src/app/core/services/Leads/leads.service';
import { ToastComponent } from '../../all-common/toast/toast.component';
import { Location } from '@angular/common';
import { PopupService } from 'src/app/core/services/popup.service';
import { UsersService } from 'src/app/core/services/users/users.service';

@Component({
  selector: 'app-view-user-management',
  templateUrl: './view-user-management.component.html',
  styleUrls: ['./view-user-management.component.scss']
})
export class ViewUserManagementComponent implements OnInit {
  userroles: any;
  userorgData: any;
  userorgdetailsForm!: FormGroup;
  usersubs: any;
  submited: boolean = false;
  userworkspace: any;
 
  constructor(
    private user: UsersService,
    private popup:PopupService,
    private LeadsService: LeadsService,
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private toast: ToastComponent,
    private location: Location
  ) { }

  ngOnInit(): void {
    this.userorgdetailsForm = this.formBuilder.group({
      name: ['', Validators.required ],
      designation: ['', Validators.required ],
      contactnumber: ['', Validators.required ],
      email: ['', [Validators.required, Validators.email, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
      // usertype: ['', Validators.required ],
      // userrole: ['', Validators.required ],
      org_name: ['', Validators.required ],
      // org_contactnumber: ['', Validators.required ],
      // org_email: ['', Validators.required ],
      // org_address: ['', Validators.required ],
      spocname: ['', Validators.required ],
      spocdesignation: ['', Validators.required ],
      spoccontactnumber: ['', Validators.required ],
      spocemail: ['', [Validators.required, Validators.email, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
      address: ['', Validators.required ],
      status: ['']
    })
    //     let data = this.route.snapshot.paramMap.get("id");
    // console.log(data);

    this.getAllUser_organizationDetails()
    this.getSubscriptionDetailsByUserId()

    this.userroles = [{
      roleId: "3bd25bf5-fe22-4c52-aabe-67d8b685b9b7",
      roleName: "External Admin"
    },
    {
      roleId: "9365b6d9-8225-416c-9298-98ddd802f3f4",
      roleName: "External User"
    },
    {
      roleId: "A27780C7-D66E-4AE0-A78F-14C6A8E84D0D",
      roleName: "Level 1-Admin"
    },
    {
      roleId: "B3DEA306-B66E-44BB-B669-2F670C30F714",
      roleName: "Level 2-Admin"
    },
    {
      roleId: " A68E16A9-CAA1-4D80-99DC-FA8F50FDEFBD",
      roleName: "Internal User"
    },
  ]
  }

  userorgdetailsSubmit() {
    this.submited = true
    if (this.userorgdetailsForm.invalid) {
      // console.log(this.userorgdetailsForm);
      this.popup.open(false,'Enter All the Required Fields');
      // this.toast.error({ title: 'Error', message: "Enter All the Required Fields" });
      return;
    }
    // console.log(this.userorgdetailsForm);

    let data = {
      userId: this.route.snapshot.paramMap.get("id"),
      userName: this.userorgdetailsForm.value.name,
      designation: this.userorgdetailsForm.value.designation,
      userContactNo: this.userorgdetailsForm.value.contactnumber,
      userEmailid: this.userorgdetailsForm.value.email,
      userType: this.userorgdetailsForm.value.usertype,
      userRole: this.userorgdetailsForm.value.userrole,
      organizationName: this.userorgdetailsForm.value.org_name,
      // organizationContactNo: this.userorgdetailsForm.value.org_contactnumber,
      // organizationEmailId: this.userorgdetailsForm.value.org_email,
      address: this.userorgdetailsForm.value.address,
      spocName: this.userorgdetailsForm.value.spocname,
      spocDesignation: this.userorgdetailsForm.value.spocdesignation,
      spocphoneNo: this.userorgdetailsForm.value.spoccontactnumber,
      spocEmailId: this.userorgdetailsForm.value.spocemail,
      status: this.userorgdetailsForm.value.status,
      // address: this.userorgdetailsForm.value.address,
      
    }
    console.log(data);
    
    // if (this.editIndustryid) {
    //   data =
    //   {
    //     type: 2,
    //     industryId: this.editIndustryid,
    //     industryName: this.userorgdetailsForm.value.name
    //   }
    // }
    // else {
    //   data =
    //   {
    //     type: 1,
    //     industryName: this.userorgdetailsForm.value.name
    //   }
    // }addedituser_orgDetails
    this.LeadsService.addedituser_orgDetails(data).subscribe((res: any) => {
      this.popup.open(true,"Changes Saved!");
      // this.toast.success({ title: 'Success', message: "Changes Saved!"});
      this.router.navigate(["/user/admin2/user-management"])
      // this.location?.back();
      //   this.getAllIndustry()routerLink="/user/admin2/user-management"
      //   this.CloseModal()
      //   this.editIndustryid='';
      //   this.industryForm.reset();
    })
    ,(err:any)=>{
      this.popup.open(false,err.error.statusMessage);
        // this.toast.error({ title: 'Error', message: err.error.statusMessage });
      }
  }

  getAllUser_organizationDetails() {
    let data = this.route.snapshot.paramMap.get("id");
    this.LeadsService.getAllUser_organizationDetails(data).subscribe((res: any) => {
      console.log("nilam", res);
      this.userorgData = res.responseData[0];

      this.userorgdetailsForm.patchValue({
        name: this.userorgData.userName,
        designation: this.userorgData.designation,
        contactnumber: this.userorgData.userContactNo,
        email: this.userorgData.userEmailid,
        usertype: this.userorgData.userType,
        userrole: this.userorgData.userRole,
        org_name: this.userorgData.organizationName,
        spocname: this.userorgData.spocName,
        spocdesignation: this.userorgData.spocDesignation,
        spoccontactnumber: this.userorgData.spocphoneNo,
        spocemail: this.userorgData.spocEmailId,
        address: this.userorgData.address,
        status: (this.userorgData.status=='1')?true:false
      })
    })
    // ,(err:any)=>{
    //   this.toast.error({ title: 'Error', message: err.statusMessage });
    // }
  }
  
  getSubscriptionDetailsByUserId(){
    let data = this.route.snapshot.paramMap.get("id");
    this.user.getSubscriptionDetailsByUserId(data).subscribe((res: any) => {
      console.log("subs", res);
      this.usersubs= res.responseData.subscriptionDto;
      this.userworkspace= res.responseData.subsciptionTypeDetailsDto;
    })
  }
  
  cancel(){
    this.location.back();
  }
}
