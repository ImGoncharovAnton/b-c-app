import {NgModule} from '@angular/core';
import {MatButtonModule} from "@angular/material/button";
import {MatListModule} from "@angular/material/list";
import {MatIconModule} from "@angular/material/icon";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatToolbarModule} from "@angular/material/toolbar";
import {LayoutModule} from "@angular/cdk/layout";
import {MatTabsModule} from "@angular/material/tabs";
import {MatTableModule} from "@angular/material/table";
import {MatSortModule} from "@angular/material/sort";
import {MatPaginatorModule} from "@angular/material/paginator";

const MaterialComponents = [
  MatButtonModule,
  MatListModule,
  MatIconModule,
  MatInputModule,
  MatFormFieldModule,
  MatToolbarModule,
  MatIconModule,
  MatButtonModule,
  MatTabsModule,
  MatTableModule,
  LayoutModule,
  MatSortModule,
  MatPaginatorModule,
  MatSortModule
]

@NgModule({
  imports: [MaterialComponents],
  exports: [MaterialComponents]
})
export class MaterialModule {
}
