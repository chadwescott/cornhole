create or replace function public.get_team_stats()
returns table (
    team_id bigint,
    team_name text,
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
),
multi_player_team_games as (
    select
        tge.game_id,
        tge.team_number,
        tge.team_id
    from team_game_entries tge
    group by tge.game_id, tge.team_number, tge.team_id
    having count(distinct tge.player_id) > 1
),
team_rosters as (
    select
        tp.team_id,
        string_agg(trim(concat(p.first_name, ' ', p.last_name)), ' / ' order by p.last_name, p.first_name) as team_name
    from public.team_players tp
    join public.players p on p.id = tp.player_id
    group by tp.team_id
),
team_game_stats as (
    select
        mptg.team_id,
        mptg.game_id,
        coalesce(sum(gs.total_off_board), 0)::bigint as misses,
        coalesce(sum(gs.total_on_board), 0)::bigint as on_board_throws,
        coalesce(sum(gs.total_cornhole), 0)::bigint as cornholes,
        coalesce(sum(gs.total_off_board + gs.total_on_board + gs.total_cornhole), 0)::bigint as total_throws,
        coalesce(sum(gs.total_points), 0)::numeric as total_points
    from multi_player_team_games mptg
    join team_game_entries tge
      on tge.game_id = mptg.game_id
     and tge.team_number = mptg.team_number
     and tge.team_id = mptg.team_id
    left join public.game_stats gs
      on gs.game_id = tge.game_id
     and gs.player_id = tge.player_id
    group by mptg.team_id, mptg.game_id
),
team_totals as (
    select
        tgs.team_id,
        coalesce(sum(tgs.misses), 0)::bigint as misses,
        coalesce(sum(tgs.on_board_throws), 0)::bigint as on_board_throws,
        coalesce(sum(tgs.cornholes), 0)::bigint as cornholes,
        coalesce(sum(tgs.total_throws), 0)::bigint as total_throws,
        coalesce(sum(tgs.total_points), 0)::numeric as total_points
    from team_game_stats tgs
    group by tgs.team_id
),
win_loss as (
    select
        mptg.team_id,
        coalesce(sum(case
            when mptg.team_number = 1 and g.team1_score > g.team2_score then 1
            when mptg.team_number = 2 and g.team2_score > g.team1_score then 1
            else 0
        end), 0)::bigint as wins,
        coalesce(sum(case
            when mptg.team_number = 1 and g.team1_score < g.team2_score then 1
            when mptg.team_number = 2 and g.team2_score < g.team1_score then 1
            else 0
        end), 0)::bigint as losses
    from multi_player_team_games mptg
    join public.games g on g.id = mptg.game_id
    group by mptg.team_id
)
select
    tt.team_id,
    tr.team_name,
    coalesce(wl.wins, 0)::bigint as wins,
    coalesce(wl.losses, 0)::bigint as losses,
    tt.total_throws,
    tt.misses,
    tt.on_board_throws,
    tt.cornholes,
    case
        when tt.total_throws = 0 then 0::numeric
        else round((tt.total_points / tt.total_throws::numeric) * 4, 2)
    end as scoring_rate,
    case
        when tt.total_throws = 0 then 0::numeric
        else round(tt.cornholes::numeric / tt.total_throws::numeric, 4)
    end as cornhole_rate
from team_totals tt
join team_rosters tr on tr.team_id = tt.team_id
left join win_loss wl on wl.team_id = tt.team_id
order by tr.team_name asc;
$$;

-- Example grant for anon/authenticated API roles if needed:
-- grant execute on function public.get_team_stats() to anon, authenticated;
