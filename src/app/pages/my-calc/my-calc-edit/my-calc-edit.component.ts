import {Component, Inject, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {BudgetService} from 'src/app/shared/service/budget.service';
import {DialogRef} from "../../../shared/dialog/dialog-ref";
import {DIALOG_DATA} from "../../../shared/dialog/dialog-token";
import {BudgetItem} from "../../../shared/model/budget-item.model";

@Component({
  selector: 'app-my-calc-edit',
  templateUrl: './my-calc-edit.component.html',
  styleUrls: ['./my-calc-edit.component.scss']
})
export class MyCalcEditComponent implements OnInit {
  formGroup: FormGroup;
  identityIncome: boolean = false; // variable for changing button status
  identityExpense: boolean = false; // variable for changing button status
  editedItemIndex: number;
  editedItem: BudgetItem;
  pageId: number;

  constructor(private dialogRef: DialogRef,
              @Inject(DIALOG_DATA) public data: string,
              private budgetService: BudgetService) {
  }

  ngOnInit(): void {
    this.pageId = this.budgetService.getPageId()
    this.initForm();
    if (this.data === 'income') {
      this.identityIncome = true;
      this.editedItemIndex = this.budgetService.getIdEditIncomeItem()
      this.editedItem = this.budgetService.getIncomeItem(this.pageId, this.editedItemIndex)
      this.formGroup.setValue({
        amount: this.editedItem.amount,
        description: this.editedItem.description
      })
    }
    if (this.data === 'expense') {
      this.identityExpense = true;
      this.editedItemIndex = this.budgetService.getIdEditExpenseItem()
      this.editedItem = this.budgetService.getExpenseItem(this.pageId, this.editedItemIndex)
      this.formGroup.setValue({
        amount: this.editedItem.amount,
        description: this.editedItem.description
      })
    }
  }

  close() {
    this.dialogRef.close();
  }

  onSubmitIncome() {
    if (this.identityIncome) {
      this.budgetService.updateIncomeItem(this.pageId, this.editedItemIndex, this.formGroup.value)
    } else {
      this.budgetService.addIncomeItem(this.pageId, this.formGroup.value)
    }
    this.formGroup.reset();
    this.identityIncome = false;
    this.dialogRef.close();
  }

  onSubmitExpense() {
    if (this.identityExpense) {
      this.budgetService.updateExpenseItem(this.pageId, this.editedItemIndex, this.formGroup.value)
    } else {
      this.budgetService.addExpenseItem(this.pageId, this.formGroup.value)
    }
    this.formGroup.reset();
    this.identityExpense = false;
    this.dialogRef.close();
  }

  initForm() {
    let myAmount: number = 0;
    let myDesc: string = '';

    if (this.identityIncome) {
      const editItem = this.budgetService.getIncomeItem(this.pageId, this.editedItemIndex)
      myAmount = editItem.amount;
      myDesc = editItem.description;
    }
    if (this.identityExpense) {
      const editItem = this.budgetService.getExpenseItem(this.pageId, this.editedItemIndex)
      myAmount = editItem.amount;
      myDesc = editItem.description;
    }

    this.formGroup = new FormGroup({
      'amount': new FormControl(myAmount, [
        Validators.required,
        Validators.pattern(/^[1-9]+\d*$/)
      ]),
      'description': new FormControl(myDesc, Validators.required)
    })
  }
}
