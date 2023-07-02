import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { LoaderService } from 'src/app/core/services/loader.service';
import { MastersService } from 'src/app/core/services/masters/masters.service';
import { SolutionService } from 'src/app/core/services/solution/solution.service';
import { UsersService } from 'src/app/core/services/users/users.service';
import { ToastComponent } from '../../all-common/toast/toast.component';

@Component({
  selector: 'app-view-download',
  templateUrl: './view-download.component.html',
  styleUrls: ['./view-download.component.scss'],
})
export class ViewDownloadComponent implements OnInit {
  panelOpenStateFive = true;
  down = true;
  // id = '3900a4b8-4a36-4619-b8e1-2eed5a4c03e4';
  processId:any
  anaytics: any;
  anayticfile: any;
  downloadt: any;
  demo: any;
  tabs = [
    { id: 0, value: 'Download Files', isActive: true },
    { id: 1, value: 'Execute Project', isActive: false },
    { id: 2, value: 'Shedule Project', isActive: false },
    // { id: 3, value: 'Join', isActive: false },
    // { id: 4, value: 'Target Files', isActive: false },
    // { id: 5, value: 'Data Modelling', isActive: false },
  ];
  projectData:any;
  processname: any;
  projectname: any;

  constructor(
    private solService: SolutionService,
    private Users_service: UsersService,
    private Master: MastersService,
    // private solution: SolutionService,
    private _sanitizer: DomSanitizer,
    private toast: ToastComponent,
    private http: HttpClient,
    private loader:LoaderService,
    private router: Router
  ) {}

  ngOnInit(): void {
    // this.downloadTemplates();
    this.processId=JSON.parse(localStorage.getItem('projectProcess')||"")
    // this.getAllAnalyticsAndTemplates();
    this.projectData=JSON.parse(localStorage.getItem('project')||"")
    this.processname=this.projectData.processName
    this.projectname=this.projectData.projectName
  }
  // getAllAnalyticsAndTemplates() {
  //   let data = this.processId;
  //   this.Users_service.getAllAnalyticsAndTemplates(data).subscribe(
  //     (res: any) => {
  //       this.anaytics = res.responseData.processAnalyticsDTOList;
  //       this.anayticfile = res.responseData.templateResponse;
        
  //       console.log('analytics', this.anaytics);
  //     }
  //   );
  // }

  downloadTemplates() {
    let data = this.processId;
    this.loader.show()
    this.Master.downloadTemplates(data).subscribe((res: any) => {
      this.downloadt = res.responseData;
      this.downloadt.forEach((element: any) => {
        let type = element.fileName.split('.');
        console.log(type[1]);
        if (type[1] == 'jpg') {
          let src = `data:image/jpg;base64,${element.content}`;
          // console.log(demo);
          let a = document.createElement('a');
          a.download = element.fileName;
          a.href = src;
          a.click();
          window.URL.revokeObjectURL(res.URL);
        }
        if (type[1] == 'xlsx' || type[1] == 'xls') {
          let src = `data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,${element.content}`;
          // console.log(demo);
          let a = document.createElement('a');
          a.download = element.fileName;
          a.href = src;
          a.click();
          window.URL.revokeObjectURL(res.URL);
        }
        if (type[1] == 'pdf') {
          let src = `data:application/pdf;base64,${element.content}`;
          // console.log(demo);
          let a = document.createElement('a');
          a.download = element.fileName;
          a.href = src;
          a.click();
          window.URL.revokeObjectURL(res.URL);
        }
        if (type[1] == 'png') {
          let src = `data:image/png;base64,${element.content}`;
          // console.log('png');
          let a = document.createElement('a');
          a.download = element.fileName;
          a.href = src;
          a.click();
          window.URL.revokeObjectURL(res.URL);
        }
        if (type[1] == 'csv') {
          let src = `data:application/csv;base64,${element.content}`;
          // console.log(demo);
          let a = document.createElement('a');
          a.download = element.fileName;
          a.href = src;
          a.click();
          window.URL.revokeObjectURL(res.URL);
        }
        if (type[1] == 'txt') {
          let src = `data:application/txt;base64,${element.content}`;
          // console.log('demo');
          let a = document.createElement('a');
          a.download = element.fileName;
          a.href = src;
          a.click();
          window.URL.revokeObjectURL(res.URL);
        }
        if (type[1] == 'zip') {
          let src = `data:application/zip;base64,${element.content}`;
          // console.log('demo');
          let a = document.createElement('a');
          a.download = element.fileName;
          a.href = src;
          a.click();
          window.URL.revokeObjectURL(res.URL);
        }
      });
      // this.down = !this.down;
      this.loader.hide()
      this.router.navigate(["/user/admin1/execute-process"])
    });
  }
  customPage() {}
  executePage() {}
}

