import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { HttpEventType, HttpProgressEvent, HttpResponse } from '@angular/common/http';
import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  Input,
  OnInit,
  QueryList,
  Renderer2,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import {
  FormGroup,
  FormControl,
  Validators,
  FormArray,
  FormBuilder,
  FormControlName,
  NgForm,
  AbstractControl,
  AsyncValidatorFn,
  ValidationErrors,
} from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { forkJoin, Observable, of, ReplaySubject } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { LoaderService } from 'src/app/core/services/loader.service';
import { MastersService } from 'src/app/core/services/masters/masters.service';
import { PopupService } from 'src/app/core/services/popup.service';
import { SolutionService } from 'src/app/core/services/solution/solution.service';
import { format } from 'sql-formatter';
import { DatePipe } from '@angular/common';
import { HttpService } from 'src/app/core/services/services/http.service';
import { factories, models, service } from 'powerbi-client';
// import { ToastComponent } from '../../all-common/toast/toast.component';


@Component({
  selector: 'app-add-process',
  templateUrl: './add-process.component.html',
  styleUrls: ['./add-process.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition(
        'expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')
      ),
    ]),
  ],
})
export class AddProcessComponent implements OnInit {
  rbnProcessType: number = 0;
  //AddProcessForm!: FormGroup;
  tabGeneric: boolean = true; //x
  tabSolDisplay: boolean = true;
  tabGenericInfo: boolean = true;
  tabClientSpec: boolean = false;
  targetFilesInfoBtn: boolean = false
  selectedCheckBox: any;
  // selectOnlyOneCheckbox = [
  //   { id: 1, data: 'N', value: 'New (or)' },
  //   { id: 2, data: 'U', value: 'Upcoming' },
  // ];
  powerbi!: service.Service;
  processNameControl: FormControl = new FormControl(null);
  processDescriptionControl: FormControl = new FormControl(null);
  isAnalyticsRowEdit: number = -1;
  imgFile: any;
  vidFile: any;
  brochureFile: any;
  showFileNameUI: any = { img: '', vid: '', brochure: '' };
  masterSelected: boolean = false;
  errorMsgAP: any = {};
  Genericform!: FormGroup;
  // Genericform: FormGroup | any;
  genericFormLength: any;
  names: any[] = [];
  selectedProcessType: string = 'Generic';
  indusData: any;
  lengthIndus: any;
  addFeatureList: boolean = false;
  clients: any;
  seniroForm!: FormGroup;
  fileForm!: FormGroup;
  seniroList: any = [];
  submited: boolean = false;
  submit: boolean = false;

  @ViewChild('form', { static: false }) private form!: NgForm;
  selectunall: boolean = false;
  procData: any;
  proid: any;
  demoimg: boolean = false;
  demo: any;
  procData1: any;
  isDisabled: any;
  isNextBtnEnable: boolean = false;
  senadded: boolean = true; //x

  //solution board overall

  enableAddBtn: boolean = false;
  submited1: boolean = false;
  appendForm!: FormGroup;
  submit1: boolean = false;
  joinForm!: FormGroup;
  isOverride: boolean = false;
  fileListt: Array<any> = [];
  sortedList: any[] = [];
  sortedCheckedList: any[] = [];
  mergeCheckedList: any[] = [];
  appendUnchechedList: any[] = [];
  disableContinue = false;
  disableRelButton = true;
  progressBarPopup: boolean = false;

  enableDataSetPopUp: boolean = false;
  datasetDetailsList: any[] = [];
  //, opearator :''
  createExpressionList: any[] = [];
  // createExpressionList = [{ fieldName: '', expression: '', isEdit: false, columnType: '', where: '', or: '', groupBy: '', value: '', signOperator: '', whereList: [{ operator: '', signOperator: '', value: '' }] }];

  filesList: any[] = [];
  columnsArr: any[] = [];
  showUploadFilesTab: boolean = false;
  masterSelected1: boolean = false;
  ISList = 0;
  tabs = [
    { id: 0, value: 'Add Process', isActive: true, routeValue: 'add-process' },
    {
      id: 1,
      value: 'Upload Files',
      isActive: false,
      routeValue: 'upload-files',
    },
    {
      id: 2,
      value: 'Target FIles',
      isActive: false,
      routeValue: 'target-files',
    },
    { id: 3, value: 'Append', isActive: false, routeValue: 'append' },
    { id: 4, value: 'Join', isActive: false, routeValue: 'join' },
    {
      id: 5,
      value: 'Data Modelling',
      isActive: false,
      routeValue: 'data-modeling',
    },
  ];
  enableAppendNamePopup: boolean = false;
  enableMergeNamePopup: boolean = false;
  submitted: boolean = false;
  submittedErrorMsg!: string;
  targetFileRowEdit: number = -1;

  selectedM_A_S: any[] = []; //tab4
  showTargetFilePopup: boolean = false; //ta4

  enableOverRideConfirmPopup: boolean = false;

  cursorPosition: number = 0;
  appendNameControl: FormControl = new FormControl(null);
  invoiceForm1: FormGroup | any;
  //opearatorForm!: FormGroup;
  //signOperatorList = [{ id: 0, value: '<' }, { id: 1, value: '>' }, { id: 2, value: '=' }, { id: 3, value: '<=' }, { id: 4, value: '>=' }, { id: 5, value: '<>' }, { id: 6, value: 'IN' }, { id: 7, value: 'NOT IN' }, { id: 8, value: 'LIKE' }]
  opearatorList = [
    { id: 1, value: 'AND' },
    { id: 2, value: 'OR' },
  ];
  signOperatorList: any[] = [];

  //accordion
  isOpenAccordion: boolean = false;
  // @ViewChildren('input') public inputs!: QueryList<ElementRef> | any;
  //@ViewChild('textArea') _textArea: ElementRef;
  fx: any = [];
  displayedRows$: Observable<any> | any;
  //private tableData = new MatTableDataSource(this.messages);
  //accordian-datamodeling-sortedCL,mergedcL

  allExpandState: boolean = false;
  panelOpenState: boolean = false;

  dataType = [
    'int',
    'float',
    'char',
    'varchar',
    'dateTime',
    'money',
    'text',
    'decimal',
    'datetime2',
    'decimal',
    'nvarchar',
    'bigint',
  ];
  dataTypee = [
    { id: 0, value: 'int' },
    { id: 1, value: 'float' },
    { id: 2, value: 'char' },
    { id: 3, value: 'varchar' },
    { id: 4, value: 'text' },
    { id: 5, value: 'money' },
    { id: 6, value: 'dateTime' },
    { id: 7, value: 'date' },
    { id: 8, value: 'datetime2' },
    { id: 9, value: 'decimal' },
    { id: 10, value: 'nvarchar' },
    { id: 11, value: 'bigint' },
  ];

  dateTimeFormats = [
    'MM/dd/yyyy',
    'MM-dd-yyyy',
    'dd/MM/yyyy',
    'dd-MM-yyyy',
    'yyyy/MM/dd',
    'yyyy-MM-dd',
    'yyyy/dd/MM',
    'yyyy-dd-MM',
    'MMddyyyy',
    'ddMMyyyy',
    'yyyyMMdd',
    'yyyyddMM',
  ];

  joinType = [
    'Inner Join',
    'Left Join',
    // 'Outer Join',
    'Right Join',
    'Full Join',
    // 'Cross Join',
  ];
  unCheckedListAddToMergeList: any[] = []; // try to x
  viewscriptForm!: FormGroup;
  sqlScriptForm!: FormGroup;
  selected_filename: any;
  process: any;
  userInfo: any = {}
  relationShipPayload: any = [];
  selectedDateList: any[] = [];
  relationship: any[] = [];
  enableUploadSQLPopup: boolean = false;
  joinSetForm!: FormGroup;
  placetable: any = 'Select Primary Table';
  dataSetForm!: FormGroup;
  //dataSetData:any= [{primaryTableList:[{tableNameUI:''}], foreignTableList:[{tableNameUI:''}], columns: [{ primaryKeyList: [{primaryKeyList:[], foreignKeyList:[]}], foreignKeyList: [{primaryKeyList:[], foreignKeyList:[]}] }], Join:'', order:0}  ];
  dataSetData: any[] = [];
  showRelationshipModal = false;

  datasetForm!: FormGroup;
  datasetTableForm!: FormGroup;
  datasetAppendForm!: FormGroup;
  getViewScriptForm!: FormGroup;
  createExpressionForm!: FormGroup;
  addRelationshipForm!: FormGroup;

  hideCreateIdenticalBtnWithLength: boolean = true;
  scenarioForm!: FormGroup;

  //UF(new)
  // columnsToDisplay = ['fileNameWithExt', 'UPLOADED ON', 'Action'];
  columnsToDisplay = ['File Name', 'Uploaded On', 'Action'];
  expandedElement!: ParentElement | null;
  innerDisplayedColumns = ['sheetName', 'previewIcon'];
  dataSource!: MatTableDataSource<ParentElement>;
  columnsToDisplayWithExpand = ['expand', ...this.columnsToDisplay];
  @ViewChildren('innerTables') innerTables!: QueryList<MatTable<ChildElement>>;
  @ViewChildren('innerSort') innerSort!: QueryList<MatSort>;
  @ViewChild('outerSort', { static: true }) sort!: MatSort;
  uploadedManualToggleForm!: FormGroup
  selectedScriptTypeInUF: string = 'SQL script'

  //TF
  masterSelectedInTF: boolean = false
  targetFileList: Array<any> = []
  tartargetFileListForSearch: Array<any> = []
  targetFilePopupForm!: FormGroup
  scriptList: Array<any> = ['SQL script', 'Python Script']
  dateFormatInTF: Array<any> = ['dd/mm/yyyy', 'yyyy/mm/dd', 'dd-mm-yyyy', 'dd-mm-yy', 'dd Mon yyyy', 'dd.mm.yy']





  //Append
  sourceFilesListForSearch: Array<any> = []

  //join
  isAppendExpandInJoin: boolean = false
  isSourceFilesExpandInJoin: boolean = false
  append_SourceFilesListForSearch: Array<any> = []


  //DM
  columnsForWhereInDS: Array<any> = [];
  isManualScript: boolean = true
  isUploadScript: boolean = false
  isDatasetExpandInCreateDSPopup: boolean = false
  isDatasetExpandInAddCustomColumnInDSPopup: boolean = false
  sourceFilesAppendJoinFileList2: Array<any> = []
  sourceFilesAppendJoinFileListForSearch: Array<any> = []
  allDatasetDetailsList: any[] = [];
  allDatasetDetailsList2: Array<any> = []
  allDatasetDetailsListForSearch: Array<any> = []
  searchValueInCreateDSPopup: string = ''
  searchValueInColumnPopup: string = ''
  add_editCustomColumnNameInPopupInDM!: string
  enableUploadSQLPython: boolean = false
  desktopServicesArray: any = [
    {
      value: 'Power BI Desktop',
      isChecked: false,
      instructions: [
        { id: 1, message: "Download the Power Bi Desktop" },
        { id: 2, message: "Login to the desktop using the credentials" },
        { id: 3, message: "Search for the workspace (workspacename will be the process name)" },
        { id: 4, message: "Create the report and publish in desktop" },
        { id: 5, message: "Select a report from the list of the reports published" },
        { id: 6, message: "Report selected will be the final report and no changes are allowed in the desktop at the later point of time" },
        { id: 7, message: "Edit the report in Power BI service" },
      ]
    },
    {
      value: 'Power BI Services',
      isChecked: false,
      instructions: [
        { id: 1, message: "To create report in PowerBi Service,Select" },
        { id: 2, message: "Click on Continue" },
        { id: 3, message: "Create the report using the dataset in the Service" },
        { id: 4, message: "Save and Publish" },
      ]
    }
  ]

  @ViewChild('toggleButton') toggleButton!: ElementRef;
  @ViewChild('menu') menu!: ElementRef;

  //
  activeTab: any = 0;
  DataPopUp: boolean = false;
  guid: boolean = false;
  guidindex: any = 0;
  searchindusData: any;
  PBIDesktop: boolean = false;
  userguideaddprocess: boolean = false;
  userguideupload: boolean = false;
  userguidetarget: boolean = false;
  userguideappend: boolean = false;
  userguidejoin: boolean = false;
  userguidedatamodeling: boolean = false;
  imginvalid: boolean = false;
  Reports: any;
  ReportForm!: FormGroup;
  AddEventProceeding!: boolean;
  embedViewContainer!: HTMLElement | any;
  reportViewConfig!: { type: string; tokenType: any; accessToken: any; embedUrl: any; id: any; filters: never[]; settings: { filterPaneEnabled: boolean; navContentPaneEnabled: boolean; }; };
  viewReports: any
  @Input() services!: service.Service;
  deleteAnalytics: boolean = false;
  isAnalyticsRowDelete!: number;



  constructor(
    private popup: PopupService,
    private _sanitizer: DomSanitizer,
    private route: ActivatedRoute,
    private loader: LoaderService,
    private formBuilder: FormBuilder,
    private Master: MastersService,
    private solution_services: SolutionService,
    // private toast: ToastComponent,
    public fb: FormBuilder,
    private _route: ActivatedRoute,
    private _router: Router,
    private router: Router,
    private changeDetectorRef: ChangeDetectorRef,
    private renderer: Renderer2,
    private solService: SolutionService,
    private dialog: MatDialog,
    private activatedRoute: ActivatedRoute,
    private readonly datePipe: DatePipe,
    private service: HttpService,
  ) {
    this.selectedCheckBox = [
      { id: 1, data: 'N', value: 'New', isSelected: false },
      { id: 2, data: 'U', value: 'Upcoming', isSelected: false },
    ];
  }

  ngOnInit(): void {
    this.process = JSON.parse(localStorage.getItem("process") || '{}')
    this.userInfo = JSON.parse(localStorage.getItem("userInfo") || '{}')
    console.log('this.process', this.process);
    console.log('this.userInfo', this.userInfo);

    if (this.services) {
      this.powerbi = this.services;
    } else {
      this.powerbi = new service.Service(
        factories.hpmFactory,
        factories.wpmpFactory,
        factories.routerFactory
      );
    }

    //AP
    this.Genericform = this.formBuilder.group({
      chooseclient: [''],
      processNameControl: ['', Validators.required],
      processDescriptionControl: ['', Validators.required],
      addfeaturelist: [''],
      display: [''],
      // selectindustrysector: [''],
    });
    this.seniroForm = this.formBuilder.group({
      aName: ['', Validators.required],
      aDescription: ['', Validators.required],
    });
    this.fileForm = this.formBuilder.group({
      imgFile: [''],
      vidFile: [''],
      broFile: [''],
      // aDescription: ['', Validators.required],
    });

    this.scenarioForm = this.fb.group({ name: ['', Validators.required], description: ['', Validators.required] });
    this.fileForm.controls['imgFile'].setValidators(Validators.required);
    // this.seniroForm.controls['aName'].setValidators(Validators.required);
    // this.seniroForm.controls['aDescription'].setValidators(Validators.required);

    this.ReportForm = this.fb.group({
      measures: this.fb.array([])
    })
    this.addMeasure()

    //UF
    this.dataSource = new MatTableDataSource(this.fileListt);
    this.dataSource.sort = this.sort;

    this.uploadedManualToggleForm = this.formBuilder.group({
      manualOrUploaded: [false]
    })
    if (this.process.solutionType != undefined) {
      let bool = (this.process.solutionType == 'U') ? true : false
      this.uploadedManualToggleForm.controls.manualOrUploaded.patchValue(bool)
    }
    this.getViewScriptForm = this.formBuilder.group({
      script: ['', Validators.required],
      solutionScriptId: [''],
      type: [''],
      gscript: [''],
    });

    this.sqlScriptForm = this.fb.group({
      datasetName: [''],
      sqlScript: ['', Validators.required],
      type: [''],
      findAll: [''],
      replaceAll: ['']
    });


    //TF
    this.targetFilePopupForm = this.formBuilder.group({
      targetFileList: this.formBuilder.array([])
    })



    //A
    this.appendForm = this.formBuilder.group({
      appendNameControl: ['', Validators.required],
    });


    //J
    this.joinSetForm = this.formBuilder.group({
      Merg: this.formBuilder.array([]),
    });
    this.joinForm = this.formBuilder.group({
      appendNameControl: ['', Validators.required],
    });



    //DM
    this.createExpressionList = [];

    this.dataSetForm = this.fb.group({
      DSetRows: this.fb.array([]),
    });
    this.datasetAppendForm = this.formBuilder.group({
      appendNameControl: ['', Validators.required],
    });
    this.createExpressionForm = this.fb.group({
      sourceFieldName: ['', Validators.required],
      columnType: [[], Validators.required],
      columnFormat: [[]],
      excludeInSelect: [false],
      sourceExpressionName: [''],
      // signOperator: ['', Validators.required],
      // value: ['', Validators.required],      // whereList: this.fb.array([])
    });
    this.datasetForm = this.formBuilder.group({
      appendNameControl: ['', Validators.required],
    });
    this.viewscriptForm = this.fb.group({
      sqlScript: [''],
      datasetId: [''],
    });
    this.addRelationshipForm = this.fb.group({
      addRelationshipRows: this.fb.array([this.addRelationshipRow()]),
    });
    this.datasetTableForm = this.fb.group({
      groupBy: [''],
      groupBySearch: [''],
      having: [''],
      orderBy: [''],
      orderBySearch: [''],
      where: this.fb.array([this.whereFirstRow()]),
    });







    this.solService.getSolutionType().subscribe((obj: any) => {
      if (obj.id) this.changetab(obj.id)
    })
    let routerValue = this.activatedRoute.snapshot.paramMap.get('id');

    if (routerValue != 'add-process') {
      if (this.process.processId == undefined) {
        // this.router.navigate(['/user/admin1/solutionboard/add-process']);
        this.changeTabs({ id: 0 }, 'prev');
        return;
      }

    }

    // console.log(routerValue);


    // this.process = {
    //   processId: '61f0d058-4977-4633-80c6-09cdeb2b57c8',
    //   // processId: '6472ed45-8d9f-457e-8b52-a91626efffc1',
    //   processName: 'process deloitte',
    // };
    // localStorage.removeItem('process');
    // this.process = JSON.parse(localStorage.getItem("process") || '{}') //just commented 607B9457-C338-4D2B-8011-D47017162B24


    this.tabs.forEach((item: any) => { //R
      // console.log(item.routeValue, routerValue);
      if (item.routeValue == routerValue) {
        this.changeTabs(item, 'prev');
      }
    });
    // if (!(this.process.processId != null)) {
    // let GCStab = this.activatedRoute.snapshot.paramMap.get('id');
    // // console.log(GCStab);
    // this.changetab(GCStab)
    // // }
    //this.displayedRows$ = of(this.messages);



    // this.appendForm.get("appendNameControl")?.setAsyncValidators([this.isValidName(), this.isAppendNameInList()]);
    // this.joinForm.get("appendNameControl")?.setAsyncValidators([this.isValidName(), this.isAppendNameInList()]);
    //added new










    //DM
    // this.MergeArr().push(this.Merg())
    // this.TableArr(0).push(this.addTable())
    // this.columnArr(0,0).push(this.addColumn())
    //console.log(this.joinSetForm);
    //this.datasetForm.get("appendNameControl")?.setAsyncValidators([this.validateDatasetname()]);

    //UF(new)
    // this.genericFormLength = (this.Genericform.get('analytics') as FormArray).value.length;
    // if(this.route.snapshot.paramMap.get('processId') != null){
    //   this.getProcessByID()
    // }
    //solution board overall
    //   this.renderer.listen('window', 'click',(e:Event)=>{

    //    if(e.target !== this.toggleButton?.nativeElement && e.target!==this.menu?.nativeElement){
    //   // console.log(e)

    //         this.functionClicked=false;

    //     }
    // });

  }
  SubmitReport() {
    let data
    this.Reports.forEach((ele: any) => {
      if (ele.checked) {
        data = {
          embedtype: 'RV',
          reportid: ele.reportId,
          groupid: ele.workSpaceId,
          datasetid: ele.datasetId,
          processId: this.process.processId,
          reportName: ele.reportName,
          userId: this.userInfo.userId,
          type: 1
        }
        this.service.saveReport(data).subscribe((res: any) => {
          localStorage.setItem('PBIdata', JSON.stringify(res.responseData))
          this.router.navigate([
            '/user/admin1/powerbi-interface'
          ]);
        })
      }
      else {
        this.service.deleteReport(this.process.processId, ele.workSpaceId, ele.reportId).subscribe((res: any) => { })
        // delete
      }
    });
  }
  hideViewReport() {
    this.AddEventProceeding = false;
  }
  openWindow() {
    localStorage.setItem('powerbiconfig', JSON.stringify(this.reportViewConfig))
  }
  async PrintReport() {
    try {
      await this.viewReports.print();
    }
    catch (errors) {
    }
  }
  ViewReport(data: any, i: any) {
    let reqData = {
      embedtype: "RV",
      reportid: data.reportId,
      groupid: data.workSpaceId,
      datasetid: data.datasetId,
      processId: this.process.processId,
      type: 1
    }
    this.service.viewReport(reqData).subscribe((res: any) => {
      this.AddEventProceeding = true;
      this.embedViewContainer = document.getElementById('embedView');
      this.reportViewConfig = {
        type: 'report',
        tokenType: models.TokenType.Embed,
        accessToken: res.responseData?.embedToken,
        embedUrl: res.responseData?.embedUrl,
        id: res.responseData?.reportId,
        filters: [],
        settings: {
          filterPaneEnabled: true,
          navContentPaneEnabled: true
        }
      }
      console.log(this.embedViewContainer);
      this.viewReports = this.powerbi.embed(this.embedViewContainer, this.reportViewConfig);
    })
  }
  measuresArr() {
    return this.ReportForm.controls.measures as FormArray
  }
  Measure() {
    return this.fb.group({
      name: [''],
      expression: [''],
      formateString: ['']
    })
  }
  addMeasure() {
    this.measuresArr().push(this.Measure())
  }
  removeMeasure(i: any) {
    this.measuresArr().removeAt(i);
  }

  clearForm() {
    // this.fileForm.reset();
    // this.seniroForm.reset();
    console.log(this.procData?.powerBiDatasetExists);
    // if(!this.procData?.powerBiDatasetExists)
    this.Genericform.controls.processNameControl.reset();
    this.showFileNameUI = { img: '', vid: '', brochure: '' };
    this.selectedCheckBox.map((x: any) => x.isSelected = false)
    this.getProcessByID();
    this.seniroList = [];
    this.uncheckUncheckISAll();
    this.Genericform.controls.addfeaturelist.reset();
    this.Genericform.controls.processDescriptionControl.reset();
    this.Genericform.controls.chooseclient.reset();


  }

  searchclientFilter(event: any) {
    this.clients = this.clients.filter((user: any) =>
      this.containsValue(user, event.target.value.trim().toLowerCase())
    );
  }
  // containsValue(userObj: any, searchValue: any) {
  //   return Object.values(userObj).reduce((prev, cur: any) => {
  //     if (cur != null) {
  //       cur = cur.toString().trim().toLowerCase();
  //       // console.log(cur);
  //     }
  //     return prev || cur?.indexOf(searchValue) > -1;
  //   }, false);
  // }

  processType: string = 'Generic';
  changetab(id: any) {
    // console.log(id);

    this.processType = '';
    if (id == 1) {
      this.processType = 'Generic';
      this.tabGeneric = true;
      this.tabSolDisplay = true;
      this.tabGenericInfo = true;
      this.tabClientSpec = false;
    } else if (id == 2) {
      // this.processType = 'Generic';
      this.tabGeneric = true;
      this.tabSolDisplay = false;
      this.tabGenericInfo = false;
      this.tabClientSpec = true;
      // this.fileForm.get('broFile').clearValidators();
      this.fileForm.controls['imgFile'].setValidators(null);
      this.fileForm.controls['imgFile'].updateValueAndValidity();
      console.log(this.fileForm);
    }

  }

  isAllSelected(item: any) {
    this.selectedCheckBox.forEach((val: { id: any; isSelected: boolean }) => {
      if (val.id == item.id) val.isSelected = !val.isSelected;
      else {
        val.isSelected = false;
      }
      console.log(item.value);
    });
  }

  onSubmit() {
    //this.Genericform.controls()
    this.submit = true;
    if (this.scenarioForm.invalid) {
      this.popup.open(false, 'Enter All the Required Fields');
      return;
    }
    this.seniroList;
    console.log(this.scenarioForm);
    this.seniroList.push({
      analyticsName: this.scenarioForm.value.name,
      analyticsObjective: this.scenarioForm.value.description,
    });
    this.senadded = false;
    this.scenarioForm!.reset();
    this.submit = false;
    console.log('formmmm', this.scenarioForm);
    this.closePopup()
  }
  // this.toast.error({
  //   title: 'Error',
  //   message: 'Enter All the Required Fields',
  // });
  // processNameControl: this.Genericform.value.processNameControl,
  // processDescriptionControl: this.Genericform.value.processDescriptionControl,
  // selectindsect: this.Genericform.value.selectindsect,
  // (this.Genericform.get('analytics') as FormArray).push(this.fb.group({
  //   analyticsName: this.Genericform.value.aName,
  //   analyticsObjective: this.Genericform.value.aDescription
  // }));
  // this.genericFormLength = (this.Genericform.get('analytics') as FormArray).value.length;
  // (this.Genericform.get('aName') as FormArray).reset();
  // (this.Genericform.get('aDescription') as FormArray).reset();
  // this.form?.resetForm();
  // // this.seniroForm.get('aDescription')!.reset();
  // this.seniroForm.controls["aName"].setValidators(null)
  // this.seniroForm.controls['aName'].updateValueAndValidity();
  // this.seniroForm.controls["aDescription"].setValidators(null)
  // this.seniroForm.controls['aDescription'].updateValueAndValidity();
  tabtab(item: any) {
    this.tabsChange(item);
    this.selectedTab = item.id
  }
  getAllIndustry() {
    // console.log(11);

    this.Master.getAllIndustry().subscribe((res: any) => {
      // console.log(res);
      res.responseData.forEach((obj: any) => {
        obj.sectorList.forEach((item: any) => {
          item.isSelected = false;
        });
      });
      this.indusData = res.responseData;
      this.searchindusData = res.responseData;
      this.lengthIndus = res.responseData.length;
      // console.log(this.indusData, this.lengthIndus);
      if (this.process.processId != null) {
        this.getProcessByID();
      }


    });
  }

  onChangeAddFeatureList(e: any) {
    this.addFeatureList = e.target.checked;
  }

  onChangeNew_Upc(value: any) {
    //this.selectedCheckBox = value.substring(0, 1);
    this.selectedCheckBox = value;
  }

  analyticsRowEdit(i: number, data: any) {
    this.isAnalyticsRowEdit = i;
    this.seniroForm.patchValue({
      aName: data.analyticsName,
      aDescription: data.analyticsObjective
    })
    // console.log(data,this.seniroForm.value);

  }

  getAnalyticsControls() {
    return (this.Genericform.get('analytics') as FormArray).controls;
  }

  deleteAnalyticsRow(index: number) {
    this.deleteAnalytics = true;
    this.isAnalyticsRowDelete = index;
  }
  deleteAnalyticsApproved() {
    if (this.seniroList[this.isAnalyticsRowDelete].analyticsId) {
      this.Master.deleteAnalytics(this.userInfo.userId, this.seniroList[this.isAnalyticsRowDelete].analyticsId).subscribe((res: any) => {
        console.log(res);
        this.seniroList.splice(this.isAnalyticsRowDelete, 1);
        this.deleteAnalytics = false;
      })
    }
    else {
      this.seniroList.splice(this.isAnalyticsRowDelete, 1);
      this.deleteAnalytics = false;
    }

  }
  scenarioCancel(){
    this.deleteAnalytics = false;
  }
  imageUrl: any;
  imgFileUpload(e: any) {
    this.errorMsgAP = {};
    this.imgFile = e.target.files[0];
    //this.showFileNameUI.imgSize = this.imgFile.size;
    if (this.imgFile.size < 100000) {
      if (
        this.imgFile.type === 'image/jpeg' ||
        this.imgFile.type === 'image/png' ||
        this.imgFile.type === 'image/jpg'
      ) {
        console.log(this.imgFile.type);

        this.showFileNameUI.img = this.imgFile.name;

        //imageUrl
      } else {
        //print incorrect format error
      }
    } else {
      //print size error
    }
  }
  vidFileUpload(e: any) {
    this.vidFile = e.target.files[0];
    if (this.vidFile.size <= 1000000) {
     if (
       this.vidFile.type === 'video/mp4'
      //  ||
      //  this.vidFile.type === 'video/3gpp' ||
      //  this.vidFile.type === 'video/quicktime' ||
      //  this.vidFile.type === 'video/x-ms-wmv' ||
      //  this.vidFile.type === 'video/x-msvideo' ||
      //  this.vidFile.type === 'video/mpeg' ||
      //  this.vidFile.type === 'video/dvd' ||
      //  this.vidFile.type === 'video/xvid' ||
      //  this.vidFile.type === 'video/x-flv' ||
      //  this.vidFile.type === 'video/x-f4v' ||
      //  this.vidFile.type === 'video/divx'
     ) {
       this.showFileNameUI.vid = this.vidFile.name;
      } else {
      }
   }
  }
  brochureFileUpload(e: any) {
    this.brochureFile = e.target.files[0];
    if (this.brochureFile.size <= 200000) {
     if (this.brochureFile.type === 'application/pdf') {
       this.showFileNameUI.brochure = this.brochureFile.name;
     } else {
     }
   }
  }

  checkUncheckISAll(event: any) {
    console.log(event.target.checked);
    this.indusData.forEach((obj: any) => {
      obj.sectorList.forEach((item: any) => {
        item.isSelected = event.target.checked;
        if (item.isSelected) {
          this.ISList++
          this.ISsubmited = (this.ISList > 0)
        }
      });
    });
    if (event.target.checked == false) {
      this.procData?.industrySectorResponse.forEach((ind: any) => {
        this.indusData.forEach((obj: any) => {
          if (obj.industryId == ind.industryResponse.industryId) {
            obj.sectorList.forEach((item: any) => {
              if (item.sectorId == ind.sectorResponse.sectorId) {
                item.isSelected = true;
                if (item.isSelected) {
                  this.ISList++
                  this.ISsubmited = (this.ISList > 0)
                }
              }
            });
          }
        });
      });
    }
    this.selectunall = event.target.checked;
    console.log(this.indusData);
  }
  uncheckUncheckISAll() {
    this.indusData.forEach((obj: any) => {
      obj.sectorList.forEach((item: any) => {
        item.isSelected = false;
      });
    });
    this.selectunall = false;
    console.log(this.indusData);
  }

  ISsubmited: boolean = false;
  isAllSelectedIS(data: any, ind: any) {
    // let p = 1;
    this.indusData.forEach((obj: any) => {
      if (obj.industryId == ind.industryId) {
        obj.sectorList.forEach((item: any) => {
          if (item.sectorId == data.sectorId) {
            item.isSelected = !item.isSelected;
            // p = 0;
            if (item.isSelected) {
              this.ISList++;
              this.ISsubmited = (this.ISList > 0)
              console.log('this.ISsubmited', this.ISsubmited);
              return;
            }
          }
        });
      }
    });
    // if (p == 0) this.masterSelected = false;
    // else this.masterSelected = true;
  }

  username: any;
  editSeniro(i: any, data: any) {
    if (this.seniroForm.value.aName.length != 0) {
      this.seniroList[i].analyticsName = this.seniroForm.value.aName
      if (this.seniroForm.value.aDescription.length != 0) {
        // console.log(this.seniroForm.value.aName);
        this.seniroList[i].analyticsObjective = this.seniroForm.value.aDescription
        this.isAnalyticsRowEdit = -1;
      }
    }
    // console.log(this.seniroList[i],this.seniroForm.value);

  }

  getAllOrganizations(item: any) {
    this.solution_services.getAllOrganizations().subscribe((res: any) => {
      // console.log(res);
      this.clients = res.responseData;
      this.tabtab(item)
    });
  }

