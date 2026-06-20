import { Component, input } from '@angular/core';

@Component({
  selector: 'ch-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
  standalone: true,
})
export class CardComponent {
  title = input.required<string>();
}
