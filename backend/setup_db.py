import asyncio  
from app.services.supabase import get_supabase_admin  
async def setup():  
    sb = get_supabase_admin()  
    with open('supabase_schema.sql', 'r') as f:  
        sql = f.read()  
    sb.rpc('exec_sql', {'sql_string': sql}).execute()  
asyncio.run(setup())  
