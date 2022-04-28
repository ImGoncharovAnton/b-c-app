import {Component} from '@angular/core';
import {LoginComponent} from "./login/login.component";
import {DialogService} from './shared/dialog/dialog.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'b-c-app';

  constructor(private dialog: DialogService) {
  }

  openLogin() {
    const dialogRef = this.dialog.open(LoginComponent, {data: 'John'});

    dialogRef.afterClosed().subscribe(() => {
      // Subscription runs after the dialog closes
      console.log('Dialog closed!');
    });
  }
}
