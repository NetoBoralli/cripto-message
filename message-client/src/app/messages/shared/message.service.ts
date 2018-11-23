import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MessageService {

  constructor(
    private http: HttpClient
  ) { }

  getMessages(senderIdentifier: string, receiverIdentifier: string) {
    const url = 'http://localhost:62910/api/messages';
    return this.http.get<any>(url, { params: { senderIdentifier, receiverIdentifier } });
  }

  addMessage(senderId: number, receiverId: number, senderEncryptedMessage: string, receiverEncryptedMessage: string): Observable<any> {
    const url = 'http://localhost:62910/api/messages';
    const body = { senderId, receiverId, senderEncryptedMessage, receiverEncryptedMessage };
    return this.http.post<any>(url, body);
  }
}
