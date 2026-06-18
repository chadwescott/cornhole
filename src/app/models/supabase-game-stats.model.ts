export interface SupabaseGameStats {
    game_id: number;
    player_id: string;
    total_off_board: number;
    total_on_board: number;
    total_cornhole: number;
    total_points: number;
    points_gained: number;
    points_lost: number;
    scoring_rate: number;
    cornhole_rate: number;
}
