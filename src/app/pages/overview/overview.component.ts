import {Component, OnDestroy, OnInit} from '@angular/core';
import {MonthItem} from "../../shared/model/month-item.model";
import {Subject, takeUntil} from 'rxjs';
import {ActivatedRoute, Router} from "@angular/router";
import {DialogService} from 'src/app/shared/dialog/dialog.service';
import {DataService} from "../../shared/service/data.service";
import {ResponseMonth} from "../../shared/model/response-month.model";
import {ResponseItem} from "../../shared/model/response-item.model";
import {ConfirmDialogComponent} from "./confirm-dialog/confirm-dialog.component";
import {normalizedMonth} from "../../shared/functions/normalizedMonth";

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class OverviewComponent implements OnInit, OnDestroy {
  monthsArr: ResponseMonth[] = []
  yearNow: number = new Date().getFullYear()
  monthNow = new Date().getMonth();
  private destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(private dataService: DataService,
              private _route: ActivatedRoute,
              private _router: Router,
              private dialog: DialogService) {
  }

  ngOnInit(): void {
    this._getMonths()
  }

  ngOnDestroy(): void {
    this.destroy$.next(true)
  }

  private _normalizedMonths(months: ResponseMonth[]) {
    months.map(item => {
      normalizedMonth(item)
    })
    return months
  }

  private _getMonths() {
    this.dataService.getUserMonths()
      .pipe(takeUntil(this.destroy$))
      .subscribe((months: ResponseMonth[]) => {
        this._normalizedMonths(months)
        console.log('months', months)
        this.monthsArr = this.monthsArr.concat(months);
      })
    this.dataService.monthsChanged$
      .pipe(takeUntil(this.destroy$))
      .subscribe((months: ResponseMonth[]) => {
        this._normalizedMonths(months)
        this.monthsArr = months
      })
  }

  onMonthPage(item: ResponseMonth) {
    if (item.monthNum > this.monthNow + 2 || item.year !== new Date().getFullYear()) {
      return
    } else {
      this._router.navigate([`/my-calculator/${item.monthName}`], {
        relativeTo: this._route,
        queryParams: {
          id: item.id
        }
      });
    }
  }

  onDelete(item: ResponseMonth) {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Confirm Remove Month',
        message: 'Are you sure you want to delete this month: ' + item.monthName + '?'
      }
    });

    dialogRef.afterClosed()
      .subscribe((result) => {
        if (result === true) {
          this.dataService.deleteUserMonth(item.id)
            .pipe(takeUntil(this.destroy$))
            .subscribe(response => {
              this.dataService.getUserMonths()
                .pipe(takeUntil(this.destroy$))
                .subscribe(months => {
                  this.dataService.monthsChanged$.next(months)
                })
            })
        }
      });
  }
}
