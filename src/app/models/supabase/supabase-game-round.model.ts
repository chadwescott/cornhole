import { SupabaseRoundThrow } from './supabase-round-throw.model';

export interface SupabaseGameRound {
    id?: number;
    game_id: number;
    team1_net_score: number;
    team2_net_score: number;
    team1_gross_score: number;
    team2_gross_score: number;
    round_throws?: SupabaseRoundThrow[];
}
