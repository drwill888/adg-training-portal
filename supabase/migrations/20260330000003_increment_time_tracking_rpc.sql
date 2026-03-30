-- RPC function to atomically increment time tracking
create or replace function public.increment_time_tracking(
  p_user_id uuid,
  p_module_id integer,
  p_step_id text,
  p_seconds integer
)
returns void
language plpgsql
security definer
as $$
begin
  insert into public.time_tracking (user_id, module_id, step_id, seconds_spent, updated_at)
  values (p_user_id, p_module_id, p_step_id, p_seconds, now())
  on conflict (user_id, module_id, step_id)
  do update set
    seconds_spent = time_tracking.seconds_spent + p_seconds,
    updated_at = now();
end;
$$;
