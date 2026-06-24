import { Component, inject, OnInit } from '@angular/core';

import { TEAM_COLORS } from '../../constants/team-color.constants';
import { Game } from '../../models/game.model';
import { Round } from '../../models/round.model';
import { Team } from '../../models/team.model';
import { FirestoreGameService } from '../../services/firestore-game.service';
import { GameService } from '../../services/game.service';
import { GameComponent } from '../game/game.component';

@Component({
    selector: 'ch-score-keeper',
    templateUrl: './score-keeper.component.html',
    styleUrls: ['./score-keeper.component.scss'],
    standalone: true,
    imports: [
        GameComponent
    ]
})
export class ScoreKeeperComponent implements OnInit {
    game: Game | null = null;
    activeRound: Round | null = null;
    private firestoreGameId: string | null = null;
    private firestoreSyncQueue: Promise<void> = Promise.resolve();
    private readonly firestoreGameIdKey = 'ACTIVE_FIRESTORE_GAME_ID';

    private readonly gameService = inject(GameService);
    private readonly firestoreGameService = inject(FirestoreGameService);

    async ngOnInit(): Promise<void> {
        this.firestoreGameId = localStorage.getItem(this.firestoreGameIdKey);

        this.game = this.gameService.getGames()?.find(x => !x.complete) || null;
        if (this.game) {
            this.gameService.loadGame(this.game);
            await this.activateLastRound(this.game);
        } else {
            await this.createNewGame();
        }
        console.log(this.game);
    }

    async createNewGame(): Promise<void> {
        this.gameService.clearData();
        const team1 = this.gameService.createTeam([], 1, TEAM_COLORS[0]);
        const team2 = this.gameService.createTeam([], 2, TEAM_COLORS[2]);
        this.game = this.gameService.createGame(team1, team2);
        this.firestoreGameId = null;
        localStorage.removeItem(this.firestoreGameIdKey);
        await this.activateLastRound(this.game);
        await this.syncGameToFirestore(this.game);
    }

    onRoundChanged(round: Round): void {
        this.activeRound = round;
    }

    async onCompleteRound(game: Game): Promise<void> {
        this.gameService.completeRound(game);
        await this.activateLastRound(game);
    }

    onGameSummary(game: Game): void {
        this.gameService.completeRound(game);
    }

    async activateLastRound(game: Game): Promise<void> {
        this.activeRound = game.rounds ? game.rounds[game.rounds.length - 1] : null;

        // Persist the newly active round state in Firestore.
        await this.syncGameToFirestore(game);
    }

    async onRoundScoreChanged(round: Round): Promise<void> {
        this.gameService.roundScoreChanged(round);

        if (this.game) {
            await this.syncGameToFirestore(this.game);
        }
    }

    onTeamColorChanged(team: Team): void {
        this.gameService.updateTeamColor(team);
    }

    onPlayersChanged(): void {
        this.gameService.saveGames();
    }

    async onCompleteGame(game: Game): Promise<void> {
        await this.deleteActiveFirestoreGame();
        this.game = null;
        await this.gameService.completeGame(game);
        this.game = this.gameService.createGame(game.team1, game.team2, game.event_id);
        this.firestoreGameId = null;
        localStorage.removeItem(this.firestoreGameIdKey);
        await this.activateLastRound(this.game);
    }

    onResetStreak(game: Game): void {
        this.gameService.resetStreak(game);
    }

    onResetGame(game: Game): void {
        this.game = this.gameService.resetGame(game);
        if (this.game) {
            void this.activateLastRound(this.game);
        }
    }

    private async syncGameToFirestore(game: Game): Promise<void> {
        this.firestoreSyncQueue = this.firestoreSyncQueue.then(async () => {
            if (!this.firestoreGameId) {
                this.firestoreGameId = await this.firestoreGameService.createGame(game);
                localStorage.setItem(this.firestoreGameIdKey, this.firestoreGameId);
                return;
            }

            this.firestoreGameId = await this.firestoreGameService.updateGame(this.firestoreGameId, game);
            localStorage.setItem(this.firestoreGameIdKey, this.firestoreGameId);
        }).catch(error => {
            console.error('Error syncing game to Firestore:', error);
        });

        await this.firestoreSyncQueue;
    }

    private async deleteActiveFirestoreGame(): Promise<void> {
        this.firestoreSyncQueue = this.firestoreSyncQueue.then(async () => {
            if (!this.firestoreGameId) {
                return;
            }

            await this.firestoreGameService.deleteGame(this.firestoreGameId);
            this.firestoreGameId = null;
            localStorage.removeItem(this.firestoreGameIdKey);
        }).catch(error => {
            console.error('Error deleting active Firestore game:', error);
        });

        await this.firestoreSyncQueue;
    }
}
