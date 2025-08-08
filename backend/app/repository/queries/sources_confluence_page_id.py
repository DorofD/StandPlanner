from app.repository.queries.base_query import execute_db_query


class DBSourcesConfluencePageId():
    def __init__(self):
        self.table_name = 'sources_confluence_page_id'

    def add_source(self, value, description=''):
        query = f"""
                INSERT INTO {self.table_name} ('value', 'version', 'description', 'status', 'stand_id', 'last_update') VALUES('{value}', '', '{description}', 'new', '', 'never');
                """
        return execute_db_query(query)

    def update_source_field(self, id: int, field_name: str, value: str):
        query = f"""
                UPDATE {self.table_name} SET {field_name} = '{value}' 
                WHERE id = '{id}'
                """
        return execute_db_query(query)

    def set_source_stand_id(self, id, stand_id):
        query = f"""
                UPDATE {self.table_name} SET stand_id = '{stand_id}' 
                WHERE id = '{id}'
                """
        return execute_db_query(query)

    def get_all_sources(self):
        query = f"""
                SELECT * FROM {self.table_name}
                """
        return execute_db_query(query)

    def get_source(self, id):
        query = f"""
                SELECT * FROM {self.table_name}
                WHERE id = '{id}'
                """
        return execute_db_query(query)

    def delete_source(self, id: int):
        query = f"""
                DELETE FROM {self.table_name}
                WHERE id = '{id}'
                """
        return execute_db_query(query)
