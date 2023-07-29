import { BagColor } from '../models/bag-color';
import { DesignOptions } from './design-options.enum';

export class TeamColor {
    constructor(
        public name: string,
        public bagColor: BagColor,
        public design: DesignOptions
    ) { }
}
