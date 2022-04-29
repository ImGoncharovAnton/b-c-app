import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MyCalcComponent} from "./my-calc.component";
import {OverlayModule} from "@angular/cdk/overlay";
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MaterialModule} from 'src/app/material/material.module';
import {IncomeListComponent} from './income-list/income-list.component';
import {ExpenseListComponent} from './expense-list/expense-list.component';
import {MyCalcEditComponent} from './my-calc-edit/my-calc-edit.component';

@NgModule({
  declarations: [
    MyCalcComponent,
    IncomeListComponent,
    ExpenseListComponent,
    MyCalcEditComponent
  ],
  imports: [
    CommonModule,
    OverlayModule,
    ReactiveFormsModule,
    FormsModule,
    MaterialModule
  ]
})
export class MyCalcModule {
}
