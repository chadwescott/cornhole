import { Component, EventEmitter, input, OnInit, Output } from '@angular/core';
import { TeamColor } from '../../models/team-color';
import { Throw } from '../../models/throw';

@Component({
  selector: 'ch-round-throws',
  templateUrl: './round-throws.component.html',
  styleUrls: ['./round-throws.component.scss'],
  standalone: false
})
export class RoundThrowsComponent implements OnInit {
  disabled = input<boolean>(false);
  teamNumber = input.required<number>();
  teamColor = input.required<TeamColor>();
  throws = input.required<Throw[]>();

  @Output()
  throwResultChanged = new EventEmitter<Throw>();

  ngOnInit(): void {
  }
}
