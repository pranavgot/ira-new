import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
// import { splitClasses } from '@angular/compiler';
import { Component, OnInit, Renderer2 } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup } from '@angular/forms';
import * as XLSX from "xlsx";
import { SolutionService } from 'src/app/core/services/solution/solution.service';

@Component({
  selector: 'app-create-new-solution',
  templateUrl: './create-new-solution.component.html',
  styleUrls: ['./create-new-solution.component.scss']
})

export class CreateNewSolutionComponent implements OnInit {
  whiteSpace: any = { left: true, right: true }
  formUploadFiles = new FormGroup({
    file: new FormControl('')
  });
  tab1: boolean = true;
  tab2: boolean = false;
  tab3: boolean = false;
  tab4: boolean = false;
  selectedFormula: string = '';
  selectedDataSetField: any;
  excelErrorMsg: any = {};
  myFiles: any[] = [];
  enableDataSetPopup: boolean = false;
  selectedDataSetFieldValue: any;

  dataSetNameControl: FormControl = new FormControl(null);
  dataSetName: string | undefined;


  data = {
    DatasetDetailsList: [
      {
        datasetName: "example comany",
        datasetFieldDTOList: [
          {
            ['Field ']: "example project",
            'Defination': '',
            'Data type': ''
          }
        ]
      }
    ]
  }
  
  dataTypeList = [{id:0, value:'Text'},{id:1, value:'Number'},{id:2, value:'Date'}]

  // public invoiceForm: FormGroup = this.fb.group({
  //   //Rows: this.fb.array([]),
  //   DRows: this.fb.array([])
  // });;
  invoiceForm1: FormGroup | any;

  formulasList = [
    { id: 0, name: 'APPROXIMATE DISTINCT COUNT', description: 'Returns the approximate number of rows that contain distinct values in a column.' },
    { id: 1, name: 'AVERAGE', description: 'Returns the average (arithmetic mean) of all the numbers in a column.' },
    { id: 2, name: 'COUNT', description: 'Counts the number of rows in the specified column that contain non-blank values.' },
    { id: 3, name: 'DISTINCT COUNT', description: 'Counts the number of distinct values in a column.' },
    { id: 4, name: 'MAX', description: 'Returns the largest numeric value in a column, or between two scalar expressions.' },
    { id: 5, name: 'MIN', description: 'Returns the smallest numeric value in a column, or between two scalar expressions.' },
    { id: 6, name: 'PRODUCT', description: 'Returns the product of the numbers in a column.' },
    { id: 7, name: 'SUM', description: 'Adds all the numbers in a column.' },
    { id: 8, name: 'DIVIDE', description: 'Adds all the numbers in a column.' },
    { id: 9, name: 'ROUND OFF', description: 'Adds all the numbers in a column.' },
    { id: 10, name: 'POWER', description: 'Adds all the numbers in a column.' },
    { id: 11, name: 'FLOOR', description: 'Adds all the numbers in a column.' },
    { id: 12, name: 'GCD', description: 'Adds all the numbers in a column.' },
    { id: 13, name: 'COUNT', description: 'Adds all the numbers in a column.' },
    { id: 14, name: 'QUOTIENT', description: 'Adds all the numbers in a column.' },
    { id: 15, name: 'PERCENTILE', description: 'Adds all the numbers in a column.' },
  ];


  // APPROXIMATEDISTINCTCOUNT	Returns the approximate number of rows that contain distinct values in a column.
  // AVERAGE	Returns the average (arithmetic mean) of all the numbers in a column.
  // AVERAGEA	Returns the average (arithmetic mean) of the values in a column.
  // AVERAGEX	Calculates the average (arithmetic mean) of a set of expressions evaluated over a table.
  // COUNT	Counts the number of rows in the specified column that contain non-blank values.
  // COUNTA	Counts the number of rows in the specified column that contain non-blank values.
  // COUNTAX	Counts non-blank results when evaluating the result of an expression over a table.
  // COUNTBLANK	Counts the number of blank cells in a column.
  // COUNTROWS	Counts the number of rows in the specified table, or in a table defined by an expression.
  // COUNTX	Counts the number of rows that contain a number or an expression that evaluates to a number, when evaluating an expression over a table.
  // DISTINCTCOUNT	Counts the number of distinct values in a column.
  // DISTINCTCOUNTNOBLANK	Counts the number of distinct values in a column.
  // MAX	Returns the largest numeric value in a column, or between two scalar expressions.
  // MAXA	Returns the largest value in a column.
  // MAXX	Evaluates an expression for each row of a table and returns the largest numeric value.
  // MIN	Returns the smallest numeric value in a column, or between two scalar expressions.
  // MINA	Returns the smallest value in a column, including any logical values and numbers represented as text.
  // MINX	Returns the smallest numeric value that results from evaluating an expression for each row of a table.
  // PRODUCT	Returns the product of the numbers in a column.
  // PRODUCTX	Returns the product of an expression evaluated for each row in a table.
  // SUM	Adds all the numbers in a column.
  // SUMX	Returns the sum of an expression evaluated for each row in a table.


