import {Component, OnDestroy, OnInit} from '@angular/core';
import {AuthService} from "../shared/service/auth.service";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  isAuthenticated: boolean = false;
  private _userSub: Subscription

  constructor(private authService: AuthService) {
  }

  ngOnInit(): void {
    this._userSub = this.authService.userSub$.subscribe((user) => {
      this.isAuthenticated = !!user
      //  !!user = user ? true : false
    })
  }

  onLogout() {
    this.authService.logout()
  }

  ngOnDestroy() {
    this._userSub.unsubscribe()
  }


}
