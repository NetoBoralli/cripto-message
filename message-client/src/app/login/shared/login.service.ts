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
    const url = `http://localhost:62910/api/users/login`;
    const body = { email: email, password: password };
    return this.http.post<any>(url, body);
  }

  signup(name: string, email: string, password: string): Observable<any> {
    const url = `http://localhost:62910/api/users/signup`;
    const body = { username: name, email: email, password: password };
    return this.http.post<any>(url, body);
  }

  setPublicKey(identifier: string, publicKey: string): Observable<any> {
    const url = `http://localhost:62910/api/users/publicKey/${identifier}`;
    const body = { publicKey: publicKey };
    return this.http.put<any>(url, body);
  }

  setPrivateKey(identifier: string, privateKey: string): Observable<any> {
    const url = `http://localhost:62910/api/users/privateKey/${identifier}`;
    const body = { privateKey: privateKey };
    return this.http.put<any>(url, body);
  }

  getPrivateKey(identifier: string): Observable<any> {
    const url = `http://localhost:62910/api/users/privateKey/${identifier}`;
    return this.http.get<any>(url);
  }

  getUsers(identifier?: string): Observable<any> {
    const url = `http://localhost:62910/api/users/${identifier ? identifier : ''}`;
    return this.http.get<any>(url);
  }
}
