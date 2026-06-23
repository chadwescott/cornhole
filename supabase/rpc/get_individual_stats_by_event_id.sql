create or replace function public.get_individual_stats_by_event_id(event_id_param bigint)
returns table (
    player_id bigint,
    first_name text,
    last_name text,
    wins bigint,
    losses bigint,
    total_throws bigint,
    misses bigint,
    on_board_throws bigint,
    cornholes bigint,
    scoring_rate numeric,
    cornhole_rate numeric
)
language sql
stable
as $$
with team_game_entries as (
    select
        gp.game_id,
        gp.team_number,
        tp.team_id,
        tp.player_id
    from public.game_players gp
    join public.team_players tp on tp.id = gp.team_player_id
    join public.games g on g.id = gp.game_id
    where g.event_id = event_id_param
),
solo_team_games as (
    select
        tge.game_id,
        tge.team_number,
        max(tge.player_id) as player_id
    from team_game_entries tge
    group by tge.game_id, tge.team_number
    having count(distinct tge.player_id) = 1
),
solo_game_stats as (
    select
        stg.player_id,
        stg.game_id,
        coalesce(gs.total_off_board, 0)::bigint as misses,
        coalesce(gs.total_on_board, 0)::bigint as on_board_throws,
        coalesce(gs.total_cornhole, 0)::bigint as cornholes,
        coalesce(gs.total_off_board + gs.total_on_board + gs.total_cornhole, 0)::bigint as total_throws,
        coalesce(gs.total_points, 0)::numeric as total_points
    from solo_team_games stg
    left join public.game_stats gs
      on gs.game_id = stg.game_id
     and gs.player_id = stg.player_id
),
player_totals as (
    select
        sgs.player_id,
        coalesce(sum(sgs.misses), 0)::bigint as misses,
        coalesce(sum(sgs.on_board_throws), 0)::bigint as on_board_throws,
        coalesce(sum(sgs.cornholes), 0)::bigint as cornholes,
        coalesce(sum(sgs.total_throws), 0)::bigint as total_throws,
        coalesce(sum(sgs.total_points), 0)::numeric as total_points
    from solo_game_stats sgs
    group by sgs.player_id
),
win_loss as (
    select
        stg.player_id,
        coalesce(sum(case
            when stg.team_number = 1 and g.team1_score > g.team2_score then 1
            when stg.team_number = 2 and g.team2_score > g.team1_score then 1
            else 0
        end), 0)::bigint as wins,
        coalesce(sum(case
            when stg.team_number = 1 and g.team1_score < g.team2_score then 1
            when stg.team_number = 2 and g.team2_score < g.team1_score then 1
            else 0
        end), 0)::bigint as losses
    from solo_team_games stg
    join public.games g on g.id = stg.game_id
    group by stg.player_id
)
select
    p.id as player_id,
    p.first_name,
    p.last_name,
    coalesce(wl.wins, 0)::bigint as wins,
    coalesce(wl.losses, 0)::bigint as losses,
    pt.total_throws,
    pt.misses,
    pt.on_board_throws,
    pt.cornholes,
    case
        when pt.total_throws = 0 then 0::numeric
        else round((pt.total_points / pt.total_throws::numeric) * 4, 2)
    end as scoring_rate,
    case
        when pt.total_throws = 0 then 0::numeric
        else round(pt.cornholes::numeric / pt.total_throws::numeric, 4)
    end as cornhole_rate
from player_totals pt
join public.players p on p.id = pt.player_id
left join win_loss wl on wl.player_id = pt.player_id
order by p.last_name asc, p.first_name asc;
$$;

-- Example grant for anon/authenticated API roles if needed:
-- grant execute on function public.get_individual_stats_by_event_id(bigint) to anon, authenticated;
