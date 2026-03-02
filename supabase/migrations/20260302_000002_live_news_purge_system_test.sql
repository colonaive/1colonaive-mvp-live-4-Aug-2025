delete from public.crc_news_feed
where source = 'system_test'
   or link like 'https://example.com/system_test_crc_news_%';
