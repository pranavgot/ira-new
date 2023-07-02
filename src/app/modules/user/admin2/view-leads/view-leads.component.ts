import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LoaderService } from 'src/app/core/services/loader.service';
import { LoginService } from 'src/app/core/services/login/login.service';
import { MastersService } from 'src/app/core/services/masters/masters.service';
import { PopupService } from 'src/app/core/services/popup.service';
// import { ToastComponent } from '../../all-common/toast/toast.component';

@Component({
  selector: 'app-view-leads',
  templateUrl: './view-leads.component.html',
  styleUrls: ['./view-leads.component.scss'],
})
export class ViewLeadsComponent implements OnInit {
  procData: any = [];
  leadsData: any;
  userData: any;
  regId: any;
  CprocData: any;

  constructor(
    private popup:PopupService,
    private loader:LoaderService,
    private Master: MastersService,
    private Login_service: LoginService,
    private route: ActivatedRoute,
    private router: Router,
    // private toast: ToastComponent
  ) {}

  ngOnInit(): void {
    this.getAllProcess();
    // this.getdetailsbyid()
  }

  getdetailsbyid() {
    this.regId = this.route.snapshot.paramMap.get('id');
    this.Login_service.getdetailsbyid(this.regId).subscribe((res: any) => {
      console.log(res);
      // this.toast.success({ title: 'Success', message: "Submitted for CIAM Registration!" });
      this.userData = res.responseData;
      this.userData.processId.forEach((element: any) => {
        this.procData.forEach((ele: any) => {
          if (element === ele.processId) {
            ele.checked = true;
          }
          // else {
          //   ele.checked = false;
          // }
          this.CprocData.forEach((ele: any) => {
            if (element === ele.processId) {
              ele.checked = true;
            }
            // else {
            //   ele.checked = false;
            // }
          });
        });
      });
      console.log(this.procData);
    });

      //   // this.lengthProcess = res.responseData.length;
    // });
    // ,(err:any)=>{
    //   this.toast.error({ title: 'Error', message: err.statusMessage });
    // }
  }

  getAllProcess() {
    this.Master.getAllProcessByType(1).subscribe((res: any) => {
      // console.log(res);
      this.procData = res.responseData;
      this.getdetailsbyid();

      // this.lengthProcess = res.responseData.length;
    });

    this.Master.getAllProcessByType(2).subscribe((res: any) => {
      // console.log(res);
      this.CprocData = res.responseData;
      this.getdetailsbyid();

      // this.lengthProcess = res.responseData.length;
    });
  }
  registerUser() {
    let data = {
      registrationId: this.userData.registrationId,
      status: 1,
    };
    this.loader.show();
    this.Master.ApproveLead(data).subscribe((res: any) => {
      console.log(res);
      this.loader.hide();
      this.popup.open(true,'Submitted for CIAM Registration!');
      // this.toast.success({title: 'Success',message: 'Submitted for CIAM Registration!',});
      // this.router.navigate([
      //   '/user/admin2/view-subscription',
      //   { id: res.responseData.organizationId },
      // ]);
      this.router.navigate([
        '/user/admin2/view-subscription',
        {
          organizationId: res.responseData.organizationId,
          serviceRequestId: null,
        },
      ]);

      // this.procData = res.responseData;
      // this.getAllProcess()
      // this.getdetailsbyid()
      // this.lengthProcess = res.responseData.length;
    },
      (err: any) => {
        this.loader.hide();
        this.popup.open(false,err.error.statusMessage);
        // this.toast.error({ title: 'Error', message: err.error.statusMessage });
      });
  }
  // routerLink="/user/admin2/subscription-management"
}
