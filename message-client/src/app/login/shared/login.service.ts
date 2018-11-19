import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(
    private http: HttpClient
  ) { }

  login(email: string, password: string): Observable<any> {
    const url = `http://localhost:44331/api/users/login`;
    const body = { email: email, password: password };
    return this.http.post<any>(url, body);
  }
}
