import {Component, Inject, OnInit} from '@angular/core';
import {DialogRef} from "../../../shared/dialog/dialog-ref";
import {DIALOG_DATA} from "../../../shared/dialog/dialog-token";

@Component({
  selector: 'app-my-calc-edit',
  templateUrl: './my-calc-edit.component.html',
  styleUrls: ['./my-calc-edit.component.scss']
})
export class MyCalcEditComponent implements OnInit {

  constructor(private dialogRef: DialogRef,
              @Inject(DIALOG_DATA) public data: string) {
  }

  ngOnInit(): void {
  }

  close() {
    this.dialogRef.close();
  }
}
