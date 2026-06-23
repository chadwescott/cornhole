import { SupabasePlayer } from "./supabase-player.model";

export interface SupabaseGamePlayer {
    game_id: number;
    team_player_id: number;
    team_number: number;
    player_number: number;
    // Legacy compatibility while migration completes.
    player_id?: number;
    players?: SupabasePlayer | null;
    team_players?: {
        player_id: number;
        players: SupabasePlayer | null;
    } | null;
}
