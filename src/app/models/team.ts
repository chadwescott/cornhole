import { Player } from './player';
import { TeamColor } from './team-color';

export class Team {
    constructor(
        public players: Player[],
        public teamNumber: number,
        public teamColor: TeamColor
    ) { }
}
