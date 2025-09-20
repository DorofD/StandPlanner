# import sqlite3


# # по умолчанию возвращает список словарей в формате [{'field_1':'значение', 'field_2':'значение'}, ...]
# # если last_row_id=False, возвращает словарь в формате {'last_row_id': id}
# def execute_db_query(query, value_array=0, last_row_id=False):
#     conn = sqlite3.connect('./data/database.db')
#     conn.row_factory = sqlite3.Row
#     cursor = conn.cursor()
#     if not value_array:
#         cursor.execute(query)
#         result = cursor.fetchall()
#         if result and type(result) == list:
#             result = [dict(i) for i in result]
#         elif result and last_row_id:
#             result = dict(result)
#         elif result:
#             result = dict(result)
#         elif not result and last_row_id:
#             result = {'last_row_id': cursor.lastrowid}
#     else:
#         cursor.executemany(query, value_array)
#         result = True
#     conn.commit()
#     conn.close()
#     return result


# def execute_parametrized_query(query, params):
#     """Принимает параметризованный запрос и параметры, возвращает lastrowid"""
#     with sqlite3.connect('./data/database.db') as conn:
#         cur = conn.cursor()
#         cur.execute(query, params)
#         conn.commit()
#         return cur.lastrowid


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


# def execute_parametrized_query(query, params):
#     """Принимает параметризованный запрос и параметры, возвращает lastrowid"""
#     with psycopg2.connect(**DB_CONFIG) as conn:
#         with conn.cursor() as cur:
#             cur.execute(query, params)
#             conn.commit()
#             # В PostgreSQL id можно получить так:
#             try:
#                 cur.execute('SELECT LASTVAL();')
#                 lastrowid = cur.fetchone()[0]
#             except Exception:
#                 lastrowid = None
#             return lastrowid


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
