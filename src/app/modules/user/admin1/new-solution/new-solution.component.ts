import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { factories, models, Report, service, } from 'powerbi-client';
import { HttpService } from 'src/app/core/services/services/http.service';
import 'powerbi-report-authoring';
import { LoaderService } from 'src/app/core/services/loader.service';
import { SolutionService } from 'src/app/core/services/solution/solution.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastComponent } from '../../all-common/toast/toast.component';
import { MastersService } from 'src/app/core/services/masters/masters.service';
import { PopupService } from 'src/app/core/services/popup.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { interval } from 'rxjs';

@Component({
  selector: 'app-new-solution',
  templateUrl: './new-solution.component.html',
  styleUrls: ['./new-solution.component.scss'],
})
export class NewSolutionComponent implements OnInit {
  public get element(): ElementRef<HTMLDivElement> {
    return this._element;
  }
  public set element(value: ElementRef<HTMLDivElement>) {
    this._element = value;
  }
  inter: any;
  PBIdata: any;
  published: boolean = false;
  reportConfig: any;
  powerbi!: service.Service;
  isEditPowerBI: boolean = false;
  process: any;
  dataSets: any;
  embedContainer: any;
  embedViewContainer: any;
  report: any;
  report1!: import('report').Report;
  viewReport: any;
  editReport: any;
  reportViewConfig: any;
  reportEditConfig: any;
  viewEmbedConfig: any;
  reportId: any;
  datasetid: any;
  ReportList: any;
  assigned: any;
  milliSecondsInASecond = 1000;
  hoursInADay = 24;
  minutesInAnHour = 60;
  SecondsInAMinute = 60;
  saveas!: FormGroup;
  submited: boolean = false;
  tokenpopup: boolean = false;
  create: boolean = false;
  time: any
  exptime: any
  diff: any
  secondsToDday: any
  minutesToDday: any
  hoursToDday: any
  @Input() service?: service.Service;

  constructor(
    private router: Router,
    public httpService: HttpService,
    private fb: FormBuilder,
    private popup: PopupService,
    private _element: ElementRef<HTMLDivElement>,
    private loader: LoaderService,
    private solService: SolutionService,
    private Masters: MastersService,
    private toast: ToastComponent
  ) { }

  async ngOnInit(): Promise<void> {
    this.saveas = this.fb.group({
      name: ['']
    })
    this.PBIdata = JSON.parse(localStorage.getItem('PBIdata') || '{}');
    // console.log(this.PBIdata);
    this.process = JSON.parse(localStorage.getItem('process') || '{}');
    if (this.process.statusName == 'Published') {
      console.log(this.process.statusName);
      this.published = true

    }
    this.datasetid = this.PBIdata.dataSetResponse[0].dataSetId||this.PBIdata.responseData.dataSetId;
    let publishednew = this.PBIdata.created;
    this.assigned = publishednew
    if (this.service) {
      this.powerbi = this.service;
    } else {
      this.powerbi = new service.Service(
        factories.hpmFactory,
        factories.wpmpFactory,
        factories.routerFactory
      );
    }

    this.ReportList = this.PBIdata?.dataSetResponse[0]?.reportList;
    this.viewEmbedConfig = this.ReportList[0]||this.PBIdata.responseData;

    this.exptime = new Date(this.viewEmbedConfig.tokenExpiry)
    let diffSec = Math.floor((this.diff) / (this.milliSecondsInASecond));
    let secCount = diffSec;
    this.inter = interval(1000).subscribe(x => {
      this.time = new Date()
      // console.log(this.time, this.exptime);
      this.diff = this.exptime.getTime() - this.time.getTime()
      this.secondsToDday = Math.floor((this.diff) / (this.milliSecondsInASecond) % this.SecondsInAMinute);
      this.minutesToDday = Math.floor((this.diff) / (this.milliSecondsInASecond * this.minutesInAnHour) % this.SecondsInAMinute);
      this.hoursToDday = Math.floor((this.diff) / (this.milliSecondsInASecond * this.minutesInAnHour * this.SecondsInAMinute) % this.hoursInADay);
      // console.log(this.hoursToDday, this.minutesToDday, this.minutesToDday == 5 && this.hoursToDday == 0 && this.secondsToDday == 0);
      if (this.minutesToDday == 5 && this.hoursToDday == 0 && this.secondsToDday == 0) {
        this.tokenpopup = true;
      }
    });

    // secCount--;
    // console.log("diffsec", secCount);

    // if (secCount ==  300) {
    //   // console.log("secCount", secCount);
    //   //minutesToDday == 5 && this.secondsToDday == 0)
    //   this.tokenpopup = true;
    // }

    if (this.ReportList?.length > 0 && this.ReportList[0].reportId != null) {
      this.create = false;
      this.reportId = this.ReportList[0].reportId;
      this.editReportData();
    } else {
      this.create = true;


      this.reportConfig = {
        type: 'report',
        tokenType: models.TokenType.Embed,
        accessToken: this.viewEmbedConfig.embedToken,
        datasetId: this.datasetid, //"778b15d4-5528-417b-b490-25086f9bc88c",
        embedUrl: this.viewEmbedConfig.embedUrl,
        permissions: models.Permissions.All,
        settings: {
          background: models.BackgroundType.Transparent,
          panes: {
            bookmarks: {
              visible: true,
            },
            Insights: {
              visible: true,
            },
          },
        },
      };
      this.embedContainer = document.getElementById('embed');

      this.report = this.powerbi.createReport(
        this.embedContainer,
        this.reportConfig
      );

      this.report1 = this.powerbi.createReport(
        this.embedContainer,
        this.reportConfig
      ) as Report;

      this.report.off('saved');
      this.report.on('saved', (event: any) => {
        if (event.detail.saveAs) {
          console.log(
            event.detail,
            '\nIn order to interact with the new report, create a new token and load the new report'
          );
          this.newsaved({
            dataSetId: this.datasetid,
            reportName: event.detail,
            reportid: event.detail.reportObjectId,
          });
        } else {
          console.log(event.detail);
        }
      });

    }
  }