  addProcessSave(item: any) {
    this.submited = true;
    // console.log('this.ISsubmited',this.ISsubmited);
    if (this.Genericform.invalid) {
      console.log("hi");
      if (this.ISList > 0) {
        this.ISsubmited = true
      }
      else {
        console.log("hi");
        this.ISsubmited = false
      }
      // console.log("hi");
      this.popup.open(false, 'Enter All the Required Fields');
      if (this.fileForm.invalid) {
        this.imginvalid = true;
      }
      // this.toast.error({
      //   title: 'Error',
      //   message: 'Enter All the Required Fields',
      // });
      return;
    }
    if (this.ISList > 0) {
      console.log("hi");
      this.ISsubmited = true
    }
    else {
      console.log("hi", this.ISList);
      this.ISsubmited = false
      return;
    }

    if (this.seniroList.length == 0 && this.processType == 'Generic') {
      console.log("hi");
      this.errorMsgAP.generic = 'Atleast 1 Scenario required';
      this.popup.open(false, 'Atleast 1 Scenario required');
      // this.toast.error({
      //   title: 'Error',
      //   message: 'Atleast 1 Scenario required',
      // });
      return;
    }
    if (this.fileForm.invalid) {
      console.log("hi");
      // this.errorMsgAP.img = 'Image is mandatory';
      console.log(this.fileForm);
      this.imginvalid = true;
      this.popup.open(false, 'Upload All the Required Files');
      // this.toast.error({
      //   title: 'Error',
      //   message: 'Upload All the Required Files',
      // });
      return;
    } else {
      console.log("hi");
      let inustrySectorMapDto: any[] = [];
      this.indusData.forEach((indObj: any) => {
        indObj.sectorList.forEach((secObj: any) => {
          if (secObj.isSelected) {
            inustrySectorMapDto.push({
              sectorId: secObj.sectorId,
              industryId: indObj.industryId,
              flag: secObj.flag != null ? secObj.flag : null,
            });
          } else if (secObj.flag) {
            console.log('hi');
            inustrySectorMapDto.push({
              sectorId: secObj.sectorId,
              industryId: indObj.industryId,
              flag: secObj.flag != null ? false : null,
            });
          }
        });
      });
      // console.log('this.ISsubmited',this.ISsubmited);
      console.log(inustrySectorMapDto, this.indusData);

      let ProcessRequest: any = {};
      ProcessRequest.processName =
        this.Genericform.get('processNameControl')?.value;
      ProcessRequest.processDescription = this.Genericform.get(
        'processDescriptionControl'
      )?.value;
      ProcessRequest.processType = this.processType || 'Client Specific'; //changes made for RK
      // this.Genericform.get('chooseclient')?.value.organizationName;
      console.log(
        this.processType,
        this.Genericform.get('chooseclient')?.value.organizationName
      );
      ProcessRequest.analytics = this.seniroList;
      ProcessRequest.industrySectorMapDto = inustrySectorMapDto;
      ProcessRequest.display =
        this.processType == 'Generic'
          ? this.selectedCheckBox.filter((x: any) => x.isSelected).length == 0
            ? null
            : this.selectedCheckBox.filter((x: any) => x.isSelected)[0]?.data
          : null; //static
      ProcessRequest.type = this.proid ? 2 : 1;
      // ProcessRequest.userId = '088E1F5C-9332-4109-97F8-C4E6BF19787A'; //static
      let data = JSON.parse(localStorage.getItem('userInfo') || '{}');
      console.log(data, data.userId);
      ProcessRequest.userId = data.userId;
      ProcessRequest.addFeatureList = this.addFeatureList;
      this.proid ? (ProcessRequest.processId = this.proid) : '';

      if (this.processType != 'Generic')
        ProcessRequest.clientList = {
          organizationId:
            this.Genericform.get('chooseclient')?.value.organizationId,
        };
      console.log(ProcessRequest);

      let formData: FormData = new FormData();
      formData.append('ProcessRequest', JSON.stringify(ProcessRequest));
      if (this.imgFile) {
        formData.append('imageFile', this.imgFile);
      }
      if (this.brochureFile) {
        formData.append('brochureFile', this.brochureFile);
      }
      if (this.vidFile) {
        formData.append('videoFile', this.vidFile);
      }
      console.log(formData);
      let statusName = this.process.statusName
      this.Master.PostaddorEditProcess(formData).subscribe(
        (res: any) => {
          res.responseData.statusName = statusName;
          console.log(res);
          localStorage.setItem('process', JSON.stringify(res.responseData));
          // console.log(localStorage.getItem('process'));
          // this._router.navigate(['/user/admin1/solutionboard/upload-files']);
          this.router.navigate(['/user/admin1/solutionboard/upload-files']);
          this.process = JSON.parse(localStorage.getItem("process") || '{}')
          this.getAllFileTemplateListByProcessID({ id: 1 });

          // this.selectedTab = item.id
          // this.tabsChange(item);



          // this.toast.error({ title: 'Error', message: "Process added successfully ! " });
          return;

        },
        (err: any) => {
          console.log(err.statusMessage);
          // this.toast.error({ title: 'Error', message: "Email already exist !" });
          this.popup.open(false, err);
          // this.toast.error({
          //   title: 'Error',
          //   message: 'Process Name already exist !',
          // });
          return;

        }
      );
      // return false;
    }
  }
  reset() {
    this.seniroForm.reset();
    this.Genericform.reset();
    this.showFileNameUI.img = '';
    this.showFileNameUI.vid = '';
    this.showFileNameUI.brochure = '';
    this.uncheckUncheckISAll();
    this.seniroList = [];
    // this.checkUncheckISAll=
  }

  getProcessByID() {
    // this.loader.show();
    this.proid = this.process.processId;
    let procesName = this.process.processName;

    // console.log(this.proid);
    this.isNextBtnEnable = true;
    // localStorage.setItem(
    //   'process',
    //   JSON.stringify({ processId: this.proid, processName: procesName })
    // );
    this.Master.getProcessByID(this.proid).subscribe((res: any) => {
      // console.log('peocesss', res);
      this.procData = res.responseData;
      localStorage.setItem('process', JSON.stringify(res.responseData));
      if (res.responseData?.processType == 'Generic') {
        this.changetab(1);
        this.isDisabled = 'G';
        // console.log(1);
      } else {
        this.changetab(2);
        this.isDisabled = 'C';
      }
      // this.procData1 = res.responseData.processAnalyticsDTOList;
      this.seniroList = res.responseData?.processAnalyticsDTOList;
      this.loader.hide();

      // Genericform
      // if(this.procData.processType == "Generic"){
      this.clients?.forEach((element: any) => {
        if (
          this.procData.processType == 'Client Specific' &&
          this.procData.clientName == element.organizationName
        ) {
          this.Genericform.patchValue({
            chooseclient: element,
          });
        }
      });

      this.Genericform.patchValue({
        // processType: "Generic"
        // chooseclient: this.procData.processType,
        processNameControl: this.procData.processName,
        processDescriptionControl: this.procData.processDescription,
        addfeaturelist: this.procData.addFeatureList,
        // display: (this.procData.display == 'N') ? true : false
        // if(this.procData.display == 'N'){
        //   display: this.procData.display,
        // }
      });
      if (this.procData?.powerBiDatasetExists == true) this.Genericform.controls.processNameControl.disable()

      let p = 0;
      // console.log(this.procData?.industrySectorResponse?.length);
      this.procData?.industrySectorResponse?.forEach((ind: any) => {
        this.indusData?.forEach((obj: any) => {
          if (obj.industryId == ind.industryResponse.industryId) {
            obj.sectorList.forEach((item: any) => {
              if (item.sectorId == ind.sectorResponse.sectorId) {
                item.isSelected = true;
                item.flag = ind.flag;
                this.ISList++;
                this.ISsubmited = (this.ISList > 0)
              }
            });
          }
        });
      });
      this.indusData?.forEach((obj: any) => {
        obj.sectorList.forEach((item: any) => {
          if (item.isSelected == false) {
            p = 1
          }
        })
      })
      this.selectunall = (p == 1) ? false : true;
      // console.log(this.selectunall);
      this.selectedCheckBox.forEach((ele: any) => {
        if (this.procData.display == ele.data) {
          // this.Genericform.patchValue({

          //   display: ele,
          // })
          //this.selectedCheckBox = this.procData.display;
          ele.isSelected = true;
          // console.log('tre', this.selectedCheckBox);
        }
      });
      // }
      // else

      // seniroForm
      // this.seniroForm.patchValue({
      //   aName: this.procData.processAnalyticsDTOList[0].analyticsName,
      //   aDescription: this.procData.processAnalyticsDTOList[0].analyticsObjective,
      // })
      // fileFormimgFile: this.procData.
      // vidFile: this.procData.
      // b
      // this.demo = this._sanitizer.bypassSecurityTrustResourceUrl(
      //   'data:image/png;base64,' + this.procData.imageUrl
      // );
      // if (this.procData.imageUrl === null) {
      //   // console.log(this.procData.imageDataresponse);
      //   this.seniroData = false;
      // } else {
      //   this.demo = this.procData.imageUrl
      //   );
      //   this.demoimg = true;
      // }

      if (this.procData.imageUrl === null) {
        // console.log(this.procData.imageDataresponse);
        this.demoimg = false;
      } else {
        // this.fcheckForMIMEType(this.procData.imageUrl)

        this.demo = this._sanitizer.bypassSecurityTrustResourceUrl(
          'data:image/png;base64,' + this.procData.imageUrl
        );
        this.demoimg = true;
        // this.showFileNameUI.img = this.procData.imageName

        // this.fileForm
        this.fileForm.controls['imgFile'].setValidators(null);
        this.fileForm.controls['imgFile'].updateValueAndValidity();
      }
      if (this.procData.imageName != null) this.showFileNameUI.img = this.procData.imageName;
      if (this.procData.videoName != null) this.showFileNameUI.vid = this.procData.videoName;
      if (this.procData.brochureName != null) this.showFileNameUI.brochure = this.procData.brochureName;
      // console.log('this.showFileNameUI',this.showFileNameUI);

    });
  }

  //solution board overall

  ngAfterViewInit(): void { }

  private validateDatasetname(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | any> => {
      let bReturn: boolean = true;
      let regExp = '^[a-zA-Z0-9]{4,10}$'; //^(\d|\w)+$
      //regExp.test()
      const val = this.datasetForm.get('appendNameControl')?.value;
      this.solService.getExistDataset(val, '').subscribe(
        (res: any) => {
          this.submitted = false;
          this.submittedErrorMsg = '';
          // console.log(res);
        },
        (err: any) => {
          this.submitted = true;
          this.submittedErrorMsg = 'Dataset Name Already Exists';
          //this.toast.error({ title: 'Error', message: "Dataset Name Already Exists" });
        }
      );
      // if (this.enableAppendNamePopup) {
      //   let arr = this.sortedCheckedList.filter(x => x.showAppendName == val)
      //   if (arr.length != 0) bReturn = false;
      //
      let err: ValidationErrors = { exists: true };
      return bReturn ? of(null) : of(err);
    };
  }

  rowCount: any;
  previewPopup(element: any) {
    console.log(element);
    let tName: string = ''
    let type!: string
    let selectedFileName!: string
    if (this.tabs[1].isActive) {  //txt, pdf pending
      type = 'table'
      if (element.fileExt == 'csv' || element.fileExt == 'txt' || element.fileExt == 'pdf' || element.fileExt == 'json') {
        selectedFileName = element['File Name']
        tName = element.totalSheetList.filteredData[0].tableName
      }
      else if (element.fileExt == 'xlsx' || element.fileExt == 'xls') {
        selectedFileName = element.sheet[0]?.showTabColName.split('[')[0]
        tName = element.tableName
      }
    }

    else if (this.tabs[3].isActive) {
      type = (element.type == 'Append') ? 'append' : (element.type == 'files') ? 'table' : ''
      tName = element.tableName
      selectedFileName = (element.type == 'Append') ? element.appendName : element.tableNameUI//csv,xlsx working
    }
    else if (this.tabs[4].isActive) {
      type = (element.type == 'Append') ? 'append' : (element.type == 'files') ? 'table' : (element.type == 'Merge') ? 'join' : ''
      tName = element.tableName
      selectedFileName = (element.type == 'Merge') ? element.mergeName : element.tableNameUI //csv,xlsx working
    }
    else if (this.tabs[5].isActive) {
      type = (element.type == 'dataset') ? 'dataset' : (element.type == 'Append') ? 'append' : (element.type == 'files') ? 'table' : (element.type == 'Merge') ? 'join' : ''
      tName = element.tableName
      selectedFileName = (element.type == 'dataset') ? element.datasetName : (element.type == 'Append') ? element.appendName : (element.type == 'Merge') ? element.mergeName : (element.type == 'files') ? element.tableNameUI : ''
    }

    console.log(type);

    this.viewTableDetails(tName, '', { fileName: selectedFileName }, type)
  }


  targetFileClickedRowX_DateFormat(): FormGroup {
    return this.formBuilder.group({
      newColumnName: ['', Validators.required],
      fieldName: [''],
      columnId: [''],
      templateId: [''],
      tableName: [''],
      columnType: [''],
    });
  }

  targetFileClickedRow_DateFormat(): FormGroup {
    return this.formBuilder.group({
      newColumnName: ['', Validators.required],
      fieldName: [''],
      columnId: [''],
      templateId: [''],
      tableName: [''],
      columnType: [''],
      dateFormat: ['', Validators.required],
    })
  }


  submittedTFPopup: boolean = false
  updateInPopupTF() {
    console.log(this.targetFilePopupForm.controls);

    let validInvalidList = this.TargetFileArr().controls.map((x: any) => x.invalid)
    if (validInvalidList.includes(true)) {
      this.submittedTFPopup = true // need to check in html
      return
    }
    // let validateDateFormat = this.TargetFileArr().controls.filter((y:any)=>y.controls.dateFormat).map((x:any)=>x.controls.dateFormat.value)
    // if(validateDateFormat.includes(null) ||validateDateFormat.includes(undefined) ){
    //   this.submittedTFPopup = true // need to check in html
    //   return
    // }

    let reqObj: any = {
      userID: this.userInfo.userId,
      tableColumnChangeDetailsList: [],
      dataTypeChangeDetails: []
    }


    this.TargetFileArr().controls.forEach((columnObj: any) => {
      if (!columnObj.controls.newColumnName.pristine) { //columns edit
        reqObj.tableColumnChangeDetailsList.push({
          templateFieldId: columnObj.controls.columnId.value,
          tableName: columnObj.controls.tableName.value,
          templateId: columnObj.controls.templateId.value,
          newColumnName: columnObj.controls.newColumnName.value,
          previousColumnName: columnObj.controls.fieldName.value
        })
      }
      let dataTypeObj: any = {
        templateFieldId: columnObj.controls.columnId.value,
        tableName: columnObj.controls.tableName.value,
        templateId: columnObj.controls.templateId.value,
        columnName: columnObj.controls.fieldName.value,
        newDataTypeName: columnObj.controls.columnType.value,
      }




      if (!columnObj.controls.columnType.pristine) {
        let keys = Object.keys(columnObj.controls)
        if (keys.includes('dateFormat')) {
          dataTypeObj.dateFormat = columnObj.controls.dateFormat.value
        }
        else {
          dataTypeObj.dateFormat = null
        }
        reqObj.dataTypeChangeDetails.push(dataTypeObj)

      }
      if (columnObj.controls.dateFormat != undefined) {
        // if (!columnObj.controls.dateFormat.pristine) {
        dataTypeObj.dateFormat = columnObj.controls.dateFormat.value
        reqObj.dataTypeChangeDetails.push(dataTypeObj)
        // }
      }
    })

    reqObj.dataTypeChangeDetails = [...new Set(reqObj.dataTypeChangeDetails)]
    // this.clickedRowDataInTF.forEach((_obj: any) => {

    //   let datatypeObj: any = {
    //     templateFieldId: _obj.columnId,
    //     tableName: _obj.tableName,
    //     templateId: _obj.templateId,
    //     columnName: _obj.columnName,
    //     newDataTypeName: _obj.columnType,
    //   }

    //   if (_obj.isDropdownDirtyInTF)
    //     if (_obj.columnType == 'date' || _obj.columnType == 'dateTime' || _obj.columnType == 'datetime2') {
    //       datatypeObj.dateFormat = _obj.selectedDateFormat
    //       reqObj.dataTypeChangeDetails.push(datatypeObj)
    //     }
    //     else {
    //       datatypeObj.dateFormat = null //R
    //       reqObj.dataTypeChangeDetails.push(datatypeObj)
    //     }
    // })

    console.log(reqObj);

    if (reqObj.tableColumnChangeDetailsList.length != 0 || reqObj.dataTypeChangeDetails.length != 0) {
      this.solService.updateColumnAndDataType(reqObj).subscribe(
        (res: any) => {
          this.popup.open(true, res.responseData)
          this.showTargetFilePopup = false

        }, (err: any) => {
          this.popup.open(false, 'update failed')
        })
    }
    else {
      this.showTargetFilePopup = false
      //one popup message
    }

  }

  filteredColumnTypeListInTF: Array<any> = []
  private viewTableDetails(tName: any, i: any, Obj: any, fileType: any) {
    //this.targetFilePopupForm
    // this.TargetFileArr()
    // this.clickedRowDataInTF = []
    this.clickedRowDataInTF = Obj.fileName
    this.filteredColumnTypeListInTF = []
    this.rowCount = '';
    if (tName != '') {
      this.loader.show();
      let data: any = { name: tName, processId: this.process.processId }
      if (this.tabs[2].isActive) data.targetFileEdit = 'S'
      this.solService.viewTableDetails(data).subscribe(
        (res: any) => {
          let columnTypeDetails: Array<any> = []
          let columnFormatDetails: Array<any> = []
          if (res.responseData != null) {
            this.selectedM_A_S = res.responseData.tableDetails;
            this.preview()
            if (this.tabs[2].isActive) {
              //this.clickedRowDataInTF = res.responseData.tableDetails; //x
              // if (i == 0) this.clickedRowDataInTF = Obj.tableAppendFieldsDto; //x
              Obj.sheet.forEach((sObj: any) => sObj.isDropdownDirtyInTF = false)
              // if (i == 0) this.clickedRowDataInTF = Obj.sheet;
              // else if (i == 1) this.clickedRowDataInTF = Obj.mergeFieldListDTO;//x
              // else if (i == 2) this.clickedRowDataInTF = Obj.sheet;//x

              let colTypeDetails = res.responseData?.columnTypeDetails
              let colFormatDetails = res.responseData?.columnFormatDetails

              this.columnsArr.forEach((obj: any) => {
                columnTypeDetails.push(colTypeDetails[obj])
                columnFormatDetails.push(colFormatDetails[obj])
                let filArr = this.allDataTypeByDatatypeName.filter((x: any) => x.dataTypeName == colTypeDetails[obj])
                this.filteredColumnTypeListInTF.push(filArr[0]?.dataTypeList)
              })
              Obj.sheet.forEach((Object: any, index: number) => {
                let obje: any = {
                  newColumnName: this.columnsArr[index],
                  fieldName: this.columnsArr[index],
                  columnId: Object.columnId,
                  templateId: Object.templateId,
                  tableName: Object.tableName,
                  columnType: columnTypeDetails[index],
                }
                if (columnTypeDetails[index] == 'date' || columnTypeDetails[index] == 'datetime2') {
                  this.TargetFileArr().controls.push(this.targetFileClickedRow_DateFormat())
                  obje.dateFormat = columnFormatDetails[index]
                  this.TargetFileArr().controls[index].patchValue(obje)
                }
                else {
                  this.TargetFileArr().controls.push(this.targetFileClickedRowX_DateFormat())
                  this.TargetFileArr().controls[index].patchValue(obje)
                }

              })


            }

            console.log(this.filteredColumnTypeListInTF, 'this.filteredColumnTypeListInTF');
            // console.log('columnTypeDetails',columnTypeDetails);
            // console.log('columnFormatDetails',columnFormatDetails);

            console.log('this.clickedRowDataInTF', this.clickedRowDataInTF);
            console.log(this.targetFilePopupForm.controls);

            this.rowCount = res.responseData.count;
            //this.preview();
            // this.ESpreadPOPup = true;
            this.showTargetFilePopup = true;
          } else
            this.popup.open(false, res.statusMessage);
          // this.toast.error({ title: 'Error', message: res.statusMessage });
          this.loader.hide();
        },
        (err: any) => {
          // this.popup.open(false, 'Table not created!!');
          this.popup.open(false, err.error.statusMessage);
          // this.toast.error({ title: 'Error', message: 'Table not created!!' });
          this.loader.hide();
        }
      );
    }
  }

  hasDateFormatAt(index: number) {
    return this.TargetFileArr().controls[index].get('dateFormat') ? true : false
  }

