import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { GameStatsDialogComponent } from '../game-stats-dialog/game-stats-dialog.component';
import { ConfirmDialogComponent } from '../confirm-dialog/confirm-dialog.component';

import { DesignOptions } from '../../models/design-options.enum';
import { Game } from '../../models/game.model';
import { PlayerStats } from '../../models/player-stats.model';
import { Player } from '../../models/player.model';
import { SupabaseGameRound } from '../../models/supabase/supabase-game-round.model';
import { SupabaseGameStats } from '../../models/supabase/supabase-game-stats.model';
import { SupabaseGame } from '../../models/supabase/supabase-game.model';
import { TeamColor } from '../../models/team-color.model';
import { Team } from '../../models/team.model';
import { ThrowResult } from '../../models/throw-result.model';
import { Throw } from '../../models/throw.model';
import { GameService } from '../../services/game.service';

@Component({
    selector: 'ch-games',
    templateUrl: './games.component.html',
    styleUrls: ['./games.component.scss'],
    standalone: true,
    imports: [
        CommonModule
    ]
})
export class GamesComponent implements OnInit {
    games: SupabaseGame[] = [];
    isLoading = true;
    deletingGameId: number | null = null;
    errorMessage: string | null = null;

    private readonly gameService = inject(GameService);
    private readonly dialog = inject(MatDialog);

    async ngOnInit(): Promise<void> {
        try {
            this.games = (await this.gameService.getGamesFromSupabase()).map(game => this.setTeamPlayers(game));
        } catch (error) {
            this.errorMessage = error instanceof Error ? error.message : 'Failed to load games';
        } finally {
            this.isLoading = false;
        }
    }

    private setTeamPlayers(game: SupabaseGame): SupabaseGame {
        const gamePlayers = game.game_players ?? [];
        const team1Players = gamePlayers
            .filter(gamePlayer => gamePlayer.team_number === 1)
            .sort((a, b) => a.player_number - b.player_number)
            .map(gamePlayer => gamePlayer.players!)
            .filter(player => !!player);
        const team2Players = gamePlayers
            .filter(gamePlayer => gamePlayer.team_number === 2)
            .sort((a, b) => a.player_number - b.player_number)
            .map(gamePlayer => gamePlayer.players!)
            .filter(player => !!player);

        return {
            ...game,
            team1Players,
            team2Players
        };
    }

    playerName(stat: SupabaseGameStats): string {
        if (!stat.players) {
            return stat.player_id;
        }

        return `${stat.players.first_name} ${stat.players.last_name}`.trim();
    }

    netPoints(stat: SupabaseGameStats): number {
        return stat.points_gained - stat.points_lost;
    }

    async openGameStats(game: SupabaseGame): Promise<void> {
        try {
            const fullGame = await this.gameService.getGameDetailsFromSupabase(game.id);
            const mappedGame = this.mapSupabaseGameToGame(fullGame);

            this.dialog.open(GameStatsDialogComponent, {
                maxWidth: '95vw',
                data: { game: mappedGame }
            });
        } catch (error) {
            this.errorMessage = error instanceof Error ? error.message : 'Failed to load game details';
        }
    }

    async deleteGame(game: SupabaseGame): Promise<void> {
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
        this.deletingGameId = game.id;

        try {
            await this.gameService.deleteGameFromSupabase(game.id);
            this.games = this.games.filter(x => x.id !== game.id);
        } catch (error) {
            this.errorMessage = error instanceof Error ? error.message : 'Failed to delete game';
        } finally {
            this.deletingGameId = null;
        }
    }

    private mapSupabaseGameToGame(source: SupabaseGame): Game {
        const team1 = this.mapTeam(source, 1, source.team1_color, source.team1_design);
        const team2 = this.mapTeam(source, 2, source.team2_color, source.team2_design);

        const game = new Game(team1, team2);
        game.id = source.id;
        game.rounds = this.mapRounds(source);
        game.team1Score = source.team1_score;
        game.team2Score = source.team2_score;
        game.complete = true;

        return game;
    }

    private mapTeam(source: SupabaseGame, teamNumber: number, color: string, design: string): Team {
        const gamePlayers = (source.game_players ?? [])
            .filter(gamePlayer => gamePlayer.team_number === teamNumber)
            .sort((a, b) => a.player_number - b.player_number);

        const players = gamePlayers.map(gamePlayer => this.mapPlayer(source, gamePlayer.player_id));
        const team = new Team(players, teamNumber, new TeamColor(color, design as DesignOptions));
        team.stats = this.aggregateTeamStats(players);

        return team;
    }

