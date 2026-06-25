import { CommonModule } from '@angular/common';
import { Component, effect, inject, input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { FirestoreGame } from '../../models/firestore-game.model';
import { Game } from '../../models/game.model';
import { Round } from '../../models/round.model';
import { AppStateService } from '../../services/app-state.service';
import { FirestoreGameService } from '../../services/firestore-game.service';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';
import { GameThrowsComponent } from '../game-throws/game-throws.component';
import { RoundComponent } from '../round/round.component';
import { ScoreboardComponent } from '../scoreboard/scoreboard.component';

@Component({
    selector: 'ch-live-games',
    templateUrl: './live-games.component.html',
    styleUrls: ['./live-games.component.scss'],
    standalone: true,
    imports: [
        CommonModule,
        GameThrowsComponent,
        RoundComponent,
        ScoreboardComponent]
})
export class LiveGamesComponent {
    private readonly firestoreGameService = inject(FirestoreGameService);
    private readonly appStateService = inject(AppStateService);
    private readonly dialog = inject(MatDialog);
    private readonly router = inject(Router);
    private liveGamesSubscription: Subscription | null = null;

    eventId = input<number | null>(null);
    pageTitle = 'Live Games';
    games: Game[] = [];
    isLoading = true;
    errorMessage: string | null = null;

    constructor() {
        effect(() => {
            this.subscribeToGames(this.eventId());
        });
    }

    ngOnDestroy(): void {
        this.liveGamesSubscription?.unsubscribe();
        this.liveGamesSubscription = null;
    }

    private subscribeToGames(eventId: number | null): void {
        this.liveGamesSubscription?.unsubscribe();
        this.liveGamesSubscription = null;
        this.isLoading = true;

        const games$ = eventId == null
            ? this.firestoreGameService.observeGames()
            : this.firestoreGameService.observeGamesByEventId(eventId);

        try {
            this.liveGamesSubscription = games$.subscribe({
                next: games => {
                    this.games = games;
                    this.isLoading = false;
                    this.errorMessage = null;
                },
                error: error => {
                    this.errorMessage = error instanceof Error ? error.message : 'Failed to load live games';
                    this.isLoading = false;
                }
            });
        } catch (error) {
            this.errorMessage = error instanceof Error ? error.message : 'Failed to load live games';
            this.isLoading = false;
        }
    }

    getActiveRound(game: Game): Round | null {
        if (!game.rounds?.length) {
            return null;
        }

        return game.rounds[game.rounds.length - 1] ?? null;
    }

    loadGame(game: FirestoreGame): void {
        this.appStateService.firestoreGameId.set(game.docId);
        this.appStateService.game.set(game);
        this.router.navigate(['score-keeper']);
    }

    async deleteGame(game: FirestoreGame): Promise<void> {
        if (!game.docId) {
            this.errorMessage = 'Cannot delete game without a valid identifier';
            return;
        }

        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
            data: {
                title: 'Delete Game',
                message: 'Are you sure you want to delete this game? This action cannot be undone.',
                confirmText: 'Delete',
                cancelText: 'Cancel'
            }
        });

        const confirmed = await dialogRef.afterClosed().toPromise();
        if (!confirmed) {
            return;
        }

        this.errorMessage = null;

        try {
            await this.firestoreGameService.deleteGame(game.docId);
        } catch (error) {
            this.errorMessage = error instanceof Error ? error.message : 'Failed to delete game';
        }
    }
}
