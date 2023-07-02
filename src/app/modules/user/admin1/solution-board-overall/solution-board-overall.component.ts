import { Component, OnInit, Renderer2, ViewChild } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, FormArray, FormBuilder, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { MatOption } from '@angular/material/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin, Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { LoaderService } from 'src/app/core/services/loader.service';
import { PopupService } from 'src/app/core/services/popup.service';
import { SolutionService } from 'src/app/core/services/solution/solution.service';
import { ToastComponent } from '../../all-common/toast/toast.component';
import { SearchPipe } from '../../search.pipe';

@Component({
  selector: 'app-solution-board-overall',
  templateUrl: './solution-board-overall.component.html',
  styleUrls: ['./solution-board-overall.component.scss']
})
export class SolutionBoardOverallComponent implements OnInit {
  enableAddBtn: boolean = false;
  submited: boolean = false;
  appendForm!: FormGroup;
  submit: boolean = false;
  joinForm!: FormGroup;
  isOverride: boolean = false;
  fileListt: Array<any> = []
  sortedList: any[] = [];
  sortedCheckedList: any[] = [];
  mergeCheckedList: any[] = [];
  appendUnchechedList: any[] = [];
  disableContinue = false;
  disableRelButton = true;

  enableDataSetPopUp: boolean = false;
  datasetDetailsList: any[] = [];
  //, opearator :''
  createExpressionList: any[] = [];
  // createExpressionList = [{ fieldName: '', expression: '', isEdit: false, columnType: '', where: '', or: '', groupBy: '', value: '', signOperator: '', whereList: [{ operator: '', signOperator: '', value: '' }] }];

  filesList: any[] = [];
  columnsArr: any[] = [];
  showUploadFilesTab: boolean = false;
  masterSelected: boolean = false;
  tabs = [{ id: 0, value: 'Upload Files', isActive: true, routeValue: 'upload-files' },
  { id: 1, value: 'Target FIles', isActive: false, routeValue: 'target-files' },
  { id: 2, value: 'Append', isActive: false, routeValue: 'append' },
  { id: 3, value: 'Join', isActive: false, routeValue: 'join' },
  { id: 4, value: 'Data Modelling', isActive: false, routeValue: 'data-modeling' }]
  enableAppendNamePopup: boolean = false;
  enableMergeNamePopup: boolean = false;
  submitted: boolean = false;
  submittedErrorMsg!: string;
  targetFileRowEdit: number = -1;


  selectedM_A_S: any[] = []; //tab4
  showTargetFilePopup: boolean = false;//ta4

  enableOverRideConfirmPopup: boolean = false

  cursorPosition: number = 0;
  appendNameControl: FormControl = new FormControl(null);
  invoiceForm1: FormGroup | any;
  //opearatorForm!: FormGroup;
  //signOperatorList = [{ id: 0, value: '<' }, { id: 1, value: '>' }, { id: 2, value: '=' }, { id: 3, value: '<=' }, { id: 4, value: '>=' }, { id: 5, value: '<>' }, { id: 6, value: 'IN' }, { id: 7, value: 'NOT IN' }, { id: 8, value: 'LIKE' }]
  opearatorList = [{ id: 0, value: 'AND' }, { id: 1, value: 'OR' }]
  signOperatorList: any[] = [];

  //accordion
  isOpenAccordion: boolean = false;
  // @ViewChildren('input') public inputs!: QueryList<ElementRef> | any;
  //@ViewChild('textArea') _textArea: ElementRef;
  fx: any = []
  displayedRows$: Observable<any> | any;
  //private tableData = new MatTableDataSource(this.messages);
  //accordian-datamodeling-sortedCL,mergedcL

  allExpandState: boolean = false;
  panelOpenState: boolean = false;


  dataType = ['int', 'float', 'char', 'varchar', 'dateTime', 'money', 'text', 'decimal', 'datetime2', 'decimal', 'nvarchar', 'bigint']
  dataTypee = [{ id: 0, value: 'int' }, { id: 1, value: 'float' }, { id: 2, value: 'char' }, { id: 3, value: 'varchar' }, { id: 4, value: 'text' },
  { id: 5, value: 'money' }, { id: 6, value: 'dateTime' }, { id: 7, value: 'date' }, { id: 8, value: 'datetime2' }, { id: 9, value: 'decimal' }, { id: 10, value: 'nvarchar' }, { id: 11, value: 'bigint' }]


  dateTimeFormats = ["MM/dd/yyyy", "MM-dd-yyyy", "dd/MM/yyyy", "dd-MM-yyyy", "yyyy/MM/dd", "yyyy-MM-dd", "yyyy/dd/MM", "yyyy-dd-MM", "MMddyyyy", "ddMMyyyy", "yyyyMMdd", "yyyyddMM"]



  joinType = ['Inner Join', 'Left Join', 'Outer Join', 'Right Join', 'Full Join', 'Cross Join']
  unCheckedListAddToMergeList: any[] = []; // try to x
  viewscriptForm!: FormGroup;
  sqlScriptForm!: FormGroup;
  selected_filename: any;
  process: any;
  allDatasetDetailsList: any[] = [];
  relationShipPayload: any = [];
  selectedDateList: any[] = [];
  relationship: any[] = [];
  enableUploadSQLPopup: boolean = false;
  joinSetForm!: FormGroup;
  placetable: any = "Select Primary Table";
  dataSetForm!: FormGroup;
  //dataSetData:any= [{primaryTableList:[{tableNameUI:''}], foreignTableList:[{tableNameUI:''}], columns: [{ primaryKeyList: [{primaryKeyList:[], foreignKeyList:[]}], foreignKeyList: [{primaryKeyList:[], foreignKeyList:[]}] }], Join:'', order:0}  ];
  dataSetData: any[] = [];
  showRelationshipModal = false;

  datasetForm!: FormGroup;
  datasetTableForm!: FormGroup
  datasetAppendForm!: FormGroup
  getViewScriptForm!: FormGroup
  createExpressionForm!: FormGroup;
  addRelationshipForm!: FormGroup

  hideCreateIdenticalBtnWithLength: boolean = true;
  //DM
  columnsForWhereInDS: Array<any> = []
  isManualScript: boolean = true
  isUploadScript: boolean = false

  constructor(
    private popup: PopupService,
    private router: Router,
    private formBuilder: FormBuilder, private toast: ToastComponent, private loader: LoaderService,
    private fb: FormBuilder, private renderer: Renderer2, private solService: SolutionService, private dialog: MatDialog,
    private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    let routerValue = this.activatedRoute.snapshot.paramMap.get('id');

    this.joinSetForm = this.formBuilder.group({
      Merg: this.formBuilder.array([])
    })
    this.process = JSON.parse(localStorage.getItem("process") || '{}') //just commented 607B9457-C338-4D2B-8011-D47017162B24
    console.log(this.process);

    // this.process = { processId: '61f0d058-4977-4633-80c6-09cdeb2b57c8', processName: 'process deloitte' }
    if (this.process.processId == undefined) {
      this.router.navigate(['/user/admin1/add-process']);
      return
    }

    this.tabs.forEach((item: any) => { //R
      if (item.routeValue == routerValue) {
        // this.targetFiles = []
        // this.getTargetFileList()
        this.changeTabs(item, 'prev')
      }
    })
    this.appendForm = this.formBuilder.group({
      appendNameControl: ['', Validators.required],
    });
    this.joinForm = this.formBuilder.group({
      appendNameControl: ['', Validators.required],
    });
    //this.displayedRows$ = of(this.messages);
    this.createExpressionList = [];
    this.invoiceForm1 = this.fb.group({
      //Rows: this.fb.array([]),
      DRows1: this.fb.array([]),

    });
    this.dataSetForm = this.fb.group({
      DSetRows: this.fb.array([]),

    });



    // this.appendForm.get("appendNameControl")?.setAsyncValidators([this.isValidName(), this.isAppendNameInList()]);
    // this.joinForm.get("appendNameControl")?.setAsyncValidators([this.isValidName(), this.isAppendNameInList()]);
    //added new
    this.datasetForm = this.formBuilder.group({
      appendNameControl: ['', Validators.required],
    });

    this.viewscriptForm = this.fb.group({
      sqlScript: [''],
      datasetId: ['']
    });

    this.sqlScriptForm = this.fb.group({
      datasetName: ['', Validators.required],
      sqlScript: ['', Validators.required]
    });



    this.datasetTableForm = this.fb.group({ //2jan
      groupBy: [''],
      having: [''],
      orderBy: [''],
      where: this.fb.array([this.whereFirstRow()])
    })




    this.datasetAppendForm = this.formBuilder.group({ //6jan
      appendNameControl: ['', Validators.required],
    });


    this.getViewScriptForm = this.formBuilder.group({ //6jan
      script: ['', Validators.required],
      solutionScriptId: [''],
      type: [''],
      gscript: ['']
    });

    this.createExpressionForm = this.fb.group({
      sourceFieldName: ['', Validators.required],
      columnType: [[], Validators.required],
      columnFormat: [[]],
      excludeInSelect: [false],
      sourceExpressionName: [''],
      // signOperator: ['', Validators.required],     
      // value: ['', Validators.required],      // whereList: this.fb.array([])  
    })

    this.addRelationshipForm = this.fb.group({  //DM
      addRelationshipRows: this.fb.array([this.addRelationshipRow()]),
    })
    // this.MergeArr().push(this.Merg())
    // this.TableArr(0).push(this.addTable())
    // this.columnArr(0,0).push(this.addColumn())
    //console.log(this.joinSetForm);
    //this.datasetForm.get("appendNameControl")?.setAsyncValidators([this.validateDatasetname()]);
  }
  ngAfterViewInit(): void {
  }

  private validateDatasetname(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | any> => {
      let bReturn: boolean = true;
      let regExp = '^[a-zA-Z0-9]{4,10}$' //^(\d|\w)+$
      //regExp.test()
      const val = this.datasetForm.get("appendNameControl")?.value;
      this.solService.getExistDataset(val, '').subscribe((res: any) => {
        this.submitted = false
        this.submittedErrorMsg = ''
        // console.log(res);
      }, (err: any) => {
        this.submitted = true
        this.submittedErrorMsg = 'Dataset Name Already Exists'
        //this.toast.error({ title: 'Error', message: "Dataset Name Already Exists" });
      })
      // if (this.enableAppendNamePopup) {
      //   let arr = this.sortedCheckedList.filter(x => x.showAppendName == val)
      //   if (arr.length != 0) bReturn = false;
      // 
      let err: ValidationErrors = { 'exists': true };
      return bReturn ? of(null) : of(err);
    };
  }


  rowCount: any;
  previewPopup(name: string) { //filtered files,
    this.rowCount = ''
    if (name != '') {
      this.loader.show()
      this.solService.viewTableDetails(name).subscribe((res: any) => {
        if (res.responseData != null) {
          this.selectedM_A_S = res.responseData.tableDetails;
          this.rowCount = res.responseData.count
          this.preview();
          this.showTargetFilePopup = true;
        }
        else {
          this.popup.open(false, res.statusMessage);
        }
        // this.toast.error({ title: 'Error', message: res.statusMessage });
        this.loader.hide()
      }, (err: any) => {
        this.popup.open(false, 'Table not created!!');
        // this.toast.error({ title: 'Error', message: 'Table not created!!' });
        this.loader.hide()
      })
    }


  }

  private preview() {
    this.columnsArr = [];
    //identify unique keys in the array
    for (var key in this.selectedM_A_S[0]) {
      if (this.selectedM_A_S[0].hasOwnProperty(key)) {
        this.columnsArr.push(key);
      }
    }
  }

  searchField(e: any, j: any, i: any, type: any, subtype: any) {
    if (type == 'dataset') {
      if (subtype == 'pt') this.dataSetData[i].searchValuePT = e.target.value
      else if (subtype == 'ft') this.dataSetData[i].searchValueFT = e.target.value
      else if (subtype == 'pk') this.dataSetData[i].columns[j].searchValuePK = e.target.value
      else if (subtype == 'fk') this.dataSetData[i].columns[j].searchValueFK = e.target.value
    }


  }

  closeDropdown(j: any, i: any, type: any, subtype: any) {
    if (type == 'dataset') {
      if (subtype == 'pt') this.dataSetData[i].searchValuePT = ''
      else if (subtype == 'ft') this.dataSetData[i].searchValueFT = ''
      else if (subtype == 'pk') this.dataSetData[i].columns[j].searchValuePK = ''
      else if (subtype == 'fk') this.dataSetData[i].columns[j].searchValueFK = ''
    }
  }


























  //UFStart

  //iscreatesolutionEdit: boolean = false
  getAllFileTemplateListByProcessID() { //R 
    this.loader.show();

    this.solService.getAllFileTemplateListByProcessID(this.process.processId).subscribe((res: any) => {
      this.showUploadFilesTab = true;

      const ResponseData = res.responseData.totalfileDetails

      if (ResponseData.length == 0) this.showUploadFilesTab = false;
      else {
        //this.iscreatesolutionEdit = true
        ResponseData.forEach((fileObj: any) => {
          // fileObj.fileExtention = fileObj.fileName.split('.').slice(1, 2).join('');
          // fileObj.fileName = fileObj.fileName.split('.').slice(0, -1).join('.');
          fileObj.totalSheetList.forEach((sheetObj: any) => {
            //sheetObj.sheetSelected = false;
            const sheetName = sheetObj.sheetName;
            sheetObj.sheet?.forEach((columnObj: any) => {
              columnObj.isChecked = false;
              columnObj.tableName = sheetObj.tableName;
              if (fileObj.fileExt == 'xlsx' || fileObj.fileExt == 'xls') columnObj.showTabColName = fileObj.fileName + '-' + sheetName + '.' + fileObj.fileExt + '[' + columnObj.fieldName + ']'
              else if (fileObj.fileExt == 'txt' || fileObj.fileExt == 'csv') columnObj.showTabColName = fileObj.fileNameWithExt + '[' + columnObj.fieldName + ']'
              columnObj.fileExt = fileObj.fileExt
            })
          })
        })
        // ResponseData.forEach((smd: any) => {
        //   this.fileListt.push(smd)
        // })
        this.fileListt = ResponseData
        this.isAllSelectedUploadFiles() //R
      }
      this.loader.hide();

      // this.tabsChange({id:0})
    }, (err: any) => {
      this.showUploadFilesTab = false
      this.fileListt.forEach((object:any,index:number)=>{
        if(object.isProgressBar) this.fileListt.splice(index,1)
      })
      //this.toast.error({ title: 'Error', message: " Failed" }) //?
      this.loader.hide();
    })

  }



  // saveiputFiles(ev: any) {  //R
  //   this.showUploadFilesTab = true;
  //   let processId: string = this.process.processId;
  //   const formData = new FormData();
  //   formData.append('processId', processId);
  //   let acceptedExtentions = ['xlsx', 'xls', 'txt', 'csv', 'json', 'jpeg', 'png', 'jpg', 'pdf']

  //   for (let i = 0; i < ev.target.files.length; i++) {
  //     const file = ev.target.files[i];
  //     if (acceptedExtentions.includes(file.name.split('.')[1])) {
  //       formData.append('file', ev.target.files[i])
  //     }
  //   }

  //   for (let index = 0; index < ev.target.files.length; index++) {
  //     const file = ev.target.files[index];
  //     if (acceptedExtentions.includes(file.name.split('.')[1])) {
  //       // if(file.type == 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
  //       this.fileListt.push({ fileNameWithExt: file.name.split('.')[0], isProgressBar: true, fileExt: file.name.split('.')[1] })
  //     }
  //   }

  //   // R
  //   this.solService.postInputFiles(formData).subscribe((res: any) => {

  //     //     const sheetMetaData = JSON.parse(res.responseData.sheetMetaData);

  //     //     sheetMetaData.forEach((fileObj: any) => {
  //     //       // fileObj.fileExtention = fileObj.fileName.split('.').slice(1, 2).join('');
  //     //       // fileObj.fileName = fileObj.fileName.split('.').slice(0, -1).join('.');
  //     //       fileObj.totalSheetList.forEach((sheetObj: any) => {
  //     //         sheetObj.sheetSelected = false;
  //     //         const sheetName = sheetObj.sheetName;
  //     //         sheetObj.sheet?.forEach((columnObj: any) => {
  //     //           columnObj.isChecked = false;
  //     //           columnObj.tableName = sheetObj.tableName;
  //     //           //columnObj.showTabColName = fileObj.fileName + '-' + sheetName + '[' + columnObj.fieldName + ']'
  //     //           if (fileObj.fileExt == 'xlsx' || fileObj.fileExt == 'xls') columnObj.showTabColName = fileObj.fileName + '-' + sheetName + '.' + fileObj.fileExt + '[' + columnObj.fieldName + ']'
  //     //           else if (fileObj.fileExt == 'txt' || fileObj.fileExt == 'csv') columnObj.showTabColName = fileObj.fileNameWithExt + '[' + columnObj.fieldName + ']'
  //     //           columnObj.fileExt = fileObj.fileExt
  //     //         })
  //     //       })
  //     //     })
  //     //     this.fileListt = sheetMetaData;
  //     //     //console.log(this.fileListt)

  //     //   }
  //     this.getAllFileTemplateListByProcessID()

  //   }, (err: any) => {
  //     this.fileListt = []
  //     this.showUploadFilesTab = false
  //     this.toast.error({ title: 'Error', message: "Upload Failed" })
  //     this.loader.hide()
  //   });

  // }


  saveiputFiles(ev: any) {  //R
    this.showUploadFilesTab = true;
    let processId: string = this.process.processId;

    let acceptedExtentions = ['xlsx', 'xls', 'txt', 'csv', 'json', 'jpeg', 'png', 'jpg', 'pdf']

    for (let index = 0; index < ev.target.files.length; index++) {
      const file = ev.target.files[index];
      if (acceptedExtentions.includes(file.name.split('.')[1])) {
        // if(file.type == 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
        this.fileListt.push({ fileNameWithExt: file.name.split('.')[0], isProgressBar: true, fileExt: file.name.split('.')[1] })
      }
    }


    let requestArray: Array<any> = []
    for (let i = 0; i < ev.target.files.length; i++) {
      const file = ev.target.files[i];
      if (acceptedExtentions.includes(file.name.split('.')[1])) {
        const formData = new FormData();
        formData.append('processId', processId);
        formData.append('file', ev.target.files[i])
        requestArray.push(
          this.solService.postInputFiles(formData).pipe(
            catchError((err) => {
              return of({ error: err, isError: true })
            }
            ))
        )
      }
    }


    console.log(requestArray);

    forkJoin(
      requestArray
    ).subscribe(response => {
      console.log(response);
      this.getAllFileTemplateListByProcessID()
      // response.forEach(((r: any) => {
      //   if (r.isError) {
      //     console.log('error');

      //   }
      // }))

    });

    // R
    // this.solService.postInputFiles(formData).subscribe((res: any) => {

    //   //     const sheetMetaData = JSON.parse(res.responseData.sheetMetaData);

    //   //     sheetMetaData.forEach((fileObj: any) => {
    //   //       // fileObj.fileExtention = fileObj.fileName.split('.').slice(1, 2).join('');
    //   //       // fileObj.fileName = fileObj.fileName.split('.').slice(0, -1).join('.');
    //   //       fileObj.totalSheetList.forEach((sheetObj: any) => {
    //   //         sheetObj.sheetSelected = false;
    //   //         const sheetName = sheetObj.sheetName;
    //   //         sheetObj.sheet?.forEach((columnObj: any) => {
    //   //           columnObj.isChecked = false;
    //   //           columnObj.tableName = sheetObj.tableName;
    //   //           //columnObj.showTabColName = fileObj.fileName + '-' + sheetName + '[' + columnObj.fieldName + ']'
    //   //           if (fileObj.fileExt == 'xlsx' || fileObj.fileExt == 'xls') columnObj.showTabColName = fileObj.fileName + '-' + sheetName + '.' + fileObj.fileExt + '[' + columnObj.fieldName + ']'
    //   //           else if (fileObj.fileExt == 'txt' || fileObj.fileExt == 'csv') columnObj.showTabColName = fileObj.fileNameWithExt + '[' + columnObj.fieldName + ']'
    //   //           columnObj.fileExt = fileObj.fileExt
    //   //         })
    //   //       })
    //   //     })
    //   //     this.fileListt = sheetMetaData;
    //   //     //console.log(this.fileListt)

    //   //   }
    //   this.getAllFileTemplateListByProcessID()

    // }, (err: any) => {
    //   this.fileListt = []
    //   this.showUploadFilesTab = false
    //   this.toast.error({ title: 'Error', message: "Upload Failed" })
    //   this.loader.hide()
    // });

  }


  isAllSelectedUploadFiles() { //UF
    let p = 1;
    this.fileListt.forEach((obj: any) => {
      obj.totalSheetList.forEach((item: any) => {
        if (item.sheetSelected == false) {
          p = 0;
          return;
        }
      })
    })
    if (p == 0) this.masterSelected = false;
    else this.masterSelected = true;
    console.log(this.fileListt);

    this.nextBtnEnableInUF();
  }


