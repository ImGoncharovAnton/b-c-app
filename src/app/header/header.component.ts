import {Component, OnDestroy, OnInit} from '@angular/core';
import {AuthService} from "../shared/service/auth.service";
import {Subject, takeUntil} from "rxjs";
import {DataService} from '../shared/service/data.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  isAuthenticated: boolean = false;
  private destroy$: Subject<boolean> = new Subject<boolean>();
  username: string

  constructor(private authService: AuthService,
              private dataService: DataService) {
  }

  ngOnInit(): void {
    this.authService.userSub$
      .pipe(takeUntil(this.destroy$))
      .subscribe((user) => {
        this.isAuthenticated = !!user
        // === !!user = user ? true : false
      })
    this.dataService.fetchUser()
      .pipe(takeUntil(this.destroy$))
      .subscribe(data => {
        this.username = data.username
      })
  }

  onLogout() {
    this.authService.logout()
  }

  ngOnDestroy() {
    this.destroy$.next(true)
  }


}
