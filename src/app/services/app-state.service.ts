import { inject, Injectable, signal } from '@angular/core';
import { Player } from '../models/player.model';
import { PlayerService } from './player.service';

@Injectable({
    providedIn: 'root'
})
export class AppStateService {
    players = signal<Player[]>([]);

    private readonly playerService = inject(PlayerService);

    constructor() {
        console.log('AppStateService initialized');
        this.playerService.getPlayers().subscribe(players => {
            this.players.set(players);
        });
    }

    loadDataFromStorage<T>(key: string): T | null {
        const json = localStorage.getItem(key);
        return json ? JSON.parse(json) as T : null;
    }

    saveDataToStorage<T>(key: string, data: T): void {
        localStorage.setItem(key, JSON.stringify(data));
    }

    private saveOrDeleteDataInStorage<T>(key: string, data: T | null): void {
        if (data) {
            this.saveDataToStorage(key, data);
        } else {
            localStorage.removeItem(key);
        }
    }
}