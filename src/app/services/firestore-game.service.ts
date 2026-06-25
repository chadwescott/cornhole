import { inject, Injectable } from '@angular/core';
import { FirebaseApp } from '@angular/fire/app';
import {
    addDoc,
    collection,
    deleteDoc,
    doc,
    DocumentData,
    getDocs,
    getFirestore,
    onSnapshot,
    orderBy,
    Query,
    query,
    updateDoc,
    where
} from 'firebase/firestore';
import { Observable } from 'rxjs';

import { DesignOptions } from '../models/design-options.enum';
import { FirestoreGame } from '../models/firestore-game.model';
import { Game } from '../models/game.model';
import { PlayerStats } from '../models/player-stats.model';
import { Player } from '../models/player.model';
import { Round } from '../models/round.model';
import { TeamColor } from '../models/team-color.model';
import { Team } from '../models/team.model';
import { ThrowResult } from '../models/throw-result.model';
import { Throw } from '../models/throw.model';
import { AppStateService } from './app-state.service';

@Injectable({
    providedIn: 'root'
})
export class FirestoreGameService {
    private readonly firestore = getFirestore(inject(FirebaseApp));
    private readonly appStateService = inject(AppStateService);
    private readonly gamesCollection = 'games';
    private readonly staleGameWindowMs = 10 * 60 * 1000;