  addDateFormatAt(index: any) {
    (<FormGroup>this.TargetFileArr().controls[index]).addControl('dateFormat', this.fb.control(null))

  }
  removeDateFormatAt(index: number) {
    (<FormGroup>this.TargetFileArr().controls[index]).removeControl('dateFormat');
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

  searchField(e: any, k: any, j: any, i: any, type: any, subtype: any) {
    let inputValue = e.target.value
    if (type == 'dataset') {
      if (subtype == 'pt') this.dataSetData[i].searchValuePT = inputValue;
      else if (subtype == 'ft')
        this.dataSetData[i].searchValueFT = inputValue;
      else if (subtype == 'pk')
        this.dataSetData[i].columns[j].searchValuePK = inputValue;
      else if (subtype == 'fk')
        this.dataSetData[i].columns[j].searchValueFK = inputValue;
    }
    else if (type == 'join') {
      if (subtype == 'pt') this.joinCheckedList[i].dropDownList[j].searchValuePT = inputValue
      else if (subtype == 'ft') this.joinCheckedList[i].dropDownList[j].searchValueFT = inputValue
      else if (subtype == 'pk') this.joinCheckedList[i].dropDownList[j].columns[k].searchValuePK = inputValue
      else if (subtype == 'fk') this.joinCheckedList[i].dropDownList[j].columns[k].searchValueFK = inputValue
    }
    else if (type == 'tf') {
      this.targetFileList[i].searchValueInTF = inputValue
    }

  }

  closeDropdown(k: any, j: any, i: any, type: any, subtype: any) {
    if (type == 'dataset') {
      if (subtype == 'pt') this.dataSetData[i].searchValuePT = '';
      else if (subtype == 'ft') this.dataSetData[i].searchValueFT = '';
      else if (subtype == 'pk')
        this.dataSetData[i].columns[j].searchValuePK = '';
      else if (subtype == 'fk')
        this.dataSetData[i].columns[j].searchValueFK = '';
    }
    else if (type == 'join') {
      if (subtype == 'pt') this.joinCheckedList[i].dropDownList[j].searchValuePT = '';
      else if (subtype == 'ft') this.joinCheckedList[i].dropDownList[j].searchValueFT = '';
      else if (subtype == 'pk') this.joinCheckedList[i].dropDownList[j].columns[k].searchValuePK = ''
      else if (subtype == 'fk') this.joinCheckedList[i].dropDownList[j].columns[k].searchValueFK = ''
    }
    else if (type == 'where') {
      if (subtype == 'column') {
        this.whereArrInDS().controls[i].get('columnSearch')?.patchValue('')
      }
      else if (subtype == 'groupBy') this.datasetTableForm.controls.groupBySearch.patchValue('')
      else if (subtype == 'orderBy') this.datasetTableForm.controls.orderBySearch.patchValue('')

    }
  }

  allDataTypeByDatatypeName: Array<any> = []
  getAllDataTypeByDatatypeName() {
    this.solService.getAllDataTypeByDatatypeName().subscribe((res: any) => {
      console.log(res);
      this.allDataTypeByDatatypeName = res.responseData
      console.log('this.allDataTypeByDatatypeName', this.allDataTypeByDatatypeName);

    })
  }

  //UFStart
  isFileSelectedInUF(e: any, element: any) {
    let chk = e.target.checked
    element.isFileSelected = chk
    element.totalSheetList.filteredData.forEach((sheetObj: any) => {
      sheetObj.sheetSelected = chk
    })
    element.totalSheetList.filteredData.map((x: any) => x.isCheckedDirtyInUF = true)
    console.log(element);

    this.masterSelectedinUploadFiles()
  }

  toggleRow(element: any) {
    // element.totalSheetList && (element.totalSheetList as MatTableDataSource<ChildElement>).data.length ? (this.expandedElement = this.expandedElement === element ? null : element) : null;
    this.changeDetectorRef.detectChanges();
    this.innerTables.forEach(
      (table: any, index: any) =>
      ((table.dataSource as MatTableDataSource<ChildElement>).sort =
        this.innerSort.toArray()[index])
    );
  }

  findReplaceAll(form: any) {
    console.log(form);
    let findAll = form.controls.findAll.value
    let replaceAll = form.controls.replaceAll.value
    let sqlScript = form.controls.sqlScript.value

    let replacedScript = sqlScript.split(findAll).join(replaceAll)
    form.controls.sqlScript.patchValue(replacedScript)
  }

  //iscreatesolutionEdit: boolean = false
  fileListtForSearch!: MatTableDataSource<any>
  getAllFileTemplateListByProcessID(item: any) { //R
    this.loader.show();
    this.fileListt = []
    this.dataSource = new MatTableDataSource()
    this.solService
      .getAllFileTemplateListByProcessID(this.process.processId)
      .subscribe(
        (res: any) => {
          this.showUploadFilesTab = true;

          const ResponseData = res.responseData.totalfileDetails;

          if (ResponseData.length == 0) this.showUploadFilesTab = false;
          else {
            //this.iscreatesolutionEdit = true
            ResponseData.forEach((fileObj: any) => {
              const sheetsSelected = fileObj.totalSheetList.map((x: any) => x.sheetSelected)
              if (sheetsSelected.includes(false)) fileObj.isFileSelected = false
              else fileObj.isFileSelected = true
              if (fileObj.fileExt == 'xlsx' || fileObj.fileExt == 'xls') {
                fileObj['File Name'] = fileObj.fileNameWithExt,
                  fileObj.Action = ['dds-icon dds-icon_delete__l__stroke']
              }
              else {
                fileObj['File Name'] = fileObj.fileNameWithExt
                fileObj.Action = ['dds-icon dds-icon_eyeopen', 'dds-icon dds-icon_delete__l__stroke']
              }
              fileObj['Uploaded On'] = this.datePipe.transform(fileObj.uploadedOn, 'dd/MM/yyyy hh:mm a'),

                fileObj.totalSheetList.forEach((sheetObj: any) => {
                  sheetObj.previewIcon = 'dds-icon dds-icon_eyeopen'
                  //sheetObj.sheetSelected = false;
                  sheetObj.isCheckedDirtyInUF = false
                  const sheetName = sheetObj.sheetName;
                  sheetObj.sheet?.forEach((columnObj: any) => {

                    columnObj.isChecked = false;
                    columnObj.tableName = sheetObj.tableName;
                    if (fileObj.fileExt == 'xlsx' || fileObj.fileExt == 'xls')
                      columnObj.showTabColName = fileObj.fileName + '-' + sheetName + '.' + fileObj.fileExt + '[' + columnObj.fieldName + ']';
                    else if (fileObj.fileExt == 'txt' || fileObj.fileExt == 'csv')
                      columnObj.showTabColName =
                        fileObj.fileNameWithExt + '[' + columnObj.fieldName + ']';
                    columnObj.fileExt = fileObj.fileExt;
                  });
                });
            });

            let arrayforSearch: Array<any> = []
            ResponseData.forEach((user: any) => {
              if (user.totalSheetList && Array.isArray(user.totalSheetList) && user.totalSheetList.length) {
                this.fileListt = [...this.fileListt, { ...user, totalSheetList: new MatTableDataSource(user.totalSheetList), },];
                arrayforSearch = [...arrayforSearch, { ...user, totalSheetList: new MatTableDataSource(user.totalSheetList), },];
              }
            });
            this.dataSource = new MatTableDataSource(this.fileListt);
            console.log('this.dataSource', this.dataSource);
            this.fileListtForSearch = new MatTableDataSource(arrayforSearch)
            this.masterSelectedinUploadFiles()
            // this.fileListt = ResponseData;
            // this.isAllSelectedUploadFiles(); //R
          }
          //this.progressBarPopup = false;
          this.loader.hide();
          this.tabtab(item)
          // this.tabsChange(item);
          // this.selectedTab = item.id

          let hasError = this.progressBar.map((x: any) => x.isError)
          if (!hasError.includes(true)) this.progressBarPopup = false
          // this.tabsChange({id:0})
        },
        (err: any) => {
          //this.progressBarPopup = false;
          this.showUploadFilesTab = false;

          this.popup.open(false, err.statusText + '!');
          //this.toast.error({ title: 'Error', message: " Failed" }) //?
          this.loader.hide();
        }
      );
  }

  // saveiputFiles(ev: any) {
  //   //R
  //   this.progressBarPopup = true;

  //   this.showUploadFilesTab = true;
  //   let processId: string = this.process.processId;
  //   const formData = new FormData();
  //   formData.append('processId', processId);
  //   let acceptedExtentions = [
  //     'xlsx',
  //     'xls',
  //     'txt',
  //     'csv',
  //     'json',
  //     'jpeg',
  //     'png',
  //     'jpg',
  //     'pdf',
  //   ];

  //   for (let i = 0; i < ev.target.files.length; i++) {
  //     const file = ev.target.files[i];
  //     if (acceptedExtentions.includes(file.name.split('.')[1])) {
  //       formData.append('file', ev.target.files[i]);
  //     }
  //   }

  //   for (let index = 0; index < ev.target.files.length; index++) {
  //     const file = ev.target.files[index];
  //     if (acceptedExtentions.includes(file.name.split('.')[1])) {
  //       // if(file.type == 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
  //       this.fileListt.push({
  //         fileNameWithExt: file.name.split('.')[0],
  //         isProgressBar: true,
  //         fileExt: file.name.split('.')[1],
  //       });
  //     }
  //   }

  //   // R
  //   this.solService.postInputFiles(formData).subscribe(
  //     (res: any) => {
  //       //     const sheetMetaData = JSON.parse(res.responseData.sheetMetaData);

  //       //     sheetMetaData.forEach((fileObj: any) => {
  //       //       // fileObj.fileExtention = fileObj.fileName.split('.').slice(1, 2).join('');
  //       //       // fileObj.fileName = fileObj.fileName.split('.').slice(0, -1).join('.');
  //       //       fileObj.totalSheetList.forEach((sheetObj: any) => {
  //       //         sheetObj.sheetSelected = false;
  //       //         const sheetName = sheetObj.sheetName;
  //       //         sheetObj.sheet?.forEach((columnObj: any) => {
  //       //           columnObj.isChecked = false;
  //       //           columnObj.tableName = sheetObj.tableName;
  //       //           //columnObj.showTabColName = fileObj.fileName + '-' + sheetName + '[' + columnObj.fieldName + ']'
  //       //           if (fileObj.fileExt == 'xlsx' || fileObj.fileExt == 'xls') columnObj.showTabColName = fileObj.fileName + '-' + sheetName + '.' + fileObj.fileExt + '[' + columnObj.fieldName + ']'
  //       //           else if (fileObj.fileExt == 'txt' || fileObj.fileExt == 'csv') columnObj.showTabColName = fileObj.fileNameWithExt + '[' + columnObj.fieldName + ']'
  //       //           columnObj.fileExt = fileObj.fileExt
  //       //         })
  //       //       })
  //       //     })
  //       //     this.fileListt = sheetMetaData;
  //       //     //console.log(this.fileListt)

  //       //   }
  //       this.getAllFileTemplateListByProcessID();
  //     },
  //     (err: any) => {
  //       this.progressBarPopup = false;

  //       this.fileListt = [];
  //       this.showUploadFilesTab = false;
  //       this.toast.error({ title: 'Error', message: 'Upload Failed' });
  //       this.loader.hide();
  //     }
  //   );
  // }
  searchFilter(event: any) {
    this.searchindusData = this.indusData.filter((user: any) => this.containsValueindustry(user, event.target.value.trim().toLowerCase()));
  }

  containsValueindustry(userObj: any, searchValue: any) {
    return Object.values(userObj).reduce((prev, cur: any) => {
      if (cur != null) {
        cur = cur.toString().trim().toLowerCase();
      }
      return prev || cur?.indexOf(searchValue) > -1;
    }, false)
  }

  saveiputFiles(ev: any, type: any) {  //R
    this.showUploadFilesTab = true;
    this.progressBar = []
    let processId: string = this.process.processId;

    let acceptedExtentions = ['xlsx', 'xls', 'txt', 'csv', 'json', 'jpeg', 'png', 'jpg', 'pdf']
    // let acceptedExtentions = ['xlsx', 'xls', 'csv', 'jpeg', 'png', 'jpg', 'pdf']
    let files: any
    if (type == 'click') files = ev.target.files
    else if (type == 'dragNDrop') files = ev.dataTransfer.files

    for (let index = 0; index < files.length; index++) {
      const file = files[index];
      if (acceptedExtentions.includes(file.name.split('.')[1])) {
        // if(file.type == 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet')
        this.fileListt.push({ fileNameWithExt: file.name.split('.')[0], isProgressBar: true, fileExt: file.name.split('.')[1] })
      }
    }

    let requestArray: Array<any> = []
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (acceptedExtentions.includes(file.name.split('.')[1])) {
        const formData = new FormData();
        formData.append('processId', processId);
        formData.append('file', files[i])
        formData.append('userId', this.userInfo.userId)
        requestArray.push(
          this.solService.postInputFiles(formData).pipe(
            tap((e: any) => {
              console.log(e);

              if (e.type === HttpEventType.UploadProgress) {
                this.progressBar[i] = { percentage: Math.round((70 / e.total) * e.loaded), file: files[i].name, isError: false, icon: false }
                console.log(this.progressBar);

              }
              if (e.type === HttpEventType.DownloadProgress) {
                this.progressBar[i] = { percentage: Math.round(100), file: files[i].name, isError: false, icon: false }
              }
            }),

            catchError((err) => {
              return of({ error: err, isError: true })
            }
            ))
        )
      }
    }

    // console.log(requestArray);


    this.progressBarPopup = true
    forkJoin(
      requestArray
    ).subscribe((response: any) => {
      console.log(response);

      this.progressBar.forEach((individual: any) => individual.percentage = 100)

      // response.forEach((object: any) => {
      response.forEach((resObj: any, i: number) => {
        this.progressBar[i].icon = true
        if (resObj.isError) this.progressBar[i].isError = resObj.isError
        else this.progressBar[i].isError = false
      })
      console.log(this.progressBar);
      // uploadComplete$.next(response);
      this.getAllFileTemplateListByProcessID({ id: 1 })

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


  closeUploadSQLPythonPopup() {
    this.enableUploadSQLPython = false
    this.uploadSQLBtn = true

  }

  uploadedManualToggle(manualOrUploadedForm: any) {
    // console.log(manualOrUploadedForm);
    // if(!manualOrUploadedForm.value.manualOrUploaded) this.enableUploadSQLPython = true
    // else this.enableUploadSQLPython = false


  }

  selectScriptTypeInUF(evt: any) {
    let val = evt.value
    this.selectedScriptTypeInUF = val
    let type = this.sqlScriptForm.controls.type.value
    if (val == 'SQL script' && type == 'S') this.uploadSQLBtn = false
    else if (val == 'Python Script' && type == 'P') this.uploadSQLBtn = false
    else this.uploadSQLBtn = true
    // if(evt.value == 'SQL script') this.isBtnClickedSQL_Python = 'S';
    // else if(evt.value == 'Python Script') this.isBtnClickedSQL_Python = 'P';

  }

  copyTableName(val: any, type: any) {
    // const selBox = document.createElement('textarea');
    // selBox.style.position = 'fixed';
    // selBox.style.left = '0';
    // selBox.style.top = '0';
    // selBox.style.opacity = '0';
    // if(type == 'child') selBox.value = val.tableName;
    // else if(type == 'parent') selBox.value = val.totalSheetList.filteredData[0].tableName
    // document.body.appendChild(selBox);
    // selBox.focus();
    // selBox.select();
    // document.execCommand('copy');
    if (type == 'child') navigator.clipboard.writeText(val.tableName)
    else if (type == 'parent') navigator.clipboard.writeText(val.totalSheetList.filteredData[0].tableName)
    // document.body.removeChild(selBox);
  }


  isAllSelectedUploadFiles(parentEle: any, childEle: any) {
    childEle.isCheckedDirtyInUF = true
    let childChkArray = parentEle.totalSheetList.filteredData.map((x: any) => x.sheetSelected)
    if (childChkArray.includes(false)) parentEle.isFileSelected = false
    else parentEle.isFileSelected = true
    console.log(parentEle, childEle);

    this.masterSelectedinUploadFiles()
  }

  private masterSelectedinUploadFiles() {
    let p = 1;
    this.fileListt.forEach((obj: any) => {
      obj.totalSheetList.filteredData.forEach((item: any) => {
        if (item.sheetSelected == false) {
          p = 0;
          return;
        }
      });
    });
    if (p == 0) this.masterSelected = false;
    else this.masterSelected = true;
    console.log(this.fileListt);

    this.nextBtnEnableInUF();
  }

  checkUncheckAllUploadFiles() {
    this.dataSource.filteredData.forEach((obj: any) => {
      obj?.totalSheetList.filteredData?.forEach((item: any) => {
        item.sheetSelected = this.masterSelected;
        item.isCheckedDirtyInUF = true
      });
      const sheetsSelected = obj.totalSheetList.filteredData.map((x: any) => x.sheetSelected)
      if (sheetsSelected.includes(false)) obj.isFileSelected = false
      else obj.isFileSelected = true
    });

    //this.nextBtnEnableInUF();
  }

  private nextBtnEnableInUF(): boolean { //UF
    const checkedSheets = this.fileListt
      .filter((element: any) =>
        element.totalSheetList?.filteredData?.some(
          (subElement: any) => subElement.sheetSelected == true
        )
      )
      .map((element: any) => {
        return Object.assign({}, element, {
          totalSheetList: element.totalSheetList.filteredData.filter(
            (subElement: any) => subElement.sheetSelected == true
          ),
        });
      });

    // if (checkedSheets.length == 0) this.isUploadFilesNextBtnEnable = true; //commented for popup
    // else this.isUploadFilesNextBtnEnable = false;
    if (checkedSheets.length == 0) return true;
    else return false;
  }

  //-UFEnd

  //TFStart

  TargetFileArr(): FormArray {
    return this.targetFilePopupForm.get('targetFileList') as FormArray;
  }

  masterCheckedInTF(e: any) {
    if (e.target.checked) {
      this.masterSelectedInTF = true

      this.targetFileList.forEach((sObj: any) => {
        // sObj.isCheckedParentDirtyInTF = true //x
        sObj.isCheckedInTF = true
        sObj.sheet.forEach((cObj: any) => {
          if (!cObj.isChecked) {
            cObj.isCheckedChildDirtyInTF = true
            cObj.isChecked = true
          }
        })
      })
    }
    else {
      this.masterCheckedFalseInTF()
    }

  }
  private masterCheckedFalseInTF() {
    this.masterSelectedInTF = false
    this.targetFileList.forEach((sObj: any) => {
      // sObj.isCheckedParentDirtyInTF = true //x
      sObj.isCheckedInTF = false
      sObj.sheet.forEach((cObj: any) => {
        if (cObj.isChecked) {
          cObj.isCheckedChildDirtyInTF = true
          cObj.isChecked = false
        }
      })
    })
  }

  checkSheetInTF(evt: any, obj: any) {
    // obj.isCheckedParentDirtyInTF = true//x
    if (evt.target.checked) {
      obj.sheet.forEach((_obj: any) => {
        if (!_obj.isChecked) {
          _obj.isCheckedChildDirtyInTF = true
          _obj.isChecked = true
        }
      })
    }
    else {
      obj.sheet.forEach((sobj: any) => {
        if (sobj.isChecked) {
          sobj.isCheckedChildDirtyInTF = true
          sobj.isChecked = false
        }
      })
    }
    this.masterChkInTF()
  }


  checkColumnInTF(evt: any, obj: any, i: number) {
    console.log(evt, obj)
    obj.isCheckedChildDirtyInTF = true
    let chkdColumnList = this.targetFileList[i].sheet.map((x: any) => x.isChecked)
    this.targetFileList[i].isCheckedInTF = (chkdColumnList.includes(false)) ? false : true

    this.masterChkInTF()
  }
  masterChkInTF() {
    let chkdSheetList = this.targetFileList.map((x: any) => x.isCheckedInTF)
    this.masterSelectedInTF = (chkdSheetList.includes(false)) ? false : true
  }

  clickedRowDataInTF: any[] = []; //x
  fileTypeInTF: string = '';
  ESpreadPOPup: any;
  fileClickedinTF(j: number, i: number, Obj: any, fileType: any, name: any) {

    console.log(Obj, fileType, name);
    this.sourceFilesAppendJoinFileList.forEach((obj: any) => { //x
      obj.sheetList.forEach((childObj: any) => {
        childObj.isRowTabAvtive = false;
      });
    });
    Obj.isRowTabAvtive = true; //x

    // Obj.sheet.forEach((sheetObj: any) => {
    //   sheetObj.isColumnEditInTF = false
    //   sheetObj.selectedDateFormat = ''  //date format shd come from db
    //   if (sheetObj.columnType == 'date' || sheetObj.columnType == 'datetime2') {
    //     sheetObj.isDataTypeIsDate = true
    //     sheetObj.dateFormatList = this.dateFormatInTF
    //   } else {
    //     sheetObj.isDataTypeIsDate = false // duplicate in selectDropDownInTF()
    //     sheetObj.dateFormatList = []
    //   }
    // })


    this.fileTypeInTF = fileType; //x
    this.targetFilePopupForm.controls.targetFileList = this.formBuilder.array([])
    this.viewTableDetails(name, i, Obj, 'table')

    // if (name != '') {
    //   this.loader.show();
    //   this.solService.viewTableDetails(name).subscribe(
    //     (res: any) => {
    //       if (res.responseData != null) {
    //         this.selectedM_A_S = res.responseData.tableDetails;
    //         this.rowCount = res.responseData.count;
    //         this.preview();
    //         this.showTargetFilePopup = true;
    //         // this.ESpreadPOPup = true;
    //       } else
    //         this.toast.error({ title: 'Error', message: res.statusMessage });
    //       this.loader.hide();
    //     },
    //     (err: any) => {
    //       this.toast.error({ title: 'Error', message: 'Table not created!!' });
    //       this.loader.hide();
    //     }
    //   );
    //   // this.ESpreadPOPup=true;

    //   console.log('this.clickedRowDataInTF ', this.clickedRowDataInTF);

    // }
  }
  closeESSPopup() {
    this.showTargetFilePopup = false;
  }

  editColumnInTargetFiles(obj: any) {
    obj.isColumnEditInTF = (obj.isColumnEditInTF) ? false : true
    // if(obj.isColumnEditInTF){
    //   obj.isColumnEditInTF = false
    // }
    // else if(!obj.isColumnEditInTF){
    //   obj.isColumnEditInTF = true

    // }
    obj.isColumnEditInTFDirty = true
    console.log(obj);

  }

  append_SourceFilesList: Array<any> = [];
  sourceFilesAppendJoinFileListForJoin: Array<any> = []
  getTargetFileList(item: any) { //get in TF
    this.createExpressionList = []; //clearing CE,DS list
    this.datasetDetailsList = []

    this.sourceFilesAppendJoinFileList = [];
    this.sourceFilesAppendJoinFileListForJoin = []
    this.loader.show();
    this.solService.getTargetFileList(this.process.processId).subscribe(
      (res: any) => {
        // res.responseData.appendSheetListDto?.appendSheetList.forEach(
        //   (appObj: any) => {
        //     appObj.tableNameUI = appObj.appendName;
        //     appObj.isSelectAllParentInDM = false; //DM
        //     appObj.tableAppendFieldsDto.forEach((colObj: any) => {
        //       colObj.isSelectAllChildInDM = false; //DM
        //       (colObj.fileType = appObj.type),
        //         (colObj.showTabColName =
        //           appObj.appendName + '[' + colObj.fieldName + ']');
        //       colObj.isDropdownDirtyInTF = false;
        //     });
        //   }
        // );
        this.process.powerBiDatasetExists = res.responseData.powerBiDatasetExists //override, service_desktop condition
        let apdResponse = this.appendResponse(res?.responseData.appendSheetListDto?.appendSheetList)


        res.responseData.templateMergeListDTO?.templatesMergeDetailsList.forEach(
          (joinObj: any) => {
            joinObj.tableNameUI = joinObj.mergeName
            joinObj.searchValueInCreateDatasetPopup = '' //DM
            joinObj.searchValueInColumnPopup = '' //DM
            joinObj.isSelectAllParentInDM = false; //DM
            joinObj.mergeFieldListDTO.forEach((colObj: any) => {
              colObj.isSelectAllChildInDM = false; // DM
              colObj.showTabColName =
                joinObj.mergeName + '[' + colObj.fieldName + ']';
              colObj.isDropdownDirtyInTF = false;
            });
          }
        );

        // let fileResponse =
        //   res.responseData.templateFileDetailsListDto?.totalfileDetails;
        // fileResponse.forEach((fileObj: any) => {
        //   fileObj.totalSheetList.forEach((sheetObj: any) => {
        //     const sheetName = sheetObj.sheetName;
        //     sheetObj.sheet?.forEach((columnObj: any) => {
        //       columnObj.tableName = sheetObj.tableName;
        //       //columnObj.isCheckboxDirty = false
        //       columnObj.isDropdownDirtyInTF = false;
        //       columnObj.type = 'template';
        //       if (fileObj.fileExt == 'xlsx' || fileObj.fileExt == 'xls')
        //         columnObj.showTabColName =
        //           fileObj.fileName +
        //           '-' +
        //           sheetName +
        //           '.' +
        //           fileObj.fileExt +
        //           '[' +
        //           columnObj.fieldName +
        //           ']';
        //       else if (fileObj.fileExt == 'txt' || fileObj.fileExt == 'csv')
        //         columnObj.showTabColName =
        //           fileObj.fileNameWithExt + '[' + columnObj.fieldName + ']';
        //       else if (fileObj.fileExt == 'json')
        //         columnObj.showTabColName =
        //           fileObj.fileNameWithExt + '[' + columnObj.fieldName + ']';
        //       columnObj.fileExt = fileObj.fileExt;
        //     });
        //   });
        // });

        // const filesheetList: any[] = [];
        // fileResponse.forEach((fileObj: any) => {
        //   fileObj.isSelectAllParentInDM = false; //DM

        //   fileObj.totalSheetList.forEach((sheetObj: any) => {
        //     if (sheetObj.sheetSelected) {
        //       sheetObj.sheet?.forEach((columnObj: any) => {
        //         columnObj.isSelectAllChildInDM = false; //DM
        //       });
        //       sheetObj.type = 'template';
        //       if (sheetObj.sheet != null) {
        //         if (sheetObj.fileExt == 'xlsx' || sheetObj.fileExt == 'xls')
        //           filesheetList.push({
        //             fileExt: sheetObj.fileExt,
        //             fileName:
        //               fileObj.fileName +
        //               '-' +
        //               sheetObj.sheetName +
        //               '.' +
        //               fileObj.fileExt,
        //             ...sheetObj,
        //             isCheckedInAppend: false,
        //             isCheckedInJoin: false,
        //             type: 'files',
        //             tableNameUI:
        //               fileObj.fileName +
        //               '-' +
        //               sheetObj.sheetName +
        //               '.' +
        //               fileObj.fileExt,
        //           });
        //         else if (sheetObj.fileExt == 'csv' || sheetObj.fileExt == 'txt')
        //           filesheetList.push({
        //             fileExt: sheetObj.fileExt,
        //             fileName: fileObj.fileNameWithExt,
        //             ...sheetObj,
        //             isCheckedInAppend: false,
        //             isCheckedInJoin: false,
        //             type: 'files',
        //             tableNameUI: fileObj.fileNameWithExt,
        //           });
        //         else if (sheetObj.fileExt == 'json')
        //           filesheetList.push({
        //             fileExt: sheetObj.fileExt,
        //             fileName: fileObj.fileNameWithExt,
        //             ...sheetObj,
        //             isCheckedInAppend: false,
        //             isCheckedInJoin: false,
        //             type: 'files',
        //             tableNameUI: fileObj.fileNameWithExt,
        //           });
        //       }
        //     }
        //   });
        // });


        let filesheetList = this.totalfileDetails(res?.responseData?.templateFileDetailsListDto?.totalfileDetails, item)
        let filesheetListForJoin = this.totalfileDetails(res?.responseData?.templateFileDetailsListDto?.totalfileDetails, { id: 4 }) //4 means Join



        this.sourceFilesAppendJoinFileList = [
          {
            fileType: 'append',
            sheetList: apdResponse,
          },
          {
            fileType: 'join',
            sheetList: res.responseData.templateMergeListDTO?.templatesMergeDetailsList,
          },
          { fileType: 'files', sheetList: filesheetList },
        ];
        this.sourceFilesAppendJoinFileListForJoin = [
          {
            fileType: 'append',
            sheetList: apdResponse,
          },
          {
            fileType: 'join',
            sheetList: res.responseData.templateMergeListDTO?.templatesMergeDetailsList,
          },
          { fileType: 'files', sheetList: filesheetListForJoin },
        ];


        console.log(this.sourceFilesAppendJoinFileList, 'this.sourceFilesAppendJoinFileList');
        this.sourceFilesAppendJoinFileList2 = JSON.parse(JSON.stringify(this.sourceFilesAppendJoinFileList))
        this.sourceFilesAppendJoinFileListForSearch = JSON.parse(JSON.stringify(this.sourceFilesAppendJoinFileList))
        //this.sourceFilesList = filesheetList; //need to call after TF

        //in Join
        //tableNameUI,

        // this.append_SourceFilesList = []
        // res.responseData.appendSheetListDto?.appendSheetList.forEach((_appendObj: any) => this.append_SourceFilesList.push(_appendObj))
        // filesheetList.forEach((_sheetObj: any) => this.append_SourceFilesList.push(_sheetObj))
        // console.log('this.append_SourceFilesList', this.append_SourceFilesList);

        this.allList(item); //shd call only in changetabs(4)//DM
        this.loader.hide();
      },
      (err: any) => {
        this.loader.hide();
      }
    );
  }

  selectDropDownInTF(e: any, rowObj: any, index: number) {
    if (e.value == 'date' || e.value == 'datetime2') {
      this.addDateFormatAt(index)
      let dateFormatArrOfVal = this.TargetFileArr().controls.filter((x: any) => x.controls.dateFormat).map((y: any) => y.controls.dateFormat.value)
      let xNullValues = dateFormatArrOfVal.filter((x: any) => !!x)
      rowObj.controls.dateFormat.patchValue(xNullValues?.[0])
    }
    else {
      this.removeDateFormatAt(index)
    }


    console.log(rowObj);
  }


  selectDateFormatDropDownInTF(evt: any, rowObj: any, index: number) {
    this.TargetFileArr().controls.forEach((ele: any) => {
      if (ele.controls.dateFormat) ele.controls.dateFormat.patchValue(evt.value)
    })
  }
  //-TFEnd

  //AStart
  sortDataFilter(list: any[], direction: any, key: any) {
    list.sort(function (a, b) {
      if (a[key] < b[key]) {
        return -1 * direction;
      }
      else if (a[key] > b[key]) {
        return 1 * direction;
      }
      else {
        return 0;
      }
    });
  }
  sortData(e: any, type: any, subType: any) {
    console.log(e, type, subType);
    let direction = (e.direction == 'asc') ? 1 : -1;
    let key = e.active
    if (type == 'append') {
      if (subType == 'AF') this.sortDataFilter(this.getAppendFilesList, direction, key)
      else if (subType == 'SF') this.sortDataFilter(this.sourceFilesList, direction, key)
    }

  }
  appendList: any[] = []; //get all appendlist
  sourceFilesList: any[] = [];
  isCheckedInAppend(e: any) {
    //append
    this.submitted = false;
    this.submittedErrorMsg = '';
  }

  addAppend() {
    console.log('this.sourceFilesList', this.sourceFilesList);
    let checkedList = this.sourceFilesList.filter(
      (x: any) => x.isCheckedInAppend
    );
    console.log(checkedList);

    if (checkedList.length < 2) {
      // this.submitted = true;
      // this.popup.open(false, 'Ensure that the files with identical columns are selected for appending')
      this.popup.open(false, 'Please select atleast two tables for appending !')
      // this.submittedErrorMsg =
      //   'Ensure that the files with identical columns are selected for appending';
      return;
    }

    let checkedListtt = this.sourceFilesList.filter(
      (x: any) => x.isCheckedInAppend
    );
    checkedListtt.forEach((_obj: any) => {
      _obj.sheet.forEach((obj: any) => {
        obj.fieldNameColumnType = obj.fieldName.trim() + '.' + obj.columnType
      })
    })

    let arrOfAr: Array<any> = []
    arrOfAr = checkedListtt.map((x: any) => x.sheet.map((y: any) => { return y.fieldName.trim() + '.' + y.columnType }))

    let arrOfArr = checkedListtt.map((x: any) => x.sheet.map((y: any) => y.fieldName.trim() + '.' + y.columnType))

    console.log(arrOfAr)
    console.log(this.findCommon(arrOfArr));
    let duplicateValues: any = this.findCommon(arrOfArr)

    this.unique = []
    // if(duplicateValues.length != 0){
    checkedListtt.forEach((arr: any, i: number) => {
      let checkedObj: Array<any> = []
      arr.sheet.forEach((value: any, j: number) => {
        if (!duplicateValues?.includes(value.fieldNameColumnType)) checkedObj.push(value.fieldNameColumnType)
      })
      if (checkedObj.length != 0) this.unique.push(arr.tableNameUI + ':' + checkedObj + '\n')
    })
    // }
    console.log('Mismatch ', checkedListtt)

    console.log(this.unique)
    if (this.unique.length != 0) this.enableAppendDatasetError = true
    else this.enableAppendNamePopup = true;

    // let k = 0;
    // let checkedSheetColumns: Array<any> = [];
    // checkedList.forEach((obj: any) => {
    //   if (checkedSheetColumns.length == 0) {
    //     checkedSheetColumns = obj.sheet.map((x: any) => x.fieldName);
    //   } else {
    //     let columnsList: Array<any> = [];
    //     columnsList = obj.sheet.map((x: any) => x.fieldName);
    //     checkedSheetColumns.forEach((colNames: any) => {
    //       if (!columnsList.includes(colNames)) {
    //         // k = 1;
    //         return;
    //       }
    //     });
    //   }
    // });
    // if (k == 1) {
    //   this.submitted = true;
    //   this.popup.open(false, 'Ensure that the files with identical columns are selected for appending')

    //   // this.submittedErrorMsg =
    //   //   'Ensure that the files with identical columns are selected for appending';
    //   return;
    // }

    this.appendForm.reset();
  }

  isTableExistAppend(e: any) {
    this.submited1 = false; //DS
    this.submited = false; //join
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
    this.loader.show();
    this.solService.getExistDataset(name, type).subscribe(
      (res: any) => {
        this.loader.hide();
        this.enableAddBtn = false;
        this.submited1 = false;
        this.submittedErrorMsg = '';
        this.appendForm.controls['appendNameControl'].setValidators([]);
        this.appendForm.controls['appendNameControl'].updateValueAndValidity();
        this.enableAppendNamePopup = false;
        this.postAddAppendFiles(name);

        console.log(res);
      },
      (err: any) => {
        this.loader.hide();
        this.progressBarPopup = false
        this.enableAddBtn = false;
        this.submited1 = true;
        this.submittedErrorMsg = 'Append Name Already Exist!!!';
        this.appendForm.controls['appendNameControl'].setValidators([
          Validators.required,
        ]);
        this.appendForm.controls['appendNameControl'].updateValueAndValidity();
      }
    );
  }

  addAppendApi() {
    this.enableAddBtn = true;
    let _appendName = this.appendForm.get('appendNameControl')?.value;

    this.submited1 = true;
    console.log(this.appendForm);
    if (this.appendForm.invalid) {
      //shd check
      return;
    }

    this.isTableExist(_appendName, 'append');
  }

  progressBar: Array<any> = [];
  postAddAppendFiles(_appendName: any) {
    this.progressBarPopup = true
    this.progressBar = []
    let appendDtos: Array<any> = [];
    this.sourceFilesList.forEach((colObj: any) => {
      if (colObj.isCheckedInAppend)
        appendDtos.push({
          sheetId: colObj.templateId,
          fileName: colObj.fileName,
        });
    });

    let appendObj: any = {
      processId: this.process.processId,
      userId: this.userInfo.userId,
      appendSheetList: [{ appendDtos, appendName: _appendName }],
    };

    this.solService.addAppendFiles(appendObj).subscribe(
      (res: any) => {
        if (res.type == HttpEventType.UploadProgress) {
          this.progressBar = [{ percentage: Math.round((70 / res.total) * res.loaded) }];

          // this.enableAppendNamePopup = false;
          // this.toast.success({
          //   title: 'Success',
          //   message: 'Saved Successfully !',
          // });
          this.progressBarPopup = false

        } else if (res.type == HttpEventType.Response) {
          this.progressBar = [];
          this.getAppendFilesApi(); // get append list
          this.appendForm.reset();
          this.sourceFilesList.forEach(
            (fileObj: any) => (fileObj.isCheckedInAppend = false)
          );
          this.popup.open(true, 'Saved Successfully !');
        }

        this.loader.hide();
      },
      (err: any) => {
        this.progressBarPopup = false
        this.popup.open(false, err.error.responseData + '!');
        this.loader.hide();
      }
    );
  }

  enableViewScriptPopup: boolean = false;

  //-AEnd

  //JStart
  Merg(): FormGroup {
    //join
    return this.formBuilder.group({
      tableControl: this.formBuilder.array([]),
    });
  }
  addTable(): FormGroup {
    //join
    return this.formBuilder.group({
      table1: ['', Validators.required],
      join: ['', Validators.required],
      table2: ['', Validators.required],
      column: this.formBuilder.array([]),
    });
  }
  addColumn(): FormGroup {
    //join
    return this.formBuilder.group({
      column1: ['', Validators.required],
      column2: ['', Validators.required],
    });
  }

  MergeArr(): FormArray {
    //join
    return this.joinSetForm.get('Merg') as FormArray;
  }

  TableArr(i: any): FormArray {
    //join
    return this.MergeArr().controls[i].get('tableControl') as FormArray;
  }

  columnArr(i: any, j: any): FormArray {
    return this.TableArr(i).controls[j].get('column') as FormArray;
  }

  addMergeJoin() {
    //join
    this.MergeArr().push(this.Merg());
    let len = this.MergeArr().length;
    this.TableArr(len - 1).push(this.addTable());
    let j = this.TableArr(len - 1).length;
    this.columnArr(len - 1, j - 1).push(this.addColumn());
  }

  addTableJoins(i: any, j: any) {//join()

    let ddlLength = this.joinCheckedList[i].dropDownList.length;
    let TabArrlen = this.TableArr(i).length;

    if (
      this.joinCheckedList[i].dropDownList[ddlLength - 1].foreignTableList
        .length == 0
    )
      return;
    if (
      this.TableArr(i).controls[TabArrlen - 1].get('table1')?.value == '' ||
      this.TableArr(i).controls[TabArrlen - 1].get('table2')?.value == ''
    )
      return;

    this.TableArr(i).push(this.addTable());
    let len = this.TableArr(i).length;
    this.columnArr(i, len - 1).push(this.addColumn());
    console.log(this.joinCheckedList[i]?.dropDownList);
  }

  addColumnJoin(i: any, j: any) {
    //column add
    let colArrLength = this.columnArr(i, j).controls.length;
    if (
      this.columnArr(i, j).controls[colArrLength - 1].get('column1')?.value ==
      '' ||
      this.columnArr(i, j).controls[colArrLength - 1].get('column2')?.value ==
      ''
    )
      return;

    if (
      this.joinCheckedList[i].dropDownList[j].columns[colArrLength]
        .primaryKeyList.length == 0 ||
      this.joinCheckedList[i].dropDownList[j].columns[colArrLength]
        .foreignKeyList.length == 0
    )
      return;
    this.columnArr(i, j).push(this.addColumn());
  }

  removeCol(i: any, j: any, k: any) {
    //join
    for (
      let z = k;
      z <= this.joinCheckedList[i].dropDownList[j].columns.length;
      z++
    ) {
      this.columnArr(i, j).removeAt(z);
    }
    this.joinCheckedList[i].dropDownList[j].columns.splice(
      k + 1,
      this.joinCheckedList[i].dropDownList[j].columns.length
    );
  }
  removeTable(i: any, j: any) {
    //join
    // let len=this.TableArr(i).controls.length
    console.log('removeTable()', i, j);

    for (let k = j; k <= this.joinCheckedList[i].dropDownList.length; k++) {
      this.TableArr(i).removeAt(j);
    }
    this.joinCheckedList[i].dropDownList.splice(
      j + 1,
      this.joinCheckedList[i].dropDownList.length
    );

    console.log(this.joinCheckedList[i].dropDownList);
  }
  resetJoin() {
    this.joinCheckedList = [];
    this.append_SourceFilesList.forEach(
      (tableObj: any) => (tableObj.isCheckedInJoin = false)
    );
  }

  saveJoin() { }

  MergeSubmit() {
    //join
    this.progressBarPopup = true
    this.progressBar = []
    this.submitedJ = true;
    let d = 0;
    this.MergeArr().controls.forEach((merObj: any, i: number) => {
      this.TableArr(i).controls.forEach((tableObj: any) => {
        if (tableObj.invalid) d = 1;
      });
    });
    if (d == 1) {
      this.popup.open(false, 'Enter all the required fields');
      // this.toast.error({
      //   title: 'Error',
      //   message: 'Enter all the required fields',
      // });
      return;
    }

    // this.loader.show()
    console.log(this.joinSetForm.value, this.process.processId);
    let data: any = {};
    data.processId = this.process.processId;
    data.userId = this.userInfo.userId,
      data.templatesMergeDetailsList = [];

    let selectedTables: Array<any> = [];
    this.MergeArr().controls.forEach((ele: any, i: any) => {
      data.templatesMergeDetailsList[i] = {};

      data.templatesMergeDetailsList[i].mergeName = this.joinForm.get('appendNameControl')?.value
      //this.joinCheckedList[i].joinName;
      data.templatesMergeDetailsList[i].templatesMergeList = [];
      data.templatesMergeDetailsList[i].mergeTableDetails = [];

      selectedTables = [];
      ele.controls.tableControl.controls.forEach(
        (tabControl: any, index: number) => {
          if (tabControl.controls.table1) {
            selectedTables.push(tabControl.controls.table1.value);
          }
          if (tabControl.controls.table2) {
            selectedTables.push(tabControl.controls.table2.value);
          }
        }
      );

      // console.log('selectedTables', selectedTables);
      // console.log('selectedTableNames', selectedTableNames);
      selectedTables = [...new Set(selectedTables)];
      selectedTables.forEach((tabObj: any, j: number) => {
        //new change
        //this.joinCheckedList[i].dropDownList[0].primaryTableList.forEach((merObj: any, j: number) => {
        data.templatesMergeDetailsList[i].mergeTableDetails[j] = {};
        if (tabObj.type == 'template') {
          data.templatesMergeDetailsList[i].mergeTableDetails[j].id =
            tabObj.templateId;
          data.templatesMergeDetailsList[i].mergeTableDetails[j].type = 'T';
        } else if (tabObj.type == 'Append') {
          data.templatesMergeDetailsList[i].mergeTableDetails[j].id =
            tabObj.appendID;
          data.templatesMergeDetailsList[i].mergeTableDetails[j].type = 'A';
        }
        //})
      });

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
        data.templatesMergeDetailsList[i].templatesMergeList[j] = {};
        if (elem.value.table1.type == 'Append')
          data.templatesMergeDetailsList[i].templatesMergeList[
            j
          ].primaryTemplateId = elem.value.table1.appendID;
        if (elem.value.table2.type == 'Append')
          data.templatesMergeDetailsList[i].templatesMergeList[
            j
          ].secondaryTemplateId = elem.value.table2.appendID;
        if (elem.value.table1.type == 'template')
          data.templatesMergeDetailsList[i].templatesMergeList[
            j
          ].primaryTemplateId = elem.value.table1.templateId;
        if (elem.value.table2.type == 'template')
          data.templatesMergeDetailsList[i].templatesMergeList[
            j
          ].secondaryTemplateId = elem.value.table2.templateId;

        data.templatesMergeDetailsList[i].templatesMergeList[
          j
        ].primaryTableName = elem.value.table1.tableNameDB;
        data.templatesMergeDetailsList[i].templatesMergeList[
          j
        ].secondaryTableName = elem.value.table2.tableNameDB;

        data.templatesMergeDetailsList[i].templatesMergeList[j].joinType =
          elem.value.join[0];

        data.templatesMergeDetailsList[i].templatesMergeList[j].order =
          j == 0 ? 1 : 2;
        data.templatesMergeDetailsList[i].templatesMergeList[
          j
        ].columnArrayList = [];
        this.columnArr(i, j).controls.forEach((element: any, k: any) => {
          data.templatesMergeDetailsList[i].templatesMergeList[
            j
          ].columnArrayList[k] = {};

          // console.log(element);

          if (element.value.column1.fileType == 'append')
            data.templatesMergeDetailsList[i].templatesMergeList[
              j
            ].columnArrayList[k].primaryKeyId = element.value.column1.fieldID;
          if (element.value.column2.fileType == 'append')
            data.templatesMergeDetailsList[i].templatesMergeList[
              j
            ].columnArrayList[k].secondaryKeyId = element.value.column2.fieldID;

          if (element.value.column1.type == 'template')
            data.templatesMergeDetailsList[i].templatesMergeList[
              j
            ].columnArrayList[k].primaryKeyId = element.value.column1.columnId;
          if (element.value.column2.type == 'template')
            data.templatesMergeDetailsList[i].templatesMergeList[
              j
            ].columnArrayList[k].secondaryKeyId =
              element.value.column2.columnId;

          data.templatesMergeDetailsList[i].templatesMergeList[
            j
          ].columnArrayList[k].primaryFieldName =
            element.value.column1.columnName;
          data.templatesMergeDetailsList[i].templatesMergeList[
            j
          ].columnArrayList[k].secondaryFieldName =
            element.value.column2.columnName;
        });
      });
    });
    console.log(data);
    this.progressBarPopup = true

    this.solService.addJoinFiles(data).subscribe(
      (res: any) => {
        if (res.type == HttpEventType.UploadProgress) {
          this.progressBar = [{ percentage: Math.round((70 / res.total) * res.loaded) }];
        } else if (res.type == HttpEventType.Response) {
          this.progressBar = [];
          this.getJoinFilesListApi(); // get join files
          this.popup.open(true, 'Saved Successfully !');
        }
        console.log(res);

        this.joinCancelBtn()
        // this.enableMergeNamePopup = false

        // this.joinCheckedList = [];
        // //this.joinSetForm.reset()
        // this.joinSetForm.controls.Merg = this.fb.array([]);


        // this.toast.success({
        //   title: 'Success',
        //   message: 'Saved Successfully !',
        // });
        this.loader.hide();
        this.progressBarPopup = false

      },
      (err: any) => {
        this.popup.open(false, 'Join Save failed !');
        this.progressBarPopup = false
        this.loader.hide();
      }
    );
  }

  join2Sheets() {
    //join
    this.submitedJ = false;
    let checkedList = this.append_SourceFilesList.filter(
      (x) => x.isCheckedInJoin
    );
    if (checkedList.length < 2) {
      this.submitted = true;
      this.submittedErrorMsg = 'Please select atleast two sheets';
      return;
    }
    this.enableMergeNamePopup = true;
    this.joinForm.get('appendNameControl')?.reset();
  }


  joinSheets() {
    let checkedList = this.append_SourceFilesList.filter((x) => x.isCheckedInJoin);
    if (checkedList.length < 2) {
      // this.submitted = true
      // this.submittedErrorMsg = 'please select atleast 2 tables for join'
      this.popup.open(false, 'Please select atleast 2 tables for join')
      return;
    }
    this.addMergeJoin();
    const primaryTableList: Array<any> = [];
    const foreignTableList: Array<any> = [];
    checkedList.forEach((tabObj: any) => {
      if (tabObj.type == 'Append') {
        primaryTableList.push({
          tableNameUI: tabObj.tableNameUI,
          tableNameDB: tabObj.tableName,
          sheet: tabObj.tableAppendFieldsDto,
          isSelected: false,
          type: 'Append',
          appendID: tabObj.appendID,
        });
      } else if (tabObj.type == 'files') {
        primaryTableList.push({
          tableNameUI: tabObj.tableNameUI,
          tableNameDB: tabObj.tableName,
          sheet: tabObj.sheet,
          isSelected: false,
          fileExt: tabObj.fileExt,
          type: 'template',
          templateId: tabObj.templateId,
        });
      }
    });
    let joinObj = {
      dropDownList: [
        {
          searchValuePT: '',
          searchValueFT: '',
          primaryTableList,
          foreignTableList,
          columns: [{ primaryKeyList: [], foreignKeyList: [] }],
        },
      ],
      // joinName: joinName,
      //joinName: '',
    };
    this.joinCheckedList.push(joinObj);

    console.log(this.joinCheckedList);
    this.append_SourceFilesList.forEach((tableObj: any) => (tableObj.isCheckedInJoin = false));
    this.enableMergeNamePopup = true
  }

  joinCancelBtn() {
    this.joinForm.reset()
    //this.joinSetForm.reset()
    this.submitedJ = false
    this.enableMergeNamePopup = false
    this.joinCheckedList = []
    this.joinSetForm.controls.Merg = this.formBuilder.array([])
  }


  joinCheckedList: Array<any> = [];
  addJoin() {
    let joinName = this.joinForm.get('appendNameControl')?.value;
    console.log(this.joinForm);
    if (this.joinForm.invalid) {
      this.submited = true;
      this.submittedErrorMsg = 'Join Name should not be empty !!'
      return;
    }

    this.loader.show();
    this.solService.getExistDataset(joinName, 'merge').subscribe(
      (res: any) => {
        this.loader.hide();
        this.submited = false;
        this.submittedErrorMsg = '';
        this.enableMergeNamePopup = false

        this.MergeSubmit()
        //this.addJoinCreate(joinName);
        console.log(res);
      },
      (err: any) => {
        this.loader.hide();
        this.submited = true;
        this.submittedErrorMsg = 'Join Name Already Exist!!!';
      }
    );
  }

  addJoinCreate(joinName: any) {
    this.addMergeJoin();
    let checkedList = this.append_SourceFilesList.filter(
      (x) => x.isCheckedInJoin
    );
    const primaryTableList: Array<any> = [];
    const foreignTableList: Array<any> = [];
    checkedList.forEach((tabObj: any) => {
      if (tabObj.type == 'Append') {
        primaryTableList.push({
          tableNameUI: tabObj.tableNameUI,
          tableNameDB: tabObj.tableName,
          sheet: tabObj.tableAppendFieldsDto,
          isSelected: false,
          type: 'Append',
          appendID: tabObj.appendID,
        });
      } else if (tabObj.type == 'files') {
        primaryTableList.push({
          tableNameUI: tabObj.tableNameUI,
          tableNameDB: tabObj.tableName,
          sheet: tabObj.sheet,
          isSelected: false,
          fileExt: tabObj.fileExt,
          type: 'template',
          templateId: tabObj.templateId,
        });
      }
    });
    let joinObj = {
      dropDownList: [
        {
          primaryTableList,
          foreignTableList,
          columns: [{ primaryKeyList: [], foreignKeyList: [] }],
        },
      ],
      joinName: joinName,
    };
    this.joinCheckedList.push(joinObj);

    console.log(this.joinCheckedList);
    this.append_SourceFilesList.forEach(
      (tableObj: any) => (tableObj.isCheckedInJoin = false)
    );
    this.enableMergeNamePopup = false;
  }

  submitedJ: boolean = false;
  checkedInJoin(e: any) { //join
    this.submitted = false;
    this.submittedErrorMsg = '';
  }

  selectPrimaryTable(e: any, j: number, i: number) {
    //join
    const value = e.value.value;
    let ddl = this.joinCheckedList[i].dropDownList[j];
    // console.log(item,j,i);
    ddl.columns[0].primaryKeyList = e.value.sheet; //childArr

    this.removeTable(i, j + 1); //2 if want to show next row,but for without values null formCs
    this.joinCheckedList[i].dropDownList.splice(
      j + 1,
      this.joinCheckedList[i].dropDownList.length
    );

    this.removeCol(i, j, 1);
    this.joinCheckedList[i].dropDownList[j].columns.splice(
      2,
      this.joinCheckedList[i].dropDownList[j].columns.length
    );

    this.TableArr(i).controls[j].get('table2')?.reset();
    this.TableArr(i).controls[j].get('column')?.reset();

    this.joinCheckedList[i].dropDownList[j].columns.forEach((column: any) => {
      column.searchValuePK = '';
      column.searchValueFK = '';
    });

    if (j == 0) {
      // ddl.primaryTableList.forEach((priTab: any) => JSON.parse(JSON.stringify(priTab)).isSelected = false)
      // e.value.isSelected = true;
      // ddl.foreignTableList = ddl.primaryTableList.filter((x: any) => !x.isSelected)
      let selectedPT =
        this.TableArr(i).controls[j].get('table1')?.value.tableNameDB;

      ddl.foreignTableList = [];
      this.joinCheckedList[i].dropDownList[0].primaryTableList.forEach(
        (element: any) => {
          if (!selectedPT.includes(element.tableNameDB)) {
            ddl.foreignTableList.push(element);
          }
        }
      );
    } else {
    }

    console.log(this.joinCheckedList[i]?.dropDownList[j]);
  }

  selectForeignTable(e: any, j: number, i: number) {
    //join
    //const value = e.value.value;
    let ddl = this.joinCheckedList[i].dropDownList[j];
    //if (ddl.foreignTableList.length == 1) return
    // this.joinCheckedList[i].dropDownList[j].foreignTableList.forEach((priTab: any) => JSON.parse(JSON.stringify(priTab)).isSelected = false)
    // e.value.isSelected = true;
    console.log('selectForeignTable()', i, j);

    this.removeTable(i, j + 1); //2 if want to show next row,but for without values null formCs
    this.joinCheckedList[i].dropDownList.splice(
      j + 1,
      this.joinCheckedList[i].dropDownList.length
    );

    this.removeCol(i, j, 1);
    this.joinCheckedList[i].dropDownList[j].columns.splice(
      2,
      this.joinCheckedList[i].dropDownList[j].columns.length
    );

    ddl.columns[0].foreignKeyList = e.value.sheet; //childArr
    let ptl: Array<any> = [];
    let ftl: Array<any> = [];
    if (j == 0) {
      ptl.push(this.TableArr(i).controls[j].get('table1')?.value);
      ptl.push(this.TableArr(i).controls[j].get('table2')?.value);

      let selectedPTFT = ptl.map((x: any) => x.tableNameDB);

      this.joinCheckedList[i].dropDownList[0].primaryTableList.forEach(
        (element: any) => {
          if (!selectedPTFT.includes(element.tableNameDB)) {
            ftl.push(element);
          }
        }
      );

      this.joinCheckedList[i].dropDownList[j + 1] = {
        searchValuePT: '',
        searchValueFT: '',
        primaryTableList: ptl,
        foreignTableList: ftl,
        columns: [{ primaryKeyList: [], foreignKeyList: [] }],
      };
    } else {
      ddl.primaryTableList.forEach((element: any) => {
        ptl.push(element);
      });
      ptl.push(this.TableArr(i).controls[j].get('table2')?.value);

      let selectedPTFT = ptl.map((x: any) => x.tableNameDB);

      this.joinCheckedList[i].dropDownList[0].primaryTableList.forEach(
        (element: any) => {
          if (!selectedPTFT.includes(element.tableNameDB)) {
            ftl.push(element);
          }
        }
      );

      this.joinCheckedList[i].dropDownList[j + 1] = {
        searchValuePT: '',
        searchValueFT: '',
        primaryTableList: ptl,
        foreignTableList: ftl,
        columns: [{ primaryKeyList: [], foreignKeyList: [] }],
      };
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

  selectPrimarykey(e: any, k: number, j: any, i: any) {
    //join
    const value = e.value;

    this.joinCheckedList[i].dropDownList[j].columns.splice(
      k + 2,
      this.joinCheckedList[i].dropDownList[j].columns.length
    );
    this.removeCol(i, j, k + 1);

    let originalPKList = JSON.parse(
      JSON.stringify(
        this.joinCheckedList[i].dropDownList[j].columns[k].primaryKeyList
      )
    );
    originalPKList.forEach((obj: any, index: any) => {
      if (obj.columnId == e.value.columnId) {
        originalPKList.splice(index, 1);
      }
    });

    if (this.joinCheckedList[i].dropDownList[j].columns[k + 1] == undefined)
      this.joinCheckedList[i].dropDownList[j].columns.push({
        primaryKeyList: originalPKList,
        searchValuePK: '',
        searchValueFK: '',
      });
    else
      this.joinCheckedList[i].dropDownList[j].columns[k + 1].primaryKeyList =
        originalPKList;
  }
  selectForeignKey(e: any, k: number, j: any, i: any) {
    //join
    const value = e.value;

    this.joinCheckedList[i].dropDownList[j].columns.splice(
      k + 2,
      this.joinCheckedList[i].dropDownList[j].columns.length
    );
    this.removeCol(i, j, k + 1);

    let originalPKList = JSON.parse(
      JSON.stringify(
        this.joinCheckedList[i].dropDownList[j].columns[k].foreignKeyList
      )
    );
    originalPKList.forEach((obj: any, index: any) => {
      if (obj.columnId == e.value.columnId) {
        originalPKList.splice(index, 1);
      }
    });

    if (this.joinCheckedList[i].dropDownList[j].columns[k + 1] == undefined)
      this.joinCheckedList[i].dropDownList[j].columns.push({
        foreignKeyList: originalPKList,
        searchValuePK: '',
        searchValueFK: '',
      });
    else
      this.joinCheckedList[i].dropDownList[j].columns[k + 1].foreignKeyList =
        originalPKList;
  }

  selectJoin(e: any, j: any, i: any) {
    //join
    this.joinCheckedList[i].dropDownList[j].joinType = e.value;
    console.log(this.joinCheckedList[i].dropDownList);
  }

  expandCollapseAppendInJoin() {
    this.isAppendExpandInJoin = (this.isAppendExpandInJoin == true) ? false : true
    let appendList = this.append_SourceFilesList.filter((x: any) => x.type == 'Append')
    appendList.forEach((obj: any) => obj.isAppendExpandInJoin = !this.isAppendExpandInJoin)
  }

  expandCollapseSourceFilesInJoin() {
    this.isSourceFilesExpandInJoin = (this.isSourceFilesExpandInJoin == true) ? false : true
    let appendList = this.append_SourceFilesList.filter((x: any) => x.type == 'files')
    appendList.forEach((obj: any) => obj.isSourceFilesExpandInJoin = !this.isSourceFilesExpandInJoin)
  }
  //-JEnd

  //DMStart

  uploadedScriptTableList: Array<any> = []
  getUploadedScriptTableList() {
    //  this.process.processId = '82672e3e-d88d-4ed6-9d3f-6406bf064fcb'
    this.solService.getUploadedScriptTableList(this.process.processId).subscribe(
      (res: any) => {
        console.log(res);
        if (res) {
          let tableArr: Array<any> = []
          res.responseData?.tableList.forEach((obj: any) => {
            tableArr.push({ tableName: obj.trim(), isChecked: false })
          })
          this.uploadedScriptTableList = tableArr
          console.log('uploadedScriptTableList', this.uploadedScriptTableList);

        }
      })
  }


  functionClicked: boolean = false
  functionClick() {
    this.columnClicked = false
    this.functionClicked = (this.functionClicked == false) ? true : false
  }
  columnClicked: boolean = false
  columnClick() {
    this.sourceFilesAppendJoinFileList2 = JSON.parse(JSON.stringify(this.sourceFilesAppendJoinFileListForSearch))
    this.allDatasetDetailsList2 = JSON.parse(JSON.stringify(this.allDatasetDetailsListForSearch))
    this.functionClicked = false
    this.columnClicked = (this.columnClicked == false) ? true : false
  }
  DataSetArr(): FormArray {
    //DS popup
    return this.dataSetForm.get('DSetRows') as FormArray;
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
      columns: this.formBuilder.array([this.addColumnInDS()]),
    });
  }

  addColumnInDS(): FormGroup {
    return this.formBuilder.group({
      column1: ['', Validators.required],
      column2: ['', Validators.required],
    });
  }

  columnArrInDS(i: any): FormArray {
    return this.DataSetArr().controls[i].get('columns') as FormArray;
  }

  isValidName(): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | any> => {
      let bReturn: boolean = true;
      if (this.appendForm.get('appendNameControl')?.value == '') {
        bReturn = false;
      }
      let err: ValidationErrors = { invalid: true };
      return bReturn ? of(null) : of(err);
    };
  }

