import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { SupabasePlayerStatsRow } from '../../models/supabase/supabase-player-stats-row.model';
import { EventService } from '../../services/event.service';
import { GameService } from '../../services/game.service';

type SortColumn = keyof Omit<SupabasePlayerStatsRow, 'player_id'> | 'name';
type SortDirection = 'asc' | 'desc';

@Component({
    selector: 'ch-player-stats',
    templateUrl: './player-stats.component.html',
    styleUrls: ['./player-stats.component.scss'],
    standalone: true,
    imports: [CommonModule]
})
export class PlayerStatsComponent implements OnInit {
    rows: SupabasePlayerStatsRow[] = [];
    sortedRows: SupabasePlayerStatsRow[] = [];
    pageTitle = 'Player Stats';
    isLoading = true;
    errorMessage: string | null = null;

    sortColumn: SortColumn = 'wins';
    sortDirection: SortDirection = 'desc';

    private readonly route = inject(ActivatedRoute);
    private readonly eventService = inject(EventService);
    private readonly gameService = inject(GameService);

    async ngOnInit(): Promise<void> {
        try {
            const eventIdParam = this.route.snapshot.paramMap.get('eventId');
            const eventId = eventIdParam === null ? null : Number(eventIdParam);

            if (eventId !== null && Number.isFinite(eventId)) {
                const [event, rows] = await Promise.all([
                    this.eventService.getEventById(eventId),
                    this.gameService.getPlayerStatsByEventIdFromSupabase(eventId)
                ]);

                this.pageTitle = `${event.name} Player Stats`;
                this.rows = rows;
            } else {
                this.rows = await this.gameService.getPlayerStatsFromSupabase();
            }

             this.applySort();
         } catch (error) {
             this.errorMessage = error instanceof Error ? error.message : 'Failed to load player stats';
         } finally {
             this.isLoading = false;
         }
     }

    sort(column: SortColumn): void {
        if (this.sortColumn === column) {
            this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
        } else {
            this.sortColumn = column;
            this.sortDirection = 'desc';
        }
        this.applySort();
    }

    sortIcon(column: SortColumn): string {
        if (this.sortColumn !== column) {
            return 'fas fa-sort';
        }
        return this.sortDirection === 'asc' ? 'fas fa-sort-up' : 'fas fa-sort-down';
    }

    playerName(row: SupabasePlayerStatsRow): string {
        return `${row.first_name} ${row.last_name}`.trim();
    }

    private applySort(): void {
        const dir = this.sortDirection === 'asc' ? 1 : -1;
        this.sortedRows = [...this.rows].sort((a, b) => {
            const aVal = this.getValue(a);
            const bVal = this.getValue(b);
            if (aVal < bVal) { return -1 * dir; }
            if (aVal > bVal) { return 1 * dir; }
            return 0;
        });
    }

    private getValue(row: SupabasePlayerStatsRow): string | number {
        if (this.sortColumn === 'name') {
            return this.playerName(row).toLowerCase();
        }
        return row[this.sortColumn as keyof SupabasePlayerStatsRow] as string | number;
    }
}
