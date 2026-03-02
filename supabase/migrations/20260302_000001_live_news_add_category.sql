alter table public.crc_news_feed
  add column if not exists category text;

create index if not exists idx_crc_news_feed_category_date
  on public.crc_news_feed (category, date_published desc, created_at desc);

alter table public.crc_news_feed enable row level security;

do $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = 'public'
      and tablename = 'crc_news_feed'
      and policyname = 'Public read access'
  ) then
    create policy "Public read access"
      on public.crc_news_feed
      for select
      using (true);
  end if;
end
$$;
