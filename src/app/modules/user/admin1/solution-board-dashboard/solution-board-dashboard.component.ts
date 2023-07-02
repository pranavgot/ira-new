import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { LoaderService } from 'src/app/core/services/loader.service';
import { MastersService } from 'src/app/core/services/masters/masters.service';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ToastComponent } from '../../all-common/toast/toast.component';
import { PopupService } from 'src/app/core/services/popup.service';
import { SolutionService } from 'src/app/core/services/solution/solution.service';
import { MAT_SELECT_CONFIG, MatSelectConfig } from '@angular/material/select';

@Component({
  selector: 'app-solution-board-dashboard',
  templateUrl: './solution-board-dashboard.component.html',
  styleUrls: ['./solution-board-dashboard.component.scss'],
  viewProviders: [
    {
        provide: MAT_SELECT_CONFIG,
        useValue: {
            overlayPanelClass: "paginator-panel-class"
        } as MatSelectConfig
    }
]
})
export class SolutionBoardDashboardComponent implements OnInit {
  procData: any;
  indusData: any;
  sectData: any;
  induname: any;
  industryname: any;
  sectorname: any;
  lengthProcess: any;
  lenpending: any = 0;
  lendraft: any = 0;
  lenpublish: any = 0;
  processSearch: MatTableDataSource<any> | any;
  assignForm!: FormGroup;
  today = new Date();
  @ViewChild('solutiontPaginator', {static: false}) set solutiontPaginator(value: MatPaginator) {
    if (this.processSearch){
      this.processSearch.paginator = value;
      console.log(value);
    }
  }
  @ViewChild('draftPaginator', {static: false}) set draftPaginator(value: MatPaginator) {
    if (this.draftSearch){
      this.draftSearch.paginator = value;
      console.log(value);
    }
  }
  @ViewChild('assignedPaginator', {static: false}) set assignedPaginator(value: MatPaginator) {
    if (this.AssignSearch){
      this.AssignSearch.paginator = value;
      console.log(value);
    }
  }
  @ViewChild('publishedPaginator', {static: false}) set publishedPaginator(value: MatPaginator) {
    if (this.publishSearch){
      this.publishSearch.paginator = value;
      console.log(value);
    }
  }
  // @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;
  displayedColumns: any;
  draftprocessData: any = [];
  pendingprocessData: any = [];
  publishprocessData: any = [];
  pendingSearch: MatTableDataSource<any> | any;
  draftSearch: MatTableDataSource<any> | any;
  publishSearch: MatTableDataSource<any> | any;
  popupAssign: boolean = false;
  assignSol: any;
  userId: any;
  selectedUser: any;
  user: any;
  L1L2Users: any = [];
  // subsdetailsForm!:FormGroup
  PublishedColumns: any;
  assignData: any;
  AssignSearch: any;
  lengthAssign: any;
  AssignedColumns: any;
  generic: boolean = true;

  constructor(
    private router: Router,
    private popup: PopupService,
    private Master: MastersService,
    private fb: FormBuilder,
    private loader: LoaderService,
    private toast: ToastComponent,
    private solService: SolutionService,
  ) { }

