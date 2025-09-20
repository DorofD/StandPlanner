from app.repository.queries.base_query import execute_db_query, execute_parametrized_query


# class DBUsers():
#     def __init__(self):
#         self.table_name = 'users'

#     def get_users(self):
#         query = f"""
#                 SELECT * FROM {self.table_name}
#                 """
#         return execute_db_query(query)

#     def get_user(self, login: str):
#         query = f"""
#                 SELECT * FROM {self.table_name}
#                 WHERE login = '{login}'
#                 """
#         return execute_db_query(query)

#     def add_user(self, login: str, auth_type: str, role: str,  password: str = ''):
#         query = f"""
#                 INSERT INTO {self.table_name} ('login', 'auth_type', 'role', 'password') VALUES('{login}', '{auth_type}', '{role}', '{password}');
#                 """
#         return execute_db_query(query)

#     def update_user_field(self, id: int, field: str, value: str):
#         query = f"""
#                 UPDATE users SET {field} = '{value}'
#                 WHERE id = '{id}'
#                 """
#         return execute_db_query(query)

#     def delete_user(self, id: int):
#         query = f"""
#                 DELETE FROM {self.table_name}
#                 WHERE id = '{id}'
#                 """
#         return execute_db_query(query)


class DBUsers():
    def __init__(self):
        self.table_name = 'users'
        self.allowed_fields = {'login', 'auth_type', 'role', 'password'}

    def get_users(self):
        query = f"SELECT * FROM {self.table_name}"
        return execute_parametrized_query(query)

    def get_user(self, login: str):
        query = f"SELECT * FROM {self.table_name} WHERE login = %s"
        params = (login,)
        return execute_parametrized_query(query, params)

    def add_user(self, login: str, auth_type: str, role: str, password: str = ''):
        query = f"""
            INSERT INTO {self.table_name} (login, auth_type, role, password)
            VALUES (%s, %s, %s, %s)
        """
        params = (login, auth_type, role, password)
        return execute_parametrized_query(query, params)

    def update_user_field(self, id: int, field: str, value: str):
        if field not in self.allowed_fields:
            raise ValueError(f"Field '{field}' is not allowed to be updated.")
        query = f"UPDATE {self.table_name} SET {field} = %s WHERE id = %s"
        params = (value, id)
        return execute_parametrized_query(query, params)

    def delete_user(self, id: int):
        query = f"DELETE FROM {self.table_name} WHERE id = %s"
        params = (id,)
        return execute_parametrized_query(query, params)