  checkUncheckAllUploadFiles() { //UF
    this.fileListt.forEach((obj: any) => {
      obj?.totalSheetList?.forEach((item: any) => {
        item.sheetSelected = this.masterSelected;
      })
    })
    this.nextBtnEnableInUF();
  }


  private nextBtnEnableInUF() { //UF
    const checkedSheets = this.fileListt.filter((element: any) =>
      element.totalSheetList?.some((subElement: any) => subElement.sheetSelected == true))
      .map((element: any) => {
        return Object.assign({}, element, { totalSheetList: element.totalSheetList.filter((subElement: any) => subElement.sheetSelected == true) });
      });
    if (checkedSheets.length == 0) this.isUploadFilesNextBtnEnable = true;
    else this.isUploadFilesNextBtnEnable = false;
  }

  //-UFEnd
















  //TFStart
  clickedRowDataInTF: any[] = [];
  fileTypeInTF: string = '';
  fileClickedinTF(j: number, i: number, Obj: any, fileType: any) {//TF
    this.targetFiles.forEach((obj: any) => {
      obj.sheetList.forEach((childObj: any) => {
        childObj.isRowTabAvtive = false
      })
    })
    Obj.isRowTabAvtive = true;
    this.fileTypeInTF = fileType;
    if (i == 0) this.clickedRowDataInTF = Obj.tableAppendFieldsDto;
    else if (i == 1) this.clickedRowDataInTF = Obj.mergeFieldListDTO;
    else if (i == 2) this.clickedRowDataInTF = Obj.sheet;
  }

  append_SourceFilesList: Array<any> = []
  getTargetFileList() { //get in TF
    this.targetFiles = []
    this.loader.show()
    this.solService.getTargetFileList(this.process.processId).subscribe((res: any) => {
      res.responseData.appendSheetListDto?.appendSheetList.forEach((appObj: any) => {
        appObj.tableNameUI = appObj.appendName
        appObj.isSelectAllParentInDM = false //DM
        appObj.tableAppendFieldsDto.forEach((colObj: any) => {
          colObj.isSelectAllChildInDM = false //DM
          colObj.fileType = appObj.type,
            colObj.showTabColName = appObj.appendName + '[' + colObj.fieldName + ']'
          colObj.isDropdownDirtyInTF = false
        })

      })

      res.responseData.templateMergeListDTO?.templatesMergeDetailsList.forEach((joinObj: any) => {
        joinObj.isSelectAllParentInDM = false //DM
        joinObj.mergeFieldListDTO.forEach((colObj: any) => {
          colObj.isSelectAllChildInDM = false // DM
          colObj.showTabColName = joinObj.mergeName + '[' + colObj.fieldName + ']'
          colObj.isDropdownDirtyInTF = false
        })
      })



      let fileResponse = res.responseData.templateFileDetailsListDto?.totalfileDetails
      fileResponse.forEach((fileObj: any) => {

        fileObj.totalSheetList.forEach((sheetObj: any) => {
          const sheetName = sheetObj.sheetName;
          sheetObj.sheet?.forEach((columnObj: any) => {
            columnObj.tableName = sheetObj.tableName;
            //columnObj.isCheckboxDirty = false
            columnObj.isDropdownDirtyInTF = false
            columnObj.type = 'template'
            if (fileObj.fileExt == 'xlsx' || fileObj.fileExt == 'xls') columnObj.showTabColName = fileObj.fileName + '-' + sheetName + '.' + fileObj.fileExt + '[' + columnObj.fieldName + ']'
            else if (fileObj.fileExt == 'txt' || fileObj.fileExt == 'csv') columnObj.showTabColName = fileObj.fileNameWithExt + '[' + columnObj.fieldName + ']'
            else if (fileObj.fileExt == 'json') columnObj.showTabColName = fileObj.fileNameWithExt + '[' + columnObj.fieldName + ']'
            columnObj.fileExt = fileObj.fileExt
          })
        })
      })

      const filesheetList: any[] = []
      fileResponse.forEach((fileObj: any) => {
        fileObj.isSelectAllParentInDM = false //DM

        fileObj.totalSheetList.forEach((sheetObj: any) => {
          if (sheetObj.sheetSelected) {
            sheetObj.sheet?.forEach((columnObj: any) => {
              columnObj.isSelectAllChildInDM = false //DM
            })
            sheetObj.type = 'template'
            if (sheetObj.sheet != null) {
              if (sheetObj.fileExt == 'xlsx' || sheetObj.fileExt == 'xls') filesheetList.push({ fileExt: sheetObj.fileExt, fileName: fileObj.fileName + '-' + sheetObj.sheetName + '.' + fileObj.fileExt, ...sheetObj, isCheckedInAppend: false, isCheckedInJoin: false, type: 'files', tableNameUI: fileObj.fileName + '-' + sheetObj.sheetName + '.' + fileObj.fileExt })
              else if (sheetObj.fileExt == 'csv' || sheetObj.fileExt == 'txt') filesheetList.push({ fileExt: sheetObj.fileExt, fileName: fileObj.fileNameWithExt, ...sheetObj, isCheckedInAppend: false, isCheckedInJoin: false, type: 'files', tableNameUI: fileObj.fileNameWithExt })
              else if (sheetObj.fileExt == 'json') filesheetList.push({ fileExt: sheetObj.fileExt, fileName: fileObj.fileNameWithExt, ...sheetObj, isCheckedInAppend: false, isCheckedInJoin: false, type: 'files', tableNameUI: fileObj.fileNameWithExt })
            }
          }
        })

      })
      this.targetFiles = [{ fileType: 'append', sheetList: res.responseData.appendSheetListDto?.appendSheetList }, { fileType: 'join', sheetList: res.responseData.templateMergeListDTO?.templatesMergeDetailsList }, { fileType: 'files', sheetList: filesheetList }]
      console.log(this.targetFiles, 'this.targetFiles');
      this.sourceFilesList = filesheetList //need to call after TF 


      //in Join
      //tableNameUI, 

      // this.append_SourceFilesList = []
      // res.responseData.appendSheetListDto?.appendSheetList.forEach((_appendObj: any) => this.append_SourceFilesList.push(_appendObj))
      // filesheetList.forEach((_sheetObj: any) => this.append_SourceFilesList.push(_sheetObj))
      // console.log('this.append_SourceFilesList', this.append_SourceFilesList);


      this.allList(); //shd call only in changetabs(4)//DM
      this.loader.hide()
    }, (err: any) => {
      this.loader.hide()

    })
  }

  selectDropDownInTF(e: any, rowObj: any) {
    rowObj.isDropdownDirtyInTF = true
  }
  //-TFEnd



















































  //AStart
  appendList: any[] = [] //get all appendlist
  sourceFilesList: any[] = []
  isCheckedInAppend(e: any) { //append
    this.submitted = false;
    this.submittedErrorMsg = '';
  }




  addAppend() {

    console.log('this.sourceFilesList', this.sourceFilesList);
    let checkedList = this.sourceFilesList.filter((x: any) => x.isCheckedInAppend)
    if (checkedList.length < 2) {
      this.submitted = true;
      this.submittedErrorMsg = 'Ensure that the files with identical columns are selected for appending'
      return;
    }

    let k = 0;
    let checkedSheetColumns: Array<any> = []
    checkedList.forEach((obj: any) => {
      if (checkedSheetColumns.length == 0) {
        checkedSheetColumns = obj.sheet.map((x: any) => x.fieldName)
      }
      else {
        let columnsList: Array<any> = []
        columnsList = obj.sheet.map((x: any) => x.fieldName)
        checkedSheetColumns.forEach((colNames: any) => {
          if (!columnsList.includes(colNames)) {
            k = 1;
            return;
          }
        })
      }
    })
    if (k == 1) {
      this.submitted = true;
      this.submittedErrorMsg = "Ensure that the files with identical columns are selected for appending"
      return;
    }
    this.enableAppendNamePopup = true
    this.appendForm.reset()
  }

  isTableExistAppend(e: any) {
    this.submited = false;
    this.submittedErrorMsg = '';
    // let regExp = /^[A-Za-z][A-Za-z0-9_]$/  //^(\d|\w)+$
    // let val = e.target.value
    // if (val.length >= 1) {
    //   if (!regExp.test(val)) {
    //     this.appendForm.controls['appendNameControl'].setValidators([Validators.required, Validators.pattern(regExp)])
    //     this.appendForm.controls['appendNameControl'].updateValueAndValidity()
    //     this.submited = true;
    //     this.submittedErrorMsg = 'No Space, Special Characters allowed';
    //   }
    //   else{
    //     this.appendForm.controls['appendNameControl'].setValidators([])

    //     this.submited = false;
    //     this.submittedErrorMsg = '';
    //   }
    // }
    // else {
    //   this.submited = false;
    //   this.submittedErrorMsg = '';
    // }
  }

  isTableExist(name: any, type: any) {
    this.loader.show()
    this.solService.getExistDataset(name, type).subscribe((res: any) => {
      this.loader.hide()
      this.enableAddBtn = false
      this.submited = false
      this.submittedErrorMsg = ''
      this.appendForm.controls['appendNameControl'].setValidators([])
      this.appendForm.controls['appendNameControl'].updateValueAndValidity()

      this.postAddAppendFiles(name)

      console.log(res);
    }, (err: any) => {
      this.loader.hide()
      this.enableAddBtn = false
      this.submited = true
      this.submittedErrorMsg = 'Append Name Already Exist!!!'
      this.appendForm.controls['appendNameControl'].setValidators([Validators.required])
      this.appendForm.controls['appendNameControl'].updateValueAndValidity()
    })

  }

  addAppendApi() {
    this.enableAddBtn = true
    let _appendName = this.appendForm.get('appendNameControl')?.value

    this.submited = true;
    console.log(this.appendForm);
    if (this.appendForm.invalid) { //shd check
      return;
    }

    this.isTableExist(_appendName, 'append')



  }

  postAddAppendFiles(_appendName: any) {
    let appendDtos: Array<any> = []
    this.sourceFilesList.forEach((colObj: any) => {
      if (colObj.isCheckedInAppend) appendDtos.push({ sheetId: colObj.templateId, fileName: colObj.fileName })
    })

    let appendObj: any = {
      processId: this.process.processId,
      appendSheetList: [{ appendDtos, appendName: _appendName }]
    }

    this.solService.addAppendFiles(appendObj).subscribe((res: any) => {
      this.getAppendFilesApi() // get append list
      this.appendForm.reset()
      this.sourceFilesList.forEach((fileObj: any) => fileObj.isCheckedInAppend = false)
      this.enableAppendNamePopup = false;
      this.popup.open(true, "Saved Successfully !");
      // this.toast.success({ title: 'Success', message: "Saved Successfully !" });
      this.loader.hide()
    }, (err: any) => {
      this.loader.hide()
    });
  }







  enableViewScriptPopup: boolean = false;



  //-AEnd


























  //JStart
  Merg(): FormGroup { //join
    return this.formBuilder.group({
      tableControl: this.formBuilder.array([]),
    })
  }
  addTable(): FormGroup { //join
    return this.formBuilder.group({
      table1: ['', Validators.required],
      join: ['', Validators.required],
      table2: ['', Validators.required],
      column: this.formBuilder.array([])
    })
  }
  addColumn(): FormGroup { //join
    return this.formBuilder.group({
      column1: ['', Validators.required],
      column2: ['', Validators.required]
    })
  }

  MergeArr(): FormArray { //join
    return this.joinSetForm.get('Merg') as FormArray
  }

  TableArr(i: any): FormArray { //join 
    return this.MergeArr().controls[i].get('tableControl') as FormArray
  }

  columnArr(i: any, j: any): FormArray {
    return this.TableArr(i).controls[j].get('column') as FormArray
  }

  addMergeJoin() { //join
    this.MergeArr().push(this.Merg())
    let len = this.MergeArr().length
    this.TableArr(len - 1).push(this.addTable())
    let j = this.TableArr(len - 1).length
    this.columnArr(len - 1, j - 1).push(this.addColumn())

  }

  addTableJoins(i: any, j: any) { //join()
    let ddlLength = this.joinCheckedList[i].dropDownList.length
    let TabArrlen = this.TableArr(i).length;

    if (this.joinCheckedList[i].dropDownList[ddlLength - 1].foreignTableList.length == 0) return;
    if (this.TableArr(i).controls[TabArrlen - 1].get('table1')?.value == '' || this.TableArr(i).controls[TabArrlen - 1].get('table2')?.value == '') return

    this.TableArr(i).push(this.addTable())
    let len = this.TableArr(i).length;
    this.columnArr(i, len - 1).push(this.addColumn())
    console.log(this.joinCheckedList[i]?.dropDownList);

  }

  addColumnJoin(i: any, j: any) { //column add 
    let colArrLength = this.columnArr(i, j).controls.length
    if (this.columnArr(i, j).controls[colArrLength - 1].get('column1')?.value == '' || this.columnArr(i, j).controls[colArrLength - 1].get('column2')?.value == '') return

    if (this.joinCheckedList[i].dropDownList[j].columns[colArrLength].primaryKeyList.length == 0 || this.joinCheckedList[i].dropDownList[j].columns[colArrLength].foreignKeyList.length == 0) return
    this.columnArr(i, j).push(this.addColumn())

  }

  removeCol(i: any, j: any, k: any) { //join
    for (let z = k; z <= this.joinCheckedList[i].dropDownList[j].columns.length; z++) {
      this.columnArr(i, j).removeAt(z)
    }
    this.joinCheckedList[i].dropDownList[j].columns.splice(k + 1, this.joinCheckedList[i].dropDownList[j].columns.length)
  }
  removeTable(i: any, j: any) { //join
    // let len=this.TableArr(i).controls.length
    console.log('removeTable()', i, j);

    for (let k = j; k <= this.joinCheckedList[i].dropDownList.length; k++) {
      this.TableArr(i).removeAt(j)
    }
    this.joinCheckedList[i].dropDownList.splice(j + 1, this.joinCheckedList[i].dropDownList.length)

    console.log(this.joinCheckedList[i].dropDownList);

  }
  resetJoin() {
    this.joinCheckedList = []
    this.append_SourceFilesList.forEach((tableObj: any) => tableObj.isCheckedInJoin = false)
  }

  saveJoin() {

  }

  MergeSubmit() { //join
    this.submitedJ = true
    let d = 0
    this.MergeArr().controls.forEach((merObj: any, i: number) => {
      this.TableArr(i).controls.forEach((tableObj: any) => {
        if (tableObj.invalid) d = 1
      })

    })
    if (d == 1) {

      this.toast.error({ title: 'Error', message: "Enter all the required fields" });
      return;
    }


    // this.loader.show()
    console.log(this.joinSetForm.value, this.process.processId);
    let data: any = {}
    data.processId = this.process.processId
    data.templatesMergeDetailsList = []

    let selectedTables: Array<any> = []
    this.MergeArr().controls.forEach((ele: any, i: any) => {
      data.templatesMergeDetailsList[i] = {}

      data.templatesMergeDetailsList[i].mergeName = this.joinCheckedList[i].joinName
      data.templatesMergeDetailsList[i].templatesMergeList = []
      data.templatesMergeDetailsList[i].mergeTableDetails = []


      selectedTables = []
      ele.controls.tableControl.controls.forEach((tabControl: any, index: number) => {
        if (tabControl.controls.table1) {
          selectedTables.push(tabControl.controls.table1.value)
        }
        if (tabControl.controls.table2) {
          selectedTables.push(tabControl.controls.table2.value)
        }
      })

      // console.log('selectedTables', selectedTables);
      // console.log('selectedTableNames', selectedTableNames);
      selectedTables = [...new Set(selectedTables)]
      selectedTables.forEach((tabObj: any, j: number) => {
        //new change
        //this.joinCheckedList[i].dropDownList[0].primaryTableList.forEach((merObj: any, j: number) => {
        data.templatesMergeDetailsList[i].mergeTableDetails[j] = {}
        if (tabObj.type == 'template') {
          data.templatesMergeDetailsList[i].mergeTableDetails[j].id = tabObj.templateId
          data.templatesMergeDetailsList[i].mergeTableDetails[j].type = 'T'
        }
        else if (tabObj.type == 'Append') {
          data.templatesMergeDetailsList[i].mergeTableDetails[j].id = tabObj.appendID
          data.templatesMergeDetailsList[i].mergeTableDetails[j].type = 'A'
        }
        //})
      })

      // this.joinCheckedList.forEach(() => {
      //   //new change
      //   this.joinCheckedList[i].dropDownList[0].primaryTableList.forEach((merObj: any, j: number) => {
      //     data.templatesMergeDetailsList[i].mergeTableDetails[j] = {}
      //     if (merObj.type == 'template') {
      //       data.templatesMergeDetailsList[i].mergeTableDetails[j].id = merObj.templateId
      //       data.templatesMergeDetailsList[i].mergeTableDetails[j].type = 'T'
      //     }
      //     else if (merObj.type == 'Append') {
      //       data.templatesMergeDetailsList[i].mergeTableDetails[j].id = merObj.appendID
      //       data.templatesMergeDetailsList[i].mergeTableDetails[j].type = 'A'
      //     }
      //   })
      // })



      this.TableArr(i).controls.forEach((elem: any, j: any) => {
        data.templatesMergeDetailsList[i].templatesMergeList[j] = {}
        if (elem.value.table1.type == 'Append') data.templatesMergeDetailsList[i].templatesMergeList[j].primaryTemplateId = elem.value.table1.appendID
        if (elem.value.table2.type == 'Append') data.templatesMergeDetailsList[i].templatesMergeList[j].secondaryTemplateId = elem.value.table2.appendID
        if (elem.value.table1.type == 'template') data.templatesMergeDetailsList[i].templatesMergeList[j].primaryTemplateId = elem.value.table1.templateId
        if (elem.value.table2.type == 'template') data.templatesMergeDetailsList[i].templatesMergeList[j].secondaryTemplateId = elem.value.table2.templateId



        data.templatesMergeDetailsList[i].templatesMergeList[j].primaryTableName = elem.value.table1.tableNameDB
        data.templatesMergeDetailsList[i].templatesMergeList[j].secondaryTableName = elem.value.table2.tableNameDB

        data.templatesMergeDetailsList[i].templatesMergeList[j].joinType = elem.value.join[0]

        data.templatesMergeDetailsList[i].templatesMergeList[j].order = (j == 0) ? 1 : 2
        data.templatesMergeDetailsList[i].templatesMergeList[j].columnArrayList = []
        this.columnArr(i, j).controls.forEach((element: any, k: any) => {
          data.templatesMergeDetailsList[i].templatesMergeList[j].columnArrayList[k] = {}

          // console.log(element);


          if (element.value.column1.fileType == 'append') data.templatesMergeDetailsList[i].templatesMergeList[j].columnArrayList[k].primaryKeyId = element.value.column1.fieldID
          if (element.value.column2.fileType == 'append') data.templatesMergeDetailsList[i].templatesMergeList[j].columnArrayList[k].secondaryKeyId = element.value.column2.fieldID

          if (element.value.column1.type == 'template') data.templatesMergeDetailsList[i].templatesMergeList[j].columnArrayList[k].primaryKeyId = element.value.column1.columnId
          if (element.value.column2.type == 'template') data.templatesMergeDetailsList[i].templatesMergeList[j].columnArrayList[k].secondaryKeyId = element.value.column2.columnId

          data.templatesMergeDetailsList[i].templatesMergeList[j].columnArrayList[k].primaryFieldName = element.value.column1.columnName
          data.templatesMergeDetailsList[i].templatesMergeList[j].columnArrayList[k].secondaryFieldName = element.value.column2.columnName
        });
      });

    });
    console.log(data);
    this.solService.addJoinFiles(data).subscribe((res: any) => {
      console.log(res);
      this.joinCheckedList = []
      //this.joinSetForm.reset()
      this.joinSetForm.controls.Merg = this.fb.array([])

      this.getJoinFilesListApi() // get join files

      this.popup.open(true, "Saved Successfully !");
      // this.toast.success({ title: 'Success', message: "Saved Successfully !" });
      this.loader.hide()
    }, (err: any) => {
      this.loader.hide()

    })
  }


  join2Sheets() { //join
    this.submitedJ = false
    let checkedList = this.append_SourceFilesList.filter(x => x.isCheckedInJoin)
    if (checkedList.length < 2) {
      this.submitted = true;
      this.submittedErrorMsg = 'Please select atleast two sheets';
      return;
    }
    this.enableMergeNamePopup = true;
    this.joinForm.get("appendNameControl")?.reset();
  }


  joinCheckedList: Array<any> = []
  addJoin() {
    let joinName = this.joinForm.get("appendNameControl")?.value
    this.submited = true;
    console.log(this.joinForm);
    if (this.joinForm.invalid) { //R
      return;
    }

    this.loader.show()
    this.solService.getExistDataset(joinName, 'merge').subscribe((res: any) => {
      this.loader.hide()
      this.submited = false
      this.submittedErrorMsg = ''

      this.addJoinCreate(joinName)
      console.log(res);
    }, (err: any) => {
      this.loader.hide()
      this.submited = true
      this.submittedErrorMsg = 'Join Name Already Exist!!!'

    })


  }

