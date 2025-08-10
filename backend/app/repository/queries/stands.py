from app.repository.queries.base_query import execute_db_query, execute_parametrized_query


class DBStands():
    def __init__(self):
        self.table_name = 'stands'

    def get_stands_list(self):
        query = f"""
                SELECT id, name, source_type, status, last_update FROM {self.table_name};
                """
        return execute_db_query(query)

    def get_stands_list_by_source_type(self, source_type):
        query = f"""
                SELECT id, name, source_type, status, last_update FROM {self.table_name}
                WHERE source_type = '{source_type}';
                """
        return execute_db_query(query)

    def get_stand(self, id: int):
        query = f"""
                SELECT * FROM {self.table_name}
                WHERE id = '{id}';
                """
        result = execute_db_query(query)
        if result:
            return result[0]
        else:
            return False

    def get_stand_id_by_name(self, name):
        """Возвращает int"""
        query = f"""
                SELECT id FROM {self.table_name}
                WHERE name = '{name}';
                """
        note = execute_db_query(query)
        if note:
            return note[0]['id']
        else:
            return False

    def add_stand(self, name: str, source_type: str, status: str = 'unknown', description: str = '', html_layout: str = '', last_update: str = 'never'):
        """Возвращает int lastrowid"""
        query = f"""
            INSERT INTO stands (name, source_type, status, description, html_layout, last_update)
            VALUES (?, ?, ?, ?, ?, ?);
        """
        params = [name, source_type, status,
                  description, html_layout, last_update]
        return execute_parametrized_query(query, params)

    def update_stand_field(self, id: int, field: str, value: str):
        """Можно менять значения полей name, description, html_layout"""
        query = f"""
                UPDATE {self.table_name} SET {field} = '{value}'
                WHERE id = '{id}';
                """
        return execute_db_query(query)

    def update_stand_html(self, id, html_layout):
        query = f"""
            UPDATE stands SET html_layout = ? WHERE id = ?;
        """
        params = [html_layout, id]
        return execute_parametrized_query(query, params)

    def add_text_to_stand_description(self, id, adding_text):
        """Можно менять значения полей name, description, html_layout"""
        query = f"""
                    UPDATE {self.table_name}
                    SET description = description || '{adding_text}'
                    WHERE id = '{id}';
                    """
        return execute_db_query(query)

    def delete_stand(self, id: int):
        query = f"""
                DELETE FROM {self.table_name}
                WHERE id = '{id}';
                """
        return execute_db_query(query)
