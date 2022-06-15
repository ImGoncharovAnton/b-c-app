import {Component, Inject, OnDestroy, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {DataService} from 'src/app/shared/service/data.service';
import {DialogRef} from "../../../shared/dialog/dialog-ref";
import {DIALOG_DATA} from "../../../shared/dialog/dialog-token";
import {Subject, takeUntil} from "rxjs";
import {RequestUpdateItem} from "../../../shared/model/request/request-update-item.model";
import {RequestCreateItem} from "../../../shared/model/request/request-item.model";
import {LiteResponseItem} from "../../../shared/model/response/lite-response-item.model";

@Component({
  selector: 'app-my-calc-edit',
  templateUrl: './my-calc-edit.component.html',
  styleUrls: ['./my-calc-edit.component.scss']
})
export class MyCalcEditComponent implements OnInit, OnDestroy {
  formGroup: FormGroup;
  identityIncome: boolean = false; // variable for changing button status
  identityExpense: boolean = false; // variable for changing button status
  idUser: string
  monthId: number
  IdEditItemIncome: number
  IdEditItemExpense: number
  message = "item updated by admin, please reload page!"

  private destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(private dialogRef: DialogRef,
              @Inject(DIALOG_DATA) public data: string,
              private dataService: DataService) {
  }

  ngOnInit(): void {
    this.dataService.idUser$
      .pipe(takeUntil(this.destroy$))
      .subscribe(idUser => {
        if (idUser !== null) {
          this.idUser = idUser
        } else {
          this.idUser = this.dataService.getLocalUserId()
        }
      })
    this.dataService.idMonth$
      .pipe(takeUntil(this.destroy$))
      .subscribe(monthId => {
        if (monthId !== null) {
          this.monthId = monthId
        }
      })
    if (this.data === 'income') {
      this.identityIncome = true;
      this.IdEditItemIncome = this.dataService.getIdEditItemIncome()
      this.dataService.getItem(this.IdEditItemIncome)
        .pipe(takeUntil(this.destroy$))
        .subscribe((item: LiteResponseItem) => {
          this.formGroup.setValue({
            amount: item.value,
            description: item.description
          })
        })
    }
    if (this.data === 'expense') {
      this.identityExpense = true;
      this.IdEditItemExpense = this.dataService.getIdEditItemExpense()
      this.dataService.getItem(this.IdEditItemExpense)
        .pipe(takeUntil(this.destroy$))
        .subscribe((item: LiteResponseItem) => {
          this.formGroup.setValue({
            amount: item.value,
            description: item.description
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
    const updateObj = new RequestUpdateItem(
      this.idUser,
      this.formGroup.value.amount,
      this.formGroup.value.description
    )
    const createObj = new RequestCreateItem(
      this.idUser,
      this.formGroup.value.amount,
      this.formGroup.value.description,
      0,
      this.monthId
    )
    let userIdForMessage = this.dataService.getUserIdForMessage()
    if (this.identityIncome) {
      this.dataService.updateItem(this.IdEditItemIncome, updateObj)
        .subscribe((res) => {
        this.dataService.getIncomeItemsForMonth(this.monthId)
          .subscribe(data => {
            this.dataService.itemsChangesIncome$.next(data)
          })
      })
      if(userIdForMessage) {
        this.dataService.sendMessage(userIdForMessage, this.message).subscribe()
      }
    } else {
      this.dataService.createItem(createObj)
        .subscribe(res => {
          this.dataService.getIncomeItemsForMonth(this.monthId)
            .subscribe(data => {
              this.dataService.itemsChangesIncome$.next(data)
            })
        })
    }

    this.formGroup.reset();
    this.identityIncome = false;
    this.dialogRef.close();
  }

  onSubmitExpense() {
    const updateObj = new RequestUpdateItem(
      this.idUser,
      this.formGroup.value.amount,
      this.formGroup.value.description
    )
    const createObj = new RequestCreateItem(
      this.idUser,
      this.formGroup.value.amount,
      this.formGroup.value.description,
      1,
      this.monthId
    )
    let userIdForMessage = this.dataService.getUserIdForMessage()
    if (this.identityExpense) {
      // need rework this, but question... How?
      this.dataService.updateItem(this.IdEditItemExpense, updateObj)
        .subscribe(res => {
          this.dataService.getExpenseItemsForMonth(this.monthId)
            .subscribe(data => {
              this.dataService.itemsChangesExpense$.next(data)
            })
        })
      if(userIdForMessage) {
        this.dataService.sendMessage(userIdForMessage, this.message).subscribe()
      }
    } else {
      this.dataService.createItem(createObj)
        .subscribe((res: LiteResponseItem) => {
          console.log('res create item expense', res)
          this.dataService.getExpenseItemsForMonth(this.monthId)
            .subscribe(data => {
              this.dataService.itemsChangesExpense$.next(data)
            })
        })
    }

    this.formGroup.reset();
    this.identityExpense = false;
    this.dialogRef.close();
  }

  initForm() {
    let myAmount: number = 0;
    let myDesc: string = '';

    this.formGroup = new FormGroup({
      'amount': new FormControl(myAmount, [
        Validators.required,
        Validators.pattern(/^[1-9]+\d*$/)
      ]),
      'description': new FormControl(myDesc, Validators.required)
    })
  }
}
