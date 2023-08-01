import { Player } from './player';
import { PlayerStats } from './player-stats';
import { TeamColor } from './team-color';

export class Team {
    public scoreStreak = 0;
    public cornholeStreak = 0;
    public stats = new PlayerStats();

    constructor(
        public players: Player[],
        public teamNumber: number,
        public teamColor: TeamColor
    ) { }
}
