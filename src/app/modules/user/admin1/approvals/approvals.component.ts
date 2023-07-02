import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { MastersService } from 'src/app/core/services/masters/masters.service';
// import { ToastComponent } from '../../all-common/toast/toast.component';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { UsersService } from 'src/app/core/services/users/users.service';
import { SharedService } from 'src/app/core/services/shared.service';
import { MAT_SELECT_CONFIG, MatSelectConfig } from '@angular/material/select';
// import { PopupService } from 'src/app/core/services/popup.service';
import * as _ from 'lodash';

@Component({
  selector: 'app-approvals',
  templateUrl: './approvals.component.html',
  styleUrls: ['./approvals.component.scss'],
  viewProviders: [
    {
        provide: MAT_SELECT_CONFIG,
        useValue: {
            overlayPanelClass: "paginator-panel-class"
        } as MatSelectConfig
    }
]
})
export class ApprovalsComponent implements OnInit {
  addEventForm: any;
  addEventIndex: any;
  getAllService: any;
  approveserviceForm!: FormGroup;
  getAllService1: any;
  submited: boolean = false;
  approvedata: any;
  flag1: boolean = false;
  flag2: boolean = false;
  flag3: boolean = false;
  flag4: boolean = false;
  message: any;
  requestType: any;
  requestAcessData: any;
  requestAccessForm!: FormGroup;
  accessReqMessage: any;
  displayReqAccessModal: boolean | undefined;
  displayReqAccessModal1: boolean | undefined;
  serviceSearch: MatTableDataSource<any> | any;
  displayedColumns: any;
  // @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  approveData: any;
  approveDataSearch: MatTableDataSource<any> | any;
  tab1: boolean = false;
  tab2: boolean = false;
  displayedColumns1: any;

  @ViewChild('pendPaginator', { static: false }) set pendPaginator(value: MatPaginator) {
    if (this.serviceSearch) {
      this.serviceSearch.paginator = value;
    }
  }
  @ViewChild('appPaginator', { static: false }) set appPaginator(value: MatPaginator) {
    if (this.approveDataSearch) {
      this.approveDataSearch.paginator = value;
    }
  }

  constructor(
    private formbuilder: FormBuilder,
    private Master: MastersService,
    private router: Router,
    private shared: SharedService,
    // private popup:PopupService,
    // private toast: ToastComponent,
    private usersService: UsersService
  ) { }


  ngOnInit(): void {
    this.approveserviceForm = this.formbuilder.group({
      name: [''],
      designation: [''],
      Organization: [''],
      contactnumber: [''],
      emailId: [''],
    });
    this.requestAccessForm = this.formbuilder?.group({
      status:  [{ value: '', disabled: true }],
      userName: [{ value: '', disabled: true }],
      emailId: [{ value: '', disabled: true }],
      contactNo: [{ value: '', disabled: true }],
      designation: [{ value: '', disabled: true }],
      Organization: [{ value: '', disabled: true }],
      organizationId: [{ value: '', disabled: true }]
    });
    this.getAllServiceRequests();
    this.getAllApprovedData();
    this.displayedColumns = ['userResponse.userName', 'userResponse.organizationMstDTO.organizationName', 'userResponse.designation', 'userResponse.userRoleResponse[0].roleName', 'requestDate', 'requestType', 'action']
    this.displayedColumns1 = ['userResponse.userName', 'userResponse.organizationMstDTO.organizationName', 'userResponse.designation', 'userResponse.userRoleResponse[0].roleName', 'requestDate', 'requestType', 'action']
  }

  AddEventProceeding: boolean | undefined;
  AddEventProceeding1: boolean | undefined;
  Eventproceedings() {
    this.addEventForm?.reset();
    this.AddEventProceeding = true;
    this.AddEventProceeding1 = true
  }

  addEventFormSubmit() {
    let data: any = {}

  }


  edit(e: any, item: any) {
    this.requestType = item.requestType?.trim()?.toLowerCase();
    if (this.requestType == 'subscription') {
      this.AddEventProceeding = true;
      //  this.AddEventProceeding1 = true;
      this.addEventIndex = e;
      //  this.servicerequrstid= item.
      this.approveserviceForm?.patchValue({
        name: item.userResponse.userName,
        designation: item.userResponse.designation,
        Organization: item.userResponse.organizationMstDTO.organizationName,
        contactnumber: item.userResponse.contactNo,
        emailId: item.userResponse.emailId,
        renewsubscription: item.userResponse.emailId
        // renewworkspace:,

      });
      this.message = item.requestMessage;
      this.getAllService1 = item.serviceRequestDetailResponseList
      this.approvedata = item

      this.getAllService1.forEach((element: any) => {
        if (element.requestType == 'Renew Solution') {
          this.flag1 = true;
        }
        else if (element.requestType == 'Renew WorkSpace') {
          this.flag2 = true;
        }
        else if (element.requestType == 'new Solution') {
          this.flag3 = true;
        }
        else if (element.requestType == 'new WorkSpace') {
          this.flag4 = true;
        }
      })
    }
    else {
      if (this.requestType === 'access') {
        this.displayReqAccessModal = true;
        this.requestAccessForm?.patchValue({
          status: 1,
          userName: item.userResponse.userName,
          designation: item.userResponse.designation,
          Organization: item.userResponse.organizationMstDTO.organizationName,
          contactNo: item.userResponse.contactNo,
          emailId: item.userResponse.emailId,
          organizationId: item.userResponse.organizationMstDTO.organizationId
        });
        this.requestAcessData = item;
        this.accessReqMessage = item.requestMessage;
      }
    }
  }
  CloseModal() {
    this.AddEventProceeding = false;
    this.AddEventProceeding1 = false;
  }
  CloseAccessModal() {
    this.displayReqAccessModal = false;
    this.displayReqAccessModal1 = false;
  }
  getAllServiceRequests() {
    this.Master.getAllServiceRequests().subscribe((res: any) => {
      console.log("getall", res);
      this.getAllService = res.responseData;
      console.log(this.getAllService)
      this.serviceSearch = new MatTableDataSource<any>(res.responseData);
      this.serviceSearch.paginator = this.pendPaginator;
      this.changetab(1)
      this.serviceSearch.sort = this.sort;
      // this.getAllService1 = res.responseData[0].serviceRequestDetailResponseList
      // console.log(this.getAllService1);

    })
  }

