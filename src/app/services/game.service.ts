import { EnvironmentInjector, inject, Injectable } from '@angular/core';
import { Firestore } from '@angular/fire/firestore';

import { GameConstants } from '../constants/game.constants';
import { Game } from '../models/game.model';
import { PlayerStats } from '../models/player-stats.model';
import { Player } from '../models/player.model';
import { Round } from '../models/round.model';
import { SupabaseGamePlayer } from '../models/supabase/supabase-game-player.model';
import { SupabaseGameRound } from '../models/supabase/supabase-game-round.model';
import { SupabaseGameStats } from '../models/supabase/supabase-game-stats.model';
import { SupabaseGame } from '../models/supabase/supabase-game.model';
import { SupabaseRoundThrow } from '../models/supabase/supabase-round-throw.model';
import { TeamColor } from '../models/team-color.model';
import { Team } from '../models/team.model';
import { ThrowResult } from '../models/throw-result.model';
import { Throw } from '../models/throw.model';
import { SupabaseService } from './supabase.service';
import { TeamService } from './team.service';

type SupabaseGamePlayerInsert = Omit<SupabaseGamePlayer, 'players'>;
type SupabaseGameRoundInsert = SupabaseGameRound;
type SupabaseRoundThrowInsert = SupabaseRoundThrow;

@Injectable({
  providedIn: 'root'
})
export class GameService {
  private readonly environmentInjector = inject(EnvironmentInjector);
  private readonly firestore = inject(Firestore);
  private readonly supabaseService = inject(SupabaseService);
  private readonly teamService = inject(TeamService);

  private readonly teamsKey = 'TEAMS';
  private readonly playersKey = 'PLAYERS';
  private readonly gamesKey = 'GAMES';


  players: Player[] = [];
  teams: Team[] = [];
  games: Game[] = [];

  constructor() {
    const gamesData = localStorage.getItem(this.gamesKey);
    const playersData = localStorage.getItem(this.playersKey);
    const teamsData = localStorage.getItem(this.teamsKey);

    this.games = gamesData ? JSON.parse(gamesData) : [];
    this.players = playersData ? JSON.parse(playersData) : [];
    this.teams = teamsData ? JSON.parse(teamsData) : [];

    if (this.players) {
      this.players.map(x => {
        if (!x.stats) {
          x.stats = new PlayerStats();
        }
      });
    }
  }

  clearData(): void {
    this.players = [];
    this.teams = [];
    this.games = [];

    localStorage.removeItem(this.gamesKey);
    localStorage.removeItem(this.teamsKey);
    localStorage.removeItem(this.playersKey);
  }

  private savePlayers(): void {
    localStorage.setItem(this.playersKey, JSON.stringify(this.players));
  }

  private saveTeams(): void {
    localStorage.setItem(this.teamsKey, JSON.stringify(this.teams));
  }

  saveGames(): void {
    localStorage.setItem(this.gamesKey, JSON.stringify(this.games));
  }

  getGames(): Game[] {
    return this.games;
  }

  async getGamesFromSupabase(eventId?: number): Promise<SupabaseGame[]> {
    const eventFilter = Number.isFinite(eventId)
      ? `&event_id=eq.${eventId}`
      : '';

    const response = await this.supabaseService.request(
      'games?select=' +
      'id,created_at,event_id,team1_score,team2_score,team1_color,team2_color,team1_design,team2_design,' +
      'game_players(game_id,team_player_id,team_number,player_number,team_players(player_id,players(id,first_name,last_name)))' +
      `${eventFilter}&order=id.desc`
    );

    return await response.json() as SupabaseGame[];
  }

  async getGameDetailsFromSupabase(gameId: number): Promise<SupabaseGame> {
    const response = await this.supabaseService.request(
      'games?select=' +
      'id,created_at,team1_score,team2_score,team1_color,team2_color,team1_design,team2_design,' +
      'game_players(game_id,team_player_id,team_number,player_number,team_players(player_id,players(id,first_name,last_name))),' +
      'game_rounds(id,game_id,team1_net_score,team2_net_score,team1_gross_score,team2_gross_score,round_throws(round_id,team_number,throw1_result,throw2_result,throw3_result,throw4_result)),' +
      'game_stats(game_id,player_id,total_off_board,total_on_board,total_cornhole,total_points,points_gained,points_lost,scoring_rate,cornhole_rate,players(id,first_name,last_name))' +
      `&id=eq.${gameId}&limit=1`
    );

    const games = await response.json() as SupabaseGame[];
    const game = games[0];

    if (!game) {
      throw new Error(`Game ${gameId} not found`);
    }

    return game;
  }

