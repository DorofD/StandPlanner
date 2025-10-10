import psycopg2.extras
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


def execute_db_query(query, value_array=0, last_row_id=False):
    conn = psycopg2.connect(**DB_CONFIG)
    cursor = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    result = None

    try:
        if not value_array:
            cursor.execute(query)
            result = cursor.fetchall()
            # fetchall возвращает список словарей
            if not result and last_row_id:
                # если last_row_id нужен, но нет результатов
                result = {'last_row_id': cursor.lastrowid if hasattr(
                    cursor, "lastrowid") else None}
        else:
            cursor.executemany(query, value_array)
            result = True

        conn.commit()
    finally:
        cursor.close()
        conn.close()
    return result


def execute_parametrized_query(query, params=None, last_row_id=False, many=False):
    conn = psycopg2.connect(**DB_CONFIG)
    cursor = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    result = None

    try:
        if many:
            cursor.executemany(query, params)
            result = True
        else:
            cursor.execute(query, params)
            try:
                fetched = cursor.fetchall()
                result = fetched
            except psycopg2.ProgrammingError:
                result = None

            if last_row_id:
                try:
                    cursor.execute('SELECT LASTVAL();')
                    lastrowid = cursor.fetchone()
                    if lastrowid:
                        result = {'last_row_id': lastrowid[0]}
                    else:
                        result = {'last_row_id': None}
                except Exception:
                    result = {'last_row_id': None}

        conn.commit()
    finally:
        cursor.close()
        conn.close()
    return result
