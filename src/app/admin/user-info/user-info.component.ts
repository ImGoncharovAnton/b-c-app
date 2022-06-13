import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Subject, takeUntil} from "rxjs";
import {DataService} from 'src/app/shared/service/data.service';
import {DialogService} from "../../shared/dialog/dialog.service";
import {MyCalcEditComponent} from "../../pages/my-calc/my-calc-edit/my-calc-edit.component";


@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.scss']
})
export class UserInfoComponent implements OnInit, OnDestroy {
  private destroy$: Subject<boolean> = new Subject<boolean>();
  userKey: string | null
  monthNameArr: any[] = []
  @Input() username: string

  constructor(private dataService: DataService,
              private dialog: DialogService) {
  }

  ngOnInit(): void {
    this.dataService.idUser$
      .pipe(takeUntil(this.destroy$))
      .subscribe(userKey => {
        this.userKey = userKey
        this.getUserData()
      })

  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
  }

  getUserData(): void {
    const monthLocalizedString = function (year: number, month: number, locale: string) {
      return new Date(year, month - 1).toLocaleString(locale, {month: "long"});
    };
    if (this.userKey !== null) {
      this.dataService.getUser(this.userKey).subscribe({
          next: (months: any) => {
            console.log('user-info data', months)
            months.map((item: any) => {
              item.monthName = monthLocalizedString(item.year, item.monthNum, "en")
            })
            this.monthNameArr = months
          },
          error: err => alert('error while fetching the records')
        }
      )
    } else {
      alert('error while fetching the records')
    }
  }

  // _transformData(data: any[]) {
  //   this.monthNameArr = [];
  //   let incomesArr: [string, unknown][] = []
  //   let expensesArr: [string, unknown][] = []
  //   data.map(item => {
  //     expensesArr = Object.entries(item.expensesArr)
  //     incomesArr = Object.entries(item.incomesArr)
  //     item.incomesArr = incomesArr
  //     item.expensesArr = expensesArr
  //     this.monthNameArr.push(item)
  //   })
  // }

  /*fetchUserMonths(idUser: string | null) {
    this.dataService.userChanged$
      .pipe(takeUntil(this.destroy$))
      .subscribe(techData => {
        if (techData && techData.userKey === idUser) {
          this.dataService.fetchUserMonths(idUser)
            .pipe(takeUntil(this.destroy$))
            .subscribe(data => {
              this._transformData(data)
            })
        } else {
          this.dataService.fetchUserMonths(idUser)
            .pipe(takeUntil(this.destroy$))
            .subscribe({
              next: data => {
                this._transformData(data)
              },
              error: (err) => {
                alert('error fetching userdata')
              }
            })
        }
      })
  }*/


  onEditItemIncome(id: number, monthId: number) {
    let userId = this.dataService.getLocalUserId()
    console.log('onEditItemIncome userId', userId)
    console.log('onEditItemIncome id', id)
    this.dataService.setIdEditItemIncome(id)
    this.dataService.idUser$.next(userId)
    // MonthId тут нужен только для того, чтобы обновлялись итемы на странице пользователя
    // если переписать логику обновления внутри my-calc-edit, monthId нужно будет убрать
    this.dataService.idMonth$.next(monthId)
    this.dialog.open(MyCalcEditComponent, {data: 'income'})
  }

  onEditItemExpense(id: number, monthId: number) {
    let userId = this.dataService.getLocalUserId()
    console.log('onEditItemExpense userId', userId)
    console.log('onEditItemExpense id', id)
    this.dataService.setIdEditItemExpense(id)
    this.dataService.idUser$.next(userId)
    // MonthId тут нужен только для того, чтобы обновлялись итемы на странице пользователя
    // если переписать логику обновления внутри my-calc-edit, monthId нужно будет убрать
    this.dataService.idMonth$.next(monthId)
    this.dialog.open(MyCalcEditComponent, {data: 'expense'})
  }


}