  addJoinCreate(joinName: any) {
    this.addMergeJoin()
    let checkedList = this.append_SourceFilesList.filter(x => x.isCheckedInJoin)
    const primaryTableList: Array<any> = []
    const foreignTableList: Array<any> = []
    checkedList.forEach((tabObj: any) => {
      if (tabObj.type == 'Append') {
        primaryTableList.push({
          tableNameUI: tabObj.tableNameUI, tableNameDB: tabObj.tableName,
          sheet: tabObj.tableAppendFieldsDto, isSelected: false, type: 'Append', appendID: tabObj.appendID
        })

      }
      else if (tabObj.type == 'files') {
        primaryTableList.push({
          tableNameUI: tabObj.tableNameUI, tableNameDB: tabObj.tableName,
          sheet: tabObj.sheet, isSelected: false, fileExt: tabObj.fileExt, type: 'template', templateId: tabObj.templateId
        })
      }
    })
    let joinObj = {
      dropDownList: [{ primaryTableList, foreignTableList, columns: [{ primaryKeyList: [], foreignKeyList: [] }] }],
      joinName: joinName
    }
    this.joinCheckedList.push(joinObj)

    console.log(this.joinCheckedList);
    this.append_SourceFilesList.forEach((tableObj: any) => tableObj.isCheckedInJoin = false)
    this.enableMergeNamePopup = false;
  }






  submitedJ: boolean = false
  checkedInJoin(e: any) { //join
    this.submitted = false;
    this.submittedErrorMsg = '';
  }



  selectPrimaryTable(e: any, j: number, i: number) { //join
    const value = e.value.value;
    let ddl = this.joinCheckedList[i].dropDownList[j];
    // console.log(item,j,i);
    ddl.columns[0].primaryKeyList = e.value.sheet //childArr


    this.removeTable(i, j + 1) //2 if want to show next row,but for without values null formCs
    this.joinCheckedList[i].dropDownList.splice(j + 1, this.joinCheckedList[i].dropDownList.length)

    this.removeCol(i, j, 1)
    this.joinCheckedList[i].dropDownList[j].columns.splice(2, this.joinCheckedList[i].dropDownList[j].columns.length)

    this.TableArr(i).controls[j].get('table2')?.reset()
    this.TableArr(i).controls[j].get('column')?.reset()

    if (j == 0) {
      // ddl.primaryTableList.forEach((priTab: any) => JSON.parse(JSON.stringify(priTab)).isSelected = false)
      // e.value.isSelected = true;
      // ddl.foreignTableList = ddl.primaryTableList.filter((x: any) => !x.isSelected)
      let selectedPT = this.TableArr(i).controls[j].get('table1')?.value.tableNameDB

      ddl.foreignTableList = []
      this.joinCheckedList[i].dropDownList[0].primaryTableList.forEach((element: any) => {
        if (!selectedPT.includes(element.tableNameDB)) {
          ddl.foreignTableList.push(element)
        }
      })
    }
    else {

    }

    console.log(this.joinCheckedList[i]?.dropDownList[j]);
  }

  selectForeignTable(e: any, j: number, i: number) { //join
    //const value = e.value.value;
    let ddl = this.joinCheckedList[i].dropDownList[j];
    //if (ddl.foreignTableList.length == 1) return
    // this.joinCheckedList[i].dropDownList[j].foreignTableList.forEach((priTab: any) => JSON.parse(JSON.stringify(priTab)).isSelected = false)
    // e.value.isSelected = true;
    console.log('selectForeignTable()', i, j);

    this.removeTable(i, j + 1) //2 if want to show next row,but for without values null formCs
    this.joinCheckedList[i].dropDownList.splice(j + 1, this.joinCheckedList[i].dropDownList.length)

    this.removeCol(i, j, 1)
    this.joinCheckedList[i].dropDownList[j].columns.splice(2, this.joinCheckedList[i].dropDownList[j].columns.length)


    ddl.columns[0].foreignKeyList = e.value.sheet //childArr
    let ptl: Array<any> = []
    let ftl: Array<any> = []
    if (j == 0) {

      ptl.push(this.TableArr(i).controls[j].get('table1')?.value)
      ptl.push(this.TableArr(i).controls[j].get('table2')?.value)

      let selectedPTFT = ptl.map((x: any) => x.tableNameDB)

      this.joinCheckedList[i].dropDownList[0].primaryTableList.forEach((element: any) => {
        if (!selectedPTFT.includes(element.tableNameDB)) {
          ftl.push(element)
        }
      })

      this.joinCheckedList[i].dropDownList[j + 1] = { primaryTableList: ptl, foreignTableList: ftl, columns: [{ primaryKeyList: [], foreignKeyList: [] }] }

    }
    else {
      ddl.primaryTableList.forEach((element: any) => {
        ptl.push(element)
      })
      ptl.push(this.TableArr(i).controls[j].get('table2')?.value)

      let selectedPTFT = ptl.map((x: any) => x.tableNameDB)

      this.joinCheckedList[i].dropDownList[0].primaryTableList.forEach((element: any) => {
        if (!selectedPTFT.includes(element.tableNameDB)) {
          ftl.push(element)
        }
      })

      this.joinCheckedList[i].dropDownList[j + 1] = { primaryTableList: ptl, foreignTableList: ftl, columns: [{ primaryKeyList: [], foreignKeyList: [] }] }

    }
    // let ptl: any = []
    // let ftl: any = []
    // if (j == 0) {
    //   const pt = this.joinCheckedList[i].dropDownList[j].primaryTableList.filter((x: any) => JSON.parse(JSON.stringify(x)).isSelected == true)[0]
    //   ptl.push(pt)
    //   const ft = this.joinCheckedList[i].dropDownList[j].foreignTableList.filter((x: any) => JSON.parse(JSON.stringify(x)).isSelected == true)[0]
    //   ptl.push(ft)
    //   const fpt = this.joinCheckedList[i].dropDownList[j].primaryTableList.filter((x: any) => JSON.parse(JSON.stringify(x)).isSelected == false)
    //   fpt.forEach((fptObj: any) => ftl.push(fptObj))

    //   const fft = this.joinCheckedList[i].dropDownList[j].foreignTableList.filter((x: any) => JSON.parse(JSON.stringify(x)).isSelected == false)
    //   fft.forEach((fftObj: any) => ftl.push(fftObj))

    //   let ftlUnduplicate: any = []
    //   ftlUnduplicate = ftl.filter((v: any, i: any, a: any) => a.findIndex((v2: any) => ['templateId'].every(k => v2[k] === v[k])) === i)
    //   this.joinCheckedList[i].dropDownList[j + 1] = { primaryTableList: ptl, foreignTableList: ftlUnduplicate }


    //   console.log(this.joinCheckedList);
    //   if (this.joinCheckedList[i].dropDownList[j + 1].foreignTableList.length == 0) {
    //     this.joinCheckedList[i].allTablesSelected = true
    //   }
    // }
    // else {
    //   // const pt = this.mergeCheckedList[i].dropDownList[j].primaryTableList
    //   // ptl=pt
    //   this.joinCheckedList[i].dropDownList[j].primaryTableList.forEach((obj: any) => ptl.push(obj))
    //   const ft = this.joinCheckedList[i].dropDownList[j].foreignTableList.filter((x: any) => x.isSelected == true)[0]
    //   ptl.push(ft)
    //   ptl.primaryKeyList = []
    //   const fft = this.joinCheckedList[i].dropDownList[j].foreignTableList.filter((x: any) => x.isSelected == false)
    //   fft.forEach((fftObj: any) => ftl.push(fftObj))
    //   let ftlUnduplicate = ftl.filter((v: any, i: any, a: any) => a.findIndex((v2: any) => ['templateId'].every(k => v2[k] === v[k])) === i)
    //   ftlUnduplicate.foreignKeyList = []
    //   this.joinCheckedList[i].dropDownList[j + 1] = { primaryTableList: ptl, foreignTableList: ftlUnduplicate }
    //   // this.mergeCheckedList[i].dropDownList[j + 1].primaryTableList.push(ft)
    //   console.log(this.joinCheckedList);
    //   if (this.joinCheckedList[i].dropDownList[j + 1].foreignTableList.length == 0) {
    //     this.joinCheckedList[i].allTablesSelected = true
    //   }
    // }

    console.log(this.joinCheckedList[i].dropDownList[j + 1]);


    // const selectedPT = this.mergeCheckedList[i].dropDownList[0].foreignTableList.filter((x: any) => x.value == value) // o for 1st object
    // this.mergeCheckedList[i].dropDownList.ForeignKeyList = selectedPT[0].sheet;
    // this.mergeCheckedList[i].dropDownList.secondaryKeyList = item.value;
    // console.log(this.mergeCheckedList[i]?.dropDownList?.primaryTableList);
  }


  selectPrimarykey(e: any, k: number, j: any, i: any) { //join
    const value = e.value;

    this.joinCheckedList[i].dropDownList[j].columns.splice(k + 2, this.joinCheckedList[i].dropDownList[j].columns.length)
    this.removeCol(i, j, k + 1)


    let originalPKList = JSON.parse(JSON.stringify(this.joinCheckedList[i].dropDownList[j].columns[k].primaryKeyList))
    originalPKList.forEach((obj: any, index: any) => {
      if (obj.columnId == e.value.columnId) {
        originalPKList.splice(index, 1)
      }
    })

    if (this.joinCheckedList[i].dropDownList[j].columns[k + 1] == undefined) this.joinCheckedList[i].dropDownList[j].columns.push({ primaryKeyList: originalPKList })
    else this.joinCheckedList[i].dropDownList[j].columns[k + 1].primaryKeyList = originalPKList


  }
  selectForeignKey(e: any, k: number, j: any, i: any) { //join
    const value = e.value;

    this.joinCheckedList[i].dropDownList[j].columns.splice(k + 2, this.joinCheckedList[i].dropDownList[j].columns.length)
    this.removeCol(i, j, k + 1)



    let originalPKList = JSON.parse(JSON.stringify(this.joinCheckedList[i].dropDownList[j].columns[k].foreignKeyList))
    originalPKList.forEach((obj: any, index: any) => {
      if (obj.columnId == e.value.columnId) {
        originalPKList.splice(index, 1)
      }
    })

    if (this.joinCheckedList[i].dropDownList[j].columns[k + 1] == undefined) this.joinCheckedList[i].dropDownList[j].columns.push({ foreignKeyList: originalPKList })
    else this.joinCheckedList[i].dropDownList[j].columns[k + 1].foreignKeyList = originalPKList
  }

  selectJoin(e: any, j: any, i: any) { //join
    this.joinCheckedList[i].dropDownList[j].joinType = e.value
    console.log(this.joinCheckedList[i].dropDownList);
  }








  //-JEnd

































































































  //DMStart


  DataSetArr(): FormArray { //DS popup
    return this.dataSetForm.get('DSetRows') as FormArray
  }


  // this.DataSetArr().controls.push(this.DataSetRow())
  // this.DataSetArr().controls.push(this.addDatasetRow())

  //DS 
  DataSetRow(): FormGroup {
    return this.formBuilder.group({
      Ptable: ['', Validators.required],
      join: ['', Validators.required],
      Ftable: ['', Validators.required],
      // Pcolumn: ['', Validators.required],
      // Fcolumn: ['', Validators.required],
      columns: this.formBuilder.array([this.addColumnInDS()])
    })
  }


  addColumnInDS(): FormGroup {
    return this.formBuilder.group({
      column1: ['', Validators.required],
      column2: ['', Validators.required]
    })
  }

  columnArrInDS(i: any): FormArray {
    return this.DataSetArr().controls[i].get('columns') as FormArray
  }






  isValidName(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | any> => {
      let bReturn: boolean = true;
      if (this.appendForm.get("appendNameControl")?.value == '') {
        bReturn = false;
      }
      let err: ValidationErrors = { 'invalid': true };
      return bReturn ? of(null) : of(err);
    };
  }



  getAllFunctions() {
    this.solService.getAllFunctions().subscribe((res: any) => {
      this.fx = res.responseData;
      this.searchfx = res.responseData;
      console.log(res)
      this.loader.hide();
    }, (err: any) => {
      this.loader.hide();
    });
  }




  addOpearatorValueFields(i: number, item: any) {

    item.whereList.push({ signOperatorList: item.signOperatorList, opearatorList: this.opearatorList, value: '' })
  }
  delOpearatorValueFields(j: number, whereObj: any, i: number, item: any) {
    this.createExpressionList[i].whereList.splice(j, 1)
  }
  changeSignOperator(e: any, j: any, whereObj: any, i: number, item: any, listType: string) {
    const value = e.value;
    if (listType == 'parent') {
      this.createExpressionList[i].signOperator = value;
    }
    else {
      whereObj.signOperator = value;
    }
  }

  changeOperator(e: any, j: any, whereObj: any, i: number, item: any) {
    const value = e.value;
    whereObj.operator = value;
  }


  rowClickedDataModeling(obj: any, item: any, i: number, j: number) {
    //this.x = item.fieldName;
    const value = '[' + item.fieldName + ']'
    this.textAreaSlice(value)

    const position = this.textAreaIndexInDM.index;

    //this.inputs.toArray()[this.textAreaIndexInDM.index].nativeElement.setSelectionRange(cursorPosition, cursorPosition);
    //const x = (this.inputs.toArray()[this.textAreaIndexInDM.index].nativeElement as HTMLTextAreaElement);
    //x.setSelectionRange(cursorPosition, cursorPosition)
    //this.renderer.selectRootElement('#' + position+'DMT').focus();

  }



  textAreaSlice(value: any) {
    const textareaVal = this.textAreaIndexinCE.value;
    const cursorPosition = this.textAreaIndexinCE.cursorPosition;
    const newValue = [textareaVal.slice(0, cursorPosition), value, textareaVal.slice(cursorPosition)].join('');
    this.createExpressionList[this.textAreaIndexinCE.index].sourceExpressionName = newValue;
    this.createExpressionForm.get('sourceExpressionName')?.patchValue(newValue)
  }

  textAreaIndexInDM: any = {}; //x
  textAreaInDataModeling(e: any, i: number) { //x
    const start = e.target.selectionStart;
    const end = e.target.selectionEnd;
    const cursorPosition = e.target.value.substr(start, end - start);
    this.textAreaIndexInDM = { index: i, cursorPosition: start, value: e.target.value }
  }

  toggleAllSelection(event: any) {
    const expandTableTrue = this.datasetDetailsList.filter((x: any) => x.isDatasetTableExpand)

    if (event.checked) {


      this.datasetTableForm.get('groupBy')?.patchValue([...expandTableTrue[0].groupBytoDB.map((item: any) => item.dbtablefieldName)]);
    } else {
      this.datasetTableForm.controls.groupBy.patchValue([]);
    }
  }

  createNewDataSet() {
    let dsName = this.datasetForm.get('appendNameControl')?.value.trim()
    this.loader.show()
    this.solService.getExistDataset(dsName, 'dataset').subscribe((res: any) => {
      this.loader.hide()
      this.submited = false
      this.submittedErrorMsg = ''


      this.createExpressionList = [{ excludeInSelect: false, sourceFieldName: '', columnId: '', columnFormat: '', signOperatorList: '', sourceExpressionName: '', isEdit: false, columnType: '', where: '', or: '', groupBy: '', orderBy: '', value: '', signOperator: '', whereList: [] }];
      this.enableDataSetPopUp = false;
      const ds = { isDatasetTableExpand: true, having: '', groupBytoDB: [], orderBytoDB: [], datasetName: dsName, datasetFieldDTOList: [], orderBy: '', groupBy: '' }
      this.datasetDetailsList.push(ds)

      console.log(res);
    }, (err: any) => {
      this.loader.hide()
      this.submited = true
      this.submittedErrorMsg = 'Dataset Name Already Exist!!!'

    })

    // if (this.datasetDetailsList.filter((x: any) => x.datasetName != this.datasetForm.get('appendNameControl')?.value)) {
    // }
    // else {
    //const datasetFieldDTOList = [{ fieldName: '', expression: '', columnType: '', isEdit:false }]

    //}
  }


  saveDataSetDropdowns() {


    this.saveDataSetApi();

  }












  accordionFilesRowClicked(item: any, i: number, comp: any, j: number, listType: any) {
    const value = comp.showTabColName;
    const cType = comp.columnType;
    //const value = (listType == 'JF') ? item.showMergeName + '[' + comp.fieldName + ']' : (listType == 'AF') ? item.showAppendName + '[' + comp.fieldName + ']' : (listType == 'SF') ? comp.fileSheet + '[' + comp.fieldName + ']' : comp.showTabColName
    if (this.textAreaIndexinCE.tagType == 'textArea') this.textAreaSlice(value);
    if (this.textAreaIndexinCE.tagType == 'input') {
      this.createExpressionList[this.textAreaIndexinCE.index].fileType = listType;
      // this.createExpressionList[this.textAreaIndexinCE.index].sourceFieldName = value;
      // this.createExpressionList[this.textAreaIndexinCE.index].columnType = cType;
      this.createExpressionForm.get('sourceFieldName')?.patchValue(value)
      this.createExpressionForm.get('columnType')?.patchValue(cType)
      this.createExpressionList[this.textAreaIndexinCE.index].sqlColumn = comp.sqlColumn;

      if (cType == 'date' || cType == 'datetime2' || cType == 'dateTime') { //copy
        this.createExpressionList[0].isColumnType = true; //it'll b 0 only
        // this.signOperatorList = [{ id: 0, value: 'IS NULL' }, { id: 1, value: 'IS NOT NULL' }, { id: 2, value: 'IN' }, { id: 3, value: 'NOT IN' }, { id: 4, value: '=' }, { id: 5, value: '!=' }, { id: 6, value: '>=' }, { id: 7, value: '>' }, { id: 8, value: '<' }, { id: 9, value: '<=' }]
      }
      else this.createExpressionList[0].isColumnType = false;

      // if (cType == 'char' || cType == 'varchar' || cType == 'text' || cType == 'nvarchar') {
      //   // this.signOperatorList = [{ id: 0, value: 'IS NULL' }, { id: 1, value: 'IS NOT NULL' }, { id: 2, value: 'LIKE' }, { id: 3, value: 'NOT LIKE' }, { id: 4, value: 'NOT IN' }, { id: 5, value: 'IN' }]
      // }

      // if (cType == 'int' || cType == 'float' || cType == 'money' || cType == 'decimal' || cType == 'bigint') {
      //   // this.signOperatorList = [{ id: 0, value: 'IS NULL' }, { id: 1, value: 'IS NOT NULL' }, { id: 2, value: 'IN' }, { id: 3, value: 'NOT IN' }, { id: 4, value: '=' }, { id: 5, value: '!=' }, { id: 6, value: '>=' }, { id: 7, value: '>' }, { id: 8, value: '<' }, { id: 9, value: '<=' }]
      // } //
    }
  }





  //create Expression in DM
  inputInCreateExpression(e: any, i: number) {

    this.createExpressionList[i].sourceFieldName = e.target.value.trim();
    const start = e.target.selectionStart;

    this.textAreaIndexinCE = { index: i, cursorPosition: start, value: e.target.value, tagType: 'input' }

  }

  textAreaIndexinCE: any = {}
  textAreaInCreateExpression(e: any, i: number) {
    this.createExpressionList[i].sourceExpressionName = e.target.value;
    const start = e.target.selectionStart;

    this.textAreaIndexinCE = { index: i, cursorPosition: start, value: e.target.value, tagType: 'textArea' }
  }

  createDataSetinDM() {
    //console.log('this.targetFiles',this.targetFiles);
    // console.log('this.allTableListWithoutDSInDM', this.allTableListWithoutDSInDM);
    // console.log('this.allTableListInDM', this.allTableListInDM);
    //console.log('this.tablecolNameList', this.tablecolNameList);  //for expn
    console.log('this.datasetDetailsList', this.datasetDetailsList);
    console.log('this.allDatasetDetailsList', this.allDatasetDetailsList);
    this.unChecksAllInDM(false)

    this.createExpressionForm.reset()

    const filteredList = this.datasetDetailsList.filter((x: any) => x.isDatasetTableExpand == true)
    if (filteredList.length == 1) {
      return;
    }
    this.enableDataSetPopUp = true;
    this.datasetForm.get("appendNameControl")?.reset();
  }

  accordionExpValue(obj: any, value: any) {
    this.textAreaSlice(obj.functionType)
    this.isOpenAccordion = false;
  }


  changeDTinCreateExpression(e: any, i: number) {
    this.createExpressionList[i].columnType = e.value;
    if (e.value == 'date' || e.value == 'datetime2' || e.value == 'datetime') {
      this.createExpressionList[i].isColumnType = true;
      this.signOperatorList = [{ id: 0, value: 'IS NULL' }, { id: 1, value: 'IS NOT NULL' }, { id: 2, value: 'IN' }, { id: 3, value: 'NOT IN' }, { id: 4, value: '=' }, { id: 5, value: '!=' }, { id: 6, value: '>=' }, { id: 7, value: '>' }, { id: 8, value: '<' }, { id: 9, value: '<=' }]
    }
    else this.createExpressionList[i].isColumnType = false;

    if (e.value == 'char' || e.value == 'varchar' || e.value == 'text' || e.value == 'nvarchar') {
      this.signOperatorList = [{ id: 0, value: 'IS NULL' }, { id: 1, value: 'IS NOT NULL' }, { id: 2, value: 'LIKE' }, { id: 3, value: 'NOT LIKE' }, { id: 4, value: 'NOT IN' }, { id: 5, value: 'IN' }]
    }

    if (e.value == 'int' || e.value == 'float' || e.value == 'money' || e.value == 'decimal' || e.value == 'bigint') {
      this.signOperatorList = [{ id: 0, value: 'IS NULL' }, { id: 1, value: 'IS NOT NULL' }, { id: 2, value: 'IN' }, { id: 3, value: 'NOT IN' }, { id: 4, value: '=' }, { id: 5, value: '!=' }, { id: 6, value: '>=' }, { id: 7, value: '>' }, { id: 8, value: '<' }, { id: 9, value: '<=' }]
    }
    this.createExpressionList[i].whereList = [];
  }

