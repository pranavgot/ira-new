import { Component, OnInit, ViewChild  } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MastersService } from 'src/app/core/services/masters/masters.service';
import { HttpService } from 'src/app/core/services/services/http.service';
import { UsersService } from 'src/app/core/services/users/users.service';
import { models } from 'powerbi-client';
import { SolutionService } from 'src/app/core/services/solution/solution.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MAT_SELECT_CONFIG, MatSelectConfig } from '@angular/material/select';

@Component({
  selector: 'app-client-info2',
  templateUrl: './client-info2.component.html',
  styleUrls: ['./client-info2.component.scss'],
  viewProviders: [
    {
        provide: MAT_SELECT_CONFIG,
        useValue: {
            overlayPanelClass: "paginator-panel-class"
        } as MatSelectConfig
    }
]
})
export class ClientInfo2Component implements OnInit {
  tab1: boolean = false;
  tab2: boolean = false;
  tab3: boolean = false;
  tab4: boolean = false;
  orgid: any;
  orgdetail: any;
  projectdetail: any;
  subdetail: any;
  userdetail: any;
  GprocData: any;
  workdetail: any;
  CprocData: any;
  subs: any;
  AddEventProceeding?: boolean;
  AddEventProceeding1?: boolean;
  AddEventProceeding2?: boolean;
  viewReport: any;
  powerbi: any;
  embedViewContainer: any;
  embedEditContainer: any;
  reportViewConfig: any;
  reportEditConfig: any;
  viewEmbedConfig: any;
  reportId: any;
  reportdata: any;
  uploaddata: any;
  displayedColumns: any;
  displayedColumns1: any;
  displayedColumns2: any;
  displayedColumns3: any;
  projectSearch: MatTableDataSource<any> | any;
  userSearch: MatTableDataSource<any> | any;
  subSearch: MatTableDataSource<any> | any;
  workSearch: MatTableDataSource<any> | any;
  

  @ViewChild(MatSort) sort!: MatSort;
  failed: any;
  
  
  @ViewChild('subPaginator', {static: false}) set subPaginator(value: MatPaginator) {
    if (this.subSearch){
      this.subSearch.paginator = value;
    }
  }

  @ViewChild('workPaginator', {static: false}) set workPaginator(value: MatPaginator) {
    if (this.workSearch){
      this.workSearch.paginator = value;
    }
  }
  
  @ViewChild('projectPaginator' , {static: false}) set projectPaginator(value: MatPaginator){
    if (this.projectSearch){
      this.projectSearch.paginator = value;
    }
  }
  @ViewChild('userPaginator', {static: false}) set userPaginator(value: MatPaginator) {
    if (this.userSearch){
      this.userSearch.paginator = value;
    }
  }
  
  
  constructor(
    private Users_service: UsersService,
    private Master: MastersService,
    private router: Router,
    private route: ActivatedRoute,
    private userService: UsersService,
    private httpService: HttpService,
    private solService: SolutionService,
  ) { }

  ngOnInit(): void {
    this.orgid = this.route.snapshot.paramMap.get('orgId');
    this.getallusers()
    this.getprojectDetails()
    this.getallsubscription()
    // this.getAllProcess()
    this.displayedColumns=['sno','projectName','processName','creationDate','userName','statusName','action']
    this.displayedColumns1=['sno','userName','roleName','designation','contactNo','emailId','status']
    this.displayedColumns2=['processName','startDate','endDate','runCount','status']
    this.displayedColumns3=['processName','startDate','endDate','status']
   }

