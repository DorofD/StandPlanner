from backend.db.queries.base_query import execute_db_query


def get_user(login: str):
    query = f"""
            SELECT * FROM users
            WHERE login = '{login}'
            """
    return execute_db_query(query)


# print(get_user('edorofeev'))
