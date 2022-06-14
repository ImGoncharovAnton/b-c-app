import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subject, takeUntil} from "rxjs";
import {DialogService} from 'src/app/shared/dialog/dialog.service';
import {MyCalcEditComponent} from "../my-calc-edit/my-calc-edit.component";
import {DataService} from 'src/app/shared/service/data.service';
import {normalizedItems} from "../../../shared/functions/normalizedItems";
import {ActivatedRoute, Router} from "@angular/router";
import {LiteResponseItem} from "../../../shared/model/lite-response-item.model";

@Component({
  selector: 'app-income-list',
  templateUrl: './income-list.component.html',
  styleUrls: ['./income-list.component.scss']
})
export class IncomeListComponent implements OnInit, OnDestroy {
  incomeItems: LiteResponseItem[] = [];
  private destroy$ = new Subject();
  monthId: number;
  totalIncome: number = 0;

  constructor(private dialog: DialogService,
              private dataService: DataService,
              private route: ActivatedRoute) {
  }

  onEditItem(id: number) {
    this.dataService.setIdEditItemIncome(id)
    this.dialog.open(MyCalcEditComponent, {data: 'income'});
  }

  ngOnInit(): void {
    this.route.queryParams
      .pipe(takeUntil(this.destroy$))
      .subscribe(params => {
          this.monthId = params['id']
          this.dataService.idMonth$.next(this.monthId)
        }
      )
    this.dataService.itemsChangesIncome$
      .pipe(takeUntil(this.destroy$))
      .subscribe(itemsChanged => {
        if (itemsChanged !== null && itemsChanged.length > 0) {
          itemsChanged.map(item => {
            this.dataService.adminDetection(item)
          })
          this.incomeItems = itemsChanged
          this.totalIncome = normalizedItems(itemsChanged)
        } else {
          this.incomeItems = []
          this.totalIncome = 0
        }
      })
    this.dataService.getIncomeItemsForMonth(this.monthId)
      .pipe(takeUntil(this.destroy$))
      .subscribe(items => {
        console.log('items income', items)
        if (items.length > 0) {
          items.map(item => {
            this.dataService.adminDetection(item)
          })
          this.incomeItems = items
          this.totalIncome = normalizedItems(items)
        }
      })
  }

  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.complete();
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

 /* var myArray = ['one', 'two', 'three'];
  var myIndex = myArray.indexOf('two');
  if (myIndex !== -1) {
  myArray.splice(myIndex, 1);
}*/
}
