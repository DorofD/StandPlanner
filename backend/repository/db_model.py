import sqlite3


def create_db():
    conn = sqlite3.connect('database.db')
    query = """
            CREATE TABLE IF NOT EXISTS "users" (
                "id"	INTEGER NOT NULL UNIQUE,
                "login"	TEXT NOT NULL UNIQUE,
                "auth_type"	TEXT NOT NULL,
                "role"	TEXT NOT NULL,
                "password"	TEXT,
                PRIMARY KEY("id" AUTOINCREMENT)
            );
            """
    cursor = conn.cursor()
    cursor.execute(query)

    query = """
            CREATE TABLE IF NOT EXISTS "stands" (
                "id"	INTEGER NOT NULL UNIQUE,
                "name"	TEXT NOT NULL UNIQUE,
                "description"	TEXT,
                PRIMARY KEY("id" AUTOINCREMENT)
            );

            """
    cursor = conn.cursor()
    cursor.execute(query)
    conn.commit()
    conn.close()


create_db()