  // form2 = new FormGroup({
  //   country: new FormControl()
  // });

  formFormula: FormGroup = this.fb.group({
    formula: ['']
  })
  items!: FormArray;

  constructor(public fb: FormBuilder, private renderer: Renderer2, public solService: SolutionService) { }

  ngOnInit(): void {

    this.invoiceForm1 = this.fb.group({
      //Rows: this.fb.array([]),
      DRows1: this.fb.array([]),
      items: new FormArray([]),
      DatasetDetailsList: this.fb.array([])
    });
    // this.destination.forEach((row) => {
    //   (this.invoiceForm.get("DRows") as FormArray).push(this.addRow(row));
    // });

    //looping and adding to dataset Table
    // this.destination1.forEach((row) => {
    //   (this.invoiceForm1.get("DRows1") as FormArray).push(this.addRow1(row));
    // });
  }

  //drag n drop
  // origin: any[] = [
  //   { title: 'Text', type: 'text' },
  //   { title: 'Number', type: 'number' },
  //   { title: 'Dropdown', type: 'select' },
  //   { title: 'Radio', type: 'radio' },
  //   { title: 'Checkbox', type: 'check' },
  //   { title: 'Date', type: 'date' },
  // ];

  //destination: any[] = [{ title: 'Text', type: 'description' }, { title: 'Radio', type: 'radio' }];
  //destination1:any[]= [{ ['Field ']: "CompanyCode", ['Description']: "Company reference invoice or credit note relates to",['Data type']: "Text", fileName:'abc'}]

  // drop(event: CdkDragDrop<string[]>) {
  //   if (event.previousContainer === event.container) {
  //     moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
  //   } else {
  //     let item: any = event.previousContainer.data[event.previousIndex];
  //     let copy: any = JSON.parse(JSON.stringify(item));
  //     let element: any = {};

  //     for (let attr in copy) {
  //       if (attr == 'title') {
  //         // element[attr] = copy[attr] ;
  //         element = copy;
  //         //}else{
  //         //element[attr] = copy[attr]; 
  //       }
  //     }
  //     //this.destination.splice(event.currentIndex,0, element);
  //     //(this.invoiceForm.get("DRows") as FormArray)
  //     //console.log((this.invoiceForm.get("DRows") as FormArray).value)
  //     //(this.invoiceForm.get("DRows")as FormArray).insert(event.currentIndex, this.fb.control(element));
  //     let x = (this.invoiceForm.get("DRows") as FormArray);
  //     // x.value.splice(event.currentIndex, 0, element);
  //     x.insert(event.currentIndex, this.addRow(element));

  //   }

  // }

  // deleteDropRow(index: number) {
  //   let x = (this.invoiceForm.get("DRows") as FormArray).removeAt(index);

  // }

  // onSubmitDataSet() {
  //   // console.log(this.destination,1)
  //   console.log(this.invoiceForm.value)
  // }

  // //+ reactive
  // addRow(obj: any) {
  //   return this.fb.group({
  //     title: [obj.title],
  //     type: [obj.type]
  //   });
  // }

  // getDropControls() {
  //   return (this.invoiceForm.get('DRows') as FormArray).controls;
  // }

  // addNewDRow() {

  //   (this.invoiceForm.get('DRows') as FormArray).push(this.fb.group({
  //     title: [""],
  //     type: [""]
  //   }));

  // }

