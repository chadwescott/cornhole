import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { AppDataService } from './services/app-data.service';

@Component({
  selector: 'ch-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [
    RouterOutlet
  ]
})
export class AppComponent {
  readonly appDataService = inject(AppDataService);
}
