import { Component, input } from '@angular/core';
import { Throw } from '../../models/throw';
import { ThrowResult } from '../../models/throw-result';

@Component({
  selector: 'ch-throw-result-icon',
  templateUrl: './throw-result-icon.component.html',
  styleUrls: ['./throw-result-icon.component.scss'],
  standalone: false
})
export class ThrowResultIconComponent {
  throw = input.required<Throw>();

  iconClass: Record<ThrowResult, string> = {
    [ThrowResult.OffBoard]: 'fa-times',
    [ThrowResult.OnBoard]: 'fa-square',
    [ThrowResult.Cornhole]: 'fa-circle'
  };
}
