import {Component, OnDestroy, OnInit} from '@angular/core';
import {BudgetService} from "../../../shared/service/budget.service";
import {DialogService} from "../../../shared/dialog/dialog.service";
import {BudgetItem} from "../../../shared/model/budget-item.model";
import {Subscription} from "rxjs";
import {MyCalcEditComponent} from "../my-calc-edit/my-calc-edit.component";

@Component({
  selector: 'app-expense-list',
  templateUrl: './expense-list.component.html',
  styleUrls: ['./expense-list.component.scss']
})
export class ExpenseListComponent implements OnInit, OnDestroy {
  expenseItems: BudgetItem[];
  private subscription1$: Subscription;
  private subscription2$: Subscription;
  pageId: number;
  totalExpenses: number;

  constructor(private budgetService: BudgetService,
              private dialog: DialogService) {
  }

  onEditItem(index: number) {
    this.budgetService.setIdEditExpenseItem(index);
    const dialogRef = this.dialog.open(MyCalcEditComponent, {data: 'expense'});

    dialogRef.afterClosed().subscribe((data) => {
      console.log("data-expense", "dialog")
    });
  }

  ngOnInit(): void {
    this.pageId = this.budgetService.getPageId()
    this.expenseItems = this.budgetService.getExpenseItems(this.pageId);
    const monthObj = this.budgetService.getMonth(this.pageId);
    this.totalExpenses = monthObj.expense;
    this.subscription1$ = this.budgetService.itemsChangedExp$.subscribe(
      (expenseItems: BudgetItem[]) => {
        this.expenseItems = expenseItems;
      })
    this.subscription2$ = this.budgetService.totalCounterExp$
      .subscribe(
        (totalExpenses: number) => {
          this.totalExpenses = totalExpenses
        }
      )
  }

  ngOnDestroy() {
    this.subscription1$.unsubscribe()
    this.subscription2$.unsubscribe()
  }

  onDelete(i: number) {
    this.budgetService.deleteExpenseItem(this.pageId, i)
  }

  getAmount() {
    // let expenseItem: number = 0;
    // for (let item of this.expenseItems) {
    //   expenseItem = expenseItem + item.amount
    // }
    // this.totalIncomes = expenseItem;
  }
}
