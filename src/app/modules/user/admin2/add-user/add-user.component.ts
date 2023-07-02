import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MastersService } from 'src/app/core/services/masters/masters.service';
import { UsersService } from 'src/app/core/services/users/users.service';
import { SolutionService } from 'src/app/core/services/solution/solution.service';
import { LeadsService } from 'src/app/core/services/Leads/leads.service';
import { DomSanitizer } from '@angular/platform-browser';
import { PopupService } from 'src/app/core/services/popup.service';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss'],
})
export class AddUserComponent implements OnInit {
  addEventForm: any;
  addEventIndex: any;
  addEventForm1: any;
  addEventIndex1: any;
  procData: any;
  subs: any;
  addUser: any = [];
  indusData: any;
  sectData: any;
  userroles: any;
  clients: any;
  Leads_service: any;
  orgData: any;
  orgdetailsForm!: FormGroup;
  addusersdetailsForm!: FormGroup;
  hideform: boolean = false;
  editindex: any = -1;
  editorgId: any;
  addflag: any = 0;
  UserAdd = 'Add';
  imgFile: any = null;
  searchForm!: FormGroup;
  submited: boolean = false;
  clientsearch: any;
  submit: boolean = false;
  demo: any;
  demoimg: boolean = false;
  disableButton: boolean = true
  user: any;

