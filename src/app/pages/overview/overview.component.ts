import {Component, OnDestroy, OnInit} from '@angular/core';
import {MonthItem} from "../../shared/model/month-item.model";
import {Subject, takeUntil} from 'rxjs';
import {ActivatedRoute, Router} from "@angular/router";
import {DialogService} from 'src/app/shared/dialog/dialog.service';
import {ConfirmDialogComponent} from "./confirm-dialog/confirm-dialog.component";
import {DataService} from "../../shared/service/data.service";
import {BudgetItem} from 'src/app/shared/model/budget-item.model';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class OverviewComponent implements OnInit, OnDestroy {
  monthsArr: MonthItem[] = [];
  id: number = 0;
  monthNow: number;
  changedDetected: boolean = false;

  private destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(private dataService: DataService,
              private _route: ActivatedRoute,
              private _router: Router,
              private dialog: DialogService) {
  }

  ngOnInit(): void {
    this._getDataMonths()
  }

  ngOnDestroy(): void {
    this.destroy$.next(true)
  }

  private _getDataMonths() {
    this.dataService.fetchUserMonths()
      .pipe(takeUntil(this.destroy$))
      .subscribe(months => {
          this.monthsArr = this.monthsArr.concat(months);
          let incomesArr: BudgetItem[] = []
          let expensesArr: BudgetItem[] = []
          months.map(item => {
            incomesArr = Object.values(item.incomesArr)
            expensesArr = Object.values(item.expensesArr)
            item.incomesArr = incomesArr
            item.expensesArr = expensesArr
            console.log(item)
          })
        }
      )
    this.dataService.monthsChanged$
      .pipe(takeUntil(this.destroy$))
      .subscribe((months: MonthItem[]) => {
        this.monthsArr = months
      })
    this.monthNow = new Date().getMonth();
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

  onDelete(item: MonthItem) {

    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        title: 'Confirm Remove Month',
        message: 'Are you sure you want to delete this month: ' + item.month
          + '?'
      }
    });

    dialogRef.afterClosed()
      .subscribe((result) => {
        if (result === true) {
          this.dataService.deleteMonths(item.key)
            .pipe(takeUntil(this.destroy$))
            .subscribe(response => {
              console.log('delete complete')
              this.dataService.fetchUserMonths()
                .pipe(takeUntil(this.destroy$))
                .subscribe(months => {
                  this.monthsArr = months
                  this.dataService.monthsChanged$.next(months)
                })
            })
        }
      });
  }
}
