import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  tab: boolean = true;
  tab1: boolean = false;
  tab2: boolean = false;
  tab3: boolean = false;
  tab4: boolean = false;
  tab5_1: boolean = false;
  tab5_2: boolean = false;

  constructor() { }

  ngOnInit(): void {
  }
  changetab(id: any) {
    if (id == 1) {
      this.tab = false;
      this.tab1 = true;
      this.tab2 = false;
      this.tab3 = false;
      this.tab4 = false;
      this.tab5_1 = false;
      this.tab5_2 = false;
    }
    else if (id == 2) {
      this.tab = false;
      this.tab1 = false;
      this.tab2 = true;
      this.tab3 = false;
      this.tab4 = false;
      this.tab5_1 = false;
      this.tab5_2 = false;
    }
    else if (id == 3) {
      this.tab = false;
      this.tab1 = false;
      this.tab2 = false;
      this.tab3 = true;
      this.tab4 = false;
      this.tab5_1 = false;
      this.tab5_2 = false;
    }
    else if (id == 4) {
      this.tab = false;
      this.tab1 = false;
      this.tab2 = false;
      this.tab3 = false;
      this.tab4 = true;
      this.tab5_1 = false;
      this.tab5_2 = false;
    }
    else if (id == 5) {
      this.tab = false;
      this.tab1 = false;
      this.tab2 = false;
      this.tab3 = false;
      this.tab4 = false;
      this.tab5_1 = true;
      this.tab5_2 = false;
    }
    else if (id == 6) {
      this.tab = false;
      this.tab1 = false;
      this.tab2 = false;
      this.tab3 = false;
      this.tab4 = false;
      this.tab5_1 = false;
      this.tab5_2 = true;
    }
  }
}
