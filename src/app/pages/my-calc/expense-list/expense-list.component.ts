import {Component, OnDestroy, OnInit} from '@angular/core';
import {DialogService} from "../../../shared/dialog/dialog.service";
import {BudgetItem} from "../../../shared/model/budget-item.model";
import {Subject, takeUntil} from "rxjs";
import {MyCalcEditComponent} from "../my-calc-edit/my-calc-edit.component";
import {DataService} from 'src/app/shared/service/data.service';

@Component({
  selector: 'app-expense-list',
  templateUrl: './expense-list.component.html',
  styleUrls: ['./expense-list.component.scss']
})
export class ExpenseListComponent implements OnInit, OnDestroy {
  expenseItems: BudgetItem[];
  private destroy$: Subject<boolean> = new Subject<boolean>();
  pageId: number;
  totalExpenses: number;
  changedDetected: boolean = false;

  constructor(private dataService: DataService,
              private dialog: DialogService) {
  }

  onEditItem(item: BudgetItem, index: number) {
    this.dataService.setIdEditExpenseItem(index);
    this.dataService.setKeyEditExpenseItem(item.key)
    this.dataService.changedState$.next(false)
    this.dialog.open(MyCalcEditComponent, {data: 'expense'});
  }

  ngOnInit(): void {
    this.pageId = this.dataService.getPageId()
    this.dataService.fetchUserMonths()
      .pipe(takeUntil(this.destroy$))
      .subscribe(months => {
          const month = months[this.pageId]
          this.totalExpenses = month.expense
          const origExpensesArr = month.expensesArr
          const normalizedExpensesArr: BudgetItem[] = []
          for (let key in origExpensesArr) {
            normalizedExpensesArr.push({...origExpensesArr[key], key})
          }
        this.expenseItems = normalizedExpensesArr
        }
      )
    this.dataService.itemsChangedExp$
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (expenseItems: BudgetItem[]) => {
          this.expenseItems = expenseItems;
        })
    this.dataService.totalCounterExp$
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (totalExpenses: number) => {
          this.totalExpenses = totalExpenses
        }
      )
  }

  ngOnDestroy() {
    this.destroy$.next(true)
  }

  onDelete(key: string | undefined) {
    this.dataService.deleteExpenseItem(key)
  }
}
