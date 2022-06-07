import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {BehaviorSubject, catchError, Observable, tap} from "rxjs";
import {User, User1} from "../model/user.model";
import {Router} from "@angular/router";
import {environment} from "../../../environments/environment";

export interface AuthResponseData {
  idToken: string,
  email: string,
  refreshToken: string,
  expiresIn: string,
  localId: string,
  registered?: boolean;
}

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
        console.log(response)
        this.handleAuthentication1(
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

  public register1(data: any) {
    return this.http.post<ResponseAuthData>(this._authPath + 'register', data).pipe(tap(resData => {
      this.handleAuthentication1(
        resData.token,
        resData.refreshToken)
    }))
  }

  public login1(email: string, password: string) {
    return this.http.post<ResponseAuthData>(this._authPath + 'login', {email: email, password: password})
      .pipe(tap(resData => {
        this.handleAuthentication1(
          resData.token,
          resData.refreshToken
        )
      }))
  }

  handleAuthentication1(token: string, refreshToken: string) {
    const decodedToken = JSON.parse(atob(token.split('.')[1]))
    console.log(decodedToken)
    const userId: string = decodedToken.id
    const role: string = decodedToken.role
    const dif: number = decodedToken.exp - decodedToken.iat
    const expireDate: Date = new Date(decodedToken.exp * 1000); // Tue Jun 07 2022 15:58:25 GMT+0300 (Msc)
    console.log(dif * 1000)
    console.log(expireDate)

    const user = new User1(
      userId,
      role,
      refreshToken,
      token,
      expireDate
    )

    // this.userSub$.next(user)
    // this.autoLogout(dif*10000)
    localStorage.setItem('userData', JSON.stringify(user))
    console.log(this.getToken().token)
    console.log(this.getToken().refreshToken)
  }


  signUp(email: string, password: string) {
    return this.http.post<AuthResponseData>(`https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyBRB16qVU9P_RHIUrkFQNXd_8hUm61nPjk`,
      {
        email: email,
        password: password,
        returnSecureToken: true
      }
    ).pipe(
      catchError((errorRes) => {
        let errorMessage = 'An Error has occurred';
        if (!errorRes.error || !errorRes.error.error) {
          throw new Error(errorMessage)
        }
        switch (errorRes.error.error.message) {
          case 'EMAIL_EXISTS':
            errorMessage = 'The email address is already in use by another account.'
            break;
          case 'OPERATION_NOT_ALLOWED':
            errorMessage = 'Password sign-in is disabled for this project.'
            break;
          case 'TOO_MANY_ATTEMPTS_TRY_LATER':
            errorMessage = 'We have blocked all requests from this device due to unusual activity. Try again later.'
            break;
        }
        throw new Error(errorMessage)
      }),
      tap(resData => {
        this.handleAuthentication(
          resData.email,
          resData.localId,
          resData.idToken,
          +resData.expiresIn)
      })
    )

  }

  login(email: string, password: string) {
    return this.http.post<AuthResponseData>(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyBRB16qVU9P_RHIUrkFQNXd_8hUm61nPjk`,
      {
        email: email,
        password: password,
        returnSecureToken: true
      }
    ).pipe(catchError((errorRes) => {
        let errorMessage = 'An Error has occurred';
        if (!errorRes.error || !errorRes.error.error) {
          throw new Error(errorMessage)
        }
        switch (errorRes.error.error.message) {
          case 'EMAIL_NOT_FOUND':
            errorMessage = 'There is no user record corresponding to this identifier. The user may have been deleted.'
            break;
          case 'INVALID_PASSWORD':
            errorMessage = 'The password is invalid or the user does not have a password.'
            break;
          case 'USER_DISABLED':
            errorMessage = 'The user account has been disabled by an administrator.'
            break;
        }
        throw new Error(errorMessage)
      }),
      tap(resData => {
        this.handleAuthentication(
          resData.email,
          resData.localId,
          resData.idToken,
          +resData.expiresIn)
      })
    )
  }

  autoLogin() {
    let jsonData = localStorage.getItem('userData')
    const userData: {
      email: string;
      id: string;
      _token: string;
      _tokenExpirationDate: Date,
      role: string
    } = jsonData !== null ? JSON.parse(jsonData) : [];
    if (!userData) {
      return;
    }
    const loadedUser = new User(
      userData.email,
      userData.id,
      userData._token,
      new Date(userData._tokenExpirationDate),
      userData.role,
    )
    if (loadedUser.token) {
      this.userSub$.next(loadedUser);
      const expirationDuration =
        new Date(userData._tokenExpirationDate).getTime() -
        new Date().getTime()

      this.autoLogout(expirationDuration)
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

  private handleAuthentication(
    email: string,
    userId: string,
    token: string,
    expiresIn: number) {
    let role: string
    const result = email.match(/admin/)
    if (result) {
      role = 'immortal';
    } else {
      role = 'mortal'
    }

    const expireDate = new Date(new Date().getTime() + expiresIn * 1000)
    const user = new User(
      email,
      userId,
      token,
      expireDate,
      role)
    this.userSub$.next(user)
    this.autoLogout(expiresIn * 1000)
    localStorage.setItem('userData', JSON.stringify(user))
  }
}