  getAllFunctions() {
    this.solService.getAllFunctions().subscribe(
      (res: any) => {
        this.fx = res.responseData;
        this.searchfx = res.responseData;
        console.log(res);
        this.loader.hide();
      },
      (err: any) => {
        this.loader.hide();
      }
    );
  }

  addOpearatorValueFields(i: number, item: any) {
    item.whereList.push({
      signOperatorList: item.signOperatorList,
      opearatorList: this.opearatorList,
      value: '',
    });
  }
  delOpearatorValueFields(j: number, whereObj: any, i: number, item: any) {
    this.createExpressionList[i].whereList.splice(j, 1);
  }
  changeSignOperator(
    e: any,
    j: any,
    whereObj: any,
    i: number,
    item: any,
    listType: string
  ) {
    const value = e.value;
    if (listType == 'parent') {
      this.createExpressionList[i].signOperator = value;
    } else {
      whereObj.signOperator = value;
    }
  }

  enableCreateExpression: boolean = false
  addCustomColumn() {
    this.add_editCustomColumnNameInPopupInDM = 'Add'
    this.searchValueInColumnPopup = ''
    this.createExpressionList = [ //duplicate
      {
        excludeInSelect: false,
        sourceFieldName: '',
        columnId: '',
        columnFormat: '',
        signOperatorList: '',
        sourceExpressionName: '',
        isEdit: false,
        columnType: '',
        where: '',
        or: '',
        groupBy: '',
        orderBy: '',
        value: '',
        signOperator: '',
        whereList: [],
      },
    ];
    this.createExpressionForm.reset();

    this.enableCreateExpression = true
    this.createExpressionForm.controls.sourceFieldName.patchValue('')
    this.createExpressionForm.controls.sourceFieldName.enable()
    this.columnClicked = false
    this.functionClicked = false
  }

  closeCreateExpressionPopup() {
    this.enableCreateExpression = false
  }

  changeOperator(e: any, j: any, whereObj: any, i: number, item: any) {
    const value = e.value;
    whereObj.operator = value;
  }

  rowClickedDataModeling(obj: any, item: any, i: number, j: number) {
    //this.x = item.fieldName;
    const value = '[' + item.fieldName + ']';
    this.textAreaSlice(value);

    const position = this.textAreaIndexInDM.index;

    //this.inputs.toArray()[this.textAreaIndexInDM.index].nativeElement.setSelectionRange(cursorPosition, cursorPosition);
    //const x = (this.inputs.toArray()[this.textAreaIndexInDM.index].nativeElement as HTMLTextAreaElement);
    //x.setSelectionRange(cursorPosition, cursorPosition)
    //this.renderer.selectRootElement('#' + position+'DMT').focus();
  }

  textAreaSlice(value: any) {
    const textareaVal = this.textAreaIndexinCE.value;
    const cursorPosition = this.textAreaIndexinCE.cursorPosition;
    const newValue = [
      textareaVal.slice(0, cursorPosition),
      value,
      textareaVal.slice(cursorPosition),
    ].join('');
    this.createExpressionList[
      this.textAreaIndexinCE.index
    ].sourceExpressionName = newValue;
    this.createExpressionForm.get('sourceExpressionName')?.patchValue(newValue);
  }

  textAreaIndexInDM: any = {}; //x
  textAreaInDataModeling(e: any, i: number) {
    //x
    const start = e.target.selectionStart;
    const end = e.target.selectionEnd;
    const cursorPosition = e.target.value.substr(start, end - start);
    this.textAreaIndexInDM = {
      index: i,
      cursorPosition: start,
      value: e.target.value,
    };
  }

  toggleAllSelection(event: any) {
    const expandTableTrue = this.datasetDetailsList.filter(
      (x: any) => x.isDatasetTableExpand
    );

    if (event.checked) {
      this.datasetTableForm
        .get('groupBy')
        ?.patchValue([
          ...expandTableTrue[0].groupBytoDB.map(
            (item: any) => item.dbtablefieldName
          ),
        ]);
    } else {
      this.datasetTableForm.controls.groupBy.patchValue([]);
    }
  }

  submitDataset(obj: any, i: number) {
    let dsName = this.datasetForm.get('appendNameControl')?.value.trim();
    if (this.datasetForm.invalid) {
      this.submited1 = true;
      this.submittedErrorMsg = 'Dataset Name should now be empty!!!';
      return
    }
    //if(dsName == '') return;
    // if (obj.datasetId) { //edit of existing
    if (obj.datasetName == dsName) {
      this.saveDataSet(obj, i)
    }
    else { //create new
      this.loader.show();
      this.solService.getExistDataset(dsName, 'dataset').subscribe(
        (res: any) => {
          this.loader.hide();
          this.submited1 = false;
          this.submittedErrorMsg = '';
          this.saveDataSet(obj, i)
          // this.enableDataSetPopUp = false;

          console.log(res);
        },
        (err: any) => {
          this.loader.hide();
          this.submited1 = true;
          this.submittedErrorMsg = 'Dataset Name Already Exist!!!';
        }
      );
    }
  }


  createNewDataSet() {
    let dsName = this.datasetForm.get('appendNameControl')?.value.trim();
    this.loader.show();
    this.solService.getExistDataset(dsName, 'dataset').subscribe(
      (res: any) => {
        this.loader.hide();
        this.submited1 = false;
        this.submittedErrorMsg = '';

        this.createExpressionList = [
          {
            excludeInSelect: false,
            sourceFieldName: '',
            columnId: '',
            columnFormat: '',
            signOperatorList: '',
            sourceExpressionName: '',
            isEdit: false,
            columnType: '',
            where: '',
            or: '',
            groupBy: '',
            orderBy: '',
            value: '',
            signOperator: '',
            whereList: [],
          },
        ];
        this.enableDataSetPopUp = false;
        const ds = {
          isDatasetTableExpand: true,
          having: '',
          groupBytoDB: [],
          orderBytoDB: [],
          datasetName: dsName,
          datasetFieldDTOList: [],
          orderBy: '',
          groupBy: '',
        };
        this.datasetDetailsList.push(ds);

        console.log(res);
      },
      (err: any) => {
        this.loader.hide();
        this.submited1 = true;
        this.submittedErrorMsg = 'Dataset Name Already Exist!!!';
      }
    );

    // if (this.datasetDetailsList.filter((x: any) => x.datasetName != this.datasetForm.get('appendNameControl')?.value)) {
    // }
    // else {
    //const datasetFieldDTOList = [{ fieldName: '', expression: '', columnType: '', isEdit:false }]

    //}
  }

  saveDataSetDropdowns() {
    this.saveDataSetApi();
  }

