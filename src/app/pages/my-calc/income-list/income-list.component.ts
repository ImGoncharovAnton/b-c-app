import {Component, OnDestroy, OnInit} from '@angular/core';
import {BudgetItem} from "../../../shared/model/budget-item.model";
import {Subscription} from "rxjs";
import {BudgetService} from 'src/app/shared/service/budget.service';
import {DialogService} from 'src/app/shared/dialog/dialog.service';
import {MyCalcEditComponent} from "../my-calc-edit/my-calc-edit.component";

@Component({
  selector: 'app-income-list',
  templateUrl: './income-list.component.html',
  styleUrls: ['./income-list.component.scss']
})
export class IncomeListComponent implements OnInit, OnDestroy {
  incomeItems: BudgetItem[];
  private subscription1$: Subscription;
  private subscription2$: Subscription;
  pageId: number;
  totalIncomes: number;

  constructor(private budgetService: BudgetService,
              private dialog: DialogService) {
  }

  onEditItem(index: number) {
    this.budgetService.setIdEditIncomeItem(index)
    this.dialog.open(MyCalcEditComponent, {data: 'income'});
  }

  ngOnInit(): void {
    this.pageId = this.budgetService.getPageId()
    this.incomeItems = this.budgetService.getIncomeItems(this.pageId);
    const monthObj = this.budgetService.getMonth(this.pageId);
    this.totalIncomes = monthObj.income;
    this.subscription1$ = this.budgetService.itemsChangedInc$.subscribe(
      (incomeItems: BudgetItem[]) => {
        this.incomeItems = incomeItems;
      })
    this.subscription2$ = this.budgetService.totalCounterInc$
      .subscribe(
        (totalIncomes: number) => {
          this.totalIncomes = totalIncomes
        }
      )
  }

  ngOnDestroy(): void {
    this.subscription1$.unsubscribe()
    this.subscription2$.unsubscribe()
  }

  onDelete(index: number) {
    this.budgetService.deleteIncomeItem(this.pageId, index)
  }


}
