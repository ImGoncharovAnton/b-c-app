import {Component, OnDestroy, OnInit} from '@angular/core';
import {MonthItem} from "../../shared/model/month-item.model";
import {Subject, takeUntil} from 'rxjs';
import {ActivatedRoute, Router} from "@angular/router";
import {DialogService} from 'src/app/shared/dialog/dialog.service';
import {ConfirmDialogComponent} from "./confirm-dialog/confirm-dialog.component";
import {DataService} from "../../shared/service/data.service";
import {BudgetItem} from 'src/app/shared/model/budget-item.model';
import {ResponseMonth} from "../../shared/model/response-month.model";
import {ResponseItem} from "../../shared/model/response-item.model";

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class OverviewComponent implements OnInit, OnDestroy {
  monthsArr: MonthItem[] = []
  id: number = 0
  monthNow: number

  // -----------------new
  monthsArr1: ResponseMonth[] = []


  private destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(private dataService: DataService,
              private _route: ActivatedRoute,
              private _router: Router,
              private dialog: DialogService) {
  }

  ngOnInit(): void {
    // this._getDataMonths()
    this._getMonths()
  }

  ngOnDestroy(): void {
    this.destroy$.next(true)
  }

  private _getMonths() {
    // Функция для отображения имени месяца
    const monthLocalizedString = function (year: number, month: number, locale: string) {
      return new Date(year, month - 1).toLocaleString(locale, {month: "long"});
    };
    // console.log('Month string', monthLocalizedString(2022,8, 'en'))

    this.dataService.getUserMonths()
      .pipe(takeUntil(this.destroy$))
      .subscribe((months: ResponseMonth[]) => {
        months.map(item => {
          let dataItems = []
          item.monthName = monthLocalizedString(item.year, item.monthNum, 'en')
          let income: number = 0
          let expense: number = 0
          if (item.items.length > 0) {
            dataItems = item.items
            income = dataItems.map((i: ResponseItem) => {
              if (i.type === 0){
                return i.value
              } else {
                return 0
              }
            }).reduce((a, b) => {
              return a + b
            });
            expense = dataItems.map((i: ResponseItem) => {
              if (i.type === 1){
                return i.value
              } else {
                return 0
              }
            }).reduce((a, b) => {
              return a + b
            })
          }
          item.income = income
          item.expense = expense
          console.log('months', months)
        })
        this.monthsArr1 = this.monthsArr1.concat(months);
      })
    this.monthNow = new Date().getMonth();
  }

  // -------------------old------------------------

  // private _getDataMonths() {
  //   this.dataService.fetchUserMonths()
  //     .pipe(takeUntil(this.destroy$))
  //     .subscribe(months => {
  //         this.monthsArr = this.monthsArr.concat(months);
  //       }
  //     )
  //   this.dataService.monthsChanged$
  //     .pipe(takeUntil(this.destroy$))
  //     .subscribe((months: MonthItem[]) => {
  //       let incomesArr: BudgetItem[] = []
  //       let expensesArr: BudgetItem[] = []
  //       months.map(item => {
  //         incomesArr = Object.values(item.incomesArr)
  //         expensesArr = Object.values(item.expensesArr)
  //         item.incomesArr = incomesArr
  //         item.expensesArr = expensesArr
  //         let checkStateIncome = item.incomesArr.some((el: BudgetItem) => el.adminChanged)
  //         let checkStateExpenses = item.expensesArr.some((el: BudgetItem) => el.adminChanged)
  //         if (checkStateExpenses || checkStateIncome) {
  //           item.changedAdmin = true
  //         }
  //       })
  //       this.monthsArr = months
  //     })
  //   this.monthNow = new Date().getMonth();
  // }


  onMonthPage(id: number, item: ResponseMonth) {
    this.id = id;
    // if (item.monthId > this.monthNow + 1) {
    //   return
    // } else {
    //   this._router.navigate([`/my-calculator/${item.month}`], {
    //     relativeTo: this._route,
    //     queryParams: {
    //       id: this.id
    //     }
    //   });
    // }
    console.log(item)
  }

  onDelete(item: ResponseMonth) {

    console.log('delete item', item)
    // const dialogRef = this.dialog.open(ConfirmDialogComponent, {
    //   data: {
    //     title: 'Confirm Remove Month',
    //     message: 'Are you sure you want to delete this month: ' + item.month + '?'
    //   }
    // });
    //
    // dialogRef.afterClosed()
    //   .subscribe((result) => {
    //     if (result === true) {
    //       this.dataService.deleteMonths(item.key)
    //         .pipe(takeUntil(this.destroy$))
    //         .subscribe(response => {
    //           this.dataService.fetchUserMonths()
    //             .pipe(takeUntil(this.destroy$))
    //             .subscribe(months => {
    //               this.monthsArr = months
    //               this.dataService.monthsChanged$.next(months)
    //             })
    //         })
    //     }
    //   });
  }
}
