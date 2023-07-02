import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { LeadsService } from 'src/app/core/services/Leads/leads.service';
import { PopupService } from 'src/app/core/services/popup.service';
import { UsersService } from 'src/app/core/services/users/users.service';
import { ToastComponent } from '../../all-common/toast/toast.component';
import { Location } from '@angular/common';
import { MastersService } from 'src/app/core/services/masters/masters.service';
import { MAT_SELECT_CONFIG, MatSelectConfig } from '@angular/material/select';
import * as _ from 'lodash';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.scss'],
  viewProviders: [
    {
        provide: MAT_SELECT_CONFIG,
        useValue: {
            overlayPanelClass: "paginator-panel-class"
        } as MatSelectConfig
    }
]
})
export class UserManagementComponent implements OnInit {

  addEventForm: any;
  addEventIndex: any;
  checked: boolean = true;
  searchText?: string;
  usersData: any;
  usersSearch: MatTableDataSource<any> | any;
  userorgData: any;
  route: any;
  displayedColumns: any;
  tab1: boolean = false;
  tab2: boolean = false;
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
  dataSource = new MatTableDataSource([]);
  displayedColumns1: any;

  @ViewChild('userPaginator', {static: false}) set userPaginator(value: MatPaginator) {
    if (this.usersSearch){
      this.usersSearch.paginator = value;
    }
  }
  @ViewChild('subPaginator', {static: false}) set subPaginator(value: MatPaginator) {
    if (this.dataSource){
      this.dataSource.paginator = value;
    }
  }

  @ViewChild(MatSort) sort!: MatSort;
  userids: any;
  indusData: any;
  sectData: any;
  disableButton: boolean = false;

  constructor(
    private LeadsService: LeadsService,
    private router: Router,
    private toast: ToastComponent,
    private usersService: UsersService,
    private Users_service: UsersService,
    private formBuilder: FormBuilder,
    private popup: PopupService,
    private _sanitizer: DomSanitizer,
    private location: Location,
    private Master_service: MastersService,

  ) { }

