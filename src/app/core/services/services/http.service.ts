import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ConfigResponse } from '../../../modules/user/admin1/new-solution/new-solution.component';

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  pbi_url = environment.Power_URL;

  constructor(private httpClient: HttpClient) { }

  getEmbedConfig(endpoint: string): Observable<ConfigResponse> {
    return this.httpClient.get<ConfigResponse>(endpoint);
  }
  getEmbedToken(data: any) {
    return this.httpClient.post('https://api.powerbi.com/v1.0/myorg/groups/8382bae0-e72c-466d-8c30-b3a17ae331d4/reports/GenerateToken', data)
  }

  saveReport(data: any) {
    return this.httpClient.post(this.pbi_url + '/saveReport', data);
  }
  getAllProjectOverview(id: any) {
    return this.httpClient.get(this.pbi_url + '/getAllProjectOverview?userId=' + id)
  }
  getprojectDetails(id: any) {
    return this.httpClient.get(this.pbi_url + '/getprojectDetails?orgId=' + id)
  }
  viewReport(data: any) {
    return this.httpClient.post(this.pbi_url + '/viewReport', data);
  }
  updateReport(data: any) {
    return this.httpClient.post(this.pbi_url + '/updateAdminReports', data);
  }
  addtoPowerBiDesktop(data: any) {
    return this.httpClient.post(this.pbi_url + '/addtoPowerBiDesktop', data);
  }
  getReports(id: any) {
    return this.httpClient.get(this.pbi_url + '/getReports?processId=' + id);
  }
  addMeasuresToDataset(data: any) {
    return this.httpClient.post(this.pbi_url + '/addMeasuresToDataset', data);
  }
  deleteReport(pid: any, gid: any, rid: any) {
    return this.httpClient.delete(this.pbi_url + '/deleteReport?processId=' + pid + '&groupId=' + gid + '&reportId=' + rid);
  }
}
