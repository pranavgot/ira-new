import { Injectable } from "@angular/core";
import {
	ActivatedRouteSnapshot,
	CanActivate,
	Router,
	RouterStateSnapshot,
	UrlTree
} from "@angular/router";
import { MsalService, MsalBroadcastService } from "@azure/msal-angular";
import { AuthenticationResult, EventMessage, EventType } from "@azure/msal-browser";
import { filter } from "rxjs/operators";
import { LoginService } from "../services/login/login.service";
@Injectable()
export class AuthGuard implements CanActivate {
	constructor(
		private router: Router,
		private authService: MsalService,
		private msalBroadcastService: MsalBroadcastService,
		private loginService: LoginService,
	) { }
	canActivate(
		route: ActivatedRouteSnapshot,
		state: RouterStateSnapshot): any {
		this.msalBroadcastService.msalSubject$
			.pipe(
				filter(
					(msg: EventMessage) =>
						msg.eventType === EventType.LOGIN_SUCCESS ||
						msg.eventType === EventType.SSO_SILENT_SUCCESS
				)
			)
			.subscribe(
				(result: EventMessage) => {
					console.log(result);
					const payload = result.payload as AuthenticationResult;
					console.log(payload);
					if (payload.account != undefined) {
						// this.pLoad = payload;
						localStorage.setItem('userr', JSON.stringify(payload));
						localStorage.setItem('account', JSON.stringify(payload.account));
						this.authService.instance.setActiveAccount(payload.account);
						this.loginService.login(payload.accessToken)
					}
					return true;
				},
				(err: any) => {
					console.log('new');
					return false;
				}
			);
		// return false;
	}
}
