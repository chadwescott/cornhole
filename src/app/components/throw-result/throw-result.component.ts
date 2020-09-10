import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatButtonToggleChange } from '@angular/material/button-toggle';
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

  private throwPoints = {};

  throwResult = ThrowResult;

  constructor() {
    this.throwPoints[ThrowResult.OffBoard] = 0;
    this.throwPoints[ThrowResult.OnBoard] = 1;
    this.throwPoints[ThrowResult.Cornhole] = 3;
  }

  ngOnInit(): void {
  }

  onThrowResult(event: MatButtonToggleChange): void {
    this.throw.result = event.value;
    this.throw.points = this.throwPoints[event.value];
    this.throwResultChanged.emit(this.throw);
  }
}
