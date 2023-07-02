import { I } from '@angular/cdk/keycodes';
import { formatDate, Location } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LoaderService } from 'src/app/core/services/loader.service';
import { MastersService } from 'src/app/core/services/masters/masters.service';
import { UsersService } from 'src/app/core/services/users/users.service';
import { Subject } from 'rxjs';
import {
  FormatDatepicker,
  APP_DATE_FORMATS,
} from '../view-subscription/format-datepicker';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { MatTableDataSource } from '@angular/material/table';
import { PopupService } from 'src/app/core/services/popup.service';

@Component({
  selector: 'app-view-subscription',
  templateUrl: './view-subscription.component.html',
  styleUrls: ['./view-subscription.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: FormatDatepicker },
    { provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS },
  ],
})
export class ViewSubscriptionComponent implements OnInit {
  addEventForm: any;
  addEventIndex: any;
  userId: any;
  userData: any = [];
  subsdetailsForm!: FormGroup;
  UserdetailsForm!: FormGroup;
  procData: any;
  subs: any;
  demo: any;
  GprocData: any;
  GprocDataSearch: any;
  CSprocData: any;
  CSprocDataSearch: any;
  userDataUser: any;
  orgId: any;
  displayedColumns = ['subName', 'startdate', 'enddate', 'runcount', 'username', 'status']
  workColumns = ['workspace', 'startdate', 'enddate', 'username', 'status']
  subscriptions: any = [];
  WorkSpace: any = [];
  worksub: any;
  submited: boolean = false;
  serviceId: any;
  servicedata: any;
  todayDate: Date = new Date();
  workSpaceMinDate: any = formatDate(new Date(), 'yyyy-MM-dd', 'en');
  datasubs!: MatTableDataSource<any>
  masterSelectGProc = false;
  masterSelectCSProc = false;
  filterGprocData: any;
  filterCSprocData: any;
  removedSol: any = [];
  minPDate: any = [];
  minSDate: any;
  @ViewChild('table', { static: true }) table: any;
  subscriptionList: any;
  internalsol: any;
  showUserDetails: boolean = false;
  // procerr: any;

  constructor(
    private popup: PopupService,
    private Users_service: UsersService,
    private Master: MastersService,
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private loader: LoaderService,
  ) {
    this.minDateToFinish.subscribe((r) => {
      this.minDate = new Date(r);
    });
  }

  ngOnInit(): void {
    this.subsdetailsForm = this.formBuilder.group({
      name: [],
      Cname: [],
      designation: [],
      contactnumber: [],
      email: [],
      process: this.formBuilder.array([]),
      WorkSpace: this.formBuilder.array([]),
    });
    this.UserdetailsForm = this.formBuilder.group({
      name: [],
      designation: [],
      contactnumber: [],
      email: [],
      status: [],
    });

    this.getSubscription();
    this.getAllProcess();
    this.datasubs=new MatTableDataSource<any>([])
    this.subs=new MatTableDataSource<any>([])
  }

  minDateToFinish = new Subject<string>();
  minDate: any;

