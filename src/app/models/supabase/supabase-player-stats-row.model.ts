export interface SupabasePlayerStatsRow {
    player_id: string;
    first_name: string;
    last_name: string;
    wins: number;
    losses: number;
    total_throws: number;
    misses: number;
    on_board_throws: number;
    cornholes: number;
    scoring_rate: number;
    cornhole_rate: number;
}