  changetab(id: any) {
    if (id == 1) {
      this.tab1 = true;
      this.tab2 = false;
      this.tab3 = false;
      this.tab4 = false;
    }
    else if (id == 2) {
      console.log("tab2");
      this.tab1 = false;
      this.tab2 = true;
      this.tab3 = false;
      this.tab4 = false;
    }
    else if (id == 3) {
      console.log("tab3");
      this.tab1 = false;
      this.tab2 = false;
      this.tab3 = true;
      this.tab4 = false;
    }
    else if (id == 4) {
      console.log("tab4");
      this.tab1 = false;
      this.tab2 = false;
      this.tab3 = false;
      this.tab4 = true;
    }
  }
  getallusers() {
    this.userService.getallusers(this.orgid).subscribe((res: any) => {
      this.userdetail = res.responseData[0].userMstDto;
      this.userSearch = new MatTableDataSource<any>(res.responseData[0]?.userMstDto);  
      this.userSearch.MatPaginator = this.userPaginator;
      this.changetab(1)
      // this.userSearch.sort = this.sort;
      this.orgdetail = res.responseData[0].organizationMstDto;
      console.log("orgdetal", this.orgdetail);
    })
  }
  getprojectDetails() {
    this.httpService.getprojectDetails(this.orgid).subscribe((res: any) => {
      this.projectdetail = res.responseData.projectList;
      // this.projectdetail = res.responseData.projectList;
      this.projectSearch = new MatTableDataSource<any>(res.responseData.projectList);
      this.projectSearch.MatPaginator = this.projectPaginator;
      this.projectSearch.sort = this.sort;
      console.log("projectdetail", this.projectdetail);
      console.log("projectdetail", this.projectSearch);
      this.getAllProcess()
    })
  }
  getallsubscription() {
    this.userService.getallsubscription(this.orgid).subscribe((res: any) => {
      this.subdetail = res.responseData.subscriptionDto;
      this.subSearch = new MatTableDataSource<any>(res.responseData.subscriptionDto);
      this.subSearch.MatPaginator = this.subPaginator;
      this.subSearch.sort = this.sort;

      this.workdetail = res.responseData.subsciptionTypeDetailsDto;
      this.workSearch = new MatTableDataSource<any>(res.responseData.subsciptionTypeDetailsDto);
      this.workSearch.MatPaginator = this.workPaginator;
      this.workSearch.sort = this.sort;
      console.log("subdetail", this.subdetail);
      this.getAllProcess()
      this.getSubscription()

      // processID
      // orgSubscriptionId
    })
  }

  getAllProcess() {
    this.Master.getAllProcessByType(1).subscribe((res: any) => {
      this.GprocData = res.responseData;
      console.log("process", this.GprocData);
      // this.getByUserIdSubscritpionDetails(); processId
      // this.lengthProcess = res.responseData.length;
      this.Master.getAllProcessByType(2).subscribe((res: any) => {
        console.log("process", res);
        this.CprocData = res.responseData;
        this.getNames(),
          this.getProcess()
        // this.lengthProcess = res.responseData.length;
      });
    });

  }

  getSubscription() {
    this.Users_service.getSubscription().subscribe((res: any) => {
      console.log("subscription", res);
      this.subs = res.responseData;
      this.getWorkNames()
    })
  }

  getWorkNames() {
    this.workdetail.forEach((res: any) => {
      this.subs.forEach((ele: any) => {
        if (res.subscriptionTypeId == ele.subscriptionTypeId) {
          res.subscriptionType = ele.subscriptionType
          console.log(res);
        }
      })
    })
    console.log(this.workdetail);
  }


  getNames() {
    this.subdetail?.forEach((res: any) => {
      this.GprocData.forEach((ele: any) => {
        if (res.processID == ele.processId) {
          res.processName = ele.processName
          console.log(res);
        }
      })
      this.CprocData.forEach((ele: any) => {
        if (res.processID == ele.processId) {
          res.processName = ele.processName
          console.log(res);
        }
      })
    })
    console.log(this.subdetail);
  }