  changeDateTimeinCreateExpression(e: any, i: number) {
    this.createExpressionList[i].columnFormat = e.value.value;
  }





  datasetTableExpand(item: any, i: number) {
    // this.datasetDetailsList[i].isDatasetTableExpand = (item.isDatasetTableExpand) ? false : true;
    // item.isDatasetTableExpand = (item.isDatasetTableExpand) ? false : true;

    this.datasetDetailsList[i].isDatasetTableExpand = true;
    item.isDatasetTableExpand = (item.isDatasetTableExpand) = true;
  }


  editRowInDataSet(i: number, j: number, item: any) {
    this.datasetDetailsList[i].datasetFieldDTOList.forEach((obj: any) => obj.isEdit = false)
    item.isEdit = true;
    this.createExpressionList = [];

    if (item.isColumnType == true) {
      this.createExpressionForm.patchValue({ sourceFieldName: item.sourceFieldName, excludeInSelect: item.excludeInSelect, columnType: item.columnType, columnFormat: item.columnFormat, sourceExpressionName: item.sourceExpressionName })
    }
    else {
      this.createExpressionForm.patchValue({ sourceFieldName: item.sourceFieldName, excludeInSelect: item.excludeInSelect, columnType: item.columnType, sourceExpressionName: item.sourceExpressionName })
    }

    this.createExpressionList.push(JSON.parse(JSON.stringify(item)));
  }

  deleteRowInDataset(i: number, j: number, item: any) {
    if (this.datasetDetailsList[i].datasetFieldDTOList[j].isEdit == true) this.createExpressionList = [{ sourceFieldName: '', columnId: '', sourceExpressionName: '', isEdit: false, columnType: '', where: '', or: '', groupBy: '', orderBy: '', value: '', signOperator: '', whereList: [] }];
    //clearing CE if edited row is deleted

    this.datasetDetailsList[i]?.datasetFieldDTOList.splice(j, 1);

    //changes update in orderby,groupby
    this.datasetDetailsList[i]?.orderBytoDB.forEach((obObj: any, index: number) => {
      if (item.sourceFieldName == obObj.filefieldName) this.datasetDetailsList[i]?.orderBytoDB.splice(index, 1)
    })
    this.datasetDetailsList[i]?.groupBytoDB.forEach((gbObj: any, index: number) => {
      if (item.sourceFieldName == gbObj.filefieldName) this.datasetDetailsList[i]?.groupBytoDB.splice(index, 1)
    })
    this.columnsForWhereInDS.forEach((colmnObj: any, index: number) => { //2jan
      if (item.sourceFieldName == colmnObj.filefieldName) this.columnsForWhereInDS.splice(index, 1)
    })
    this.UpdatechecksInDM(item, false)

  }

  tablecolNameList: any[] = []
  getAllDataSetNameAPI() {
    this.solService.getAllDatasetName(this.process.processId).subscribe((res: any) => {
      if (res != null) {
        res.responseData.forEach((datasetObj: any) => {
          datasetObj.isSelectAllParentInDM = false
          const gbob: any[] = []
          datasetObj.datasetFieldDTOList.forEach((colObj: any) => {
            colObj.isSelectAllChildInDM = false
            colObj.showTabColName = datasetObj.datasetName + '[' + colObj.fieldName + ']'

            // colObj.groupBy = ''
            if (colObj.columnType == 'date' || colObj.columnType == 'datetime2' || colObj.columnType == 'datetime') colObj.isColumnType = true
            else colObj.isColumnType = false //ce
            colObj.isEdit = false
            colObj.or = ''
            // colObj.orderBy = ''
            // colObj.signOperatorList = ''
            // colObj.signOperator = '' 
            // colObj.value = ''


            const wL = colObj.where
            const tcName = colObj.tableName + '.' + colObj.columnName

            const splitt = colObj.where.split(' ').join().split(tcName).join().split(',')



            if (splitt.join() == '')
              gbob.push({ filefieldName: colObj.sourceFieldName, dbtablefieldName: colObj.tableName + '.' + colObj.columnName })
          })
          datasetObj.isDatasetTableExpand = false
          datasetObj.orderBytoDB = gbob
          datasetObj.groupBytoDB = gbob


        })
        this.allDatasetDetailsList = res.responseData;



        res.responseData.forEach((dsObj: any) => { //shd write cndtn if no DSs
          dsObj.datasetFieldDTOList.forEach((colObj: any) => {
            colObj.fileType = 'dataset',
              colObj.fieldIDforExpn = colObj.datasetFieldId //for expn
          })
          this.allTableListInDM.push({ fileType: 'dataset', tableNameUI: dsObj.datasetName, tableNameDB: dsObj.tableName, idName: 'datasetId', ID: dsObj.datasetId, columnList: dsObj.datasetFieldDTOList, isSelecteddl: false })
        })

        console.log('getalldsapi', this.allTableListInDM);

        // this.tablecolNameList.forEach((obj: any, index: number) => { //need to check
        //   if (obj.fileType == 'dataset') {
        //     this.tablecolNameList.splice(index, 1)
        //   }
        // })

      }
      this.tablecolNameList = []
      this.tablecolNameList = this.allTableListInDM.map((ele: any) =>
        ele.columnList.map((sub: any) => ({
          tableNameUI: ele.tableNameUI, tableNameDB: ele.tableNameDB, fileType: ele.fileType, fieldID: ele.fieldID, showTabColName: sub.showTabColName,
          fieldIDforExpn: sub.fieldIDforExpn, tableColumnName: sub.tableColumnName, columnName: sub.columnName
        }))
      ).reduce((acc, val) => acc.concat(val), []);
      this.loader.hide()
    }, (err: any) => {
      this.loader.hide()

    })
  }


  deleteDataSet(i: number) {
    this.datasetDetailsList.splice(i, 1)
    this.createExpressionList = []
    this.datasetDetailsList = []
    this.clearWhereInDS()
  }





  isAllSelected(e: any, item: any, i: number, j: number) {
    this.submitted = false;
    this.submittedErrorMsg = '';
    this.hideCreateIdenticalBtnWithLength = true; //cndtn may req
    //this.sortedList[i][j].isSelected  = e.target.checked;
    this.sortedList.forEach((obj: any, index: number) => {
      if (index == i) {
        obj.forEach((item: any, index: any) => {
          if (index == j) {
            item.isSelected = e.target.checked;
          }
        })
      }
    })
  }






  // resetMerge() {
  //   this.mergeCheckedList = []; //x
  //   const appendList = this.appendUnchechedList.filter((x: any) => x.isAppend == true)
  //   const unAppendList = this.appendUnchechedList.filter((x: any) => x.isAppend == undefined) //add false
  //   console.log(this.sortedCheckedList, 'reset merge')
  //   if (appendList.length > 0) {
  //     this.sortedCheckedList = JSON.parse(JSON.stringify(appendList))
  //   }
  //   if (appendList.length == 0) { //added for reset
  //     this.sortedCheckedList = JSON.parse(JSON.stringify(appendList))
  //   }
  //   if (unAppendList.length > 0) {
  //     const filteredList = unAppendList.map(x => x.tableList[0])
  //     this.sortedList[0] = JSON.parse(JSON.stringify(filteredList))
  //   }
  //   this.changeTabs({ id: 3 }, 'unChedkedList')
  //   this.MergeArr().clear();
  // }












  singleTableDatasetsave: boolean = false;
  viewScriptFromApi: string = '';
  submitedDS: boolean = false
  saveDataSetApi() {

    this.loader.show();  //R
    let datasetObj: any = {};
    datasetObj.processId = this.process.processId;


    if (this.enableUploadSQLPopup) {
      this.submited = true; //UPLOAD SQL SCRIPT VALIDATION
      //console.log(this.sqlScriptForm);
      if (this.sqlScriptForm.invalid) {
        return;
      }
      datasetObj.datasetName = this.sqlScriptForm.value.datasetName;
      datasetObj.sqlScript = this.sqlScriptForm.value.sqlScript;

      this.solService.addDataset(datasetObj).subscribe(async (res: any) => { //copy
        // this.allTableListInDM.forEach((obj: any, index: number) => {
        //   if (obj.fileType == 'dataset') {
        //     this.allTableListInDM.splice(index, 1) //removing from list for rem duplicts
        //   }
        // })
        await this.getAllDataSetNameAPI();
        this.enableUploadSQLPopup = false;
        this.loader.hide()
      }, (err: any) => {
        this.loader.hide()
      });//
    }
    else {
      this.submitedDS = true
      // if (this.dataSetForm.invalid) {
      let d = 0
      this.DataSetArr().controls.forEach((dsObj: any) => {
        if (dsObj.invalid) d = 1
      })
      if (d == 1) {
        this.popup.open(false, "Enter all the required fields");

        // this.toast.error({ title: 'Error', message: "Enter all the required fields" });
        return;
      }

      datasetObj.dataSetMergeListDTOs = [];

      this.DataSetArr().controls.forEach((eee: any, i: any) => {
        datasetObj.dataSetMergeListDTOs[i] = {}

        if (eee.value.Ptable.fileType == 'append') datasetObj.dataSetMergeListDTOs[i].primaryTemplateId = eee.value.Ptable.ID
        else if (eee.value.Ptable.fileType == 'join') datasetObj.dataSetMergeListDTOs[i].primaryTemplateId = eee.value.Ptable.ID
        else if (eee.value.Ptable.fileType == 'files') datasetObj.dataSetMergeListDTOs[i].primaryTemplateId = eee.value.Ptable.ID
        else if (eee.value.Ptable.fileType == 'dataset') datasetObj.dataSetMergeListDTOs[i].primaryTemplateId = eee.value.Ptable.ID



        if (eee.value.Ftable.fileType == 'append') datasetObj.dataSetMergeListDTOs[i].secondaryTemplateId = eee.value.Ftable.ID
        else if (eee.value.Ftable.fileType == 'join') datasetObj.dataSetMergeListDTOs[i].secondaryTemplateId = eee.value.Ftable.ID
        else if (eee.value.Ftable.fileType == 'files') datasetObj.dataSetMergeListDTOs[i].secondaryTemplateId = eee.value.Ftable.ID
        else if (eee.value.Ftable.fileType == 'dataset') datasetObj.dataSetMergeListDTOs[i].secondaryTemplateId = eee.value.Ftable.ID

        if (eee.value.Ptable.fileType == "files") datasetObj.dataSetMergeListDTOs[i].primaryTableName = eee.value.Ptable.tableNameDB
        else datasetObj.dataSetMergeListDTOs[i].primaryTableName = eee.value.Ptable.tableNameDB

        if (eee.value.Ftable.fileType == "files") datasetObj.dataSetMergeListDTOs[i].secondaryTableName = eee.value.Ftable.tableNameDB
        else datasetObj.dataSetMergeListDTOs[i].secondaryTableName = eee.value.Ftable.tableNameDB

        datasetObj.dataSetMergeListDTOs[i].columnArrayList = []
        this.columnArrInDS(i).controls.forEach((child: any, j: any) => {
          datasetObj.dataSetMergeListDTOs[i].columnArrayList[j] = {}

          if (child.value.column1.fileType == 'append') datasetObj.dataSetMergeListDTOs[i].columnArrayList[j].primaryKeyId = child.value.column1.fieldID
          else if (child.value.column1.fileType == 'join') datasetObj.dataSetMergeListDTOs[i].columnArrayList[j].primaryKeyId = child.value.column1.columnId
          else if (child.value.column1.fileType == 'files') datasetObj.dataSetMergeListDTOs[i].columnArrayList[j].primaryKeyId = child.value.column1.columnId
          else if (child.value.column1.fileType == 'dataset') datasetObj.dataSetMergeListDTOs[i].columnArrayList[j].primaryKeyId = child.value.column1.datasetFieldId


          if (child.value.column2.fileType == 'append') datasetObj.dataSetMergeListDTOs[i].columnArrayList[j].secondaryKeyId = child.value.column2.fieldID
          else if (child.value.column2.fileType == 'join') datasetObj.dataSetMergeListDTOs[i].columnArrayList[j].secondaryKeyId = child.value.column2.columnId
          else if (child.value.column2.fileType == 'files') datasetObj.dataSetMergeListDTOs[i].columnArrayList[j].secondaryKeyId = child.value.column2.columnId
          else if (child.value.column2.fileType == 'dataset') datasetObj.dataSetMergeListDTOs[i].columnArrayList[j].secondaryKeyId = child.value.column2.datasetFieldId

          datasetObj.dataSetMergeListDTOs[i].columnArrayList[j].primaryFieldName = child.value.column1.columnName
          datasetObj.dataSetMergeListDTOs[i].columnArrayList[j].secondaryFieldName = child.value.column2.columnName

        })

        datasetObj.dataSetMergeListDTOs[i].joinType = eee.value.join.slice(0, 1)
        datasetObj.dataSetMergeListDTOs[i].order = i


        console.log(eee.value, eee);
        console.log(eee.controls.Ptable.value);
      });

      const colList: any[] = [];
      const expandTableTrue = this.datasetDetailsList.filter((x: any) => x.isDatasetTableExpand)
      expandTableTrue[0].datasetFieldDTOList.forEach((datasetField: any) => {
        if (datasetField.sourceExpressionName != null) {
          if (datasetField.sourceExpressionName.trim() == '' || datasetField.sourceExpressionName.trim().length == 0) datasetField.sourceExpressionName = null
        }
        let expn = datasetField.sourceExpressionName;
        // if (expn.length == 0 || expn == '' || expn == null) { 
        //if (datasetField.sourceFieldName.includes('[')) { //without expression
        // this.tablecolNameList.forEach((obj: any) => {
        //   if (datasetField.sourceFieldName.includes(obj.showTabColName)) {
        //     expn = JSON.parse(JSON.stringify(datasetField.sourceFieldName.split(obj.showTabColName).join(obj.fieldIDforExpn)))
        //   }
        // })
        //}
        //}
        // else {
        let tableNameForManualColumnName!: string
        if (expn != null) {
          this.tablecolNameList.forEach((obj: any) => {
            if (expn.includes(obj.showTabColName)) {
              expn = JSON.parse(JSON.stringify(expn.split(obj.showTabColName).join(obj.tableColumnName)))
              tableNameForManualColumnName = obj.tableNameDB

            }
          })
        }
        //}
        if (datasetField.tableName == undefined) datasetField.tableName = tableNameForManualColumnName
        if (!datasetField.isColumnType) datasetField.columnFormat = null
        colList.push({
          tableName: datasetField.tableName,
          columnFormat: datasetField.columnFormat, excludeInSelect: datasetField.excludeInSelect, columnName: datasetField.columnName, fieldName: datasetField.fieldName, expression: expn, columnType: datasetField.columnType,
          where: datasetField.where, or: datasetField.or, groupBy: '', sourceFieldName: datasetField.sourceFieldName, sourceExpressionName: datasetField.sourceExpressionName
        })

      })
      datasetObj.datasetFieldDTOList = colList;
      datasetObj.datasetName = expandTableTrue[0].datasetName;

      let groupByVal = this.datasetTableForm.get('groupBy')?.value
      let havingVal = this.datasetTableForm.get('having')?.value
      let orderByVal = this.datasetTableForm.get('orderBy')?.value
      if (groupByVal == '') datasetObj.groupBy = null;
      else datasetObj.groupBy = groupByVal.join();
      if (orderByVal == '') datasetObj.orderBy = null;
      else datasetObj.orderBy = orderByVal.join();
      if (havingVal != null) {
        if (havingVal.trim() == '') datasetObj.having = null;
        else datasetObj.having = havingVal;
      }
      datasetObj.calender = ''


      //2jan
      let whereQuery: any[] = [];
      let uiWhere: Array<any> = []
      this.whereArrInDS().controls.forEach((whereObj: any, index: number) => {
        //console.log(whereObj);
        console.log(whereObj.controls.column.value);
        console.log(whereObj.controls.signOperator.value);
        console.log(whereObj.controls.value.value);
        let column = whereObj.controls.column.value.dbtablefieldName
        let signOperator = whereObj.controls.signOperator.value
        let value = whereObj.controls.value.value
        if (index == 0) {
          if (signOperator != '') {
            if (signOperator == 'IS NULL' || signOperator == 'IS NOT NULL') {
              whereQuery = [column + ' ' + signOperator]
            }
            else {
              whereQuery = [column + ' ' + signOperator + ' ' + value]
            }
          }
          if (signOperator == 'IS NULL' || signOperator == 'IS NOT NULL') uiWhere.push({ fieName: whereObj.controls.column.value.filefieldName, signOperator: signOperator, value: '' })
          else uiWhere.push({ fieName: whereObj.controls.column.value.filefieldName, signOperator: signOperator, value: value })
        }
        else {
          console.log(whereObj.controls.operator.value);
          let operator = whereObj.controls.operator.value
          let x: any;
          if (signOperator != '') {
            if (signOperator == 'IS NULL' || signOperator == 'IS NOT NULL') {
              x = operator + ' ' + column + ' ' + signOperator
            }
            else {
              x = operator + ' ' + column + ' ' + signOperator + ' ' + value;
            }
          }
          whereQuery.push(x)

          if (signOperator == 'IS NULL' || signOperator == 'IS NOT NULL') uiWhere.push({ operator: operator, fieName: whereObj.controls.column.value.filefieldName, signOperator: signOperator, value: '' })
          else uiWhere.push({ operator: operator, fieName: whereObj.controls.column.value.filefieldName, signOperator: signOperator, value: value })
        }
      })
      datasetObj.where = whereQuery.join(' ')
      datasetObj.uiWhere = JSON.stringify(uiWhere)
      // if (expandTableTrue[0].groupBy.trim() == '' || expandTableTrue[0].groupBy.trim().length == 0) datasetObj.groupBy = null;
      // else datasetObj.groupBy = expandTableTrue[0].groupBy;

      // if (expandTableTrue[0].orderBy.trim() == '' || expandTableTrue[0].orderBy.trim().length == 0) datasetObj.orderBy = null;
      // else datasetObj.orderBy = expandTableTrue[0].orderBy;

      // if (expandTableTrue[0].having.trim() == '' || expandTableTrue[0].having.trim().length == 0) datasetObj.having = null;
      // else datasetObj.having = expandTableTrue[0].having;
      datasetObj.calender = ''
      if (expandTableTrue[0].datasetId) datasetObj.datasetId = expandTableTrue[0].datasetId
      this.solService.addDataset(datasetObj).subscribe(async (res: any) => {

        this.clearWhereInDS()


        this.allTableListInDM.forEach((obj: any, index: number) => {
          if (obj.fileType == 'dataset') {
            this.allTableListInDM.splice(index, 1) //removing from list for rem duplicts
          }
        })
        this.tablecolNameList.forEach((obj: any, index: number) => { //need to check
          if (obj.fileType == 'dataset') {
            this.tablecolNameList.splice(index, 1)
          }
        })
        await this.getAllDataSetNameAPI();


        this.unChecksAllInDM(false)

        this.loader.hide()
        //expandTableTrue[0].isDatasetTableExpand = false;
        this.saveDataSetPopup = false;
        this.createExpressionList = []; //clearing CE,DS list 
        this.datasetDetailsList = []
      }, (err: any) => {
        this.loader.hide()
      });
    }
  }

  clearWhereInDS() {
    this.columnsForWhereInDS = [] //columns of where
    this.datasetTableForm.controls.where = this.fb.array([this.whereFirstRow()])
    this.datasetTableForm.patchValue({ having: '', groupBy: '', orderBy: '' })
    // this.datasetTableForm.get('having')?.reset()
    // this.datasetTableForm.get('groupBy')?.reset()
    // this.datasetTableForm.get('orderBy')?.reset()
  }
  enableViewScriptDSPopup: boolean = false
  callGetViewscript(datasetObj: any) {
    this.loader.show();
    const datasetId = datasetObj.datasetId;
    this.solService.getViewScript(datasetId).subscribe((res: any) => {
      this.viewscriptForm.get("sqlScript")?.patchValue(res?.responseData.sqlScript)
      this.viewscriptForm.get("datasetId")?.patchValue(res?.responseData.datasetId)
      this.enableViewScriptDSPopup = true;
      this.loader.hide()
    }, (err: any) => {
      this.loader.hide()
    });
  }

