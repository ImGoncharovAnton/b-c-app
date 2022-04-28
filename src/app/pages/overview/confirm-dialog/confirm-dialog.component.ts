import {Component, Inject, OnInit} from '@angular/core';
import {DialogRef} from "../../../shared/dialog/dialog-ref";
import {DIALOG_DATA} from "../../../shared/dialog/dialog-token";
import {BudgetService} from "../../../shared/service/budget.service";

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrls: ['./confirm-dialog.component.scss']
})
export class ConfirmDialogComponent implements OnInit {
  title: string
  message: string;
  result: boolean = false;

  constructor(private dialogRef: DialogRef,
              @Inject(DIALOG_DATA) public data: any,
              private budgetService: BudgetService) {
  }

  ngOnInit(): void {
  }

  close() {
    this.dialogRef.close();
  }

  submit() {
    this.result = true;
    this.dialogRef.close(this.result);
  }
}
