import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.scss']
})
export class UserManagementComponent implements OnInit {

  addEventForm: any;
  addEventIndex: any;
  checked: boolean = true;

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
    //    data.dateofProceeding = this.addEventForm?.value.dateofProceeding,
    //    data.dueDate = this.addEventForm?.value.dueDate,
    //    data.gistProceeding = this.addEventForm?.value.gistProceeding,
    //    data.remarks = this.addEventForm?.value.remarks,
    //    data.userProceedingDate = this.datepipe.transform(this.addEventForm?.value.dateofProceeding, 'dd/MM/yyyy');
    //    data.userdueDate = this.datepipe.transform(this.addEventForm?.value.dueDate, 'dd/MM/yyyy');
    //  if (this.addEventIndex != -1) {
    //    this.addEventProceedingData.forEach((i: any, index: any) => {
    //      console.log(index, i);
    //      if (index == this.addEventIndex) {
    //          i.dateofProceeding = this.addEventForm?.value.dateofProceeding,
    //          i.dueDate = this.addEventForm?.value.dueDate,
    //          i.gistProceeding = this.addEventForm?.value.gistProceeding,
    //          i.remarks = this.addEventForm?.value.remarks,
    //          i.userProceedingDate = this.datepipe.transform(this.addEventForm?.value.dateofProceeding, 'dd/MM/yyyy');
    //          i.userdueDate = this.datepipe.transform(this.addEventForm?.value.dueDate, 'dd/MM/yyyy');
    //      }
    //    })
    //    this.addEventIndex = -1;
    //  } else {
    //    this.addEventProceedingData.push(data);
    //  }
    //  this.AddEventProceeding = false;   
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