  updateScriptByDatasetId(viewscriptForm: any) { //underconstruction
    if (this.viewscriptForm.invalid || this.viewscriptForm.controls.sqlScript.value.trim() == '') {
      this.popup.open(false, "Script shouldn't be empty");

      // this.toast.error({ title: 'Error', message: "Script shouldn't be empty" });
      return;
    }
    this.loader.show();
    const data = {
      datasetId: viewscriptForm.value.datasetId,
      newScript: viewscriptForm.value.sqlScript.trim()
    }
    this.solService.updateScriptByDatasetId(data).subscribe((res: any) => {
      this.viewscriptForm.get("sqlScript")?.patchValue(res?.responseData.newScript)
      this.viewscriptForm.get("datasetId")?.patchValue(res?.responseData.datasetId)
      this.enableViewScriptDSPopup = false;
      this.popup.open(true, "update Script Successfully");
      // this.toast.success({ title: 'Success', message: "update Script Successfully" });

      this.loader.hide()
    }, (err: any) => {
      this.popup.open(false, "update Script Failed! (Syntax Error)");
      // this.toast.error({ title: 'Error', message: "update Script Failed! (Syntax Error)" });
      this.loader.hide()
    });
  }

  editDatasetFile(datasetObj: any) {
    this.createExpressionList = [{ excludeInSelect: false, sourceFieldName: '', columnId: '', sourceExpressionName: '', isEdit: false, columnType: '', where: '', or: '', groupBy: '', orderBy: '', value: '', signOperator: '', whereList: [] }];
    datasetObj.isDatasetTableExpand = true;


    this.datasetDetailsList[0] = datasetObj;
    let oB: any[] = []
    let gB: any[] = []
    if (datasetObj.orderBy != null) oB = datasetObj.orderBy.split(',')
    if (datasetObj.groupBy != null) gB = datasetObj.groupBy.split(',')
    this.datasetTableForm.get('orderBy')?.patchValue(oB)
    this.datasetTableForm.get('groupBy')?.patchValue(gB)
    this.datasetTableForm.get('having')?.patchValue(datasetObj.having)

    this.columnsForWhereInDS = []
    datasetObj.datasetFieldDTOList.forEach((dsField: any) => {
      if (dsField.sourceFieldName.includes('[')) {
        this.columnsForWhereInDS.push({
          filefieldName: dsField.sourceFieldName,
          dbtablefieldName: dsField.tableName + '.' + dsField.columnName,
          dataType: dsField.columnType
        })
      }
      else {
        this.columnsForWhereInDS.push({
          filefieldName: dsField.sourceFieldName,
          dbtablefieldName: dsField.expression,
          dataType: dsField.columnType
        })
      }
    })


    let uIWhere = JSON.parse(datasetObj.uiWhere)
    this.datasetTableForm.controls.where = this.fb.array([this.whereFirstRow()])

    uIWhere.forEach((obj: any, i: number) => {
      if (i == 0) {
        this.columnsForWhereInDS.forEach((col: any) => {
          if (col.filefieldName == obj.fieName) {
            this.whereArrInDS().controls[i].patchValue({
              column: col,
              signOperator: obj.signOperator,
              value: obj.value
            })
            this.changeColumnInDSForWhere(0, i, 0, 0)
          }
        })

      }
      else {
        this.whereArrInDS().push(this.whereRemainingRows())
        this.columnsForWhereInDS.forEach((col: any) => {
          if (col.filefieldName == obj.fieName) {
            this.whereArrInDS().controls[i].patchValue({
              operator: obj.operator,
              column: col,
              signOperator: obj.signOperator,
              value: obj.value
            })
            this.changeColumnInDSForWhere(0, i, 0, 0)

          }
        })
      }
    })
  }


  searchfx: any[] = []
  applyFilter(event: any) { //underconstruction
    //this.searchfx = this.fx.filter((user: any) => this.containsValue(user, event.target.value.trim().toLowerCase()));
    // //console.log("msg",this.messagesSearch);
    // this.fx = of(this.messagesSearch);
    this.searchfx = this.fx.filter((p: any) => p).map((p: any) => {
      let child = p.funcDescritptionsList.filter((s: any) => s.functionType.toLowerCase().includes(event.target.value.toLowerCase()));
      return p.functionName.toLowerCase().includes(event.target.value.toLowerCase()) ? { ...p, funcDescritptionsList: child } : child.length > 0 ? { ...p, funcDescritptionsList: child } : {};
    }).filter((value: any) => Object.keys(value).length !== 0);
  }
  containsValue(userObj: any, searchValue: any) {
    return Object.values(userObj).reduce((prev, cur: any) => {
      if (cur != null) {
        cur = cur.toString().trim().toLowerCase();
        // console.log(cur);
      }
      return prev || cur?.indexOf(searchValue) > -1;
    }, false)

  }
  selectuser(e: any, item: any) {
    const value = e.value;
  }




  selectgroupByOrderByInDM(e: any, item: any, i: number, type: any) {
    const selectedList = e.value;
    let allFiles = e.value.map((x: any) => x.dbtablefieldName).join()

    if (type == 'groupby') this.datasetDetailsList.filter((x: any) => x.isDatasetTableExpand == true)[0].groupBy = allFiles;
    if (type == 'orderby') this.datasetDetailsList.filter((x: any) => x.isDatasetTableExpand == true)[0].orderBy = allFiles;
  }






  //DM
  allTableListInDM: any[] = [];
  allTableListWithoutDSInDM: any[] = []
  allList() {
    this.allTableListInDM = [];
    this.targetFiles.forEach((fileObj: any, index: number) => {
      //let columnList: any[] = [];
      if (fileObj.fileType == 'append')
        fileObj.sheetList.forEach((TabObj: any) => {

          TabObj.tableAppendFieldsDto.forEach((colObj: any) => {
            colObj.fileType = fileObj.fileType,
              colObj.fieldIDforExpn = colObj.fieldID //for expn
          })
          this.allTableListInDM.push({ fileType: fileObj.fileType, tableNameUI: TabObj.appendName, tableNameDB: TabObj.tableName, idName: 'appendID', ID: TabObj.appendID, appendID: TabObj.appendID, columnList: TabObj.tableAppendFieldsDto, isSelecteddl: false })

        })
      else if (fileObj.fileType == 'join') {
        fileObj.sheetList.forEach((TabObj: any) => {

          TabObj.mergeFieldListDTO.forEach((colObj: any) => {
            colObj.fileType = fileObj.fileType,
              colObj.fieldIDforExpn = colObj.columnId //for expn
          })
          this.allTableListInDM.push({ fileType: fileObj.fileType, tableNameUI: TabObj.mergeName, tableNameDB: TabObj.tableName, idName: 'mergeId', ID: TabObj.mergeId, mergeId: TabObj.mergeId, columnList: TabObj.mergeFieldListDTO, isSelecteddl: false })

        })
      }
      else if (fileObj.fileType == 'files') {
        fileObj.sheetList.forEach((TabObj: any) => {
          if (TabObj.sheet != null) {
            TabObj.sheet.forEach((colObj: any) => {
              colObj.fileType = fileObj.fileType,
                colObj.fieldIDforExpn = colObj.columnId //for expn
            })
          }
          this.allTableListInDM.push({ fileType: fileObj.fileType, tableNameUI: TabObj.fileName, tableNameDB: TabObj.tableName, idName: 'templateId', ID: TabObj.templateId, templateId: TabObj.templateId, columnList: TabObj.sheet, isSelecteddl: false })

        })
      }
    })
    this.allTableListWithoutDSInDM = []
    this.allTableListWithoutDSInDM = JSON.parse(JSON.stringify(this.allTableListInDM))
    console.log('getall()', this.allTableListInDM);
    this.getAllDataSetNameAPI();

  }
  closeDatasetPopup() {
    this.dataSetForm.controls.DSetRows = this.fb.array([])
    this.saveDataSetPopup = false;
  }


  //datasetDetailsListShowList: any[] = [];
  selectedColumnsOfDS: any[] = []; //can b remvd
  saveDataSetPopup: boolean = false;
  dropDownsInDS: any[] = []
  enableDatasetColumnsExceed: boolean = false;
  saveDatasetRowsLength: any = {}
  saveDataSet(obj: any, i: number) {
    this.saveDatasetRowsLength = {}
    const expandTableTrue = this.datasetDetailsList.filter((x: any) => x.isDatasetTableExpand)
    if (expandTableTrue[0].datasetFieldDTOList.length == 0) return
    if (expandTableTrue[0].datasetFieldDTOList.length > 75) {
      this.enableDatasetColumnsExceed = true
      this.saveDatasetRowsLength.length = expandTableTrue[0].datasetFieldDTOList.length
      return
    }
    let tablesInExpression: Array<any> = []
    this.submitedDS = false
    this.selectedColumnsOfDS = [];
    obj?.datasetFieldDTOList.forEach((ds: any) => {
      let tableName: any;
      if (ds.sourceFieldName.includes('[')) {
        tableName = ds.sourceFieldName.split('[')[0]
      }
      else {
        tableName = ds.tableName
      }

      const sourceFieldName = ds.sourceFieldName;
      this.allTableListInDM.forEach((tabObj: any) => {

        expandTableTrue[0].datasetFieldDTOList.forEach((datasetField: any) => { //extract tablecolumns from expn
          let expn = datasetField.sourceExpressionName;
          if (expn != null) {
            this.tablecolNameList.forEach((obj: any) => {
              if (expn.includes(obj.showTabColName)) {
                tablesInExpression.push(obj.tableNameUI)
              }
            })
          }
        })

        if (tabObj.fileType == 'files') {
          if (tabObj.tableNameUI == tableName) {
            let fFileSheet = this.selectedColumnsOfDS.filter((x: any) => x.tableNameUI == tabObj.tableNameUI)
            if (fFileSheet.length == 0) {
              this.selectedColumnsOfDS.push({ ...tabObj, isSelecteddl: false })
            }
          }
        }

        else {
          if (tabObj.tableNameUI == tableName) {
            let tblLength = this.selectedColumnsOfDS.filter((x: any) => x.tableNameUI == tabObj.tableNameUI)
            if (tblLength.length == 0) {
              this.selectedColumnsOfDS.push({ ...tabObj, isSelecteddl: false })
            }
          }
        }
      })
    })

    tablesInExpression = [...new Set(tablesInExpression)]

    tablesInExpression.forEach((tableName: any) => {
      this.allTableListInDM.forEach((tabObj: any) => {
        if (tableName.includes(tabObj.tableNameUI)) {
          let tblLength = this.selectedColumnsOfDS.filter((x: any) => x.tableNameUI == tableName)
          if (tblLength.length == 0) {
            this.selectedColumnsOfDS.push({ ...tabObj, isSelecteddl: false })
          }
        }
      })
    })
    // this.selectedColumnsOfDS.forEach((object: any, index: number) => {
    //   if (object.tableNameUI == expandTableTrue[0].datasetName) this.selectedColumnsOfDS.splice(index, 1)
    // })
    console.log('this.selectedColumnsOfDS', this.selectedColumnsOfDS);



    if (this.selectedColumnsOfDS.length < 2) {
      let datasetObj: any = {};
      datasetObj.processId = this.process.processId;
      if (this.selectedColumnsOfDS.length == 1) {
        if (this.selectedColumnsOfDS[0].fileType == 'append') datasetObj.dataSetMergeListDTOs = [{ primaryTemplateId: this.selectedColumnsOfDS[0].ID, primaryTableName: this.selectedColumnsOfDS[0].tableNameDB }]
        else if (this.selectedColumnsOfDS[0].fileType == 'join') datasetObj.dataSetMergeListDTOs = [{ primaryTemplateId: this.selectedColumnsOfDS[0].ID, primaryTableName: this.selectedColumnsOfDS[0].tableNameDB }]
        else if (this.selectedColumnsOfDS[0].fileType == 'files') datasetObj.dataSetMergeListDTOs = [{ primaryTemplateId: this.selectedColumnsOfDS[0].ID, primaryTableName: this.selectedColumnsOfDS[0].tableNameDB }]
        else if (this.selectedColumnsOfDS[0].fileType == 'dataset') datasetObj.dataSetMergeListDTOs = [{ primaryTemplateId: this.selectedColumnsOfDS[0].ID, primaryTableName: this.selectedColumnsOfDS[0].tableNameDB }]
      }
      else if (this.selectedColumnsOfDS.length == 0) {
        datasetObj.dataSetMergeListDTOs = [];
      }
      const colList: any[] = [];
      const expandTableTrue = this.datasetDetailsList.filter((x: any) => x.isDatasetTableExpand)
      expandTableTrue[0].datasetFieldDTOList.forEach((datasetField: any) => {
        if (datasetField.sourceExpressionName != null) {
          if (datasetField.sourceExpressionName.trim() == '' || datasetField.sourceExpressionName.trim().length == 0) datasetField.sourceExpressionName = null
        }
        let expn = datasetField.sourceExpressionName
        // if (expn.length == 0 || expn == '' || expn == null) {
        //   if (datasetField.sourceFieldName.includes('[')) { //without expression
        //     this.tablecolNameList.forEach((obj: any) => {
        //       if (datasetField.sourceFieldName.includes(obj.showTabColName)) {
        //         expn = JSON.parse(JSON.stringify(datasetField.sourceFieldName.split(obj.showTabColName).join(obj.fieldIDforExpn)))
        //       }
        //     })
        //   }
        // }
        // else {
        let tableNameForManualColumnName!: string
        if (expn != null) {
          this.tablecolNameList.forEach((obj: any) => {
            if (expn.includes(obj.showTabColName)) {
              expn = JSON.parse(JSON.stringify(expn.split(obj.showTabColName).join(obj.tableColumnName)))
              tableNameForManualColumnName = obj.tableNameDB

            }
          })
        }
        //  }
        if (datasetField.tableName == undefined) datasetField.tableName = tableNameForManualColumnName
        if (!datasetField.isColumnType) datasetField.columnFormat = null
        colList.push({ tableName: datasetField.tableName, excludeInSelect: datasetField.excludeInSelect, columnFormat: datasetField.columnFormat, columnName: datasetField.columnName, fieldName: datasetField.fieldName, expression: expn, columnType: datasetField.columnType, where: datasetField.where, or: datasetField.or, groupBy: '', sourceFieldName: datasetField.sourceFieldName, sourceExpressionName: datasetField.sourceExpressionName })

      })
      datasetObj.datasetFieldDTOList = colList;
      datasetObj.datasetName = expandTableTrue[0].datasetName;



      let groupByVal = this.datasetTableForm.get('groupBy')?.value
      let havingVal = this.datasetTableForm.get('having')?.value
      let orderByVal = this.datasetTableForm.get('orderBy')?.value
      if (groupByVal == '') datasetObj.groupBy = null;
      else datasetObj.groupBy = groupByVal.join();

      if (orderByVal == '') datasetObj.orderBy = null;
      else datasetObj.orderBy = orderByVal.join();
      if (havingVal != null) {
        if (havingVal.trim() == '') datasetObj.having = null;
        else datasetObj.having = havingVal;
      }
      datasetObj.calender = ''
      //2jan
      let whereQuery: any[] = [];
      let uiWhere: any[] = []
      this.whereArrInDS().controls.forEach((whereObj: any, index: number) => {
        //console.log(whereObj);
        console.log(whereObj.controls.column.value);
        console.log(whereObj.controls.signOperator.value);
        console.log(whereObj.controls.value.value);
        let column = whereObj.controls.column.value.dbtablefieldName
        let signOperator = whereObj.controls.signOperator.value
        let value = whereObj.controls.value.value
        if (index == 0) {
          if (signOperator != '') {
            if (signOperator == 'IS NULL' || signOperator == 'IS NOT NULL') {
              whereQuery = [column + ' ' + signOperator]
            }
            else {
              whereQuery = [column + ' ' + signOperator + ' ' + value]
            }
          }
          if (signOperator == 'IS NULL' || signOperator == 'IS NOT NULL') uiWhere.push({ fieName: whereObj.controls.column.value.filefieldName, signOperator: signOperator, value: '' })
          else uiWhere.push({ fieName: whereObj.controls.column.value.filefieldName, signOperator: signOperator, value: value })
        }
        else {
          console.log(whereObj.controls.operator.value);
          let operator = whereObj.controls.operator.value
          let x: any;
          if (signOperator != '') {
            if (signOperator == 'IS NULL' || signOperator == 'IS NOT NULL') {
              x = operator + ' ' + column + ' ' + signOperator
            }
            else {
              x = operator + ' ' + column + ' ' + signOperator + ' ' + value;
            }
          }
          whereQuery.push(x)

          if (signOperator == 'IS NULL' || signOperator == 'IS NOT NULL') uiWhere.push({ operator: operator, fieName: whereObj.controls.column.value.filefieldName, signOperator: signOperator, value: '' })
          else uiWhere.push({ operator: operator, fieName: whereObj.controls.column.value.filefieldName, signOperator: signOperator, value: value })
        }

      })




      datasetObj.where = whereQuery.join(' ')
      datasetObj.uiWhere = JSON.stringify(uiWhere)
      // if (expandTableTrue[0].groupBy.trim() == '' || expandTableTrue[0].groupBy.trim().length == 0) datasetObj.groupBy = null;
      // else datasetObj.groupBy = expandTableTrue[0].groupBy;

      // if (expandTableTrue[0].orderBy.trim() == '' || expandTableTrue[0].orderBy.trim().length == 0) datasetObj.orderBy = null;
      // else datasetObj.orderBy = expandTableTrue[0].orderBy;

      // if (expandTableTrue[0].having.trim() == '' || expandTableTrue[0].having.trim().length == 0) datasetObj.having = null;
      // else datasetObj.having = expandTableTrue[0].having;

      datasetObj.calender = ''
      if (expandTableTrue[0].datasetId) datasetObj.datasetId = expandTableTrue[0].datasetId
      this.solService.addDataset(datasetObj).subscribe(async (res: any) => {
        console.log('call addDS');
        // this.allTableListInDM.forEach((obj: any, index: number) => {
        //   if (obj.fileType == 'dataset') {
        //     console.log('splice ds');

        //     this.allTableListInDM.splice(index, 1) //removing from list for rem duplicts
        //   }
        // })
        await this.getAllDataSetNameAPI();
        this.loader.hide()
        //expandTableTrue[0].isDatasetTableExpand = false;
        this.clearWhereInDS()
        this.unChecksAllInDM(false)

        this.createExpressionList = []; //clearing CE,DS list 
        this.datasetDetailsList = []
      }, (err: any) => {
        this.loader.hide()
      });
    }
    else {
      this.dataSetForm.controls.DSetRows = this.fb.array([])

      //formarr creation
      this.dataSetData = [];

      let primaryTableList: any = [];
      //primaryTableList.primaryKeyList = []

      let foreignTableList: any = []
      //foreignTableList.foreignKeyList = []

      this.selectedColumnsOfDS.forEach((obj: any) => { primaryTableList.push(obj) })

      let dataset111 = {
        searchValuePT: '', searchValueFT: '',
        primaryTableList, foreignTableList, order: 1, columns: [{ primaryKeyList: [], foreignKeyList: [] }]
      }

      for (let i = 0; i < this.selectedColumnsOfDS.length - 1; i++) {
        if (i == 0) this.dataSetData.push(dataset111)
        else {
          primaryTableList = []
          primaryTableList.primaryKeyList = []
          this.dataSetData.push({
            searchValuePT: '', searchValueFT: '',
            primaryTableList, foreignTableList, columns: [{ primaryKeyList: [], foreignKeyList: [] }], order: i + 2,
          })
        }
        this.DataSetArr().controls.push(this.DataSetRow())


      }
      // this.selectedColumnsOfDS.forEach((ele: any, i: any) => {
      //   if (i == this.selectedColumnsOfDS.length - 1) return;
      //   if (i == 0) this.dataSetData.push(dataset111)
      //   else this.dataSetData.push({ primaryTableList: [], foreignTableList: [], order: i + 2 })


      //   this.DataSetArr().controls.push(this.DataSetRow())
      // })

      this.saveDataSetPopup = true;
    }
    this.DataSetArr().controls.forEach((eee: any) => {
      console.log(eee.value, eee);
      console.log(eee.controls.Ptable.value);
    });
  }