  dateChange(e: any, i: any) {
    this.minDateToFinish.next(e.value.toString());
    this.minPDate[i] = e.value;
    if(this.procArr().controls[i].get('endDate')?.value) {
      let sDate = new Date(this.procArr().controls[i].get('startDate')?.value);
      let eDate = new Date(this.procArr().controls[i].get('endDate')?.value);
      if(sDate > eDate){
        this.procArr().controls[i].get('endDate')?.reset();
      }
    }
  }
  dateChange1(e: any, i: any) {
    this.minDateToFinish.next(e.value.toString());
    this.minSDate[i] = e.value;
    if(this.Work().controls[i].get('endDate')?.value) {
      let sDate = new Date(this.Work().controls[i].get('startDate')?.value);
      let eDate = new Date(this.Work().controls[i].get('endDate')?.value);
      if(sDate > eDate){
        this.Work().controls[i].get('endDate')?.reset();
      }
    }

  }
  process(): FormGroup {
    return this.formBuilder.group({
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      runCount: ['', Validators.required],
      selectUser: ['', Validators.required],
      status: [true],
    });
  }
  Works(): FormGroup {
    return this.formBuilder.group({
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
      check: [],
      selectUser: ['', Validators.required],
      status: [],
    });
  }
  procArr(): FormArray {
    return this.subsdetailsForm.get('process') as FormArray;
  }
  Work(): FormArray {
    return this.subsdetailsForm.get('WorkSpace') as FormArray;
  }
  getByUserIdSubscritpionDetails() {
    this.orgId = this.route.snapshot.paramMap.get('organizationId');
    this.serviceId = this.route.snapshot.paramMap.get('serviceRequestId');
    let userId = this.route.snapshot.paramMap?.get('userId');
    let userRole = this.route.snapshot.paramMap?.get('roleName');
    if (this.serviceId && this.serviceId != 'null') {
      this.Master.getByServiceRequestId(this.serviceId).subscribe(
        (res: any) => {
          this.servicedata = res.responseData;
        }
      );
    }
    this.Users_service.getallusers(this.orgId).subscribe((res: any) => {
      this.userData = res.responseData[0].organizationMstDto;
      this.userDataUser = userId
        ? res.responseData[0].userMstDto?.filter((userData: any) => userData.userId == userId)
        : res.responseData[0].userMstDto;
      if (userId) {
        this.showUserDetails = true
        this.UserdetailsForm.patchValue({
          name: this.userDataUser[0].userName,
          contactnumber: this.userDataUser[0].contactNo,
          email: this.userDataUser[0].emailId,
          designation: this.userDataUser[0].roleName,
          status: this.userDataUser[0].status == 'Active' ? true : false
        })
        this.UserdetailsForm.disable()
      }
      this.subsdetailsForm.patchValue({
        name: this.userData.organizationName,
        Cname: this.userData.spocName,
        contactnumber: this.userData.spocphoneNo,
        email: this.userData.spocEmailId,
        designation: this.userData.spocDesignation,
      });
      this.subsdetailsForm.controls.name.disable();
      this.subsdetailsForm.controls.designation.disable();
      this.subsdetailsForm.controls.contactnumber.disable();
      this.subsdetailsForm.controls.email.disable();
      this.subsdetailsForm.controls.Cname.disable();
      let reqCall = userRole
        ? userRole?.trim()?.toLowerCase() == 'internal'
          ? this.Users_service.getSubscriptionDetailsByUserId(userId)
          : this.Users_service.getallsubscription(this.orgId)
        : this.Users_service.getallsubscription(this.orgId);
      reqCall.subscribe(
        (res: any) => {
          this.worksub = res.responseData?.subsciptionTypeDetailsDto;
          this.worksub?.forEach?.((element: any) => {
            this.subs.forEach((ele: any, i: any) => {
              if (ele.subscriptionTypeId == element.subscriptionTypeId) {
                if (element.userId.length > 0) {
                  this.Work().controls[i].get('check')?.disable()
                }
                this.Work().controls[i].patchValue({
                  startDate: element.startDate,
                  endDate: element.endDate,
                  check: true,
                  status: element.status == 'Active',
                });
                let user: any[] = [];
                if (this.userDataUser.length > 0) {
                  this.userDataUser.forEach((ele: any) => {
                    element.userId.forEach((elem: any) => {
                      if (elem == ele.userId) {
                        user.push(ele);
                      }
                    });
                  });
                  this.Work().controls[i].patchValue({
                    selectUser: user,
                  });
                }
                this.Work().controls[i].get('startDate')?.enable();
                this.Work().controls[i].get('endDate')?.enable();
                this.Work().controls[i].get('selectUser')?.enable();
              }
            });
          });
          this.subs.forEach((ele: any, i: any) => {
            if (this.serviceId != 'null') {
              this.servicedata?.serviceRequestDetailResponseList?.forEach(
                (elem: any) => {
                  if (
                    elem.requestType == 'new WorkSpace' ||
                    elem.requestType == 'Renew WorkSpace'
                  ) {
                    if (
                      elem.subscriptionDTO.subscriptionTypeId ==
                      ele.subscriptionTypeId
                    ) {
                      ele.higlight = true;
                      if (elem.requestType == 'Renew WorkSpace') {
                        ele.new = 'Renew';
                      }
                      if (elem.requestType == 'new WorkSpace') {
                        ele.new = 'New';
                      }
                    }
                  }
                }
              );
            }
          });

          this.subscriptionList = res.responseData?.subscriptionDto;
          // console.log(this.subscriptionList);
          this.subscriptionList?.forEach?.((element: any) => {
            this.GprocData.forEach((ele: any) => {
              if (ele.processId == element.processID) {
                element.processName = ele.processName;
                ele.checked = true;
                if (element.userId != null) {
                  ele.disable = true;
                }
                this.subscriptions.push(element);
                this.minPDate.push(this.todayDate)
                this.procArr().push(this.process());
              }
            });
            this.CSprocData.forEach((ele: any) => {
              if (ele.processId == element.processID) {
                element.processName = ele.processName;
                ele.disable = true;
                ele.checked = true;
                this.subscriptions.push(element);
                this.minPDate.push(this.todayDate)
                this.procArr().push(this.process());
              }
            });
          });
          userRole ? userRole?.trim()?.toLowerCase() == 'internal' ?
            (
              this.Users_service.getallsubscription(this.orgId).subscribe((orgsol: any) => {
                this.internalsol = orgsol.responseData?.subscriptionDto
                this.internalsol.forEach((sol: any) => {
                  this.subscriptions.forEach((pro: any) => {
                    if (sol.processID == pro.processID && userId == sol.userID && pro.usersolnMapId == null) {
                      pro.orgSolnId = sol.orgSolnId
                      pro.usersolnMapId = sol.usersolnMapId
                    }
                    else if (sol.processID == pro.processID) {
                      pro.orgSolnId = sol.orgSolnId
                    }
                  });
                });
              })
            )
            : '' : '';

          if (this.serviceId != 'null' || this.serviceId != undefined) {

            this.servicedata?.serviceRequestDetailResponseList?.forEach(
              (elem: any) => {
                if (
                  elem.requestType == 'new Solution' ||
                  elem.requestType == 'Renew Solution'
                ) {
                  this.GprocData.forEach((ele: any) => {
                    if (ele.processId == elem.processDTO?.processId) {
                      ele.higlight = true;
                      if (elem.requestType == 'Renew Solution') {
                        this.subscriptions.forEach((element: any) => {
                          if (element.processID == elem.processDTO.processId) {
                            element.new = 'Renew';
                            elem.processName = ele.processName;
                            elem.processID = ele.processId;
                          }
                        });
                      } else if (elem.requestType == 'new Solution') {
                        elem.new = 'New';
                        elem.processName = ele.processName;
                        elem.processID = ele.processId;
                        ele.checked = true;
                        this.subscriptions.push(elem);
                        this.procArr().push(this.process());
                      }
                    }
                  });
                  this.CSprocData.forEach((ele: any) => {
                    if (ele.processId == elem.processDTO?.processId) {
                      ele.higlight = true;

                      if (elem.requestType == 'Renew Solution') {
                        this.subscriptions.forEach((element: any) => {
                          if (element.processID == elem.processDTO.processId) {
                            element.new = 'Renew';
                            elem.processName = ele.processName;
                            elem.processID = ele.processId;
                          }
                        });
                      } else if (elem.requestType == 'new Solution') {
                        elem.new = 'New';
                        elem.processName = ele.processName;
                        elem.processID = ele.processId;
                        ele.checked = true;
                        this.subscriptions.push(elem);
                        this.procArr().push(this.process());
                      }
                    }
                  });
                }
              }
            );
          }

          this.datasubs = this.subscriptions;

          this.procArr().controls.forEach((element: any, i: any) => {
            let puser: any[] = []
            if (this.userDataUser.length > 0) {
              // console.log(this.userDataUser, this.subscriptions[i]);
              this.subscriptions[i].userId.forEach((elem: any) => {
                this.userDataUser.forEach((ele: any) => {
                  // console.log(ele);
                  if (elem == ele.userId) {
                    puser.push(ele.userId);
                    // console.log(puser);
                  }
                });
              });
            }
            element.patchValue({
              startDate: this.subscriptions[i].startDate,
              endDate: this.subscriptions[i].endDate,
              runCount:
                this.subscriptions[i].runCount == 0
                  ? null
                  : this.subscriptions[i].runCount,
              // selectUser: this.subscriptions[i].userID,
              status: this.subscriptions[i].status == 'Active',
            });
            // console.log(puser);

            element.patchValue({
              selectUser: puser,
            });
          });
          this.filterGprocData = this.GprocData;
          this.filterCSprocData = this.CSprocData;
          this.setIndeterminatestate();
        }
      );
    });
  }

