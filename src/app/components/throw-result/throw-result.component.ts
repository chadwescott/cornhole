import { Component, EventEmitter, input, OnInit, Output } from '@angular/core';
import { MatButtonToggleChange, MatButtonToggleModule } from '@angular/material/button-toggle';
import { GameConstants } from '../../constants/game.constants';
import { DesignOptions } from '../../models/design-options.enum';
import { TeamColor } from '../../models/team-color';
import { Throw } from '../../models/throw';
import { ThrowResult } from '../../models/throw-result';


@Component({
  selector: 'ch-throw-result',
  templateUrl: './throw-result.component.html',
  styleUrls: ['./throw-result.component.scss'],
  standalone: true,
  imports: [MatButtonToggleModule]
})
export class ThrowResultComponent implements OnInit {
  disabled = input<boolean>(false);

  teamNumber = input.required<number>();
  teamColor = input.required<TeamColor>();
  throw = input.required<Throw>();

  @Output()
  throwResultChanged = new EventEmitter<Throw>();

  designOptions = DesignOptions;
  throwResult = ThrowResult;

  constructor() { }

  ngOnInit(): void {
  }

  onThrowResult(event: MatButtonToggleChange): void {
    this.throw().result = this.throw().result === event.value ? null : event.value;
    this.throw().points = GameConstants.POINTS[this.throw().result ?? ThrowResult.OffBoard] ?? 0;
    this.throwResultChanged.emit(this.throw());
  }
}
