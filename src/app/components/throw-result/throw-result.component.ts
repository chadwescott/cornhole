import { Component, Input, OnInit } from '@angular/core';
import { Throw } from 'src/app/models/throw';

@Component({
  selector: 'ch-throw-result',
  templateUrl: './throw-result.component.html',
  styleUrls: ['./throw-result.component.scss']
})
export class ThrowResultComponent implements OnInit {
  @Input()
  throw: Throw;

  constructor() { }

  ngOnInit(): void {
  }

}