  accordionFilesRowClicked(
    item: any,
    i: number,
    comp: any,
    j: number,
    listType: any
  ) {
    const value = comp.showTabColName;
    const cType = comp.columnType;
    //const value = (listType == 'JF') ? item.showMergeName + '[' + comp.fieldName + ']' : (listType == 'AF') ? item.showAppendName + '[' + comp.fieldName + ']' : (listType == 'SF') ? comp.fileSheet + '[' + comp.fieldName + ']' : comp.showTabColName
    if (this.textAreaIndexinCE.tagType == 'textArea') this.textAreaSlice(value);
    if (this.textAreaIndexinCE.tagType == 'input') {
      this.createExpressionList[this.textAreaIndexinCE.index].fileType =
        listType;
      // this.createExpressionList[this.textAreaIndexinCE.index].sourceFieldName = value;
      // this.createExpressionList[this.textAreaIndexinCE.index].columnType = cType;
      this.createExpressionForm.get('sourceFieldName')?.patchValue(value);
      this.createExpressionForm.get('columnType')?.patchValue(cType);
      this.createExpressionList[this.textAreaIndexinCE.index].sqlColumn =
        comp.sqlColumn;

      if (cType == 'date' || cType == 'datetime2' || cType == 'dateTime') {
        //copy
        this.createExpressionList[0].isColumnType = true; //it'll b 0 only
        // this.signOperatorList = [{ id: 0, value: 'IS NULL' }, { id: 1, value: 'IS NOT NULL' }, { id: 2, value: 'IN' }, { id: 3, value: 'NOT IN' }, { id: 4, value: '=' }, { id: 5, value: '!=' }, { id: 6, value: '>=' }, { id: 7, value: '>' }, { id: 8, value: '<' }, { id: 9, value: '<=' }]
      } else this.createExpressionList[0].isColumnType = false;

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

    this.textAreaIndexinCE = {
      index: i,
      cursorPosition: start,
      value: e.target.value,
      tagType: 'input',
    };
  }

  textAreaIndexinCE: any = {};
  textAreaInCreateExpression(e: any, i: number) {
    console.log('baloon');

    this.createExpressionList[i].sourceExpressionName = e.target.value;
    const start = e.target.selectionStart;

    this.textAreaIndexinCE = {
      index: i,
      cursorPosition: start,
      value: e.target.value,
      tagType: 'textArea',
    };
  }

  createorEditDatasetText!: string
  createDataSetinDM() {
    this.createorEditDatasetText = 'Create'
    this.searchValueInCreateDSPopup = ''
    this.sourceFilesAppendJoinFileList = JSON.parse(JSON.stringify(this.sourceFilesAppendJoinFileListForSearch))
    this.allDatasetDetailsList = JSON.parse(JSON.stringify(this.allDatasetDetailsListForSearch))
    //console.log('this.sourceFilesAppendJoinFileList',this.sourceFilesAppendJoinFileList);
    // console.log('this.allTableListWithoutDSInDM', this.allTableListWithoutDSInDM);
    // console.log('this.allTableListInDM', this.allTableListInDM);
    //console.log('this.tablecolNameList', this.tablecolNameList);  //for expn
    console.log('this.datasetDetailsList', this.datasetDetailsList);
    console.log('this.allDatasetDetailsList', this.allDatasetDetailsList);
    this.clearWhereInDS();

    this.createExpressionForm.controls.sourceFieldName.enable()
    this.unChecksAllInDM(false);
    // this.createNewDataSet();
    this.enableDataSetPopUp = true
    this.datasetForm.patchValue({ appendNameControl: '' })
    this.createExpressionForm.controls.sourceFieldName.enable()
    this.createExpressionForm.controls.columnFormat.enable()
    this.createExpressionList = [
      {
        excludeInSelect: false,
        sourceFieldName: '',
        columnId: '',
        columnFormat: '',
        signOperatorList: '',
        sourceExpressionName: '',
        isEdit: false,
        columnType: '',
        where: '',
        or: '',
        groupBy: '',
        orderBy: '',
        value: '',
        signOperator: '',
        whereList: [],
      },
    ];
    // this.enableDataSetPopUp = false;
    // const ds = {
    //   isDatasetTableExpand: true,
    //   having: '',
    //   groupBytoDB: [],
    //   orderBytoDB: [],
    //   datasetName: '',
    //   datasetFieldDTOList: [],
    //   orderBy: '',
    //   groupBy: '',
    // };
    // this.datasetDetailsList.push(ds);
    this.datasetDetailsList = [{
      isDatasetTableExpand: true,
      having: '',
      groupBytoDB: [],
      orderBytoDB: [],
      datasetName: '',
      datasetFieldDTOList: [],
      orderBy: '',
      groupBy: ''
    }]


    // this.createExpressionForm.reset(); //shd write in submit btn
    // const filteredList = this.datasetDetailsList.filter(
    //   (x: any) => x.isDatasetTableExpand == true
    // );
    // if (filteredList.length == 1) {
    //   return;
    // }
    // this.enableDataSetPopUp = true;
    // this.datasetForm.get('appendNameControl')?.reset();
  }

  // accordionExpValue(obj: any, value: any) {
  //   this.textAreaSlice(obj.functionType);
  //   this.isOpenAccordion = false;
  // }

  accordionExpValue(obj: any, value: any) {
    this.textAreaSlice(obj.functionType);
    this.isOpenAccordion = false;
  }

  changeDTinCreateExpression(e: any, i: number) {
    this.createExpressionList[i].columnType = e.value;
    if (e.value == 'date' || e.value == 'datetime2' || e.value == 'datetime') {
      this.createExpressionList[i].isColumnType = true;
      this.signOperatorList = [
        { id: 0, value: 'IS NULL' },
        { id: 1, value: 'IS NOT NULL' },
        { id: 2, value: 'IN' },
        { id: 3, value: 'NOT IN' },
        { id: 4, value: '=' },
        { id: 5, value: '!=' },
        { id: 6, value: '>=' },
        { id: 7, value: '>' },
        { id: 8, value: '<' },
        { id: 9, value: '<=' },
      ];
    } else this.createExpressionList[i].isColumnType = false;

    if (
      e.value == 'char' ||
      e.value == 'varchar' ||
      e.value == 'text' ||
      e.value == 'nvarchar'
    ) {
      this.signOperatorList = [
        { id: 0, value: 'IS NULL' },
        { id: 1, value: 'IS NOT NULL' },
        { id: 2, value: 'LIKE' },
        { id: 3, value: 'NOT LIKE' },
        { id: 4, value: 'NOT IN' },
        { id: 5, value: 'IN' },
      ];
    }

    if (
      e.value == 'int' ||
      e.value == 'float' ||
      e.value == 'money' ||
      e.value == 'decimal' ||
      e.value == 'bigint'
    ) {
      this.signOperatorList = [
        { id: 0, value: 'IS NULL' },
        { id: 1, value: 'IS NOT NULL' },
        { id: 2, value: 'IN' },
        { id: 3, value: 'NOT IN' },
        { id: 4, value: '=' },
        { id: 5, value: '!=' },
        { id: 6, value: '>=' },
        { id: 7, value: '>' },
        { id: 8, value: '<' },
        { id: 9, value: '<=' },
      ];
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
    item.isDatasetTableExpand = item.isDatasetTableExpand = true;
  }


  editRowInDataSet(i: number, j: number, item: any) {
    // console.log(
    //   'this.datasetDetailsList[0].datasetFieldDTOList ',
    //   this.datasetDetailsList[0].datasetFieldDTOList
    // );
    this.add_editCustomColumnNameInPopupInDM = 'Edit'
    if (item.sourceFieldName.includes('[')) {
      this.createExpressionForm.controls.sourceFieldName.disable()
    } else {
      this.createExpressionForm.controls.sourceFieldName.enable()
    }

    this.enableCreateExpression = true
    this.functionClicked = false
    this.columnClicked = false
    this.datasetDetailsList[i].datasetFieldDTOList.forEach(
      (obj: any) => (obj.isEdit = false)
    );
    item.isEdit = true;
    this.createExpressionList = [];

    if (item.isColumnType == true) {
      this.createExpressionForm.patchValue({
        sourceFieldName: item.sourceFieldName,
        excludeInSelect: item.excludeInSelect,
        columnType: item.columnType,
        columnFormat: item.columnFormat,
        sourceExpressionName: item.sourceExpressionName,
      });
    } else {
      this.createExpressionForm.patchValue({
        sourceFieldName: item.sourceFieldName,
        excludeInSelect: item.excludeInSelect,
        columnType: item.columnType,
        sourceExpressionName: item.sourceExpressionName,
      });
    }

    this.createExpressionList.push(JSON.parse(JSON.stringify(item)));
  }

  deleteRowInDataset(i: number, j: number, item: any) {
    if (this.datasetDetailsList[i].datasetFieldDTOList[j].isEdit == true)
      this.createExpressionList = [
        {
          sourceFieldName: '',
          columnId: '',
          sourceExpressionName: '',
          isEdit: false,
          columnType: '',
          where: '',
          or: '',
          groupBy: '',
          orderBy: '',
          value: '',
          signOperator: '',
          whereList: [],
        },
      ];
    //clearing CE if edited row is deleted

    this.datasetDetailsList[i]?.datasetFieldDTOList.splice(j, 1);

    //changes update in orderby,groupby
    this.datasetDetailsList[i]?.orderBytoDB.forEach(
      (obObj: any, index: number) => {
        if (item.sourceFieldName == obObj.filefieldName)
          this.datasetDetailsList[i]?.orderBytoDB.splice(index, 1);
      }
    );
    this.datasetDetailsList[i]?.groupBytoDB.forEach(
      (gbObj: any, index: number) => {
        if (item.sourceFieldName == gbObj.filefieldName)
          this.datasetDetailsList[i]?.groupBytoDB.splice(index, 1);
      }
    );
    this.columnsForWhereInDS.forEach((colmnObj: any, index: number) => {
      if (item.sourceFieldName == colmnObj.filefieldName)
        this.columnsForWhereInDS.splice(index, 1);
    });

    this.datasetTableForm.controls.groupBy.value.splice(j, 1) // removing when edit functionality 
    this.datasetTableForm.controls.orderBy.value.splice(j, 1)



    this.UpdatechecksInDM(item, false);
    console.log('this.columnsForWhereInDS', this.columnsForWhereInDS);
    console.log('this.datasetDetailsList', this.datasetDetailsList);
    // console.log('datasetTableForm',this.datasetTableForm);

  }

  tablecolNameList: any[] = [];
  getAllDataSetNameAPI(item: any) {
    this.allDatasetDetailsList = []
    this.allDatasetDetailsList2 = []
    this.allDatasetDetailsListForSearch = []
    this.solService.getAllDatasetName(this.process.processId).subscribe(
      (res: any) => {
        if (res != null) {
          res.responseData.forEach((datasetObj: any) => {
            datasetObj.isSelectAllParentInDM = false;
            datasetObj.searchValueInCreateDatasetPopup = '' //DM
            datasetObj.searchValueInColumnPopup = '' //DM
            const ob: any[] = [];
            const gb: any[] = [];
            datasetObj.datasetFieldDTOList.forEach((colObj: any) => {
              colObj.isSelectAllChildInDM = false;
              colObj.showTabColName =
                datasetObj.datasetName + '[' + colObj.fieldName + ']';

              // colObj.groupBy = ''
              if (
                colObj.columnType == 'date' ||
                colObj.columnType == 'datetime2' ||
                colObj.columnType == 'datetime'
              )
                colObj.isColumnType = true;
              else colObj.isColumnType = false; //ce
              colObj.isEdit = false;
              colObj.or = '';
              // colObj.orderBy = ''
              // colObj.signOperatorList = ''
              // colObj.signOperator = ''
              // colObj.value = ''

              const wL = colObj.where;
              const tcName = colObj.tableName + '.' + colObj.columnName;

              const splitt = colObj.where
                .split(' ')
                .join()
                .split(tcName)
                .join()
                .split(',');

              if (splitt.join() == '')
                gb.push({
                  filefieldName: colObj.sourceFieldName,
                  dbtablefieldName: colObj.tableName + '.' + colObj.columnName,
                });
              ob.push({
                filefieldName: colObj.sourceFieldName,
                dbtablefieldName: colObj.tableName + '.' + colObj.columnName,
              });
            });
            datasetObj.isDatasetTableExpand = false;
            datasetObj.orderBytoDB = ob;
            datasetObj.groupBytoDB = gb;
            datasetObj.type = 'dataset'
          });
          this.allDatasetDetailsList = res.responseData;
          this.allDatasetDetailsList2 = res.responseData;
          this.allDatasetDetailsListForSearch = res.responseData

          res.responseData.forEach((dsObj: any) => {
            //shd write cndtn if no DSs
            dsObj.datasetFieldDTOList.forEach((colObj: any) => {
              (colObj.fileType = 'dataset'),
                (colObj.fieldIDforExpn = colObj.datasetFieldId); //for expn
            });
            this.allTableListInDM.push({
              fileType: 'dataset',
              tableNameUI: dsObj.datasetName,
              tableNameDB: dsObj.tableName,
              idName: 'datasetId',
              ID: dsObj.datasetId,
              columnList: dsObj.datasetFieldDTOList,
              isSelecteddl: false,
            });
          });

          console.log('getalldsapi', this.allTableListInDM);

          // this.tablecolNameList.forEach((obj: any, index: number) => { //need to check
          //   if (obj.fileType == 'dataset') {
          //     this.tablecolNameList.splice(index, 1)
          //   }
          // })
        }
        this.tablecolNameList = [];
        this.tablecolNameList = this.allTableListInDM
          .map((ele: any) =>
            ele.columnList.map((sub: any) => ({
              tableNameUI: ele.tableNameUI,
              tableNameDB: ele.tableNameDB,
              fileType: ele.fileType,
              fieldID: ele.fieldID,
              showTabColName: sub.showTabColName,
              fieldIDforExpn: sub.fieldIDforExpn,
              tableColumnName: sub.tableColumnName,
              columnName: sub.columnName,
            }))
          )
          .reduce((acc, val) => acc.concat(val), []);
        this.loader.hide();
        this.tabsChange(item);
        this.selectedTab = item.id
      },
      (err: any) => {
        this.loader.hide();
      }
    );
  }

  deleteDataSet(i: number) {
    this.datasetDetailsList.splice(i, 1);
    this.createExpressionList = [];
    this.datasetDetailsList = [];
    this.clearWhereInDS();
  }

  // isAllSelected(e: any, item: any, i: number, j: number) {
  //   this.submitted = false;
  //   this.submittedErrorMsg = '';
  //   this.hideCreateIdenticalBtnWithLength = true; //cndtn may req
  //   //this.sortedList[i][j].isSelected  = e.target.checked;
  //   this.sortedList.forEach((obj: any, index: number) => {
  //     if (index == i) {
  //       obj.forEach((item: any, index: any) => {
  //         if (index == j) {
  //           item.isSelected = e.target.checked;
  //         }
  //       })
  //     }
  //   })
  // }

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
  submitedDS: boolean = false;
  saveDataSetApi() {
    let datasetObj: any = {};
    datasetObj.processId = this.process.processId;
    datasetObj.userId = this.userInfo.userId;

    if (this.enableUploadSQLPopup) { //x
      this.loader.show();
      this.submited1 = true; //UPLOAD SQL SCRIPT VALIDATION
      //console.log(this.sqlScriptForm);
      if (this.sqlScriptForm.invalid) {
        return;
      }
      datasetObj.datasetName = this.sqlScriptForm.value.datasetName;
      datasetObj.sqlScript = this.sqlScriptForm.value.sqlScript;

      this.solService.addDataset(datasetObj).subscribe(
        async (res: any) => {
          //copy
          // this.allTableListInDM.forEach((obj: any, index: number) => {
          //   if (obj.fileType == 'dataset') {
          //     this.allTableListInDM.splice(index, 1) //removing from list for rem duplicts
          //   }
          // })
          await this.getAllDataSetNameAPI({ id: 5 });
          this.enableUploadSQLPopup = false;
          this.loader.hide();
        },
        (err: any) => {
          this.loader.hide();
        }
      ); //
    } else {
      this.submitedDS = true;
      // if (this.dataSetForm.invalid) {
      let d = 0;
      this.DataSetArr().controls.forEach((dsObj: any) => {
        if (dsObj.invalid) d = 1;
      });
      if (d == 1) {
        "Script shouldn't be empty"
        this.popup.open(false, 'Enter all the required fields');
        // this.toast.error({
        //   title: 'Error',
        //   message: 'Enter all the required fields',
        // });
        return;
      }
      this.loader.show();
      datasetObj.dataSetMergeListDTOs = [];

      this.DataSetArr().controls.forEach((eee: any, i: any) => {
        datasetObj.dataSetMergeListDTOs[i] = {};

        if (eee.value.Ptable.fileType == 'append')
          datasetObj.dataSetMergeListDTOs[i].primaryTemplateId =
            eee.value.Ptable.ID;
        else if (eee.value.Ptable.fileType == 'join')
          datasetObj.dataSetMergeListDTOs[i].primaryTemplateId =
            eee.value.Ptable.ID;
        else if (eee.value.Ptable.fileType == 'files')
          datasetObj.dataSetMergeListDTOs[i].primaryTemplateId =
            eee.value.Ptable.ID;
        else if (eee.value.Ptable.fileType == 'dataset')
          datasetObj.dataSetMergeListDTOs[i].primaryTemplateId =
            eee.value.Ptable.ID;

        if (eee.value.Ftable.fileType == 'append')
          datasetObj.dataSetMergeListDTOs[i].secondaryTemplateId =
            eee.value.Ftable.ID;
        else if (eee.value.Ftable.fileType == 'join')
          datasetObj.dataSetMergeListDTOs[i].secondaryTemplateId =
            eee.value.Ftable.ID;
        else if (eee.value.Ftable.fileType == 'files')
          datasetObj.dataSetMergeListDTOs[i].secondaryTemplateId =
            eee.value.Ftable.ID;
        else if (eee.value.Ftable.fileType == 'dataset')
          datasetObj.dataSetMergeListDTOs[i].secondaryTemplateId =
            eee.value.Ftable.ID;

        if (eee.value.Ptable.fileType == 'files')
          datasetObj.dataSetMergeListDTOs[i].primaryTableName =
            eee.value.Ptable.tableNameDB;
        else
          datasetObj.dataSetMergeListDTOs[i].primaryTableName =
            eee.value.Ptable.tableNameDB;

        if (eee.value.Ftable.fileType == 'files')
          datasetObj.dataSetMergeListDTOs[i].secondaryTableName =
            eee.value.Ftable.tableNameDB;
        else
          datasetObj.dataSetMergeListDTOs[i].secondaryTableName =
            eee.value.Ftable.tableNameDB;

        datasetObj.dataSetMergeListDTOs[i].columnArrayList = [];
        this.columnArrInDS(i).controls.forEach((child: any, j: any) => {
          datasetObj.dataSetMergeListDTOs[i].columnArrayList[j] = {};

          if (child.value.column1.fileType == 'append')
            datasetObj.dataSetMergeListDTOs[i].columnArrayList[j].primaryKeyId =
              child.value.column1.fieldID;
          else if (child.value.column1.fileType == 'join')
            datasetObj.dataSetMergeListDTOs[i].columnArrayList[j].primaryKeyId =
              child.value.column1.columnId;
          else if (child.value.column1.fileType == 'files')
            datasetObj.dataSetMergeListDTOs[i].columnArrayList[j].primaryKeyId =
              child.value.column1.columnId;
          else if (child.value.column1.fileType == 'dataset')
            datasetObj.dataSetMergeListDTOs[i].columnArrayList[j].primaryKeyId =
              child.value.column1.datasetFieldId;

          if (child.value.column2.fileType == 'append')
            datasetObj.dataSetMergeListDTOs[i].columnArrayList[
              j
            ].secondaryKeyId = child.value.column2.fieldID;
          else if (child.value.column2.fileType == 'join')
            datasetObj.dataSetMergeListDTOs[i].columnArrayList[
              j
            ].secondaryKeyId = child.value.column2.columnId;
          else if (child.value.column2.fileType == 'files')
            datasetObj.dataSetMergeListDTOs[i].columnArrayList[
              j
            ].secondaryKeyId = child.value.column2.columnId;
          else if (child.value.column2.fileType == 'dataset')
            datasetObj.dataSetMergeListDTOs[i].columnArrayList[
              j
            ].secondaryKeyId = child.value.column2.datasetFieldId;

          datasetObj.dataSetMergeListDTOs[i].columnArrayList[
            j
          ].primaryFieldName = child.value.column1.columnName;
          datasetObj.dataSetMergeListDTOs[i].columnArrayList[
            j
          ].secondaryFieldName = child.value.column2.columnName;
        });

        datasetObj.dataSetMergeListDTOs[i].joinType = eee.value.join.slice(
          0,
          1
        );
        datasetObj.dataSetMergeListDTOs[i].order = i;

        console.log(eee.value, eee);
        console.log(eee.controls.Ptable.value);
      });

      const colList: any[] = [];
      const expandTableTrue = this.datasetDetailsList.filter(
        (x: any) => x.isDatasetTableExpand
      );
      expandTableTrue[0].datasetFieldDTOList.forEach((datasetField: any) => {
        if (datasetField.sourceExpressionName != null) {
          if (
            datasetField.sourceExpressionName.trim() == '' ||
            datasetField.sourceExpressionName.trim().length == 0
          )
            datasetField.sourceExpressionName = null;
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
        let tableNameForManualColumnName!: string;
        if (expn != null) {
          this.tablecolNameList.forEach((obj: any) => {
            if (expn.includes(obj.showTabColName)) {
              expn = JSON.parse(
                JSON.stringify(
                  expn.split(obj.showTabColName).join(obj.tableColumnName)
                )
              );
              tableNameForManualColumnName = obj.tableNameDB;
            }
          });
        }
        //}
        if (datasetField.tableName == undefined)
          datasetField.tableName = tableNameForManualColumnName;
        if (!datasetField.isColumnType) datasetField.columnFormat = 'yyyy/mm/dd';

        colList.push({
          tableName: datasetField.tableName,
          columnFormat: datasetField.columnFormat,
          excludeInSelect: datasetField.excludeInSelect,
          columnName: datasetField.columnName,
          fieldName: datasetField.fieldName,
          expression: expn,
          columnType: datasetField.columnType,
          where: datasetField.where,
          or: datasetField.or,
          groupBy: '',
          sourceFieldName: datasetField.sourceFieldName,
          sourceExpressionName: datasetField.sourceExpressionName,
        });
      });
      datasetObj.datasetFieldDTOList = colList;
      // datasetObj.datasetName = expandTableTrue[0].datasetName;
      datasetObj.datasetName = this.datasetForm.controls.appendNameControl.value

      let groupByVal = this.datasetTableForm.get('groupBy')?.value;
      let havingVal = this.datasetTableForm.get('having')?.value;
      let orderByVal = this.datasetTableForm.get('orderBy')?.value;
      if (groupByVal == '') datasetObj.groupBy = null;
      else datasetObj.groupBy = groupByVal.join();
      if (orderByVal == '') datasetObj.orderBy = null;
      else datasetObj.orderBy = orderByVal.join();
      if (havingVal != null) {
        if (havingVal.trim() == '') datasetObj.having = null;
        else datasetObj.having = havingVal;
      }
      datasetObj.calender = '';

      let whereQuery: any[] = [];
      let uiWhere: Array<any> = [];
      this.whereArrInDS().controls.forEach((whereObj: any, index: number) => {
        //console.log(whereObj);
        console.log(whereObj.controls.column.value);
        console.log(whereObj.controls.signOperator.value);
        // console.log(whereObj.controls.value.value);
        let column = whereObj.controls.column.value.dbtablefieldName;
        let signOperator = whereObj.controls.signOperator.value;
        let value: any;
        if (whereObj.controls.value != undefined) value = whereObj.controls.value.value;
        if (index == 0) {
          if (signOperator != '') {
            if (signOperator == 'IS NULL' || signOperator == 'IS NOT NULL') {
              whereQuery = [column + ' ' + signOperator];
            } else {
              whereQuery = [column + ' ' + signOperator + ' ' + value];
            }
          }
          if (signOperator == 'IS NULL' || signOperator == 'IS NOT NULL')
            uiWhere.push({
              fieName: whereObj.controls.column.value.filefieldName,
              signOperator: signOperator,
              value: '',
            });
          else
            uiWhere.push({
              fieName: whereObj.controls.column.value.filefieldName,
              signOperator: signOperator,
              value: value,
            });
        } else {
          console.log(whereObj.controls.operator.value);
          let operator = whereObj.controls.operator.value;
          let x: any;
          if (signOperator != '') {
            if (signOperator == 'IS NULL' || signOperator == 'IS NOT NULL') {
              x = operator + ' ' + column + ' ' + signOperator;
            } else {
              x = operator + ' ' + column + ' ' + signOperator + ' ' + value;
            }
          }
          whereQuery.push(x);

          if (signOperator == 'IS NULL' || signOperator == 'IS NOT NULL')
            uiWhere.push({
              operator: operator,
              fieName: whereObj.controls.column.value.filefieldName,
              signOperator: signOperator,
              value: '',
            });
          else
            uiWhere.push({
              operator: operator,
              fieName: whereObj.controls.column.value.filefieldName,
              signOperator: signOperator,
              value: value,
            });
        }
      });
      datasetObj.where = whereQuery.join(' ');
      datasetObj.uiWhere = JSON.stringify(uiWhere);
      // if (expandTableTrue[0].groupBy.trim() == '' || expandTableTrue[0].groupBy.trim().length == 0) datasetObj.groupBy = null;
      // else datasetObj.groupBy = expandTableTrue[0].groupBy;

      // if (expandTableTrue[0].orderBy.trim() == '' || expandTableTrue[0].orderBy.trim().length == 0) datasetObj.orderBy = null;
      // else datasetObj.orderBy = expandTableTrue[0].orderBy;

      // if (expandTableTrue[0].having.trim() == '' || expandTableTrue[0].having.trim().length == 0) datasetObj.having = null;
      // else datasetObj.having = expandTableTrue[0].having;
      datasetObj.calender = '';
      this.progressBar = []
      this.progressBarPopup = true
      if (expandTableTrue[0].datasetId)
        datasetObj.datasetId = expandTableTrue[0].datasetId;
      this.solService.addDataset(datasetObj).subscribe(
        async (res: any) => {
          if (res.type == HttpEventType.UploadProgress) {
            this.progressBar = [{ percentage: Math.round((70 / res.total) * res.loaded) }];
          } else if (res.type == HttpEventType.Response) {
            this.progressBar = [];
            this.progressBarPopup = false
            //this.clearWhereInDS();
            this.allTableListInDM.forEach((obj: any, index: number) => {
              if (obj.fileType == 'dataset') {
                this.allTableListInDM.splice(index, 1); //removing from list for rem duplicts
              }
            });
            this.tablecolNameList.forEach((obj: any, index: number) => {
              //need to check
              if (obj.fileType == 'dataset') {
                this.tablecolNameList.splice(index, 1);
              }
            });
            await this.getAllDataSetNameAPI({ id: 5 });
            this.unChecksAllInDM(false);
            this.enableDataSetPopUp = false
            this.loader.hide();
            //expandTableTrue[0].isDatasetTableExpand = false;
            this.saveDataSetPopup = false;
            this.createExpressionList = []; //clearing CE,DS list
            this.datasetDetailsList = [];
            this.popup.open(true, 'Dataset saved successfully !')
          }

        },
        (err: any) => {
          this.progressBarPopup = false
          this.popup.open(false, 'Dataset save failed !')

          this.loader.hide();
        }
      );
    }
  }

  clearWhereInDS() {
    this.columnsForWhereInDS = []; //columns of where
    this.datasetTableForm.controls.where = this.fb.array([
      this.whereFirstRow(),
    ]);
    this.datasetTableForm.patchValue({ having: '', groupBy: '', orderBy: '' });
    // this.datasetTableForm.get('having')?.reset()
    // this.datasetTableForm.get('groupBy')?.reset()
    // this.datasetTableForm.get('orderBy')?.reset()
  }
  enableViewScriptDSPopup: boolean = false;
  callGetViewscript(datasetObj: any) {
    this.loader.show();
    const datasetId = datasetObj.datasetId;
    this.solService.getViewScript(datasetId).subscribe(
      (res: any) => {
        this.viewscriptForm
          .get('sqlScript')
          ?.patchValue(res?.responseData.sqlScript);
        this.viewscriptForm
          .get('datasetId')
          ?.patchValue(res?.responseData.datasetId);
        this.enableViewScriptDSPopup = true;
        this.viewscriptForm
          .get('sqlScript')?.disable()
        this.loader.hide();
      },
      (err: any) => {
        this.loader.hide();
      }
    );
  }

  updateScriptByDatasetId(viewscriptForm: any) {
    //underconstruction
    if (
      this.viewscriptForm.invalid ||
      this.viewscriptForm.controls.sqlScript.value.trim() == ''
    ) {
      this.popup.open(false, "Script shouldn't be empty");
      // this.toast.error({
      //   title: 'Error',
      //   message: "Script shouldn't be empty",
      // });
      return;
    }
    this.loader.show();
    const data = {
      datasetId: viewscriptForm.value.datasetId,
      newScript: viewscriptForm.value.sqlScript.trim(),
    };
    this.solService.updateScriptByDatasetId(data).subscribe(
      (res: any) => {
        this.viewscriptForm
          .get('sqlScript')
          ?.patchValue(res?.responseData.newScript);
        this.viewscriptForm
          .get('datasetId')
          ?.patchValue(res?.responseData.datasetId);
        this.enableViewScriptDSPopup = false;
        this.popup.open(true, 'update Script Successfully');
        // this.toast.success({
        //   title: 'Success',
        //   message: 'update Script Successfully',
        // });
        this.loader.hide();
      },
      (err: any) => {
        this.popup.open(false, 'update Script Failed! (Syntax Error)');
        // this.toast.error({
        //   title: 'Error',
        //   message: 'update Script Failed! (Syntax Error)',
        // });
        this.loader.hide();
      }
    );
  }

  editDatasetFile(datasetObj: any) {
    this.createorEditDatasetText = 'Edit'
    this.enableDataSetPopUp = true
    this.createExpressionList = [
      {
        excludeInSelect: false,
        sourceFieldName: '',
        columnId: '',
        sourceExpressionName: '',
        isEdit: false,
        columnType: '',
        where: '',
        or: '',
        groupBy: '',
        orderBy: '',
        value: '',
        signOperator: '',
        whereList: [],
      },
    ];
    datasetObj.isDatasetTableExpand = true;

    this.datasetDetailsList[0] = datasetObj;
    let oB: any[] = [];
    let gB: any[] = [];
    if (datasetObj.orderBy != null) oB = datasetObj.orderBy.split(',');
    if (datasetObj.groupBy != null) gB = datasetObj.groupBy.split(',');
    this.datasetTableForm.get('orderBy')?.patchValue(oB);
    this.datasetTableForm.get('groupBy')?.patchValue(gB);
    this.datasetTableForm.get('having')?.patchValue(datasetObj.having);

    this.columnsForWhereInDS = [];
    datasetObj.datasetFieldDTOList.forEach((dsField: any) => {
      if (dsField.sourceFieldName.includes('[')) {
        this.columnsForWhereInDS.push({
          filefieldName: dsField.sourceFieldName,
          dbtablefieldName: dsField.tableName + '.' + dsField.columnName,
          dataType: dsField.columnType,
        });
      } else {
        this.columnsForWhereInDS.push({
          filefieldName: dsField.sourceFieldName,
          dbtablefieldName: dsField.expression,
          dataType: dsField.columnType,
        });
      }
    });

    let uIWhere = JSON.parse(datasetObj.uiWhere);
    this.datasetTableForm.controls.where = this.fb.array([
      this.whereFirstRow(),
    ]);

    uIWhere.forEach((obj: any, i: number) => {
      if (i == 0) {
        this.columnsForWhereInDS.forEach((col: any) => {
          if (col.filefieldName == obj.fieName) {
            let object: any = {
              column: col,
              signOperator: obj.signOperator,
            }

            if ((obj.signOperator == 'IS NULL' || obj.signOperator == 'IS NOT NULL') ? false : true) {
              this.addValueAtInDM(i)
              object.value = obj.value
            }

            this.whereArrInDS().controls[i].patchValue(object);
            this.changeColumnInDSForWhere(0, i, 0, 0);
          }
        });
      } else {
        this.whereArrInDS().push(this.whereRemainingRows());
        this.columnsForWhereInDS.forEach((col: any) => {
          if (col.filefieldName == obj.fieName) {
            let object = {
              operator: obj.operator,
              column: col,
              signOperator: obj.signOperator,
              value: obj.value,
            }
            if ((obj.signOperator == 'IS NULL' || obj.signOperator == 'IS NOT NULL') ? false : true) {
              this.addValueAtInDM(i)
              object.value = obj.value
            }

            this.whereArrInDS().controls[i].patchValue(object);
            this.changeColumnInDSForWhere(0, i, 0, 0);
          }
        });
      }
    });
    this.datasetForm.patchValue({ appendNameControl: datasetObj.datasetName })

    //checking columns of existing columns in dataset
    let existingColumns = datasetObj.datasetFieldDTOList.map((x: any) => x.sourceFieldName)

    let chkUnchkMapList: any;
    this.sourceFilesAppendJoinFileList.forEach((obj: any) => {
      if (obj.fileType == 'append') {
        obj.sheetList.forEach((childAppendObj: any) => {
          childAppendObj.tableAppendFieldsDto.forEach((grandAppendObj: any) => {
            if (existingColumns.includes(grandAppendObj.showTabColName))
              grandAppendObj.isSelectAllChildInDM = true
          })

          chkUnchkMapList = childAppendObj.tableAppendFieldsDto.map((x: any) => x.isSelectAllChildInDM)
          if (chkUnchkMapList.includes(false)) childAppendObj.isSelectAllParentInDM = false
          else childAppendObj.isSelectAllParentInDM = true

        })
      }
      else if (obj.fileType == 'join') {
        obj.sheetList.forEach((childJoinObj: any) => {
          childJoinObj.mergeFieldListDTO.forEach((grandJoinChild: any) => {
            if (existingColumns.includes(grandJoinChild.showTabColName))
              grandJoinChild.isSelectAllChildInDM = true
          })

          chkUnchkMapList = childJoinObj.mergeFieldListDTO.map((x: any) => x.isSelectAllChildInDM)
          if (chkUnchkMapList.includes(false)) childJoinObj.isSelectAllParentInDM = false
          else childJoinObj.isSelectAllParentInDM = true

        })
      }
      else if (obj.fileType == 'files') {
        obj.sheetList.forEach((childFileObj: any) => {
          childFileObj.sheet.forEach((grandFileChild: any) => {
            if (existingColumns.includes(grandFileChild.showTabColName)) {
              grandFileChild.isSelectAllChildInDM = true
            }
          })

          chkUnchkMapList = childFileObj.sheet.map((x: any) => x.isSelectAllChildInDM)
          if (chkUnchkMapList.includes(false)) childFileObj.isSelectAllParentInDM = false
          else childFileObj.isSelectAllParentInDM = true
        })
      }
    })

    this.allDatasetDetailsList.forEach((dsObj: any) => {
      dsObj.datasetFieldDTOList.forEach((childDsObj: any) => {
        if (existingColumns.includes(childDsObj.sourceFieldName)) childDsObj.isSelectAllChildInDM = true


      })
      chkUnchkMapList = dsObj.datasetFieldDTOList.map((x: any) => x.isSelectAllChildInDM)
      if (chkUnchkMapList.includes(false)) dsObj.isSelectAllParentInDM = false
      else dsObj.isSelectAllParentInDM = true
    })


  }

  searchfx: any[] = [];

  applyFilter(event: any, type: any) {
    //underconstruction
    //this.searchfx = this.fx.filter((user: any) => this.containsValue(user, event.target.value.trim().toLowerCase()));
    // //console.log("msg",this.messagesSearch);
    // this.fx = of(this.messagesSearch);
    console.log('this.allDatasetDetailsListForSearch', this.allDatasetDetailsListForSearch);
    console.log('this.sourceFilesAppendJoinFileListForSearch', this.sourceFilesAppendJoinFileListForSearch);

    if (type == 'UF') {
      this.dataSource = this.search(this.fileListtForSearch.filteredData, event.target.value, 'UF')
    }
    else if (type == 'TF') {
      this.masterCheckedFalseInTF() //need to check
      this.targetFileList = this.search(this.tartargetFileListForSearch, event.target.value, 'TF')
    }
    else if (type == 'A') this.sourceFilesList = this.search(this.sourceFilesListForSearch, event.target.value, 'A')
    else if (type == 'J') this.append_SourceFilesList = this.search(this.append_SourceFilesListForSearch, event.target.value, 'J')
    else if (type == 'DS') this.allDatasetDetailsList = this.search(this.allDatasetDetailsListForSearch, event.target.value, 'DS')
    else if (type == 'parentInCreateDSPopup') {
      this.searchValueInCreateDSPopup = event.target.value
      this.sourceFilesAppendJoinFileList = this.search(this.sourceFilesAppendJoinFileListForSearch, this.searchValueInCreateDSPopup, 'parentInCreateDSPopup')
      this.allDatasetDetailsList = this.search(this.allDatasetDetailsListForSearch, this.searchValueInCreateDSPopup, 'DS')
    }
    else if (type == 'parentInColumnPopup') {
      this.searchValueInColumnPopup = event.target.value
      this.sourceFilesAppendJoinFileList2 = this.search(this.sourceFilesAppendJoinFileListForSearch, this.searchValueInColumnPopup, 'parentInCreateDSPopup')
      this.allDatasetDetailsList2 = this.search(this.allDatasetDetailsListForSearch, this.searchValueInColumnPopup, 'DS')
    }
    else if (type == 'fx') {
      this.searchfx = this.search(this.fx, event.target.value, 'fx')
    }
  }

  search(array: any, args: any, type: any) {
    if (type == 'UF') return array.filter((val: any) => val.fileNameWithExt?.toLocaleLowerCase()?.trim().includes(args?.toLocaleLowerCase()?.trim()))
    else if (type == 'TF') return array.filter((val: any) => val.fileName?.toLocaleLowerCase()?.trim().includes(args?.toLocaleLowerCase()?.trim()))
    else if (type == 'A') return array.filter((val: any) => val.fileName?.toLocaleLowerCase()?.trim().includes(args?.toLocaleLowerCase()?.trim()))
    else if (type == 'J') return array.filter((val: any) => val.tableNameUI?.toLocaleLowerCase()?.trim().includes(args?.toLocaleLowerCase()?.trim()))
    else if (type == 'DS') return array.filter((val: any) => val.datasetName?.toLocaleLowerCase()?.trim().includes(args?.toLocaleLowerCase()?.trim()))
    else if (type == 'parentInCreateDSPopup') {
      let result = array.map((obj: any) => {
        return {
          ...obj, "sheetList": obj.sheetList.filter((y: any) => y.tableNameUI?.toLocaleLowerCase()?.trim().includes(args?.toLocaleLowerCase()?.trim()))
        };
      });
      return result;
    }
    else if (type == 'fx') {
      return array.filter((val: any) => val.functionName?.toLocaleLowerCase()?.trim().includes(args?.toLocaleLowerCase()?.trim()))
      // return array.filter((p: any) => p).map((p: any) => {
      //   let child = p.funcDescritptionsList.filter((s: any) =>
      //     s.functionType
      //       .toLowerCase()
      //       .includes(args.toLowerCase())
      //   );
      //   return p.functionName
      //     .toLowerCase()
      //     .includes(args.toLowerCase())
      //     ? { ...p, funcDescritptionsList: child }
      //     : child.length > 0
      //       ? { ...p, funcDescritptionsList: child }
      //       : {};
      // }).filter((valu: any) => Object.keys(valu).length !== 0);
    }
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
  selectuser(e: any, item: any) {
    const value = e.value;
  }

  selectgroupByOrderByInDM(e: any, item: any, i: number, type: any) {
    const selectedList = e.value;
    let allFiles = e.value.map((x: any) => x.dbtablefieldName).join();

    if (type == 'groupby')
      this.datasetDetailsList.filter(
        (x: any) => x.isDatasetTableExpand == true
      )[0].groupBy = allFiles;
    if (type == 'orderby')
      this.datasetDetailsList.filter(
        (x: any) => x.isDatasetTableExpand == true
      )[0].orderBy = allFiles;
  }

  //DM
  allTableListInDM: any[] = [];
  allTableListWithoutDSInDM: any[] = [];
  allList(item: any) {
    this.allTableListInDM = [];
    this.sourceFilesAppendJoinFileListForJoin.forEach((fileObj: any, index: number) => {
      //let columnList: any[] = [];
      if (fileObj.fileType == 'append')
        fileObj.sheetList.forEach((TabObj: any) => {
          TabObj.tableAppendFieldsDto.forEach((colObj: any) => {
            (colObj.fileType = fileObj.fileType),
              (colObj.fieldIDforExpn = colObj.fieldID); //for expn
          });
          this.allTableListInDM.push({
            fileType: fileObj.fileType,
            tableNameUI: TabObj.appendName,
            tableNameDB: TabObj.tableName,
            idName: 'appendID',
            ID: TabObj.appendID,
            appendID: TabObj.appendID,
            columnList: TabObj.tableAppendFieldsDto,
            isSelecteddl: false,
          });
        });
      else if (fileObj.fileType == 'join') {
        fileObj.sheetList.forEach((TabObj: any) => {
          TabObj.mergeFieldListDTO.forEach((colObj: any) => {
            (colObj.fileType = fileObj.fileType),
              (colObj.fieldIDforExpn = colObj.columnId); //for expn
          });
          this.allTableListInDM.push({
            fileType: fileObj.fileType,
            tableNameUI: TabObj.mergeName,
            tableNameDB: TabObj.tableName,
            idName: 'mergeId',
            ID: TabObj.mergeId,
            mergeId: TabObj.mergeId,
            columnList: TabObj.mergeFieldListDTO,
            isSelecteddl: false,
          });
        });
      } else if (fileObj.fileType == 'files') {
        fileObj.sheetList.forEach((TabObj: any) => {
          if (TabObj.sheet != null) {
            TabObj.sheet.forEach((colObj: any) => {
              (colObj.fileType = fileObj.fileType),
                (colObj.fieldIDforExpn = colObj.columnId); //for expn
            });
          }
          this.allTableListInDM.push({
            fileType: fileObj.fileType,
            tableNameUI: TabObj.fileName,
            tableNameDB: TabObj.tableName,
            idName: 'templateId',
            ID: TabObj.templateId,
            templateId: TabObj.templateId,
            columnList: TabObj.sheet,
            isSelecteddl: false,
          });
        });
      }
    });
    this.allTableListWithoutDSInDM = [];
    this.allTableListWithoutDSInDM = JSON.parse(
      JSON.stringify(this.allTableListInDM)
    );
    console.log('getall()', this.allTableListInDM);
    this.getAllDataSetNameAPI(item);
  }

  closeDatasetPopup() {
    this.dataSetForm.controls.DSetRows = this.fb.array([]);
    this.saveDataSetPopup = false;
  }

  //datasetDetailsListShowList: any[] = [];
  selectedColumnsOfDS: any[] = []; //can b remvd
  saveDataSetPopup: boolean = false;
  dropDownsInDS: any[] = [];
  // enableDatasetColumnsExceed: boolean = false; //x
  // saveDatasetRowsLength: any = {};//x
  saveDataSet(obj: any, i: number) {
    // this.saveDatasetRowsLength = {};//x
    const expandTableTrue = this.datasetDetailsList.filter(
      (x: any) => x.isDatasetTableExpand
    );
    if (expandTableTrue[0].datasetFieldDTOList.length == 0) return;
    if (expandTableTrue[0].datasetFieldDTOList.length > 75) {
      // this.enableDatasetColumnsExceed = true; //need to implement
      // this.saveDatasetRowsLength.length =
      //   expandTableTrue[0].datasetFieldDTOList.length;
      this.popup.open(false, 'Current Dataset has ' + expandTableTrue[0].datasetFieldDTOList.length + `columns. It shouldn't exceed 75 columns`)
      return;
    }
    let tablesInExpression: Array<any> = [];
    this.submitedDS = false;
    this.selectedColumnsOfDS = [];
    obj?.datasetFieldDTOList.forEach((ds: any) => {
      let tableName: any;
      if (ds.sourceFieldName.includes('[')) {
        tableName = ds.sourceFieldName.split('[')[0];
      } else {
        tableName = ds.tableName;
      }

      const sourceFieldName = ds.sourceFieldName;
      this.allTableListInDM.forEach((tabObj: any) => {
        expandTableTrue[0].datasetFieldDTOList.forEach((datasetField: any) => {
          //extract tablecolumns from expn
          let expn = datasetField.sourceExpressionName;
          if (expn != null) {
            this.tablecolNameList.forEach((obj: any) => {
              if (expn.includes(obj.showTabColName)) {
                tablesInExpression.push(obj.tableNameUI);
              }
            });
          }
        });

        if (tabObj.fileType == 'files') {
          if (tabObj.tableNameUI == tableName) {
            let fFileSheet = this.selectedColumnsOfDS.filter(
              (x: any) => x.tableNameUI == tabObj.tableNameUI
            );
            if (fFileSheet.length == 0) {
              this.selectedColumnsOfDS.push({ ...tabObj, isSelecteddl: false });
            }
          }
        } else {
          if (tabObj.tableNameUI == tableName) {
            let tblLength = this.selectedColumnsOfDS.filter(
              (x: any) => x.tableNameUI == tabObj.tableNameUI
            );
            if (tblLength.length == 0) {
              this.selectedColumnsOfDS.push({ ...tabObj, isSelecteddl: false });
            }
          }
        }
      });
    });

    tablesInExpression = [...new Set(tablesInExpression)];

    tablesInExpression.forEach((tableName: any) => {
      this.allTableListInDM.forEach((tabObj: any) => {
        if (tableName.includes(tabObj.tableNameUI)) {
          let tblLength = this.selectedColumnsOfDS.filter(
            (x: any) => x.tableNameUI == tableName
          );
          if (tblLength.length == 0) {
            this.selectedColumnsOfDS.push({ ...tabObj, isSelecteddl: false });
          }
        }
      });
    });
    // this.selectedColumnsOfDS.forEach((object: any, index: number) => {
    //   if (object.tableNameUI == expandTableTrue[0].datasetName) this.selectedColumnsOfDS.splice(index, 1)
    // })
    console.log('this.selectedColumnsOfDS', this.selectedColumnsOfDS);

    if (this.selectedColumnsOfDS.length < 2) {
      let datasetObj: any = {};
      datasetObj.processId = this.process.processId;
      datasetObj.userId = this.userInfo.userId;

      if (this.selectedColumnsOfDS.length == 1) {
        if (this.selectedColumnsOfDS[0].fileType == 'append')
          datasetObj.dataSetMergeListDTOs = [
            {
              primaryTemplateId: this.selectedColumnsOfDS[0].ID,
              primaryTableName: this.selectedColumnsOfDS[0].tableNameDB,
            },
          ];
        else if (this.selectedColumnsOfDS[0].fileType == 'join')
          datasetObj.dataSetMergeListDTOs = [
            {
              primaryTemplateId: this.selectedColumnsOfDS[0].ID,
              primaryTableName: this.selectedColumnsOfDS[0].tableNameDB,
            },
          ];
        else if (this.selectedColumnsOfDS[0].fileType == 'files')
          datasetObj.dataSetMergeListDTOs = [
            {
              primaryTemplateId: this.selectedColumnsOfDS[0].ID,
              primaryTableName: this.selectedColumnsOfDS[0].tableNameDB,
            },
          ];
        else if (this.selectedColumnsOfDS[0].fileType == 'dataset')
          datasetObj.dataSetMergeListDTOs = [
            {
              primaryTemplateId: this.selectedColumnsOfDS[0].ID,
              primaryTableName: this.selectedColumnsOfDS[0].tableNameDB,
            },
          ];
      } else if (this.selectedColumnsOfDS.length == 0) {
        datasetObj.dataSetMergeListDTOs = [];
      }
      const colList: any[] = [];
      const expandTableTrue = this.datasetDetailsList.filter(
        (x: any) => x.isDatasetTableExpand
      );
      expandTableTrue[0].datasetFieldDTOList.forEach((datasetField: any) => {
        if (datasetField.sourceExpressionName != null) {
          if (
            datasetField.sourceExpressionName.trim() == '' ||
            datasetField.sourceExpressionName.trim().length == 0
          )
            datasetField.sourceExpressionName = null;
        }
        let expn = datasetField.sourceExpressionName;
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
        let tableNameForManualColumnName!: string;
        if (expn != null) {
          this.tablecolNameList.forEach((obj: any) => {
            if (expn.includes(obj.showTabColName)) {
              expn = JSON.parse(
                JSON.stringify(
                  expn.split(obj.showTabColName).join(obj.tableColumnName)
                )
              );
              tableNameForManualColumnName = obj.tableNameDB;
            }
          });
        }
        //  }
        if (datasetField.tableName == undefined)
          datasetField.tableName = tableNameForManualColumnName;
        if (!datasetField.isColumnType) datasetField.columnFormat = 'yyyy/mm/dd'


        colList.push({
          tableName: datasetField.tableName,
          excludeInSelect: datasetField.excludeInSelect,
          columnFormat: datasetField.columnFormat,
          columnName: datasetField.columnName,
          fieldName: datasetField.fieldName,
          expression: expn,
          columnType: datasetField.columnType,
          where: datasetField.where,
          or: datasetField.or,
          groupBy: '',
          sourceFieldName: datasetField.sourceFieldName,
          sourceExpressionName: datasetField.sourceExpressionName,
        });
      });
      datasetObj.datasetFieldDTOList = colList;
      datasetObj.datasetName = this.datasetForm.controls.appendNameControl.value;

      let groupByVal = this.datasetTableForm.get('groupBy')?.value;
      let havingVal = this.datasetTableForm.get('having')?.value;
      let orderByVal = this.datasetTableForm.get('orderBy')?.value;
      if (groupByVal == '') datasetObj.groupBy = null;
      else datasetObj.groupBy = groupByVal.join();

      if (orderByVal == '') datasetObj.orderBy = null;
      else datasetObj.orderBy = orderByVal.join();
      if (havingVal != null) {
        if (havingVal.trim() == '') datasetObj.having = null;
        else datasetObj.having = havingVal;
      }
      datasetObj.calender = '';
      let whereQuery: any[] = [];
      let uiWhere: any[] = [];
      this.whereArrInDS().controls.forEach((whereObj: any, index: number) => {
        //console.log(whereObj);
        console.log(whereObj.controls.column.value);
        console.log(whereObj.controls.signOperator.value);
        // console.log(whereObj.controls.value.value);
        let column = whereObj.controls.column.value.dbtablefieldName;
        let signOperator = whereObj.controls.signOperator.value;
        let value: any
        if (whereObj.controls.value != undefined) value = whereObj.controls.value.value;
        if (index == 0) {
          if (signOperator != '') {
            if (signOperator == 'IS NULL' || signOperator == 'IS NOT NULL') {
              whereQuery = [column + ' ' + signOperator];
            } else {
              whereQuery = [column + ' ' + signOperator + ' ' + value];
            }
          }
          if (signOperator == 'IS NULL' || signOperator == 'IS NOT NULL')
            uiWhere.push({
              fieName: whereObj.controls.column.value.filefieldName,
              signOperator: signOperator,
              value: '',
            });
          else
            uiWhere.push({
              fieName: whereObj.controls.column.value.filefieldName,
              signOperator: signOperator,
              value: value,
            });
        } else {
          console.log(whereObj.controls.operator.value);
          let operator = whereObj.controls.operator.value;
          let x: any;
          if (signOperator != '') {
            if (signOperator == 'IS NULL' || signOperator == 'IS NOT NULL') {
              x = operator + ' ' + column + ' ' + signOperator;
            } else {
              x = operator + ' ' + column + ' ' + signOperator + ' ' + value;
            }
          }
          whereQuery.push(x);

          if (signOperator == 'IS NULL' || signOperator == 'IS NOT NULL')
            uiWhere.push({
              operator: operator,
              fieName: whereObj.controls.column.value.filefieldName,
              signOperator: signOperator,
              value: '',
            });
          else
            uiWhere.push({
              operator: operator,
              fieName: whereObj.controls.column.value.filefieldName,
              signOperator: signOperator,
              value: value,
            });
        }
      });

      datasetObj.where = whereQuery.join(' ');
      datasetObj.uiWhere = JSON.stringify(uiWhere);
      // if (expandTableTrue[0].groupBy.trim() == '' || expandTableTrue[0].groupBy.trim().length == 0) datasetObj.groupBy = null;
      // else datasetObj.groupBy = expandTableTrue[0].groupBy;

      // if (expandTableTrue[0].orderBy.trim() == '' || expandTableTrue[0].orderBy.trim().length == 0) datasetObj.orderBy = null;
      // else datasetObj.orderBy = expandTableTrue[0].orderBy;

      // if (expandTableTrue[0].having.trim() == '' || expandTableTrue[0].having.trim().length == 0) datasetObj.having = null;
      // else datasetObj.having = expandTableTrue[0].having;

      datasetObj.calender = '';
      this.progressBar = []
      this.progressBarPopup = true
      if (expandTableTrue[0].datasetId)
        datasetObj.datasetId = expandTableTrue[0].datasetId;


      this.solService.addDataset(datasetObj).subscribe(
        async (res: any) => {
          console.log('call addDS');
          // this.allTableListInDM.forEach((obj: any, index: number) => {
          //   if (obj.fileType == 'dataset') {
          //     console.log('splice ds');

          //     this.allTableListInDM.splice(index, 1) //removing from list for rem duplicts
          //   }
          // })
          console.log(res);

          if (res.type == HttpEventType.UploadProgress) {
            this.progressBar = [{ percentage: Math.round((70 / res.total) * res.loaded) }];
            console.log('this.progressBar ', this.progressBar);

          } else if (res.type == HttpEventType.Response) {
            this.progressBar = [];

            this.progressBarPopup = false


            await this.getAllDataSetNameAPI({ id: 5 });

            this.loader.hide();
            //expandTableTrue[0].isDatasetTableExpand = false;
            this.unChecksAllInDM(false);
            this.enableDataSetPopUp = false
            this.createExpressionList = []; //clearing CE,DS list //can b removed
            this.datasetDetailsList = [];//can b removed 
            this.popup.open(true, 'Dataset saved successfully !')
          }

        },
        (err: any) => {
          this.popup.open(false, 'Dataset save failed !')
          this.progressBarPopup = false
          this.loader.hide();
        }
      );
    } else {
      this.dataSetForm.controls.DSetRows = this.fb.array([]);
      //formarr creation
      this.dataSetData = [];

      let primaryTableList: any = [];
      //primaryTableList.primaryKeyList = []

      let foreignTableList: any = [];
      //foreignTableList.foreignKeyList = []

      this.selectedColumnsOfDS.forEach((obj: any) => {
        primaryTableList.push(obj);
      });

      let dataset111 = {
        searchValuePT: '',
        searchValueFT: '',
        primaryTableList,
        foreignTableList,
        order: 1,
        columns: [{ primaryKeyList: [], foreignKeyList: [] }],
      };

      for (let i = 0; i < this.selectedColumnsOfDS.length - 1; i++) {
        if (i == 0) this.dataSetData.push(dataset111);
        else {
          primaryTableList = [];
          primaryTableList.primaryKeyList = [];
          this.dataSetData.push({
            searchValuePT: '',
            searchValueFT: '',
            primaryTableList,
            foreignTableList,
            columns: [{ primaryKeyList: [], foreignKeyList: [] }],
            order: i + 2,
          });
        }
        this.DataSetArr().controls.push(this.DataSetRow());
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
        this.dataSetData[j].Join = '';
        this.dataSetData[j].primaryTableList = [];
        this.dataSetData[j].foreignTableList = [];
        this.DataSetArr().controls[i].get('join')?.reset();
      }
      if (j == i) {
        this.dataSetData[j].foreignTableList = [];
        this.DataSetArr().controls[i].get('Ftable')?.reset();
        this.DataSetArr().controls[i].get('join')?.reset();
      }
      if (j >= i) {
        this.columnArrInDS(j).clear();
        this.columnArrInDS(j).push(this.addColumnInDS());
        this.dataSetData[j].columns = [
          { primaryKeyList: [], foreignKeyList: [] },
        ];
      }
    });

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
      column.searchValuePK = '';
      column.searchValueFK = '';
    });
    this.dataSetData[i].columns[0].primaryKeyList = e.value.columnList; //childArr
    if (i == 0) {
      // let filteredForFT = JSON.parse(JSON.stringify(this.dataSetData[i].primaryTableList.filter((x: any) => !x.isSelecteddl))) //ft
      // this.dataSetData[i].foreignTableList = filteredForFT
      this.dataSetData[0].primaryTableList.forEach((object: any) => {
        if (this.DataSetArr().controls[i].value.Ptable.ID != object.ID)
          this.dataSetData[i].foreignTableList.push(object);
      });
    } else {
      // let xSList = this.dataSetData[i - 1].foreignTableList.filter((x: any) => !x.isSelecteddl) //can b written in i=0 ft
      // this.dataSetData[i].foreignTableList = xSList
      let xSecondaryIds = this.dataSetData[i].primaryTableList.map(
        (x: any) => x.ID
      );

      this.dataSetData[0].primaryTableList.forEach((element: any) => {
        if (!xSecondaryIds.includes(element.ID)) {
          this.dataSetData[i].foreignTableList.push(element);
        }
      });
    }
  }

  selectJoinTypeInDS(e: any, i: any) {
    this.dataSetData[i].Join = e.value;
    console.log(this.dataSetData);
  }
  selectForeignTableInDS(e: any, i: any) {
    this.dataSetData.forEach((obj: any, j: number) => {
      if (j > i) {
        this.DataSetArr().controls[j].get('join')?.reset();
        this.dataSetData[j].primaryTableList = [];
        this.dataSetData[j].foreignTableList = [];
        this.dataSetData[j].columns = [
          { primaryKeyList: [], foreignKeyList: [] },
        ];
      }
      if (j == i) {
        this.dataSetData[j].columns[0].foreignKeyList = [];
        this.dataSetData[j].columns.splice(
          1,
          this.dataSetData[j].columns.length
        );

        if (this.DataSetArr().controls[j + 1] != undefined)
          this.DataSetArr().controls[j + 1].get('Ptable')?.reset();
      }
      if (j >= i) {
        this.columnArrInDS(j).clear();
        this.columnArrInDS(j).push(this.addColumnInDS());
      }
    });

    // this.dataSetData[i].foreignTableList.forEach((ele: any) => JSON.parse(JSON.stringify(ele)).isSelecteddl = false)
    // this.dataSetData[i].foreignTableList.forEach((element:any)=>{
    //   if(element.tableNameUI == e.value.tableNameUI) element.isSelecteddl = true
    // })

    //e.value.isSelecteddl = true;
    // this.dataSetData[i].foreignKeyList = e.value.columnList;
    this.dataSetData[i].columns[0].foreignKeyList = e.value.columnList; //childArr
    if (i == 0) {
      let combinedList: any[] = [];
      combinedList.push(this.DataSetArr().controls[i].value.Ptable);
      combinedList.push(this.DataSetArr().controls[i].value.Ftable);

      // let sPT = this.dataSetData[i].primaryTableList.filter((x: any) => x.isSelecteddl)
      // let sFT = this.dataSetData[i].foreignTableList.filter((x: any) => x.isSelecteddl)
      // sPT.forEach((obj: any) => combinedList.push(obj))
      // sFT.forEach((obj: any) => combinedList.push(obj))
      // combinedList.forEach((obj: any) => JSON.parse(JSON.stringify(obj)).isSelecteddl = false)
      if (this.dataSetData[i + 1] != undefined)
        this.dataSetData[i + 1].primaryTableList = combinedList;
    } else {
      let combinedList: any[] = [];
      this.dataSetData[i].primaryTableList.forEach((element: any) => {
        combinedList.push(element);
      });
      combinedList.push(this.DataSetArr().controls[i].value.Ftable);

      // let sFT = this.dataSetData[i].foreignTableList.filter((x: any) => x.isSelecteddl)
      // list.forEach((obj: any) => combinedList.push(obj))
      // sFT.forEach((obj: any) => combinedList.push(obj))
      // combinedList.forEach((obj: any) => JSON.parse(JSON.stringify(obj)).isSelecteddl = false) //copy
      if (this.dataSetData[i + 1] != undefined)
        this.dataSetData[i + 1].primaryTableList = combinedList; //
    }
  }

  selectPrimaryKeyInDS(e: any, j: any, i: any) {
    //this.dataSetData[i].columns.splice(j + 1, this.dataSetData[i].columns.length)
    //this.columnArrInDS(i).removeAt(j + 1)

    let originalPKList = JSON.parse(
      JSON.stringify(this.dataSetData[i].columns[j].primaryKeyList)
    );
    originalPKList.forEach((obj: any, index: any) => {
      if (obj.fieldIDforExpn == e.value.fieldIDforExpn) {
        originalPKList.splice(index, 1);
      }
    });

    if (this.dataSetData[i].columns[j + 1] == undefined) {
      this.dataSetData[i].columns.push({
        primaryKeyList: originalPKList,
        searchValuePK: '',
        searchValueFK: '',
      });
    } else this.dataSetData[i].columns[j + 1].primaryKeyList = originalPKList;

    // push()
  }
  selectForeignKeyInDS(e: any, j: any, i: any) {
    //this.dataSetData[i].columns.splice(j + 1, this.dataSetData[i].columns.length)
    //this.columnArrInDS(i).removeAt(j + 1)

    let originalPKList = JSON.parse(
      JSON.stringify(this.dataSetData[i].columns[j].foreignKeyList)
    );
    originalPKList.forEach((obj: any, index: any) => {
      if (obj.fieldIDforExpn == e.value.fieldIDforExpn) {
        originalPKList.splice(index, 1);
      }
    });

    if (this.dataSetData[i].columns[j + 1] == undefined) {
      this.dataSetData[i].columns.push({
        foreignKeyList: originalPKList,
        searchValuePK: '',
        searchValueFK: '',
      });
    } else this.dataSetData[i].columns[j + 1].foreignKeyList = originalPKList;
  }

  addcolumnRowInDS(j: any, i: any) {
    let len = this.columnArrInDS(i).length;
    if (
      this.columnArrInDS(i).controls[len - 1].get('column1')?.value == '' ||
      this.columnArrInDS(i).controls[len - 1].get('column2')?.value == ''
    )
      return;
    let p = 0;
    this.dataSetData[i].columns.forEach((element: any) => {
      if (
        element?.primaryKeyList.length == 0 ||
        element?.foreignKeyList.length == 0
      )
        p = 1;
    });
    if (p == 1) return;
    this.columnArrInDS(i).push(this.addColumnInDS());
  }

  deletecolumnRowInDS(j: any, i: any) {
    this.columnArrInDS(i).removeAt(j);
    this.dataSetData[i].columns.splice(
      j + 1,
      this.dataSetData[i].columns.length
    );

  }

  add_SaveCreateExpression(obj: any) {
    //console.log('obj',obj);

    console.log('this.createExpressionForm', this.createExpressionForm);
    // if (obj.sourceFieldName == '') {
    obj.sourceFieldName =
      this.createExpressionForm.get('sourceFieldName')?.value;
    obj.excludeInSelect =
      this.createExpressionForm.get('excludeInSelect')?.value;
    obj.columnType = this.createExpressionForm.get('columnType')?.value;
    if (obj.isColumnType == true)
      obj.columnFormat = this.createExpressionForm.get('columnFormat')?.value;
    obj.sourceExpressionName = this.createExpressionForm.get(
      'sourceExpressionName'
    )?.value;
    // }
    this.submited1 = true; //validation
    if (obj.sourceFieldName.trim() == '' || obj.columnType == '') {
      this.popup.open(false, 'Enter All the Required Fields');
      // this.toast.error({
      //   title: 'Error',
      //   message: 'Enter All the Required Fields',
      // });
      return;
    }
    if (obj.sourceFieldName.includes('[')) {
      this.createExpressionForm.controls.sourceFieldName.disable()
    } else {
      this.createExpressionForm.controls.sourceFieldName.enable()
    }


    if (obj.sourceFieldName.trim() == '') return; //xShd empty
    const filteredList = this.datasetDetailsList.filter(
      (x: any) => x.isDatasetTableExpand == true
    );
    const dsDTOList = filteredList[0]?.datasetFieldDTOList;
    let p = 0;
    if (dsDTOList.length != 0) {
      dsDTOList.forEach((ele: any) => {
        if (!obj.isEdit) {
          if (ele.sourceFieldName == obj.sourceFieldName.trim()) p = 1;
        } else if (!ele.isEdit) {
          //false
          if (ele.sourceFieldName == obj.sourceFieldName.trim()) p = 1;
        }
      });
    }
    if (p == 1) return; //coljumn name is already present in list

    //groupby-orderby
    let selectedColumn: any;
    selectedColumn = this.allTableListInDM
      .filter((element: any) =>
        element.columnList.some(
          (subElement: any) => subElement.showTabColName == obj.sourceFieldName
        )
      )
      .map((element: any) => {
        return Object.assign({}, element, {
          columnList: element.columnList.filter(
            (subElement: any) =>
              subElement.showTabColName == obj.sourceFieldName
          ),
        });
      });

    if (selectedColumn.length != 0) {
      // append,join,DS,file
      obj.tableName = selectedColumn[0].tableNameDB;
    }

    let fieName: any;
    let tblName: any;
    let colName: any;
    if (selectedColumn.length != 0) {
      fieName = selectedColumn[0].columnList[0].columnName;
      colName = selectedColumn[0].columnList[0].fieldName;
      //if (selectedColumn[0].fileType == 'files') tblName = selectedColumn[0].tableNameDB
      //else
      tblName = selectedColumn[0].tableNameDB;
    }
    let t_fNameForOGBy = tblName + '.' + fieName;
    let o_gByObj: any = {};
    let columnsListForWherObj: any = {};
    if (selectedColumn.length == 0) {
      //manual column name
      let manualColNameExpn = null;
      this.tablecolNameList.forEach((element: any) => {
        if (obj.sourceExpressionName == element.showTabColName)
          manualColNameExpn = element.tableNameDB + '.' + element.columnName;
      });
      o_gByObj = {
        filefieldName: obj.sourceFieldName,
        dbtablefieldName: manualColNameExpn,
      };
      columnsListForWherObj = {
        filefieldName: obj.sourceFieldName,
        dbtablefieldName: manualColNameExpn,
        dataType: obj.columnType,
      };
      obj.columnName = obj.sourceFieldName;
      obj.fieldName = obj.sourceFieldName;
    } else {
      o_gByObj = {
        filefieldName: obj.sourceFieldName,
        dbtablefieldName: t_fNameForOGBy,
      };
      columnsListForWherObj = {
        filefieldName: obj.sourceFieldName,
        dbtablefieldName: t_fNameForOGBy,
        dataType: selectedColumn[0].columnList[0].columnType,
      };
      obj.columnName = fieName; //assigning field,col Names
      obj.fieldName = colName;
    }
    if (!obj.isEdit) {
      //if edit false
      filteredList[0].orderBytoDB.push(o_gByObj);
      filteredList[0].groupBytoDB.push(o_gByObj);
      this.columnsForWhereInDS.push(columnsListForWherObj); //2jan
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
        dsDTOList.push(obj);
      } else {
        dsDTOList.forEach((element: any, index: number) => {
          if (element.isEdit) {
            obj.isEdit = false;
            dsDTOList.splice(index, 1, obj);
          }
        });
      }
    }
    // this.createExpressionList = [
    //   {
    //     excludeInSelect: false,
    //     sourceFieldName: '',
    //     expression: '',
    //     columnId: '',
    //     columnFormat: '',
    //     signOperatorList: '',
    //     isEdit: false,
    //     columnType: '',
    //     where: '',
    //     or: '',
    //     groupBy: '',
    //     value: '',
    //     signOperator: '',
    //     whereList: [],
    //   },
    // ];
    this.UpdatechecksInDM(obj, true);
    //this.createExpressionForm.reset();
    this.submited1 = false;
    this.enableCreateExpression = false
  }

