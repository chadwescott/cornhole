import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';

import { Stats } from '../../models/stats.model';

type SortColumn = keyof Stats;
type SortDirection = 'asc' | 'desc';

@Component({
    selector: 'ch-stats',
    templateUrl: './stats.component.html',
    styleUrls: ['./stats.component.scss'],
    standalone: true,
    imports: [CommonModule]
})
export class StatsComponent {
    title = input.required<string>();
    stats = input.required<Stats[]>();

    sortColumn: SortColumn = 'wins';
    sortDirection: SortDirection = 'desc';

    sort(column: SortColumn): void {
        if (this.sortColumn === column) {
            this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
        } else {
            this.sortColumn = column;
            this.sortDirection = 'desc';
        }
    }

    sortIcon(column: SortColumn): string {
        if (this.sortColumn !== column) {
            return 'fas fa-sort';
        }

        return this.sortDirection === 'asc' ? 'fas fa-sort-up' : 'fas fa-sort-down';
    }

    sortedStats(): Stats[] {
        const direction = this.sortDirection === 'asc' ? 1 : -1;

        return [...this.stats()].sort((a, b) => {
            const aValue = this.getValue(a);
            const bValue = this.getValue(b);

            if (aValue < bValue) {
                return -1 * direction;
            }

            if (aValue > bValue) {
                return 1 * direction;
            }

            return 0;
        });
    }

    private getValue(row: Stats): string | number {
        const value = row[this.sortColumn];

        if (typeof value === 'string') {
            return value.toLowerCase();
        }

        return value;
    }
}
