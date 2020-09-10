import { animate, animation, keyframes, style, transition, trigger } from '@angular/animations';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Round } from 'src/app/models/round';

@Component({
  selector: 'ch-round',
  templateUrl: './round.component.html',
  styleUrls: ['./round.component.scss'],
  animations: [
    trigger('scoreChanged', [
      transition('* => *', [
        animation([
          style({ transform: 'scale(1)' }),
          animate('0.5s', keyframes([
            style({ transform: 'scale(1.5)', offset: 0.50 }),
            style({ transform: 'scale(1)', offset: 1 })
          ]))
        ])
      ])
    ])
  ]
})
export class RoundComponent implements OnInit {
  @Input()
  disabled = false;

  @Input()
  round: Round;

  @Output()
  roundScoreChanged = new EventEmitter<Round>();

  constructor() { }

  ngOnInit(): void {
  }
}
