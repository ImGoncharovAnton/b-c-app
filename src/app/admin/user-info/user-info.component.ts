import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Subject, takeUntil} from "rxjs";
import {DataService} from 'src/app/shared/service/data.service';
import {DialogService} from "../../shared/dialog/dialog.service";
import {MyCalcEditComponent} from "../../pages/my-calc/my-calc-edit/my-calc-edit.component";
import {LiteResponseItem} from "../../shared/model/lite-response-item.model";

export interface UserInfoData {
  expense: number;
  expenseArr: LiteResponseItem[];
  id: number;
  income: number;
  incomeArr: LiteResponseItem[];
  monthName: string;
  monthNum: number;
  userId: string;
  year: number;
}

// export interface UserInfoItem {
//   id: number;
//   createdBy: string;
//   value: number;
//   description: string;
//   monthId: number
// }


@Component({
  selector: 'app-user-info',
  templateUrl: './user-info.component.html',
  styleUrls: ['./user-info.component.scss']
})
export class UserInfoComponent implements OnInit, OnDestroy {
  private destroy$: Subject<boolean> = new Subject<boolean>();
  monthNameArr: any
  userKey: string | null
  @Input() username: string

  constructor(private dataService: DataService,
              private dialog: DialogService) {
  }

  ngOnInit(): void {
    this.dataService.userIdFromAdmin$
      .pipe(takeUntil(this.destroy$))
      .subscribe(userId => {
        this.userKey = userId
        this.getUserData()
      })

  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
  }

  getUserData(): void {
    this.dataService.itemsChangesIncome$
      .pipe(takeUntil(this.destroy$))
      .subscribe(arrIncome => {
        this._getUser()
      })
    this.dataService.itemsChangesExpense$
      .pipe(takeUntil(this.destroy$))
      .subscribe(arrExpense => {
        this._getUser()
      })
    this._getUser()
  }

  private _getUser(): void {
    const monthLocalizedString = function (year: number, month: number, locale: string) {
      return new Date(year, month - 1).toLocaleString(locale, {month: "long"});
    };
    if (this.userKey !== null) {
      this.dataService.getUser(this.userKey)
        .subscribe({
          next: (months: UserInfoData[]) => {
            months.map((item: UserInfoData) => {
              item.monthName = monthLocalizedString(item.year, item.monthNum, "en")
            })
            this.monthNameArr = months
          },
          error: err => alert(`error while fetching the records, ${err}`)
        })
    } else {
      alert('error while fetching the records')
    }
  }

  onEditItemIncome(id: number, monthId: number) {
    let userId = this.dataService.getLocalUserId()
    this.dataService.setIdEditItemIncome(id)
    this.dataService.idUser$.next(userId)
    // MonthId тут нужен только для того, чтобы обновлялись итемы на странице пользователя
    // если переписать логику обновления внутри my-calc-edit, monthId нужно будет убрать
    this.dataService.idMonth$.next(monthId)
    this.dialog.open(MyCalcEditComponent, {data: 'income'})
  }

  onEditItemExpense(id: number, monthId: number) {
    let userId = this.dataService.getLocalUserId()
    this.dataService.setIdEditItemExpense(id)
    this.dataService.idUser$.next(userId)
    // MonthId тут нужен только для того, чтобы обновлялись итемы на странице пользователя
    // если переписать логику обновления внутри my-calc-edit, monthId нужно будет убрать
    this.dataService.idMonth$.next(monthId)
    this.dialog.open(MyCalcEditComponent, {data: 'expense'})
  }


}
