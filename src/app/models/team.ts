import { Player } from './player';
import { TeamColor } from './team-color';

export class Team {
    public scoreStreak = 0;
    public cornholeStreak = 0;

    constructor(
        public players: Player[],
        public teamNumber: number,
        public teamColor: TeamColor
    ) { }
}
