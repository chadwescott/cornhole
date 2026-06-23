import { inject, Injectable } from '@angular/core';

import { SupabaseTeamStatsRow } from '../models/supabase/supabase-team-stats-row.model';
import { SupabaseService } from './supabase.service';

@Injectable({
    providedIn: 'root'
})
export class TeamStatsService {
    private readonly supabaseService = inject(SupabaseService);

    async getTeamStats(): Promise<SupabaseTeamStatsRow[]> {
        const response = await this.supabaseService.request('rpc/get_team_stats', {
            method: 'POST',
            body: {}
        });

        return await response.json() as SupabaseTeamStatsRow[];
    }

    async getTeamStatsByEventId(eventId: number): Promise<SupabaseTeamStatsRow[]> {
        const response = await this.supabaseService.request('rpc/get_team_stats_by_event_id', {
            method: 'POST',
            body: {
                event_id_param: eventId
            }
        });

        return await response.json() as SupabaseTeamStatsRow[];
    }
}
