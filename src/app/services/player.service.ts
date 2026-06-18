import { EnvironmentInjector, inject, Injectable, runInInjectionContext } from '@angular/core';
import { from, map, Observable } from 'rxjs';


import { doc, Firestore, FirestoreDataConverter, getDoc, QueryDocumentSnapshot, SnapshotOptions } from '@angular/fire/firestore';
import { environment } from '../../environments/environment';
import { PlayerStats } from '../models/player-stats.model';
import { Player } from '../models/player.model';
import { AppStateService } from './app-state.service';
import { FirestorePaths } from './firestore-paths';

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

    private async createPlayerInSupabase(firstName: string, lastName: string): Promise<void> {
        const { url, publishableKey } = environment.supabase;
        const endpoint = `${url}/rest/v1/players`;

        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                apikey: publishableKey,
                Authorization: `Bearer ${publishableKey}`,
                'Content-Type': 'application/json',
                Accept: 'application/json'
            },
            body: JSON.stringify({
                first_name: firstName,
                last_name: lastName
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Supabase create player failed (${response.status}): ${errorText}`);
        }
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
        const { url, publishableKey } = environment.supabase;
        const endpoint = `${url}/rest/v1/players?select=id,created_at,first_name,last_name&order=last_name.asc,first_name.asc`;

        const response = await fetch(endpoint, {
            headers: {
                apikey: publishableKey,
                Authorization: `Bearer ${publishableKey}`,
                Accept: 'application/json'
            }
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`Supabase request failed (${response.status}): ${errorText}`);
        }

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

