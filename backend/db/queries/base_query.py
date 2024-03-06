import sqlite3


def execute_db_query(query, value_array=0):
    conn = sqlite3.connect('database.db')
    conn.row_factory = sqlite3.Row
    cursor = conn.cursor()
    if not value_array:
        cursor.execute(query)
        result = cursor.fetchone()
        if result:
            result = dict(result)
    else:
        cursor.executemany(query, value_array)
        result = True
    conn.commit()
    conn.close()
    return result
