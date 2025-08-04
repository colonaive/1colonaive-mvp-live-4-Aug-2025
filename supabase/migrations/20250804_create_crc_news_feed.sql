-- Create CRC News Feed table
create table public.crc_news_feed (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  source text,
  link text unique, -- Prevent duplicate articles
  summary text,
  date_published timestamp with time zone,
  relevance_score integer check (relevance_score >= 1 and relevance_score <= 10),
  is_sticky boolean default false,
  sticky_priority integer default 999, -- Lower numbers = higher priority
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Create index for efficient querying
create index idx_crc_news_feed_ordering on public.crc_news_feed 
  (is_sticky desc, sticky_priority asc, relevance_score desc, date_published desc);

-- Create index for duplicate checking
create index idx_crc_news_feed_link on public.crc_news_feed (link);

-- Create RLS policies
alter table public.crc_news_feed enable row level security;

-- Allow public read access
create policy "Allow public read access" on public.crc_news_feed
  for select using (true);

-- Allow authenticated users to insert/update (for admin functions)
create policy "Allow authenticated insert" on public.crc_news_feed
  for insert with check (auth.role() = 'authenticated');

create policy "Allow authenticated update" on public.crc_news_feed
  for update using (auth.role() = 'authenticated');

-- Create function to update updated_at timestamp
create or replace function public.update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- Create trigger to automatically update updated_at
create trigger update_crc_news_feed_updated_at
  before update on public.crc_news_feed
  for each row execute function public.update_updated_at_column();

-- Create RPC function to fetch ordered news
create or replace function public.get_crc_news_feed(limit_count integer default 50)
returns table (
  id uuid,
  title text,
  source text,
  link text,
  summary text,
  date_published timestamp with time zone,
  relevance_score integer,
  is_sticky boolean,
  sticky_priority integer,
  created_at timestamp with time zone
) language sql as $$
  select 
    id,
    title,
    source,
    link,
    summary,
    date_published,
    relevance_score,
    is_sticky,
    sticky_priority,
    created_at
  from public.crc_news_feed
  order by is_sticky desc, sticky_priority asc, relevance_score desc, date_published desc
  limit limit_count;
$$;

-- Create function to mark article as sticky
create or replace function public.set_article_sticky(
  article_id uuid,
  sticky boolean default true,
  priority integer default 1
) returns void language sql as $$
  update public.crc_news_feed 
  set is_sticky = sticky, sticky_priority = priority
  where id = article_id;
$$;