  getProcess() {
    this.projectdetail.projectList?.forEach((res: any) => {
      this.GprocData.forEach((ele: any) => {
        if (res.processId == ele.processId) {
          res.processName = ele.processName
          console.log(res);
        }
      })
      this.CprocData.forEach((ele: any) => {
        if (res.processId == ele.processId) {
          res.processName = ele.processName
          console.log(res);
        }
      })
    })
    console.log(this.subdetail);
  }
  failedproject(i: any) {
    this.failed = i
    console.log(i);
    this.AddEventProceeding2 = true;
  }
  edit(e: any) {
    this.AddEventProceeding = true;
    // this.addEventIndex = e;
  }
  CloseModal() {
    this.AddEventProceeding = false;
    this.AddEventProceeding1 = false;
    this.AddEventProceeding2 = false;
  }
  projectCompleted(item: any) {
    // console.log(this.projectdetails, item);

    // this.addEventForm?.reset();
    let data = {
      embedtype: 'RV',
      reportid: item.reportResponse[0]?.reportId,
      datasetid: item.reportResponse[0]?.datasetId,
    }
    this.solService.viewReport(data).subscribe((res: any) => {
      console.log(res);

      this.AddEventProceeding = true;

      this.embedViewContainer = document.getElementById('embedView');
      this.reportViewConfig = {
        type: 'report',
        tokenType: models.TokenType.Embed,
        accessToken: res.responseData?.embedToken,
        embedUrl: res.responseData?.embedUrl,
        id: res.responseData?.reportId,
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
    });
  }
  projectScheduled() {
    this.AddEventProceeding1 = true;
  }
  hideViewReport() {
    this.AddEventProceeding = false;
  }

  projectDraft(processid: any) {
    this.router.navigate(["/user/admin1/view-download1", { processId: processid.registrationId }])
  }

  applyFilter(event: any) {
    this.projectSearch = new MatTableDataSource<any>(this.projectdetail.filter((user: any) => this.containsValue(user, event.target.value.trim().toLowerCase())));
    // this.usersSearch = new MatTableDataSource<any>(res.responseData);
    this.projectSearch.MatPaginator = this.projectPaginator;
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

  applyFilter1(event: any) {
    this.userSearch = new MatTableDataSource<any>(this.userdetail.filter((user: any) => this.containsValue1(user, event.target.value.trim().toLowerCase())));
    // this.usersSearch = new MatTableDataSource<any>(res.responseData);
    this.userSearch.MatPaginator = this.userPaginator;
    this.userSearch.sort = this.sort;
  }
  containsValue1(userObj: any, searchValue: any) {
    return Object.values(userObj).reduce((prev, cur: any) => {
      if (cur != null) {
        cur = cur.toString().trim().toLowerCase();
        // console.log(cur);
      }
      return prev || cur?.indexOf(searchValue) > -1;
    }, false)
  }

  applyFilter2(event: any) {
    this.subSearch = new MatTableDataSource<any>(this.subdetail.filter((user: any) => this.containsValue2(user, event.target.value.trim().toLowerCase())));
    // this.usersSearch = new MatTableDataSource<any>(res.responseData);
    this.subSearch.MatPaginator = this.subPaginator;
    this.subSearch.sort = this.sort;
  }
  containsValue2(userObj: any, searchValue: any) {
    return Object.values(userObj).reduce((prev, cur: any) => {
      if (cur != null) {
        cur = cur.toString().trim().toLowerCase();
        // console.log(cur);
      }
      return prev || cur?.indexOf(searchValue) > -1;
    }, false)
  }

  applyFilter3(event: any) {
    this.workSearch = new MatTableDataSource<any>(this.workdetail.filter((user: any) => this.containsValue3(user, event.target.value.trim().toLowerCase())));
    // this.usersSearch = new MatTableDataSource<any>(res.responseData);
    this.workSearch.MatPaginator3 = this.workPaginator;
    this.workSearch.sort = this.sort;
  }
  containsValue3(userObj: any, searchValue: any) {
    return Object.values(userObj).reduce((prev, cur: any) => {
      if (cur != null) {
        cur = cur.toString().trim().toLowerCase();
        // console.log(cur);
      }
      return prev || cur?.indexOf(searchValue) > -1;
    }, false)
  }
}
