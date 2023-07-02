import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MastersService } from 'src/app/core/services/masters/masters.service';
import { PopupService } from 'src/app/core/services/popup.service';


@Component({
  selector: 'app-explore-solutions',
  templateUrl: './explore-solutions.component.html',
  styleUrls: ['./explore-solutions.component.scss']
})
export class ExploreSolutionsComponent implements OnInit {
  showtable: boolean = false;
  indusData: any;
  sectData: any;
  procData: any;
  process: any;
  indId: any;
  exploreForm!: FormGroup;
  submited: boolean = false
  // formbuilder: any;
  hidebtn: boolean = false;
  searchindusData: any;
  searchsectData: any;
  searchprocData: any;

  constructor(
    private Master: MastersService,
    private formbuilder:FormBuilder,
    private popup: PopupService,
  ) { }

  ngOnInit(): void {
    this.exploreForm = this.formbuilder.group({
      industryId: [''],
      sectorId: [''],
      processId: [''],
    })
    this.getAllIndustry()
    // this.getAllSector()
    // this.getAllProcess()
    // this.getBySectorId(id,id1)
  }

  getAllIndustry() {
    this.Master.getAllIndustry().subscribe((res: any) => {
      console.log('industry', res);
      this.indusData = res.responseData;
      this.searchindusData = res.responseData;
      // this.lengthIndus = res.responseData.length;
      // console.log(this.indusData, this.lengthIndus);

    })
  }
  // getAllSector() {
  //   this.Master.getAllSectors().subscribe((res: any) => {
  //     console.log('sector', res);
  //     this.sectData = res.responseData;
  //     // this.lengthSector = res.responseData.length;
  //     // this.getBySectorId(indId, SectId)

  //   })
  // }
  // getAllProcess() {
  //   this.Master.getAllProcess().subscribe((res: any) => {
  //     console.log('process', res);
  //     this.procData = res.responseData;
  //     // this.lengthProcess = res.responseData.length;
  //   })
  // }
  getBySectorId(id: any, id1: any) {
    this.Master.getBySectorId(id, id1).subscribe((res: any) => {
      console.log('process list', res);
      this.procData = res.responseData.processReponseList;
      this.searchprocData = res.responseData.processReponseList;
      this.process=res.responseData.processReponseList;
      // this.lengthProcess = res.responseData.length;
    })
  }
  selectionChange(event: any, data: any) {
    if (event.isUserInput)
      console.log(data);
    this.sectData = data.sectorList;
    this.searchsectData = data.sectorList;
    this.indId=data.industryId
  }

  selectionChange1(event: any, data: any) {
    if (event.isUserInput)
      console.log(data);
      this.getBySectorId(this.indId, data.sectorId)

    // this.procData = data.processList;
  }
  showlist(event:any, data:any){
    this.submited = true
    if (this.exploreForm.invalid) {
      // console.log(this.signupForm);
      this.popup.open(false, "Enter All the Required Fields");
      // this.toast.error({ title: 'Error', message: "Enter all the required fields" });
      return;
    }
    this.process=[];
    this.hidebtn=true;
    this.process.push(data)
  }
  clearAll(){
    this.showtable=false;
    this.exploreForm.reset();
    window.location.reload();
  }
  submitList(){
    this.showtable= true;
    this.exploreForm.controls['industryId'].disable();
    this.exploreForm.controls['sectorId'].disable();
    this.exploreForm.controls['processId'].disable();
  }

  applyFilter(event: any) {
    this.searchindusData = this.indusData.filter((user: any) =>
      this.containsValue(user, event.target.value.trim().toLowerCase())
    );
  }
  applyFilter1(event: any) {
    this.searchsectData = this.sectData.filter((user: any) =>
      this.containsValue(user, event.target.value.trim().toLowerCase())
    );
  }
  applyFilter2(event: any) {
    this.searchprocData = this.procData.filter((user: any) =>
      this.containsValue(user, event.target.value.trim().toLowerCase())
    );
  }
  containsValue(userObj: any, searchValue: any) {
    return Object.values(userObj).reduce((prev, cur: any) => {
      if (cur != null) {
        cur = cur.toString().trim().toLowerCase();
        // console.log(cur);
      }
      return prev || cur?.indexOf(searchValue) > -1;
    }, false);
  }
}
