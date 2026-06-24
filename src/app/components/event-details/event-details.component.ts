import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { SupabaseEvent } from '../../models/supabase/supabase-event.model';
import { AppStateService } from '../../services/app-state.service';
import { EventService } from '../../services/event.service';
import { GamesComponent } from '../games/games.component';
import { LiveGamesComponent } from '../live-games/live-games.component';
import { StatsComponent } from '../stats/stats.component';

@Component({
    selector: 'ch-event-details',
    templateUrl: './event-details.component.html',
    styleUrls: ['./event-details.component.scss'],
    standalone: true,
    imports: [
        CommonModule,
        GamesComponent,
        LiveGamesComponent,
        StatsComponent
    ]
})
export class EventDetailsComponent implements OnInit {
    event: SupabaseEvent | null = null;
    isLoading = true;
    errorMessage: string | null = null;

    private readonly route = inject(ActivatedRoute);
    private readonly eventService = inject(EventService);
    appStateService = inject(AppStateService);

    async ngOnInit(): Promise<void> {
        try {
            const eventId = Number(this.route.snapshot.paramMap.get('eventId'));
            if (!Number.isFinite(eventId)) {
                throw new Error('Invalid event id');
            }
            this.event = await this.eventService.getEventById(eventId);
            this.appStateService.event.set(this.event);
        } catch (error) {
            this.errorMessage = error instanceof Error ? error.message : 'Failed to load event';
        } finally {
            this.isLoading = false;
        }
    }
}
