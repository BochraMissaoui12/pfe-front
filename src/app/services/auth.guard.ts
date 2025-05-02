import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
  Router,
} from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    const token = localStorage.getItem('token');
    if (!token) {
      this.router.navigate(['/']);
      return false;
    }

    const payload = token.split('.')[1];
    const decodedPayload = JSON.parse(atob(payload));
    const userRole = decodedPayload.role || decodedPayload.authorities;

    const allowedRoles = route.data['roles'] as Array<string>;

    if (allowedRoles && allowedRoles.length > 0) {
      const hasAccess = allowedRoles.some((role) => userRole.includes(role));
      if (!hasAccess) {
        this.router.navigate(['/']);
        return false;
      }
    }

    return true;
  }
}
