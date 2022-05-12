import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {DataService} from 'src/app/shared/service/data.service';
import {DialogRef} from "../../../shared/dialog/dialog-ref";
import {DIALOG_DATA} from "../../../shared/dialog/dialog-token";
import {BudgetItem} from "../../../shared/model/budget-item.model";
import {Subject, takeUntil} from "rxjs";

@Component({
  selector: 'app-my-calc-edit',
  templateUrl: './my-calc-edit.component.html',
  styleUrls: ['./my-calc-edit.component.scss']
})
export class MyCalcEditComponent implements OnInit, OnDestroy {
  formGroup: FormGroup;
  identityIncome: boolean = false; // variable for changing button status
  identityExpense: boolean = false; // variable for changing button status
  editedItemIndex: number;
  editedItem: BudgetItem;
  pageId: number;
  key: string;
  private destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(private dialogRef: DialogRef,
              @Inject(DIALOG_DATA) public data: string,
              private dataService: DataService) {
  }

  ngOnInit(): void {
    this.pageId = this.dataService.getPageId()
    if (this.data === 'income') {
      this.identityIncome = true;
      this.dataService.fetchNormalizedIncomesArr()
        .pipe(takeUntil(this.destroy$))
        .subscribe(incomes => {
          const incomesArr = incomes
          this.editedItemIndex = this.dataService.getIdEditIncomeItem()
          this.editedItem = incomesArr[this.editedItemIndex]
          this.formGroup.setValue({
            amount: this.editedItem.amount,
            description: this.editedItem.description
          })
        })
    }
    if (this.data === 'expense') {
      this.identityExpense = true;
      this.dataService.fetchNormalizedExpensesArr()
        .pipe(takeUntil(this.destroy$))
        .subscribe(expenses => {
          const expensesArr = expenses
          this.editedItemIndex = this.dataService.getIdEditExpenseItem()
          this.editedItem = expensesArr[this.editedItemIndex]
          this.formGroup.setValue({
            amount: this.editedItem.amount,
            description: this.editedItem.description
          })
        })

    }
    this.initForm();
  }

  ngOnDestroy() {
    this.destroy$.next(true)
  }

  close() {
    this.dialogRef.close();
  }

  onSubmitIncome() {
    if (this.identityIncome) {
      this.dataService.updateIncomeItem(this.formGroup.value)
    } else {
      this.dataService.addIncomeItem(this.formGroup.value)
    }

    this.formGroup.reset();
    this.identityIncome = false;
    this.dialogRef.close();
  }

  onSubmitExpense() {
    if (this.identityExpense) {
      this.dataService.updateExpenseItem(this.formGroup.value)
    } else {
      this.dataService.addExpenseItem(this.formGroup.value)
    }

    this.formGroup.reset();
    this.identityExpense = false;
    this.dialogRef.close();
  }

  initForm() {
    let myAmount: number = 0;
    let myDesc: string = '';

    if (this.identityIncome) {
      this.dataService.fetchNormalizedIncomesArr()
        .pipe(takeUntil(this.destroy$))
        .subscribe(incomes => {
          const incomesArr = incomes
          this.editedItemIndex = this.dataService.getIdEditIncomeItem()
          const editItem = incomesArr[this.editedItemIndex]
          myAmount = editItem.amount;
          myDesc = editItem.description;
        })
    }
    if (this.identityExpense) {
      this.dataService.fetchNormalizedExpensesArr()
        .pipe(takeUntil(this.destroy$))
        .subscribe(expenses => {
          const expensesArr = expenses
          this.editedItemIndex = this.dataService.getIdEditExpenseItem()
          const editItem = expensesArr[this.editedItemIndex]
          myAmount = editItem.amount;
          myDesc = editItem.description;
        })
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
