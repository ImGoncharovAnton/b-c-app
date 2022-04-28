import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";

export interface AuthResponseData {
  idToken: string,
  email: string,
  refreshToken: string,
  expiresIn: string,
  localId: string,
  registered?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  isLoggedIn: boolean = false;

  constructor(private http: HttpClient) {
  }

  signUp(email: string, password: string) {
    return this.http.post<AuthResponseData>(`https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyBRB16qVU9P_RHIUrkFQNXd_8hUm61nPjk`,
      {
        email: email,
        password: password,
        returnSecureToken: true
      }
    )

  }

  login() {
    this.isLoggedIn = true
  }

  logout() {
    this.isLoggedIn = false
  }

  isAuthenticated() {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve(this.isLoggedIn)
      }, 5000)
    })
  }


}
