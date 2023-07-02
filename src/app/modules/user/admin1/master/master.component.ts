import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatAccordion } from '@angular/material/expansion';
import { Router } from '@angular/router';
import { LoaderService } from 'src/app/core/services/loader.service';
import { MastersService } from 'src/app/core/services/masters/masters.service';
// import { ToastComponent } from '../../all-common/toast/toast.component';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { PopupService } from 'src/app/core/services/popup.service';
import { MAT_SELECT_CONFIG, MatSelectConfig } from '@angular/material/select';



@Component({
  selector: 'app-master',
  templateUrl: './master.component.html',
  styleUrls: ['./master.component.scss'],
  viewProviders: [
    {
        provide: MAT_SELECT_CONFIG,
        useValue: {
            overlayPanelClass: "paginator-panel-class"
        } as MatSelectConfig
    }
]
})
export class MasterComponent implements OnInit {
  tab1: boolean = true;
  tab2: boolean = false;
  tab3: boolean = false;
  addEventForm: any;
  addEventIndex: any;
  addEventForm1: any;
  addEventIndex1: any;
  addEventForm2: any;
  addEventIndex2: any;
  showModal: boolean = false;
  AddButton: boolean = false;

  panelOpenStateOne = true;
  panelOpenStateTwo = true;
  panelOpenStateThree = true;
  panelOpenStateFour = true;
  panelOpenStateFive = true;
  panelOpenStateSix = true;

  lengthIndus: any = 2;
  lengthSector: any = 2;
  lengthProcess: any = 2;
  indusData: any;
  sectData: any;
  procData: any;

  industryForm!: FormGroup;
  sectorForm!: FormGroup;
  processForm!: FormGroup;
  editIndustryid: any;
  editSectorid: any;
  industList: any;
  industEdit: any = [];
  processEdit: any;
  industRes: any;
  procEditId: any;
  submit: boolean = false;
  submitt: boolean = false;
  submited: boolean = false;
  indusSearch: any;

  @ViewChild('industryPaginator', {static: false}) set industryPaginator(value: MatPaginator) {
    if (this.indusSearch){
      this.indusSearch.paginator = value;
      console.log(value);
      
    }
  }
  @ViewChild('sectorPaginator', {static: false}) set sectorPaginator(value: MatPaginator) {
    if (this.sectSearch){
      this.sectSearch.paginator = value;
    }
  }

  @ViewChild('processPaginator', {static: false}) set processPaginator(value: MatPaginator) {
    if (this.procSearch){
      this.procSearch.paginator = value;
    }
  }

  // @ViewChild(MatPaginator) paginator1!: MatPaginator;
  // @ViewChild(MatPaginator) paginator2!: MatPaginator;
  // @ViewChild(MatPaginator) paginator3!: MatPaginator;

  @ViewChild(MatSort) sort!: MatSort;
  sectSearch: any;
  procSearch: any;
  user: any;

