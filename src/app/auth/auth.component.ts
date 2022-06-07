import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {AuthResponseData, AuthService, ResponseAuthData} from '../shared/service/auth.service';
import {NgForm, NgModel} from "@angular/forms";
import {Observable} from "rxjs";
import {DataService} from '../shared/service/data.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {
  hide: boolean = true;
  isLoginMode: boolean = true
  isLoading: boolean = false
  error: string = '';

  constructor(private authService: AuthService,
              private router: Router,
              private dataService: DataService) {
  }

  onSwitchMode() {
    this.isLoginMode = !this.isLoginMode;
  }

  ngOnInit(): void {
  }

  onSubmit(form: NgForm) {
    if (!form.valid) {
      return
    }
    const username = form.value.username;
    const email = form.value.email;
    const password = form.value.password;
    // Checking for word "admin" at registration
    const result = email.match(/admin/)

    // let authObs: Observable<AuthResponseData>
    let authObs: Observable<ResponseAuthData>

    this.isLoading = true;
    this.error = '';

    if (this.isLoginMode) {
      authObs = this.authService.login1(email, password)
      // authObs = this.authService.login(email, password)
    } else {
      // Checking for word "admin" at registration
      if (result) {
        this.isLoading = false
        form.reset()
        return alert('E-mail with the word "admin" cannot be used, please use another email')
      } else {
        authObs = this.authService.register1(form.value);
        // authObs = this.authService.signUp(email, password)
      }
    }

    authObs.subscribe({
      next: (response) => {
        console.log(response)
        // if (!this.isLoginMode) {
        //   console.log('register true')
        //   this.dataService.storeUser(username, response.email, response.localId)
        // } else {
        //   console.log('login true')
        //   this.dataService.getUserId(response.localId)
        // }
        // this.isLoading = false;
        // this.router.navigate(['/overview-page']);
      },
      error: (errorMessage) => {
        console.log(errorMessage)
        this.error = errorMessage.error.errors
        this.isLoading = false
      },
      complete: () => console.log('authService subscribe observable complete')
    })

    form.reset();
  }

  getPasswordErrors(password: NgModel) {
    // else if and return null needed so that the typescript does not swear
    if (password.errors?.['required']) {
      return 'Password is required'
    } else if (password.errors?.['minlength']) {
      return 'Password should be at least 6 characters'
    }
    return null
  }
}
