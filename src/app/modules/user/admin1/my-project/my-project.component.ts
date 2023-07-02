import { I } from '@angular/cdk/keycodes';
import { Component, Inject, Input, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ActivatedRoute, Router } from '@angular/router';
import { factories, models, service } from 'powerbi-client';
import { LoaderService } from 'src/app/core/services/loader.service';
import { MastersService } from 'src/app/core/services/masters/masters.service';
import { HttpService } from 'src/app/core/services/services/http.service';
import { SolutionService } from 'src/app/core/services/solution/solution.service';
import { MatTableDataSource } from '@angular/material/table';
import { PopupService } from 'src/app/core/services/popup.service';
import { DOCUMENT } from '@angular/common';
import { interval } from 'rxjs';
import { MAT_SELECT_CONFIG, MatSelectConfig } from '@angular/material/select';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-my-project',
  templateUrl: './my-project.component.html',
  styleUrls: ['./my-project.component.scss'],
  viewProviders: [
    {
        provide: MAT_SELECT_CONFIG,
        useValue: {
            overlayPanelClass: "paginator-panel-class"
        } as MatSelectConfig
    }
]
})
export class MyProjectComponent implements OnInit {

  AddEventProceeding?: boolean;
  AddEventProceeding1?: boolean;
  AddEventProceeding2?: boolean;
  addEventIndex: any;
  draftshow: boolean = false;
  solshow: boolean = true;
  standshow: boolean = true;
  projectdetails: any;
  schedulerdetails: any;
  embedViewContainer: any;
  embedEditContainer: any;
  reportViewConfig: any;
  reportEditConfig: any;
  viewEmbedConfig: any;
  reportId: any;
  viewReport: any;
  powerbi!: service.Service;
  reportdata: any;
  uploaddata: any;
  projectSearch: MatTableDataSource<any> | any;
  projectSelectionType:Array<any> = [{id:0,value:'Standalone', isSelected:false},{id:1,value:'Incremental',isSelected:false}]
  viewType: Array<any> = [{id:0,value:'List', isSelected:false},{id:1,value:'Tile Icons',isSelected:false}]
  @Input() service?: service.Service;
  projectTypes: any;
  @ViewChild('projectPaginator', {static: false}) set projectPaginator(value: MatPaginator) {
    if (this.projectSearch){
      this.projectSearch.paginator = value;
      // console.log(value);
    }
  }
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  displayedColumns: any;
  response: any;
  projectStatus: any;
  standalone: any;
  failed: any;
  inter: any;
  selectedProjectType!:string
  projectType!:FormGroup;
  submited: boolean = false;

  constructor(
    private popup: PopupService,
    private router: Router,
    private loader: LoaderService,
    private solService: SolutionService,
    private route: ActivatedRoute,
    private Master: MastersService,
    private httpService: HttpService,
    private formBuilder: FormBuilder,
    @Inject(DOCUMENT) private document: Document
  ) { }

  ngOnInit(): void {
    this.projectType = this.formBuilder.group({
      projectType: ['', Validators.required],
      viewType:['', Validators.required],
    })
    this.getAllProjectOverview();
    this.displayedColumns = ['projectName', 'processName', 'projectType', 'creationDate', 'lastExcuteDate', 'runs', 'statusName', 'action']
    setTimeout(() => {
      this.execution();
    }, 1000);
    if (this.service) {
      this.powerbi = this.service;
    } else {
      this.powerbi = new service.Service(
        factories.hpmFactory,
        factories.wpmpFactory,
        factories.routerFactory
      );
    }
  }

  execution() {
    let execute = this.projectdetails?.filter((user: any) => this.containsValue(user, 'Initiated Execution'.trim().toLowerCase()))
    if (execute ? execute.length > 0 : false) {
      this.inter = interval(20000).subscribe(x => {
        this.getAllProjectOverview();
        execute = this.projectdetails.filter((user: any) => this.containsValue(user, 'Initiated Execution'.trim().toLowerCase()))
        if (execute.length == 0) {
          clearInterval(this.inter)
        }
      })
    }
  }

  edit(e: any) {
    this.AddEventProceeding = true;
    this.addEventIndex = e;
  }
  CloseModal() {
    this.AddEventProceeding = false;
    this.AddEventProceeding1 = false;
    this.AddEventProceeding2 = false;
  }

