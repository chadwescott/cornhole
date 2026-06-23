import { CommonModule } from '@angular/common';
import { Component, inject, input, OnInit } from '@angular/core';

import { SupabaseEvent } from '../../models/supabase/supabase-event.model';
import { SupabaseTeamStatsRow } from '../../models/supabase/supabase-team-stats-row.model';
import { TeamStatsService } from '../../services/team-stats.service';

type SortColumn = keyof Omit<SupabaseTeamStatsRow, 'team_id'>;
type SortDirection = 'asc' | 'desc';

@Component({
    selector: 'ch-team-stats',
    templateUrl: './team-stats.component.html',
    styleUrls: ['./team-stats.component.scss'],
    standalone: true,
    imports: [CommonModule]
})
export class TeamStatsComponent implements OnInit {
    event = input<SupabaseEvent | null>(null);

    rows: SupabaseTeamStatsRow[] = [];
    sortedRows: SupabaseTeamStatsRow[] = [];
    pageTitle = 'Team Stats';
    isLoading = true;
    errorMessage: string | null = null;

    sortColumn: SortColumn = 'wins';
    sortDirection: SortDirection = 'desc';

    private readonly teamStatsService = inject(TeamStatsService);

    async ngOnInit(): Promise<void> {
        try {
            const event = this.event();
            if (event) {
                this.rows = await this.teamStatsService.getTeamStatsByEventId(event.id);
            } else {
                this.rows = await this.teamStatsService.getTeamStats();
            }
            this.applySort();
        } catch (error) {
            this.errorMessage = error instanceof Error ? error.message : 'Failed to load team stats';
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

    private getValue(row: SupabaseTeamStatsRow): string | number {
        return row[this.sortColumn as keyof SupabaseTeamStatsRow] as string | number;
    }
}
