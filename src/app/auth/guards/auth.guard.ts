import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router, ActivatedRoute } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { AuthService } from '../auth.service';
import { isSet } from 'src/app/core/base/base.component';


@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {


  constructor(private route: ActivatedRoute, private router: Router, private authService: AuthService) {

  }
  authData = JSON.parse(localStorage.getItem('userAuth'))
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean {

    if (isSet(this.authData)) {
      return true;
    } else {
      this.router.navigateByUrl('/login');
      return false;
    }

  }
}
