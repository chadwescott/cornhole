import { Round } from './round.model';
import { Team } from './team.model';

export class Game {
    public id: number | null = null;
    public rounds: Round[] = [];
    public team1Score = 0;
    public team2Score = 0;
    public complete = false;
    public winner: Team | null = null;
    public startTime = Date.now;

    constructor(
        public team1: Team,
        public team2: Team
    ) { }
}
