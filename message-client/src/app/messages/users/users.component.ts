import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatSidenav } from '@angular/material';
import { LoginService } from 'src/app/login/shared/login.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent implements OnInit {

  @ViewChild('userSidenav') userSidenav: MatSidenav;

  subscription: Subscription;

  users: any[];

  constructor(
    private route: Router,
    private loginService: LoginService
  ) { }

  ngOnInit() {
    this.getUsers();
  }

  getUsers() {
    this.subscription = this.loginService.getUsers().subscribe(data => {
      const currentUser = JSON.parse(localStorage.getItem('crypto.currentUser'));
      this.users = data.filter(d => d.identifier !== currentUser.identifier);
    });
  }

  logOut() {
    localStorage.removeItem('crypto.currentUser');
    this.route.navigate(['login']);
  }

  closeMobile() {
    const screen = document.documentElement;
    if (screen.clientWidth < 900)
      this.userSidenav.close();
  }

  swapSidenav() {
    this.userSidenav.toggle();
  }
}
