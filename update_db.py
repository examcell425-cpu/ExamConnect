import os
import psycopg2

try:
    # Use the connection string provided by the user
    conn_str = "postgresql://postgres:MNSKCE#9114@db.nfghulkdgidxxctkeyll.supabase.co:5432/postgres"
    
    # Try to connect
    conn = psycopg2.connect(conn_str)
    cur = conn.cursor()
    
    print("Connected to database successfully!")
    cur.execute("ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS gender text DEFAULT 'male';")
    cur.execute("NOTIFY pgrst, 'reload schema';")
    
    conn.commit()
    cur.close()
    conn.close()
    print("Database updated successfully!")
except Exception as e:
    print(f"Error: {e}")
