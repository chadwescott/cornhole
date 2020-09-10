import { Component, Input, OnInit } from '@angular/core';
import { Throw } from 'src/app/models/throw';
import { ThrowResult } from 'src/app/models/throw-result';

@Component({
  selector: 'ch-throw-result-icon',
  templateUrl: './throw-result-icon.component.html',
  styleUrls: ['./throw-result-icon.component.scss']
})
export class ThrowResultIconComponent implements OnInit {
  @Input()
  throw: Throw;

  iconClass = {};

  constructor() {
    this.iconClass[ThrowResult.OffBoard] = 'fa-times';
    this.iconClass[ThrowResult.OnBoard] = 'fa-square';
    this.iconClass[ThrowResult.Cornhole] = 'fa-circle';
  }

  ngOnInit(): void {
  }

}