  // captureField(event: any, item: any) {
  //   console.log(event, item.value.title)
  // }







  //upload multiple files
  onFileChange(ev: any) {
    this.myFiles = [];

    for (var i = 0; i < ev.target.files.length; i++) {

      let workBook: any = null;
      let jsonData: any = null;
      const reader = new FileReader();
      const file = ev.target.files[i];

      let isExcel = file.name.split('.').pop();


      reader.onload = (event) => {
        const data = reader.result;
        workBook = XLSX.read(data, { type: 'binary' });
        jsonData = workBook.SheetNames.reduce((initial: any, name: any) => {
          const sheet = workBook.Sheets[name];
          initial[name] = XLSX.utils.sheet_to_json(sheet);
          initial['fileName'] = file.name;
          return initial;
        }, {});
        //validating hasKey
        let hasKey = 'Data Fields' in jsonData;
        if (!hasKey) {
          this.excelErrorMsg.dataFields = 'Data Fields isnt there'
        }
        let hasKe = 'Sheet1' in jsonData;
        if (!hasKe) {
          this.excelErrorMsg.sheet1 = 'Sheet1 isnt there'
        }

        jsonData['Data Fields']?.forEach((item: any, index: number) => {

          if (item.Description != undefined) {
            item.fileName = file.name;
            let croppedFileName = file.name.split('.').slice(0, -1).join('.');
            let croppedFieldName = item["Field "];
            item.showFileFieldName = croppedFileName.substring(0, 4) + '.' + croppedFieldName;
            item.fileFieldName = croppedFileName + '.' + croppedFieldName;


          }
          else {
            let x = jsonData['Data Fields'];
            x.splice(index, x.length - 1)
          }

        })
        let dF = (jsonData['Data Fields'] != undefined) ? jsonData['Data Fields'] : [];//3
        let uniqueArr = [...new Set(dF)];

        if (dF.length != uniqueArr.length) {
          this.excelErrorMsg.duplicate = 'have duplicates'
        }

        let dT = jsonData['Data Fields']?.filter((x: any) => (x['Data type'] == 'Text') || (x['Data type'] == 'Number') || (x['Data type'] == 'Date'));
        dT = (dT != undefined) ? dT : [];
        if (dT.length !== dF.length) {
          this.excelErrorMsg.dataType = 'have duplicate data types'
        }
        console.log(this.excelErrorMsg)



        //console.log(jsonData['Data Fields']);
        let jsonStringify = JSON.stringify(jsonData['Data Fields'])

        let formData: FormData = new FormData();
        formData.append('file', file);
        formData.append('dataFields', jsonStringify)
        formData.append('processId', '550B00B2-C9D6-437F-9080-4CA0AE63B2FB')

        // this.solService.uploadExcel(formData).subscribe((res: any) => {
        //   if (res.statusCode == 200) {
        //     let responseData = JSON.parse(res.responseData.dataFields)

        //     //this.myFiles.push([responseData]) //need to check

        //   }

        // });
        this.myFiles.push([jsonData])
        console.log(this.myFiles)
      }
      reader.readAsBinaryString(file);
      this.whiteSpace.left = false;

    }
  }
  //drag and drop input files
  // drop1(event: CdkDragDrop<string[]>) {
  //   console.log(1)
  //   if (event.previousContainer === event.container) {
  //     moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
  //   } else {
  //     let item: any = event.previousContainer.data[event.previousIndex];
  //     let copy: any = JSON.parse(JSON.stringify(item));
  //     let element: any = {};

  //     for (let attr in copy) {
  //       if (attr == 'Field ') {
  //         // element[attr] = copy[attr] ;
  //         element = copy;
  //         //}else{
  //         //element[attr] = copy[attr]; 
  //       }
  //     }
  //     //this.destination.splice(event.currentIndex,0, element);
  //     //(this.invoiceForm.get("DRows") as FormArray)
  //     //console.log((this.invoiceForm.get("DRows") as FormArray).value)
  //     //(this.invoiceForm.get("DRows")as FormArray).insert(event.currentIndex, this.fb.control(element));
  //     let x = (this.invoiceForm1.get("DRows1") as FormArray);
  //     // x.value.splice(event.currentIndex, 0, element);
  //     x.insert(event.currentIndex, this.addRow1(element));//addd

