import {Component, OnDestroy, OnInit} from '@angular/core';
import {AuthService} from "../shared/service/auth.service";
import {Subject, takeUntil} from "rxjs";
import * as signalR from "@microsoft/signalr";
import {environment} from "../../environments/environment";
import {IHubMessage} from "../shared/model/IHubMessage";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  isAuthenticated: boolean = false;
  private destroy$: Subject<boolean> = new Subject<boolean>();

  constructor(private authService: AuthService) {
  }

  ngOnInit(): void {
    this.authService.userSub$
      .pipe(takeUntil(this.destroy$))
      .subscribe((user) => {
        this.isAuthenticated = !!user
        // === !!user = user ? true : false
      })
    this._signalR()
  }

  private _signalR() {
    const connection = new signalR.HubConnectionBuilder()
      .withUrl(environment.baseUrl + 'messageHub')
      .build()
    connection.on("MessageReceived", (obj:IHubMessage) => {
      if (this._getLocalUserId() === obj.userId) {
        console.log(obj)
        alert(obj.message)
      }
    })
    connection.start()
      .catch(err => console.error(err));
  }

  // private _getLocalRole() {
  //   let jsonData = localStorage.getItem('userData')
  //   let userData = jsonData !== null ? JSON.parse(jsonData) : []
  //   return userData.role
  // }

  private _getLocalUserId() {
    let jsonData = localStorage.getItem('userData')
    const userData = jsonData !== null ? JSON.parse(jsonData) : []
    return userData.userId
  }

  onLogout() {
    this.authService.logout()
  }

  ngOnDestroy() {
    this.destroy$.next(true)
  }

}
