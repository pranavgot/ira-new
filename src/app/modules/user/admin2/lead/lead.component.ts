import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { LeadsService } from 'src/app/core/services/Leads/leads.service';
// import { ToastComponent } from '../../all-common/toast/toast.component';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MAT_SELECT_CONFIG, MatSelectConfig } from '@angular/material/select';

@Component({
  selector: 'app-lead',
  templateUrl: './lead.component.html',
  styleUrls: ['./lead.component.scss'],
  viewProviders: [
    {
        provide: MAT_SELECT_CONFIG,
        useValue: {
            overlayPanelClass: "paginator-panel-class"
        } as MatSelectConfig
    }
]
})
export class LeadComponent implements OnInit {

  addEventForm: any;
  addEventIndex: any;
  leadsData: any = [];
  procData: any;
  leadSearch: MatTableDataSource<any> | any;
  displayedColumns: any;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private LeadsService: LeadsService,
    private router: Router,
    // private toast: ToastComponent,
  ) { }
  ngOnInit(): void {
    this.getAllLeads()
    this.displayedColumns=['orgName','name','contactNo','emailId','createdDate','action']

    this.leadSearch=new MatTableDataSource<any>([])
  }

  AddEventProceeding: boolean | undefined;
  Eventproceedings() {
    this.addEventForm?.reset();
    this.AddEventProceeding = true
  }

  addEventFormSubmit() {
    let data: any = {}

  }

  //  AddEventProceeding1: boolean | undefined;
  // Eventproceedings11() {
  //    this.addEventForm?.reset();
  //    this.AddEventProceeding = true
  //  }

  // addEventFormSubmit1() {
  //    let data: any = {}

  //  }

  getAllLeads() {
    this.LeadsService.getAllLeads().subscribe((res: any) => {
      // console.log("nnn",res);
      // this.toast.success({ title: 'Success', message: res.statusMessage });
      this.leadsData = res.responseData;
      // this.leadSearch = res.responseData;
      this.leadSearch = new MatTableDataSource<any>(res.responseData);
      this.leadSearch.paginator = this.paginator;
      this.leadSearch.sort = this.sort;
      console.log("nnn", res, this.leadSearch);
      // let date=new Date(res.responseData.createdDate)
      // console.log(date);

      // this.indusData = res.responseData;
      // this.lengthIndus = res.responseData.length;
      // console.log(this.indusData, this.lengthIndus);

      // }
      // ,(err:any)=>{
      //   this.toast.error({ title: 'Error', message: err.statusMessage });
    })
  }

  //  edit(e:any) {
  //    this.AddEventProceeding = true;
  //    this.addEventIndex = e;
  //  }
  //  delete(e:any){
  //   this.AddEventProceeding = true;
  //    this.addEventIndex = e;
  //  }
  CloseModal() {
    this.AddEventProceeding = false;
  }
  viewleads(lead: any) {
    this.router.navigate(["/user/admin2/view-leads", { id: lead.registrationId }])
  }
  applyFilter(event: any) {
    this.leadSearch = new MatTableDataSource<any>(this.leadsData.filter((user: any) => this.containsValue(user, event.target.value.trim().toLowerCase())));
    // this.usersSearch = new MatTableDataSource<any>(res.responseData);
    this.leadSearch.paginator = this.paginator;
    this.leadSearch.sort = this.sort;
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

