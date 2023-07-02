import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.scss']
})
export class ScheduleComponent implements OnInit {
  tab1: boolean = true;
  tab2: boolean = false;
  subtab1: boolean = true;
  subtab2: boolean = false;
  subtab3: boolean = false;
  constructor() { }

  ngOnInit(): void {
  }
  changetab(id:any){
    if(id == 1){
      this.tab1 = true;
      this.tab2 = false;
    }
    else {
      this.tab1 = false;
      this.tab2 = true;
    }
  }
  changesubtab(id:any){
    if(id == 1){
      this.subtab1 = true;
      this.subtab2 = false;
      this.subtab3 = false;
    }
    else if(id == 2){
      this.subtab1 = false;
      this.subtab2 = true;
      this.subtab3 = false;
    }
    else{
      this.subtab1 = false;
      this.subtab2 = false;
      this.subtab3 = true;
    }
  }
}
