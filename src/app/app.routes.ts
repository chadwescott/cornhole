import { Routes } from '@angular/router';

import { ScoreKeeperComponent } from './components/score-keeper/score-keeper.component';

export const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        redirectTo: 'game'
    },
    {
        path: 'game',
        component: ScoreKeeperComponent
    },
    {
        path: '**',
        redirectTo: 'game'
    }
];
