import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { firstValueFrom } from 'rxjs';

import { Player } from '../../models/player.model';
import { PlayerService } from '../../services/player.service';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { PlayerDialogComponent } from '../player-dialog/player-dialog.component';

@Component({
    selector: 'ch-players',
    templateUrl: './players.component.html',
    styleUrls: ['./players.component.scss'],
    standalone: true,
    imports: [
        CommonModule,
        MatButtonModule
    ]
})
export class PlayersComponent implements OnInit {
    players: Player[] = [];
    isLoading = true;
    deletingPlayerId: number | null = null;
    errorMessage: string | null = null;
    successMessage: string | null = null;

    selectedPlayerId: number | null = null;

    private readonly playerService = inject(PlayerService);
    private readonly dialog = inject(MatDialog);

    async ngOnInit(): Promise<void> {
        await this.loadPlayers();
    }

    async openAddPlayerDialog(): Promise<void> {
        this.errorMessage = null;
        this.successMessage = null;

        const dialogRef = this.dialog.open(PlayerDialogComponent, {
            disableClose: true,
            width: '28rem',
            maxWidth: '95vw',
            data: {
                mode: 'add'
            }
        });

        const saved = await firstValueFrom(dialogRef.afterClosed());
        if (!saved) {
            return;
        }

        await this.loadPlayers(false);
        this.successMessage = 'Player added.';
    }

    async editPlayer(player: Player): Promise<void> {
        this.selectedPlayerId = player.id;
        this.errorMessage = null;
        this.successMessage = null;

        const dialogRef = this.dialog.open(PlayerDialogComponent, {
            width: '28rem',
            maxWidth: '95vw',
            data: {
                mode: 'edit',
                player
            }
        });

        const saved = await firstValueFrom(dialogRef.afterClosed());
        if (!saved) {
            return;
        }

        await this.loadPlayers(false);
        this.successMessage = 'Player saved.';
    }

    async deletePlayer(player: Player): Promise<void> {
        if (!player.id) {
            this.errorMessage = 'Player id is missing.';
            return;
        }

        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
            data: {
                title: 'Delete Player',
                message: 'Are you sure you want to delete this player? This action cannot be undone.',
                confirmText: 'Delete',
                cancelText: 'Cancel'
            }
        });

        const confirmed = await firstValueFrom(dialogRef.afterClosed());
        if (!confirmed) {
            return;
        }

        this.errorMessage = null;
        this.successMessage = null;
        this.deletingPlayerId = player.id;

        try {
            await this.playerService.deletePlayer(player.id);
            this.players = this.players.filter(x => x.id !== player.id);

            if (this.selectedPlayerId === player.id) {
                this.selectedPlayerId = null;
            }

            this.successMessage = 'Player deleted.';
        } catch (error) {
            this.errorMessage = error instanceof Error ? error.message : 'Failed to delete player';
        } finally {
            this.deletingPlayerId = null;
        }
    }

    private async loadPlayers(setLoadingState: boolean = true): Promise<void> {
        if (setLoadingState) {
            this.isLoading = true;
        }

        this.errorMessage = null;

        try {
            this.players = await firstValueFrom(this.playerService.getPlayers());

            if (this.selectedPlayerId && !this.players.some(player => player.id === this.selectedPlayerId)) {
                this.selectedPlayerId = null;
            }
        } catch (error) {
            this.errorMessage = error instanceof Error ? error.message : 'Failed to load players';
        } finally {
            if (setLoadingState) {
                this.isLoading = false;
            }
        }
    }

}
