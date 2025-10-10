from app.repository.queries.base_query import execute_parametrized_query


class DBRocketBotSettings():
    def __init__(self):
        self.table_name = 'rocket_bot_settings'
        self.allowed_fields = {'target_rooms',
                               'target_strings', 'reply_on_messages', 'profile_name', 'active', 'updated_at'}

    def get_all_profiles(self):
        query = f"SELECT * FROM {self.table_name}"
        return execute_parametrized_query(query)

    def get_active_profile(self):
        query = f"""
            SELECT * FROM {self.table_name}
            WHERE active = TRUE
        """
        return execute_parametrized_query(query)

    def add_profile(self, target_rooms, target_strings, reply_on_messages, profile_name):
        query = f"""
            INSERT INTO {self.table_name} (target_rooms, target_strings, reply_on_messages, profile_name, active, updated_at)
            VALUES (%s, %s, %s, %s, %s, %s)
        """
        params = (target_rooms, target_strings,
                  reply_on_messages, profile_name, False, 'never')
        return execute_parametrized_query(query, params)

    def update_field(self, id: int, field: str, value: str):
        if field not in self.allowed_fields:
            raise ValueError(f"Field '{field}' is not allowed to be updated.")
        query = f"UPDATE {self.table_name} SET {field} = %s WHERE id = %s"
        params = (value, id)
        return execute_parametrized_query(query, params)

    def delete_profile(self, id: int):
        query = f"DELETE FROM {self.table_name} WHERE id = %s"
        params = (id,)
        return execute_parametrized_query(query, params)
