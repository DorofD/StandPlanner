from app.repository.queries.base_query import execute_parametrized_query


class DBSourcesConfluenceTag():
    def __init__(self):
        self.table_name = 'sources_confluence_tag'

    def add_source(self, value, description='', created_by=''):
        """Возвращает int lastrowid"""
        query = f"""
            INSERT INTO {self.table_name} (value, description, status, child_sources, updated_at, created_by)
            VALUES (%s, %s, %s, %s, %s, %s)
            RETURNING id;
        """
        params = [value, description, 'new', '', 'never', created_by]
        result = execute_parametrized_query(query, params)
        if result:
            return result[0]['id']
        else:
            return None

    def update_source_field(self, id: int, field_name: str, value: str):
        allowed_fields = {'value', 'description', 'status',
                          'child_sources', 'updated_at', 'created_by'}
        if field_name not in allowed_fields:
            raise ValueError(
                f"Field '{field_name}' is not allowed to be updated")
        query = f"""
            UPDATE {self.table_name} SET {field_name} = %s
            WHERE id = %s;
        """
        return execute_parametrized_query(query, [value, id])

    def add_text_to_source_description(self, id, adding_text):
        query = f"""
            UPDATE {self.table_name}
            SET description = COALESCE(description,'') || %s
            WHERE id = %s;
        """
        return execute_parametrized_query(query, [adding_text, id])

    def get_all_sources(self):
        query = f"SELECT * FROM {self.table_name};"
        return execute_parametrized_query(query)

    def get_source(self, id):
        query = f"""
            SELECT * FROM {self.table_name}
            WHERE id = %s;
        """
        result = execute_parametrized_query(query, [id])
        if result:
            return result[0]
        else:
            return False

    def delete_source(self, id: int):
        query = f"""
            DELETE FROM {self.table_name}
            WHERE id = %s;
        """
        return execute_parametrized_query(query, [id])
