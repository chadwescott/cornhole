import { Routes } from '@angular/router';

import { GamesComponent } from './components/games/games.component';
import { PlayerStatsComponent } from './components/player-stats/player-stats.component';
import { PlayersComponent } from './components/players/players.component';
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
        path: 'players',
        component: PlayersComponent
    },
    {
        path: 'player-stats',
        component: PlayerStatsComponent
    },
    {
        path: '**',
        redirectTo: 'score-keeper'
    }
];
