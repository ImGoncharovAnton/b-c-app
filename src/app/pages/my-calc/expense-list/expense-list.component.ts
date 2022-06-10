import {Component, OnDestroy, OnInit} from '@angular/core';
import {DialogService} from "../../../shared/dialog/dialog.service";
import {BudgetItem} from "../../../shared/model/budget-item.model";
import {Subject, takeUntil} from "rxjs";
import {MyCalcEditComponent} from "../my-calc-edit/my-calc-edit.component";
import {DataService} from 'src/app/shared/service/data.service';
import {ResponseItem} from "../../../shared/model/response-item.model";
import {normalizedItems} from "../../../shared/functions/normalizedItems";

@Component({
  selector: 'app-expense-list',
  templateUrl: './expense-list.component.html',
  styleUrls: ['./expense-list.component.scss']
})
export class ExpenseListComponent implements OnInit, OnDestroy {
  expenseItems: ResponseItem[];
  private destroy$: Subject<boolean> = new Subject<boolean>();
  monthId: number;
  totalExpense: number;

  constructor(private dataService: DataService,
              private dialog: DialogService) {
  }

  onEditItem(id: number) {
    this.dataService.setIdEditItemExpense(id)
    this.dialog.open(MyCalcEditComponent, {data: 'expense'});
  }

  ngOnInit(): void {
    this.dataService.idMonth$
      .pipe(takeUntil(this.destroy$))
      .subscribe(monthId => {
        if (monthId !== null) {
          this.monthId = monthId
        }
      })
    this.dataService.itemsChangesExpense$
      .pipe(takeUntil(this.destroy$))
      .subscribe(items => {
        if (items !== null && items.length > 0) {
          this.expenseItems = items
          this.totalExpense = normalizedItems(items)
        } else {
          this.expenseItems = []
          this.totalExpense = 0
        }
      })
    this.dataService.getExpenseItemsForMonth(this.monthId)
      .pipe(takeUntil(this.destroy$))
      .subscribe(items => {
        if (items.length > 0) {
          this.expenseItems = items
          this.totalExpense = normalizedItems(items)
        }
      })
  }

  ngOnDestroy() {
    this.destroy$.next(true)
  }

  onDelete(id: number) {
    this.dataService.deleteItem(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe(res => {
        this.dataService.getExpenseItemsForMonth(this.monthId)
          .pipe(takeUntil(this.destroy$))
          .subscribe(data => {
            this.dataService.itemsChangesExpense$.next(data)
          })
        console.log('Delete success', res)
      })
  }
}
