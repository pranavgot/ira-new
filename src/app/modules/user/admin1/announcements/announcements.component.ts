import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import { UsersService } from 'src/app/core/services/users/users.service';
import { ToastComponent } from '../../all-common/toast/toast.component';

@Component({
  selector: 'app-announcements',
  templateUrl: './announcements.component.html',
  styleUrls: ['./announcements.component.scss']
})
export class AnnouncementsComponent implements OnInit {
  announcement: any;
  announcementSearch: any;
  displayedColumns: any;

  constructor(
    private UserService: UsersService,
    private router: Router,
    private toast: ToastComponent,
  ) { }

  ngOnInit(): void {
    this.getAllAnnouncement();
    this.displayedColumns=['no','name','description','time','action']
  }
  getAllAnnouncement(){
    this.UserService.getAllAnnouncement().subscribe((res: any) => {
      this.announcement = res.responseData;
     
      // todayString : string = new Date().toDateString();
      console.log(this.announcement);
      this.announcementSearch = new MatTableDataSource<any> (res.responseData);
      // this.serviceSearch.paginator = this.paginator;
      // this.serviceSearch.sort = this.sort;
      // this.getAllService1 = res.responseData[0].serviceRequestDetailResponseList
      // console.log(this.getAllService1);
      
    })
  }

  viewAnnouncement(annu: any) {
    this.router.navigate(["/user/admin1/add-announcements", { id: annu.announcementId }])
  }

}
