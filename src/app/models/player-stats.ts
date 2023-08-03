import { EnumDictionary } from '../utils/enum-dictionary';
import { ThrowResult } from './throw-result';

export class PlayerStats {
    throwResults: EnumDictionary<ThrowResult, number> = {
        [ThrowResult.OffBoard]: 0,
        [ThrowResult.OnBoard]: 0,
        [ThrowResult.Cornhole]: 0
    };
    totalThrows: number = 0;
    totalPoints: number = 0;
    pointsGained: number = 0;
    pointsLost: number = 0;
    scoringRate: number = 0;
    cornholeRate: number = 0;
    wins: number = 0;
    losses: number = 0;

    constructor() { }
}
