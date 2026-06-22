import { effect, inject, Injectable } from '@angular/core';


import { PlayerStats } from '../models/player-stats.model';
import { AppStateService } from './app-state.service';
import { PlayerService } from './player.service';

@Injectable({
    providedIn: 'root'
})
export class AppDataService {
    private readonly appStateService = inject(AppStateService);
    private readonly playerService = inject(PlayerService);

    private readonly playerAddedEffect = effect(() => {
        this.appStateService.playerAdded();
        this.refreshPlayers();
    });

    constructor() {
        console.log('AppDataService initialized');
        this.refreshPlayers();
    }

    refreshPlayers(): void {
        this.playerService.getPlayers().subscribe(players => {
            players.forEach(player => {
                if (!player.stats) {
                    player.stats = new PlayerStats();
                }
            });
            this.appStateService.players.set(players);
        });
    }
}