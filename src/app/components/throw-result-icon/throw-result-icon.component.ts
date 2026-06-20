import { Component, input } from '@angular/core';
import { ThrowResult } from '../../models/throw-result.model';
import { Throw } from '../../models/throw.model';

@Component({
  selector: 'ch-throw-result-icon',
  templateUrl: './throw-result-icon.component.html',
  styleUrls: ['./throw-result-icon.component.scss'],
  standalone: true
})
export class ThrowResultIconComponent {
  throw = input.required<Throw>();

  iconClass: Record<ThrowResult, string> = {
    [ThrowResult.OffBoard]: 'fa-times',
    [ThrowResult.OnBoard]: 'fa-square',
    [ThrowResult.Cornhole]: 'fa-circle'
  };
}
