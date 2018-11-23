import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsersComponent } from './users/users.component';
import { ChatsComponent } from './chats/chats.component';
import { MaterialModule } from '../material/material.module';
import { HttpModule } from '@angular/http';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [UsersComponent, ChatsComponent],
  imports: [
    CommonModule,
    MaterialModule,
    HttpModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [
    UsersComponent,
    ChatsComponent
  ]
})
export class MessagesModule { }
