import {Component, OnDestroy, OnInit} from '@angular/core';
import {DataService} from "../../../shared/service/data.service";
import {Subject, takeUntil} from "rxjs";
import {ResponseMonth} from 'src/app/shared/model/response-month.model';
import {RequestMonth} from "../../../shared/model/request-month.model";

@Component({
  selector: 'app-overview-create',
  templateUrl: './overview-create.component.html',
  styleUrls: ['./overview-create.component.scss']
})
export class OverviewCreateComponent implements OnInit, OnDestroy {

  months: ResponseMonth[]
  private destroy$: Subject<boolean> = new Subject<boolean>()

  constructor(private dataService: DataService) {
  }

  ngOnInit(): void {
    this._getDataMonths()
  }

  ngOnDestroy(): void {
    this.destroy$.next(true)
  }

  private _getDataMonths() {
    this.dataService.getUserMonths()
      .pipe(takeUntil(this.destroy$))
      .subscribe(months => {
        this.months = months
        this.dataService.monthsChanged$.next(months)
      })
    this.dataService.monthsChanged$
      .pipe(takeUntil(this.destroy$))
      .subscribe(months => {
        this.months = months
      })
  }

  onCreate() {
    const yearNow = new Date().getFullYear()
    let monthsArr = this.months
    const userId = this.dataService.getLocalUserId()
    let newMonthItem: RequestMonth
    if (monthsArr.length > 0) {
      let prevMonth = monthsArr[monthsArr.length - 1];
      if (prevMonth.monthNum === 12) {
        newMonthItem = new RequestMonth(1, prevMonth.year + 1, userId);
      } else {
        if (yearNow !== prevMonth.year) {
          newMonthItem = new RequestMonth(prevMonth.monthNum + 1, prevMonth.year, userId);
        } else {
          newMonthItem = new RequestMonth(prevMonth.monthNum + 1, yearNow, userId);
        }
      }
      this.dataService.addUserMonth(newMonthItem)
        .pipe(takeUntil(this.destroy$))
        .subscribe(res => {
          this._getDataMonths()
        })
    } else {
      newMonthItem = new RequestMonth(new Date().getMonth() + 1, yearNow, userId)
      this.dataService.addUserMonth(newMonthItem)
        .pipe(takeUntil(this.destroy$))
        .subscribe(res => {
          this._getDataMonths()
        })
    }
  }

}
