import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MsalBroadcastService, MsalGuardConfiguration, MsalService, MSAL_GUARD_CONFIG } from '@azure/msal-angular';
import { EventMessage, EventType, AuthenticationResult, RedirectRequest } from '@azure/msal-browser';
import { filter } from 'rxjs/operators';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { SharedService } from 'src/app/core/services/shared.service';
import { ToastComponent } from '../../user/all-common/toast/toast.component';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent implements OnInit {
  signinForm!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private toast: ToastComponent,
    private shared: SharedService,

    private authenticationService: AuthenticationService,
    // @Inject(MSAL_GUARD_CONFIG)
    // private msalGuardConfig: MsalGuardConfiguration,
    // private authService: MsalService,
    // private msalBroadcastService: MsalBroadcastService

  ) { }

  ngOnInit(): void {


    // this.msalBroadcastService.msalSubject$
    //   .pipe(
    //     filter(
    //       (msg: EventMessage) =>
    //         msg.eventType === EventType.LOGIN_SUCCESS ||
    //         msg.eventType === EventType.SSO_SILENT_SUCCESS
    //     )
    //   )
    //   .subscribe((result: EventMessage) => {
    //     const payload = result.payload as AuthenticationResult;
    //     if (payload.account != undefined) {
    //       this.login();
    //     }
    //     this.authService.instance.setActiveAccount(payload.account);
    //   });


    this.signinForm = this.formBuilder.group({
      name: ['', Validators.required],
      password: []
    });
  }

  


  login() {
    // console.log(this.signinForm);E561CABB-2A25-4BC4-A399-F7A4781E0C74
    // localStorage.setItem('user', this.signinForm.value.name)
    // this.router.navigate(["user/admin1/dashboard"]);

    if (this.signinForm.valid) {

      this.shared.sendClick(this.signinForm.value.name);
      // console.log(this.signinForm.value.name);
      localStorage.setItem('userss', this.signinForm.value.name)
      if (this.signinForm.value.name == 'admin1') {
        this.router.navigate(["user/admin1/dashboard"]);
        // this.toast.success({ title: 'Success', message: "new success" });
      }
      else if (this.signinForm.value.name == 'admin2') {
        this.router.navigate(["user/admin2/dashboard"]);
      }
      else if (this.signinForm.value.name == 'internal') {
        this.router.navigate(["user/internal_user/dashboard"]);
      }
      else if (this.signinForm.value.name == 'client') {
        this.router.navigate(["user/external_client/dashboard"]);
      }
      else if (this.signinForm.value.name == 'user') {
        this.router.navigate(["user/external_user/dashboard"]);
      }
      else {
        this.router.navigate(["user/admin1/dashboard"]);
        // this.toast.error({ title: 'Error', message: "new success" });

      }
    }
  }

  onSubmit() { }
}
