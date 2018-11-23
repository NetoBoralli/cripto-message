import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';

@Injectable()
export class AuthService implements CanActivate {
  constructor(private router: Router) { }

  canActivate() {
    if (localStorage.getItem('crypto.currentUser')) {
      return true;
    }

    this.router.navigate(['login']);
    return false;
  }
}

@Injectable()
export class AuthLoginService implements CanActivate {
  constructor(private router: Router) { }

  canActivate() {
    if (localStorage.getItem('crypto.currentUser')) {
      this.router.navigate(['/users']);
      return false;
    }
    return true;
  }
}
