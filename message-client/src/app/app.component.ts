import { Component, OnInit } from '@angular/core';

import * as openpgp from './shared/openpgp';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'message-client';
}