  selectPrimaryTableInDS(e: any, i: number) {
    this.dataSetData.forEach((obj: any, j: number) => {

      if (j > i) {
        this.dataSetData[j].Join = ''
        this.dataSetData[j].primaryTableList = []
        this.dataSetData[j].foreignTableList = []
        this.DataSetArr().controls[i].get('join')?.reset()
      }
      if (j == i) {
        this.dataSetData[j].foreignTableList = []
        this.DataSetArr().controls[i].get('Ftable')?.reset()
        this.DataSetArr().controls[i].get('join')?.reset()
      }
      if (j >= i) {
        this.columnArrInDS(j).clear()
        this.columnArrInDS(j).push(this.addColumnInDS())
        this.dataSetData[j].columns = [{ primaryKeyList: [], foreignKeyList: [] }]
      }
    })


    // this.dataSetData[i].primaryTableList.forEach((ele: any) => { JSON.parse(JSON.stringify(ele)).isSelecteddl = false })
    // this.dataSetData[i].primaryTableList.forEach((element:any)=>{
    //   if(element.tableNameUI == e.value.tableNameUI) element.isSelecteddl = true
    // })
    // e.value.isSelecteddl = true;
    // e.value.columnList.forEach((column:any)=>{
    //   column.searchValuePK = ''
    //   //column.searchValueFK = ''
    // })
    this.dataSetData[i].columns.forEach((column: any) => {
      column.searchValuePK = ''
      column.searchValueFK = ''
    })
    this.dataSetData[i].columns[0].primaryKeyList = e.value.columnList //childArr
    if (i == 0) {
      // let filteredForFT = JSON.parse(JSON.stringify(this.dataSetData[i].primaryTableList.filter((x: any) => !x.isSelecteddl))) //ft
      // this.dataSetData[i].foreignTableList = filteredForFT
      this.dataSetData[0].primaryTableList.forEach((object: any) => {
        if (this.DataSetArr().controls[i].value.Ptable.ID != object.ID) this.dataSetData[i].foreignTableList.push(object)
      })
    }
    else {
      // let xSList = this.dataSetData[i - 1].foreignTableList.filter((x: any) => !x.isSelecteddl) //can b written in i=0 ft
      // this.dataSetData[i].foreignTableList = xSList
      let xSecondaryIds = this.dataSetData[i].primaryTableList.map((x: any) => x.ID)

      this.dataSetData[0].primaryTableList.forEach((element: any) => {
        if (!xSecondaryIds.includes(element.ID)) {
          this.dataSetData[i].foreignTableList.push(element)
        }
      })
    }


  }

  selectJoinTypeInDS(e: any, i: any) {
    this.dataSetData[i].Join = e.value
    console.log(this.dataSetData);

  }
  selectForeignTableInDS(e: any, i: any) {
    this.dataSetData.forEach((obj: any, j: number) => {

      if (j > i) {
        this.DataSetArr().controls[j].get('join')?.reset()
        this.dataSetData[j].primaryTableList = []
        this.dataSetData[j].foreignTableList = []
        this.dataSetData[j].columns = [{ primaryKeyList: [], foreignKeyList: [] }]

      }
      if (j == i) {
        this.dataSetData[j].columns[0].foreignKeyList = []
        this.dataSetData[j].columns.splice(1, this.dataSetData[j].columns.length)

        if (this.DataSetArr().controls[j + 1] != undefined) this.DataSetArr().controls[j + 1].get('Ptable')?.reset()
      }
      if (j >= i) {
        this.columnArrInDS(j).clear()
        this.columnArrInDS(j).push(this.addColumnInDS())

      }
    })

    // this.dataSetData[i].foreignTableList.forEach((ele: any) => JSON.parse(JSON.stringify(ele)).isSelecteddl = false)
    // this.dataSetData[i].foreignTableList.forEach((element:any)=>{
    //   if(element.tableNameUI == e.value.tableNameUI) element.isSelecteddl = true
    // })

    //e.value.isSelecteddl = true;
    // this.dataSetData[i].foreignKeyList = e.value.columnList;
    this.dataSetData[i].columns[0].foreignKeyList = e.value.columnList //childArr
    if (i == 0) {
      let combinedList: any[] = [];
      combinedList.push(this.DataSetArr().controls[i].value.Ptable)
      combinedList.push(this.DataSetArr().controls[i].value.Ftable)



      // let sPT = this.dataSetData[i].primaryTableList.filter((x: any) => x.isSelecteddl)
      // let sFT = this.dataSetData[i].foreignTableList.filter((x: any) => x.isSelecteddl)
      // sPT.forEach((obj: any) => combinedList.push(obj))
      // sFT.forEach((obj: any) => combinedList.push(obj))
      // combinedList.forEach((obj: any) => JSON.parse(JSON.stringify(obj)).isSelecteddl = false)
      if (this.dataSetData[i + 1] != undefined) this.dataSetData[i + 1].primaryTableList = combinedList
    }
    else {
      let combinedList: any[] = [];
      this.dataSetData[i].primaryTableList.forEach((element: any) => {
        combinedList.push(element)
      })
      combinedList.push(this.DataSetArr().controls[i].value.Ftable)


      // let sFT = this.dataSetData[i].foreignTableList.filter((x: any) => x.isSelecteddl)
      // list.forEach((obj: any) => combinedList.push(obj))
      // sFT.forEach((obj: any) => combinedList.push(obj))
      // combinedList.forEach((obj: any) => JSON.parse(JSON.stringify(obj)).isSelecteddl = false) //copy
      if (this.dataSetData[i + 1] != undefined) this.dataSetData[i + 1].primaryTableList = combinedList //
    }



  }

  selectPrimaryKeyInDS(e: any, j: any, i: any) {
    //this.dataSetData[i].columns.splice(j + 1, this.dataSetData[i].columns.length)
    //this.columnArrInDS(i).removeAt(j + 1)

    let originalPKList = JSON.parse(JSON.stringify(this.dataSetData[i].columns[j].primaryKeyList))
    originalPKList.forEach((obj: any, index: any) => {
      if (obj.fieldIDforExpn == e.value.fieldIDforExpn) {
        originalPKList.splice(index, 1)
      }
    })

    if (this.dataSetData[i].columns[j + 1] == undefined) {
      this.dataSetData[i].columns.push({ primaryKeyList: originalPKList, searchValuePK: '', searchValueFK: '' })
    }
    else this.dataSetData[i].columns[j + 1].primaryKeyList = originalPKList

    // push()

  }
  selectForeignKeyInDS(e: any, j: any, i: any) {
    //this.dataSetData[i].columns.splice(j + 1, this.dataSetData[i].columns.length)
    //this.columnArrInDS(i).removeAt(j + 1)

    let originalPKList = JSON.parse(JSON.stringify(this.dataSetData[i].columns[j].foreignKeyList))
    originalPKList.forEach((obj: any, index: any) => {
      if (obj.fieldIDforExpn == e.value.fieldIDforExpn) {
        originalPKList.splice(index, 1)
      }
    })

    if (this.dataSetData[i].columns[j + 1] == undefined) {

      this.dataSetData[i].columns.push({ foreignKeyList: originalPKList, searchValuePK: '', searchValueFK: '' })
    }
    else this.dataSetData[i].columns[j + 1].foreignKeyList = originalPKList

  }

  addcolumnRowInDS(j: any, i: any) {
    let len = this.columnArrInDS(i).length;
    if (this.columnArrInDS(i).controls[len - 1].get('column1')?.value == '' || this.columnArrInDS(i).controls[len - 1].get('column2')?.value == '') return
    let p = 0;
    this.dataSetData[i].columns.forEach((element: any) => {
      if (element?.primaryKeyList.length == 0 || element?.foreignKeyList.length == 0) p = 1;
    })
    if (p == 1) return;
    this.columnArrInDS(i).push(this.addColumnInDS())


  }

  deletecolumnRowInDS(j: any, i: any) {
    this.columnArrInDS(i).removeAt(j)
    this.dataSetData[i].columns.splice(j + 1, this.dataSetData[i].columns.length)
  }




  add_SaveCreateExpression(obj: any) {
    console.log('this.createExpressionForm', this.createExpressionForm);
    // if (obj.sourceFieldName == '') {
    obj.sourceFieldName = this.createExpressionForm.get('sourceFieldName')?.value
    obj.excludeInSelect = this.createExpressionForm.get('excludeInSelect')?.value
    obj.columnType = this.createExpressionForm.get('columnType')?.value
    if (obj.isColumnType == true) obj.columnFormat = this.createExpressionForm.get('columnFormat')?.value
    obj.sourceExpressionName = this.createExpressionForm.get('sourceExpressionName')?.value
    // }
    this.submited = true; //validation 
    if (obj.sourceFieldName.trim() == '' || obj.columnType == '') {
      this.popup.open(false, 'Enter All the Required Fields');

      // this.toast.error({ title: 'Error', message: 'Enter All the Required Fields' });
      return;
    }

    if (obj.sourceFieldName.trim() == '') return; //xShd empty
    const filteredList = this.datasetDetailsList.filter((x: any) => x.isDatasetTableExpand == true);
    const dsDTOList = filteredList[0]?.datasetFieldDTOList;
    let p = 0;
    if (dsDTOList.length != 0) {
      dsDTOList.forEach((ele: any) => {
        if (!obj.isEdit) {
          if (ele.sourceFieldName == obj.sourceFieldName.trim()) p = 1;
        }
        else if (!ele.isEdit) { //false
          if (ele.sourceFieldName == obj.sourceFieldName.trim()) p = 1;
        }
      })
    }
    if (p == 1) return;




    //groupby-orderby
    let selectedColumn: any;
    selectedColumn = this.allTableListInDM.filter((element: any) =>
      element.columnList.some((subElement: any) => subElement.showTabColName == obj.sourceFieldName))
      .map((element: any) => {
        return Object.assign({}, element, { columnList: element.columnList.filter((subElement: any) => subElement.showTabColName == obj.sourceFieldName) });
      });

    if (selectedColumn.length != 0) { // append,join,DS,file
      obj.tableName = selectedColumn[0].tableNameDB
    }

    let fieName: any;
    let tblName: any;
    let colName: any;
    if (selectedColumn.length != 0) {
      fieName = selectedColumn[0].columnList[0].columnName;
      colName = selectedColumn[0].columnList[0].fieldName;
      //if (selectedColumn[0].fileType == 'files') tblName = selectedColumn[0].tableNameDB
      //else
      tblName = selectedColumn[0].tableNameDB
    }
    let t_fNameForOGBy = tblName + '.' + fieName
    let o_gByObj: any = {}
    let columnsListForWherObj: any = {} //2jan
    if (selectedColumn.length == 0) { //manual column name
      let manualColNameExpn = null
      this.tablecolNameList.forEach((element: any) => {
        if (obj.sourceExpressionName == element.showTabColName) manualColNameExpn = element.tableNameDB + '.' + element.columnName
      })
      o_gByObj = { filefieldName: obj.sourceFieldName, dbtablefieldName: manualColNameExpn }
      columnsListForWherObj = { filefieldName: obj.sourceFieldName, dbtablefieldName: manualColNameExpn, dataType: obj.columnType } //2jan
      obj.columnName = obj.sourceFieldName;
      obj.fieldName = obj.sourceFieldName;
    }
    else {
      o_gByObj = { filefieldName: obj.sourceFieldName, dbtablefieldName: t_fNameForOGBy }
      columnsListForWherObj = { filefieldName: obj.sourceFieldName, dbtablefieldName: t_fNameForOGBy, dataType: selectedColumn[0].columnList[0].columnType } //2jan
      obj.columnName = fieName //assigning field,col Names
      obj.fieldName = colName
    }
    if (!obj.isEdit) { //if edit false
      filteredList[0].orderBytoDB.push(o_gByObj)
      filteredList[0].groupBytoDB.push(o_gByObj)
      this.columnsForWhereInDS.push(columnsListForWherObj) //2jan
    }
    // if (selectedColumn.length != 0) {
    //   fieName = selectedColumn[0].columnList[0].columnName;
    //   colName = selectedColumn[0].columnList[0].fieldName;
    //   //if (selectedColumn[0].fileType == 'files') tblName = selectedColumn[0].tableNameDB
    //   //else 
    //   tblName = selectedColumn[0].tableNameDB
    // }
    // let t_fNameForOGBy = tblName + '.' + fieName

    // let o_gByObj: any = {}
    // if (selectedColumn.length == 0) { //manual column name
    //   o_gByObj = { filefieldName: obj.sourceFieldName, dbtablefieldName: obj.sourceFieldName }
    //   obj.columnName = obj.sourceFieldName;
    //   obj.fieldName = obj.sourceFieldName;

    // }
    // else {
    //   o_gByObj = { filefieldName: obj.sourceFieldName, dbtablefieldName: t_fNameForOGBy }
    //   obj.columnName = fieName //assigning field,col Names
    //   obj.fieldName = colName
    // }

    // if (!obj.isEdit) { //if edit false
    //   filteredList[0].orderBytoDB.push(o_gByObj)
    //   filteredList[0].groupBytoDB.push(o_gByObj)
    // }

    //where key
    // if (obj.signOperator != '' || obj.signOperator.length != 0) {
    //   let whereQuery: any[] = [];
    //   if (obj.value != '' && obj.signOperator != '') {
    //     whereQuery = [tblName + '.' + fieName + ' ' + obj.signOperator + ' ' + obj.value]
    //     obj.whereList.forEach((element: any) => {
    //       let x: any;
    //       if (element.signOperator == 'IS NULL' || element.signOperator == 'IS NOT NULL') {
    //         x = element.operator + ' ' + tblName + '.' + fieName + ' ' + element.signOperator
    //       }
    //       else {
    //         x = element.operator + ' ' + tblName + '.' + fieName + ' ' + element.signOperator + ' ' + element.value;
    //       }
    //       whereQuery.push(x)
    //     })
    //   }
    //   else if (obj.signOperator == 'IS NULL' || obj.signOperator == 'IS NOT NULL') {
    //     whereQuery = [tblName + '.' + fieName + ' ' + obj.signOperator]
    //     obj.whereList.forEach((element: any) => {
    //       let x: any;
    //       if (element.signOperator == 'IS NULL' || element.signOperator == 'IS NOT NULL') {
    //         x = element.operator + ' ' + tblName + '.' + fieName + ' ' + element.signOperator
    //       }
    //       else { x = element.operator + ' ' + tblName + '.' + fieName + ' ' + element.signOperator + ' ' + element.value; }
    //       whereQuery.push(x)
    //     })
    //   }
    //   obj.where = whereQuery.join(' ');
    // }



    if (dsDTOList?.length == 0) dsDTOList.push(obj);
    else {
      if (!obj.isEdit) {
        dsDTOList.push(obj)
      }
      else {
        dsDTOList.forEach((element: any, index: number) => {
          if (element.isEdit) {
            obj.isEdit = false;
            dsDTOList.splice(index, 1, obj);
          }
        })
      }
    }
    this.createExpressionList = [{ excludeInSelect: false, sourceFieldName: '', expression: '', columnId: '', columnFormat: '', signOperatorList: '', isEdit: false, columnType: '', where: '', or: '', groupBy: '', value: '', signOperator: '', whereList: [] }];
    this.UpdatechecksInDM(obj, true)
    this.createExpressionForm.reset()
    this.submited = false;

  }

  deleteTableDetails: any;
  enableDeletePopup: boolean = false;
  deleteTables(e: Event, item: any, index: number, type: any) {
    console.log('e: ', e)
    console.log('item: ', item)
    this.deleteTableDetails = { item, type }
    this.enableDeletePopup = true
    // })
  }

  deleteTable(item: any, type: any) {
    // let item = this.deleteTableDetails.item
    // let type = this.deleteTableDetails.type
    let data: any = {
      type: type,
      operation: 'delete'
    }
    if (type == 'file') data.id = item.fileId
    else if (type == 'append') data.id = item.appendID
    else if (type == 'merge') data.id = item.mergeId
    else if (type == 'dataset') data.id = item.datasetId
    // this.solService.deleteTables({id:item.appendID, type:'append', operation:'check'}).subscribe((res:any)=>{
    //   console.log(res);
    this.solService.deleteTables(data).subscribe((res: any) => {
      console.log(res);
      this.enableDeletePopup = false

      // if (type == 'file') this.fileListt.splice(this.getJoinFilesList.findIndex(ele => ele.fileId === item.fileId), 1)
      // else if (type == 'append') this.getAppendFilesList.splice(this.getAppendFilesList.findIndex(ele => ele.appendID === item.appendID), 1)
      // else if (type == 'merge') this.getJoinFilesList.splice(this.getJoinFilesList.findIndex(ele => ele.mergeId === item.mergeId), 1)
      // else if (type == 'dataset') {

      //   this.allDatasetDetailsList.splice(this.allDatasetDetailsList.findIndex(ele => ele.datasetId === item.datasetId), 1)
      //   this.datasetDetailsList.forEach((dsObj: any, i: number) => {
      //     if (dsObj.datasetId === item.datasetId) this.datasetDetailsList.splice(i, 1)
      //   })
      //   if (this.datasetDetailsList.length == 0) {
      //     this.createExpressionList = []
      //   }
      // }

      if (type == 'file') this.getAllFileTemplateListByProcessID()
      else if (type == 'append') this.getAppendFilesApi()
      else if (type == 'merge') this.getJoinFilesListApi()
      else if (type == 'dataset') {
        this.getAllDataSetNameAPI()
        if (this.datasetDetailsList.length == 0) {
          this.createExpressionList = []
        }
      }
      if (type == 'file')
        this.popup.open(true, item.fileNameWithExt + ' ' + "Deleted Successfully !");

      // this.toast.success({ title: 'Success', message: item.fileNameWithExt + ' ' + "Deleted Successfully !" });
      else if (type == 'append')
        this.popup.open(true, item.appendName + ' ' + "Deleted Successfully !");

      // this.toast.success({ title: 'Success', message: item.appendName + ' ' + "Deleted Successfully !" });
      else if (type == 'merge')
        this.popup.open(true, item.mergeName + ' ' + "Deleted Successfully !");

      // this.toast.success({ title: 'Success', message: item.mergeName + ' ' + "Deleted Successfully !" });
      else if (type == 'dataset')
        this.popup.open(true, item.datasetName + ' ' + "Deleted Successfully !");

      // this.toast.success({ title: 'Success', message: item.datasetName + ' ' + "Deleted Successfully !" });

    }, (err: any) => {
      this.popup.open(false, "failed to delete");
      // this.toast.error({ title: 'Error', message: "failed to delete" });
      this.enableDeletePopup = false
    })
  }




  existDataset() {
    console.log(this.sqlScriptForm.value.datasetName);
    // this.solService.getExistDataset(this.appendNameControl.value).subscribe((res: any) => {

    //   console.log(res);
    // }, (err: any) => {
    //   this.toast.error({ title: 'Error', message: "Dataset Name Already Exists" });
    // })
  }

  selectedIndexFilterAppend: any
  selectedIndexFilterJoin: any;
  selectedIndexFilterFiles: any;
  selectedIndexFilterDataset: any;
  filteredDataAppend: any;
  filteredDataJoin: any
  filteredDataFiles: any
  filteredDataDataset: any
  applyFilterForDMTables(e: any, item: any, i: number, fileType: any) {
    console.log('e', e);
    console.log(fileType);

    if (fileType == 'append') {
      if (e.target.value != '') this.selectedIndexFilterAppend = i
      else this.selectedIndexFilterAppend = -1
      this.filteredDataAppend = item.tableAppendFieldsDto.filter((val: any) => val['fieldName'].toLowerCase().includes(e.target.value.toLowerCase()))
    }
    else if (fileType == 'join') {
      if (e.target.value != '') this.selectedIndexFilterJoin = i
      else this.selectedIndexFilterJoin = -1
      this.filteredDataJoin = item.mergeFieldListDTO.filter((val: any) => val['fieldName'].toLowerCase().includes(e.target.value.toLowerCase()))
    }
    else if (fileType == 'files') {
      if (e.target.value != '') this.selectedIndexFilterFiles = i
      else this.selectedIndexFilterFiles = -1
      this.filteredDataFiles = item.sheet.filter((val: any) => val['fieldName'].toLowerCase().includes(e.target.value.toLowerCase()))

    }
    else if (fileType == 'dataset') {
      if (e.target.value != '') this.selectedIndexFilterDataset = i
      else this.selectedIndexFilterDataset = -1
      this.filteredDataDataset = item.datasetFieldDTOList.filter((val: any) => val['fieldName'].toLowerCase().includes(e.target.value.toLowerCase()))
    }

  }



  selectAllInDM(fileType: any, item: any) {
    console.log(fileType, item);
    let allSourceColsInDS: Array<any> = []
    if (this.datasetDetailsList.length != 0) allSourceColsInDS = this.datasetDetailsList[0].datasetFieldDTOList.map((x: any) => x.sourceFieldName)
    let selectAllOfClickedTable: Array<any> = []
    if (fileType == 'append') selectAllOfClickedTable = item.tableAppendFieldsDto
    else if (fileType == 'join') selectAllOfClickedTable = item.mergeFieldListDTO
    else if (fileType == 'files') selectAllOfClickedTable = item.sheet
    else if (fileType == 'dataset') selectAllOfClickedTable = item.datasetFieldDTOList
    selectAllOfClickedTable.forEach((colObj: any) => {
      if (!allSourceColsInDS.includes(colObj.showTabColName)) {
        let createExpnObj = { excludeInSelect: false, sourceFieldName: colObj.showTabColName, columnId: '', columnFormat: '', signOperatorList: '', sourceExpressionName: '', isEdit: false, columnType: colObj.columnType, where: '', or: '', groupBy: '', orderBy: '', value: '', signOperator: '', whereList: [] }
        this.add_SaveCreateExpression(createExpnObj)
      }
    })
  }

  sortDir = -1;//1= 'asc' -1= des
  sortColumn !: number
  sortOrder: string = 'desc';
  onSortClick(col: string, i: number): void {
    if (this.sortColumn == i) {
      if (this.sortOrder == 'desc') {
        this.sortOrder = 'asc';
        this.sortDir = 1
      }
      else {
        this.sortOrder = 'desc';
        this.sortDir = -1;
      }
    }
    else {
      this.sortColumn = i;
      this.sortOrder = 'desc';
    }
    this.selectedM_A_S.sort((a: any, b: any) => {
      a = a[col].toLowerCase();
      b = b[col].toLowerCase();
      return a.localeCompare(b) * this.sortDir;
    });
  }

