import { Routes } from '@angular/router';

import { GamesComponent } from './components/games/games.component';
import { ScoreKeeperComponent } from './components/score-keeper/score-keeper.component';

export const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        redirectTo: 'score-keeper'
    },
    {
        path: 'score-keeper',
        component: ScoreKeeperComponent
    },
    {
        path: 'games',
        component: GamesComponent
    },
    {
        path: '**',
        redirectTo: 'score-keeper'
    }
];