  constructor(
    private popup: PopupService,
    private LeadsService: LeadsService,
    private Users_service: UsersService,
    private solution_services: SolutionService,
    private Master_service: MastersService,
    private formBuilder: FormBuilder,
    private router: Router,
    private _sanitizer: DomSanitizer,
  ) { }
  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem('userInfo') || '{}')
    this.orgdetailsForm = this.formBuilder.group({
      designation: ['', Validators.required],
      contactnumber: ['', Validators.required],
      email: [
        '',
        [
          Validators.required,
          Validators.email,
          Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'),
        ],
      ],
      industryId: ['', Validators.required],
      sectorId: ['', Validators.required],
      flie: ['', Validators.required],
      org_name: ['', Validators.required],
      spoc_name: ['', Validators.required],
      org_address: ['', Validators.required],
    });
    this.searchForm = this.formBuilder.group({
      search: ['', Validators.required],
    });
    this.addusersdetailsForm = this.formBuilder.group({
      name: ['', Validators.required],
      designation: ['', Validators.required],
      contactnumber: ['', Validators.required],
      email: [
        '',
        [
          Validators.required,
          Validators.email,
          Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$'),
        ],
      ],
      roleId: ['', Validators.required],
      status: ['']
    });
    this.addusersdetailsForm.patchValue({
      status:true
    })
    this.getSubscription();
    this.getAllIndustry();
    this.getAllOrganizations();
    this.userroles = [
      {
        roleId: '9365b6d9-8225-416c-9298-98ddd802f3f4',
        roleName: 'External User',
      },
    ];
  }

  getAllProcess() {
    this.Master_service.getAllProcess().subscribe((res: any) => {
      this.procData = res.responseData;
    });
  }

  getAllIndustry() {
    this.Master_service.getAllIndustry().subscribe((res: any) => {
      console.log(res);
      this.indusData = res.responseData;
    });
  }
  selectionChange(event: any, data: any) {
    this.disableButton = false;

    console.log(data, event);
    if (event.isUserInput) {
      this.sectData = data.sectorList;
    }
  }

  getSubscription() {
    this.Users_service.getSubscription().subscribe((res: any) => {
      this.subs = res.responseData;
    });
  }

  contactname() {
    console.log(this.orgdetailsForm);
    console.log(this.orgdetailsForm.controls.org_name.value);
    if (this.orgdetailsForm.controls.org_name.value == '') {
      this.disableButton = true;
      return
    } else this.disableButton = false;

  }
  AddEventProceeding: boolean | undefined;
  Eventproceedings() {
    this.addEventForm?.reset();
    this.AddEventProceeding = true;
  }

  addEventFormSubmit() {
    let data: any = {};
  }
  AddEventProceeding1: boolean | undefined;
  Eventproceedings1() {
    this.addEventForm1?.reset();
    this.AddEventProceeding1 = true;
  }

  addEventFormSubmit1() {
    let data: any = {};
  }

  edit(e: any) {
    this.addusersdetailsForm.controls['email'].enable();
    this.UserAdd = 'Add';
    this.AddEventProceeding = true;
    this.addEventIndex = e;
    this.addusersdetailsForm.patchValue({
      roleId: this.userroles[0],
    });
    console.log(this.AddEventProceeding);
  }

  getAllOrganizations() {
    this.solution_services.getAllOrganizations().subscribe((res: any) => {
      // console.log("nn", res);
      this.clients = res.responseData;
      this.clientsearch = this.clients;
    });
  }

  selectclient(e: any) {
    this.orgdetailsForm.controls['org_name'].disable();
    this.editorgId = e.value.organizationId;
    this.addUser = [];
    this.Users_service.getallusers(e.value.organizationId).subscribe(
      (res: any) => {
        this.orgData = res.responseData[0].organizationMstDto;
        if (res.responseData[0].userMstDto.length > 0) {
          this.addUser = res.responseData[0].userMstDto;
        }

        this.orgdetailsForm.patchValue({
          org_name: this.orgData.organizationName,
          contactnumber: this.orgData.spocphoneNo,
          email: this.orgData.spocEmailId,
          org_address: this.orgData.address,
          spoc_name: this.orgData.spocName,
          designation: this.orgData.spocDesignation,
        });
        if (this.orgData.imageDataresponse === null) {
          console.log(this.orgData.imageDataresponse);
          this.demoimg = false;
        } else {
          this.demo = this._sanitizer.bypassSecurityTrustResourceUrl(
            'data:image/png;base64,' + this.orgData.imageDataresponse
          );
          this.orgdetailsForm.controls.flie.setValidators(null);
          this.demoimg = true;
        }
        this.indusData.forEach((element: any) => {
          if (this.orgData.industryId == element.industryId) {
            this.orgdetailsForm.patchValue({
              industryId: element,
            });
            this.sectData = element.sectorList;
            this.sectData?.forEach((ele: any) => {
              if (this.orgData.sectorId == ele.sectorId) {
                this.orgdetailsForm.patchValue({
                  sectorId: ele,
                });
              }
            });
          }
        });
      }
    );
    this.hideform = true;
  }

  CloseModal() {
    this.AddEventProceeding = false;
    this.AddEventProceeding1 = false;
    this.addusersdetailsForm.reset();
  }

  dataURLtoFile(dataurl: any, filename: any) {
    var arr = dataurl.split(','),
      mime = arr[0].match(/:(.*?);/)[1],
      bstr = atob(arr[1]),
      n = bstr.length,
      u8arr = new Uint8Array(n);

    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }

    return new File([u8arr], filename, { type: mime });
  }

  onSubmit() {
    this.submited = true;
    var file;
    if (this.editorgId && this.imgFile == null)
      if (this.orgData.imageDataresponse != null)
        file = this.dataURLtoFile(
          'data:image/png;base64,aGVsbG8gd29ybGQ=' +
          new Uint8Array(this.orgData.imageDataresponse),
          'img.png'
        );
    if (this.orgdetailsForm.invalid) {
      this.popup.open(false, 'Enter All the Required Fields');
      return;
    }
    console.log(this.orgdetailsForm, this.addUser);
    console.log(JSON.stringify(this.addUser));

    let data;
    if (this.editorgId) {
      data = {
        sectorId: this.orgdetailsForm.value.sectorId.sectorId,
        imageData: this.imgFile || file,
        spocDesignation: this.orgdetailsForm.value.designation,
        spocEmailId: this.orgdetailsForm.value.email,
        json: this.addUser.length > 0 ? JSON.stringify(this.addUser) : '',
        createdOrmodifiedBy: this.user.userId,
        flag: this.addflag,
        organizationId: this.editorgId,
        address: this.orgdetailsForm.value.org_address,
        industryId: this.orgdetailsForm.value.industryId.industryId,
        spocName: this.orgdetailsForm.value.spoc_name,
        spocPhoneNo: this.orgdetailsForm.value.contactnumber,
        organizationName: this.orgdetailsForm.controls.org_name.value,
      };
    } else {
      data = {
        sectorId: this.orgdetailsForm.value.sectorId.sectorId,
        imageData: this.imgFile,
        spocDesignation: this.orgdetailsForm.value.designation,
        spocEmailId: this.orgdetailsForm.value.email,
        json: this.addUser.length > 0 ? JSON.stringify(this.addUser) : '',
        createdOrmodifiedBy: this.user.userId,
        flag: this.addflag,
        address: this.orgdetailsForm.value.org_address,
        industryId: this.orgdetailsForm.value.industryId.industryId,
        spocName: this.orgdetailsForm.value.spoc_name,
        spocPhoneNo: this.orgdetailsForm.value.contactnumber,
        organizationName: this.orgdetailsForm.value.org_name,
      };
    }
    console.log(data);

    this.Users_service.addNupdateOrgNusers(data).subscribe((res: any) => {
      console.log(res);
      if (this.addflag == 1) {
        this.popup.open(true, 'Successfully Submiited for CIAM Registration! ');
      } else {
        this.popup.open(true, 'Saved Successfully!');
      }
      if (this.addUser.length > 0) {
        this.router.navigate([
          '/user/admin2/view-subscription',
          {
            organizationId: res.responseData,
            serviceRequestId: null,
          },
        ]);
      }
      else {
        this.router.navigate(['/user/admin2/user-management'])
      }
    }
      , (err: any) => {
        console.log(err);
        this.popup.open(false, err.error.statusMessage);
      })
  }
  addClient() {
    this.orgdetailsForm.controls['org_name'].enable();
    this.hideform = true;
    this.orgdetailsForm.reset();
    this.searchForm.reset();
    this.addUser = [];
    this.demo = null;
    this.editorgId = null;
    this.demoimg = false;
  }
  adduser() {
    this.submit = true;
    if (this.addusersdetailsForm.valid) {
      console.log(this.addusersdetailsForm);
      let newval = this.addusersdetailsForm.value;
      // return;
      if (this.editindex >= 0) {
        (this.addUser[this.editindex].userName = this.addusersdetailsForm.value.name),
          (this.addUser[this.editindex].designation = this.addusersdetailsForm.value.designation),
          (this.addUser[this.editindex].contactNo = this.addusersdetailsForm.value.contactnumber),
          (this.addUser[this.editindex].emailId = this.addusersdetailsForm.controls['email'].value),
          // this.addUser[this.editindex].usertype = this.addusersdetailsForm.value.usertype,
          (this.addUser[this.editindex].roleId = this.addusersdetailsForm.value.roleId.roleId),
          (this.addUser[this.editindex].roleName = this.addusersdetailsForm.value.roleId.roleName),
          (this.addUser[this.editindex].status = this.addusersdetailsForm.value.status ? 'Active' : 'Inactive'),
          (this.addUser[this.editindex].createdOrmodifiedBy = this.user.userId),
          (this.editindex = -1);
      } else if ((this.editindex = -1)) {
        console.log(this.addusersdetailsForm.value, newval);

        let data = {
          emailId: this.addusersdetailsForm.value.email,
        }
        console.log(data);

        this.Users_service.verifyEmail(data).subscribe((res: any) => {
          console.log(res, newval);
          let p = 0
          this.addUser.forEach((element: any) => {
            if (element.emailId == data.emailId) {
              p = 1
            }
          });
          if (p == 0) {
            this.addUser.push({
              userName: newval.name,
              designation: newval.designation,
              contactNo: newval.contactnumber,
              emailId: newval.email,
              roleId: this.userroles[0].roleId,
              roleName: this.userroles[0].roleName,
              status: newval.status ? 'Active' : 'Inactive',
              createdOrmodifiedBy: this.user.userId
            });
          }
          else {
            this.popup.open(false, "Email already Exist");
          }

        }
          , (err: any) => {
            console.log(err);
            this.popup.open(false, err.error.statusMessage);
          })
        this.UserAdd = 'Add';
      }
      console.log(this.addusersdetailsForm.value.email);

      this.addusersdetailsForm.reset();
      this.AddEventProceeding = false;
      this.popup.open(true, 'Saved Successfully!');
      this.addflag = 1;
      this.submit = false;
    }

  }
  deleteuser(i: any) {
    this.addUser.splice(i, 1);
  }
  edituser(data: any, i: any) {
    this.addusersdetailsForm.controls['email'].disable();
    this.editindex = i;
    this.addusersdetailsForm.patchValue({
      name: data.userName,
      designation: data.designation,
      contactnumber: data.contactNo,
      email: data.emailId,
      status: data.status == 'Active' ? true : false,
    });
    this.userroles?.forEach((element: any) => {
      if (element.roleId == data.roleId) {
        this.addusersdetailsForm.patchValue({
          roleId: element,
        });
      }
    });
    this.AddEventProceeding = true;
    this.UserAdd = 'Update';
    console.log(this.addUser, this.editindex);
  }

  imageUrl: any;
  imgFileUpload(e: any) {
    this.demo = null;
    this.demoimg = false;
    this.imgFile = e.target.files[0];
    console.log(this.imgFile);
    if (this.imgFile.size < 100000) {
      if (
        this.imgFile.type === 'image/jpeg' ||
        this.imgFile.type === 'image/png' ||
        this.imgFile.type === 'image/jpg'
      ) {
      } else {
        //print incorrect format error
      }
    } else {
      //print size error
    }
  }

  applyFilter(event: any) {
    this.clientsearch = this.clients.filter((user: any) =>
      this.containsValue(user, event.target.value.trim().toLowerCase())
    );
  }
  containsValue(userObj: any, searchValue: any) {
    return Object.values(userObj).reduce((prev, cur: any) => {
      if (cur != null) {
        cur = cur.toString().trim().toLowerCase();
      }
      return prev || cur?.indexOf(searchValue) > -1;
    }, false);
  }
}