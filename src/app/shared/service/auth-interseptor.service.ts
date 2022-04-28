import {Injectable} from '@angular/core';
import { HttpHandler, HttpInterceptor, HttpParams, HttpRequest} from "@angular/common/http";
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthInterseptorService implements HttpInterceptor {

  constructor(private authService: AuthService) {
  }

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    console.log('Request intercept')
    let modifiedRequest = req.clone({})
    return next.handle(modifiedRequest)
  }
}
