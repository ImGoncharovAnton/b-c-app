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
    console.log(form.value)
    if (!form.valid) {
      return
    }
    const email = form.value.email;
    const password = form.value.password;

    // let authObs: Observable<AuthResponseData>

    this.isLoading = true;

    if (this.isLoginMode) {
      // authObs = this.authService.login(email, password);
    } else {
      // authObs = this.authService.signUp(email, password);
      this.authService.signUp(email, password).subscribe({
        next: (response) => {
          console.log(response)
          this.isLoading = false;
          },
        error: (error) => {
          console.error(error)
          this.isLoading = false
          this.error = 'An Error has occurred'},
        complete: () => console.log('authService subscribe observable complete')
      })
    }

    // authObs.subscribe(resData => {
    //     console.log(resData);
    //     this.isLoading = false;
    //     this.router.navigate(['/overview-page']);
    //   },
    //   errorMessage => {
    //     console.log(errorMessage);
    //     this.error = errorMessage;
    //     this.isLoading = false;
    //   }
    // );

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
