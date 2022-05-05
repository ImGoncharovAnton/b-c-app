import {Component, OnInit} from '@angular/core';
import {AuthService} from './shared/service/auth.service';
import {DataService} from './shared/service/data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {

  constructor(private authService: AuthService,
              private dataService: DataService) {
  }

  ngOnInit() {
    this.authService.autoLogin()
  }

  addData() {
    this.dataService.storeData()
    console.log('AddData complited')
  }

  fetchData() {
    this.dataService.fetchData()
    console.log('data fetch complete')
  }

  setDataUser() {
    const a = this.dataService.setUserData()
    console.log(this.dataService.setMonthData())

    console.log('user from data service', a)
  }
}
