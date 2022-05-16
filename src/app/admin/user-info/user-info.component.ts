import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {Subject, takeUntil} from "rxjs";
import {DataService} from 'src/app/shared/service/data.service';


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

  constructor(private dataService: DataService) {
  }

  ngOnInit(): void {
    this.dataService.userKey$
      .pipe(takeUntil(this.destroy$))
      .subscribe(key => {
        this.monthNameArr = [];
        this.userKey = key
        this.fetchUserMonths(this.userKey)
      })
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
  }

  fetchUserMonths(idUser: string | null) {
    this.dataService.fetchUserMonths(idUser)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: data => {
          if (data) {
            let incomesArr: [string, unknown][] = []
            let expensesArr: [string, unknown][] = []
            data.map(item => {
              expensesArr = Object.entries(item.expensesArr)
              incomesArr = Object.entries(item.incomesArr)
              item.incomesArr = incomesArr
              item.expensesArr = expensesArr
              this.monthNameArr.push(item)
            })
          }
        },
        error: (err) => {
          alert('error fetching userdata')
        }
      })
  }
}
