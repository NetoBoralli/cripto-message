import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';
import { LoginService } from '../shared/login.service';
import { MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';

@Component({
  selector: 'app-singup',
  templateUrl: './singup.component.html',
  styleUrls: ['./singup.component.scss']
})
export class SingupComponent implements OnInit {

  subscription: Subscription;

  form: FormGroup;

  constructor(
    private loginService: LoginService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {
    this.form = new FormGroup({
      name: new FormControl(null, Validators.required),
      email: new FormControl(null, Validators.required),
      password: new FormControl(null, Validators.required),
    });
  }

  ngOnInit() {
  }

  signup() {
    const fData = this.form.value;
    if (!fData.password || !fData.email || !fData.name)
      return null;

    this.subscription = this.loginService.signup(fData.name, fData.email, fData.password).subscribe(data => {
      const user = data;
      this.router.navigate(['login']);
    }, error => {
      if (error.error === 'User already exists' || error.error === 'Invalid data') {
        this.snackBar.open(error.error, '', { duration: 2000 });
        this.form.reset();
      } else {
        this.snackBar.open('Sign Up error!', '', { duration: 2000 });
      }
    });
  }

}
