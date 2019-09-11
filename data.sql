CREATE TABLE companies (
    handle text PRIMARY KEY, 
    name text NOT NULL UNIQUE,
    num_employees integer, 
    description text, 
    logo_url text
)

CREATE TABLE jobs (
    id integer PRIMARY KEY AUTO_INCREMENT, 
    title text NOT NULL, 
    salary integer NOT NULL FLOAT, 
    equity integer NOT NULL FLOAT(<1),
    company_handle text NOT NULL REFERENCES companies,
    date_posted timestamp with time zone 
)