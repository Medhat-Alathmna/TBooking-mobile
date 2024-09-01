import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { isSet } from 'src/app/core/base/base.component';

@Injectable({
  providedIn: 'root'
})
export class GuestGuard implements CanActivate {

  constructor(private router: Router,private authService: AuthService) {
  }
  authData = JSON.parse(localStorage.getItem('userAuth'))
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {

    if (isSet(this.authData)) {
      this.router.navigateByUrl('/login');
      return false;
    }
    return true;
  }
}
