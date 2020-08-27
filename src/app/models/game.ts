import { Round } from './round';

export class Game {
    constructor(
        public team1Name: string,
        public team2Name: string,
        public rounds: Round[]
    ) { }
}
