import {Component, Inject} from '@angular/core';
import {DIALOG_DATA} from "../shared/dialog/dialog-token";
import {DialogRef} from "../shared/dialog/dialog-ref";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  constructor(
    private dialogRef: DialogRef,
    @Inject(DIALOG_DATA) public data: string
  ) {
  }

  close() {
    this.dialogRef.close();
  }
}