  constructor(
    private Master: MastersService,
    // private toast: ToastComponent,
    private formBuilder: FormBuilder,
    private router:Router,
    private popup:PopupService,
    private loader:LoaderService
  ) { }

  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem("userInfo") || '{}')
    this.industryForm = this.formBuilder.group({
      name: ['', Validators.required],
    })
    this.sectorForm = this.formBuilder.group({
      name: ['', Validators.required],
      industryId: ['', Validators.required],
    })
    this.processForm = this.formBuilder.group({
      name: ['', Validators.required],
      // industrySector: []
    })
    this.getAllIndustry()
    this.getAllSector()
    this.getAllProcess()
  }

  @ViewChild(MatAccordion) accordion: MatAccordion | undefined;

  AddEventProceeding: boolean | undefined;
  Eventproceedings() {
    this.addEventForm?.reset();
    this.AddEventProceeding = true
  }
  AddEventProceeding1: boolean | undefined;
  Eventproceedings1() {
    this.addEventForm?.reset();
    this.AddEventProceeding = true
  }
  AddEventProceeding2: boolean | undefined;
  Eventproceedings2() {
    this.addEventForm?.reset();
    this.AddEventProceeding = true
  }


  addEventFormSubmit1() {
    let data: any = {}

  }
  addEventFormSubmit2() {
    let data: any = {}

  }

  addIndustry(e: any) {
    this.AddEventProceeding = true;
    this.addEventIndex = e;
    //  this.addEventForm?.patchValue({
    //    dateofProceeding: pop.dateofProceeding,
    //    dueDate: .dueDate,
    //    gistProceeding: pop.gistProceeding,
    //    remarks: pop.remarks,
    //  })
  }
  addSector(e: any) {
    this.AddEventProceeding1 = true;
    this.addEventIndex = e;
    //  this.addEventForm?.patchValue({
    //    dateofProceeding: pop.dateofProceeding,
    //    dueDate: .dueDate,
    //    gistProceeding: pop.gistProceeding,
    //    remarks: pop.remarks,
    //  })
  }
  addProcess(e: any) {
    // this.router.navigate(['/','add-process']);
    // goPlaces() {
      localStorage.removeItem('process')
      this.router.navigateByUrl('/user/admin1/solutionboard/add-process');
    // }
    // this.AddEventProceeding2 = true;
    // this.addEventIndex = e;
    //  this.addEventForm?.patchValue({
    //    dateofProceeding: pop.dateofProceeding,
    //    dueDate: .dueDate,
    //    gistProceeding: pop.gistProceeding,
    //    remarks: pop.remarks,
    //  })
  }



  editIndustry(e: any, data: any) {
    this.AddEventProceeding = true;
    this.addEventIndex = e;
    this.editIndustryid = data.industryId
    this.industryForm?.patchValue({
      name: data.industryName
    })
  }
  editSector(e: any, data: any) {
    this.AddEventProceeding1 = true;
    this.addEventIndex = e;
    this.industEdit = [];
    let sect: any;
    let sectindus: any;
    this.Master.getSectorByID(data.sectorId).subscribe((res: any) => {
      sectindus = []
      sect = res.responseData;
      sect.industyResponseList.forEach((element: any) => {
        this.indusData.forEach((ele: any) => {
          if (element.industryId === ele.industryId) {
            sectindus.push(ele)
            // this.industEdit.push(element)
          }
        });
      });
      this.industEdit = sectindus
      // console.log(sectindus);
      this.editSectorid = data.sectorId
      this.sectorForm.patchValue({
        name: data.sectorName,
        industryId: sectindus
      })
      // this.sectorForm.controls.industryId.setValue(sect.industyResponseList);

    })
  }
  editProcess(e: any, data: any) {
    this.AddEventProceeding2 = true;
    this.addEventIndex = e;
    this.procEditId = data.processId;
    this.Master.getProcessByID(data.processId).subscribe((res: any) => {
      console.log(res);
      this.processEdit = res.responseData;
      // this.AddEventProceeding2 = false;
      this.industRes = res.responseData.industrySectorResponse
      res.responseData.industrySectorResponse.forEach((element: any) => {
        this.indusData.forEach((ele: any) => {
          // console.log(ele);
          // ele.select=0;
          // let count = 0;
          if (element.industryResponse.industryId === ele.industryId) {
            ele.sectorList.forEach((men: any) => {
              // console.log(ele.sectorList);
              if (men.sectorId === element.sectorResponse.sectorId) {
                men.selected = true;
                // console.log(men);
              }
            });
          }

        });

      });
      this.indusData.forEach((ele: any) => {
        let count = 0;
        ele.sectorList.forEach((men: any) => {
          if (men.selected)
            count = count + 1;
        })
        console.log(count);
        ele.select = count
      })
      console.log(this.indusData);

    })

    //   [
    //     {
    //         "industryId": "2ccabf3c-e5e1-4b6c-bd84-1632f087711a",
    //         "industryName": "Life Sciences & Health Care",
    //         "sectorList": [
    //             {
    //                 "sectorId": "8ff43848-ac68-42a2-8de2-17fce2abd687",
    //                 "sectorName": "Life Sciences",
    //                 "industyResponseList": [],
    //                 "processReponseList": []
    //             },

    // ]
    //   {
    //     "statusCode": 200,
    //     "statusMessage": "Active Process Found",
    //     "responseTime": 7,
    //     "responseData": {
    //         "processId": "d2c39877-6632-47f5-954c-5737b40d3dd4",
    //         "processName": "Process1",
    //         "industrySectorResponse": [
    //             {
    //                 "industryResponse": {
    //                     "industryId": "2ccabf3c-e5e1-4b6c-bd84-1632f087711a",
    //                     "industryName": "Life Sciences & Health Care",
    //                     "sectorList": []
    //                 },
    //                 "sectorResponse": {
    //                     "sectorId": "8ff43848-ac68-42a2-8de2-17fce2abd687",
    //                     "sectorName": "Life Sciences",
    //                     "industyResponseList": [],
    //                     "processReponseList": []
    //                 },
    //                 "flag": true,
    //                 "industry_sector_map_ID": "30d384e7-5501-47b5-a506-2f21d7704337"
    //             }
    //         ]
    //     }
    // }


    this.processForm.patchValue({
      name: data.processName,
      // industryId: sectindus
    })
    this.processForm.controls.name.disable()
    //  this.addEventForm?.patchValue({
    //    dateofProceeding: pop.dateofProceeding,
    //    dueDate: .dueDate,
    //    gistProceeding: pop.gistProceeding,
    //    remarks: pop.remarks,
    //  })

  }
  CloseModal() {
    this.AddEventProceeding = false;
    this.AddEventProceeding1 = false;
    this.AddEventProceeding2 = false;
    this.submited = false;
    this.submitt = false;
    this.industryForm.reset();
    this.sectorForm.reset();
  }
  changetab(id: any) {
    if (id == 1) {
      this.tab1 = true;
      this.tab2 = false;
      this.tab3 = false;
    }
    else if (id == 2) {
      this.tab1 = false;
      this.tab2 = true;
      this.tab3 = false;
    }
    else {
      this.tab1 = false;
      this.tab2 = false;
      this.tab3 = true;
    }

  }
  options() {
    console.log("nilam");
    this.AddButton = true;
  }
  alert() {
    alert("Deleted Successfully!");
  }
  mouseLeave() {
    this.AddButton = false;
  }

  getAllIndustry() {
    this.Master.getAllIndustry().subscribe((res: any) => {
      // console.log(res);
      this.indusData = res.responseData;
      this.indusSearch = res.responseData;
      this.indusSearch.paginator = this.industryPaginator;
      this.indusSearch.sort = this.sort;
      this.lengthIndus = res.responseData.length;
      console.log(this.indusSearch, this.lengthIndus);

    })
  }
  getAllSector() {
    this.Master.getAllSectors().subscribe((res: any) => {
      // console.log(res);
      this.sectData = res.responseData;
      this.sectSearch = res.responseData;
      this.lengthSector = res.responseData.length;
      this.sectSearch.paginator = this.sectorPaginator;
      this.sectSearch.sort = this.sort;
    })
  }
  getAllProcess() {
    this.loader.show()
    this.Master.getAllProcess().subscribe((res: any) => {
      // console.log(res);
      this.procData = res.responseData;
      this.procSearch = res.responseData;
      this.procSearch.paginator = this.processPaginator;
      this.procSearch.sort = this.sort;
      this.lengthProcess = res.responseData.length;
      this.loader.hide()
    })
  }

  IndustSubmit() {
    this.submited = true
    if (this.industryForm.invalid) {
      // console.log(this.industryForm);
      // this.toast.error({ title: 'Error', message: "Enter All the Required Fields" });
      this.popup.open(false,"Enter All the Required Fields")
      return;
    }
    let data
    if (this.editIndustryid) {
      data =
      {
        type: 2,
        // flag: true,
        userId: this.user.userId,
        industryId: this.editIndustryid,
        industryName: this.industryForm.value.name
      }
      // this.Master.ApproveIndustry(data).subscribe((res: any) => {
      //   // console.log(res);
      //   this.getAllIndustry()
      //   this.CloseModal()
      //   this.editIndustryid='';
      //   this.industryForm.reset();
      // })
      // BE399637-4C65-461B-9795-717846B3E6AD
    }
    else {
      data =
      {
        type: 1,
        userId: this.user.userId,
        // "flag": true,
        // "industryId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
        industryName: this.industryForm.value.name
      }
    }
    this.Master.addEditIndustry(data).subscribe((res: any) => {
      // console.log(res);
      this.getAllIndustry()
      this.CloseModal()
      this.editIndustryid = '';
      this.industryForm.reset();
      this.AddEventProceeding = false;
      this.popup.open(true,'Saved successfully!');
      // this.toast.success({ title: 'Success', message: "Saved successfully!" });
      this.submited = false;
    }
    ,(err:any)=>{
      this.popup.open(false,'Industry already exist');
        // this.toast.error({ title: 'Error', message: "Industry already exist" });
        this.submited = false;
      }
    )
  }

  SectorSubmit() {
    this.submitt = true
    if (this.sectorForm.invalid) {
      this.popup.open(false,'Enter All the Required Fields');
      // this.toast.error({ title: 'Error', message: "Enter All the Required Fields" });
      return;
    }
    let data
    let nf = false
    this.industList = []
    console.log(this.sectorForm);

    this.sectorForm.value.industryId.forEach((element: any) => {
      let list = {
        industryId: '',
        industryName: '',
        flag: false
      }
      list.industryId = element.industryId
      list.industryName = element.industryName
      list.flag = true
      this.industList.push(list)

    })
    //   let list = {
    //     industryId: '',
    //     industryName: '',
    //     flag: false
    //   }
    //   this.indusData.forEach((ele: any) => {
    //     if (element.industryId === ele.industryId) {
    //       // nf = true
    //       list.industryId = ele.industryId
    //       list.industryName = ele.industryName
    //       list.flag = true
    //     }
    //     // else {
    //     //   nf = false
    //     //   list.industryId = ele.industryId
    //     //   list.industryName = ele.industryName
    //     //   list.flag = false
    //     // }
    //     this.industList.push(list)
    //   });
    //   // if (nf == false) {
    //   //   list = {
    //   //     industryId: '',
    //   //     industryName: '',
    //   //     flag: false
    //   //   }
    //   //   list.industryId = element.industryId
    //   //   list.industryName = element.industryName
    //   //   list.flag = true
    //   //   this.industList.push(list)
    //   // }
    // });
    // console.log(this.industList, this.sectorForm.value.industryId);
     this.industEdit?.forEach((item: any) =>  {
      if(!this.industList?.some((indusData: any) => indusData.industryId == item.industryId )){
        item.flag = false;
        this.industList?.push(item);
      }
     });
    if (this.editSectorid) {
      data =
      {
        type: 2,
        userId: this.user.userId,
        sectorId: this.editSectorid,
        sectorName: this.sectorForm.value.name,
        listIndustry: this.industList
      }
      // this.Master.ApproveSector(data).subscribe((res: any) => {
      //   console.log(res);
      //   this.getAllSector()
      //   this.CloseModal()
      // })
    }
    else {
      data =
      {
        type: 1,
        userId: this.user.userId,
        sectorName: this.sectorForm.value.name,
        listIndustry: this.industList
      }
    }
    this.Master.addEditSector(data).subscribe((res: any) => {
      console.log(res);
      this.getAllSector()
      this.getAllIndustry()

      this.CloseModal()
      this.popup.open(true,'Saved successfully!');
      // this.toast.success({ title: 'Success', message: "Saved successfully!" });
    },(err:any)=>{
      this.popup.open(false,'Sector Name already exist');
      // this.toast.error({ title: 'Error', message: "Sector Name already exist" });
    }
    )
  }

  ProcessSubmit() {
    this.submit = true
    if (this.processForm.invalid) {
      // console.log(this.processForm);
      this.popup.open(false,'Enter All the Required Fields');
      // this.toast.error({ title: 'Error', message: "Enter All the Required Fields" });
      return;
    }
    console.log(this.processForm, this.processEdit);
    let list: any = []
    this.indusData.forEach((ele: any) => {
      // if(ele.selected>0){
      ele.sectorList.forEach((men: any) => {

        if (men.selected) {
          // console.log(men);
          // men.selected=!men.selected;
          list.push({
            sectorId: men.sectorId,
            industryId: ele.industryId,
            flag: true
          })
        }
        else if (!men.selected) {
          this.industRes.forEach((element: any) => {
            if (element.industryResponse.industryId == ele.industryId) {
              if (element.sectorResponse.sectorId == men.sectorId) {
                list.push({
                  sectorId: men.sectorId,
                  industryId: ele.industryId,
                  flag: false
                })
              }
            }
          });
          // this.processEdit..industryResponse.industryId
          // men.selected=false;
        }
      });
      // }
    });
    let data = {
      processId: this.processEdit.processId,
      processName: this.processForm.value.name,
      industrySectorMapDto: list,
      type: 2,
      userId: this.user.userId,
    }
    // console.log(data);
    let formData: FormData = new FormData();
    formData.append('ProcessRequest', JSON.stringify(data))
    // formData.append('processName', data.processName)
    // formData.append('industrySectorMapDto', data.industrySectorMapDto)
    // formData.append('type', data.type.toString())
    // formData.append('userId', data.userId)
    this.Master.PostaddorEditProcess(formData).subscribe((res: any) => {
      console.log(res);
      this.AddEventProceeding2 = false;
      this.popup.open(true,'Saved successfully!');
      // this.toast.success({ title: 'Success', message: "Saved successfully!" });
    }
    ,(err:any)=>{
      this.popup.open(false,'Process Name already exist');
      // this.toast.error({ title: 'Error', message: "Process Name already exist" });
    } 
    )   
  }

  onCheck(indus: any, sect: any) {
    console.log(indus, sect);
    this.indusData.forEach((ele: any) => {
      if (indus.industryId === ele.industryId) {
        ele.sectorList.forEach((men: any) => {
          if (men.sectorId === sect.sectorId) {
            men.selected = !men.selected;
            if (men.selected) ele.select++
            else if (!men.selected) ele.select--
          }
        });
      }
    });
    console.log(this.indusData);

  }

  applyFilter(event: any) {
    this.indusSearch = this.indusData.filter((user: any) => this.containsValue(user, event.target.value.trim().toLowerCase()));
    this.indusSearch.paginator = this.industryPaginator;
    this.indusSearch.sort = this.sort;
  }
  containsValue(userObj: any, searchValue: any) {
    return Object.values(userObj).reduce((prev, cur: any) => {
      if (cur != null) {
        cur = cur.toString().trim().toLowerCase();
      }
      return prev || cur?.indexOf(searchValue) > -1;
    }, false)
  }

  applyFilterSector(event: any) {
    this.sectSearch = this.sectData.filter((user: any) => this.containsValue(user, event.target.value.trim().toLowerCase()));
   this.sectSearch.paginator = this.sectorPaginator;
    this.sectSearch.sort = this.sort;
  }

  applyFilterProcess(event: any) {
    this.procSearch = this.procData.filter((user: any) => this.containsValue(user, event.target.value.trim().toLowerCase()));
    this.procSearch.paginator = this.processPaginator;
    this.procSearch.sort = this.sort;
  }
  
}