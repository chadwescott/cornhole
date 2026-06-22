import { inject, Injectable } from '@angular/core';

import { SupabasePlayerStatsRow } from '../models/supabase/supabase-player-stats-row.model';
import { SupabaseService } from './supabase.service';

@Injectable({
    providedIn: 'root'
})
export class PlayerStatsService {
    private readonly supabaseService = inject(SupabaseService);

    async getPlayerStats(): Promise<SupabasePlayerStatsRow[]> {
        const response = await this.supabaseService.request('rpc/get_player_stats', {
            method: 'POST',
            body: {}
        });

        return await response.json() as SupabasePlayerStatsRow[];
    }

    async getPlayerStatsByEventId(eventId: number): Promise<SupabasePlayerStatsRow[]> {
        const response = await this.supabaseService.request('rpc/get_player_stats_by_event_id', {
            method: 'POST',
            body: {
                event_id_param: eventId
            }
        });

        return await response.json() as SupabasePlayerStatsRow[];
    }
}
