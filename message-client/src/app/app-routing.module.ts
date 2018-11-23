import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { LoginComponent } from './login/login.component';
import { SingupComponent } from './login/singup/singup.component';
import { AuthLoginService, AuthService } from './auth.guard';
import { UsersComponent } from './messages/users/users.component';
import { ChatsComponent } from './messages/chats/chats.component';
import { NotFoundComponent } from './material/not-found/not-found.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent, canActivate: [AuthLoginService] },
  { path: 'signup', component: SingupComponent, canActivate: [AuthLoginService] },

  {
    path: 'users', component: UsersComponent, canActivate: [AuthService], children: [
      { path: ':identifier', component: ChatsComponent }
    ]
  },

  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: '**', component: NotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
