from app.repository.queries.base_query import execute_db_query


class DBStands():
    def __init__(self):
        self.table_name = 'stands'

    def get_stands_list(self):
        query = f"""
                SELECT id, name, source_type FROM {self.table_name}
                """
        return execute_db_query(query)

    def get_stand(self, id: int):
        query = f"""
                SELECT * FROM {self.table_name}
                WHERE id = '{id}'
                """
        return execute_db_query(query)

    def get_stand_id_by_name(self, name):
        """Возвращает int"""
        query = f"""
                SELECT id FROM {self.table_name}
                WHERE name = '{name}'
                """
        note = execute_db_query(query)
        if note:
            return note[0]['id']
        else:
            return False

    def add_stand(self, name: str, source_type: str, description: str = '', html_layout: str = ''):
        query = f"""
                INSERT INTO {self.table_name} ('name', 'source_type', 'description', 'html_layout') VALUES('{name}', '{source_type}', '{description}', '{html_layout}');
                """
        return execute_db_query(query)

    def update_stand_value(self, id: int, field: str, value: str):
        """Можно менять значения полей name, description, html_layout"""
        query = f"""
                UPDATE {self.table_name} SET {field} = '{value}' 
                WHERE id = '{id}'
                """
        return execute_db_query(query)

    def delete_stand(self, id: int):
        query = f"""
                DELETE FROM {self.table_name}
                WHERE id = '{id}'
                """
        return execute_db_query(query)
