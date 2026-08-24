create table if not exists waitlist (
  id         integer primary key autoincrement,
  name       text    not null,
  email      text    not null unique,
  intent     text    not null check (intent in ('hiring', 'open')),
  country    text,
  user_agent text,
  created_at text    not null default (datetime('now'))
);
