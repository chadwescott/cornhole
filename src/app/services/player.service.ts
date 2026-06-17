import { EnvironmentInjector, inject, Injectable, runInInjectionContext } from '@angular/core';
import { from, map, Observable } from 'rxjs';


import { addDoc, collection, CollectionReference, doc, Firestore, FirestoreDataConverter, getDoc, getDocs, QueryDocumentSnapshot, SnapshotOptions } from '@angular/fire/firestore';
import { PlayerStats } from '../models/player-stats.model';
import { Player } from '../models/player.model';
import { FirestorePaths } from './firestore-paths';

@Injectable({
    providedIn: 'root'
})
export class PlayerService {
    private readonly environmentInjector = inject(EnvironmentInjector);
    private readonly firestore = inject(Firestore);

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

    createPlayer(firstName: string, lastName: string): Promise<Player> {
        return runInInjectionContext(this.environmentInjector, async () => {
            const playersRef = collection(this.firestore, FirestorePaths.players)
                .withConverter(this.playerConverter) as CollectionReference<Player>;

            const player: Player = { firstName, lastName, stats: null, id: null, imagePath: null };

            return addDoc(playersRef, player).then(docRef => {
                player.id = docRef.id;
                return player;
            });
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
        return runInInjectionContext(this.environmentInjector, () => {
            const playerRef = collection(this.firestore, FirestorePaths.players)
                .withConverter(this.playerConverter);

            return from(getDocs(playerRef)).pipe(
                map(snapshot => this.sort(snapshot.docs.map(x => x.data())))
            );
        });
    }

    sort(players: Player[]): Player[] {
        return players.sort((a, b) =>
            a.lastName === b.lastName
                ? a.firstName.localeCompare(b.firstName)
                : a.lastName.localeCompare(b.lastName)
        );
    }
}

