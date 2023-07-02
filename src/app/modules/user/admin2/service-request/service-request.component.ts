import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { UsersService } from 'src/app/core/services/users/users.service';

@Component({
  selector: 'app-service-request',
  templateUrl: './service-request.component.html',
  styleUrls: ['./service-request.component.scss']
})
export class ServiceRequestComponent implements OnInit {
  addEventForm: any;
  addEventIndex: any;
  serviceForm: any;
  formBuilder: any;
  subs: any;
  // serviceForm!: FormGroup;

  constructor(
    private Users_service: UsersService,
  ) {}
    ngOnInit(): void {
      // this.serviceForm = this.formBuilder.group({
      //   name: []
      // })
      this.getSubscription()
  }

  AddEventProceeding: boolean | undefined;
  Eventproceedings() {
     this.addEventForm?.reset();
     this.AddEventProceeding = true
   }
 
  addEventFormSubmit() {
     let data: any = {}
       
   }
   getSubscription(){
    this.Users_service.getSubscription().subscribe((res: any) => {
      console.log("mm",res);
      this.subs = res.responseData;
    })
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
