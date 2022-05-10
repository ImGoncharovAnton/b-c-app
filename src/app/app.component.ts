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
    let months = [
      {'key1': 'value1'},
      {'key2': 'value2'}]
    this.dataService.updateUserMonths(months)
    console.log('AddData complited')
  }

  fetchData() {
    this.dataService.fetchUser()
    console.log('fetchUser complete')
  }

  setDataUser() {
    console.log(this.dataService.setUserId())
    // const a = this.dataService.dataUser()
    // console.log('user from data service', a)
  }
}