  previewPopupClose() {
    this.sortColumn = -1
    this.showTargetFilePopup = false
  }

  private UpdatechecksInDM(item: any, isChk: any) {
    let allColumnsOfTable: Array<any> = []
    this.targetFiles.forEach((appJoinSourceFile: any) => {
      appJoinSourceFile.sheetList.forEach((tableObj: any) => {
        if (tableObj.type == 'Append') {

          tableObj.tableAppendFieldsDto.forEach((colObj: any) => {
            if (colObj.showTabColName == item.sourceFieldName) {
              allColumnsOfTable = tableObj.tableAppendFieldsDto

              colObj.isSelectAllChildInDM = isChk
              let chk_unchkValues = allColumnsOfTable.map((x: any) => x.isSelectAllChildInDM)
              if (chk_unchkValues.includes(false)) tableObj.isSelectAllParentInDM = false
              else item.isSelectAllParentInDM = true
            }
          })
        }

        else if (tableObj.type == 'Merge') {
          tableObj.mergeFieldListDTO.forEach((colObj: any) => {
            if (colObj.showTabColName == item.sourceFieldName) {
              allColumnsOfTable = tableObj.mergeFieldListDTO

              colObj.isSelectAllChildInDM = isChk
              let chk_unchkValues = allColumnsOfTable.map((x: any) => x.isSelectAllChildInDM)
              if (chk_unchkValues.includes(false)) tableObj.isSelectAllParentInDM = false
              else item.isSelectAllParentInDM = true
            }
          })
        }

        else {
          tableObj.sheet.forEach((colObj: any) => {
            if (colObj.showTabColName == item.sourceFieldName) {
              allColumnsOfTable = tableObj.sheet

              colObj.isSelectAllChildInDM = isChk
              let chk_unchkValues = allColumnsOfTable.map((x: any) => x.isSelectAllChildInDM)
              if (chk_unchkValues.includes(false)) tableObj.isSelectAllParentInDM = false
              else item.isSelectAllParentInDM = true
            }
          })
        }

      })
    })
    if (allColumnsOfTable.length == 0) {
      this.allDatasetDetailsList.forEach((dsObj: any) => { //ds
        dsObj.datasetFieldDTOList.forEach((colObj: any) => {
          if (colObj.showTabColName == item.sourceFieldName) {
            allColumnsOfTable = dsObj.datasetFieldDTOList

            colObj.isSelectAllChildInDM = isChk
            let chk_unchkValues = allColumnsOfTable.map((x: any) => x.isSelectAllChildInDM)
            if (chk_unchkValues.includes(false)) dsObj.isSelectAllParentInDM = false
            else item.isSelectAllParentInDM = true
          }
        })
      })
    }
  }

  selectAllParentInDM(e: any, fileType: any, item: any) {
    console.log(e, fileType, item);
    let isChecked = e.target.checked
    let allSourceColsInDS: Array<any> = []
    if (this.datasetDetailsList.length != 0) allSourceColsInDS = this.datasetDetailsList[0].datasetFieldDTOList.map((x: any) => x.sourceFieldName)

    let selectAllOfClickedTable: Array<any> = []
    if (fileType == 'append' && isChecked) {
      item.tableAppendFieldsDto.forEach((obj: any) => obj.isSelectAllChildInDM = true)
      selectAllOfClickedTable = item.tableAppendFieldsDto

    }
    else if (fileType == 'join' && isChecked) {
      item.mergeFieldListDTO.forEach((obj: any) => obj.isSelectAllChildInDM = true)
      selectAllOfClickedTable = item.mergeFieldListDTO

    }
    else if (fileType == 'files' && isChecked) {
      item.sheet.forEach((obj: any) => obj.isSelectAllChildInDM = true)
      selectAllOfClickedTable = item.sheet
    }
    else if (fileType == 'dataset' && isChecked) {
      item.datasetFieldDTOList.forEach((obj: any) => obj.isSelectAllChildInDM = true)
      selectAllOfClickedTable = item.datasetFieldDTOList
    }


    let particularTableColumns: Array<any> = []
    if (fileType == 'append' && !isChecked) {
      item.tableAppendFieldsDto.forEach((obj: any) => obj.isSelectAllChildInDM = false)
      selectAllOfClickedTable = item.tableAppendFieldsDto
      particularTableColumns = item.tableAppendFieldsDto.map((x: any) => x.showTabColName)
    }
    else if (fileType == 'join' && !isChecked) {
      item.mergeFieldListDTO.forEach((obj: any) => obj.isSelectAllChildInDM = false)
      selectAllOfClickedTable = item.mergeFieldListDTO
      particularTableColumns = item.mergeFieldListDTO.map((x: any) => x.showTabColName)

    }
    else if (fileType == 'files' && !isChecked) {
      item.sheet.forEach((obj: any) => obj.isSelectAllChildInDM = false)
      selectAllOfClickedTable = item.sheet
      particularTableColumns = item.sheet.map((x: any) => x.showTabColName)

    }
    else if (fileType == 'dataset' && !isChecked) {
      item.datasetFieldDTOList.forEach((obj: any) => obj.isSelectAllChildInDM = false)
      selectAllOfClickedTable = item.datasetFieldDTOList
      particularTableColumns = item.datasetFieldDTOList.map((x: any) => x.showTabColName)

    }
    if (this.datasetDetailsList.length == 0) return
    if (isChecked) {
      selectAllOfClickedTable.forEach((colObj: any) => {
        if (!allSourceColsInDS.includes(colObj.showTabColName)) { //shd check non exact match
          let createExpnObj = { excludeInSelect: false, sourceFieldName: '', columnId: '', columnFormat: '', signOperatorList: '', sourceExpressionName: '', isEdit: false, columnType: '', where: '', or: '', groupBy: '', orderBy: '', value: '', signOperator: '', whereList: [] }
          this.createExpressionForm.controls.sourceFieldName.patchValue(colObj.showTabColName)
          this.createExpressionForm.controls.columnType.patchValue(colObj.columnType)
          this.add_SaveCreateExpression(createExpnObj)
        }
      })
    }
    else if (!isChecked) {
      this.datasetDetailsList[0].datasetFieldDTOList = this.datasetDetailsList[0].datasetFieldDTOList.filter((x: any) => particularTableColumns.indexOf(x.sourceFieldName) == -1)
      this.datasetDetailsList[0].groupBytoDB = this.datasetDetailsList[0].groupBytoDB.filter((x: any) => particularTableColumns.indexOf(x.filefieldName) == -1)
      this.datasetDetailsList[0].orderBytoDB = this.datasetDetailsList[0].orderBytoDB.filter((x: any) => particularTableColumns.indexOf(x.filefieldName) == -1)

      this.columnsForWhereInDS = this.columnsForWhereInDS.filter((x: any) => particularTableColumns.indexOf(x.filefieldName) == -1)
      console.log('this.datasetDetailsList[0].datasetFieldDTOList ', this.datasetDetailsList[0].datasetFieldDTOList);
      console.log('this.datasetDetailsList[0].groupBytoDB', this.datasetDetailsList[0].groupBytoDB);
      console.log('this.datasetDetailsList[0].orderBytoDB', this.datasetDetailsList[0].orderBytoDB);


      // allSourceColsInDS.forEach((sourceFieldName:any,index:number)=>{
      //   if(particularTableColumns.includes(sourceFieldName)){
      //     this.datasetDetailsList[0].datasetFieldDTOList.splice(this.datasetDetailsList[0].datasetFieldDTOList.indexOf(sourceFieldName), 1)
      //     //console.log(this.datasetDetailsList[0].datasetFieldDTOList, 'this.datasetDetailsList[0].datasetFieldDTOList');
      //     console.log(sourceFieldName,index)

      //     //this.deleteRowInDataset(0, index, {item:sourceFieldName})
      //     //this.datasetDetailsList[0].datasetFieldDTOList.

      //   }
      // })
      this.UpdatechecksInDM(item, false)


    }

  }
  selectAllChildInDM(e: any, fileType: any, item: any, comp: any) {
    let isChecked = e.target.checked
    let allSourceColsInDS: Array<any> = []
    if (this.datasetDetailsList.length != 0) allSourceColsInDS = this.datasetDetailsList[0].datasetFieldDTOList.map((x: any) => x.sourceFieldName)

    let allColumnsOfTable: Array<any> = []
    if (fileType == 'append') allColumnsOfTable = item.tableAppendFieldsDto
    else if (fileType == 'join') allColumnsOfTable = item.mergeFieldListDTO
    else if (fileType == 'files') allColumnsOfTable = item.sheet
    else if (fileType == 'dataset') allColumnsOfTable = item.datasetFieldDTOList


    let chk_unchkValues = allColumnsOfTable.map((x: any) => x.isSelectAllChildInDM)
    if (chk_unchkValues.includes(false)) item.isSelectAllParentInDM = false
    else item.isSelectAllParentInDM = true

    console.log(item);

    if (this.datasetDetailsList.length == 0) return


    if (isChecked) {
      if (!allSourceColsInDS.includes(comp.showTabColName)) {
        let createExpnObj = { excludeInSelect: false, sourceFieldName: '', columnId: '', columnFormat: '', signOperatorList: '', sourceExpressionName: '', isEdit: false, columnType: '', where: '', or: '', groupBy: '', orderBy: '', value: '', signOperator: '', whereList: [] }
        this.createExpressionForm.controls.sourceFieldName.patchValue(comp.showTabColName)
        this.createExpressionForm.controls.columnType.patchValue(comp.columnType)
        this.add_SaveCreateExpression(createExpnObj)
      }
    }
    else if (!isChecked) {
      this.datasetDetailsList[0].datasetFieldDTOList = this.datasetDetailsList[0].datasetFieldDTOList.filter((x: any) => comp.showTabColName.indexOf(x.sourceFieldName) == -1)
      this.datasetDetailsList[0].groupBytoDB = this.datasetDetailsList[0].groupBytoDB.filter((x: any) => comp.showTabColName.indexOf(x.filefieldName) == -1)
      this.datasetDetailsList[0].orderBytoDB = this.datasetDetailsList[0].orderBytoDB.filter((x: any) => comp.showTabColName.indexOf(x.filefieldName) == -1)

      this.columnsForWhereInDS = this.columnsForWhereInDS.filter((x: any) => comp.showTabColName.indexOf(x.filefieldName) == -1)

    }


    console.log('this.datasetDetailsList[0].datasetFieldDTOList ', this.datasetDetailsList[0].datasetFieldDTOList);
    console.log(item, comp);

  }
  private unChecksAllInDM(isChk: any) {
    this.targetFiles.forEach((appJoinSourceFile: any) => {
      appJoinSourceFile.sheetList.forEach((tableObj: any) => {
        tableObj.isSelectAllParentInDM = false
        if (tableObj.type == 'Append') {
          tableObj.tableAppendFieldsDto.forEach((colObj: any) => {
            colObj.isSelectAllChildInDM = isChk
          })
        }
        else if (tableObj.type == 'Merge') {
          tableObj.mergeFieldListDTO.forEach((colObj: any) => {

            colObj.isSelectAllChildInDM = isChk
          })
        }
        else {
          tableObj.sheet.forEach((colObj: any) => {
            colObj.isSelectAllChildInDM = isChk
          })
        }
      })
    })
    this.allDatasetDetailsList.forEach((dsObj: any) => { //ds
      dsObj.isSelectAllParentInDM = false
      dsObj.datasetFieldDTOList.forEach((colObj: any) => {
        colObj.isSelectAllChildInDM = isChk
      })
    })

  }

  whereFirstRow(): FormGroup {
    return this.formBuilder.group({
      column: ['', Validators.required],
      signOperator: ['', Validators.required],
      value: ['', Validators.required]
    })
  }
  whereRemainingRows(): FormGroup {
    return this.formBuilder.group({
      operator: ['', Validators.required],
      column: ['', Validators.required],
      signOperator: ['', Validators.required],
      value: ['', Validators.required]
    })


  }
  addOpearatorValueFieldsInDS(j: number, item: any) {
    this.whereArrInDS().push(this.whereRemainingRows())
    console.log(j, item);
  }
  delOpearatorValueFieldsInDS(j: number, item: any) {
    this.whereArrInDS().removeAt(j)
    this.signOperatorWhereInDS.splice(j, 1)
    console.log(j, item);
  }


  signOperatorWhereInDS: Array<any> = [] //2jan
  changeColumnInDSForWhere(e: any, j: number, i: number, item: any) {
    let columnName = this.whereArrInDS().controls[j].get('column') as FormArray
    console.log(j, i, item, columnName.value);
    let ctype = columnName.value.dataType
    let signOperList: Array<any> = []

    signOperList = this.getOpearatorList.filter((x: any) => x.operatorType.trim() == ctype)

    // if (ctype == 'date' || ctype == 'datetime2' || ctype == 'dateTime') { //copy
    //   signOperList = [{ id: 0, value: 'IS NULL' }, { id: 1, value: 'IS NOT NULL' }, { id: 2, value: 'IN' }, { id: 3, value: 'NOT IN' }, { id: 4, value: '=' }, { id: 5, value: '!=' }, { id: 6, value: '>=' }, { id: 7, value: '>' }, { id: 8, value: '<' }, { id: 9, value: '<=' }]
    // }
    // else if (ctype == 'char' || ctype == 'varchar' || ctype == 'text' || ctype == 'nvarchar') {
    //   signOperList = [{ id: 0, value: 'IS NULL' }, { id: 1, value: 'IS NOT NULL' }, { id: 2, value: 'LIKE' }, { id: 3, value: 'NOT LIKE' }, { id: 4, value: 'NOT IN' }, { id: 5, value: 'IN' }]
    // }
    // else if (ctype == 'int' || ctype == 'float' || ctype == 'money' || ctype == 'decimal' || ctype == 'bigint') {
    //   signOperList = [{ id: 0, value: 'IS NULL' }, { id: 1, value: 'IS NOT NULL' }, { id: 2, value: 'IN' }, { id: 3, value: 'NOT IN' }, { id: 4, value: '=' }, { id: 5, value: '!=' }, { id: 6, value: '>=' }, { id: 7, value: '>' }, { id: 8, value: '<' }, { id: 9, value: '<=' }]
    // } //

    this.signOperatorWhereInDS[j] = signOperList[0].operatorList
  }

  whereArrInDS(): FormArray { //DS popup
    return this.datasetTableForm.get('where') as FormArray
  }

  appendDataset() {
    let checkedList = this.allDatasetDetailsList.filter((x: any) => x.selected)
    let k = 0;
    let checkedSheetColumns: Array<any> = []
    if (checkedList.length > 1) {
      checkedList.forEach((obj: any) => {
        if (checkedSheetColumns.length == 0) {
          checkedSheetColumns = obj.datasetFieldDTOList.map((x: any) => x.fieldName)
        }
        else {
          let columnsList: Array<any> = []
          columnsList = obj.datasetFieldDTOList.map((x: any) => x.fieldName)
          checkedSheetColumns.forEach((colNames: any) => {
            if (!columnsList.includes(colNames)) {
              k = 1;
              return;
            }
          })
        }
      })
      if (k == 1) {
        // this.submitted = true; 
        // this.submittedErrorMsg = "Ensure that the files with identical columns are selected for appending"
        return;
      }
      this.enableDatasetAppendPopup = true;
      this.datasetAppendForm.get('appendNameControl')?.reset()
    }
  }

  enableDatasetAppendPopup: boolean = false;
  appendDatasetApi() {
    let dsName = this.datasetAppendForm.get('appendNameControl')?.value.trim()
    this.loader.show()
    this.solService.getExistDataset(dsName, 'dataset').subscribe((res: any) => { //method written 4 times
      this.loader.hide()
      this.enableDatasetAppendPopup = false

      this.submited = false
      this.submittedErrorMsg = ''


      this.createDatasetAppend(dsName)

      console.log(res);
    }, (err: any) => {
      this.loader.hide()
      this.submited = true
      this.submittedErrorMsg = 'Dataset Name Already Exist!!!'

    })


  }

  createDatasetAppend(dsName: any) {
    let datasetTableAppendDtos: Array<any> = []
    let obsj: any = {
      processId: this.process.processId,
      dataSetAppendDetailsDto: { appendName: dsName, datasetTableAppendDtos }
    }
    this.allDatasetDetailsList.forEach((dsObj: any) => {
      if (dsObj.selected) {
        datasetTableAppendDtos.push({ datasetId: dsObj.datasetId, datasetName: dsObj.datasetName })
      }
    })

    this.solService.addDatasetAppend(obsj).subscribe((res: any) => {
      this.getAllDataSetNameAPI()
    }, (err: any) => {
      this.loader.hide()
    })
  }



  enableUploadSQL: boolean = false
  enableUploadPython: boolean = false
  isBtnClickedSQL_Python!: string;
  uploadSQLScriptBtn() {
    this.uploadSQLBtn = true
    this.sqlScriptForm.reset()
    this.enableUploadSQL = true;
    this.isBtnClickedSQL_Python = 'S'
  }

  uploadPythonScriptBtn() {
    this.uploadSQLBtn = true
    this.sqlScriptForm.reset()
    this.enableUploadPython = true;
    this.isBtnClickedSQL_Python = 'P'
  }

  generateScript() {
    this.saveUploadScript('M')
  }

  uploadPythonScript() {

  }


  uploadSQLBtn: boolean = true;
  uploadSQL_PythonScript(e: any, uploadType: string) { // txt   sql   py
    if (uploadType == 'P') {
      const file = e.target.files[0];
      if (e.target.files[0].name.split('.')[1] == 'py' || e.target.files[0].name.split('.')[1] == 'txt') {
        let fileReader = new FileReader();
        fileReader.onload = (e) => {
          this.uploadSQLBtn = false
          this.sqlScriptForm.patchValue({ sqlScript: fileReader.result })
        }
        fileReader.readAsText(file);
      }
    }
    else if (uploadType == 'S') {
      const file = e.target.files[0];
      if (e.target.files[0].name.split('.')[1] == 'sql' || e.target.files[0].name.split('.')[1] == 'txt') {
        let fileReader = new FileReader();
        fileReader.onload = (e) => {
          this.uploadSQLBtn = false
          this.sqlScriptForm.patchValue({ sqlScript: fileReader.result })
        }
        fileReader.readAsText(file);
      }
    }
  }



  saveUploadScript(uploadType: string) {
    let data: any = {
      processId: this.process.processId,
      type: uploadType
    }
    if (uploadType == 'P' || uploadType == 'S') data.script = this.sqlScriptForm.get('sqlScript')?.value

    this.solService.uploadScriptToProcess(data).subscribe((res: any) => {
      console.log(res);
      // this.uploadSQLBtn = true
      if (uploadType == 'P') this.enableUploadPython = false
      if (uploadType == 'S') this.enableUploadSQL = false
      if (uploadType == 'P' || uploadType == 'S')
        this.popup.open(true, "Saved Successfully !");

      //  this.toast.success({ title: 'Success', message: "Saved Successfully !" });
      if (uploadType == 'M')
        this.popup.open(true, "Generated Successfully !");

      // this.toast.success({ title: 'Success', message: "Generated Successfully !" });
    }, (err: any) => {
      this.popup.open(false, "failed");

      // this.toast.error({ title: 'Error', message: "failed" });
      this.loader.hide();
    })
  }




  enableViewscriptPopup: boolean = false;
  getViewScript() {
    this.isManualScript = true
    this.isUploadScript = false
    this.getViewScriptForm.reset()
    this.getSolutionScript(true)
  }


  // disableGenerateScript: boolean = false;
  getSolutionScript(cndtn: any) {
    this.solService.getSolutionScript(this.process.processId).subscribe((res: any) => {
      if (res) {
        if (cndtn == true) this.enableViewscriptPopup = true
        this.getViewScriptForm.patchValue({ script: res.responseData?.script, gscript: res.responseData?.gscript, solutionScriptId: res.responseData?.solutionScriptId, type: res.responseData?.type })
      }
    }, (err: any) => {
      if (cndtn == true)
        this.popup.open(false, "No data");
      // this.toast.error({ title: 'Error', message: "No data" });
      this.loader.hide();
    })
  }
  executeViewScript() {
    let flag: any
    if (this.isUploadScript) {
      if (this.getViewScriptForm.get('type')?.value == 'P') flag = 1
      else if (this.getViewScriptForm.get('type')?.value == 'S') flag = 2
    }
    else if (this.isManualScript) flag = 2


    this.solService.execscript(this.process.processId, flag).subscribe((res: any) => {
      this.enableViewscriptPopup = false
      this.popup.open(true, "Executed Successfully !");
      // this.toast.success({ title: 'Success', message: "Executed Successfully !" });
    }, (err: any) => { this.popup.open(false, "failed") }

    // this.toast.error({ title: 'Error', message: "failed" })
    )
  }

