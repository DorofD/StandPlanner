from backend.repository.queries.base_query import execute_db_query


def get_users():
    query = f"""
            SELECT * FROM users
            """
    return execute_db_query(query)


def get_user(login: str):
    query = f"""
            SELECT * FROM users
            WHERE login = '{login}'
            """
    return execute_db_query(query)


def add_user(login, auth_type, role, password):
    query = f"""
            INSERT INTO users ('login', 'auth_type', 'role', 'password') VALUES('{login}', '{auth_type}', '{role}', '{password}');
            """
    return execute_db_query(query)


# print(get_user('edorofeev'))
print(get_users())
# print(add_user('user', 'local', 'user', 'user'))
