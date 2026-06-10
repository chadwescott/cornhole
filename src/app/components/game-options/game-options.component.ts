import { Component, EventEmitter, input, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { MatRadioChange } from '@angular/material/radio';
import { DesignOptions } from '../../models/design-options.enum';
import { Game } from '../../models/game';
import { Player } from '../../models/player';
import { Team } from '../../models/team';
import { TeamColor } from '../../models/team-color';
import { TeamColorPickerDialogComponent } from '../team-color-picker-dialog/team-color-picker-dialog.component';

@Component({
  selector: 'ch-game-options',
  templateUrl: './game-options.component.html',
  styleUrls: ['./game-options.component.scss'],
  standalone: false
})
export class GameOptionsComponent implements OnInit {
  game = input.required<Game>();

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
    if (change.value === '1' && this.game().team1.players.length === 2) {
      this.game().team1.players.pop();
      this.game().team2.players.pop();
    }
    else if (change.value === '2' && this.game().team1.players.length === 1) {
      this.game().team1.players.push(new Player('Player 3'));
      this.game().team2.players.push(new Player('Player 4'));
    }

    this.playersChanged.emit();
  }

  pickTeamColor(team: Team): void {
    const dialogRef = this.dialog.open(TeamColorPickerDialogComponent, {
      disableClose: true,
      data: { teamColor: team.teamColor }
    });
    dialogRef.afterClosed().subscribe((res: TeamColor) => {
      if (res) {
        team.teamColor = res;
        this.teamColorChanged.emit(team);
      }
    });
  }

  swapPlayers(team: Team): void {
    if (team.players.length < 2) { return; }

    const playerHold = team.players[0];

    team.players[0] = team.players[1];
    team.players[1] = playerHold;

    const statsHold = team.players[0].stats;

    team.players[0].stats = team.players[1].stats;
    team.players[1].stats = statsHold;
  }
}
