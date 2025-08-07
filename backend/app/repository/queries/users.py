from app.repository.queries.base_query import execute_db_query


class DBUsers():
    def __init__(self):
        self.table_name = 'users'

    def get_users(self):
        query = f"""
                SELECT * FROM {self.table_name}
                """
        return execute_db_query(query)

    def get_user(self, login: str):
        query = f"""
                SELECT * FROM {self.table_name}
                WHERE login = '{login}'
                """
        return execute_db_query(query)

    def add_user(self, login: str, auth_type: str, role: str,  password: str = ''):
        query = f"""
                INSERT INTO {self.table_name} ('login', 'auth_type', 'role', 'password') VALUES('{login}', '{auth_type}', '{role}', '{password}');
                """
        return execute_db_query(query)

    def update_user_field(self, id: int, field: str, value: str):
        query = f"""
                UPDATE users SET {field} = '{value}' 
                WHERE id = '{id}'
                """
        return execute_db_query(query)

    def delete_user(self, id: int):
        query = f"""
                DELETE FROM {self.table_name}
                WHERE id = '{id}'
                """
        return execute_db_query(query)
