import { Round } from './round';
import { Team } from './team';

export class Game {
    public rounds: Round[] = [];
    public team1Score = 0;
    public team2Score = 0;
    public complete = false;
    public winner: Team;
    public startTime = Date.now;

    constructor(
        public team1: Team,
        public team2: Team
    ) { }
}
