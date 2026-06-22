import { Component, inject, OnInit } from '@angular/core';

import { TEAM_COLORS } from '../../constants/team-color.constants';
import { Game } from '../../models/game.model';
import { Round } from '../../models/round.model';
import { Team } from '../../models/team.model';
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

    private readonly gameService = inject(GameService);

    async ngOnInit(): Promise<void> {
        this.game = this.gameService.getGames()?.find(x => !x.complete) || null;
        if (this.game) {
            this.gameService.loadGame(this.game);
            this.activeRound = this.game.rounds[this.game.rounds.length - 1] || null;
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
        this.activateLastRound(this.game);
    }

    onRoundChanged(round: Round): void {
        this.activeRound = round;
    }

    onCompleteRound(game: Game): void {
        this.gameService.completeRound(game);
        this.activateLastRound(game);
    }

    onGameSummary(game: Game): void {
        this.gameService.completeRound(game);
    }

    activateLastRound(game: Game): void {
        this.activeRound = game.rounds ? game.rounds[game.rounds.length - 1] : null;
    }

    onRoundScoreChanged(round: Round): void {
        this.gameService.roundScoreChanged(round);
    }

    onTeamColorChanged(team: Team): void {
        this.gameService.updateTeamColor(team);
    }

    onPlayersChanged(): void {
        this.gameService.saveGames();
    }

    async onCompleteGame(game: Game): Promise<void> {
        this.game = null;
        await this.gameService.completeGame(game);
        this.game = this.gameService.createGame(game.team1, game.team2);
        this.activateLastRound(this.game);
    }

    onResetStreak(game: Game): void {
        this.gameService.resetStreak(game);
    }

    onResetGame(game: Game): void {
        this.game = this.gameService.resetGame(game);
        this.activateLastRound(this.game);
    }
}
