import { effect, inject, Injectable } from '@angular/core';


import { PlayerStats } from '../models/player-stats.model';
import { Stats } from '../models/stats.model';
import { SupabasePlayerStatsRow } from '../models/supabase/supabase-player-stats-row.model';
import { SupabaseTeamStatsRow } from '../models/supabase/supabase-team-stats-row.model';
import { AppStateService } from './app-state.service';
import { IndividualStatsService } from './individual-stats.service';
import { PlayerStatsService } from './player-stats.service';
import { PlayerService } from './player.service';
import { TeamStatsService } from './team-stats.service';

@Injectable({
    providedIn: 'root'
})
export class AppDataService {
    private readonly appStateService = inject(AppStateService);
    private readonly playerService = inject(PlayerService);
    private readonly individualStatsService = inject(IndividualStatsService);
    private readonly teamStatsService = inject(TeamStatsService);
    private readonly overallStatsService = inject(PlayerStatsService);

    private readonly firestoreGameIdKey = 'ACTIVE_FIRESTORE_GAME_ID';

    private readonly playerAddedEffect = effect(() => {
        this.appStateService.playerAdded();
        this.refreshPlayers();
    });

    private readonly eventChangedEffect = effect(async () => {
        const currentEvent = this.appStateService.event();

        if (currentEvent) {
            const [individualStats, teamStats, overallStats] = await Promise.all([
                this.individualStatsService.getIndividualStatsByEventId(currentEvent.id),
                this.teamStatsService.getTeamStatsByEventId(currentEvent.id),
                this.overallStatsService.getPlayerStatsByEventId(currentEvent.id)
            ]);

            this.appStateService.eventIndividualStats.set(
                individualStats.map(row => this.mapPlayerStatsToStats(row))
            );
            this.appStateService.eventTeamStats.set(
                teamStats.map(row => this.mapTeamStatsToStats(row))
            );
            this.appStateService.eventOverallStats.set(
                overallStats.map(row => this.mapPlayerStatsToStats(row))
            );
        } else {
            this.appStateService.eventIndividualStats.set([]);
            this.appStateService.eventTeamStats.set([]);
            this.appStateService.eventOverallStats.set([]);
        }
    });

    private readonly firestoreGameIdEffect = effect(() => {
        this.appStateService.saveDataToStorage(this.firestoreGameIdKey, this.appStateService.firestoreGameId());
    });

    constructor() {
        console.log('AppDataService initialized');
        this.refreshPlayers();
        this.getStatistics();
        this.appStateService.firestoreGameId.set(this.appStateService.loadDataFromStorage<string>(this.firestoreGameIdKey));
    }

    refreshPlayers(): void {
        this.playerService.getPlayers().subscribe(players => {
            players.forEach(player => {
                if (!player.stats) {
                    player.stats = new PlayerStats();
                }
            });
            this.appStateService.players.set(players);
        });
    }

    async getStatistics(): Promise<void> {
        const [individualStats, teamStats, overallStats] = await Promise.all([
            this.individualStatsService.getIndividualStats(),
            this.teamStatsService.getTeamStats(),
            this.overallStatsService.getPlayerStats()
        ]);

        this.appStateService.individualStats.set(
            individualStats.map(row => this.mapPlayerStatsToStats(row))
        );
        this.appStateService.teamStats.set(
            teamStats.map(row => this.mapTeamStatsToStats(row))
        );
        this.appStateService.overallStats.set(
            overallStats.map(row => this.mapPlayerStatsToStats(row))
        );
    }

    private mapPlayerStatsToStats(row: SupabasePlayerStatsRow): Stats {
        return {
            name: `${row.first_name} ${row.last_name}`,
            wins: row.wins,
            losses: row.losses,
            total_throws: row.total_throws,
            misses: row.misses,
            onBoardThrows: row.on_board_throws,
            cornholes: row.cornholes,
            scoringRate: row.scoring_rate,
            cornholeRate: row.cornhole_rate
        };
    }

    private mapTeamStatsToStats(row: SupabaseTeamStatsRow): Stats {
        return {
            name: row.team_name,
            wins: row.wins,
            losses: row.losses,
            total_throws: row.total_throws,
            misses: row.misses,
            onBoardThrows: row.on_board_throws,
            cornholes: row.cornholes,
            scoringRate: row.scoring_rate,
            cornholeRate: row.cornhole_rate
        };
    }
}