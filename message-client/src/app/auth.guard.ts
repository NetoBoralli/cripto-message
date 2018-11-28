import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';

@Injectable()
export class AuthService implements CanActivate {
  constructor(private router: Router) { }

  canActivate() {
    const token = localStorage.getItem('crypto.token');
    const helper = new JwtHelperService();
    const isExpired = helper.isTokenExpired(token);
    if (!isExpired) {
      if (localStorage.getItem('crypto.currentUser')) {
        return true;
      }
    }

    localStorage.removeItem('crypto.currentUser');
    this.router.navigate(['login']);
    return false;
  }
}

@Injectable()
export class AuthLoginService implements CanActivate {
  constructor(private router: Router) { }

  canActivate() {
    const token = localStorage.getItem('crypto.token');
    const helper = new JwtHelperService();
    const isExpired = helper.isTokenExpired(token);
    if (!isExpired) {
      if (localStorage.getItem('crypto.currentUser')) {
        this.router.navigate(['/users']);
        return false;
      }
    }

    localStorage.removeItem('crypto.currentUser');
    return true;
  }
}
