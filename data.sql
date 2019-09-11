CREATE TABLE companies (
  handle text PRIMARY KEY, 
  name text NOT NULL UNIQUE,
  num_employees integer, 
  description text, 
  logo_url text
);


CREATE TABLE jobs (
  id serial PRIMARY KEY, 
  title text NOT NULL, 
  salary FLOAT NOT NULL, 
  equity FLOAT NOT NULL ,
  company_handle text NOT NULL REFERENCES companies,
  date_posted timestamp with time zone,
  constraint check_equity
    check (equity between 0 and 1)
);