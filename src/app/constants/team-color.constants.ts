import { BagColor } from '../models/bag-color';
import { DesignOptions } from '../models/design-options.enum';
import { TeamColor } from '../models/team-color';

export const TEAM_COLORS: TeamColor[] = [
    new TeamColor('Red', new BagColor('255 0 0', '255 255 255', '0 0 0'), DesignOptions.Solid),
    new TeamColor('Orange', new BagColor('255 140 0', '0 0 0', '255 255 255'), DesignOptions.Solid),
    new TeamColor('Yellow', new BagColor('241 201 39', '0 0 0', '255 255 255'), DesignOptions.Solid),
    new TeamColor('Blue', new BagColor('0 0 255', '255 255 255', '0 0 0'), DesignOptions.Solid),
    new TeamColor('Navy', new BagColor('0 0 128', '255 255 255', '0 0 0'), DesignOptions.Solid),
    new TeamColor('Green', new BagColor('0 128 0', '255 255 255', '0 0 0'), DesignOptions.Solid),
    new TeamColor('Purple', new BagColor('128 0 255', '255 255 255', '0 0 0'), DesignOptions.Solid),
    new TeamColor('Pink', new BagColor('255 77 166', '0 0 0', '255 255 255'), DesignOptions.Solid),
    new TeamColor('Brown', new BagColor('128 64 0', '255 255 255', '0 0 0'), DesignOptions.Solid),
    new TeamColor('Black', new BagColor('0 0 0', '255 255 255', '0 0 0'), DesignOptions.Solid),
    new TeamColor('Gray', new BagColor('128 128 128', '0 0 0', '255 255 255'), DesignOptions.Solid),
    new TeamColor('White', new BagColor('255 255 255', '0 0 0', '255 255 255'), DesignOptions.Solid)
];
