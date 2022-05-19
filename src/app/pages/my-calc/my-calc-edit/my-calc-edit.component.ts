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
  userKeyId: string | null;
  monthKeyId: string | null;
  changedState: boolean = false;
  private destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(private dialogRef: DialogRef,
              @Inject(DIALOG_DATA) public data: string,
              private dataService: DataService) {
  }

  ngOnInit(): void {
    if (this.data === 'income') {
      this.dataService.userKey$
        .pipe(takeUntil(this.destroy$))
        .subscribe(key => {
          this.userKeyId = key
        })
      this.dataService.changedState$
        .pipe(takeUntil(this.destroy$))
        .subscribe(changed => {
          this.changedState = changed
        })
      this.dataService.monthKeyId$
        .pipe(takeUntil(this.destroy$))
        .subscribe(monthKey => {
          this.monthKeyId = monthKey
        })
      this.identityIncome = true;
      this.dataService.fetchNormalizedIncomesArr(this.userKeyId, this.monthKeyId)
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
      this.dataService.userKey$
        .pipe(takeUntil(this.destroy$))
        .subscribe(key => {
          this.userKeyId = key
        })
      this.dataService.monthKeyId$
        .pipe(takeUntil(this.destroy$))
        .subscribe(monthKey => {
          this.monthKeyId = monthKey
        })
      this.dataService.changedState$
        .pipe(takeUntil(this.destroy$))
        .subscribe(changed => {
          this.changedState = changed
        })
      this.identityExpense = true;
      this.dataService.fetchNormalizedExpensesArr(this.userKeyId, this.monthKeyId)
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
      this.dataService.updateIncomeItem(this.formGroup.value, this.userKeyId, this.monthKeyId, this.changedState)
    } else {
      this.dataService.addIncomeItem(this.formGroup.value)
    }

    this.formGroup.reset();
    this.identityIncome = false;
    this.dialogRef.close();
  }

  onSubmitExpense() {
    if (this.identityExpense) {
      this.dataService.updateExpenseItem(this.formGroup.value, this.userKeyId, this.monthKeyId, this.changedState)
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

    // Не понимаю зачем этот код... Но зачем-то он был написан в примере по формам реактивным...
    /* if (this.identityIncome) {
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
     }*/

    this.formGroup = new FormGroup({
      'amount': new FormControl(myAmount, [
        Validators.required,
        Validators.pattern(/^[1-9]+\d*$/)
      ]),
      'description': new FormControl(myDesc, Validators.required)
    })
  }
}
