# Checkpoint 2: CLI Supabase Refactor

## Status: COMPLETE

## Tasks Completed
- [x] Added supabase and python-dotenv dependencies to pyproject.toml
- [x] Created pm/core/supabase_client.py with SupabaseClient class
- [x] Added PM_TESTING environment variable for test isolation
- [x] Modified pm/core/vault.py to support dual storage (Supabase + file fallback)
- [x] Updated load_domain(), save_domain(), load_all_domains() for Supabase
- [x] Updated save_daily_log(), get_stats() for Supabase
- [x] Fixed get_branch_distance() to handle int/str branch_id types
- [x] Granted permissions on polymath schema (anon, authenticated roles)
- [x] Configured ~/.polymath/config.yaml with correct vault path
- [x] Added disable_supabase fixture to test_cli_integration.py

## Validation Results
- 51 tests: PASS
- pm-status: PASS (shows data from Supabase)
- pm-next: PASS (recommends hub domain)
- pm-pair: PASS (generates bisociation pairing)
- pm-gaps: PASS (shows untouched branches/hubs)
- pm-connections: PASS (shows domain connections)

## CLI Commands Verified
```bash
pm-status     # Shows: 1/180 domains touched, 1 book, 1 log
pm-next       # Recommends: Evolutionary Biology (FND slot)
pm-pair       # Generates: Expert domain + max-distance pairing
pm-gaps       # Lists: 14 untouched branches, 7 incomplete hubs
pm-connections 01.02  # Shows connections for Thermodynamics
```

## Issues Encountered
1. PGRST205 "table not found in schema cache"
   - Resolution: Ran `NOTIFY pgrst, 'reload schema'`

2. 42501 "permission denied for schema polymath"
   - Resolution: Granted USAGE/SELECT/INSERT/UPDATE/DELETE to anon/authenticated

3. AttributeError in get_branch_distance (int vs str)
   - Resolution: Changed to `str(branch_id).zfill(2)` to handle both types

4. Tests failed due to Supabase loading in test environment
   - Resolution: Added PM_TESTING env var that bypasses Supabase initialization

## Resume Point
Module 2 complete. Proceed to Module 3: Next.js Frontend Foundation.

## Artifacts Created/Modified
- pm/core/supabase_client.py (new)
- pm/core/vault.py (modified)
- pm/data/distances.py (modified)
- tests/test_cli_integration.py (modified)
- pyproject.toml (modified)
- .env (Supabase credentials)
- ~/.polymath/config.yaml (vault path)

## Supabase Permissions Applied
```sql
GRANT USAGE ON SCHEMA polymath TO anon, authenticated;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA polymath TO anon, authenticated;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA polymath TO anon, authenticated;
```
