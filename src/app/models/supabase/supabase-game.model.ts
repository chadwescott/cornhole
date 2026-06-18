import { SupabaseGamePlayer } from "./supabase-game-player.model";
import { SupabaseGameStats } from "./supabase-game-stats.model";
import { SupabasePlayer } from "./supabase-player.model";

export interface SupabaseGame {
    id: number;
    created_at: Date;
    team1_score: number;
    team2_score: number;
    team1_color: string;
    team2_color: string;
    team1_design: string;
    team2_design: string;
    game_players: SupabaseGamePlayer[];
    game_stats: SupabaseGameStats[];
    team1Players?: SupabasePlayer[];
    team2Players?: SupabasePlayer[];
    team1Stats?: SupabaseGameStats[];
    team2Stats?: SupabaseGameStats[];
}
