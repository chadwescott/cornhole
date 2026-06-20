import { SupabasePlayer } from "./supabase-player.model";

export interface SupabaseGamePlayer {
    game_id: number;
    player_id: string;
    team_number: number;
    player_number: number;
    players: SupabasePlayer | null;
}
