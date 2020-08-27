import { Component, Input, OnInit } from '@angular/core';
import { Throw } from 'src/app/models/throw';

@Component({
  selector: 'ch-round-throws',
  templateUrl: './round-throws.component.html',
  styleUrls: ['./round-throws.component.scss']
})
export class RoundThrowsComponent implements OnInit {
  @Input()
  throws: Throw[];

  constructor() { }

  ngOnInit(): void {
  }

  onThrowResult(target: Throw): void {
    console.log(target);
  }

}
