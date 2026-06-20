import { Throw } from './throw.model';

export class Round {
    public team1NetScore = 0;
    public team2NetScore = 0;
    public team1GrossScore = 0;
    public team2GrossScore = 0;
    public complete = false;

    constructor(
        public team1Throws: Throw[],
        public team2Throws: Throw[]
    ) {
    }
}
