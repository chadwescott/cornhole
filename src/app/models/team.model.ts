import { PlayerStats } from './player-stats.model';
import { Player } from './player.model';
import { TeamColor } from './team-color.model';

export class Team {
    public id: string | null = null;
    public scoreStreak = 0;
    public cornholeStreak = 0;
    public stats = new PlayerStats();

    constructor(
        public players: Player[],
        public teamNumber: number,
        public teamColor: TeamColor
    ) { }
}
