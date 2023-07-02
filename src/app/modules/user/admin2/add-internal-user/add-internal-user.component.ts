import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UsersService } from 'src/app/core/services/users/users.service';
import { ToastComponent } from '../../all-common/toast/toast.component';
import { DomSanitizer } from '@angular/platform-browser';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { PopupService } from 'src/app/core/services/popup.service';

@Component({
  selector: 'app-add-internal-user',
  templateUrl: './add-internal-user.component.html',
  styleUrls: ['./add-internal-user.component.scss']
})
export class AddInternalUserComponent implements OnInit {
  subs: any;
  addUser: any = [];
  userroles: any;
  clients: any;
  orgData: any;
  orgdetailsForm!: FormGroup;
  addusersdetailsForm!: FormGroup;
  editindex: any = -1;
  editorgId: any;
  imgFile: any = null;
  submited: boolean = false;
  submit: boolean = false;
  demo: any;
  demoimg: boolean = false;
  AddEventProceeding: boolean | undefined;
  displayedColumns = ['userName', 'roleName', 'emailId', 'contactNo','status', 'action'];
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  dataSource = new MatTableDataSource([]);

  constructor(
    private Users_service: UsersService,
    private formBuilder: FormBuilder,
    private popup:PopupService,
    private router: Router,
    private _sanitizer: DomSanitizer,
    private toast: ToastComponent
  ) { }

  ngOnInit(): void {
    this.orgdetailsForm = this.formBuilder.group({
      spocDesignation: [{value:'',disabled:true}],
      spocphoneNo: [{value:'',disabled:true}],
      spocEmailId: [{value:'',disabled:true}],
      organizationEmailId: [{value:'',disabled:true}],
      file: [],
      organizationName: [{value:'',disabled:true}],
      spocName: [{value:'',disabled:true}],
      address: [{value:'',disabled:true}],
    });
    
    this.addusersdetailsForm = this.formBuilder.group({
      name: ['', Validators.required],
      designation: ['', Validators.required],
      contactnumber: ['', Validators.required],
      email: ['',[ Validators.required,Validators.email,Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'),],],
      roleId: ['', Validators.required],
      status: [''],
    });
    this.getAllInternalUsers();
    this.userroles = [
      {
        roleId: "A27780C7-D66E-4AE0-A78F-14C6A8E84D0D",
        roleName: "Level 1-Admin"
      },
      {
        roleId: "B3DEA306-B66E-44BB-B669-2F670C30F714",
        roleName: "Level 2-Admin"
      },
      {
        roleId: "A68E16A9-CAA1-4D80-99DC-FA8F50FDEFBD",
        roleName: "Internal User"
      },
    ];
  }
  
  edit(e: any) {
    this.AddEventProceeding = true;
    this.editindex = -1;
  }
  setDataSourceAttributes(){
    if(this.dataSource){
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }

  }
  getAllInternalUsers() {
    this.Users_service.getAllInternalUsers().subscribe(
      (res: any) => {
        this.orgData = res.responseData?.organizationMstDto;
        this.editorgId = this.orgData?.organizationId;
        this.orgdetailsForm.patchValue({
          organizationName: this.orgData.organizationName,
          spocphoneNo: this.orgData.spocphoneNo,
          spocEmailId: this.orgData.spocEmailId,
          organizationEmailId: this.orgData.organizationEmailId,
          address: this.orgData.address,
          spocName: this.orgData.spocName,
          spocDesignation: this.orgData.spocDesignation,
        });
        if (this.orgData.imageDataresponse === null) {
          this.demoimg = false;
        } else {
          this.demo = this._sanitizer.bypassSecurityTrustResourceUrl(
            'data:image/png;base64,' + this.orgData.imageDataresponse
          );
          this.orgdetailsForm.controls.file.setValidators(null);
          this.demoimg = true;
        }
        this.addUser = res.responseData?.userMstDtolist;
        this.dataSource = new MatTableDataSource(this.addUser);
        this.setDataSourceAttributes();
      },(err: any) => this.toast?.error({title: 'Error',message: err?.error?.statusMessage})
    );
  }

  CloseModal() {
    this.AddEventProceeding = false;
    this.addusersdetailsForm.reset();
    this.submit = false;
  }
  
  adduser() {
    this.submit = true;
    if (this.addusersdetailsForm.valid) {
        let data ={
          userName: this.addusersdetailsForm.value.name,
          designation: this.addusersdetailsForm.value.designation,
          contactNo: this.addusersdetailsForm.value.contactnumber,
          emailId: this.addusersdetailsForm.value.email,
          roleId: this.addusersdetailsForm.value.roleId.roleId,
          roleName: this.addusersdetailsForm.value.roleId.roleName,
          status: this.addusersdetailsForm.value.status ? '1' : '0',
          organizationId: this.editorgId
        };
        this.Users_service.addInternalUser(data).subscribe((res: any) => {
          this.getAllInternalUsers();
            this.toast.success({
              title: 'Success',
               message: 'Saved Successfully!',
          });
        });
        this.addusersdetailsForm.reset();
        this.AddEventProceeding = false;
        this.submit = false;
    } 
    else{
      this.toast.error({title:'Error',message:'Please fill required fields'});
      this.addusersdetailsForm?.markAllAsTouched();
    }
    
  }
  deleteuser(i: any) {
    this.addUser.splice(i,1);
  }
  viewuserdetails(user: any) {
    this.router.navigate(["/user/admin2/view-user-management", { id: user.userId }])
  }
  applyFilter(event: any){
    console.log(event.target?.value.trim()?.toLowerCase(),'called keyup')
    this.dataSource = new MatTableDataSource(this.addUser?.filter((iu: any) => this.getFilteredList(iu,event.target?.value.trim()?.toLowerCase())));
    this.setDataSourceAttributes(); 
  }
  getFilteredList(iuObject: any, searchValue: any){
    return  Object?.values(iuObject)
    ?.map((val: any) => val = val?.toString()?.trim()?.toLowerCase())
    ?.reduce((acc,curVal) => {
       return acc || curVal?.indexOf(searchValue) > -1;
    },false); 
  }
}