  ngOnInit(): void {
    this.getAllUserDetails()
    this.getAllIndustry();
    this.changetab(1);
    this.displayedColumns = ['userName', 'organizationName', 'emailId', 'contactNo', 'status', 'action']
    this.displayedColumns1 = ['userName', 'roleName', 'emailId', 'contactNo', 'status', 'action'];

    this.orgdetailsForm = this.formBuilder.group({
      spocDesignation: [{ value: '' }],
      spocphoneNo: [{ value: '' }],
      spocEmailId: [{ value: '' }],
      organizationEmailId: [{ value: '' }],
      file: [],
      organizationName: [{ value: '' }],
      spocName: [{ value: '' }],
      address: [{ value: '' }],
      sectorId: [{ value: '' }],
      industryId: [{ value: '' }],
    });

    this.addusersdetailsForm = this.formBuilder.group({
      name: ['', Validators.required],
      designation: ['', Validators.required],
      contactnumber: ['', Validators.required],
      email: ['', [Validators.required, Validators.email, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'),],],
      roleId: ['', Validators.required],
      status: [''],
    });
    this.addusersdetailsForm.patchValue({
      status:true
    })
    // this.getAllInternalUsers();
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


  getAllUserDetails() {
    this.LeadsService?.getAllUserDetails().subscribe((res: any) => {
      this.usersData = res.responseData;
      this.usersSearch = new MatTableDataSource<any>(this.usersData);
      this.usersSearch.paginator = this.userPaginator;
      this.changetab(1)
      this.usersSearch.sort = this.sort;
    }
    ,(err:any)=>{
    this.usersSearch = new MatTableDataSource<any>([]);
    this.usersSearch.paginator = this.userPaginator;
    this.usersSearch.sort = this.sort;
      // this.toast.error({ title: 'Error', message: err.statusMessage });
    })
  }

  AddEventProceeding1: boolean | undefined;
  Eventproceedings() {
    this.addEventForm?.reset();
    this.AddEventProceeding = true
  }

  userorgdetailsSubmit() {
    this.submited = true
    if (this.orgdetailsForm.invalid) {
      this.popup.open(false, 'Enter All the Required Fields');
      return;
    }
    // console.log(this.orgdetailsForm);
    this.userids = JSON.parse(localStorage.getItem("userInfo") || '{}');
    // userId: '5a006362-778e-4d62-b55b-5fb719146dee',
    // let data = {

    //   userId: this.userids.userId,
    //   organizationName: this.orgdetailsForm.value.organizationName,
    //   spocName: this.orgdetailsForm.value.spocName,
    //   spocDesignation: this.orgdetailsForm.value.spocDesignation,
    //   spocphoneNo: this.orgdetailsForm.value.spocphoneNo,
    //   spocEmailId: this.orgdetailsForm.value.spocEmailId,
    //   address: this.orgdetailsForm.value.address,

    // }
    // console.log(data);

    const formData = new FormData();
    //  formData.append('userId',this.userids.userId,);
    formData.append('organizationId', this.editorgId);
    formData.append('organizationName', this.orgdetailsForm.value.organizationName);
    //  formData.append('processId',this.anyData.processId);
    formData.append('spocName', this.orgdetailsForm.value.spocName);
    formData.append('spocDesignation', this.orgdetailsForm.value.spocDesignation);
    // formData.append('spocDesignation', this.orgdetailsForm.value.spocDesignation);
    formData.append('spocphoneNo', this.orgdetailsForm.value.spocphoneNo);
    formData.append('spocEmailId', this.orgdetailsForm.value.spocEmailId);
    formData.append('address', this.orgdetailsForm.value.address);
    formData.append('industryId', this.orgdetailsForm.value.industryId.industryId);
    industryId: this.orgdetailsForm.value.industryId.industryId,
      formData.append('sectorId', this.orgdetailsForm.value.sectorId.sectorId);

    // if (this.editIndustryid) {
    //   data =
    //   {
    //     type: 2,
    //     industryId: this.editIndustryid,
    //     industryName: this.orgdetailsForm.value.name
    //   }
    // }
    // else {
    //   data =
    //   {
    //     type: 1,
    //     industryName: this.orgdetailsForm.value.name
    //   }
    // }addedituser_orgDetails
    this.LeadsService.addOrupdateOrgDetail(formData).subscribe((res: any) => {
      if(res.statusCode == 200)
      {
       this.popup.open(true, "Changes Saved!");
       this.router.navigate(["/user/admin2/subscription",{ state: 'internal' }])
      }
      // this.toast.success({ title: 'Success', message: "Changes Saved!"});
      // this.router.navigate(["/user/admin2/user-management"])
      // this.location?.back();
      //   this.getAllIndustry()routerLink="/user/admin2/user-management"
      //   this.CloseModal()
      //   this.editIndustryid='';
      //   this.industryForm.reset();
    })
      , (err: any) => {
        this.popup.open(false, err.error.statusMessage);
        // this.toast.error({ title: 'Error', message: err.error.statusMessage });
      }
  }

  viewuserdetails(user: any) {
    this.router.navigate(["/user/admin2/view-user-management", { id: user.userId }])
  }

  edit(e: any) {
    this.AddEventProceeding = true;
    this.addEventIndex = e;
    //  this.addEventForm?.patchValue({
    //    dateofProceeding: pop.dateofProceeding,
    //    dueDate: .dueDate,
    //    gistProceeding: pop.gistProceeding,
    //    remarks: pop.remarks,
    //  })
  }
  CloseModal() {
    this.AddEventProceeding = false;
    this.AddEventProceeding1 = false;
    this.addusersdetailsForm.reset();
    this.submit = false;
  }

  applyFilter(event: any) {
    this.usersSearch = new MatTableDataSource<any>(this.usersData.filter((user: any) => this.containsValue(user, event.target.value.trim().toLowerCase())));
    this.usersSearch.paginator = this.userPaginator;
    this.usersSearch.sort = this.sort;
  }
  containsValue(userObj: any, searchValue: any) {
    userObj = _.pick(userObj, ['emailId', 'organizationName', 'userName'])
    return Object.values(userObj).reduce((prev, cur: any) => {
      console.log('cur-->', cur);
      if (cur != null) {
        cur = cur.toString().trim().toLowerCase();
      }
      return prev || cur?.indexOf(searchValue) > -1;
    }, false)
  }

  changetab(id: any) {
    if (id == 1) {
      this.tab1 = true;
      this.tab2 = false;
    }
    else {
      console.log("tab2");
      this.tab1 = false;
      this.tab2 = true;
    }
  }

  edit1(e: any) {
    this.AddEventProceeding1 = true;
    this.editindex = -1;
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
          // industryId: this.orgData.industryId,
          // sectorId: this.orgData.sectorId,
        });
        this.indusData.forEach((element: any) => {
          if (this.orgData.industryId == element.industryId) {
            this.orgdetailsForm.patchValue({
              industryId: element,
            });
            // console.log("patch", this.orgData.industryId, element);
            this.sectData = element.sectorList;
            this.sectData?.forEach((ele: any) => {
              if (this.orgData.sectorId == ele.sectorId) {
                this.orgdetailsForm.patchValue({
                  sectorId: ele,
                });
                // console.log("patch", this.orgData.sectorId, ele);
              }
            });
          }
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
        // this.setDataSourceAttributes();
        this.dataSource.paginator = this.subPaginator;
      }, (err: any) => this.toast?.error({ title: 'Error', message: err?.error?.statusMessage })
    );
  }


  adduser() {
    this.submit = true;
    if (this.addusersdetailsForm.valid) {
      let data = {
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
      this.AddEventProceeding1 = false;
      this.submit = false;
    }
    else {
      this.toast.error({ title: 'Error', message: 'Please fill required fields' });
      this.addusersdetailsForm?.markAllAsTouched();
    }

  }
  deleteuser(i: any) {
    this.addUser.splice(i, 1);
  }
  viewuserdetails1(user: any) {
    this.router.navigate(["/user/admin2/view-user-management", { id: user.userId }])
  }
  applyFilter1(event: any) {
    console.log(event.target?.value.trim()?.toLowerCase(), 'called keyup')
    this.dataSource = new MatTableDataSource(this.addUser?.filter((iu: any) => this.getFilteredList(iu, event.target?.value.trim()?.toLowerCase())));
    // this.setDataSourceAttributes();
    this.dataSource.paginator = this.subPaginator;
  }
  getFilteredList(iuObject: any, searchValue: any) {
    return Object?.values(iuObject)
      ?.map((val: any) => val = val?.toString()?.trim()?.toLowerCase())
      ?.reduce((acc, curVal) => {
        return acc || curVal?.indexOf(searchValue) > -1;
      }, false);
  }
  cancel() {
    // this.location.back();
    this.tab1 = true;
    this.tab2 = false;

  }

  getAllIndustry() {
    this.Master_service.getAllIndustry().subscribe((res: any) => {
      console.log(res);
      this.indusData = res.responseData;
      this.getAllInternalUsers();

      // this.lengthIndus = res.responseData.length;
      // console.log(this.indusData, this.lengthIndus);
    });
  }
  selectionChange(event: any, data: any) {
    // this.sectData =[]
    this.disableButton = false;

    console.log(data, event);
    if (event.isUserInput) {
      this.sectData = data.sectorList;
    }
  }
}

