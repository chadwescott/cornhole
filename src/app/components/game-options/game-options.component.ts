import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';

import { MatRadioChange, MatRadioModule } from '@angular/material/radio';
import { DesignOptions } from '../../models/design-options.enum';
import { Game } from '../../models/game.model';
import { PlayerStats } from '../../models/player-stats.model';
import { Player } from '../../models/player.model';
import { TeamColor } from '../../models/team-color.model';
import { Team } from '../../models/team.model';
import { AppStateService } from '../../services/app-state.service';
import { CardComponent } from '../card/card.component';
import { TeamColorPickerDialogComponent } from '../team-color-picker-dialog/team-color-picker-dialog.component';

@Component({
  selector: 'ch-game-options',
  templateUrl: './game-options.component.html',
  styleUrls: ['./game-options.component.scss'],
  standalone: true,
  imports: [
    CardComponent,
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatSelectModule,
    MatRadioModule
  ]
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

  readonly appStateService = inject(AppStateService);

  constructor(private dialog: MatDialog) { }

  ngOnInit(): void {
  }

  teamPlayersChanged(change: MatRadioChange): void {
    if (change.value === '1' && this.game().team1.players.length === 2) {
      this.game().team1.players.pop();
      this.game().team2.players.pop();
    }
    else if (change.value === '2' && this.game().team1.players.length === 1) {
      this.game().team1.players.push({ firstName: 'Player 3', lastName: '', stats: {} as PlayerStats, imagePath: null } as Player);
      this.game().team2.players.push({ firstName: 'Player 4', lastName: '', stats: {} as PlayerStats, imagePath: null } as Player);
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

  playerLabel(player: Player): string {
    return `${player.firstName} ${player.lastName}`.trim();
  }

  setTeamPlayer(targetPlayer: Player, playerId: string | null): void {
    const selected = this.appStateService.players().find(x => x.id === playerId);
    if (!selected) {
      return;
    }

    targetPlayer.id = selected.id;
    targetPlayer.firstName = selected.firstName;
    targetPlayer.lastName = selected.lastName;
    targetPlayer.imagePath = selected.imagePath;
    this.playersChanged.emit();
  }
}
