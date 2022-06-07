import {Injectable} from '@angular/core';
import {HttpErrorResponse, HttpHandler, HttpInterceptor, HttpParams, HttpRequest} from "@angular/common/http";
import {AuthService} from './auth.service';
import {catchError, exhaustMap, switchMap, take, throwError} from "rxjs";


@Injectable({
  providedIn: 'root'
})
export class AuthInterceptorService implements HttpInterceptor {

  constructor(private authService: AuthService) {
  }

  /*intercept(req: HttpRequest<any>, next: HttpHandler) {
    return this.authService.userSub$.pipe(
      take(1),
      exhaustMap(user => {
        if (!user) {
          return next.handle(req)
        }
        const modifiedReq = req.clone({params: new HttpParams().set('auth', user.token)});
        return next.handle(modifiedReq);
      })
    )
  }*/

  intercept(req: HttpRequest<any>, next: HttpHandler): any {
    if(this.authService.getToken().token) {
      const clone = req.clone({
        headers: req.headers.append('Authorization', `Bearer ${this.authService.getToken().token}`)
      });
      return next.handle(clone);
     /* return next.handle(req).pipe(
        catchError((error) => { // Отлавливаем ошибку
          if(error instanceof HttpErrorResponse && error.status === 401) { // Проверяем тип необходимой ошибки
            return this.authService.refreshToken().pipe( // Вызываем некую функцию по обновлению токена
              switchMap(() => {
                const request = req.clone({
                  headers: req.headers.append('Authorization', `Bearer ${this.authService.getToken().token}`)
                });
                return next.handle(request); // Заново вызываем упавший запрос с обновленным токеном
              })
            );
          }
          return throwError(error); // Пробрасываем необработанные ошибки дальше
        })
      );*/
    }
    return next.handle(req);
  }
}
