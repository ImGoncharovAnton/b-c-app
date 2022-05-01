import {NgModule} from '@angular/core';
import {MatButtonModule} from "@angular/material/button";
import {MatListModule} from "@angular/material/list";
import {MatIconModule} from "@angular/material/icon";
import {MatGridListModule} from "@angular/material/grid-list";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatToolbarModule} from "@angular/material/toolbar";

const MaterialComponents = [
  MatButtonModule,
  MatListModule,
  MatIconModule,
  MatGridListModule,
  MatInputModule,
  MatFormFieldModule,
  MatToolbarModule
]

@NgModule({
  imports: [MaterialComponents],
  exports: [MaterialComponents]
})
export class MaterialModule {
}
