import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  public Masters_URL = environment.Masters_URL;
  public User_URL = environment.devUrl;
  token = sessionStorage.getItem('access_token');
  userObject: any;
  userInfo: any;
  accessToken = JSON.parse(localStorage?.getItem('user') || '{}')

  constructor(private http: HttpClient) { }
  public headerProfile = {
    headers: ({
      Authorization: 'Bearer ' + this.accessToken?.jwtToken,
    }),
  };

  getSubscription() {
    return this.http.get(this.Masters_URL + 'Master/getSubscription');
  }
  getAllUserDetails() {
    return this.http.get(
      this.User_URL + '/ria/userManagement/getAllUserDetails'
    );
  }
  getAllorgDetails() {
    return this.http.get(this.User_URL + '/organization/getall');
  }
  getallusers(id: any) {
    return this.http.get(
      this.User_URL + '/ria/userManagement/getallusers/' + id
    );
  }
  getallsubscription(id: any) {
    return this.http.get(this.User_URL + '/ria/subscription/getbyid/' + id);
  }
  addNupdateOrgNusers(data: any) {
    const form = new FormData();
    form.append('sectorId', data.sectorId);
    form.append('imageData', data.imageData);
    form.append('spocDesignation', data.spocDesignation);
    form.append('spocEmailId', data.spocEmailId);
    form.append('json', data.json);
    form.append('createdOrmodifiedBy', data.createdOrmodifiedBy);
    form.append('flag', data.flag);
    form.append('address', data.address);
    form.append('industryId', data.industryId);
    form.append('spocName', data.spocName);
    form.append('spocPhoneNo', data.spocPhoneNo);
    form.append('organizationName', data.organizationName);
    if (data.organizationId) {
      form.append('organizationId', data.organizationId);
    }
    return this.http.post(
      this.User_URL + '/ria/userManagement/addNupdateOrgNusers/',
      form
    );
  }
  subscriptionsUpdate(data: any) {
    return this.http.post(this.User_URL + '/ria/subscription/update', data);
  }

  getAllNotificationByUserId(id: any) {
    return this.http.get(
      this.User_URL + '/notification/getbyid/' + id
    );
  }
  sendNotification() {
    return this.http.get(this.Masters_URL + '/ria/Master/sendNotification');
  }
  getByUserIdSubscritpionDetails(id: any) {
    return this.http.get(
      this.Masters_URL + 'Master/getByUserIdSubscritpionDetails?userId=' + id
    );
  }
  getprocessbyid(id: any, fl: any) {
    return this.http.get(this.User_URL + '/ria/project/getProcessListByUserId/' + id + '/' + fl);
  }
  getAllAnalyticsAndTemplates(processid: any, projectid: any) {
    return this.http.get(
      this.Masters_URL + 'Master/getAllAnalyticsAndTemplates?processId=' + processid + '&projectId=' + projectid
    );
  }

  getAllOrganization() {
    return this.http.get(this.User_URL + '/organization/getall');
  }
  getprojectDetails(id: any) {
    return this.http.get(
      this.User_URL + '/ria/subscription/getprojectDetails/' + id
    );
  }
  userManagementLogin(payload: any) {
    this.headerProfile = {
      headers: ({
        Authorization: payload,
      }),
    };
    return this.http
      .post(this.User_URL + '/ria/userManagement/login', '', this.headerProfile)
      .pipe(
        map((user: any) => {
          console.log(user);
          localStorage.setItem('users', JSON.stringify(user.responseData));
          return user.responseData
        })
      );
  }
  add_announcement(data: any) {
    return this.http.post(this.User_URL + '/announcement/save', data);
  }

  getAllAnnouncement() {
    return this.http.get(this.User_URL + '/announcement/getall');
  }

  getAnnouncementByid(id: any) {
    return this.http.get(`${this.User_URL}/announcement/getbyid/${id}`);
  }

  verifyEmail(data: any) {
    return this.http.post(this.User_URL + '/ria/userManagement/verifyEmailInuserDB', data);
  }
  getAllInternalUsers() {
    return this.http.get(this.User_URL + '/ria/userManagement/getAllInternalUserDetails')
  }
  addInternalUser(req: any) {
    return this.http.post(this.User_URL + '/ria/userManagement/addInternalUser', req);

  }
  getSubscriptionDetailsByUserId(id: any): Observable<any> {
    console.log('in user getSubscriptionDetailsByUserId----->')
    return this.http.get(this.User_URL + `/ria/subscription/getSubscriptionsDetailsBy/${id}`);
  }
  getNotificationsByid(id: any) {
    return this.http.get(`${this.User_URL}/notification/getbyid/${id}`);
  }

}
