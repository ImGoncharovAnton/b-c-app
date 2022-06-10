import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subject, takeUntil} from "rxjs";
import {DialogService} from 'src/app/shared/dialog/dialog.service';
import {MyCalcEditComponent} from "../my-calc-edit/my-calc-edit.component";
import {DataService} from 'src/app/shared/service/data.service';
import {ResponseItem} from "../../../shared/model/response-item.model";
import {normalizedItems} from "../../../shared/functions/normalizedItems";

@Component({
  selector: 'app-income-list',
  templateUrl: './income-list.component.html',
  styleUrls: ['./income-list.component.scss']
})
export class IncomeListComponent implements OnInit, OnDestroy {
  incomeItems: ResponseItem[];
  private destroy$: Subject<boolean> = new Subject<boolean>();
  monthId: number;
  totalIncome: number;

  constructor(private dialog: DialogService,
              private dataService: DataService) {
  }

  onEditItem(id: number) {
    this.dataService.setIdEditItemIncome(id)
    this.dialog.open(MyCalcEditComponent, {data: 'income'});
  }

  ngOnInit(): void {
    this.dataService.idMonth$
      .pipe(takeUntil(this.destroy$))
      .subscribe(monthId => {
        if (monthId !== null) {
          this.monthId = monthId
        }
      })
    this.dataService.itemsChangesIncome$
      .pipe(takeUntil(this.destroy$))
      .subscribe(items => {
        if (items !== null && items.length > 0) {
          this.incomeItems = items
          this.totalIncome = normalizedItems(items)
        } else {
          this.incomeItems = []
          this.totalIncome = 0
        }
      })
    this.dataService.getIncomeItemsForMonth(this.monthId)
      .pipe(takeUntil(this.destroy$))
      .subscribe(items => {
        if (items.length > 0) {
          this.incomeItems = items
          this.totalIncome = normalizedItems(items)
        }
      })
  }
  ngOnDestroy(): void {
    this.destroy$.next(true)
  }

  onDelete(id: number) {
    this.dataService.deleteItem(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe(res => {
        this.dataService.getIncomeItemsForMonth(this.monthId)
          .pipe(takeUntil(this.destroy$))
          .subscribe(data => {
            this.dataService.itemsChangesIncome$.next(data)
          })
        console.log('Delete success', res)
      })
  }
}
