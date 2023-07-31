import { ThrowResult } from '../models/throw-result';
import { EnumDictionary } from '../utils/enum-dictionary';

export class GameConstants {
    static readonly WINNING_SCORE = 21;
    static readonly POINTS: EnumDictionary<ThrowResult, number> = {
        [ThrowResult.OffBoard]: 0,
        [ThrowResult.OnBoard]: 1,
        [ThrowResult.Cornhole]: 3
    };
}
