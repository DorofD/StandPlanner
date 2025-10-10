import psycopg2
import os
from dotenv import load_dotenv


load_dotenv('.env')
DB_CONFIG = {
    'host': os.environ['POSTGRES_HOST'],
    'port': os.environ['POSTGRES_PORT'],
    'database': os.environ['POSTGRES_DB'],
    'user': os.environ['POSTGRES_USER'],
    'password': os.environ['POSTGRES_PASSWORD']
}


def create_db():
    conn = psycopg2.connect(**DB_CONFIG)
    conn.autocommit = True
    cursor = conn.cursor()

    query = """
        CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            login TEXT NOT NULL UNIQUE,
            auth_type TEXT NOT NULL,
            role TEXT NOT NULL,
            password TEXT
        );
    """
    cursor.execute(query)

    query = """
        CREATE TABLE IF NOT EXISTS stands (
            id SERIAL PRIMARY KEY,
            uuid UUID UNIQUE NOT NULL DEFAULT gen_random_uuid(),
            name TEXT NOT NULL UNIQUE,
            source_type TEXT NOT NULL CHECK(source_type IN ('manual', 'confluence_page_id')),
            description TEXT,
            page_layout TEXT,
            source_status TEXT,
            source_link TEXT,
            updated_at TEXT,
            created_by TEXT
        );
    """
    cursor.execute(query)

    query = """
        CREATE TABLE IF NOT EXISTS sources_confluence_page_id (
            id SERIAL PRIMARY KEY,
            value TEXT NOT NULL UNIQUE,
            version TEXT,
            description TEXT,
            status TEXT,
            link TEXT,
            stand_id INTEGER,
            updated_at TEXT,
            created_by TEXT,
            FOREIGN KEY(stand_id) REFERENCES stands(id)
        );
    """
    cursor.execute(query)

    query = """
        CREATE TABLE IF NOT EXISTS sources_confluence_tag (
            id SERIAL PRIMARY KEY,
            value TEXT NOT NULL UNIQUE,
            description TEXT,
            status TEXT,
            child_sources TEXT,
            updated_at TEXT,
            created_by TEXT
        );
    """
    cursor.execute(query)

    query = """
        CREATE TABLE IF NOT EXISTS rocket_rooms (
            id SERIAL PRIMARY KEY,
            rocket_id TEXT UNIQUE,
            rocket_link TEXT UNIQUE,
            room_type TEXT,
            name TEXT UNIQUE,
            fname TEXT UNIQUE,
            stand_uuid TEXT,
            description TEXT,
            status TEXT,
            updated_at TEXT,
            FOREIGN KEY(stand_uuid) REFERENCES stands(uuid)
        );
    """
    cursor.execute(query)

    # """
    # "target_rooms": [{'rid':str, 'name': str, 'stand_uuid'}, ...],
    # "target_strings": {
    #     "busy": [str, str, ...],
    #     "free": [str, str, ...],
    #     "maintenance": [str, str, ...],
    #     "lining_up": [str, str, ...]
    # },
    # "reply_on_messages": bool
    # """

    query = """
        CREATE TABLE IF NOT EXISTS rocket_bot_settings (
            id SERIAL PRIMARY KEY,
            target_rooms JSONB,
            target_strings JSONB,
            reply_on_messages BOOLEAN,
            profile_name TEXT, 
            active BOOLEAN,
            updated_at TEXT
        );
    """
    cursor.execute(query)

    cursor.close()
    conn.close()
