import {Component, OnDestroy, OnInit} from '@angular/core';
import {BudgetService} from "../../shared/service/budget.service";
import {MonthItem} from "../../shared/model/month-item.model";
import {Subscription} from 'rxjs';
import {ActivatedRoute, Router} from "@angular/router";
import {DialogService} from 'src/app/shared/dialog/dialog.service';
import {ConfirmDialogComponent} from "./confirm-dialog/confirm-dialog.component";

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class OverviewComponent implements OnInit, OnDestroy {
  monthsArr: MonthItem[];
  id: number = 0;
  monthNow: number;
  private subscription: Subscription;

  constructor(private budgetService: BudgetService,
              private _route: ActivatedRoute,
              private _router: Router,
              private dialog: DialogService) {
  }

  ngOnInit(): void {
    this.monthNow = new Date().getMonth();
    this.monthsArr = this.budgetService.getMonths();
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

  onMonthPage(id: number, item: MonthItem) {
    this.id = id;
    if (item.monthId > this.monthNow + 1) {
      return
    } else {
      this._router.navigate([`/my-calculator/${item.month}`], {
        relativeTo: this._route,
        queryParams: {
          id: this.id
        }
      });
    }
  }

  onDelete(i: number, item: MonthItem) {

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Confirm Remove Month',
        message: 'Are you sure you want to delete this month: ' + item.month
          + '?'
      }
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result === true) {
        this.budgetService.deleteMonths(i)
      }
    });
  }
}
