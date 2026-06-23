import { CommonModule } from '@angular/common';
import { Component, inject, input, OnInit } from '@angular/core';

import { SupabaseEvent } from '../../models/supabase/supabase-event.model';
import { SupabasePlayerStatsRow } from '../../models/supabase/supabase-player-stats-row.model';
import { PlayerStatsService } from '../../services/player-stats.service';

type SortColumn = keyof Omit<SupabasePlayerStatsRow, 'player_id'> | 'name';
type SortDirection = 'asc' | 'desc';

@Component({
    selector: 'ch-overall-stats',
    templateUrl: './overall-stats.component.html',
    styleUrls: ['./overall-stats.component.scss'],
    standalone: true,
    imports: [CommonModule]
})
export class OverallStatsComponent implements OnInit {
    event = input<SupabaseEvent | null>(null);

    rows: SupabasePlayerStatsRow[] = [];
    sortedRows: SupabasePlayerStatsRow[] = [];
    pageTitle = 'Overall Statistics';
    isLoading = true;
    errorMessage: string | null = null;

    sortColumn: SortColumn = 'wins';
    sortDirection: SortDirection = 'desc';

    private readonly playerStatsService = inject(PlayerStatsService);

    async ngOnInit(): Promise<void> {
        try {
            const event = this.event();
            if (event) {
                this.rows = await this.playerStatsService.getPlayerStatsByEventId(event.id);
            } else {
                this.rows = await this.playerStatsService.getPlayerStats();
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
