import { Routes } from '@angular/router';

import { GamePageComponent } from './components/game-page/game-page.component';
import { GameSetupComponent } from './components/game-setup/game-setup.component';

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
        path: 'setup',
        component: GameSetupComponent
    },
    {
        path: '**',
        redirectTo: 'game'
    }
];
