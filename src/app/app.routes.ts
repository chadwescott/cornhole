import { Routes } from '@angular/router';

import { GamePageComponent } from './components/game-page/game-page.component';

export const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        redirectTo: 'game'
    },
    {
        path: 'game',
        component: GamePageComponent
    },
    {
        path: '**',
        redirectTo: 'game'
    }
];
