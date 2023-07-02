import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { MastersService } from 'src/app/core/services/masters/masters.service';

@Component({
  selector: 'app-service-request',
  templateUrl: './service-request.component.html',
  styleUrls: ['./service-request.component.scss']
})
export class ServiceRequestComponent implements OnInit {

  addEventForm: any;
  addEventIndex: any;
  service: any;
  // id="F81B7026-7D64-4C62-A6F1-BBA60EBBBA18"
  // "A6376313-3CA3-40F5-9108-995BF5D3031F";
  // 72031A8E-70E8-475E-A7E6-E641F1CA2DF5;
  service1: any;
  serviceSearch: MatTableDataSource<any> | any;
  displayedColumns: any;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private router: Router,
    private Master: MastersService,
  ) {}
    ngOnInit(): void {
      this.getserviceByUserId();
      this.displayedColumns=['i','serviceRequestId','requestType','requestDate','action']
  }

  AddEventProceeding: boolean | undefined;
  Eventproceedings() {
     this.addEventForm?.reset();
     this.AddEventProceeding = true
   }
 
  addEventFormSubmit() {
     let data: any = {}
       
   }
  
   edit(e:any) {
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
   }

   getserviceByUserId(){
    // let data = this.id;
    let data = JSON.parse(localStorage.getItem("userInfo") || '{}')
    console.log(data, data.userId);
    this.Master.getserviceByUserId(data.userId).subscribe((res: any) => {
      console.log("subscription", res);
      this.service = res.responseData;
      this.serviceSearch = new MatTableDataSource<any> (res.responseData);
      this.serviceSearch.paginator = this.paginator;
      this.serviceSearch.sort = this.sort;
      // this.service1 = res.responseData[0].serviceRequestDetailResponseList; 
      console.log(this.service);
      console.log(this.service1[0].serviceRequestId);
    })
   }
   applyFilter(event: any) {

    this.serviceSearch = new MatTableDataSource<any>(this.service.filter((user: any) => this.containsValue(user, event.target.value.trim().toLowerCase())));

    // this.usersSearch = new MatTableDataSource<any>(res.responseData);

    this.serviceSearch.paginator = this.paginator;

    this.serviceSearch.sort = this.sort;

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
   viewRequest(data:any){
    console.log(data);
    
    this.router.navigate(['/user/internal_user/view-service'
    ,{RequestId: data}]);
   }
}
