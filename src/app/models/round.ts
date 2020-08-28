import { Throw } from './throw';

export class Round {
    public team1NetScore = 0;
    public team2NetScore = 0;
    public team1TotalScore = 0;
    public team2TotalScore = 0;
    public complete = false;

    constructor(
        public team1Throws: Throw[],
        public team2Throws: Throw[]
    ) {
    }
}
