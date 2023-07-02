import { HttpClient, HttpEvent, HttpHeaders, HttpParams, } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SolutionService {

  solution_url = environment.solution_URL;
  master_url = environment.devUrl
  user_url = environment.devUrl;
  token = sessionStorage.getItem('access_token');
  private solutionType = new BehaviorSubject<any>({});

  constructor(private http: HttpClient) { }

  headerProfile = {
    headers: new HttpHeaders({
      Authorization: "Bearer " + this.token
    })
  }

  getAllClientsList() {
    return this.http.get(this.solution_url + 'industryMaster/getIndustry')
  }// wrong api call

  saveUploadFiles_JSON() {
    // return this.http.post<any>()
  }

  postInputFiles(formData: FormData) { //upload filesuploadAndProgress
    return this.http.post(this.solution_url + '/ria/solution/uploadExcelToTemplate', formData,{observe: 'events',reportProgress:true})
  }

  saveDataSetApi(postReq: any) {
    return this.http.post(this.solution_url + '/ria/solution/uploadDataset', postReq)
  }
  getAllOrganizations() {
    return this.http.get(this.user_url + '/organization/getall')
  }

  saveAddProcess(formData: any) {
    return this.http.post('/ria/solution/addorEditProcess', formData)
  }

  saveAppendJoinList(postReq: any) { //x
    //return this.http.post(this.solution_url+'/ria/solution2/saveTargetFiles', postReq)
  }

  addDataset(postReq: any) { //dataset post api
    return this.http.post(this.solution_url + '/ria/solution/addDataset', postReq,{observe: 'events',reportProgress:true})
  }

  getViewScript(datasetId: any) { //get view script
    return this.http.get(this.solution_url + '/ria/solution/getDatasetTableScript?datasetID=' + datasetId)
  }

  getAppendFiles(processId: string) { //get appended Files list
    return this.http.get(this.solution_url + '/ria/solution/getAppendFiles?processID=' + processId)
  }

  addAppendFiles(postData: any) { //append 
    return this.http.post(this.solution_url + '/ria/solution/addAppendFiles', postData,{observe: 'events',reportProgress:true})
  }

  deleteTables(data: any) { //append 
    return this.http.delete(this.solution_url + `/ria/solution/deleteFileOrTables?id=${data.id}&type=${data.type}&operation=${data.operation}`)
  }

  getMergeList(processId: string) { //get join Files list
    return this.http.get(this.solution_url + '/ria/solution/getMergeList?processID=' + processId)
  }

  addJoinFiles(postData: any) { //join 
    return this.http.post(this.solution_url + '/ria/solution/addMergeDetails', postData,{observe: 'events',reportProgress:true})
  }

  getAllDatasetName(processId: any) { //get all dataset list
    return this.http.get(this.solution_url + '/ria/solution/getAllDatasetName?processId=' + processId)
  }

  createProject(postData: any) {
    return this.http.post(this.solution_url + '/ria/myProject/addProject', postData)
  }

  executeProject(postData: any) {
    return this.http.post(this.solution_url + '/ria/myProject/executeProject', postData)
  }

  execSolutionScript(processId: any) { //execute button in SolutionBoard
    return this.http.get(this.solution_url + '/ria/solution/execSolutionScript?processId=' + processId)
  }

  viewTableDetails(data: any) { //get data for preview
    let link = (data.targetFileEdit)? data.name + '&processId='+ data.processId + '&targetFileEdit=S' :  data.name + '&processId='+ data.processId
    return this.http.get(this.solution_url + '/ria/solution/viewTableDetails?tableName=' + link)
  }

  getAllFunctions() { //fx
    return this.http.get(this.solution_url + '/ria/SolutionBoard/getAllFunctions')
  }

  updateScriptByDatasetId(updateScript: any) { //update viewscript
    return this.http.post(this.solution_url + '/ria/solution/updateScriptByDatasetId', updateScript)
  }

  getTargetFileList(processID: any) {//TF get
    return this.http.get(this.solution_url + '/ria/solution/getTargetFileList?processID=' + processID)
  }

  getAllDataTypeByDatatypeName() {
    return this.http.get(this.solution_url + '/ria/solution/getAllDataTypeByDatatypeName')
  }
  
  updateColumnAndDataType(postData: any) { //TF post
    return this.http.post(this.solution_url + '/ria/solution/updateColumnAndDataType', postData)
  }

  postPushDataSets(data: any, type?: boolean) {
    const url = environment.Power_URL + (type ? '/updatepushdataset' : '/pushdataset');
    return this.http.post(url, data);
  }
  getembedinfo(data: any) {
    return this.http.post(environment.Power_URL + '/getembedinfo/v1', data)
  }
  viewReport(data: any) {
    return this.http.post(environment.Power_URL + '/viewReport', data)
  }
  getExistDataset(data: any, type: any) {
    return this.http.get(this.solution_url + '/ria/solution/isTableExist?tableName=' + data + '&type=' + type)
  }
  uploadExcelToProjectExecutionNreExecution(data: any) {
    return this.http.post(this.solution_url + '/ria/myProject/uploadExcelToProjectExecutionNreExecution', data, {observe: 'events',reportProgress:true})
  }
  
  getAllFileTemplateListByProcessID(processID: any) { //get all files in UF
    return this.http.get(this.solution_url + '/ria/solution/getAllFileTemplateListByProcessID?processID=' + processID)
  }

  addScheduler(data: any) {
    return this.http.post(this.solution_url + '/ria/myProject/addScheduler', data)
  }
  incrementalapi(data: any) {
    return this.http.post(this.solution_url + '/ria/myProject/incremental', data)
  }
  saveFileTypeIncremental(data: any) {
    return this.http.post(this.solution_url + '/ria/myProject/saveFileTypeIncremental', data)
  }
  getProjectDetailsById(projectId: any,processId: any,) {
    return this.http.get(this.solution_url + '/ria/myProject/getProjectDetailsById?projectId=' + projectId + '&processId=' + processId)
  }

  addDatasetAppend(data: any) {// dataset append
    return this.http.post(this.solution_url + '/ria/solution/addDatasetAppend', data)
  }

  saveCheckedSheetList(data: any) { // upload files next (checked sheets)
    return this.http.post(this.solution_url + '/ria/solution/saveCheckedSheetList', data)
  }

  saveFieldCheckList(data: any) {//check, dropdown post api in TF next
    return this.http.post(this.solution_url + '/ria/solution/saveFieldCheckList', data)
  }

  uploadScriptToProcess(data: any) {  //upload sql/python script
    return this.http.post(this.solution_url + '/ria/solution/uploadScriptToProcess', data)
  }

  execscript(processId: any,flag:any) {  // execute py, sql script
    return this.http.get(this.master_url + `/execscript/${processId}/${flag}`)
  }


  getSolutionScript(processId: any) {  //upload sql/python script
    return this.http.get(this.solution_url + '/ria/solution/getSolutionScript?processId=' + processId)
  }

  publishSolution(processId: any) { //powerBi publish solution 
    return this.http.get(this.solution_url + '/ria/solution/publishSolution?processId=' + processId)
  }

  getAllOperators() { //operators list according to datatype
    return this.http.get(this.solution_url + '/ria/operator/getAllOperators')
  }

  getErrorMsgByProjectID(projectID:any){ //project component -
    return this.http.get(this.solution_url + '/ria/myProject/getErrorMsgByProjectID?projectID='+ projectID)
  }
  updateAdminReports(data:any){
    return this.http.post(environment.Power_URL + '/updateAdminReports', data)
  }

  getAllUploadFileTemplate(projectID:any){
    return this.http.get(this.solution_url + '/ria/myProject/getAllUploadFileTemplateListByProjectID?projectID='+ projectID)
  }

  getUploadedScriptTableList(processId:any){
    return this.http.get(this.solution_url + '/ria/solution/getUploadedScriptTableList?processID='+ processId)
  }

  generateJsonForUploadScript(data:any){
    return this.http.post(this.solution_url + '/ria/solution/generateJsonForUploadScript',data)
  }

  Scheduler(data:any){
    return this.http.post(this.solution_url + '/ria/solution/addScheduler',data)
  }
  // http://10.40.230.248:9194/RIA_SOLUTION_BOARD/ria/SolutionBoard/addScheduler
  
  setSolutionType(user: any) {
    this.solutionType.next(user);
  }
  getSolutionType() {
      return this.solutionType.asObservable();
    }

}