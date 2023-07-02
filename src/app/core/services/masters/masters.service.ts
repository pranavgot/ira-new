import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MastersService {
  solution_url = environment.solution_URL;
  public masters_url = environment.Masters_URL
  public users_url = environment.devUrl
  token = sessionStorage.getItem('access_token');

  constructor(private http: HttpClient) { }

  getAllIndustry() {
    return this.http.get(this.masters_url + 'Master/getIndustry')
  }
  getIndustryByID(id: any) {
    return this.http.get(this.masters_url + 'Master/getIndustry?id=' + id)
  }
  getAllSectors() {
    return this.http.get(this.masters_url + 'Master/getSector')
  }
  getSectorByID(id: any) {
    return this.http.get(this.masters_url + 'Master/getSector?id=' + id)
  }
  getAllProcess() {
    return this.http.get(this.masters_url + 'Master/getProcess')
  }
  getAllProcessByType(id: any) {
    return this.http.get(this.masters_url + 'Master/getAllProcessByType?type=' + id)
  }
  getAllProcessBasedPublishedAndFeatureList(id: any) {
    return this.http.get(this.masters_url + 'Master/getAllProcessBasedPublishedAndFeatureList?type=' + id)
  }
  getProcessByID(id: any) {
    return this.http.get(this.masters_url + 'Master/getProcess?id=' + id)
  }
  getOrgSubscription() {
    return this.http.get(this.masters_url + 'Master/getOrgSubscription')
  }
  addEditIndustry(data: any) {
    return this.http.post(this.masters_url + 'Master/addOrEditIndustry', data)
  }
  addEditSector(data: any) {
    return this.http.post(this.masters_url + 'Master/addOrEditSector', data)
  }

  VerifyOtp(data: any) {
    return this.http.post(this.users_url + '/mail/generateNverifyOtp', data)
  }
  SignUp(data: any) {
    return this.http.post(this.users_url + '/signup/userSignup', data)
  }
  getByUserIdSubscritpionDetails(id: any) {
    return this.http.get(this.masters_url + 'Master/getByUserIdSubscritpionDetails?userId=' + id)
  }
  ApproveLead(data: any) {
    return this.http.post(this.users_url + '/Approve', data)
  }
  getBySectorId(id: any, id1: any) {
    return this.http.get(this.masters_url + 'Master/getBySectorId?industryId=' + id + '&sectorId=' + id1)
  }
  ApproveIndustry(data: any) {
    return this.http.post(this.masters_url + 'Master/addIndustryApproval', data)
  }
  ApproveSector(data: any) {
    return this.http.post(this.masters_url + 'Master/addSectorApproval', data)
  }
  ApproveProcess(data: any) {
    return this.http.post(this.masters_url + 'Master/addProcessApproval', data)
  }
  PostaddorEditProcess(data: any) {
    return this.http.post(this.masters_url + 'Master/addorEditProcess', data)
  }
  addServiceRequest(data: any) {
    return this.http.post(this.masters_url + 'Master/addServiceRequest', data)
  }

  getserviceByUserId(id: any) {
    return this.http.get(this.masters_url + 'Master/getByUserIdServiceRequestDetails?userId=' + id)
  }

  approveServiceRequest(data: any) {
    return this.http.post(this.masters_url + 'Master/approveServiceRequest', data)
  }

  getAllServiceRequests() {
    return this.http.get(this.masters_url + 'Master/getAllServiceRequests')
  }
  getByServiceRequestId(id: any) {
    return this.http.get(this.masters_url + 'Master/getByServiceRequestId?serviceRequestId=' + id)
  }
  downloadTemplates(id: any) {
    return this.http.get(this.solution_url + '/ria/myProject/downloadTemplates?processId=' + id)
  }
  getAllProjectOverview(id: any) {
    return this.http.get(this.masters_url + 'Master/getAllProjectOverview?userId=' + id)
  }
  subscriptionDashboard(id: any) {
    console.log('in master subscriptionDashboard----->')
    console.log('id:-->', id)
    return this.http.get(this.masters_url + 'Master/DashBoard/user/subscriptionDetailsByUserId?userId=' + id)
  }

  projectDashboard(id: any) {
    return this.http.get(this.masters_url + 'Master/DashBoard/user/projectStatusCountByUserId?userId=' + id)
  }

  processVsRuncountDashboard(id: any) {
    return this.http.get(this.masters_url + 'Master/DashBoard/user/processVsRuncountVsSubscriptionCountByUserId?userId=' + id)
  }

  userAndLeadsVsCount() {
    return this.http.get(this.masters_url + 'Master/DashBoard/admin/userAndLeadsVsCount')
  }

  subscriptionDetails() {
    return this.http.get(this.masters_url + 'Master/DashBoard/admin/subscriptionDetails')
  }

  projectStatusCount() {
    return this.http.get(this.masters_url + 'Master/DashBoard/admin/projectStatusCount')
  }

  processVsSubscriptionCount() {
    return this.http.get(this.masters_url + 'Master/DashBoard/admin/processVsSubscriptionCount')
  }

  processVsRunCount() {
    return this.http.get(this.masters_url + 'Master/DashBoard/admin/processVsRunCount')
  }
  SolutionsById(id: any) {
    return this.http.get(this.users_url + '/solution/Detatils/getBy/' + id)
  }
  getAllL1AndL2() {
    return this.http.get(this.users_url + '/ria/userManagement/admin/getAllL1AndL2')
  }
  AssignSolution(data: any) {
    return this.http.post(this.users_url + '/solution/Assignment', data)
  }
  updateStatus(solId: any, flag: any) {
    return this.http.post(this.users_url + '/solution/updateStatus/' + solId + '/' + flag, '')
  }
  requestInternalUserAccess(req: any) {
    return this.http.post(this.users_url + '/serviceRequestInternal', req);
  }

  brochureanddemo(requiredid: any, processId: any) {
    return this.http.get(this.masters_url + 'Master/getUrl?id=' + requiredid + '&processId=' + processId)
  }

  getByInternalUserIdSubscritpionDetails(id: any) {
    return this.http.get(this.masters_url + 'Master/getByInternalUserIdSubscritpionDetails?userId=' + id)
  }
  DashBoardCards() {
    return this.http.get(this.masters_url + 'Master/DashBoard/getAllDashBoardCards')
  }

  DashBoardCardsbuyuserid(id: any) {
    return this.http.get(this.masters_url + 'Master/DashBoard/getAllUserDashBoardCards?userId=' + id)
  }

  getAllApprovedData() {
    return this.http.get(this.masters_url + 'Master/getAllApprovedServiceRequests')
  }
  deleteAnalytics(userId:any,analyticId:any){
    return this.http.delete(this.masters_url + 'Master/deleteAnalytics?userId='+userId+'&analyticId='+analyticId)
  }

}
