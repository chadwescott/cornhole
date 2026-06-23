export interface SupabaseTeamStatsRow {
    team_id: string;
    team_name: string;
    wins: number;
    losses: number;
    total_throws: number;
    misses: number;
    on_board_throws: number;
    cornholes: number;
    scoring_rate: number;
    cornhole_rate: number;
}
