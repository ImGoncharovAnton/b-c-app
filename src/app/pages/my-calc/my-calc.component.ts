import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subject, takeUntil} from 'rxjs';
import {ActivatedRoute, Router} from "@angular/router";
import {MyCalcEditComponent} from "./my-calc-edit/my-calc-edit.component";
import {DialogService} from 'src/app/shared/dialog/dialog.service';
import {DataService} from 'src/app/shared/service/data.service';
import {MonthItem} from "../../shared/model/month-item.model";

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
        this.dataService.setPageId(params['id'])
        }
      )
    this.dataService.fetchUserMonths()
      .pipe(takeUntil(this.destroy$))
      .subscribe(months => {
          this.month = months[this.parentId]
          this.monthName = this.month.month;
        this.totalBudget = this.month.income - this.month.expense;
        localStorage.setItem('MonthKey', JSON.stringify(this.month.key))
        }
      )
    this.dataService.totalBudgetCounter$
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (totalBudget: number) => {
          this.totalBudget = totalBudget
        }
      )
  }

  ngOnDestroy(): void {
    this.destroy$.next(true)
    localStorage.removeItem('MonthKey')
  }

  onCreateItem() {
    this.dialog.open(MyCalcEditComponent);
  }

}