  //   }
  // }
  addNewDRow1() {
    (this.invoiceForm1.get('DRows1') as FormArray).push(this.fb.group({
      ["Field "]: [""],
      ["Description"]: [""],
      ["Data type"]: [""],
      defination: [""]
    }));
  }
  onSubmitDataSet1() {
    // console.log(this.destination,1)
    console.log(this.invoiceForm1.value)
  }
  getDropControls1() {
    return (this.invoiceForm1.get('DRows1') as FormArray).controls;
  }
  deleteDropRow1(index: number) {
    let x = (this.invoiceForm1.get("DRows1") as FormArray).removeAt(index);

  }
  addRow1(obj: any) {
    return this.fb.group({
      ['Field ']: [obj['Field ']],
      ['Description']: [obj.Description],
      ['Data type']: [obj['Data type']],
      fileName: [obj.fileName],
      defination: ['']
    });
  }

  captureDataSetFields(event: any, i: any, columnName: string) { //x
    let fieldValue = event.value[columnName];
    this.selectedDataSetField = {};
    this.selectedDataSetField = { indexValue: i, fieldValue: fieldValue, columnName: columnName.trim() };
    console.log(this.selectedDataSetField)
  }





  //drag and drop to defination field
  public dragstart_handler(event: any) { //must

    event.dataTransfer.setData('text/plain', event.target.dataset.dragData);
  }



  //dd 
  // changeFormula(e: any) { //x
  //   this.selectedFormula = e.target.value;
  //   console.log(this.selectedFormula)
  //   this.selectedDataSetField.showFileFieldName = (this.selectedDataSetField.showFileFieldName == undefined) ? '' : this.selectedDataSetField.showFileFieldName;

  //   this.invoiceForm1.get("DRows1").controls[this.selectedDataSetField.indexValue].patchValue({
  //     defination: this.selectedDataSetField.showFileFieldName + ' ' + this.selectedDataSetField.fieldValue + this.selectedFormula
  //   })

  //   this.renderer.selectRootElement("#defination" + this.selectedDataSetField.indexValue).focus();
  // }




  // submit(){

  //   console.log(this.invoiceForm1.value);
  //   let DRows1 :any = [];

  //   DRows1 = this.invoiceForm1.value.items
  //   console.log("drows",DRows1);


  // }

  // createItem(): FormGroup {
  //   return this.fb.group({
  //     field: '',
  //     description: '',
  //     datatype: '',
  //     defination:''
  //   });
  // }

  // addItem(): void {
  //   this.items = this.invoiceForm1.get('items') as FormArray;
  //   this.items.push(this.createItem());
  // }


  //DataSet
  createDataSetFieldDTOList() {
    return this.fb.group({
      ['Field ']: [''],
      'Defination': '',
      'Data type': ''
    })
  }

  addNewDataSet() { //add dataset button
    this.whiteSpace.right = false;
    this.enableDataSetPopup = false;
    this.dataSetName = this.dataSetNameControl.value;

    let control = <FormArray>this.invoiceForm1.controls.DatasetDetailsList;
    control.push(
      this.fb.group({
        datasetName: this.dataSetName,
        datasetFieldDTOList: this.fb.array([this.createDataSetFieldDTOList()])
      })
    )
  }

  addNewDataSetRow(control: any) { //+ button for every table
    control.push(this.createDataSetFieldDTOList())
  }

  deleteDataSet(index: any) { //delete table
    let control = <FormArray>this.invoiceForm1.controls.DatasetDetailsList;
    control.removeAt(index)
  }

  deleteDataSetRow(control: any, index: any) {
    control.removeAt(index)
  }


  saveDataSet(datasetList: any) {
    let postReq: any = {};
    postReq.processId = "550B00B2-C9D6-437F-9080-4CA0AE63B2FB";
    postReq.DatasetDetailsList = datasetList;

    this.solService.saveDataSetApi(postReq).subscribe((res: any) => {
      console.log(res);

    })
  }

  captureDataSetField(item: any, columnName: string, i: number, j: number) {
    console.log(item, columnName, i, j);
    let fieldValue = this.invoiceForm1.get("DatasetDetailsList").controls[i].value.datasetFieldDTOList[j][columnName];

    this.selectedDataSetFieldValue = { value: fieldValue, tableIndex: i, rowIndex: j, columnName: columnName }
  }

