import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';


import { LoginComponent } from './login.component';
import { LoginService } from './shared/login.service';
import { MaterialModule } from '../material/material.module';
import { SingupComponent } from './singup/singup.component';

@NgModule({
  declarations: [LoginComponent, SingupComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    MaterialModule
  ],
  exports: [
    LoginComponent,
    SingupComponent
  ],
  providers: [
    LoginService
  ]
})
export class LoginModule { }
