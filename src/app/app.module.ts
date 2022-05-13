import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MaterialModule} from './material/material.module';
import {OverlayModule} from "@angular/cdk/overlay";
import {OverviewModule} from "./pages/overview/overview.module";
import {MyCalcModule} from "./pages/my-calc/my-calc.module";
import {AuthComponent} from './auth/auth.component';
import {LoadingSpinnerComponent} from './shared/loading-spinner/loading-spinner.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {AuthInterceptorService} from "./shared/service/auth-interceptor.service";
import {HeaderComponent} from './header/header.component';
import {AdminComponent} from './admin/admin.component';
import {MatSortModule} from "@angular/material/sort";

@NgModule({
  declarations: [
    AppComponent,
    AuthComponent,
    LoadingSpinnerComponent,
    HeaderComponent,
    AdminComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    OverlayModule,
    OverviewModule,
    MyCalcModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    MatSortModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorService,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
