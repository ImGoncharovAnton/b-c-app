import {Component, OnDestroy, OnInit} from '@angular/core';
import {BudgetItem} from "../../../shared/model/budget-item.model";
import {Subject, takeUntil} from "rxjs";
import {DialogService} from 'src/app/shared/dialog/dialog.service';
import {MyCalcEditComponent} from "../my-calc-edit/my-calc-edit.component";
import {DataService} from 'src/app/shared/service/data.service';

@Component({
  selector: 'app-income-list',
  templateUrl: './income-list.component.html',
  styleUrls: ['./income-list.component.scss']
})
export class IncomeListComponent implements OnInit, OnDestroy {
  incomeItems: BudgetItem[];
  private destroy$: Subject<boolean> = new Subject<boolean>();
  pageId: number;
  totalIncomes: number;

  constructor(private dialog: DialogService,
              private dataService: DataService) {
  }

  onEditItem(item: BudgetItem, index: number) {
    this.dataService.setIdEditIncomeItem(index)
    this.dataService.setKeyEditIncomeItem(item.key)
    this.dataService.changedState$.next(false)
    this.dialog.open(MyCalcEditComponent, {data: 'income'});
  }

  ngOnInit(): void {
    this.pageId = this.dataService.getPageId()
    this.dataService.fetchUserMonths()
      .pipe(takeUntil(this.destroy$))
      .subscribe(months => {
          const month = months[this.pageId]
          this.totalIncomes = month.income
          const origIncomesArr = month.incomesArr
          const normalizedIncomesArr: BudgetItem[] = []
          for (let key in origIncomesArr) {
            normalizedIncomesArr.push({...origIncomesArr[key], key})
          }
          this.incomeItems = normalizedIncomesArr
        }
      )
    this.dataService.itemsChangedInc$
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (incomeItems: BudgetItem[]) => {
          this.incomeItems = incomeItems;
        })
    this.dataService.totalCounterInc$
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (totalIncomes: number) => {
          this.totalIncomes = totalIncomes
        }
      )
  }

  ngOnDestroy(): void {
    this.destroy$.next(true)
  }

  onDelete(key: string | undefined) {
    this.dataService.deleteIncomeItem(key)
  }
}
