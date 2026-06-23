import { PlayerStats } from "./player-stats.model";

export interface Player {
    id: number | null;
    firstName: string;
    lastName: string;
    stats: PlayerStats | null;
    imagePath: string | null;
}
