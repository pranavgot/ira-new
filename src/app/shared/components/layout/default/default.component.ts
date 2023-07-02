import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { MsalBroadcastService, MsalService } from '@azure/msal-angular';
import { SharedService } from 'src/app/core/services/shared.service';
import { UsersService } from 'src/app/core/services/users/users.service';

type ProfileType = {
  givenName?: string,
  surname?: string,
  userPrincipalName?: string,
  id?: string
};

const GRAPH_ENDPOINT = 'https://graph.microsoft.com/v1.0/me';

@Component({
  selector: 'app-default',
  templateUrl: './default.component.html',
  styleUrls: ['./default.component.scss'],
})
export class DefaultComponent implements OnInit {
  profile!: ProfileType;
  loginDisplay = false;
  navOpen: boolean = false;
  leftHover: boolean = false;

  constructor(
    private authService: MsalService,
    private shared: SharedService
  ) { }

  ngOnInit(): void {
    this.shared.getColap().subscribe((res: any) => {
      this.navOpen = res
    })
    this.shared.getLeftHov().subscribe((res: any) => {
      this.leftHover = res
    })
  }

  getProfile() {
    console.log('getProfile');
  }
  getName(): any {
    if (this.authService.instance.getActiveAccount() == null) {
      return 'unknown';
    }
    return this.authService.instance.getActiveAccount()?.name;
  }
  getEmail(): any {
    if (this.authService.instance.getActiveAccount() == null) {
      return 'unknown';
    }
    return this.authService.instance.getActiveAccount()?.username;
  }
}
