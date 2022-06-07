import {Component, OnInit} from '@angular/core';
import {AuthService} from './shared/service/auth.service';
import { DataService } from './shared/service/data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  data: any

  constructor(private authService: AuthService,
              private dataService: DataService) {
  }

  ngOnInit() {
    this.authService.autoLogin()
  }

  getItems() {
    this.dataService.getItems().subscribe(res => {
      console.log(res)
    })
  }
}
