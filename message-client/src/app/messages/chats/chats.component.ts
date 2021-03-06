import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material';

import { Subscription } from 'rxjs';
import * as openpgp from './../../shared/openpgp';
import * as moment from 'moment';

import { MessageService } from '../shared/message.service';
import { LoginService } from 'src/app/login/shared/login.service';

@Component({
  selector: 'app-chats',
  templateUrl: './chats.component.html',
  styleUrls: ['./chats.component.scss']
})
export class ChatsComponent implements OnInit {

  subscribe: Subscription;
  subscribe2: Subscription;
  subscribe3: Subscription;
  subscribe4: Subscription;

  form: FormGroup;
  passwordForm: FormGroup;
  receiver = {
    identifier: null,
    id: null,
    email: null,
    publicKey: null,
    privateKey: null,
    username: null
  };
  sender = {
    identifier: null,
    id: null,
    email: null,
    publicKey: null,
    privateKey: null,
    username: null,
    password: null,
  };
  messages = [];
  password = null;

  constructor(
    private activatedRoute: ActivatedRoute,
    private loginService: LoginService,
    private messageService: MessageService,
    public snackBar: MatSnackBar
  ) {
    this.form = new FormGroup({
      message: new FormControl(null, Validators.maxLength(120))
    });

    this.passwordForm = new FormGroup({
      password: new FormControl(null)
    });
  }

  ngOnInit() {
    this.sender = JSON.parse(localStorage.getItem('crypto.currentUser'));
    this.subscribe = this.activatedRoute.params.subscribe((params: Params) => {
      this.receiver.identifier = params['identifier'];
      this.subscribe2 = this.loginService.getUsers(this.receiver.identifier).subscribe((data) => {
        if (data === undefined || data.length !== 1)
          return;
        this.receiver = data[0];
        if (this.password) {
          this.form.controls.message.enable();
          this.getMessages();
        } else {
          this.form.controls.message.disable();
          this.password = null;
        }
      });
    });
  }

  getMessages() {
    this.messageService.getMessages(this.receiver.identifier, this.sender.identifier).subscribe(data2 => {
      data2.forEach(d => {
        if (d.senderId === this.sender.id) {
          const senderEncryptedMessage = d.senderEncryptedMessage;
          return Promise.resolve()
            .then(() => {
              const privateKey = openpgp.key.readArmored(this.sender.privateKey).keys[0];

              if (privateKey.decrypt(this.password)) {
                return openpgp.decrypt({
                  privateKey: privateKey,
                  message: openpgp.message.readArmored(senderEncryptedMessage)
                });
              }
              return Promise.reject('Wrong passphrase');
            })
            .then((decryptedData) => {
              d.senderEncryptedMessage = JSON.parse(decryptedData.data);
            })
            .catch((err) => {
              console.error(err);
            });
        } else {
          const receiverEncryptedMessage = d.receiverEncryptedMessage;
          return Promise.resolve()
            .then(() => {
              const privateKey = openpgp.key.readArmored(this.sender.privateKey).keys[0];

              if (privateKey.decrypt(this.password)) {
                return openpgp.decrypt({
                  privateKey: privateKey,
                  message: openpgp.message.readArmored(receiverEncryptedMessage)
                });
              }
              return Promise.reject('Wrong passphrase');
            })
            .then((decryptedData) => {
              d.receiverEncryptedMessage = JSON.parse(decryptedData.data);
            })
            .catch((err) => {
              console.error(err);
            });
        }
      });
      this.messages = data2;
      setTimeout(() => {
        const scrollDiv = document.getElementById('message-box');
        scrollDiv.scrollTop = scrollDiv.scrollHeight;
      }, 0);
    });
  }

  sendMessage() {
    const message = this.form.get('message').value;
    let senderEncryptedMessage = '';
    let receiverEncryptedMessage = '';

    const options = {
      data: JSON.stringify(message),
      publicKeys: openpgp.key.readArmored(this.sender.publicKey).keys
    };

    const optionReceiver = {
      data: JSON.stringify(message),
      publicKeys: openpgp.key.readArmored(this.receiver.publicKey).keys
    };

    openpgp.encrypt(options)
      .then((cipherText) => {
        senderEncryptedMessage = cipherText.data;
        openpgp.encrypt(optionReceiver).then((cipherText2) => {
          receiverEncryptedMessage = cipherText2.data;
          this.subscribe3 = this.messageService
            .addMessage(this.sender.id, this.receiver.id, senderEncryptedMessage, receiverEncryptedMessage)
            .subscribe(data => {
              if (data) {
                this.form.reset();
                this.snackBar.open('Message sent!', '', { duration: 500 });
                this.getMessages();
              }
            });
        });
      });
  }

  getDate(date) {
    return moment(date).format('DD/MM/YYYY') + ' as ' + moment(date).format('HH:mm');
  }

  validatePassword() {
    const password = this.passwordForm.get('password').value;
    this.loginService.login(this.sender.email, password).subscribe(data => {
      this.password = password;
      this.form.controls.message.enable();
      this.getMessages();
    }, error => {
      this.snackBar.open('Wrong password!', '', { duration: 2000 });
    });
  }
}
