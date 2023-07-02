import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss']
})
export class NotificationsComponent implements OnInit {

  notify: any=[
    {data:'adsfghjghfgdsdfghjhgfda',icon:'dds-icon_close__l__stroke',status:'true',id:1},
    {data:'adsfghjghfgdsdfghjhgfda',icon:'dds-icon_close__l__stroke',status:'true',id:2},
    {data:'adsfghjghfgdsdfghjhgfda',icon:'dds-icon_close__l__stroke',status:'true',id:3},
    {data:'adsfghjghfgdsdfghjhgfda',icon:'dds-icon_close__l__stroke',status:'true',id:4},
    {data:'adsfghjghfgdsdfghjhgfda',icon:'dds-icon_close__l__stroke',status:'true',id:5},
    {data:'adsfghjghfgdsdfghjhgfda',icon:'dds-icon_close__l__stroke',status:'true',id:6},
    
  ];

  constructor() { }

  ngOnInit(): void {
  }
  close(id:any){
    console.log(id);
    
    this.notify.forEach((element: any) => {
      if(id==element.id)
      {
        element.status = false;
      }
    });
  }
}