  changeDatatype(event:any, columnName: string,i:number,j:number){
      this.invoiceForm1.get("DatasetDetailsList").controls[i].controls['datasetFieldDTOList'].controls[j].patchValue({ ['Data type']: event.target.value })
  }


 
  inputFileRowClicked(item: any) {

    //this.invoiceForm1.get('DatasetDetailsList').controls[this.selectedDataSetFieldValue.tableIndex].get('datasetFieldDTOList').controls[this.selectedDataSetFieldValue.rowIndex].get('Field ').reset()
    let fieldValue = this.invoiceForm1.get("DatasetDetailsList").controls[this.selectedDataSetFieldValue.tableIndex].controls['datasetFieldDTOList'].controls[this.selectedDataSetFieldValue.rowIndex].controls[this.selectedDataSetFieldValue.columnName].value
    let fieldValu = this.invoiceForm1.get("DatasetDetailsList").controls[this.selectedDataSetFieldValue.tableIndex].value.datasetFieldDTOList[this.selectedDataSetFieldValue.rowIndex][this.selectedDataSetFieldValue.columnName];
    if (this.selectedDataSetFieldValue.columnName == 'Field ') {
      let appendValue = fieldValue.concat(item[this.selectedDataSetFieldValue.columnName])
      this.invoiceForm1.get('DatasetDetailsList').controls[this.selectedDataSetFieldValue.tableIndex].get('datasetFieldDTOList').controls[this.selectedDataSetFieldValue.rowIndex].get(this.selectedDataSetFieldValue.columnName).reset()
      this.invoiceForm1.get("DatasetDetailsList").controls[this.selectedDataSetFieldValue.tableIndex].controls['datasetFieldDTOList'].controls[this.selectedDataSetFieldValue.rowIndex].patchValue({ [this.selectedDataSetFieldValue.columnName]: appendValue })


    }
    if (this.selectedDataSetFieldValue.columnName == 'Defination') {
      let appendValue = fieldValue.concat(item.showFileFieldName)
      this.invoiceForm1.get('DatasetDetailsList').controls[this.selectedDataSetFieldValue.tableIndex].get('datasetFieldDTOList').controls[this.selectedDataSetFieldValue.rowIndex].get(this.selectedDataSetFieldValue.columnName).reset()
      this.invoiceForm1.get("DatasetDetailsList").controls[this.selectedDataSetFieldValue.tableIndex].controls['datasetFieldDTOList'].controls[this.selectedDataSetFieldValue.rowIndex].patchValue({ [this.selectedDataSetFieldValue.columnName]: appendValue })

    }
    this.renderer.selectRootElement('#' + (this.selectedDataSetFieldValue.columnName).trim() + this.selectedDataSetFieldValue.tableIndex + this.selectedDataSetFieldValue.rowIndex).focus();

  }

  changeFormula(e: any) {
    let fieldValue = this.invoiceForm1.get("DatasetDetailsList").controls[this.selectedDataSetFieldValue.tableIndex].controls['datasetFieldDTOList'].controls[this.selectedDataSetFieldValue.rowIndex].controls[this.selectedDataSetFieldValue.columnName].value
    this.selectedFormula = e.target.value;
    let appendValue = fieldValue.concat(this.selectedFormula)
    this.invoiceForm1.get('DatasetDetailsList').controls[this.selectedDataSetFieldValue.tableIndex].get('datasetFieldDTOList').controls[this.selectedDataSetFieldValue.rowIndex].get(this.selectedDataSetFieldValue.columnName).reset()
    this.invoiceForm1.get("DatasetDetailsList").controls[this.selectedDataSetFieldValue.tableIndex].controls['datasetFieldDTOList'].controls[this.selectedDataSetFieldValue.rowIndex].patchValue({ [this.selectedDataSetFieldValue.columnName]: appendValue })
    this.renderer.selectRootElement('#' + (this.selectedDataSetFieldValue.columnName).trim() + this.selectedDataSetFieldValue.tableIndex + this.selectedDataSetFieldValue.rowIndex).focus();
  }
}
