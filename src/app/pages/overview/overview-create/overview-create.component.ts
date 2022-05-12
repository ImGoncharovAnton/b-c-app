import {Component, OnDestroy, OnInit} from '@angular/core';
import {MonthItem} from "../../../shared/model/month-item.model";
import {DataService} from "../../../shared/service/data.service";
import {Subject, takeUntil} from "rxjs";

@Component({
  selector: 'app-overview-create',
  templateUrl: './overview-create.component.html',
  styleUrls: ['./overview-create.component.scss']
})
export class OverviewCreateComponent implements OnInit, OnDestroy {
  private monthDate: string = new Date().toLocaleString('en', {month: "long"})
  months: MonthItem[]
  private destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(private dataService: DataService) {
  }

  ngOnInit(): void {
    this._getDataMonths()
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
  }

  private _getDataMonths() {
    this.dataService.fetchUserMonths()
      .pipe(takeUntil(this.destroy$))
      .subscribe(months => {
        this.months = months
        this.dataService.monthsChanged$.next(months)
      })

  }

  onCreate() {
    const monthLocalizedString = function (month: number, locale: string) {
      return new Date(new Date().getFullYear(), month).toLocaleString(locale, {month: "long"});
    };
    let monthsArr = this.months;

    console.log('this.months', this.months)

    if (monthsArr.length > 0) {
      console.log('not empty monthsArr')
      let prevMonth = monthsArr[monthsArr.length - 1];
      let prevMonthId = prevMonth.monthId
      const newMonthItem = new MonthItem(prevMonthId + 1, monthLocalizedString(prevMonthId + 1, 'en'), 0, 0, [], []);

      this.dataService.addUserMonths(newMonthItem)
        .pipe(takeUntil(this.destroy$))
        .subscribe((data) => {
          this._getDataMonths()
        })
    } else {
      console.log('empty monthsArr')
      const newMonthItem = new MonthItem(new Date().getMonth(), this.monthDate, 0, 0, [], [])
      this.dataService.addUserMonths(newMonthItem)
        .pipe(takeUntil(this.destroy$))
        .subscribe((data) => {
          this._getDataMonths()
        })
    }
  }

}
