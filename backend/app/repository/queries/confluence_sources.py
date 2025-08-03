from app.repository.queries.base_query import execute_db_query


def add_source_db(src_type, value, description):
    query = f"""
            INSERT INTO confluence_sources ('type', 'value', 'description') VALUES('{src_type}', '{value}', '{description}');
            """
    return execute_db_query(query)


def set_source_stand_id_db(id, stand_id):
    query = f"""
            UPDATE confluence_sources SET stand_id = '{stand_id}' 
            WHERE id = '{id}'
            """
    return execute_db_query(query)


def get_all_sources_db():
    query = f"""
            SELECT * FROM confluence_sources
            """
    return execute_db_query(query)


def delete_source_db(id: int):
    query = f"""
            DELETE FROM confluence_sources
            WHERE id = '{id}'
            """
    return execute_db_query(query)
