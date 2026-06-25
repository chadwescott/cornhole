import { Injectable, signal } from '@angular/core';
import { Game } from '../models/game.model';
import { Player } from '../models/player.model';
import { Stats } from '../models/stats.model';
import { SupabaseEvent } from '../models/supabase/supabase-event.model';

@Injectable({
    providedIn: 'root'
})
export class AppStateService {
    game = signal<Game | null>(null);
    players = signal<Player[]>([]);
    playerAdded = signal<number>(0);
    playerDeleted = signal<number>(0);
    event = signal<SupabaseEvent | null>(null);
    individualStats = signal<Stats[]>([]);
    teamStats = signal<Stats[]>([]);
    overallStats = signal<Stats[]>([]);
    eventIndividualStats = signal<Stats[]>([]);
    eventTeamStats = signal<Stats[]>([]);
    eventOverallStats = signal<Stats[]>([]);
    firestoreGameId = signal<string | null>(null);

    constructor() {
        console.log('AppStateService initialized');
    }

    loadDataFromStorage<T>(key: string): T | null {
        const json = localStorage.getItem(key);
        if (json === null) {
            return null;
        }

        try {
            return json ? JSON.parse(json) as T : null;
        } catch (error) {
            console.error(`Error parsing JSON from localStorage for key "${key}":`, error);
            return null;
        }
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