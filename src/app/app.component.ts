import {Component, OnInit} from '@angular/core';
import {AuthService} from './shared/service/auth.service';
import * as signalR from "@microsoft/signalr";
import {environment} from "../environments/environment";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  data: any

  constructor(private authService: AuthService) {
  }

  ngOnInit() {
    this.authService.autoLogin()
  }

}
