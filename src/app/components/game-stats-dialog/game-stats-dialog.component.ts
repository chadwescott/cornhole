import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';

import { Game } from '../../models/game.model';
import { FullScoreboardComponent } from '../full-scoreboard/full-scoreboard.component';

export interface GameStatsDialogData {
    game: Game;
}

@Component({
    selector: 'ch-game-stats-dialog',
    templateUrl: './game-stats-dialog.component.html',
    styleUrls: ['./game-stats-dialog.component.scss'],
    standalone: true,
    imports: [
        MatDialogModule,
        FullScoreboardComponent
    ]
})
export class GameStatsDialogComponent {
    data = inject<GameStatsDialogData>(MAT_DIALOG_DATA);
    private readonly dialogRef = inject(MatDialogRef<GameStatsDialogComponent>);

    close(): void {
        this.dialogRef.close();
    }
}
