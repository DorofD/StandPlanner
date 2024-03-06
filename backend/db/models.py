import sqlite3


def create_db():
    query = """
            CREATE TABLE "users" (
                "id"	INTEGER NOT NULL UNIQUE,
                "login"	TEXT NOT NULL UNIQUE,
                "auth_type"	TEXT NOT NULL,
                "role"	TEXT NOT NULL,
                "password"	TEXT,
                PRIMARY KEY("id" AUTOINCREMENT)
            );
            """
    conn = sqlite3.connect('database.db')
    cursor = conn.cursor()
    cursor.execute(query)
    conn.commit()
    conn.close()


# create_db()
