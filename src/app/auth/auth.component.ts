import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {AuthService, ResponseAuthData} from '../shared/service/auth.service';
import {NgForm, NgModel} from "@angular/forms";
import {Observable} from "rxjs";

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
              private router: Router) {
  }

  onSwitchMode() {
    this.isLoginMode = !this.isLoginMode;
    this.error = '';
  }

  ngOnInit(): void {
  }

  onSubmit(form: NgForm) {
    if (!form.valid) {
      return
    }
    const email = form.value.email;
    const password = form.value.password;
    // Checking for word "admin" at registration
    const result = email.match(/admin/)

    let authObs: Observable<ResponseAuthData>

    this.isLoading = true;
    this.error = '';

    if (this.isLoginMode) {
      authObs = this.authService.login(email, password)
    } else {
      // Checking for word "admin" at registration
      if (result) {
        this.isLoading = false
        form.reset()
        return alert('E-mail with the word "admin" cannot be used, please use another email')
      } else {
        authObs = this.authService.register(form.value);
      }
    }

    authObs.subscribe({
      next: (response) => {
        this.isLoading = false;
        this.router.navigate(['/overview-page']);
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
      return 'Password should be at least 8 characters, at least one lower and uppercase char, and must have at least one non alphanumeric char'
    }
    return null
  }
}