  editReportData() {
    this.isEditPowerBI = true;
    this.reportEditConfig = {
      type: 'report',
      tokenType: models.TokenType.Embed,
      accessToken: this.viewEmbedConfig.embedToken,
      embedUrl: this.viewEmbedConfig.embedUrl,
      id: this.reportId,
      viewMode: models.ViewMode.Edit,
      permissions: models.Permissions.ReadWrite,
      settings: {
        background: models.BackgroundType.Transparent,
        filterPaneEnabled: true,
        navContentPaneEnabled: true,
        panes: {
          bookmarks: {
            visible: true,
          },
          Insights: {
            visible: true,
          },
        },
      },
    };
    this.embedContainer = document.getElementById('embedEdit');
    this.report = this.powerbi.embed(
      this.embedContainer,
      this.reportEditConfig
    );
    this.report.off('saved');
    this.report.on('saved', (event: any) => {
      if (event.detail.saveAs == false) {
        this.published = false;
        console.log(
          event.detail,
          '\nIn order to interact with the new report, create a new token and load the new report'
        );
        this.updatesaved(event.detail.reportObjectId);
      } else {
        console.log(event.detail);
      }
    });
  }

  ReportSave() {
    this.report.off('saved')
    if (this.create) {
      if (this.saveas.value.name != null) {
        let param = {
          name: this.saveas.value.name
        }
        this.report.saveAs(param);
        this.tokenpopup = false;
        this.saveas.reset()
      }
      else {
        this.popup.open(false, 'Enter report name to save report')
      }
    }
    else {
      this.report.save()
      this.tokenpopup = false;
      this.saveas.reset()
    }
  }

  CloseModal() {
    this.tokenpopup = false;
    this.saveas.reset()
  }

  newsaved(data: any) {
    const payload = {
      embedtype: 'RV',
      reportid: data.reportid,
      groupid: this.PBIdata.workSpaceId,
      datasetid: data.dataSetId,
      processId: this.process.processId,
      reportName: data.reportName.reportName,
    };
    this.httpService.saveReport(payload).subscribe((resp: any) => {
      if (resp) {
        this.PBIdata.dataSetResponse[0].reportList[0].reportId = payload.reportid
        localStorage.setItem('PBIdata', JSON.stringify(this.PBIdata))
        this.create = false;
        this.viewEmbedConfig = resp.responseData;
        this.reportId = payload.reportid;
        this.editReportData();
      }
    });
  }

  getAllDataSetNameAPI() {
    this.solService.getAllDatasetName(this.process.processId).subscribe(
      (res: any) => {
        this.dataSets = res.responseData;

        this.loader.hide();
      },
      (err: any) => {
        this.loader.hide();
      }
    );
  }


  updatesaved(id: any) {
    let data = {
      reportId: id,
    }
    console.log('hello', data);
    this.solService.updateAdminReports(data).subscribe((res: any) => {
      console.log(res);
    })

  }

  AddEventProceeding: boolean | undefined;
  reportData() {
    this.AddEventProceeding = true;

    this.embedViewContainer = document.getElementById('embedView');
    this.reportViewConfig = {
      type: 'report',
      tokenType: models.TokenType.Embed,
      accessToken: this.viewEmbedConfig.embedToken,
      embedUrl: this.viewEmbedConfig.embedUrl,
      workSpaceId: this.viewEmbedConfig.workSpaceId,
      id: this.reportId,
      filters: [],
      settings: {
        filterPaneEnabled: true,
        navContentPaneEnabled: true,
      },
    };
    this.viewReport = this.powerbi.embed(
      this.embedViewContainer,
      this.reportViewConfig
    );

    this.viewReport.off('loaded');
    this.viewReport.on('loaded', () => {
      console.log('report loaded....');
    });
  }

  hideViewReport() {
    this.AddEventProceeding = false;
  }

  publishSolution() {
    this.solService.publishSolution(this.process.processId).subscribe(
      (res: any) => {
        this.toast.success({ title: 'Success', message: res.responseData });
        this.router.navigate(['/user/admin1/solution-board-dashboard']);
      },
      (err: any) => {
        this.toast.error({ title: 'Error', message: err.error.responseData });
      }
    );
  }
  Submit() {

    this.Masters.updateStatus(this.process.processId, 2).subscribe(
      (res: any) => {
        this.toast.success({ title: 'Success', message: res.responseData });
        this.router.navigate(['/user/admin1/solution-board-dashboard']);
      },
      (err: any) => {
        this.toast.error({ title: 'Error', message: err.error.responseData });
      }
    );
  }
  printReport() {
    try { this.editReport.print(); } catch (errors) { console.log(errors); }
  }
  ngDestroy() {
    clearInterval(this.inter)
  }
}

export interface ConfigResponse {
  Id: string;
  EmbedUrl: string;
  EmbedToken: {
    Token: string;
  };
}
