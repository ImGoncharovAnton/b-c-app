import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {BehaviorSubject, Observable, tap} from "rxjs";
import {User} from "../model/user.model";
import {Router} from "@angular/router";
import {environment} from "../../../environments/environment";

export interface ResponseAuthData {
  errors: string[] | null,
  refreshToken: string,
  success: boolean,
  token: string
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private _authPath: string = environment.apiAuthUrl // "https://localhost:7206/api/authmanagement/"
  userName: string;
  userSub$ = new BehaviorSubject<any>(null);
  private tokenExpirationTimer: any;

  constructor(private http: HttpClient,
              private router: Router) {
    console.log('AuthService Works!')
  }

  public refreshToken(): Observable<any> {
    return this.http.post<ResponseAuthData>(this._authPath + 'refreshtoken', {
      token: this.getToken().token,
      refreshToken: this.getToken().refreshToken
    }).pipe(
      tap(response => {
        this.handleAuthentication(
          response.token,
          response.refreshToken
        )
      })
    )
  }

  public getToken() {
    let jsonData = localStorage.getItem('userData')
    let obj = jsonData !== null ? JSON.parse(jsonData) : []
    return {
      token: obj.token,
      refreshToken: obj.refreshToken
    }
  }

  public register(data: any) {
    return this.http.post<ResponseAuthData>(this._authPath + 'register', data).pipe(tap(resData => {
      this.handleAuthentication(
        resData.token,
        resData.refreshToken)
    }))
  }

  public login(email: string, password: string) {
    return this.http.post<ResponseAuthData>(this._authPath + 'login', {email: email, password: password})
      .pipe(tap(resData => {
        this.handleAuthentication(
          resData.token,
          resData.refreshToken
        )
      }))
  }

  handleAuthentication(token: string, refreshToken: string) {
    const decodedToken = JSON.parse(atob(token.split('.')[1]))
    const userId: string = decodedToken.id
    const role: string = decodedToken.role
    const dif: number = decodedToken.exp - decodedToken.iat
    const expireDate: Date = new Date(decodedToken.exp * 1000); // Tue Jun 07 2022 15:58:25 GMT+0300 (Msc)

    const user = new User(
      userId,
      role,
      refreshToken,
      token,
      expireDate
    )

    this.userSub$.next(user)
    this.autoLogout(dif*1000)
    localStorage.setItem('userData', JSON.stringify(user))
  }

  autoLogin() {
    let jsonData = localStorage.getItem('userData')
    const userData: {
      userId: string;
      role: string;
      refreshToken: string;
      token: string,
      tokenExpirationDate: Date
    } = jsonData !== null ? JSON.parse(jsonData) : [];

    if (!userData) {
      return;
    }

    if (new Date(userData.tokenExpirationDate) > new Date()) { // check valid expiration
      const loadedUser = new User(
        userData.userId,
        userData.role,
        userData.refreshToken,
        userData.token,
        new Date(userData.tokenExpirationDate)
      )
      if (loadedUser.token) {
        this.userSub$.next(loadedUser);
        const expirationDuration =
          new Date(userData.tokenExpirationDate).getTime() -
          new Date().getTime()
        this.autoLogout(expirationDuration)
      }
    }

  }

  logout() {
    this.userSub$.next(null)
    this.router.navigate(['/auth']);
    localStorage.removeItem('userData');
    localStorage.removeItem('MonthKey')
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer)
    }
    this.tokenExpirationTimer = null;
  }

  autoLogout(expirationDuration: number) {
    console.log('autoLogout, msec', expirationDuration)
    this.tokenExpirationTimer = setTimeout(() => {
      this.logout();
    }, expirationDuration);
  }
}
