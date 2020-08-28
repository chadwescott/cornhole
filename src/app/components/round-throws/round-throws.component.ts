import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Throw } from 'src/app/models/throw';

@Component({
  selector: 'ch-round-throws',
  templateUrl: './round-throws.component.html',
  styleUrls: ['./round-throws.component.scss']
})
export class RoundThrowsComponent implements OnInit {
  @Input()
  throws: Throw[];

  @Output()
  throwResultChanged = new EventEmitter<Throw>();

  constructor() { }

  ngOnInit(): void {
  }

  onThrowResultChanged(target: Throw): void {
    this.throwResultChanged.emit(target);
  }

}