  getAllProcess() {
    this.Master.getAllProcessByType(1).subscribe((res: any) => {
      this.GprocData = res.responseData;
      this.getByUserIdSubscritpionDetails();
    });
    this.Master.getAllProcessByType(2).subscribe((res: any) => {
      this.CSprocData = res.responseData;
    });
  }

  getSubscription() {
    this.Users_service.getSubscription().subscribe((res: any) => {
      this.subs = res.responseData;
      this.subs.forEach((ele: any, i: any) => {
        this.minSDate = this.todayDate
        this.Work().push(this.Works());
        this.Work().controls[i].get('startDate')?.disable();
        this.Work().controls[i].get('endDate')?.disable();
        this.Work().controls[i].get('selectUser')?.disable();
      });
    });
  }
  selectuser(event: any, item: any) { }
  addnew(event: any, itemIndex: number, data: any, processType: any, masterSelect?: any) {
    const isChecked = masterSelect ? masterSelect?.checked : event.target?.checked;
    if (processType?.trim()?.toLowerCase() == 'generic') {
      this.GprocData[itemIndex].checked = isChecked
    } else {
      this.CSprocData[itemIndex].checked = isChecked;
    }
    console.log(this.GprocData)
    if (isChecked) {
      if (this.internalsol ? this.internalsol.length > 0 : false) {
        data.orgSolnId = null
        this.internalsol.forEach((sol: any) => {
          if (sol.processID == data.processId) {
            data.orgSolnId = sol.orgSolnId
          }
        })
      }
      this.subscriptions.push({
        endDate: 'null',
        startDate: 'null',
        runCount: 0,
        processID: data.processId,
        processName: data.processName,
        userID: [],
        orgSolnId: data.orgSolnId,
        status:true
      });
      this.minPDate.push(this.todayDate)
      this.procArr().push(this.process());
      this.datasubs = this.subscriptions;
      this.table.renderRows()
      console.log('If')

    } else {
      // this.masterSelectGProc = false;
      this.subscriptions.forEach((element: any, i: any) => {
        if (element.processID == data.processId) {
          let remo = {
            processID: data.processId,
            processName: data.processName,
            orgSolnId: this.subscriptions[i].orgSolnId,
            flag: 2
          }
          this.subscriptions.splice(i, 1);
          this.procArr().removeAt(i);
        }
      });

      this.datasubs = this.subscriptions;
      this.table.renderRows()
    }
    if (!masterSelect) this.setIndeterminatestate();
  }