  updateViewScript() {

    let data: any = {
      processId: this.process.processId,
    }

    if (this.isUploadScript) {

      // script = this.getViewScriptForm.get('script')?.value
      data.script = this.getViewScriptForm.get('script')?.value
      data.type = this.getViewScriptForm.get('type')?.value
    }
    if (this.isManualScript) {

      //gscript = this.getViewScriptForm.get('gscript')?.value
      data.gscript = this.getViewScriptForm.get('gscript')?.value
      data.type = 'M'
    }

    // if (script == null && gscript != null) {
    //   data.gscript = gscript
    //   data.type = 'M'
    // }
    // else if (script != null && gscript == null) { //
    //   data.script = script
    //   data.type = this.getViewScriptForm.get('type')?.value
    // }
    // else if (script != null && gscript != null) {
    //   data.type = 'M'
    //   data.gscript = gscript
    // }

    console.log(data);

    this.solService.uploadScriptToProcess(data).subscribe((res: any) => {
      this.enableViewscriptPopup = false
      this.toast.success({ title: 'Success', message: "Updated Successfully !" });
    }), (err: any) => {
      this.toast.error({ title: 'Error', message: "failed" });
      this.loader.hide();
    }
  }

  isSQL_Python(type: any) {
    if (type == this.isManualScript) {
      this.isManualScript = true
      this.isUploadScript = false
    }
    else if (type == this.isUploadScript) {
      this.isUploadScript = true
      this.isManualScript = false
    }
  }


  //-DMEnd





































  //PBiStart

  overrideConfirm() {
    if (!this.isOverride) this.enableOverRideConfirmPopup = true
    else this.isOverride = false
  }
  overrideOK() {
    this.enableOverRideConfirmPopup = false
    this.isOverride = true;

  }
  closeOverridePopup() {
    this.isOverride = false
    this.enableOverRideConfirmPopup = false;
  }

  executeProject() {
    this.loader.show()
    this.solService.execSolutionScript(this.process.processId).subscribe((res: any) => {

      this.loader.hide()
    }, (err: any) => {
      this.loader.hide()

    })

  }

  deleteRelationRow(i: any) {
    //console.log(i);
    this.relationshipArr().removeAt(i)
    this.relationship.splice(i, 1)
  }

  addRelationshipRow(): FormGroup {
    return this.formBuilder.group({
      // name:['', Validators.required],
      fromTable: ['', Validators.required],
      toTable: ['', Validators.required],
      crossFilteringBehavior: ['', Validators.required],
      fromColumn: ['', Validators.required],
      toColumn: ['', Validators.required]
    })
  }
  relationshipArr(): FormArray {
    return this.addRelationshipForm.get('addRelationshipRows') as FormArray
  }

  fetchFromTables() {
    return this.selectedDateList.map((tbl) => {
      return { name: tbl.datasetName, value: tbl.tableName }
    });
  }

  fetchToTables(index: any) {
    const list = this.relationship;
    return this.selectedDateList.map((tbl) => {
      if ((list[index]?.fromTable !== tbl.tableName)) {
        return { name: tbl.datasetName, value: tbl.tableName }
      }
      return null;
    }).filter(function (el) {
      return el != null;
    });;

  }

  fetchTableColumns(tableName: string) {
    const table = this.selectedDateList.find((x) => x.tableName === tableName);
    return table.datasetFieldDTOList.map((column: any) => {
      return { name: column.fieldName, value: column.columnName }
    })
  }

  fetchCrossFltrBehaviours() {
    return [
      {
        name: 'Automatic',
        value: 'Automatic'
      },
      {
        name: 'Many To Many',
        value: 'BothDirections'
      },
      {
        name: 'One To Many',
        value: 'OneDirection'
      }
    ]
  }

  openRelModal() {
    this.addRelationshipForm.controls.addRelationshipRows = this.fb.array([this.addRelationshipRow()])
    this.submitedRelation = false


    console.log('seelcted tables:', this.selectedDateList);
    this.showRelationshipModal = true;
    this.relationship = [{
      name: '',
      fromTable: '',
      fromTableList: this.fetchFromTables(),
      crossFilteringBehavior: this.fetchCrossFltrBehaviours()[0].value,
      cfbList: this.fetchCrossFltrBehaviours(),
      fromColumn: '',
      fromColumnList: [],
      toTable: '',
      toTablesList: [],
      toColumn: '',
      toColumnList: [],
      validators: { name: 0, fromtable: 0, fromColumn: 0, toTable: 0, toColumn: 0 }
    }];

    console.log('relation ship info:', this.relationship)
  }

  closeRelModal() {
    this.showRelationshipModal = false;
    this.relationship = [];
  }

  addNewRelation(index: any) {
    let relationArrlength = this.relationshipArr().length
    if (this.relationshipArr().controls[relationArrlength - 1].invalid) return
    this.relationshipArr().push(this.addRelationshipRow())


    //if (!this.validateRelation(this.relationship[index])) { //validation ngmodel
    this.relationship.push({
      name: '',
      fromTable: '',
      fromTableList: this.fetchFromTables(),
      crossFilteringBehavior: this.fetchCrossFltrBehaviours()[0].value,
      cfbList: this.fetchCrossFltrBehaviours(),
      fromColumn: '',
      fromColumnList: [],
      toTable: '',
      toTablesList: [],
      toColumn: '',
      toColumnList: [],
      validators: { name: 0, fromtable: 0, fromColumn: 0, toTable: 0, toColumn: 0 }
    })
    // }

  }

  onChangeToTable(index: any, key: any) {
    let selectedTOTable = this.relationshipArr().controls[index].value.toTable
    this.relationship[index][key + 'ColumnList'] = this.fetchTableColumns(selectedTOTable);
  }

  // this.fileListt.splice(this.getJoinFilesList.findIndex(ele => ele.fileId === item.fileId), 1)

  populateToTables(index: any, selectedFromTable: any) {
    let toTableList: Array<any> = []
    this.relationship[index].fromTableList.forEach((object: any) => {
      if (selectedFromTable != object.value) toTableList.push(object)
    })
    return toTableList;
  }

  onChangeTable(index: any, key: any) {
    console.log('index', index)
    // this.relationship[index][key + 'ColumnList'] = this.fetchTableColumns(this.relationship[index][key + 'Table']);
    let selectedFromTable = this.relationshipArr().controls[index].value.fromTable
    this.relationship[index][key + 'ColumnList'] = this.fetchTableColumns(selectedFromTable);
    // this.relationship[index].toTableList = this.fetchToTables(index);
    this.relationship[index].toTableList = this.populateToTables(index, selectedFromTable);
    this.filterExistingRel(this.relationship[index].fromTable, index); //?
  }

  filterExistingRel(tableName: string, index: number) {
    const relExist = this.relationship.filter(x => x.fromTable === tableName)
      .map(rel => rel.toTable)
      .filter(function (el) {
        return el != null && el !== "";
      });
    this.relationship[index].toTableList =
      this.relationship[index].toTableList.filter((x: any) => relExist.indexOf(x.value) < 0);
  }

  onCheck(data: any) {
    console.log(data);
    this.allDatasetDetailsList.forEach((ele: any) => {
      if (data.datasetId == ele.datasetId) {
        ele.selected = !ele.selected;
      }
    });
    const itemIndex = this.selectedDateList.findIndex((x) => x.datasetName === data.datasetName);
    if (itemIndex > -1) {
      this.selectedDateList.splice(itemIndex, 1);
    } else {
      this.selectedDateList.push(data);
    }
    if (this.selectedDateList.length > 1) {
      this.disableContinue = true;
      this.disableRelButton = false;
    } else {
      this.disableContinue = false;
      this.disableRelButton = true;
    }
    console.log(this.allDatasetDetailsList);
  }

  validateRelation(relation: any) {
    relation.validators.name = (relation.name) ? 0 : 1;
    relation.validators.fromTable = (relation.fromTable) ? 0 : 1;
    relation.validators.fromColumn = (relation.fromColumn) ? 0 : 1;
    relation.validators.toTable = (relation.toTable) ? 0 : 1;
    relation.validators.toColumn = (relation.toColumn) ? 0 : 1;
    return (relation.validators.name || relation.validators.fromTable || relation.validators.fromColumn
      || relation.validators.toTable || relation.validators.toColumn);
  }

  disableContinueBtn() {
    return this.selectedDateList.length > 1 && this.disableContinue;
  }

  saveRelation() {
    if (!this.validateRelation(this.relationship[this.relationship.length - 1])) {
      let relation = this.relationship.map((rel) => {
        return {
          name: rel.name,
          fromTable: rel.fromTable,
          crossFilteringBehavior: rel.crossFilteringBehavior,
          fromColumn: rel.fromColumn,
          toTable: rel.toTable,
          toColumn: rel.toColumn,
        };
      })
      this.relationship = [];
      this.relationShipPayload = this.relationShipPayload.concat(relation);
      this.showRelationshipModal = false;
      this.disableContinue = false;
    }
  }

  submitedRelation: boolean = false
  saveRelationship() {
    this.submitedRelation = true
    let d = 0
    this.relationshipArr().controls.forEach((relatn: any, i: number) => {
      if (relatn.invalid) d = 1
    })
    if (d == 1) {
      this.toast.error({ title: 'Error', message: "Enter all the required fields" });
      return;
    }

    this.relationShipPayload = []
    this.relationshipArr().controls.forEach((relation: any) => {
      this.relationShipPayload.push({
        name: '',
        fromTable: relation.value.fromTable,
        crossFilteringBehavior: relation.value.crossFilteringBehavior,
        fromColumn: relation.value.fromColumn,
        toTable: relation.value.toTable,
        toColumn: relation.value.toColumn
      })
      this.relationship = [];
      this.showRelationshipModal = false;
      this.disableContinue = false;
    })
  }

  SaveContinue() {
    let tables: any[] = [];
    this.allDatasetDetailsList.forEach((ele: any) => {
      if (ele.selected) {
        tables.push(ele.tableName);
      }
    });
    let userInfo = JSON.parse(localStorage.getItem('userInfo') || '')
    let data: any = {
      tables: tables,
      userId: userInfo.userId,
      processId: this.process.processId,
    };

    if (this.relationShipPayload.length > 0) {
      this.relationShipPayload.forEach((obj: any, i: number) => {
        obj.name = 'relation' + i
      })
      data.relationShips = this.relationShipPayload;
    }
    console.log(data);
    this.loader.show()
    this.solService.postPushDataSets(data, this.isOverride).subscribe((res: any) => {
      this.router.navigate(["/user/admin1/powerbi-interface", { dataset: JSON.stringify(res.responseData) }])
      this.loader.hide()
    }, (err: any) => {
      this.loader.hide()
    })
    // routerLink="/user/admin1/powerbi-interface"
  }

  //-PbiEnd





  private oneNext() {
    let data: any = {
      checkDtoslist: []
    }
    this.fileListt.forEach((fileObj: any) => {
      fileObj.totalSheetList.forEach((sheetObj: any) => {
        if (sheetObj.sheetSelected) data.checkDtoslist.push({ id: sheetObj.templateId, value: 1 })
        else data.checkDtoslist.push({ id: sheetObj.templateId, value: 0 })
      })
    })

    this.solService.saveCheckedSheetList(data).subscribe(async (res: any) => {
      await this.getTargetFileList();
    }, (err: any) => {
    })
  }

  getAppendFilesList: Array<any> = []
  private twoNext() {
    let requestData: any = {
      fieldCheckListDtos: []
    }
    //above list 
    this.targetFiles.forEach((ajf: any) => {
      let checkDtoslist: any = []
      let fieldDataTypeDtos: any = []

      if (ajf.fileType == 'append') {
        ajf.sheetList.forEach((aobj: any) => {
          aobj.tableAppendFieldsDto.forEach((cObj: any) => {
            if (cObj.isChecked) checkDtoslist.push({ id: cObj.fieldID, value: 1 })
            if (cObj.isDropdownDirtyInTF) fieldDataTypeDtos.push({ id: cObj.fieldID, dataType: cObj.columnType })
          })
        })
        requestData.fieldCheckListDtos.push({ type: 'AppendField', checkDtoslist, fieldDataTypeDtos })
      }
      else if (ajf.fileType == 'join') {
        ajf.sheetList.forEach((jobj: any) => {
          jobj.mergeFieldListDTO.forEach((cobj: any) => {
            if (cobj.isChecked) checkDtoslist.push({ id: cobj.columnId, value: 1 })
            if (cobj.isDropdownDirtyInTF) fieldDataTypeDtos.push({ id: cobj.columnId, dataType: cobj.columnType })
          })
        })
        requestData.fieldCheckListDtos.push({ type: 'MergeField', checkDtoslist, fieldDataTypeDtos })

      }
      else if (ajf.fileType == 'files') {
        ajf.sheetList.forEach((fobj: any) => {
          fobj.sheet.forEach((cobj: any) => {
            if (cobj.isChecked) checkDtoslist.push({ id: cobj.columnId, value: 1 })
            if (cobj.isDropdownDirtyInTF) fieldDataTypeDtos.push({ id: cobj.columnId, dataType: cobj.columnType })
          })
        })
        requestData.fieldCheckListDtos.push({ type: 'TemplateField', checkDtoslist, fieldDataTypeDtos })

      }
    })

    //console.log(requestData);

    this.solService.saveFieldCheckList(requestData).subscribe(async (res: any) => { //update checks of targetfiles
      this.getTargetFileList();
    }, (err: any) => {
    })


    this.getAppendFilesApi()
  }

  getAppendFilesApi() {
    //getAppendFiles
    this.getAppendFilesList = []
    this.solService.getAppendFiles(this.process.processId).subscribe((res: any) => {
      this.getAppendFilesList = res.responseData?.appendSheetList

      console.log('getAppendFiles', res);

    }, (err: any) => { })
  }



  getJoinFilesList: Array<any> = []
  private threeNext() {
    this.getJoinFilesListApi()
  }

  getJoinFilesListApi() {
    this.getAppendFilesList = []
    this.solService.getMergeList(this.process.processId).subscribe((res: any) => {
      this.getJoinFilesList = res.responseData?.templatesMergeDetailsList

      console.log('getMergeList', res);

    }, (err: any) => { })
  }



  threePrev() {
    this.append_SourceFilesList = []
    this.getJoinFilesList = []
    forkJoin([this.solService.getTargetFileList(this.process.processId), this.solService.getMergeList(this.process.processId)]
    ).subscribe((res: any) => {
      console.log(res);
      res[0]?.responseData.appendSheetListDto?.appendSheetList.forEach((appObj: any) => {
        appObj.tableNameUI = appObj.appendName
        appObj.isSelectAllParentInDM = false //DM   
        appObj.tableAppendFieldsDto.forEach((colObj: any) => {
          colObj.isSelectAllChildInDM = false //DM         
          colObj.fileType = appObj.type,
            colObj.showTabColName = appObj.appendName + '[' + colObj.fieldName + ']'
          colObj.isDropdownDirtyInTF = false
        })
      })
      let fileResponse = res[0]?.responseData.templateFileDetailsListDto?.totalfileDetails
      fileResponse.forEach((fileObj: any) => {
        fileObj.totalSheetList.forEach((sheetObj: any) => {
          const sheetName = sheetObj.sheetName;
          sheetObj.sheet?.forEach((columnObj: any) => {
            columnObj.tableName = sheetObj.tableName;
            //columnObj.isCheckboxDirty = false      
            columnObj.isDropdownDirtyInTF = false
            columnObj.type = 'template'
            if (fileObj.fileExt == 'xlsx' || fileObj.fileExt == 'xls') columnObj.showTabColName = fileObj.fileName + '-' + sheetName + '.' + fileObj.fileExt + '[' + columnObj.fieldName + ']'
            else if (fileObj.fileExt == 'txt' || fileObj.fileExt == 'csv') columnObj.showTabColName = fileObj.fileNameWithExt + '[' + columnObj.fieldName + ']'
            else if (fileObj.fileExt == 'json') columnObj.showTabColName = fileObj.fileNameWithExt + '[' + columnObj.fieldName + ']'
            columnObj.fileExt = fileObj.fileExt
          })
        })
      })
      const filesheetList: any[] = []
      fileResponse.forEach((fileObj: any) => {
        fileObj.isSelectAllParentInDM = false //DM     
        fileObj.totalSheetList.forEach((sheetObj: any) => {
          if (sheetObj.sheetSelected) {
            sheetObj.sheet?.forEach((columnObj: any) => {
              columnObj.isSelectAllChildInDM = false //DM   
            })
            sheetObj.type = 'template'
            if (sheetObj.sheet != null) {
              if (sheetObj.fileExt == 'xlsx' || sheetObj.fileExt == 'xls') filesheetList.push({ fileExt: sheetObj.fileExt, fileName: fileObj.fileName + '-' + sheetObj.sheetName + '.' + fileObj.fileExt, ...sheetObj, isCheckedInAppend: false, isCheckedInJoin: false, type: 'files', tableNameUI: fileObj.fileName + '-' + sheetObj.sheetName + '.' + fileObj.fileExt })
              else if (sheetObj.fileExt == 'csv' || sheetObj.fileExt == 'txt') filesheetList.push({ fileExt: sheetObj.fileExt, fileName: fileObj.fileNameWithExt, ...sheetObj, isCheckedInAppend: false, isCheckedInJoin: false, type: 'files', tableNameUI: fileObj.fileNameWithExt })
              else if (sheetObj.fileExt == 'json') filesheetList.push({ fileExt: sheetObj.fileExt, fileName: fileObj.fileNameWithExt, ...sheetObj, isCheckedInAppend: false, isCheckedInJoin: false, type: 'files', tableNameUI: fileObj.fileNameWithExt })
            }
          }
        })
      })
      res[0]?.responseData.appendSheetListDto?.appendSheetList.forEach((_appendObj: any) => this.append_SourceFilesList.push(_appendObj))
      filesheetList.forEach((_sheetObj: any) => this.append_SourceFilesList.push(_sheetObj))
      this.getJoinFilesList = res[1]?.responseData?.templatesMergeDetailsList
    })
  }



  getOpearatorList: Array<any> = []
  getAllOperatorsList() {
    this.solService.getAllOperators().subscribe((res: any) => {
      this.getOpearatorList = res?.responseData
      console.log('this.getOpearatorList', this.getOpearatorList);

    }, (err: any) => {

    })
  }

  fileListtt: any[] = [];
  isUploadFilesNextBtnEnable: boolean = false;
  targetFiles: any[] = [];
  changeTabs(item: any, value?: string) {
    console.log(item, value)
    this.submitted = false;
    this.submittedErrorMsg = '';



    if (item.id == 0 && value == undefined) { //UF
      this.router.navigate(['/user/admin1/solutionboard/upload-files']);
      this.getAllFileTemplateListByProcessID()

    }
    if (item.id == 0 && value == 'prev') { //UF
      this.router.navigate(['/user/admin1/solutionboard/upload-files']);
      this.getAllFileTemplateListByProcessID()

    }
    //intgChanges
    if (item.id == 1 && value == 'prev') { //TF
      this.router.navigate(['/user/admin1/solutionboard/target-files']);
      this.getTargetFileList();

    }
    if (item.id == 1 && value == 'next') { //TF
      this.router.navigate(['/user/admin1/solutionboard/target-files']);


      this.nextBtnEnableInUF();
      if (this.isUploadFilesNextBtnEnable == true) return;

      this.oneNext()
    }

    if (item.id == 2 && value == 'prev') { //A
      this.router.navigate(['/user/admin1/solutionboard/append']);
      this.getTargetFileList();

      this.getAppendFilesApi()

    }

    if (item.id == 2 && value == 'next') { //A
      this.router.navigate(['/user/admin1/solutionboard/append']);

      this.twoNext()

      //appendList create here
    }

    if (item.id == 3 && value == 'prev') { //J
      this.router.navigate(['/user/admin1/solutionboard/join']);
      // this.getTargetFileList();
      // this.threeNext()
      this.threePrev()

      this.createExpressionList = []; //clearing CE,DS list 
      this.datasetDetailsList = []
      // this.getJoinFilesListApi()


    }

    if (item.id == 3 && value == 'next') { //J
      this.router.navigate(['/user/admin1/solutionboard/join']);
      // this.getTargetFileList();
      // this.threeNext()
      this.threePrev()

    }







    if (item.id == 4 && value == 'prev') {
      this.router.navigate(['/user/admin1/solutionboard/data-modeling']);
      // this.createExpressionList = []; //clearing CE,DS list 
      // this.datasetDetailsList = []
      this.getTargetFileList();
      this.getAllFunctions(); //fx
      //this.getSolutionScript(false)
      this.getAllOperatorsList()
    }
    if (item.id == 4 && value == 'next') {  //DM 
      this.router.navigate(['/user/admin1/solutionboard/data-modeling']);
      this.getTargetFileList();

      this.getAllFunctions(); //fx
      //this.getSolutionScript(false)
      this.getAllOperatorsList()
      // this.allTableListInDM = [];
      // this.allList();
      // this.getAllDataSetNameAPI();

    }





    this.tabsChange(item)


    console.log('this.fileListt', this.fileListt);
    //console.log( 'this.fileListtt',this.fileListtt);
    // //console.log(this.sortedCheckedList, 'this.sortedCheckedList');
    // console.log(this.fileSheetList, 'this.fileSheetList')
  }

  private tabsChange(item: any) {
    this.tabs.forEach((obj: any) => {
      if (item.id == obj.id) obj.isActive = true;
      else obj.isActive = false;
    })
  }






}
