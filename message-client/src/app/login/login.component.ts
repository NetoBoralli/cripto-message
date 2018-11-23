import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';

import { Subscription } from 'rxjs';

import * as openpgp from './../shared/openpgp';

import { LoginService } from './shared/login.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  subscription: Subscription;
  subscription2: Subscription;
  subscription3: Subscription;

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
      user.password = fData.password;
      this.subscription3 = this.loginService.getPrivateKey(user.identifier).subscribe(data2 => {
        if (data2.privateKey) {
          user.privateKey = data2.privateKey;
          localStorage.setItem('crypto.currentUser', JSON.stringify(user));
          this.router.navigate(['users']);
        } else {
          this.generateKeys(user);
        }
      }, error => {
        this.generateKeys(user);
      });
    }, error => {
      if (error.error === 'User or password incorrect' || error.error === 'Invalid data') {
        this.snackBar.open(error.error, '', { duration: 2000 });
        this.form.controls.password.reset();
      } else {
        this.snackBar.open('Login error!', '', { duration: 2000 });
      }
    });
  }

  generateKeys(user) {
    const keyOptions = {
      userIds: [{ username: user.username, email: user.email }],
      numBits: 2048,
      passphrase: user.password
    };

    openpgp.generateKey(keyOptions)
      .then((key) => {
        user.publicKey = key.publicKeyArmored;
        user.privateKey = key.privateKeyArmored;
        console.log('chaves geradas');
      }).then(() => {
        localStorage.setItem('crypto.currentUser', JSON.stringify(user));
        this.router.navigate(['users']);
        this.subscription2 = this.loginService.setPublicKey(user.identifier, user.publicKey).subscribe(() => {
          console.log('chave publica salva');
        });
        this.subscription2 = this.loginService.setPrivateKey(user.identifier, user.privateKey).subscribe(() => {
          console.log('chave privada salva');
        });
      });
  }

}
