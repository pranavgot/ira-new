import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { PopupService } from '../popup.service';
import { Router } from '@angular/router';
import { UsersService } from '../users/users.service';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  public dev_url = environment.devUrl
  token = sessionStorage.getItem('access_token');

  constructor(private http: HttpClient,
    private popup: PopupService,
    private router: Router,
    private UserService: UsersService,
  ) { }
  public headerProfile = {
    headers: new HttpHeaders({
      Authorization: "Bearer " + this.token
    })
  }
  PostRegister(data: any) {
    return this.http.post(this.dev_url + 'signup/userSignup', data)
  }
  getdetailsbyid(id: any) {
    return this.http.get(this.dev_url + '/signup/getbyid/' + id)
  }
  login(pl: any) {
    console.log('landing pl----->', pl)
    if (pl) {
      this.UserService.userManagementLogin(pl).subscribe(
        (res: any) => {
          console.log(res);

          if (res) {
            console.log('res---->', res)
            localStorage.setItem('userInfo', JSON.stringify(res));
            this.UserService.userInfo = res;
            switch (res.roleName) {
              case 'Level 1-Admin':
                this.router.navigateByUrl('/user/admin1');
                break;
              case 'Level 2-Admin':
                this.router.navigateByUrl('/user/admin2');
                break;
              case 'External User':
                this.router.navigateByUrl('/user/external_user');
                break;
              case 'Internal User':
                this.router.navigateByUrl('/user/internal_user');
                break;
            }
          }
        },
        (err: any) => {
          if (err.error.statusMessage == 'User is not registered') {
            this.router.navigateByUrl('/user/internal_user/access');
          }
          if (err.error.statusMessage == 'Inactive User') {
            this.popup.open(false, err.error.statusMessage);
          }

        }
      );
    }
  }
}