  showTableSBD: string = 'solutions';
  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem('userInfo') || '{}');
    this.userId = this.user.userId;
    // this.getAllProcess();
    this.assignForm = this.fb.group({
      selectUser: [],
      expectedDate: [],
    });

    this.getAdminUser();
    this.displayedColumns = [
      'processName',
      'processType',
      'userName',
      'createdDate',
      'Astatus',
      'status',
      'assign',
      'action',
    ];
    this.PublishedColumns = [
      'processName',
      'processType',
      'userName',
      'createdDate',
      'status',
      'action',
    ];
    this.AssignedColumns = [
      'processName',
      'processType',
      'assignedDate',
      'expCompletionDate',
      'userName',
      'status',
      'action',
    ];
    this.processSearch=new MatTableDataSource<any>([])
    this.draftSearch=new MatTableDataSource<any>([])
    this.AssignSearch=new MatTableDataSource<any>([])
    this.publishSearch=new MatTableDataSource<any>([])    
    // this.getAllIndustry()
    // this.getAllSector()
    // this.getNames()
  }
  getAdminUser() {
    this.Master.getAllL1AndL2().subscribe((res: any) => {
      this.L1L2Users = [];
      console.log(res);
      res.responseData.forEach((element: any) => {
        if (element.userId != this.userId) {
          this.L1L2Users.push(element);
        }
      });
      // this.L1L2Users = res.responseData;
      console.log(this.L1L2Users);
    });
    this.Master.SolutionsById(this.userId).subscribe((res: any) => {
      console.log(res);
      console.log('peocesss', res);
      this.procData = res.responseData.ownSolutionDtoList;
      this.assignData = res.responseData.solutionAssignmentDtoList;
      this.processSearch = new MatTableDataSource();
      this.processSearch.data = res.responseData.ownSolutionDtoList;
      this.processSearch.paginator = this.solutiontPaginator;
      this.loader.hide();
      this.lengthProcess = res.responseData.ownSolutionDtoList.length;

      this.AssignSearch = new MatTableDataSource();
      this.AssignSearch.data = res.responseData.solutionAssignmentDtoList;
      this.AssignSearch.paginator = this.solutiontPaginator;
      this.lengthAssign = res.responseData.solutionAssignmentDtoList.length;

      this.procData.forEach((ele: any) => {
        if (ele.statusName == 'Pending') {
          this.lenpending++;
          this.pendingprocessData.push(ele);
          this.pendingSearch = new MatTableDataSource<any>(
            this.pendingprocessData
          );
          this.pendingSearch.paginator = this.solutiontPaginator;
        } else if (ele.statusName == 'Draft') {
          this.lendraft++;
          this.draftprocessData.push(ele);
          this.draftSearch = new MatTableDataSource<any>(this.draftprocessData);
          this.draftSearch.paginator = this.solutiontPaginator;
        } else if (ele.statusName == 'Published') {
          this.lenpublish++;
          this.publishprocessData.push(ele);
          this.publishSearch = new MatTableDataSource<any>(
            this.publishprocessData
          );
          this.publishSearch.paginator = this.solutiontPaginator;
        }
      });
    });
  }

  viewprocess(data: any) {
    console.log('id', data);
    if (data.assignedBy != this.userId && data.assignedBy != undefined && data.assignedBy != null) {
      this.Master.updateStatus(data.solutionId, 1).subscribe((res: any) => {
        console.log(res);
        // solutionId,solutionName
        localStorage.setItem('process', JSON.stringify({ processId: data.solutionId, processName: data.solutionName, statusName: data.statusName, solutionType :data.solutionType }));
        // this.process = JSON.parse(localStorage.getItem("process") || '{}')
        console.log(localStorage.getItem("process"));
        this.router.navigate([
          '/user/admin1/solutionboard/add-process'
          // ,{ processId: data.solutionId, processName: data.solutionName },
        ]);
      })

    }
    else {
      localStorage.setItem('process', JSON.stringify({ processId: data.processId, processName: data.processName, statusName: data.statusName, solutionType :data.solutionType}));
      console.log(localStorage.getItem("process"));
      this.router.navigate([
        '/user/admin1/solutionboard/add-process'
        // ,{ processId: data.processId, processName: data.processName },
      ]);
    }
  }

  selectionChange(event: any, data: any) {
    // this.sectData =[]
    if (event.isUserInput) {
      console.log(data, event);
      this.selectedUser = data;
    }
  }

  applyFilter(event: any) {
    //  this.processSearch = new MatTableDataSource<any>;
    this.processSearch.data = this.procData.filter((user: any) =>
      this.containsValue(user, event.target.value.trim().toLowerCase())
    );
    this.processSearch.paginator = this.solutiontPaginator;
    this.processSearch.sort = this.sort;
    console.log(this.processSearch);
  }
  containsValue(userObj: any, searchValue: any) {
    return Object.values(userObj).reduce((prev, cur: any) => {
      if (cur != null) {
        cur = cur.toString().trim().toLowerCase();
        // console.log(cur);
      }
      return prev || cur?.indexOf(searchValue) > -1;
    }, false);
  }


  AddEventProceeding: boolean | undefined;

  closePopup() { this.AddEventProceeding = false; }

  Popup() { this.AddEventProceeding = true; }

  GCSradio(i: any) {
    this.generic = (i == 1 ? true : false)
    console.log(this.generic);
    
  }

  addprocess() {

    localStorage.removeItem('process')
    this.router.navigate([
      '/user/admin1/solutionboard/add-process',
      // { id: this.generic ? 1 : 2 },
    ]);
    // routerLink="/user/admin1/solutionboard/add-process"

    this.solService.setSolutionType({
      id:  this.generic ? 1 : 2 
    });
  }

  // }
  submit() {
    const yyyy = this.assignForm.value.expectedDate.getFullYear();
    let mm = this.assignForm.value.expectedDate.getMonth() + 1;
    let dd = this.assignForm.value.expectedDate.getDate();
    if (dd < 10) dd = '0' + dd;
    if (mm < 10) mm = '0' + mm;
    const expCompDate = yyyy + '-' + mm + '-' + dd;
    let data = {
      solutionId: this.assignSol,
      assignedBy: this.userId,
      assignedTo: this.selectedUser.userId,
      assignedDate: new Date(),
      expCompletionDate: expCompDate,
    };
    console.log(data);

    this.Master.AssignSolution(data).subscribe(
      (res: any) => {
        console.log(res);
        this.getAdminUser();
        this.closePopUp();
      },
      (err: any) => {
        console.log(err);
        this.popup.open(false, err.error.statusMessage);
        // this.toast.error({ title: 'Error', message: err.error.statusMessage });
        this.closePopUp();
      }
    );
  }
  openPopUp(data: any) {
    console.log(data);
    this.assignSol = data.processId;
    this.popupAssign = true;
  }
  closePopUp() {
    // this.L1L2Users=[];
    this.popupAssign = false;
  }
}
// getAllProcess() {
//   this.loader.show();
//   this.Master.getAllProcess().subscribe((res: any) => {
//     console.log('peocesss', res);
//     this.procData = res.responseData;
//     this.processSearch = new MatTableDataSource();
//     this.processSearch.data = res.responseData;
//     this.processSearch.paginator = this.paginator;
//     this.loader.hide();
//     this.lengthProcess = res.responseData.length;

//     this.procData.forEach((ele: any) => {
//       if (ele.status == 'Pending') {
//         this.lenpending++;
//         this.pendingprocessData.push(ele);
//         this.pendingSearch = new MatTableDataSource<any>(
//           this.pendingprocessData
//         );
//         this.pendingSearch.paginator = this.paginator;
//       } else if (ele.status == 'Draft') {
//         this.lendraft++;
//         this.draftprocessData.push(ele);
//         this.draftSearch = new MatTableDataSource<any>(this.draftprocessData);
//         this.draftSearch.paginator = this.paginator;
//       } else if (ele.status == 'Published') {
//         this.lenpublish++;
//         this.publishprocessData.push(ele);
//         this.publishSearch = new MatTableDataSource<any>(
//           this.publishprocessData
//         );
//         this.publishSearch.paginator = this.paginator;
//       }
//     });
//   });
// }
