import { Component, OnInit, Renderer2 } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, FormArray, FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { LoaderService } from 'src/app/core/services/loader.service';
import { PopupService } from 'src/app/core/services/popup.service';
import { SolutionService } from 'src/app/core/services/solution/solution.service';
import * as XLSX from "xlsx";
import { ToastComponent } from '../../all-common/toast/toast.component';

@Component({
  selector: 'app-solution-board-data-modelling',
  templateUrl: './solution-board-data-modelling.component.html',
  styleUrls: ['./solution-board-data-modelling.component.scss']
})
export class SolutionBoardDataModellingComponent implements OnInit {

  submited: boolean = false;
  appendForm!: FormGroup;
  submit: boolean = false;
  joinForm!: FormGroup;
  fileListt: any[] = []
  sortedList: any[] = [];
  sortedCheckedList: any[] = [];
  mergeCheckedList: any[] = [];
  appendUnchechedList: any[] = [];

  enableDataSetPopUp: boolean = false;
  datasetDetailsList: any[] = [];
  //, opearator :''
  createExpressionList: any[] = [];
  // createExpressionList = [{ fieldName: '', expression: '', isEdit: false, columnType: '', where: '', or: '', groupBy: '', value: '', signOperator: '', whereList: [{ operator: '', signOperator: '', value: '' }] }];

  filesList: any[] = [];
  columnsArr: any[] = [];
  showUploadFilesTab: boolean = false;
  masterSelected: boolean = false;
  tabs = [{ id: 0, value: 'Upload Files', isActive: true }, { id: 1, value: 'Filtered FIles', isActive: false }, { id: 2, value: 'Append', isActive: false }, { id: 3, value: 'Join', isActive: false }, { id: 4, value: 'Target Files', isActive: false }, { id: 5, value: 'Data Modelling', isActive: false }]
  enableAppendNamePopup: boolean = false;
  enableMergeNamePopup: boolean = false;
  submitted: boolean = false;
  submittedErrorMsg: string = '';
  targetFileRowEdit: number = -1;

  hideCreateIdenticalBtnWithLength: boolean = true;
  hideCreateIdenticalBtn: boolean = true;
  selectedM_A_S: any[] = []; //tab4
  showTargetFilePopup: boolean = false;//ta4



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
  appendListInMCL: any[] = [];
  appendListInSCL: any[] = [];
  sheetsListInSCL: any[] = [];
  allExpandState: boolean = false;
  panelOpenState: boolean = false;
  columnsForWhereInDS: Array<any> = []

  dataType = ['int', 'float', 'char', 'varchar', 'dateTime', 'money', 'text', 'decimal', 'datetime2', 'decimal', 'nvarchar', 'bigint']
  dataTypee = [{ id: 0, value: 'int' }, { id: 1, value: 'float' }, { id: 2, value: 'char' }, { id: 3, value: 'varchar' }, { id: 4, value: 'text' },
  { id: 5, value: 'money' }, { id: 6, value: 'dateTime' }, { id: 7, value: 'date' }, { id: 8, value: 'datetime2' }, { id: 9, value: 'decimal' }, { id: 10, value: 'nvarchar' }, { id: 11, value: 'bigint' }]


  dateTimeFormats = [{ id: 0, value: "MM/dd/yyyy" }, { id: 1, value: "MM-dd-yyyy" }, { id: 2, value: "dd/MM/yyyy" }, { id: 3, value: "dd-MM-yyyy" }, { id: 4, value: "yyyy/MM/dd" }, { id: 5, value: "yyyy-MM-dd" }, { id: 6, value: "yyyy/dd/MM" }, { id: 7, value: "yyyy-dd-MM" },
  { id: 8, value: "MMddyyyy" }, { id: 9, value: "ddMMyyyy" }, { id: 10, value: "yyyyMMdd" }, { id: 11, value: "yyyyddMM" }]



  joinType = ['Inner Join', 'Left Join', 'Outer Join', 'Right Join', 'Full Join', 'Cross Join']
  unCheckedListAddToMergeList: any[] = []; // try to x
  viewscriptForm!: FormGroup;
  sqlScriptForm!: FormGroup;
  selected_filename: any;
  process: any;
  allDatasetDetailsList: any[] = [];
  enableUploadSQLPopup: boolean = false;
  joinSetForm!: FormGroup;
  placetable: any = "Select Primary Table";
  dataSetForm!: FormGroup;
  dataSetData: any[] = [];

  datasetForm!: FormGroup;
  datasetTableForm!: FormGroup;
  datasetAppendForm!: FormGroup;
  getViewScriptForm!: FormGroup;

  constructor(
    private popup: PopupService,
    private router: Router,
    private formBuilder: FormBuilder, private toast: ToastComponent, private loader: LoaderService,
    private fb: FormBuilder, private renderer: Renderer2, private solService: SolutionService, private dialog: MatDialog) { }

