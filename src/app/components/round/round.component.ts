import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Round } from 'src/app/models/round';
import { Throw } from 'src/app/models/throw';

@Component({
  selector: 'ch-round',
  templateUrl: './round.component.html',
  styleUrls: ['./round.component.scss']
})
export class RoundComponent implements OnInit {
  @Input()
  round: Round;

  @Output()
  roundScoreChanged = new EventEmitter<Round>();

  constructor() { }

  ngOnInit(): void {
  }

  onThrowResultChanged(target: Throw): void {
    // let team1Score = 0;
    // this.round.team1Throws.map(x => team1Score += x.points);
    // this.round.team1TotalScore = team1Score;

    // let team2Score = 0;
    // this.round.team2Throws.map(x => team2Score += x.points);
    // this.round.team2TotalScore = team2Score;

    // this.round.team1NetScore = Math.max(this.round.team1TotalScore - this.round.team2TotalScore, 0);
    // this.round.team2NetScore = Math.max(this.round.team2TotalScore - this.round.team1TotalScore, 0);

    // this.round.complete = !this.round.team1Throws.find(x => !x.result) && !this.round.team2Throws.find(x => !x.result);

    this.roundScoreChanged.emit(this.round);
  }
}