  getAllApprovedData() {
    this.Master.getAllApprovedData().subscribe((res: any) => {
      console.log("getall", res);
      this.approveData = res.responseData;
      this.approveDataSearch = new MatTableDataSource<any>(res.responseData);
      this.approveDataSearch.paginator = this.appPaginator;
      this.approveDataSearch.sort = this.sort;
      // this.getAllService1 = res.responseData[0].serviceRequestDetailResponseList
      console.log(this.getAllService1);

    })
  }

  approve() {
    // console.log("id",this.getAllService[0].userResponse.organizationMstDTO.organizationId);
    // console.log(this.getAllService[0].serviceRequestId);
    this.shared.sendroute("/user/admin2/view-subscription")
    this.router.navigate(["/user/admin2/view-subscription", { organizationId: this.approvedata.userResponse.organizationMstDTO.organizationId, serviceRequestId: this.approvedata.serviceRequestId, userId: this.approvedata?.userId }])
  }
  approveIUAccessReq() {
    let iuData: any = {};
    Object.keys(this.requestAccessForm?.value)?.forEach?.((key: any) => {
      if (key?.toLowerCase()?.trim() !== 'organization') {
        iuData[key] = this.getAccessReqFormCtrlValues(key);
      }
    });
    iuData.roleId = "A68E16A9-CAA1-4D80-99DC-FA8F50FDEFBD";
    if (Object.values(iuData)?.length) {
      this.usersService?.addInternalUser(iuData)?.subscribe((res: any) => {
        // this.popup.open(true,res?.statusMessage);
        //  this.toast?.success({title:'Success',message:res?.statusMessage});
        this.router.navigate(["/user/admin2/view-subscription", { organizationId: this.requestAcessData.userResponse.organizationMstDTO.organizationId, serviceRequestId: this.requestAcessData.serviceRequestId, userId: res.responseData?.userId, roleName: 'internal' }]);
      }, ((err: any) => {
        // this.router.navigate(["/user/admin2/view-subscription",{organizationId: this.requestAcessData.userResponse.organizationMstDTO.organizationId, serviceRequestId: this.requestAcessData.serviceRequestId,userId:res.responseData?.userId,roleName:'internal'}]);
        // this.popup.open(false,err?.error?.message);
        // this.toast?.error({title:'Error', message:err?.error?.message});
      }));
    }
  }
  getAccessReqFormCtrlValues(ctrlName: any) {
    return this.requestAccessForm?.get(ctrlName)?.value;
  }

  applyFilter(event: any) {
    this.serviceSearch = new MatTableDataSource<any>(this.getAllService.filter((user: any) => this.containsValue(user, event.target.value.trim().toLowerCase())));
    this.serviceSearch.paginator = this.pendPaginator;
    this.serviceSearch.sort = this.sort;
  }

  containsValue(userObj: any, searchValue: any) {

    let _newObj = _.pick(userObj, ['userResponse.userRoleResponse','userResponse.designation', 'userResponse.organizationMstDTO.organizationName', 'userResponse.userName'])
    let designation = _.get(_newObj, 'userResponse.designation');
    let organizationName = _.get(_newObj, 'userResponse.organizationMstDTO.organizationName');
    let userName = _.get(_newObj, 'userResponse.userName');
    let roleName = _.map(_.get(_newObj, 'userRoleResponse'), 'roleName');

    const _obj = {
      designation,
      organizationName,
      userName,
      roleName
    }

    return Object.values(_obj).reduce((prev, cur: any) => {
      if (cur != null) {
        cur = cur.toString().trim().toLowerCase();
      }
      return prev || cur?.indexOf(searchValue) > -1;
    }, false)
  }

  applyFilter1(event: any) {
    this.approveDataSearch = new MatTableDataSource<any>(this.approveData.filter((user: any) => this.containsValue1(user, event.target.value.trim().toLowerCase())));
    this.approveDataSearch.paginator = this.appPaginator;
    this.approveDataSearch.sort = this.sort;
  }

  containsValue1(userObj: any, searchValue: any) {
    return Object.values(userObj).reduce((prev, cur: any) => {
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
}