  ngOnInit(): void {
    this.joinSetForm = this.formBuilder.group({
      Merg: this.formBuilder.array([])
    })
    // this.process = JSON.parse(localStorage.getItem("process") || '{}') //just commented 607B9457-C338-4D2B-8011-D47017162B24
    //2482728E-1536-47BF-A60A-FACD3CD8F0F7
    this.process = { processId: '86aee36c-a54a-49aa-8654-1a985172525a' }
    this.getAllFileTemplateListByProcessID()

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
      solutionScriptId: ['']
    });

    // this.MergeArr().push(this.Merg())
    // this.TableArr(0).push(this.addTable())
    // this.columnArr(0,0).push(this.addColumn())
    //console.log(this.joinSetForm);
    //this.datasetForm.get("appendNameControl")?.setAsyncValidators([this.validateDatasetname()]);

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





  Merg(): FormGroup {
    return this.formBuilder.group({
      tableControl: this.formBuilder.array([]),
    })
  }
  addTable(): FormGroup {
    return this.formBuilder.group({
      table1: ['', Validators.required],
      join: ['', Validators.required],
      table2: ['', Validators.required],
      column: this.formBuilder.array([])
    })
  }
  addColumn(): FormGroup {
    return this.formBuilder.group({
      column1: ['', Validators.required],
      column2: ['', Validators.required]
    })
  }
  DataSetArr(): FormArray { //DS popup
    return this.dataSetForm.get('DSetRows') as FormArray
  }
  MergeArr(): FormArray {
    return this.joinSetForm.get('Merg') as FormArray
  }

  TableArr(i: any): FormArray {
    return this.MergeArr().controls[i].get('tableControl') as FormArray
  }

  columnArr(i: any, j: any): FormArray {
    return this.TableArr(i).controls[j].get('column') as FormArray
  }

  addMergeJoin() {
    this.MergeArr().push(this.Merg())
    let len = this.MergeArr().length
    this.TableArr(len - 1).push(this.addTable())
    let j = this.TableArr(len - 1).length
    this.columnArr(len - 1, j - 1).push(this.addColumn())


  }

  addTableJoins(i: any, j: any) {
    this.mergeCheckedList[i].dropDownList[j + 1].columns = [{ primaryKeyList: [], foreignKeyList: [] }]
    this.TableArr(i).push(this.addTable())
    let len = this.TableArr(i).length;
    this.columnArr(i, len - 1).push(this.addColumn())
  }

  addColumnJoin(i: any, j: any) { //column add
    this.columnArr(i, j).push(this.addColumn())
  }

  removeTable(i: any, j: any) {
    // let len=this.TableArr(i).controls.length
    this.TableArr(i).removeAt(j)
  }

  removeCol(i: any, j: any, k: any) {
    this.columnArr(i, j).removeAt(k)
  }

  // this.DataSetArr().controls.push(this.DataSetRow())
  // this.DataSetArr().controls.push(this.addDatasetRow())

  //DS 
  DataSetRow(): FormGroup {
    return this.formBuilder.group({
      Ptable: ['', Validators.required],
      join: ['', Validators.required],
      Ftable: ['', Validators.required],
      Pcolumn: ['', Validators.required],
      Fcolumn: ['', Validators.required],
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


  ngAfterViewInit(): void {
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


  isAllSelectedUploadFiles() {
    let p = 1;
    this.fileListt.forEach((obj: any) => {
      obj.totalSheetList.forEach((item: any) => {
        if (item.isSheetSelected == false) {
          p = 0;
          return;
        }
      })
    })
    if (p == 0) this.masterSelected = false;
    else this.masterSelected = true;
    this.nextBtnEnableInUF();
  }


  checkUncheckAllUploadFiles() {
    this.fileListt.forEach((obj: any) => {
      obj?.totalSheetList?.forEach((item: any) => {
        item.isSheetSelected = this.masterSelected;
      })
    })
    this.nextBtnEnableInUF();
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

  iscreatesolutionEdit: boolean = false
  getAllFileTemplateListByProcessID() { //R 
    this.loader.show();

    this.solService.getAllFileTemplateListByProcessID(this.process.processId).subscribe((res: any) => {
      this.showUploadFilesTab = true;

      const ResponseData = res.responseData.totalfileDetails

      if (ResponseData.length == 0) this.showUploadFilesTab = false;
      else {
        this.iscreatesolutionEdit = true
        ResponseData.forEach((fileObj: any) => {
          // fileObj.fileExtention = fileObj.fileName.split('.').slice(1, 2).join('');
          // fileObj.fileName = fileObj.fileName.split('.').slice(0, -1).join('.');
          fileObj.totalSheetList.forEach((sheetObj: any) => {
            sheetObj.isSheetSelected = false;
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
      }
      this.loader.hide();
      //console.log(this.fileListt)
    }, (err: any) => {
      this.loader.hide();
    })

  }



  saveiputFiles(ev: any) {  //R
    this.showUploadFilesTab = true;
    let processId: string = this.process.processId;
    const formData = new FormData();
    formData.append('processId', processId);

    for (let i = 0; i < ev.target.files.length; i++) {
      formData.append('file', ev.target.files[i])
    }

    for (let index = 0; index < ev.target.files.length; index++) {
      const file = ev.target.files[index];

      // if(file.type == 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
      this.fileListt.push({ fileNameWithExt: file.name.split('.')[0], isProgressBar: true, fileExt: file.name.split('.')[1] })
    }

    // R
    this.solService.postInputFiles(formData).subscribe((res: any) => {

      //     const sheetMetaData = JSON.parse(res.responseData.sheetMetaData);

      //     sheetMetaData.forEach((fileObj: any) => {
      //       // fileObj.fileExtention = fileObj.fileName.split('.').slice(1, 2).join('');
      //       // fileObj.fileName = fileObj.fileName.split('.').slice(0, -1).join('.');
      //       fileObj.totalSheetList.forEach((sheetObj: any) => {
      //         sheetObj.isSheetSelected = false;
      //         const sheetName = sheetObj.sheetName;
      //         sheetObj.sheet?.forEach((columnObj: any) => {
      //           columnObj.isChecked = false;
      //           columnObj.tableName = sheetObj.tableName;
      //           //columnObj.showTabColName = fileObj.fileName + '-' + sheetName + '[' + columnObj.fieldName + ']'
      //           if (fileObj.fileExt == 'xlsx' || fileObj.fileExt == 'xls') columnObj.showTabColName = fileObj.fileName + '-' + sheetName + '.' + fileObj.fileExt + '[' + columnObj.fieldName + ']'
      //           else if (fileObj.fileExt == 'txt' || fileObj.fileExt == 'csv') columnObj.showTabColName = fileObj.fileNameWithExt + '[' + columnObj.fieldName + ']'
      //           columnObj.fileExt = fileObj.fileExt
      //         })
      //       })
      //     })
      //     this.fileListt = sheetMetaData;
      //     //console.log(this.fileListt)

      //   }
      this.getAllFileTemplateListByProcessID()
    }, (err: any) => {
      this.loader.hide()

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
    this.createExpressionList[this.textAreaIndexinCE.index].expression = newValue;
  }

  textAreaIndexInDM: any = {}; //x
  textAreaInDataModeling(e: any, i: number) { //x
    const start = e.target.selectionStart;
    const end = e.target.selectionEnd;
    const cursorPosition = e.target.value.substr(start, end - start);
    this.textAreaIndexInDM = { index: i, cursorPosition: start, value: e.target.value }
  }


  createNewDataSet() {
    this.createExpressionList = [{ excludeInSelect: false, sourcecolumnName: '', columnId: '', columnFormat: '', signOperatorList: '', expression: '', isEdit: false, columnType: '', where: '', or: '', groupBy: '', orderBy: '', value: '', signOperator: '', whereList: [] }];
    // if (this.datasetDetailsList.filter((x: any) => x.datasetName != this.datasetForm.get('appendNameControl')?.value)) {
    // }
    // else {
    this.enableDataSetPopUp = false;
    //const datasetFieldDTOList = [{ fieldName: '', expression: '', columnType: '', isEdit:false }]
    const ds = { isDatasetTableExpand: true, having: '', groupBytoDB: [], orderBytoDB: [], datasetName: this.datasetForm.get('appendNameControl')?.value.trim(), datasetFieldDTOList: [], orderBy: '', groupBy: '' }
    this.datasetDetailsList.push(ds)
    //}
  }


  saveDataSetDropdowns() {


    this.saveDataSetApi();

  }





  changePrimaryTableInDS(e: any, index: number, columnObj: any, indexPKFK: number, fileObj: any) {
    const value = e.target.value;
    let templateId: any;
    //let pTList = (columnObj.primaryTableList == undefined) ? [] : JSON.parse(JSON.stringify(columnObj.primaryTableList));
    let pTList = JSON.parse(JSON.stringify(fileObj.pkFKs[0].primaryTableList));
    let sTList = (columnObj.secondaryTableList == undefined) ? [] : JSON.parse(JSON.stringify(columnObj.secondaryTableList));
    let fileType: any;



    //if ((columnObj?.primaryTableList[0]?.fileType == undefined) ? false : columnObj?.primaryTableList[0]?.fileType == 'source file') {
    if (value.includes('-')) {
      let fName = value.split('-')[0];
      let sName = value.split('-')[1];
      this.fileListt.filter((fileObj: any) => {
        if (fileObj.fileName == fName) {
          fileObj?.totalSheetList.forEach((sheetObj: any) => {
            if (sheetObj.sheetName == sName)
              templateId = sheetObj.templateId;
          })
        }
      })
    }
    else {

      if (indexPKFK == 0) fileType = columnObj.primaryTableList.filter((x: any) => x.fileName == value).map((y: any) => y.fileType)
      else fileType = columnObj.secondaryTableList.filter((x: any) => x.fileName == value).map((y: any) => y.fileType)
      if (fileType == 'append file') {
        templateId = this.appendAPIResp.appendSheetList.filter((x: any) => x.appendName == value)[0].appendID;
      }
      if (fileType == 'join file') {
        templateId = this.mergeCheckedList.filter((x: any) => x.showMergeName == value)[0].mergeIdFromAPI;
      }
      fileObj.dataSetMergeListDTOs[columnObj.order - 1].primaryTableName = value;

    }

    if (indexPKFK == 0) {
      const filteredPT = columnObj.primaryTableList.filter((x: any) => x.fileName == e.target.value);


      columnObj.selectedPrimaryTable = value;
      columnObj.primaryTemplateId = templateId;
      fileObj.dataSetMergeListDTOs[columnObj.order - 1].primaryTemplateId = templateId;

      if (fileType == 'join file') {
        const cList = this.mergeCheckedList.filter((x: any) => x.showMergeName == value)
        fileObj.pkFKs[indexPKFK + 1].primaryKeyList = cList[0].mergeFieldListDTOFromAPI;
      }
      else {
        const cList = columnObj.primaryTableList.filter((x: any) => x.fileName == value);
        fileObj.pkFKs[indexPKFK + 1].primaryKeyList = cList[0].columnList;
      }

      columnObj.primaryTableList.forEach((fileObj: any, index: number) => {
        if (fileObj.fileName == value) {
          pTList.splice(index, 1)
        }
      })
      fileObj.pkFKs[indexPKFK + 3].foreignTableList = pTList;

    }
    let secTList: any[] = [];
    if (indexPKFK > 4) {
      columnObj.selectedSecondaryTable = value;
      columnObj.primaryTemplateId = templateId;
      fileObj.dataSetMergeListDTOs[columnObj.order - 1].primaryTemplateId = templateId;

      if (fileType == 'join file') {
        const cList = this.mergeCheckedList.filter((x: any) => x.showMergeName == value)

        fileObj.pkFKs[indexPKFK + 1].secondaryKeyList = cList[0].mergeFieldListDTOFromAPI;

        //columnObj.secondaryTableList.forEach((fileObj: any, index: number) => {
        //  this.mergeCheckedList.forEach((filePrimaryObj: any) => {
        // if (!sTList.map((x: any) => x.fileName).includes(filePrimaryObj.fileName)) {
        //   secTList.push(filePrimaryObj)
        // }

        // })
        // this.mergeCheckedList.forEach((mc:any)=>{
        //   this.
        // })

        //secTList = secTList.map(({ showMergeName: fileName, ...rest }) => ({ fileName, ...rest }));

      }
      else {

        const cList = columnObj.secondaryTableList.filter((x: any) => x.fileName == value);
        fileObj.pkFKs[indexPKFK + 1].secondaryKeyList = cList[0].columnList;



      }
      pTList.forEach((filePrimaryObj: any) => {
        if (!sTList.map((x: any) => x.fileName).includes(filePrimaryObj.fileName)) {
          secTList.push(filePrimaryObj)
        }

      })


      fileObj.pkFKs[indexPKFK + 3].foreignTableList = secTList;
    }

  }

  changePrimaryKeyInDS(e: any, index: number, columnObj: any, indexPKFK: number, fileObj: any) {
    const value = e.target.value;
    const orderNumber = columnObj.order;
    let cId: any;
    if (indexPKFK == 1) {
      columnObj.selectedPrimaryKey = value;
      columnObj.primaryKeyList.forEach((colObj: any) => {
        if (colObj.fieldName == value) {
          cId = colObj.columnId;

        }
      })
      columnObj.primaryKeyId = cId;
      fileObj.dataSetMergeListDTOs[columnObj.order - 1].primaryKeyId = cId;

    }
    else {
      columnObj.selectedSecondaryKey = value;
      columnObj.secondaryKeyList.forEach((colObj: any) => {
        if (colObj.fieldName == value) {
          cId = colObj.columnId;

        }
      })
      columnObj.primaryKeyId = cId;
      fileObj.dataSetMergeListDTOs[columnObj.order - 1].primaryKeyId = cId;
    }

  }

  changeJoinTypeInDS(e: any, index: number, columnObj: any, indexPKFK: number, fileObj: any) {
    const value = e.target.value;
    columnObj.selectedMergeType = value;

    fileObj.dataSetMergeListDTOs[columnObj.order - 1].joinType = value.slice(0, 1);
  }

  changeSecondaryTableInDS(e: any, index: number, columnObj: any, indexPKFK: number, fileObj: any) {
    const value = e.target.value;
    let templateId: any;
    let fileType: any;
    //if (columnObj.foreignTableList[0].fileType == 'source file') {
    if (value.includes('-')) {
      let fName = value.split('-')[0];
      let sName = value.split('-')[1];
      this.fileListt.filter((fileObj: any) => {
        if (fileObj.fileName == fName) {
          fileObj?.totalSheetList.forEach((sheetObj: any) => {
            if (sheetObj.sheetName == sName)
              templateId = sheetObj.templateId;
          })
        }
      })
    }
    else {

      if (indexPKFK == 3) fileType = columnObj.foreignTableList.filter((x: any) => x.fileName == value).map((y: any) => y.fileType)
      else fileType = columnObj.foreignTableList.filter((x: any) => x.fileName == value).map((y: any) => y.fileType)
      if (fileType == 'append file') {
        templateId = this.appendAPIResp.appendSheetList.filter((x: any) => x.appendName == value)[0].appendID;
      }
      if (fileType == 'join file') {
        templateId = this.mergeCheckedList.filter((x: any) => x.showMergeName == value)[0].mergeIdFromAPI;
      }
      fileObj.dataSetMergeListDTOs[columnObj.order - 1].secondaryTableName = value;
    }
    //}



    const orderNumber = columnObj.order;
    columnObj.selectedForeignTable = value;
    columnObj.secondaryTemplateId = templateId;

    if (fileType == 'join file') {
      const cList = this.mergeCheckedList.filter((x: any) => x.showMergeName == value)
      fileObj.pkFKs[indexPKFK + 1].foreignKeyList = cList[0].mergeFieldListDTOFromAPI;
    }
    else {
      const cList = columnObj.foreignTableList.filter((x: any) => x.fileName == value);
      fileObj.pkFKs[indexPKFK + 1].foreignKeyList = cList[0].columnList;
    }

    //list adding to index=5,10,..
    const selectedPT = fileObj.pkFKs.filter((x: any) => x.selectedPrimaryTable).map((y: any) => y.selectedPrimaryTable);
    const selectedFT = fileObj.pkFKs.filter((x: any) => x.selectedForeignTable).map((y: any) => y.selectedForeignTable);
    const secondaryTableListt = [...selectedPT, ...selectedFT]
    const secdryTabList: any[] = [];
    fileObj.pkFKs[0].primaryTableList.forEach((fileObj: any) => {
      if (secondaryTableListt.includes(fileObj.fileName)) {
        secdryTabList.push(fileObj)
      }
    })
    if (fileObj.pkFKs[indexPKFK + 2] != undefined) fileObj.pkFKs[indexPKFK + 2].secondaryTableList = secdryTabList;


    fileObj.dataSetMergeListDTOs[columnObj.order - 1].secondaryTemplateId = templateId;
  }

  changeSecondaryKeyInDS(e: any, index: number, columnObj: any, indexPKFK: number, fileObj: any) {
    const value = e.target.value;
    columnObj.selectedForeignKey = value;

    const cList = columnObj.foreignKeyList.filter((x: any) => x.fieldName == value);
    columnObj.secondaryKeyId = cList[0].columnId;


    fileObj.dataSetMergeListDTOs[columnObj.order - 1].secondaryKeyId = cList[0].columnId;
  }






  accordionFilesRowClicked(item: any, i: number, comp: any, j: number, listType: any) {
    const value = comp.showTabColName;
    const cType = comp.columnType;
    //const value = (listType == 'JF') ? item.showMergeName + '[' + comp.fieldName + ']' : (listType == 'AF') ? item.showAppendName + '[' + comp.fieldName + ']' : (listType == 'SF') ? comp.fileSheet + '[' + comp.fieldName + ']' : comp.showTabColName
    if (this.textAreaIndexinCE.tagType == 'textArea') this.textAreaSlice(value);
    if (this.textAreaIndexinCE.tagType == 'input') {
      this.createExpressionList[this.textAreaIndexinCE.index].fileType = listType;
      this.createExpressionList[this.textAreaIndexinCE.index].sourcecolumnName = value;
      this.createExpressionList[this.textAreaIndexinCE.index].columnType = cType;
      this.createExpressionList[this.textAreaIndexinCE.index].sqlColumn = comp.sqlColumn;

      if (cType == 'date' || cType == 'datetime2' || cType == 'dateTime') { //copy
        this.createExpressionList[0].isColumnType = true; //it'll b 0 only
        this.signOperatorList = [{ id: 0, value: 'IS NULL' }, { id: 1, value: 'IS NOT NULL' }, { id: 2, value: 'IN' }, { id: 3, value: 'NOT IN' }, { id: 4, value: '=' }, { id: 5, value: '!=' }, { id: 6, value: '>=' }, { id: 7, value: '>' }, { id: 8, value: '<' }, { id: 9, value: '<=' }]
      }
      else this.createExpressionList[0].isColumnType = false;

      if (cType == 'char' || cType == 'varchar' || cType == 'text' || cType == 'nvarchar') {
        this.signOperatorList = [{ id: 0, value: 'IS NULL' }, { id: 1, value: 'IS NOT NULL' }, { id: 2, value: 'LIKE' }, { id: 3, value: 'NOT LIKE' }, { id: 4, value: 'NOT IN' }, { id: 5, value: 'IN' }]
      }

      if (cType == 'int' || cType == 'float' || cType == 'money' || cType == 'decimal' || cType == 'bigint') {
        this.signOperatorList = [{ id: 0, value: 'IS NULL' }, { id: 1, value: 'IS NOT NULL' }, { id: 2, value: 'IN' }, { id: 3, value: 'NOT IN' }, { id: 4, value: '=' }, { id: 5, value: '!=' }, { id: 6, value: '>=' }, { id: 7, value: '>' }, { id: 8, value: '<' }, { id: 9, value: '<=' }]
      } //
    }
  }





  //create Expression in DM
  inputInCreateExpression(e: any, i: number) {

    this.createExpressionList[i].sourcecolumnName = e.target.value;
    const start = e.target.selectionStart;

    this.textAreaIndexinCE = { index: i, cursorPosition: start, value: e.target.value, tagType: 'input' }

  }

  textAreaIndexinCE: any = {}
  textAreaInCreateExpression(e: any, i: number) {
    this.createExpressionList[i].expression = e.target.value;
    const start = e.target.selectionStart;

    this.textAreaIndexinCE = { index: i, cursorPosition: start, value: e.target.value, tagType: 'textArea' }
  }

  createDataSetinDM() {
    //console.log('this.targetFiles',this.targetFiles);
    console.log('this.allTableListWithoutDSInDM', this.allTableListWithoutDSInDM);
    console.log('this.allTableListInDM', this.allTableListInDM);
    console.log('this.tablecolNameList', this.tablecolNameList);  //for expn
    console.log('this.datasetDetailsList', this.datasetDetailsList);




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
    if (e.value == 'date' || e.value == 'datetime2' || e.value == 'dateTime') {
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
    this.createExpressionList.push(JSON.parse(JSON.stringify(item)));
  }

  deleteRowInDataset(i: number, j: number, item: any) {
    if (this.datasetDetailsList[i].datasetFieldDTOList[j].isEdit == true) this.createExpressionList = [{ sourcecolumnName: '', columnId: '', expression: '', isEdit: false, columnType: '', where: '', or: '', groupBy: '', orderBy: '', value: '', signOperator: '', whereList: [] }];
    //clearing CE if edited row is deleted

    this.datasetDetailsList[i]?.datasetFieldDTOList.splice(j, 1);

    //changes update in orderby,groupby
    this.datasetDetailsList[i]?.orderBytoDB.forEach((obObj: any, index: number) => {
      if (item.sourcecolumnName == obObj.filefieldName) this.datasetDetailsList[i]?.orderBytoDB.splice(index, 1)
    })
    this.datasetDetailsList[i]?.groupBytoDB.forEach((gbObj: any, index: number) => {
      if (item.sourcecolumnName == gbObj.filefieldName) this.datasetDetailsList[i]?.groupBytoDB.splice(index, 1)
    })
    this.columnsForWhereInDS.forEach((colmnObj: any, index: number) => { //2jan
      if (item.sourcecolumnName == colmnObj.filefieldName) this.columnsForWhereInDS.splice(index, 1)
    })
    this.UpdatechecksInDM(item, false)

  }

  tablecolNameList: any[] = []
  getAllDataSetNameAPI() {
    this.solService.getAllDatasetName(this.process.processId).subscribe((res: any) => {
      if (res != null) {
        res.responseData.forEach((datasetObj: any) => {
          datasetObj.datasetFieldDTOList.forEach((colObj: any) => {
            colObj.showTabColName = datasetObj.datasetName + '[' + colObj.fieldName + ']'

            colObj.groupBy = ''
            colObj.isColumnType = false//shd check
            colObj.isEdit = false
            colObj.or = ''
            colObj.orderBy = ''
            colObj.signOperator = ''
            colObj.signOperatorList = ''
            colObj.sourcecolumnName = colObj.uiFieldName
            colObj.value = ''
            colObj.where = ''
            colObj.whereList = []
          })
          datasetObj.isDatasetTableExpand = false
          datasetObj.orderBytoDB = datasetObj.orderBy
          datasetObj.groupBytoDB = datasetObj.groupBy

        })
        this.allDatasetDetailsList = res.responseData;


        // this.allTableListInDM.forEach((tabObj:any,index:number)=>{

        // })
        this.allTableListInDM = []
        this.allTableListInDM = JSON.parse(JSON.stringify(this.allTableListWithoutDSInDM))

        res.responseData.forEach((dsObj: any) => { //shd write cndtn if no DSs
          dsObj.datasetFieldDTOList.forEach((colObj: any) => {
            colObj.fileType = 'dataset',
              colObj.fieldIDforExpn = colObj.datasetFieldId //for expn
          })
          this.allTableListInDM.push({ fileType: 'dataset', tableNameUI: dsObj.datasetName, tableNameDB: dsObj.tableName, idName: 'datasetId', ID: dsObj.datasetId, columnList: dsObj.datasetFieldDTOList, isSelecteddl: false })
        })


        // this.tablecolNameList.forEach((obj: any, index: number) => { //need to check
        //   if (obj.fileType == 'dataset') {
        //     this.tablecolNameList.splice(index, 1)
        //   }
        // })

      }

      this.tablecolNameList = []
      this.tablecolNameList = this.allTableListInDM.map((ele: any) =>
        ele.columnList.map((sub: any) => ({ tableName: ele.tableName, fileType: ele.fileType, fieldID: ele.fieldID, showTabColName: sub.showTabColName, fieldIDforExpn: sub.fieldIDforExpn, tableColumnName: sub.tableColumnName }))
      ).reduce((acc, val) => acc.concat(val), []);
      this.loader.hide()
    }, (err: any) => {
      this.loader.hide()

    })
  }

  nextBtnEnableInUF() {
    const checkedSheets = this.fileListt.filter((element: any) =>
      element.totalSheetList?.some((subElement: any) => subElement.isSheetSelected == true))
      .map((element: any) => {
        return Object.assign({}, element, { totalSheetList: element.totalSheetList.filter((subElement: any) => subElement.isSheetSelected == true) });
      });
    if (checkedSheets.length == 0) this.isUploadFilesNextBtnEnable = true;
    else this.isUploadFilesNextBtnEnable = false;
  }


  deleteDataSet(i: number) {
    this.datasetDetailsList.splice(i, 1)
    this.createExpressionList = []
    this.datasetDetailsList = []
  }




  AJFDlist: any[] = [];
  aJFDAllFilesList: any[] = [];
  fileListtt: any[] = [];
  templatesMergeObj: any = {};
  mergeCheckedListForDM: any[] = [];
  secndAPIResp: any = {};
  isUploadFilesNextBtnEnable: boolean = false;
  targetFiles: any[] = [];
  skipAppend: boolean = false;
  skipJoin: boolean = false;
  changeTabs(item: any, value?: string) {



    //intgChanges
    if (item.id == 1) {

      this.fileListtt = [];

      this.nextBtnEnableInUF();
      if (this.isUploadFilesNextBtnEnable == true) return;
      this.fileListt.forEach((file: any) => {

        if (file.totalSheetList.filter((x: any) => x.isSheetSelected).length != 0) {
          this.fileListtt.push(file)
          if (file.fileExt != 'xlsx' || file.fileExt != 'xls') {
            file.totalSheetList.forEach((sheetObj: any) => {
              file.tableName = sheetObj.tableName
            })
          }

        }
      })
      this.createIdentical(-1)
      this.getTargetFileList();



    }
    if (item.id == 2) {
      this.sortedCheckedList.forEach((obj: any) => obj.isSelected = false)
      if (this.skipAppend == false || this.skipJoin == false) {
        item.id = 4
      }
      //if (this.iscreatesolutionEdit) item.id = 4
    }

    if (item.id == 3) {
      this.sortedList[0].forEach((obj: any) => obj.isSelected = false)

    }
    this.submitted = false;
    this.submittedErrorMsg = '';


    if (item.id == 4) {
      //this.loader.show();
      this.targetFiles = []
      this.getTargetFileList();
      this.sortedCheckedList.forEach((obj: any) => obj.isSelected = false)

    }

    if (item.id == 4 && value == 'prev') {
      this.createExpressionList = []; //clearing CE,DS list 
      this.datasetDetailsList = []
    }

    if (item.id == 5) {
      this.getAllFunctions(); //fx
      this.allTableListInDM = [];
      this.allList();
      this.getAllDataSetNameAPI();






    }
    if (value == 'unChedkedList') {
      console.log('only reset')
      if (this.sortedList[0]?.length != 0) {
        this.unCheckedListAddToMergeList = this.sortedList[0].filter((x: any) => x.isSelected == false)
        this.unCheckedListAddToMergeList.forEach((obj: any) => {
          let fileName_SheetNamee: any;
          if (obj.fileExt == 'xlsx' || obj.fileExt == 'xls') fileName_SheetNamee = [obj].map((x: any) => [x.fileName, x.sheetName].join('-'))
          else fileName_SheetNamee = [obj].map((x: any) => [x.fileName])

          //
          const sheetName = obj.sheetName;
          // const columnData = obj[sheetName + 'columnList'];
          const columnListt: any[] = [];

          //intg changes
          obj.sheet.forEach((sheetObj: any) => {
            let typof: string = '';
            const columnObj = { ...sheetObj, isChecked: false, dataType: 'Select Data Type', newfieldName: '', isRowEdit: false, fileSheet: fileName_SheetNamee, generatedDataType: typof, tableName: obj.tableName }
            columnListt.push(columnObj)
          })


          const identicalSet = {
            columnList: columnListt, showAppendName: fileName_SheetNamee, fileName_SheetName: fileName_SheetNamee, tableList: [obj], isSelected: false, fileExt: obj.fileExt
          }
          this.sortedCheckedList.push(identicalSet);
          //console.log(this.sortedCheckedList);

          this.appendUnchechedList = [];
          this.appendUnchechedList = JSON.parse(JSON.stringify(this.sortedCheckedList))

        })
      }
    }

    if (value == 'prevInMerge') {
      if (this.sortedList[0]?.length != 0) {
        let sortedLength = this.sortedList[0]?.length;
        let sortedCheckedLength = this.sortedCheckedList.length;
        this.sortedCheckedList.splice(sortedCheckedLength - sortedLength, this.unCheckedListAddToMergeList.length)
      }
      //if(this.skipJoin) item.id = 2
    }



    this.tabs.forEach((obj: any) => {
      if (item.id == obj.id) obj.isActive = true;
      else obj.isActive = false;
    })

    this.filesList.forEach((obj: any) => {
      obj.checkedSheetList = obj.sheetList.filter((x: any) => x.isSelected)
    })
    // console.log(this.fileListt, 'this.fileListt');
    //console.log( 'this.fileListtt',this.fileListtt);
    // //console.log(this.sortedCheckedList, 'this.sortedCheckedList');
    // console.log(this.fileSheetList, 'this.fileSheetList')

  }
  // merge
  MergeSubmit() {
    this.loader.show()
    console.log(this.joinSetForm.value, this.process.processId);
    let data: any = {}
    data.processId = this.process.processId
    data.templatesMergeDetailsList = []

    this.MergeArr().controls.forEach((ele: any, i: any) => {
      data.templatesMergeDetailsList[i] = {}

      // console.log(this.mergeCheckedList[i].showMergeName);
      data.templatesMergeDetailsList[i].mergeName = this.mergeCheckedList[i].showMergeName
      data.templatesMergeDetailsList[i].templatesMergeList = []
      data.templatesMergeDetailsList[i].mergeTableDetails = []


      // for (let z = 0; z < this.mergeCheckedList.length ; z++) {
      this.mergeCheckedList.forEach(() => {
        //new change
        this.mergeCheckedList[i].dropDownList[0].primaryTableList.forEach((merObj: any, j: number) => {
          data.templatesMergeDetailsList[i].mergeTableDetails[j] = {}

          // if () {

          // }
          // else if () {

          // }
          // else 
          if (merObj.fileExt == 'xlsx' || merObj.fileExt == 'xls' || merObj.fileExt == 'csv' || merObj.fileExt == 'txt') {

            data.templatesMergeDetailsList[i].mergeTableDetails[j].id = merObj.templateId
            data.templatesMergeDetailsList[i].mergeTableDetails[j].type = 'T'
          }

          else if (merObj.isAppend) {
            this.appendAPIResp.appendSheetList.forEach((object: any) => {
              if (object.appendName == merObj.value.join()) {
                data.templatesMergeDetailsList[i].mergeTableDetails[j].id = object.appendID
                data.templatesMergeDetailsList[i].mergeTableDetails[j].type = 'A'
              }
            })
          }
        })

      })





      this.TableArr(i).controls.forEach((elem: any, j: any) => {
        data.templatesMergeDetailsList[i].templatesMergeList[j] = {}

        //console.log(elem);
        let ptemplateId = elem.value.table1.templateId
        let stemplateId = elem.value.table2.templateId
        let pAppendName: any;
        let sAppendName: any;
        if (ptemplateId == undefined) { // append table
          this.appendAPIResp.appendSheetList.forEach((obj: any) => {
            if (obj.appendName == elem.value.table1.value.join()) {
              data.templatesMergeDetailsList[i].templatesMergeList[j].primaryTemplateId = obj.appendID
              data.templatesMergeDetailsList[i].templatesMergeList[j].primaryTableName = obj.tableName
              //data.templatesMergeDetailsList[i].templatesMergeList[j].primaryTableType = 'A'
              pAppendName = obj.appendName
            }
          })
        }
        else { //sheet table
          data.templatesMergeDetailsList[i].templatesMergeList[j].primaryTemplateId = ptemplateId

          data.templatesMergeDetailsList[i].templatesMergeList[j].primaryTableName = elem.value.table1.tableName
          // data.templatesMergeDetailsList[i].templatesMergeList[j].primaryTableType = 'S'
        }

        if (stemplateId == undefined) { // append table
          this.appendAPIResp.appendSheetList.forEach((obj: any) => {
            if (obj.appendName == elem.value.table2.value.join()) {
              data.templatesMergeDetailsList[i].templatesMergeList[j].secondaryTemplateId = obj.appendID

              data.templatesMergeDetailsList[i].templatesMergeList[j].secondaryTableName = obj.tableName
              //data.templatesMergeDetailsList[i].templatesMergeList[j].secondaryTableType = 'A'

              sAppendName = obj.appendName
            }
          })
        }
        else { //sheet table
          data.templatesMergeDetailsList[i].templatesMergeList[j].secondaryTemplateId = stemplateId

          data.templatesMergeDetailsList[i].templatesMergeList[j].secondaryTableName = elem.value.table2.tableName
          // data.templatesMergeDetailsList[i].templatesMergeList[j].secondaryTableType = 'S'

        }


        // data.templatesMergeDetailsList[i].templatesMergeList[j].primaryTemplateId = ptemplateId
        // data.templatesMergeDetailsList[i].templatesMergeList[j].secondaryTemplateId = stemplateId



        data.templatesMergeDetailsList[i].templatesMergeList[j].joinType = elem.value.join[0]

        // let table1 = elem.value.table1.value.join()
        // let table2 = elem.value.table2.value.join()

        // data.templatesMergeDetailsList[i].templatesMergeList[j].primaryTableName = table1
        // data.templatesMergeDetailsList[i].templatesMergeList[j].secondaryTableName = table2
        data.templatesMergeDetailsList[i].templatesMergeList[j].order = (j == 0) ? 1 : 2
        data.templatesMergeDetailsList[i].templatesMergeList[j].columnArrayList = []
        this.columnArr(i, j).controls.forEach((element: any, k: any) => {
          data.templatesMergeDetailsList[i].templatesMergeList[j].columnArrayList[k] = {}

          // console.log(element);
          if (ptemplateId == undefined) { //append
            this.appendAPIResp.appendSheetList.forEach((obj: any) => {
              if (obj.appendName == pAppendName) {
                obj.tableAppendFieldsDto.forEach((tObj: any) => {
                  if (tObj.columnName == element.value.column1.columnName) {
                    data.templatesMergeDetailsList[i].templatesMergeList[j].columnArrayList[k].primaryKeyId = tObj.fieldID
                  }
                })
              }
            })

          }
          else {//sheet
            data.templatesMergeDetailsList[i].templatesMergeList[j].columnArrayList[k].primaryKeyId = element.value.column1.columnId
          }
          data.templatesMergeDetailsList[i].templatesMergeList[j].columnArrayList[k].primaryFieldName = element.value.column1.columnName

          if (stemplateId == undefined) { //append
            this.appendAPIResp.appendSheetList.forEach((obj: any) => {
              if (obj.appendName == sAppendName) {
                obj.tableAppendFieldsDto.forEach((tObj: any) => {
                  if (tObj.columnName == element.value.column2.columnName) {
                    data.templatesMergeDetailsList[i].templatesMergeList[j].columnArrayList[k].secondaryKeyId = tObj.fieldID
                  }
                })
              }
            })
          }
          else {//sheet
            data.templatesMergeDetailsList[i].templatesMergeList[j].columnArrayList[k].secondaryKeyId = element.value.column2.columnId
          }
          data.templatesMergeDetailsList[i].templatesMergeList[j].columnArrayList[k].secondaryFieldName = element.value.column2.columnName


          // data.templatesMergeDetailsList[i].templatesMergeList[j].columnArrayList[k].primaryKeyId = element.value.column1.columnId
          // data.templatesMergeDetailsList[i].templatesMergeList[j].columnArrayList[k].primarycolumnName = element.value.column1.columnName
          // data.templatesMergeDetailsList[i].templatesMergeList[j].columnArrayList[k].secondaryKeyId = element.value.column2.columnId
          // data.templatesMergeDetailsList[i].templatesMergeList[j].columnArrayList[k].secondarycolumnName = element.value.column2.columnName



        });
      });

    });
    console.log(data);
    this.solService.addJoinFiles(data).subscribe((res: any) => {
      console.log(res);
      let dataMergeList: { joinType: '', primaryTemplateId: '', secondaryTemplateId: '', primaryKeyId: '', secondaryKeyId: '' }[] = []

      // templatesMergeList
      const responsee: any[] = res.responseData.templatesMergeDetailsList;
      responsee.forEach((merge: any) => {
        merge.templatesMergeList.forEach((list: any) => {
          list.columnArrayList.forEach((col: any) => {
            dataMergeList.push({
              joinType: list.joinType,
              primaryTemplateId: list.primaryTemplateId,
              secondaryTemplateId: list.secondaryTemplateId,
              primaryKeyId: col.primaryKeyId,
              secondaryKeyId: col.secondaryKeyId
            })
            this.popup.open(true,  "Saved Successfully !" );

            // this.toast.success({ title: 'Success', message: "Saved Successfully !" });
          });
        });

        console.log(dataMergeList);

        responsee.forEach((fileObj: any) => {
          this.mergeCheckedList.forEach((mcL: any) => {
            if (fileObj.mergeName == mcL.showMergeName) {
              mcL.mergeIdFromAPI = fileObj.mergeId;


              mcL.templatesMergeIdsListFromAPI = dataMergeList;
              mcL.mergeFieldListDTOFromAPI = fileObj.mergeFieldListDTO;
            }
          })
        })

      })


      this.loader.hide()
    }, (err: any) => {
      this.loader.hide()

    })
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
  fileSheetList: any[] = [] //using for tf 
  createIdentical(index: number) {
    //intgChgs
    if (index == -1) {
      this.sortedList = this.sortedList.splice(1, 1);
      let list: any[] = [];
      this.fileListtt.forEach((file: any) => {

        file.totalSheetList.forEach((sheetObj: any) => {
          if (sheetObj.isSheetSelected) {
            if (sheetObj.sheet != null) {
              const fieldNames = sheetObj.sheet.map((x: any) => x.fieldName)
              let obj = {
                fileNameWithExt: file.fileNameWithExt, fileExt: file.fileExt, fileName: file.fileName, isSelected: false, ...sheetObj, [sheetObj.sheetName]: sheetObj.sheetData, fieldNames, [sheetObj.sheetName + 'columnList']: fieldNames
              }
              list.push(obj)
            }
          }
        })

      })
      this.sortedList.push(list)


      const fileSheetList: any[] = [];
      this.fileListtt.forEach((file: any) => {
        file.totalSheetList.forEach((sheetObj: any) => {
          if (sheetObj.isSheetSelected) {
            if (sheetObj.sheet != null) {

              fileSheetList.push({ fileName: file.fileName, ...sheetObj })
            }
          }
        })
      })

      //for TF
      this.fileSheetList = []
      JSON.parse(JSON.stringify(this.fileListtt)).forEach((file: any) => {
        file.totalSheetList.forEach((sheetObj: any) => {

          if (sheetObj.isSheetSelected) {
            if (sheetObj.sheet != null) {

              if (sheetObj.fileExt == 'xlsx' || sheetObj.fileExt == 'xls') this.fileSheetList.push({ fileExt: sheetObj.fileExt, fileName: file.fileName + '-' + sheetObj.sheetName + '.' + file.fileExt, ...sheetObj })
              else if (sheetObj.fileExt == 'csv' || sheetObj.fileExt == 'txt') this.fileSheetList.push({ fileExt: sheetObj.fileExt, fileName: file.fileNameWithExt, ...sheetObj })
            }
          }
        })

      })
      console.log(' this.fileSheetList', this.fileSheetList);


      // = fileSheetList;

    }


    // if (index == -1) {
    //   this.sortedList = this.sortedList.splice(1, 1);
    //   //this.sortedCheckedList = [];
    //   let list: any[] = [];
    //   this.filesList.forEach((obj: any) => {
    //     if (obj.checkedSheetList.length != 0) {
    //       obj.checkedSheetList.forEach((item: any) => {
    //         let object = { fileName: obj.fileName, sheetName: item.value, isSelected: false }
    //         let obje = { [item.value]: obj[item.value], checkedSheetList: obj.checkedSheetList, fileName: obj.fileName, sheetList: obj.sheetList, [item.value + 'columnList']: obj[item.value + 'columnList'], fieldNames: obj[item.value + 'columnList'] }
    //         let merged = { ...object, ...obje };

    //         list.push(merged)
    //       })
    //     }
    //   })
    //   this.sortedList.push(list);

    // }
    if (index == 0) {
      // const fileName_SheetNamee = checkedIdenticalList.map((x:any)=>[x.fileName,x.sheetName].join('-'))

      let unCheckedList = this.sortedList[index].filter((x: any) => x.isSelected == false)
      let checkedList = this.sortedList[index].filter((x: any) => x.isSelected == true)

      let checkedSheetColumns: any[] = [];
      let k = 0;
      checkedList.forEach((obj: any) => {
        const fName = obj.fileName;
        const sName = obj.sheetName;
        if (checkedSheetColumns.length == 0) {
          checkedSheetColumns = obj[sName + 'columnList']
        }
        else {
          let columnsList = obj[sName + 'columnList'];
          checkedSheetColumns.forEach((value: any) => {
            if (!columnsList.includes(value)) {
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
      this.enableAppendNamePopup = true;//popup
      this.appendForm.get("appendNameControl")?.reset(); //popup
    }


    if (index == 2) { //?
      this.appendUnchechedList.forEach((obj: any) => {
        obj.isSelected = false;
      })
      this.sortedCheckedList = this.appendUnchechedList;
    }
  }


  join2Sheets() {
    let checkedSortedList = this.sortedCheckedList.filter(x => x.isSelected == true)
    if (checkedSortedList.length < 2) {
      this.submitted = true;
      this.submittedErrorMsg = 'Please select atleast two sheets';
      return;
    }
    this.enableMergeNamePopup = true;
    this.joinForm.get("appendNameControl")?.reset();
  }







  mergeSet() {
    this.submit = true;
    this.addMergeJoin()
    //console.log(this.joinForm);
    // if (this.joinForm.invalid) { //R
    //   return;
    // }
    let mergedTableListt: any[] = [];
    let primaryTableList: any = [];
    let checkedSortedList = this.sortedCheckedList.filter(x => x.isSelected)



    // checkedSortedList.forEach((obj: any) => { //splice in sortedlist
    //   let filesheet = obj.showAppendName.join('');
    //   if (filesheet.includes('-')) {
    //     let FileSheet = filesheet.split('-')
    //     let fileName = FileSheet[0];
    //     let sheetName = FileSheet[1];

    //     this.sortedList[0].forEach((item: any, index: number) => {
    //       if (item.fileName == fileName && item.sheetName == sheetName) {
    //         this.sortedList[0].splice(index, 1)
    //       }
    //     })
    //   }
    // })


    // let unCheckedSortedList = this.sortedCheckedList.filter(x => x.isSelected == false) //splice from scl
    //this.sortedCheckedList = [];
    //this.sortedCheckedList = unCheckedSortedList;



    let mergeName: any[] = [];

    let showMergeNamee: any[] = [];
    const columnListt: any[] = [];
    const columnListtt: any[] = [];

    checkedSortedList.forEach((obj: any) => {
      obj.fileName_SheetName.forEach((s: any) => {
        mergeName.push(s)
      })

      obj.tableList.forEach((obj1: any) => {
        mergedTableListt.push(obj1);

      })

      obj.showAppendName.forEach((arrVal: any) => {
        showMergeNamee.push(arrVal)
      })
      // mergedTableListt.forEach((fileObj: any) => {
      //   primaryTableList.push({ value: fileObj.fileName+ ' - '+fileObj.sheetName, templateId: fileObj.templateId })

      // })

      //const sheetName = obj.sheetName;
      //const columnData = obj[sheetName + 'columnList'];

      //
      obj.columnList.forEach((cLObj: any) => {
        cLObj = JSON.parse(JSON.stringify(cLObj))
        cLObj.showTabColName = this.joinForm.get("appendNameControl")?.value.trim() + '[' + cLObj.fieldName + ']'
        columnListt.push({ ...cLObj, joinName: this.joinForm.get("appendNameControl")?.value.trim() })
      })

      obj.columnList.forEach((cObj: any) => {
        columnListtt.push(cObj)
      })
      obj.columnListtt = columnListtt;



      //intg changes

    })


    // mergedTableListt.forEach((fileObj: any) => {
    //   primaryTableList.push({ value: fileObj.fileName + ' - ' + fileObj.sheetName, templateId: fileObj.templateId, sheet: fileObj.sheet, isSelected: false })
    // })

    checkedSortedList.forEach((fileObj: any) => {
      let templateId: any;
      let tableName: any;
      if (fileObj.fileExt == 'txt' || fileObj.fileExt == 'xlsx' || fileObj.fileExt == 'xls' || fileObj.fileExt == 'csv') {
        templateId = fileObj.tableList[0].templateId
        tableName = fileObj.tableList[0].tableName
      }

      primaryTableList.push({ value: fileObj.showAppendName, templateId: templateId, tableName: tableName, sheet: fileObj.columnList, isSelected: false, fileExt: fileObj.fileExt, isAppend: fileObj.isAppend })
    })

    primaryTableList.primaryKeyList = [];

    const pkFKs: any[] = [{ type: null, primaryTableList: showMergeNamee, selectedPrimaryTable: '', optionValue: 'select Primary Table', order: 1 }, { type: null, primaryKeyList: [], selectedPrimaryKey: '', optionValue: 'select Primary Key', order: 1 }, { type: null, mergeType: '', optionValue: 'select Join Type', selectedMergeType: '', order: 1 }];
    let fKsObj: any = {}
    fKsObj.type = null;
    fKsObj.foreignTableList = [];
    fKsObj.selectedForeignTable = '';
    fKsObj.optionValue = 'select Foreign Table';
    fKsObj.order = 1;
    pkFKs.push(fKsObj)

    fKsObj = {};
    fKsObj.type = null;
    fKsObj.foreignKeyList = [];
    fKsObj.selectedForeignKey = '';
    fKsObj.optionValue = 'select Foreign Key';
    fKsObj.order = 1;
    pkFKs.push(fKsObj)
    let foreignTableList: any = []
    foreignTableList.foreignKeyList = []
    // foreignTableList=[]
    // any<Custom> = { foreignKeyList: [],}
    // let foreignKeyList:any = [];
    let objMerge = {
      // dropDownList: { primaryTableList },
      dropDownList: [{ primaryTableList, foreignTableList, columns: [{ primaryKeyList: [], foreignKeyList: [] }] }],
      columnList: columnListt, mergeList: checkedSortedList,
      showMergeName: this.joinForm.get("appendNameControl")?.value.trim(),
      mergedTableList: mergedTableListt, showMergeSheetNames: showMergeNamee,
      pkFkMergeTypeList: pkFKs, templatesMergeList: [{ order: 1, mergeName: this.joinForm.get("appendNameControl")?.value.trim(), }]
    }

    this.mergeCheckedList.push(objMerge);
    this.enableMergeNamePopup = false;
    this.sortedCheckedList.forEach((appAndFilesObj: any) => {
      appAndFilesObj.isSelected = false;
    })

  }

  resetMerge() {
    this.mergeCheckedList = []; //x
    const appendList = this.appendUnchechedList.filter((x: any) => x.isAppend == true)
    const unAppendList = this.appendUnchechedList.filter((x: any) => x.isAppend == undefined) //add false
    console.log(this.sortedCheckedList, 'reset merge')
    if (appendList.length > 0) {
      this.sortedCheckedList = JSON.parse(JSON.stringify(appendList))
    }
    if (appendList.length == 0) { //added for reset
      this.sortedCheckedList = JSON.parse(JSON.stringify(appendList))
    }
    if (unAppendList.length > 0) {
      const filteredList = unAppendList.map(x => x.tableList[0])
      this.sortedList[0] = JSON.parse(JSON.stringify(filteredList))
    }
    this.changeTabs({ id: 3 }, 'unChedkedList')
    this.MergeArr().clear();
  }



  addAppendName() {
    //this.mergeCheckedList = [];
    let checkedList = this.sortedList[0].filter((x: any) => x.isSelected == true)
    if (checkedList.length < 2) {
      this.submitted = true;
      this.submittedErrorMsg = 'Ensure that the files with identical columns are selected for appending'
      return;
    }

    this.createIdentical(0);
    //this.enableAppendNamePopup = false;
  }

  createAppendSet() {
    this.submited = true;
    console.log(this.appendForm);
    if (this.appendForm.invalid) {
      return;
    }

    //let unCheckedList = this.sortedList[0].filter((x: any) => x.isSelected == false) //above list shd remain same(new changes
    let checkedList = this.sortedList[0].filter((x: any) => x.isSelected)
    this.sortedList[0].forEach((sheetObj: any) => sheetObj.isSelected = false)

    //this.sortedList = []; //above list shd remain same(new changes)
    //this.sortedList.push(unCheckedList)

    const fileName_SheetNamee = checkedList.map((x: any) => [x.fileName, x.sheetName].join('-'))

    const sheetName = checkedList[0].sheetName;
    // const columnData = checkedList[0][sheetName + 'columnList'];
    const columnListt: any[] = [];
    // columnData.forEach((val: any) => {

    //   const columnObj = { isChecked: false, fieldName: val, dataType: 'Select Data Type', newfieldName: '', isRowEdit: false, fileSheet: [this.appendNameControl.value.trim()] }
    //   columnListt.push(columnObj)
    // })
    //intg Changes
    // obj.sheet.forEach((sheetObj: any) => {
    //   let typof: string = '';
    //   typof = typeof obj[sheetName][0][sheetObj.fieldName] //req NaN 

    //   if (typof == 'number') {
    //     if (Number.isInteger(obj[sheetName][0][sheetObj.fieldName])) typof = 'Int'
    //     else typof = 'Float'
    //   }
    //   if (typof == 'string') typof = 'Text'
    //   if (typof == 'undefined' || typof == 'object' || typof == 'function') typof = '';
    //   const columnObj = {...sheetObj, isChecked: false, dataType: 'Select Data Type', newfieldName: '', isRowEdit: false, fileSheet: fileName_SheetNamee, generatedDataType: typof }
    //   columnListt.push(columnObj)
    // })

    checkedList[0].sheet.forEach((colObj: any) => {
      // let typof: string = '';

      // typof = typeof checkedList[0].sheetData[0][colObj.fieldName] //req NaN 

      // if (typof == 'number') {
      //   if (Number.isInteger(checkedList[0].sheetData[0][colObj.fieldName])) typof = 'Int'
      //   //else typof = 'Float' 
      // }
      // if (typof == 'string') typof = 'Text'
      // if (typof == 'undefined' || typof == 'object' || typof == 'function') typof = '';
      colObj = JSON.parse(JSON.stringify(colObj))
      colObj.showTabColName = this.appendForm.get("appendNameControl")?.value.trim() + '[' + colObj.fieldName + ']'
      const cObj = { ...colObj, isChecked: false, dataType: 'Select Data Type', newfieldName: '', isRowEdit: false, fileSheet: [this.appendForm.get("appendNameControl")?.value.trim()], appendName: this.appendForm.get("appendNameControl")?.value.trim() }
      columnListt.push(cObj)
    })



    //const hOverf_SNamee = fileName_SheetNamee.join('/n') //x
    const identicalSet = { columnList: columnListt, showAppendName: [this.appendForm.get("appendNameControl")?.value.trim()], fileName_SheetName: fileName_SheetNamee, tableList: checkedList, isSelected: false, isAppend: true }
    this.sortedCheckedList.push(identicalSet);
    //this.targetFilesCheckedList.push(identicalSet) //shd x
    this.enableAppendNamePopup = false;
  }

  showTargetFilesColumnss: any[] = [];
  showTargetFileTableColumns(obj: any, value: any, listName: string, mergeObj: any) {
    this.showTargetFilesColumnss = [];
    this.selectedM_A_S = [];
    this.selected_filename = value;
    this.sortedCheckedList.forEach((obj: any) => {
      obj.tabActiveInTargetFiles = false;
    })
    this.mergeCheckedList.forEach((object: any) => {

      object.mergeList.forEach((obj: any) => {
        obj.tabActiveInTargetFiles = false;
      })
    })
    if (listName == 'sortedCheckedList') {

      this.sortedCheckedList.forEach((obj: any) => {
        if (obj.showAppendName == value) obj.tabActiveInTargetFiles = true;
        else obj.tabActiveInTargetFiles = false;
      })
      if (value.join().includes('-')) {
        const sName = value.join().split('-')[1]; //this.showTargetFilesColumns shd x
        this.selectedM_A_S = obj.tableList[0][sName];
      }
      else {

        let filteredList = this.appendUnchechedList.filter(x => x.showAppendName == value.join())
        filteredList[0].tableList.forEach((ele: any) => {
          let sName = ele.sheetName;
          ele[sName].forEach((obj: any) => {
            this.selectedM_A_S.push(obj)
          })
        })
      }
      this.showTargetFilesColumnss = obj.columnList;

    }


    if (listName == 'mergeCheckedList') {
      obj.mergeList.forEach((obj: any) => {
        if (obj.showAppendName == value) {
          obj.tabActiveInTargetFiles = true;
        }
        else obj.tabActiveInTargetFiles = false;
      })
      if (value.join().includes('-')) {
        const filteredList = obj.mergeList.filter((x: any) => x.fileName_SheetName == value)
        filteredList[0].tableList.forEach((ele: any) => {
          let sName = ele.sheetName;
          ele[sName].forEach((obj: any) => {
            this.selectedM_A_S.push(obj)
          })
        })
      }
      else {
        let filteredList = obj.mergeList.filter((x: any) => x.showAppendName == value)

        filteredList[0].tableList.forEach((ele: any) => {
          let sName = ele.sheetName;
          ele[sName].forEach((obj: any) => {
            this.selectedM_A_S.push(obj)
          })
        })
      }
      this.showTargetFilesColumnss = mergeObj.columnList;

    }

    this.preview()

  }




  checkedInJoin(e: any, obj: any, i: number) {
    this.submitted = false;
    this.submittedErrorMsg = '';
    obj.isSelected = e.target.checked;
  }

  changeDataTypeTF(e: any, obj: any, index: number) {
    const fileSheet = obj.fileSheet;
    const clickedSortedList = this.sortedCheckedList.filter(x => x.showAppendName == fileSheet || this.sortedCheckedList.filter(x => x.showAppendName == fileSheet.join()));
    const particularArr = clickedSortedList[0].columnList[index];
    particularArr.dataType = e.target.value;
    obj.dataType = e.target.value;
  }

  createSecondaryDropdown(i: number, obj: any) {
    const pkFkLength = obj.pkFkMergeTypeList.length;
    if (obj.pkFkMergeTypeList[pkFkLength - 2].foreignTableList.length < 2) {
      return;
    }
    let orderNumber: number = pkFkLength / 5 + 1;
    obj.templatesMergeList.push({ order: orderNumber, mergeName: obj.showMergeName })


    let selectedPT = obj.pkFkMergeTypeList.filter((x: any) => x.selectedPrimaryTable).map((y: any) => y.selectedPrimaryTable);
    let selectedFT = obj.pkFkMergeTypeList.filter((x: any) => x.selectedForeignTable).map((y: any) => y.selectedForeignTable);
    let secondaryTableListt = [...selectedPT, ...selectedFT]

    let pkList = obj.pkFkMergeTypeList[0].primaryTableList;
    pkList = pkList.filter((x: any) => !secondaryTableListt.includes(x))

    let dropDownArrList = [{ type: null, secondaryTableList: secondaryTableListt, selectedSecondaryTable: '', optionValue: 'select Secondary Table', order: orderNumber },
    { type: null, secondaryKeyList: [], selectedSecondaryKey: '', optionValue: 'select Secondary Key', order: orderNumber },
    { type: null, mergeType: '', optionValue: 'select Join Type', selectedMergeType: '', order: orderNumber },
    { type: null, foreignTableList: pkList, selectedForeignTable: '', optionValue: 'select Foreign Table', order: orderNumber },
    { type: null, foreignKeyList: [], selectedForeignKey: '', optionValue: 'select Foreign Key', order: orderNumber }]

    dropDownArrList.forEach((element: any) => {
      obj.pkFkMergeTypeList.push(element);
    })
  }
  singleTableDatasetsave: boolean = false;
  viewScriptFromApi: string = '';
  saveDataSetApi() {

    //this.loader.show();
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
        if (datasetField.expression != null) {
          if (datasetField.expression.trim() == '' || datasetField.expression.trim().length == 0) datasetField.expression = null
        }
        let expn = datasetField.expression;
        // if (expn.length == 0 || expn == '' || expn == null) { 
        //if (datasetField.sourcecolumnName.includes('[')) { //without expression
        // this.tablecolNameList.forEach((obj: any) => {
        //   if (datasetField.sourcecolumnName.includes(obj.showTabColName)) {
        //     expn = JSON.parse(JSON.stringify(datasetField.sourcecolumnName.split(obj.showTabColName).join(obj.fieldIDforExpn)))
        //   }
        // })
        //}
        //}
        // else {

        if (expn != null) {
          this.tablecolNameList.forEach((obj: any) => {
            if (expn.includes(obj.showTabColName)) {
              expn = JSON.parse(JSON.stringify(expn.split(obj.showTabColName).join(obj.tableColumnName)))
            }
          })
        }
        //}

        colList.push({
          tableName: datasetField.tableName,
          columnFormat: datasetField.columnFormat, excludeInSelect: datasetField.excludeInSelect, columnName: datasetField.columnName, fieldName: datasetField.fieldName, expression: expn, columnType: datasetField.columnType,
          where: datasetField.where, or: datasetField.or, groupBy: '', sourcecolumnName: datasetField.sourcecolumnName
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
      if (havingVal.trim() == '') datasetObj.having = null;
      else datasetObj.having = havingVal;
      datasetObj.calender = ''


      //2jan
      let whereQuery: any[] = [];
      this.whereArrInDS().controls.forEach((whereObj: any, index: number) => {
        //console.log(whereObj);
        console.log(whereObj.controls.column.value);
        console.log(whereObj.controls.signOperator.value);
        console.log(whereObj.controls.value.value);
        let column = whereObj.controls.column.value.dbtablefieldName
        let signOperator = whereObj.controls.signOperator.value.value
        let value = whereObj.controls.value.value
        if (index == 0) {
          if (value != '' && signOperator != '') {
            if (signOperator == 'IS NULL' || signOperator == 'IS NOT NULL') {
              whereQuery = [column + ' ' + signOperator]
            }
            else {
              whereQuery = [column + ' ' + signOperator + ' ' + value]
            }
          }
        }
        else {
          console.log(whereObj.controls.operator.value);
          let operator = whereObj.controls.operator.value
          let x: any;
          if (value != '' && signOperator != '') {
            if (signOperator == 'IS NULL' || signOperator == 'IS NOT NULL') {
              x = operator + ' ' + column + ' ' + signOperator
            }
            else {
              x = operator + ' ' + column + ' ' + signOperator + ' ' + value;
            }
          }
          whereQuery.push(x)
        }
      })
      datasetObj.where = whereQuery.join(' ')
      // if (expandTableTrue[0].groupBy.trim() == '' || expandTableTrue[0].groupBy.trim().length == 0) datasetObj.groupBy = null;
      // else datasetObj.groupBy = expandTableTrue[0].groupBy;

      // if (expandTableTrue[0].orderBy.trim() == '' || expandTableTrue[0].orderBy.trim().length == 0) datasetObj.orderBy = null;
      // else datasetObj.orderBy = expandTableTrue[0].orderBy;

      // if (expandTableTrue[0].having.trim() == '' || expandTableTrue[0].having.trim().length == 0) datasetObj.having = null;
      // else datasetObj.having = expandTableTrue[0].having;
      datasetObj.calender = ''
      this.solService.addDataset(datasetObj).subscribe(async (res: any) => {
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
  callGetViewscript(datasetObj: any) {
    this.loader.show();
    const datasetId = datasetObj.datasetId;
    this.solService.getViewScript(datasetId).subscribe((res: any) => {
      this.viewscriptForm.get("sqlScript")?.patchValue(res?.responseData.sqlScript)
      this.viewscriptForm.get("datasetId")?.patchValue(res?.responseData.datasetId)
      this.enableViewScriptPopup = true;
      this.loader.hide()
    }, (err: any) => {
      this.loader.hide()
    });
  }

  updateScriptByDatasetId(viewscriptForm: any) { //underconstruction
    this.loader.show();
    const data = {
      datasetId: viewscriptForm.value.datasetId,
      newScript: viewscriptForm.value.sqlScript.trim()
    }
    this.solService.updateScriptByDatasetId(data).subscribe((res: any) => {
      this.viewscriptForm.get("sqlScript")?.patchValue(res?.responseData.newScript)
      this.viewscriptForm.get("datasetId")?.patchValue(res?.responseData.datasetId)
      this.enableViewScriptPopup = false;
      this.loader.hide()
    }, (err: any) => {
      this.loader.hide()
    });
  }

  editDatasetFile(datasetObj: any) {
    this.createExpressionList = [{ excludeInSelect: false, sourcecolumnName: '', columnId: '', expression: '', isEdit: false, columnType: '', where: '', or: '', groupBy: '', orderBy: '', value: '', signOperator: '', whereList: [] }];
    datasetObj.isDatasetTableExpand = true;


    this.datasetDetailsList[0] = datasetObj;

  }


  enableViewScriptPopup: boolean = false;
  appendAPIResp: any = {};
  saveAppendAPI() {
    const appendSheetList: any[] = [];
    this.sortedCheckedList.forEach((appendObj: any) => {
      const appendDtos: any[] = [];
      appendObj.tableList.forEach((tableObj: any) => {
        appendDtos.push({ sheetId: tableObj.templateId })
      })
      appendSheetList.push({ appendDtos, appendName: appendObj.showAppendName.join() })
    })

    const appendObj: any = {
      processId: this.process.processId,
      appendSheetList: appendSheetList
    };

    this.solService.addAppendFiles(appendObj).subscribe((res: any) => {
      this.appendAPIResp = res.responseData
      this.sortedCheckedList.forEach((appendObj: any) => {
        appendObj.isPreviewEnable = true;
      })
      this.popup.open(true,  "Saved Successfully !" );

      // this.toast.success({ title: 'Success', message: "Saved Successfully !" });
      this.loader.hide()
    }, (err: any) => {
      this.loader.hide()
    });
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


  selectPrimaryTable(e: any, j: number, i: number) {
    const value = e.value.value;
    let ddl = this.mergeCheckedList[i].dropDownList[j];
    // console.log(item,j,i);
    ddl.columns[0].primaryKeyList = e.value.sheet //childArr

    if (j == 0) {
      ddl.primaryTableList.forEach((priTab: any) => JSON.parse(JSON.stringify(priTab)).isSelected = false)
      e.value.isSelected = true;
      ddl.foreignTableList = ddl.primaryTableList.filter((x: any) => !x.isSelected)
      //ddl.foreignTableList.foreignKeyList = []

      //columns
      //ddl.primaryTableList.primaryKeyList = []
      //ddl.primaryTableList.primaryKeyList.push(e.value.sheet);

    }
    else {

    }
    // const selectedPT = this.mergeCheckedList[i].dropDownList[0].primaryTableList.filter((x: any) => x.value == value) // 0 for 1st object
    // this.mergeCheckedList[i].dropDownList.primaryKeyList = selectedPT[0].sheet;
    console.log(this.mergeCheckedList[i]?.dropDownList[j]);
  }

  selectForeignTable(e: any, j: number, i: number) {
    const value = e.value.value;
    let ddl = this.mergeCheckedList[i].dropDownList[j];
    this.mergeCheckedList[i].dropDownList[j].foreignTableList.forEach((priTab: any) => JSON.parse(JSON.stringify(priTab)).isSelected = false)
    e.value.isSelected = true;

    ddl.columns[0].foreignKeyList = e.value.sheet //childArr
    //columns
    // ddl.foreignTableList.foreignKeyList = []
    // ddl.foreignTableList.foreignKeyList.push(e.value.sheet);

    let ptl: any = []
    let ftl: any = []
    if (j == 0) {
      const pt = this.mergeCheckedList[i].dropDownList[j].primaryTableList.filter((x: any) => JSON.parse(JSON.stringify(x)).isSelected == true)[0]
      ptl.push(pt)
      const ft = this.mergeCheckedList[i].dropDownList[j].foreignTableList.filter((x: any) => JSON.parse(JSON.stringify(x)).isSelected == true)[0]
      ptl.push(ft)
      ptl.primaryKeyList = []
      const fpt = this.mergeCheckedList[i].dropDownList[j].primaryTableList.filter((x: any) => JSON.parse(JSON.stringify(x)).isSelected == false)
      fpt.forEach((fptObj: any) => ftl.push(fptObj))

      const fft = this.mergeCheckedList[i].dropDownList[j].foreignTableList.filter((x: any) => JSON.parse(JSON.stringify(x)).isSelected == false)
      fft.forEach((fftObj: any) => ftl.push(fftObj))

      let ftlUnduplicate: any = []
      ftlUnduplicate = ftl.filter((v: any, i: any, a: any) => a.findIndex((v2: any) => ['templateId'].every(k => v2[k] === v[k])) === i)
      ftlUnduplicate.foreignKeyList = []
      // selectedPTFT.primaryTableList.forEach((obj: any) => obj.isSelected = false)
      this.mergeCheckedList[i].dropDownList[j + 1] = { primaryTableList: ptl, foreignTableList: ftlUnduplicate }
      // this.mergeCheckedList[i].dropDownList[j + 1].primaryTableList.push(pt)
      // this.mergeCheckedList[i].dropDownList[j + 1].primaryTableList.push(ft)
      console.log(this.mergeCheckedList);
      if (this.mergeCheckedList[i].dropDownList[j + 1].foreignTableList.length == 0) {
        this.mergeCheckedList[i].allTablesSelected = true
      }
    }
    else {
      // const pt = this.mergeCheckedList[i].dropDownList[j].primaryTableList
      // ptl=pt
      this.mergeCheckedList[i].dropDownList[j].primaryTableList.forEach((obj: any) => ptl.push(obj))
      const ft = this.mergeCheckedList[i].dropDownList[j].foreignTableList.filter((x: any) => x.isSelected == true)[0]
      ptl.push(ft)
      ptl.primaryKeyList = []
      const fft = this.mergeCheckedList[i].dropDownList[j].foreignTableList.filter((x: any) => x.isSelected == false)
      fft.forEach((fftObj: any) => ftl.push(fftObj))
      let ftlUnduplicate = ftl.filter((v: any, i: any, a: any) => a.findIndex((v2: any) => ['templateId'].every(k => v2[k] === v[k])) === i)
      ftlUnduplicate.foreignKeyList = []
      this.mergeCheckedList[i].dropDownList[j + 1] = { primaryTableList: ptl, foreignTableList: ftlUnduplicate }
      // this.mergeCheckedList[i].dropDownList[j + 1].primaryTableList.push(ft)
      console.log(this.mergeCheckedList);
      if (this.mergeCheckedList[i].dropDownList[j + 1].foreignTableList.length == 0) {
        this.mergeCheckedList[i].allTablesSelected = true
      }
    }

    console.log(this.mergeCheckedList[i].dropDownList[j + 1]);


    // const selectedPT = this.mergeCheckedList[i].dropDownList[0].foreignTableList.filter((x: any) => x.value == value) // o for 1st object
    // this.mergeCheckedList[i].dropDownList.ForeignKeyList = selectedPT[0].sheet;
    // this.mergeCheckedList[i].dropDownList.secondaryKeyList = item.value;
    // console.log(this.mergeCheckedList[i]?.dropDownList?.primaryTableList);
  }


  selectPrimarykey(e: any, k: number, j: any, i: any) {
    const value = e.value;
    //this.mergeCheckedList[i].dropDownList[j].columns[k] = e.value


    let originalPKList = JSON.parse(JSON.stringify(this.mergeCheckedList[i].dropDownList[j].columns[k].primaryKeyList))
    originalPKList.forEach((obj: any, index: any) => {
      if (obj.columnId == e.value.columnId) {
        originalPKList.splice(index, 1)
      }
    })

    if (this.mergeCheckedList[i].dropDownList[j].columns[k + 1] == undefined) this.mergeCheckedList[i].dropDownList[j].columns.push({ primaryKeyList: originalPKList })
    else this.mergeCheckedList[i].dropDownList[j].columns[k + 1].primaryKeyList = originalPKList


  }
  selectForeignKey(e: any, k: number, j: any, i: any) {
    const value = e.value;
    //this.mergeCheckedList[i].dropDownList[j].foreignTableList.foreignKeyList[k] = e.value


    let originalPKList = JSON.parse(JSON.stringify(this.mergeCheckedList[i].dropDownList[j].columns[k].foreignKeyList))
    originalPKList.forEach((obj: any, index: any) => {
      if (obj.columnId == e.value.columnId) {
        originalPKList.splice(index, 1)
      }
    })

    if (this.mergeCheckedList[i].dropDownList[j].columns[k + 1] == undefined) this.mergeCheckedList[i].dropDownList[j].columns.push({ foreignKeyList: originalPKList })
    else this.mergeCheckedList[i].dropDownList[j].columns[k + 1].foreignKeyList = originalPKList
  }

  selectJoin(e: any, j: any, i: any) {
    this.mergeCheckedList[i].dropDownList[j].joinType = e.value
  }

  rowCount: any;
  previewPopup(j: any, item: any, i: any, obj: any, name: string) { //filtered files,
    this.rowCount = ''
    if (name != '' || name?.length != 0) {
      this.loader.show()
      this.solService.viewTableDetails(name).subscribe((res: any) => {
        if (res.responseData != null) {
          this.selectedM_A_S = res.responseData.tableDetails;
          this.rowCount = res.responseData.count
          this.preview();
          this.showTargetFilePopup = true;
        }
        
        else{
          this.popup.open(false,res.statusMessage);
        } 
        // this.toast.error({ title: 'Error', message: res.statusMessage });
        this.loader.hide()
      }, (err: any) => {
        this.loader.hide()
      })
    }
    else {
      this.showTargetFilePopup = true;
      this.selectedM_A_S = item.sheetData;
      this.showTargetFilePopup = true;
      this.preview();
    }

  }

  preview() {
    this.columnsArr = [];
    //identify unique keys in the array
    for (var key in this.selectedM_A_S[0]) {
      if (this.selectedM_A_S[0].hasOwnProperty(key)) {
        this.columnsArr.push(key);
      }
    }
  }


  selectgroupByOrderByInDM(e: any, item: any, i: number, type: any) {
    const selectedList = e.value;
    let allFiles = e.value.map((x: any) => x.dbtablefieldName).join()

    if (type == 'groupby') this.datasetDetailsList.filter((x: any) => x.isDatasetTableExpand == true)[0].groupBy = allFiles;
    if (type == 'orderby') this.datasetDetailsList.filter((x: any) => x.isDatasetTableExpand == true)[0].orderBy = allFiles;
  }


  executeProject() {
    this.loader.show()
    this.solService.executeProject(this.process.processId).subscribe((res: any) => {

      this.loader.hide()
    }, (err: any) => {
      this.loader.hide()

    })

  }


  //TF
  clickedRowDataInTF: any[] = [];
  fileTypeInTF: string = '';
  fileClickedinTF(j: number, i: number, Obj: any, fileType: any) {
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


  getTargetFileList() { //get in TF
    this.loader.show()
    this.solService.getTargetFileList(this.process.processId).subscribe((res: any) => {
      res.responseData.appendSheetListDto.appendSheetList.forEach((appObj: any) => {
        appObj.tableAppendFieldsDto.forEach((colObj: any) => {
          colObj.showTabColName = appObj.appendName + '[' + colObj.fieldName + ']'
        })
      })

      res.responseData.templateMergeListDTO.templatesMergeDetailsList.forEach((joinObj: any) => {
        joinObj.mergeFieldListDTO.forEach((colObj: any) => {
          colObj.showTabColName = joinObj.mergeName + '[' + colObj.fieldName + ']'
        })
      })

      this.targetFiles = [{ fileType: 'append', sheetList: res.responseData.appendSheetListDto.appendSheetList }, { fileType: 'join', sheetList: res.responseData.templateMergeListDTO.templatesMergeDetailsList }, { fileType: 'files', sheetList: this.fileSheetList }]


      let fileteredjoin = this.targetFiles.filter((x: any) => x.fileType == 'join')
      if (fileteredjoin[0]?.sheetList.length == 0) this.skipJoin = true

      let fileteredappend = this.targetFiles.filter((x: any) => x.fileType == 'append')
      if (fileteredappend[0]?.sheetList.length == 0) this.skipAppend = true
      this.loader.hide()
    }, (err: any) => {
      this.targetFiles = [{ fileType: 'files', sheetList: this.fileSheetList }]
      this.loader.hide()

    })
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

  }
  closeDatasetPopup() {
    this.dataSetForm.controls.DSetRows = this.fb.array([])
    this.saveDataSetPopup = false;
  }


  //datasetDetailsListShowList: any[] = [];
  selectedColumnsOfDS: any[] = []; //can b remvd
  saveDataSetPopup: boolean = false;
  dropDownsInDS: any[] = []
  saveDataSet(obj: any, i: number) {

    this.selectedColumnsOfDS = [];
    obj?.datasetFieldDTOList.forEach((ds: any) => {
      let tableName: any;
      if (ds.sourcecolumnName.includes('[')) {
        tableName = ds.sourcecolumnName.split('[')[0]
      }
      else {
        tableName = ds.tableName
      }

      const sourcecolumnName = ds.sourcecolumnName;
      this.allTableListInDM.forEach((tabObj: any) => {
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
        if (datasetField.expression != null) {
          if (datasetField.expression.trim() == '' || datasetField.expression.trim().length == 0) datasetField.expression = null
        }
        let expn = datasetField.expression;
        // if (expn.length == 0 || expn == '' || expn == null) {
        //   if (datasetField.sourcecolumnName.includes('[')) { //without expression
        //     this.tablecolNameList.forEach((obj: any) => {
        //       if (datasetField.sourcecolumnName.includes(obj.showTabColName)) {
        //         expn = JSON.parse(JSON.stringify(datasetField.sourcecolumnName.split(obj.showTabColName).join(obj.fieldIDforExpn)))
        //       }
        //     })
        //   }
        // }
        // else {

        if (expn != null) {
          this.tablecolNameList.forEach((obj: any) => {
            if (expn.includes(obj.showTabColName)) {
              expn = JSON.parse(JSON.stringify(expn.split(obj.showTabColName).join(obj.tableColumnName)))
            }
          })
        }
        //  }
        colList.push({ tableName: datasetField.tableName, excludeInSelect: datasetField.excludeInSelect, columnFormat: datasetField.columnFormat, columnName: datasetField.columnName, fieldName: datasetField.fieldName, expression: expn, columnType: datasetField.columnType, where: datasetField.where, or: datasetField.or, groupBy: '', sourcecolumnName: datasetField.sourcecolumnName })

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
      if (havingVal.trim() == '') datasetObj.having = null;
      else datasetObj.having = havingVal;
      datasetObj.calender = ''
      //2jan
      let whereQuery: any[] = [];
      this.whereArrInDS().controls.forEach((whereObj: any, index: number) => {
        //console.log(whereObj);
        console.log(whereObj.controls.column.value);
        console.log(whereObj.controls.signOperator.value);
        console.log(whereObj.controls.value.value);
        let column = whereObj.controls.column.value.dbtablefieldName
        let signOperator = whereObj.controls.signOperator.value.value
        let value = whereObj.controls.value.value
        if (index == 0) {
          if (value != '' && signOperator != '') {
            if (signOperator == 'IS NULL' || signOperator == 'IS NOT NULL') {
              whereQuery = [column + ' ' + signOperator]
            }
            else {
              whereQuery = [column + ' ' + signOperator + ' ' + value]
            }
          }
        }
        else {
          console.log(whereObj.controls.operator.value);
          let operator = whereObj.controls.operator.value
          let x: any;
          if (value != '' && signOperator != '') {
            if (signOperator == 'IS NULL' || signOperator == 'IS NOT NULL') {
              x = operator + ' ' + column + ' ' + signOperator
            }
            else {
              x = operator + ' ' + column + ' ' + signOperator + ' ' + value;
            }
          }
          whereQuery.push(x)
        }
      })
      datasetObj.where = whereQuery.join(' ')

      // if (expandTableTrue[0].groupBy.trim() == '' || expandTableTrue[0].groupBy.trim().length == 0) datasetObj.groupBy = null;
      // else datasetObj.groupBy = expandTableTrue[0].groupBy;

      // if (expandTableTrue[0].orderBy.trim() == '' || expandTableTrue[0].orderBy.trim().length == 0) datasetObj.orderBy = null;
      // else datasetObj.orderBy = expandTableTrue[0].orderBy;

      // if (expandTableTrue[0].having.trim() == '' || expandTableTrue[0].having.trim().length == 0) datasetObj.having = null;
      // else datasetObj.having = expandTableTrue[0].having;

      datasetObj.calender = ''
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
      primaryTableList.primaryKeyList = []

      let foreignTableList: any = []
      foreignTableList.foreignKeyList = []

      this.selectedColumnsOfDS.forEach((obj: any) => { primaryTableList.push(obj) })

      let dataset111 = {
        primaryTableList, foreignTableList, order: 1, columns: [{ primaryKeyList: [], foreignKeyList: [] }]
      }

      for (let i = 0; i < this.selectedColumnsOfDS.length - 1; i++) {
        if (i == 0) this.dataSetData.push(dataset111)
        else {
          primaryTableList = []
          primaryTableList.primaryKeyList = []
          this.dataSetData.push({ primaryTableList, foreignTableList, columns: [{ primaryKeyList: [], foreignKeyList: [] }], order: i + 2 })
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
    this.dataSetData[i].primaryTableList.forEach((ele: any) => { JSON.parse(JSON.stringify(ele)).isSelecteddl = false })
    e.value.isSelecteddl = true;

    //this.dataSetData[i].primaryTableList.primaryKeyList.push(e.value.columnList) //pk

    this.dataSetData[i].columns[0].primaryKeyList = e.value.columnList //childArr
    if (i == 0) {

      let filteredForFT = JSON.parse(JSON.stringify(this.dataSetData[i].primaryTableList.filter((x: any) => !x.isSelecteddl))) //ft


      // filteredForFT.forEach((obj: any) => {this.dataSetData[i].foreignTableList.push(obj)})
      this.dataSetData[i].foreignTableList = filteredForFT
    }
    else {
      let xSList = this.dataSetData[i - 1].foreignTableList.filter((x: any) => !x.isSelecteddl) //can b written in i=0 ft
      this.dataSetData[i].foreignTableList = xSList

    }
  }

  selectJoinTypeInDS(e: any, i: any) {
    this.dataSetData[i].Join = e.value
  }
  selectForeignTableInDS(e: any, i: any) {
    this.dataSetData[i].foreignTableList.forEach((ele: any) => JSON.parse(JSON.stringify(ele)).isSelecteddl = false)
    e.value.isSelecteddl = true;
    // this.dataSetData[i].foreignKeyList = e.value.columnList;
    this.dataSetData[i].columns[0].foreignKeyList = e.value.columnList //childArr
    if (i == 0) {

      let sPT = this.dataSetData[i].primaryTableList.filter((x: any) => x.isSelecteddl)
      let sFT = this.dataSetData[i].foreignTableList.filter((x: any) => x.isSelecteddl)
      let combinedList: any[] = [];
      sPT.forEach((obj: any) => combinedList.push(obj))
      sFT.forEach((obj: any) => combinedList.push(obj))
      combinedList.forEach((obj: any) => JSON.parse(JSON.stringify(obj)).isSelecteddl = false)
      if (this.dataSetData[i + 1] != undefined) this.dataSetData[i + 1].primaryTableList = combinedList

    }
    else {
      let list = this.dataSetData[i].primaryTableList
      let sFT = this.dataSetData[i].foreignTableList.filter((x: any) => x.isSelecteddl)
      let combinedList: any[] = [];
      list.forEach((obj: any) => combinedList.push(obj))
      sFT.forEach((obj: any) => combinedList.push(obj))
      combinedList.forEach((obj: any) => JSON.parse(JSON.stringify(obj)).isSelecteddl = false) //copy
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

    if (this.dataSetData[i].columns[j + 1] == undefined) this.dataSetData[i].columns.push({ primaryKeyList: originalPKList })
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

    if (this.dataSetData[i].columns[j + 1] == undefined) this.dataSetData[i].columns.push({ foreignKeyList: originalPKList })
    else this.dataSetData[i].columns[j + 1].foreignKeyList = originalPKList

  }

  addcolumnRowInDS(j: any, i: any) {
    this.columnArrInDS(i).push(this.addColumnInDS())


  }

  deletecolumnRowInDS(j: any, i: any) {
    this.columnArrInDS(i).removeAt(j)
  }




  add_SaveCreateExpression(obj: any) {
    // this.submited = true; //validation
    // if (this.createExpressionForm.invalid) {
    //   this.toast.error({
    //     title: 'Error',
    //     message: 'Enter All the Required Fields',
    //   });
    //   return;
    // }

    if (obj.sourcecolumnName.trim() == '') return; //xShd empty
    const filteredList = this.datasetDetailsList.filter((x: any) => x.isDatasetTableExpand == true);
    const dsDTOList = filteredList[0]?.datasetFieldDTOList;
    let p = 0;
    if (dsDTOList.length != 0) {
      dsDTOList.forEach((ele: any) => {
        if (!obj.isEdit) {
          if (ele.sourcecolumnName == obj.sourcecolumnName.trim()) p = 1;
        }
        else if (!ele.isEdit) { //false
          if (ele.sourcecolumnName == obj.sourcecolumnName.trim()) p = 1;
        }
      })
    }
    if (p == 1) return;




    //groupby-orderby
    let selectedColumn: any;
    selectedColumn = this.allTableListInDM.filter((element: any) =>
      element.columnList.some((subElement: any) => subElement.showTabColName == obj.sourcecolumnName))
      .map((element: any) => {
        return Object.assign({}, element, { columnList: element.columnList.filter((subElement: any) => subElement.showTabColName == obj.sourcecolumnName) });
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
      o_gByObj = { filefieldName: obj.sourcecolumnName, dbtablefieldName: obj.sourcecolumnName }
      columnsListForWherObj = { filefieldName: obj.sourcecolumnName, dbtablefieldName: obj.sourcecolumnName, dataType: obj.columnType } //2jan
      obj.columnName = obj.sourcecolumnName;
      obj.fieldName = obj.sourcecolumnName;
    }
    else {
      o_gByObj = { filefieldName: obj.sourcecolumnName, dbtablefieldName: t_fNameForOGBy }
      columnsListForWherObj = { filefieldName: obj.sourcecolumnName, dbtablefieldName: t_fNameForOGBy, dataType: selectedColumn[0].columnList[0].columnType } //2jan
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
    //   o_gByObj = { filefieldName: obj.sourcecolumnName, dbtablefieldName: obj.sourcecolumnName }
    //   obj.columnName = obj.sourcecolumnName;
    //   obj.fieldName = obj.sourcecolumnName;

    // }
    // else {
    //   o_gByObj = { filefieldName: obj.sourcecolumnName, dbtablefieldName: t_fNameForOGBy }
    //   obj.columnName = fieName //assigning field,col Names
    //   obj.fieldName = colName
    // }

    // if (!obj.isEdit) { //if edit false
    //   filteredList[0].orderBytoDB.push(o_gByObj)
    //   filteredList[0].groupBytoDB.push(o_gByObj)
    // }

    //where key
    if (obj.signOperator != '' || obj.signOperator.length != 0) {
      let whereQuery: any[] = [];
      if (obj.value != '' && obj.signOperator != '') {
        whereQuery = [tblName + '.' + fieName + ' ' + obj.signOperator + ' ' + obj.value]
        obj.whereList.forEach((element: any) => {
          let x: any;
          if (element.signOperator == 'IS NULL' || element.signOperator == 'IS NOT NULL') {
            x = element.operator + ' ' + tblName + '.' + fieName + ' ' + element.signOperator
          }
          else {
            x = element.operator + ' ' + tblName + '.' + fieName + ' ' + element.signOperator + ' ' + element.value;
          }
          whereQuery.push(x)
        })
      }

      else if (obj.signOperator == 'IS NULL' || obj.signOperator == 'IS NOT NULL') {
        whereQuery = [tblName + '.' + fieName + ' ' + obj.signOperator]
        obj.whereList.forEach((element: any) => {
          let x: any;
          if (element.signOperator == 'IS NULL' || element.signOperator == 'IS NOT NULL') {
            x = element.operator + ' ' + tblName + '.' + fieName + ' ' + element.signOperator
          }
          else { x = element.operator + ' ' + tblName + '.' + fieName + ' ' + element.signOperator + ' ' + element.value; }

          whereQuery.push(x)
        })
      }

      obj.where = whereQuery.join(' ');
    }



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
    this.createExpressionList = [{ excludeInSelect: false, sourcecolumnName: '', expression: '', columnId: '', columnFormat: '', signOperatorList: '', isEdit: false, columnType: '', where: '', or: '', groupBy: '', value: '', signOperator: '', whereList: [] }];
    this.UpdatechecksInDM(obj, true)
  }

  deleteTableDetails: any;
  deleteTables(e: Event, item: any, index: number, type: any) {
    console.log('e: ', e)
    console.log('item: ', item)
    this.deleteTableDetails = { item, type }
    // this.solService.deleteTables({id:item.appendID, type:'append', operation:'check'}).subscribe((res:any)=>{
    //   console.log(res);
    this.solService.deleteTables({ id: item.datasetId, type: type, operation: 'delete' }).subscribe((res: any) => {
      console.log(res);
      this.allDatasetDetailsList.splice(this.allDatasetDetailsList.findIndex(ele => ele.datasetId === item.datasetId), 1)
    })
    // })
  }



  onCheck(data: any) {
    console.log(data);
    this.allDatasetDetailsList.forEach((ele: any) => {
      if (data.datasetId == ele.datasetId) {
        ele.selected = !ele.selected;
      }
    });
    console.log(this.allDatasetDetailsList);
  }

  SaveContinue() {
    let tables: any[] = [];
    this.allDatasetDetailsList.forEach((ele: any) => {
      if (ele.selected) {
        tables.push(ele.tableName);
      }
    });
    let data = {
      tables: tables,
      // userId: 'B7007E8C-6142-4EA2-AD7B-C1B252F807B8',
      processId: this.process.processId,
    };

    console.log(data);
    this.solService.postPushDataSets(data).subscribe((res: any) => {
      console.log(res.responseData);
      this.router.navigate(["/user/admin1/powerbi-interface", { dataset: JSON.stringify(res.responseData) }])
      // this.router.
    })
    // routerLink="/user/admin1/powerbi-interface"

  }
  // http://localhost:9194/RIA_SOLUTION_BOARD/ria/solution/isTableExist?tableName=%22&type=
  existDataset() {
    console.log(this.sqlScriptForm.value.datasetName);
    this.solService.getExistDataset(this.appendNameControl.value, '').subscribe((res: any) => {

      console.log(res);
    }, (err: any) => {
      // let data = {
      //   title: 'Error',
      //   message: err
      // }
      // this.appendNameControl.reset()
      // this.toast.error(data)
      this.popup.open(false,"Dataset Name Already Exists");
      // this.toast.error({ title: 'Error', message: "Dataset Name Already Exists" });
    })
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
    if (this.datasetDetailsList.length != 0) allSourceColsInDS = this.datasetDetailsList[0].datasetFieldDTOList.map((x: any) => x.sourcecolumnName)
    let selectAllOfClickedTable: Array<any> = []
    if (fileType == 'append') selectAllOfClickedTable = item.tableAppendFieldsDto
    else if (fileType == 'join') selectAllOfClickedTable = item.mergeFieldListDTO
    else if (fileType == 'files') selectAllOfClickedTable = item.sheet
    else if (fileType == 'dataset') selectAllOfClickedTable = item.datasetFieldDTOList
    selectAllOfClickedTable.forEach((colObj: any) => {
      if (!allSourceColsInDS.includes(colObj.showTabColName)) {
        let createExpnObj = { excludeInSelect: false, sourcecolumnName: colObj.showTabColName, columnId: '', columnFormat: '', signOperatorList: '', expression: '', isEdit: false, columnType: colObj.columnType, where: '', or: '', groupBy: '', orderBy: '', value: '', signOperator: '', whereList: [] }
        this.add_SaveCreateExpression(createExpnObj)
      }
    })
  }

  sortDir = 1;//1= 'asc' -1= des
  sortColumn !: number
  sortOrder: string = 'asc';
  onSortClick(col: string, i: number): void {
    if (this.sortColumn == i) {
      if (this.sortOrder == 'asc') {
        this.sortOrder = 'desc';
        this.sortDir = -1
      }
      else {
        this.sortOrder = 'asc';
        this.sortDir = 1;
      }
    }
    else {
      this.sortColumn = i;
      this.sortOrder = 'asc';
    }
    this.selectedM_A_S.sort((a: any, b: any) => {
      a = a[col].toLowerCase();
      b = b[col].toLowerCase();
      return a.localeCompare(b) * this.sortDir;
    });
  }


  private UpdatechecksInDM(item: any, isChk: any) {
    let allColumnsOfTable: Array<any> = []
    this.targetFiles.forEach((appJoinSourceFile: any) => {
      appJoinSourceFile.sheetList.forEach((tableObj: any) => {
        if (tableObj.type == 'Append') {

          tableObj.tableAppendFieldsDto.forEach((colObj: any) => {
            if (colObj.showTabColName == item.sourcecolumnName) {
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
            if (colObj.showTabColName == item.sourcecolumnName) {
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
            if (colObj.showTabColName == item.sourcecolumnName) {
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
          if (colObj.showTabColName == item.sourcecolumnName) {
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
    if (this.datasetDetailsList.length != 0) allSourceColsInDS = this.datasetDetailsList[0].datasetFieldDTOList.map((x: any) => x.sourcecolumnName)

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
    if (isChecked) {
      selectAllOfClickedTable.forEach((colObj: any) => {
        if (!allSourceColsInDS.includes(colObj.showTabColName)) { //shd check non exact match
          let createExpnObj = { excludeInSelect: false, sourcecolumnName: colObj.showTabColName, columnId: '', columnFormat: '', signOperatorList: '', expression: '', isEdit: false, columnType: colObj.columnType, where: '', or: '', groupBy: '', orderBy: '', value: '', signOperator: '', whereList: [] }
          this.add_SaveCreateExpression(createExpnObj)
        }
      })
    }
    else if (!isChecked) {
      this.datasetDetailsList[0].datasetFieldDTOList = this.datasetDetailsList[0].datasetFieldDTOList.filter((x: any) => particularTableColumns.indexOf(x.sourcecolumnName) == -1)
      this.datasetDetailsList[0].groupBytoDB = this.datasetDetailsList[0].groupBytoDB.filter((x: any) => particularTableColumns.indexOf(x.filefieldName) == -1)
      this.datasetDetailsList[0].orderBytoDB = this.datasetDetailsList[0].orderBytoDB.filter((x: any) => particularTableColumns.indexOf(x.filefieldName) == -1)

      console.log('this.datasetDetailsList[0].datasetFieldDTOList ', this.datasetDetailsList[0].datasetFieldDTOList);
      console.log('this.datasetDetailsList[0].groupBytoDB', this.datasetDetailsList[0].groupBytoDB);
      console.log('this.datasetDetailsList[0].orderBytoDB', this.datasetDetailsList[0].orderBytoDB);


      // allSourceColsInDS.forEach((sourcecolumnName:any,index:number)=>{
      //   if(particularTableColumns.includes(sourcecolumnName)){
      //     this.datasetDetailsList[0].datasetFieldDTOList.splice(this.datasetDetailsList[0].datasetFieldDTOList.indexOf(sourcecolumnName), 1)
      //     //console.log(this.datasetDetailsList[0].datasetFieldDTOList, 'this.datasetDetailsList[0].datasetFieldDTOList');
      //     console.log(sourcecolumnName,index)

      //     //this.deleteRowInDataset(0, index, {item:sourcecolumnName})
      //     //this.datasetDetailsList[0].datasetFieldDTOList.

      //   }
      // })
      this.UpdatechecksInDM(item, false)


    }

  }
  selectAllChildInDM(e: any, fileType: any, item: any, comp: any) {
    let isChecked = e.target.checked
    let allSourceColsInDS: Array<any> = []
    if (this.datasetDetailsList.length != 0) allSourceColsInDS = this.datasetDetailsList[0].datasetFieldDTOList.map((x: any) => x.sourcecolumnName)

    if (isChecked) {
      if (!allSourceColsInDS.includes(comp.showTabColName)) {
        let createExpnObj = { excludeInSelect: false, sourcecolumnName: comp.showTabColName, columnId: '', columnFormat: '', signOperatorList: '', expression: '', isEdit: false, columnType: comp.columnType, where: '', or: '', groupBy: '', orderBy: '', value: '', signOperator: '', whereList: [] }
        this.add_SaveCreateExpression(createExpnObj)
      }
    }
    else if (!isChecked) {
      this.datasetDetailsList[0].datasetFieldDTOList = this.datasetDetailsList[0].datasetFieldDTOList.filter((x: any) => comp.showTabColName.indexOf(x.sourcecolumnName) == -1)
      this.datasetDetailsList[0].groupBytoDB = this.datasetDetailsList[0].groupBytoDB.filter((x: any) => comp.showTabColName.indexOf(x.filefieldName) == -1)
      this.datasetDetailsList[0].orderBytoDB = this.datasetDetailsList[0].orderBytoDB.filter((x: any) => comp.showTabColName.indexOf(x.filefieldName) == -1)
    }

    let allColumnsOfTable: Array<any> = []
    if (fileType == 'append') allColumnsOfTable = item.tableAppendFieldsDto
    else if (fileType == 'join') allColumnsOfTable = item.mergeFieldListDTO
    else if (fileType == 'files') allColumnsOfTable = item.sheet
    else if (fileType == 'dataset') allColumnsOfTable = item.datasetFieldDTOList


    let chk_unchkValues = allColumnsOfTable.map((x: any) => x.isSelectAllChildInDM)
    if (chk_unchkValues.includes(false)) item.isSelectAllParentInDM = false
    else item.isSelectAllParentInDM = true

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
    if (ctype == 'date' || ctype == 'datetime2' || ctype == 'dateTime') { //copy
      signOperList = [{ id: 0, value: 'IS NULL' }, { id: 1, value: 'IS NOT NULL' }, { id: 2, value: 'IN' }, { id: 3, value: 'NOT IN' }, { id: 4, value: '=' }, { id: 5, value: '!=' }, { id: 6, value: '>=' }, { id: 7, value: '>' }, { id: 8, value: '<' }, { id: 9, value: '<=' }]
    }
    else if (ctype == 'char' || ctype == 'varchar' || ctype == 'text' || ctype == 'nvarchar') {
      signOperList = [{ id: 0, value: 'IS NULL' }, { id: 1, value: 'IS NOT NULL' }, { id: 2, value: 'LIKE' }, { id: 3, value: 'NOT LIKE' }, { id: 4, value: 'NOT IN' }, { id: 5, value: 'IN' }]
    }
    else if (ctype == 'int' || ctype == 'float' || ctype == 'money' || ctype == 'decimal' || ctype == 'bigint') {
      signOperList = [{ id: 0, value: 'IS NULL' }, { id: 1, value: 'IS NOT NULL' }, { id: 2, value: 'IN' }, { id: 3, value: 'NOT IN' }, { id: 4, value: '=' }, { id: 5, value: '!=' }, { id: 6, value: '>=' }, { id: 7, value: '>' }, { id: 8, value: '<' }, { id: 9, value: '<=' }]
    } //
    this.signOperatorWhereInDS[j] = signOperList
  }

  whereArrInDS(): FormArray { //DS popup
    return this.datasetTableForm.get('where') as FormArray
  }

  appendDataset() {
    let checkedList = this.allDatasetDetailsList.filter((x: any) => x.selected)
    let k = 0;
    let checkedSheetColumns: Array<any> = []
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


  }

  enableDatasetAppendPopup: boolean = false;
  appendDatasetApi() {
    this.enableDatasetAppendPopup = false
    //this.loader.show()
    let dsName = this.datasetAppendForm.get('appendNameControl')?.value.trim()

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




  enableUploadSQL_PythonPopup: boolean = false
  isBtnClickedSQL_Python!: string;
  uploadSQLScriptBtn() {
    this.enableUploadSQL_PythonPopup = true;
    this.isBtnClickedSQL_Python = 'S'
  }

  uploadPythonScriptBtn() {
    this.enableUploadSQL_PythonPopup = true;
    this.isBtnClickedSQL_Python = 'P'
  }



  uploadPythonScript() {

  }


  uploadSQLBtn: boolean = true;
  //fileSQL_PythonContent: any
  uploadSQLScript(e: any, uploadType: string) {
    //this.fileSQL_PythonContent = ''
    const file = e.target.files[0];
    let fileReader = new FileReader();
    fileReader.onload = (e) => {
      this.uploadSQLBtn = false
      // this.fileSQL_PythonContent = fileReader.result
      this.sqlScriptForm.patchValue({ sqlScript: fileReader.result })
    }
    fileReader.readAsText(file);
  }



  saveUploadScript(uploadType: string) {
    let data = {
      processId: this.process.processId,
      // script: this.fileSQL_PythonContent,
      script: this.sqlScriptForm.get('sqlScript')?.value,
      type: uploadType
    }



    this.solService.uploadScriptToProcess(data).subscribe((res: any) => {
      // this.uploadSQLBtn = true
      this.enableUploadSQL_PythonPopup = false
      this.popup.open(true,"Saved Successfully !");
      // this.toast.success({ title: 'Success', message: "Saved Successfully !" });
    }), (err: any) => {
      this.popup.open(false,"failed");
      // this.toast.error({ title: 'Error', message: "failed" });
      this.loader.hide();
    }
  }




  enableViewscriptPopup: boolean = false;
  getViewScript() {
    this.enableViewscriptPopup = true
    this.solService.getSolutionScript(this.process.processId).subscribe((res: any) => {
      if (res) {
        this.getViewScriptForm.patchValue({ script: res.responseData?.script, solutionScriptId: res.responseData?.solutionScriptId })
      }
    }, (err: any) => {
      this.popup.open(false,"No data");
      // this.toast.error({ title: 'Error', message: "No data" });
      this.loader.hide();
    })
  }


  updateViewScript() {
    this.enableViewscriptPopup = false
    let data = {
      solutionScriptId: this.getViewScriptForm.get('solutionScriptId')?.value,
      script: this.getViewScriptForm.get('script')?.value
    }

    this.solService.uploadScriptToProcess(data).subscribe((res: any) => {
      this.popup.open(true,"Updated Successfully !");
      // this.toast.success({ title: 'Success', message: "Updated Successfully !" });
    }), (err: any) => {
      this.popup.open(false,"failed");
      // this.toast.error({ title: 'Error', message: "failed" });
      this.loader.hide();
    }
  }




}
