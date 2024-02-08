import {
  ActivatedRouteSnapshot,
  CanActivateChildFn,
  CanActivateFn,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { AuthService } from '../servicios/auth.service';
import { Injectable, inject } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
@Injectable({
  providedIn: 'root',
})
class PermissionsService {
  constructor(private router: Router, private authService: AuthService) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    if (this.authService.getToken() !== null) {
      const dataDecode: any = this.decodeToken();
      const date = new Date();
      // Comprobar que no esta caducado el token
      if (dataDecode.exp < date.getTime() / 1000) {
        return this.redirect();
      }
      return true;
    }
    return this.redirect();
    /* if (this.authService.loggedIn()) {
    return true;
  }
  this.router.navigate(['/login']);
  return false; */
  }
  redirect() {
    this.router.navigate(['/auth']);
    return false;
  }
  decodeToken() {
    return jwtDecode(`${this.authService.getToken()}`);
  }
}

export const adminGuard: CanActivateChildFn = (next, state) => {
  return inject(PermissionsService).canActivate(next, state);
};
