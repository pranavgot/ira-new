import { Component, OnInit } from '@angular/core';
import { MsalService } from '@azure/msal-angular';
import { SharedService } from 'src/app/core/services/shared.service';
import { UsersService } from 'src/app/core/services/users/users.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-powerbi-report',
  templateUrl: './powerbi-report.component.html',
  styleUrls: ['./powerbi-report.component.scss']
})
export class PowerbiReportComponent implements OnInit {
  
  user: any;
  reportconfig: any;

  constructor(
    private authService: MsalService,
    private userService: UsersService,
    private shared:SharedService
  ) { }

  ngOnInit(): void {
    this.user = this.userService.userInfo || null;
    this.reportconfig=JSON.parse(localStorage.getItem('powerbiconfig')||'{}')
    if(!this.user){
      this.user=JSON.parse(localStorage.getItem('userInfo')||'{}')
    }
  }

  logout() { // Add log out function here
    this.authService.logoutRedirect({
      postLogoutRedirectUri: environment.redirect_URL
    });
    localStorage.clear();
    sessionStorage.clear();
  }
}
