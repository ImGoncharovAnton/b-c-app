import {Component, OnDestroy, OnInit} from '@angular/core';
import {BudgetService} from "../../shared/service/budget.service";
import {MonthItem} from "../../shared/model/month-item.model";
import {Subscription} from 'rxjs';
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class OverviewComponent implements OnInit, OnDestroy {
  monthsArr: MonthItem[];
  id: number = 0;
  timeLeft: number = 60;
  interval: any;
  private subscription: Subscription;

  constructor(private budgetService: BudgetService,
              private _route: ActivatedRoute,
              private _router: Router) {
  }

  ngOnInit(): void {
    this.monthsArr = this.budgetService.getMonths();
    console.log(this.monthsArr)
    this.subscription = this.budgetService.monthsChanged$
      .subscribe(
        (months: MonthItem[]) => {
          this.monthsArr = months
        }
      )
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  onMonthPage(id: number, item: any) {
    this.id = id;
    this._router.navigate([`/my-calculator/${item.month}`], {
      relativeTo: this._route,
      queryParams: {
        id: this.id
      }
    });
  }

  onDelete(i: number) {
    console.log('Deleted')
  }
}
