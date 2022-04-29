import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AuthComponent} from "./auth/auth.component";
import {OverviewComponent} from "./pages/overview/overview.component";
import {AuthGuard} from "./auth/auth.guard";
import {MyCalcComponent} from "./pages/my-calc/my-calc.component";

const routes: Routes = [
  {path: '', redirectTo: '/overview-page', pathMatch: 'full'},
  {path: 'auth', component: AuthComponent},
  {
    path: 'overview-page',
    component: OverviewComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'my-calculator/:myMonth',
    component: MyCalcComponent,
    canActivate: [AuthGuard]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