  async deleteGameFromSupabase(gameId: number): Promise<void> {
    const roundIds = await this.getGameRoundIdsFromSupabase(gameId);

    if (roundIds.length) {
      await this.supabaseService.request(`round_throws?round_id=in.(${roundIds.join(',')})`, {
        method: 'DELETE',
        headers: {
          Prefer: 'return=minimal'
        }
      });
    }

    await this.supabaseService.request(`game_players?game_id=eq.${gameId}`, {
      method: 'DELETE',
      headers: {
        Prefer: 'return=minimal'
      }
    });

    await this.supabaseService.request(`game_stats?game_id=eq.${gameId}`, {
      method: 'DELETE',
      headers: {
        Prefer: 'return=minimal'
      }
    });

    await this.supabaseService.request(`game_rounds?game_id=eq.${gameId}`, {
      method: 'DELETE',
      headers: {
        Prefer: 'return=minimal'
      }
    });

    await this.supabaseService.request(`games?id=eq.${gameId}`, {
      method: 'DELETE',
      headers: {
        Prefer: 'return=minimal'
      }
    });
  }

  private async getGameRoundIdsFromSupabase(gameId: number): Promise<number[]> {
    const response = await this.supabaseService.request(`game_rounds?select=id&game_id=eq.${gameId}`);
    const gameRounds = await response.json() as Array<{ id: number }>;

    return gameRounds
      .map(round => round.id)
      .filter((id): id is number => Number.isFinite(id));
  }

  loadGame(game: Game): void {
    this.setTeamColor(game.team1);
    this.setTeamColor(game.team2);
    game.team1.players.map(x => { if (!x.stats) { x.stats = new PlayerStats() }; });
    game.team2.players.map(x => { if (!x.stats) { x.stats = new PlayerStats() }; });
  }

  setTeamColor(team: Team): void {
    this.saveTeams();
    this.saveGames();
  }

  createTeam(players: Player[], teamNumber: number, teamColor: TeamColor): Team {
    const team = new Team(players, teamNumber, teamColor);
    this.teams.push(team);
    this.saveTeams();
    return team;
  }

  createGame(team1: Team, team2: Team): Game {
    const game = new Game(team1, team2);
    this.games.push(game);
    this.addRound(game);
    this.saveGames();
    this.loadGame(game);
    return game;
  }

  updateTeamColor(team: Team): void {
    this.setTeamColor(team);
  }

  roundScoreChanged(round: Round): void {
    let team1Score = 0;
    round.team1Throws.map(x => team1Score += x.points);
    round.team1GrossScore = team1Score;

    let team2Score = 0;
    round.team2Throws.map(x => team2Score += x.points);
    round.team2GrossScore = team2Score;

    round.team1NetScore = Math.max(round.team1GrossScore - round.team2GrossScore, 0);
    round.team2NetScore = Math.max(round.team2GrossScore - round.team1GrossScore, 0);
    round.complete = !round.team1Throws.find(x => !x.result) && !round.team2Throws.find(x => !x.result);

    const game = this.games.find(x => x.rounds.includes(round));
    if (game) {
      this.calculateGameScore(game);
    }

    this.saveGames();
  }

  private calculateGameScore(game: Game): void {
    let team1Score = 0;
    game.rounds.map(x => team1Score += x.team1NetScore);
    game.team1Score = team1Score;

    let team2Score = 0;
    game.rounds.map(x => team2Score += x.team2NetScore);
    game.team2Score = team2Score;

    if (!game.rounds.find(x => !x.complete)) {
      game.complete = game.team1Score >= GameConstants.WINNING_SCORE || game.team2Score >= GameConstants.WINNING_SCORE;
      if (game.complete) {
        game.winner = game.team1Score >= GameConstants.WINNING_SCORE ? game.team1 : game.team2;
      } else {
        game.complete = false;
        game.winner = null;
      }
    }
  }

