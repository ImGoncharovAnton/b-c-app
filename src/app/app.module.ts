import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {MaterialModule} from './material/material.module';
import {LoginComponent} from './login/login.component';
import {OverlayModule} from "@angular/cdk/overlay";
import {OverviewModule} from "./pages/overview/overview.module";
import {MyCalcModule} from "./pages/my-calc/my-calc.module";
import {AuthComponent} from './auth/auth.component';
import {LoadingSpinnerComponent} from './shared/loading-spinner/loading-spinner.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {AuthInterseptorService} from "./shared/service/auth-interseptor.service";

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    AuthComponent,
    LoadingSpinnerComponent,
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
    HttpClientModule
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS,
    useClass: AuthInterseptorService,
    multi: true}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
