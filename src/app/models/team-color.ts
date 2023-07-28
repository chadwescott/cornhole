import { DesignOptions } from "./design-options.enum";

export class TeamColor {
    constructor(
        public name: string,
        public backgroundColor: string,
        public textColor: string,
        public altColor: string,
        public design: DesignOptions
    ) { }
}
