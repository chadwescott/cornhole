import { inject, Injectable } from '@angular/core';

import { SupabaseTeamPlayer } from '../models/supabase/supabase-team-player.model';
import { SupabaseService } from './supabase.service';

type TeamPlayerKey = string;

@Injectable({
  providedIn: 'root'
})
export class TeamService {
  private readonly supabaseService = inject(SupabaseService);

  async getOrCreateTeamPlayerMap(playerIds: Array<string | number>): Promise<Map<TeamPlayerKey, number>> {
    const normalized = this.normalizePlayerIds(playerIds);
    if (!normalized.length) {
      return new Map<TeamPlayerKey, number>();
    }

    const existingTeamId = await this.findMatchingTeamId(normalized);
    const teamId = existingTeamId ?? await this.createTeamWithPlayers(normalized);

    const teamPlayers = await this.getTeamPlayersByTeamId(teamId);
    const map = new Map<TeamPlayerKey, number>();
    teamPlayers.forEach(teamPlayer => {
      map.set(String(teamPlayer.player_id), teamPlayer.id);
    });

    return map;
  }

  private normalizePlayerIds(playerIds: Array<string | number>): string[] {
    return Array.from(new Set(playerIds
      .map(playerId => String(playerId).trim())
      .filter(playerId => playerId.length > 0)
    )).sort();
  }

  private async findMatchingTeamId(playerIds: string[]): Promise<number | null> {
    const firstPlayerId = playerIds[0];
    const seedResponse = await this.supabaseService.request(
      `team_players?select=team_id&player_id=eq.${encodeURIComponent(firstPlayerId)}`
    );

    const seedRows = await seedResponse.json() as Array<{ team_id: number }>;
    const candidateTeamIds = Array.from(new Set(seedRows.map(row => row.team_id).filter(teamId => Number.isFinite(teamId))));
    if (!candidateTeamIds.length) {
      return null;
    }

    const inClause = candidateTeamIds.join(',');
    const playersResponse = await this.supabaseService.request(
      `team_players?select=team_id,player_id&team_id=in.(${inClause})`
    );

    const playersRows = await playersResponse.json() as Array<{ team_id: number; player_id: string | number }>;

    const targetKey = this.playerSetKey(playerIds);
    const playersByTeam = new Map<number, string[]>();
    playersRows.forEach(row => {
      const existing = playersByTeam.get(row.team_id) ?? [];
      existing.push(String(row.player_id));
      playersByTeam.set(row.team_id, existing);
    });

    for (const [teamId, teamPlayerIds] of playersByTeam.entries()) {
      const key = this.playerSetKey(teamPlayerIds);
      if (key === targetKey) {
        return teamId;
      }
    }

    return null;
  }

  private async createTeamWithPlayers(playerIds: string[]): Promise<number> {
    const teamResponse = await this.supabaseService.request('teams?select=id', {
      method: 'POST',
      headers: {
        Prefer: 'return=representation'
      },
      body: [{}]
    });

    const createdTeams = await teamResponse.json() as Array<{ id: number }>;
    const teamId = createdTeams[0]?.id;

    if (!Number.isFinite(teamId)) {
      throw new Error('Failed to create team in Supabase');
    }

    const teamPlayersPayload = playerIds.map(playerId => ({
      team_id: teamId,
      player_id: playerId
    }));

    await this.supabaseService.request('team_players', {
      method: 'POST',
      headers: {
        Prefer: 'return=minimal'
      },
      body: teamPlayersPayload
    });

    return teamId;
  }

  private async getTeamPlayersByTeamId(teamId: number): Promise<SupabaseTeamPlayer[]> {
    const response = await this.supabaseService.request(`team_players?select=id,team_id,player_id&team_id=eq.${teamId}`);
    return await response.json() as SupabaseTeamPlayer[];
  }

  private playerSetKey(playerIds: Array<string | number>): string {
    return Array.from(new Set(playerIds.map(playerId => String(playerId)))).sort().join('|');
  }
}
