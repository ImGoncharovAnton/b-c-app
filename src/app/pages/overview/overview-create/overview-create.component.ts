import {Component, OnDestroy, OnInit} from '@angular/core';
import {MonthItem} from "../../../shared/model/month-item.model";
import {DataService} from "../../../shared/service/data.service";
import {Subject, takeUntil} from "rxjs";
import { ResponseMonth } from 'src/app/shared/model/response-month.model';
import {RequestMonth} from "../../../shared/model/request-month.model";

@Component({
  selector: 'app-overview-create',
  templateUrl: './overview-create.component.html',
  styleUrls: ['./overview-create.component.scss']
})
export class OverviewCreateComponent implements OnInit, OnDestroy {

  months: ResponseMonth[]
  private destroy$: Subject<boolean> = new Subject<boolean>()


  // ===============old===========================================================
  //   private monthDate: string = new Date().toLocaleString('en', {month: "long"})
  // months: MonthItem[]


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
        })
  }

  onCreate() {
    const yearNow = new Date().getFullYear()
    let monthsArr = this.months

    console.log('monthsArr', monthsArr)

    // Добавить проверку на год и номер месяца больше 12

    if (monthsArr.length > 0) {
      console.log('not empty monthsArr')
      let prevMonth = monthsArr[monthsArr.length - 1];
      const userId = this.dataService.getLocalUserId()
      if (userId) {
        const newMonthItem = new RequestMonth(prevMonth.monthNum + 1, yearNow, userId);
        this.dataService.addUserMonth(newMonthItem)
          .pipe(takeUntil(this.destroy$))
          .subscribe((res: any) => {
            this._getDataMonths()
            this.dataService.monthsChanged1$.next(res)
          })

      }



      // this.dataService.addUserMonths(newMonthItem)
      //   .pipe(takeUntil(this.destroy$))
      //   .subscribe((data) => {
      //     this._getDataMonths()
      //   })
    } else {
      console.log('empty monthsArr')
      // const newMonthItem = new MonthItem(new Date().getMonth(), this.monthDate, 0, 0, [], [])
      // this.dataService.addUserMonths(newMonthItem)
      //   .pipe(takeUntil(this.destroy$))
      //   .subscribe((data) => {
      //     this._getDataMonths()
      //   })
    }
  }

}