  completeRound(game: Game): void {
    this.calculateStatsForLastRound(game);
    if (!game.complete) {
      this.addRound(game);
    }
  }

  private calculateStatsForLastRound(game: Game) {
    const lastRound = game.rounds[game.rounds.length - 1];

    const playerIndex = game.team1.players.length === 1 ? 0 : (game.rounds.length + 1) % 2;

    lastRound.team1Throws.map(x => this.updateThrowResult(game.team1.players[playerIndex].stats!, x.result!));
    lastRound.team2Throws.map(x => this.updateThrowResult(game.team2.players[playerIndex].stats!, x.result!));
    game.team1.players[playerIndex].stats!.pointsGained += lastRound.team1NetScore;
    game.team2.players[playerIndex].stats!.pointsGained += lastRound.team2NetScore;
    game.team1.players[playerIndex].stats!.pointsLost += lastRound.team2NetScore;
    game.team2.players[playerIndex].stats!.pointsLost += lastRound.team1NetScore;

    game.team1.players.forEach((player: Player) => this.calculateScoringRate(player.stats!));
    game.team2.players.forEach((player: Player) => this.calculateScoringRate(player.stats!));
    this.calculateTeamStats(game.team1);
    this.calculateTeamStats(game.team2);

    this.updateScoreStreak(game);
  }

  private updateThrowResult(stats: PlayerStats, throwResult: ThrowResult): void {
    stats.totalThrows++;
    stats.throwResults[throwResult]++;
    stats.cornholeRate = stats.throwResults[ThrowResult.Cornhole] / stats.totalThrows;
  }

  private calculateScoringRate(stats: PlayerStats): void {
    stats.totalPoints = stats.throwResults[ThrowResult.Cornhole] * GameConstants.POINTS[ThrowResult.Cornhole]
      + stats.throwResults[ThrowResult.OnBoard] * GameConstants.POINTS[ThrowResult.OnBoard];
    stats.scoringRate = stats.totalPoints / stats.totalThrows * 4;
  }

  private calculateTeamStats(team: Team): void {
    if (team.stats == null) { team.stats = new PlayerStats(); }
    team.stats.throwResults[ThrowResult.Cornhole] = team.players.map(p => p.stats!.throwResults[ThrowResult.Cornhole]).reduce((previous, current) => previous + current);
    team.stats.throwResults[ThrowResult.OnBoard] = team.players.map(p => p.stats!.throwResults[ThrowResult.OnBoard]).reduce((previous, current) => previous + current);
    team.stats.throwResults[ThrowResult.OffBoard] = team.players.map(p => p.stats!.throwResults[ThrowResult.OffBoard]).reduce((previous, current) => previous + current);
    team.stats.totalThrows = team.players.map(p => p.stats!.totalThrows).reduce((previous, current) => previous + current);
    team.stats.totalPoints = team.players.map(p => p.stats!.totalPoints).reduce((previous, current) => previous + current);
    team.stats.cornholeRate = team.stats.throwResults[ThrowResult.Cornhole] / team.stats.totalThrows;
    team.stats.scoringRate = team.stats.totalPoints / team.stats.totalThrows * 4;
    team.stats.pointsGained = team.players.map(p => p.stats!.pointsGained).reduce((p, c) => p + c);
    team.stats.pointsLost = team.players.map(p => p.stats!.pointsLost).reduce((p, c) => p + c);
  }

  private updateScoreStreak(game: Game): void {
    const lastRound = game.rounds[game.rounds.length - 1];
    if (lastRound.team1NetScore > 0) {
      game.team1.scoreStreak += lastRound.team1NetScore;
      game.team2.scoreStreak = 0;
    } else if (lastRound.team2NetScore > 0) {
      game.team2.scoreStreak += lastRound.team2NetScore;
      game.team1.scoreStreak = 0;
    }
  }

  addRound(game: Game): void {
    const team1Throws: Throw[] = [];
    const team2Throws: Throw[] = [];
    for (let i = 0; i < 4; i++) {
      team1Throws.push(new Throw());
      team2Throws.push(new Throw());
    }

    const round = new Round(team1Throws, team2Throws);
    game.rounds.push(round);
    this.saveGames();
  }

