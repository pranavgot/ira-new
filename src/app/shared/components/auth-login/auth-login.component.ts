import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MsalBroadcastService, MsalGuardConfiguration, MsalService, MSAL_GUARD_CONFIG } from '@azure/msal-angular';
import { AuthenticationResult, EventMessage, EventType, RedirectRequest } from '@azure/msal-browser';
import { filter } from 'rxjs/operators';
import { AuthenticationService } from 'src/app/core/services/authentication.service';
import { UsersService } from 'src/app/core/services/users/users.service';

@Component({
  selector: 'app-auth-login',
  templateUrl: './auth-login.component.html',
  styleUrls: ['./auth-login.component.scss']
})
export class AuthLoginComponent implements OnInit {

  constructor(
    private http: HttpClient,
    private authenticationService: AuthenticationService,
    @Inject(MSAL_GUARD_CONFIG)
    private msalGuardConfig: MsalGuardConfiguration,
    private authService: MsalService,
    private msalBroadcastService: MsalBroadcastService,
    private UserService: UsersService,
    private router:Router
  ) { }

  ngOnInit() {

    console.log('auth login page:')
    if (this.msalGuardConfig.authRequest){
      this.authService.loginRedirect({...this.msalGuardConfig.authRequest} as RedirectRequest);
    } else {
      this.authService.loginRedirect();
    }
    this.msalBroadcastService.msalSubject$
      .pipe(
        filter(
          (msg: EventMessage) =>
            msg.eventType === EventType.LOGIN_SUCCESS ||
            msg.eventType === EventType.SSO_SILENT_SUCCESS
        )
      )
      .subscribe((result: EventMessage) => {
        console.log(result);
        const payload = result.payload as AuthenticationResult;
        console.log(payload);
        if (payload.account != undefined) {
          // localStorage.setItem('user',JSON.stringify(payload))
          localStorage.setItem('account',JSON.stringify(payload.account))
          console.log('hi',payload.accessToken);
          this.login(payload.accessToken);
          this.authService.instance.setActiveAccount(payload.account);
        }
        console.log(this.authService.instance.getActiveAccount()?.username);

      });
  }

  login(pl:any) {
    // console.log(this.getName());
    console.log('pl----->', pl)
    this.UserService.userManagementLogin(pl).subscribe((res: any) => {
      console.log("user Info--->",JSON.stringify(res));
      localStorage.setItem('userInfo', JSON.stringify(res));
      this.router.navigateByUrl('/user');
      // return res;
    });
    // return this.http.get('https://graph.microsoft-ppe.com/v1.0/me')
  }

}