  removeDefaultDatePickerValidations(formArrayCtrls: any, desc: any) {
    formArrayCtrls?.controls.forEach((fg: any, groupIndex: number) => {
      Object.keys(fg.controls)?.forEach((formkey: any) => {
        let startDateCtrl = (<FormControl>((<FormGroup>(<FormArray>(<FormGroup>this.subsdetailsForm).controls[desc]).controls[groupIndex])?.controls)['startDate']);
        let endDateCtrl = (<FormControl>((<FormGroup>(<FormArray>(<FormGroup>this.subsdetailsForm).controls[desc]).controls[groupIndex])?.controls)['endDate']);
        if (fg?.controls['startDate'].errors?.matDatepickerMin && formkey == 'startDate') {
          startDateCtrl.clearValidators();
          startDateCtrl.updateValueAndValidity();
        }
        else {
          if (fg?.controls['endDate'].errors?.matDatepickerMin && formkey == 'endDate') {
            endDateCtrl.clearValidators();
            endDateCtrl.updateValueAndValidity();
          }
        }
      });
    });
  }
  submit() {
    let data;
    let subsciptionType: any = [];
    let subsciption: any = [];
    let users: any = [];
    let usersmap: any = [];
    let orgSubsId: any;
    this.submited = true;
    this.removeDefaultDatePickerValidations(this.procArr(), 'process');
    this.removeDefaultDatePickerValidations(this.Work(), 'WorkSpace');

    if (this.subsdetailsForm.invalid) {
      this.procArr().controls.forEach((w: any, i: any) => {
        if (this.procArr().controls[i].get('selectUser')?.errors)
          this.subscriptions[i].error = true
      })
      this.popup.open(false, 'Enter All the Required Fields');
      return;
    }

    this.Work().controls.forEach((w: any, i: any) => {
      let work = w.value
      let userlist: any[]=[]
      // console.log(work);
      if (work.selectUser) {
        work.selectUser.forEach((user: any) => {
          userlist.push(user.userId)
          // console.log(this.worksub);
          let flg1 = 0;
          if (this.worksub ? this.worksub[i] : false) {
            this.worksub[i].userId.forEach((ele: any, j: any) => {
              if (user.userId == ele && flg1 != 1) {
                usersmap.push(this.worksub[i].usersubscriptionId[j]);
                // user.push(ele)
                flg1 = 1;
              }
            });
          }
          // let e = 0
          // users.forEach((eee: any) => {
          //   e = 1
          //   if (user.userId != eee) {
          //     users.push(user.userId);
          //   }
          // });
          // if (e == 0) {
          //   users.push(user.userId);
          // }
        });
        // console.log(userlist,users);
        
        if (this.worksub) {
          if (this.worksub.length > 0) {
            this.worksub.forEach((Wsub: any) => {
              if (
                this.subs[i].subscriptionTypeId == Wsub.subscriptionTypeId
              ) {
                orgSubsId = Wsub.orgSubscriptionId;
              }
            });
          }
        }
        const startDate = new Date(work.startDate);
        const endDate = new Date(work.endDate);
        const yyyy = startDate.getFullYear();
        let mm: any = startDate.getMonth() + 1;
        let dd: any = startDate.getDate();
        // if (dd < 10) dd = '0' + dd;
        // if (mm < 10) mm = '0' + mm;
        const stdate = yyyy + '-' + mm + '-' + dd;

        const yyy1 = endDate?.getFullYear();
        let mm1: any = endDate?.getMonth() + 1;
        let dd1: any = endDate?.getDate();
        // if (dd1 < 10) dd1 = '0' + dd;
        // if (mm1 < 10) mm1 = '0' + mm;
        const edate = yyy1 + '-' + mm1 + '-' + dd1;
        if (orgSubsId) {
          subsciptionType.push({
            subscriptionTypeId: this.subs[i].subscriptionTypeId,
            endDate: edate,
            startDate: stdate,
            organizationId: this.orgId,
            userId: userlist.length > 0 ? userlist : null,
            usersubscriptionId: usersmap.length > 0 ? usersmap : null,
            flag: work.status ? 1 : 0,
            orgSubscriptionId: orgSubsId,
          });
        } else {
          subsciptionType.push({
            subscriptionTypeId: this.subs[i].subscriptionTypeId,
            endDate: edate,
            startDate: stdate,
            organizationId: this.orgId,
            userId: userlist,
            usersubscriptionId: usersmap.length > 0 ? usersmap : null,
            flag: work.status ? 1 : 0,
            orgSubscriptionId: null,
          });
        }
      }
    });
    this.procArr().value?.forEach?.((process: any, i: any) => {
      let Pusers: any[] = [];
      let usersolmap: any[] = [];
      if (process.selectUser) {
        process.selectUser.forEach((proc: any, x: any) => {
          let flg2 = 0;
          if (this.subscriptions ? this.subscriptions[i] : false) {
            // console.log(x,proc,this.subscriptions[i]);
            this.subscriptions[i].userId?.forEach((ele: any, j: any) => {
              if (proc == ele && flg2 != 1) {
                // console.log(this.subscriptions[i]?.userId[j],this.subscriptions[i]?.usersolnMapId[j]);
                usersolmap.push(this.subscriptions[i]?.usersolnMapId[j]);
                flg2 = 1
              }
            });
          }
          // let e = 0
          // Pusers.forEach((eee: any) => {
          //   e = 1
          //   if (proc.userId != eee) {
          //     Pusers.push(proc.userId);
          //   }
          // });
          // if (e == 0) {
          //   Pusers.push(proc.userId);
          // }
        });
      }
      // console.log(usersolmap);
        
      const startDate = new Date(process.startDate);
      const endDate = new Date(process.endDate);
      const yyyy = startDate.getFullYear();
      let mm: any = startDate.getMonth() + 1;
      let dd: any = startDate.getDate();
      // if (dd < 10) dd = '0' + dd;
      // if (mm < 10) mm = '0' + mm;
      const stdate = yyyy + '-' + mm + '-' + dd;

      const yyy1 = endDate?.getFullYear();
      let mm1: any = endDate?.getMonth() + 1;
      let dd1: any = endDate?.getDate();
      // if (dd1 < 10) dd1 = '0' + dd;
      // if (mm1 < 10) mm1 = '0' + mm;
      const edate = yyy1 + '-' + mm1 + '-' + dd1;

      if (this.subscriptions[i].orgSolnId) {
        subsciption.push({
          startDate: stdate,
          endDate: edate,
          runCount: process.runCount,
          processID: this.subscriptions[i].processID || this.subscriptions[i].processDTO.processId,
          orgSolnId: this.subscriptions[i].orgSolnId,
          usersolnMapId: (usersolmap?.length>0)?usersolmap:null,
          userId: process.selectUser,
          organizationId: this.orgId,
          flag: process.status ? 1 : 0,
        });
      } else {
        subsciption.push({
          startDate: stdate,
          endDate: edate,
          runCount: process.runCount,
          processID: this.subscriptions[i].processID || this.subscriptions[i].processDTO.processId,
          orgSolnId: null,
          usersolnMapId: (usersolmap?.length>0)?usersolmap:null,
          userId: process.selectUser,
          organizationId: this.orgId,
          flag: process.status ? 1 : 0,
        });
      }
    });
    data = {
      subsciptionTypeDetailsDto: subsciptionType,
      subscriptionDto: subsciption,
    };

    // console.log(data);

    let approvalSR: {
      serviceRequestId: any;
      userId: any;
      serviceRequestDetailDTO: any[];
    };
    let serviceapprove: any[] = [];
    if (this.serviceId != 'null') {
      this.servicedata?.serviceRequestDetailResponseList?.forEach?.(
        (service: any) => {
          if (
            service.requestType == 'new Solution' ||
            service.requestType == 'Renew Solution'
          ) {
            subsciption.forEach((Ssub: any) => {
              if (Ssub.processID === service.processID) {
                serviceapprove.push({
                  serviceRequestDetailId: service.serviceReqDetailId,
                });
              }
            });
          }
          if (
            service.requestType == 'new WorkSpace' ||
            service.requestType == 'Renew WorkSpace'
          ) {
            subsciptionType.forEach((Ssub: any) => {
              if (service.subscriptionTypeId === Ssub.subscriptionTypeId) {
                serviceapprove.push({
                  serviceRequestDetailId: service.serviceReqDetailId,
                });
              }
            });
          }
        }
      );
      approvalSR = {
        serviceRequestId: this.servicedata?.serviceRequestId,
        userId: this.servicedata?.userId,
        serviceRequestDetailDTO: serviceapprove,
      };
    }
    this.loader.show();
    this.Users_service.subscriptionsUpdate(data).subscribe(
      (res: any) => {
        if (this.serviceId != 'null') {
          this.Master.approveServiceRequest(approvalSR).subscribe(
            (res: any) => {
            }
          );
        }
        this.loader.hide();
        this.popup.open(true, 'Saved Successfully!');
        this.router.navigate(['/user/admin2/subscription']);
      },
      (err: any) => {
        this.loader.hide();
        this.popup.open(false, err.error.statusMessage);
      }
    );

  }

