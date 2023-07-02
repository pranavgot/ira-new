import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MsalService } from '@azure/msal-angular';
import { SharedService } from 'src/app/core/services/shared.service';
import { UsersService } from 'src/app/core/services/users/users.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  user: any;
  colap:boolean=false;
  profilepopup: boolean = false;
  usericon: any=[];
  userdisplay: any;

  constructor(
    private authService: MsalService,
    private userService: UsersService,
    private shared:SharedService,
    private router:Router
  ) { }

  ngOnInit(): void {
    this.user = this.userService.userInfo || null;
    if(!this.user){
      this.user=JSON.parse(localStorage.getItem('userInfo')||'{}')
    }
    this.usericon=this.user.userName.split(' ')
      this.userdisplay=''
      this.usericon.forEach((str:any,i:any) => {
        if(i<2)
        this.userdisplay=this.userdisplay+str[0];
      });
      console.log(this.userdisplay,this.usericon);

  }
  logout() { // Add log out function here
    this.authService.logoutRedirect({
      postLogoutRedirectUri: environment.redirect_URL
    });
    localStorage.clear();
    sessionStorage.clear();
  }
  navColap(){
    this.colap=!this.colap
    this.shared.sendColap(this.colap)
  }
  profile(){
    this.profilepopup = true;
  }
  closePopup(){
    this.profilepopup = false;
  }
}