    async createGame(game: Game): Promise<string> {
        try {
            const gamesRef = collection(this.firestore, this.gamesCollection);
            const docRef = await addDoc(gamesRef, this.gameToFirestoreObject(game));
            return docRef.id;
        } catch (error) {
            console.error('Error creating game:', error);
            throw new Error(`Failed to create game: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    async getAllGames(): Promise<Game[]> {
        try {
            const gamesRef = collection(this.firestore, this.gamesCollection);
            const gamesSnapshot = await getDocs(gamesRef);

            return gamesSnapshot.docs.map(doc => this.firestoreObjectToGame(doc.data()));
        } catch (error) {
            console.error('Error fetching all games:', error);
            throw new Error(`Failed to fetch games: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    async getGamesByEventId(eventId: number): Promise<Game[]> {
        try {
            const gamesRef = collection(this.firestore, this.gamesCollection);
            const gamesQuery = query(
                gamesRef,
                where('event_id', '==', eventId)
            );
            const gamesSnapshot = await getDocs(gamesQuery);

            return gamesSnapshot.docs
                .map(doc => doc.data() as Record<string, unknown>)
                .sort((a, b) => this.getSortTimestampMs(b) - this.getSortTimestampMs(a))
                .map(game => this.firestoreObjectToGame(game));
        } catch (error) {
            console.error(`Error fetching games for event ${eventId}:`, error);
            throw new Error(`Failed to fetch games for event: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    observeGames(): Observable<FirestoreGame[]> {
        const gamesRef = collection(this.firestore, this.gamesCollection);
        const gamesQuery = query(
            gamesRef,
            orderBy('createdAt', 'desc')
        );

        return this.observeGameQuery(gamesQuery);
    }

    observeGamesByEventId(eventId: number): Observable<Game[]> {
        const gamesRef = collection(this.firestore, this.gamesCollection);
        const gamesQuery = query(
            gamesRef,
            where('event_id', '==', eventId)
        );

        return this.observeGameQuery(gamesQuery);
    }

    async updateGame(gameId: string, game: Partial<Game>): Promise<string> {
        try {
            const gameDocRef = doc(this.firestore, this.gamesCollection, gameId);
            await updateDoc(gameDocRef, this.gameToFirestoreObject(game, false));
            return gameId;
        } catch (error) {
            if (this.isMissingDocumentError(error) && this.canCreateGameFromPartial(game)) {
                console.warn(`Game ${gameId} no longer exists. Creating a replacement game document.`);
                return await this.createGame(game);
            }

            console.error(`Error updating game ${gameId}:`, error);
            throw new Error(`Failed to update game: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    async deleteGame(gameId: string): Promise<void> {
        try {
            const gameDocRef = doc(this.firestore, this.gamesCollection, gameId);
            await deleteDoc(gameDocRef);
        } catch (error) {
            console.error(`Error deleting game ${gameId}:`, error);
            throw new Error(`Failed to delete game: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }

    private gameToFirestoreObject(game: Partial<Game>, isCreate = true): Record<string, any> {
        const firestoreGame: Record<string, any> = {
            id: game.id ?? null,
            event_id: game.event_id ?? null,
            team1: game.team1 ? this.teamToFirestoreObject(game.team1) : null,
            team2: game.team2 ? this.teamToFirestoreObject(game.team2) : null,
            rounds: game.rounds ? game.rounds.map(round => this.roundToFirestoreObject(round)) : [],
            team1Score: game.team1Score ?? 0,
            team2Score: game.team2Score ?? 0,
            updatedAt: new Date()
        };

        if (isCreate) {
            firestoreGame['createdAt'] = new Date();
        }

        return firestoreGame;
    }

    private firestoreObjectToGame(data: any): FirestoreGame {
        const team1 = this.firestoreObjectToTeam(data.team1, 1);
        const team2 = this.firestoreObjectToTeam(data.team2, 2);

        const game = new FirestoreGame(team1, team2);
        this.appStateService.firestoreGameId.set(data.docId ?? null);
        game.docId = data.docId ?? null;
        game.id = data.id ?? null;
        game.event_id = data.event_id ?? null;
        game.rounds = Array.isArray(data.rounds)
            ? data.rounds.map((round: any) => this.firestoreObjectToRound(round))
            : [];
        game.team1Score = data.team1Score ?? 0;
        game.team2Score = data.team2Score ?? 0;

        return game;
    }

    private teamToFirestoreObject(team: Team): Record<string, any> {
        return {
            id: team.id ?? null,
            players: Array.isArray(team.players)
                ? team.players.map(player => this.playerToFirestoreObject(player))
                : [],
            teamNumber: team.teamNumber,
            teamColor: this.teamColorToFirestoreObject(team.teamColor),
            scoreStreak: team.scoreStreak ?? 0,
            cornholeStreak: team.cornholeStreak ?? 0,
            stats: this.playerStatsToFirestoreObject(team.stats)
        };
    }

    private firestoreObjectToTeam(data: any, fallbackTeamNumber: number): Team {
        const players = Array.isArray(data?.players)
            ? data.players.map((player: any) => this.firestoreObjectToPlayer(player))
            : [];

        const teamColor = this.firestoreObjectToTeamColor(data?.teamColor);
        const team = new Team(players, data?.teamNumber ?? fallbackTeamNumber, teamColor);

        team.id = data?.id ?? null;
        team.scoreStreak = data?.scoreStreak ?? 0;
        team.cornholeStreak = data?.cornholeStreak ?? 0;
        team.stats = this.firestoreObjectToPlayerStats(data?.stats);

        return team;
    }

    private playerToFirestoreObject(player: Player): Record<string, any> {
        return {
            id: player.id ?? null,
            firstName: player.firstName,
            lastName: player.lastName,
            imagePath: player.imagePath ?? null,
            stats: this.playerStatsToFirestoreObject(player.stats)
        };
    }

    private firestoreObjectToPlayer(data: any): Player {
        return {
            id: data?.id ?? null,
            firstName: data?.firstName ?? '',
            lastName: data?.lastName ?? '',
            imagePath: data?.imagePath ?? null,
            stats: this.firestoreObjectToPlayerStats(data?.stats)
        };
    }

    private playerStatsToFirestoreObject(stats: PlayerStats | null | undefined): Record<string, any> {
        const safeStats = stats ?? new PlayerStats();

        return {
            throwResults: {
                [ThrowResult.OffBoard]: safeStats.throwResults?.[ThrowResult.OffBoard] ?? 0,
                [ThrowResult.OnBoard]: safeStats.throwResults?.[ThrowResult.OnBoard] ?? 0,
                [ThrowResult.Cornhole]: safeStats.throwResults?.[ThrowResult.Cornhole] ?? 0
            },
            totalThrows: safeStats.totalThrows ?? 0,
            totalPoints: safeStats.totalPoints ?? 0,
            pointsGained: safeStats.pointsGained ?? 0,
            pointsLost: safeStats.pointsLost ?? 0,
            scoringRate: safeStats.scoringRate ?? 0,
            cornholeRate: safeStats.cornholeRate ?? 0,
        };
    }

    private firestoreObjectToPlayerStats(data: any): PlayerStats {
        const stats = new PlayerStats();
        stats.throwResults[ThrowResult.OffBoard] = data?.throwResults?.[ThrowResult.OffBoard] ?? 0;
        stats.throwResults[ThrowResult.OnBoard] = data?.throwResults?.[ThrowResult.OnBoard] ?? 0;
        stats.throwResults[ThrowResult.Cornhole] = data?.throwResults?.[ThrowResult.Cornhole] ?? 0;
        stats.totalThrows = data?.totalThrows ?? 0;
        stats.totalPoints = data?.totalPoints ?? 0;
        stats.pointsGained = data?.pointsGained ?? 0;
        stats.pointsLost = data?.pointsLost ?? 0;
        stats.scoringRate = data?.scoringRate ?? 0;
        stats.cornholeRate = data?.cornholeRate ?? 0;

        return stats;
    }

    private teamColorToFirestoreObject(teamColor: TeamColor | null | undefined): Record<string, any> {
        if (!teamColor) {
            return {
                colorScheme: 'red-blue',
                design: DesignOptions.Solid
            };
        }

        return {
            colorScheme: teamColor.colorScheme,
            design: teamColor.design
        };
    }

    private firestoreObjectToTeamColor(data: any): TeamColor {
        const design = Object.values(DesignOptions).includes(data?.design)
            ? data.design
            : DesignOptions.Solid;

        return new TeamColor(data?.colorScheme ?? 'red-blue', design);
    }

    private roundToFirestoreObject(round: Round): Record<string, any> {
        return {
            team1Throws: Array.isArray(round.team1Throws)
                ? round.team1Throws.map(throwValue => this.throwToFirestoreObject(throwValue))
                : [],
            team2Throws: Array.isArray(round.team2Throws)
                ? round.team2Throws.map(throwValue => this.throwToFirestoreObject(throwValue))
                : [],
            team1NetScore: round.team1NetScore ?? 0,
            team2NetScore: round.team2NetScore ?? 0,
            team1GrossScore: round.team1GrossScore ?? 0,
            team2GrossScore: round.team2GrossScore ?? 0
        };
    }

    private firestoreObjectToRound(data: any): Round {
        const team1Throws = Array.isArray(data?.team1Throws)
            ? data.team1Throws.map((throwValue: any) => this.firestoreObjectToThrow(throwValue))
            : [];
        const team2Throws = Array.isArray(data?.team2Throws)
            ? data.team2Throws.map((throwValue: any) => this.firestoreObjectToThrow(throwValue))
            : [];

        const round = new Round(team1Throws, team2Throws);
        round.team1NetScore = data?.team1NetScore ?? 0;
        round.team2NetScore = data?.team2NetScore ?? 0;
        round.team1GrossScore = data?.team1GrossScore ?? 0;
        round.team2GrossScore = data?.team2GrossScore ?? 0;

        return round;
    }

    private throwToFirestoreObject(throwValue: Throw): Record<string, any> {
        return {
            points: throwValue.points ?? 0,
            result: throwValue.result ?? null
        };
    }

    private firestoreObjectToThrow(data: any): Throw {
        const throwValue = new Throw();
        throwValue.points = data?.points ?? 0;
        throwValue.result = this.parseThrowResult(data?.result);

        return throwValue;
    }

    private parseThrowResult(value: unknown): ThrowResult | null {
        if (typeof value === 'number' && Object.values(ThrowResult).includes(value)) {
            return value as ThrowResult;
        }

        return null;
    }

    private observeGameQuery(gamesQuery: Query<DocumentData>): Observable<FirestoreGame[]> {
        return new Observable<FirestoreGame[]>(subscriber => {
            const unsubscribe = onSnapshot(
                gamesQuery,
                snapshot => {
                    const games = snapshot.docs.map(gameDoc => ({
                        docId: gameDoc.id,
                        ...gameDoc.data()
                    } as Record<string, unknown>));

                    void this.deleteStaleGames(games);

                    const mappedGames = games
                        .filter(game => !this.isGameStale(game))
                        .sort((a, b) => this.getSortTimestampMs(b) - this.getSortTimestampMs(a))
                        .map(game => this.firestoreObjectToGame(game));

                    subscriber.next(mappedGames);
                },
                error => subscriber.error(error)
            );

            return () => unsubscribe();
        });
    }

    private isMissingDocumentError(error: unknown): boolean {
        if (!error || typeof error !== 'object') {
            return false;
        }

        const maybeError = error as { code?: string; message?: string };
        return maybeError.code === 'not-found' || maybeError.message?.includes('No document to update') === true;
    }

    private canCreateGameFromPartial(game: Partial<Game>): game is Game {
        return !!game.team1 && !!game.team2;
    }

    private async deleteStaleGames(games: Array<Record<string, unknown>>): Promise<void> {
        const staleGames = games.filter(game => this.isGameStale(game));
        if (!staleGames.length) {
            return;
        }

        const deleteOperations = staleGames
            .map(game => game['docId'])
            .filter((docId): docId is string => typeof docId === 'string' && docId.length > 0)
            .map(docId => deleteDoc(doc(this.firestore, this.gamesCollection, docId)));

        const deleteResults = await Promise.allSettled(deleteOperations);
        deleteResults
            .filter(result => result.status === 'rejected')
            .forEach(result => console.error('Error deleting stale game:', result.reason));
    }

    private isGameStale(game: Record<string, unknown>): boolean {
        const lastUpdatedMs = this.getLastUpdatedMs(game);
        if (lastUpdatedMs == null) {
            return false;
        }

        return Date.now() - lastUpdatedMs > this.staleGameWindowMs;
    }

    private getLastUpdatedMs(game: Record<string, unknown>): number | null {
        const updatedAt = this.parseFirestoreDateValue(game['updatedAt']);
        if (updatedAt != null) {
            return updatedAt;
        }

        return this.parseFirestoreDateValue(game['createdAt']);
    }

    private getSortTimestampMs(game: Record<string, unknown>): number {
        return this.parseFirestoreDateValue(game['createdAt']) ?? 0;
    }

    private parseFirestoreDateValue(value: unknown): number | null {
        if (!value) {
            return null;
        }

        if (value instanceof Date) {
            const ms = value.getTime();
            return Number.isNaN(ms) ? null : ms;
        }

        if (typeof value === 'string' || typeof value === 'number') {
            const ms = new Date(value).getTime();
            return Number.isNaN(ms) ? null : ms;
        }

        if (typeof value === 'object') {
            const candidate = value as { toDate?: () => Date; seconds?: number };

            if (typeof candidate.toDate === 'function') {
                const ms = candidate.toDate().getTime();
                return Number.isNaN(ms) ? null : ms;
            }

            if (typeof candidate.seconds === 'number') {
                return candidate.seconds * 1000;
            }
        }

        return null;
    }
}
