import {Component, OnDestroy, OnInit} from '@angular/core';
import {BudgetItem} from "../../../shared/model/budget-item.model";
import {Subject, takeUntil} from "rxjs";
import {BudgetService} from 'src/app/shared/service/budget.service';
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

  constructor(private budgetService: BudgetService,
              private dialog: DialogService,
              private dataService: DataService) {
  }

  onEditItem(item: BudgetItem, index: number) {

    this.dataService.setIdEditIncomeItem(index)
    this.dialog.open(MyCalcEditComponent, {data: 'income'});
  }

  ngOnInit(): void {
    this.pageId = this.dataService.getPageId()
    console.log(this.pageId)
    this.dataService.fetchUserMonths()
      .pipe(takeUntil(this.destroy$))
      .subscribe(months => {
          const month = months[this.pageId]
          this.totalIncomes = month.income;
          console.log("Income-list component | Month", month)
        }
      )
    this.dataService.fetchNormalizedIncomesArr()
      .pipe(takeUntil(this.destroy$))
      .subscribe(incomesArr => {
        this.incomeItems = incomesArr
        console.log('this.incomeItems', this.incomeItems)
      })
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
