create table if not exists projects (
    id          serial primary key,
    slug        text unique not null,
    title       text not null,
    summary     text not null,
    stack       text[] not null default '{}',
    key_result  text,
    github_url  text,
    image_url   text,
    featured    boolean not null default false,
    sort_order  int not null default 0,
    created_at  timestamptz not null default now()
);

insert into projects (slug, title, summary, stack, key_result, github_url, featured, sort_order) values
(
    'housing-affordability',
    'Housing Affordability Analysis',
    'End-to-end pipeline merging Zillow ZORI rent and Census ACS income data across 500+ NY/NJ ZIP codes, with ZIP-level rent burden mapped in Power BI to flag the 10 ZIP codes with the widest cost-burden gaps.',
    array['Excel','Python', 'SQL', 'Power BI'],
    '38.7% average rent burden, 8.7 pts above the 30% affordability threshold',
    'https://github.com/jordonchau/Data-Portfolio',
    true, 1
),
(
    'medical-insurance-charges',
    'Medical Insurance Charges',
    'Analysis of 1,300+ insurance records with an interactive Tableau dashboard using BMI, age, and region filters to isolate the top cost drivers behind premiums.',
    array['Tableau'],
    'Smokers incur up to 5x higher medical charges than non-smokers across all age groups',
    'https://github.com/jordonchau/Data-Portfolio',
    true, 2
),
(
    'student-performance-factors',
    'Student Performance Factors',
    'Analysis of 6,600+ student records in Python, plus a Power BI dashboard with KPI cards and filters comparing performance by attendance, study hours, and gender.',
    array['Python', 'Power BI'],
    'Students with 75%+ attendance scored ~12 pts higher, with motivation as the next-strongest predictor',
    'https://github.com/jordonchau/Data-Portfolio',
    true, 3
)
on conflict (slug) do nothing;