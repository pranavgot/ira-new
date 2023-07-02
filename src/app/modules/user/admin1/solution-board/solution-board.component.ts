import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { MatTabChangeEvent } from '@angular/material/tabs';

@Component({
  selector: 'app-solution-board',
  templateUrl: './solution-board.component.html',
  styleUrls: ['./solution-board.component.scss']
})
export class SolutionBoardComponent implements OnInit {

  //pageView:string ="selectIndustry";
  
  selectedIndexISP: number = 0;


  links = [{name:'Select Industry', isActive: true, selectedIndex:0},
  {name:'Select Sector', isActive: false, selectedIndex:1},
  {name:'Add Process', isActive: false, selectedIndex:2}
  
  ]
  activeLink = this.links[0];

  createSolutionDetails : any[] = [];
  
  constructor() { }

  ngOnInit(): void {
    //this.createSolutionDetails = JSON.parse(localStorage.getItem('cSDetails')!);

  }

  selectISP( selectedIndex:any, value:string){
    //this.activeLink = this.links[selectedIndex];
    // this.links.forEach((item:any)=>{
    //   if(item.selectedIndex < selectedIndex){
    //     item.isActive = true;
    //   }
    // })
    this.selectedIndexISP = selectedIndex;
    //let indSec = {'name':value};
    //this.createSolutionDetails.push(indSec)
    //localStorage.setItem('cSDetails',JSON.stringify(this.createSolutionDetails));
    console.log(this.createSolutionDetails)
  }

  tabChanged(tabChangeEvent: any) {
    this.selectedIndexISP = tabChangeEvent.index;
   //localStorage.removeItem('cSDetails');
  }

  

}
