import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { DomSanitizer } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { LoaderService } from 'src/app/core/services/loader.service';
import { UsersService } from 'src/app/core/services/users/users.service';

@Component({
  selector: 'app-client-info',
  templateUrl: './client-info.component.html',
  styleUrls: ['./client-info.component.scss']
})
export class ClientInfoComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  tab1: boolean = true;
  tab2: boolean = false;
  getAllOrg: any;
  demo: any;
  // deloitte_id="4FB98BA9-1077-4170-9071-2A4AD0DF84AC";
  serchAllOrg: any;
  dataSource = new MatTableDataSource([]); 
  deloitteData: any;
  constructor(
    private loader:LoaderService,
    private _sanitizer: DomSanitizer,
    private router: Router,
    private userService:UsersService,
  ) { }

  ngOnInit(): void {
    this.getAllOrganization()
  }
  changetab(id: any) {
    if (id == 1) {
      this.tab1 = true;
      this.tab2 = false;
    }
    else  {
      console.log("tab2");
      this.tab1 = false;
      this.tab2 = true;
  console.log('serchAllOrg', this.serchAllOrg)
  console.log('getAllOrg', this.getAllOrg)

      
    }
  }

  getAllOrganization(){
    this.loader.show()
    this.userService. getAllOrganization().subscribe((res: any) => {
      this.getAllOrg = res.responseData;
      this.getAllOrg.forEach((item:any) => {
        if (item.organizationName == 'Deloitte' || item.organizationName == 'deloitte') {
          this.deloitteData = item;
          console.log(this.deloitteData);
          
        }
      })
      this.serchAllOrg = res.responseData;
      this.getAllOrg.forEach((ele:any)=>{
        ele.demo = this._sanitizer.bypassSecurityTrustResourceUrl(
          'data:image/png;base64,' + ele.imageDataresponse
          );
        })
        console.log(this.getAllOrg);
        this.loader.hide();
        this.setDataSource();
        this.pageChangedExtr();
    });

  }

 setDataSource(){
  if(this.paginator) {
  this.paginator.pageIndex = 0;
  this.paginator.length = this.serchAllOrg?.length ;
  }
  this.dataSource = new MatTableDataSource(this.serchAllOrg);
  this.dataSource.paginator = this.paginator;
 }  
 
 
details(data:any){
  console.log("org",data);
  this.router.navigate(['user/admin1/client-info2'
  ,{orgId: data}]);
 }

//  deloitedetails(){
 // let data = this.deloitte_id;
  //console.log("org",data);
//   this.router.navigate(['user/admin1/client-info2'
//   ,{orgId: this.deloitte_id}]);
//  }

 applyFilter(event: any) {
  this.serchAllOrg = this.getAllOrg.filter((user: any) => this.containsValue(user, event.target.value.trim().toLowerCase()));
  console.log('serchAllOrg', this.serchAllOrg)
  this.setDataSource();
  if(event?.target?.value?.trim() == "") this.pageChangedExtr();
  // this.usersSearch = new MatTableDataSource<any>(res.responseData);
  // this.leadSearch.paginator = this.paginator;
  // this.leadSearch.sort = this.sort;
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
 pageChangedExtr(event?: any) {
   const pageIndex = event ? event?.pageIndex : 0;
   const pageSize = event ?  event?.pageSize : 10;
   const length = this.getAllOrg?.length ;
   let noOfPagesAvailable =  Math.ceil(length/ pageSize);
   let noOfRowsPerPage: any = [];
   let startIndex = 0;
   let endIndex = pageSize;
   for(let page = 0 ; page < noOfPagesAvailable; page++) {
    let pageRecords = this.getAllOrg?.slice(startIndex,endIndex);
    noOfRowsPerPage?.push(pageRecords);
    startIndex = endIndex ;
    endIndex = endIndex + pageSize;
    }
   this.serchAllOrg = noOfRowsPerPage[pageIndex];
 }
 
}



