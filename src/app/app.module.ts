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

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    OverlayModule,
    OverviewModule,
    MyCalcModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