  async completeGame(game: Game): Promise<void> {
    const gameId = await this.saveCompletedGameToSupabase(game);
    await this.saveGamePlayersToSupabase(game, gameId);
    const roundIds = await this.saveGameRoundsToSupabase(game, gameId);
    await this.saveRoundThrowsToSupabase(game, roundIds);
    await this.saveGameStatsToSupabase(game, gameId);
    game.id = gameId;
    this.resetStats(game);
  }

  private async saveCompletedGameToSupabase(game: Game): Promise<number> {
    const response = await this.supabaseService.request('games', {
      method: 'POST',
      headers: {
        Prefer: 'return=representation'
      },
      body: {
        event_id: game.event_id,
        team1_score: game.team1Score,
        team2_score: game.team2Score,
        team1_color: game.team1.teamColor.colorScheme,
        team2_color: game.team2.teamColor.colorScheme,
        team1_design: game.team1.teamColor.design.toString(),
        team2_design: game.team2.teamColor.design.toString(),
      }
    });

    const responseText = await response.text();
    const createdGames = JSON.parse(responseText) as SupabaseGame[];

    const createdGame = createdGames.length === 1 ? createdGames[0] : null;

    if (!createdGame?.id) {
      throw new Error('Supabase create game failed: missing game id in response');
    }

    return createdGame.id;
  }

  private async saveGameStatsToSupabase(game: Game, gameId: number): Promise<void> {
    const statsPayload = this.buildGameStatsPayload(game, gameId);
    if (!statsPayload.length) {
      return;
    }

    await this.supabaseService.request('game_stats', {
      method: 'POST',
      headers: {
        Prefer: 'return=minimal'
      },
      body: statsPayload
    });
  }

  private async saveGamePlayersToSupabase(game: Game, gameId: number): Promise<void> {
    const gamePlayersPayload = await this.buildGamePlayersPayload(game, gameId);
    if (!gamePlayersPayload.length) {
      return;
    }

    await this.supabaseService.request('game_players', {
      method: 'POST',
      headers: {
        Prefer: 'return=minimal'
      },
      body: gamePlayersPayload
    });
  }

  private async saveGameRoundsToSupabase(game: Game, gameId: number): Promise<number[]> {
    const gameRoundsPayload = this.buildGameRoundsPayload(game, gameId);
    if (!gameRoundsPayload.length) {
      return [];
    }

    const response = await this.supabaseService.request('game_rounds?select=id', {
      method: 'POST',
      headers: {
        Prefer: 'return=representation'
      },
      body: gameRoundsPayload
    });

    const createdRounds = await response.json() as Array<{ id: number }>;
    const roundIds = createdRounds.map(round => round.id).filter((id): id is number => Number.isFinite(id));

    if (roundIds.length !== gameRoundsPayload.length) {
      throw new Error('Supabase create round failed: missing round id in response');
    }

    return roundIds;
  }

  private async saveRoundThrowsToSupabase(game: Game, roundIds: number[]): Promise<void> {
    const roundThrowsPayload = this.buildRoundThrowsPayload(game, roundIds);
    if (!roundThrowsPayload.length) {
      return;
    }

    await this.supabaseService.request('round_throws', {
      method: 'POST',
      headers: {
        Prefer: 'return=minimal'
      },
      body: roundThrowsPayload
    });
  }

  private async buildGamePlayersPayload(game: Game, gameId: number): Promise<SupabaseGamePlayerInsert[]> {
    const payload: SupabaseGamePlayerInsert[] = [];

    for (const team of [game.team1, game.team2]) {
      const players = team.players.filter(player => !!player.id);
      if (!players.length) {
        continue;
      }

      const teamPlayerMap = await this.teamService.getOrCreateTeamPlayerMap(
        players.map(player => player.id!)
      );

      players.forEach((player, index) => {
        const playerId = player.id!;
        const teamPlayerId = teamPlayerMap.get(String(playerId));

        if (!Number.isFinite(teamPlayerId)) {
          throw new Error(`Unable to resolve team_player_id for player ${playerId}`);
        }

        payload.push({
          game_id: gameId,
          team_player_id: teamPlayerId!,
          team_number: team.teamNumber,
          player_number: index + 1
        });
      });
    }

    return payload;
  }