  deleteTableDetails: any;
  enableDeletePopup: boolean = false;
  deleteTables(e: Event, item: any, index: number, type: any) {
    console.log('e: ', e);
    console.log('item: ', item);
    this.deleteTableDetails = { item, type };
    this.enableDeletePopup = true;
    // })
  }

  deleteTable(item: any, type: any) {
    // let item = this.deleteTableDetails.item
    // let type = this.deleteTableDetails.type
    let data: any = {
      type: type,
      operation: 'delete',
    };
    if (type == 'file') data.id = item.fileId;
    else if (type == 'append') data.id = item.appendID;
    else if (type == 'merge') data.id = item.mergeId;
    else if (type == 'dataset') data.id = item.datasetId;
    // this.solService.deleteTables({id:item.appendID, type:'append', operation:'check'}).subscribe((res:any)=>{
    //   console.log(res);
    this.solService.deleteTables(data).subscribe(
      (res: any) => {
        console.log(res);
        this.enableDeletePopup = false;

        // if (type == 'file')
        //   this.fileListt.splice(
        //     this.getJoinFilesList.findIndex(
        //       (ele) => ele.fileId === item.fileId
        //     ),
        //     1
        //   );
        // else if (type == 'append')
        //   this.getAppendFilesList.splice(
        //     this.getAppendFilesList.findIndex(
        //       (ele) => ele.appendID === item.appendID
        //     ),
        //     1
        //   );
        // else if (type == 'merge')
        //   this.getJoinFilesList.splice(
        //     this.getJoinFilesList.findIndex(
        //       (ele) => ele.mergeId === item.mergeId
        //     ),
        //     1
        //   );
        // else if (type == 'dataset') {
        //   this.allDatasetDetailsList.splice(
        //     this.allDatasetDetailsList.findIndex(
        //       (ele) => ele.datasetId === item.datasetId
        //     ),
        //     1
        //   );
        //   this.datasetDetailsList.forEach((dsObj: any, i: number) => {
        //     if (dsObj.datasetId === item.datasetId)
        //       this.datasetDetailsList.splice(i, 1);
        //   });
        //   if (this.datasetDetailsList.length == 0) {
        //     this.createExpressionList = [];
        //   }
        // }
        if (type == 'file') this.getAllFileTemplateListByProcessID({ id: 1 })
        else if (type == 'append') this.getAppendFilesApi()
        else if (type == 'merge') this.getJoinFilesListApi()
        else if (type == 'dataset') {
          this.getAllDataSetNameAPI({ id: 5 })
          if (this.datasetDetailsList.length == 0) {
            this.createExpressionList = []
          }
        }
        if (type == 'file')
          this.popup.open(true, item.fileNameWithExt + ' ' + 'Deleted Successfully !');
        // this.toast.success({
        //   title: 'Success',
        //   message: item.fileNameWithExt + ' ' + 'Deleted Successfully !',
        // });
        else if (type == 'append')
          this.popup.open(true, item.appendName + ' ' + 'Deleted Successfully !');
        // this.toast.success({
        //   title: 'Success',
        //   message: item.appendName + ' ' + 'Deleted Successfully !',
        // });
        else if (type == 'merge')
          this.popup.open(true, item.mergeName + ' ' + 'Deleted Successfully !');
        // this.toast.success({
        //   title: 'Success',
        //   message: item.mergeName + ' ' + 'Deleted Successfully !',
        // });
        else if (type == 'dataset')
          this.popup.open(true, item.datasetName + ' ' + 'Deleted Successfully !');
        // this.toast.success({
        //   title: 'Success',
        //   message: item.datasetName + ' ' + 'Deleted Successfully !',
        // });
      },
      (err: any) => {
        this.enableDeletePopup = false;
        if (type == 'file') this.popup.open(false, item.fileNameWithExt + ' ' + 'Delete Failed !');
        else if (type == 'append') this.popup.open(false, item.appendName + ' ' + 'Delete Failed !');
        else if (type == 'merge') this.popup.open(false, item.mergeName + ' ' + 'Delete Failed !')
        else if (type == 'dataset') this.popup.open(false, item.datasetName + 'Delete Failed !')
      }
    );
  }

  existDataset() {
    console.log(this.sqlScriptForm.value.datasetName);
    // this.solService.getExistDataset(this.appendNameControl.value).subscribe((res: any) => {

    //   console.log(res);
    // }, (err: any) => {
    //   this.toast.error({ title: 'Error', message: "Dataset Name Already Exists" });
    // })
  }

  // selectedIndexFilterAppend: any;
  // selectedIndexFilterJoin: any;
  // selectedIndexFilterFiles: any;
  // selectedIndexFilterDataset: any; //
  // filteredDataAppend: any;
  // filteredDataJoin: any;
  // filteredDataFiles: any;
  // filteredDataDataset: any;
  applyFilterForDMTables(e: any, item: any, i: number, fileType: any) {
    console.log('e', e);
    console.log(fileType);
    console.log('item', item);


    if (fileType == 'append' || fileType == 'join' || fileType == 'files' || fileType == 'dataset') {
      item.searchValueInCreateDatasetPopup = e.target.value
      item.searchValueInColumnPopup = e.target.value
    }
  }

  selectAllInDM(fileType: any, item: any) {
    console.log(fileType, item);
    let allSourceColsInDS: Array<any> = [];
    if (this.datasetDetailsList.length != 0)
      allSourceColsInDS = this.datasetDetailsList[0].datasetFieldDTOList.map(
        (x: any) => x.sourceFieldName
      );
    let selectAllOfClickedTable: Array<any> = [];
    if (fileType == 'append')
      selectAllOfClickedTable = item.tableAppendFieldsDto;
    else if (fileType == 'join')
      selectAllOfClickedTable = item.mergeFieldListDTO;
    else if (fileType == 'files') selectAllOfClickedTable = item.sheet;
    else if (fileType == 'dataset')
      selectAllOfClickedTable = item.datasetFieldDTOList;
    selectAllOfClickedTable.forEach((colObj: any) => {
      if (!allSourceColsInDS.includes(colObj.showTabColName)) {
        let createExpnObj = {
          excludeInSelect: false,
          sourceFieldName: colObj.showTabColName,
          columnId: '',
          columnFormat: '',
          signOperatorList: '',
          sourceExpressionName: '',
          isEdit: false,
          columnType: colObj.columnType,
          where: '',
          or: '',
          groupBy: '',
          orderBy: '',
          value: '',
          signOperator: '',
          whereList: [],
        };
        this.add_SaveCreateExpression(createExpnObj);
      }
    });
  }

