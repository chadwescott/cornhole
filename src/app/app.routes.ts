import { Routes } from '@angular/router';

import { EventDetailsComponent } from './components/event-details/event-details.component';
import { EventsComponent } from './components/events/events.component';
import { GamesComponent } from './components/games/games.component';
import { LiveGamesComponent } from './components/live-games/live-games.component';
import { PlayersComponent } from './components/players/players.component';
import { ScoreKeeperComponent } from './components/score-keeper/score-keeper.component';
import { StatsPageComponent } from './components/stats-page/stats-page.component';

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
        path: 'live-games',
        component: LiveGamesComponent
    },
    {
        path: 'events',
        component: EventsComponent
    },
    {
        path: 'event-details/:eventId',
        component: EventDetailsComponent
    },
    {
        path: 'players',
        component: PlayersComponent
    },
    {
        path: 'stats',
        component: StatsPageComponent
    },
    {
        path: '**',
        redirectTo: 'score-keeper'
    }
];