  getAllProjectOverview() {
    let userData = JSON.parse(localStorage.getItem("userInfo") || '{}')
    this.httpService.getAllProjectOverview(userData.userId).subscribe((res: any) => {
      this.response = res.responseData;
      this.projectdetails = res.responseData.projectList;
      this.projectSearch = new MatTableDataSource<any>(res.responseData.projectList);
      this.projectSearch.paginator = this.paginator;
      this.projectSearch.sort = this.sort;
      this.projectStatus = res.responseData.projectStatus
      this.standalone = res.responseData.standloneAndIncrementalAndScheduler
      this.schedulerdetails = res.responseData.schedulerDTO;
      this.reportdata = res.responseData.reportResponse;
    }
      , (err: any) => {
      })
  }
  projectCompleted(item: any) {
    let data = {
      embedtype: 'RV',
      reportid: item.reportResponse[0]?.reportId,
      datasetid: item.reportResponse[0]?.datasetId,
    }
    this.solService.viewReport(data).subscribe((res: any) => {
      this.AddEventProceeding = true;
      this.embedViewContainer = document.getElementById('embedView');
      this.reportViewConfig = {
        type: 'report',
        tokenType: models.TokenType.Embed,
        accessToken: res.responseData?.embedToken,
        embedUrl: res.responseData?.embedUrl,
        id: res.responseData?.reportId,
        filters: [],
        settings: {
          filterPaneEnabled: true,
          navContentPaneEnabled: true
        }
      }
      console.log(this.embedViewContainer);
      this.viewReport = this.powerbi.embed(this.embedViewContainer, this.reportViewConfig);
    })
  }

  projectEdit(){

  }
  // projectScheduled() {
  //   this.AddEventProceeding1 = true;
  // }
  hideViewReport() {
    this.AddEventProceeding = false;
  }

  failedproject(i: any) {
    this.failed = i
    this.AddEventProceeding2 = true;
  }
  AddEventProjecttype: boolean | undefined;

  closePopup() { this.AddEventProjecttype = false; }
  createProject() {
    this.AddEventProjecttype = true;
    localStorage.removeItem('project')
    // this.router.navigate([
    //   '/user/admin1/new-project'])
  }

  projectDraft(data: any) {
    localStorage.setItem('project', JSON.stringify(data))
    this.router.navigate(["/user/admin1/new-project"])
  }

  getErrorMsgByProjectID(projectId: any) {
    this.solService.getErrorMsgByProjectID(projectId).subscribe((res: any) => {
      if (res)
        this.popup.open(false, res.responseData);
    }, (err: any) => {
      this.popup.open(false, err.error.responseData);
    })
  }
  async PrintReport() {
    try {
      await this.viewReport.print();
    }
    catch (errors) {
    }
  }

  openWindow() {
    localStorage.setItem('powerbiconfig', JSON.stringify(this.reportViewConfig))
  }

  applyFilter(event: any) {
    this.projectSearch = new MatTableDataSource<any>(this.projectdetails.filter((user: any) => this.containsValue(user, event.target.value.trim().toLowerCase())));
    this.projectSearch.paginator = this.paginator;
    this.projectSearch.sort = this.sort;
  }
  containsValue(userObj: any, searchValue: any) {
    return Object.values(userObj).reduce((prev, cur: any) => {
      if (cur != null) {
        cur = cur.toString().trim().toLowerCase();
      }
      return prev || cur?.indexOf(searchValue) > -1;
    }, false)
  }

  GCSradio(selectedType: any,i:number) {
    this.projectSelectionType.forEach((obj:any)=> {
      if(i == obj.id) obj.isSelected = true
      else obj.isSelected = false
    })
  }
  changeViewType(evt:any){
    this.selectedProjectType = evt.value
  }

  addproject(){
    this.submited = true
    if (this.projectType.invalid) {
      this.popup.open(false,"Enter All the Required Fields");
      return;
    }
    let deliverObj = {
      projectType: this.projectSelectionType.filter((x:any)=>x.isSelected)[0].value,
      viewType: this.projectType.value.viewType,
      }
    localStorage.setItem('selectionTypeMyproject',JSON.stringify(deliverObj))
    setTimeout(()=> this.router.navigate([
      '/user/admin1/new-project',
    ]),100)    
  }
}


