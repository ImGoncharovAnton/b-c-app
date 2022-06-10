import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subject, takeUntil} from 'rxjs';
import {ActivatedRoute, Router} from "@angular/router";
import {MyCalcEditComponent} from "./my-calc-edit/my-calc-edit.component";
import {DialogService} from 'src/app/shared/dialog/dialog.service';
import {DataService} from 'src/app/shared/service/data.service';
import {MonthItem} from "../../shared/model/month-item.model";
import {normalizedMonth} from "../../shared/functions/normalizedMonth";
import {normalizedItems} from "../../shared/functions/normalizedItems";

@Component({
  selector: 'app-my-calc',
  templateUrl: './my-calc.component.html',
  styleUrls: ['./my-calc.component.scss']
})
export class MyCalcComponent implements OnInit, OnDestroy {
  parentId: number
  totalBudget: number
  monthName: string
  month: MonthItem
  private destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(private route: ActivatedRoute,
              private router: Router,
              private dialog: DialogService,
              private dataService: DataService) {
  }

  ngOnInit(): void {
    this.route.queryParams
      .pipe(takeUntil(this.destroy$))
      .subscribe(params => {
        this.parentId = params['id']
        this.dataService.idMonth$.next(this.parentId)
        }
      )
    let incomeLocal: number = 0
    let expenseLocal: number = 0
    this.dataService.getMonth(this.parentId)
      .pipe(takeUntil(this.destroy$))
      .subscribe(month => {
        normalizedMonth(month)
        this.monthName = month.monthName
        incomeLocal = month.income
        expenseLocal = month.expense
        this.totalBudget = incomeLocal - expenseLocal
        }
      )
    this.dataService.itemsChangesIncome$
      .pipe(takeUntil(this.destroy$))
      .subscribe(incomes => {
        if (incomes !== null  && incomes.length > 0) {
          incomeLocal = normalizedItems(incomes)
          this.totalBudget = incomeLocal - expenseLocal
        } else {
          incomeLocal = 0
          this.totalBudget = incomeLocal - expenseLocal
        }
      })
    this.dataService.itemsChangesExpense$
      .pipe(takeUntil(this.destroy$))
      .subscribe(expenses => {
        if (expenses !== null && expenses.length > 0) {
          expenseLocal = normalizedItems(expenses)
          this.totalBudget = incomeLocal - expenseLocal
        } else {
          expenseLocal = 0
          this.totalBudget = incomeLocal - expenseLocal
        }
      })

  }

  ngOnDestroy(): void {
    this.destroy$.next(true)
  }

  onCreateItem() {
    this.dialog.open(MyCalcEditComponent);
  }

}
