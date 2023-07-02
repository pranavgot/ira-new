import { Component, OnInit, Renderer2 } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-custom-data',
  templateUrl: './custom-data.component.html',
  styleUrls: ['./custom-data.component.scss']
})
export class CustomDataComponent implements OnInit {
  AddEventProceeding: boolean | undefined;
  addEventIndex: any;
  customDataFieldValue:string='';

  dummyDatas: any = [[{'Data Fields':[{"Field ":"CompanyCode",
  Description:"Company reference invoice or credit note relates to","Data type":"Text",
  fileName:"Invoice_Data.xlsx",showFileFieldName:"Invo.CompanyCode",fileFieldName:"Invoice_Data.CompanyCode", defination:""},{"Field ":"CompanyCode",
  Description:"Company reference invoice or credit note relates to","Data type":"Text",
  fileName:"Invoice_Data.xlsx",showFileFieldName:"Invo.CompanyCode",fileFieldName:"Invoice_Data.CompanyCode", defination:""},{"Field ":"CompanyCode",
  Description:"Company reference invoice or credit note relates to","Data type":"Text",
  fileName:"Invoice_Data.xlsx",showFileFieldName:"Invo.CompanyCode",fileFieldName:"Invoice_Data.CompanyCode", defination:""},{"Field ":"CompanyCode",
  Description:"Company reference invoice or credit note relates to","Data type":"Text",
  fileName:"Invoice_Data.xlsx",showFileFieldName:"Invo.CompanyCode",fileFieldName:"Invoice_Data.CompanyCode", defination:""},{"Field ":"CompanyCode",
  Description:"Company reference invoice or credit note relates to","Data type":"Text",
  fileName:"Invoice_Data.xlsx",showFileFieldName:"Invo.CompanyCode",fileFieldName:"Invoice_Data.CompanyCode", defination:""},{"Field ":"CompanyCode",
  Description:"Company reference invoice or credit note relates to","Data type":"Text",
  fileName:"Invoice_Data.xlsx",showFileFieldName:"Invo.CompanyCode",fileFieldName:"Invoice_Data.CompanyCode", defination:""}
],
  "fileName":"Invoice_Data.xlsx","Sheet1":[]}],
  [{'Data Fields':[{"Field ":"CompanyCode",
  Description:"Company reference invoice or credit note relates to","Data type":"Text",
  fileName:"Invoice_Data.xlsx",showFileFieldName:"Invo.CompanyCode",fileFieldName:"Invoice_Data.CompanyCode", defination:""},{"Field ":"CompanyCode",
  Description:"Company reference invoice or credit note relates to","Data type":"Text",
  fileName:"Invoice_Data.xlsx",showFileFieldName:"Invo.CompanyCode",fileFieldName:"Invoice_Data.CompanyCode", defination:""},{"Field ":"CompanyCode",
  Description:"Company reference invoice or credit note relates to","Data type":"Text",
  fileName:"Invoice_Data.xlsx",showFileFieldName:"Invo.CompanyCode",fileFieldName:"Invoice_Data.CompanyCode", defination:""},{"Field ":"CompanyCode",
  Description:"Company reference invoice or credit note relates to","Data type":"Text",
  fileName:"Invoice_Data.xlsx",showFileFieldName:"Invo.CompanyCode",fileFieldName:"Invoice_Data.CompanyCode", defination:""},{"Field ":"CompanyCode",
  Description:"Company reference invoice or credit note relates to","Data type":"Text",
  fileName:"Invoice_Data.xlsx",showFileFieldName:"Invo.CompanyCode",fileFieldName:"Invoice_Data.CompanyCode", defination:""},{"Field ":"CompanyCode",
  Description:"Company reference invoice or credit note relates to","Data type":"Text",
  fileName:"Invoice_Data.xlsx",showFileFieldName:"Invo.CompanyCode",fileFieldName:"Invoice_Data.CompanyCode", defination:""}
],
  "fileName":"Invoice_Data.xlsx","Sheet1":[]}]]


  dummyCustomData:any =[{"Field ":"CompanyCode"},{"Field ":"CompanyName"},{"Field ":"Vendor"},{"Field ":"Vendor Name"},{"Field ":"Document Number"},{"Field ":"Currency"},{"Field ":"Payment Type"},]

  capturedTableField:any;
  constructor(public fb: FormBuilder,private renderer: Renderer2) { }

  ngOnInit(): void {
  
  
  }

  inputFileRowClickedd(item:any){
    this.customDataFieldValue = item['Field '];
  }

  captureDataSetFieldss(obj:any, indexNumber:any, tableNumber:any){

    let x = obj['Field '];
    this.capturedTableField= {
      item:x, indexNumber:indexNumber, tableNumber:tableNumber
    }

    this.dummyDatas.forEach((table:any,index:number)=>{
      if(this.capturedTableField.tableNumber == index){
      table[0]['Data Fields'].forEach(((item:any,index:number)=>{

        if(this.capturedTableField.indexNumber == index){
          item.defination = this.customDataFieldValue
        }
      })

      )}
    })

  }


}
