import { SupabasePlayer } from "./supabase-player.model";

export interface SupabaseGamePlayer {
    game_id: number;
    player_id: number;
    team_player_id: number;
    team_number: number;
    player_number: number;
    players: SupabasePlayer | null;
}
