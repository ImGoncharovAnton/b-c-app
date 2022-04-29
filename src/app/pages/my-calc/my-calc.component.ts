import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {BudgetService} from "../../shared/service/budget.service";
import {ActivatedRoute, Router} from "@angular/router";
import {MyCalcEditComponent} from "./my-calc-edit/my-calc-edit.component";
import {DialogService} from 'src/app/shared/dialog/dialog.service';

@Component({
  selector: 'app-my-calc',
  templateUrl: './my-calc.component.html',
  styleUrls: ['./my-calc.component.scss']
})
export class MyCalcComponent implements OnInit, OnDestroy {
  parentId: number;
  subscription1$: Subscription;
  subscription2$: Subscription;
  totalBudget: number
  monthName: string;

  constructor(private budgetService: BudgetService,
              private route: ActivatedRoute,
              private router: Router,
              private dialog: DialogService) {
  }

  ngOnInit(): void {
    this.subscription1$ = this.route.queryParams.subscribe(params => {
        this.parentId = params['id']
      }
    )
    this.budgetService.setPageId(this.parentId)
    const monthObj = this.budgetService.getMonth(this.parentId);
    this.monthName = monthObj.month;
    this.totalBudget = monthObj.income - monthObj.expense;
    this.subscription2$ = this.budgetService.totalBudgetCounter$
      .subscribe(
        (totalBudget: number) => {
          this.totalBudget = totalBudget
        }
      )
  }

  ngOnDestroy(): void {
    this.subscription1$.unsubscribe()
    this.subscription2$.unsubscribe()
  }

  onCreateItem() {
    const dialogRef = this.dialog.open(MyCalcEditComponent);

    dialogRef.afterClosed().subscribe((data) => {
      // Subscription runs after the dialog closes
      console.log('Dialog closed!');
    });
  }

}
