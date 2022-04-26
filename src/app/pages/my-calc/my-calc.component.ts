import {Component, OnDestroy, OnInit} from '@angular/core';
import {Subscription} from 'rxjs';
import {BudgetService} from "../../shared/service/budget.service";
import {ActivatedRoute} from "@angular/router";
import {MyCalcEditComponent} from "./my-calc-edit/my-calc-edit.component";
import {DialogService} from 'src/app/shared/dialog/dialog.service';

@Component({
  selector: 'app-my-calc',
  templateUrl: './my-calc.component.html',
  styleUrls: ['./my-calc.component.scss']
})
export class MyCalcComponent implements OnInit, OnDestroy {
  parentId: number;
  subscription$: Subscription

  constructor(private budgetService: BudgetService,
              private route: ActivatedRoute,
              private dialog: DialogService) {
  }

  ngOnInit(): void {
    this.subscription$ = this.route.queryParams.subscribe(params => {
        this.parentId = params['id']
        console.log(this.parentId)
      }
    )
  }

  ngOnDestroy(): void {
    this.subscription$.unsubscribe()
  }

  onCreateItem() {
    const dialogRef = this.dialog.open(MyCalcEditComponent);

    dialogRef.afterClosed().subscribe((data) => {
      // Subscription runs after the dialog closes
      console.log('Dialog closed!');
    });
  }
}
