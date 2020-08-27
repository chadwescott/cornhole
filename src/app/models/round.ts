import { Throw } from './throw';

export class Round {
    constructor(
        public team1Throws: Throw[],
        public team2Throws: Throw[]
    ) {
    }
}
