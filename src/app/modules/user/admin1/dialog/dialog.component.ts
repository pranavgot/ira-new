import { Component, OnInit,Inject } from '@angular/core';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';
import { Observable, of } from 'rxjs';
@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrls: ['./dialog.component.scss']
})
export class DialogComponent implements OnInit {
  displayedRows$: Observable<any> | any;
  messages =
  [
    {
      "Fueling_Position": 'suggested For this data type',
      "Components": [
        {
          "Component": "Length(String)",
        },
        {
          "Component": "LowerCase(String)",
        }


      ]
    },
    {
      "Fueling_Position": 'Conditional',
      "Components": [
        {
          "Component": "If c THEN t ELSE f ENDIF",
        },
        {
          "Component": "If c THEN t ELSEIF c2 THEN t2 ELSE f ENDIF",
        }


      ]
    }
  ]

  constructor( public dialogRef: MatDialogRef<DialogComponent>,@Inject(MAT_DIALOG_DATA) public data: any  ) { }

  ngOnInit(): void {
    this.displayedRows$ = of(this.messages)
  }
  
  onNoClick(): void {
    this.dialogRef.close();
  }

  
}
