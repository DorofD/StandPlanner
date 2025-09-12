from app.repository.queries.base_query import execute_db_query, execute_parametrized_query


class DBSourcesConfluencePageId():
    def __init__(self):
        self.table_name = 'sources_confluence_page_id'

    def add_source(self, value, description='', link='', created_by=''):
        """Возвращает int lastrowid"""
        query = f"""
                INSERT INTO sources_confluence_page_id ('value', 'version', 'description', 'status', 'link', 'stand_id', 'updated_at', 'created_by')
                VALUES(?, ?, ?, ?, ?, ?, ?, ?);
                """
        params = [value, '', description, 'new', link, '', 'never', created_by]
        return execute_parametrized_query(query, params)

    def update_source_field(self, id: int, field_name: str, value: str):
        query = f"""
                UPDATE {self.table_name} SET {field_name} = '{value}' 
                WHERE id = {id};
                """
        return execute_db_query(query)

    def add_text_to_source_description(self, id, adding_text):
        query = f"""
                UPDATE {self.table_name}
                SET description = description || '{adding_text}' 
                WHERE id = {id};
                """
        return execute_db_query(query)

    def set_source_stand_id(self, id, stand_id):
        query = f"""
                UPDATE {self.table_name} SET stand_id = '{stand_id}' 
                WHERE id = {id};
                """
        return execute_db_query(query)

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
                SELECT {self.table_name}.id, {self.table_name}.value, {self.table_name}.status
                FROM {self.table_name};
                """
        return execute_db_query(query)

    def get_source(self, id):
        query = f"""
                SELECT * FROM {self.table_name}
                WHERE id = {id};
                """
        result = execute_db_query(query)
        if result:
            return result[0]
        else:
            return False

    def get_source_by_value(self, value):
        query = f"""
                SELECT id, value, created_by FROM {self.table_name}
                WHERE value = {value};
                """
        result = execute_db_query(query)
        if result:
            return result[0]
        else:
            return False

    def delete_source(self, id: int):
        query = f"""
                DELETE FROM {self.table_name}
                WHERE id = {id};
                """
        return execute_db_query(query)
