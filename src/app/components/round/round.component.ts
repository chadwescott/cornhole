import { Component, Input, OnInit } from '@angular/core';
import { Round } from 'src/app/models/round';

@Component({
  selector: 'ch-round',
  templateUrl: './round.component.html',
  styleUrls: ['./round.component.scss']
})
export class RoundComponent implements OnInit {
  @Input()
  round: Round;

  constructor() { }

  ngOnInit(): void {
  }

}
