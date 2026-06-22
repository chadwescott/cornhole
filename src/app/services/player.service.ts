import { EnvironmentInjector, inject, Injectable, runInInjectionContext } from '@angular/core';
import { from, map, Observable } from 'rxjs';


import { doc, Firestore, FirestoreDataConverter, getDoc, QueryDocumentSnapshot, SnapshotOptions } from '@angular/fire/firestore';
import { PlayerStats } from '../models/player-stats.model';
import { Player } from '../models/player.model';
import { AppStateService } from './app-state.service';
import { FirestorePaths } from './firestore-paths';
import { SupabaseService } from './supabase.service';

interface SupabasePlayerRow {
    id: string;
    created_at: string;
    first_name: string;
    last_name: string;
}

@Injectable({
    providedIn: 'root'
})
export class PlayerService {
    private readonly environmentInjector = inject(EnvironmentInjector);
    private readonly firestore = inject(Firestore);
    private readonly appStateService = inject(AppStateService);
    private readonly supabaseService = inject(SupabaseService);

    readonly playerConverter: FirestoreDataConverter<Player> = {
        toFirestore(player: Player) {
            return {
                id: player.id,
                firstName: player.firstName,
                lastName: player.lastName,
                imagePath: player.imagePath
            };
        },
        fromFirestore(snapshot: QueryDocumentSnapshot, options: SnapshotOptions): Player {
            const data = snapshot.data(options) as Omit<Player, 'id' | 'stats'>;
            return { ...data, id: snapshot.id, stats: new PlayerStats() };
        },
    };

    async createPlayer(firstName: string, lastName: string): Promise<void> {
        await this.createPlayerInSupabase(firstName, lastName);
        this.appStateService.playerAdded.update(Date.now);
    }

    async editPlayer(player: Player): Promise<void> {
        if (!player.id) {
            throw new Error('Cannot edit player without an id.');
        }

        const firstName = player.firstName.trim();
        const lastName = player.lastName.trim();

        if (!firstName || !lastName) {
            throw new Error('First name and last name are required.');
        }

        await this.supabaseService.request(`players?id=eq.${encodeURIComponent(player.id)}`, {
            method: 'PATCH',
            headers: {
                Prefer: 'return=minimal'
            },
            body: {
                first_name: firstName,
                last_name: lastName
            }
        });

        this.appStateService.playerAdded.update(Date.now);
    }

    async deletePlayer(playerId: string): Promise<void> {
        if (!playerId) {
            throw new Error('Cannot delete player without an id.');
        }

        await this.supabaseService.request(`players?id=eq.${encodeURIComponent(playerId)}`, {
            method: 'DELETE',
            headers: {
                Prefer: 'return=minimal'
            }
        });

        this.appStateService.playerDeleted.update(Date.now);
    }

    private async createPlayerInSupabase(firstName: string, lastName: string): Promise<void> {
        await this.supabaseService.request('players', {
            method: 'POST',
            body: {
                first_name: firstName,
                last_name: lastName
            }
        });
    }

    getPlayerById(playerId: string): Observable<Player | null> {
        return runInInjectionContext(this.environmentInjector, () => {
            const playerRef = doc(this.firestore, `${FirestorePaths.players}/${playerId}`)
                .withConverter(this.playerConverter);

            return from(getDoc(playerRef)).pipe(
                map(snap => {
                    if (snap.exists()) {
                        const player = snap.data();
                        return player;
                    } else {
                        return null;
                    }
                }))
        });
    }

    getPlayers(): Observable<Player[]> {
        return from(this.fetchPlayersFromSupabase()).pipe(
            map(players => this.sort(players))
        );
    }

    private async fetchPlayersFromSupabase(): Promise<Player[]> {
        const response = await this.supabaseService.request('players?select=id,created_at,first_name,last_name&order=last_name.asc,first_name.asc');

        const rows = await response.json() as SupabasePlayerRow[];

        return rows.map(row => ({
            id: row.id,
            firstName: row.first_name,
            lastName: row.last_name,
            imagePath: null,
            stats: new PlayerStats()
        }));
    }

    sort(players: Player[]): Player[] {
        return players.sort((a, b) =>
            a.lastName === b.lastName
                ? a.firstName.localeCompare(b.firstName)
                : a.lastName.localeCompare(b.lastName)
        );
    }
}

