create table if not exists price_plan (
    id integer primary key AUTOINCREMENT,
    plan_name text,
    sms_price real,
    call_price real
);