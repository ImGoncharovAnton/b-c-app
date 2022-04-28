import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {OverviewComponent} from './overview.component';
import {OverviewCreateComponent} from './overview-create/overview-create.component';
import {RouterModule, Routes} from "@angular/router";
import {MaterialModule} from 'src/app/material/material.module';
import {ConfirmDialogComponent} from './confirm-dialog/confirm-dialog.component';
import {OverlayModule} from "@angular/cdk/overlay";

const routes: Routes = [
  {
    path: 'overview-page',
    component: OverviewComponent
  }
]

@NgModule({
  declarations: [
    OverviewComponent,
    OverviewCreateComponent,
    ConfirmDialogComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    MaterialModule,
    OverlayModule
  ]
})
export class OverviewModule {
}
