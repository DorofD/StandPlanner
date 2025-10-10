from app.repository.queries.base_query import execute_db_query, execute_parametrized_query


class DBSourcesConfluencePageId():
    def __init__(self):
        self.table_name = 'sources_confluence_page_id'

    def add_source(self, value, description=None, link=None, created_by=None):
        """Возвращает int lastrowid"""
        query = f"""
            INSERT INTO {self.table_name} 
                (value, version, description, status, link, stand_id, updated_at, created_by)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s)
            RETURNING id;
        """
        params = [value, None, description, 'new',
                  link, None, 'never', created_by]
        result = execute_parametrized_query(query, params)
        if result:
            return result[0]['id']
        else:
            return None

    def update_source_field(self, id: int, field_name: str, value: str):
        # Защита от SQL-инъекции: разрешить только определённые поля
        allowed_fields = {'value', 'version', 'description',
                          'status', 'link', 'stand_id', 'updated_at', 'created_by'}
        if field_name not in allowed_fields:
            raise ValueError("Invalid field name")
        query = f"""
            UPDATE {self.table_name}
            SET {field_name} = %s
            WHERE id = %s;
        """
        params = [value, id]
        return execute_parametrized_query(query, params)

    def add_text_to_source_description(self, id, adding_text):
        query = f"""
            UPDATE {self.table_name}
            SET description = description || %s
            WHERE id = %s;
        """
        params = [adding_text, id]
        return execute_parametrized_query(query, params)

    def set_source_stand_id(self, id, stand_id):
        query = f"""
            UPDATE {self.table_name}
            SET stand_id = %s
            WHERE id = %s;
        """
        params = [stand_id, id]
        return execute_parametrized_query(query, params)

    def get_all_sources(self):
        query = f"""
            SELECT {self.table_name}.*, COALESCE(stands.name, '') AS stand_name
            FROM {self.table_name}
            LEFT JOIN stands ON {self.table_name}.stand_id = stands.id;
        """
        return execute_db_query(query)

    def get_all_sources_short_info(self):
        """Вернет список словарей формата {id: int, value: str, status: str}"""
        query = f"""
            SELECT id, value, status
            FROM {self.table_name};
        """
        return execute_db_query(query)

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

    def get_source_by_value(self, value):
        query = f"""
            SELECT id, value, created_by FROM {self.table_name}
            WHERE value = %s;
        """
        result = execute_parametrized_query(query, [value])
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
