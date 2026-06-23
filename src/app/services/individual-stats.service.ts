import { inject, Injectable } from '@angular/core';

import { SupabasePlayerStatsRow } from '../models/supabase/supabase-player-stats-row.model';
import { SupabaseService } from './supabase.service';

@Injectable({
    providedIn: 'root'
})
export class IndividualStatsService {
    private readonly supabaseService = inject(SupabaseService);

    async getIndividualStats(): Promise<SupabasePlayerStatsRow[]> {
        const response = await this.supabaseService.request('rpc/get_individual_stats', {
            method: 'POST',
            body: {}
        });

        return await response.json() as SupabasePlayerStatsRow[];
    }

    async getIndividualStatsByEventId(eventId: number): Promise<SupabasePlayerStatsRow[]> {
        const response = await this.supabaseService.request('rpc/get_individual_stats_by_event_id', {
            method: 'POST',
            body: {
                event_id_param: eventId
            }
        });

        return await response.json() as SupabasePlayerStatsRow[];
    }
}
