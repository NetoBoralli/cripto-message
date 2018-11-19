import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';

import { Subscription } from 'rxjs';

import { LoginService } from './shared/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  subscription: Subscription;

  form: FormGroup;

  constructor(
    private loginService: LoginService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    this.form = new FormGroup({
      email: new FormControl(null, Validators.required),
      password: new FormControl(null, Validators.required),
    });
  }

  ngOnInit() {
  }

  login() {
    const fData = this.form.value;
    if (!fData.password || !fData.email)
      return null;

    this.subscription = this.loginService.login(fData.email, fData.password).subscribe(data => {
      const user = data;
      this.router.navigate(['messages']);
    }, error => {
      if (error.status === 401) {
        this.snackBar.open('Erro no login!', '', { duration: 2000 });
      }
    });
  }

}
