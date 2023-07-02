import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { UsersService } from 'src/app/core/services/users/users.service';
import { ToastComponent } from '../../all-common/toast/toast.component';

@Component({
  selector: 'app-internal-user-management',
  templateUrl: './internal-user-management.component.html',
  styleUrls: ['./internal-user-management.component.scss']
})
export class InternalUserManagementComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  displayedColumns = ['userName', 'roleName', 'emailId', 'contactNo','status', 'action'];
  internalUsersData: any;
  orgData: any;
  orgdetailsForm!: FormGroup;
  dataSource = new MatTableDataSource([]);
  organizationLogo: any;
  constructor(private Users_service: UsersService,
    private router: Router,
    private toast: ToastComponent,
    private formBuilder: FormBuilder,
    private sanitizer: DomSanitizer) { }
  ngOnInit(): void {
    this.orgdetailsForm = this.formBuilder?.group({
      spocDesignation: [{value:'',disabled:true}],
      spocphoneNo: [{value:'',disabled:true}],
      spocEmailId: [{value:'',disabled:true}],
      organizationEmailId: [{value:'',disabled:true}],
      organizationName: [{value:'',disabled:true}],
      spocName: [{value:'',disabled:true}],
      address: [{value:'',disabled:true}],
    });
   this.getInternalUserDetails();
  }
  setDataSourceAttributes(){
    if(this.dataSource){
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
    }

  }
  getInternalUserDetails(){
   this.Users_service?.getAllInternalUsers()?.subscribe((res: any) => {
    this.orgData = res.responseData?.organizationMstDto;
    this.internalUsersData = res.responseData?.userMstDtolist;
    this.orgdetailsForm.patchValue({
      organizationName: this.orgData.organizationName,
      spocphoneNo: this.orgData.spocphoneNo,
      spocEmailId: this.orgData.spocEmailId,
      organizationEmailId: this.orgData.organizationEmailId,
      address: this.orgData.address,
      spocName: this.orgData.spocName,
      spocDesignation: this.orgData.spocDesignation,
    });
    this.organizationLogo = this.orgData?.imageDataresponse ? this.sanitizer?.bypassSecurityTrustResourceUrl('data:image/png;base64,' + this.orgData.imageDataresponse) : null;
    this.dataSource = new MatTableDataSource(this.internalUsersData);
    this.setDataSourceAttributes();
   },(err: any) => this.toast?.error({title: 'Error',message: err?.error?.statusMessage}));
  }

  applyFilter(event: any) {
    this.dataSource = new MatTableDataSource(this.internalUsersData?.filter((iu: any) => this.getFilteredList(iu,event.target?.value.trim()?.toLowerCase())));
    this.setDataSourceAttributes();
  }
  viewuserSubscriptions(user: any) {
    this.router.navigate(["/user/admin2/view-subscription",{organizationId: user?.organizationId,userId:user?.userId,roleName:'internal'}])
  }
  getFilteredList(iuObject: any, searchValue: any){
    return  Object?.values(iuObject)
    ?.map((val: any) => val = val?.toString()?.trim()?.toLowerCase())
    ?.reduce((acc,curVal) => {
       return acc || curVal?.indexOf(searchValue) > -1;
    },false); 
  }
  
}