    private mapPlayer(source: SupabaseGame, playerId: string): Player {
        const gamePlayer = (source.game_players ?? []).find(x => x.player_id === playerId);
        const stat = (source.game_stats ?? []).find(x => x.player_id === playerId);

        return {
            id: playerId,
            firstName: gamePlayer?.players?.first_name ?? '',
            lastName: gamePlayer?.players?.last_name ?? '',
            imagePath: null,
            stats: this.mapPlayerStats(stat)
        };
    }

    private mapRounds(source: SupabaseGame): any[] {
        return (source.game_rounds ?? []).map(roundData => {
            const team1Throws = this.mapTeamThrowsForRound(roundData, 1);
            const team2Throws = this.mapTeamThrowsForRound(roundData, 2);

            const round = {
                team1Throws,
                team2Throws,
                team1NetScore: roundData.team1_net_score,
                team2NetScore: roundData.team2_net_score,
                team1GrossScore: roundData.team1_gross_score,
                team2GrossScore: roundData.team2_gross_score,
                team1TotalScore: roundData.team1_gross_score,
                team2TotalScore: roundData.team2_gross_score,
                complete: true
            };

            return round as any;
        });
    }

    private mapTeamThrowsForRound(roundData: SupabaseGameRound, teamNumber: number): Throw[] {
        const roundThrow = (roundData.round_throws ?? []).find(x => x.team_number === teamNumber);
        if (!roundThrow) {
            return this.createEmptyThrows();
        }

        const throwResults: Array<number | null> = [
            roundThrow.throw1_result,
            roundThrow.throw2_result,
            roundThrow.throw3_result,
            roundThrow.throw4_result
        ];

        return throwResults.map(result => this.createThrowFromResult(result));
    }

    private createThrowFromResult(result: number | null): Throw {
        const mappedThrow = new Throw();

        if (result === null) {
            return mappedThrow;
        }

        const throwResult = result as ThrowResult;
        mappedThrow.result = throwResult;
        mappedThrow.points = this.pointsForThrowResult(throwResult);

        return mappedThrow;
    }

    private pointsForThrowResult(result: ThrowResult): number {
        if (result === ThrowResult.Cornhole) {
            return 3;
        }

        if (result === ThrowResult.OnBoard) {
            return 1;
        }

        return 0;
    }

    private createEmptyThrows(): Throw[] {
        return Array.from({ length: 4 }, () => new Throw());
    }

    private mapPlayerStats(stat: SupabaseGameStats | undefined): PlayerStats {
        const mapped = new PlayerStats();
        if (!stat) {
            return mapped;
        }

        mapped.throwResults[ThrowResult.OffBoard] = stat.total_off_board;
        mapped.throwResults[ThrowResult.OnBoard] = stat.total_on_board;
        mapped.throwResults[ThrowResult.Cornhole] = stat.total_cornhole;
        mapped.totalThrows = stat.total_off_board + stat.total_on_board + stat.total_cornhole;
        mapped.totalPoints = stat.total_points;
        mapped.pointsGained = stat.points_gained;
        mapped.pointsLost = stat.points_lost;
        mapped.scoringRate = stat.scoring_rate;
        mapped.cornholeRate = stat.cornhole_rate;

        return mapped;
    }

    private aggregateTeamStats(players: Player[]): PlayerStats {
        const total = new PlayerStats();
        players.forEach(player => {
            const stats = player.stats;
            if (!stats) {
                return;
            }

            total.throwResults[ThrowResult.OffBoard] += stats.throwResults[ThrowResult.OffBoard];
            total.throwResults[ThrowResult.OnBoard] += stats.throwResults[ThrowResult.OnBoard];
            total.throwResults[ThrowResult.Cornhole] += stats.throwResults[ThrowResult.Cornhole];
            total.totalThrows += stats.totalThrows;
            total.totalPoints += stats.totalPoints;
            total.pointsGained += stats.pointsGained;
            total.pointsLost += stats.pointsLost;
        });

        total.cornholeRate = total.totalThrows ? total.throwResults[ThrowResult.Cornhole] / total.totalThrows : 0;
        total.scoringRate = total.totalThrows ? (total.totalPoints / total.totalThrows) * 4 : 0;

        return total;
    }
}
