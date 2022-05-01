import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {AuthResponseData, AuthService} from '../shared/service/auth.service';
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
              private router: Router) {}

  onSwitchMode() {
    this.isLoginMode = !this.isLoginMode;
  }

  ngOnInit(): void {
  }

  onSubmit(form: NgForm) {
    if (!form.valid) {
      return
    }
    const email = form.value.email;
    const password = form.value.password;

    let authObs: Observable<AuthResponseData>

    this.isLoading = true;
    this.error = '';

    if (this.isLoginMode) {
      authObs = this.authService.login(email, password)
    } else {
      authObs = this.authService.signUp(email, password)
    }

    authObs.subscribe({
      next: (response) => {
        this.isLoading = false;
        this.router.navigate(['/overview-page']);
      },
      error: (errorMessage) => {
        this.error = errorMessage
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
