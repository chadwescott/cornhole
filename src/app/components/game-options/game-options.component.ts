import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Game } from 'src/app/models/game';
import { Team } from 'src/app/models/team';
import { TeamColor } from 'src/app/models/team-color';

import { MatRadioChange } from '@angular/material/radio';
import { DesignOptions } from 'src/app/models/design-options.enum';
import { Player } from 'src/app/models/player';
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
  resetStats = new EventEmitter<Game>();

  @Output()
  resetGame = new EventEmitter<Game>();

  @Output()
  closeOptions = new EventEmitter();

  @Output()
  playersChanged = new EventEmitter();

  designOptions = DesignOptions;

  constructor(private dialog: MatDialog) { }

  ngOnInit(): void {
  }

  teamPlayersChanged(change: MatRadioChange): void {
    if (change.value === '1' && this.game.team1.players.length === 2) {
      this.game.team1.players.pop();
      this.game.team2.players.pop();
    }
    else if (change.value === '2' && this.game.team1.players.length === 1) {
      this.game.team1.players.push(new Player('Player 3'));
      this.game.team2.players.push(new Player('Player 4'));
    }

    this.playersChanged.emit();
  }

  pickTeamColor(team: Team): void {
    const dialogRef = this.dialog.open(TeamColorPickerDialogComponent, {
      height: '22rem',
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
