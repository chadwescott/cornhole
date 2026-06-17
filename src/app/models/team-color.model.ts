import { DesignOptions } from './design-options.enum';

export class TeamColor {
    constructor(
        public colorScheme: string,
        public design: DesignOptions
    ) { }
}
