import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Game } from 'src/app/models/game';
import { Team } from 'src/app/models/team';
import { TeamColor } from 'src/app/models/team-color';

import { TeamColorPickerDialogComponent } from '../team-color-picker-dialog/team-color-picker-dialog.component';

@Component({
  selector: 'ch-game-options',
  templateUrl: './game-options.component.html',
  styleUrls: ['./game-options.component.scss']
})
export class GameOptionsComponent implements OnInit {
  @Input() game: Game;

  @Output()
  teamColorChanged = new EventEmitter<Team>();

  @Output()
  resetStreak = new EventEmitter<Game>();

  @Output()
  resetGame = new EventEmitter<Game>();

  @Output()
  closeOptions = new EventEmitter();

  constructor(private dialog: MatDialog) { }

  ngOnInit(): void {
  }

  pickTeamColor(team: Team): void {
    const dialogRef = this.dialog.open(TeamColorPickerDialogComponent, {
      height: '15rem',
      width: '15rem',
      data: { teamColor: team.teamColor }
    });
    dialogRef.afterClosed().subscribe((res: TeamColor) => {
      if (res) {
        team.teamColor = res;
        this.teamColorChanged.emit(team);
      }
    });
  }
}
