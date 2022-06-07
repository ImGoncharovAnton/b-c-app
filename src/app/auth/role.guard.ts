import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {map, Observable, take} from 'rxjs';
import {AuthService} from "../shared/service/auth.service";

@Injectable({
  providedIn: 'root'
})
export class RoleGuard implements CanActivate {

  constructor(private authService: AuthService,
              private router: Router) {

  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot):
    Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return this.authService.userSub$.pipe(
      take(1),
      map(user => {
        if (user.role === 'Immortal') {
          return true
        } else {
          alert('Access is denied! We need an admin role')
        }
        return this.router.createUrlTree(['/auth'])
      })
    )
  }

  // private isAuthorized(route: ActivatedRouteSnapshot): boolean {
  //   const roles = ['Admin', 'Manager']
  //   const expectedRoles = route.data.expectedRoles
  //   const roleMatches = roles.findIndex(role => expectedRoles.indexOf(role) !== -1)
  //   return (roleMatches < 0) ? false : true
  // }
}
