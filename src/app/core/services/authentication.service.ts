import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { User } from '../../../app/shared/models/user';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  private userObject!: BehaviorSubject<User>;
  public user!: Observable<User>;
  constructor(
    private router: Router,
    private http: HttpClient
  ) { }
  public get userValue(): User {
    return this.userObject.value;
  }
  doLogin() {
  }
  logout() {
    localStorage.removeItem('user');
    this.userObject.next({ "name": "", "email": "" });
    this.router.navigateByUrl('/auth/client/login');
  }
}
