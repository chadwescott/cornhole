import { DesignOptions } from '../models/design-options.enum';
import { TeamColor } from '../models/team-color';

export const TEAM_COLORS: TeamColor[] = [
    new TeamColor('Red', '255 0 0', '255 255 255', DesignOptions.Solid),
    new TeamColor('Orange', '255 140 0', '0 0 0', DesignOptions.Solid),
    new TeamColor('Yellow', '241 201 39', '0 0 0', DesignOptions.Solid),
    new TeamColor('Blue', '0 0 255', '255 255 255', DesignOptions.Solid),
    new TeamColor('Navy', '0 0 128', '255 255 255', DesignOptions.Solid),
    new TeamColor('Green', '0 128 0', '255 255 255', DesignOptions.Solid),
    new TeamColor('Purple', '128 0 255', '255 255 255', DesignOptions.Solid),
    new TeamColor('Pink', '255 77 166', '0 0 0', DesignOptions.Solid),
    new TeamColor('Brown', '128 64 0', '255 255 255', DesignOptions.Solid),
    new TeamColor('Black', '0 0 0', '255 255 255', DesignOptions.Solid),
    new TeamColor('Gray', '128 128 128', '0 0 0', DesignOptions.Solid),
    new TeamColor('White', '255 255 255', '0 0 0', DesignOptions.Solid)
];
