import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';

import { AppStateService } from '../../services/app-state.service';
import { StatsComponent } from '../stats/stats.component';

@Component({
    selector: 'ch-stats-page',
    templateUrl: './stats-page.component.html',
    styleUrls: ['./stats-page.component.scss'],
    standalone: true,
    imports: [
        CommonModule,
        StatsComponent
    ]
})
export class StatsPageComponent {
    appStateService = inject(AppStateService);
    pageTitle = 'Statistics';
}
