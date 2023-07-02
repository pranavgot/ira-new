import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { MastersService } from 'src/app/core/services/masters/masters.service';

@Component({
  selector: 'app-project-overview',
  templateUrl: './project-overview.component.html',
  styleUrls: ['./project-overview.component.scss']
})
export class ProjectOverviewComponent implements OnInit {
  // id="B7007E8C-6142-4EA2-AD7B-C1B252F807B8"
  toppings = new FormControl('');
  toppingList: string[] = ['Extra cheese', 'Mushroom', 'Onion', 'Pepperoni', 'Sausage', 'Tomato'];
  projectdetails: any;

  constructor(
    private route: ActivatedRoute,
    private Master: MastersService,
  ) { }

  ngOnInit(): void {
    // this.getAllProjectOverview()
  }
  AddEventProceeding: boolean | undefined;
  projectCompleyed() {
    // this.addEventForm?.reset();
    this.AddEventProceeding = true
  }
  
  // getAllProjectOverview(){
  //   let data = this.id;
  //   this.Master.getAllProjectOverview(data).subscribe((res: any) => {
  //     this.projectdetails = res.responseData;
  //     console.log("project detail",this.projectdetails);
  //  })
  // }
}
