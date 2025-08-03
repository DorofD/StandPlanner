from app.repository.queries.base_query import execute_db_query


def get_stands_list_db():
    query = f"""
            SELECT id, name, creation_method FROM stands
            """
    return execute_db_query(query)


def get_stand_db(id: int):
    query = f"""
            SELECT * FROM stands
            WHERE id = '{id}'
            """
    return execute_db_query(query)


def add_stand_db(name: str, creation_method: str, description: str = '', html_layout: str = ''):
    print(name, creation_method, description, html_layout)
    query = f"""
            INSERT INTO stands ('name', 'creation_method', 'description', 'html_layout') VALUES('{name}', '{creation_method}', '{description}', '{html_layout}');
            """
    return execute_db_query(query)


def change_stand_db(id: int, field: str, value: str):
    """Можно менять значения полей name, description, html_layout"""
    query = f"""
            UPDATE stands SET {field} = '{value}' 
            WHERE id = '{id}'
            """
    return execute_db_query(query)


def delete_stand_db(id: int):
    query = f"""
            DELETE FROM stands
            WHERE id = '{id}'
            """
    return execute_db_query(query)