  sortDir = -1; //1= 'asc' -1= des
  sortColumn!: number;
  sortOrder: string = 'desc';
  onSortClick(col: string, i: number): void {
    if (this.sortColumn == i) {
      if (this.sortOrder == 'desc') {
        this.sortOrder = 'asc';
        this.sortDir = 1;
      } else {
        this.sortOrder = 'desc';
        this.sortDir = -1;
      }
    } else {
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
    this.sortColumn = -1;
    this.showTargetFilePopup = false;
  }

  private UpdatechecksInDM(item: any, isChk: any) {
    let allColumnsOfTable: Array<any> = [];
    this.sourceFilesAppendJoinFileList.forEach((appJoinSourceFile: any) => {
      appJoinSourceFile.sheetList.forEach((tableObj: any) => {
        if (tableObj.type == 'Append') {
          tableObj.tableAppendFieldsDto.forEach((colObj: any) => {
            if (colObj.showTabColName == item.sourceFieldName) {
              allColumnsOfTable = tableObj.tableAppendFieldsDto;

              colObj.isSelectAllChildInDM = isChk;
              let chk_unchkValues = allColumnsOfTable.map(
                (x: any) => x.isSelectAllChildInDM
              );
              if (chk_unchkValues.includes(false))
                tableObj.isSelectAllParentInDM = false;
              else item.isSelectAllParentInDM = true;
            }
          });
        } else if (tableObj.type == 'Merge') {
          tableObj.mergeFieldListDTO.forEach((colObj: any) => {
            if (colObj.showTabColName == item.sourceFieldName) {
              allColumnsOfTable = tableObj.mergeFieldListDTO;

              colObj.isSelectAllChildInDM = isChk;
              let chk_unchkValues = allColumnsOfTable.map(
                (x: any) => x.isSelectAllChildInDM
              );
              if (chk_unchkValues.includes(false))
                tableObj.isSelectAllParentInDM = false;
              else item.isSelectAllParentInDM = true;
            }
          });
        } else {
          tableObj.sheet.forEach((colObj: any) => {
            if (colObj.showTabColName == item.sourceFieldName) {
              allColumnsOfTable = tableObj.sheet;

              colObj.isSelectAllChildInDM = isChk;
              let chk_unchkValues = allColumnsOfTable.map(
                (x: any) => x.isSelectAllChildInDM
              );
              if (chk_unchkValues.includes(false))
                tableObj.isSelectAllParentInDM = false;
              else item.isSelectAllParentInDM = true;
            }
          });
        }
      });
    });
    if (allColumnsOfTable.length == 0) {
      this.allDatasetDetailsList.forEach((dsObj: any) => {
        //ds
        dsObj.datasetFieldDTOList.forEach((colObj: any) => {
          if (colObj.showTabColName == item.sourceFieldName) {
            allColumnsOfTable = dsObj.datasetFieldDTOList;

            colObj.isSelectAllChildInDM = isChk;
            let chk_unchkValues = allColumnsOfTable.map(
              (x: any) => x.isSelectAllChildInDM
            );
            if (chk_unchkValues.includes(false))
              dsObj.isSelectAllParentInDM = false;
            else item.isSelectAllParentInDM = true;
          }
        });
      });
    }
  }

  selectAllParentInDM(e: any, fileType: any, item: any) {
    console.log(e, fileType, item);
    let isChecked = e.target.checked;
    let allSourceColsInDS: Array<any> = [];
    if (this.datasetDetailsList.length != 0)
      allSourceColsInDS = this.datasetDetailsList[0].datasetFieldDTOList.map(
        (x: any) => x.sourceFieldName
      );

    let selectAllOfClickedTable: Array<any> = [];
    if (fileType == 'append' && isChecked) {
      item.tableAppendFieldsDto.forEach(
        (obj: any) => (obj.isSelectAllChildInDM = true)
      );
      selectAllOfClickedTable = item.tableAppendFieldsDto;
    } else if (fileType == 'join' && isChecked) {
      item.mergeFieldListDTO.forEach(
        (obj: any) => (obj.isSelectAllChildInDM = true)
      );
      selectAllOfClickedTable = item.mergeFieldListDTO;
    } else if (fileType == 'files' && isChecked) {
      item.sheet.forEach((obj: any) => (obj.isSelectAllChildInDM = true));
      selectAllOfClickedTable = item.sheet;
    } else if (fileType == 'dataset' && isChecked) {
      item.datasetFieldDTOList.forEach(
        (obj: any) => (obj.isSelectAllChildInDM = true)
      );
      selectAllOfClickedTable = item.datasetFieldDTOList;
    }

    let particularTableColumns: Array<any> = [];
    if (fileType == 'append' && !isChecked) {
      item.tableAppendFieldsDto.forEach(
        (obj: any) => (obj.isSelectAllChildInDM = false)
      );
      selectAllOfClickedTable = item.tableAppendFieldsDto;
      particularTableColumns = item.tableAppendFieldsDto.map(
        (x: any) => x.showTabColName
      );
    } else if (fileType == 'join' && !isChecked) {
      item.mergeFieldListDTO.forEach(
        (obj: any) => (obj.isSelectAllChildInDM = false)
      );
      selectAllOfClickedTable = item.mergeFieldListDTO;
      particularTableColumns = item.mergeFieldListDTO.map(
        (x: any) => x.showTabColName
      );
    } else if (fileType == 'files' && !isChecked) {
      item.sheet.forEach((obj: any) => (obj.isSelectAllChildInDM = false));
      selectAllOfClickedTable = item.sheet;
      particularTableColumns = item.sheet.map((x: any) => x.showTabColName);
    } else if (fileType == 'dataset' && !isChecked) {
      item.datasetFieldDTOList.forEach(
        (obj: any) => (obj.isSelectAllChildInDM = false)
      );
      selectAllOfClickedTable = item.datasetFieldDTOList;
      particularTableColumns = item.datasetFieldDTOList.map(
        (x: any) => x.showTabColName
      );
    }
    if (this.datasetDetailsList.length == 0) return;
    if (isChecked) {
      selectAllOfClickedTable.forEach((colObj: any) => {
        if (!allSourceColsInDS.includes(colObj.showTabColName)) {
          //shd check non exact match
          let createExpnObj = {
            excludeInSelect: false,
            sourceFieldName: '',
            columnId: '',
            columnFormat: '',
            signOperatorList: '',
            sourceExpressionName: '',
            isEdit: false,
            columnType: '',
            where: '',
            or: '',
            groupBy: '',
            orderBy: '',
            value: '',
            signOperator: '',
            whereList: [],
          };
          this.createExpressionForm.controls.sourceFieldName.patchValue(
            colObj.showTabColName
          );
          this.createExpressionForm.controls.columnType.patchValue(
            colObj.columnType
          );
          this.createExpressionForm.controls.sourceExpressionName.patchValue('')
          this.createExpressionForm.controls.excludeInSelect.patchValue('')
          this.add_SaveCreateExpression(createExpnObj);
        }
      });
    } else if (!isChecked) {
      this.datasetDetailsList[0].datasetFieldDTOList =
        this.datasetDetailsList[0].datasetFieldDTOList.filter(
          (x: any) => particularTableColumns.indexOf(x.sourceFieldName) == -1
        );
      this.datasetDetailsList[0].groupBytoDB =
        this.datasetDetailsList[0].groupBytoDB.filter(
          (x: any) => particularTableColumns.indexOf(x.filefieldName) == -1
        );
      this.datasetDetailsList[0].orderBytoDB =
        this.datasetDetailsList[0].orderBytoDB.filter(
          (x: any) => particularTableColumns.indexOf(x.filefieldName) == -1
        );

      this.columnsForWhereInDS = this.columnsForWhereInDS.filter(
        (x: any) => particularTableColumns.indexOf(x.filefieldName) == -1
      );
      console.log(
        'this.datasetDetailsList[0].datasetFieldDTOList ',
        this.datasetDetailsList[0].datasetFieldDTOList
      );
      console.log(
        'this.datasetDetailsList[0].groupBytoDB',
        this.datasetDetailsList[0].groupBytoDB
      );
      console.log(
        'this.datasetDetailsList[0].orderBytoDB',
        this.datasetDetailsList[0].orderBytoDB
      );

      // allSourceColsInDS.forEach((sourceFieldName:any,index:number)=>{
      //   if(particularTableColumns.includes(sourceFieldName)){
      //     this.datasetDetailsList[0].datasetFieldDTOList.splice(this.datasetDetailsList[0].datasetFieldDTOList.indexOf(sourceFieldName), 1)
      //     //console.log(this.datasetDetailsList[0].datasetFieldDTOList, 'this.datasetDetailsList[0].datasetFieldDTOList');
      //     console.log(sourceFieldName,index)

      //     //this.deleteRowInDataset(0, index, {item:sourceFieldName})
      //     //this.datasetDetailsList[0].datasetFieldDTOList.

      //   }
      // })

      this.UpdatechecksInDM(item, false);
    }
    console.log('this.datasetDetailsList', this.datasetDetailsList);

  }
  selectAllChildInDM(e: any, fileType: any, item: any, comp: any) {
    this.createExpressionForm.controls.sourceExpressionName.patchValue('')
    this.createExpressionForm.controls.excludeInSelect.patchValue('')

    let isChecked = e.target.checked;
    let allSourceColsInDS: Array<any> = [];
    if (this.datasetDetailsList.length != 0)
      allSourceColsInDS = this.datasetDetailsList[0].datasetFieldDTOList.map(
        (x: any) => x.sourceFieldName
      );

    let allColumnsOfTable: Array<any> = [];
    if (fileType == 'append') allColumnsOfTable = item.tableAppendFieldsDto;
    else if (fileType == 'join') allColumnsOfTable = item.mergeFieldListDTO;
    else if (fileType == 'files') allColumnsOfTable = item.sheet;
    else if (fileType == 'dataset')
      allColumnsOfTable = item.datasetFieldDTOList;

    let chk_unchkValues = allColumnsOfTable.map(
      (x: any) => x.isSelectAllChildInDM
    );
    if (chk_unchkValues.includes(false)) item.isSelectAllParentInDM = false;
    else item.isSelectAllParentInDM = true;

    console.log(item);

    if (this.datasetDetailsList.length == 0) return;

    if (isChecked) {
      if (!allSourceColsInDS.includes(comp.showTabColName)) {
        let createExpnObj = {
          excludeInSelect: false,
          sourceFieldName: '',
          columnId: '',
          columnFormat: '',
          signOperatorList: '',
          sourceExpressionName: '',
          isEdit: false,
          columnType: '',
          where: '',
          or: '',
          groupBy: '',
          orderBy: '',
          value: '',
          signOperator: '',
          whereList: [],
        };
        this.createExpressionForm.controls.sourceFieldName.patchValue(
          comp.showTabColName
        );
        this.createExpressionForm.controls.columnType.patchValue(
          comp.columnType
        );

        this.add_SaveCreateExpression(createExpnObj);
      }
    } else if (!isChecked) {
      this.datasetDetailsList[0].datasetFieldDTOList =
        this.datasetDetailsList[0].datasetFieldDTOList.filter(
          (x: any) => comp.showTabColName.indexOf(x.sourceFieldName) == -1
        );
      this.datasetDetailsList[0].groupBytoDB =
        this.datasetDetailsList[0].groupBytoDB.filter(
          (x: any) => comp.showTabColName.indexOf(x.filefieldName) == -1
        );
      this.datasetDetailsList[0].orderBytoDB =
        this.datasetDetailsList[0].orderBytoDB.filter(
          (x: any) => comp.showTabColName.indexOf(x.filefieldName) == -1
        );

      this.columnsForWhereInDS = this.columnsForWhereInDS.filter(
        (x: any) => comp.showTabColName.indexOf(x.filefieldName) == -1
      );
    }

    console.log(
      'this.datasetDetailsList[0].datasetFieldDTOList ',
      this.datasetDetailsList[0].datasetFieldDTOList
    );
    // console.log(item, comp);
  }
  private unChecksAllInDM(isChk: any) {
    this.sourceFilesAppendJoinFileList.forEach((appJoinSourceFile: any) => {
      appJoinSourceFile.sheetList.forEach((tableObj: any) => {
        tableObj.isSelectAllParentInDM = false;
        if (tableObj.type == 'Append') {
          tableObj.tableAppendFieldsDto.forEach((colObj: any) => {
            colObj.isSelectAllChildInDM = isChk;
          });
        } else if (tableObj.type == 'Merge') {
          tableObj.mergeFieldListDTO.forEach((colObj: any) => {
            colObj.isSelectAllChildInDM = isChk;
          });
        } else {
          tableObj.sheet.forEach((colObj: any) => {
            colObj.isSelectAllChildInDM = isChk;
          });
        }
      });
    });
    this.allDatasetDetailsList?.forEach((dsObj: any) => {
      //ds
      dsObj.isSelectAllParentInDM = false;
      dsObj.datasetFieldDTOList.forEach((colObj: any) => {
        colObj.isSelectAllChildInDM = isChk;
      });
    });
  }

  whereFirstRow(): FormGroup {
    return this.formBuilder.group({
      column: ['', Validators.required],
      signOperator: ['', Validators.required],
      // value: ['', Validators.required],
      columnSearch: [''],
    });
  }
  whereRemainingRows(): FormGroup {
    return this.formBuilder.group({
      operator: ['', Validators.required],
      column: ['', Validators.required],
      signOperator: ['', Validators.required],
      // value: ['', Validators.required],
      columnSearch: [''],
    });
  }
  addOpearatorValueFieldsInDS(j: number, item: any) {
    this.whereArrInDS().push(this.whereRemainingRows());
    console.log(j, item);
  }
  delOpearatorValueFieldsInDS(j: number, item: any) {
    this.whereArrInDS().removeAt(j);
    this.signOperatorWhereInDS.splice(j, 1);
    console.log(j, item);
  }

  signOperatorWhereInDS: Array<any> = []; //2jan
  changeColumnInDSForWhere(e: any, j: number, i: number, item: any) {
    let columnName = this.whereArrInDS().controls[j].get('column') as FormArray;
    console.log(j, i, item, columnName.value);
    let ctype = columnName.value.dataType;
    let signOperList: Array<any> = [];

    signOperList = this.getOpearatorList.filter(
      (x: any) => x.operatorType.trim() == ctype
    );

    // if (ctype == 'date' || ctype == 'datetime2' || ctype == 'dateTime') { //copy
    //   signOperList = [{ id: 0, value: 'IS NULL' }, { id: 1, value: 'IS NOT NULL' }, { id: 2, value: 'IN' }, { id: 3, value: 'NOT IN' }, { id: 4, value: '=' }, { id: 5, value: '!=' }, { id: 6, value: '>=' }, { id: 7, value: '>' }, { id: 8, value: '<' }, { id: 9, value: '<=' }]
    // }
    // else if (ctype == 'char' || ctype == 'varchar' || ctype == 'text' || ctype == 'nvarchar') {
    //   signOperList = [{ id: 0, value: 'IS NULL' }, { id: 1, value: 'IS NOT NULL' }, { id: 2, value: 'LIKE' }, { id: 3, value: 'NOT LIKE' }, { id: 4, value: 'NOT IN' }, { id: 5, value: 'IN' }]
    // }
    // else if (ctype == 'int' || ctype == 'float' || ctype == 'money' || ctype == 'decimal' || ctype == 'bigint') {
    //   signOperList = [{ id: 0, value: 'IS NULL' }, { id: 1, value: 'IS NOT NULL' }, { id: 2, value: 'IN' }, { id: 3, value: 'NOT IN' }, { id: 4, value: '=' }, { id: 5, value: '!=' }, { id: 6, value: '>=' }, { id: 7, value: '>' }, { id: 8, value: '<' }, { id: 9, value: '<=' }]
    // } //

    this.signOperatorWhereInDS[j] = signOperList[0].operatorList;
  }

  changeOperatorInDSForWhere(ent: any, j: number, i: number, item: any) {
    if (ent.value == 'IS NULL' || ent.value == 'IS NOT NULL') {
      this.removeValueAtInDM(j)
    }
    else {
      this.addValueAtInDM(j)
    }
  }

  whereArrInDS(): FormArray {
    //DS popup
    return this.datasetTableForm.get('where') as FormArray;
  }

  unique: Array<any> = []
  enableAppendDatasetError: boolean = false
  appendDataset() {
    let checkedList = this.allDatasetDetailsList.filter((x: any) => x.selected);
    if (checkedList.length < 2) {
      this.submitted = true;
      this.popup.open(false, 'Please select atleast two Dataset Tables for Appending !')
      return;
    }
    // let k = 0;
    // let uniqueColumnNames: Array<any> = []
    // checkedList.forEach((obj: any) => {
    //   let arr = obj.datasetFieldDTOList.map((x: any) => x.fieldName)
    //   arr.forEach((value: any) => {
    //     uniqueColumnNames.push(value)
    //   })
    // })


    // let checkedSheetColumns: Array<any> = [];
    // if (checkedList.length > 1) {
    //   checkedList.forEach((obj: any) => {
    //     if (checkedSheetColumns.length == 0) {
    //       checkedSheetColumns = obj.datasetFieldDTOList.map(
    //         (x: any) => x.fieldName
    //       );
    //     } else {
    //       let columnsList: Array<any> = [];
    //       columnsList = obj.datasetFieldDTOList.map((x: any) => x.fieldName);
    //       if (checkedSheetColumns.length == columnsList.length) {
    //         checkedSheetColumns.forEach((colNames: any) => {
    //           if (!columnsList.includes(colNames)) {
    //             k = 1;
    //             return;
    //           }
    //         });
    //       }
    //       else k = 1;
    //     }
    //   });
    //   if (k == 1) {
    //     let uniqueColumnNames: Array<any> = []
    //     checkedList.forEach((obj: any) => {
    //       let arr = obj.datasetFieldDTOList.map((x: any) => x.fieldName)
    //       arr.forEach((value: any) => {
    //         uniqueColumnNames.push(value)
    //       })
    //     })

    //     let uniqueChars = uniqueColumnNames.filter((element: any, index: number) => {
    //       return uniqueColumnNames.indexOf(element) !== index;
    //     });
    //     console.log('uniqueChars', uniqueChars);
    //     this.unique = ['Append failed to due the columns mismatch\n']
    //     console.log(checkedList)
    //     checkedList.forEach((_chkdObj: any) => {
    //       let x: any = {
    //         datasetName: _chkdObj.datasetName,
    //         unMatchedFieldNames: []
    //       }
    //       let unMatchedFieldName: Array<any> = []
    //       _chkdObj.datasetFieldDTOList.forEach((_field: any) => {
    //         // if (!uniqueChars.includes(_field.fieldName)) x.unMatchedFieldNames.push(_field.fieldName)
    //         if (!uniqueChars.includes(_field.fieldName)) unMatchedFieldName.push(_field.fieldName)
    //       })
    //       // if(x.unMatchedFieldNames.length != 0) this.unique.push(x)
    //       if (unMatchedFieldName.length != 0) this.unique.push(_chkdObj.datasetName + ' : ' + unMatchedFieldName + '\n')
    //     })
    //     console.log('unique', this.unique);





    //     let arrOfArray = checkedList.map((x: any) => x.datasetFieldDTOList.map((y: any) => y.fieldName))
    //     console.log(this.findCommon(arrOfArray));

    //     this.enableAppendDatasetError = true
    //     // this.submitted = true;
    //     // this.submittedErrorMsg = "Ensure that the files with identical columns are selected for appending"
    //     //this.popup.open(false, 'mismatch column(s)' + [...new Set(uniqueColumnNames)].join())
    //     return;
    //   }

    checkedList.forEach((_obj: any) => {
      _obj.datasetFieldDTOList.forEach((obj: any) => {
        obj.fieldNameColumnType = obj.fieldName.trim() + '.' + obj.columnType
      })
    })

    let arrOfAr: Array<any> = []
    arrOfAr = checkedList.map((x: any) => x.datasetFieldDTOList.map((y: any) => { return y.fieldName.trim() + '.' + y.columnType }))

    let arrOfArr = checkedList.map((x: any) => x.datasetFieldDTOList.map((y: any) => y.fieldName.trim() + '.' + y.columnType))

    console.log(arrOfAr)
    console.log(this.findCommon(arrOfArr));
    let duplicateValues: any = this.findCommon(arrOfArr)

    this.unique = []
    // if(duplicateValues.length != 0){
    checkedList.forEach((arr: any, i: number) => {
      let checkedObj: Array<any> = []
      arr.datasetFieldDTOList.forEach((value: any, j: number) => {
        if (!duplicateValues?.includes(value.fieldNameColumnType)) checkedObj.push(value.fieldNameColumnType)
      })
      if (checkedObj.length != 0) this.unique.push(arr.datasetName + ':' + checkedObj + '\n')
    })
    // }
    console.log('Mismatch ', checkedList)

    console.log(this.unique)
    if (this.unique.length != 0) this.enableAppendDatasetError = true
    else this.enableDatasetAppendPopup = true;

    this.datasetAppendForm.get('appendNameControl')?.reset();
    // }
  }

  private findCommon(array: any) {
    let intersection;
    for (let i = 0; i < array.length - 1; i++) {
      intersection = this.getIntersection(array[i], array[i + 1]);
      if (!intersection.length) {
        return [];
      }
    }
    return intersection;
  }

  private getIntersection(a: any, b: any) {
    var setB = new Set(b);
    return [...new Set(a)].filter(x => setB.has(x));
  }

  ellipsisInDM(item: any, index: number) {
    this.allDatasetDetailsList.forEach((obj: any, i: number) => {
      if (i == index) item.isSelectedEllipsis = (item.isSelectedEllipsis) ? false : true
      else obj.isSelectedEllipsis = false
    })
    // item.isSelectedEllipsis = (item.isSelectedEllipsis)? false : true;
  }

  enableDatasetAppendPopup: boolean = false;
  appendDatasetApi() {
    let dsName = this.datasetAppendForm.get('appendNameControl')?.value.trim();
    this.loader.show();
    this.solService.getExistDataset(dsName, 'dataset').subscribe(
      (res: any) => {
        //method written 4 times
        this.loader.hide();
        this.enableDatasetAppendPopup = false;

        this.submited1 = false;
        this.submittedErrorMsg = '';

        this.createDatasetAppend(dsName);

        console.log(res);
      },
      (err: any) => {
        this.loader.hide();
        this.submited1 = true;
        this.submittedErrorMsg = 'Dataset Name Already Exist!!!';
      }
    );
  }

  createDatasetAppend(dsName: any) {
    let datasetTableAppendDtos: Array<any> = [];
    let obsj: any = {
      processId: this.process.processId,
      dataSetAppendDetailsDto: { appendName: dsName, datasetTableAppendDtos },
      userId: this.userInfo.userId,

    };
    this.allDatasetDetailsList.forEach((dsObj: any) => {
      if (dsObj.selected) {
        datasetTableAppendDtos.push({
          datasetId: dsObj.datasetId,
          datasetName: dsObj.datasetName,
        });
      }
    });

    this.solService.addDatasetAppend(obsj).subscribe(
      (res: any) => {
        this.getAllDataSetNameAPI({ id: 5 });
      },
      (err: any) => {
        this.popup.open(false, err.error.statusMessage)
        this.loader.hide();
      }
    );
  }

  enableUploadSQL: boolean = false;
  enableUploadPython: boolean = false;
  isBtnClickedSQL_Python!: string;
  uploadSQLScriptBtn() { //x 1april
    this.uploadSQLBtn = true;
    this.sqlScriptForm.reset();
    this.enableUploadSQL = true;
    this.isBtnClickedSQL_Python = 'SQL';
  }

  uploadPythonScriptBtn() { //x 1april
    this.uploadSQLBtn = true;
    this.sqlScriptForm.reset();
    this.enableUploadPython = true;
    this.isBtnClickedSQL_Python = 'P';
  }

  generateScript(condition: any) {
    this.saveUploadScript('Manual', condition);
  }

  uploadPythonScript() { }

  uploadSQLBtn: boolean = true;
  uploadSQL_PythonScript(e: any, uploadType: string) {
    // txt   sql   py
    if (uploadType == 'Python Script') {
      const file = e.target.files[0];
      if (
        e.target.files[0]?.name?.split('.')[1] == 'py' ||
        e.target.files[0]?.name?.split('.')[1] == 'txt'
      ) {
        let fileReader = new FileReader()
        fileReader.onload = (e: any) => {
          this.uploadSQLBtn = false;
          // this.sqlScriptForm.patchValue({ sqlScript: format(JSON.parse(JSON.stringify(fileReader.result))) });
          this.sqlScriptForm.patchValue({ sqlScript: (JSON.parse(JSON.stringify(fileReader.result))) });
        };
        fileReader.readAsText(file);
      }
    } else if (uploadType == 'SQL script') {
      const file = e.target.files[0];
      if (
        e.target.files[0]?.name?.split('.')[1] == 'sql' ||
        e.target.files[0]?.name?.split('.')[1] == 'txt'
      ) {
        let fileReader = new FileReader();
        fileReader.onload = (e: any) => {
          this.uploadSQLBtn = false;
          // this.sqlScriptForm.patchValue({ sqlScript: format(JSON.parse(JSON.stringify(fileReader.result))) });
          this.sqlScriptForm.patchValue({ sqlScript: (JSON.parse(JSON.stringify(fileReader.result))) });
        };
        fileReader.readAsText(file);
      }
    }
  }

  saveUploadScript(uploadType: string, condition: any) {
    let data: any = {
      processId: this.process.processId,
      userId: this.userInfo.userId,
      type: uploadType[0]
    };
    if (uploadType == 'Python Script' || uploadType == 'SQL script')
      data.script = this.sqlScriptForm.get('sqlScript')?.value.split('\n').join(' ')

    this.solService.uploadScriptToProcess(data).subscribe(
      (res: any) => {
        console.log(res);
        // this.uploadSQLBtn = true
        // if (uploadType == 'Python Script') this.enableUploadPython = false; //x 1april
        // if (uploadType == 'SQL script') this.enableUploadSQL = false;
        // this.enableUploadSQLPython = false 
        if (uploadType == 'Python Script') this.executeScript(1, 'enableUploadSQLPython')
        //this.popup.open(true, 'Saved Successfully !');
        else if (uploadType == 'SQL script') this.executeScript(2, 'enableUploadSQLPython')



        else if (uploadType == 'Manual') {
          // this.popup.open(true, 'Generated Successfully !'); //xo
          if (condition == 'view script') {
            this.getSolutionScript('enableViewscriptPopup')
          }
          else if (condition == 'powerBi')
            this.powerBiContinue()
        }
      },
      (err: any) => {
        this.popup.open(false, err.error.statusMessage);
        this.loader.hide();
      }
    );
  }

  enableViewscriptPopup: boolean = false;
  getViewScript() {
    this.isManualScript = true
    // this.isUploadScript = false //temporary
    this.getViewScriptForm.reset()
    this.generateScript('view script')

  }

  // disableGenerateScript: boolean = false;
  nextBtnInUploadScriptInUF: boolean = false
  getSolutionScript(value: any) {
    this.sqlScriptForm.reset()
    this.solService.getSolutionScript(this.process.processId).subscribe(
      (res: any) => {
        if (res) {
          let _type = res.responseData?.type
          if (value == 'enableViewscriptPopup') {
            this.enableViewscriptPopup = true;
            this.getViewScriptForm.controls.gscript.disable()
          }
          else if (value == 'enableUploadSQLPython') {
            if (res.responseData.script == "") this.uploadSQLBtn = true
            else {

              this.sqlScriptForm.patchValue({
                // sqlScript: format(res.responseData.script),
                sqlScript: (res.responseData.script),
                type: _type,
              })
              if (this.selectedScriptTypeInUF == 'SQL script' && _type == 'S') {
                this.uploadSQLBtn = false
              }
              else if (this.selectedScriptTypeInUF == 'Python Script' && _type == 'P') {
                this.uploadSQLBtn = true
              }
              this.nextBtnInUploadScriptInUF = true
            }


          }
          this.getViewScriptForm.patchValue({
            // gscript: format(res.responseData?.gscript), //error getting with [dbo].
            // script: format(res.responseData?.script),
            gscript: res.responseData?.gscript,
            script: res.responseData?.script,
            solutionScriptId: res.responseData?.solutionScriptId,
            type: res.responseData?.type,
          });
        }
      },
      (err: any) => {
        if (value == 'enableViewscriptPopup')
          this.popup.open(false, 'No data');
        this.loader.hide();
      }
    );
  }

  updateViewScript() {

    let data: any = {
      processId: this.process.processId,
      userId: this.userInfo.userId,
    }


    if (this.isUploadScript) { //x using asofnow

      // script = this.getViewScriptForm.get('script')?.value
      data.script = this.getViewScriptForm.get('script')?.value.split('\n').join(' ')
      data.type = this.getViewScriptForm.get('type')?.value
    }
    if (this.isManualScript) {

      //gscript = this.getViewScriptForm.get('gscript')?.value
      data.gscript = this.getViewScriptForm.get('gscript')?.value.split('\n').join(' ')
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

      this.popup.open(true, res.statusMessage);
      // this.toast.success({ title: 'Success', message: "Updated Successfully !" });
    }), (err: any) => {
      this.popup.open(false, 'failed');
      // this.toast.error({ title: 'Error', message: "failed" });
      this.loader.hide();
    }
  }

  executeViewScript() {
    let flag: any
    if (this.isUploadScript) {
      if (this.getViewScriptForm.get('type')?.value == 'P') flag = 1
      else if (this.getViewScriptForm.get('type')?.value == 'S') flag = 2
    }
    else if (this.isManualScript) flag = 2

    this.executeScript(flag, 'enableViewscriptPopup')
  }

