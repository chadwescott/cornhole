create or replace function public.get_player_stats_by_event_id(event_id_param bigint)
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
with filtered_game_stats as (
    select gs.*
    from public.game_stats gs
    join public.games g on g.id = gs.game_id
    where g.event_id = event_id_param
),
event_players as (
    select distinct gp.player_id
    from public.game_players gp
    join public.games g on g.id = gp.game_id
    where g.event_id = event_id_param
),
player_totals as (
    select
        p.id as player_id,
        p.first_name,
        p.last_name,
        coalesce(sum(fgs.total_off_board), 0)::bigint as misses,
        coalesce(sum(fgs.total_on_board), 0)::bigint as on_board_throws,
        coalesce(sum(fgs.total_cornhole), 0)::bigint as cornholes,
        coalesce(sum(fgs.total_off_board + fgs.total_on_board + fgs.total_cornhole), 0)::bigint as total_throws,
        coalesce(sum(fgs.total_points), 0)::numeric as total_points
    from event_players ep
    join public.players p on p.id = ep.player_id
    left join filtered_game_stats fgs on fgs.player_id = p.id
    group by p.id, p.first_name, p.last_name
),
win_loss as (
    select
        gp.player_id,
        coalesce(sum(case
            when gp.team_number = 1 and g.team1_score > g.team2_score then 1
            when gp.team_number = 2 and g.team2_score > g.team1_score then 1
            else 0
        end), 0)::bigint as wins,
        coalesce(sum(case
            when gp.team_number = 1 and g.team1_score < g.team2_score then 1
            when gp.team_number = 2 and g.team2_score < g.team1_score then 1
            else 0
        end), 0)::bigint as losses
    from public.game_players gp
    join public.games g on g.id = gp.game_id
    where g.event_id = event_id_param
    group by gp.player_id
)
select
    pt.player_id,
    pt.first_name,
    pt.last_name,
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
left join win_loss wl on wl.player_id = pt.player_id
order by pt.last_name asc, pt.first_name asc;
$$;

-- Example grant for anon/authenticated API roles if needed:
-- grant execute on function public.get_player_stats_by_event_id(bigint) to anon, authenticated;
