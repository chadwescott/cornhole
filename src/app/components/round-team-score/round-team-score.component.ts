import { transition, trigger, useAnimation } from '@angular/animations';
import { Component, Input, OnInit } from '@angular/core';

import { SCORE_CHANGED_ANIMATION } from '../../constants/animations';

@Component({
  selector: 'ch-round-team-score',
  templateUrl: './round-team-score.component.html',
  styleUrls: ['./round-team-score.component.scss'],
  animations: [
    trigger('scoreChanged', [
      transition('* => *', [
        useAnimation(SCORE_CHANGED_ANIMATION)
      ])
    ])
  ]
})
export class RoundTeamScoreComponent implements OnInit {
  @Input()
  totalScore: number;

  @Input()
  netScore: number;

  constructor() { }

  ngOnInit(): void {
  }

}