  executeScript(flag: any, popupFlag: any) {
    this.solService.execscript(this.process.processId, flag).subscribe((res: any) => {
      if (popupFlag == 'enableViewscriptPopup') {
        this.updateViewScript()

      }
      else if (popupFlag == 'enableUploadSQLPython') {
        this.enableUploadSQLPython = false
        this.changeTabs({ id: 5 }, 'next')
      }

      this.popup.open(true, res.responseData);

    }, (err: any) => {
      this.popup.open(false, err.error.statusMessage)
      console.log(err);

    })
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

  clickContinueInDM: boolean = false
  closeClickContinueInDMPopup() {
    this.clickContinueInDM = false
  }

  selectDesktopOrServices(evt: any, obj: any) {
    // console.log(evt, obj);

    this.desktopServicesArray.forEach((_obj: any) => _obj.isChecked = false)
    obj.isChecked = true
    if (evt.target.checked) {
      if (obj.value == 'Power BI Services') {
        this.powerBIServices(obj)
      }

      // else if (obj.value == 'Power BI Desktop') console.log('desktop');

      else if (obj.value == 'Power BI Desktop') {
        console.log('desktop');
        if (this.allDatasetDetailsList.filter(x => x.selected == true).length != 0) {
          // this.SaveContinue()
          let data = this.SaveContinue()
          data.type = 1
          // this.PBIDesktop = true
          this.PbiDesktop(data)
        }
        else if (this.uploadedScriptTableList.filter(x => x.isChecked).length != 0) {

          let tableList = this.uploadedScriptTableList.filter(x => x.isChecked).map(x => x.tableName)
          console.log(tableList);
          let data: any = {
            processId: this.process.processId,
            tableList: tableList
          }
          this.solService.generateJsonForUploadScript(data).subscribe((res: any) => {
            if (res) {
              let reqData = {
                userId: this.userInfo.userId,
                tables: data.tableList,
                processId: this.process.processId,
                type: 1
              }
              this.PbiDesktop(reqData)

            }

          }, (err: any) => {

          })
          // let data = this.generateJsonForUploadScript(tableList)

        }
      }
    }

  }




  private powerBIServices(obj: any) {
    if (this.allDatasetDetailsList.filter(x => x.selected == true).length != 0) {
      let data = this.SaveContinue()
      this.pushDataset(data)
    }
    else if (this.uploadedScriptTableList.filter(x => x.isChecked).length != 0) {



      let tableList = this.uploadedScriptTableList.filter(x => x.isChecked).map(x => x.tableName)
      console.log(tableList);



      this.generateJsonForUploadScript(tableList)

    }
  }


  private generateJsonForUploadScript(selectedList: any) {
    let data: any = {
      processId: this.process.processId,
      tableList: selectedList
    }
    this.solService.generateJsonForUploadScript(data).subscribe((res: any) => {
      if (res) {
        let reqData = {
          userId: this.userInfo.userId,
          tables: data.tableList,
          processId: this.process.processId,
        }
        this.pushDataset(reqData)
        // console.log(res);   
        // return reqData
      }
      // else{
      //   return false
      // }

    }, (err: any) => {

    })
  }
  PbiDesktop(data: any) {
    this.service.addtoPowerBiDesktop(data).subscribe((res: any) => {
      console.log(res);
      this.clickContinueInDM = false
      this.PBIDesktop = true
      this.service.getReports(this.process.processId).subscribe((res: any) => {
        console.log(res);
        this.Reports = res.responseData
      })
    })
  }
  selectDesktopReport(data: any, i: any) {
    this.Reports.forEach((ele: any) => {
      if (data.reportId == ele.reportId)
        ele.checked = true;
      else
        ele.checked = false
    })
  }
  closePbidesktop() {
    this.PBIDesktop = false
  }

  measureSubmit() {
    // http://10.40.230.248:9197/addMeasuresToDataset
    let Mlist: { name: any; expression: any; formatString: any; }[] = []
    this.measuresArr().controls.forEach(element => {
      Mlist.push({
        name: element.get("name")?.value,
        expression: element.get("expression")?.value,
        formatString: element.get("formateString")?.value
      })
    });
    let data = {
      userId: this.userInfo.userId,
      processId: this.process.processId,
      measuresList: Mlist
    }
    console.log(data);
    this.service.addMeasuresToDataset(data).subscribe((res: any) => {
      console.log(res);
    })
    // {
    //   "userId": "string",
    //   "processId": "string",
    //   "measuresList": [
    //     {
    //  "name": "string",
    //  "expression": "string",
    //  "formateString": "string"
    //     }
    //   ]
    // }
  }

  hasValueCOlumnAt(index: number) {
    return this.whereArrInDS().controls[index].get('value') ? true : false
  }
  addValueAtInDM(index: any) {
    (<FormGroup>this.whereArrInDS().controls[index]).addControl('value', this.fb.control(''))
  }
  removeValueAtInDM(index: number) {
    (<FormGroup>this.whereArrInDS().controls[index]).removeControl('value');
  }

  //-DMEnd

  //PBiStart

  overrideConfirm() {
    if (!this.isOverride) this.enableOverRideConfirmPopup = true;
    else this.isOverride = false;
  }
  overrideOK() {
    this.enableOverRideConfirmPopup = false;
    this.isOverride = true;
  }
  closeOverridePopup() {
    this.isOverride = false;
    this.enableOverRideConfirmPopup = false;
  }

  executeProject() {
    this.loader.show();
    this.solService.execSolutionScript(this.process.processId).subscribe(
      (res: any) => {
        this.loader.hide();
      },
      (err: any) => {
        this.loader.hide();
      }
    );
  }

  deleteRelationRow(i: any) {
    //console.log(i);
    this.relationshipArr().removeAt(i);
    this.relationship.splice(i, 1);
  }

  addRelationshipRow(): FormGroup {
    return this.formBuilder.group({
      // name:['', Validators.required],
      fromTable: ['', Validators.required],
      toTable: ['', Validators.required],
      crossFilteringBehavior: ['', Validators.required],
      fromColumn: ['', Validators.required],
      toColumn: ['', Validators.required],
    });
  }
  relationshipArr(): FormArray {
    return this.addRelationshipForm.get('addRelationshipRows') as FormArray;
  }

  fetchFromTables() {
    return this.selectedDateList.map((tbl) => {
      return { name: tbl.datasetName, value: tbl.tableName };
    });
  }

  fetchToTables(index: any) {
    const list = this.relationship;
    return this.selectedDateList
      .map((tbl) => {
        if (list[index]?.fromTable !== tbl.tableName) {
          return { name: tbl.datasetName, value: tbl.tableName };
        }
        return null;
      })
      .filter(function (el) {
        return el != null;
      });
  }

  fetchTableColumns(tableName: string) {
    const table = this.selectedDateList.find((x) => x.tableName === tableName);
    return table.datasetFieldDTOList.map((column: any) => {
      return { name: column.fieldName, value: column.columnName };
    });
  }

  fetchCrossFltrBehaviours() {
    return [
      {
        name: 'Automatic',
        value: 'Automatic',
      },
      {
        name: 'Many To Many',
        value: 'BothDirections',
      },
      {
        name: 'One To Many',
        value: 'OneDirection',
      },
    ];
  }

  openRelModal() {
    this.addRelationshipForm.controls.addRelationshipRows = this.fb.array([
      this.addRelationshipRow(),
    ]);
    this.submitedRelation = false;

    console.log('seelcted tables:', this.selectedDateList);
    this.showRelationshipModal = true;
    this.relationship = [
      {
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
        validators: {
          name: 0,
          fromtable: 0,
          fromColumn: 0,
          toTable: 0,
          toColumn: 0,
        },
      },
    ];

    console.log('relation ship info:', this.relationship);
  }

  closeRelModal() {
    this.showRelationshipModal = false;
    this.relationship = [];
  }

  addNewRelation(index: any) {
    let relationArrlength = this.relationshipArr().length;
    if (this.relationshipArr().controls[relationArrlength - 1].invalid) return;
    this.relationshipArr().push(this.addRelationshipRow());

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
      validators: {
        name: 0,
        fromtable: 0,
        fromColumn: 0,
        toTable: 0,
        toColumn: 0,
      },
    });
    // }
  }

  onChangeToTable(index: any, key: any) {
    let selectedTOTable = this.relationshipArr().controls[index].value.toTable;
    this.relationship[index][key + 'ColumnList'] =
      this.fetchTableColumns(selectedTOTable);
  }

  // this.fileListt.splice(this.getJoinFilesList.findIndex(ele => ele.fileId === item.fileId), 1)

  populateToTables(index: any, selectedFromTable: any) {
    let toTableList: Array<any> = [];
    this.relationship[index].fromTableList.forEach((object: any) => {
      if (selectedFromTable != object.value) toTableList.push(object);
    });
    return toTableList;
  }

  onChangeTable(index: any, key: any) {
    console.log('index', index);
    // this.relationship[index][key + 'ColumnList'] = this.fetchTableColumns(this.relationship[index][key + 'Table']);
    let selectedFromTable =
      this.relationshipArr().controls[index].value.fromTable;
    this.relationship[index][key + 'ColumnList'] =
      this.fetchTableColumns(selectedFromTable);
    // this.relationship[index].toTableList = this.fetchToTables(index);
    this.relationship[index].toTableList = this.populateToTables(
      index,
      selectedFromTable
    );
    // console.log('this.relationship',this.relationship);
    this.filterExistingRel(this.relationship[index].fromTable, index); //?
  }

  filterExistingRel(tableName: string, index: number) {
    const relExist = this.relationship
      .filter((x) => x.fromTable === tableName)
      .map((rel) => rel.toTable)
      .filter(function (el) {
        return el != null && el !== '';
      });
    this.relationship[index].toTableList = this.relationship[
      index
    ].toTableList.filter((x: any) => relExist.indexOf(x.value) < 0);
  }

  onCheck(data: any, type: string) {
    console.log(data);
    if (type == 'dataset') {
      this.allDatasetDetailsList.forEach((ele: any) => {
        if (data.datasetId == ele.datasetId) {
          ele.selected = !ele.selected;
        }
      });
      const itemIndex = this.selectedDateList.findIndex(
        (x) => x.datasetName === data.datasetName
      );
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
    else if (type == 'scriptGeneratedTable') {
      data.isChecked = (data.isChecked == false) ? true : false

      console.log(this.uploadedScriptTableList);

    }
  }

  validateRelation(relation: any) {
    relation.validators.name = relation.name ? 0 : 1;
    relation.validators.fromTable = relation.fromTable ? 0 : 1;
    relation.validators.fromColumn = relation.fromColumn ? 0 : 1;
    relation.validators.toTable = relation.toTable ? 0 : 1;
    relation.validators.toColumn = relation.toColumn ? 0 : 1;
    return (
      relation.validators.name ||
      relation.validators.fromTable ||
      relation.validators.fromColumn ||
      relation.validators.toTable ||
      relation.validators.toColumn
    );
  }

  disableContinueBtn() {
    return this.selectedDateList.length > 1 && this.disableContinue;
  }

  saveRelation() { //x
    if (
      !this.validateRelation(this.relationship[this.relationship.length - 1])
    ) {
      let relation = this.relationship.map((rel) => {
        return {
          name: rel.name,
          fromTable: rel.fromTable,
          crossFilteringBehavior: rel.crossFilteringBehavior,
          fromColumn: rel.fromColumn,
          toTable: rel.toTable,
          toColumn: rel.toColumn,
        };
      });
      this.relationship = [];
      this.relationShipPayload = this.relationShipPayload.concat(relation);
      this.showRelationshipModal = false;
      this.disableContinue = false;
    }
  }

  submitedRelation: boolean = false;
  saveRelationship() {
    this.submitedRelation = true;
    let d = 0;
    this.relationshipArr().controls.forEach((relatn: any, i: number) => {
      if (relatn.invalid) d = 1;
    });
    if (d == 1) {
      this.popup.open(false, 'Enter all the required fields');
      return;
    }

    this.relationShipPayload = [];
    this.relationshipArr().controls.forEach((relation: any) => {
      this.relationShipPayload.push({
        name: '',
        fromTable: relation.value.toTable,
        fromColumn: relation.value.toColumn,
        crossFilteringBehavior: relation.value.crossFilteringBehavior,
        toTable: relation.value.fromTable,
        toColumn: relation.value.fromColumn,
      });
      this.relationship = [];
      this.showRelationshipModal = false;
      this.disableContinue = false;
    });
  }

  clickContinue() {
    // console.log(this.process.statusName);
    // console.log('relationShipPayload', this.relationShipPayload);
    this.getProcessByID();
    this.desktopServicesArray.forEach((ds: any) => ds.isChecked = false)
    this.generateScript('powerBi') //1. generate script, 2. (desktop, services)
    // else this.clickContinueInDM = true

  }

  private powerBiContinue() {
    let selectedDatasetLen = this.allDatasetDetailsList.filter(x => x.selected == true).length
    let selectedUploadedScriptTableLen = this.uploadedScriptTableList.filter(x => x.isChecked).length
    // if (this.process.statusName != 'Published') {
    if (!this.process.powerBiDatasetExists) {
      if (selectedDatasetLen == 0 && selectedUploadedScriptTableLen == 0) {
        // let errMsg = (selectedDatasetLen == 0) ? 'Dataset' : (selectedUploadedScriptTableLen == 0) ? 'Table' : ''
        this.popup.open(false, `Please select atleast one Table !!`)
        return
      }
      else if (selectedDatasetLen == 1 || selectedUploadedScriptTableLen == 1) {
        this.clickContinueInDM = true
      }
      //need to work  (selectedUploadedScriptTableLen)

      else if (selectedUploadedScriptTableLen > 1) {
        this.clickContinueInDM = true
      }

      else if (selectedDatasetLen > 1) {
        if (this.relationShipPayload.length == 0) {
          this.popup.open(false, 'Please Map Dataset Tables !!')
          return
        }
        else {
          this.clickContinueInDM = true
        }
      }

    }
    else if (this.process.powerBiDatasetExists) {
      if (this.process.powerBiDesktop) {
        this.PBIDesktop = true;
        this.service.getReports(this.process.processId).subscribe((res: any) => {
          console.log(res);
          this.Reports = res.responseData
        })
      }
      else {
        if (selectedDatasetLen > 1) {
          if (this.relationShipPayload.length == 0) {
            this.popup.open(false, 'Please Map Dataset Tables !!')
            return
          }
          else {
            let data = this.SaveContinue()
            this.pushDataset(data)
          }// direct call, xselection ('p')
        }
        else {
          let data = this.SaveContinue()
          this.pushDataset(data)
        }
      }
    }
  }
  SaveContinue() {
    let tables: any[] = [];
    this.allDatasetDetailsList.forEach((ele: any) => {
      if (ele.selected) {
        tables.push(ele.tableName);
      }
    });
    // let userInfo = JSON.parse(localStorage.getItem('userInfo') || '');
    let data: any = {
      tables: tables,
      userId: this.userInfo.userId,
      processId: this.process.processId,
    };

    if (this.relationShipPayload.length > 0) {
      this.relationShipPayload.forEach((obj: any, i: number) => {
        obj.name = 'relation' + i;
      });
      data.relationShips = this.relationShipPayload;
    }
    console.log(data);
    // this.pushDataset(data)
    return data;
    // routerLink="/user/admin1/powerbi-interface"
  }

  private pushDataset(data: any) {
    this.loader.show();
    this.solService.postPushDataSets(data, this.isOverride).subscribe(
      (res: any) => {
        localStorage.setItem('PBIdata', JSON.stringify(res.responseData))
        this.router.navigate([
          '/user/admin1/powerbi-interface'
        ]);
        this.loader.hide();
        this.clickContinueInDM = false //isit really required (chk)
      },
      (err: any) => {
        this.popup.open(false, err.error)
        this.loader.hide();
      }
    );
  }

  //-PbiEnd

  oneNext(item: any, type: any) {
    let data: any = {
      userId: this.userInfo.userId,
      processId: this.process.processId,
      checkDtoslist: [],
    };
    this.fileListt.forEach((fileObj: any) => {
      fileObj.totalSheetList?.filteredData.forEach((sheetObj: any) => {
        if (sheetObj.sheetSelected)
          data.checkDtoslist.push({ id: sheetObj.templateId, value: 1 });
        else data.checkDtoslist.push({ id: sheetObj.templateId, value: 0 });
      });
    });
    let m_u = this.uploadedManualToggleForm.controls.manualOrUploaded
    if (this.process.solutionType == undefined) {  //create
      data.solutionType = 'M'
      // this.process.solutionType = 'Manual'
    }
    else {
      let value = (m_u.value) ? 'U' : 'M'
      if (value == this.process.solutionType) data.solutionType = null
      else data.solutionType = (m_u.value) ? 'U' : 'M'
    }

    if (data.checkDtoslist.length != 0) {
      this.solService.saveCheckedSheetList(data).subscribe(
        async (res: any) => {
          //await this.ge..tTargetFileList();
          if (this.process.solutionType == undefined) {  //create
            this.process.solutionType = 'M'
          }
          else {
            this.process.solutionType = (m_u.value) ? 'U' : 'M'
            // if(m_u.value == this.process.solutionType) data.solutionType = null
            // else data.solutionType = (m_u.value) ? 'U' : 'M'
          }


          localStorage.setItem('process', JSON.stringify(this.process));

          console.log(localStorage.getItem('process'))
          if (type == 'manual') await this.getNewTargetFilesList(item);
          else if (type == 'uploadedScript') this.saveUploadScript(this.selectedScriptTypeInUF, '')
        },
        (err: any) => { }
      );
    }
    else {
      if (type == 'manual') this.getNewTargetFilesList(item);
      else if (type == 'uploadedScript') this.saveUploadScript(this.selectedScriptTypeInUF, '')
    }

  }


  getNewTargetFilesList(item: any) { //target files(source files only)
    this.solService
      .getAllFileTemplateListByProcessID(this.process.processId)
      .subscribe(
        (res: any) => {
          let filesheetList = this.totalfileDetails(res?.responseData?.totalfileDetails, item)

          this.targetFileList = filesheetList
          this.tartargetFileListForSearch = this.totalfileDetails(res?.responseData?.totalfileDetails, item)
          this.masterChkInTF()
          console.log('this.targetFileList', this.targetFileList);
          this.tabtab(item)
          // this.tabsChange(item);
          // this.selectedTab = item.id
          //console.log('this.targetFileList', this.targetFileList);

        })
  }

  getAppendFilesList: Array<any> = [];
  private threeNext(item: any) {
    let requestData: any = {
      fieldCheckListDtos: [],
    };
    //above list
    // this.targetFileList.forEach((ajf: any) => {
    let checkDtoslist: any = [];
    // let fieldDataTypeDtos: any = [];
    console.log(this.targetFileList, 'this.targetFileList')
    this.targetFileList.forEach((fobj: any) => {


      fobj.sheet.forEach((cobj: any) => {
        if (cobj.isChecked && cobj.isCheckedChildDirtyInTF) checkDtoslist.push({ id: cobj.columnId, value: 1 });
        else if (!cobj.isChecked && cobj.isCheckedChildDirtyInTF) checkDtoslist.push({ id: cobj.columnId, value: 0 });
        // if (cobj.isDropdownDirtyInTF) //changed to edit preview popup
        //   fieldDataTypeDtos.push({
        //     id: cobj.columnId,
        //     dataType: cobj.columnType,
        //   });
      });

      // if (ajf.fileType == 'append') {
      //   ajf.sheetList.forEach((aobj: any) => {
      //     aobj.tableAppendFieldsDto.forEach((cObj: any) => {
      //       if (cObj.isChecked)
      //         checkDtoslist.push({ id: cObj.fieldID, value: 1 });
      //       if (cObj.isDropdownDirtyInTF)
      //         fieldDataTypeDtos.push({
      //           id: cObj.fieldID,
      //           dataType: cObj.columnType,
      //         });
      //     });
      //   });
      //   requestData.fieldCheckListDtos.push({
      //     type: 'AppendField',
      //     checkDtoslist,
      //     fieldDataTypeDtos,
      //   });
      // } else if (ajf.fileType == 'join') {
      //   ajf.sheetList.forEach((jobj: any) => {
      //     jobj.mergeFieldListDTO.forEach((cobj: any) => {
      //       if (cobj.isChecked)
      //         checkDtoslist.push({ id: cobj.columnId, value: 1 });
      //       if (cobj.isDropdownDirtyInTF)
      //         fieldDataTypeDtos.push({
      //           id: cobj.columnId,
      //           dataType: cobj.columnType,
      //         });
      //     });
      //   });
      //   requestData.fieldCheckListDtos.push({
      //     type: 'MergeField',
      //     checkDtoslist,
      //     fieldDataTypeDtos,
      //   });
      // } else if (ajf.fileType == 'files') {
      //   ajf.sheetList.forEach((fobj: any) => {
      //     fobj.sheet.forEach((cobj: any) => {
      //       if (cobj.isChecked)
      //         checkDtoslist.push({ id: cobj.columnId, value: 1 });
      //       if (cobj.isDropdownDirtyInTF)
      //         fieldDataTypeDtos.push({
      //           id: cobj.columnId,
      //           dataType: cobj.columnType,
      //         });
      //     });
      //   });
      //   requestData.fieldCheckListDtos.push({
      //     type: 'TemplateField',
      //     checkDtoslist,
      //     fieldDataTypeDtos,
      //   });
      // }


    });
    requestData.fieldCheckListDtos.push({
      type: 'TemplateField',
      checkDtoslist,
      // fieldDataTypeDtos,
    });
    //console.log(requestData);

    this.solService.saveFieldCheckList(requestData).subscribe(
      async (res: any) => {
        //update checks of targetfiles
        //this.getTargetFileList();
        this.threePrev(item)
      },
      (err: any) => { }
    );

    //this.getAppendFilesApi();
  }

  getAppendFilesApi() {
    //getAppendFiles
    this.getAppendFilesList = [];
    this.solService.getAppendFiles(this.process.processId).subscribe(
      (res: any) => {
        this.getAppendFilesList = res.responseData?.appendSheetList;

        console.log('getAppendFiles', res);
      },
      (err: any) => { }
    );
  }

  getJoinFilesList: Array<any> = [];
  // private threeNext() {
  //   this.getJoinFilesListApi();
  // }

  getJoinFilesListApi() {
    //this.getAppendFilesList = []; //x
    this.getJoinFilesList = []
    this.solService.getMergeList(this.process.processId).subscribe(
      (res: any) => {
        this.getJoinFilesList = res.responseData?.templatesMergeDetailsList;

        console.log('getMergeList', res);
      },
      (err: any) => { }
    );
  }

  fourPrev(item: any) {
    this.append_SourceFilesList = [];
    this.getJoinFilesList = [];
    this.loader.show()
    forkJoin([
      this.solService.getTargetFileList(this.process.processId),
      this.solService.getMergeList(this.process.processId),
    ]).subscribe((res: any) => {
      this.loader.hide()

      console.log(res);
      let apdResponse = this.appendResponse(res[0]?.responseData.appendSheetListDto?.appendSheetList)

      //let fileResponse = res[0]?.responseData.templateFileDetailsListDto?.totalfileDetails;
      let filesheetList = this.totalfileDetails(res[0]?.responseData.templateFileDetailsListDto?.totalfileDetails, item)

      apdResponse.forEach(
        (_appendObj: any) => this.append_SourceFilesList.push(_appendObj)
      );
      filesheetList.forEach((_sheetObj: any) =>
        this.append_SourceFilesList.push(_sheetObj)
      );
      this.append_SourceFilesListForSearch = JSON.parse(JSON.stringify(this.append_SourceFilesList))
      console.log('this.append_SourceFilesList', this.append_SourceFilesList);

      this.getJoinFilesList = res[1]?.responseData?.templatesMergeDetailsList;

      this.tabsChange(item);
      this.selectedTab = item.id
    });
  }

  appendResponse(array: any) {
    array.forEach(
      (appObj: any) => {
        appObj.isAppendExpandInJoin = true
        appObj.tableNameUI = appObj.appendName;
        appObj.searchValueInCreateDatasetPopup = '' //DM
        appObj.searchValueInColumnPopup = '' //DM
        appObj.isSelectAllParentInDM = false; //DM
        appObj.tableAppendFieldsDto.forEach((colObj: any) => {
          colObj.isSelectAllChildInDM = false; //DM
          (colObj.fileType = appObj.type),
            (colObj.showTabColName =
              appObj.appendName + '[' + colObj.fieldName + ']');
          colObj.isDropdownDirtyInTF = false;
        });
      }
    );
    return array
  }

  totalfileDetails(fileResponse: any, item: any) {

    fileResponse.forEach((fileObj: any) => {
      fileObj.totalSheetList.forEach((sheetObj: any) => {
        if (sheetObj.sheet != null) {
          const sheetName = sheetObj.sheetName;
          let chkdList = sheetObj.sheet.map((x: any) => x.isChecked)
          if (chkdList.includes(false)) sheetObj.isCheckedInTF = false
          else sheetObj.isCheckedInTF = true
          sheetObj.isCheckedParentDirtyInTF = false
          sheetObj.sheet?.forEach((columnObj: any) => {
            let filArr = this.allDataTypeByDatatypeName.filter((x: any) => x.dataTypeName == columnObj.columnType) //x
            columnObj.filteredColumnTypeList = filArr[0]?.dataTypeList //x
            columnObj.templateId = sheetObj.templateId
            columnObj.tableName = sheetObj.tableName;
            columnObj.isCheckedChildDirtyInTF = false
            columnObj.isDropdownDirtyInTF = false;
            columnObj.type = 'template';
            if (fileObj.fileExt == 'xlsx' || fileObj.fileExt == 'xls') {
              columnObj.showTabColName = fileObj.fileName + '-' + sheetName + '.' + fileObj.fileExt + '[' + columnObj.fieldName + ']';
              columnObj.tableNameUI = fileObj.fileName + '-' + sheetName + '.' + fileObj.fileExt

            }
            else if (fileObj.fileExt == 'txt' || fileObj.fileExt == 'csv') {
              columnObj.showTabColName = fileObj.fileNameWithExt + '[' + columnObj.fieldName + ']';
              columnObj.tableNameUI = fileObj.fileNameWithExt
            }

            else if (fileObj.fileExt == 'json') {
              columnObj.showTabColName = fileObj.fileNameWithExt + '[' + columnObj.fieldName + ']';
              columnObj.tableNameUI = fileObj.fileNameWithExt

            }
            columnObj.fileExt = fileObj.fileExt;
          });
        }
      });
    });
    const filesheetList: any[] = [];


    fileResponse.forEach((fileObj: any) => {

      fileObj.isSelectAllParentInDM = false; //DM
      fileObj.totalSheetList.forEach((sheetObj: any) => {
        if (sheetObj.sheetSelected) {
          sheetObj.sheet?.forEach((columnObj: any) => {
            columnObj.isSelectAllChildInDM = false; //DM
          });
          sheetObj.type = 'template'
          if (sheetObj.fileExt == 'xlsx' || sheetObj.fileExt == 'xls')
            filesheetList.push({
              searchValueInTF: '', //TF
              searchValueInCreateDatasetPopup: '',//DM
              searchValueInColumnPopup: '',//DM 
              isSourceFilesExpandInJoin: true,
              fileExt: sheetObj.fileExt,
              fileName: fileObj.fileName + '-' + sheetObj.sheetName + '.' + fileObj.fileExt,
              ...sheetObj,
              isCheckedInAppend: false,
              isCheckedInJoin: false,
              type: 'files',
              tableNameUI:
                fileObj.fileName +
                '-' +
                sheetObj.sheetName +
                '.' +
                fileObj.fileExt,
            });

          else if (sheetObj.fileExt == 'csv' || sheetObj.fileExt == 'txt')
            filesheetList.push({
              searchValueInTF: '', //TF
              searchValueInCreateDatasetPopup: '',//DM
              searchValueInColumnPopup: '',//DM
              isSourceFilesExpandInJoin: true,
              fileExt: sheetObj.fileExt,
              fileName: fileObj.fileNameWithExt,
              ...sheetObj,
              isCheckedInAppend: false,
              isCheckedInJoin: false,
              type: 'files',
              tableNameUI: fileObj.fileNameWithExt,
            });
          else if (sheetObj.fileExt == 'json')
            filesheetList.push({
              searchValueInTF: '', //TF
              searchValueInCreateDatasetPopup: '', //DM
              searchValueInColumnPopup: '', //DM
              isSourceFilesExpandInJoin: true,
              fileExt: sheetObj.fileExt,
              fileName: fileObj.fileNameWithExt,
              ...sheetObj,
              isCheckedInAppend: false,
              isCheckedInJoin: false,
              type: 'files',
              tableNameUI: fileObj.fileNameWithExt,
            });
        }
      })
    })
    if (item.id == 5) {
      return filesheetList.filter((element: any) => //duplicate
        element.sheet.some(
          (subElement: any) => subElement.isChecked == true
        )
      )
        .map((element: any) => {
          return Object.assign({}, element, {
            sheet: element.sheet.filter(
              (subElement: any) =>
                subElement.isChecked == true
            ),
          });
        })
    }
    else return filesheetList
  }


  threePrev(item: any) {
    this.getAppendFilesList = []
    this.sourceFilesList = []
    this.sourceFilesListForSearch = []
    forkJoin([
      this.solService.getAllFileTemplateListByProcessID(this.process.processId),
      this.solService.getAppendFiles(this.process.processId),
    ]).subscribe((res: any) => {
      // let filesheetList = this.totalfileDetails(res[0]?.responseData?.totalfileDetails)
      this.sourceFilesList = this.totalfileDetails(res[0]?.responseData?.totalfileDetails, item)
      this.sourceFilesListForSearch = JSON.parse(JSON.stringify(this.sourceFilesList))

      console.log('this.targetFileList', this.targetFileList);

      this.getAppendFilesList = res[1].responseData?.appendSheetList;
      console.log('sourceFilesList', this.sourceFilesList)
      this.tabtab(item)
      // this.tabsChange(item);
      // this.selectedTab = item.id
    })
  }

  getOpearatorList: Array<any> = [];
  getAllOperatorsList() {
    this.solService.getAllOperators().subscribe(
      (res: any) => {
        this.getOpearatorList = res?.responseData;
        console.log('this.getOpearatorList', this.getOpearatorList);
      },
      (err: any) => { }
    );
  }

  targetFileNextCndn(): any {
    let hasColumns = this.targetFileList.filter((element: any) => //duplicate
      element.sheet.some(
        (subElement: any) => subElement.isChecked == true
      )
    )
      .map((element: any) => {
        return Object.assign({}, element, {
          sheet: element.sheet.filter(
            (subElement: any) =>
              subElement.isChecked == true
          ),
        });
      })
    return hasColumns
  }


  fileListtt: any[] = [];
  isUploadFilesNextBtnEnable: boolean = false;
  sourceFilesAppendJoinFileList: Array<any> = [];
  selectedTab: any;
  changeTabs(item: any, value?: string) {
    console.log(item, value);
    this.submitted = false;
    this.submittedErrorMsg = '';

    this.getAllDataTypeByDatatypeName() //for target files edit


    if (item.id == 0 && value == 'prev') { //AP
      this.router.navigate(['/user/admin1/solutionboard/add-process']);
      this.getAllOrganizations(item);
      this.getAllIndustry();

    }

    if (item.id == 1 && value == 'next') { //UF

      this.addProcessSave(item)

    }
    if (item.id == 1 && value == 'prev') { //UF
      this.router.navigate(['/user/admin1/solutionboard/upload-files']);
      this.getAllFileTemplateListByProcessID(item);

      // if (this.uploadedManualToggleForm?.value.manualOrUploaded) {
      if (this.process.solutionType != undefined) {
        if (this.process.solutionType == 'U') {
          this.enableUploadSQLPython = true
          this.getSolutionScript('enableUploadSQLPython')
          return
        }
      }
    }

    if (item.id == 2 && value == 'prev') { //TF
      this.router.navigate(['/user/admin1/solutionboard/target-files']);
      //this.getTargetFileList();

      this.getNewTargetFilesList(item);
    }
    if (item.id == 2 && value == 'next') { //TF
      if (this.nextBtnEnableInUF() == true) {
        //if (this.isUploadFilesNextBtnEnable == true){
        this.popup.open(false, 'Please select atleast one file')
        return;
      }
      if (this.uploadedManualToggleForm.value.manualOrUploaded) {
        this.enableUploadSQLPython = true
        this.getSolutionScript('enableUploadSQLPython')
        return
      }
      else this.enableUploadSQLPython = false

      this.router.navigate(['/user/admin1/solutionboard/target-files']);
      this.oneNext(item, 'manual');
    }

    if (item.id == 3 && value == 'prev') { //A
      this.router.navigate(['/user/admin1/solutionboard/append']);
      //this.getTargetFileList();


      this.threePrev(item)
      // this.getNewTargetFilesList();
      // this.getAppendFilesApi();
    }

    if (item.id == 3 && value == 'next') { //A

      if (this.targetFileNextCndn().length != 0) {
        this.router.navigate(['/user/admin1/solutionboard/append']);
        this.threeNext(item);
      }
      else this.popup.open(false, 'Please select atleast one Column or Table')

      //appendList create here
    }

    if (item.id == 4 && value == 'prev') {//J
      if (this.process.solutionType != undefined) {
        if (this.process.solutionType == 'U') {
          this.changeTabs({ id: 1 }, 'prev')
          // this.router.navigate(['/user/admin1/solutionboard/upload-files']);
        }
        else if (this.process.solutionType == 'M') {
          this.router.navigate(['/user/admin1/solutionboard/join']);
          this.fourPrev(item);
        }
      }

      else { //need to check whether need or not
        this.router.navigate(['/user/admin1/solutionboard/join']);
        this.fourPrev(item);
      }
      // this.getTargetFileList();
      // this.threeNext()

      // this.getJoinFilesListApi()
    }

    if (item.id == 4 && value == 'next') {//J
      this.router.navigate(['/user/admin1/solutionboard/join']);
      // this.getTargetFileList();
      // this.threeNext()
      this.fourPrev(item);
    }

    if (item.id == 5 && value == 'prev') {
      this.router.navigate(['/user/admin1/solutionboard/data-modeling']);

      this.getTargetFileList(item);
      this.getUploadedScriptTableList() //DM
      this.getAllFunctions(); //fx
      this.getAllOperatorsList();
    }
    if (item.id == 5 && value == 'next') { //DM
      this.router.navigate(['/user/admin1/solutionboard/data-modeling']);
      this.getTargetFileList(item);
      this.getUploadedScriptTableList() //DM
      this.getAllFunctions(); //fx
      this.getAllOperatorsList();

    }



    //console.log('this.fileListt', this.fileListt);
    //console.log( 'this.fileListtt',this.fileListtt);
    // //console.log(this.sortedCheckedList, 'this.sortedCheckedList');
    // console.log(this.fileSheetList, 'this.fileSheetList')
  }

  ScenarioPopup: boolean | undefined;
  closePopup() {
    this.ScenarioPopup = false;
  }
  Popup() {
    this.ScenarioPopup = true;
  }
  overlayPopUp() {
    this.DataPopUp = true;
    this.guid = true;
  }
  nextguid(i: any) {
    if (i == 0) {
      this.guidindex = 0
    }
    else if (i == 1) {
      this.guidindex = 1
    }
    else if (i == 2) {
      this.guidindex = 2
    }
    else if (i == 3) {
      this.guidindex = 3
    }
    else if (i = 4) {
      this.DataPopUp = false;
      this.guid = false;
      this.guidindex = 0
    }
  }

  private tabsChange(item: any) {
    console.log(item.id);
    this.activeTab = item.id;
    this.tabs.forEach((obj: any) => {
      if (item.id == obj.id) { obj.isActive = true; }
      else obj.isActive = false;
    });
    console.log(this.tabs);
  }

  userguidepopup() { this.userguideaddprocess = true; }
  userguidepopup1() { this.userguideupload = true; }
  userguidepopup2() { this.userguidetarget = true; }
  userguidepopup3() { this.userguideappend = true; }
  userguidepopup4() { this.userguidejoin = true; }
  userguidepopup5() { this.userguidedatamodeling = true; }

  closeuserguidepopup() { this.userguideaddprocess = false; }
  closeuserguidepopup1() { this.userguideupload = false; }
  closeuserguidepopup2() { this.userguidetarget = false; }
  closeuserguidepopup3() { this.userguideappend = false; }
  closeuserguidepopup4() { this.userguidejoin = false; }
  closeuserguidepopup5() { this.userguidedatamodeling = false; }

}
// this.fileForm.patchValue({
//   imgFile: this.demo,
//   vidFile: this.procData.videoName,
//   broFile: this.procData.brochureName,
// });
// this.fileForm.controls.flie.setValidators(null);
// this.fileForm.patchValue({
//   imgFile: this.demo,
// vidFile: this.procData.videoName,
// broFile: this.procData.brochureName,
// })
// console.log(' this.showFileNameUI.img', this.showFileNameUI.img);

// let form = document.getElementById("myAwesomeForm");

// let ImageURL = "data:image/gif;base64,R0lGODlhPQBEAPeoAJosM//AwO/AwHVYZ/z595kzAP/s7P+goOXMv8+fhw/v739/f+8PD98fH/8mJl+fn/9ZWb8/PzWlwv///6wWGbImAPgTEMImIN9gUFCEm/gDALULDN8PAD6atYdCTX9gUNKlj8wZAKUsAOzZz+UMAOsJAP/Z2ccMDA8PD/95eX5NWvsJCOVNQPtfX/8zM8+QePLl38MGBr8JCP+zs9myn/8GBqwpAP/GxgwJCPny78lzYLgjAJ8vAP9fX/+MjMUcAN8zM/9wcM8ZGcATEL+QePdZWf/29uc/P9cmJu9MTDImIN+/r7+/vz8/P8VNQGNugV8AAF9fX8swMNgTAFlDOICAgPNSUnNWSMQ5MBAQEJE3QPIGAM9AQMqGcG9vb6MhJsEdGM8vLx8fH98AANIWAMuQeL8fABkTEPPQ0OM5OSYdGFl5jo+Pj/+pqcsTE78wMFNGQLYmID4dGPvd3UBAQJmTkP+8vH9QUK+vr8ZWSHpzcJMmILdwcLOGcHRQUHxwcK9PT9DQ0O/v70w5MLypoG8wKOuwsP/g4P/Q0IcwKEswKMl8aJ9fX2xjdOtGRs/Pz+Dg4GImIP8gIH0sKEAwKKmTiKZ8aB/f39Wsl+LFt8dgUE9PT5x5aHBwcP+AgP+WltdgYMyZfyywz78AAAAAAAD///8AAP9mZv///wAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAACH5BAEAAKgALAAAAAA9AEQAAAj/AFEJHEiwoMGDCBMqXMiwocAbBww4nEhxoYkUpzJGrMixogkfGUNqlNixJEIDB0SqHGmyJSojM1bKZOmyop0gM3Oe2liTISKMOoPy7GnwY9CjIYcSRYm0aVKSLmE6nfq05QycVLPuhDrxBlCtYJUqNAq2bNWEBj6ZXRuyxZyDRtqwnXvkhACDV+euTeJm1Ki7A73qNWtFiF+/gA95Gly2CJLDhwEHMOUAAuOpLYDEgBxZ4GRTlC1fDnpkM+fOqD6DDj1aZpITp0dtGCDhr+fVuCu3zlg49ijaokTZTo27uG7Gjn2P+hI8+PDPERoUB318bWbfAJ5sUNFcuGRTYUqV/3ogfXp1rWlMc6awJjiAAd2fm4ogXjz56aypOoIde4OE5u/F9x199dlXnnGiHZWEYbGpsAEA3QXYnHwEFliKAgswgJ8LPeiUXGwedCAKABACCN+EA1pYIIYaFlcDhytd51sGAJbo3onOpajiihlO92KHGaUXGwWjUBChjSPiWJuOO/LYIm4v1tXfE6J4gCSJEZ7YgRYUNrkji9P55sF/ogxw5ZkSqIDaZBV6aSGYq/lGZplndkckZ98xoICbTcIJGQAZcNmdmUc210hs35nCyJ58fgmIKX5RQGOZowxaZwYA+JaoKQwswGijBV4C6SiTUmpphMspJx9unX4KaimjDv9aaXOEBteBqmuuxgEHoLX6Kqx+yXqqBANsgCtit4FWQAEkrNbpq7HSOmtwag5w57GrmlJBASEU18ADjUYb3ADTinIttsgSB1oJFfA63bduimuqKB1keqwUhoCSK374wbujvOSu4QG6UvxBRydcpKsav++Ca6G8A6Pr1x2kVMyHwsVxUALDq/krnrhPSOzXG1lUTIoffqGR7Goi2MAxbv6O2kEG56I7CSlRsEFKFVyovDJoIRTg7sugNRDGqCJzJgcKE0ywc0ELm6KBCCJo8DIPFeCWNGcyqNFE06ToAfV0HBRgxsvLThHn1oddQMrXj5DyAQgjEHSAJMWZwS3HPxT/QMbabI/iBCliMLEJKX2EEkomBAUCxRi42VDADxyTYDVogV+wSChqmKxEKCDAYFDFj4OmwbY7bDGdBhtrnTQYOigeChUmc1K3QTnAUfEgGFgAWt88hKA6aCRIXhxnQ1yg3BCayK44EWdkUQcBByEQChFXfCB776aQsG0BIlQgQgE8qO26X1h8cEUep8ngRBnOy74E9QgRgEAC8SvOfQkh7FDBDmS43PmGoIiKUUEGkMEC/PJHgxw0xH74yx/3XnaYRJgMB8obxQW6kL9QYEJ0FIFgByfIL7/IQAlvQwEpnAC7DtLNJCKUoO/w45c44GwCXiAFB/OXAATQryUxdN4LfFiwgjCNYg+kYMIEFkCKDs6PKAIJouyGWMS1FSKJOMRB/BoIxYJIUXFUxNwoIkEKPAgCBZSQHQ1A2EWDfDEUVLyADj5AChSIQW6gu10bE/JG2VnCZGfo4R4d0sdQoBAHhPjhIB94v/wRoRKQWGRHgrhGSQJxCS+0pCZbEhAAOw==";
// Split the base64 string in data and contentType
// var block = ImageURL.split(";");
// Get the content type of the image
// var contentType = block[0].split(":")[1];// In this case "image/gif"
// get the real base64 content of the file
// var realData = block[1].split(",")[1];// In this case "R0lGODlhPQBEAPeoAJosM...."

// Convert it to a blob to upload
// var blob = this.b64toBlob(realData, contentType,"");

// Create a FormData and append the file with "image" as parameter name
// var formDataToUpload = new FormData(form);
// formDataToUpload.append("image", blob);
// b64toBlob(b64Data: any, contentType: any, sliceSize: any) {
//   contentType = contentType || '';
//   sliceSize = sliceSize || 512;

//   var byteCharacters = atob(b64Data);
//   var byteArrays = [];

//   for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
//     var slice = byteCharacters.slice(offset, offset + sliceSize);

//     var byteNumbers = new Array(slice.length);
//     for (var i = 0; i < slice.length; i++) {
//       byteNumbers[i] = slice.charCodeAt(i);
//     }

//     var byteArray = new Uint8Array(byteNumbers);

//     byteArrays.push(byteArray);
//   }

//   var blob = new Blob(byteArrays, { type: contentType });
//   return blob;
// }

//UF
export interface ParentElement {
  fileNameWithExt: string;
  'File Name': string
  'Uploaded On': string
  totalSheetList?: ChildElement[] | MatTableDataSource<ChildElement>;
}
export interface ChildElement {
  sheetName: string;
}
function deepClone(sourceFilesList: any[]): any[] {
  throw new Error('Function not implemented.');
}

