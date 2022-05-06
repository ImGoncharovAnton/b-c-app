import {Component, OnInit} from '@angular/core';
import {AuthService} from './shared/service/auth.service';
import {DataService} from './shared/service/data.service';
import {Subscription} from "rxjs";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  private subscription$: Subscription;
  data: any;

  constructor(private authService: AuthService,
              private dataService: DataService) {
  }

  ngOnInit() {
    this.authService.autoLogin()
  }

  addData() {
    this.dataService.storeUser('test@', '1')
    console.log('AddData complited')
  }

  fetchData() {
    let a: any
    this.subscription$ = this.dataService.data$
      .subscribe(
        (data) => {
          console.log(data)
          a = data
        }
      )
    console.log('data fetch complete', a)
  }

  setDataUser() {
    // console.log('jsonData from localstorage user', this.dataService.getUserData())
  }
}