  private buildGameRoundsPayload(game: Game, gameId: number): SupabaseGameRoundInsert[] {
    return game.rounds.map(round => ({
      game_id: gameId,
      team1_net_score: round.team1NetScore,
      team2_net_score: round.team2NetScore,
      team1_gross_score: round.team1GrossScore,
      team2_gross_score: round.team2GrossScore
    }));
  }

  private buildRoundThrowsPayload(game: Game, roundIds: number[]): SupabaseRoundThrowInsert[] {
    return game.rounds.flatMap((round, roundIndex) => {
      const roundId = roundIds[roundIndex];
      if (!Number.isFinite(roundId)) {
        return [];
      }

      return [
        { teamNumber: game.team1.teamNumber, throws: round.team1Throws },
        { teamNumber: game.team2.teamNumber, throws: round.team2Throws }
      ]
        .map(teamThrows => this.mapThrowsToRoundThrowInsert(roundId, teamThrows.teamNumber, teamThrows.throws))
        .filter(roundThrow => this.hasThrowResult(roundThrow));
    });
  }

  private mapThrowsToRoundThrowInsert(roundId: number, teamNumber: number, throws: Throw[]): SupabaseRoundThrowInsert {
    const roundThrow: SupabaseRoundThrowInsert = {
      round_id: roundId,
      team_number: teamNumber,
      throw1_result: null,
      throw2_result: null,
      throw3_result: null,
      throw4_result: null
    };

    throws.forEach((throwAttempt, throwIndex) => {
      this.setRoundThrowResultByIndex(roundThrow, throwIndex, throwAttempt.result);
    });

    return roundThrow;
  }

  private setRoundThrowResultByIndex(roundThrow: SupabaseRoundThrowInsert, throwIndex: number, throwResult: ThrowResult | null): void {
    const resultValue = throwResult ?? null;

    switch (throwIndex) {
      case 0:
        roundThrow.throw1_result = resultValue;
        break;
      case 1:
        roundThrow.throw2_result = resultValue;
        break;
      case 2:
        roundThrow.throw3_result = resultValue;
        break;
      case 3:
        roundThrow.throw4_result = resultValue;
        break;
    }
  }

  private hasThrowResult(roundThrow: SupabaseRoundThrowInsert): boolean {
    return [
      roundThrow.throw1_result,
      roundThrow.throw2_result,
      roundThrow.throw3_result,
      roundThrow.throw4_result
    ].some(result => result !== null);
  }

  private buildGameStatsPayload(game: Game, gameId: number): SupabaseGameStats[] {
    const players = [...game.team1.players, ...game.team2.players];

    return players
      .filter(player => !!player.id && !!player.stats)
      .map(player => ({
        game_id: gameId,
        player_id: player.id!,
        total_off_board: player.stats!.throwResults[ThrowResult.OffBoard] ?? 0,
        total_on_board: player.stats!.throwResults[ThrowResult.OnBoard] ?? 0,
        total_cornhole: player.stats!.throwResults[ThrowResult.Cornhole] ?? 0,
        total_points: player.stats!.totalPoints ?? 0,
        points_gained: player.stats!.pointsGained ?? 0,
        points_lost: player.stats!.pointsLost ?? 0,
        scoring_rate: player.stats!.scoringRate ?? 0,
        cornhole_rate: player.stats!.cornholeRate ?? 0
      }));
  }

  resetStats(game: Game): void {
    game.team1.players.map(x => x.stats = new PlayerStats());
    game.team2.players.map(x => x.stats = new PlayerStats());
    game.team1.stats = new PlayerStats();
    game.team2.stats = new PlayerStats();
  }

  resetStreak(game: Game): void {
    game.team1.scoreStreak = 0;
    game.team2.scoreStreak = 0;
    this.saveGames();
  }

  resetGame(game: Game): Game {
    this.games.splice(this.games.indexOf(game), 1);
    const newGame = this.createGame(game.team1, game.team2);
    this.resetStats(newGame);
    this.saveGames();
    return newGame;
  }
}
