import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule, Routes} from "@angular/router";
import {MyCalcComponent} from "./my-calc.component";
import {OverlayModule} from "@angular/cdk/overlay";
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MaterialModule} from 'src/app/material/material.module';
import {IncomeListComponent} from './income-list/income-list.component';
import {ExpenseListComponent} from './expense-list/expense-list.component';
import {MyCalcEditComponent} from './my-calc-edit/my-calc-edit.component';

const routes: Routes = [
  {
    path: 'my-calculator/:myMonth',
    component: MyCalcComponent
  }
]

@NgModule({
  declarations: [
    MyCalcComponent,
    IncomeListComponent,
    ExpenseListComponent,
    MyCalcEditComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    OverlayModule,
    ReactiveFormsModule,
    FormsModule,
    MaterialModule
  ]
})
export class MyCalcModule {
}
