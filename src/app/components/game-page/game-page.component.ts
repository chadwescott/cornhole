import { Component, inject, OnInit } from '@angular/core';

import { Game } from '../../models/game.model';
import { Round } from '../../models/round.model';
import { Team } from '../../models/team.model';
import { GameService } from '../../services/game.service';
import { PlayerService } from '../../services/player.service';
import { GameComponent } from '../game/game.component';

@Component({
    selector: 'ch-game-page',
    templateUrl: './game-page.component.html',
    styleUrls: ['./game-page.component.scss'],
    standalone: true,
    imports: [
        GameComponent
    ]
})
export class GamePageComponent implements OnInit {
    game: Game | null = null;
    activeRound: Round | null = null;

    private readonly gameService = inject(GameService);
    private readonly playerService = inject(PlayerService);

    async ngOnInit(): Promise<void> {
        // try {
        //     const player1 = await this.playerService.createPlayer('Player 1', '');
        //     console.log('ngOnInit createPlayer result', player1);
        // } catch (err) {
        //     console.error('ngOnInit createPlayer failed', err);
        // }
        this.playerService.getPlayers().subscribe(players => {
            console.log(players);
        });
        this.game = this.gameService.getGames()?.find(x => !x.complete) || null;
        if (this.game) {
            this.gameService.loadGame(this.game);
            this.activeRound = this.game.rounds[this.game.rounds.length - 1] || null;
        } else {
            this.createNewGame();
        }
    }

    async createNewGame(): Promise<void> {
        this.gameService.clearData();
        // const player1 = await this.playerService.createPlayer('Player 1', '');
        // const player2 = await this.playerService.createPlayer('Player 2', '');
        // const team1 = this.gameService.createTeam([player1], 1, TEAM_COLORS[0]);
        // const team2 = this.gameService.createTeam([player2], 2, TEAM_COLORS[2]);
        // this.game = this.gameService.createGame(team1, team2);
        // this.activateLastRound(this.game);
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

    onCompleteGame(game: Game): void {
        this.gameService.completeGame(game);
        this.game = this.gameService.createGame(game.team1, game.team2);
        this.activateLastRound(this.game);
    }

    onResetStats(game: Game): void {
        this.gameService.resetStats(game);
    }

    onResetStreak(game: Game): void {
        this.gameService.resetStreak(game);
    }

    onResetGame(game: Game): void {
        this.game = this.gameService.resetGame(game);
        this.activateLastRound(this.game);
    }
}
