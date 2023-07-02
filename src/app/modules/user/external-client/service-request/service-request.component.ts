import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-service-request',
  templateUrl: './service-request.component.html',
  styleUrls: ['./service-request.component.scss']
})
export class ServiceRequestComponent implements OnInit {
  addEventForm: any;
  addEventIndex: any;

  constructor() {}
    ngOnInit(): void {
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
}