// jpg
// xlsx
//  xlsx
// xlsx
// 2 xlsx
//  xlsx
// xlsx
//  xlsx
// csv
// csv
//  csv
// csv
// csv
// txt
// png
// pdf
// zip

//  xls
// 11


// this.demo=this._sanitizer.bypassSecurityTrustResourceUrl(
          //   'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,' + element.content);
          // let demo = this._sanitizer.bypassSecurityTrustResourceUrl(
          //   'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,' + element.content
          // );
          // data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,
// const src =

// data.append('file', new Blob([JSON.stringify(element.content)],{type:'application/json'}));
// xhr.send(data)
// let blob: Blob = new Blob([element.content], {
//   type: 'image/jpg',
// });

// image/jpg
// image/png
// application/octet-stream
// application/pdf

// window.URL.createObjectURL(blob);
// console.log(data,new Blob([JSON.stringify(demo)],{type:'blob'}));
// ,{ observe: 'response', responseType: 'blob' }
// this.demo = this._sanitizer.bypassSecurityTrustResourceUrl(
//   'data:image/png;base64,' + this.downloadt[0].content
// );
// let blob: Blob = this.demo as Blob;
// // let a = document.createElement('a');
// // a.download = fileName[0];
// const Url = window.URL.createObjectURL(blob);
// a.click();
// window.URL.revokeObjectURL(response.url);
// let demo=this.http.get(,{ observe: 'response', responseType: 'blob' })
// console.log(demo);

// console.log(this.demo);
// let a = document.createElement('a');
// a.download = this.men.fileName;
// a.href = window.URL.createObjectURL(this.demo);
// a.click();

// window.URL.revokeObjectURL(res.URL)

// let blob: Blob = res.body as Blob;
// console.log(blob);
// let a = document.createElement('a');
// a.download = 'demo.xlsx';
// a.href = window.URL.createObjectURL(blob);
// a.click();

// window.URL.revokeObjectURL(res.URL)
// getByServiceRequestId(id:any){
//   return this.http.get(this.masters_url+'Master/getByServiceRequestId?serviceRequestId='+id)
// }
// routerLink="/user/admin1/custom-data"
// routerLink="/user/admin1/execute-process"

// var xhr = new XMLHttpRequest();
// xhr.open('POST', 'url', true);
// console.log("download", this.downloadt,res);
// let demo:Blob=element
// var blob = new Blob([element.content], {type:'application/json'});
// var data = new FormData();
// if (type[1] == 'xlsx'){
//   console.log(type[1]);
//   let demo = this._sanitizer.bypassSecurityTrustResourceUrl(
//     'data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,' +
//       element.content
//     // application/vnd.openxmlformats-officedocument.spreadsheetml.sheet
//   );
//   console.log(demo);

//   // data.append('file', new Blob([JSON.stringify(element.content)],{type:'application/json'}));
//   // xhr.send(data)
//   let blob: Blob = new Blob([JSON.stringify(demo)], {
//     type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
//   });

//   // image/jpg
//   // image/png
//   // application/octet-stream
//   // application/pdf

//   let a = document.createElement('a');
//   a.download = element.fileName;
//   a.href = window.URL.createObjectURL(blob);
//   a.click();

//   window.URL.revokeObjectURL(res.URL);
// }
