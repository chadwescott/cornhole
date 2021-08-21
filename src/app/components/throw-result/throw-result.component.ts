import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatButtonToggleChange } from '@angular/material/button-toggle';
import { GameConstants } from 'src/app/constants/game.constants';
import { Throw } from 'src/app/models/throw';
import { ThrowResult } from 'src/app/models/throw-result';


@Component({
  selector: 'ch-throw-result',
  templateUrl: './throw-result.component.html',
  styleUrls: ['./throw-result.component.scss']
})
export class ThrowResultComponent implements OnInit {
  @Input()
  disabled = false;

  @Input()
  teamNumber: number;

  @Input()
  throw: Throw;

  @Output()
  throwResultChanged = new EventEmitter<Throw>();

  throwResult = ThrowResult;

  constructor() { }

  ngOnInit(): void {
  }

  onThrowResult(event: MatButtonToggleChange): void {
    this.throw.result = event.value;
    this.throw.points = GameConstants.POINTS[event.value];
    this.throwResultChanged.emit(this.throw);
  }
}