  enableWorkField(i: any, event: any) {
    if (event.target.checked) {
      this.Work().controls[i].get('startDate')?.enable();
      this.Work().controls[i].get('endDate')?.enable();
      this.Work().controls[i].get('selectUser')?.enable();
    } else {
      this.Work().controls[i].get('startDate')?.disable();
      this.Work().controls[i].get('endDate')?.disable();
      this.Work().controls[i].get('selectUser')?.disable();
    }

  }
  selectAllGproc(event: any) {
    this.masterSelectGProc = event.target?.checked;

    this.GprocData?.forEach(async (gp: any, index: any) => {
      switch (this.masterSelectGProc) {
        case true:
          {
            if (!gp?.checked) {
              gp.checked = this.masterSelectGProc;
              this.addnew('', index, gp, 'generic', { checked: this.masterSelectGProc });
            }
          }
          break;
        case false:
          {
            gp.checked = false;
            this.subscriptionList?.forEach?.((element: any) => {
              if (gp.processId == element.processID) {
                gp.checked = true;
              }
            })
            setTimeout(() => {
              if (!gp.checked) {
                this.addnew('', index, gp, 'generic', { checked: this.masterSelectGProc });
              }
            }, 10);
          }
          break;
        default: 
          break;
      }

    });
  }
  async selectAllCSproc(event: any) {
    this.masterSelectCSProc = event.target?.checked;
    this.CSprocData?.forEach(async (csp: any, index: any) => {
      switch (this.masterSelectCSProc) {
        case true:
          {
            if (!csp?.checked) {
              csp.checked = this.masterSelectCSProc;
              this.addnew('', index, csp, 'client specific', { checked: this.masterSelectCSProc });
            }
          }
          break;
        case false:
          {
            csp.checked = false;
            this.subscriptionList?.forEach?.((element: any) => {
              if (csp.processId == element.processID) {
                csp.checked = true;
              }
            })
            setTimeout(() => {
              if (!csp.checked) {
                this.addnew('', index, csp, 'client specific', { checked: this.masterSelectCSProc });
              }
            }, 10);
          }
          break;
        default:
          break;
      }


    });


  }
  setIndeterminatestate() {
    const gProcChecked = this.filterGprocData?.filter((gp: any) => gp.checked);
    const csProcChecked = this.filterCSprocData?.filter((gp: any) => gp.checked);
    this.masterSelectGProc = gProcChecked?.length == this.filterGprocData?.length ? true : false;
    this.masterSelectCSProc = csProcChecked?.length == this.filterCSprocData?.length ? true : false;
  }
  applyGenericProcFilter(event: any) {
    this.GprocData = this.filterGprocData?.filter((fg: any) => {
      return fg.processName?.trim()?.toLowerCase()?.indexOf(event?.target?.value?.trim()?.toLowerCase()) > -1;
    });
    this.setIndeterminatestate();
  }
  applyCSProcFilter(event: any) {
    console.log(this.filterGprocData)

    this.CSprocData = this.filterCSprocData?.filter((fc: any) => {
      return fc.processName?.trim()?.toLowerCase()?.indexOf(event?.target?.value?.trim()?.toLowerCase()) > -1;
    });
    this.setIndeterminatestate();
  }
}
