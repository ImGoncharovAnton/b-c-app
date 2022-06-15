import {Component, OnDestroy, OnInit} from '@angular/core';
import {DialogService} from "../../../shared/dialog/dialog.service";
import {Subject, takeUntil} from "rxjs";
import {MyCalcEditComponent} from "../my-calc-edit/my-calc-edit.component";
import {DataService} from 'src/app/shared/service/data.service';
import {normalizedItems} from "../../../shared/functions/normalizedItems";
import {ActivatedRoute} from "@angular/router";
import {LiteResponseItem} from "../../../shared/model/response/lite-response-item.model";

@Component({
  selector: 'app-expense-list',
  templateUrl: './expense-list.component.html',
  styleUrls: ['./expense-list.component.scss']
})
export class ExpenseListComponent implements OnInit, OnDestroy {
  expenseItems: LiteResponseItem[] = [];
  private destroy$ = new Subject();
  monthId: number;
  totalExpense: number = 0;

  constructor(private dataService: DataService,
              private dialog: DialogService,
              private route: ActivatedRoute) {
  }

  onEditItem(id: number) {
    this.dataService.setIdEditItemExpense(id)
    this.dialog.open(MyCalcEditComponent, {data: 'expense'});
  }

  ngOnInit(): void {
    this.route.queryParams
      .pipe(takeUntil(this.destroy$))
      .subscribe(params => {
          this.monthId = params['id']
          this.dataService.idMonth$.next(this.monthId)
        }
      )
    this.dataService.itemsChangesExpense$
      .pipe(takeUntil(this.destroy$))
      .subscribe(itemsChange => {
        if (itemsChange !== null && itemsChange.length > 0) {
          itemsChange.map(item => {
            this.dataService.adminDetection(item)
          })
          this.expenseItems = itemsChange
          this.totalExpense = normalizedItems(itemsChange)
        } else {
          this.expenseItems = []
          this.totalExpense = 0
        }
      })
    this.dataService.getExpenseItemsForMonth(this.monthId)
      .pipe(takeUntil(this.destroy$))
      .subscribe(items => {
        if (items.length > 0) {
          items.map(item => {
            this.dataService.adminDetection(item)
          })
          this.expenseItems = items
          this.totalExpense = normalizedItems(items)
        }
      })
  }

  ngOnDestroy() {
    this.destroy$.next(null);
    this.destroy$.complete();
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
