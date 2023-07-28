import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { TeamColor } from 'src/app/models/team-color';
import { Throw } from 'src/app/models/throw';

@Component({
  selector: 'ch-round-throws',
  templateUrl: './round-throws.component.html',
  styleUrls: ['./round-throws.component.scss']
})
export class RoundThrowsComponent implements OnInit {
  @Input()
  disabled = false;

  @Input()
  teamNumber: number;

  @Input()
  teamColor: TeamColor;

  @Input()
  throws: Throw[];

  @Output()
  throwResultChanged = new EventEmitter<Throw>();

  constructor() { }

  ngOnInit(): void {
  }
}
