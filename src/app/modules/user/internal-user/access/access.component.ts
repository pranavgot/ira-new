import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MsalService } from '@azure/msal-angular';
import { ToastrService } from 'ngx-toastr';
import { MastersService } from 'src/app/core/services/masters/masters.service';
import { ToastComponent } from '../../all-common/toast/toast.component';
import { PopupService } from 'src/app/core/services/popup.service';

@Component({
  selector: 'app-access',
  templateUrl: './access.component.html',
  styleUrls: ['./access.component.scss']
})
export class AccessComponent implements OnInit {
  displayStyle = 'none';
  requestAccessForm!: FormGroup ;
  activeUser: any;
  submitted = false;
  constructor(private authService: MsalService,
    private formBuilder: FormBuilder,
    private masterService: MastersService,
    private router: Router,
    private popup: PopupService,
    private toast: ToastComponent ) {
      this.activeUser = JSON.parse(localStorage?.getItem('userr') ||'{}');
      this.requestAccessForm = this.formBuilder?.group({
        userName: [{value: this.activeUser?.account?.name, disabled: true}],
        emailid: [{value: this.activeUser?.account?.username, disabled: true}],
        contactNo: [null,[Validators.required]],
        designation: [null,[Validators.required]],
        orgName: [{value: this.activeUser?.account?.username?.split("@")?.[1]?.replace('.com','')?.toUpperCase(), disabled: true}],
        requestMessage: [null,[Validators.required]]
       });
   }

  ngOnInit(): void {
  }
  openPopup() {
    this.displayStyle = 'block';
    this.setFormValues();
  }

  closePopup() {
    this.displayStyle = 'none';
    this.requestAccessForm?.reset();
    this.submitted = false;
  }
  
  submitAccessRequest() {
    this.submitted = false;
    if(this.requestAccessForm?.invalid) this.submitted = true;
    else {
      let iuDetails = this.requestAccessForm?.value;
      iuDetails.userName = this.activeUser?.account?.name;
      iuDetails.emailid = this.activeUser?.account?.username;
      this.masterService?.requestInternalUserAccess(iuDetails)?.subscribe((res:any) => {
        this.popup.open(true, "Thank you ! your request is in progress.");
        this.router?.navigateByUrl('/auth/landing');
      }, (err: any) => {
        this.popup.open(false, err.error.statusMessage);
      });
      // this.toast?.error({title: 'Error', message: err?.error?.message }));
    }
  }
  setFormValues(){
    this.requestAccessForm?.patchValue ({
      userName: this.activeUser?.account?.name,
      emailid: this.activeUser?.account?.username,
      orgName: this.activeUser?.account?.username?.split("@")?.[1]?.replace('.com','')?.toUpperCase(),
     });
  }
}
