import { I } from '@angular/cdk/keycodes';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ActivatedRoute, Router } from '@angular/router';
import { models } from 'powerbi-client';
import { LoaderService } from 'src/app/core/services/loader.service';
import { MastersService } from 'src/app/core/services/masters/masters.service';
import { PopupService } from 'src/app/core/services/popup.service';
import { HttpService } from 'src/app/core/services/services/http.service';
import { SolutionService } from 'src/app/core/services/solution/solution.service';
import { ToastComponent } from '../../all-common/toast/toast.component';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss']
})
export class ProjectComponent implements OnInit {
  AddEventProceeding?: boolean;
  AddEventProceeding1?: boolean;
  AddEventProceeding2?: boolean;
  addEventIndex: any;
  draftshow: boolean = false;
  solshow: boolean = true;
  standshow: boolean = true;
  // id="B7007E8C-6142-4EA2-AD7B-C1B252F807B8"
  projectdetails: any;
  schedulerdetails: any;
  embedViewContainer: any;
  embedEditContainer: any;
  reportViewConfig: any;
  reportEditConfig: any;
  viewEmbedConfig: any;
  reportId: any;
  viewReport: any;
  powerbi: any;
  reportdata: any;
  uploaddata: any;
  projectSearch: any=[];

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  displayedColumns: any;
  response: any;
  projectStatus: any;

  constructor(
    private router: Router,
    private loader: LoaderService,
    private solService: SolutionService,
    private route: ActivatedRoute,
    private popup:PopupService,
    private Master: MastersService,
    private httpService: HttpService,
    private toast:ToastComponent
  ) { }

  ngOnInit(): void {
    this.getAllProjectOverview();
    this.displayedColumns=['projectName','creationDate','lastScheduleDate','statusName','action']
    // this.projectDraft();
  }

  edit(e: any) {
    this.AddEventProceeding = true;
    this.addEventIndex = e;
    //  this.addEventForm?.patchValue({
    //    dateofProceeding: pop.dateofProceeding,
    //    dueDate: .dueDate,
    //    gistProceeding: pop.gistProceeding,
    //    remarks: pop.remarks,
    //  })
  }
  CloseModal() {
    this.AddEventProceeding = false;
    this.AddEventProceeding1 = false;
    this.AddEventProceeding2 = false;
  }

  getAllProjectOverview() {
    // let data = this.id;
    this.loader.show();
    let userData = JSON.parse(localStorage.getItem("userInfo") || '{}')
    // console.log(data, data.userId);
    this.httpService.getAllProjectOverview(userData.userId).subscribe((res: any) => {
      this.response = res.responseData;
      this.projectdetails = res.responseData.projectList;
      this.projectSearch = res.responseData.projectList;
      this.projectStatus = res.responseData.projectStatus
      this.loader.hide();
      this.schedulerdetails = res.responseData.schedulerDTO;
      this.reportdata = res.responseData.reportResponse;
      // console.log("project detail", this.projectdetails);
      // console.log("this.schedulerdetails", this.projectdetails[0]?.reportResponse[0]?.reportId);
      // localStorage.setItem('projectOverviewResponse', JSON.stringify({processId:res.responseData?.processId, projectId:res.responseData?.projectId, userId:res.responseData?.userId}));

    }
    , (err: any) => {
      // this.toast.error({ title: 'Error', message: "No Data Found" })
      this.loader.hide();
    })
  }
  projectCompleted(item: any) {
    console.log(this.projectdetails, item);
    
    // this.addEventForm?.reset();
    this.AddEventProceeding = true;

    this.embedViewContainer = document.getElementById('embedView');
    this.reportViewConfig = {
      type: 'report',
      tokenType: models.TokenType.Embed,
      accessToken: item.reportResponse[0]?.embedToken,
      embedUrl: item.reportResponse[0]?.embedUrl,
      id: item.reportResponse[0]?.reportId,
      // accessToken: this.projectdetails[0]?.reportResponse[0]?.embedToken,
      // embedUrl: this.projectdetails[0]?.reportResponse[0]?.embedUrl,
      // // workSpaceId: this.projectdetails.reportResponse.workSpaceId,
      // id: this.projectdetails[0]?.reportResponse[0]?.reportId,

      filters: [],
      settings: {
        filterPaneEnabled: true,
        navContentPaneEnabled: true
      }
    }
    this.viewReport = this.powerbi.embed(this.embedViewContainer, this.reportViewConfig);

    this.viewReport.off('loaded');
    this.viewReport.on('loaded', () => {
      console.log('report loaded....')
    })
  }

  projectScheduled() {
    this.AddEventProceeding1 = true;
  }
  hideViewReport() {
    this.AddEventProceeding = false;
  }
  
  failedproject(){
    this.AddEventProceeding2 = true;
  }

  projectDraft(processid: any) {
    this.router.navigate(["/user/admin1/view-download1", { processId: processid.registrationId }])
  }

  getErrorMsgByProjectID(projectId: any) {
    this.solService.getErrorMsgByProjectID(projectId).subscribe((res: any) => {
      if (res) this.toast.error({ title: 'Error', message: res.responseData })
    }, (err: any) => {
      this.toast.error({ title: 'Error', message: err.error.responseData })
    })
  }

  applyFilter(event: any) {
    this.projectSearch = this.projectdetails.filter((user: any) => this.containsValue(user, event.target.value.trim().toLowerCase()));
    // this.usersSearch = new MatTableDataSource<any>(res.responseData);
    this.projectSearch.paginator = this.paginator;
    this.projectSearch.sort = this.sort;
  }
  containsValue(userObj: any, searchValue: any) {
    return Object.values(userObj).reduce((prev, cur: any) => {
      if (cur != null) {
        cur = cur.toString().trim().toLowerCase();
        // console.log(cur);
      }
      return prev || cur?.indexOf(searchValue) > -1;
    }, false)
  }
}

