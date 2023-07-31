import { PlayerStats } from './player-stats';

export class Player {
    public stats: PlayerStats = new PlayerStats();
    constructor(public name: string) {
    }
}
